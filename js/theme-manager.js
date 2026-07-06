(function() {
    const themeKey = 'site_theme';
    const styleId = 'injected-theme-styles';

    const modernCSS = `
        /* 1. БАЗОВЫЕ ЦВЕТА И ШРИФТЫ */
        body, .container { background: #f8f9fa !important; color: #212529 !important; font-family: 'Segoe UI', sans-serif !important; }
        
        /* 2. ШАПКА И КОНТЕЙНЕРЫ */
        header { background: #ffffff !important; border-bottom: 2px solid #e9ecef !important; }
        .zx-title { color: #0056b3 !important; text-shadow: none !important; animation: none !important; }
        .spectrum-bar { display: none !important; }

        /* 3. КАРТОЧКИ (С ТЕНЯМИ И РАДИУСАМИ) */
        .card, .sidebar-box, .review-card, .review-form, .modal-content { 
            background: #ffffff !important; 
            border: 1px solid #dee2e6 !important; 
            border-radius: 8px !important; 
            box-shadow: 0 4px 6px rgba(0,0,0,0.05) !important; 
        }

        /* 4. ТЕКСТ И КНОПКИ */
        .card h3, .card-desc, .box-title, h4, .footer-column h4 { color: #333 !important; }
        .card-price { color: #28a745 !important; font-weight: 700 !important; }
        .btn-action, .page-btn, .cart-btn { background: #0056b3 !important; color: #fff !important; border: none !important; border-radius: 4px !important; }
        
        /* 5. ПОИСК И ФИЛЬТРЫ */
        #search-input, .filter-select { 
            background: #ffffff !important; 
            border: 1px solid #ced4da !important; 
            color: #495057 !important; 
            border-radius: 4px !important; 
        }

        /* 6. ОТЗЫВЫ (СИСТЕМНОЕ ИСПРАВЛЕНИЕ) */
        .reviews-section, .review-form-section { background: #f8f9fa !important; }
        .review-card .text { color: #555 !important; }
        .review-card .author { color: #0056b3 !important; }
        .review-form input, .review-form textarea, .review-form select { 
            background: #fff !important; border: 1px solid #ced4da !important; color: #333 !important; 
        }

        /* 7. ФУТЕР И ССЫЛКИ */
        .site-footer { background: #ffffff !important; border-top: 1px solid #e9ecef !important; color: #6c757d !important; }
        .contact-link, .footer-column a { color: #0056b3 !important; }
        .contact-link:hover { text-decoration: underline !important; }
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

    // Инициализация кнопки
    function initThemeBtn() {
        const btn = document.createElement('button');
        btn.innerHTML = 'THEME SWITCH';
        btn.style.cssText = "margin-left: 20px; padding: 6px 12px; cursor: pointer; background: #333; color: #fff; border: none; font-family: sans-serif; font-size: 12px; border-radius: 4px;";
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