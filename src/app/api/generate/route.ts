import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { examCriteria, questionDistribution, getSubjectById } from '@/lib/exam-criteria';
import { generateMultipleQuestionsPrompt, systemPrompt } from '@/lib/prompt-templates';
import { Question, GenerateQuestionsRequest } from '@/types/exam';
import {
  allQuestionBank,
  getQuestionsBySubject,
  getRandomQuestions
} from '@/lib/question-bank';

// OpenAI 클라이언트를 함수 내부에서 초기화 (빌드 시 에러 방지)
function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY 환경 변수가 설정되지 않았습니다.');
  }
  return new OpenAI({ apiKey });
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateQuestionsRequest = await request.json();
    const { mode, count, subjectId, topicName, useBank = true, usAI = true } = body as GenerateQuestionsRequest & { useBank?: boolean; usAI?: boolean };

    let allQuestions: Question[] = [];

    if (mode === 'mock') {
      // 모의고사 모드: 문제은행 우선 + AI 보충
      allQuestions = await generateHybridMockExam(useBank, usAI);
    } else if (mode === 'practice' && subjectId) {
      // 영역별 연습 모드: 문제은행 우선 + AI 보충
      const subject = getSubjectById(subjectId);
      if (!subject) {
        return NextResponse.json({ error: '유효하지 않은 과목입니다.' }, { status: 400 });
      }

      const topic = topicName
        ? subject.topics.find(t => t.name === topicName)
        : undefined;

      allQuestions = await generateHybridPractice(subject, count, topic, useBank, usAI);
    } else {
      return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
    }

    // 문제에 ID 부여
    allQuestions = allQuestions.map((q, idx) => ({ ...q, id: idx + 1 }));

    return NextResponse.json({ questions: allQuestions });
  } catch (error) {
    console.error('문제 생성 오류:', error);
    return NextResponse.json(
      { error: '문제 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 하이브리드 모의고사 (문제은행 + AI)
async function generateHybridMockExam(useBank: boolean, useAI: boolean): Promise<Question[]> {
  let questions: Question[] = [];

  // 1단계: 문제은행에서 가져오기
  if (useBank && allQuestionBank.length > 0) {
    const bankQuestions = getRandomQuestions(60);
    questions.push(...bankQuestions);
    console.log(`문제은행에서 ${bankQuestions.length}개 문제 로드`);
  }

  // 2단계: 부족한 문제는 AI로 생성
  const needed = 60 - questions.length;
  if (needed > 0 && useAI) {
    console.log(`AI로 ${needed}개 문제 추가 생성 필요`);
    const aiQuestions = await generateMockExamQuestions(needed);
    questions.push(...aiQuestions);
  }

  // 문제 섞기
  return shuffleArray(questions).slice(0, 60);
}

// 하이브리드 영역별 연습 (문제은행 + AI)
async function generateHybridPractice(
  subject: typeof examCriteria.subjects[0],
  count: number,
  topic: typeof examCriteria.subjects[0]['topics'][0] | undefined,
  useBank: boolean,
  useAI: boolean
): Promise<Question[]> {
  let questions: Question[] = [];

  // 1단계: 문제은행에서 해당 과목 문제 가져오기
  if (useBank) {
    const subjectQuestions = getQuestionsBySubject(subject.name);
    let filtered = subjectQuestions;

    // 토픽으로 필터링
    if (topic) {
      filtered = subjectQuestions.filter(q => q.category.topic === topic.name);
    }

    const shuffled = shuffleArray(filtered);
    const bankQuestions = shuffled.slice(0, count);
    questions.push(...bankQuestions);
    console.log(`${subject.name} 문제은행에서 ${bankQuestions.length}개 문제 로드`);
  }

  // 2단계: 부족한 문제는 AI로 생성
  const needed = count - questions.length;
  if (needed > 0 && useAI) {
    console.log(`${subject.name} AI로 ${needed}개 문제 추가 생성`);
    const aiQuestions = await generateQuestionsForSubject(subject, needed, topic);
    questions.push(...aiQuestions);
  }

  return shuffleArray(questions).slice(0, count);
}

// 모의고사용 AI 문제 생성
async function generateMockExamQuestions(targetCount: number = 60): Promise<Question[]> {
  const generatedQuestions: Question[] = [];

  // 비율에 맞게 과목별 문제 수 계산
  const totalDistribution = Object.values(questionDistribution).reduce((a, b) => a + b, 0);

  // 과목별로 문제 생성 (병렬 처리)
  const promises = examCriteria.subjects.map(async (subject) => {
    const baseCount = questionDistribution[subject.id] || 5;
    const scaledCount = Math.ceil((baseCount / totalDistribution) * targetCount);
    return generateQuestionsForSubject(subject, scaledCount);
  });

  const results = await Promise.all(promises);
  results.forEach(questions => generatedQuestions.push(...questions));

  // 문제 순서 섞기
  return shuffleArray(generatedQuestions);
}

// 특정 과목에서 문제 생성
async function generateQuestionsForSubject(
  subject: typeof examCriteria.subjects[0],
  count: number,
  topic?: typeof examCriteria.subjects[0]['topics'][0]
): Promise<Question[]> {
  const prompt = generateMultipleQuestionsPrompt(subject, count, topic);
  const openai = getOpenAIClient();

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 4000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('AI 응답이 비어있습니다.');
    }

    const parsed = JSON.parse(content);

    // 응답 형식 검증
    if (parsed.questions && Array.isArray(parsed.questions)) {
      return parsed.questions.map((q: Question) => ({
        ...q,
        id: 0, // 나중에 부여
      }));
    }

    // 단일 문제가 반환된 경우
    if (parsed.question) {
      return [{ ...parsed, id: 0 }];
    }

    return [];
  } catch (error) {
    console.error(`${subject.name} 문제 생성 오류:`, error);
    // 에러 시 빈 배열 반환 (다른 과목은 계속 진행)
    return [];
  }
}

// 배열 섞기 함수
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
