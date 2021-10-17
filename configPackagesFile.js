const fs = require("fs");
const pack = JSON.parse(fs.readFileSync("package.json", { encoding: "utf-8" }));
if (process.argv[2] === "web") {
  delete pack.homepage;
}
if (process.argv[2] === "electron") {
  pack.homepage = "./";
}

fs.writeFileSync("package.json", JSON.stringify(pack, null, "\t"), {
  encoding: "utf-8",
});
