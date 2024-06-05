export {
  IS_DARK,
  BASE_API_URL,
  INITIAL_ANIMATION_STEP,
  REMOVE_ADDANIMATION_DELAY,
  REMOVE_ADDANIMATION_STEP,
  HIDE_INTRO_DELAY,
};

const IS_DARK = window.matchMedia("(prefers-color-scheme: dark)").matches;
const BASE_API_URL = "https://api.github.com/users/";
const INITIAL_ANIMATION_STEP = 500;
const REMOVE_ADDANIMATION_DELAY = 2000;
const REMOVE_ADDANIMATION_STEP = 100;
const HIDE_INTRO_DELAY = 2300;
