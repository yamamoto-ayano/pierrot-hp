// 環境設定
const CONFIG = {
    // Google Sheets設定
    GOOGLE_SHEETS_URL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSWEfEH0eOxllBLT0rFbvTXC8aUE_Xgi0NtBmW_sp9gqSyGmCAsXttFQ2EHQULlQckiZKv42mFBTvVs/pub?output=csv',
    
    // Google Drive設定
    GOOGLE_DRIVE_BASE_URL: 'https://drive.google.com/uc?export=view&id=',
    
    // アプリケーション設定
    APP_NAME: 'Pierrot',
    APP_VERSION: '1.0.0',
    
    // 商品表示設定
    PRODUCTS_PER_PAGE: 12,
    IMAGE_QUALITY: 'high', // high, medium, low
    
    // キャッシュ設定
    CACHE_DURATION: 5 * 60 * 1000, // 5分
    
    // デバッグ設定
    DEBUG: false
};

// 環境変数から設定を読み込み（本番環境用）
if (typeof process !== 'undefined' && process.env) {
    CONFIG.GOOGLE_SHEETS_URL = process.env.GOOGLE_SHEETS_URL || CONFIG.GOOGLE_SHEETS_URL;
    CONFIG.GOOGLE_DRIVE_BASE_URL = process.env.GOOGLE_DRIVE_BASE_URL || CONFIG.GOOGLE_DRIVE_BASE_URL;
    CONFIG.APP_NAME = process.env.APP_NAME || CONFIG.APP_NAME;
    CONFIG.DEBUG = process.env.DEBUG === 'true' || CONFIG.DEBUG;
}