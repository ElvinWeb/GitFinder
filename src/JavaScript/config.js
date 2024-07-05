export { IS_DARK, BASE_API_URL, ZOOM_ANIMATION_DELAY };

const IS_DARK = window.matchMedia("(prefers-color-scheme: dark)").matches;
const BASE_API_URL = "https://api.github.com/users/";
const ZOOM_ANIMATION_DELAY = 3000;
