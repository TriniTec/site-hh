// Página Sobre. Textos: documento 02, Parte 6 (v1.10). Sem currículo, cursos ou certificações.
import { botaoConversar, jsonldBase, breadcrumb } from '../scripts/partes.mjs';

export default function sobre({ cfg, L }) {
  const base = jsonldBase(cfg);
  const person = { ...base.person, description: 'Um Humano do Silêncio, aquele que restaura a Harmonia.', worksFor: { '@id': `${cfg.dominio}/#servico` } };
  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'ProfilePage', url: `${cfg.dominio}/sobre`, mainEntity: { '@id': person['@id'] } },
      person,
      base.servico,
      breadcrumb(cfg, [['Início', '/'], ['Sobre', '/sobre']]),
    ],
  };

  const conteudo = `
  <section class="secao hero" aria-labelledby="h1">
    <div class="secao__dentro duas">
      <div>
        <h1 class="hero-titulo" id="h1">Um Humano do Silêncio, aquele que restaura a Harmonia.</h1>
        <div style="margin-top:var(--espaco-5)">
          <p class="forte">Meu nome é Filipe Morgado.</p>
          <p>Alguém que busca escutar antes de interferir, perceber antes de interpretar e compreender antes de agir.</p>
          <p>Meu trabalho é ajudar a restaurar a harmonia quando algo deixou de fluir.</p>
        </div>
      </div>
      <div class="duas__foto duas__foto--vertical">
        <img src="/img/filipe-sentado-sorrindo-640.webp"
             srcset="/img/filipe-sentado-sorrindo-640.webp 640w, /img/filipe-sentado-sorrindo-1000.webp 1000w"
             sizes="(min-width: 900px) 460px, 100vw" width="640" height="800" fetchpriority="high"
             alt="Filipe Morgado sentado, sorrindo, de camiseta amarela, numa sala clara com luz natural.">
      </div>
    </div>
  </section>

  <section class="secao secao--areia" aria-labelledby="como-cheguei">
    <div class="secao__dentro secao__texto">
      <h2 class="titulo" id="como-cheguei">Como cheguei aqui</h2>
      <p>Minha trajetória passou pela engenharia e pela computação. Depois pela fotografia, que foi o que me fez olhar para mim mesmo e abriu o caminho. Vieram os passeios e as viagens fotográficas, e com eles uma forma diferente de perceber. Foi por aí que a espiritualidade chegou, e depois o trabalho terapêutico.</p>
      <p>Não vejo essas coisas como fases separadas. Racionalidade e intuição, estrutura e sensibilidade, tecnologia e espiritualidade: para mim são partes da mesma Humanidade.</p>
      <p>Talvez seja por isso que eu não me encaixe perfeitamente na bolha espiritual. E talvez seja exatamente isso que permita que este trabalho aconteça de forma simples, humana e sem espetáculo.</p>
    </div>
  </section>

  <section class="secao" aria-labelledby="trabalho">
    <div class="secao__dentro secao__texto">
      <hr class="fio">
      <h2 class="titulo" id="trabalho">Sobre o trabalho</h2>
      <p>Meu trabalho não está preso a uma técnica.</p>
      <p>Cada pessoa apresenta um campo diferente, e o processo conduz aquilo que precisa ser visto e trabalhado. A ferramenta mais adequada surge dentro do processo, não antes dele.</p>
      <p style="margin-top:var(--espaco-5)">${botaoConversar(L, { evento: 'quero-conversar-sobre' })}</p>
    </div>
  </section>`;

  return {
    caminho: '/sobre',
    arquivo: 'sobre.html',
    atual: 'sobre',
    titulo: 'Filipe Morgado | Harmonização Humana',
    descricao: 'Quem é Filipe Morgado e como engenharia, fotografia e espiritualidade se encontram num trabalho de leitura e transformação.',
    jsonld,
    conteudo,
  };
}
