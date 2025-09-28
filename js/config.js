// 環境設定
const CONFIG = {
    // Google Sheets設定
    GOOGLE_SHEETS_URL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSWEfEH0eOxllBLT0rFbvTXC8aUE_Xgi0NtBmW_sp9gqSyGmCAsXttFQ2EHQULlQckiZKv42mFBTvVs/pub?output=csv',
    
    // Google Drive設定（複数のURL形式を試す）
    GOOGLE_DRIVE_URLS: [
        'https://drive.google.com/uc?export=view&id=',  // 直接表示用
        'https://drive.google.com/thumbnail?id=',       // サムネイル用
        'https://drive.google.com/file/d/{ID}/preview'  // プレビュー用
    ],
    // 代替画像URL（画像が表示できない場合用）
    FALLBACK_IMAGE_URL: 'https://via.placeholder.com/300x400?text=No+Image',
    
    // アプリケーション設定
    APP_NAME: 'Pierrot',
    APP_VERSION: '1.0.0',
    
    // 商品表示設定
    PRODUCTS_PER_PAGE: 12,
    IMAGE_QUALITY: 'high', // high, medium, low
    
    // キャッシュ設定
    CACHE_DURATION: 5 * 60 * 1000, // 5分
    
    // デバッグ設定
    DEBUG: true
};

// 環境変数から設定を読み込み（本番環境用）
if (typeof process !== 'undefined' && process.env) {
    CONFIG.GOOGLE_SHEETS_URL = process.env.GOOGLE_SHEETS_URL || CONFIG.GOOGLE_SHEETS_URL;
    CONFIG.GOOGLE_DRIVE_BASE_URL = process.env.GOOGLE_DRIVE_BASE_URL || CONFIG.GOOGLE_DRIVE_BASE_URL;
    CONFIG.APP_NAME = process.env.APP_NAME || CONFIG.APP_NAME;
    CONFIG.DEBUG = process.env.DEBUG === 'true' || CONFIG.DEBUG;
}
