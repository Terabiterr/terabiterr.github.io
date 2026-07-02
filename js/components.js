const CatalogManager = {
    allData: [],
    filteredData: [],
    currentPage: 1,
    itemsPerPage: 12,

    async init() {
        try {
            const resp = await fetch('/data/components.json');
            this.allData = await resp.json();
            this.filteredData = [...this.allData];
            this.render();

            // Налаштовуємо всі обробники
            this.setupEventListeners();
        } catch (err) {
            console.error("Помилка завантаження компонентів:", err);
        }
    },

    setupEventListeners() {
        // 1. Пошук
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }

        // 2. Фільтри (обробка кнопок)
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Візуальна активність
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');

                // Значення з data-category
                const filterValue = e.target.dataset.category;

                // Вписуємо текст у пошук, якщо натиснули кнопку, крім "ВСЕ"
                if (searchInput) {
                    searchInput.value = filterValue === "" ? "" : e.target.innerText;
                }

                this.handleSearch(filterValue);
            });
        });
    },

    handleSearch(term) {
        const t = term.toLowerCase();

        // Якщо прийшов пустий рядок (кнопка "ВСЕ"), показуємо все
        if (t === "") {
            this.filteredData = [...this.allData];
        } else {
            // Фільтруємо за категорією (якщо збігається data-category) 
            // АБО за текстовим запитом у назві/описі
            this.filteredData = this.allData.filter(c => {
                const matchesCategory = (c.category && c.category.toLowerCase() === t);
                const matchesText = (c.name && c.name.toLowerCase().includes(t)) ||
                    (c.description && c.description.toLowerCase().includes(t));

                return matchesCategory || matchesText;
            });
        }

        this.currentPage = 1;
        this.render();
    },

    changePage(step) {
        const max = Math.ceil(this.filteredData.length / this.itemsPerPage);
        if (this.currentPage + step >= 1 && this.currentPage + step <= max) {
            this.currentPage += step;
            this.render();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    },

    render() {
        const container = document.getElementById('components-list');
        if (!container) return;

        const start = (this.currentPage - 1) * this.itemsPerPage;
        const pageItems = this.filteredData.slice(start, start + this.itemsPerPage);

        container.innerHTML = pageItems.map(c => `
            <a href="/products/template.html?id=${c.id}&isComponent=true" class="card-link">
                <article class="card">
                    <img src="${c.images[0]}" alt="${c.name}" loading="lazy">
                    <h3>${c.name}</h3>
                    <div class="card-price">${c.price} ${c.currency || 'UAH'}</div>
                </article>
            </a>
        `).join('');

        this.renderPagination();
    },

    renderPagination() {
        const nav = document.getElementById('pagination');
        if (!nav) return;
        const total = Math.ceil(this.filteredData.length / this.itemsPerPage);

        if (total <= 1) { nav.innerHTML = ''; return; }

        nav.innerHTML = `
            <button onclick="CatalogManager.changePage(-1)" ${this.currentPage === 1 ? 'disabled' : ''}>«</button>
            <span>PAGE ${this.currentPage} / ${total}</span>
            <button onclick="CatalogManager.changePage(1)" ${this.currentPage === total ? 'disabled' : ''}>»</button>
        `;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('components-list')) {
        CatalogManager.init();
    }
});

