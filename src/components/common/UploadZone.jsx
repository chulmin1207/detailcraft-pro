import { useRef, useState, useCallback } from 'react';
import ImagePreview from './ImagePreview';

/**
 * 재사용 가능한 이미지 업로드 영역 컴포넌트
 * 원본 index.html lines 239-254 (.upload-zone, .upload-icon, .upload-text, .upload-hint) 기반
 *
 * useImageUpload 훅의 기능을 내장:
 * - 클릭으로 파일 선택
 * - 드래그 앤 드롭
 * - Ctrl+V 클립보드 붙여넣기 (포커스 상태)
 * - 포커스 시 .focused 클래스 적용 (index.css에 정의된 borderRotate 애니메이션)
 *
 * @param {string[]} images - 업로드된 이미지 base64 배열
 * @param {Function} onAdd - 새 이미지 추가 콜백 (newImages: string[]) => void
 * @param {Function} onRemove - 이미지 제거 콜백 (index: number) => void
 * @param {number} maxCount - 최대 업로드 이미지 수 (기본 5)
 * @param {string} icon - 업로드 아이콘 이모지
 * @param {string} text - 업로드 안내 텍스트
 * @param {string} hint - 보조 힌트 텍스트
 */
export default function UploadZone({
  images = [],
  onAdd,
  onRemove,
  maxCount = 5,
  icon = '\uD83D\uDCE4',
  text = '\uC774\uBBF8\uC9C0\uB97C \uB4DC\uB798\uADF8\uD558\uAC70\uB098 \uD074\uB9AD\uD558\uC138\uC694',
  hint = 'JPG, PNG, WebP (\uCD5C\uB300 10MB)',
}) {
  const inputRef = useRef(null);
  const [dragover, setDragover] = useState(false);
  const [focused, setFocused] = useState(false);

  // 파일 읽기 및 base64 변환
  const readFiles = useCallback((files) => {
    const remaining = maxCount - images.length;
    if (remaining <= 0) return;

    const validFiles = Array.from(files)
      .filter((f) => f.type.startsWith('image/'))
      .slice(0, remaining);

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        onAdd?.([e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  }, [images.length, maxCount, onAdd]);

  // 클릭 핸들러: 파일 선택 열기
  const handleClick = () => {
    inputRef.current?.click();
  };

  // 파일 input 변경 핸들러
  const handleChange = (e) => {
    if (e.target.files?.length) {
      readFiles(e.target.files);
      e.target.value = '';
    }
  };

  // 드래그 이벤트
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragover(true);
  };

  const handleDragLeave = () => {
    setDragover(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragover(false);
    if (e.dataTransfer.files?.length) {
      readFiles(e.dataTransfer.files);
    }
  };

  // 포커스/블러
  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(false);

  // 클립보드 붙여넣기 (포커스 상태에서만)
  const handlePaste = useCallback((e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    const imageFiles = [];
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        imageFiles.push(item.getAsFile());
      }
    }
    if (imageFiles.length > 0) {
      e.preventDefault();
      readFiles(imageFiles);
    }
  }, [readFiles]);

  const hasImages = images.length > 0;

  return (
    <div>
      {/* upload-zone 영역 */}
      <div
        tabIndex={0}
        role="button"
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onPaste={handlePaste}
        className={[
          'upload-zone',
          'min-h-[120px] border-2 border-dashed rounded-[16px] p-8 text-center cursor-pointer',
          'transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]',
          'bg-bg-tertiary outline-none',
          dragover
            ? 'border-accent-primary bg-[rgba(99,102,241,0.1)]'
            : 'border-border-default',
          hasImages ? '!border-solid !border-accent-success' : '',
          !dragover && !hasImages
            ? 'hover:border-accent-primary hover:bg-[rgba(99,102,241,0.05)]'
            : '',
          focused ? 'focused' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {/* 안내 UI */}
        <div className="text-[2.5rem] mb-3">{icon}</div>
        <p className="text-text-secondary text-sm mb-2">{text}</p>
        <p className="text-text-tertiary text-xs">{hint}</p>
      </div>

      {/* 숨겨진 file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={handleChange}
      />

      {/* 이미지 미리보기 */}
      {hasImages && (
        <ImagePreview images={images} onRemove={onRemove} />
      )}
    </div>
  );
}
