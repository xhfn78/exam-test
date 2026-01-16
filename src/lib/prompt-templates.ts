import { Subject, Topic } from '@/types/exam';

// 단일 문제 생성 프롬프트
export function generateSingleQuestionPrompt(
  subject: Subject,
  topic?: Topic,
  subtopic?: string
): string {
  const topicInfo = topic
    ? `[세부항목]: ${topic.name}\n`
    : '';
  const subtopicInfo = subtopic
    ? `[세세항목]: ${subtopic}\n`
    : '';

  return `당신은 대한민국 전기기능장 필기시험 출제 전문가입니다.
다음 조건에 맞는 객관식 문제 1개를 생성해주세요:

[과목]: ${subject.name}
${topicInfo}${subtopicInfo}
요구사항:
1. 4지선다 객관식 형태
2. 실제 전기기능장 필기시험 수준의 난이도
3. 계산 문제와 이론 문제를 적절히 혼합
4. 정답과 상세한 해설 포함
5. 문제는 명확하고 모호하지 않게 작성
6. 선택지는 그럴듯하지만 명확히 구분 가능하게

응답은 반드시 아래 JSON 형식으로만 작성하세요:
{
  "question": "문제 내용 (필요시 수식이나 회로 설명 포함)",
  "options": ["선택지1", "선택지2", "선택지3", "선택지4"],
  "answer": 0,
  "explanation": "정답인 이유와 관련 이론 설명",
  "category": {
    "subject": "${subject.name}",
    "topic": "${topic?.name || '일반'}",
    "subtopic": "${subtopic || '일반'}"
  }
}`;
}

// 여러 문제 일괄 생성 프롬프트
export function generateMultipleQuestionsPrompt(
  subject: Subject,
  count: number,
  topic?: Topic
): string {
  const topicInfo = topic
    ? `[세부항목]: ${topic.name}\n[출제 가능 세세항목]: ${topic.subtopics.join(', ')}\n`
    : `[출제 가능 세부항목]: ${subject.topics.map(t => t.name).join(', ')}\n`;

  return `당신은 대한민국 전기기능장 필기시험 출제 전문가입니다.
다음 조건에 맞는 객관식 문제 ${count}개를 생성해주세요:

[과목]: ${subject.name}
${topicInfo}
요구사항:
1. 4지선다 객관식 형태
2. 실제 전기기능장 필기시험 수준의 난이도
3. 각 문제는 서로 다른 주제를 다룰 것
4. 계산 문제와 이론 문제를 적절히 혼합 (약 3:7 비율)
5. 정답과 상세한 해설 포함
6. 문제는 명확하고 모호하지 않게 작성
7. 선택지는 그럴듯하지만 명확히 구분 가능하게
8. 정답이 특정 번호에 치우치지 않도록 골고루 분배

응답은 반드시 아래 JSON 배열 형식으로만 작성하세요:
{
  "questions": [
    {
      "question": "문제 내용",
      "options": ["선택지1", "선택지2", "선택지3", "선택지4"],
      "answer": 0,
      "explanation": "해설",
      "category": {
        "subject": "${subject.name}",
        "topic": "세부항목명",
        "subtopic": "세세항목명"
      }
    }
  ]
}`;
}

// 시스템 프롬프트
export const systemPrompt = `당신은 대한민국 국가기술자격 전기기능장 필기시험 출제 전문가입니다.

전기기능장 시험 특징:
- 총 60문제, 시험시간 1시간
- 과목: 전기이론, 전기기기, 전력전자, 전기설비설계및시공, 송·배전, 한국전기설비규정, 디지털공학, 공업경영
- 합격기준: 평균 60점 이상

출제 시 주의사항:
1. 실무 현장에서 필요한 지식을 묻는 문제 위주
2. 단순 암기보다 이해와 응용력을 평가
3. 계산 문제는 공학용 계산기로 풀 수 있는 수준
4. 최신 전기설비기술기준(KEC) 반영
5. 정확한 용어와 단위 사용

응답 형식:
- JSON 형식으로만 응답
- 한국어로 작성
- 수식은 텍스트로 표현 (예: "V = IR", "P = √3 × V × I × cosθ")`;
