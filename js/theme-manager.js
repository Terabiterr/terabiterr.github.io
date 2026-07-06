(function() {
    // 1. Стили с более жестким приоритетом
    const style = document.createElement('style');
    style.innerHTML = `
        /* Сбрасываем цвета при включенной теме modern */
        .theme-modern, .theme-modern body {
            background-color: #f4f7f9 !important;
            color: #333 !important;
        }
        
        .theme-modern header { background: #fff !important; border-bottom: 2px solid #ddd !important; }
        .theme-modern .zx-title { color: #0066cc !important; text-shadow: none !important; animation: none !important; }
        
        .theme-modern .card, 
        .theme-modern .sidebar-box, 
        .theme-modern header, 
        .theme-modern .site-footer {
            background: #fff !important;
            border: 1px solid #ddd !important;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1) !important;
        }

        .theme-modern .card h3, .theme-modern .card-desc { color: #333 !important; }
        .theme-modern .card-price { color: #d32f2f !important; }
        .theme-modern .card img { border-bottom: 1px solid #eee !important; }
        
        .theme-modern #search-input { background: #fff !important; border: 1px solid #aaa !important; color: #333 !important; }
        .theme-modern .filter-btn { background: #eee !important; border: 1px solid #ccc !important; color: #333 !important; }
        .theme-modern .filter-btn.active { background: #0066cc !important; color: #fff !important; }
    `;
    document.head.appendChild(style);

    // 2. Логика кнопки
    let btn = document.querySelector('#theme-btn');
    if (!btn) {
        btn = document.createElement('button');
        btn.id = 'theme-btn';
        btn.innerText = 'TOGGLE THEME';
        btn.style.cssText = "position:fixed; top:80px; right:10px; z-index:99999; padding:8px; cursor:pointer;";
        document.body.appendChild(btn);
    }
    
    btn.onclick = () => {
        document.body.classList.toggle('theme-modern');
        localStorage.setItem('theme', document.body.classList.contains('theme-modern') ? 'modern' : 'retro');
    };

    if (localStorage.getItem('theme') === 'modern') {
        document.body.classList.add('theme-modern');
    }
})();