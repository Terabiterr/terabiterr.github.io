/* GARAGE №42 - CORE ENGINE [UNIVERSAL] */

let allProducts = [];
let currentPage = 1;
const itemsPerPage = 12;

document.addEventListener('DOMContentLoaded', () => {
    console.log("Garage 42 System: Universal Engine Initialized.");

    // Виклик функцій тільки якщо є відповідні елементи на сторінці
    if (document.getElementById('products')) loadCatalog();
    if (document.getElementById('components-list')) loadComponents();
    if (document.getElementById('product-root')) loadUniversalProduct();

    initSidebarEffects();
});

/**
 * 1. ЛОГІКА КАТАЛОГУ (ГОЛОВНА)
 */
async function loadCatalog() {
    try {
        const response = await fetch('/data/catalog.json');
        allProducts = await response.json();
        renderPage();
    } catch (err) { console.error("Помилка завантаження каталогу:", err); }
}

function renderPage() {
    const container = document.getElementById('products');
    if (!container) return;

    const start = (currentPage - 1) * itemsPerPage;
    const paginatedItems = allProducts.slice(start, start + itemsPerPage);

    container.innerHTML = paginatedItems.map(p => `
        <a href="/html/product.html?id=${p.id}&type=prod" class="card-link">
            <article class="card">
                <img src="${p.img}" alt="${p.name}" loading="lazy">
                <h3>${p.name}</h3>
                <div class="card-price">${p.price} UAH</div>
            </article>
        </a>
    `).join('');

    // Оновлення кнопок пагінації (якщо вони є)
    const pageInfo = document.getElementById('page-info');
    if (pageInfo) pageInfo.innerText = `PAGE ${currentPage}`;
}

/**
 * 2. ЗАВАНТАЖУВАЧ КОМПОНЕНТІВ
 */
async function loadComponents() {
    try {
        const response = await fetch('/data/components.json');
        const data = await response.json();
        const container = document.getElementById('components-list');
        
        container.innerHTML = data.map(item => `
            <a href="/html/product.html?id=${item.id}&type=comp" class="card-link">
                <article class="card">
                    <img src="${(item.images && item.images[0]) || '/img/no-image.png'}" alt="${item.name}">
                    <h3>${item.name}</h3>
                    <div class="card-price">${item.price} ${item.currency}</div>
                </article>
            </a>
        `).join('');
    } catch (err) { console.error("Помилка завантаження компонентів:", err); }
}

/**
 * 3. УНІВЕРСАЛЬНИЙ ЗАВАНТАЖУВАЧ ТОВАРУ/КОМПОНЕНТА
 */
async function loadUniversalProduct() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const type = urlParams.get('type');
    
    if (!id) return;

    const dataSource = type === 'comp' ? '/data/components.json' : '/data/products.json';
    const backLink = document.getElementById('back-link');
    if (backLink) backLink.href = type === 'comp' ? '/components.html' : '/';

    try {
        const response = await fetch(dataSource);
        const allItems = await response.json();
        const item = allItems.find(p => String(p.id) === String(id));

        if (!item) {
            document.getElementById('product-root').innerHTML = '<h1>Товар не знайдено</h1>';
            return;
        }

        // Рендер даних (уніфіковано для двох структур JSON)
        const name = item.name || item.product?.name;
        const price = item.price || item.product?.price;
        const desc = item.description || item.product?.description;
        const images = item.images || item.product?.images;

        document.title = `${name} | ZX-Kit`;
        document.getElementById('p-name').innerText = name;
        document.getElementById('p-sku').innerText = `ID: ${item.id}`;
        document.getElementById('p-price').innerText = `${price} ${item.currency || 'UAH'}`;
        document.getElementById('p-desc').innerHTML = desc;
        document.getElementById('tg-order').href = `https://t.me/terabiterr?text=Вітаю! Хочу замовити ${name}`;

        if (images && images.length > 0) {
            document.getElementById('main-img').src = images[0];
            document.getElementById('thumbs-row').innerHTML = images.map((src, i) => `
                <img src="${src}" class="thumb ${i === 0 ? 'active' : ''}" 
                     onclick="changeMainImage(this, '${src}')">
            `).join('');
            initZoom();
        }
    } catch (err) { console.error("Помилка завантаження деталів:", err); }
}

/**
 * 4. ГАЛЕРЕЯ ТА ІНШЕ
 */
function initZoom() {
    const mainViewer = document.getElementById('main-viewer');
    const zoomModal = document.getElementById('zoom-modal');
    if (mainViewer && zoomModal) {
        mainViewer.onclick = () => {
            document.getElementById('modal-img').src = document.getElementById('main-img').src;
            zoomModal.style.display = 'flex';
        };
        zoomModal.onclick = () => zoomModal.style.display = 'none';
    }
}

function changeMainImage(element, src) {
    document.getElementById('main-img').src = src;
    document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
    element.classList.add('active');
}

function initSidebarEffects() {
    document.querySelectorAll('.guide-line').forEach((line, i) => {
        setTimeout(() => line.style.color = 'var(--zx-yellow)', i * 200);
    });
}