export const saveInStorage = (key, data) => {
  const shouldSave =
    localStorage.getItem("@online-editor/save-data") !== "false";
  if (shouldSave) {
    localStorage.setItem(`@online-editor/${key}`, data);
  }
};
