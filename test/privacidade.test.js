const test = require("node:test");
const assert = require("node:assert");
const { buildSite, readOutput } = require("./helpers.js");

test.before(() => {
  buildSite();
});

test("privacy policy page covers the required RGPD content", () => {
  const html = readOutput("politica-privacidade/index.html");
  assert.match(html, /RGPD/);
  assert.match(html, /CNPD/);
  assert.match(html, /direito/i);
  assert.match(html, /Netlify/);
  assert.match(html, /Brevo/);
});

test("privacy policy is linked from the footer on every page", () => {
  const html = readOutput("index.html");
  assert.match(html, /href="\/politica-privacidade\/"/);
});
