// Peças comuns às três páginas: <head>, topo, rodapé, botões.
// Todos os links de WhatsApp saem de site.config.json (um lugar para trocar).

export const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function links(cfg) {
  const wa = (texto) => `https://wa.me/${cfg.whatsapp.numero}?text=${encodeURIComponent(texto)}`;
  return {
    whatsapp: wa(cfg.whatsapp.textoGeral),
    whatsappMensagem: wa(cfg.whatsapp.textoMensagem),
    playlist: `https://www.youtube.com/playlist?list=${cfg.playlistLives}`,
  };
}

const balao = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M4 5.5h16v10H9.5L5 19.5v-4H4z"/></svg>`;

// Botão principal. evento = nome do clique no Umami.
export function botaoConversar(L, { texto = 'Quero conversar', href = L.whatsapp, evento = 'quero-conversar', classe = '' } = {}) {
  return `<a class="botao botao--principal ${classe}" href="${esc(href)}" target="_blank" rel="noopener" data-umami-event="${evento}">${esc(texto)}</a>`;
}

export function head({ cfg, titulo, descricao, caminho, jsonld, preload = [] }) {
  const url = cfg.dominio + caminho;
  const umami = cfg.umamiWebsiteId
    ? `<script defer src="https://cloud.umami.is/script.js" data-website-id="${esc(cfg.umamiWebsiteId)}"></script>`
    : '';
  const variantes = ['c', 'e', 'f', 'g', 'h', 'i', 'a'];
  const padrao = { cheio: 'c' }[cfg.botaoPrincipal] || cfg.botaoPrincipal;
  return `<!doctype html>
<html lang="pt-BR" data-botao="${esc(padrao)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(descricao)}">
<link rel="canonical" href="${url}">
<meta name="theme-color" content="#082B61">
<meta name="color-scheme" content="only light">
<meta property="og:type" content="website">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="${esc(cfg.nome)}">
<meta property="og:title" content="${esc(titulo)}">
<meta property="og:description" content="${esc(descricao)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${cfg.dominio}/img/compartilhamento.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Você sabe que quer mudar. Mas sozinha ainda não conseguiu. Harmonização Humana, com Filipe Morgado.">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">
<link rel="icon" href="/favicon-16.png" sizes="16x16" type="image/png">
<link rel="icon" href="/favicon-48.png" sizes="48x48" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preload" href="/fonts/DMSans-Bold.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/Manrope-Regular.woff2" as="font" type="font/woff2" crossorigin>
${preload.join('\n')}
<link rel="stylesheet" href="/css/site.css">
<script>
/* Teste da cor do botão vendo a página inteira: ?botao=e (ou c, f, g, h, i, a). Vale até fechar a aba. */
(function(){var v=${JSON.stringify(variantes)},q=new URLSearchParams(location.search).get('botao');try{if(q&&v.indexOf(q)>-1)sessionStorage.setItem('botao',q);q=sessionStorage.getItem('botao')}catch(e){}if(q&&v.indexOf(q)>-1)document.documentElement.setAttribute('data-botao',q)})();
</script>
${umami}
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
</head>`;
}

export function topo({ L, atual }) {
  const itens = [
    ['inicio', 'Início', '/'],
    ['jornada', 'A Jornada', '/a-jornada'],
    ['sobre', 'Sobre', '/sobre'],
  ];
  return `<a class="pular" href="#conteudo">Pular para o conteúdo</a>
<header class="topo">
  <div class="topo__dentro">
    <a class="topo__marca" href="/">
      <img src="/img/hh-logo-96.webp" width="40" height="40" alt="">Harmonização Humana
    </a>
    <nav aria-label="Principal" class="topo__nav">
      <ul class="topo__menu">
        ${itens.map(([id, nome, href]) => `<li><a href="${href}"${atual === id ? ' aria-current="page"' : ''}>${nome}</a></li>`).join('\n        ')}
      </ul>
    </nav>
    ${botaoConversar(L, { classe: 'topo__botao', evento: 'quero-conversar-topo' })}
  </div>
</header>`;
}

