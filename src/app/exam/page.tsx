'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useExamStore } from '@/lib/store';
import CBTHeader from '@/components/cbt/CBTHeader';
import CBTQuestionPanel from '@/components/cbt/CBTQuestionPanel';
import CBTAnswerGrid from '@/components/cbt/CBTAnswerGrid';
import CBTControls from '@/components/cbt/CBTControls';
import CBTCalculator from '@/components/cbt/CBTCalculator';
import CBTSubmitModal from '@/components/cbt/CBTSubmitModal';
import LoadingSpinner from '@/components/LoadingSpinner';

export type LayoutMode = 'single' | 'split' | 'grid';
export type FontSize = 'small' | 'medium' | 'large';

export default function CBTExamPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('split');
  const [fontSize, setFontSize] = useState<FontSize>('medium');
  const [showCalculator, setShowCalculator] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [checkedQuestions, setCheckedQuestions] = useState<Set<number>>(new Set());
  const [showStartModal, setShowStartModal] = useState(true);

  const {
    questions,
    currentQuestionIndex,
    userAnswers,
    timeRemaining,
    status,
    setQuestions,
    setCurrentQuestionIndex,
    selectAnswer,
    decrementTime,
    submitExam,
    setStatus,
    startExam,
    setMode,
  } = useExamStore();

  // 문제 로드
  useEffect(() => {
    const loadQuestions = async () => {
      if (questions.length > 0) {
        setIsLoading(false);
        if (status === 'in_progress') {
          setShowStartModal(false);
        }
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode: 'mock', count: 60 }),
        });

        const data = await response.json();
        if (data.questions && data.questions.length > 0) {
          setMode('mock');
          setQuestions(data.questions);
          setStatus('idle');
        }
      } catch (error) {
        console.error('문제 로드 오류:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, []);

  // 타이머
  useEffect(() => {
    if (status !== 'in_progress' || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      decrementTime();
    }, 1000);

    return () => clearInterval(timer);
  }, [status, timeRemaining, decrementTime]);

  // 시간 종료 시 자동 제출
  useEffect(() => {
    if (timeRemaining <= 0 && status === 'in_progress') {
      handleSubmit();
    }
  }, [timeRemaining, status]);

  // 시험 시작
  const handleStartExam = useCallback(() => {
    startExam();
    setShowStartModal(false);
  }, [startExam]);

  // 답안 선택
  const handleSelectAnswer = useCallback((optionIndex: number) => {
    const question = questions[currentQuestionIndex];
    if (question) {
      selectAnswer(question.id, optionIndex);
    }
  }, [questions, currentQuestionIndex, selectAnswer]);

  // 문제 이동
  const goToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
    }
  }, [questions.length, setCurrentQuestionIndex]);

  // 체크 토글
  const toggleCheck = useCallback((questionId: number) => {
    setCheckedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  }, []);

  // 시험 제출
  const handleSubmit = useCallback(() => {
    submitExam();
    router.push('/result');
  }, [submitExam, router]);

  // 로딩 화면
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#e8eef3] flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center max-w-md">
          <div className="w-16 h-16 border-4 border-[#1e3a5f] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">시험 문제 준비 중</h2>
          <p className="text-gray-600">문제를 불러오고 있습니다...</p>
          <p className="text-sm text-gray-400 mt-2">잠시만 기다려주세요</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#e8eef3] flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">문제를 불러오지 못했습니다</h2>
          <p className="text-gray-600 mb-6">네트워크 상태를 확인하고 다시 시도해주세요.</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#0d2137] transition-colors font-medium"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 시험 시작 전 안내 화면
  if (showStartModal && status !== 'in_progress') {
    return (
      <div className="min-h-screen bg-[#e8eef3] flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 overflow-hidden">
          {/* 헤더 */}
          <div className="bg-[#1e3a5f] text-white px-6 py-4">
            <h1 className="text-xl font-bold">전기기능장 필기시험</h1>
            <p className="text-blue-200 text-sm mt-1">CBT 모의고사</p>
          </div>

          {/* 시험 정보 */}
          <div className="p-6">
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h2 className="font-bold text-blue-900 mb-3">시험 정보</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">문제 수</span>
                  <p className="font-semibold text-gray-900">{questions.length}문제</p>
                </div>
                <div>
                  <span className="text-gray-600">시험 시간</span>
                  <p className="font-semibold text-gray-900">60분</p>
                </div>
                <div>
                  <span className="text-gray-600">합격 기준</span>
                  <p className="font-semibold text-gray-900">60점 이상</p>
                </div>
                <div>
                  <span className="text-gray-600">문제 유형</span>
                  <p className="font-semibold text-gray-900">4지선다</p>
                </div>
              </div>
            </div>

            {/* 주의사항 */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-yellow-800 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                주의사항
              </h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• 시험 시작 후 60분이 경과하면 자동 제출됩니다.</li>
                <li>• 시험 중 문제 간 자유롭게 이동할 수 있습니다.</li>
                <li>• 체크 기능으로 다시 볼 문제를 표시할 수 있습니다.</li>
                <li>• 답안 제출 후에는 수정할 수 없습니다.</li>
              </ul>
            </div>

            {/* 버튼 */}
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/')}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                취소
              </button>
              <button
                onClick={handleStartExam}
                className="flex-1 px-6 py-3 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#0d2137] transition-colors font-bold"
              >
                시험 시작
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = userAnswers.find(a => a.questionId === currentQuestion?.id);
  const answeredCount = userAnswers.filter(a => a.selectedOption !== null && a.selectedOption !== undefined).length;

  return (
    <div className="min-h-screen bg-[#e8eef3] flex flex-col">
      {/* CBT 헤더 */}
      <CBTHeader
        examTitle="전기기능장 필기시험"
        timeRemaining={timeRemaining}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        layoutMode={layoutMode}
        onLayoutModeChange={setLayoutMode}
        onCalculatorToggle={() => setShowCalculator(!showCalculator)}
      />

      {/* 메인 컨텐츠 영역 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 문제 영역 */}
        <div className={`flex-1 p-4 overflow-hidden ${layoutMode === 'split' ? 'pr-2' : ''}`}>
          <CBTQuestionPanel
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            selectedOption={currentAnswer?.selectedOption ?? null}
            onSelectOption={handleSelectAnswer}
            isChecked={checkedQuestions.has(currentQuestion?.id)}
            onToggleCheck={() => toggleCheck(currentQuestion?.id)}
            fontSize={fontSize}
          />
        </div>

        {/* 답안 표기란 (split 모드일 때) */}
        {layoutMode === 'split' && (
          <div className="w-64 p-4 pl-2 overflow-hidden">
            <CBTAnswerGrid
              questions={questions}
              userAnswers={userAnswers}
              currentIndex={currentQuestionIndex}
              checkedQuestions={checkedQuestions}
              onQuestionClick={goToQuestion}
            />
          </div>
        )}
      </div>

      {/* 하단 컨트롤 */}
      <CBTControls
        currentIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        answeredCount={answeredCount}
        checkedCount={checkedQuestions.size}
        onPrevious={() => goToQuestion(currentQuestionIndex - 1)}
        onNext={() => goToQuestion(currentQuestionIndex + 1)}
        onShowChecked={() => {
          const checkedArray = Array.from(checkedQuestions);
          if (checkedArray.length > 0) {
            const questionIndex = questions.findIndex(q => q.id === checkedArray[0]);
            if (questionIndex !== -1) goToQuestion(questionIndex);
          }
        }}
        onSubmit={() => setShowSubmitModal(true)}
        layoutMode={layoutMode}
        questions={questions}
        userAnswers={userAnswers}
        checkedQuestions={checkedQuestions}
        onQuestionClick={goToQuestion}
      />

      {/* 계산기 모달 */}
      {showCalculator && (
        <CBTCalculator onClose={() => setShowCalculator(false)} />
      )}

      {/* 제출 확인 모달 */}
      {showSubmitModal && (
        <CBTSubmitModal
          totalQuestions={questions.length}
          answeredCount={answeredCount}
          onConfirm={handleSubmit}
          onCancel={() => setShowSubmitModal(false)}
        />
      )}
    </div>
  );
}
