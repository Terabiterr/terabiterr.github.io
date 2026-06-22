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

    // Визначаємо файл залежно від типу
    const dataSource = type === 'comp' ? '/data/components.json' : '/data/products.json';

    try {
        const response = await fetch(dataSource);
        const data = await response.json();
        
        // Знаходимо товар
        const item = data.find(p => String(p.id) === String(id));
        if (!item) {
            console.error("Товар не знайдено");
            return;
        }

        // --- ВИПРАВЛЕННЯ: Додаємо перевірку на вкладеність ---
        const p = item.product || item; 

        // Заповнюємо поля
        document.getElementById('p-name').innerText = p.name || "Без назви";
        document.getElementById('p-id').innerText = `SKU: ${p.sku || p.id}`;
        document.getElementById('p-price').innerText = `${p.price || 0} ${p.currency || 'UAH'}`;
        
        // Опис (innerHTML для вставки тексту)
        if (document.getElementById('p-desc')) {
            document.getElementById('p-desc').innerHTML = p.description || "";
        }

        // Галерея
        const images = p.images || (p.img ? [p.img] : []);
        if (images.length > 0) {
            document.getElementById('main-img').src = images[0];
            const thumbsRow = document.getElementById('thumbs-row');
            if (thumbsRow) {
                thumbsRow.innerHTML = images.map((src, i) => `
                    <img src="${src}" class="thumb ${i === 0 ? 'active' : ''}" 
                         onclick="changeMainImage(this, '${src}')">
                `).join('');
            }
        }
        
        // Характеристики (specs)
        const specsTable = document.querySelector('.spec-table');
        if (p.specs && specsTable) {
            specsTable.innerHTML = p.specs.map(s => `
                <tr>
                    <td class="label">${s.label}</td>
                    <td class="val">${s.val}</td>
                </tr>
            `).join('');
        }

    } catch (err) { console.error("Помилка:", err); }
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