const html = document.documentElement;
const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
console.log(isDark);

if (sessionStorage.getItem("theme")) {
  html.dataset.theme = sessionStorage.getItem("theme");
} else {
  html.dataset.theme = isDark ? "dark" : "light";
}

let isPressed = false;
const changeTheme = function () {
  isPressed = isPressed ? false : true;
  this.setAttribute("aria-pressed", isPressed);
  html.setAttribute(
    "data-theme",
    html.dataset.theme === "light" ? "dark" : "light"
  );
  sessionStorage.setItem("theme", html.dataset.theme);  
};

window.addEventListener("load", () => {
  const themeBtn = document.querySelector(".theme-btn");
  themeBtn.addEventListener("click", changeTheme);
});
