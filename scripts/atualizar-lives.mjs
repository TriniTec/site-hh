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
async function dataDaLive(videoId) {
  const p = await (await fetch(`https://www.youtube.com/watch?v=${videoId}&hl=pt-BR`, { headers: cabecalhos })).text();
  return p.match(/"liveBroadcastDetails":\{[^}]*?"startTimestamp":"([^"]+)"/)?.[1]
    || p.match(/"scheduledStartTime":"(\d+)"/)?.[1]?.replace(/^\d+$/, (t) => new Date(t * 1000).toISOString())
    || p.match(/"(?:publishDate|uploadDate)":"([^"]+)"/)?.[1];
}

// Ordem: a da playlist (o Filipe a mantém com a live mais nova primeiro). A data que o YouTube informa
// pode ser a de publicação do vídeo editado, e não a da live, então não serve para ordenar.
const entradas = (await peloFeed()) ?? (await pelaPagina());
const novas = [];
for (const e of entradas.slice(0, 3)) {
  const quando = await dataDaLive(e.videoId);
  if (!quando) throw new Error(`Não encontrei a data da live ${e.videoId}`);
  novas.push({
    videoId: e.videoId,
    titulo: e.titulo,
    data: diaSP(quando),
    dataExtenso: extenso(quando),
    miniatura: `/img/lives/${e.videoId}.jpg`,
  });
}
console.log(`Encontradas ${entradas.length} lives; as três mais novas:\n` + novas.map((l) => `- ${l.dataExtenso}: ${l.titulo}`).join('\n'));

const atuais = JSON.parse(await readFile(arqLives, 'utf8'));
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
