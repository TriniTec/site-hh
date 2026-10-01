// Página Sobre · versão Solar. Sem currículo nem certificações: a trajetória é história, não credencial.
import { botaoConversar, jsonldBase, breadcrumb, sol } from '../scripts/partes.mjs';

export default function sobre({ cfg, L }) {
  const base = jsonldBase(cfg);
  const person = { ...base.person, description: 'Um Humano do Silêncio, aquele que restaura a Harmonia.', worksFor: { '@id': `${cfg.dominio}/#servico` } };
  const jsonld = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'ProfilePage', url: `${cfg.dominio}/sobre`, mainEntity: { '@id': person['@id'] } },
    person, base.servico, breadcrumb(cfg, [['Início', '/'], ['Sobre', '/sobre']]),
  ] };

  const trajeto = ['Engenharia', 'Computação', 'Fotografia', 'Viagens', 'Espiritualidade', 'Trabalho terapêutico'];

  const conteudo = `
  <section class="entrada">
    <div class="entrada__sol" aria-hidden="true">${sol({ id: 'e' })}</div>
    <div class="dentro par">
      <div>
        <p class="olho surge">Filipe Morgado</p>
        <h1 class="surge" style="--atraso:.08s">Um Humano do Silêncio, aquele que restaura a <span class="laranja">Harmonia.</span></h1>
        <p class="lead surge" style="--atraso:.16s">Alguém que busca escutar antes de interferir, perceber antes de interpretar e compreender antes de agir. Meu trabalho é ajudar a restaurar a harmonia quando algo deixou de fluir.</p>
      </div>
      <div class="filipe__foto surge" style="--atraso:.1s;justify-self:end;width:100%">
        <img src="/img/filipe-sentado-sorrindo-640.webp" srcset="/img/filipe-sentado-sorrindo-640.webp 640w, /img/filipe-sentado-sorrindo-1000.webp 1000w"
             sizes="(min-width: 900px) 480px, 100vw" width="640" height="800" fetchpriority="high"
             alt="Filipe Morgado sentado, sorrindo, de camiseta amarela, numa sala clara com luz natural.">
      </div>
    </div>
  </section>

  <section class="bloco bloco--areia" aria-labelledby="caminho">
    <div class="dentro">
      <p class="olho surge">Como cheguei aqui</p>
      <h2 class="grande surge" id="caminho">Um caminho que não escolheu lado.</h2>
      <ol class="trajeto surge" aria-label="Trajetória">
        ${trajeto.map((t, i) => `<li>${t}</li>${i < trajeto.length - 1 ? '<li class="passa" aria-hidden="true">→</li>' : ''}`).join('')}
      </ol>
      <p class="lead surge" style="margin-top:48px;max-width:34em">A fotografia foi o que me fez olhar para mim mesmo e abriu o caminho. As viagens trouxeram outra forma de perceber. Por aí chegou a espiritualidade, e depois o trabalho terapêutico.</p>
    </div>
  </section>

  <section class="bloco declaracao" data-tema="indigo" aria-labelledby="humanidade">
    <div class="declaracao__luz" aria-hidden="true">${sol({ id: 'd', raios: 48, onda: 1.2 })}</div>
    <div class="dentro">
      <h2 class="surge" id="humanidade" style="max-width:18ch;font-size:clamp(2.25rem,5.4vw,4.25rem)">Razão e intuição. Tecnologia e espiritualidade. <span class="ouro">A mesma Humanidade.</span></h2>
      <p class="lead surge">Talvez por isso eu não me encaixe perfeitamente na bolha espiritual. E talvez seja exatamente isso que permite que este trabalho aconteça de forma simples, humana e sem espetáculo.</p>
    </div>
  </section>

  <section class="bloco" aria-labelledby="tecnica">
    <div class="dentro par">
      <h2 class="citacao surge" id="tecnica" style="color:var(--indigo)">Meu trabalho não está preso a uma <span class="laranja">técnica.</span></h2>
      <div class="surge">
        <p class="lead">Cada pessoa apresenta um campo diferente, e o processo conduz aquilo que precisa ser visto e trabalhado. A ferramenta mais adequada surge dentro do processo, não antes dele.</p>
        <p style="margin-top:36px">${botaoConversar(L, { evento: 'quero-conversar-sobre' })}</p>
      </div>
    </div>
  </section>`;

  return {
    caminho: '/sobre', arquivo: 'sobre.html', atual: 'sobre',
    titulo: 'Filipe Morgado | Harmonização Humana',
    descricao: 'Quem é Filipe Morgado e como engenharia, fotografia e espiritualidade se encontram num trabalho de leitura e transformação.',
    jsonld, conteudo,
  };
}
