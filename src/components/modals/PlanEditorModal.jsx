import { useState } from 'react';
import Modal from '../common/Modal';
import { useApp } from '../../contexts/AppContext';
import { useToast } from '../../contexts/ToastContext';

/**
 * 기획서 수정 모달
 * 원본 index.html lines 4893-4934 기반
 *
 * 생성된 기획서(generatedPlan) 전체를 텍스트로 편집할 수 있는 모달.
 * 저장 시 기획서를 다시 파싱하여 섹션 데이터를 갱신한다.
 */

// 기획서 텍스트에서 섹션을 파싱하는 유틸 함수
// 원본 parseSections (lines 2433-2486)
function parseSections(text) {
  const sections = [];
  const regex = /\[SECTION_START\]([\s\S]*?)\[SECTION_END\]/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const content = match[1];
    const section = {};

    const numMatch = content.match(/섹션번호:\s*(\d+)/);
    const nameMatch = content.match(/섹션명:\s*(.+)/);
    const purposeMatch = content.match(/목적:\s*(.+)/);
    const headlineMatch = content.match(/헤드라인:\s*(.+)/);
    const headlineAltMatch = content.match(/헤드라인대안:\s*(.+)/);
    const subMatch = content.match(/서브카피:\s*(.+)/);
    const subAltMatch = content.match(/서브카피대안:\s*(.+)/);
    const visualMatch = content.match(/비주얼 지시:\s*([\s\S]+?)(?=\n[가-힣]+:|$)/);

    section.number = numMatch ? parseInt(numMatch[1]) : sections.length + 1;
    section.name = nameMatch ? nameMatch[1].trim() : `섹션 ${section.number}`;
    section.purpose = purposeMatch ? purposeMatch[1].trim() : '';
    section.headline = headlineMatch ? headlineMatch[1].trim() : '';
    section.subCopy = subMatch ? subMatch[1].trim() : '';
    section.visualPrompt = visualMatch ? visualMatch[1].trim() : '';

    // 대안 카피 파싱 (| 로 구분)
    section.headlineAlts = headlineAltMatch
      ? headlineAltMatch[1].split('|').map((s) => s.trim()).filter((s) => s)
      : [];
    section.subCopyAlts = subAltMatch
      ? subAltMatch[1].split('|').map((s) => s.trim()).filter((s) => s)
      : [];

    sections.push(section);
  }

  // 파싱 실패 시 기본 8개 섹션 생성
  if (sections.length === 0) {
    for (let i = 1; i <= 8; i++) {
      sections.push({
        number: i,
        name: `섹션 ${i}`,
        purpose: '',
        headline: '',
        subCopy: '',
        visualPrompt: 'Product photography, clean background, professional lighting',
        headlineAlts: [],
        subCopyAlts: [],
      });
    }
  }

  return sections;
}

export default function PlanEditorModal({ isOpen, onClose }) {
  const { generatedPlan, setGeneratedPlan, setGeneratedSections } = useApp();
  const { showToast } = useToast();

  // 로컬 편집 상태
  const [editText, setEditText] = useState('');

  // 모달이 열릴 때 현재 기획서 텍스트를 로컬 상태에 복사 (렌더 단계 동기화)
  const [prevOpen, setPrevOpen] = useState(false);
  if (isOpen && !prevOpen) {
    setEditText(generatedPlan);
  }
  if (isOpen !== prevOpen) {
    setPrevOpen(isOpen);
  }

  // 저장 핸들러
  const handleSave = () => {
    // 기획서 텍스트 업데이트
    setGeneratedPlan(editText);

    // 섹션 다시 파싱하여 업데이트
    const newSections = parseSections(editText);
    setGeneratedSections(newSections);

    onClose();
    showToast('기획서가 수정되었습니다!', 'success');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="기획서 수정"
      footer={
        <>
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium rounded-[10px] cursor-pointer transition-all duration-150 bg-bg-elevated text-text-primary border border-border-default hover:bg-bg-hover hover:border-border-strong"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium rounded-[10px] border-none cursor-pointer transition-all duration-150 bg-accent-primary text-white hover:bg-accent-primary-hover"
          >
            저장
          </button>
        </>
      }
    >
      <textarea
        value={editText}
        onChange={(e) => setEditText(e.target.value)}
        className="w-full min-h-[400px] p-5 bg-bg-tertiary border-none rounded-[10px] text-text-primary font-mono text-[0.85rem] leading-relaxed resize-none outline-none focus:ring-1 focus:ring-accent-primary/30 transition-all duration-150"
        style={{ height: '60vh' }}
        spellCheck={false}
      />
    </Modal>
  );
}
