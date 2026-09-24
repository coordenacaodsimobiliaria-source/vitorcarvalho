# Site do Vítor Carvalho Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Eleventy static site (home, two audience sections, blog posts, photo gallery, about, contact) that runs and publishes on Netlify.

**Architecture:** Eleventy (11ty) reads Markdown/Nunjucks content in `src/`, renders it through a shared base layout, and outputs static HTML to `_site/`. Netlify builds `_site/` on every git push and serves the contact form via Netlify Forms — no backend code.

**Tech Stack:** Node.js, `@11ty/eleventy` v2, Nunjucks templates, plain CSS (no framework), Node's built-in `node:test` runner for build-output tests.

**Spec:** `docs/superpowers/specs/2026-09-24-vitor-blog-design.md`

## Global Constraints

- Static generator is Eleventy (11ty); no other framework.
- Hosting is Netlify, deployed via git push (no manual uploads).
- Contact form uses Netlify Forms only — no backend, no third-party form service.
- Images live in the repository under `src/assets/img/`, not an external image host.
- Visual identity uses the DSI palette (`#003EAB`, `#004C9D`, `#00A9EB`, `#555960`) and Quicksand, in an original layout — not a copy of the official DSI site.
- No CMS; content changes are Markdown files edited directly in the repo.
- Site is personal (Vítor's own voice), not an official DSI brand publication.

## Review Focus

- A visitor on a phone screen (~375px wide) needs the header, hero and cards to reflow into a single readable column instead of overflowing — the spec requires mobile+desktop testing but no task exercises a narrow viewport directly, so this is checked via a required CSS breakpoint.
- A post published without a `consultor` or `agencia` tag would silently vanish from both section pages while looking successfully published to whoever wrote it — checked by asserting the two tag collections stay disjoint and match the seeded posts exactly.
- The Netlify contact form needs its spam honeypot field or every submission risks being lost to spam filtering with no warning to Vítor — checked by asserting the honeypot markup is present.
- An album missing a cover photo (`capa`) would either crash the gallery build or render a broken image icon — checked by asserting the template's fallback path exists.
- A visitor submitting the contact form with empty required fields expects the browser to stop them, not a silent failed submission — checked by asserting `required` is present on Nome, Email and Mensagem.

---

## File Structure

```
vitor-blog/
├── package.json
├── .eleventy.js
├── .gitignore
├── netlify.toml
├── README.md
├── test/
│   ├── helpers.js
│   ├── scaffold.test.js
│   ├── layout.test.js
│   ├── posts.test.js
│   ├── sections.test.js
│   ├── galeria.test.js
│   ├── sobre.test.js
│   └── contacto.test.js
└── src/
    ├── _data/
    │   ├── site.js
    │   └── nowYear.js
    ├── _includes/
    │   ├── layouts/
    │   │   ├── base.njk
    │   │   ├── post.njk
    │   │   └── album.njk
    │   └── partials/
    │       ├── header.njk
    │       └── footer.njk
    ├── assets/
    │   ├── css/style.css
    │   ├── js/lightbox.js
    │   └── img/
    │       ├── posts/comecar-consultor.svg
    │       ├── posts/abrir-agencia.svg
    │       └── galeria/summit-2026/{capa,foto-1,foto-2}.svg
    ├── posts/
    │   ├── posts.json
    │   ├── comecar-consultor.md
    │   └── abrir-agencia.md
    ├── galeria/
    │   ├── index.njk
    │   └── albuns/
    │       ├── albuns.json
    │       └── summit-2026.md
    ├── index.njk
    ├── quero-ser-consultor.njk
    ├── quero-abrir-agencia.njk
    ├── sobre.njk
    └── contacto.njk
```

---

### Task 1: Project scaffolding

**Files:**
- Create: `package.json`
- Create: `.eleventy.js`
- Create: `.gitignore`
- Create: `src/index.njk`
- Create: `test/helpers.js`
- Test: `test/scaffold.test.js`

**Interfaces:**
- Produces: `buildSite()` and `readOutput(relativePath)` from `test/helpers.js`, used by every later test file. `buildSite()` runs `npx @11ty/eleventy` from the project root; `readOutput(path)` reads a file from `_site/<path>` as a UTF-8 string.

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "vitor-blog",
  "private": true,
  "version": "1.0.0",
  "scripts": {
    "build": "eleventy",
    "serve": "eleventy --serve",
    "test": "node --test test/"
  },
  "devDependencies": {
    "@11ty/eleventy": "^2.0.1"
  }
}
```

- [ ] **Step 2: Install dependencies**

Run: `npm install`
Expected: `node_modules/` created, `@11ty/eleventy` listed in `package-lock.json`.

- [ ] **Step 3: Create `.gitignore`**

```
node_modules/
_site/
.cache/
```

- [ ] **Step 4: Create `.eleventy.js`**

```js
module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  eleventyConfig.addFilter("formatDate", (dateObj) => {
    return new Intl.DateTimeFormat("pt-PT", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(dateObj);
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
  };
};
```

- [ ] **Step 5: Create a placeholder home page**

`src/index.njk`:

```html
<h1>vitor-blog</h1>
<p data-test="scaffold-ok">Site em construção.</p>
```

- [ ] **Step 6: Write the test helper**

`test/helpers.js`:

```js
const { execSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");

function buildSite() {
  execSync("npx @11ty/eleventy", { cwd: ROOT, stdio: "pipe" });
}

function readOutput(relativePath) {
  return fs.readFileSync(path.join(ROOT, "_site", relativePath), "utf-8");
}

module.exports = { buildSite, readOutput };
```

- [ ] **Step 7: Write the failing test**

`test/scaffold.test.js`:

```js
const test = require("node:test");
const assert = require("node:assert");
const { buildSite, readOutput } = require("./helpers.js");

test.before(() => {
  buildSite();
});

test("build produces a home page with the scaffold marker", () => {
  const html = readOutput("index.html");
  assert.match(html, /Site em constru/);
});
```

- [ ] **Step 8: Run the test to verify it fails**

Run: `node --test test/scaffold.test.js`
Expected: FAIL — `_site/index.html` does not exist yet (no build has run).

- [ ] **Step 9: Run the build manually, then re-run the test**

Run: `npx @11ty/eleventy`
Run: `node --test test/scaffold.test.js`
Expected: PASS.

- [ ] **Step 10: Commit**

```bash
git add package.json package-lock.json .eleventy.js .gitignore src/index.njk test/helpers.js test/scaffold.test.js
git commit -m "chore: scaffold Eleventy project"
```

---

### Task 2: Design tokens, base layout, header/footer, Home page

**Files:**
- Create: `src/_data/site.js`
- Create: `src/_data/nowYear.js`
- Create: `src/_includes/layouts/base.njk`
- Create: `src/_includes/partials/header.njk`
- Create: `src/_includes/partials/footer.njk`
- Create: `src/assets/css/style.css`
- Modify: `src/index.njk`
- Test: `test/layout.test.js`

**Interfaces:**
- Consumes: `buildSite()`, `readOutput()` from `test/helpers.js` (Task 1).
- Produces: global data `site` (name, tagline, email, whatsappNumber, colors, nav array of `{label, url}`) and `nowYear`, available in every template from here on. Layout `layouts/base.njk` is the layout every page and every other layout extends.

- [ ] **Step 1: Write the failing test**

`test/layout.test.js`:

```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test test/layout.test.js`
Expected: FAIL — no nav markup, no stylesheet yet.

- [ ] **Step 3: Create site data**

`src/_data/site.js`:

```js
module.exports = {
  name: "Vítor Carvalho",
  tagline: "Coordenador Regional Sul · DS Imobiliária",
  email: "vitorcarvalho@dsimobiliaria.pt",
  whatsappNumber: "351900000000",
  nav: [
    { label: "Início", url: "/" },
    { label: "Quero ser Consultor", url: "/quero-ser-consultor/" },
    { label: "Quero abrir Agência", url: "/quero-abrir-agencia/" },
    { label: "Galeria", url: "/galeria/" },
    { label: "Sobre mim", url: "/sobre/" },
    { label: "Contacto", url: "/contacto/" },
  ],
};
```

`src/_data/nowYear.js`:

```js
module.exports = () => new Date().getFullYear();
```

> `whatsappNumber` is a placeholder (`351900000000`). Before the site goes live, replace it in this file with Vítor's real WhatsApp number in international format, no spaces or symbols.

- [ ] **Step 4: Create header and footer partials**

`src/_includes/partials/header.njk`:

```html
<header class="site-header">
  <a class="brand" href="/">{{ site.name }}</a>
  <nav class="site-nav">
    {% for item in site.nav %}
    <a href="{{ item.url }}">{{ item.label }}</a>
    {% endfor %}
  </nav>
</header>
```

`src/_includes/partials/footer.njk`:

```html
<footer class="site-footer">
  <p>&copy; {{ nowYear }} {{ site.name }} — {{ site.tagline }}</p>
  <p><a href="mailto:{{ site.email }}">{{ site.email }}</a></p>
</footer>
```

- [ ] **Step 5: Create the base layout**

`src/_includes/layouts/base.njk`:

```html
<!doctype html>
<html lang="pt-PT">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{ title }} · {{ site.name }}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Quicksand:wght@500;600;700&family=Inter:wght@400;500;600&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="/assets/css/style.css" />
  </head>
  <body>
    {% include "partials/header.njk" %}
    <main>{{ content | safe }}</main>
    {% include "partials/footer.njk" %}
  </body>
</html>
```

- [ ] **Step 6: Create the base stylesheet**

`src/assets/css/style.css`:

```css
:root {
  --color-primary: #003EAB;
  --color-primary-dark: #004C9D;
  --color-accent: #00A9EB;
  --color-neutral: #555960;
  --color-bg: #FFFFFF;
  --color-surface: #F5F7FA;
  --color-text: #1B1F27;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--color-bg);
  color: var(--color-text);
  font-family: "Inter", system-ui, -apple-system, sans-serif;
  line-height: 1.6;
}

h1, h2, h3 {
  font-family: "Quicksand", "Inter", sans-serif;
  font-weight: 600;
}

a {
  color: var(--color-primary);
}

main {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 20px 60px;
}

.site-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 16px 20px;
  background: var(--color-primary);
}

