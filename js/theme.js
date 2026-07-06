document.addEventListener("DOMContentLoaded", () => {

    const themeLink = document.getElementById("theme-style");
    const header = document.querySelector(".header-inner");

    // ============================
    // Кнопка переключения темы
    // ============================

    const button = document.createElement("button");

    button.id = "theme-toggle";
    button.className = "theme-toggle";

    header.appendChild(button);

    // ============================
    // Применение темы
    // ============================

    function applyTheme(theme) {

        if (theme === "light") {

            themeLink.href = "/css/components-light.css";
            button.innerHTML = "🖥 Retro";

        } else {

            themeLink.href = "/css/components.css";
            button.innerHTML = "☀ Classic";

        }

        localStorage.setItem("site-theme", theme);

    }

    // ============================
    // Загружаем сохраненную тему
    // ============================

    const savedTheme = localStorage.getItem("site-theme") || "retro";

    applyTheme(savedTheme);

    // ============================
    // Переключение
    // ============================

    button.addEventListener("click", () => {

        const current = localStorage.getItem("site-theme");

        if (current === "retro") {

            applyTheme("light");

        } else {

            applyTheme("retro");

        }

    });

});