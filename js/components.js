// Приклад даних (додайте сюди ваші об'єкти)
const components = [ /* ваші об'єкти */ ];

let currentPage = 1;
const itemsPerPage = 10;
let filteredData = [...components];

function renderComponents() {
    const list = document.getElementById('components-list');
    list.innerHTML = '';
    
    // Пагінація
    const start = (currentPage - 1) * itemsPerPage;
    const paginatedItems = filteredData.slice(start, start + itemsPerPage);

    paginatedItems.forEach(item => {
        list.innerHTML += `
            <div class="component-card">
                <h3>${item.name}</h3>
                <p>${item.short_description}</p>
                <span>${item.price} ${item.currency}</span>
            </div>`;
    });
    renderPagination();
}

// Пошук
document.getElementById('search-input').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    filteredData = components.filter(c => 
        c.name.toLowerCase().includes(term) || 
        c.description.toLowerCase().includes(term)
    );
    currentPage = 1;
    renderComponents();
});

// Пагінація - проста реалізація
function renderPagination() {
    const pages = Math.ceil(filteredData.length / itemsPerPage);
    const pagBox = document.getElementById('pagination');
    pagBox.innerHTML = '';
    for(let i=1; i <= pages; i++) {
        pagBox.innerHTML += `<button onclick="goToPage(${i})">${i}</button>`;
    }
}

function goToPage(p) { currentPage = p; renderComponents(); }

// Ініціалізація
renderComponents();