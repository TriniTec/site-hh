// Lê a playlist das lives e atualiza data/lives.json com as três mais novas,
// baixando as miniaturas para src/img/lives/ (hospedadas no site, não puxadas do YouTube).
// Roda uma vez por dia no GitHub Actions (.github/workflows/lives.yml). Só altera arquivos se entrou live nova.
//
// Dois caminhos: primeiro o feed público da playlist; se o YouTube não entregar o feed (aconteceu com
// os IDs curtos destas playlists: 404), lê a página pública da playlist, a mesma que se abre no navegador.
import { readFile, writeFile, readdir, rm, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cfg = JSON.parse(await readFile(path.join(raiz, 'site.config.json'), 'utf8'));
const pastaMini = path.join(raiz, 'src/img/lives');
const arqLives = path.join(raiz, 'data/lives.json');
const id = cfg.playlistLives;
const cabecalhos = { 'accept-language': 'pt-BR,pt;q=0.9', 'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36', cookie: 'CONSENT=YES+1; SOCS=CAI' };

const desfazer = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
// Datas no fuso de São Paulo (a live é às 19h de Brasília, que já é o dia seguinte em UTC)
const diaSP = (iso) => new Date(iso).toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
const extenso = (iso) => {
  const [a, m, d] = diaSP(iso).split('-').map(Number);
  return `${d} de ${meses[m - 1]} de ${a}`;
};

async function peloFeed() {
  const url = `https://www.youtube.com/feeds/videos.xml?playlist_id=${id}`;
  const r = await fetch(url, { headers: cabecalhos });
  if (!r.ok) { console.log(`Feed respondeu ${r.status} (${url}). Tentando a página da playlist.`); return null; }
  const xml = await r.text();
  return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(([, e]) => ({
    videoId: e.match(/<yt:videoId>([^<]+)/)?.[1],
    titulo: desfazer(e.match(/<title>([^<]*)/)?.[1] || ''),
  })).filter((e) => e.videoId);
}

async function pelaPagina() {
  const url = `https://www.youtube.com/playlist?list=${id}&hl=pt-BR`;
  const r = await fetch(url, { headers: cabecalhos });
  if (!r.ok) throw new Error(`Página da playlist respondeu ${r.status}: ${url}`);
  const html = await r.text();
  const dados = html.match(/var ytInitialData = (\{[\s\S]*?\});<\/script>/)?.[1];
  if (!dados) throw new Error('Não encontrei os dados da playlist na página (a playlist é pública?).');
  const itens = [];
  (function andar(o) {
    if (!o || typeof o !== 'object') return;
    const v = o.playlistVideoRenderer;
    if (v?.videoId) itens.push({ videoId: v.videoId, titulo: v.title?.runs?.map((x) => x.text).join('') || v.title?.simpleText || '' });
    for (const k in o) andar(o[k]);
  })(JSON.parse(dados));
  if (!itens.length) throw new Error('A playlist está vazia ou não é pública.');
  return itens;
}

// Data da live: o início da transmissão (ou o horário agendado, se ainda não aconteceu). A data de
// publicação não serve: numa live agendada é o dia em que ela foi agendada, e numa live que já passou
// pode cair no dia seguinte (quando o vídeo termina de processar).
// Em live que já passou, a página traz o dia em texto: "Transmitido ao vivo em 1 de out. de 2026"
function aoVivoEm(p) {
  const m = p.match(/Transmitido ao vivo em (\d{1,2}) de ([a-zç]{3})\.? de (\d{4})/i);
  const mes = m && meses.findIndex((n) => n.slice(0, 3) === m[2].toLowerCase()) + 1;
  return mes ? `${m[3]}-${String(mes).padStart(2, '0')}-${m[1].padStart(2, '0')}T12:00:00-03:00` : null;
}

// Link do guia em PDF: o pós-live coloca na descrição do vídeo. Vale o link na linha que fala do guia
// (ou na seguinte); sem isso, o primeiro link do Google Drive. Sem link, o cartão fica sem o botão.
function descricao(p) {
  const textos = [
    p.match(/"shortDescription":"((?:[^"\\]|\\.)*)"/)?.[1],
    p.match(/"attributedDescription":\{"content":"((?:[^"\\]|\\.)*)"/)?.[1],
    p.match(/"attributedDescriptionBodyText":\{"content":"((?:[^"\\]|\\.)*)"/)?.[1],
  ].filter(Boolean).map((b) => { try { return JSON.parse(`"${b}"`); } catch { return ''; } });
  return textos.sort((a, b) => b.length - a.length)[0] ?? '';
}

function guiaNaDescricao(p) {
  const texto = descricao(p);
  if (!texto) return null;
  const linhas = texto.split('\n');
  const url = (l) => l?.match(/https?:\/\/\S+/)?.[0];
  for (let i = 0; i < linhas.length; i++) {
    if (/guia/i.test(linhas[i])) {
      const achado = url(linhas[i]) || url(linhas[i + 1]);
      if (achado) return achado;
    }
  }
  return texto.match(/https?:\/\/(?:drive|docs)\.google\.com\/\S+/)?.[0] ?? null;
}

