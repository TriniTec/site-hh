# Site da Harmonização Humana · orientações

Este arquivo é lido sozinho no começo de toda conversa sobre este repositório. Ele é o ponto de partida:
leia-o, e só abra outros arquivos quando a tarefa pedir. Com quem falar: o Filipe Morgado (dono do projeto),
sempre em português, em linguagem simples, sem jargão técnico, uma coisa de cada vez.

## O projeto em 1 minuto

- **O que é:** site da Harmonização Humana (leitura energética e transformação), de Filipe Morgado.
  No ar em https://harmonizacaohumana.com.br. Três páginas: Início, A Jornada (formatos: Mensagem, sessão
  individual e Jornada de 10 semanas) e Sobre. Versão visual "Solar". Versão 1 fechada em 06/10/2026.
- **Como funciona:** site estático, Node 22 sem dependências. `node scripts/build.mjs` monta `dist/` a partir de
  `paginas/*.mjs` (textos em HTML), `scripts/partes.mjs` (topo, rodapé, head) e `site.config.json`
  (valores únicos: WhatsApp, links, Umami). Estilo em `src/css/site.css`; comportamento em `src/js/site.js`.
- **Publicação:** o Netlify publica o `main` a cada envio (projeto "harmonizacaohumana"). DNS no Registro.br.
  leituraenergetica.com.br (com e sem www) redireciona para o domínio principal (`netlify.toml`).
- **Automático (GitHub Actions):** "Atualizar lives" (todo dia 8h, e na quinta também às 17h): as 3 últimas lives
  que já aconteceram, da playlist PLQbbN3rDJtEM, na ordem da playlist, com data da transmissão, guia em PDF lido
  da descrição do vídeo e miniatura baixada de novo todo dia; os episódios da página dos guias,
  `data/episodios.json`, com um resumo automático tirado da descrição inteira, que é só proteção até a sessão do
  site escrever o dela (ver "Resumo de cada live", abaixo); e a live agendada da semana, lida da aba "Ao vivo" do
  canal, em `data/live-agendada.json`. A live que ainda vai acontecer não ganha card, mesmo depois de entrar na
  playlist (decisão do Filipe na unificação do Ep 10: o site mostra o que a pessoa pode ver agora). No horário
  dela, de 10 minutos antes do início até 90 minutos depois, todas as páginas mostram no alto a faixa "Ao vivo
  agora", com o link da live; quem decide se ela aparece é o `site.js`, pelo relógio de quem visita. A hora vem
  do YouTube, nunca fixa no código: mudou o horário da live, o site acompanha na execução seguinte. Manuais:
  "Conferir texto no ar", "Conferir links do WhatsApp", "Teste de velocidade" (relatório em `docs/velocidade.md`).
- **WhatsApp:** função do Netlify em `netlify/edge-functions/whatsapp/`, no subdomínio
  whatsapp.harmonizacaohumana.com.br (ver a seção WhatsApp abaixo e o README).
- **Estatística:** Umami, sem cookies (cliques nos botões e acessos a cada link de WhatsApp como eventos).
- **Busca:** Google Search Console (propriedade de domínio) e Bing com o sitemap enviado (12/10/2026).
- **Design System** (cores, fontes, componentes, regras de linguagem):
  https://claude.ai/artifact/7YVsRVReoy3F5L5yWbi4gg. Quando o site e ele divergirem, o site vale e o DS é atualizado.
- **Pendências:** lista "Para fazer depois" no README (PDF de apresentação esperando revisão do Filipe, fotos
  para o Aruan, versão com mais respiro, modo noite).

## Como trabalhar

