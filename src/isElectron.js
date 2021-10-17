let isElectronLocal = false;
// Renderer process
if (
  typeof window !== "undefined" &&
  typeof window.process === "object" &&
  window.process.type === "renderer"
) {
  isElectronLocal = true;
}

// Main process
if (
  typeof process !== "undefined" &&
  typeof process.versions === "object" &&
  !!process.versions.electron
) {
  isElectronLocal = true;
}

// Detect the user agent when the `nodeIntegration` option is set to true
if (
  typeof navigator === "object" &&
  typeof navigator.userAgent === "string" &&
  navigator.userAgent.indexOf("Electron") >= 0
) {
  isElectronLocal = true;
}

export const isElectron = isElectronLocal;

export const hasLisence = async () => {
  try {
    return await window.ipcRenderer.invoke("check-license");
  } catch (e) {}
};

export const getPCID = async () => {
  try {
    return await window.ipcRenderer.invoke("get-pc-id");
  } catch (e) {}
};

export const saveLisence = async (lisence) => {
  try {
    return await window.ipcRenderer.invoke("add-license", lisence);
  } catch (e) {}
};
