'use client';

import { useExamStore } from '@/lib/store';

export default function ProgressBar() {
  const { questions, userAnswers, currentQuestionIndex } = useExamStore();

  const answeredCount = userAnswers.filter(
    (a) => a.selectedOption !== null && a.selectedOption !== undefined
  ).length;

  const progress = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-gray-600 mb-1">
        <span>진행률</span>
        <span>
          {answeredCount} / {questions.length} 문제 답변 완료
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
