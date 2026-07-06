(function() {
    const themeKey = 'site_theme';
    const styleId = 'injected-theme-styles';

    // Огромная таблица стилей для Modern темы
    const modernCSS = `
        /* --- 1. GLOBAL RESET --- */
        body, main, .container { background: #f8f9fa !important; color: #1a1a1a !important; font-family: 'Segoe UI', Roboto, sans-serif !important; }
        
        /* --- 2. HEADER & NAVIGATION --- */
        header { background: #ffffff !important; border-bottom: 1px solid #e0e0e0 !important; padding: 20px 0 !important; }
        .zx-title { color: #000 !important; font-size: 24px !important; font-weight: 700 !important; letter-spacing: -0.5px !important; text-shadow: none !important; animation: none !important; }
        .spectrum-bar { display: none !important; }
        
        /* --- 3. TYPOGRAPHY --- */
        h1, h2, h3, h4, .box-title { font-family: 'Segoe UI', sans-serif !important; font-weight: 700 !important; color: #000 !important; }
        h2 { font-size: 28px !important; margin-bottom: 20px !important; border-left: 5px solid #0056b3 !important; }

        /* --- 4. CARDS & GRID --- */
        .card { 
            background: #ffffff !important; border: 1px solid #e0e0e0 !important; border-radius: 12px !important; 
            padding: 20px !important; transition: transform 0.2s, box-shadow 0.2s !important; 
        }
        .card:hover { transform: translateY(-5px) !important; box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important; border-color: #0056b3 !important; }
        .card img { background: transparent !important; border-bottom: 1px solid #eee !important; border-radius: 8px !important; }
        .card h3 { font-size: 16px !important; margin: 15px 0 !important; color: #222 !important; }
        .card-desc { font-size: 13px !important; color: #666 !important; line-height: 1.5 !important; }
        .card-price { color: #000 !important; font-size: 18px !important; font-weight: 800 !important; margin-top: 15px !important; }

        /* --- 5. SIDEBAR & MENU --- */
        .sidebar-box { background: #ffffff !important; border: 1px solid #e0e0e0 !important; border-radius: 12px !important; padding: 25px !important; }
        .contact-link { color: #444 !important; font-weight: 500 !important; font-size: 14px !important; padding: 8px 0 !important; display: block !important; border-bottom: 1px solid #f0f0f0 !important; }
        .contact-link:hover { color: #0056b3 !important; padding-left: 5px !important; }

        /* --- 6. FORMS & INPUTS --- */
        #search-input, .filter-select { 
            background: #fff !important; border: 2px solid #e0e0e0 !important; border-radius: 8px !important; 
            padding: 12px 15px !important; font-size: 14px !important; width: 100% !important; color: #333 !important; 
        }
        #search-input:focus { border-color: #0056b3 !important; outline: none !important; }

        /* --- 7. REVIEWS & FOOTER --- */
        .review-card { background: #fff !important; border: 1px solid #eee !important; border-radius: 10px !important; }
        .review-card .author { color: #0056b3 !important; font-weight: 700 !important; }
        .review-form { background: #fff !important; border: 1px solid #ddd !important; border-radius: 12px !important; }
        .site-footer { background: #1a1a1a !important; color: #fff !important; border-top: none !important; }
        .footer-column h4 { color: #fff !important; border-bottom: 2px solid #0056b3 !important; }

        /* --- 8. BUTTONS --- */
        .cart-btn, .page-btn { background: #0056b3 !important; color: #fff !important; border-radius: 6px !important; font-weight: 600 !important; padding: 10px 20px !important; }
        .theme-switch-btn { background: #333 !important; color: #fff !important; border: none !important; padding: 8px 15px !important; border-radius: 6px !important; cursor: pointer !important; }
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
        const btn = document.createElement('button');
        btn.innerHTML = 'THEME SWITCH';
        btn.className = 'theme-switch-btn';
        btn.onclick = () => {
            const current = localStorage.getItem(themeKey);
            applyTheme(current !== 'modern');
        };
        const container = document.querySelector('.zx-title');
        if (container) container.appendChild(btn);
    }

    window.addEventListener('DOMContentLoaded', () => {
        if (localStorage.getItem(themeKey) === 'modern') applyTheme(true);
        initThemeBtn();
    });
})();