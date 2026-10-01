// Página A Jornada. Textos: documento 02, Parte 5 (v1.10).
// Primeira versão SEM valores (Filipe, 30/09). Ordem crescente: Mensagem, sessão, Jornada.
// A Mensagem é descrita pelo que aparece, nunca como tratamento, harmonização ou reprogramação.
import { botaoConversar, jsonldBase, breadcrumb, esc } from '../scripts/partes.mjs';

export default function aJornada({ cfg, L }) {
  const base = jsonldBase(cfg);
  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [base.servico, base.person, breadcrumb(cfg, [['Início', '/'], ['A Jornada', '/a-jornada']])],
  };

  const conteudo = `
  <section class="secao" aria-labelledby="h1">
    <div class="secao__dentro">
      <h1 class="hero-titulo" id="h1" style="max-width:20ch;margin-bottom:var(--espaco-5)">Uma jornada para aprofundar a transformação</h1>

      <div class="ofertas">
        <article class="cartao oferta" aria-labelledby="mensagem">
          <h2 class="oferta__nome" id="mensagem">Mensagem</h2>
          <hr class="oferta__linha">
          <p>Uma mensagem curta, de até cinco minutos, enviada em áudio.</p>
          <p>Você não precisa marcar horário nem estar presente. Envia seu nome completo e sua data de nascimento, e eu devolvo o que aparecer para você naquele momento.</p>
          <p>É para quando você busca uma luz, uma orientação, uma resposta.</p>
          <p>É uma entrega única: você envia os dados, eu envio o áudio. Se depois disso você quiser aprofundar, o caminho é a sessão.</p>
          <p class="oferta__prazo">${esc(cfg.mensagemPrazo)}</p>
          <p class="oferta__nota">A Mensagem aponta. A sessão trabalha. São experiências e profundidades diferentes.</p>
          ${botaoConversar(L, { texto: 'Pedir uma Mensagem', href: L.whatsappMensagem, evento: 'pedir-mensagem' })}
        </article>

        <article class="cartao oferta" aria-labelledby="sessao">
          <h2 class="oferta__nome" id="sessao">Sessão individual</h2>
          <hr class="oferta__linha">
          <p>Um encontro de aproximadamente uma hora, por videochamada.</p>
          <p>Você pode viver a experiência de forma independente, sem compromisso de continuidade. Não precisa preparar nada, não precisa chegar com um problema definido, não precisa contar sua história.</p>
          <p>Nos primeiros minutos eu explico como vai ser. Depois a leitura flui: eu vou traduzindo em voz alta o que aparece, e você recebe. Quando possível, abro espaço para uma pergunta.</p>
          <p>Já no primeiro encontro pode começar a surgir clareza sobre o que está acontecendo, durante ou depois da sessão.</p>
        </article>

        <article class="cartao oferta" aria-labelledby="jornada">
          <h2 class="oferta__nome" id="jornada">A Jornada</h2>
          <hr class="oferta__linha">
          <p>Dez sessões de aproximadamente uma hora, uma por semana.</p>
          <p>É a forma recomendada para quem deseja aprofundar o processo, permitindo que o trabalho se desenvolva ao longo do tempo e que diferentes camadas sejam acessadas e trabalhadas progressivamente.</p>
          <p class="oferta__prazo">Os horários de jornada são limitados, porque cada jornada ocupa um mesmo horário durante dez semanas.</p>
        </article>
      </div>
    </div>
  </section>

  <section class="secao secao--areia" aria-labelledby="desenvolve">
    <div class="secao__dentro secao__texto">
      <h2 class="titulo" id="desenvolve">Como a jornada se desenvolve</h2>
      <div class="etapa-jornada">
        <h3 class="subtitulo">Primeiras três ou quatro sessões</h3>
        <p>O processo começa de forma aberta, sem que você precise trazer um tema. Essas sessões permitem uma organização mais ampla, deixando que o próprio processo revele o que precisa ser trabalhado.</p>
      </div>
      <div class="etapa-jornada">
        <h3 class="subtitulo">Sessões seguintes</h3>
        <p>A partir daí, caso faça sentido, você pode trazer um tema amplo para aprofundamento: relacionamentos, trabalho, família, prosperidade, autoestima ou outro aspecto importante da sua vida.</p>
      </div>
    </div>
  </section>

  <section class="secao" aria-labelledby="distincao">
    <div class="secao__dentro secao__texto">
      <h2 class="subtitulo destaque" id="distincao">Uma distinção importante</h2>
      <p class="titulo" style="margin-bottom:var(--espaco-4)">Você pode trazer um tema. Não precisa trazer uma história.</p>
      <p>Não é necessário narrar o que aconteceu, explicar o contexto ou detalhar a situação. Basta indicar o território. O processo conduz o restante.</p>
    </div>
  </section>

  <section class="secao" data-tema="indigo" aria-labelledby="busca">
    <div class="secao__dentro secao__texto">
      <h2 class="titulo" id="busca">O que a jornada busca</h2>
      <p>Mais consciência sobre si. Clareza sobre padrões que vinham se repetindo. Novas perspectivas sobre situações da vida. Orientação. Movimento onde havia estagnação. E o trabalho energético voltado à transformação daquilo que se revela.</p>
      <p class="fecho">A jornada não busca criar uma nova versão de você. Busca trabalhar aquilo que está impedindo que a sua própria vida flua com mais harmonia.</p>
    </div>
  </section>

  <section class="secao" aria-labelledby="comecar">
    <div class="secao__dentro secao__texto">
      <h2 class="titulo" id="comecar">Como começar</h2>
      <p>Você pode começar por uma Mensagem, por uma sessão individual, ou conversando comigo sobre a jornada.</p>
      <p style="margin-top:var(--espaco-4)">${botaoConversar(L, { evento: 'quero-conversar-jornada' })}</p>
    </div>
  </section>`;

  return {
    caminho: '/a-jornada',
    arquivo: 'a-jornada.html',
    atual: 'jornada',
    titulo: 'Leitura energética: formatos e como começar | Harmonização Humana',
    descricao: 'Leitura energética em três formatos: Mensagem em áudio, sessão individual por videochamada e Jornada de dez sessões. Como funciona e como começar.',
    jsonld,
    conteudo,
  };
}
