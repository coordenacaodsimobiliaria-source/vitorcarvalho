const test = require("node:test");
const assert = require("node:assert");
const { buildSite, readOutput } = require("./helpers.js");

test.before(() => {
  buildSite();
});

test("build produces a home page with the scaffold marker", () => {
  const html = readOutput("index.html");
  assert.match(html, /Site em constru/);
});
