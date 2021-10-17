const fs = require("fs");
const { sign } = require("jsonwebtoken");

const uuid = fs.readFileSync(process.argv[2], { encoding: "utf-8" });
var privateKey = fs.readFileSync("jwtRS256.key");
const token = sign({ lisence: uuid }, privateKey, { algorithm: "RS256" });
fs.writeFileSync("license", token, { encoding: "utf-8" });
