let currentReviewPage = 1;
const reviewsPerPage = 8;
let allReviews = []; // Змінна для зберігання всіх відгуків

//Cart
const CartManager = {
    items: JSON.parse(localStorage.getItem('cart') || '[]'),
    clear() {
        if (confirm("Ви впевнені, що хочете очистити корзину?")) {
            this.items = [];
            this.save();
            this.renderModal(); // Перемальовуємо модалку після очищення
        }
    },
    save() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.updateCounter();
    },
    add(product) {
        const existing = this.items.find(i => i.id === product.id);
        if (existing) existing.quantity++;
        else this.items.push({ ...product, quantity: 1 });
        this.save();
    },
    updateCounter() {
        const el = document.getElementById('cart-count');
        if (el) el.innerText = this.items.reduce((sum, item) => sum + item.quantity, 0);
    },
    getTelegramLink() {
        if (this.items.length === 0) return "#";
        let text = "Замовлення з ZX-KIT:%0A";
        this.items.forEach(i => { text += `%0A- ${i.name} (${i.quantity} шт.)`; });
        return `https://t.me/terabiterr?text=${text}`;
    }
};

// --- Змінні для пагінації ---
let allProducts = [];
let currentPage = 1;
const itemsPerPage = 16;

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    CartManager.updateCounter();
    initCartModal();
    // Якщо ми на сторінці товару/компонента
    if (document.getElementById('product-root')) {
        // Визначаємо, що саме завантажувати
        if (urlParams.has('isComponent')) {
            initComponentPage();
        } else {
            initProductPage();
        }
    }

    // Якщо на головній (каталог)
    if (document.getElementById('products')) {
        loadCatalog();
    }

    // Якщо на сторінці компонентів (список)
    if (document.getElementById('components-list')) {
        loadComponents();
    }

    updateBackButton();
});

// --- Логіка каталогу ---
async function loadCatalog() {
    try {
        const response = await fetch('/data/catalog.json');
        allProducts = await response.json();
        renderPage();
    } catch (err) { console.error("Помилка завантаження каталогу:", err); }
}

async function loadComponents() {
    try {
        const response = await fetch('/data/components.json');
        const components = await response.json();
        const container = document.getElementById('components-list');
        if (!container) return;

        container.innerHTML = components.map(c => `
            <a href="/products/template.html?id=${c.id}&isComponent=true" class="card-link">
                <article class="card">
                    <img src="${c.images[0]}" alt="${c.name}" loading="lazy">
                    <h3>${c.name}</h3>
                    <div class="card-price">${c.price} ${c.currency || 'UAH'}</div>
                </article>
            </a>
        `).join('');
    } catch (err) { console.error("Помилка компонентів:", err); }
}

function renderPage() {
    const container = document.getElementById('products');
    const pageInfo = document.getElementById('page-info');
    if (!container) return;

    const start = (currentPage - 1) * itemsPerPage;
    const paginatedItems = allProducts.slice(start, start + itemsPerPage);

    container.innerHTML = paginatedItems.map(p => `
        <a href="/products/template.html?id=${p.id}" class="card-link">
            <article class="card">
                <img src="${p.img}" alt="${p.name}" loading="lazy">
                <h3>${p.name}</h3>
                <div class="card-price">${p.price} UAH</div>
            </article>
        </a>
    `).join('');

    if (pageInfo) pageInfo.innerText = `PAGE ${currentPage}`;
}

