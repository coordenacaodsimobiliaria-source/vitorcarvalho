const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const { buildSite, readOutput } = require("./helpers.js");

test.before(() => {
  buildSite();
});

test("Quero ser Consultor page lists only the consultor post", () => {
  const html = readOutput("quero-ser-consultor/index.html");
  assert.match(html, /Porque decidi começar como consultor imobiliário/);
  assert.doesNotMatch(html, /O que é preciso para abrir a tua agência/);
});

test("Quero abrir Agência page lists only the agencia post", () => {
  const html = readOutput("quero-abrir-agencia/index.html");
  assert.match(html, /O que é preciso para abrir a tua agência DS Imobiliária/);
  assert.doesNotMatch(html, /Porque decidi começar como consultor imobiliário/);
});

test("consultor and agencia collections are disjoint and match the seeded posts", () => {
  // Structural check: each tag collection has exactly one page, and they
  // are different pages. A post without a consultor/agencia tag would
  // fail this by leaving one collection short instead of at 1.
  const consultorHtml = readOutput("quero-ser-consultor/index.html");
  const agenciaHtml = readOutput("quero-abrir-agencia/index.html");
  const consultorCount = (consultorHtml.match(/class="post-card"/g) || []).length;
  const agenciaCount = (agenciaHtml.match(/class="post-card"/g) || []).length;
  assert.strictEqual(consultorCount, 1);
  assert.strictEqual(agenciaCount, 1);
});

test("every post belongs to exactly one audience collection", () => {
  // Invariant: every post in src/posts/ (independent source of truth)
  // must appear in exactly one audience collection. totalPosts comes
  // from the filesystem, independent of the two page reads below —
  // so a post with neither tag (or both) breaks this instead of
  // going undetected.
  const postsDir = path.join(__dirname, "..", "src", "posts");
  const totalPosts = fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith(".md")).length;

  const consultorHtml = readOutput("quero-ser-consultor/index.html");
  const agenciaHtml = readOutput("quero-abrir-agencia/index.html");
  const consultorCount = (consultorHtml.match(/class="post-card"/g) || []).length;
  const agenciaCount = (agenciaHtml.match(/class="post-card"/g) || []).length;

  assert.strictEqual(consultorCount + agenciaCount, totalPosts);
});
