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
        const searchInput = document.getElementById('search-input');
        const categorySelect = document.getElementById('category-filter');

        // Обробка пошуку
        if (searchInput) {
            searchInput.addEventListener('input', () => this.applyFilters());
        }

        // Обробка випадаючого списку
        if (categorySelect) {
            categorySelect.addEventListener('change', () => this.applyFilters());
        }
    },

    applyFilters() {
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        const categoryValue = document.getElementById('category-filter').value.toLowerCase();

        this.filteredData = this.allData.filter(c => {
            const matchesCategory = categoryValue === "" || (c.category && c.category.toLowerCase() === categoryValue);
            const matchesText = (c.name && c.name.toLowerCase().includes(searchTerm)) ||
                                (c.description && c.description.toLowerCase().includes(searchTerm));

            return matchesCategory && matchesText;
        });

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

