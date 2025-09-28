// 商品表示管理クラス
class ProductDisplay {
    constructor() {
        this.currentPage = 1;
        this.currentCategory = 'all';
        this.searchQuery = '';
        this.sortBy = 'newest';
        this.sortOrder = 'desc';
        this.viewMode = 'grid'; // 'grid' or 'list'
        this.productsPerPage = 12;
        this.filteredProducts = [];
    }

    // 商品一覧を表示
    async displayProducts() {
        try {
            // 商品データを読み込み
            await productManager.loadProducts();
            
            // フィルタリングされた商品を取得
            this.filteredProducts = this.getFilteredProducts();
            
            // ソート
            this.filteredProducts = this.sortProducts(this.filteredProducts);
            
            // 表示
            this.renderProductGrid();
            this.updatePagination();
            this.updateCategoryFilter();
            this.updateProductsCount();
            
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
    renderProductGrid() {
        const container = document.getElementById('product-grid');
        if (!container) return;

        // ページネーション適用
        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        const productsToShow = this.filteredProducts.slice(startIndex, endIndex);

        if (this.filteredProducts.length === 0) {
            container.innerHTML = '<div class="no-products">商品が見つかりませんでした</div>';
            return;
        }

        // ビューモードに応じてクラスを設定
        container.className = `product-grid ${this.viewMode === 'list' ? 'list-view' : ''}`;

        // 商品カードを生成
        let html = '';
        productsToShow.forEach(product => {
            html += this.createProductCard(product);
        });

        container.innerHTML = html;
        
        // イベントリスナーを追加
        this.attachProductEvents();
    }

    // 商品カードを作成
    createProductCard(product) {
        const imageUrl = product.imageUrl || window.CONFIG.FALLBACK_IMAGE_URL;
        const categoryName = productManager.getCategoryDisplayName(product.category);
        const price = product.price ? `¥${product.price.toLocaleString()}` : '価格未定';
        
        return `
            <div class="product-card ${this.viewMode === 'list' ? 'list-view' : ''}" data-sku="${product.sku}">
                <div class="product-image-wrapper">
                    <img src="${imageUrl}" 
                         alt="${product.name}" 
                         class="product-card-image"
                         loading="lazy"
                         onerror="this.src='${window.CONFIG.FALLBACK_IMAGE_URL}'; this.onerror=null;">
                </div>
                <div class="product-card-content">
                    <h3 class="product-card-title">${product.name}</h3>
                    <p class="product-card-category">${categoryName}</p>
                    <p class="product-card-price">${price}</p>
                    <button class="btn-detail" data-sku="${product.sku}">詳細を見る</button>
                </div>
            </div>
        `;
    }

    // 商品数を更新
    updateProductsCount() {
        const countElement = document.getElementById('products-count');
        if (countElement) {
            countElement.textContent = `${this.filteredProducts.length}件の商品`;
        }
    }

    // ビューモードを切り替え
    setViewMode(mode) {
        this.viewMode = mode;
        this.renderProductGrid();
        this.updateViewButtons();
    }

    // ビューボタンの状態を更新
    updateViewButtons() {
        const gridBtn = document.getElementById('grid-view');
        const listBtn = document.getElementById('list-view');
        
        if (gridBtn && listBtn) {
            gridBtn.classList.toggle('active', this.viewMode === 'grid');
            listBtn.classList.toggle('active', this.viewMode === 'list');
        }
    }

    // ページネーションを更新
    updatePagination() {
        const container = document.getElementById('pagination');
        if (!container) return;

        const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
        
        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }

        let html = '';
        
        // 前のページボタン
        html += `<button class="pagination-btn" ${this.currentPage === 1 ? 'disabled' : ''} data-page="${this.currentPage - 1}">前へ</button>`;
        
        // ページ番号
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(totalPages, this.currentPage + 2);
        
        for (let i = startPage; i <= endPage; i++) {
            html += `<button class="pagination-btn ${i === this.currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
        
        // 次のページボタン
        html += `<button class="pagination-btn" ${this.currentPage === totalPages ? 'disabled' : ''} data-page="${this.currentPage + 1}">次へ</button>`;
        
        // ページ情報
        html += `<span class="pagination-info">${this.currentPage} / ${totalPages} ページ</span>`;
        
        container.innerHTML = html;
        
        // イベントリスナーを追加
        container.addEventListener('click', (e) => {
            if (e.target.classList.contains('pagination-btn') && !e.target.disabled) {
                const page = parseInt(e.target.dataset.page);
                if (page && page !== this.currentPage) {
                    this.currentPage = page;
                    this.renderProductGrid();
                    this.updatePagination();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }
        });
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

    // イベントリスナーを設定
    setupEventListeners() {
        // 検索ボタン
        const searchBtn = document.getElementById('search-btn');
        const searchInput = document.getElementById('product-search');
        
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.searchQuery = searchInput.value.trim();
                this.currentPage = 1;
                this.displayProducts();
            });
        }
        
        // 検索入力（Enterキー）
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchQuery = searchInput.value.trim();
                    this.currentPage = 1;
                    this.displayProducts();
                }
            });
        }
        
        // カテゴリフィルタ
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.currentCategory = e.target.value;
                this.currentPage = 1;
                this.displayProducts();
            });
        }
        
        // ソート
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                this.sortBy = sortBy;
                this.sortOrder = sortOrder || 'asc';
                this.currentPage = 1;
                this.displayProducts();
            });
        }
        
        // ビューモード切り替え
        const gridBtn = document.getElementById('grid-view');
        const listBtn = document.getElementById('list-view');
        
        if (gridBtn) {
            gridBtn.addEventListener('click', () => {
                this.setViewMode('grid');
            });
        }
        
        if (listBtn) {
            listBtn.addEventListener('click', () => {
                this.setViewMode('list');
            });
        }
    }
}

// グローバルインスタンス
const productDisplay = new ProductDisplay();