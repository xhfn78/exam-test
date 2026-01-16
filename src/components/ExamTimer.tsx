'use client';

import { useEffect } from 'react';
import { useExamStore } from '@/lib/store';

export default function ExamTimer() {
  const { timeRemaining, decrementTime, status, submitExam } = useExamStore();

  useEffect(() => {
    if (status !== 'in_progress') return;

    const timer = setInterval(() => {
      decrementTime();
    }, 1000);

    return () => clearInterval(timer);
  }, [status, decrementTime]);

  // 시간 초과 시 자동 제출
  useEffect(() => {
    if (timeRemaining === 0 && status === 'in_progress') {
      submitExam();
    }
  }, [timeRemaining, status, submitExam]);

  const hours = Math.floor(timeRemaining / 3600);
  const minutes = Math.floor((timeRemaining % 3600) / 60);
  const seconds = timeRemaining % 60;

  const formatTime = (value: number) => value.toString().padStart(2, '0');

  // 남은 시간에 따른 색상
  const getTimeColor = () => {
    if (timeRemaining <= 300) return 'text-red-600 animate-pulse'; // 5분 이하
    if (timeRemaining <= 600) return 'text-orange-500'; // 10분 이하
    return 'text-gray-700';
  };

  return (
    <div className={`flex items-center gap-2 font-mono text-2xl font-bold ${getTimeColor()}`}>
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>
        {hours > 0 && `${formatTime(hours)}:`}
        {formatTime(minutes)}:{formatTime(seconds)}
      </span>
    </div>
  );
}
