const { execSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");

function buildSite() {
  execSync("npx @11ty/eleventy", { cwd: ROOT, stdio: "pipe" });
}

function readOutput(relativePath) {
  return fs.readFileSync(path.join(ROOT, "_site", relativePath), "utf-8");
}

module.exports = { buildSite, readOutput };
