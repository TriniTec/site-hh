// Peças comuns às três páginas: <head>, topo, rodapé, botões.
// Todos os links de WhatsApp saem de site.config.json (um lugar para trocar).

export const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Endereços do WhatsApp por origem (whatsapp.harmonizacaohumana.com.br/instagram etc.): origem → link wa.me.
// Saem do mesmo site.config.json que os botões do site; o build grava isso para a função do Netlify.
export function whatsappOrigens(cfg) {
  const destinos = {};
  for (const [origem, o] of Object.entries(cfg.whatsapp.origens || {})) {
    destinos[origem] = `https://wa.me/${cfg.whatsapp.numero}?text=${encodeURIComponent(cfg.whatsapp[o.texto])}`;
  }
  return destinos;
}

export function links(cfg) {
  // Os botões do site também passam pelo subdomínio (whatsapp.harmonizacaohumana.com.br/<origem>): o número
  // não aparece no site e todo acesso de WhatsApp segue o mesmo caminho. Sem subdomínio, link wa.me direto.
  const direto = whatsappOrigens(cfg);
  const wa = (origem) => (cfg.whatsappSubdominio ? `https://${cfg.whatsappSubdominio}/${origem}` : direto[origem]);
  return {
    whatsapp: wa('site'),
    whatsappMensagem: wa('mensagem'),
    whatsappSessao: wa('sessao'),
    whatsappJornada: wa('jornada'),
    whatsappGuias: wa('guias'),
    playlist: `https://www.youtube.com/playlist?list=${cfg.playlistLives}`,
    youtube: cfg.youtube,
    instagram: cfg.instagram,
  };
}

// Símbolos do YouTube e do Instagram (cabeçalho, rodapé e Sobre), na cor do texto ao redor.
export const youtubeIcone = `<svg class="rede" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z"/></svg>`;
export const instagramIcone = `<svg class="rede" viewBox="0 0 24 24" aria-hidden="true"><rect x="2.6" y="2.6" width="18.8" height="18.8" rx="5.4" fill="none" stroke="currentColor" stroke-width="2.1"/><circle cx="12" cy="12" r="4.3" fill="none" stroke="currentColor" stroke-width="2.1"/><circle cx="17.5" cy="6.5" r="1.35" fill="currentColor"/></svg>`;
const arroba = (url) => '@' + url.replace(/\/+$/, '').split('/').pop().replace(/^@/, '');

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
    <ul class="topo__redes">
      <li><a href="${esc(L.youtube)}" target="_blank" rel="noopener" aria-label="YouTube" data-umami-event="youtube-topo">${youtubeIcone}</a></li>
      <li><a href="${esc(L.instagram)}" target="_blank" rel="noopener" aria-label="Instagram" data-umami-event="instagram-topo">${instagramIcone}</a></li>
    </ul>
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
          <li><a class="rodape__rede" href="${esc(L.whatsapp)}" target="_blank" rel="noopener" data-umami-event="whatsapp-rodape">${whatsappIcone}<span><b>WhatsApp</b>Quero conversar</span></a></li>
          <li><a class="rodape__rede" href="${esc(cfg.youtube)}" target="_blank" rel="noopener" data-umami-event="youtube-rodape">${youtubeIcone}<span><b>${esc(arroba(cfg.youtube))}</b>YouTube · ao vivo às quintas, 19h</span></a></li>
          <li><a class="rodape__rede" href="${esc(cfg.instagram)}" target="_blank" rel="noopener" data-umami-event="instagram-rodape">${instagramIcone}<span><b>${esc(arroba(cfg.instagram))}</b>Instagram</span></a></li>
        </ul>
      </div>
    </div>
    <div class="rodape__aviso">
      <p>Este trabalho não substitui o acompanhamento de médicos, psicólogos, psiquiatras e de outros profissionais de saúde. Não são feitas promessas de cura ou garantia de resultados.</p>
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

// Faixa "Ao vivo agora", no alto de todas as páginas, com o link da live da semana (data/live-agendada.json, que a
// ação "Atualizar lives" lê da aba "Ao vivo" do canal). Vem escondida: o site.js mostra só no horário da live.
function faixaAoVivo(aoVivo) {
  if (!aoVivo?.inicio || !aoVivo.videoId) return '';
  return `<a class="faixa-vivo" href="https://www.youtube.com/watch?v=${esc(aoVivo.videoId)}" target="_blank" rel="noopener" data-ao-vivo="${esc(aoVivo.inicio)}" data-umami-event="ao-vivo-agora" hidden><i></i><b>Ao vivo agora</b><span>no YouTube · Assistir</span></a>`;
}

