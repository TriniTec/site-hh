// Junta os resultados do Lighthouse (pasta passada como argumento) em docs/velocidade.md.
// Cada página roda 3 vezes em cada aparelho; o relatório usa a mediana do desempenho.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const pasta = process.argv[2];
const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const grupos = {};
for (const f of (await readdir(pasta)).filter((f) => f.endsWith('.json'))) {
  const r = JSON.parse(await readFile(path.join(pasta, f), 'utf8'));
  if (!r.categories?.performance) continue;
  const [pagina, aparelho] = f.replace(/-\d\.json$/, '').split(/-(?=celular|computador)/);
  (grupos[`${pagina}|${aparelho}`] ??= []).push(r);
}

const nomes = { inicio: 'Início', 'a-jornada': 'A Jornada', sobre: 'Sobre' };
const pct = (v) => (v == null ? '–' : Math.round(v * 100));
const seg = (a) => (a?.numericValue == null ? '–' : a.id === 'cumulative-layout-shift' ? a.numericValue.toFixed(3) : `${(a.numericValue / 1000).toFixed(1)} s`);
const linhas = [];
const avisos = new Set();
for (const chave of Object.keys(grupos).sort()) {
  const [pagina, aparelho] = chave.split('|');
  const rs = grupos[chave].sort((a, b) => a.categories.performance.score - b.categories.performance.score);
  const r = rs[Math.floor(rs.length / 2)];
  const c = r.categories, a = r.audits;
  linhas.push(`| ${nomes[pagina] ?? pagina} | ${aparelho} | ${pct(c.performance.score)} | ${pct(c.accessibility.score)} | ${pct(c['best-practices'].score)} | ${pct(c.seo.score)} | ${seg(a['first-contentful-paint'])} | ${seg(a['largest-contentful-paint'])} | ${seg(a['total-blocking-time'])} | ${seg(a['cumulative-layout-shift'])} | ${Math.round((a['total-byte-weight']?.numericValue ?? 0) / 1024)} KB |`);
  for (const cat of Object.values(c)) for (const ref of cat.auditRefs) {
    const au = a[ref.id];
    if (au && au.score !== null && au.score < 0.9 && ref.weight > 0) avisos.add(`${au.title} (${nomes[pagina] ?? pagina}, ${aparelho})`);
  }
}

const hoje = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', dateStyle: 'long', timeStyle: 'short' });
const md = `# Teste de velocidade do site

Último teste: **${hoje}**, no site no ar (https://harmonizacaohumana.com.br), com o Lighthouse ${Object.values(grupos)[0]?.[0]?.lighthouseVersion ?? ''}
(o mesmo motor do PageSpeed Insights do Google). Cada página rodou 3 vezes em cada aparelho; vale a do meio.
O "celular" simula um aparelho médio numa rede 4G lenta, de propósito mais duro que a vida real.

Para rodar de novo: GitHub → aba **Actions** → **Teste de velocidade** → **Run workflow**. Este arquivo se atualiza sozinho.

## Notas (0 a 100)

| Página | Aparelho | Desempenho | Acessibilidade | Boas práticas | SEO | 1º conteúdo | Maior conteúdo | Bloqueio | Estabilidade | Peso |
|---|---|---|---|---|---|---|---|---|---|---|
${linhas.join('\n')}

**Como ler:** 90 a 100 é verde (ótimo), 50 a 89 é laranja, abaixo de 50 é vermelho.
"Maior conteúdo" é quando a parte principal da tela aparece (bom: até 2,5 s). "Estabilidade" mede se a página
pula enquanto carrega (bom: até 0,1). "Bloqueio" é o tempo em que a página não responde ao toque (bom: até 0,2 s).

## Pontos abaixo de 90 apontados pelo teste

${avisos.size ? [...avisos].map((x) => `- ${x}`).join('\n') : 'Nenhum.'}
`;
await writeFile(path.join(raiz, 'docs/velocidade.md'), md);
console.log(md);
