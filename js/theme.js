/* ==========================================================================
   THEME CONTROLLER (js/theme.js)
   Manages Dark/Light Neumorphic surface switching and localStorage persistence.
   ========================================================================== */

var theme = "dark";
try {
    var savedTheme = localStorage.getItem("gallery_nm_theme");
    if (savedTheme === "light" || savedTheme === "dark") {
        theme = savedTheme;
    }
} catch (e) {}

var body = document.getElementById("body");
var themeToggle = document.getElementById("themeToggle");
var heroThemeLabel = document.getElementById("heroThemeLabel");

function syncThemeUI() {
    if (body) body.setAttribute("data-bs-theme", theme);
    if (themeToggle) themeToggle.innerHTML = theme === "light" ? "☀️" : "🌙";
    if (heroThemeLabel) {
        heroThemeLabel.innerHTML = theme === "light" ? "☀️ Light Studio" : "🌙 Dark Studio";
    }
}

function changeTheme() {
    theme = theme === "light" ? "dark" : "light";
    try { localStorage.setItem("gallery_nm_theme", theme); } catch (e) {}
    syncThemeUI();
}

syncThemeUI();

