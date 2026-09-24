const test = require("node:test");
const assert = require("node:assert");
const { buildSite, readOutput } = require("./helpers.js");

test.before(() => {
  buildSite();
});

test("contact form is wired for Netlify Forms with a honeypot field", () => {
  const html = readOutput("contacto/index.html");
  assert.match(html, /data-netlify="true"/);
  assert.match(html, /name="contacto"/);
  assert.match(html, /netlify-honeypot/);
});

test("contact form has all five required fields", () => {
  const html = readOutput("contacto/index.html");
  assert.match(html, /name="nome"/);
  assert.match(html, /name="email"/);
  assert.match(html, /name="telefone"/);
  assert.match(html, /name="interesse"/);
  assert.match(html, /name="mensagem"/);
});

test("nome, email and mensagem are required fields", () => {
  const html = readOutput("contacto/index.html");
  const nomeField = html.match(/<input[^>]*name="nome"[^>]*>/)[0];
  const emailField = html.match(/<input[^>]*name="email"[^>]*>/)[0];
  const mensagemField = html.match(/<textarea[^>]*name="mensagem"[^>]*>/)[0];
  assert.match(nomeField, /required/);
  assert.match(emailField, /required/);
  assert.match(mensagemField, /required/);
});

test("direct email and WhatsApp links are present", () => {
  const html = readOutput("contacto/index.html");
  assert.match(html, /href="mailto:vitorcarvalho@dsimobiliaria\.pt"/);
  assert.match(html, /href="https:\/\/wa\.me\/351900000000"/);
});
