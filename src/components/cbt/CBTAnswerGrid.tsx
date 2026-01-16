'use client';

import { Question, UserAnswer } from '@/types/exam';

interface CBTAnswerGridProps {
  questions: Question[];
  userAnswers: UserAnswer[];
  currentIndex: number;
  checkedQuestions: Set<number>;
  onQuestionClick: (index: number) => void;
}

export default function CBTAnswerGrid({
  questions,
  userAnswers,
  currentIndex,
  checkedQuestions,
  onQuestionClick,
}: CBTAnswerGridProps) {
  const getAnswerStatus = (questionId: number) => {
    const answer = userAnswers.find(a => a.questionId === questionId);
    return answer?.selectedOption !== null && answer?.selectedOption !== undefined;
  };

  const answeredCount = userAnswers.filter(a => a.selectedOption !== null && a.selectedOption !== undefined).length;
  const remainingCount = questions.length - answeredCount;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 h-full flex flex-col">
      {/* 헤더 */}
      <div className="px-4 py-3 bg-[#1e3a5f] text-white rounded-t-lg">
        <h3 className="font-bold text-center">답안 표기란</h3>
      </div>

      {/* 상태 요약 */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-[#22c55e] rounded"></span>
            <span>답안 입력: {answeredCount}문제</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-gray-300 rounded"></span>
            <span>미입력: {remainingCount}문제</span>
          </div>
        </div>
        {checkedQuestions.size > 0 && (
          <div className="flex items-center gap-2 mt-2 text-sm">
            <span className="w-4 h-4 bg-orange-500 rounded"></span>
            <span>체크: {checkedQuestions.size}문제</span>
          </div>
        )}
      </div>

      {/* 문제 번호 그리드 */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-5 gap-2">
          {questions.map((question, index) => {
            const isAnswered = getAnswerStatus(question.id);
            const isChecked = checkedQuestions.has(question.id);
            const isCurrent = index === currentIndex;

            return (
              <button
                key={question.id}
                onClick={() => onQuestionClick(index)}
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
                {/* 체크 표시 */}
                {isChecked && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 범례 */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-500">
        <p>* 문제 번호를 클릭하면 해당 문제로 이동합니다</p>
      </div>
    </div>
  );
}
