# Site da Harmonização Humana

harmonizacaohumana.com.br · site estático, sem mensalidade, publicado no Netlify.

Referências: documento 02 (briefing e textos, v1.10), documento 06 (identidade visual) e o
[Design System](https://claude.ai/artifact/7YVsRVReoy3F5L5yWbi4gg).

## Onde mexer

| Quero mudar… | Arquivo |
| --- | --- |
| Número ou textos do WhatsApp (geral, Mensagem, sessão, Jornada) | `site.config.json` → `whatsapp` |
| Prazo da Mensagem | `site.config.json` → `mensagemPrazo` |
| Estatística (Umami, sem cookies) | `site.config.json` → `umamiWebsiteId` |
| Depoimentos | `data/depoimentos.json` (imagens em `src/img/depoimentos/`) |
| Link do guia de uma live | `data/guias.json` → `{ "ID_DO_VIDEO": "https://…" }` |
| Textos das páginas | `paginas/inicio.mjs`, `paginas/a-jornada.mjs`, `paginas/sobre.mjs` |
| Cores, tamanhos, espaços | `src/css/site.css` |

As três últimas lives (`data/lives.json`) se atualizam sozinhas: o GitHub roda
`scripts/atualizar-lives.mjs` todo dia às 8h e só publica quando entrou live nova.

## Rodar no computador

```sh
node scripts/build.mjs     # monta o site em dist/ e lista o que falta preencher
node scripts/serve.mjs     # http://localhost:8080
```

Precisa só do Node 22. Não há dependências para instalar.

## Estrutura

```
site.config.json        valores únicos (WhatsApp, links, botão, Umami)
paginas/                as três páginas (texto em HTML)
scripts/partes.mjs      topo, rodapé, <head>, dados estruturados
scripts/build.mjs       monta dist/ + sitemap.xml, robots.txt, llms.txt, 404
scripts/atualizar-lives.mjs   tarefa diária das lives
data/                   depoimentos, lives, guias
src/                    fontes WOFF2, imagens, CSS, JS, favicons (copiados como estão)
netlify.toml            build e cabeçalhos do Netlify
```

## Depoimentos

`data/depoimentos.json`: nome, trecho em destaque (palavras exatas da transcrição), vídeo (`videoId` do YouTube)
ou print (`imagem`), e a transcrição completa. As miniaturas dos vídeos são baixadas do YouTube na hora de
montar o site (no Netlify) e servidas pelo próprio site. O print vai como veio, sem edição.

## Para fazer depois (TODO)

- Modo noite desenhado (índigo como fundo, ouro como luz). Hoje o site é sempre claro, de propósito,
  mesmo com o aparelho no modo escuro (`color-scheme: light`).
- Ligar o domínio harmonizacaohumana.com.br e o redirecionamento do leituraenergetica.com.br.
- Levar a versão Solar para o branch `main` e trocar o branch no Netlify (a tarefa das lives roda no `main`).
- Conferir o endereço completo da playlist das lives (`playlistLives`).
- Google Search Console e Bing Webmaster Tools, com o sitemap.
- Imagens: foto real para a trajetória no Sobre e foto de corpo inteiro em alta resolução (ver `docs/imagens-a-gerar.md`).
- Versão de teste com mais respiro (sem a faixa de palavras), em branch separado.
- PDF de apresentação com o texto longo do documento 02.
- Atualizar o Design System com as escolhas finais do site.

## Testes rápidos

- `?letreiro=nao` esconde a faixa de palavras da Home (vale até fechar a aba); `?letreiro=sim` volta.

## Imagem de compartilhamento

Ativa: `src/img/compartilhamento.jpg` (versão Solar, retrato no sol). Alternativa guardada:
`src/img/compartilhamento-foto.jpg` (foto à direita). Para trocar, copie a alternativa por cima da ativa
e aumente o `?v=` do `og:image` em `scripts/partes.mjs` (o WhatsApp guarda a imagem antiga).
