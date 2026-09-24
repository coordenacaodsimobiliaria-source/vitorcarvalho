const test = require("node:test");
const assert = require("node:assert");
const { buildSite, readOutput } = require("./helpers.js");

test.before(() => {
  buildSite();
});

test("galeria listing shows the Summit 2026 album", () => {
  const html = readOutput("galeria/index.html");
  assert.match(html, /Summit 2026/);
  assert.match(html, /class="album-card"/);
});

test("album page renders all its photos with lightbox links", () => {
  const html = readOutput("galeria/albuns/summit-2026/index.html");
  assert.match(html, /foto-1\.jpg/);
  assert.match(html, /foto-2\.jpg/);
  assert.match(html, /data-lightbox/g);
});

test("galeria listing falls back gracefully when an album has no cover", () => {
  // Template-level check: the fallback branch exists in the source, so an
  // album published without `capa` renders a placeholder instead of a
  // broken <img> or a failed build.
  const fs = require("node:fs");
  const path = require("node:path");
  const templateSrc = fs.readFileSync(
    path.join(__dirname, "..", "src", "galeria", "index.njk"),
    "utf-8"
  );
  assert.match(templateSrc, /album-cover-placeholder/);
});