- Antes de mexer: `git pull origin main` (a tarefa das lives faz commits sozinha). Envie só para o `main`.
- Teste local: `node scripts/build.mjs` e `node scripts/serve.mjs` (http://localhost:8080). Este ambiente não
  abre o site no ar nem o YouTube: para conferir o que está publicado, rode no GitHub as tarefas "Conferir…".
- Mudança pequena e direta: faça, confira, envie e diga em poucas linhas o que mudou. Texto novo ou mudança em
  texto revisado: mostre antes e depois e espere o "pode" do Filipe.
- Commits em português, descrevendo o que muda para quem usa o site.

## Regra de ouro dos textos

**Texto que o Filipe já revisou não muda sem ele pedir.** Se surgir uma sugestão de mudança num texto
já revisado, mostrar o antes e o depois e esperar a aprovação; só então implementar. Toda mudança de texto
fica registrada em `docs/historico-de-textos.md` (data, onde, antes, depois, quem pediu).

## Resumo de cada live (página dos guias)

O resumo de cada episódio em `/ao-vivo/guias` é escrito pela sessão do site, no campo `resumo` de
`data/episodios.json`, que prevalece sobre o automático (`resumoYoutube`, que a ação "Atualizar lives" refaz
todo dia e só aparece enquanto o `resumo` está vazio). Ele nasce na sessão do episódio, a que a gerente do
pós-live abre com "Ep NN no site: guia e temas.", depois que a ação trouxe o episódio com o guia:

- **Ler a descrição do vídeo inteira**, não só as primeiras linhas, e escrever a versão do site em um parágrafo.
  Numa live com mensagem espiritual, a descrição começa por uma linha da mensagem com o minuto em que ela começa
  e por um parágrafo dela; a leitura vem depois. O resumo fala das duas. Porquê: o Filipe pediu (unificação do
  Ep 10) que o resumo não se prenda ao topo, que numa live com mensagem é só a mensagem.
- **Sem o minuto do vídeo** ("A mensagem começa em 10:02") e sem o que só faz sentido no YouTube (capítulos, o
  aviso do vídeo só da mensagem). Do tamanho dos outros resumos da página (até umas 460 letras), com as regras de
  linguagem abaixo e só o que a descrição diz, sem acrescentar.
- É texto novo: vai ao Filipe (pelo relatório à gerente) com o texto proposto, e entra no `main` depois do
  "pode" dele, registrado em `docs/historico-de-textos.md`. Até lá a página mostra o automático, e o guia e os
  temas não esperam pelo resumo.

## Regras de linguagem do Filipe, para todo texto do site

- **Nunca "sou Filipe" / "eu sou o Filipe".** Sempre "meu nome é Filipe" (ex.: "Oi, meu nome é Filipe.").
- Não começar frase com pronome oblíquo átono ("Me vejo", "Me conta", "Te"). Reescrever a frase.
- Perguntar em vez de condicionar quando for convite ("Alguma delas é sua?" em vez de "Se uma delas é sua").
- Sem travessão no meio de frase. Sem emoji no texto do site (nos depoimentos, as palavras das pessoas vão exatamente como estão).
- Nenhuma promessa de resultado: ao falar do trabalho energético, manter "buscando" (buscando dissolver, transmutar…).
- A Mensagem é descrita pelo que aparece, nunca como tratamento ou harmonização: "A Mensagem aponta. A sessão trabalha."
- O aviso de saúde no rodapé não sai.
- Falando direto com a pessoa, preferir o feminino ("sozinha") sem deixar o texto todo no feminino; forma sem gênero quando funcionar tão bem.

Publicação: o Netlify publica o branch `main` em harmonizacaohumana.com.br.
A primeira versão fechou em 06/10/2026. Daqui em diante o trabalho vai só para o `main`
(o `claude/site-solar` ficou parado como registro da versão 1).
A tarefa diária das lives faz commits no `main`: antes de enviar, trazer o `main` (pull/merge).
Imagens: quando uma parte pedir imagem nova, deixar o lugar reservado no site (`.imagem-reservada`) e
escrever o prompt em `docs/imagens-a-gerar.md`; o Filipe pede ao Aruan.

WhatsApp: todo link (no site e fora dele) é whatsapp.harmonizacaohumana.com.br/<origem>, nunca wa.me direto. Única exceção: o perfil da empresa no Google Maps, que recusa o nosso endereço; lá vai o wa.me com o número e a mensagem da origem "maps".
Mensagens e origens em site.config.json; mensagem nova ou alterada passa pela regra de ouro dos textos.
REGRA FIXA: toda vez que um link de WhatsApp for criado, editado ou removido (endereço, mensagem, sinal, onde usar),
o artifact do mapa (https://claude.ai/artifact/LT4bHRpJ5iJhwrQgn2p1SM) é atualizado na mesma hora, sem o Filipe pedir:
rodar `node scripts/mapa-whatsapp.mjs` e publicar `docs/links-whatsapp.html` nesse mesmo endereço com a ferramenta
Artifact (action publish, com url). A tarefa só termina depois disso, e a resposta ao Filipe confirma que o mapa foi atualizado.

Como mexer no site: ver README.md.
