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
        const response = await fetch(`/data/products/${productId}.json`);
        const data = await response.json();

        // Оновлюємо DOM (припустимо, що у вашому template.html є ці ID)
        document.title = data.meta.title;
        container.innerHTML = `
            <h1>${data.product.name}</h1>
            <div class="gallery">${data.product.images.map(img => `<img src="${img}" alt="${data.product.name}">`).join('')}</div>
            <div class="info">
                <div class="price">${data.product.price} ${data.product.currency}</div>
                <ul>${data.product.specs.map(s => `<li><b>${s.label}:</b> ${s.val}</li>`).join('')}</ul>
                <div class="description">${data.product.description}</div>
            </div>
        `;
    } catch (err) {
        container.innerHTML = "<h1>Товар не знайдено</h1>";
        console.error("Помилка завантаження товару:", err);
    }
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