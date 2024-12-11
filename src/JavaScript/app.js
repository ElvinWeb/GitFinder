import {
  fetchData,
  addEventOnElement,
  numberToKilo,
  getTheme,
} from "./helpers.js";
import { BASE_API_URL, ZOOM_ANIMATION_DELAY } from "./config.js";

import "core-js/actual";
import "regenerator-runtime/runtime";

const GitFinderApp = (function () {
  // Model - Handles data and business logic
  const Model = {
    forkedRepos: [],
    apiUrl: `${BASE_API_URL}ElvinWeb`,
    repoUrl: "",
    followerUrl: "", 
    followingUrl: "",
    lastActiveTabBtn: null,
    lastActiveTabPanel: null,

    templates: {
      loadingProfile: `
        <ul class="profile-stats">
          <li class="stats-items"><span class="body">142</span>Repos</li>
          <li class="stats-items"><span class="body">1.8k</span>Followers</li>
          <li class="stats-items"><span class="body">12</span>Following</li>
          <li class="stats-items"><span class="body">142</span>Repos</li>
        </ul>
      `,

      loadingRepo: `
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
      `,

      loadingFollower: `
        <div class="card follower-skeleton">
          <div class="skeleton avatar-skeleton"></div>
          <div class="skeleton title-skeleton"></div>
        </div>
      `
    },

    setUrls(repos_url, followers_url, following_url) {
      this.repoUrl = repos_url;
      this.followerUrl = followers_url;
      this.followingUrl = following_url.replace("{/other_user}", "");
    },

    setForkedRepos(repos) {
      this.forkedRepos = repos.filter(item => item.fork);
      return repos.filter(i => !i.fork);
    }
  };

  // View - Handles DOM manipulation and UI updates
  const View = {
    elements: {
      header: document.querySelector(".header"),
      searchToggler: document.querySelector(".search-toggler"),
      tabBtns: document.querySelectorAll(".tab-btn"),
      tabPanels: document.querySelectorAll(".tab-panel"),
      searchField: document.querySelector(".search-field"),
      searchBtn: document.querySelector(".search-btn"),
      profileCard: document.querySelector(".profile"),
      repoPanel: document.getElementById("panel-1"),
      error: document.querySelector(".error"),
      forkedRepoPanel: document.getElementById("panel-2"),
      forkedTabBtn: document.getElementById("tab-2"),
      followerRepoPanel: document.getElementById("panel-3"),
      followerTabBtn: document.getElementById("tab-3"),
      followingRepoPanel: document.getElementById("panel-4"),
      followingTabBtn: document.getElementById("tab-4"),
      themeBtn: document.querySelector(".theme-btn"),
      intro: document.getElementById("intro"),
      html: document.documentElement
    },

    renderProfile(data) {
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
      } = data;

      const profileTemplate = `
        <figure class="${type == "User" ? "avatar-circle" : "avatar-rounded"} img-holder" style="--width: 280; --height: 280">
          <img src="${avatar_url}" width="280" height="280" class="img-cover" alt="${username}" />
        </figure>

        ${name ? `<h1 class="title-2">${name}</h1>` : ""}
        <p class="username text-primary">${username}</p>
        ${bio ? `<p class="bio">${bio}</p>` : ""}

        <a href="${githubPageUrl}" target="_blank" class="btn btn-secondary">
          <span class="material-symbols-rounded" aria-hidden="true">open_in_new</span>
          <span>See on GitHub</span>
        </a>

        <ul class="profile-meta">
          ${location ? `
            <li class="meta-item">
              <span class="material-symbols-rounded" aria-hidden="true">location_on</span>
              <span class="meta-text">${location}</span>
            </li>` : ""}
          
          ${company ? `
            <li class="meta-item">
              <span class="material-symbols-rounded" aria-hidden="true">apartment</span>
              <span class="meta-text">${company}</span>
            </li>` : ""}

          ${website ? `
            <li class="meta-item">
              <span class="material-symbols-rounded" aria-hidden="true">captive_portal</span>
              <a href="${website}" target="_blank" class="meta-text">${website.replace("https://","")}</a>
            </li>` : ""}

          ${twitter_username ? `
            <li class="meta-item">
              <span class="icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.75 8.0625C18.75 6.50859 17.4914 5.25 15.9375 5.25C14.3836 5.25 13.125 6.50859 13.125 8.0625C13.125 9.34219 13.9793 10.4215 15.1465 10.7625C15.1254 11.3285 14.9988 11.7645 14.7598 12.0598C14.2184 12.7348 13.0266 12.8473 11.7645 12.9633C10.773 13.0547 9.74648 13.1531 8.90625 13.5574V8.49492C10.0488 8.13633 10.875 7.07109 10.875 5.8125C10.875 4.25859 9.61641 3 8.0625 3C6.50859 3 5.25 4.25859 5.25 5.8125C5.25 7.07109 6.07617 8.13633 7.21875 8.49492V15.5016C6.07617 15.8637 5.25 16.9289 5.25 18.1875C5.25 19.7414 6.50859 21 8.0625 21C9.61641 21 10.875 19.7414 10.875 18.1875C10.875 16.9922 10.1297 15.9691 9.075 15.5648C9.18398 15.382 9.34922 15.2203 9.59883 15.0938C10.1684 14.8055 11.0191 14.7281 11.9227 14.6438C13.4062 14.5066 15.0867 14.3484 16.0781 13.118C16.5703 12.5062 16.8199 11.7188 16.8375 10.7309C17.9484 10.3512 18.75 9.3 18.75 8.0625ZM8.0625 5.25C8.37188 5.25 8.625 5.50312 8.625 5.8125C8.625 6.12188 8.37188 6.375 8.0625 6.375C7.75312 6.375 7.5 6.12188 7.5 5.8125C7.5 5.50312 7.75312 5.25 8.0625 5.25ZM8.0625 18.75C7.75312 18.75 7.5 18.4969 7.5 18.1875C7.5 17.8781 7.75312 17.625 8.0625 17.625C8.37188 17.625 8.625 17.8781 8.625 18.1875C8.625 18.4969 8.37188 18.75 8.0625 18.75ZM15.9375 7.5C16.2469 7.5 16.5 7.75313 16.5 8.0625C16.5 8.37187 16.2469 8.625 15.9375 8.625C15.6281 8.625 15.375 8.37187 15.375 8.0625C15.375 7.75313 15.6281 7.5 15.9375 7.5Z" fill="#ABB2C2"/>
                </svg>
              </span>
              <a href="https://twitter.com/${twitter_username}" target="_blank" class="meta-text">${twitter_username}</a>
            </li>` : ""}
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

      this.elements.profileCard.innerHTML = profileTemplate;
    },

    renderRepositoryCard(repo, panel) {
      const {
        name,
        html_url,
        description,
        private: isPrivate,
        language,
        stargazers_count: stars_count,
        forks_count,
      } = repo;

      const card = document.createElement("article");
      card.classList.add("card", "repo-card");
      
      const cardTemplate = `
        <div class="card-body">
          <a href="${html_url}" class="card-title" target="_blank">
            <h3 class="title-3">${name}</h3>
          </a>
          ${description ? `<p class="card-text">${description}</p>` : ""}
          <span class="badge">${isPrivate ? "Private" : "Public"}</span>
        </div>
        <div class="card-footer">
          ${language ? `
            <div class="meta-item">
              <span class="material-symbols-rounded" aria-hidden="true">code_blocks</span>
              <span class="span">${language}</span>
            </div>` : ""}
          <div class="meta-item">
            <span class="material-symbols-rounded" aria-hidden="true">star_rate</span>
            <span class="span">${numberToKilo(stars_count)}</span>
          </div>
          <div class="meta-item">
            <span class="material-symbols-rounded" aria-hidden="true">family_history</span>
            <span class="span">${numberToKilo(forks_count)}</span>
          </div>
        </div>`;

      card.innerHTML = cardTemplate;
      panel.appendChild(card);
    },

    renderFollowerCard(item, panel) {
      const { login: username, avatar_url, url } = item;

      const card = document.createElement("article");
      card.classList.add("card", "follower-card");

      const cardTemplate = `
        <figure class="avatar-circle img-holder">
          <img src="${avatar_url}" alt="" class="img-cover" />
        </figure>
        <h3 class="card-title">${username}</h3>
        <button class="icon-btn" onclick="_updateProfile('${url}')" aria-label="Go to ${username} profile">
          <span class="material-symbols-rounded" aria-hidden="true">link</span>
        </button>`;

      card.innerHTML = cardTemplate;
      panel.appendChild(card);
    },

    renderFollowingCard(item, panel) {
      const { login: username, avatar_url, url } = item;

      const card = document.createElement("article");
      card.classList.add("card", "follower-card");

      const cardTemplate = `
        <figure class="avatar-circle img-holder">
          <img src="${avatar_url}&s=64" width="56" height="56" loading="lazy" alt="${username}" class="img-cover">
        </figure>
        <h3 class="card-title">${username}</h3>
        <button class="icon-btn" onclick="_updateProfile('${url}')" aria-label="Go to ${username} profile">
          <span class="material-symbols-rounded" aria-hidden="true">link</span>
        </button>`;

      card.innerHTML = cardTemplate;
      panel.appendChild(card);
    },

    showError(message) {
      this.elements.error.style.display = "grid";
      document.body.style.overflowY = "hidden";
      document.title = "GitFinder // Not Found";
      
      const errorTemplate = `
        <div class="error-container">
          <div class="notfound">
            <div class="notfound-404">
              <h1 class="notfound-title">404</h1>
            </div>
            <h2 class="notfound-subtitle">${message}</h2>
            <a href="/index.html" class="home-btn">Go Home</a>
          </div> 
        </div>`;

      this.elements.error.innerHTML = errorTemplate;
    },

    showErrorMessage(element, message) {
      const errorTemplate = `
        <div class="error-content">
          <p class="title-1">Oops! :(</p>
          <p class="text">${message}</p>
        </div>`;

      element.innerHTML = errorTemplate;
    }
  };

  // Controller - Handles user interactions and coordinates Model and View
  const Controller = {
    init() {
      Model.lastActiveTabBtn = View.elements.tabBtns[0];
      Model.lastActiveTabPanel = View.elements.tabPanels[0];

      this.bindEvents();
      this._updateProfile(Model.apiUrl);
      getTheme();
      this.setIntroAnimation();
    },

    bindEvents() {
      addEventOnElement(View.elements.tabBtns, "click", this._activeTab.bind(this));
      addEventOnElement(View.elements.tabBtns, "keydown", this._tabControl.bind(this));

      View.elements.followerTabBtn.addEventListener("click", this._updateFollowerRepositories.bind(this));
      View.elements.forkedTabBtn.addEventListener("click", this._updateForkRepositories.bind(this));
      View.elements.followingTabBtn.addEventListener("click", this._updateFollowingRepositories.bind(this));
      View.elements.searchBtn.addEventListener("click", this._searchUser.bind(this));

      window.addEventListener("scroll", () => {
        View.elements.header.classList.toggle("active", scrollY > 60);
      });

      View.elements.searchToggler.addEventListener("click", () => {
        View.elements.header.classList.toggle("search-active");
        View.elements.searchField.focus();
      });

      View.elements.searchField.addEventListener("keydown", (e) => {
        if (e.key === "Enter") this._searchUser();
      });

      window.addEventListener("load", () => {
        View.elements.themeBtn.addEventListener("click", this._changeTheme.bind(this));
      });
    },

    _updateProfile(profileUrl) {
      View.elements.error.style.display = "none";
      document.body.style.overflow = "visible";
      View.elements.profileCard.innerHTML = Model.templates.loadingProfile;
      View.elements.tabBtns[0].click();
      View.elements.repoPanel.innerHTML = Model.templates.loadingRepo.repeat(6);
      fetchData(profileUrl, this._profile.bind(this), this._notFound.bind(this));
    },

    _profile(data) {
      Model.setUrls(data.repos_url, data.followers_url, data.following_url);
      View.renderProfile(data);
      this._updateRepositories();
    },

    _searchUser() {
      if (!View.elements.searchField.value) return;
      Model.apiUrl = `${BASE_API_URL}${View.elements.searchField.value}`;
      this._updateProfile(Model.apiUrl);
    },

    _updateRepositories() {
      fetchData(`${Model.repoUrl}?sort=created&per_page=12`, this._repositories.bind(this));
    },

    _repositories(data) {
      View.elements.repoPanel.innerHTML = `<h2 class="sr-only">Repositories</h2>`;
      const repositories = Model.setForkedRepos(data);

      if (repositories.length) {
        repositories.forEach(repo => View.renderRepositoryCard(repo, View.elements.repoPanel));
      } else {
        View.showErrorMessage(View.elements.repoPanel, "Doesn't have any public repositories yet");
      }
    },

    _updateForkRepositories() {
      View.elements.forkedRepoPanel.innerHTML = `<h2 class="sr-only">Forked Repositories</h2>`;

      if (Model.forkedRepos.length) {
        Model.forkedRepos.forEach(repo => View.renderRepositoryCard(repo, View.elements.forkedRepoPanel));
      } else {
        View.showErrorMessage(View.elements.forkedRepoPanel, "Doesn't have any forked repositories yet");
      }
    },

    _updateFollowerRepositories() {
      View.elements.followerRepoPanel.innerHTML = Model.templates.loadingFollower.repeat(12);
      fetchData(Model.followerUrl, this._followerRepositories.bind(this));
    },

    _followerRepositories(data) {
      View.elements.followerRepoPanel.innerHTML = `<h2 class="sr-only">Followers</h2>`;

      if (data.length) {
        data.forEach(item => View.renderFollowerCard(item, View.elements.followerRepoPanel));
      } else {
        View.showErrorMessage(View.elements.followerRepoPanel, "Doesn't have any follower yet");
      }
    },

    _updateFollowingRepositories() {
      View.elements.followingRepoPanel.innerHTML = Model.templates.loadingFollower.repeat(12);
      fetchData(Model.followingUrl, this._followingRepositories.bind(this));
    },

    _followingRepositories(data) {
      View.elements.followingRepoPanel.innerHTML = `<h2 class="sr-only">Following</h2>`;
      
      if (data.length) {
        data.forEach(item => View.renderFollowingCard(item, View.elements.followingRepoPanel));
      } else {
        View.showErrorMessage(View.elements.followingRepoPanel, "Doesn't have any following yet.");
      }
    },

    _changeTheme() {
      const newTheme = View.elements.html.dataset.theme === "light" ? "dark" : "light";
      View.elements.html.setAttribute("data-theme", newTheme);
      sessionStorage.setItem("theme", newTheme);
    },

    _notFound() {
      View.showError("we are sorry, but there is no account with this username yet!");
    },

    _tabControl(e) {
      const nextElement = e.target.nextElementSibling;
      const previousElement = e.target.previousElementSibling;

      if (e.key === "ArrowRight" && nextElement) {
        e.target.setAttribute("tabindex", "-1");
        nextElement.setAttribute("tabindex", "0");
        nextElement.focus();
      } else if (e.key === "ArrowLeft" && previousElement) {
        previousElement.setAttribute("tabindex", "0");
        previousElement.focus();
      }
    },

    _activeTab(e) {
      Model.lastActiveTabBtn.setAttribute("aria-selected", "false");
      Model.lastActiveTabPanel.setAttribute("hidden", "");
      e.target.setAttribute("aria-selected", "true");

      const currentTabPanel = document.querySelector(`#${e.target.getAttribute("aria-controls")}`);
      currentTabPanel.removeAttribute("hidden");

      Model.lastActiveTabBtn = e.target;
      Model.lastActiveTabPanel = currentTabPanel;
    },

    setIntroAnimation() {
      setTimeout(() => {
        View.elements.intro.style.visibility = "hidden";
      }, ZOOM_ANIMATION_DELAY);
    }
  };

  // Public API
  return {
    init: Controller.init.bind(Controller)
  };
})();

GitFinderApp.init();
