document.addEventListener('DOMContentLoaded', () => {
    // Якщо ми на сторінці товару
    if (document.getElementById('product-root')) {
        initProductPage();
    }
    // Якщо на головній (каталог)
    if (document.getElementById('products')) {
        loadCatalog();
    }
});

/** * Універсальний завантажувач даних для сторінки товару 
 */
async function initProductPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (!id) return;

    try {
        // 1. Спочатку пробуємо знайти як Продукт
        const prodResp = await fetch('/data/products.json');
        const productsList = await prodResp.json();
        let item = productsList.find(p => p.id === id);
        let data = null;
        let isComponent = false;

        if (item) {
            data = item.product; // Структура з вашого products.json
        } else {
            // 2. Якщо не знайшли, пробуємо як Компонент
            const compResp = await fetch('/data/components.json');
            const compList = await compResp.json();
            item = compList.find(p => p.id === id);
            if (item) {
                data = item; // Структура з вашого components.json
                isComponent = true;
            }
        }

        if (!data) {
            document.getElementById('p-name').innerText = "Товар не знайдено";
            return;
        }

        // Рендеринг даних
        document.title = data.name;
        document.getElementById('p-name').innerText = data.name;
        document.getElementById('p-price').innerHTML = `<span>${data.price} ${data.currency || 'UAH'}</span>`;
        document.getElementById('p-desc').innerHTML = data.description;
        document.getElementById('tg-order').href = `https://t.me/terabiterr?text=Хочу замовити ${data.name}`;

        // Специфікації
        const specsTable = document.getElementById('p-specs');
        if (specsTable) {
            if (isComponent) {
                specsTable.innerHTML = `<tr><td class="label">Аналог</td><td class="val">${data.analog || '---'}</td></tr>`;
            } else if (data.specs) {
                specsTable.innerHTML = data.specs.map(s => `<tr><td class="label">${s.label}</td><td class="val">${s.val}</td></tr>`).join('');
            }
        }

        // Галерея
        const mainImg = document.getElementById('main-img');
        const thumbsRow = document.getElementById('thumbs-row');
        if (data.images && data.images.length > 0) {
            mainImg.src = data.images[0];
            thumbsRow.innerHTML = data.images.map((src, i) => `
                <img src="${src}" class="thumb ${i === 0 ? 'active' : ''}" onclick="changeMainImage(this, '${src}')">
            `).join('');
        }

    } catch (err) {
        console.error("Помилка завантаження даних:", err);
    }
}

/** Завантаження головної сторінки */
async function loadCatalog() {
    try {
        const response = await fetch('/data/catalog.json');
        const catalog = await response.json();
        const container = document.getElementById('products');
        
        container.innerHTML = catalog.map(p => `
            <a href="/products/template.html?id=${p.id}" class="card-link">
                <article class="card">
                    <img src="${p.img}" alt="${p.name}" loading="lazy">
                    <h3>${p.name}</h3>
                    <div class="card-price">${p.price} UAH</div>
                </article>
            </a>
        `).join('');
    } catch (err) { console.error(err); }
}

function changeMainImage(element, src) {
    document.getElementById('main-img').src = src;
    document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
    element.classList.add('active');
}