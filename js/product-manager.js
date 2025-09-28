// 商品管理クラス
class ProductManager {
    constructor() {
        this.products = [];
        this.categories = new Set();
        this.cache = new Map();
        this.lastFetch = 0;
    }

    // スプレッドシートから商品データを取得
    async loadProducts() {
        const now = Date.now();
        
        // キャッシュチェック
        if (now - this.lastFetch < CONFIG.CACHE_DURATION && this.products.length > 0) {
            if (CONFIG.DEBUG) console.log('Using cached products');
            return this.products;
        }

        try {
            if (CONFIG.DEBUG) console.log('Fetching products from Google Sheets...');
            
            const response = await fetch(CONFIG.GOOGLE_SHEETS_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const csvText = await response.text();
            const products = this.parseCSV(csvText);
            
            this.products = products;
            this.categories = new Set(products.map(p => p.category));
            this.lastFetch = now;
            
            if (CONFIG.DEBUG) console.log(`Loaded ${products.length} products`);
            return products;
            
        } catch (error) {
            console.error('Error loading products:', error);
            return [];
        }
    }

    // CSVをパースして商品データに変換
    parseCSV(csvText) {
        const lines = csvText.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
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

            // 空の商品はスキップ
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
    }

    // CSV行を正しくパース（カンマ区切りを考慮）
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

    // Google Drive画像URLを生成
    getDriveImageUrl(fileId) {
        if (!fileId || fileId.trim() === '') {
            if (CONFIG.DEBUG) console.warn('Empty file ID provided');
            return CONFIG.FALLBACK_IMAGE_URL;
        }
        
        // 最初のURL形式を使用（最も確実な方法）
        const imageUrl = `${CONFIG.GOOGLE_DRIVE_URLS[0]}${fileId}`;
        if (CONFIG.DEBUG) console.log(`Generated image URL for file ID ${fileId}:`, imageUrl);
        return imageUrl;
    }
    
    // 代替画像URLを取得（画像読み込み失敗時用）
    getFallbackImageUrl() {
        return CONFIG.FALLBACK_IMAGE_URL;
    }

    // カテゴリ別に商品を取得
    getProductsByCategory(category) {
        return this.products.filter(product => product.category === category);
    }

    // SKUで商品を検索
    getProductBySKU(sku) {
        return this.products.find(product => product.sku === sku);
    }

    // 商品名で検索
    searchProducts(query) {
        const lowerQuery = query.toLowerCase();
        return this.products.filter(product => 
            product.name && product.name.toLowerCase().includes(lowerQuery)
        );
    }

    // 価格範囲でフィルタ
    filterByPriceRange(minPrice, maxPrice) {
        return this.products.filter(product => {
            const price = product.price || 0;
            return price >= minPrice && price <= maxPrice;
        });
    }

    // 全カテゴリを取得
    getAllCategories() {
        return Array.from(this.categories).sort();
    }

    // 商品をページネーションで取得
    getProductsPage(page = 1, pageSize = CONFIG.PRODUCTS_PER_PAGE) {
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return this.products.slice(startIndex, endIndex);
    }

    // 商品の総数を取得
    getTotalProducts() {
        return this.products.length;
    }

    // 商品を表示用にフォーマット
    formatProductForDisplay(product) {
        return {
            ...product,
            displayPrice: product.price ? `¥${product.price.toLocaleString()}` : '価格未定',
            displayName: product.name || '商品名未定',
            hasImage: !!product.image_file_ids,
            categoryDisplay: this.getCategoryDisplayName(product.category)
        };
    }

    // カテゴリの表示名を取得
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
