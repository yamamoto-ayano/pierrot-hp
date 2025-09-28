/**
 * Pierrot ファッションショップ - 設定管理
 * 
 * このファイルはアプリケーション全体の設定を管理します。
 * 環境変数による設定の上書きに対応しています。
 */

// デフォルト設定
const DEFAULT_CONFIG = {
    // Google Sheets設定
    GOOGLE_SHEETS_URL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSWEfEH0eOxllBLT0rFbvTXC8aUE_Xgi0NtBmW_sp9gqSyGmCAsXttFQ2EHQULlQckiZKv42mFBTvVs/pub?output=csv',
    
    // Google Drive設定
    GOOGLE_DRIVE_BASE_URL: 'https://drive.google.com/uc?export=view&id=',
    GOOGLE_DRIVE_URLS: [
        'https://drive.google.com/uc?export=view&id=',        // 直接表示用（推奨）
        'https://drive.google.com/thumbnail?id=',             // サムネイル用
        'https://drive.google.com/uc?id=',                    // 代替表示用
        'https://drive.google.com/file/d/{ID}/preview',       // プレビュー用
        'https://drive.usercontent.google.com/download?id='   // ダウンロード用
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
    
    // デバッグ設定（本番環境では false に設定）
    DEBUG: false
};

// 環境変数から設定を読み込み
function loadConfigFromEnv() {
    const config = { ...DEFAULT_CONFIG };
    
    // 環境変数が利用可能な場合（Node.js環境など）
    if (typeof process !== 'undefined' && process.env) {
        config.GOOGLE_SHEETS_URL = process.env.GOOGLE_SHEETS_URL || config.GOOGLE_SHEETS_URL;
        config.GOOGLE_DRIVE_BASE_URL = process.env.GOOGLE_DRIVE_BASE_URL || config.GOOGLE_DRIVE_BASE_URL;
        config.APP_NAME = process.env.APP_NAME || config.APP_NAME;
        config.DEBUG = process.env.DEBUG === 'true' || config.DEBUG;
    }
    
    // ブラウザ環境での設定上書き（URLパラメータなど）
    if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('debug')) {
            config.DEBUG = urlParams.get('debug') === 'true';
        }
    }
    
    return config;
}

// グローバル設定を初期化
window.CONFIG = window.CONFIG || loadConfigFromEnv();

// 後方互換性のため、CONFIGも定義
if (typeof CONFIG === 'undefined') {
    window.CONFIG = window.CONFIG;
}
