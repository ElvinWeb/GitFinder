export { IS_DARK, BASE_API_URL };

const IS_DARK = window.matchMedia("(prefers-color-scheme: dark)").matches;
const BASE_API_URL = "https://api.github.com/users/";
