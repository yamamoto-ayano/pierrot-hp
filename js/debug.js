/**
 * Pierrot ファッションショップ - デバッグ機能
 * 
 * 開発・デバッグ用の機能を提供します。
 * 本番環境では自動的に無効化されます。
 */

class DebugManager {
    constructor() {
        this.isEnabled = window.CONFIG?.DEBUG || false;
        this.logs = [];
        this.maxLogs = 100;
    }

    /**
     * デバッグログを出力
     * @param {string} context - コンテキスト
     * @param {string} message - メッセージ
     * @param {any} data - データ
     */
    log(context, message, data = null) {
        if (!this.isEnabled) return;

        const logEntry = {
            timestamp: new Date().toISOString(),
            context,
            message,
            data: data ? JSON.parse(JSON.stringify(data)) : null
        };

        this.logs.push(logEntry);
        
        // ログ数を制限
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }

        console.log(`[DEBUG:${context}] ${message}`, data || '');
    }

    /**
     * 警告ログを出力
     * @param {string} context - コンテキスト
     * @param {string} message - メッセージ
     * @param {any} data - データ
     */
    warn(context, message, data = null) {
        if (!this.isEnabled) return;

        const logEntry = {
            timestamp: new Date().toISOString(),
            context,
            message,
            data: data ? JSON.parse(JSON.stringify(data)) : null,
            level: 'WARN'
        };

        this.logs.push(logEntry);
        console.warn(`[WARN:${context}] ${message}`, data || '');
    }

    /**
     * エラーログを出力
     * @param {string} context - コンテキスト
     * @param {string} message - メッセージ
     * @param {any} data - データ
     */
    error(context, message, data = null) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            context,
            message,
            data: data ? JSON.parse(JSON.stringify(data)) : null,
            level: 'ERROR'
        };

        this.logs.push(logEntry);
        console.error(`[ERROR:${context}] ${message}`, data || '');
    }

    /**
     * パフォーマンス測定を開始
     * @param {string} label - ラベル
     * @returns {string} 測定ID
     */
    timeStart(label) {
        if (!this.isEnabled) return null;
        
        const id = `${label}_${Date.now()}`;
        console.time(id);
        return id;
    }

    /**
     * パフォーマンス測定を終了
     * @param {string} id - 測定ID
     */
    timeEnd(id) {
        if (!this.isEnabled || !id) return;
        console.timeEnd(id);
    }

    /**
     * 画像URLをテスト
     * @param {string} fileId - ファイルID
     * @returns {Promise<Object>} テスト結果
     */
    async testImageUrl(fileId) {
        if (!this.isEnabled) return null;

        this.log('IMAGE_TEST', `Testing image URL for file ID: ${fileId}`);
        
        const urls = productManager.getAllImageUrls(fileId);
        const results = [];

        for (let i = 0; i < urls.length; i++) {
            const url = urls[i];
            const result = await this.testSingleImageUrl(url, i + 1);
            results.push(result);
        }

        this.log('IMAGE_TEST', 'Image URL test completed', { fileId, results });
        return { fileId, results };
    }

    /**
     * 単一の画像URLをテスト
     * @param {string} url - 画像URL
     * @param {number} index - インデックス
     * @returns {Promise<Object>} テスト結果
     */
    testSingleImageUrl(url, index) {
        return new Promise((resolve) => {
            const img = new Image();
            const startTime = Date.now();
            
            img.onload = () => {
                const loadTime = Date.now() - startTime;
                resolve({
                    url,
                    index,
                    success: true,
                    loadTime,
                    dimensions: { width: img.width, height: img.height }
                });
            };
            
            img.onerror = () => {
                const loadTime = Date.now() - startTime;
                resolve({
                    url,
                    index,
                    success: false,
                    loadTime,
                    error: 'Failed to load image'
                });
            };
            
            img.src = url;
        });
    }

    /**
     * ログを取得
     * @param {string} level - ログレベル（オプション）
     * @returns {Array} ログエントリの配列
     */
    getLogs(level = null) {
        if (level) {
            return this.logs.filter(log => log.level === level);
        }
        return [...this.logs];
    }

    /**
     * ログをクリア
     */
    clearLogs() {
        this.logs = [];
    }

    /**
     * ログをエクスポート
     * @returns {string} JSON形式のログ
     */
    exportLogs() {
        return JSON.stringify(this.logs, null, 2);
    }

    /**
     * デバッグ情報を表示
     */
    showDebugInfo() {
        if (!this.isEnabled) {
            console.log('Debug mode is disabled');
            return;
        }

        console.group('🔍 Debug Information');
        console.log('Configuration:', window.CONFIG);
        console.log('Product Manager:', {
            productsCount: productManager.getTotalProducts(),
            categories: productManager.getAllCategories(),
            isLoading: productManager.isLoading()
        });
        console.log('Recent Logs:', this.getLogs().slice(-10));
        console.groupEnd();
    }
}

// グローバルデバッグマネージャー
window.debugManager = new DebugManager();

// デバッグ用のグローバル関数
window.debug = {
    testImage: (fileId) => window.debugManager.testImageUrl(fileId),
    showInfo: () => window.debugManager.showDebugInfo(),
    getLogs: (level) => window.debugManager.getLogs(level),
    clearLogs: () => window.debugManager.clearLogs(),
    exportLogs: () => window.debugManager.exportLogs()
};

// 既存のtestImageUrl関数との互換性を保つ
window.testImageUrl = (fileId) => window.debugManager.testImageUrl(fileId);
