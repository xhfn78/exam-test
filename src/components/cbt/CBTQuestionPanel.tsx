'use client';

import { Question } from '@/types/exam';
import { FontSize } from '@/app/exam/page';
import CircuitDiagram from '@/components/CircuitDiagram';

interface CBTQuestionPanelProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedOption: number | null;
  onSelectOption: (index: number) => void;
  isChecked: boolean;
  onToggleCheck: () => void;
  fontSize: FontSize;
}

export default function CBTQuestionPanel({
  question,
  questionNumber,
  totalQuestions,
  selectedOption,
  onSelectOption,
  isChecked,
  onToggleCheck,
  fontSize,
}: CBTQuestionPanelProps) {
  const fontSizeClass = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  }[fontSize];

  const optionFontSize = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  }[fontSize];

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 h-full flex flex-col">
      {/* 문제 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#f8fafc] border-b border-gray-200 rounded-t-lg">
        <div className="flex items-center gap-3">
          {/* 체크 버튼 */}
          <button
            onClick={onToggleCheck}
            className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
              isChecked
                ? 'bg-orange-500 text-white'
                : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
            }`}
            title="나중에 확인할 문제 체크"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>

          {/* 문제 번호 */}
          <div className="flex items-center gap-2">
            <span className="bg-[#1e3a5f] text-white px-3 py-1 rounded font-bold">
              {questionNumber}
            </span>
            <span className="text-gray-500 text-sm">/ {totalQuestions}</span>
          </div>

          {/* 과목 표시 */}
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {question.category.subject}
          </span>
        </div>

        {/* 난이도 표시 */}
        {question.difficulty && (
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            question.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
            question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {question.difficulty === 'easy' ? '쉬움' :
             question.difficulty === 'medium' ? '보통' : '어려움'}
          </span>
        )}
      </div>

      {/* 문제 내용 */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* 문제 텍스트 */}
        <div className={`${fontSizeClass} text-gray-900 leading-relaxed mb-6 whitespace-pre-wrap`}>
          {question.question}
        </div>

        {/* 회로도/다이어그램 */}
        {question.diagram && (
          <div className="mb-6">
            <CircuitDiagram diagram={question.diagram} />
          </div>
        )}

        {/* 선택지 */}
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => onSelectOption(index)}
              className={`w-full flex items-start gap-4 p-4 rounded-lg border-2 transition-all text-left ${
                selectedOption === index
                  ? 'border-[#1e3a5f] bg-[#e8f0f8]'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {/* 번호 원 */}
              <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                selectedOption === index
                  ? 'bg-[#1e3a5f] text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {index + 1}
              </span>

              {/* 선택지 텍스트 */}
              <span className={`${optionFontSize} text-gray-800 pt-1`}>
                {option}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
