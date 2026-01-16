'use client';

import { LayoutMode, FontSize } from '@/app/exam/page';

interface CBTHeaderProps {
  examTitle: string;
  timeRemaining: number;
  fontSize: FontSize;
  onFontSizeChange: (size: FontSize) => void;
  layoutMode: LayoutMode;
  onLayoutModeChange: (mode: LayoutMode) => void;
  onCalculatorToggle: () => void;
}

export default function CBTHeader({
  examTitle,
  timeRemaining,
  fontSize,
  onFontSizeChange,
  layoutMode,
  onLayoutModeChange,
  onCalculatorToggle,
}: CBTHeaderProps) {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isTimeWarning = timeRemaining <= 600; // 10분 이하

  return (
    <header className="bg-[#1e3a5f] text-white shadow-lg">
      {/* 상단 타이틀 바 */}
      <div className="bg-[#0d2137] px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <span className="text-[#1e3a5f] font-bold text-sm">CBT</span>
              </div>
              <span className="font-semibold">한국산업인력공단</span>
            </div>
            <span className="text-gray-300">|</span>
            <span className="text-lg font-bold">{examTitle}</span>
          </div>

          {/* 남은 시간 */}
          <div className={`flex items-center gap-2 px-4 py-1 rounded ${isTimeWarning ? 'bg-red-600 animate-pulse' : 'bg-[#2a4a6f]'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-mono text-lg font-bold">{formatTime(timeRemaining)}</span>
          </div>
        </div>
      </div>

      {/* 컨트롤 바 */}
      <div className="px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* 왼쪽 컨트롤 */}
          <div className="flex items-center gap-3">
            {/* 글자 크기 */}
            <div className="flex items-center gap-1 bg-[#2a4a6f] rounded overflow-hidden">
              <span className="px-3 py-1.5 text-sm">글자크기</span>
              <button
                onClick={() => onFontSizeChange('small')}
                className={`px-3 py-1.5 text-sm transition-colors ${fontSize === 'small' ? 'bg-white text-[#1e3a5f]' : 'hover:bg-[#3a5a7f]'}`}
              >
                가
              </button>
              <button
                onClick={() => onFontSizeChange('medium')}
                className={`px-3 py-1.5 transition-colors ${fontSize === 'medium' ? 'bg-white text-[#1e3a5f]' : 'hover:bg-[#3a5a7f]'}`}
              >
                가
              </button>
              <button
                onClick={() => onFontSizeChange('large')}
                className={`px-3 py-1.5 text-lg transition-colors ${fontSize === 'large' ? 'bg-white text-[#1e3a5f]' : 'hover:bg-[#3a5a7f]'}`}
              >
                가
              </button>
            </div>

            {/* 화면 배치 */}
            <div className="flex items-center gap-1 bg-[#2a4a6f] rounded overflow-hidden">
              <span className="px-3 py-1.5 text-sm">화면배치</span>
              <button
                onClick={() => onLayoutModeChange('single')}
                className={`px-3 py-1.5 text-sm transition-colors ${layoutMode === 'single' ? 'bg-white text-[#1e3a5f]' : 'hover:bg-[#3a5a7f]'}`}
                title="한 문제씩"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <rect x="3" y="3" width="14" height="14" rx="1" />
                </svg>
              </button>
              <button
                onClick={() => onLayoutModeChange('split')}
                className={`px-3 py-1.5 text-sm transition-colors ${layoutMode === 'split' ? 'bg-white text-[#1e3a5f]' : 'hover:bg-[#3a5a7f]'}`}
                title="문제+답안표기란"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <rect x="2" y="3" width="10" height="14" rx="1" />
                  <rect x="14" y="3" width="4" height="14" rx="1" />
                </svg>
              </button>
              <button
                onClick={() => onLayoutModeChange('grid')}
                className={`px-3 py-1.5 text-sm transition-colors ${layoutMode === 'grid' ? 'bg-white text-[#1e3a5f]' : 'hover:bg-[#3a5a7f]'}`}
                title="전체 문제 보기"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <rect x="2" y="2" width="7" height="7" rx="1" />
                  <rect x="11" y="2" width="7" height="7" rx="1" />
                  <rect x="2" y="11" width="7" height="7" rx="1" />
                  <rect x="11" y="11" width="7" height="7" rx="1" />
                </svg>
              </button>
            </div>

            {/* 계산기 */}
            <button
              onClick={onCalculatorToggle}
              className="flex items-center gap-2 px-4 py-1.5 bg-[#2a4a6f] rounded hover:bg-[#3a5a7f] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span className="text-sm">계산기</span>
            </button>
          </div>

          {/* 오른쪽 안내 */}
          <div className="text-sm text-gray-300">
            <span className="text-yellow-400">*</span> 시험시간이 10분 남으면 시간이 붉은색으로 표시됩니다
          </div>
        </div>
      </div>
    </header>
  );
}
