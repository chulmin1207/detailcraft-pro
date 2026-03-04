import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider, useApp } from './contexts/AppContext';
import { ToastProvider } from './contexts/ToastContext';

import LoginScreen from './components/auth/LoginScreen';
import BgEffects from './components/layout/BgEffects';
import Header from './components/layout/Header';
import StepNav from './components/layout/StepNav';
import Toast from './components/common/Toast';
import ApiKeyModal from './components/modals/ApiKeyModal';

import Step1 from './components/step1/Step1';
import Step2 from './components/step2/Step2';
import Step3 from './components/step3/Step3';

import { useState } from 'react';

function MainApp() {
  const { currentUser } = useAuth();
  const { currentStep, useBackend, geminiApiKey } = useApp();
  const [apiModalOpen, setApiModalOpen] = useState(false);

  const hasApi = useBackend || geminiApiKey;

  if (!currentUser) {
    return <LoginScreen />;
  }

  return (
    <>
      <BgEffects />

      <Header onOpenApiSettings={() => setApiModalOpen(true)} />

      <div className="relative z-[2] max-w-[1100px] mx-auto px-6 py-10 max-md:px-4 max-md:py-6">
        <StepNav />

        {!hasApi && (
          <div className="text-center p-5 bg-accent-warning/10 border border-accent-warning/30 rounded-[16px] mb-6">
            <p className="text-accent-warning mb-3 text-[0.9rem]">
              API 키가 설정되지 않았습니다. 기획서 생성과 이미지 생성을 위해 API 키를 설정해주세요.
            </p>
            <button
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-primary text-white rounded-[10px] border-none cursor-pointer font-medium text-[0.875rem] hover:bg-accent-primary-hover transition-all duration-150"
              onClick={() => setApiModalOpen(true)}
            >
              API 키 설정하기
            </button>
          </div>
        )}

        {currentStep === 1 && <Step1 />}
        {currentStep === 2 && <Step2 />}
        {currentStep === 3 && <Step3 />}
      </div>

      <ApiKeyModal isOpen={apiModalOpen} onClose={() => setApiModalOpen(false)} />
      <Toast />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <AppProvider>
            <MainApp />
          </AppProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
