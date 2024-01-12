"use strict";

export async function fetchData(url, successCallback, errorCallBack) {
  const response = await fetch(url);
  if (response.ok) {
    const data = response.json();
    successCallback(data);
  } else {
    const error = await response.json();
    errorCallBack(error) && errorCallBack;
  }
}