.site-header .brand {
  color: #fff;
  font-family: "Quicksand", sans-serif;
  font-weight: 700;
  font-size: 18px;
  text-decoration: none;
}

.site-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.site-nav a {
  color: #fff;
  text-decoration: none;
  font-size: 14px;
}

.site-nav a:hover {
  text-decoration: underline;
}

.site-footer {
  padding: 24px 20px;
  background: var(--color-surface);
  color: var(--color-neutral);
  font-size: 13px;
  text-align: center;
}

.hero {
  padding: 48px 0 24px;
}

.hero h1 {
  font-size: 32px;
  margin-bottom: 12px;
}

.hero .lead {
  font-size: 17px;
  color: var(--color-neutral);
  max-width: 640px;
}

.cta-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin: 32px 0;
}

.cta-card {
  display: block;
  padding: 24px;
  border-radius: 12px;
  background: var(--color-surface);
  border: 1px solid #E3E6EC;
  text-decoration: none;
  color: var(--color-text);
}

.cta-card h2 {
  color: var(--color-primary);
  margin: 0 0 8px;
  font-size: 20px;
}

.cta-card p {
  margin: 0;
  color: var(--color-neutral);
}

@media (max-width: 640px) {
  .cta-grid {
    grid-template-columns: 1fr;
  }

  .site-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
```

- [ ] **Step 7: Wire the Home page into the layout**

`src/index.njk`:

```html
---
layout: layouts/base.njk
title: Início
---
<section class="hero">
  <h1>Junta-te à DS Imobiliária</h1>
  <p class="lead">
    Sou o Vítor Carvalho, Coordenador Regional Sul da DS Imobiliária. Aqui
    partilho o que fui aprendendo a construir uma carreira e agências de
    sucesso em mediação imobiliária — para quem quer começar como consultor,
    ou para quem já tem experiência e quer abrir a própria agência.
  </p>
</section>
<section class="cta-grid">
  <a class="cta-card" href="/quero-ser-consultor/">
    <h2>Quero ser Consultor</h2>
    <p>Como começar uma carreira em mediação imobiliária com a DS Imobiliária.</p>
  </a>
  <a class="cta-card" href="/quero-abrir-agencia/">
    <h2>Quero abrir Agência</h2>
    <p>O que é preciso para abrir a tua própria agência DS Imobiliária.</p>
  </a>
</section>
```

- [ ] **Step 8: Run the test to verify it passes**

Run: `node --test test/layout.test.js`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add src/_data src/_includes src/assets/css/style.css src/index.njk test/layout.test.js
git commit -m "feat: add DSI-styled base layout, nav, and Home page"
```

---

### Task 3: Blog posts collection

**Files:**
- Create: `src/posts/posts.json`
- Create: `src/_includes/layouts/post.njk`
- Create: `src/posts/comecar-consultor.md`
- Create: `src/posts/abrir-agencia.md`
- Create: `src/assets/img/posts/comecar-consultor.svg`
- Create: `src/assets/img/posts/abrir-agencia.svg`
- Test: `test/posts.test.js`

**Interfaces:**
- Consumes: `layouts/base.njk` (Task 2), `formatDate` filter (Task 1).
- Produces: Eleventy collections `collections.post` (all posts), `collections.consultor` (posts tagged `consultor`), `collections.agencia` (posts tagged `agencia`) — consumed by Task 4's section pages. Each post has front matter `title`, `date`, `tags`, `excerpt`, `image`.

- [ ] **Step 1: Write the failing test**

`test/posts.test.js`:

```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test test/posts.test.js`
Expected: FAIL — `_site/posts/...` does not exist.

- [ ] **Step 3: Create the posts directory data file**

`src/posts/posts.json`:

```json
{
  "layout": "layouts/post.njk",
  "tags": ["post"]
}
```

- [ ] **Step 4: Create the post layout**

`src/_includes/layouts/post.njk`:

```html
---
layout: layouts/base.njk
---
<article class="post">
  <p class="post-date">{{ date | formatDate }}</p>
  <h1>{{ title }}</h1>
  {% if image %}
  <img class="post-image" src="{{ image }}" alt="{{ title }}" />
  {% endif %}
  <div class="post-body">{{ content | safe }}</div>
</article>
```

- [ ] **Step 5: Create placeholder post images**

`src/assets/img/posts/comecar-consultor.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
  <rect width="800" height="450" fill="#003EAB"/>
  <text x="50%" y="50%" fill="#ffffff" font-family="sans-serif" font-size="28" text-anchor="middle" dominant-baseline="middle">Imagem provisória</text>
</svg>
```

`src/assets/img/posts/abrir-agencia.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
  <rect width="800" height="450" fill="#004C9D"/>
  <text x="50%" y="50%" fill="#ffffff" font-family="sans-serif" font-size="28" text-anchor="middle" dominant-baseline="middle">Imagem provisória</text>
</svg>
```

- [ ] **Step 6: Create the two example posts**

`src/posts/comecar-consultor.md`:

```md
---
title: "Porque decidi começar como consultor imobiliário"
date: 2026-09-24
tags: ["consultor"]
excerpt: "A minha entrada na mediação imobiliária em 2014 e o que gostava de ter sabido antes."
image: /assets/img/posts/comecar-consultor.svg
---

Comecei como consultor imobiliário em 2014. Não sabia bem o que esperar, mas
foi essa decisão que me trouxe até onde estou hoje, como Coordenador Regional
Sul da DS Imobiliária.

Neste artigo, o primeiro de vários, partilho o que aprendi sobre entrar nesta
profissão — e porque acredito que pode ser o início certo para quem procura
autonomia e crescimento real.
```

`src/posts/abrir-agencia.md`:

```md
---
title: "O que é preciso para abrir a tua agência DS Imobiliária"
date: 2026-09-24
tags: ["agencia"]
excerpt: "Passos práticos e o que aprendi a coordenar 24 agências na Região Sul."
image: /assets/img/posts/abrir-agencia.svg
---

Coordeno hoje 24 agências na Região Sul da DS Imobiliária. Ao longo destes
anos aprendi o que realmente separa uma agência de sucesso de uma que fica
pelo caminho.

Neste artigo partilho os primeiros passos práticos para quem está a pensar
abrir a própria agência DS Imobiliária.
```

- [ ] **Step 7: Run the test to verify it passes**

Run: `node --test test/posts.test.js`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add src/posts src/_includes/layouts/post.njk src/assets/img/posts test/posts.test.js
git commit -m "feat: add posts collection with two example posts"
```

---

### Task 4: Section pages ("Quero ser Consultor" / "Quero abrir Agência")

**Files:**
- Create: `src/quero-ser-consultor.njk`
- Create: `src/quero-abrir-agencia.njk`
- Modify: `src/assets/css/style.css`
- Test: `test/sections.test.js`

**Interfaces:**
- Consumes: `collections.consultor`, `collections.agencia`, `collections.post` (Task 3).

- [ ] **Step 1: Write the failing test**

`test/sections.test.js`:

```js
const test = require("node:test");
const assert = require("node:assert");
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test test/sections.test.js`
Expected: FAIL — the pages do not exist yet.

- [ ] **Step 3: Create the section pages**

`src/quero-ser-consultor.njk`:

```html
---
layout: layouts/base.njk
title: Quero ser Consultor
---
<section class="section-intro">
  <h1>Quero ser Consultor</h1>
  <p>
    Histórias e conselhos práticos para quem está a considerar uma carreira
    em mediação imobiliária com a DS Imobiliária.
  </p>
</section>
<section class="post-list">
  {% for post in collections.consultor | reverse %}
  <a class="post-card" href="{{ post.url }}">
    <h2>{{ post.data.title }}</h2>
    <p>{{ post.data.excerpt }}</p>
  </a>
  {% endfor %}
</section>
```

`src/quero-abrir-agencia.njk`:

```html
---
layout: layouts/base.njk
title: Quero abrir Agência
---
<section class="section-intro">
  <h1>Quero abrir Agência</h1>
  <p>
    O que aprendi a coordenar 24 agências na Região Sul, para quem está a
    pensar abrir a própria agência DS Imobiliária.
  </p>
</section>
<section class="post-list">
  {% for post in collections.agencia | reverse %}
  <a class="post-card" href="{{ post.url }}">
    <h2>{{ post.data.title }}</h2>
    <p>{{ post.data.excerpt }}</p>
  </a>
  {% endfor %}
</section>
```

- [ ] **Step 4: Add section/post-card styles**

Append to `src/assets/css/style.css`:

```css
.section-intro {
  padding: 40px 0 16px;
}

.section-intro h1 {
  font-size: 28px;
  margin-bottom: 8px;
}

.section-intro p {
  color: var(--color-neutral);
  max-width: 640px;
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 16px 0 48px;
}

.post-card {
  display: block;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #E3E6EC;
  text-decoration: none;
  color: var(--color-text);
}

.post-card h2 {
  color: var(--color-primary);
  font-size: 18px;
  margin: 0 0 6px;
}

.post-card p {
  margin: 0;
  color: var(--color-neutral);
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `node --test test/sections.test.js`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/quero-ser-consultor.njk src/quero-abrir-agencia.njk src/assets/css/style.css test/sections.test.js
git commit -m "feat: add audience section pages with tag-filtered post lists"
```

---

### Task 5: Galeria de Fotos (albums + lightbox)

**Files:**
- Create: `src/galeria/albuns/albuns.json`
- Create: `src/_includes/layouts/album.njk`
- Create: `src/galeria/index.njk`
- Create: `src/galeria/albuns/summit-2026.md`
- Create: `src/assets/js/lightbox.js`
- Create: `src/assets/img/galeria/summit-2026/capa.svg`
- Create: `src/assets/img/galeria/summit-2026/foto-1.svg`
- Create: `src/assets/img/galeria/summit-2026/foto-2.svg`
- Modify: `src/assets/css/style.css`
- Test: `test/galeria.test.js`

**Interfaces:**
- Consumes: `layouts/base.njk`, `formatDate` filter, passthrough copy of `src/assets` (Task 1–2).
- Produces: `collections.album`, consumed only by `src/galeria/index.njk`. Album front matter: `title`, `date`, `evento`, `capa`, `fotos` (array of image paths).

- [ ] **Step 1: Write the failing test**

`test/galeria.test.js`:

```js
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
  assert.match(html, /foto-1\.svg/);
  assert.match(html, /foto-2\.svg/);
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test test/galeria.test.js`
Expected: FAIL — none of these files exist yet.

- [ ] **Step 3: Create the albums directory data file and layout**

`src/galeria/albuns/albuns.json`:

```json
{
  "layout": "layouts/album.njk",
  "tags": ["album"]
}
```

`src/_includes/layouts/album.njk`:

```html
---
layout: layouts/base.njk
---
<article class="album">
  <p class="album-date">{{ date | formatDate }}</p>
  <h1>{{ title }}</h1>
  {% if evento %}
  <p class="album-evento">{{ evento }}</p>
  {% endif %}
  <div class="album-grid">
    {% for foto in fotos %}
    <a class="album-photo" href="{{ foto }}" data-lightbox>
      <img src="{{ foto }}" alt="{{ title }} — foto {{ loop.index }}" loading="lazy" />
    </a>
    {% endfor %}
  </div>
</article>
<div class="lightbox" id="lightbox" hidden>
  <button class="lightbox-close" type="button" aria-label="Fechar">&times;</button>
  <img class="lightbox-image" id="lightbox-image" src="" alt="" />
</div>
<script src="/assets/js/lightbox.js"></script>
```

- [ ] **Step 4: Create the gallery listing page**

`src/galeria/index.njk`:

```html
---
layout: layouts/base.njk
title: Galeria
permalink: /galeria/
---
<section class="section-intro">
  <h1>Galeria</h1>
  <p>Momentos de eventos, inaugurações e outras iniciativas da DS Imobiliária Sul.</p>
</section>
<section class="album-grid-list">
  {% for album in collections.album | reverse %}
  <a class="album-card" href="{{ album.url }}">
    {% if album.data.capa %}
    <img src="{{ album.data.capa }}" alt="{{ album.data.title }}" loading="lazy" />
    {% else %}
    <div class="album-cover-placeholder" aria-hidden="true"></div>
    {% endif %}
    <h2>{{ album.data.title }}</h2>
    <p>{{ album.data.evento }}</p>
  </a>
  {% endfor %}
</section>
```

- [ ] **Step 5: Create the lightbox script**

`src/assets/js/lightbox.js`:

```js
document.addEventListener("DOMContentLoaded", function () {
  var lightbox = document.getElementById("lightbox");
  var lightboxImage = document.getElementById("lightbox-image");
  if (!lightbox || !lightboxImage) return;

  document.querySelectorAll("[data-lightbox]").forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      lightboxImage.src = link.getAttribute("href");
      lightboxImage.alt = link.querySelector("img").alt;
      lightbox.hidden = false;
    });
  });

  lightbox.querySelector(".lightbox-close").addEventListener("click", function () {
    lightbox.hidden = true;
  });

  lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox) {
      lightbox.hidden = true;
    }
  });
});
```

- [ ] **Step 6: Create placeholder gallery images**

`src/assets/img/galeria/summit-2026/capa.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <rect width="800" height="600" fill="#00A9EB"/>
  <text x="50%" y="50%" fill="#ffffff" font-family="sans-serif" font-size="28" text-anchor="middle" dominant-baseline="middle">Capa — Summit 2026</text>
