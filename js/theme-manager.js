(function() {
    // 1. Стили для Modern темы
    const style = document.createElement('style');
    style.innerHTML = `
        .theme-modern {
            --bg-body: #f4f7f9 !important;
            --bg-card: #ffffff !important;
            --text-main: #333333 !important;
            --accent-blue: #0066cc !important;
            --border-color: #d1d8e0 !important;
            --price-color: #d32f2f !important;
        }
        .theme-modern body { background: var(--bg-body); color: var(--text-main); font-family: sans-serif; }
        .theme-modern .card, .theme-modern .product-grid > div, .theme-modern .full-description, .theme-modern .comment-box {
            background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        .theme-modern .zx-title, .theme-modern h1, .theme-modern h2 { color: var(--accent-blue); text-shadow: none; animation: none; }
        .theme-modern .btn-action { background: var(--accent-blue); border: none; border-radius: 4px; }
    `;
    document.head.appendChild(style);

    // 2. Создаем кнопку переключения
    const btn = document.createElement('button');
    btn.innerText = 'THEME SWITCH';
    btn.style.cssText = `
        position: fixed; top: 10px; right: 10px; z-index: 99999; 
        padding: 8px 12px; cursor: pointer; background: #000; 
        color: #fff; border: 1px solid #fff; font-family: monospace;
    `;
    
    btn.onclick = function() {
        document.body.classList.toggle('theme-modern');
        const isModern = document.body.classList.contains('theme-modern');
        localStorage.setItem('theme', isModern ? 'modern' : 'retro');
    };
    
    document.body.appendChild(btn);

    // 3. Применяем сохраненную тему при старте
    if (localStorage.getItem('theme') === 'modern') {
        document.body.classList.add('theme-modern');
    }
})();