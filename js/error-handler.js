/**
 * Pierrot ファッションショップ - エラーハンドリング
 * 
 * アプリケーション全体のエラーハンドリングを統一管理します。
 */

class ErrorHandler {
    constructor() {
        this.errorCount = 0;
        this.maxErrors = 10; // 最大エラー数（無限ループ防止）
    }

    /**
     * エラーログを出力
     * @param {string} context - エラーが発生したコンテキスト
     * @param {Error|string} error - エラーオブジェクトまたはメッセージ
     * @param {Object} additionalInfo - 追加情報
     */
    log(context, error, additionalInfo = {}) {
        this.errorCount++;
        
        if (this.errorCount > this.maxErrors) {
            console.error('Too many errors, stopping error logging');
            return;
        }

        const errorMessage = error instanceof Error ? error.message : error;
        const timestamp = new Date().toISOString();
        
        console.error(`[${timestamp}] ${context}:`, {
            message: errorMessage,
            stack: error instanceof Error ? error.stack : undefined,
            additionalInfo,
            errorCount: this.errorCount
        });

        // 本番環境では外部エラー追跡サービスに送信
        if (window.CONFIG && !window.CONFIG.DEBUG && typeof window.gtag !== 'undefined') {
            window.gtag('event', 'exception', {
                description: `${context}: ${errorMessage}`,
                fatal: false
            });
        }
    }

    /**
     * 警告ログを出力
     * @param {string} context - 警告が発生したコンテキスト
     * @param {string} message - 警告メッセージ
     * @param {Object} additionalInfo - 追加情報
     */
    warn(context, message, additionalInfo = {}) {
        if (window.CONFIG && window.CONFIG.DEBUG) {
            console.warn(`[${context}] ${message}`, additionalInfo);
        }
    }

    /**
     * 情報ログを出力
     * @param {string} context - 情報のコンテキスト
     * @param {string} message - 情報メッセージ
     * @param {Object} additionalInfo - 追加情報
     */
    info(context, message, additionalInfo = {}) {
        if (window.CONFIG && window.CONFIG.DEBUG) {
            console.log(`[${context}] ${message}`, additionalInfo);
        }
    }

    /**
     * ユーザーに表示するエラーメッセージを生成
     * @param {string} context - エラーのコンテキスト
     * @param {Error|string} error - エラーオブジェクトまたはメッセージ
     * @returns {string} ユーザー向けエラーメッセージ
     */
    getUserMessage(context, error) {
        const errorMessages = {
            'PRODUCT_LOAD': '商品データの読み込みに失敗しました。しばらく時間をおいてから再度お試しください。',
            'IMAGE_LOAD': '画像の読み込みに失敗しました。',
            'NETWORK_ERROR': 'ネットワークエラーが発生しました。インターネット接続を確認してください。',
            'CSV_PARSE': '商品データの解析に失敗しました。',
            'UNKNOWN': '予期しないエラーが発生しました。'
        };

        return errorMessages[context] || errorMessages['UNKNOWN'];
    }

    /**
     * エラーカウンターをリセット
     */
    reset() {
        this.errorCount = 0;
    }

    /**
     * エラーが多すぎるかチェック
     * @returns {boolean} エラーが多すぎる場合true
     */
    hasTooManyErrors() {
        return this.errorCount > this.maxErrors;
    }
}

// グローバルエラーハンドラーインスタンス
window.errorHandler = new ErrorHandler();

// 未処理のエラーをキャッチ
window.addEventListener('error', (event) => {
    window.errorHandler.log('UNHANDLED_ERROR', event.error, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
    });
});

// 未処理のPromise拒否をキャッチ
window.addEventListener('unhandledrejection', (event) => {
    window.errorHandler.log('UNHANDLED_PROMISE_REJECTION', event.reason, {
        promise: event.promise
    });
});