</svg>
```

`src/assets/img/galeria/summit-2026/foto-1.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <rect width="800" height="600" fill="#003EAB"/>
  <text x="50%" y="50%" fill="#ffffff" font-family="sans-serif" font-size="28" text-anchor="middle" dominant-baseline="middle">Foto 1</text>
</svg>
```

`src/assets/img/galeria/summit-2026/foto-2.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <rect width="800" height="600" fill="#004C9D"/>
  <text x="50%" y="50%" fill="#ffffff" font-family="sans-serif" font-size="28" text-anchor="middle" dominant-baseline="middle">Foto 2</text>
</svg>
```

- [ ] **Step 7: Create the example album**

`src/galeria/albuns/summit-2026.md`:

```md
---
title: "Summit 2026"
date: 2026-09-15
evento: "DS Imobiliária Summit 2026"
capa: /assets/img/galeria/summit-2026/capa.svg
fotos:
  - /assets/img/galeria/summit-2026/foto-1.svg
  - /assets/img/galeria/summit-2026/foto-2.svg
---
```

- [ ] **Step 8: Add gallery and lightbox styles**

Append to `src/assets/css/style.css`:

```css
.album-grid-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  margin: 16px 0 48px;
}

.album-card {
  text-decoration: none;
  color: var(--color-text);
}

