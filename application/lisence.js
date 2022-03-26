const { ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");
const { verify } = require("jsonwebtoken");
const exec = require("child_process").exec;
const { createHash } = require("crypto");
const homedir = require('os').homedir();

const run = (cmd) =>
  new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderror) => {
      if (error) return reject(error);
      if (stderror) return reject(stderror);
      resolve(stdout);
    });
  });
const getPCID = () =>
  new Promise((resolve) => {
    run("wmic CPU get ProcessorId").then((res) => {
      const hash = createHash("sha256");
      hash.on("readable", () => {
        const data = hash.read();
        if (data) {
          resolve(data.toString("hex"));
        }
      });
      hash.write(res.replace(/([\s\r\n]|ProcessorId)/gi, ""));
      hash.end();
    });
  });

const initLisence = () => {
  ipcMain.handle("check-license", async (event, ...args) => {
    try {
      if (!fs.existsSync(`${homedir}/.masav-file-generator/data`)) {
        return "FREE";
      }
      const token = fs.readFileSync(
        `${homedir}/.masav-file-generator/data`,
        { encoding: "utf-8" }
      );
      const cert = fs.readFileSync(path.join(__dirname, "jwtRS256.key.pub"), {
        encoding: "utf-8",
      });
      const result = verify(token, cert);
      if (result.lisence === (await getPCID())) return "PREMIUM";
      console.log(result);
      return "FREE";
    } catch (e) {
      return "FREE";
    }
  });

  ipcMain.handle("add-license", async (event, lisence) => {
    try {
      if (!fs.existsSync(`${homedir}/.masav-file-generator/data`)) {
        try {
          fs.mkdirSync(`${homedir}/.masav-file-generator/`);
        } catch (e) {}
      }
      const cert = fs.readFileSync(path.join(__dirname, "jwtRS256.key.pub"), {
        encoding: "utf-8",
      });
      const result = verify(lisence, cert);
      if (result.lisence === (await getPCID())) {
        fs.writeFileSync(
          `${homedir}/.masav-file-generator/data`,
          lisence,
          {
            encoding: "utf-8",
          }
        );
        return { success: true };
      }
      return {
        success: false,
        error: `invalid lisence file=${result.lisence} pid=${await getPCID()}`,
      };
    } catch (e) {
      return { success: false, error: e.message };
    }
  });

  ipcMain.handle("get-pc-id", async (event, ...args) => {
    try {
      return await getPCID();
    } catch (e) {
      return "";
    }
  });
};

module.exports = { initLisence };
