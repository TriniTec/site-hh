// Página A Jornada · versão Solar. Sem valores (decisão do Filipe, 30/09).
// A Mensagem é descrita pelo que aparece, nunca como tratamento: "A Mensagem aponta. A sessão trabalha."
import { botaoConversar, jsonldBase, breadcrumb, esc, sol } from '../scripts/partes.mjs';

export default function aJornada({ cfg, L }) {
  const base = jsonldBase(cfg);
  const jsonld = { '@context': 'https://schema.org', '@graph': [base.servico, base.person, breadcrumb(cfg, [['Início', '/'], ['A Jornada', '/a-jornada']])] };

  const conteudo = `
  <section class="entrada">
    <div class="entrada__sol" aria-hidden="true">${sol({ id: 'e' })}</div>
    <div class="dentro">
      <p class="olho surge">Formatos</p>
      <h1 class="surge" style="--atraso:.08s">Escolha por onde <em class="laranja" style="font-style:normal">começar.</em></h1>
      <p class="lead surge" style="--atraso:.16s">Da mensagem curta à jornada de dez semanas. Todos começam do mesmo jeito: sem você precisar contar sua história.</p>

      <div class="formatos">
        <article class="formato surge" id="mensagem">
          <p class="formato__tag">Até 5 minutos · em áudio</p>
          <h2 style="font-size:2rem">Mensagem</h2>
          <p class="formato__para">Para quando você busca uma luz, uma orientação, uma resposta.</p>
          <p>Você envia seu nome completo e sua data de nascimento. Eu devolvo, em áudio, o que aparecer para você naquele momento. Sem horário marcado.</p>
          <p class="formato__prazo">${esc(cfg.mensagemPrazo)}</p>
          <p class="formato__nota">A Mensagem aponta. A sessão trabalha. São experiências e profundidades diferentes.</p>
          <p class="empurra">${botaoConversar(L, { texto: 'Pedir uma Mensagem', href: L.whatsappMensagem, evento: 'pedir-mensagem' })}</p>
        </article>
        <article class="formato surge" id="sessao" style="--atraso:.1s">
          <p class="formato__tag">Cerca de 1 hora · videochamada</p>
          <h2 style="font-size:2rem">Sessão individual</h2>
          <p class="formato__para">Uma leitura completa para o seu momento.</p>
          <p>Nos primeiros minutos eu explico como vai ser. Depois a leitura flui: eu traduzo em voz alta o que aparece, e você recebe. Quando possível, abro espaço para uma pergunta.</p>
          <p>Não precisa preparar nada nem chegar com um problema definido. Já no primeiro encontro pode começar a surgir clareza.</p>
          <p class="empurra">${botaoConversar(L, { href: L.whatsappSessao, evento: 'quero-conversar-sessao' })}</p>
        </article>
        <article class="formato formato--destaque surge" id="jornada" style="--atraso:.2s">
          <span class="formato__recomendada">Recomendada</span>
          <p class="formato__tag">10 sessões · 1 por semana</p>
          <h2 style="font-size:2rem">A Jornada</h2>
          <p class="formato__para">Para quem quer mudar profundamente.</p>
          <p>É o caminho para ir mais fundo. Semana a semana, o processo acessa e trabalha camadas diferentes, buscando soltar o que prende e abrir espaço para uma nova forma de viver.</p>
          <p><a class="seta seta--clara" href="#como-jornada">Como a Jornada se desenvolve <span aria-hidden="true">↓</span></a></p>
          <p class="formato__prazo">Os horários são limitados: cada jornada ocupa o mesmo horário durante dez semanas.</p>
          <p class="empurra">${botaoConversar(L, { href: L.whatsappJornada, evento: 'quero-conversar-jornada' })}</p>
        </article>
      </div>
    </div>
  </section>

  <section class="bloco" data-tema="indigo" id="como-jornada" aria-labelledby="como-jornada-titulo">
    <div class="dentro">
      <p class="olho surge">A Jornada · 10 semanas</p>
      <h2 class="grande surge" id="como-jornada-titulo">Como a Jornada <span class="ouro">se desenvolve.</span></h2>
      <p class="lead surge" style="margin-top:24px;max-width:34em">O trabalho se desenvolve ao longo do tempo: diferentes camadas são acessadas e trabalhadas, progressivamente.</p>
      <div class="linha-tempo">
        <div class="etapa surge"><b>Sessões 1 a 4</b><h3>Começa aberta</h3><p>Sem tema. O próprio processo organiza o campo e revela o que precisa ser trabalhado.</p></div>
        <div class="etapa surge" style="--atraso:.1s"><b>Sessões 5 a 10</b><h3>Você indica o território</h3><p>Se fizer sentido, traga um tema amplo: relacionamentos, trabalho, família, prosperidade, autoestima. O processo conduz o resto.</p></div>
      </div>
      <p class="jornada__regra surge">Na Jornada, você pode trazer um tema. <span class="ouro">Não precisa trazer uma história.</span></p>

      <h3 class="surge" style="margin-top:88px;font-size:clamp(1.5rem,2.4vw,2rem)">O que a Jornada busca</h3>
      <div class="busca surge">
        <div>
          <b>Ver</b>
          <ul class="chips"><li>Mais consciência sobre si</li><li>Clareza sobre padrões que se repetem</li><li>Novas perspectivas</li><li>Orientação</li></ul>
        </div>
        <div>
          <b>Transformar</b>
          <ul class="chips chips--fortes"><li>Dissolver e reprogramar o que trava</li><li>Transformar o que se revela</li><li>Movimento onde havia estagnação</li><li>Liberdade para escolher diferente</li></ul>
        </div>
      </div>
      <p class="lead surge" style="margin-top:56px;max-width:34em">A Jornada existe para a transformação acontecer. Soltar o que prende e abrir espaço para uma nova versão de você. Cada processo é único e o resultado não se promete, mas é exatamente isso que ela busca.</p>
      <p style="margin-top:36px" class="surge">${botaoConversar(L, { texto: 'Quero fazer a Jornada', href: L.whatsappJornada, evento: 'quero-fazer-jornada' })}</p>
    </div>
  </section>

  <section class="bloco bloco--areia" aria-labelledby="duvida">
    <div class="dentro par">
      <h2 class="grande surge" id="duvida">Ainda em dúvida?</h2>
      <div class="surge">
        <p class="lead">Você pode começar por uma Mensagem, por uma sessão, ou simplesmente conversando comigo sobre a jornada.</p>
        <p style="margin-top:32px">${botaoConversar(L, { evento: 'quero-conversar-duvida' })}</p>
      </div>
    </div>
  </section>`;

  return {
    caminho: '/a-jornada', arquivo: 'a-jornada.html', atual: 'jornada',
    titulo: 'Leitura energética: formatos e como começar | Harmonização Humana',
    descricao: 'Leitura energética em três formatos: Mensagem em áudio, sessão individual por videochamada e Jornada de dez sessões. Como funciona e como começar.',
    jsonld, conteudo,
  };
}
