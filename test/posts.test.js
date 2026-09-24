const test = require("node:test");
const assert = require("node:assert");
const { buildSite, readOutput } = require("./helpers.js");

test.before(() => {
  buildSite();
});

test("consultor post page renders with its title", () => {
  const html = readOutput("posts/comecar-consultor/index.html");
  assert.match(html, /Porque decidi começar como consultor imobiliário/);
});

test("agencia post page renders with its title", () => {
  const html = readOutput("posts/abrir-agencia/index.html");
  assert.match(html, /O que é preciso para abrir a tua agência DS Imobiliária/);
});