window.changePage = function (step) {
    const maxPages = Math.ceil(allProducts.length / itemsPerPage);
    const newPage = currentPage + step;
    if (newPage >= 1 && newPage <= maxPages) {
        currentPage = newPage;
        renderPage();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

// --- Логіка сторінки товару (Звичайний товар) ---
// Функція для оновлення SEO та Schema.org
function updateProductSEO(item) {
    const data = item.product;
    const meta = item.meta;

    // 1. Title & Meta Tags
    document.title = meta.title || data.name;

    const descTag = document.getElementById('meta-desc') || document.querySelector('meta[name="description"]');
    if (descTag) descTag.setAttribute("content", meta.description);

    const keyTag = document.getElementById('meta-keys') || document.querySelector('meta[name="keywords"]');
    if (keyTag) keyTag.setAttribute("content", meta.keywords);

    // 2. Canonical URL (запобігає дублям в індексації)
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.href.split('?')[0] + '?id=' + item.id);

    // 3. Schema.org JSON-LD
    const existingSchema = document.querySelector('script[type="application/ld+json"]');
    if (existingSchema) existingSchema.remove();

    const schema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": data.name,
        "sku": data.sku,
        "description": data.schema?.description || meta.description,
        // Виправляємо шлях: видаляємо '..' і додаємо домен
        "image": window.location.origin + data.images[0].replace('..', ''),
        "offers": {
            "@type": "Offer",
            "priceCurrency": data.currency || "UAH",
            "price": data.price,
            "availability": "https://schema.org/InStock",
            "url": window.location.href
        }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
}

// --- Логіка сторінки товару ---
async function initProductPage() {
    const id = new URLSearchParams(window.location.search).get('id');
    if (!id) return;

    try {
        const resp = await fetch('/data/products.json');
        const list = await resp.json();
        const item = list.find(p => p.id === id);
        if (!item) return;

        const data = item.product;

        // Оновлюємо SEO
        updateProductSEO(item);

        // Відображення даних
        document.getElementById('p-name').innerText = data.name;
        document.getElementById('p-price').innerHTML = `<span>${data.price} ${data.currency || 'UAH'}</span>`;
        document.getElementById('p-desc').innerHTML = data.description;
        document.getElementById('tg-order').href = `https://t.me/terabiterr?text=Хочу замовити ${data.name}`;

        // SKU (якщо є в шаблоні)
        const skuEl = document.getElementById('p-id');
        if (skuEl) skuEl.innerText = `SKU: ${data.sku}`;

        const specsTable = document.getElementById('p-specs');
        if (specsTable && data.specs) {
            specsTable.innerHTML = data.specs.map(s =>
                `<tr><td class="label">${s.label}</td><td class="val">${s.val}</td></tr>`
            ).join('');
        }

        renderGallery(data.images);
        initZoom();
    } catch (err) { console.error("Помилка ініціалізації сторінки:", err); }
}

//SEO for components
function updateComponentSEO(comp) {
    // 1. Title & Meta
    document.title = `${comp.name} | Купити компонент для ZX Spectrum`;

    let descTag = document.querySelector('meta[name="description"]');
    if (descTag) descTag.setAttribute("content", comp.short_description || comp.description.substring(0, 150));

    let keyTag = document.querySelector('meta[name="keywords"]');
    if (keyTag) keyTag.setAttribute("content", comp.keywords || "");

    // 2. Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.href.split('?')[0] + '?id=' + comp.id + '&isComponent=true');

    // 3. Schema.org для компонента
    const existingSchema = document.querySelector('script[type="application/ld+json"]');
    if (existingSchema) existingSchema.remove();

    const schema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": comp.name,
        "sku": comp.id,
        "description": comp.description,
        "image": window.location.origin + comp.images[0],
        "offers": {
            "@type": "Offer",
            "priceCurrency": comp.currency || "UAH",
            "price": comp.price,
            "availability": comp.stock_status === 'in_stock' ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "url": window.location.href
        }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
}
// --- Логіка сторінки компонента ---
// --- Оновлена логіка сторінки компонента ---
async function initComponentPage() {
    const id = new URLSearchParams(window.location.search).get('id');
    if (!id) return;

    try {
        const resp = await fetch('/data/components.json');
        const list = await resp.json();
        const data = list.find(p => p.id === id);
        
        if (!data) {
            console.error("Компонент не знайдено");
            return;
        }

        // 1. Оновлення SEO та мета-даних
        updateComponentSEO(data);

        // 2. Заповнення інформації на сторінці
        document.title = data.name;
        document.getElementById('p-name').innerText = data.name;
        document.getElementById('p-price').innerHTML = `<span>${data.price} ${data.currency || 'UAH'}</span>`;
        document.getElementById('p-desc').innerHTML = data.description;

        // 3. Робота зі специфікаціями
        const specsTable = document.getElementById('p-specs');
        if (specsTable) {
            specsTable.innerHTML = `<tr><td class="label">Аналог</td><td class="val">${data.analog || '---'}</td></tr>`;
        }

        // 4. Логіка кнопки "Додати в корзину" замість прямого переходу в Telegram
        const tgBtn = document.getElementById('tg-order');
        if (tgBtn) {
            tgBtn.innerText = "ДОДАТИ В КОРЗИНУ";
            tgBtn.href = "#";
            tgBtn.onclick = (e) => {
                e.preventDefault();
                CartManager.add({
                    id: data.id,
                    name: data.name,
                    price: data.price
                });
                // Можна додати візуальний фідбек для користувача
                alert(`${data.name} додано до вашої корзини!`);
            };
        }

        // 5. Галерея та Zoom
        renderGallery(data.images);
        initZoom();

    } catch (err) { 
        console.error("Помилка ініціалізації сторінки компонента:", err); 
    }
}

// --- Допоміжні функції ---
function renderGallery(images) {
    const mainImg = document.getElementById('main-img');
    const thumbsRow = document.getElementById('thumbs-row');
    if (images && images.length > 0) {
        mainImg.src = images[0];
        thumbsRow.innerHTML = images.map((src, i) => `
            <img src="${src}" class="thumb ${i === 0 ? 'active' : ''}" onclick="changeMainImage(this, '${src}')">
        `).join('');
    }
}

function changeMainImage(element, src) {
    document.getElementById('main-img').src = src;
    document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
    element.classList.add('active');
}

function initZoom() {
    const mainImg = document.getElementById('main-img');
    const zoomModal = document.getElementById('zoom-modal');
    if (!mainImg || !zoomModal) return;

    mainImg.style.cursor = 'pointer';
    mainImg.onclick = () => {
        document.getElementById('modal-img').src = mainImg.src;
        zoomModal.style.display = 'flex';
    };
    zoomModal.onclick = () => { zoomModal.style.display = 'none'; };
}

//Відгуки
// --- Логіка відгуків ---
async function loadComments() {
    try {
        const response = await fetch('/data/comments.json');
        allReviews = await response.json(); // Зберігаємо у глобальну змінну

        const footer = document.querySelector('footer');
        if (!footer) return;

        const section = document.createElement('section');
        section.id = "reviews-section";
        section.style.margin = "40px auto";
        section.style.maxWidth = "800px";
        footer.parentNode.insertBefore(section, footer);

        renderReviewPage(); // Малюємо першу сторінку
    } catch (err) { console.error("Помилка завантаження відгуків:", err); }
}

function renderReviewPage() {
    const section = document.getElementById('reviews-section');
    const start = (currentReviewPage - 1) * reviewsPerPage;
    const paginated = allReviews.slice(start, start + reviewsPerPage);

    section.innerHTML = `
        <h2 style="text-align: center; margin: 40px 0;">Відгуки про ZXKit</h2>
        <div class="reviews-grid">
            ${paginated.map(c => `
                <div class="review-card" style="border: 1px solid var(--zx-cyan); padding: 15px; margin: 10px 0;">
                    <div class="stars">${'★'.repeat(c.rating)}${'☆'.repeat(5 - c.rating)}</div>
                    <p class="text">"${c.text}"</p>
                    <div class="author"><strong>${c.author}</strong></div>
                    <small class="date">${c.date}</small>
                </div>
            `).join('')}
        </div>
        <div class="pagination-container" style="text-align: center; margin-top: 20px;">
            <button class="page-btn" onclick="changeReviewPage(-1)"> &lt;&lt; ПЕРЕДНІ </button>
            <span id="review-page-info" style="margin: 0 15px;">PAGE ${currentReviewPage}</span>
            <button class="page-btn" onclick="changeReviewPage(1)"> НАСТУПНІ &gt;&gt; </button>
        </div>
    `;
}

// Функція перемикання сторінок відгуків
window.changeReviewPage = function(dir) {
    const maxPages = Math.ceil(allReviews.length / reviewsPerPage);
    const newPage = currentReviewPage + dir;
    if (newPage >= 1 && newPage <= maxPages) {
        currentReviewPage = newPage;
        renderReviewPage();
        document.getElementById('reviews-section').scrollIntoView({ behavior: 'smooth' });
    }
};

// Функція відправки відгуку/питання в Telegram
window.submitComment = function () {
    // 1. Отримуємо елементи
    const nameInput = document.getElementById('name');
    const commentInput = document.getElementById('comment');
    const ratingInput = document.getElementById('rating');

    // 2. Перевіряємо, чи існують ці елементи на сторінці (захист від помилок)
    if (!nameInput || !commentInput) {
        console.error("Поля форми не знайдені на цій сторінці!");
        return;
    }

    const name = nameInput.value.trim();
    const commentText = commentInput.value.trim();
    const rating = ratingInput ? ratingInput.value : "5";

    // Отримуємо назву товару, якщо ми на сторінці товару
    const productName = document.getElementById('p-name') ? document.getElementById('p-name').innerText : "Головна сторінка";

    // 3. Валідація
    if (name === "" || commentText === "") {
        alert("Будь ласка, заповніть ім'я та текст відгуку.");
        return;
    }

    // 4. Формуємо текст повідомлення
    const message = `🔔 Новий відгук з сайту\n\n📦 Товар: ${productName}\n👤 Ім'я: ${name}\n⭐ Рейтинг: ${rating}/5\n💬 Відгук: ${commentText}`;

    // 5. Відкриваємо Telegram
    const telegramUrl = `https://t.me/terabiterr?text=${encodeURIComponent(message)}`;
    window.open(telegramUrl, '_blank');

    // 6. Очищаємо поля
    nameInput.value = "";
    commentInput.value = "";
    alert("Дякуємо! Ваше повідомлення відправлено.");
};

loadComments()

//Cart logic
// --- Логіка корзини в index.js ---
function initCartModal() {
    const btn = document.getElementById('cart-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
        let modal = document.getElementById('cart-modal');
        if (!modal) {
            // Створюємо модалку, якщо її ще немає
            modal = document.createElement('div');
            modal.id = 'cart-modal';
            modal.className = 'modal'; // Додайте стилі в CSS
            modal.innerHTML = `
                <div class="modal-content">
                    <h3>КОРЗИНА</h3>
                    <div id="cart-items-list"></div>
                    <a id="checkout-btn" href="#" class="btn-action">Замовити в Telegram</a>
                    <button onclick="document.getElementById('cart-modal').style.display='none'">Закрити</button>
                    <button id="clear-cart-btn" class="btn-secondary">Очистити корзину</button>
                </div>
            `;
            document.body.appendChild(modal);
            // Слухач для кнопки очищення
            document.getElementById('clear-cart-btn').addEventListener('click', () => {
                CartManager.clear();
            });
        }

        const list = document.getElementById('cart-items-list');
        list.innerHTML = CartManager.items.map(i => `<div>${i.name} - ${i.quantity} шт.</div>`).join('');
        document.getElementById('checkout-btn').href = CartManager.getTelegramLink();
        modal.style.display = 'block';
    });
}

function updateBackButton() {
    const backBtn = document.querySelector('.btn-back');
    if (!backBtn) return;

    // Отримуємо URL попередньої сторінки
    const referrer = document.referrer;

    // Перевіряємо, чи перехід був саме з нашого сайту та з конкретної сторінки
    if (referrer.includes('components.html')) {
        backBtn.href = '/components.html';
        backBtn.innerText = 'Повернутися до компонентів';
    } else {
        // За замовчуванням (або якщо перехід з index.html чи іншого місця)
        backBtn.href = '/';
        backBtn.innerText = 'Повернутися до каталогу';
    }
}

