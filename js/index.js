тепер напиши повну версію index.js
Ось моя стара версія
Зверни увагу я наш універсальний шаблон поклав в html/product.html
/* GARAGE №42 - CORE ENGINE [JS]
   Керує завантаженням товарів, пагінацією, галереєю та зумом зображень.
*/

let allProducts = [];
let currentPage = 1;
const itemsPerPage = 12;

document.addEventListener('DOMContentLoaded', () => {
    console.log("Garage 42 System: Ready. SEO Mode: Active.");

    if (document.getElementById('products')) loadCatalog();
    if (document.getElementById('components-list')) loadComponents();
    if (document.getElementById('product-root')) loadProductDetails();

    initSidebarEffects();
});

/**
 * 1. Логіка галереї та ЗУМ (Універсальна)
 */
function initZoom() {
    const mainViewer = document.getElementById('main-viewer');
    const zoomModal = document.getElementById('zoom-modal');
    const modalImg = document.getElementById('modal-img');
    const mainImg = document.getElementById('main-img');

    if (mainViewer && zoomModal && modalImg && mainImg) {
        mainViewer.onclick = () => {
            modalImg.src = mainImg.src;
            zoomModal.style.display = 'flex';
        };
        zoomModal.onclick = () => {
            zoomModal.style.display = 'none';
        };
    }
}

function changeMainImage(element, src) {
    const mainImg = document.getElementById('main-img');
    mainImg.src = src;
    document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
    element.classList.add('active');
}

/**
 * 2. Завантаження каталогу
 */
async function loadCatalog() {
    try {
        const response = await fetch('/data/catalog.json');
        allProducts = await response.json();
        renderPage();
    } catch (err) {
        console.error("Помилка завантаження каталогу:", err);
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
    currentPage += step;
    renderPage();
    document.querySelector('#catalog-section').scrollIntoView({ behavior: 'smooth' });
}

/**
 * 3. Завантаження деталей товару (Універсальний рендеринг)
 */
async function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    if (!productId) return;

    try {
        const response = await fetch('/data/products.json');
        const products = await response.json();
        const data = products.find(p => p.id === productId);

        if (!data) return;

        // Заповнення метаданих та контенту
        document.title = data.meta.title;
        document.getElementById('p-name').innerText = data.product.name;
        document.getElementById('p-sku').innerText = `SKU: ${data.product.sku}`;
        document.getElementById('p-price').innerHTML = `<span>${data.product.price}</span> <span>${data.product.currency}</span>`;
        document.getElementById('p-desc').innerHTML = data.product.description;
        document.getElementById('tg-order').href = `https://t.me/terabiterr?text=Вітаю! Хочу замовити ${data.product.name}`;

        // Специфікації
        const specsTable = document.getElementById('p-specs');
        specsTable.innerHTML = data.product.specs.map(s => `<tr><td class="label">${s.label}</td><td class="val">${s.val}</td></tr>`).join('');

        // Галерея
        const mainImg = document.getElementById('main-img');
        const thumbsRow = document.getElementById('thumbs-row');
        mainImg.src = data.product.images[0];
        
        thumbsRow.innerHTML = data.product.images.map((src, i) => `
            <img src="${src}" class="thumb ${i === 0 ? 'active' : ''}" 
                 onclick="changeMainImage(this, '${src}')">
        `).join('');

        // Активуємо зум після рендерингу
        initZoom();

    } catch (err) {
        console.error("Помилка завантаження товару:", err);
    }
}

/**
 * 4. Інше
 */
function initSidebarEffects() {
    const lines = document.querySelectorAll('.guide-line');
    lines.forEach((line, index) => {
        setTimeout(() => line.style.color = 'var(--zx-yellow)', index * 200);
    });
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