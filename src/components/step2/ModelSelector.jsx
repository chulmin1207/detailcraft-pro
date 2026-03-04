import { useId } from 'react';

/**
 * 모델 및 비율 선택 컴포넌트
 * 원본 index.html lines 260-283 (모델 선택 UI), 1027-1071 (배치 생성 내 모델/비율 선택) 기반
 *
 * @param {string} selectedModel - 현재 선택된 모델 ('fast' | 'quality')
 * @param {Function} onModelChange - 모델 변경 콜백
 * @param {string} selectedRatio - 현재 선택된 비율 ('1:1' | '3:4' | '4:3' | '9:16' | '16:9')
 * @param {Function} onRatioChange - 비율 변경 콜백 (null이면 비율 선택 미표시)
 * @param {boolean} compact - 컴팩트 모드 (섹션 내 인라인 표시용)
 */

const ASPECT_RATIOS = [
  { value: '1:1', label: '1:1', desc: '정사각' },
  { value: '3:4', label: '3:4', desc: '세로' },
  { value: '4:3', label: '4:3', desc: '가로' },
  { value: '9:16', label: '9:16', desc: '세로길게' },
  { value: '16:9', label: '16:9', desc: '배너' },
];

export default function ModelSelector({
  selectedModel,
  onModelChange,
  selectedRatio,
  onRatioChange,
  compact = false,
}) {
  const id = useId();

  // 컴팩트 모드: 섹션별 인라인 모델 선택 (비율 없이 라디오만)
  if (compact) {
    return (
      <div className="flex gap-2 mb-3">
        {/* 빠른 생성 */}
        <label className="flex-1 cursor-pointer">
          <input
            type="radio"
            name={`sectionModel-${id}`}
            value="fast"
            checked={selectedModel === 'fast'}
            onChange={() => onModelChange('fast')}
            className="hidden peer"
          />
          <span
            className={`
              block py-2.5 px-3 bg-bg-primary border-2 rounded-[10px] text-[0.8rem] text-center
              transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]
              ${selectedModel === 'fast'
                ? 'border-accent-gemini bg-[rgba(139,92,246,0.15)] text-accent-gemini font-semibold'
                : 'border-border-subtle hover:border-border-strong'
              }
            `}
          >
            &#x26A1; &#xBE60;&#xB984; (10~30&#xCD08;)
          </span>
        </label>

        {/* 고품질 */}
        <label className="flex-1 cursor-pointer">
          <input
            type="radio"
            name={`sectionModel-${id}`}
            value="quality"
            checked={selectedModel === 'quality'}
            onChange={() => onModelChange('quality')}
            className="hidden peer"
          />
          <span
            className={`
              block py-2.5 px-3 bg-bg-primary border-2 rounded-[10px] text-[0.8rem] text-center
              transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]
              ${selectedModel === 'quality'
                ? 'border-accent-gemini bg-[rgba(139,92,246,0.15)] text-accent-gemini font-semibold'
                : 'border-border-subtle hover:border-border-strong'
              }
            `}
          >
            &#x1F3A8; &#xACE0;&#xD488;&#xC9C8; (1~5&#xBD84;)
          </span>
        </label>
      </div>
    );
  }

  // 풀 모드: 모델 선택 + 비율 선택
  return (
    <div className="bg-bg-tertiary border border-border-subtle rounded-[16px] p-5 mb-5 text-left">
      {/* 모델 선택 */}
      <span className="block text-[0.9rem] font-semibold mb-3 text-text-primary">
        모델 선택
      </span>
      <div className="flex gap-3 flex-wrap">
        {/* 빠른 생성 */}
        <label className="flex-1 min-w-[200px] cursor-pointer">
          <input
            type="radio"
            value="fast"
            checked={selectedModel === 'fast'}
            onChange={() => onModelChange('fast')}
            className="hidden peer"
          />
          <div
            className={`
              p-4 bg-bg-primary border-2 rounded-[10px]
              transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]
              ${selectedModel === 'fast'
                ? 'border-accent-gemini bg-[rgba(139,92,246,0.1)]'
                : 'border-border-subtle hover:border-border-strong'
              }
            `}
          >
            <span className="block font-semibold text-[0.95rem] mb-1 text-text-primary">
              &#x26A1; &#xBE60;&#xB978; &#xC0DD;&#xC131;
            </span>
            <span className="block text-[0.75rem] text-text-tertiary">
              10~30&#xCD08;/&#xC139;&#xC158;
            </span>
          </div>
        </label>

        {/* 고품질 */}
        <label className="flex-1 min-w-[200px] cursor-pointer">
          <input
            type="radio"
            value="quality"
            checked={selectedModel === 'quality'}
            onChange={() => onModelChange('quality')}
            className="hidden peer"
          />
          <div
            className={`
              p-4 bg-bg-primary border-2 rounded-[10px]
              transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]
              ${selectedModel === 'quality'
                ? 'border-accent-gemini bg-[rgba(139,92,246,0.1)]'
                : 'border-border-subtle hover:border-border-strong'
              }
            `}
          >
            <span className="block font-semibold text-[0.95rem] mb-1 text-text-primary">
              &#x1F3A8; &#xACE0;&#xD488;&#xC9C8;
            </span>
            <span className="block text-[0.75rem] text-text-tertiary">
              1~5&#xBD84;/&#xC139;&#xC158;
            </span>
          </div>
        </label>
      </div>

      {/* 비율 선택 */}
      {onRatioChange && (
        <div className="mt-4">
          <label className="block text-[0.85rem] font-semibold mb-2 text-text-primary">
            &#x1F4D0; &#xC774;&#xBBF8;&#xC9C0; &#xBE44;&#xC728;
          </label>
          <div className="flex gap-1.5">
            {ASPECT_RATIOS.map((ratio) => (
              <label key={ratio.value} className="flex-1 cursor-pointer">
                <input
                  type="radio"
                  value={ratio.value}
                  checked={selectedRatio === ratio.value}
                  onChange={() => onRatioChange(ratio.value)}
                  className="hidden peer"
                />
                <div
                  className={`
                    py-2 px-1 bg-bg-primary border-2 rounded-[10px] text-center
                    transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]
                    ${selectedRatio === ratio.value
                      ? 'border-accent-gemini bg-[rgba(139,92,246,0.1)]'
                      : 'border-border-subtle hover:border-border-strong'
                    }
                  `}
                >
                  <span className="block font-bold text-[0.8rem] text-text-primary">
                    {ratio.label}
                  </span>
                  <span className="block text-[0.6rem] text-text-tertiary">
                    {ratio.desc}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
