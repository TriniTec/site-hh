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

Publicação: o Netlify publica o branch `main` (harmonizacaohumana.netlify.app; depois, harmonizacaohumana.com.br).
O trabalho segue no `main`. Até fechar a primeira versão, o `claude/site-solar` é mantido igual (cada envio
vai para os dois); depois de fechada, só o `main`.
A tarefa diária das lives faz commits no `main`: antes de enviar, trazer o `main` (pull/merge).
Imagens: quando uma parte pedir imagem nova, deixar o lugar reservado no site (`.imagem-reservada`) e
escrever o prompt em `docs/imagens-a-gerar.md`; o Filipe pede ao Aruan.

Como mexer no site: ver README.md.
