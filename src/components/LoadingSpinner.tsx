'use client';

interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message = '문제를 생성하고 있습니다...' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="relative">
        {/* 외부 원 */}
        <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
        {/* 회전하는 원 */}
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-gray-600 font-medium">{message}</p>
      <p className="mt-2 text-sm text-gray-500">
        AI가 출제기준에 맞는 문제를 생성 중입니다.
      </p>
      <p className="text-sm text-gray-400">
        잠시만 기다려 주세요...
      </p>
    </div>
  );
}
