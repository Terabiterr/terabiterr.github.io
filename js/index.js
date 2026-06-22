/* GARAGE №42 - CORE ENGINE [FIXED] */

document.addEventListener('DOMContentLoaded', () => {
    // Автоматичне визначення сторінки
    if (document.getElementById('products')) loadCatalog();
    if (document.getElementById('components-list')) loadComponents();
    if (document.getElementById('product-root')) loadUniversalProduct();
    
    initZoom(); // Ініціалізація зуму один раз
});

/**
 * 1. УНІВЕРСАЛЬНИЙ ЗАВАНТАЖУВАЧ (ПРАЦЮЄ ДЛЯ ВСІХ ТОВАРІВ)
 */
async function loadUniversalProduct() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const type = urlParams.get('type');
    
    if (!id) return;

    // Вибираємо правильний файл даних
    const dataSource = type === 'comp' ? '/data/components.json' : '/data/catalog.json';

    try {
        const response = await fetch(dataSource);
        const data = await response.json();
        // Знаходимо товар в масиві
        const item = data.find(p => String(p.id) === String(id));

        if (!item) {
            document.getElementById('product-root').innerHTML = '<h1>Товар не знайдено</h1>';
            return;
        }

        // Заповнюємо дані (враховуючи різні назви полів у ваших JSON)
        document.getElementById('p-name').innerText = item.name;
        document.getElementById('p-sku').innerText = `ID: ${item.id}`;
        document.getElementById('p-price').innerText = `${item.price || '0'} UAH`;
        document.getElementById('p-desc').innerHTML = item.description || "Опис відсутній.";
        
        // Кнопка Telegram
        document.getElementById('tg-order').href = `https://t.me/terabiterr?text=Хочу замовити: ${item.name} (ID: ${item.id})`;

        // Галерея (універсально для 'img' або 'images')
        const images = item.images || (item.img ? [item.img] : []);
        if (images.length > 0) {
            document.getElementById('main-img').src = images[0];
            const thumbsRow = document.getElementById('thumbs-row');
            thumbsRow.innerHTML = images.map((src, i) => `
                <img src="${src}" class="thumb ${i === 0 ? 'active' : ''}" 
                     onclick="changeMainImage(this, '${src}')">
            `).join('');
        }
        
        // Якщо є характеристики в JSON
        if (item.specs && document.getElementById('p-specs')) {
            document.getElementById('p-specs').innerHTML = item.specs.map(s => `
                <tr><td class="label">${s.label}</td><td class="val">${s.val}</td></tr>
            `).join('');
        }

    } catch (err) {
        console.error("Помилка завантаження товару:", err);
    }
}

/**
 * 2. ДОПОМІЖНІ ФУНКЦІЇ (ГАЛЕРЕЯ)
 */
function initZoom() {
    const zoomModal = document.getElementById('zoom-modal');
    document.getElementById('main-viewer').onclick = () => {
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

/**
 * 3. ЗАВАНТАЖЕННЯ КАТАЛОГІВ
 */
async function loadCatalog() {
    const response = await fetch('/data/catalog.json');
    const data = await response.json();
    const container = document.getElementById('products');
    container.innerHTML = data.map(p => `
        <a href="/html/product.html?id=${p.id}&type=prod" class="card-link">
            <article class="card">
                <img src="${p.img}" alt="${p.name}">
                <h3>${p.name}</h3>
                <div class="card-price">${p.price} UAH</div>
            </article>
        </a>
    `).join('');
}

async function loadComponents() {
    const response = await fetch('/data/components.json');
    const data = await response.json();
    const container = document.getElementById('components-list');
    container.innerHTML = data.map(item => `
        <a href="/html/product.html?id=${item.id}&type=comp" class="card-link">
            <article class="card">
                <img src="${item.images[0]}" alt="${item.name}">
                <h3>${item.name}</h3>
                <div class="card-price">${item.price} UAH</div>
            </article>
        </a>
    `).join('');
}