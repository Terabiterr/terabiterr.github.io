document.addEventListener('DOMContentLoaded', () => {
    // Якщо ми на сторінці з ідентифікатором product-root, завантажуємо дані
    if (document.getElementById('product-root')) {
        loadProductDetails();
    }
});

/**
 * 1. Завантаження деталей товару або компонента
 */
async function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const type = urlParams.get('type'); // Очікуємо 'product' або 'component'

    if (!productId || !type) return;

    try {
        const file = type === 'product' ? '/data/products.json' : '/data/components.json';
        const response = await fetch(file);
        const list = await response.json();
        
        const item = list.find(p => p.id === productId);
        if (!item) return;

        // Для продуктів дані лежать у ключі "product", для компонентів - у самому об'єкті
        const content = type === 'product' ? item.product : item;

        // Заповнення тексту
        document.title = content.name;
        document.getElementById('p-name').innerText = content.name;
        document.getElementById('p-id').innerText = `SKU: ${content.sku || content.id}`;
        document.getElementById('p-price').innerHTML = `<span>${content.price}</span> <span>${content.currency || 'UAH'}</span>`;
        document.getElementById('p-desc').innerHTML = content.description;
        document.getElementById('tg-order').href = `https://t.me/terabiterr?text=Хочу замовити ${content.name}`;

        // Таблиця специфікацій (адаптивна логіка)
        const specsTable = document.getElementById('p-specs');
        if (type === 'component') {
            specsTable.innerHTML = `<tr><td class="label">Аналог</td><td class="val">${content.analog}</td></tr>`;
        } else if (content.specs) {
            specsTable.innerHTML = content.specs.map(s => 
                `<tr><td class="label">${s.label}</td><td class="val">${s.val}</td></tr>`
            ).join('');
        }

        // Галерея
        const mainImg = document.getElementById('main-img');
        const thumbsRow = document.getElementById('thumbs-row');
        
        mainImg.src = content.images[0];
        thumbsRow.innerHTML = content.images.map((src, i) => `
            <img src="${src}" class="thumb ${i === 0 ? 'active' : ''}" 
                 onclick="changeMainImage(this, '${src}')">
        `).join('');

        initZoom();

    } catch (err) {
        console.error("Помилка завантаження товару:", err);
    }
}

/**
 * 2. Логіка галереї (Зміна зображень та зум)
 */
function changeMainImage(element, src) {
    const mainImg = document.getElementById('main-img');
    mainImg.src = src;
    document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
    element.classList.add('active');
}

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

/**
 * 3. Логіка пагінації (для головної сторінки)
 */
function changePage(step) {
    currentPage += step;
    renderPage();
    // Прокручуємо до секції з товарами
    const section = document.querySelector('#products') || document.querySelector('#catalog-section');
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}