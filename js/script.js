// DOM要素の取得
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const ctaButton = document.querySelector('.cta-button');
const contactButton = document.querySelector('.contact-button');
const floatingButtons = document.querySelectorAll('.floating-btn');

// モバイルメニューの切り替え
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// メニューリンククリック時の処理
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
        
        // モバイルメニューを閉じる
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// CTAボタンのクリック処理
ctaButton.addEventListener('click', () => {
    const productsSection = document.querySelector('#products');
    const headerHeight = document.querySelector('.header').offsetHeight;
    const targetPosition = productsSection.offsetTop - headerHeight;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
});

// お問い合わせボタンのクリック処理
contactButton.addEventListener('click', () => {
    // 実際の実装では、お問い合わせフォームのモーダルを開くか、
    // お問い合わせページに遷移する処理を追加
    alert('お問い合わせフォームを開きます');
});

// フローティングボタンの処理
floatingButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        switch(index) {
            case 0: // メニューボタン
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
                break;
            case 1: // おすすめボタン
                // おすすめ商品を表示する処理
                showRecommendations();
                break;
            case 2: // テキストボタン
                // テキストサイズを変更する処理
                toggleTextSize();
                break;
        }
    });
});

// おすすめ商品表示機能
function showRecommendations() {
    const categories = document.querySelectorAll('.product-category');
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    // ハイライト効果を追加
    randomCategory.style.transform = 'scale(1.05)';
    randomCategory.style.boxShadow = '0 25px 50px rgba(148, 121, 98, 0.3)';
    
    // スムーズスクロール
    const headerHeight = document.querySelector('.header').offsetHeight;
    const targetPosition = randomCategory.offsetTop - headerHeight - 50;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
    
    // 3秒後にハイライトを解除
    setTimeout(() => {
        randomCategory.style.transform = '';
        randomCategory.style.boxShadow = '';
    }, 3000);
}

// テキストサイズ切り替え機能
let isLargeText = false;
function toggleTextSize() {
    const body = document.body;
    
    if (isLargeText) {
        body.style.fontSize = '';
        isLargeText = false;
    } else {
        body.style.fontSize = '1.2em';
        isLargeText = true;
    }
}

// スクロール時のヘッダー効果
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    const scrollY = window.scrollY;
    
    if (scrollY > 100) {
        header.style.background = 'rgba(248, 232, 228, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(248, 232, 228, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// 商品番号のクリック処理
document.addEventListener('DOMContentLoaded', () => {
    const productNumbers = document.querySelectorAll('.product-number');
    
    productNumbers.forEach(number => {
        number.addEventListener('click', () => {
            // 商品詳細を表示する処理
            showProductDetail(number.textContent);
        });
    });
});

// 商品詳細表示機能
function showProductDetail(productNumber) {
    // モーダルを作成
    const modal = document.createElement('div');
    modal.className = 'product-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h3>商品番号: ${productNumber}</h3>
            <p>この商品の詳細情報を表示します。</p>
            <div class="modal-actions">
                <button class="btn-primary">詳細を見る</button>
                <button class="btn-secondary">閉じる</button>
            </div>
        </div>
    `;
    
    // モーダルスタイルを追加
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
    `;
    
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 15px;
        max-width: 500px;
        width: 90%;
        text-align: center;
        position: relative;
    `;
    
    const closeBtn = modal.querySelector('.close');
    closeBtn.style.cssText = `
        position: absolute;
        top: 10px;
        right: 15px;
        font-size: 2rem;
        cursor: pointer;
        color: #999;
    `;
    
    // ボタンスタイル
    const buttons = modal.querySelectorAll('button');
    buttons.forEach(btn => {
        btn.style.cssText = `
            margin: 0.5rem;
            padding: 0.8rem 1.5rem;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
        `;
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
    
    // イベントリスナー
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    secondaryBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    primaryBtn.addEventListener('click', () => {
        alert('商品詳細ページに遷移します');
        document.body.removeChild(modal);
    });
    
    // モーダル外クリックで閉じる
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    document.body.appendChild(modal);
}

// 商品カテゴリのアニメーション
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// 商品カテゴリを監視
document.addEventListener('DOMContentLoaded', () => {
    const productCategories = document.querySelectorAll('.product-category');
    productCategories.forEach(category => {
        observer.observe(category);
    });
});

// ページ読み込み時のアニメーション
window.addEventListener('load', () => {
    const heroElements = document.querySelectorAll('.hero-text > *');
    heroElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'all 0.6s ease';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 100);
        }, index * 200);
    });
});

// キーボードナビゲーション
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // モーダルを閉じる
        const modal = document.querySelector('.product-modal');
        if (modal) {
            document.body.removeChild(modal);
        }
        
        // モバイルメニューを閉じる
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// タッチデバイス対応
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // 上スワイプ - 次のセクションへ
            scrollToNextSection();
        } else {
            // 下スワイプ - 前のセクションへ
            scrollToPreviousSection();
        }
    }
}

function scrollToNextSection() {
    const sections = ['#home', '#products', '#about', '#contact'];
    const currentSection = getCurrentSection();
    const currentIndex = sections.indexOf(currentSection);
    
    if (currentIndex < sections.length - 1) {
        const nextSection = document.querySelector(sections[currentIndex + 1]);
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = nextSection.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

function scrollToPreviousSection() {
    const sections = ['#home', '#products', '#about', '#contact'];
    const currentSection = getCurrentSection();
    const currentIndex = sections.indexOf(currentSection);
    
    if (currentIndex > 0) {
        const prevSection = document.querySelector(sections[currentIndex - 1]);
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = prevSection.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

function getCurrentSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY;
    const headerHeight = document.querySelector('.header').offsetHeight;
    
    for (let section of sections) {
        const sectionTop = section.offsetTop - headerHeight - 100;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollY >= sectionTop && scrollY < sectionBottom) {
            return `#${section.id}`;
        }
    }
    
    return '#home';
}

// パフォーマンス最適化
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// スクロールイベントの最適化
const optimizedScrollHandler = debounce(() => {
    const header = document.querySelector('.header');
    const scrollY = window.scrollY;
    
    if (scrollY > 100) {
        header.style.background = 'rgba(248, 232, 228, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(248, 232, 228, 0.95)';
        header.style.boxShadow = 'none';
    }
}, 10);

window.addEventListener('scroll', optimizedScrollHandler);