export function rodape({ cfg, L }) {
  return `<footer class="rodape" data-tema="indigo">
  <div class="rodape__dentro">
    <p class="rodape__nome">Harmonização Humana · Filipe Morgado</p>
    <ul class="rodape__links">
      <li><a href="/">Início</a></li>
      <li><a href="/a-jornada">A Jornada</a></li>
      <li><a href="/sobre">Sobre</a></li>
    </ul>
    <ul class="rodape__links">
      <li><a href="${esc(L.whatsapp)}" target="_blank" rel="noopener" data-umami-event="whatsapp-rodape">WhatsApp</a></li>
      <li><a href="${esc(cfg.youtube)}" target="_blank" rel="noopener">YouTube</a></li>
      <li><a href="${esc(cfg.instagram)}" target="_blank" rel="noopener">Instagram</a></li>
    </ul>
    <hr class="rodape__fio">
    <p>Este trabalho não substitui acompanhamento médico, psicológico ou psiquiátrico, nem outros cuidados profissionais de saúde. Não são feitas promessas de cura ou garantia de resultados.</p>
    <p>Privacidade: este site não usa cookies e não identifica quem visita. As visitas são contadas de forma anônima. O contato acontece pelo WhatsApp, por sua iniciativa. Os vídeos só carregam do YouTube quando você toca neles.</p>
    <p class="rodape__assinatura">© ${cfg.ano} Filipe Morgado <img src="/img/terapeuta-consciencial-marfim.png" width="24" height="24" alt="Terapeuta consciencial"></p>
  </div>
</footer>
${`<a class="botao botao--principal botao-fixo" href="${esc(L.whatsapp)}" target="_blank" rel="noopener" data-umami-event="quero-conversar-fixo">${balao}Quero conversar</a>`}
<script src="/js/site.js" defer></script>`;
}

export function pagina({ cfg, L, atual, titulo, descricao, caminho, jsonld, preload, conteudo }) {
  return `${head({ cfg, titulo, descricao, caminho, jsonld, preload })}
<body>
${topo({ L, atual })}
<main id="conteudo">
${conteudo}
</main>
${rodape({ cfg, L })}
</body>
</html>
`;
}

// Dados estruturados comuns
export function jsonldBase(cfg) {
  const site = cfg.dominio;
  const person = {
    '@type': 'Person',
    '@id': `${site}/sobre#filipe`,
    name: 'Filipe Morgado',
    url: `${site}/sobre`,
    image: `${site}/img/filipe-retrato-sorrindo-1200.webp`,
    sameAs: [cfg.youtube, cfg.instagram],
  };
  const servico = {
    '@type': 'ProfessionalService',
    '@id': `${site}/#servico`,
    name: 'Harmonização Humana',
    url: `${site}/`,
    image: `${site}/icone-512.png`,
    logo: `${site}/icone-512.png`,
    description: 'Uma experiência de leitura e transformação para revelar o que precisa ser visto e trabalhar o que precisa mudar.',
    founder: { '@id': `${site}/sobre#filipe` },
    areaServed: { '@type': 'Country', name: 'Brasil' },
    availableChannel: { '@type': 'ServiceChannel', serviceUrl: `${site}/a-jornada`, name: 'Atendimento online' },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Formatos',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Mensagem', description: 'Uma mensagem curta, de até cinco minutos, enviada em áudio.' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Sessão individual', description: 'Um encontro de aproximadamente uma hora, por videochamada.' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'A Jornada', description: 'Dez sessões de aproximadamente uma hora, uma por semana.' } },
      ],
    },
  };
  const website = { '@type': 'WebSite', '@id': `${site}/#site`, name: 'Harmonização Humana', url: `${site}/`, inLanguage: 'pt-BR', publisher: { '@id': `${site}/sobre#filipe` } };
  return { person, servico, website };
}

export function breadcrumb(cfg, itens) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: itens.map(([nome, caminho], i) => ({ '@type': 'ListItem', position: i + 1, name: nome, item: cfg.dominio + caminho })),
  };
}
