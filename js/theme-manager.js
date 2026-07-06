(function() {
    const themeKey = 'site_theme';
    const styleId = 'injected-theme-styles';

    const modernCSS = `
        /* --- GLOBAL & STRUCTURE --- */
        body, main, .container { background: #f8f9fa !important; color: #1a1a1a !important; font-family: 'Inter', 'Segoe UI', sans-serif !important; }
        header { background: #ffffff !important; border-bottom: 1px solid #e0e0e0 !important; padding: 20px 0 !important; }
        
        /* --- TITLE & THEME BUTTON --- */
        .zx-title { color: #000 !important; font-size: 24px !important; font-weight: 800 !important; display: flex !important; align-items: center !important; }
        .theme-switch-btn { 
            margin-left: 15px !important; 
            padding: 6px 12px !important; 
            background: #000 !important; 
            color: #fff !important; 
            border: none !important; 
            border-radius: 4px !important; 
            cursor: pointer !important; 
            font-size: 11px !important;
            text-transform: uppercase !important;
            letter-spacing: 1px !important;
        }
        
        /* --- SIDEBAR MENU (Исправление черного фона) --- */
        .sidebar-box { background: #ffffff !important; border: 1px solid #e0e0e0 !important; border-radius: 8px !important; }
        .box-title { color: #333 !important; border-bottom: 1px solid #eee !important; margin-bottom: 10px !important; }
        .contact-link { color: #0056b3 !important; background: transparent !important; }

        /* --- CARDS & GRID --- */
        .card { background: #ffffff !important; border: 1px solid #e0e0e0 !important; box-shadow: none !important; }
        .card img { background: transparent !important; }
        .card-price { color: #2e7d32 !important; font-weight: 900 !important; }
        h2 { color: #000 !important; border-left: 5px solid #0056b3 !important; }

        /* --- PAGINATION (Покраска кнопок) --- */
        .pagination-container button, .page-btn { 
            background: #ffffff !important; 
            border: 1px solid #ced4da !important; 
            color: #333 !important; 
            padding: 8px 16px !important; 
            border-radius: 4px !important;
        }
        .pagination-container button:hover { background: #0056b3 !important; color: #fff !important; }

        /* --- INPUTS & FORMS --- */
        #search-input, .filter-select, .review-form input, .review-form textarea, .review-form select { 
            background: #ffffff !important; 
            border: 1px solid #ced4da !important; 
            color: #333 !important; 
        }
        
        /* --- FOOTER (Светлая тема) --- */
        .site-footer { background: #ffffff !important; border-top: 2px solid #e0e0e0 !important; color: #333 !important; }
        .footer-column h4 { color: #000 !important; border-bottom: 2px solid #0056b3 !important; }
        .copyright { color: #666 !important; }
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
            // Удаляем стили, возвращая оригинальный CSS
            if (styleTag) styleTag.remove();
            localStorage.setItem(themeKey, 'retro');
        }
    }

    function initThemeBtn() {
        const titleContainer = document.querySelector('.zx-title');
        if (!titleContainer) return;

        // Удаляем старую, если есть
        const existingBtn = document.querySelector('.theme-switch-btn');
        if (existingBtn) existingBtn.remove();

        const btn = document.createElement('button');
        btn.innerHTML = 'SWITCH THEME';
        btn.className = 'theme-switch-btn';
        
        btn.onclick = () => {
            const current = localStorage.getItem(themeKey);
            applyTheme(current !== 'modern');
        };
        
        titleContainer.appendChild(btn);
    }

    window.addEventListener('DOMContentLoaded', () => {
        // Устанавливаем тему
        const savedTheme = localStorage.getItem(themeKey);
        if (savedTheme === 'modern') {
            applyTheme(true);
        }
        initThemeBtn();
    });
})();