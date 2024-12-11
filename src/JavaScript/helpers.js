import { IS_DARK } from "./config.js";
export {
  fetchData,
  addEventOnElement,
  numberToKilo,
  getTheme,
  animateSpans,
  removeAndAddClass,
  hideElement,
};

async function fetchData(url, successCallback, errorCallBack) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    successCallback(await response.json());
  } catch (error) {
    errorCallBack(error);
  }
}

const addEventOnElement = (elements, eventType, callback) => {
  elements.forEach(element => element.addEventListener(eventType, callback));
};

const numberToKilo = number => {
  const numStr = number.toString();
  const len = numStr.length;
  
  switch(true) {
    case len <= 3: return numStr;
    case len <= 5: return `${numStr.slice(0, -3)}.${numStr.slice(-3, -2)}K`;
    case len === 6: return `${numStr.slice(0, -3)}K`;
    default: return `${numStr.slice(0, -6)}M`;
  }
};

const getTheme = () => {
  const theme = sessionStorage.getItem("theme");
  document.documentElement.dataset.theme = theme || (IS_DARK ? "dark" : "light");
};
