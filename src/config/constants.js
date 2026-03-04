// ===== BACKEND & AUTH CONSTANTS =====
export const BACKEND_URL = 'https://detailcraft-backend.vercel.app';
export const AUTH_TOKEN_KEY = 'detailcraft_auth_token';
export const AUTH_USER_KEY = 'detailcraft_auth_user';

// ===== MODEL CONFIGURATIONS =====
export const MODEL_CONFIGS = {
    fast: {
        name: '⚡ 빠른 생성 (권장)',
        model: 'gemini-2.0-flash-exp-image-generation',
        timeout: 60000, // 60초
        config: {},
        description: '10~30초, 1K 해상도'
    },
    quality: {
        name: '🎨 고품질 (느림)',
        model: 'gemini-3-pro-image-preview',
        timeout: 180000, // 3분
        config: {
            imageConfig: {
                imageSize: '2K'
            }
        },
        description: '1~5분, 2K 해상도, 한글 개선'
    }
};

// 동적으로 aspectRatio 포함한 config 반환
export function getModelConfigWithRatio(baseConfig, selectedAspectRatio) {
    const config = { ...baseConfig };
    if (config.imageConfig) {
        config.imageConfig = { ...config.imageConfig, aspectRatio: selectedAspectRatio };
    } else {
        config.imageConfig = { aspectRatio: selectedAspectRatio };
    }
    return config;
}

// ===== PLATFORM CONFIGURATIONS (다운로드용) =====
export const PLATFORM_CONFIGS = [
    { name: '스마트스토어', folder: 'smartstore_860px', width: 860 },
    { name: '쿠팡', folder: 'coupang_780px', width: 780 },
    { name: '11번가', folder: '11st_800px', width: 800 },
    { name: 'G마켓_옥션', folder: 'gmarket_auction_860px', width: 860 }
];
