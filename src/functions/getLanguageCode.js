export const getLanguageCode = () => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const lngFromQuery = urlSearchParams.get("lang");
  if (["he", "en"].includes(lngFromQuery)) {
    localStorage.setItem("@language", lngFromQuery);
    return lngFromQuery;
  }
  const lngFromStorage = localStorage.getItem("@language");
  if (["he", "en"].includes(lngFromStorage)) {
    return lngFromStorage;
  }
  return undefined;
};
