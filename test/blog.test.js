const test = require("node:test");
const assert = require("node:assert");
const { buildSite, readOutput } = require("./helpers.js");

test.before(() => {
  buildSite();
});

test("blog page lists every post, most recent first as the featured post", () => {
  const html = readOutput("blog/index.html");
  assert.match(html, /class="post-featured"/);
  // both audiences show up on the unified blog page
  assert.match(html, /Porque decidi começar como consultor imobiliário/);
  assert.match(html, /O que é preciso para abrir a tua própria agência imobiliária/);
  assert.match(html, /O que ninguém me disse antes de ser consultor imobiliário/);
});

test("blog is reachable from the main navigation", () => {
  const html = readOutput("index.html");
  assert.match(html, /href="\/blog\/"/);
});