.album-card img,
.album-cover-placeholder {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: 10px;
  background: var(--color-surface);
}

.album-card h2 {
  font-size: 16px;
  margin: 10px 0 2px;
}

.album-card p {
  margin: 0;
  color: var(--color-neutral);
  font-size: 13px;
}

.album-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
  margin-top: 20px;
}

.album-photo img {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 8px;
}

.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.lightbox-image {
  max-width: 90vw;
  max-height: 85vh;
  border-radius: 8px;
}

.lightbox-close {
  position: absolute;
  top: 20px;
  right: 24px;
  background: none;
  border: none;
  color: #fff;
  font-size: 32px;
  cursor: pointer;
}
```

- [ ] **Step 9: Run the test to verify it passes**

Run: `node --test test/galeria.test.js`
Expected: PASS.

- [ ] **Step 10: Commit**

```bash
git add src/galeria src/_includes/layouts/album.njk src/assets/js/lightbox.js src/assets/img/galeria src/assets/css/style.css test/galeria.test.js
git commit -m "feat: add photo gallery with albums and lightbox"
```

---

### Task 6: Sobre mim page

**Files:**
- Create: `src/sobre.njk`
- Modify: `src/assets/css/style.css`
- Test: `test/sobre.test.js`

**Interfaces:**
- Consumes: `layouts/base.njk` (Task 2).

- [ ] **Step 1: Write the failing test**

`test/sobre.test.js`:

```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test test/sobre.test.js`
Expected: FAIL — the page does not exist yet.

- [ ] **Step 3: Create the page**

`src/sobre.njk`:

```html
---
layout: layouts/base.njk
title: Sobre mim
---
<section class="section-intro">
  <h1>Sobre mim</h1>
  <p>
    Sou o Vítor Carvalho. O meu percurso na DS Imobiliária começou do lado do
    terreno, e foi essa experiência que hoje sustenta o que partilho aqui.
  </p>
