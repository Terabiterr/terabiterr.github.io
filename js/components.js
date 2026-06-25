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
            
            // Слухач для пошуку
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
            }
        } catch (err) { console.error("Помилка завантаження компонентів:", err); }
    },

    handleSearch(term) {
        const t = term.toLowerCase();
        this.filteredData = this.allData.filter(c => 
            c.name.toLowerCase().includes(t) || 
            c.description.toLowerCase().includes(t)
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

// Запуск
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('components-list')) {
        CatalogManager.init();
    }
});