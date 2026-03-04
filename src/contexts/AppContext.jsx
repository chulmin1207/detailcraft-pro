/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useCallback, useContext } from 'react';

const AppContext = createContext(null);

// useBackend는 항상 true (상수)
const USE_BACKEND = true;

export function AppProvider({ children }) {
  // ===== API 키 =====
  const [claudeApiKey, setClaudeApiKey] = useState(
    () => localStorage.getItem('detailcraft_claude_key') || ''
  );
  const [geminiApiKey, setGeminiApiKey] = useState(
    () => localStorage.getItem('detailcraft_gemini_key') || ''
  );

  // ===== 위저드 스텝 =====
  const [currentStep, setCurrentStep] = useState(1);

  // ===== 기획서 / 섹션 =====
  const [generatedPlan, setGeneratedPlan] = useState('');
  const [generatedSections, setGeneratedSections] = useState([]);

  // ===== 이미지 =====
  const [uploadedImages, setUploadedImages] = useState({
    product: [],
    package: [],
    references: []
  });
  const [sectionReferences, setSectionReferences] = useState({});
  const [generatedImages, setGeneratedImages] = useState({});

  // ===== 모델 / 비율 =====
  const [selectedModel, setSelectedModelState] = useState(
    () => localStorage.getItem('detailcraft_model') || 'fast'
  );
  const [selectedAspectRatio, setSelectedAspectRatioState] = useState(
    () => localStorage.getItem('detailcraft_aspect_ratio') || '3:4'
  );

  // ===== 폼 입력 =====
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [productFeatures, setProductFeatures] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // ===== Step 3 재생성 상태 =====
  const [step3References, setStep3References] = useState({});
  const [step3Prompts, setStep3Prompts] = useState({});
  const [step3Models, setStep3Models] = useState({});
  const [step3IncludeOptions, setStep3IncludeOptions] = useState({});

  // ===== 레퍼런스 강도 =====
  const [refStrength, setRefStrength] = useState('strong');

  // ===== 스텝 네비게이션 =====
  const canNavigateToStep = useCallback((step) => {
    if (step === 1) return true;
    if (step === 2) return generatedSections.length > 0;
    if (step === 3) {
      const hasAnyImage = Object.values(generatedImages).some((img) => img && !img.error);
      return hasAnyImage;
    }
    return false;
  }, [generatedSections, generatedImages]);

  const goToStep = useCallback((step) => {
    if (step < 1 || step > 3) return;
    setCurrentStep(step);
  }, []);

  // ===== 모델 선택 (localStorage 저장) =====
  const setSelectedModel = useCallback((model) => {
    setSelectedModelState(model);
    localStorage.setItem('detailcraft_model', model);
  }, []);

  // ===== 비율 선택 (localStorage 저장) =====
  const setAspectRatio = useCallback((ratio) => {
    setSelectedAspectRatioState(ratio);
    localStorage.setItem('detailcraft_aspect_ratio', ratio);
  }, []);

  // ===== API 키 저장 =====
  const saveApiKeys = useCallback((claude, gemini) => {
    setClaudeApiKey(claude);
    setGeminiApiKey(gemini);
    if (claude) localStorage.setItem('detailcraft_claude_key', claude);
    if (gemini) localStorage.setItem('detailcraft_gemini_key', gemini);
  }, []);

  // ===== API 키 삭제 =====
  const clearApiKeys = useCallback(() => {
    setClaudeApiKey('');
    setGeminiApiKey('');
    localStorage.removeItem('detailcraft_claude_key');
    localStorage.removeItem('detailcraft_gemini_key');
  }, []);

  const value = {
    // 상수
    useBackend: USE_BACKEND,

    // API 키
    claudeApiKey,
    geminiApiKey,
    saveApiKeys,
    clearApiKeys,

    // 위저드 스텝
    currentStep,
    goToStep,
    canNavigateToStep,

    // 기획서 / 섹션
    generatedPlan,
    setGeneratedPlan,
    generatedSections,
    setGeneratedSections,

    // 이미지
    uploadedImages,
    setUploadedImages,
    sectionReferences,
    setSectionReferences,
    generatedImages,
    setGeneratedImages,

    // 모델 / 비율
    selectedModel,
    setSelectedModel,
    selectedAspectRatio,
    setAspectRatio,

    // 폼 입력
    productName,
    setProductName,
    category,
    setCategory,
    priceRange,
    setPriceRange,
    targetAudience,
    setTargetAudience,
    productFeatures,
    setProductFeatures,
    additionalNotes,
    setAdditionalNotes,

    // Step 3 재생성
    step3References,
    setStep3References,
    step3Prompts,
    setStep3Prompts,
    step3Models,
    setStep3Models,
    step3IncludeOptions,
    setStep3IncludeOptions,

    // 레퍼런스 강도
    refStrength,
    setRefStrength
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
