// --- Змінні для пагінації ---
let allProducts = [];
let currentPage = 1;
const itemsPerPage = 8; 

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    
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

window.changePage = function(step) {
    const maxPages = Math.ceil(allProducts.length / itemsPerPage);
    const newPage = currentPage + step;
    if (newPage >= 1 && newPage <= maxPages) {
        currentPage = newPage;
        renderPage();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

// --- Логіка сторінки товару (Звичайний товар) ---
async function initProductPage() {
    const id = new URLSearchParams(window.location.search).get('id');
    if (!id) return;

    try {
        const resp = await fetch('/data/products.json');
        const list = await resp.json();
        const item = list.find(p => p.id === id);
        if (!item) return;

        const data = item.product;
        document.title = data.name;
        document.getElementById('p-name').innerText = data.name;
        document.getElementById('p-price').innerHTML = `<span>${data.price} ${data.currency || 'UAH'}</span>`;
        document.getElementById('p-desc').innerHTML = data.description;
        document.getElementById('tg-order').href = `https://t.me/terabiterr?text=Хочу замовити ${data.name}`;

        const specsTable = document.getElementById('p-specs');
        if (specsTable && data.specs) {
            specsTable.innerHTML = data.specs.map(s => `<tr><td class="label">${s.label}</td><td class="val">${s.val}</td></tr>`).join('');
        }

        renderGallery(data.images);
        initZoom();
    } catch (err) { console.error(err); }
}

// --- Логіка сторінки компонента ---
async function initComponentPage() {
    const id = new URLSearchParams(window.location.search).get('id');
    if (!id) return;

    try {
        const resp = await fetch('/data/components.json');
        const list = await resp.json();
        const data = list.find(p => p.id === id);
        if (!data) return;

        document.title = data.name;
        document.getElementById('p-name').innerText = data.name;
        document.getElementById('p-price').innerHTML = `<span>${data.price} ${data.currency || 'UAH'}</span>`;
        document.getElementById('p-desc').innerHTML = data.description;
        document.getElementById('tg-order').href = `https://t.me/terabiterr?text=Хочу замовити компонент ${data.name}`;

        const specsTable = document.getElementById('p-specs');
        if (specsTable) {
            specsTable.innerHTML = `<tr><td class="label">Аналог</td><td class="val">${data.analog || '---'}</td></tr>`;
        }

        renderGallery(data.images);
        initZoom();
    } catch (err) { console.error(err); }
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