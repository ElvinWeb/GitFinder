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
let isExpanded = false;

searchToggler.addEventListener("click", function () {
  header.classList.toggle("search-active");
  isExpanded = isExpanded ? true : false;
  this.setAttribute("aria-expanded", isExpanded);
  
  searchField.focus();
});
