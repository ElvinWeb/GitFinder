const addEventOnElement = function ($elements, eventType, callback) {
  for (const $item of $elements) {
    $item.addEventListener(eventType, callback);
  }
};

const header = document.querySelector(".header");
window.addEventListener("scroll", () => {
  header.classList[window.screenY > 50 ? "add" : "remove"]("active");
});

const searchToggler = document.querySelector(".search-toggler");
const searchField = document.querySelector(".search-field");
const searchBtn = document.querySelector(".search-btn");
let isExpanded = false;

searchToggler.addEventListener("click", function () {
  header.classList.toggle("search-active");
  isExpanded = isExpanded ? true : false;
  this.setAttribute("aria-expanded", isExpanded);

  searchField.focus();
});

const tabBtns = document.querySelectorAll(".tab-btn");
const tabPanels = document.querySelectorAll(".tab-panel");

let lastActiveTabBtn = tabBtns[0];
let lastActiveTabPanel = tabPanels[0];

addEventOnElement(tabBtns, "click", function () {
  lastActiveTabBtn.setAttribute("aria-selected", "false");
  lastActiveTabPanel.setAttribute("hidden", "");

  this.setAttribute("aria-selected", "true");

  const currentTabPanel = document.querySelector(
    `#${this.getAttribute("aria-controls")}`
  );
  currentTabPanel.removeAttribute("hidden");

  lastActiveTabBtn = this;
  lastActiveTabPanel = currentTabPanel;
});

addEventOnElement(tabBtns, "keydown", function (e) {
  const nextElement = this.nextElementSibling;
  const previousElement = this.previousElementSibling;

  if (e.key === "ArrowRight" && nextElement) {
    this.setAttribute("tabindex", "-1");
    nextElement.setAttribute("tabindex", "0");
    nextElement.focus();
  } else if (e.key === "ArrowLeft" && previousElement) {
    previousElement.setAttribute("tabindex", "0");
    previousElement.focus();
  }
});

let apiUrl = "https://api.github.com/users/codewithsadee";
let repoUrl,
  repoFollower,
  followingUrl = "";

const searchUser = function () {
  if (!searchField.value) return;
  apiUrl = `https://api.github.com/users/${searchField.value}`;
};

searchBtn.addEventListener("click", searchUser);

searchField.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchUser();
});
