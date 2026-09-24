const test = require("node:test");
const assert = require("node:assert");
const { buildSite, readOutput } = require("./helpers.js");

test.before(() => {
  buildSite();
});

test("build produces a home page with proper layout structure", () => {
  const html = readOutput("index.html");
  assert.match(html, /<header class="site-header">/);
  assert.match(html, /<main>/);
  assert.match(html, /<footer class="site-footer">/);
});
