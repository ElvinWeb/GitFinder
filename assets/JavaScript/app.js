import fetchData from "./api.js";

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

let apiUrl = "https://api.github.com/users/ElvinWeb";
let repoUrl,
  followerUrl,
  followingUrl = "";

const searchUser = function () {
  if (!searchField.value) return;
  apiUrl = `https://api.github.com/users/${searchField.value}`;
};

searchBtn.addEventListener("click", searchUser);

searchField.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchUser();
});

const profileCard = document.querySelector(".profile");
const repoPanel = document.querySelector(".tab-panel");
const error = document.querySelector(".error");

window.updateProfile = function (profileUrl) {
  error.style.display = "none";
  document.body.style.overflow = "visible";

  profileCard.innerHTML = `
    <ul class="profile-stats">
      <li class="stats-items"><span class="body">142</span>Repos</li>
      <li class="stats-items"><span class="body">1.8k</span>Followers</li>
      <li class="stats-items"><span class="body">12</span>Following</li>
      <li class="stats-items"><span class="body">142</span>Repos</li>
    </ul>
  `;
  tabBtns[0].click();

  repoPanel.innerHTML = `
      <div class="card repo-skeleton">
          <div class="card-body">
              <div class="skeleton title-skeleton"></div>
              <div class="skeleton text-skeleton text-1"></div>
              <div class="skeleton text-skeleton text-2"></div>
          </div>
          <div class="card-footer">
              <div class="skeleton text-skeleton"></div>
              <div class="skeleton text-skeleton"></div>
              <div class="skeleton text-skeleton"></div>
           </div>
      </div>
  `.repeat(6);

  fetchData(
    profileUrl,
    (data) => {
      const {
        type,
        avatar_url,
        page_url: githubPageUrl,
        name,
        bio,
        login: username,
        location,
        company,
        blog: website,
        twitter_username,
        public_repos,
        followers,
        following,
        followers_url,
        following_url,
        repos_url,
      } = data;
      repoUrl = repos_url;
      followerUrl = followers_url;
      followingUrl = following_url.replace("{/other_user}", "");

      profileCard.innerHTML = `
    <figure
    class="${type == "User" ? "avatar-circle" : "avatar-rounded"} img-holder"
    style="--width: 280; --height: 280"
  >
    <img
      src="${avatar_url}"
      alt=""
      width="280"
      height="280"
      class="img-cover"
      alt="${username}"
    />
  </figure>

  ${name ? `<h1 class="title-2">${name}</h1>` : ""}
  <p class="username text-primary">${username}</p>
  ${bio ? `<p class="bio">${bio}</p>` : ""}

  <a href="${githubPageUrl}" target="_blank" class="btn btn-secondary"
    ><span class="material-symbols-rounded" aria-hidden="true"
      >open_in_new
    </span>

    <span>See on GitHub</span></a
  >
  <ul class="profile-meta">
  ${
    location
      ? `
    <li class="meta-item">
        <span class="material-symbols-rounded" aria-hidden="true">location_on</span>
        <span class="meta-text">${location}</span>
    </li>`
      : ""
  }
  ${
    company
      ? `
      <li class="meta-item">
        <span class="material-symbols-rounded" aria-hidden="true">apartment</span>
        <span class="meta-text">${company}</span>
    </li>`
      : ""
  }

  ${
    website
      ? `
      <li class="meta-item">
          <span class="material-symbols-rounded" aria-hidden="true">captive_portal</span>
          <a href="${website}" target="_blank" class="meta-text">${website.replace(
          "https://",
          ""
        )}</a>
      </li>`
      : ""
  }

  ${
    twitter_username
      ? `
      <li class="meta-item">
      <span class="icon">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18.75 8.0625C18.75 6.50859 17.4914 5.25 15.9375 5.25C14.3836 5.25 13.125 6.50859 13.125 8.0625C13.125 9.34219 13.9793 10.4215 15.1465 10.7625C15.1254 11.3285 14.9988 11.7645 14.7598 12.0598C14.2184 12.7348 13.0266 12.8473 11.7645 12.9633C10.773 13.0547 9.74648 13.1531 8.90625 13.5574V8.49492C10.0488 8.13633 10.875 7.07109 10.875 5.8125C10.875 4.25859 9.61641 3 8.0625 3C6.50859 3 5.25 4.25859 5.25 5.8125C5.25 7.07109 6.07617 8.13633 7.21875 8.49492V15.5016C6.07617 15.8637 5.25 16.9289 5.25 18.1875C5.25 19.7414 6.50859 21 8.0625 21C9.61641 21 10.875 19.7414 10.875 18.1875C10.875 16.9922 10.1297 15.9691 9.075 15.5648C9.18398 15.382 9.34922 15.2203 9.59883 15.0938C10.1684 14.8055 11.0191 14.7281 11.9227 14.6438C13.4062 14.5066 15.0867 14.3484 16.0781 13.118C16.5703 12.5062 16.8199 11.7188 16.8375 10.7309C17.9484 10.3512 18.75 9.3 18.75 8.0625ZM8.0625 5.25C8.37188 5.25 8.625 5.50312 8.625 5.8125C8.625 6.12188 8.37188 6.375 8.0625 6.375C7.75312 6.375 7.5 6.12188 7.5 5.8125C7.5 5.50312 7.75312 5.25 8.0625 5.25ZM8.0625 18.75C7.75312 18.75 7.5 18.4969 7.5 18.1875C7.5 17.8781 7.75312 17.625 8.0625 17.625C8.37188 17.625 8.625 17.8781 8.625 18.1875C8.625 18.4969 8.37188 18.75 8.0625 18.75ZM15.9375 7.5C16.2469 7.5 16.5 7.75313 16.5 8.0625C16.5 8.37187 16.2469 8.625 15.9375 8.625C15.6281 8.625 15.375 8.37187 15.375 8.0625C15.375 7.75313 15.6281 7.5 15.9375 7.5Z"
            fill="#ABB2C2"
          />
        </svg>
      </span>
      <a href="https://twitter.com/${twitter_username}" target="_blank" class="meta-text">${twitter_username}}</a>
    </li>`
      : ""
  }
  
  </ul>
    <ul class="profile-stats">

      <li class="stats-item">
        <span class="body">${public_repos}</span> Repos
      </li>

      <li class="stats-item">
        <span class="body"></span> Followers
      </li>

      <li class="stats-item">
        <span class="body"></span> Following
      </li>

  </ul>
  
  <div class="footer">
    <p class="copyright">&copy; ElvinWeb</p>
  </div>
    `;
    
      updateRepositories();
    },
    () => {
      error.style.display = "grid";
      document.body.style.overflowY = "hidden";

      error.innerHTML = `
      <p class="title-1">Oops! :(</p>

      <p class="text">
        There is no account with this username yet.
      </p>
    `;
    }
  );
};

updateProfile(apiUrl);

const updateRepositories = function () {};
