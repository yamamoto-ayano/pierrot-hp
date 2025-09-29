/**
 * Pierrot ファッションショップ - 設定管理
 */
const DEFAULT_CONFIG = {
    // Google Sheets設定
    GOOGLE_SHEETS_URL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSWEfEH0eOxllBLT0rFbvTXC8aUE_Xgi0NtBmW_sp9gqSyGmCAsXttFQ2EHQULlQckiZKv42mFBTvVs/pub?output=csv',
    
    // Google Drive設定（成功したURL形式のみ使用）
    GOOGLE_DRIVE_BASE_URL: 'https://drive.google.com/uc?export=view&id=',
    
    // 代替画像URL
    FALLBACK_IMAGE_URL: 'https://via.placeholder.com/300x400?text=No+Image',
    
    // アプリケーション設定
    APP_NAME: 'Pierrot',
    APP_VERSION: '1.0.0',
    
    // 商品表示設定
    PRODUCTS_PER_PAGE: 12,
    
    // キャッシュ設定（5分）
    CACHE_DURATION: 5 * 60 * 1000,
    
    // デバッグ設定
    DEBUG: false
};

// 設定を初期化
function initConfig() {
    const config = { ...DEFAULT_CONFIG };
    
    // 環境変数から上書き
    if (typeof process !== 'undefined' && process.env) {
        config.GOOGLE_SHEETS_URL = process.env.GOOGLE_SHEETS_URL || config.GOOGLE_SHEETS_URL;
        config.GOOGLE_DRIVE_BASE_URL = process.env.GOOGLE_DRIVE_BASE_URL || config.GOOGLE_DRIVE_BASE_URL;
        config.APP_NAME = process.env.APP_NAME || config.APP_NAME;
        config.DEBUG = process.env.DEBUG === 'true' || config.DEBUG;
    }
    
    // URLパラメータでデバッグモード切り替え
    if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('debug')) {
            config.DEBUG = urlParams.get('debug') === 'true';
        }
    }
    
    return config;
}

// グローバル設定を初期化
window.CONFIG = window.CONFIG || initConfig();
