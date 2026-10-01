// Pré-visualização local de dist/, com os mesmos endereços do Netlify (/a-jornada → a-jornada.html).
// node scripts/serve.mjs  →  http://localhost:8080
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const tipos = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };
const porta = Number(process.env.PORT || 8080);

async function existe(p) { try { return (await stat(p)).isFile(); } catch { return false; } }

createServer(async (req, res) => {
  let url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (url.endsWith('/')) url += 'index.html';
  let arquivo = path.join(dist, path.normalize(url));
  if (!arquivo.startsWith(dist)) { res.writeHead(403).end(); return; }
  if (!(await existe(arquivo)) && (await existe(arquivo + '.html'))) arquivo += '.html';
  let status = 200;
  if (!(await existe(arquivo))) { arquivo = path.join(dist, '404.html'); status = 404; }
  res.writeHead(status, { 'content-type': tipos[path.extname(arquivo)] || 'application/octet-stream' });
  res.end(await readFile(arquivo));
}).listen(porta, () => console.log(`http://localhost:${porta}`));
