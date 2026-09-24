const test = require("node:test");
const assert = require("node:assert");
const { buildSite, readOutput } = require("./helpers.js");

test.before(() => {
  buildSite();
});

test("newsletter signup form appears in the footer with RGPD consent", () => {
  const html = readOutput("index.html");
  assert.match(html, /class="newsletter-form"/);
  assert.match(html, /type="email"[^>]*name="EMAIL"/);
  // consent checkbox is required and links to the privacy policy
  assert.match(html, /type="checkbox" name="consent" required/);
  assert.match(html, /newsletter-consent[\s\S]*Política de Privacidade/);
});
