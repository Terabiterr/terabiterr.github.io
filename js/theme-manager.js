(function() {
    const themeKey = 'site_theme';
    const styleId = 'injected-theme-styles';

    const modernCSS = `
        /* --- GLOBAL & HEADER --- */
        body, main, .container { background: #f8f9fa !important; color: #1a1a1a !important; font-family: 'Segoe UI', sans-serif !important; }
        header { background: #ffffff !important; border-bottom: 1px solid #e0e0e0 !important; padding: 20px 0 !important; }
        .zx-title { color: #000 !important; font-size: 24px !important; font-weight: 700 !important; }
        .spectrum-bar { display: none !important; }
        
        /* Кнопка темы: добавляем отступ */
        .theme-switch-btn { 
            margin-left: 20px !important; 
            padding: 8px 15px !important; 
            background: #333 !important; 
            color: #fff !important; 
            border: none !important; 
            border-radius: 6px !important; 
            cursor: pointer !important; 
            font-size: 12px !important;
        }

        /* --- CARDS & DATABASE --- */
        .card { background: #ffffff !important; border: 1px solid #e0e0e0 !important; border-radius: 12px !important; }
        .card img { background: transparent !important; }
        .card-price { color: #000 !important; font-weight: 800 !important; }
        h2 { color: #000 !important; border-left: 5px solid #0056b3 !important; }

        /* --- FORMS & INPUTS (Исправление черного фона) --- */
        #search-input, .filter-select, 
        .review-form input, .review-form textarea, .review-form select { 
            background: #ffffff !important; 
            border: 1px solid #ced4da !important; 
            color: #333 !important; 
        }
        
        /* --- REVIEWS SECTION --- */
        .review-card { background: #fff !important; border: 1px solid #e0e0e0 !important; border-radius: 10px !important; }
        .review-form { background: #ffffff !important; border: 1px solid #e0e0e0 !important; border-radius: 12px !important; padding: 20px !important; }
        
        /* --- FOOTER --- */
        .site-footer { background: #1a1a1a !important; color: #fff !important; }
        .footer-column h4 { color: #fff !important; border-bottom: 2px solid #0056b3 !important; }
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
        // Убираем старую кнопку, если она вдруг осталась
        const oldBtn = document.querySelector('.theme-switch-btn');
        if (oldBtn) oldBtn.remove();

        const btn = document.createElement('button');
        btn.innerHTML = 'THEME SWITCH';
        btn.className = 'theme-switch-btn';
        btn.onclick = () => {
            const current = localStorage.getItem(themeKey);
            applyTheme(current !== 'modern');
        };
        const title = document.querySelector('.zx-title');
        if (title) title.appendChild(btn);
    }

    window.addEventListener('DOMContentLoaded', () => {
        if (localStorage.getItem(themeKey) === 'modern') applyTheme(true);
        initThemeBtn();
    });
})();