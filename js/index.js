/* GARAGE №42 - ОПТИМІЗОВАНИЙ ENGINE */

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('products')) loadCatalog();
    if (document.getElementById('components-list')) loadComponents();
    if (document.getElementById('product-root')) loadUniversalProduct();
});

// УНІВЕРСАЛЬНЕ ЗАВАНТАЖЕННЯ ДЕТАЛЕЙ
async function loadUniversalProduct() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const type = urlParams.get('type');
    if (!id) return;

    const dataSource = type === 'comp' ? '/data/components.json' : '/data/products.json';

    try {
        const response = await fetch(dataSource);
        const data = await response.json();
        
        // Знаходимо товар: обробляємо і масиви, і вкладені об'єкти
        const item = data.find(p => String(p.id) === String(id));
        if (!item) return;

        // Витягуємо дані (враховуємо вкладеність .product)
        const p = item.product || item; 
        
        document.getElementById('p-name').innerText = p.name || "Без назви";
        document.getElementById('p-sku').innerText = `SKU: ${p.sku || p.id}`;
        document.getElementById('p-price').innerText = `${p.price || 0} ${p.currency || 'UAH'}`;
        document.getElementById('p-desc').innerHTML = p.description || "";

        // Галерея: беремо масив зображень або одне зображення
        const images = p.images || (p.img ? [p.img] : []);
        if (images.length > 0) {
            document.getElementById('main-img').src = images[0];
            const thumbs = document.getElementById('thumbs-row');
            if (thumbs) {
                thumbs.innerHTML = images.map(src => `<img src="${src}" class="thumb" onclick="changeMainImage(this, '${src}')">`).join('');
            }
        }
    } catch (e) { console.error("Помилка:", e); }
}

// Завантаження каталогу
async function loadCatalog() {
    const response = await fetch('/data/catalog.json');
    const data = await response.json();
    const container = document.getElementById('products');
    // Використовуємо p.img, як у вашому catalog.json
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

function changeMainImage(el, src) {
    document.getElementById('main-img').src = src;
}