/**
 * 진행 상태 바 컴포넌트
 * 원본 index.html lines 345-358 (.progress-section, .progress-bar, .progress-fill, .progress-log) 기반
 *
 * @param {number} percent - 진행률 (0~100)
 * @param {'primary' | 'gemini'} variant - 그라데이션 스타일 (primary: 인디고-핑크, gemini: 보라-핑크-노랑)
 * @param {string} label - 상단 좌측 라벨 텍스트
 * @param {boolean} showLog - 하단 로그 영역 표시 여부
 * @param {Array<{message: string, type: string}>} logs - 로그 항목 배열
 */
export default function ProgressBar({
  percent = 0,
  variant = 'primary',
  label,
  showLog = false,
  logs = [],
}) {
  const clampedPercent = Math.min(100, Math.max(0, percent));

  // variant에 따른 프로그레스 바 그라데이션
  const fillBackground =
    variant === 'gemini'
      ? 'var(--gradient-gemini)'
      : 'var(--gradient-primary)';

  return (
    <div className="mt-6 p-6 bg-bg-secondary border border-border-subtle rounded-[24px]">
      {/* progress-header */}
      <div className="flex justify-between mb-3">
        <span className="font-medium text-[0.9rem] text-text-primary">
          {label || '\uC9C4\uD589 \uC911...'}
        </span>
        <span className="text-accent-primary-hover font-semibold">
          {clampedPercent}%
        </span>
      </div>

      {/* progress-bar */}
      <div className="h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-[width] duration-500 ease-out"
          style={{
            width: `${clampedPercent}%`,
            background: fillBackground,
          }}
        />
      </div>

      {/* progress-log */}
      {showLog && logs.length > 0 && (
        <div className="mt-4 p-3 bg-bg-tertiary rounded-[10px] max-h-[150px] overflow-y-auto font-mono text-xs text-text-secondary">
          {logs.map((log, idx) => {
            let colorClass = '';
            if (log.type === 'success') colorClass = 'text-accent-success';
            else if (log.type === 'error') colorClass = 'text-accent-danger';
            else if (log.type === 'info') colorClass = 'text-accent-primary-hover';

            return (
              <div
                key={idx}
                className={`py-1 border-b border-border-subtle last:border-b-0 ${colorClass}`}
              >
                {log.message}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
