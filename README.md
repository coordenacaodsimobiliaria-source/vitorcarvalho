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
