// Página "Guias das leituras ao vivo" (/ao-vivo/guias). Reservada: só se chega pelo link (direct do Instagram,
// chat da live). Fora do menu, do rodapé e do sitemap, com noindex.
// Os dados vêm de data/episodios.json, que a tarefa das lives preenche sozinha (título, data, guia, miniatura,
// resumo do YouTube). À mão, no mesmo arquivo: resumo, carrossel (imagem 3:4), carrosselAlt e categorias.
import { botaoConversar, breadcrumb, jsonldBase, esc, sol, youtubeIcone, instagramIcone } from '../scripts/partes.mjs';

// Texto para a busca: minúsculas e sem acento ("decapitação" acha "decapitacao").
const normalizar = (t) => String(t).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

function cartao(ep) {
  const resumo = ep.resumo || ep.resumoYoutube || '';
  const categorias = ep.categorias || [];
  const video = `https://www.youtube.com/watch?v=${esc(ep.videoId)}`;
  const miniatura = ep.miniatura
    ? `<img class="guia__mini" src="${esc(ep.miniatura)}" width="480" height="360" loading="lazy" alt="Miniatura do vídeo no YouTube: ${esc(ep.titulo)}">`
    : '';
  const carrossel = ep.carrossel
    ? `<img class="guia__carrossel" src="${esc(ep.carrossel)}" width="600" height="800" loading="lazy" alt="${esc(ep.carrosselAlt || `Capa do carrossel no Instagram: ${ep.titulo}`)}">`
    : '';
  return `
        <article class="guia surge" id="${esc(ep.data)}" data-busca="${esc(normalizar([ep.titulo, resumo, ep.dataExtenso, ...categorias].join(' ')))}" data-cat="${esc(categorias.map(normalizar).join('|'))}">
          <div class="guia__imagens${carrossel ? ' guia__imagens--duas' : ''}">${carrossel}${miniatura}</div>
          <div class="guia__corpo">
            <p class="guia__data"><time datetime="${esc(ep.data)}">${esc(ep.dataExtenso)}</time></p>
            <h2>${esc(ep.titulo)}</h2>
            ${categorias.length ? `<ul class="guia__cats">${categorias.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>` : ''}
            ${resumo ? `<p class="guia__resumo">${esc(resumo)}</p>` : ''}
            <p class="guia__acoes">
              <a class="botao botao--guia" href="${esc(ep.guia)}" target="_blank" rel="noopener" data-umami-event="guia-abrir" data-umami-event-data="${esc(ep.data)}">Abrir o guia</a>
              <a class="seta" href="${video}" target="_blank" rel="noopener" data-umami-event="guia-video" data-umami-event-data="${esc(ep.data)}">Assistir à leitura <span aria-hidden="true">→</span></a>
            </p>
          </div>
        </article>`;
}

export default function guias({ cfg, L, episodios = [] }) {
  // Só entra episódio completo: guia, data, miniatura e resumo. Faltando algo, espera a tarefa das lives.
  const comGuia = episodios.filter((e) => e.guia && e.data && e.miniatura && (e.resumo || e.resumoYoutube)).sort((a, b) => b.data.localeCompare(a.data));
  const categorias = [...new Set(comGuia.flatMap((e) => e.categorias || []))].sort((a, b) => a.localeCompare(b, 'pt-BR'));
  const base = jsonldBase(cfg);
  const jsonld = { '@context': 'https://schema.org', '@graph': [base.person, breadcrumb(cfg, [['Início', '/'], ['Guias das leituras ao vivo', '/ao-vivo/guias']])] };

  const conteudo = `
  <section class="entrada guias-topo">
    <div class="entrada__sol" aria-hidden="true">${sol({ id: 'g' })}</div>
    <div class="dentro">
      <p class="olho surge">Leituras ao vivo</p>
      <h1 class="surge" style="--atraso:.08s">Guias das leituras <em class="laranja" style="font-style:normal">ao vivo.</em></h1>
      <p class="lead surge" style="--atraso:.16s">Toda quinta, às 19h, tem Leitura Ao Vivo no YouTube. Aqui ficam os guias de cada uma, junto com o vídeo.</p>
      <div class="guias-canais surge" style="--atraso:.24s">
        <p class="guias-canais__rotulo">Onde acompanhar as lives</p>
        <ul>
          <li><a class="botao botao--claro" href="${esc(L.youtube)}" target="_blank" rel="noopener" data-umami-event="youtube-guias">${youtubeIcone}YouTube · ao vivo às quintas, 19h</a></li>
          <li><a class="botao botao--claro" href="${esc(L.instagram)}" target="_blank" rel="noopener" data-umami-event="instagram-guias">${instagramIcone}Instagram</a></li>
        </ul>
      </div>
    </div>
  </section>

  <section class="bloco bloco--areia guias" aria-label="Guias" data-guias>
    <div class="dentro">
      <div class="guias-ferramentas">
        <label class="guias-busca" for="busca-guias">
          <span class="visualmente-oculto">Buscar um guia</span>
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M15.5 15.5 21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          <input type="search" id="busca-guias" placeholder="Buscar por tema ou título" autocomplete="off">
        </label>
        ${categorias.length ? `<div class="guias-filtros" role="group" aria-label="Filtrar por tema">
          <button type="button" aria-pressed="true" data-cat="">Todos</button>
          ${categorias.map((c) => `<button type="button" aria-pressed="false" data-cat="${esc(normalizar(c))}">${esc(c)}</button>`).join('\n          ')}
        </div>` : ''}
        <p class="guias-contagem" aria-live="polite" data-contagem>${comGuia.length} ${comGuia.length === 1 ? 'guia' : 'guias'}</p>
      </div>
      <div class="guias-lista">${comGuia.map(cartao).join('')}
      </div>
      <p class="guias-vazio" hidden data-vazio>Nenhum guia com essa busca. Tente outra palavra ou veja todos.</p>
    </div>
  </section>

  <section class="final" aria-labelledby="final">
    <div class="final__foto">
      <img src="/img/filipe-corpo-inteiro-640.webp" srcset="/img/filipe-corpo-inteiro-640.webp 640w, /img/filipe-corpo-inteiro-1200.webp 1200w"
           sizes="100vw" width="640" height="427" loading="lazy"
           alt="Filipe Morgado de pé, sorrindo, com as mãos nos bolsos, num ambiente claro e ensolarado.">
    </div>
    <div class="dentro final__texto">
      <div class="surge">
        <h2 id="final">Você não precisa saber por onde começar.</h2>
        <p class="lead">Sente que chegou a hora de olhar mais fundo para o que está acontecendo? Então vamos conversar.</p>
        ${botaoConversar(L, { href: L.whatsappGuias, evento: 'quero-conversar-guias' })}
      </div>
    </div>
  </section>`;

  return {
    caminho: '/ao-vivo/guias', arquivo: 'ao-vivo/guias.html', atual: '', indexar: false,
    titulo: 'Guias das leituras ao vivo | Harmonização Humana',
    descricao: 'Os guias de cada leitura ao vivo da Harmonização Humana, junto com o vídeo no YouTube.',
    jsonld, conteudo,
  };
}
