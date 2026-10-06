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
| Link do guia de uma live | sozinho: o link do PDF na descrição do vídeo (linha com "guia"). Para forçar: `data/guias.json` |
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
ou print (`imagem`), e a transcrição completa. Vídeo: a capa vai em `src/img/depoimentos/` (vertical, 480 e 720 px
de largura) e entra em `imagem`/`miniatura`. Sem capa, o site baixa a do YouTube ao montar (pode vir um quadro do
vídeo em vez da capa escolhida; por isso a capa própria é o caminho certo). O print vai como veio, sem edição.

## Para fazer depois (TODO)

- Modo noite desenhado (índigo como fundo, ouro como luz). Hoje o site é sempre claro, de propósito,
  mesmo com o aparelho no modo escuro (`color-scheme: light`).
- Ligar o domínio harmonizacaohumana.com.br e o redirecionamento do leituraenergetica.com.br.
- Lives: confirmar que a tarefa diária encontra a playlist (o feed do YouTube dá 404 com estes IDs; o script lê a página da playlist).
- Google Search Console e Bing Webmaster Tools, com o sitemap.
- Imagens: foto real para a trajetória no Sobre e foto de corpo inteiro em alta resolução (ver `docs/imagens-a-gerar.md`).
- Versão de teste com mais respiro, em branch separado (a faixa de palavras já saiu).
- Atualizar o Design System com as escolhas finais do site.

## Apresentação em PDF

`harmonizacaohumana.com.br/harmonizacao-humana-apresentacao.pdf` (arquivo `src/harmonizacao-humana-apresentacao.pdf`,
sem link no site, para enviar). O texto vem do documento 02 com as regras de linguagem e os textos já revisados do
site. Para refazer: `node scripts/apresentacao.mjs` gera `docs/apresentacao/apresentacao.html`; abra no Chrome,
Imprimir → Salvar como PDF, A4, sem margens, com gráficos de fundo.

## Textos

Texto revisado pelo Filipe só muda com aprovação dele. Histórico: `docs/historico-de-textos.md`.

## Imagem de compartilhamento

Ativa: `src/img/compartilhamento.jpg` (versão Solar, retrato no sol). Alternativa guardada:
`src/img/compartilhamento-foto.jpg` (foto à direita). Para trocar, copie a alternativa por cima da ativa
e aumente o `?v=` do `og:image` em `scripts/partes.mjs` (o WhatsApp guarda a imagem antiga).
