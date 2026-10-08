// Monta o site em dist/. Sem dependências: node scripts/build.mjs
import { readFile, writeFile, mkdir, cp, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { pagina, links, whatsappOrigens } from './partes.mjs';
import inicio from '../paginas/inicio.mjs';
import aJornada from '../paginas/a-jornada.mjs';
import sobre from '../paginas/sobre.mjs';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(raiz, 'dist');
const lerJson = async (p) => JSON.parse(await readFile(path.join(raiz, p), 'utf8'));

const cfg = await lerJson('site.config.json');
// No Netlify, URL é o endereço principal do site (hoje harmonizacaohumana.netlify.app; quando o domínio
// for ligado, passa a ser ele sozinho). Assim a imagem de compartilhamento, o canonical e o sitemap
// sempre apontam para um endereço que existe.
if (process.env.URL) cfg.dominio = process.env.URL.replace(/\/$/, '');
const depoimentos = await lerJson('data/depoimentos.json');
const lives = await lerJson('data/lives.json');
const guias = await lerJson('data/guias.json');
const L = links(cfg);

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(path.join(raiz, 'src'), dist, { recursive: true });

// Miniaturas dos depoimentos em vídeo: baixadas do YouTube na hora de montar o site e servidas
// pelo próprio site (a página não fala com o YouTube antes do toque). Se a rede falhar, o cartão
// mostra o fundo com o play, e o vídeo continua tocando.
for (const d of depoimentos) {
  if (d.prova !== 'video' || !d.videoId || d.imagem) continue;
  const destino = path.join(dist, 'img/depoimentos', `${d.videoId}.jpg`);
  for (const nome of ['oardefault.jpg', 'oar2.jpg', 'hq720.jpg', 'hqdefault.jpg']) {
    try {
      const r = await fetch(`https://i.ytimg.com/vi/${d.videoId}/${nome}`, { signal: AbortSignal.timeout(8000) });
      if (!r.ok) continue;
      await mkdir(path.dirname(destino), { recursive: true });
      await writeFile(destino, Buffer.from(await r.arrayBuffer()));
      d.imagem = `/img/depoimentos/${d.videoId}.jpg`;
      d.imagemVertical = nome.startsWith('oar');
      break;
    } catch { /* sem rede: segue sem miniatura */ }
  }
  if (!d.imagem) console.log(`Aviso: miniatura do depoimento de ${d.nome} não baixada (sem acesso ao YouTube)`);
}

const paginas = [inicio, aJornada, sobre].map((p) => p({ cfg, L, depoimentos, lives, guias }));
for (const p of paginas) {
  await writeFile(path.join(dist, p.arquivo), pagina({ cfg, L, ...p }));
}

// 404 simples, com o mesmo topo e rodapé
await writeFile(path.join(dist, '404.html'), pagina({
  cfg, L, atual: '', caminho: '/404', titulo: 'Página não encontrada | Harmonização Humana',
  descricao: 'Esta página não existe.', jsonld: { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Página não encontrada' },
  conteudo: `<section class="bloco"><div class="dentro estreito">
    <h1 class="grande">Esta página não existe.</h1>
    <p>Talvez o endereço tenha mudado. <a href="/">Voltar para o início</a>.</p>
  </div></section>`,
}).replace('<head>', '<head>\n<meta name="robots" content="noindex">'));

const hoje = new Date().toISOString().slice(0, 10);
await writeFile(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paginas.map((p) => `  <url><loc>${cfg.dominio}${p.caminho}</loc><lastmod>${hoje}</lastmod></url>`).join('\n')}
</urlset>
`);

// Todos os robôs liberados, inclusive os de IA (padrão da Trini, 25/09).
await writeFile(path.join(dist, 'robots.txt'), `User-agent: *
Allow: /

Sitemap: ${cfg.dominio}/sitemap.xml
`);

await writeFile(path.join(dist, 'llms.txt'), `# Harmonização Humana

> Uma experiência de leitura e transformação, conduzida por Filipe Morgado, para revelar o que precisa ser visto e trabalhar o que precisa mudar. Atendimento online, no Brasil. A leitura acontece sem informações prévias: a pessoa não precisa contar sua história nem chegar com uma pergunta.

Este trabalho não substitui o acompanhamento de médicos, psicólogos, psiquiatras e de outros profissionais de saúde. Não são feitas promessas de cura ou garantia de resultados.

## Páginas

- [Início](${cfg.dominio}/): o que é a leitura, como acontece (percepção, consciência, orientação, transformação), leituras ao vivo e depoimentos.
- [A Jornada](${cfg.dominio}/a-jornada): os três formatos (Mensagem em áudio, sessão individual por videochamada, Jornada de dez sessões) e como começar.
- [Sobre](${cfg.dominio}/sobre): quem é Filipe Morgado.

## Canais

- [Leituras ao vivo no YouTube, às quintas, 19h](${cfg.youtube})
- [Instagram](${cfg.instagram})
- [Contato pelo WhatsApp](${L.whatsapp})
`);

await writeFile(path.join(dist, 'site.webmanifest'), JSON.stringify({
  name: 'Harmonização Humana', short_name: 'Harmonização Humana', lang: 'pt-BR', start_url: '/',
  display: 'browser', background_color: '#FFF7E7', theme_color: '#082B61',
  icons: [{ src: '/icone-192.png', sizes: '192x192', type: 'image/png' }, { src: '/icone-512.png', sizes: '512x512', type: 'image/png' }],
}, null, 2));

// Avisos do que falta preencher
const avisos = [];
for (const d of depoimentos) {
  if (!d.trecho) avisos.push(`Depoimento de ${d.nome}: falta o trecho (data/depoimentos.json)`);
  if (d.prova === 'video' && !d.videoId) avisos.push(`Depoimento de ${d.nome}: falta o videoId e a imagem`);
  if (d.prova === 'print' && !d.imagem) avisos.push(`Depoimento de ${d.nome}: falta o print`);
}
if (!lives.length) avisos.push('Lives: data/lives.json vazio (a tarefa diária no GitHub preenche)');
if (!cfg.umamiWebsiteId) avisos.push('Umami: umamiWebsiteId vazio em site.config.json (estatística desligada)');

console.log(`Site montado em dist/ (${paginas.length} páginas).`);
if (avisos.length) console.log('Pendências:\n- ' + avisos.join('\n- '));

// WhatsApp por origem: whatsapp.harmonizacaohumana.com.br/site, /instagram, /youtube, /mensagem.
// A função do Netlify (netlify/edge-functions/whatsapp/) lê estes destinos, conta o acesso no Umami e
// redireciona (302). A raiz do subdomínio e qualquer outro caminho vão para a mensagem geral do site.
const destinos = whatsappOrigens(cfg);
await writeFile(path.join(raiz, 'netlify/edge-functions/whatsapp/destinos.js'),
  `// Gerado por scripts/build.mjs a partir de site.config.json. Não editar à mão.\n` +
  `export const destinos = ${JSON.stringify(destinos, null, 2)};\n` +
  `export const umamiWebsiteId = ${JSON.stringify(cfg.umamiWebsiteId || '')};\n` +
  `export const subdominio = ${JSON.stringify(cfg.whatsappSubdominio || '')};\n`);
if (cfg.whatsappSubdominio) {
  await writeFile(path.join(dist, '_redirects'),
    `# Gerado por scripts/build.mjs. Raiz e caminhos desconhecidos do subdomínio do WhatsApp: mensagem geral.\n` +
    `https://${cfg.whatsappSubdominio}/* ${destinos.site || L.whatsapp} 302!\n`);
}
