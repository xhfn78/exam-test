'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useExamStore } from '@/lib/store';
import { Subject, Topic } from '@/types/exam';
import SubjectSelector from '@/components/SubjectSelector';
import QuestionCard from '@/components/QuestionCard';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function PracticePage() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const {
    status,
    questions,
    currentQuestionIndex,
    userAnswers,
    setMode,
    setQuestions,
    setStatus,
    selectAnswer,
    setSelectedSubject,
    startExam,
    resetExam,
    goToNextQuestion,
    goToPrevQuestion,
  } = useExamStore();

  // 과목 선택 및 문제 생성
  const handleSelectSubject = async (subject: Subject, topic?: Topic) => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'practice',
          count: 10,
          subjectId: subject.id,
          topicName: topic?.name,
        }),
      });

      if (!response.ok) {
        throw new Error('문제 생성에 실패했습니다.');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setMode('practice');
      setSelectedSubject(subject.id, topic?.name || null);
      setQuestions(data.questions);
      startExam();
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  // 답안 선택 핸들러
  const handleSelectAnswer = (optionIndex: number) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion) {
      selectAnswer(currentQuestion.id, optionIndex);
    }
  };

  // 정답 확인 (영역별 연습에서는 즉시 확인 가능)
  const handleShowAnswer = () => {
    setShowResults(true);
  };

  // 다음 문제
  const handleNext = () => {
    setShowResults(false);
    goToNextQuestion();
  };

  // 이전 문제
  const handlePrev = () => {
    setShowResults(false);
    goToPrevQuestion();
  };

  // 다시 연습
  const handleReset = () => {
    resetExam();
    setShowResults(false);
  };

  // 로딩 중
  if (isGenerating) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <LoadingSpinner message="연습 문제를 생성하고 있습니다..." />
      </main>
    );
  }

  // 에러 발생
  if (error) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">오류 발생</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleReset}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </main>
    );
  }

  // 과목 선택 화면 (문제가 없을 때)
  if (questions.length === 0) {
    return (
      <main className="min-h-screen bg-gray-100">
        {/* 헤더 */}
        <div className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">영역별 연습</h1>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <SubjectSelector onSelect={handleSelectSubject} />
          </div>
        </div>
      </main>
    );
  }

  // 연습 진행 중
  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = userAnswers.find((a) => a.questionId === currentQuestion?.id);
  const hasAnswered = currentAnswer?.selectedOption !== null && currentAnswer?.selectedOption !== undefined;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  // 전체 결과 계산
  const answeredQuestions = userAnswers.filter((a) => a.selectedOption !== null);
  const correctAnswers = userAnswers.filter((a, idx) => {
    const q = questions[idx];
    return q && a.selectedOption === q.answer;
  }).length;

  return (
    <main className="min-h-screen bg-gray-100">
      {/* 상단 바 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleReset}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-lg font-bold text-gray-900">영역별 연습</h1>
            </div>
            <div className="text-sm text-gray-600">
              {currentQuestionIndex + 1} / {questions.length}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {currentQuestion && (
          <QuestionCard
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            userAnswer={currentAnswer}
            onSelectAnswer={handleSelectAnswer}
            showExplanation={showResults}
          />
        )}

        {/* 버튼 영역 */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          {/* 이전/다음 네비게이션 */}
          <div className="flex gap-3 flex-1">
            <button
              onClick={handlePrev}
              disabled={currentQuestionIndex === 0}
              className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              이전
            </button>

            {!showResults && hasAnswered && (
              <button
                onClick={handleShowAnswer}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                정답 확인
              </button>
            )}

            {showResults && !isLastQuestion && (
              <button
                onClick={handleNext}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                다음 문제
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            {!showResults && !hasAnswered && (
              <button
                onClick={handleNext}
                disabled={isLastQuestion}
                className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                건너뛰기
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* 마지막 문제일 때 결과 요약 */}
        {showResults && isLastQuestion && (
          <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">연습 결과</h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {questions.length}
                </div>
                <div className="text-sm text-gray-600">총 문제</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {correctAnswers}
                </div>
                <div className="text-sm text-gray-600">정답</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round((correctAnswers / questions.length) * 100)}%
                </div>
                <div className="text-sm text-gray-600">정답률</div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                다른 과목 연습하기
              </button>
              <Link
                href="/"
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center font-medium"
              >
                홈으로
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
