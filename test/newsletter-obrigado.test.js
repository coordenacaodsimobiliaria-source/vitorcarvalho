const test = require("node:test");
const assert = require("node:assert");
const { buildSite, readOutput } = require("./helpers.js");

test.before(() => {
  buildSite();
});

test("newsletter thank-you page renders with links back into the site", () => {
  const html = readOutput("newsletter/obrigado/index.html");
  assert.match(html, /Obrigado/);
  assert.match(html, /href="\/blog\/"/);
  assert.match(html, /href="\/galeria\/"/);
});
