import { html, isDark, isPressed, themeBtn } from "./app.js";

if (sessionStorage.getItem("theme")) {
  html.dataset.theme = sessionStorage.getItem("theme");
} else {
  html.dataset.theme = isDark ? "dark" : "light";
}

const changeTheme = function () {
  html.setAttribute(
    "data-theme",
    html.dataset.theme === "light" ? "dark" : "light"
  );
  sessionStorage.setItem("theme", html.dataset.theme);
};

window.addEventListener("load", () => {
  themeBtn.addEventListener("click", changeTheme);
});
