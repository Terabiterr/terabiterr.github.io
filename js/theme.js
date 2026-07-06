/*
==========================================================
ZX-KIT
Theme Manager
==========================================================
*/

class ThemeManager {

    constructor() {

        this.storageKey = "zxkit-theme";

        this.themes = {
            retro: "/css/theme-retro.css",
            classic: "/css/theme-classic.css"
        };

        this.currentTheme = localStorage.getItem(this.storageKey) || "retro";

        this.init();

    }

    init() {

        this.loadTheme();

        document.addEventListener("DOMContentLoaded", () => {

            this.createButton();

        });

    }

    loadTheme() {

        const link = document.getElementById("theme-css");

        if (!link) return;

        link.href = this.themes[this.currentTheme];

    }

    saveTheme(theme) {

        localStorage.setItem(this.storageKey, theme);

    }

    toggleTheme() {

        this.currentTheme =
            this.currentTheme === "retro"
                ? "classic"
                : "retro";

        this.saveTheme(this.currentTheme);

        this.loadTheme();

        this.updateButton();

    }

    createButton() {

        const header = document.querySelector(".header-inner");

        if (!header) return;

        const button = document.createElement("button");

        button.id = "theme-switch";

        button.className = "theme-switch";

        button.onclick = () => this.toggleTheme();

        header.appendChild(button);

        this.updateButton();

    }

    updateButton() {

        const button = document.getElementById("theme-switch");

        if (!button) return;

        if (this.currentTheme === "retro") {

            button.textContent = "☀ CLASSIC";

        } else {

            button.textContent = "🕹 RETRO";

        }

    }

}

new ThemeManager();