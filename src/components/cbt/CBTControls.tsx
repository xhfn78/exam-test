'use client';

import { useState } from 'react';
import { Question, UserAnswer } from '@/types/exam';
import { LayoutMode } from '@/app/exam/page';

interface CBTControlsProps {
  currentIndex: number;
  totalQuestions: number;
  answeredCount: number;
  checkedCount: number;
  onPrevious: () => void;
  onNext: () => void;
  onShowChecked: () => void;
  onSubmit: () => void;
  layoutMode: LayoutMode;
  questions: Question[];
  userAnswers: UserAnswer[];
  checkedQuestions: Set<number>;
  onQuestionClick: (index: number) => void;
}

export default function CBTControls({
  currentIndex,
  totalQuestions,
  answeredCount,
  checkedCount,
  onPrevious,
  onNext,
  onShowChecked,
  onSubmit,
  layoutMode,
  questions,
  userAnswers,
  checkedQuestions,
  onQuestionClick,
}: CBTControlsProps) {
  const [showQuestionList, setShowQuestionList] = useState(false);

  const getAnswerStatus = (questionId: number) => {
    const answer = userAnswers.find(a => a.questionId === questionId);
    return answer?.selectedOption !== null && answer?.selectedOption !== undefined;
  };

  return (
    <>
      <div className="bg-[#1e3a5f] border-t border-[#0d2137]">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* 왼쪽: 문제 정보 */}
            <div className="flex items-center gap-4 text-white text-sm">
              <span>전체 문제: <strong>{totalQuestions}</strong></span>
              <span className="text-gray-400">|</span>
              <span>답안 입력: <strong className="text-green-400">{answeredCount}</strong></span>
              <span className="text-gray-400">|</span>
              <span>남은 문제: <strong className="text-yellow-400">{totalQuestions - answeredCount}</strong></span>
            </div>

            {/* 중앙: 네비게이션 */}
            <div className="flex items-center gap-2">
              <button
                onClick={onPrevious}
                disabled={currentIndex === 0}
                className="flex items-center gap-1 px-4 py-2 bg-[#2a4a6f] text-white rounded hover:bg-[#3a5a7f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                이전문제
              </button>

              {/* 번호 보기 버튼 (single/grid 모드일 때) */}
              {layoutMode !== 'split' && (
                <button
                  onClick={() => setShowQuestionList(!showQuestionList)}
                  className="flex items-center gap-1 px-4 py-2 bg-[#2a4a6f] text-white rounded hover:bg-[#3a5a7f] transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  번호보기
                </button>
              )}

              <button
                onClick={onNext}
                disabled={currentIndex === totalQuestions - 1}
                className="flex items-center gap-1 px-4 py-2 bg-[#2a4a6f] text-white rounded hover:bg-[#3a5a7f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                다음문제
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* 오른쪽: 체크/제출 */}
            <div className="flex items-center gap-2">
              {checkedCount > 0 && (
                <button
                  onClick={onShowChecked}
                  className="flex items-center gap-1 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  체크문제 ({checkedCount})
                </button>
              )}

              <button
                onClick={onSubmit}
                className="flex items-center gap-1 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors font-semibold"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                답안제출
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 번호 보기 팝업 */}
      {showQuestionList && layoutMode !== 'split' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowQuestionList(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="px-4 py-3 bg-[#1e3a5f] text-white flex items-center justify-between">
              <h3 className="font-bold">문제 번호 목록</h3>
              <button onClick={() => setShowQuestionList(false)} className="hover:bg-white/20 rounded p-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4">
              {/* 상태 요약 */}
              <div className="flex gap-4 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-[#22c55e] rounded"></span>
                  <span>답안 입력: {answeredCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-gray-300 rounded"></span>
                  <span>미입력: {totalQuestions - answeredCount}</span>
                </div>
                {checkedCount > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-orange-500 rounded"></span>
                    <span>체크: {checkedCount}</span>
                  </div>
                )}
              </div>

              {/* 문제 번호 그리드 */}
              <div className="grid grid-cols-10 gap-2 max-h-[50vh] overflow-y-auto">
                {questions.map((question, index) => {
                  const isAnswered = getAnswerStatus(question.id);
                  const isChecked = checkedQuestions.has(question.id);
                  const isCurrent = index === currentIndex;

                  return (
                    <button
                      key={question.id}
                      onClick={() => {
                        onQuestionClick(index);
                        setShowQuestionList(false);
                      }}
                      className={`
                        relative w-full aspect-square rounded flex items-center justify-center
                        font-bold text-sm transition-all
                        ${isCurrent ? 'ring-2 ring-[#1e3a5f] ring-offset-1' : ''}
                        ${isAnswered
                          ? 'bg-[#22c55e] text-white hover:bg-[#16a34a]'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }
                      `}
                    >
                      {index + 1}
                      {isChecked && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full"></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
