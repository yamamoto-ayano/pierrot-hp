/**
 * Pierrot ファッションショップ - 商品管理
 * 
 * Google Sheetsから商品データを取得・管理し、
 * 画像URLの生成、キャッシュ管理、エラーハンドリングを行います。
 */
class ProductManager {
    constructor() {
        this.products = [];
        this.categories = new Set();
        this.cache = new Map();
        this.lastFetch = 0;
        this.isLoading = false;
        this.retryCount = 0;
        this.maxRetries = 3;
    }

    /**
     * スプレッドシートから商品データを取得
     * @returns {Promise<Array>} 商品データの配列
     */
    async loadProducts() {
        if (this.isLoading) {
            return this.products;
        }

        const now = Date.now();
        
        // キャッシュチェック
        if (this.isCacheValid(now)) {
            return this.products;
        }

        this.isLoading = true;
        
        try {
            const response = await fetch(window.CONFIG.GOOGLE_SHEETS_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const csvText = await response.text();
            const products = this.parseCSV(csvText);
            
            this.products = products;
            this.categories = new Set(products.map(p => p.category));
            this.lastFetch = now;
            
            return products;
            
        } catch (error) {
            window.errorHandler?.log('PRODUCT_LOAD', error);
            return [];
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * キャッシュが有効かチェック
     * @param {number} now - 現在時刻
     * @returns {boolean} キャッシュが有効な場合true
     */
    isCacheValid(now) {
        return (now - this.lastFetch < window.CONFIG.CACHE_DURATION) && 
               (this.products.length > 0);
    }

    /**
     * CSVをパースして商品データに変換
     * @param {string} csvText - CSVテキスト
     * @returns {Array} 商品データの配列
     */
    parseCSV(csvText) {
        try {
            const lines = csvText.split('\n');
            const headers = this.parseCSVLine(lines[0]);
            const products = [];

            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;

                const values = this.parseCSVLine(line);
                if (values.length < headers.length) continue;

                const product = {};
                headers.forEach((header, index) => {
                    product[header] = values[index] ? values[index].trim() : '';
                });

                // 必須フィールドのチェック
                if (!product.sku || !product.category) continue;

                // 価格を数値に変換
                if (product.price) {
                    product.price = parseInt(product.price) || 0;
                }

                // 画像URLを生成
                if (product.image_file_ids) {
                    product.imageUrl = this.getDriveImageUrl(product.image_file_ids);
                }

                products.push(product);
            }

            return products;
        } catch (error) {
            window.errorHandler?.log('CSV_PARSE', error);
            return [];
        }
    }

    /**
     * CSV行を正しくパース（カンマ区切りを考慮）
     * @param {string} line - CSV行
     * @returns {Array} パースされた値の配列
     */
    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        
        result.push(current);
        return result;
    }

    /**
     * Google Drive画像URLを生成
     * @param {string} fileId - ファイルID
     * @returns {string} 画像URL
     */
    getDriveImageUrl(fileId) {
        if (!fileId || fileId.trim() === '') {
            return window.CONFIG.FALLBACK_IMAGE_URL;
        }
        
        return `${window.CONFIG.GOOGLE_DRIVE_BASE_URL}${fileId}`;
    }

    /**
     * カテゴリ別に商品を取得
     * @param {string} category - カテゴリ
     * @returns {Array} 商品の配列
     */
    getProductsByCategory(category) {
        return this.products.filter(product => product.category === category);
    }

    /**
     * SKUで商品を検索
     * @param {string} sku - SKU
     * @returns {Object|undefined} 商品オブジェクト
     */
    getProductBySKU(sku) {
        return this.products.find(product => product.sku === sku);
    }

    /**
     * 商品名で検索
     * @param {string} query - 検索クエリ
     * @returns {Array} 商品の配列
     */
    searchProducts(query) {
        if (!query || typeof query !== 'string') {
            return this.products;
        }
        
        const lowerQuery = query.toLowerCase();
        return this.products.filter(product => 
            product.name && product.name.toLowerCase().includes(lowerQuery)
        );
    }

    /**
     * 価格範囲でフィルタ
     * @param {number} minPrice - 最小価格
     * @param {number} maxPrice - 最大価格
     * @returns {Array} 商品の配列
     */
    filterByPriceRange(minPrice, maxPrice) {
        return this.products.filter(product => {
            const price = product.price || 0;
            return price >= minPrice && price <= maxPrice;
        });
    }

    /**
     * 全カテゴリを取得
     * @returns {Array} カテゴリの配列
     */
    getAllCategories() {
        return Array.from(this.categories).sort();
    }

    /**
     * 商品をページネーションで取得
     * @param {number} page - ページ番号（1から開始）
     * @param {number} pageSize - ページサイズ
     * @returns {Array} 商品の配列
     */
    getProductsPage(page = 1, pageSize = window.CONFIG.PRODUCTS_PER_PAGE) {
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return this.products.slice(startIndex, endIndex);
    }

    /**
     * 商品の総数を取得
     * @returns {number} 商品数
     */
    getTotalProducts() {
        return this.products.length;
    }


    /**
     * カテゴリの表示名を取得
     * @param {string} category - カテゴリコード
     * @returns {string} 表示名
     */
    getCategoryDisplayName(category) {
        const categoryNames = {
            'A': 'カテゴリ A',
            'B': 'カテゴリ B',
            'C': 'カテゴリ C',
            'D': 'カテゴリ D',
            'E': 'カテゴリ E',
            'F': 'カテゴリ F',
            'G': 'カテゴリ G',
            'H': 'カテゴリ H',
            'I': 'カテゴリ I',
            'J': 'カテゴリ J'
        };
        return categoryNames[category] || `カテゴリ ${category}`;
    }

}

// グローバルインスタンス
const productManager = new ProductManager();
