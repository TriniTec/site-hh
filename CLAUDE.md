# Site da Harmonização Humana · orientações

## Regra de ouro dos textos

**Texto que o Filipe já revisou não muda sem ele pedir.** Se surgir uma sugestão de mudança num texto
já revisado, mostrar o antes e o depois e esperar a aprovação; só então implementar. Toda mudança de texto
fica registrada em `docs/historico-de-textos.md` (data, onde, antes, depois, quem pediu).

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

WhatsApp: todo link (no site e fora dele) é whatsapp.harmonizacaohumana.com.br/<origem>, nunca wa.me direto.
Mensagens e origens em site.config.json; mensagem nova ou alterada passa pela regra de ouro dos textos.
Ao mudar, atualizar também a página do mapa (artifact https://claude.ai/artifact/LT4bHRpJ5iJhwrQgn2p1SM),
gerada por scripts/mapa-whatsapp.mjs.

Como mexer no site: ver README.md.
