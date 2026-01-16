'use client';

interface AnswerOptionsProps {
  options: string[];
  selectedOption: number | null;
  correctAnswer?: number;
  onSelect: (index: number) => void;
  disabled?: boolean;
}

export default function AnswerOptions({
  options,
  selectedOption,
  correctAnswer,
  onSelect,
  disabled = false,
}: AnswerOptionsProps) {
  const getOptionStyle = (index: number) => {
    const baseStyle = 'w-full p-4 text-left rounded-lg border-2 transition-all duration-200 flex items-start gap-3';

    // 결과 화면일 때 (correctAnswer가 있을 때)
    if (correctAnswer !== undefined) {
      if (index === correctAnswer) {
        return `${baseStyle} bg-green-50 border-green-500 text-green-900`;
      }
      if (index === selectedOption && index !== correctAnswer) {
        return `${baseStyle} bg-red-50 border-red-500 text-red-900`;
      }
      return `${baseStyle} bg-gray-50 border-gray-200 text-gray-600`;
    }

    // 시험 중일 때
    if (index === selectedOption) {
      return `${baseStyle} bg-blue-50 border-blue-500 text-blue-900`;
    }

    return `${baseStyle} bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700`;
  };

  const getNumberStyle = (index: number) => {
    const baseStyle = 'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm';

    // 결과 화면일 때
    if (correctAnswer !== undefined) {
      if (index === correctAnswer) {
        return `${baseStyle} bg-green-500 text-white`;
      }
      if (index === selectedOption && index !== correctAnswer) {
        return `${baseStyle} bg-red-500 text-white`;
      }
      return `${baseStyle} bg-gray-300 text-gray-600`;
    }

    // 시험 중일 때
    if (index === selectedOption) {
      return `${baseStyle} bg-blue-500 text-white`;
    }

    return `${baseStyle} bg-gray-200 text-gray-700`;
  };

  return (
    <div className="space-y-3">
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => !disabled && onSelect(index)}
          disabled={disabled}
          className={getOptionStyle(index)}
        >
          <span className={getNumberStyle(index)}>{index + 1}</span>
          <span className="flex-1 pt-1">{option}</span>
        </button>
      ))}
    </div>
  );
}
