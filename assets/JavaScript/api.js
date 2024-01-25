export default async function fetchData(url, successCallback, errorCallBack) {
  const response = await fetch(url);
  if (response.ok) {
    const data = await response.json();
    successCallback(data);
  } else {
    const error = await response.json();
    errorCallBack(error);
  }
}
