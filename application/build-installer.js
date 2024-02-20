const electronInstaller = require("electron-winstaller");
const pack = require("../package.json");
const secrets = require("../secrets.json");

(async () => {
  try {
    console.log("Building Installer");
    await electronInstaller.createWindowsInstaller({
      appDirectory: "../dist/Masav File Generator-win32-x64/",
      outputDirectory: "../installers/",
      authors: "Elisha Mayer",
      exe: "Masav File Generator.exe",
      icon: "public/favicon.ico",
      tags: ["Utility"],
      name: "masav-file-generator",
      title: "Masav File Generator",
      description: "Masav File Generator",
      version: pack.version,
      noMsi: true,
      certificateFile: "../cert.pfx",
      certificatePassword: secrets["certPassword"],
    });
    console.log("It worked!");
  } catch (e) {
    console.log(`No dice: ${e.message}`);
  }
})();
