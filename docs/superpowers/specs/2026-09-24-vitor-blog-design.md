# Site de opinião do Vítor Carvalho — Design

## Objetivo

Site pessoal do Vítor Carvalho (Coordenador Regional Sul da DS Imobiliária) para
atrair pessoas a tornarem-se consultores imobiliários ou a abrirem a própria
agência DS Imobiliária. É uma iniciativa pessoal do Vítor (opinião/thought
leadership), não uma comunicação institucional da marca — não exige aprovação
formal da marca, mas usa a identidade visual DSI para reforçar a ligação.

## Público-alvo

Dois públicos, com percursos de conteúdo distintos dentro do mesmo site:
- Pessoas a considerar mudar de carreira para mediação imobiliária ("Quero ser
  Consultor")
- Pessoas com experiência/capital que querem abrir a própria agência DSI
  ("Quero abrir Agência")

## Tom de voz

Mistura equilibrada: histórias pessoais e percurso do Vítor, combinadas com
dados/resultados concretos do modelo DSI.

## Arquitetura

- **Gerador de site estático**: Eleventy (11ty), JavaScript. Markdown +
  Nunjucks → HTML estático.
- **Alojamento**: Netlify, ligado a um repositório git para deploy automático
  a cada `push`. Subdomínio Netlify grátis para já (ex.
  `algo.netlify.app`); domínio próprio fica em aberto para decisão futura,
  sem implicar mudança de stack.
- **Formulário de contacto**: Netlify Forms (HTML puro, sem backend nem
  serviço externo).
- **Imagens**: guardadas no próprio repositório (`src/assets/img/`),
  comprimidas/otimizadas antes de cada commit. Sem serviço externo inicial;
  migração para Cloudinary (plano grátis) fica em aberto se o volume de fotos
  crescer muito.

Esta stack não cria vendor lock-in: conteúdo em Markdown é portável para
outro gerador, o alojamento pode mudar sem reescrever o site, e um domínio
próprio pode ser apontado a qualquer momento.

## Estrutura de conteúdo

- **Home** — quem és, proposta de valor, entrada para as duas secções.
- **Secção "Quero ser Consultor"** — intro própria + listagem de posts com a
  tag `consultor`.
- **Secção "Quero abrir Agência"** — intro própria + listagem de posts com a
  tag `agencia`.
- **Posts de blog** — coleção Eleventy, ficheiros Markdown com front matter
  (`title`, `date`, `tags`, `excerpt`, `image`). Cresce ao longo do tempo.
- **Galeria de Fotos** — nova coleção de **álbuns** (ex: Inauguração
  Covilhã, Summit 2026). Cada álbum: `title`, `date`, `evento`, `capa`, lista
  de fotos. Página de listagem de álbuns (grelha de capas) + página
  individual por álbum (grelha de fotos com lightbox).
- **Sobre mim** — percurso do Vítor.
- **Contacto** — formulário (Nome, Email, Telefone/WhatsApp, Área de
  interesse, Mensagem) + link de email direto + link de WhatsApp.
- Cabeçalho/rodapé consistentes (template partilhado) em todas as páginas.

## Visual

Paleta DSI oficial (#003EAB / #004C9D / #00A9EB / #555960) e tipografia
Quicksand, mas layout e composição próprios — não uma cópia do site
institucional da DSI.

## Fluxo de adição de conteúdo

Sempre que o Vítor quiser um novo post ou álbum: cria-se o ficheiro Markdown
correspondente (com as imagens já comprimidas), faz-se commit e push — o
Netlify publica automaticamente. Não precisa de CMS nem de intervenção fora
disto.

## Deployment — passo que depende do Vítor

Para o deploy automático funcionar é necessária uma conta GitHub e uma conta
Netlify pessoais do Vítor (ambas gratuitas) ligadas ao repositório. Não é
possível criar essas contas em nome dele. Até lá, o site é construído e
testado localmente (`npx @11ty/eleventy --serve`).

## Testes / verificação

- Build local (`eleventy --serve`) antes de cada push, para validar layout,
  navegação e responsividade (mobile + desktop).
- Depois do primeiro deploy: testar submissão do formulário de contacto e
  confirmar que os links de email/WhatsApp abrem corretamente.
- Verificar que a galeria carrega bem com várias fotos (performance/loading).

## Fora de âmbito (por agora)

- Domínio próprio (decisão futura, não bloqueia o lançamento).
- CMS visual para o Vítor editar sozinho — conteúdo passa sempre por aqui.
- Serviço externo de imagens (Cloudinary) — só se o repositório ficar pesado.
