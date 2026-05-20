/* 
    GARAGE №42 - CORE ENGINE [JS]
    Цей файл відповідає за динамічні елементи головної сторінки:
    1. Магічний рядок (Marquee)
    2. Пагінація каталогу
    3. Анімація при скролі
*/

// Налаштування пагінації
const itemsPerPage = 12; 
let currentPage = 1;

/**
 * Оновлює видимість карток товарів залежно від поточної сторінки
 */
function updatePagination() {
    const cards = document.querySelectorAll('.card-link'); 
    const totalPages = Math.ceil(cards.length / itemsPerPage);
    
    cards.forEach((card, index) => {
        const isVisible = index >= (currentPage - 1) * itemsPerPage && index < currentPage * itemsPerPage;
        card.style.display = isVisible ? 'block' : 'none';
    });

    // Оновлення текстового індикатора сторінок
    const pageInfo = document.getElementById('page-info');
    if (pageInfo) {
        pageInfo.innerText = `PAGE ${currentPage} OF ${totalPages || 1}`;
    }

    // Керування станом кнопок
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');

    if (prevBtn) prevBtn.disabled = (currentPage === 1);
    if (nextBtn) nextBtn.disabled = (currentPage === totalPages || totalPages === 0);
}

/**
 * Змінює поточну сторінку
 * @param {number} step - Крок (1 або -1)
 */
function changePage(step) {
    const cards = document.querySelectorAll('.card-link');
    const totalPages = Math.ceil(cards.length / itemsPerPage);
    
    if (currentPage + step >= 1 && currentPage + step <= totalPages) {
        currentPage += step;
        updatePagination();
        
        // Плавний скрол вгору до початку каталогу
        const catalogHeader = document.querySelector('#catalog-section');
        if (catalogHeader) {
            catalogHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

/**
 * Ефект "друкарської машинки" для маркерів у сайдбарі (опціонально)
 */
function initSidebarEffects() {
    const lines = document.querySelectorAll('.guide-line');
    lines.forEach((line, index) => {
        setTimeout(() => {
            line.style.color = 'var(--zx-yellow)';
        }, index * 200);
    });
}

// Запуск при завантаженні DOM
document.addEventListener('DOMContentLoaded', () => {
    updatePagination();
    initSidebarEffects();
    
    console.log("Garage 42 System: Ready. SEO Mode: Active.");
});

/**
 * Обробка помилок завантаження зображень
 * (якщо фото не знайдено, замінюємо на заглушку)
 */
document.addEventListener('error', function (e) {
    if (e.target.tagName.toLowerCase() === 'img') {
        // e.target.src = './img/no-image.png'; // Можна додати свою заглушку
        e.target.style.opacity = '0.5';
    }
}, true);