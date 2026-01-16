'use client';

interface CBTSubmitModalProps {
  totalQuestions: number;
  answeredCount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function CBTSubmitModal({
  totalQuestions,
  answeredCount,
  onConfirm,
  onCancel,
}: CBTSubmitModalProps) {
  const unansweredCount = totalQuestions - answeredCount;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* 헤더 */}
        <div className="bg-[#1e3a5f] text-white px-6 py-4">
          <h2 className="text-xl font-bold">답안 제출</h2>
        </div>

        {/* 내용 */}
        <div className="p-6">
          {/* 상태 요약 */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="text-3xl font-bold text-green-600">{answeredCount}</div>
                <div className="text-sm text-gray-600">입력 완료</div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className={`text-3xl font-bold ${unansweredCount > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                  {unansweredCount}
                </div>
                <div className="text-sm text-gray-600">미입력</div>
              </div>
            </div>
          </div>

          {/* 경고 메시지 */}
          {unansweredCount > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="font-semibold text-yellow-800">미입력 문제가 있습니다</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    아직 {unansweredCount}개의 문제에 답을 입력하지 않았습니다.<br />
                    미입력 문제는 오답으로 처리됩니다.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 확인 메시지 */}
          <div className="text-center mb-6">
            <p className="text-gray-700">
              답안을 제출하시겠습니까?
            </p>
            <p className="text-sm text-gray-500 mt-1">
              제출 후에는 수정할 수 없습니다.
            </p>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              취소
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-3 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#0d2137] transition-colors font-semibold"
            >
              최종 제출
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
