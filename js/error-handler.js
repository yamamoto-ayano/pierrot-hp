/**
 * Pierrot ファッションショップ - エラーハンドリング
 */
class ErrorHandler {
    constructor() {
        this.errorCount = 0;
        this.maxErrors = 10;
    }

    log(context, error, additionalInfo = {}) {
        this.errorCount++;
        
        if (this.errorCount > this.maxErrors) {
            console.error('Too many errors, stopping error logging');
            return;
        }

        const errorMessage = error instanceof Error ? error.message : error;
        console.error(`[${context}] ${errorMessage}`, additionalInfo);
    }

    warn(context, message, additionalInfo = {}) {
        if (window.CONFIG?.DEBUG) {
            console.warn(`[${context}] ${message}`, additionalInfo);
        }
    }

    info(context, message, additionalInfo = {}) {
        if (window.CONFIG?.DEBUG) {
            console.log(`[${context}] ${message}`, additionalInfo);
        }
    }

    getUserMessage(context) {
        const messages = {
            'PRODUCT_LOAD': '商品データの読み込みに失敗しました。',
            'IMAGE_LOAD': '画像の読み込みに失敗しました。',
            'NETWORK_ERROR': 'ネットワークエラーが発生しました。',
            'UNKNOWN': '予期しないエラーが発生しました。'
        };
        return messages[context] || messages['UNKNOWN'];
    }
}

// グローバルエラーハンドラー
window.errorHandler = new ErrorHandler();

// 未処理エラーのキャッチ
window.addEventListener('error', (event) => {
    window.errorHandler.log('UNHANDLED_ERROR', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    window.errorHandler.log('UNHANDLED_PROMISE_REJECTION', event.reason);
});
