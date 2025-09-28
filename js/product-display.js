// 商品表示管理クラス
class ProductDisplay {
    constructor() {
        this.currentPage = 1;
        this.currentCategory = 'all';
        this.searchQuery = '';
        this.sortBy = 'name';
        this.sortOrder = 'asc';
    }

    // 商品一覧を表示
    async displayProducts() {
        try {
            // 商品データを読み込み
            await productManager.loadProducts();
            
            // フィルタリングされた商品を取得
            let products = this.getFilteredProducts();
            
            // ソート
            products = this.sortProducts(products);
            
            // 表示
            this.renderProductGrid(products);
            this.updatePagination();
            this.updateCategoryFilter();
            
        } catch (error) {
            console.error('Error displaying products:', error);
            this.showError('商品の読み込みに失敗しました');
        }
    }

    // フィルタリングされた商品を取得
    getFilteredProducts() {
        let products = productManager.products;
        
        // カテゴリフィルタ
        if (this.currentCategory !== 'all') {
            products = products.filter(p => p.category === this.currentCategory);
        }
        
        // 検索フィルタ
        if (this.searchQuery) {
            products = productManager.searchProducts(this.searchQuery);
        }
        
        return products;
    }

    // 商品をソート
    sortProducts(products) {
        return products.sort((a, b) => {
            let aValue, bValue;
            
            switch (this.sortBy) {
                case 'name':
                    aValue = a.name || '';
                    bValue = b.name || '';
                    break;
                case 'price':
                    aValue = a.price || 0;
                    bValue = b.price || 0;
                    break;
                case 'sku':
                    aValue = a.sku || '';
                    bValue = b.sku || '';
                    break;
                default:
                    aValue = a.name || '';
                    bValue = b.name || '';
            }
            
            if (this.sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });
    }

    // 商品グリッドをレンダリング
    renderProductGrid(products) {
        const container = document.getElementById('product-grid');
        if (!container) return;

        // ローディング表示
        container.innerHTML = '<div class="loading">商品を読み込み中...</div>';

        if (products.length === 0) {
            container.innerHTML = '<div class="no-products">商品が見つかりませんでした</div>';
            return;
        }

        // 商品カテゴリごとにグループ化
        const groupedProducts = this.groupProductsByCategory(products);
        
        let html = '';
        Object.keys(groupedProducts).forEach(category => {
            const categoryProducts = groupedProducts[category];
            html += this.renderCategorySection(category, categoryProducts);
        });

        container.innerHTML = html;
        
        // イベントリスナーを追加
        this.attachProductEvents();
    }

    // 商品をカテゴリごとにグループ化
    groupProductsByCategory(products) {
        const grouped = {};
        products.forEach(product => {
            if (!grouped[product.category]) {
                grouped[product.category] = [];
            }
            grouped[product.category].push(product);
        });
        return grouped;
    }

    // カテゴリセクションをレンダリング
    renderCategorySection(category, products) {
        const categoryName = productManager.getCategoryDisplayName(category);
        
        let html = `
            <div class="product-category" data-category="${category}">
                <h3 class="category-title">${categoryName}</h3>
                <div class="product-images">
                    ${this.renderCategoryImage(products[0])}
                </div>
                <div class="product-numbers">
                    ${this.renderProductNumbers(products)}
                </div>
            </div>
        `;
        
        return html;
    }

    // カテゴリ画像をレンダリング
    renderCategoryImage(product) {
        if (product && product.imageUrl) {
            return `<img src="${product.imageUrl}" alt="${product.name || '商品画像'}" class="category-image" loading="lazy">`;
        }
        return '<div class="no-image">画像なし</div>';
    }

    // 商品番号をレンダリング
    renderProductNumbers(products) {
        return products.map(product => {
            const formattedProduct = productManager.formatProductForDisplay(product);
            return `
                <span class="product-number" 
                      data-sku="${product.sku}" 
                      data-category="${product.category}"
                      title="${formattedProduct.displayName} - ${formattedProduct.displayPrice}">
                    ${product.sku}
                </span>
            `;
        }).join('');
    }

    // 商品イベントをアタッチ
    attachProductEvents() {
        // 商品番号クリックイベント
        document.querySelectorAll('.product-number').forEach(element => {
            element.addEventListener('click', (e) => {
                const sku = e.target.dataset.sku;
                const product = productManager.getProductBySKU(sku);
                if (product) {
                    this.showProductDetail(product);
                }
            });
        });
    }

    // 商品詳細を表示
    showProductDetail(product) {
        const formattedProduct = productManager.formatProductForDisplay(product);
        
        const modal = document.createElement('div');
        modal.className = 'product-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <div class="product-detail">
                    ${product.imageUrl ? `
                        <div class="product-image">
                            <img src="${product.imageUrl}" alt="${formattedProduct.displayName}" loading="lazy">
                        </div>
                    ` : ''}
                    <div class="product-info">
                        <h3>${formattedProduct.displayName}</h3>
                        <p class="product-sku">商品コード: ${product.sku}</p>
                        <p class="product-category">カテゴリ: ${formattedProduct.categoryDisplay}</p>
                        <p class="product-price">${formattedProduct.displayPrice}</p>
                        ${product.last_updated ? `
                            <p class="product-updated">最終更新: ${new Date(product.last_updated).toLocaleDateString('ja-JP')}</p>
                        ` : ''}
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn-primary" onclick="productDisplay.addToCart('${product.sku}')">
                        カートに追加
                    </button>
                    <button class="btn-secondary" onclick="productDisplay.closeModal()">
                        閉じる
                    </button>
                </div>
            </div>
        `;
        
        // モーダルスタイルを適用
        this.applyModalStyles(modal);
        
        // イベントリスナーを追加
        this.attachModalEvents(modal);
        
        document.body.appendChild(modal);
    }

    // モーダルスタイルを適用
    applyModalStyles(modal) {
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            animation: fadeIn 0.3s ease;
        `;
        
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.cssText = `
            background: white;
            padding: 2rem;
            border-radius: 15px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
            animation: slideIn 0.3s ease;
        `;
        
        const closeBtn = modal.querySelector('.close');
        closeBtn.style.cssText = `
            position: absolute;
            top: 15px;
            right: 20px;
            font-size: 2rem;
            cursor: pointer;
            color: #999;
            background: none;
            border: none;
        `;
        
        // 商品詳細スタイル
        const productDetail = modal.querySelector('.product-detail');
        productDetail.style.cssText = `
            display: flex;
            gap: 1.5rem;
            margin-bottom: 1.5rem;
        `;
        
        const productImage = modal.querySelector('.product-image');
        if (productImage) {
            productImage.style.cssText = `
                flex: 0 0 200px;
            `;
            const img = productImage.querySelector('img');
            img.style.cssText = `
                width: 100%;
                height: auto;
                border-radius: 10px;
            `;
        }
        
        const productInfo = modal.querySelector('.product-info');
        productInfo.style.cssText = `
            flex: 1;
        `;
        
        // ボタンスタイル
        const buttons = modal.querySelectorAll('button');
        buttons.forEach(btn => {
            if (!btn.classList.contains('close')) {
                btn.style.cssText = `
                    margin: 0.5rem;
                    padding: 0.8rem 1.5rem;
                    border: none;
                    border-radius: 25px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s ease;
                `;
            }
        });
        
        const primaryBtn = modal.querySelector('.btn-primary');
        primaryBtn.style.cssText += `
            background: #947962;
            color: white;
        `;
        
        const secondaryBtn = modal.querySelector('.btn-secondary');
        secondaryBtn.style.cssText += `
            background: #f0f0f0;
            color: #333;
        `;
    }

    // モーダルイベントをアタッチ
    attachModalEvents(modal) {
        const closeBtn = modal.querySelector('.close');
        const secondaryBtn = modal.querySelector('.btn-secondary');
        
        closeBtn.addEventListener('click', () => this.closeModal());
        secondaryBtn.addEventListener('click', () => this.closeModal());
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });
    }

    // モーダルを閉じる
    closeModal() {
        const modal = document.querySelector('.product-modal');
        if (modal) {
            modal.remove();
        }
    }

    // カートに追加
    addToCart(sku) {
        // カート機能の実装（将来の拡張用）
        alert(`商品 ${sku} をカートに追加しました`);
    }

    // カテゴリフィルタを更新
    updateCategoryFilter() {
        const categories = productManager.getAllCategories();
        // カテゴリフィルタUIの実装（将来の拡張用）
    }

    // ページネーションを更新
    updatePagination() {
        // ページネーションUIの実装（将来の拡張用）
    }

    // エラーを表示
    showError(message) {
        const container = document.getElementById('product-grid');
        if (container) {
            container.innerHTML = `<div class="error">${message}</div>`;
        }
    }

    // 検索
    search(query) {
        this.searchQuery = query;
        this.displayProducts();
    }

    // カテゴリフィルタ
    filterByCategory(category) {
        this.currentCategory = category;
        this.displayProducts();
    }

    // ソート
    sort(by, order = 'asc') {
        this.sortBy = by;
        this.sortOrder = order;
        this.displayProducts();
    }
}

// グローバルインスタンス
const productDisplay = new ProductDisplay();
