# Site da Harmonização Humana

harmonizacaohumana.com.br · site estático, sem mensalidade, publicado no Netlify.

Referências: documento 02 (briefing e textos, v1.10), documento 06 (identidade visual) e o
[Design System](https://claude.ai/artifact/7YVsRVReoy3F5L5yWbi4gg).

## Onde mexer

| Quero mudar… | Arquivo |
| --- | --- |
| Número ou texto do WhatsApp (todos os botões, rodapé e Pedir uma Mensagem) | `site.config.json` → `whatsapp` |
| Prazo da Mensagem | `site.config.json` → `mensagemPrazo` |
| Cor do botão Quero conversar | `site.config.json` → `botaoPrincipal` (`cheio`, `e`, `f`, `g`, `h`, `i`, `a`) |
| Estatística (Umami) | `site.config.json` → `umamiWebsiteId` |
| Depoimentos | `data/depoimentos.json` (imagens em `src/img/depoimentos/`) |
| Link do guia de uma live | `data/guias.json` → `{ "ID_DO_VIDEO": "https://…" }` |
| Textos das páginas | `paginas/inicio.mjs`, `paginas/a-jornada.mjs`, `paginas/sobre.mjs` |
| Cores, tamanhos, espaços | `src/css/site.css` |

As três últimas lives (`data/lives.json`) se atualizam sozinhas: o GitHub roda
`scripts/atualizar-lives.mjs` todo dia às 8h e só publica quando entrou live nova.

## Testar a cor do botão vendo a página inteira

Acrescente `?botao=` ao endereço: `/?botao=e`, `/?botao=f`, `/?botao=i`… A escolha vale
enquanto a aba estiver aberta, em todas as páginas. As opções são as do Design System
(C índigo, E laranja com branco, F com sombra índigo, G com contorno, H maior, I fundo claro com borda laranja, A laranja com índigo).

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
