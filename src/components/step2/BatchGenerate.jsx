import ModelSelector from './ModelSelector';

/**
 * 전체 이미지 일괄 생성 컴포넌트
 * 원본 index.html lines 1020-1078 기반
 *
 * 접기/펼치기 가능한 <details> 요소 내부에
 * 모델 선택, 비율 선택, 전체 생성 버튼 포함
 *
 * @param {string} selectedModel - 현재 선택된 모델
 * @param {Function} onModelChange - 모델 변경 콜백
 * @param {string} selectedRatio - 현재 선택된 비율
 * @param {Function} onRatioChange - 비율 변경 콜백
 * @param {Function} onGenerateAll - 전체 생성 버튼 클릭 콜백
 * @param {boolean} isGenerating - 생성 진행 중 여부
 * @param {boolean} disabled - 버튼 비활성화 여부
 */
export default function BatchGenerate({
  selectedModel,
  onModelChange,
  selectedRatio,
  onRatioChange,
  onGenerateAll,
  isGenerating = false,
  disabled = false,
}) {
  return (
    <div className="mb-5">
      <details className="bg-bg-tertiary border border-border-subtle rounded-[16px]">
        <summary
          className="
            p-4 px-5 cursor-pointer text-[0.9rem] text-text-secondary
            list-none [&::-webkit-details-marker]:hidden
            hover:text-text-primary transition-colors duration-150
          "
        >
          &#x26A1; 전체 한 번에 생성하기 (선택)
        </summary>

        <div className="px-5 pb-5">
          {/* 경고 메시지 */}
          <p className="text-[0.8rem] text-accent-warning mb-4 p-2.5 bg-[rgba(245,158,11,0.1)] rounded-[6px]">
            &#x26A0;&#xFE0F; 8개 섹션을 연속 생성합니다. 고품질 모델은 시간이 오래 걸릴 수 있습니다.
          </p>

          {/* 모델 + 비율 선택 */}
          <ModelSelector
            selectedModel={selectedModel}
            onModelChange={onModelChange}
            selectedRatio={selectedRatio}
            onRatioChange={onRatioChange}
          />

          {/* 전체 생성 버튼 */}
          <button
            onClick={onGenerateAll}
            disabled={disabled || isGenerating}
            className={`
              inline-flex items-center gap-3 py-4 px-12
              border-none rounded-[16px] text-white font-semibold text-base
              cursor-pointer
              transition-all duration-250 ease-[cubic-bezier(0.4,0,0.2,1)]
              disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
              hover:enabled:-translate-y-0.5 hover:enabled:shadow-[0_0_60px_rgba(99,102,241,0.5)]
              w-full justify-center
            `}
            style={{
              background: 'var(--gradient-gemini)',
              boxShadow: 'var(--shadow-gemini)',
            }}
          >
            {isGenerating ? (
              <>
                <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                생성 중...
              </>
            ) : (
              <span>&#x1F34C; 전체 이미지 생성</span>
            )}
          </button>
        </div>
      </details>
    </div>
  );
}
