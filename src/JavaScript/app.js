import {
  fetchData,
  addEventOnElement,
  numberToKilo,
  getTheme,
} from "./helpers.js";
import { BASE_API_URL, ZOOM_ANIMATION_DELAY } from "./config.js";

import "core-js/actual";
import "regenerator-runtime/runtime";

const GitHubApp = (function () {
  // Private variables and functions
  const _header = document.querySelector(".header");
  const _searchToggler = document.querySelector(".search-toggler");
  const _tabBtns = document.querySelectorAll(".tab-btn");
  const _tabPanels = document.querySelectorAll(".tab-panel");
  const _searchField = document.querySelector(".search-field");
  const _searchBtn = document.querySelector(".search-btn");
  const _profileCard = document.querySelector(".profile");
  const _repoPanel = document.getElementById("panel-1");
  const _error = document.querySelector(".error");
  const _forkedRepoPanel = document.getElementById("panel-2");
  const _forkedTabBtn = document.getElementById("tab-2");
  const _followerRepoPanel = document.getElementById("panel-3");
  const _followerTabBtn = document.getElementById("tab-3");
  const _followingRepoPanel = document.getElementById("panel-4");
  const _followingTabBtn = document.getElementById("tab-4");
  const _themeBtn = document.querySelector(".theme-btn");
  const _intro = document.getElementById("intro");
  const _html = document.documentElement;
  let _forkedRepos = [];
  let _apiUrl = `${BASE_API_URL}ElvinWeb`;
  let _repoUrl,
    _followerUrl,
    _followingUrl = "";
  let _lastActiveTabBtn = _tabBtns[0];
  let _lastActiveTabPanel = _tabPanels[0];

  //fetched data from api url sended to _profile method
  window._updateProfile = function (profileUrl) {
    _error.style.display = "none";
    document.body.style.overflow = "visible";

    _profileCard.innerHTML = `
      <ul class="profile-stats">
        <li class="stats-items"><span class="body">142</span>Repos</li>
        <li class="stats-items"><span class="body">1.8k</span>Followers</li>
        <li class="stats-items"><span class="body">12</span>Following</li>
        <li class="stats-items"><span class="body">142</span>Repos</li>
      </ul>
    `;
    _tabBtns[0].click();

    _repoPanel.innerHTML = `
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

    fetchData(profileUrl, _profile, _notFound);
  };
  //user profile UI created dynamically with fetched data
  const _profile = function (data) {
    const {
      type,
      avatar_url,
      html_url: githubPageUrl,
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

    _repoUrl = repos_url;
    _followerUrl = followers_url;
    _followingUrl = following_url.replace("{/other_user}", "");
    _profileCard.innerHTML = `
  <figure
  class="${type == "User" ? "avatar-circle" : "avatar-rounded"} img-holder"
  style="--width: 280; --height: 280">
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
      <span class="body">${numberToKilo(followers)}</span> Followers
    </li>
    <li class="stats-item">
      <span class="body">${numberToKilo(following)}</span> Following
    </li>
</ul>

<div class="footer">
  <p class="copyright">&copy; ElvinWeb</p>
    </div>`;

    _updateRepositories();
  };
  //user profile UI updated according to searchfield value
  const _searchUser = function () {
    if (!_searchField.value) return;
    _apiUrl = `${BASE_API_URL}${_searchField.value}`;
    _updateProfile(_apiUrl);
  };
  //fetched data from api url sended to _repositories method
  const _updateRepositories = function () {
    fetchData(`${_repoUrl}?sort=created&per_page=12`, _repositories);
  };
  //to process and display profile repositories
  const _repositories = function (data) {
    _repoPanel.innerHTML = `<h2 class="sr-only">Repositories</h2>`;
    _forkedRepos = data.filter((item) => item.fork);
    const repositories = data.filter((i) => !i.fork);

    if (repositories.length && repositories.length > 0) {
      for (const repo of repositories) {
        _repositoryCard(repo, _repoPanel);
      }
    } else {
      _errorMessage(_repoPanel, "Doesn't have the any public repositories yet");
    }
  };
  //to create and generate a repository card markup
  const _repositoryCard = function (repo, _repoPanel) {
    const {
      name,
      html_url,
      description,
      private: isPrivate,
      language,
      stargazers_count: stars_count,
      forks_count,
    } = repo;

    const repoCard = document.createElement("article");
    repoCard.classList.add("card", "repo-card");
    repoCard.innerHTML = `
      <div class="card-body">
        <a href="${html_url}" class="card-title" target="_blank">
          <h3 class="title-3">${name}</h3>
        </a>
        ${description ? `<p class="card-text">${description}</p>` : ""}
        <span class="badge">${isPrivate ? "Private" : "Public"}</span>
      </div>
      <div class="card-footer">
      ${
        language
          ? ` <div class="meta-item">
          <span class="material-symbols-rounded" aria-hidden="true">code_blocks</span>
          <span class="span">${language}</span>
        </div>`
          : ""
      }
        <div class="meta-item">
          <span class="material-symbols-rounded" aria-hidden="true">star_rate</span>
          <span class="span">${numberToKilo(stars_count)}</span>
        </div>
        <div class="meta-item">
          <span class="material-symbols-rounded" aria-hidden="true">family_history</span>
          <span class="span">${numberToKilo(forks_count)}</span>
        </div>
      </div>
    `;

    _repoPanel.appendChild(repoCard);
  };
  //to process and display profile forked repositories
  const _updateForkRepositories = function () {
    _forkedRepoPanel.innerHTML = `<h2 class="sr-only">Forked Repositories</h2>`;

    if (_forkedRepos.length && _forkedRepos.length > 0) {
      for (const repo of _forkedRepos) {
        _forkRepositoryCard(repo, _forkedRepoPanel);
      }
    } else {
      _errorMessage(
        _forkedRepoPanel,
        "Doesn't have the any forked repositories yet"
      );
    }
  };
  //to create and generate a forked repository card markup
  const _forkRepositoryCard = function (repo, _forkedRepoPanel) {
    const {
      name,
      html_url,
      description,
      private: isPrivate,
      language,
      stargazers_count: stars_count,
      forks_count,
    } = repo;

    const forkedRepoCard = document.createElement("article");
    forkedRepoCard.classList.add("card", "repo-card");
    forkedRepoCard.innerHTML = `
    <div class="card-body">
      <a href="${html_url}" class="card-title" target="_blank">
        <h3 class="title-3">${name}</h3>
      </a>
      ${description ? `<p class="card-text">${description}</p>` : ""}
      <span class="badge">${isPrivate ? "Private" : "Public"}</span>
    </div>
    <div class="card-footer">
    ${
      language
        ? ` <div class="meta-item">
        <span class="material-symbols-rounded" aria-hidden="true">code_blocks</span>
        <span class="span">${language}</span>
      </div>`
        : ""
    }
      <div class="meta-item">
        <span class="material-symbols-rounded" aria-hidden="true">star_rate</span>
        <span class="span">${numberToKilo(stars_count)}</span>
      </div>
      <div class="meta-item">
        <span class="material-symbols-rounded" aria-hidden="true">family_history</span>
        <span class="span">${numberToKilo(forks_count)}</span>
      </div>
    </div>
    `;

    _forkedRepoPanel.appendChild(forkedRepoCard);
  };
  //fetched data from api url sended to _followerRepositories method
  const _updateFollowerRepositories = function () {
    _followerRepoPanel.innerHTML = `
      <div class="card follower-skeleton">
        <div class="avatar-skeleton skeleton"></div>
        <div class="title-skeleton skeleton"></div>
      </div>
    `.repeat(12);

    fetchData(_followerUrl, _followerRepositories);
  };
  //to process and display profile follower repositories
  const _followerRepositories = function (data) {
    _followerRepoPanel.innerHTML = `<h2 class="sr-only">Followers</h2>`;

    if (data.length && data.length > 0) {
      for (const item of data) {
        _followerRepositoryCard(item, _followerRepoPanel);
      }
    } else {
      _errorMessage(_followerRepoPanel, "Doesn't have the any follower yet");
    }
  };
  //to create and generate a follower repository card markup
  const _followerRepositoryCard = function (item, _followerRepoPanel) {
    const { login: username, avatar_url, url } = item;

    const followerRepoCard = document.createElement("article");
    followerRepoCard.classList.add("card", "follower-card");

    followerRepoCard.innerHTML = ` 
        <figure class="avatar-circle img-holder">
          <img
            src="${avatar_url}"
            alt=""
            class="img-cover"
          />
        </figure>
        <h3 class="card-title">${username}</h3>
        <button class="icon-btn" onclick="_updateProfile(\'${url}\')" aria-label="Go to ${username} profile">
          <span class="material-symbols-rounded" aria-hidden="true">link</span>
        </button>
    `;

    _followerRepoPanel.appendChild(followerRepoCard);
  };
  //fetched data from api url sended to _followingRepositories method
  const _updateFollowingRepositories = function () {
    _followingRepoPanel.innerHTML = `
      <div class="card follower-skeleton">
        <div class="skeleton avatar-skeleton"></div>
  
        <div class="skeleton title-skeleton"></div>
      </div>
    `.repeat(12);

    fetchData(_followingUrl, _followingRepositories);
  };
  //to process and display profile following repositories
  const _followingRepositories = function (data) {
    _followingRepoPanel.innerHTML = `<h2 class="sr-only">Following</h2>`;
    if (data.length && data.length > 0) {
      for (const item of data) {
        _followingRepositoryCard(item, _followerRepoPanel);
      }
    } else {
      _errorMessage(_followerRepoPanel, "Doesn't have any following yet.");
    }
  };
  //to create and generate a following repository card markup
  const _followingRepositoryCard = function (item, _followerRepoPanel) {
    const { login: username, avatar_url, url } = item;

    const followingRepoCard = document.createElement("article");
    followingRepoCard.classList.add("card", "follower-card");
    followingRepoCard.innerHTML = `
      <figure class="avatar-circle img-holder">
        <img src="${avatar_url}&s=64" width="56" height="56" loading="lazy" alt="${username}"
          class="img-cover">
      </figure>

      <h3 class="card-title">${username}</h3>

      <button class="icon-btn" onclick="_updateProfile(\'${url}\')" aria-label="Go to ${username} profile">
        <span class="material-symbols-rounded" aria-hidden="true">link</span>
      </button>`;

    _followingRepoPanel.appendChild(followingRepoCard);
  };
  //light and dark mode state changer
  const _changeTheme = function () {
    _html.setAttribute(
      "data-theme",
      _html.dataset.theme === "light" ? "dark" : "light"
    );
    sessionStorage.setItem("theme", _html.dataset.theme);
  };
  //user not found message renderer
  const _notFound = function () {
    _error.style.display = "grid";
    document.body.style.overflowY = "hidden";
    document.title = "GitFinder // Not Found";
    _error.innerHTML = `
        <div class="error-container">
            <div class="notfound">
              <div class="notfound-404">
                <h1 class="notfound-title">404</h1>
              </div>
                <h2 class="notfound-subtitle">we are sorry, but there is no account with this username yet!</h2>
                <a href="/index.html" class="home-btn">Go Home</a>
            </div> 
          </div>
    `;
  };
  //generic error message renderer
  const _errorMessage = function (repoElement, message) {
    return (repoElement.innerHTML = `
        <div class="error-content">
          <p class="title-1">Oops! :(</p>
          <p class="text">${message}</p>
        </div>`);
  };
  //controling tabs with direction keys
  const _tabControl = function (e) {
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
  };
  //adding the aria-select state for the selected tab
  const _activeTab = function () {
    _lastActiveTabBtn.setAttribute("aria-selected", "false");
    _lastActiveTabPanel.setAttribute("hidden", "");
    this.setAttribute("aria-selected", "true");

    const currentTabPanel = document.querySelector(
      `#${this.getAttribute("aria-controls")}`
    );
    currentTabPanel.removeAttribute("hidden");

    _lastActiveTabBtn = this;
    _lastActiveTabPanel = currentTabPanel;
  };
  //adding the zoom screen intro animation
  const _setIntroAnimation = function () {
    setTimeout(() => {
      _intro.style.visibility = "hidden";
    }, ZOOM_ANIMATION_DELAY);
  };
  //project initial execution
  const init = function () {
    addEventOnElement(_tabBtns, "click", _activeTab);
    addEventOnElement(_tabBtns, "keydown", _tabControl);
    _updateProfile(_apiUrl);
    getTheme();
    _followerTabBtn.addEventListener("click", _updateFollowerRepositories);
    _forkedTabBtn.addEventListener("click", _updateForkRepositories);
    _followingTabBtn.addEventListener("click", _updateFollowingRepositories);
    _searchBtn.addEventListener("click", _searchUser);
    window.addEventListener("scroll", () => {
      _header.classList.toggle("active", scrollY > 60);
    });
    _searchToggler.addEventListener("click", () => {
      _header.classList.toggle("search-active");
      _searchField.focus();
    });
    _searchField.addEventListener("keydown", (e) => {
      if (e.key === "Enter") _searchUser();
    });
    window.addEventListener("load", () => {
      _themeBtn.addEventListener("click", _changeTheme);
    });
    window.addEventListener("DOMContentLoaded", _setIntroAnimation);
  };

  // Public methods and properties
  return {
    init: init,
  };
})();

GitHubApp.init();
