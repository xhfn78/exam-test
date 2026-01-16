'use client';

import { useExamStore } from '@/lib/store';

export default function QuestionNav() {
  const { questions, userAnswers, currentQuestionIndex, setCurrentQuestionIndex } = useExamStore();

  const getButtonStyle = (index: number) => {
    const answer = userAnswers[index];
    const isAnswered = answer?.selectedOption !== null && answer?.selectedOption !== undefined;
    const isCurrent = index === currentQuestionIndex;

    if (isCurrent) {
      return 'bg-blue-600 text-white border-blue-600';
    }
    if (isAnswered) {
      return 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200';
    }
    return 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100';
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-semibold text-gray-900 mb-3">문제 목록</h3>
      <div className="grid grid-cols-10 gap-1.5">
        {questions.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentQuestionIndex(index)}
            className={`w-8 h-8 text-xs font-medium rounded border transition-colors ${getButtonStyle(index)}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-blue-600" />
          <span>현재</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-green-100 border border-green-300" />
          <span>답변 완료</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-white border border-gray-300" />
          <span>미답변</span>
        </div>
      </div>
    </div>
  );
}
