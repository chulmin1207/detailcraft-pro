import { useApp } from '../../contexts/AppContext';

/**
 * STEP 3 진행 상황 표시 컴포넌트
 * 원본 index.html lines 3112-3166 + CSS lines 319-335 기반
 *
 * - 전체 진행 바 (gradient-gemini)
 * - 섹션별 상태 뱃지 (pending / generating / done / error)
 * - 일괄 재생성 중에만 표시
 *
 * @param {boolean} visible - 표시 여부
 * @param {string} title - 진행 제목 (예: "🍌 이미지 생성 중...")
 * @param {number} completed - 완료된 섹션 수
 * @param {number} total - 전체 섹션 수
 * @param {Object} sectionStatuses - { [index]: 'pending'|'generating'|'done'|'error' }
 */
export default function Step3Progress({
  visible,
  title,
  completed,
  total,
  sectionStatuses = {},
}) {
  const { generatedSections } = useApp();

  if (!visible) return null;

  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  // 상태별 텍스트
  const stateText = {
    pending: '대기',
    generating: '생성 중...',
    done: '완료 ✓',
    error: '실패 ✗',
  };

  // 상태별 스타일
  const stateClasses = {
    pending: 'text-text-tertiary bg-bg-tertiary',
    generating: 'bg-[rgba(139,92,246,0.3)] text-accent-gemini animate-pulse',
    done: 'bg-[rgba(16,185,129,0.3)] text-accent-success',
    error: 'bg-[rgba(239,68,68,0.3)] text-accent-danger',
  };

  return (
    <div className="bg-bg-tertiary border border-accent-gemini rounded-[16px] p-5 mb-6 animate-[fadeIn_0.3s_ease]">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-base font-semibold text-text-primary">
          {title}
        </span>
        <span className="text-[1.1rem] font-bold text-accent-gemini">
          {completed}/{total}
        </span>
      </div>

      {/* 진행 바 */}
      <div className="h-2 bg-bg-primary rounded-full overflow-hidden mb-4">
        <div
          className="h-full rounded-full transition-[width] duration-300 ease-out"
          style={{
            width: `${percent}%`,
            background: 'var(--gradient-gemini)',
          }}
        />
      </div>

      {/* 섹션별 상태 */}
      <div className="flex flex-wrap gap-2">
        {generatedSections.map((section, i) => {
          const status = sectionStatuses[i] || 'pending';
          return (
            <div
              key={i}
              className="flex items-center gap-1.5 py-2 px-3.5 rounded-[10px] text-[0.8rem] font-medium border border-border-subtle bg-bg-primary text-text-tertiary transition-all duration-300"
            >
              {/* 섹션 번호 */}
              <span className="w-5 h-5 flex items-center justify-center bg-bg-tertiary rounded-full text-[0.7rem] font-semibold">
                {section.number}
              </span>
              {/* 섹션 이름 */}
              <span className="text-text-secondary max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
                {section.name}
              </span>
              {/* 상태 뱃지 */}
              <span
                className={`text-[0.7rem] py-0.5 px-2 rounded-full ${stateClasses[status] || stateClasses.pending}`}
              >
                {stateText[status] || '대기'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
