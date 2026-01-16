// 세세항목 (가장 하위 레벨)
export interface SubTopic {
  name: string;
}

// 세부항목
export interface Topic {
  name: string;
  subtopics: string[];
}

// 주요항목 (과목)
export interface Subject {
  id: number;
  name: string;
  topics: Topic[];
}

// 문제 카테고리
export interface QuestionCategory {
  subject: string;
  topic: string;
  subtopic: string;
}

// 문제 출처
export type QuestionSource = 'bank' | 'ai' | 'crawled';

// 회로 부품 데이터
export interface ComponentData {
  type: 'R' | 'L' | 'C' | 'V' | 'I' | 'X';
  label?: string;
  value: number;
  unit: string;
}

// 구조화된 회로 데이터
export interface CircuitData {
  type: 'series-rl' | 'parallel-rl' | 'series-rc' | 'series-rlc' | 'transformer' | 'three-phase' | 'bridge' | 'voltage-divider' | 'current-source';
  components?: ComponentData[];
}

// 회로도/다이어그램 정보
export interface Diagram {
  type: 'circuit' | 'graph' | 'table' | 'formula';
  content?: string; // 텍스트 설명 (선택)
  description?: string; // 추가 설명
  data?: CircuitData; // 구조화된 회로 데이터 (SVG 렌더링용)
}

// 개별 문제
export interface Question {
  id: number;
  question: string;
  options: string[];
  answer: number; // 정답 인덱스 (0-3)
  explanation: string;
  category: QuestionCategory;
  // 확장 필드
  source?: QuestionSource; // 문제 출처
  year?: number; // 출제 연도
  diagram?: Diagram; // 회로도/다이어그램
  difficulty?: 'easy' | 'medium' | 'hard'; // 난이도
  tags?: string[]; // 태그 (계산문제, 이론문제 등)
}

// 사용자 답안
export interface UserAnswer {
  questionId: number;
  selectedOption: number | null;
  isCorrect?: boolean;
}

// 시험 결과
export interface ExamResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number; // 백분율
  timeTaken: number; // 초 단위
  date: string;
  answers: UserAnswer[];
  questions: Question[];
}

// 시험 모드
export type ExamMode = 'mock' | 'practice';

// 시험 상태
export type ExamStatus = 'idle' | 'loading' | 'in_progress' | 'submitted' | 'reviewing';

// API 요청 타입
export interface GenerateQuestionsRequest {
  mode: ExamMode;
  count: number;
  subjectId?: number; // 영역별 연습 시 특정 과목
  topicName?: string; // 세부 영역 선택 시
}

// API 응답 타입
export interface GenerateQuestionsResponse {
  questions: Question[];
  error?: string;
}
