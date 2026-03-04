import { useToast } from '../../contexts/ToastContext';

/**
 * 토스트 알림 컨테이너 컴포넌트
 * 원본 index.html lines 588-595 (.toast-container, .toast, .toast-success, .toast-error) 기반
 *
 * ToastContext에서 toasts 배열을 읽어 우하단에 렌더링한다.
 * 각 토스트는 우측에서 슬라이드 인으로 나타나며, 3초 후 자동으로 사라진다.
 */
export default function Toast() {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[1001]">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        // 타입에 따른 보더 색상
        const borderColorClass = isSuccess
          ? 'border-accent-success'
          : isError
            ? 'border-accent-danger'
            : 'border-border-default';

        // 타입에 따른 아이콘
        const icon = isSuccess ? '\u2705' : isError ? '\u274C' : '\u2139\uFE0F';

        return (
          <div
            key={toast.id}
            className={`
              flex items-center gap-2.5 px-5 py-3.5
              bg-bg-elevated border ${borderColorClass} rounded-[16px]
              shadow-[var(--shadow-lg)]
              mt-2
              animate-[toastSlideIn_0.4s_cubic-bezier(0.34,1.56,0.64,1)_forwards]
            `}
            style={{
              animation: 'toastSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
            }}
          >
            <span className="text-xl leading-none">{icon}</span>
            <span className="text-[0.875rem] font-medium text-text-primary">
              {toast.message}
            </span>
          </div>
        );
      })}

      {/* 인라인 keyframes (CSS에 없는 경우 대비) */}
      <style>{`
        @keyframes toastSlideIn {
          from { transform: translateX(150%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
