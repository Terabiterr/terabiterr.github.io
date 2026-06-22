document.addEventListener('DOMContentLoaded', async () => {
    // 1. Отримуємо ID товару з URL (наприклад: template.html?id=4164-15nl)
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    const mainViewerImg = document.getElementById('main-img');
    const zoomModal = document.getElementById('zoom-modal');
    const modalImg = document.getElementById('modal-img');

    if (!productId) {
        window.location.href = '/components.html';
        return;
    }

    try {
        // 2. Завантажуємо базу даних
        const response = await fetch('/data/components.json');
        const components = await response.json();
        const product = components.find(item => item.id === productId);

        if (!product) {
            document.body.innerHTML = '<h1>Товар не знайдено</h1>';
            return;
        }

        // 3. Заповнюємо контент
        document.getElementById('p-name').innerText = product.name;
        document.getElementById('p-id').innerText = `SKU: ${product.id}`;
        document.getElementById('p-analog').innerText = product.analog;
        document.getElementById('p-price').innerText = `${product.price} ${product.currency}`;
        document.getElementById('p-desc').innerText = product.description;
        
        // Посилання на Telegram
        document.getElementById('tg-order').href = `https://t.me/terabiterr?text=Вітаю! Хочу замовити ${product.name} (${product.id})`;

        // 4. Логіка галереї
        if (product.images && product.images.length > 0) {
            mainViewerImg.src = product.images[0]; // Перше фото головне
            
            const thumbsRow = document.getElementById('thumbs-row');
            product.images.forEach((src, index) => {
                const img = document.createElement('img');
                img.src = src;
                img.className = 'thumb';
                if (index === 0) img.classList.add('active');

                // Перемикання фото
                img.onclick = () => {
                    mainViewerImg.src = src;
                    document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
                    img.classList.add('active');
                };
                thumbsRow.appendChild(img);
            });
        }

        // 5. Логіка модального вікна (Зум)
        document.getElementById('main-viewer').onclick = () => {
            modalImg.src = mainViewerImg.src;
            zoomModal.style.display = 'flex';
        };

        zoomModal.onclick = () => {
            zoomModal.style.display = 'none';
        };

    } catch (err) {
        console.error("Помилка завантаження товару:", err);
    }
});