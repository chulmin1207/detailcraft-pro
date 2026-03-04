/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { BACKEND_URL, AUTH_TOKEN_KEY, AUTH_USER_KEY } from '../config/constants';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // 페이지 로드 시 인증 체크
  const checkAuth = useCallback(async () => {
    setAuthLoading(true);
    setAuthError(null);

    // URL에서 토큰 또는 에러 확인
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    const errorFromUrl = urlParams.get('error');

    // URL 정리 (토큰/에러 파라미터 제거)
    if (tokenFromUrl || errorFromUrl) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // 에러 처리
    if (errorFromUrl) {
      const errorMessages = {
        'auth_denied': '로그인이 취소되었습니다.',
        'invalid_domain': 'snack24h.com 계정으로만 로그인 가능합니다.',
        'token_exchange_failed': '인증 처리 중 오류가 발생했습니다.',
        'user_info_failed': '사용자 정보를 가져올 수 없습니다.',
        'server_error': '서버 오류가 발생했습니다. 다시 시도해주세요.'
      };
      setAuthError(errorMessages[errorFromUrl] || '알 수 없는 오류가 발생했습니다.');
      setAuthLoading(false);
      return;
    }

    // URL에서 받은 토큰 저장
    if (tokenFromUrl) {
      localStorage.setItem(AUTH_TOKEN_KEY, tokenFromUrl);
    }

    // 저장된 토큰 확인
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    if (!token) {
      // 토큰 없음 - 로그인 필요
      setAuthLoading(false);
      return;
    }

    try {
      // 백엔드에서 토큰 검증
      const response = await fetch(`${BACKEND_URL}/api/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.valid) {
        // 로그인 성공
        setCurrentUser(data.user);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
      } else {
        // 토큰 무효
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_USER_KEY);
        setAuthError(
          data.error === 'Token expired'
            ? '세션이 만료되었습니다. 다시 로그인해주세요.'
            : '인증에 실패했습니다. 다시 로그인해주세요.'
        );
      }
    } catch (error) {
      console.error('Auth verification error:', error);
      // 네트워크 오류 시에도 저장된 유저 정보로 임시 허용 (오프라인 대응)
      const savedUser = localStorage.getItem(AUTH_USER_KEY);
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      } else {
        setAuthError('서버에 연결할 수 없습니다. 다시 시도해주세요.');
      }
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Google 로그인 시작
  const startGoogleLogin = useCallback(() => {
    window.location.href = `${BACKEND_URL}/api/auth/login`;
  }, []);

  // 로그아웃
  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    setCurrentUser(null);
    setAuthError(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        authLoading,
        authError,
        startGoogleLogin,
        logout,
        checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