// Aviso de live fora do dia de sempre (site.config.json, liveDeSempre: quinta, 19h). Aparece sozinho quando a live
// agendada (data/live-agendada.json) cai em outro dia ou em outra hora, e some sozinho: o site.js esconde a faixa a
// partir de 10 minutos antes do início, quando a faixa "Ao vivo" assume o alto da página, e a ação troca a live do
// arquivo pela seguinte no dia depois. Faixa dourada no alto e janela central na primeira visita, uma vez por live
// em cada aparelho. Pedido do Filipe (24/11): "um aviso bem gritante no site que a live vai ser num dia diferente
// do usual". Brasília não tem horário de verão desde 2019: a hora local é UTC menos 3.
const diasDaSemana = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
const naDia = (d) => (d === 0 || d === 6 ? 'no ' : 'na ') + diasDaSemana[d];
const horaEscrita = (h, m) => `${h}h${m ? String(m).padStart(2, '0') : ''}`;
const iconeCalendario = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></svg>`;
export function avisoDiaDaLive(aoVivo, cfg) {
  const sempre = cfg.liveDeSempre;
  const vazio = { faixa: '', janela: '' };
  if (!aoVivo?.inicio || !aoVivo.videoId || !sempre) return vazio;
  const sp = new Date(Date.parse(aoVivo.inicio) - 3 * 3600e3);
  const dia = sp.getUTCDay(), h = sp.getUTCHours(), m = sp.getUTCMinutes();
  const [hs, ms] = sempre.hora.split(':').map(Number);
  const mesmoDia = dia === sempre.diaDaSemana, mesmaHora = h === hs && m === ms;
  if (mesmoDia && mesmaHora) return vazio;
  const quando = `${naDia(dia)}, ${String(sp.getUTCDate()).padStart(2, '0')}/${String(sp.getUTCMonth() + 1).padStart(2, '0')}, às ${horaEscrita(h, m)}`;
  const olho = mesmoDia ? 'Mudou o horário da live' : 'Mudou o dia da live';
  const naoE = mesmoDia ? `às ${horaEscrita(hs, ms)}` : naDia(sempre.diaDaSemana);
  const link = `https://www.youtube.com/watch?v=${esc(aoVivo.videoId)}`;
  return {
    faixa: `<a class="faixa-aviso" href="${link}" target="_blank" rel="noopener" data-aviso-live="${esc(aoVivo.inicio)}" data-umami-event="aviso-live-faixa">${iconeCalendario}<b>${olho}</b><span>A próxima é ${quando} · <u>Ativar lembrete</u></span></a>`,
    janela: `<dialog class="aviso-live" id="aviso-live" data-video="${esc(aoVivo.videoId)}" aria-labelledby="aviso-live-titulo">
  <div class="aviso-live__caixa">
    <button class="aviso-live__fechar" type="button" data-fechar aria-label="Fechar">×</button>
    <p class="aviso-live__olho">${iconeCalendario}${olho}</p>
    <h2 id="aviso-live-titulo">A próxima live é ${quando}</h2>
    <p>Desta vez não é ${naoE}. A Leitura Ao Vivo continua no YouTube, aberta e de graça. Quer receber uma leitura? É só escrever no chat.</p>
    <div class="aviso-live__botoes">
      <a class="botao botao--principal" href="${link}" target="_blank" rel="noopener" data-fechar data-umami-event="aviso-live-lembrete">${youtubeIcone}Ativar lembrete no YouTube</a>
      <button class="botao botao--claro" type="button" data-fechar>Entendi</button>
    </div>
  </div>
</dialog>`,
  };
}

export function pagina({ cfg, L, aoVivo, atual, titulo, descricao, caminho, jsonld, preload, conteudo }) {
  const aviso = avisoDiaDaLive(aoVivo, cfg);
  return `${head({ cfg, titulo, descricao, caminho, jsonld, preload })}
<body>
${aviso.faixa}${faixaAoVivo(aoVivo)}
${topo({ L, atual })}
<main id="conteudo">
${conteudo}
</main>
${rodape({ cfg, L })}${aviso.janela ? '\n' + aviso.janela : ''}
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