// O YouTube encurta links longos no texto da descrição ("https://drive.google.com/file/d/1pwrZ...").
// O endereço inteiro está no próprio link (youtube.com/redirect?...&q=ENDEREÇO): pega o que começa igual.
function linkCompleto(p, curto) {
  if (!curto || !/(\.\.\.|…)$/.test(curto)) return curto;
  const inicio = curto.replace(/(\.\.\.|…)$/, '');
  const alvos = [...p.matchAll(/[?&\\u0026]q=(https?%3A[^&"\\]+)/g)].map((m) => { try { return decodeURIComponent(m[1]); } catch { return ''; } });
  const diretos = [...p.matchAll(/"url":"(https?:\/\/(?:drive|docs)\.google\.com\/[^"]+)"/g)].map((m) => m[1].replace(/\\u0026/g, '&'));
  return [...alvos, ...diretos].find((u) => u.startsWith(inicio)) ?? null;
}

async function dataDaLive(videoId) {
  for (let tentativa = 1; tentativa <= 3; tentativa++) {
    const r = await fetch(`https://www.youtube.com/watch?v=${videoId}&hl=pt-BR&bpctr=9999999999&has_verified=1`, { headers: cabecalhos });
    const p = await r.text();
    const inicio = p.match(/"liveBroadcastDetails":\{[^}]*?"startTimestamp":"([^"]+)"/)?.[1]
      || p.match(/"scheduledStartTime":"(\d+)"/)?.[1]?.replace(/^\d+$/, (t) => new Date(t * 1000).toISOString());
    const quando = inicio
      || aoVivoEm(p)
      || p.match(/"(?:publishDate|uploadDate)":"([^"]+)"/)?.[1]
      || p.match(/itemprop="(?:startDate|datePublished|uploadDate)" content="([^"]+)"/)?.[1];
    const guia = linkCompleto(p, guiaNaDescricao(p));
    if (!guia) {
      const desc = descricao(p);
      console.log(`Sem guia em ${videoId}. Descrição com ${desc.length} caracteres; links: ${(desc.match(/https?:\S+/g) || []).join(' ') || 'nenhum'}; menciona guia: ${/guia/i.test(desc)}`);
      if (!desc) for (const chave of ['Description', 'description"']) { const i = p.indexOf(chave); if (i >= 0) console.log(`  ${chave}: ${p.slice(Math.max(0, i - 60), i + 160).replace(/\s+/g, ' ')}`); }
    }
    if (quando) return { quando, inicio, guia };
    console.log(`Sem data na página de ${videoId} (tentativa ${tentativa}, resposta ${r.status}, ${p.length} caracteres, título: ${p.match(/<title>([^<]*)/)?.[1] ?? '?'}).`);
    for (const chave of ['startTimestamp', 'publishDate', 'uploadDate', 'dateText']) {
      const i = p.indexOf(chave);
      if (i >= 0) console.log(`  ${chave}: ${p.slice(Math.max(0, i - 40), i + 120).replace(/\s+/g, ' ')}`);
    }
    await new Promise((ok) => setTimeout(ok, 3000));
  }
  return null;
}

// Ordem: a da playlist (o Filipe a mantém com a live mais nova primeiro). A data que o YouTube informa
// pode ser a de publicação do vídeo editado, e não a da live, então não serve para ordenar.
const atuais = JSON.parse(await readFile(arqLives, 'utf8'));
const entradas = (await peloFeed()) ?? (await pelaPagina());
const novas = [];
for (const e of entradas.slice(0, 3)) {
  const { quando, inicio, guia } = (await dataDaLive(e.videoId)) ?? {};
  const antes = atuais.find((l) => l.videoId === e.videoId);
  // Se o YouTube não entregar a data agora, fica a que já estava no site; live nova sem data é erro
  if (!quando && !antes) throw new Error(`Não encontrei a data da live ${e.videoId}`);
  novas.push({
    videoId: e.videoId,
    titulo: e.titulo,
    data: quando ? diaSP(quando) : antes.data,
    dataExtenso: quando ? extenso(quando) : antes.dataExtenso,
    miniatura: `/img/lives/${e.videoId}.jpg`,
    // Horário exato da transmissão: o site mostra a etiqueta "Ao vivo…" enquanto ela não aconteceu
    ...(inicio && new Date(inicio) > new Date() ? { inicio: new Date(inicio).toISOString() } : {}),
    ...(!quando && antes.inicio ? { inicio: antes.inicio } : {}),
    ...(guia ? { guia } : !quando && antes?.guia ? { guia: antes.guia } : {}),
  });
}
console.log(`Encontradas ${entradas.length} lives; as três mais novas:\n` + novas.map((l) => `- ${l.dataExtenso}: ${l.titulo}${l.guia ? `\n  guia: ${l.guia}` : ''}`).join('\n'));

if (JSON.stringify(atuais) === JSON.stringify(novas)) {
  console.log('Nenhuma live nova.');
  process.exit(0);
}

await mkdir(pastaMini, { recursive: true });
for (const l of novas) {
  let ok = false;
  for (const nome of ['hqdefault.jpg', 'mqdefault.jpg']) {
    const r = await fetch(`https://i.ytimg.com/vi/${l.videoId}/${nome}`);
    if (!r.ok) continue;
    await writeFile(path.join(pastaMini, `${l.videoId}.jpg`), Buffer.from(await r.arrayBuffer()));
    ok = true; break;
  }
  if (!ok) throw new Error(`Miniatura de ${l.videoId} não encontrada`);
}
// Apaga miniaturas que saíram da lista
const manter = new Set(novas.map((l) => `${l.videoId}.jpg`));
for (const f of await readdir(pastaMini)) if (f.endsWith('.jpg') && !manter.has(f)) await rm(path.join(pastaMini, f));

await writeFile(arqLives, JSON.stringify(novas, null, 2) + '\n');
console.log('Lives atualizadas.');
