import { create } from 'zustand';
import { Question, UserAnswer, ExamResult, ExamMode, ExamStatus } from '@/types/exam';

interface ExamState {
  // 시험 기본 정보
  mode: ExamMode | null;
  status: ExamStatus;
  questions: Question[];
  currentQuestionIndex: number;

  // 사용자 답안
  userAnswers: UserAnswer[];

  // 타이머
  timeRemaining: number; // 초 단위
  startTime: number | null;

  // 선택된 과목 (영역별 연습 시)
  selectedSubjectId: number | null;
  selectedTopicName: string | null;

  // 결과
  result: ExamResult | null;

  // Actions
  setMode: (mode: ExamMode) => void;
  setQuestions: (questions: Question[]) => void;
  setStatus: (status: ExamStatus) => void;
  setCurrentQuestionIndex: (index: number) => void;
  selectAnswer: (questionId: number, optionIndex: number) => void;
  setTimeRemaining: (time: number) => void;
  decrementTime: () => void;
  setSelectedSubject: (subjectId: number | null, topicName?: string | null) => void;
  startExam: () => void;
  submitExam: () => void;
  resetExam: () => void;
  goToNextQuestion: () => void;
  goToPrevQuestion: () => void;
}

export const useExamStore = create<ExamState>((set, get) => ({
  // 초기 상태
  mode: null,
  status: 'idle',
  questions: [],
  currentQuestionIndex: 0,
  userAnswers: [],
  timeRemaining: 60 * 60, // 60분
  startTime: null,
  selectedSubjectId: null,
  selectedTopicName: null,
  result: null,

  // 모드 설정
  setMode: (mode) => set({ mode }),

  // 문제 설정
  setQuestions: (questions) => {
    const userAnswers = questions.map((q) => ({
      questionId: q.id,
      selectedOption: null,
    }));
    set({ questions, userAnswers });
  },

  // 상태 설정
  setStatus: (status) => set({ status }),

  // 현재 문제 인덱스 설정
  setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),

  // 답안 선택
  selectAnswer: (questionId, optionIndex) => {
    set((state) => ({
      userAnswers: state.userAnswers.map((answer) =>
        answer.questionId === questionId
          ? { ...answer, selectedOption: optionIndex }
          : answer
      ),
    }));
  },

  // 남은 시간 설정
  setTimeRemaining: (time) => set({ timeRemaining: time }),

  // 시간 감소
  decrementTime: () => {
    const { timeRemaining, status } = get();
    if (status === 'in_progress' && timeRemaining > 0) {
      set({ timeRemaining: timeRemaining - 1 });
    }
  },

  // 과목 선택
  setSelectedSubject: (subjectId, topicName = null) =>
    set({ selectedSubjectId: subjectId, selectedTopicName: topicName }),

  // 시험 시작
  startExam: () => {
    const { mode } = get();
    set({
      status: 'in_progress',
      startTime: Date.now(),
      currentQuestionIndex: 0,
      timeRemaining: mode === 'mock' ? 60 * 60 : 30 * 60, // 모의고사 60분, 연습 30분
    });
  },

  // 시험 제출
  submitExam: () => {
    const { questions, userAnswers, startTime, timeRemaining, mode } = get();

    // 채점
    const gradedAnswers = userAnswers.map((answer) => {
      const question = questions.find((q) => q.id === answer.questionId);
      return {
        ...answer,
        isCorrect: question?.answer === answer.selectedOption,
      };
    });

    const correctCount = gradedAnswers.filter((a) => a.isCorrect).length;
    const timeTaken = startTime
      ? Math.floor((Date.now() - startTime) / 1000)
      : (mode === 'mock' ? 60 * 60 : 30 * 60) - timeRemaining;

    const result: ExamResult = {
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      score: Math.round((correctCount / questions.length) * 100),
      timeTaken,
      date: new Date().toISOString(),
      answers: gradedAnswers,
      questions,
    };

    set({
      status: 'submitted',
      result,
      userAnswers: gradedAnswers,
    });
  },

  // 시험 초기화
  resetExam: () =>
    set({
      mode: null,
      status: 'idle',
      questions: [],
      currentQuestionIndex: 0,
      userAnswers: [],
      timeRemaining: 60 * 60,
      startTime: null,
      selectedSubjectId: null,
      selectedTopicName: null,
      result: null,
    }),

  // 다음 문제로 이동
  goToNextQuestion: () => {
    const { currentQuestionIndex, questions } = get();
    if (currentQuestionIndex < questions.length - 1) {
      set({ currentQuestionIndex: currentQuestionIndex + 1 });
    }
  },

  // 이전 문제로 이동
  goToPrevQuestion: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex > 0) {
      set({ currentQuestionIndex: currentQuestionIndex - 1 });
    }
  },
}));
