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
            window.errorHandler?.warn('PRODUCT_LOAD', 'Products are already being loaded');
            return this.products;
        }

        const now = Date.now();
        
        // キャッシュチェック
        if (this.isCacheValid(now)) {
            window.errorHandler?.info('PRODUCT_LOAD', 'Using cached products');
            return this.products;
        }

        this.isLoading = true;
        
        try {
            window.errorHandler?.info('PRODUCT_LOAD', 'Fetching products from Google Sheets...');
            
            const response = await this.fetchWithRetry(window.CONFIG.GOOGLE_SHEETS_URL);
            const csvText = await response.text();
            const products = this.parseCSV(csvText);
            
            this.updateProductsData(products, now);
            this.retryCount = 0; // 成功時はリトライカウンターをリセット
            
            window.errorHandler?.info('PRODUCT_LOAD', `Successfully loaded ${products.length} products`);
            return products;
            
        } catch (error) {
            window.errorHandler?.log('PRODUCT_LOAD', error, {
                retryCount: this.retryCount,
                maxRetries: this.maxRetries
            });
            
            // リトライ可能な場合
            if (this.retryCount < this.maxRetries) {
                this.retryCount++;
                const delay = Math.pow(2, this.retryCount) * 1000; // 指数バックオフ
                
                window.errorHandler?.info('PRODUCT_LOAD', `Retrying in ${delay}ms (attempt ${this.retryCount}/${this.maxRetries})`);
                
                await new Promise(resolve => setTimeout(resolve, delay));
                return this.loadProducts();
            }
            
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
     * リトライ機能付きのfetch
     * @param {string} url - 取得するURL
     * @returns {Promise<Response>} レスポンス
     */
    async fetchWithRetry(url) {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }
        
        return response;
    }

    /**
     * 商品データを更新
     * @param {Array} products - 新しい商品データ
     * @param {number} timestamp - タイムスタンプ
     */
    updateProductsData(products, timestamp) {
        this.products = products;
        this.categories = new Set(products.map(p => p.category));
        this.lastFetch = timestamp;
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

                const product = this.createProductFromRow(headers, values);
                if (product) {
                    products.push(product);
                }
            }

            return products;
        } catch (error) {
            window.errorHandler?.log('CSV_PARSE', error, { csvText: csvText.substring(0, 200) });
            return [];
        }
    }

    /**
     * CSV行から商品オブジェクトを作成
     * @param {Array} headers - ヘッダー配列
     * @param {Array} values - 値配列
     * @returns {Object|null} 商品オブジェクトまたはnull
     */
    createProductFromRow(headers, values) {
        const product = {};
        
        headers.forEach((header, index) => {
            product[header] = values[index] ? values[index].trim() : '';
        });

        // 必須フィールドのチェック
        if (!product.sku || !product.category) {
            return null;
        }

        // 価格を数値に変換
        if (product.price) {
            product.price = parseInt(product.price) || 0;
        }

        // 画像URLを生成
        if (product.image_file_ids) {
            product.imageUrl = this.getDriveImageUrl(product.image_file_ids);
        }

        return product;
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
            window.errorHandler?.warn('IMAGE_LOAD', 'Empty file ID provided');
            return window.CONFIG.FALLBACK_IMAGE_URL;
        }
        
        const baseUrl = window.CONFIG.GOOGLE_DRIVE_BASE_URL || 
                       (window.CONFIG.GOOGLE_DRIVE_URLS && window.CONFIG.GOOGLE_DRIVE_URLS[0]) || 
                       'https://drive.google.com/uc?export=view&id=';
        
        const imageUrl = `${baseUrl}${fileId}`;
        
        window.errorHandler?.info('IMAGE_LOAD', `Generated image URL for file ID ${fileId}`, {
            baseUrl,
            fileId,
            imageUrl
        });
        
        return imageUrl;
    }

    /**
     * 複数のURL形式を試して画像URLを取得
     * @param {string} fileId - ファイルID
     * @returns {Array} 画像URLの配列
     */
    getAllImageUrls(fileId) {
        if (!fileId || fileId.trim() === '') {
            return [window.CONFIG.FALLBACK_IMAGE_URL];
        }
        
        const urls = [];
        
        if (window.CONFIG.GOOGLE_DRIVE_URLS && window.CONFIG.GOOGLE_DRIVE_URLS.length > 0) {
            window.CONFIG.GOOGLE_DRIVE_URLS.forEach(urlTemplate => {
                if (urlTemplate.includes('{ID}')) {
                    urls.push(urlTemplate.replace('{ID}', fileId));
                } else {
                    urls.push(`${urlTemplate}${fileId}`);
                }
            });
        } else {
            urls.push(`${window.CONFIG.GOOGLE_DRIVE_BASE_URL}${fileId}`);
        }
        
        urls.push(window.CONFIG.FALLBACK_IMAGE_URL);
        return urls;
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
     * 商品を表示用にフォーマット
     * @param {Object} product - 商品オブジェクト
     * @returns {Object} フォーマットされた商品オブジェクト
     */
    formatProductForDisplay(product) {
        return {
            ...product,
            displayPrice: Utils.formatPrice(product.price),
            displayName: product.name || '商品名未定',
            hasImage: !!product.image_file_ids,
            categoryDisplay: this.getCategoryDisplayName(product.category)
        };
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

    /**
     * キャッシュをクリア
     */
    clearCache() {
        this.cache.clear();
        this.lastFetch = 0;
        this.products = [];
        this.categories.clear();
    }

    /**
     * ローディング状態を取得
     * @returns {boolean} ローディング中の場合true
     */
    isLoading() {
        return this.isLoading;
    }
}

// グローバルインスタンス
const productManager = new ProductManager();
