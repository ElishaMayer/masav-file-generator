const path = require("path");
const fs = require("fs");
const { app, BrowserWindow, protocol, ipcMain } = require("electron");
const isDev = require("electron-is-dev");

if (require("electron-squirrel-startup")) return;

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    show: false,
    title: "Masav File Generator",
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    icon: path.join(__dirname, "../build/logo192.png"),
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.maximize();

  // and load the index.html of the app.
  // win.loadFile("index.html");
  win.loadURL(isDev ? "http://127.0.0.1:3000" : `file://`);

  win.show();

  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools({ mode: "detach" });
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  if (!isDev)
    protocol.interceptBufferProtocol("file", (request, callback) => {
      try {
        callback(
          fs.readFileSync(path.join(__dirname, "public", request.url.substr(8)))
        );
      } catch (e) {
        callback(fs.readFileSync(path.join(__dirname, "public", "index.html")));
      }
    });
    createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
