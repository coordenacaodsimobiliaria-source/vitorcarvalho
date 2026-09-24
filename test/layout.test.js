const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const { buildSite, readOutput } = require("./helpers.js");

test.before(() => {
  buildSite();
});

test("home page includes navigation to every section", () => {
  const html = readOutput("index.html");
  assert.match(html, /href="\/quero-ser-consultor\/"/);
  assert.match(html, /href="\/quero-abrir-agencia\/"/);
  assert.match(html, /href="\/galeria\/"/);
  assert.match(html, /href="\/sobre\/"/);
  assert.match(html, /href="\/contacto\/"/);
});

test("stylesheet uses the DSI palette", () => {
  const css = fs.readFileSync(
    path.join(__dirname, "..", "_site", "assets", "css", "style.css"),
    "utf-8"
  );
  assert.match(css, /#003EAB/);
  assert.match(css, /#00A9EB/);
});

test("stylesheet has a mobile breakpoint", () => {
  const css = fs.readFileSync(
    path.join(__dirname, "..", "_site", "assets", "css", "style.css"),
    "utf-8"
  );
  assert.match(css, /@media \(max-width:/);
});
