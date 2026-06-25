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
            
            // Спочатку рендеримо все
            this.render();
            
            // Налаштовуємо події
            this.setupEventListeners();
        } catch (err) { console.error("Помилка:", err); }
    },

    setupEventListeners() {
        // Пошук
        const searchInput = document.getElementById('search-input');
        searchInput?.addEventListener('input', (e) => this.handleSearch(e.target.value));

        // Кнопки
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');

                const val = e.target.dataset.category;
                if (searchInput) searchInput.value = val ? e.target.innerText : "";
                
                this.handleSearch(val);
            });
        });
    },

    handleSearch(term) {
        const t = term.toLowerCase();
        
        if (t === "") {
            this.filteredData = [...this.allData];
        } else {
            // Фільтрація: шукаємо слово в name або description
            this.filteredData = this.allData.filter(c => 
                (c.name && c.name.toLowerCase().includes(t)) || 
                (c.description && c.description.toLowerCase().includes(t))
            );
        }
        
        this.currentPage = 1;
        this.render();
    },

    render() {
        const container = document.getElementById('components-list');
        if (!container) return;

        const start = (this.currentPage - 1) * this.itemsPerPage;
        const pageItems = this.filteredData.slice(start, start + this.itemsPerPage);

        container.innerHTML = pageItems.map(c => `
            <a href="${c.url}" class="card-link">
                <article class="card">
                    <img src="${c.images[0]}" alt="${c.name}">
                    <h3>${c.name}</h3>
                    <div class="card-price">${c.price} ${c.currency}</div>
                </article>
            </a>
        `).join('');

        this.renderPagination();
    },

    renderPagination() {
        const nav = document.getElementById('pagination');
        if (!nav) return;
        const total = Math.ceil(this.filteredData.length / this.itemsPerPage);
        nav.innerHTML = total > 1 ? `
            <button onclick="CatalogManager.changePage(-1)">«</button>
            <span>${this.currentPage}/${total}</span>
            <button onclick="CatalogManager.changePage(1)">»</button>
        ` : '';
    },

    changePage(step) {
        const max = Math.ceil(this.filteredData.length / this.itemsPerPage);
        if (this.currentPage + step >= 1 && this.currentPage + step <= max) {
            this.currentPage += step;
            this.render();
        }
    }
};

document.addEventListener('DOMContentLoaded', () => CatalogManager.init());