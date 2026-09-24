const test = require("node:test");
const assert = require("node:assert");
const { buildSite, readOutput } = require("./helpers.js");

test.before(() => {
  buildSite();
});

test("Sobre mim page renders the career timeline", () => {
  const html = readOutput("sobre/index.html");
  assert.match(html, /2014/);
  assert.match(html, /2016/);
  assert.match(html, /Coordenador Regional Sul/);
});
