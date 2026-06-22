/* GARAGE №42 - CORE ENGINE [UNIVERSAL] */

let currentPage = 1;
const itemsPerPage = 12;

document.addEventListener('DOMContentLoaded', () => {
    console.log("Garage 42 System: Universal Engine Ready.");

    // Визначаємо, яку сторінку ми завантажили
    if (document.getElementById('products')) loadCatalog();
    if (document.getElementById('components-list')) loadComponents();
    if (document.getElementById('product-root')) loadUniversalProduct();

    initSidebarEffects();
});

/**
 * УНІВЕРСАЛЬНИЙ ЗАВАНТАЖУВАЧ ТОВАРУ/КОМПОНЕНТА
 */
async function loadUniversalProduct() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const type = urlParams.get('type'); // 'prod' або 'comp'
    
    if (!id) return;

    // Визначаємо джерело даних та шлях "Назад"
    const dataSource = type === 'comp' ? '/data/components.json' : '/data/products.json';
    document.getElementById('back-link').href = type === 'comp' ? '/components.html' : '/';

    try {
        const response = await fetch(dataSource);
        const allItems = await response.json();
        
        // Знаходимо елемент (уніфіковано)
        const item = allItems.find(p => String(p.id) === String(id));
        if (!item) {
            document.getElementById('product-root').innerHTML = '<h1>Товар не знайдено</h1>';
            return;
        }

        // Рендеринг контенту (залежно від структури вашого JSON)
        // Припускаємо, що структура JSON може трохи відрізнятися, 
        // тому використовуємо логіку "або-або"
        const name = item.name || item.product?.name;
        const price = item.price || item.product?.price;
        const desc = item.description || item.product?.description;
        const images = item.images || item.product?.images;

        document.title = `${name} | ZX-Kit`;
        document.getElementById('p-name').innerText = name;
        document.getElementById('p-sku').innerText = `ID: ${item.id}`;
        document.getElementById('p-price').innerText = `${price} ${item.currency || 'UAH'}`;
        document.getElementById('p-desc').innerHTML = desc;
        document.getElementById('tg-order').href = `https://t.me/terabiterr?text=Вітаю! Хочу замовити ${name} (ID: ${item.id})`;

        // Галерея
        if (images && images.length > 0) {
            const mainImg = document.getElementById('main-img');
            mainImg.src = images[0];
            const thumbsRow = document.getElementById('thumbs-row');
            thumbsRow.innerHTML = images.map((src, i) => `
                <img src="${src}" class="thumb ${i === 0 ? 'active' : ''}" 
                     onclick="changeMainImage(this, '${src}')">
            `).join('');
            initZoom();
        }

    } catch (err) {
        console.error("Помилка завантаження деталів:", err);
    }
}

/**
 * РЕНДЕР КАТАЛОГІВ (Посилання тепер ведуть на /html/product.html)
 */
function loadComponents() {
    fetch('/data/components.json')
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById('components-list');
            container.innerHTML = data.map(item => `
                <a href="/html/product.html?id=${item.id}&type=comp" class="card-link">
                    <article class="card">
                        <img src="${item.images[0]}" alt="${item.name}" loading="lazy">
                        <h3>${item.name}</h3>
                        <div class="card-price">${item.price} ${item.currency}</div>
                    </article>
                </a>
            `).join('');
        });
}

// Аналогічно оновіть посилання в loadCatalog():
// <a href="/html/product.html?id=${p.id}&type=prod" class="card-link">

/**
 * ГАЛЕРЕЯ ТА ЗУМ
 */
function initZoom() {
    const mainViewer = document.getElementById('main-viewer');
    const zoomModal = document.getElementById('zoom-modal');
    mainViewer.onclick = () => {
        document.getElementById('modal-img').src = document.getElementById('main-img').src;
        zoomModal.style.display = 'flex';
    };
    zoomModal.onclick = () => zoomModal.style.display = 'none';
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