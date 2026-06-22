/* GARAGE №42 - CORE ENGINE [JS]
    Керує завантаженням товарів з catalog.json, пагінацією та ефектами.
*/

// Глобальні змінні
let allProducts = [];
let currentPage = 1;
const itemsPerPage = 12;

/**
 * Ініціалізація системи при завантаженні
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log("Garage 42 System: Ready. SEO Mode: Active.");
    
    // Завантажуємо каталог, якщо ми на головній
    if (document.getElementById('products')) {
        loadCatalog();
    }

    // Завантажуємо компоненти, якщо ми на сторінці компонентів
    if (document.getElementById('components-list')) {
        loadComponents();
    }

    // Завантажуємо деталі товару, якщо ми на сторінці шаблону
    if (document.getElementById('product-root')) {
        loadProductDetails();
    }

    initSidebarEffects();
});

/**
 * 1. Завантаження та відображення каталогу товарів
 */
async function loadCatalog() {
    try {
        const response = await fetch('/data/catalog.json');
        allProducts = await response.json();
        renderPage();
    } catch (err) {
        console.error("Помилка завантаження каталогу:", err);
        document.getElementById('products').innerHTML = "<p>Помилка завантаження даних...</p>";
    }
}

function renderPage() {
    const container = document.getElementById('products');
    const totalPages = Math.ceil(allProducts.length / itemsPerPage);
    
    const start = (currentPage - 1) * itemsPerPage;
    const paginatedItems = allProducts.slice(start, start + itemsPerPage);

    container.innerHTML = paginatedItems.map(p => `
        <a href="/products/template.html?id=${p.id}" class="card-link">
            <article class="card">
                <img src="${p.img}" alt="${p.name}" loading="lazy">
                <h3>${p.name}</h3>
                <div class="card-price">${p.price} UAH</div>
                <div style="font-size:8px; color:var(--zx-cyan)">ID: ${p.id} | ДЕТАЛЬНІШЕ >></div>
            </article>
        </a>
    `).join('');

    document.getElementById('page-info').innerText = `PAGE ${currentPage} OF ${totalPages}`;
    document.getElementById('prevPage').disabled = (currentPage === 1);
    document.getElementById('nextPage').disabled = (currentPage === totalPages);
}

function changePage(step) {
    const totalPages = Math.ceil(allProducts.length / itemsPerPage);
    if (currentPage + step >= 1 && currentPage + step <= totalPages) {
        currentPage += step;
        renderPage();
        document.querySelector('#catalog-section').scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * 2. Завантаження радіокомпонентів
 */
async function loadComponents() {
    const container = document.getElementById('components-list');
    try {
        const response = await fetch('/data/components.json');
        const components = await response.json();
        
        container.innerHTML = components.map(item => `
            <a href="components/template.html?id=${item.id}" class="card-link">
                <article class="card">
                    <img src="${(item.images && item.images[0]) || '/img/no-image.png'}" alt="${item.name}">
                    <h3>${item.name}</h3>
                    <p>Аналог: ${item.analog}</p>
                    <div class="card-price">${item.price} ${item.currency}</div>
                </article>
            </a>
        `).join('');
    } catch (err) {
        console.error("Помилка завантаження компонентів:", err);
    }
}

/**
 * 4. Завантаження деталей конкретного товару
 */
async function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const container = document.getElementById('product-root');

    if (!productId) return;

    try {
        // Завантажуємо весь список товарів
        const response = await fetch('/data/products.json');
        const products = await response.json();
        
        // Шукаємо конкретний товар у масиві
        const data = products.find(p => p.id === productId);

        if (!data) {
            container.innerHTML = "<h1>Товар не знайдено</h1>";
            return;
        }

        // Рендеринг (використовуємо існуючі ID з вашого template.html)
        document.title = data.meta.title;
        document.getElementById('p-name').innerText = data.product.name;
        document.getElementById('p-sku').innerText = `SKU: ${data.product.sku}`;
        document.getElementById('p-price').innerHTML = `<span>${data.product.price}</span> <span>${data.product.currency}</span>`;
        document.getElementById('p-desc').innerHTML = data.product.description;

        const specsTable = document.getElementById('p-specs');
        specsTable.innerHTML = data.product.specs.map(s => `<tr><td class="label">${s.label}</td><td class="val">${s.val}</td></tr>`).join('');

        const mainImg = document.getElementById('main-img');
        const thumbsRow = document.getElementById('thumbs-row');
        mainImg.src = data.product.images[0];
        thumbsRow.innerHTML = data.product.images.map((src, i) => `
            <img src="${src}" class="thumb ${i === 0 ? 'active' : ''}" 
                 onclick="document.getElementById('main-img').src='${src}'; document.querySelectorAll('.thumb').forEach(t=>t.classList.remove('active')); this.classList.add('active')">
        `).join('');

        document.getElementById('tg-order').href = `https://t.me/terabiterr?text=Вітаю! Хочу замовити ${data.product.name}`;

    } catch (err) {
        console.error("Помилка:", err);
        container.innerHTML = "<h1>Помилка завантаження даних</h1>";
    }
}

// Додайте цю функцію окремо в index.js, щоб галерея працювала
function changeMainImage(element, src) {
    document.getElementById('main-img').src = src;
    document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
    element.classList.add('active');
}

/**
 * 3. Ефекти інтерфейсу
 */
function initSidebarEffects() {
    const lines = document.querySelectorAll('.guide-line');
    lines.forEach((line, index) => {
        setTimeout(() => line.style.color = 'var(--zx-yellow)', index * 200);
    });
}

document.addEventListener('error', function (e) {
    if (e.target.tagName.toLowerCase() === 'img') {
        e.target.style.opacity = '0.5';
    }
}, true);