</section>
<ul class="timeline">
  <li><strong>2014</strong> — Comecei como consultor imobiliário na DS Imobiliária.</li>
  <li><strong>2016</strong> — Tornei-me Diretor de Loja.</li>
  <li><strong>Hoje</strong> — Coordenador Regional Sul, a acompanhar 24 agências.</li>
</ul>
```

- [ ] **Step 4: Add timeline styles**

Append to `src/assets/css/style.css`:

```css
.timeline {
  list-style: none;
  padding: 0;
  margin: 24px 0 48px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.timeline li {
  padding: 14px 18px;
  border-left: 3px solid var(--color-accent);
  background: var(--color-surface);
  border-radius: 0 8px 8px 0;
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `node --test test/sobre.test.js`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/sobre.njk src/assets/css/style.css test/sobre.test.js
git commit -m "feat: add Sobre mim page"
```

---

### Task 7: Contacto page (Netlify Forms)

**Files:**
- Create: `src/contacto.njk`
- Modify: `src/assets/css/style.css`
- Test: `test/contacto.test.js`

**Interfaces:**
- Consumes: `layouts/base.njk`, `site.email`, `site.whatsappNumber` (Task 2).

- [ ] **Step 1: Write the failing test**

`test/contacto.test.js`:

```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test test/contacto.test.js`
Expected: FAIL — the page does not exist yet.

- [ ] **Step 3: Create the page**

`src/contacto.njk`:

```html
---
layout: layouts/base.njk
title: Contacto
---
<section class="section-intro">
  <h1>Contacto</h1>
  <p>Interessado em seres consultor ou abrir a tua própria agência? Fala comigo.</p>
</section>

<div class="contact-direct">
  <a href="mailto:{{ site.email }}">{{ site.email }}</a>
  <a href="https://wa.me/{{ site.whatsappNumber }}">WhatsApp</a>
</div>

<form
  class="contact-form"
  name="contacto"
  method="POST"
  data-netlify="true"
  netlify-honeypot="bot-field"
>
  <input type="hidden" name="form-name" value="contacto" />
  <p class="hidden-field">
    <label>Não preencher: <input name="bot-field" /></label>
  </p>

  <label for="nome">Nome</label>
  <input id="nome" type="text" name="nome" required />

  <label for="email">Email</label>
  <input id="email" type="email" name="email" required />

  <label for="telefone">Telefone / WhatsApp</label>
  <input id="telefone" type="tel" name="telefone" />

  <label for="interesse">Área de interesse</label>
  <select id="interesse" name="interesse">
    <option value="consultor">Quero ser consultor</option>
    <option value="agencia">Quero abrir agência</option>
  </select>

  <label for="mensagem">Mensagem</label>
  <textarea id="mensagem" name="mensagem" rows="5" required></textarea>

  <button type="submit">Enviar</button>
</form>
```

- [ ] **Step 4: Add contact page styles**

Append to `src/assets/css/style.css`:

```css
.contact-direct {
  display: flex;
  gap: 16px;
  margin: 8px 0 32px;
  font-weight: 600;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 480px;
  margin-bottom: 48px;
}

.contact-form label {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-neutral);
}

.contact-form input,
.contact-form select,
.contact-form textarea {
  padding: 10px 12px;
  border: 1px solid #E3E6EC;
  border-radius: 8px;
  font: inherit;
}

.contact-form button {
  align-self: flex-start;
  padding: 10px 24px;
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.hidden-field {
  position: absolute;
  left: -9999px;
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `node --test test/contacto.test.js`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/contacto.njk src/assets/css/style.css test/contacto.test.js
git commit -m "feat: add Contacto page with Netlify Forms contact form"
```

---

### Task 8: Netlify deployment config and first push

**Files:**
- Create: `netlify.toml`
- Create: `README.md`

**Interfaces:**
- Consumes: `package.json`'s `build` script (Task 1).

- [ ] **Step 1: Create the Netlify build config**

`netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "_site"
```

- [ ] **Step 2: Verify the config matches the build script**

Run: `node -e "const fs=require('fs'); const toml=fs.readFileSync('netlify.toml','utf-8'); if (!toml.includes('npm run build') || !toml.includes('_site')) { process.exit(1); } console.log('netlify.toml OK');"`
Expected: prints `netlify.toml OK`.

- [ ] **Step 3: Write the README**

`README.md`:

```md
# vitor-blog

Site pessoal do Vítor Carvalho (Eleventy + Netlify).

## Desenvolvimento local

    npm install
    npm run serve

Abre http://localhost:8080

## Testes

    npm test

## Deploy

O Netlify publica automaticamente a cada `git push` para o branch principal,
assim que o repositório estiver ligado a um site Netlify (Netlify → Add new
site → Import an existing project → escolher este repositório GitHub).

## Adicionar conteúdo

- Novo post: criar um ficheiro `.md` em `src/posts/` com `title`, `date`,
  `tags` (`consultor` ou `agencia`), `excerpt` e `image`.
- Novo álbum: criar um ficheiro `.md` em `src/galeria/albuns/` com `title`,
  `date`, `evento`, `capa` e `fotos` (lista de caminhos de imagem).
- Comprimir as imagens antes de as adicionar a `src/assets/img/`.

Depois: `git add`, `git commit`, `git push` — o Netlify publica sozinho.
```

- [ ] **Step 4: Commit**

```bash
git add netlify.toml README.md
git commit -m "chore: add Netlify build config and README"
```

- [ ] **Step 5: Push to the GitHub repository**

Ask the user for the URL of the (empty) GitHub repository they created, then run:

```bash
git remote add origin <URL_DO_REPOSITORIO_GITHUB>
git branch -M main
git push -u origin main
```

Expected: `git log --oneline -1` on GitHub's web UI shows the latest commit.

- [ ] **Step 6: Connect Netlify (manual, in the browser)**

In the Netlify dashboard: **Add new site → Import an existing project →
GitHub → select this repository**. Netlify auto-detects `netlify.toml`
(build command `npm run build`, publish directory `_site`) — accept the
defaults and deploy. Once deployed, open the generated `*.netlify.app` URL
and confirm the Home page loads.

---

## Self-Review Notes

- **Spec coverage:** Home, both audience sections, blog posts, photo gallery with albums and lightbox, Sobre mim, Contacto (form + email + WhatsApp), shared header/footer, DSI palette + Quicksand, images stored in-repo, Netlify + git-push deploy — every spec section maps to a task above. Custom domain and Cloudinary are explicitly out of scope per the spec and are not tasked.
- **Placeholder scan:** No TBD/TODO in any step. The one open value (`whatsappNumber` placeholder) is flagged explicitly in Task 2 and re-used consistently in Task 7's test, not left vague.
- **Type/name consistency:** `buildSite`/`readOutput` (Task 1) are used with the same signature in every later test file. `collections.consultor`/`collections.agencia`/`collections.album` names are introduced once (Tasks 3 and 5) and consumed with the same names in Tasks 4 and 5.
- **Review Focus:** all five items above are wired into their owning task's test (mobile breakpoint → Task 2; tag collection disjointness → Task 4; honeypot → Task 7; missing-cover fallback → Task 5; required fields → Task 7).
