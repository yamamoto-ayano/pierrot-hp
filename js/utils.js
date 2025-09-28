/**
 * Pierrot ファッションショップ - ユーティリティ関数
 * 
 * アプリケーション全体で使用される共通のユーティリティ関数を提供します。
 */

class Utils {
    /**
     * デバウンス関数
     * @param {Function} func - 実行する関数
     * @param {number} wait - 待機時間（ミリ秒）
     * @param {boolean} immediate - 即座に実行するかどうか
     * @returns {Function} デバウンスされた関数
     */
    static debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func.apply(this, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(this, args);
        };
    }

    /**
     * スロットル関数
     * @param {Function} func - 実行する関数
     * @param {number} limit - 制限時間（ミリ秒）
     * @returns {Function} スロットルされた関数
     */
    static throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * 数値を日本円形式でフォーマット
     * @param {number} amount - 金額
     * @returns {string} フォーマットされた金額文字列
     */
    static formatPrice(amount) {
        if (typeof amount !== 'number' || isNaN(amount)) {
            return '価格未定';
        }
        return `¥${amount.toLocaleString('ja-JP')}`;
    }

    /**
     * 日付を日本語形式でフォーマット
     * @param {string|Date} date - 日付
     * @returns {string} フォーマットされた日付文字列
     */
    static formatDate(date) {
        if (!date) return '';
        
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        if (isNaN(dateObj.getTime())) return '';
        
        return dateObj.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    /**
     * 文字列を安全にHTMLエスケープ
     * @param {string} str - エスケープする文字列
     * @returns {string} エスケープされた文字列
     */
    static escapeHtml(str) {
        if (typeof str !== 'string') return '';
        
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    /**
     * 要素がビューポート内にあるかチェック
     * @param {Element} element - チェックする要素
     * @param {number} threshold - 閾値（0-1）
     * @returns {boolean} ビューポート内にある場合true
     */
    static isInViewport(element, threshold = 0) {
        if (!element) return false;
        
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;
        
        return (
            rect.top <= windowHeight * (1 - threshold) &&
            rect.bottom >= windowHeight * threshold &&
            rect.left <= windowWidth * (1 - threshold) &&
            rect.right >= windowWidth * threshold
        );
    }

    /**
     * 要素にフェードインアニメーションを適用
     * @param {Element} element - アニメーションを適用する要素
     * @param {number} duration - アニメーション時間（ミリ秒）
     */
    static fadeIn(element, duration = 300) {
        if (!element) return;
        
        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms ease-in-out`;
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
        });
    }

    /**
     * 要素にフェードアウトアニメーションを適用
     * @param {Element} element - アニメーションを適用する要素
     * @param {number} duration - アニメーション時間（ミリ秒）
     * @returns {Promise} アニメーション完了時のPromise
     */
    static fadeOut(element, duration = 300) {
        return new Promise((resolve) => {
            if (!element) {
                resolve();
                return;
            }
            
            element.style.transition = `opacity ${duration}ms ease-in-out`;
            element.style.opacity = '0';
            
            setTimeout(() => {
                resolve();
            }, duration);
        });
    }

    /**
     * ローカルストレージに安全にデータを保存
     * @param {string} key - キー
     * @param {any} data - 保存するデータ
     * @returns {boolean} 保存に成功した場合true
     */
    static saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            window.errorHandler?.warn('STORAGE_SAVE', 'Failed to save to localStorage', { key, error });
            return false;
        }
    }

    /**
     * ローカルストレージから安全にデータを取得
     * @param {string} key - キー
     * @param {any} defaultValue - デフォルト値
     * @returns {any} 取得したデータまたはデフォルト値
     */
    static loadFromStorage(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            window.errorHandler?.warn('STORAGE_LOAD', 'Failed to load from localStorage', { key, error });
            return defaultValue;
        }
    }

    /**
     * URLパラメータを取得
     * @param {string} name - パラメータ名
     * @param {string} defaultValue - デフォルト値
     * @returns {string} パラメータ値
     */
    static getUrlParameter(name, defaultValue = '') {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name) || defaultValue;
    }

    /**
     * 要素のクラスを安全に切り替え
     * @param {Element} element - 対象要素
     * @param {string} className - クラス名
     * @param {boolean} add - 追加するかどうか
     */
    static toggleClass(element, className, add) {
        if (!element) return;
        
        if (add) {
            element.classList.add(className);
        } else {
            element.classList.remove(className);
        }
    }

    /**
     * 要素の表示/非表示を切り替え
     * @param {Element} element - 対象要素
     * @param {boolean} show - 表示するかどうか
     * @param {string} displayType - 表示タイプ（デフォルト: 'block'）
     */
    static toggleVisibility(element, show, displayType = 'block') {
        if (!element) return;
        
        if (show) {
            element.style.display = displayType;
        } else {
            element.style.display = 'none';
        }
    }
}

// グローバルに公開
window.Utils = Utils;
