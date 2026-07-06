(function() {
    const themeKey = 'site_theme';
    const styleId = 'injected-theme-styles';

    const modernCSS = `
        /* --- 1. ГЛОБАЛЬНЫЙ СБРОС --- */
        body, .container, main { background: #f8f9fa !important; color: #1a1a1a !important; }
        
        /* --- 2. HEADER & TITLE --- */
        header { background: #ffffff !important; border-bottom: 2px solid #e0e0e0 !important; }
        .zx-title { color: #000 !important; display: flex !important; align-items: center !important; flex-wrap: wrap !important; }
        .theme-switch-btn { 
            margin-left: 20px !important; padding: 8px 16px !important; 
            background: #000 !important; color: #fff !important; 
            border: none !important; border-radius: 6px !important; 
            cursor: pointer !important; font-weight: bold !important; 
        }

        /* --- 3. SIDEBAR (Принудительно белый фон) --- */
        .sidebar, .sidebar-box { background: #ffffff !important; border: 1px solid #e0e0e0 !important; color: #333 !important; }
        .sidebar-box a, .contact-link { color: #0056b3 !important; }

        /* --- 4. КАРТОЧКИ И ТОВАРЫ --- */
        .card, .grid .card { background: #ffffff !important; border: 1px solid #e0e0e0 !important; color: #333 !important; }
        .card h3, .card .card-desc { color: #333 !important; }
        .card-price { color: #2e7d32 !important; font-weight: 800 !important; }
        
        /* --- 5. ОТЗЫВЫ И ФОРМЫ --- */
        .review-form, .review-card { background: #ffffff !important; border: 1px solid #e0e0e0 !important; color: #333 !important; }
        .review-card .text, .review-card .author { color: #333 !important; }
        input, textarea, select, .filter-select { 
            background: #ffffff !important; border: 1px solid #ccc !important; color: #333 !important; 
        }

        /* --- 6. ФУТЕР И ПАГИНАЦИЯ --- */
        .site-footer, .footer { background: #ffffff !important; color: #333 !important; border-top: 2px solid #e0e0e0 !important; }
        .pagination-container, .pagination-container button { background: #ffffff !important; color: #333 !important; border: 1px solid #ccc !important; }
        .pagination-container button:hover { background: #0056b3 !important; color: #fff !important; }
        
        /* --- 7. УДАЛЕНИЕ РЕТРО-ЭЛЕМЕНТОВ --- */
        .spectrum-bar { display: none !important; }
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
            if (styleTag) styleTag.remove();
            localStorage.setItem(themeKey, 'retro');
        }
    }

    function initThemeBtn() {
        const titleContainer = document.querySelector('.zx-title');
        if (!titleContainer) return;

        // Удаляем старую кнопку перед созданием новой
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
        if (localStorage.getItem(themeKey) === 'modern') {
            applyTheme(true);
        }
        initThemeBtn();
    });
})();