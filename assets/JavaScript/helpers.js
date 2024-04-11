export async function fetchData(url, successCallback, errorCallBack) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch");
    }

    const data = await response.json();
    successCallback(data);
  } catch (error) {
    errorCallBack(error);
  }
}
export const addEventOnElement = function ($elements, eventType, callback) {
  for (const $item of $elements) {
    $item.addEventListener(eventType, callback);
  }
};
export const numberToKilo = function (number) {
  let numStr = number.toString();

  if (numStr.length <= 3) {
    return numStr;
  } else if (numStr.length >= 4 && numStr.length <= 5) {
    return `${numStr.slice(0, -3)}.${numStr.slice(-3, -2)}K`;
  } else if (numStr.length === 6) {
    return `${numStr.slice(0, -3)}K`;
  } else {
    return `${numStr.slice(0, -6)}M`;
  }
};
