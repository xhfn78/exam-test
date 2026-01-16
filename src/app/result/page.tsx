'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useExamStore } from '@/lib/store';
import QuestionCard from '@/components/QuestionCard';

export default function ResultPage() {
  const router = useRouter();
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'wrong' | 'correct'>('all');

  const { result, questions, userAnswers, resetExam } = useExamStore();

  // 결과가 없으면 홈으로 리다이렉트
  if (!result) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">결과가 없습니다</h2>
          <p className="text-gray-600 mb-6">먼저 시험을 완료해주세요.</p>
          <Link
            href="/"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  const { totalQuestions, correctAnswers, score, timeTaken } = result;
  const isPassed = score >= 60;

  // 시간 포맷
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}분 ${secs}초`;
  };

  // 과목별 성적 계산
  const subjectScores: Record<string, { correct: number; total: number }> = {};
  questions.forEach((q, idx) => {
    const subject = q.category.subject;
    if (!subjectScores[subject]) {
      subjectScores[subject] = { correct: 0, total: 0 };
    }
    subjectScores[subject].total++;
    const answer = userAnswers[idx];
    if (answer && answer.selectedOption === q.answer) {
      subjectScores[subject].correct++;
    }
  });

  // 필터링된 문제
  const filteredQuestions = questions.filter((q, idx) => {
    const answer = userAnswers[idx];
    const isCorrect = answer && answer.selectedOption === q.answer;

    if (filterType === 'wrong') return !isCorrect;
    if (filterType === 'correct') return isCorrect;
    return true;
  });

  // 새 시험 시작
  const handleNewExam = () => {
    resetExam();
    router.push('/exam');
  };

  return (
    <main className="min-h-screen bg-gray-100">
      {/* 헤더 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">시험 결과</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 결과 요약 */}
        <div className={`rounded-xl shadow-lg p-6 mb-6 ${isPassed ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="text-center mb-6">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
              isPassed ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {isPassed ? (
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <h2 className={`text-3xl font-bold mb-2 ${isPassed ? 'text-green-800' : 'text-red-800'}`}>
              {isPassed ? '합격!' : '불합격'}
            </h2>
            <p className={`text-lg ${isPassed ? 'text-green-700' : 'text-red-700'}`}>
              {score}점 (합격 기준: 60점)
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{totalQuestions}</div>
              <div className="text-sm text-gray-600">총 문제</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{correctAnswers}</div>
              <div className="text-sm text-gray-600">정답</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{totalQuestions - correctAnswers}</div>
              <div className="text-sm text-gray-600">오답</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{formatTime(timeTaken)}</div>
              <div className="text-sm text-gray-600">소요 시간</div>
            </div>
          </div>
        </div>

        {/* 과목별 성적 */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">과목별 성적</h3>
          <div className="space-y-3">
            {Object.entries(subjectScores).map(([subject, { correct, total }]) => {
              const percentage = Math.round((correct / total) * 100);
              return (
                <div key={subject}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{subject}</span>
                    <span className="text-gray-600">
                      {correct}/{total} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        percentage >= 60 ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 문제 상세 보기 토글 */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">문제 상세</h3>
            <button
              onClick={() => setShowAllQuestions(!showAllQuestions)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              {showAllQuestions ? '접기' : '펼치기'}
            </button>
          </div>

          {showAllQuestions && (
            <>
              {/* 필터 버튼 */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterType === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  전체 ({questions.length})
                </button>
                <button
                  onClick={() => setFilterType('wrong')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterType === 'wrong'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  오답 ({totalQuestions - correctAnswers})
                </button>
                <button
                  onClick={() => setFilterType('correct')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterType === 'correct'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  정답 ({correctAnswers})
                </button>
              </div>

              {/* 문제 목록 */}
              <div className="space-y-4">
                {filteredQuestions.map((question) => {
                  const answer = userAnswers.find((a) => a.questionId === question.id);
                  const originalIndex = questions.findIndex((q) => q.id === question.id);
                  return (
                    <QuestionCard
                      key={question.id}
                      question={question}
                      questionNumber={originalIndex + 1}
                      totalQuestions={questions.length}
                      userAnswer={answer}
                      onSelectAnswer={() => {}}
                      showExplanation={true}
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* 버튼 */}
        <div className="flex gap-4">
          <button
            onClick={handleNewExam}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            새 시험 보기
          </button>
          <Link
            href="/"
            onClick={() => resetExam()}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center font-medium"
          >
            홈으로
          </Link>
        </div>
      </div>
    </main>
  );
}
