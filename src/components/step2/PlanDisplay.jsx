import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useToast } from '../../contexts/ToastContext';
import { markdownToHtml } from '../../utils/markdown';
import { parseSections } from '../../services/plan-service';
import Modal from '../common/Modal';

/**
 * AI 생성 기획서 표시 컴포넌트
 * 원본 index.html lines 978-992 기반
 *
 * 기능:
 * - 생성된 기획서 HTML 렌더링 (markdownToHtml)
 * - 복사, 다운로드, 수정 액션 버튼
 * - PlanEditorModal 통합 (수정 버튼 클릭 시)
 */
export default function PlanDisplay() {
  const {
    generatedPlan,
    setGeneratedPlan,
    setGeneratedSections,
  } = useApp();
  const { showToast } = useToast();

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editText, setEditText] = useState('');

  if (!generatedPlan) return null;

  // 기획서 HTML 변환
  const planHtml = markdownToHtml(generatedPlan);

  // 복사 기능
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedPlan);
      showToast('기획서가 클립보드에 복사되었습니다!', 'success');
    } catch {
      showToast('복사에 실패했습니다.', 'error');
    }
  };

  // 다운로드 기능 (.md 파일)
  const handleDownload = () => {
    try {
      const blob = new Blob([generatedPlan], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'detailcraft-plan.md';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('기획서가 다운로드되었습니다!', 'success');
    } catch {
      showToast('다운로드에 실패했습니다.', 'error');
    }
  };

  // 수정 모달 열기
  const handleEdit = () => {
    setEditText(generatedPlan);
    setIsEditorOpen(true);
  };

  // 수정 저장
  const handleSaveEdit = () => {
    setGeneratedPlan(editText);
    const newSections = parseSections(editText);
    setGeneratedSections(newSections);
    setIsEditorOpen(false);
    showToast('기획서가 수정되었습니다!', 'success');
  };

  return (
    <>
      {/* 기획서 카드 */}
      <div className="bg-bg-secondary border border-border-subtle rounded-[24px] overflow-hidden mb-6">
        {/* 카드 헤더 */}
        <div className="px-6 py-[18px] border-b border-border-subtle flex justify-between items-center">
          <h2 className="text-base font-semibold flex items-center gap-2.5">
            <span>&#x1F4CB;</span> AI 생성 기획서
          </h2>
          <span className="px-2.5 py-1 bg-[rgba(99,102,241,0.1)] text-accent-primary-hover rounded-full text-[0.7rem]">
            STEP 2
          </span>
        </div>

        {/* 카드 바디 */}
        <div className="p-6">
          {/* 액션 버튼 */}
          <div className="flex gap-2 flex-wrap mb-5">
            <button
              onClick={handleCopy}
              className="
                px-4 py-2 rounded-[10px] text-sm font-medium cursor-pointer
                bg-bg-elevated text-text-primary border border-border-default
                hover:bg-bg-hover hover:border-border-strong
                transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]
              "
            >
              &#x1F4CB; 복사
            </button>
            <button
              onClick={handleDownload}
              className="
                px-4 py-2 rounded-[10px] text-sm font-medium cursor-pointer
                bg-bg-elevated text-text-primary border border-border-default
                hover:bg-bg-hover hover:border-border-strong
                transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]
              "
            >
              &#x1F4C4; 다운로드
            </button>
            <button
              onClick={handleEdit}
              className="
                px-4 py-2 rounded-[10px] text-sm font-medium cursor-pointer
                bg-bg-elevated text-text-primary border border-border-default
                hover:bg-bg-hover hover:border-border-strong
                transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]
              "
            >
              &#x270F;&#xFE0F; 수정
            </button>
          </div>

          {/* 기획서 출력 영역 */}
          <div
            className="max-h-[400px] overflow-y-auto p-5 bg-bg-tertiary rounded-[16px] text-sm leading-relaxed text-text-secondary"
            dangerouslySetInnerHTML={{ __html: planHtml }}
          />
        </div>
      </div>

      {/* 기획서 수정 모달 (PlanEditorModal) */}
      <Modal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        title="&#x270F;&#xFE0F; 기획서 수정"
        footer={
          <>
            <button
              onClick={() => setIsEditorOpen(false)}
              className="
                px-4 py-2 rounded-[10px] text-sm font-medium cursor-pointer
                bg-bg-elevated text-text-primary border border-border-default
                hover:bg-bg-hover hover:border-border-strong
                transition-all duration-150
              "
            >
              취소
            </button>
            <button
              onClick={handleSaveEdit}
              className="
                px-4 py-2 rounded-[10px] text-sm font-medium cursor-pointer
                bg-accent-primary text-white border-none
                hover:bg-accent-primary-hover
                transition-all duration-150
              "
            >
              &#x1F4BE; 저장
            </button>
          </>
        }
      >
        <textarea
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          className="
            w-full min-h-[400px] p-5 bg-bg-tertiary border-none rounded-[10px]
            text-text-primary font-mono text-[0.85rem] resize-none outline-none
          "
        />
      </Modal>
    </>
  );
}
