import { useApp } from '../../contexts/AppContext';
import ImageCard from './ImageCard';

/**
 * 이미지 그리드 컴포넌트
 * 원본 index.html line 389 (.images-grid) 기반
 *
 * generatedSections 배열을 순회하며 ImageCard를 렌더링한다.
 * 반응형: 기본 auto-fill(최소 280px), 모바일 1컬럼.
 */
export default function ImageGrid({ onRegenerate }) {
  const { generatedSections } = useApp();

  if (!generatedSections || generatedSections.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5 max-md:grid-cols-1">
      {generatedSections.map((section, i) => (
        <ImageCard
          key={`${section.number}-${i}`}
          index={i}
          section={section}
          onRegenerate={onRegenerate}
        />
      ))}
    </div>
  );
}
