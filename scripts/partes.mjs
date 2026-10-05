// Peças comuns às três páginas: <head>, topo, rodapé, botões.
// Todos os links de WhatsApp saem de site.config.json (um lugar para trocar).

export const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function links(cfg) {
  const wa = (texto) => `https://wa.me/${cfg.whatsapp.numero}?text=${encodeURIComponent(texto)}`;
  return {
    whatsapp: wa(cfg.whatsapp.textoGeral),
    whatsappMensagem: wa(cfg.whatsapp.textoMensagem),
    whatsappSessao: wa(cfg.whatsapp.textoSessao),
    whatsappJornada: wa(cfg.whatsapp.textoJornada),
    playlist: `https://www.youtube.com/playlist?list=${cfg.playlistLives}`,
  };
}

// Símbolo do WhatsApp: todo botão de contato mostra para onde a pessoa vai.
export const whatsappIcone = `<svg class="wa" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>`;

// Botão principal. evento = nome do clique no Umami.
export function botaoConversar(L, { texto = 'Quero conversar', href = L.whatsapp, evento = 'quero-conversar', classe = '' } = {}) {
  return `<a class="botao botao--principal ${classe}" href="${esc(href)}" target="_blank" rel="noopener" data-umami-event="${evento}">${whatsappIcone}${esc(texto)}</a>`;
}

export function head({ cfg, titulo, descricao, caminho, jsonld, preload = [] }) {
  const url = cfg.dominio + caminho;
  const umami = cfg.umamiWebsiteId
    ? `<script defer src="https://cloud.umami.is/script.js" data-website-id="${esc(cfg.umamiWebsiteId)}"></script>`
    : '';
  return `<!doctype html>
<html lang="pt-BR">
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
<meta property="og:image" content="${cfg.dominio}/img/compartilhamento.jpg?v=2">
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
document.documentElement.classList.add('js');
/* Teste: ?letreiro=nao esconde a faixa de palavras; ?letreiro=sim volta. Vale até fechar a aba. */
(function(){var q=new URLSearchParams(location.search).get('letreiro');try{if(q)sessionStorage.setItem('letreiro',q);q=sessionStorage.getItem('letreiro')}catch(e){}if(q==='nao')document.documentElement.classList.add('sem-letreiro')})();
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
  <div class="dentro topo__dentro">
    <a class="topo__marca" href="/" aria-label="Harmonização Humana, página inicial">
      <img src="/img/hh-logo-96.webp" width="40" height="40" alt=""><span>Harmonização Humana</span>
    </a>
    <nav aria-label="Principal" class="topo__nav" style="margin-left:auto">
      <ul class="topo__menu">
        ${itens.map(([id, nome, href]) => `<li><a href="${href}"${atual === id ? ' aria-current="page"' : ''}>${nome}</a></li>`).join('\n        ')}
      </ul>
    </nav>
    ${botaoConversar(L, { classe: 'topo__botao', evento: 'quero-conversar-topo' })}
  </div>
</header>`;
}

export function rodape({ cfg, L }) {
  return `<footer class="rodape">
  <div class="dentro">
    <div class="rodape__topo">
      <div>
        <p class="rodape__marca"><img src="/img/hh-logo-96.webp" width="52" height="52" alt="">Harmonização Humana</p>
        <p class="rodape__frase">Leitura e transformação para quem quer mudar.</p>
      </div>
      <nav aria-label="Rodapé">
        <h2>Navegue</h2>
        <ul>
          <li><a href="/">Início</a></li>
          <li><a href="/a-jornada">A Jornada</a></li>
          <li><a href="/sobre">Sobre</a></li>
        </ul>
      </nav>
      <div>
        <h2>Fale e acompanhe</h2>
        <ul>
          <li><a href="${esc(L.whatsapp)}" target="_blank" rel="noopener" data-umami-event="whatsapp-rodape">WhatsApp</a></li>
          <li><a href="${esc(cfg.youtube)}" target="_blank" rel="noopener">YouTube · ao vivo às quintas, 19h</a></li>
          <li><a href="${esc(cfg.instagram)}" target="_blank" rel="noopener">Instagram</a></li>
        </ul>
      </div>
    </div>
    <div class="rodape__aviso">
      <p>Este trabalho não substitui acompanhamento médico, psicológico ou psiquiátrico, nem outros cuidados profissionais de saúde. Não são feitas promessas de cura ou garantia de resultados.</p>
      <p>Privacidade: este site não usa cookies e não identifica quem visita. As visitas são contadas de forma anônima. O contato acontece pelo WhatsApp, por sua iniciativa. Os vídeos só carregam do YouTube quando você toca neles.</p>
      <p class="rodape__assinatura">© ${cfg.ano} Filipe Morgado <img src="/img/terapeuta-consciencial-marfim.png" width="24" height="24" alt="Terapeuta consciencial"></p>
    </div>
  </div>
</footer>
<a class="botao botao--principal botao-fixo" href="${esc(L.whatsapp)}" target="_blank" rel="noopener" data-umami-event="quero-conversar-fixo">${whatsappIcone}Quero conversar</a>
<script src="/js/site.js" defer></script>`;
}

// O sol da marca, abstrato: raios ondulados dourados girando devagar.
export function sol({ raios = 28, id = 's', onda = 3.2 } = {}) {
  const linhas = (n, r1, r2, onda, largura, grad) => Array.from({ length: n }, (_, i) => {
    const ang = (360 / n) * i;
    const m = (r1 + r2) / 2;
    const d = `M0 ${-r1} Q${onda} ${-(r1 + (m - r1) / 2)} 0 ${-m} T0 ${-r2}`;
    return `<path d="${d}" transform="rotate(${ang.toFixed(2)})" stroke="url(#${grad})" stroke-width="${largura}" fill="none" stroke-linecap="round"/>`;
  }).join('');
  return `<svg class="sol" viewBox="-100 -100 200 200" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="${id}a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FECD41" stop-opacity="0"/><stop offset=".35" stop-color="#FECD41"/><stop offset="1" stop-color="#EC9E2C"/></linearGradient>
      <linearGradient id="${id}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E87716" stop-opacity="0"/><stop offset="1" stop-color="#E87716" stop-opacity=".8"/></linearGradient>
    </defs>
    <g class="sol__raios">${linhas(raios, 70, 98, onda, 1.6, id + 'a')}</g>
    <g class="sol__raios sol__raios--2">${linhas(raios, 74, 90, -onda * 0.8, 1, id + 'b')}</g>
  </svg>`;
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
