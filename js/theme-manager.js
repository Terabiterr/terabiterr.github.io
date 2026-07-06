(function() {
    // 1. Создаем стиль для Modern темы
    const style = document.createElement('style');
    style.innerHTML = `
        .theme-modern {
            --bg-primary: #f4f7f9 !important;
            --text-primary: #333 !important;
            --zx-black: #fff !important;
        }
        .theme-modern body { background: #f4f7f9 !important; color: #333 !important; font-family: sans-serif !important; }
        .theme-modern header { background: #fff !important; border-bottom: 2px solid #ddd !important; color: #000 !important; }
        .theme-modern .card, .theme-modern .sidebar-box, .theme-modern .modal-content { 
            background: #fff !important; border: 1px solid #ddd !important; box-shadow: 0 2px 5px rgba(0,0,0,0.1) !important; color: #333 !important; 
        }
        .theme-modern .card h3, .theme-modern .card-desc { color: #333 !important; }
        .theme-modern .zx-title { color: #0066cc !important; text-shadow: none !important; animation: none !important; }
        .theme-modern #search-input { background: #fff !important; border: 1px solid #999 !important; color: #000 !important; }
    `;
    document.head.appendChild(style);

    // 2. Кнопка
    const btn = document.createElement('button');
    btn.innerText = 'THEME';
    btn.style.cssText = "position:fixed; top:20px; right:20px; z-index:99999; padding:10px; cursor:pointer; background: #333; color: #fff; border:none; border-radius:4px;";
    
    btn.onclick = () => {
        document.body.classList.toggle('theme-modern');
        localStorage.setItem('theme', document.body.classList.contains('theme-modern') ? 'modern' : 'retro');
    };
    document.body.appendChild(btn);

    // 3. Загрузка
    if (localStorage.getItem('theme') === 'modern') {
        document.body.classList.add('theme-modern');
    }
})();