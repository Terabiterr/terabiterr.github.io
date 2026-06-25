const CatalogManager = {
    allData: [],
    filteredData: [],
    currentPage: 1,
    itemsPerPage: 12,

    async init() {
        try {
            console.log("Завантаження даних...");
            const resp = await fetch('/data/components.json');
            if (!resp.ok) throw new Error(`HTTP error! status: ${resp.status}`);
            
            this.allData = await resp.json();
            this.filteredData = [...this.allData];
            
            console.log("Дані завантажено, всього:", this.allData.length);
            this.render();
            this.setupEventListeners();
            
        } catch (err) { 
            console.error("Помилка завантаження компонентів:", err); 
        }
    },

    setupEventListeners() {
        const searchInput = document.getElementById('search-input');
        
        // Пошук
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }

        // Кнопки фільтрації
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const categoryValue = e.target.dataset.category; 
                
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');

                if (searchInput) {
                    searchInput.value = categoryValue === 'all' ? '' : e.target.innerText;
                }
                
                this.handleSearch(categoryValue === 'all' ? '' : categoryValue);
            });
        });
    },

    handleSearch(term) {
        const t = term.toLowerCase();
        
        if (t === "") {
            this.filteredData = [...this.allData];
        } else {
            this.filteredData = this.allData.filter(c => 
                (c.name && c.name.toLowerCase().includes(t)) || 
                (c.short_description && c.short_description.toLowerCase().includes(t)) ||
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

        if (pageItems.length === 0) {
            container.innerHTML = '<p style="padding: 20px;">За запитом нічого не знайдено.</p>';
        } else {
            container.innerHTML = pageItems.map(c => `
                <a href="${c.url || '#'}" class="card-link">
                    <article class="card">
                        <img src="${c.images[0]}" alt="${c.name}" loading="lazy">
                        <h3>${c.name}</h3>
                        <div class="card-price">${c.price} ${c.currency || 'UAH'}</div>
                    </article>
                </a>
            `).join('');
        }

        this.renderPagination();
    },

    renderPagination() {
        const nav = document.getElementById('pagination');
        if (!nav) return;
        const total = Math.ceil(this.filteredData.length / this.itemsPerPage);
        
        if (total <= 1) { nav.innerHTML = ''; return; }

        nav.innerHTML = `
            <button onclick="CatalogManager.changePage(-1)">«</button>
            <span>PAGE ${this.currentPage} / ${total}</span>
            <button onclick="CatalogManager.changePage(1)">»</button>
        `;
    },

    changePage(step) {
        const max = Math.ceil(this.filteredData.length / this.itemsPerPage);
        if (this.currentPage + step >= 1 && this.currentPage + step <= max) {
            this.currentPage += step;
            this.render();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    CatalogManager.init();
});