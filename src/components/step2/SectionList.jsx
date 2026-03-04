import { useApp } from '../../contexts/AppContext';
import SectionEditor from './SectionEditor';

/**
 * 섹션 목록 컴포넌트
 * generatedSections 배열을 SectionEditor 컴포넌트로 매핑
 *
 * 원본 index.html lines 994-1006 (섹션별 레퍼런스 이미지 카드) +
 * renderSectionsEditor (lines 2510-2594) 기반
 */
export default function SectionList() {
  const { generatedSections } = useApp();

  if (!generatedSections || generatedSections.length === 0) {
    return null;
  }

  return (
    <div className="bg-bg-secondary border border-border-subtle rounded-[24px] overflow-hidden mb-6">
      {/* 카드 헤더 */}
      <div className="px-6 py-[18px] border-b border-border-subtle flex justify-between items-center">
        <h2 className="text-base font-semibold flex items-center gap-2.5">
          <span>&#x1F5BC;&#xFE0F;</span> 섹션별 레퍼런스 이미지
        </h2>
        <span className="px-2.5 py-1 bg-[rgba(99,102,241,0.1)] text-accent-primary-hover rounded-full text-[0.7rem]">
          선택
        </span>
      </div>

      {/* 카드 바디 */}
      <div className="p-6">
        <p className="text-text-secondary text-sm mb-5">
          각 섹션에 개별 레퍼런스를 추가하면 더 정교한 이미지가 생성됩니다. (미설정 시 전체 레퍼런스 적용)
        </p>

        {/* 섹션 에디터 목록 */}
        <div className="flex flex-col gap-4">
          {generatedSections.map((section, index) => (
            <SectionEditor
              key={`section-${section.number}-${index}`}
              section={section}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
