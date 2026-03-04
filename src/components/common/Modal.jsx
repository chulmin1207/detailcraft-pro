import { createPortal } from 'react-dom';

/**
 * 재사용 가능한 모달 컴포넌트
 * 원본 index.html lines 170-200 (.modal-overlay, .modal, .modal-header, .modal-body, .modal-footer) 기반
 *
 * @param {boolean} isOpen - 모달 표시 여부
 * @param {Function} onClose - 오버레이 클릭 또는 닫기 버튼 클릭 시 호출
 * @param {string} title - 모달 헤더 제목
 * @param {React.ReactNode} children - 모달 본문 (.modal-body)
 * @param {React.ReactNode} footer - 모달 푸터 (.modal-footer) 버튼 등
 */
export default function Modal({ isOpen, onClose, title, children, footer }) {
  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-[8px] z-[1000] flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-bg-secondary border border-border-subtle rounded-[24px] w-full max-w-[560px] mx-5 overflow-hidden animate-[modalIn_0.3s_ease]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* modal-header */}
        <div className="px-6 py-5 border-b border-border-subtle flex justify-between items-center">
          <h3 className="text-[1.125rem] font-semibold text-text-primary">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-bg-tertiary border-none rounded-[10px] text-text-secondary text-xl cursor-pointer flex items-center justify-center hover:bg-bg-hover hover:text-text-primary transition-all duration-150"
          >
            &times;
          </button>
        </div>

        {/* modal-body */}
        <div className="p-6">
          {children}
        </div>

        {/* modal-footer */}
        {footer && (
          <div className="px-6 py-5 border-t border-border-subtle flex gap-3 justify-end">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
