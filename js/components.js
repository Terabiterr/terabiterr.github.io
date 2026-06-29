const CatalogManager = {
    allData: [],
    filteredData: [],
    currentPage: 1,
    itemsPerPage: 12,
    currentFilter: "",
    currentSort: "default",

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
        // Пошук
        document.getElementById('search-input')?.addEventListener('input', (e) => {
            this.currentSearch = e.target.value;
            this.applyFiltersAndSort();
        });

        // Сортування
        document.getElementById('sort-select')?.addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.applyFiltersAndSort();
        });

        // Категорії
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.category;
                this.applyFiltersAndSort();
            });
        });
    },

    applyFiltersAndSort() {
        let data = [...this.allData];

        // 1. Фільтрація
        const search = document.getElementById('search-input')?.value.toLowerCase() || "";
        data = data.filter(c => 
            (c.name.toLowerCase().includes(search) || c.description.toLowerCase().includes(search)) &&
            (this.currentFilter === "" || c.name.toLowerCase().includes(this.currentFilter))
        );

        // 2. Сортування
        if (this.currentSort === 'price-asc') data.sort((a, b) => a.price - b.price);
        else if (this.currentSort === 'price-desc') data.sort((a, b) => b.price - a.price);
        else if (this.currentSort === 'name-asc') data.sort((a, b) => a.name.localeCompare(b.name));

        this.filteredData = data;
        this.currentPage = 1;
        this.render();
    },
    handleSearch(term) {
        const t = term.toLowerCase();
        
        // Фільтрація: назва або опис
        this.filteredData = this.allData.filter(c => 
            (c.name && c.name.toLowerCase().includes(t)) || 
            (c.description && c.description.toLowerCase().includes(t))
        );
        
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

