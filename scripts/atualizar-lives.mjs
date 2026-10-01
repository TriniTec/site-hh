// Lê o feed público da playlist das lives e atualiza data/lives.json com as três mais novas,
// baixando as miniaturas para src/img/lives/ (hospedadas no site, não puxadas do YouTube).
// Roda uma vez por dia no GitHub Actions (.github/workflows/lives.yml). Só altera arquivos se entrou live nova.
import { readFile, writeFile, readdir, rm, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cfg = JSON.parse(await readFile(path.join(raiz, 'site.config.json'), 'utf8'));
const pastaMini = path.join(raiz, 'src/img/lives');
const arqLives = path.join(raiz, 'data/lives.json');

const feed = `https://www.youtube.com/feeds/videos.xml?playlist_id=${cfg.playlistLives}`;
const resp = await fetch(feed);
if (!resp.ok) throw new Error(`Feed respondeu ${resp.status}: ${feed}`);
const xml = await resp.text();

const desfazer = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const extenso = (iso) => {
  // Data no fuso de São Paulo (a live é às 19h de Brasília)
  const [a, m, d] = new Date(iso).toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' }).split('-').map(Number);
  return `${d} de ${meses[m - 1]} de ${a}`;
};

const entradas = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(([, e]) => ({
  videoId: e.match(/<yt:videoId>([^<]+)/)?.[1],
  titulo: desfazer(e.match(/<title>([^<]*)/)?.[1] || ''),
  publicado: e.match(/<published>([^<]+)/)?.[1],
})).filter((e) => e.videoId && e.publicado);

// Ordena pela data de publicação, mais nova primeiro (não depende da ordem da playlist).
entradas.sort((a, b) => b.publicado.localeCompare(a.publicado));
const novas = entradas.slice(0, 3).map((e) => ({
  videoId: e.videoId,
  titulo: e.titulo,
  data: e.publicado.slice(0, 10),
  dataExtenso: extenso(e.publicado),
  miniatura: `/img/lives/${e.videoId}.jpg`,
}));

const atuais = JSON.parse(await readFile(arqLives, 'utf8'));
if (JSON.stringify(atuais) === JSON.stringify(novas)) {
  console.log('Nenhuma live nova.');
  process.exit(0);
}

await mkdir(pastaMini, { recursive: true });
for (const l of novas) {
  const r = await fetch(`https://i.ytimg.com/vi/${l.videoId}/mqdefault.jpg`);
  if (!r.ok) throw new Error(`Miniatura de ${l.videoId} respondeu ${r.status}`);
  await writeFile(path.join(pastaMini, `${l.videoId}.jpg`), Buffer.from(await r.arrayBuffer()));
}
// Apaga miniaturas que saíram da lista
const manter = new Set(novas.map((l) => `${l.videoId}.jpg`));
for (const f of await readdir(pastaMini)) if (f.endsWith('.jpg') && !manter.has(f)) await rm(path.join(pastaMini, f));

await writeFile(arqLives, JSON.stringify(novas, null, 2) + '\n');
console.log('Lives atualizadas:\n' + novas.map((l) => `- ${l.dataExtenso}: ${l.titulo}`).join('\n'));
