(function() {
    const themeKey = 'site_theme';
    const styleId = 'injected-theme-styles';

    // Определение новой темы (Modern)
    const modernCSS = `
        body { background: #f4f7f9 !important; color: #333 !important; font-family: sans-serif !important; }
        header { background: #fff !important; border-bottom: 2px solid #ccc !important; color: #333 !important; }
        .spectrum-bar { display: none !important; }
        .zx-title { color: #0066cc !important; text-shadow: none !important; animation: none !important; }
        .card, .sidebar-box, .review-form, .modal-content { 
            background: #fff !important; border: 1px solid #ddd !important; box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important; color: #333 !important; 
        }
        .card h3, .card-desc, .box-title, h4 { color: #333 !important; }
        .card-price { color: #d32f2f !important; font-weight: bold; }
        #search-input, .filter-select { background: #fff !important; border: 1px solid #ccc !important; color: #333 !important; }
        .contact-link, .footer-column p, .footer-column a { color: #555 !important; }
        .footer-column h4 { color: #0066cc !important; border-bottom: 2px solid #ccc !important; }
    `;

    function applyTheme(isModern) {
        let styleTag = document.getElementById(styleId);
        
        if (isModern) {
            if (!styleTag) {
                styleTag = document.createElement('style');
                styleTag.id = styleId;
                document.head.appendChild(styleTag);
            }
            styleTag.innerHTML = modernCSS;
            localStorage.setItem(themeKey, 'modern');
        } else {
            if (styleTag) {
                styleTag.remove();
            }
            localStorage.setItem(themeKey, 'retro');
        }
    }

    // Создание кнопки переключения (внедряем в хедер)
    function initThemeBtn() {
        const btn = document.createElement('button');
        btn.innerText = 'THEME';
        btn.style.cssText = "margin-left: 10px; padding: 5px 10px; cursor: pointer; background: #fff; border: 1px solid #000; font-family: monospace;";
        btn.onclick = () => {
            const current = localStorage.getItem(themeKey);
            applyTheme(current !== 'modern');
        };
        document.querySelector('.zx-title').appendChild(btn);
    }

    // Инициализация при загрузке
    window.addEventListener('DOMContentLoaded', () => {
        const savedTheme = localStorage.getItem(themeKey);
        if (savedTheme === 'modern') {
            applyTheme(true);
        }
        initThemeBtn();
    });
})();