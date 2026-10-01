// Página Início. Textos: documento 02, Parte 4 (v1.10).
// Ordem: reconhecer (1, 2), desarmar (3), entender (4, 5, 6), confiar (7, 8, 9), agir (10, 11).
import { esc, botaoConversar, jsonldBase, breadcrumb } from '../scripts/partes.mjs';

const playIcone = `<span class="depo__play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7 4.5v15l12-7.5z"/></svg></span>`;

function depoimento(d) {
  const pendente = !d.trecho || (d.prova === 'video' ? !d.videoId : !d.imagem);
  const trecho = d.trecho || '[Trecho do depoimento: a preencher em data/depoimentos.json]';
  let prova;
  if (d.prova === 'video') {
    prova = d.videoId
      ? `<button class="depo__prova" type="button" data-video="${esc(d.videoId)}" aria-label="Assistir ao depoimento de ${esc(d.nome)}" data-umami-event="depoimento-play">${d.imagem ? `<img src="${esc(d.imagem)}" alt="" loading="lazy" width="640" height="360">` : ''}${playIcone}</button>`
      : `<div class="depo__prova">${playIcone}</div>`;
  } else {
    prova = d.imagem
      ? `<a class="depo__prova depo__prova--print" href="${esc(d.imagem)}" target="_blank" rel="noopener" aria-label="Ampliar o print da conversa com ${esc(d.nome)}"><img src="${esc(d.imagem)}" alt="${esc(d.alt || 'Print da conversa com ' + d.nome)}" loading="lazy"></a>`
      : `<div class="depo__prova depo__prova--print" style="min-height:160px">Print do WhatsApp</div>`;
  }
  const transcricao = d.transcricao
    ? `<details><summary>Ler a transcrição</summary><div class="depo__transcricao">${d.transcricao.split(/\n\s*\n/).map((p) => `<p>${esc(p)}</p>`).join('')}</div></details>`
    : '';
  return `<figure class="cartao depo${pendente ? ' pendente' : ''}">
          <blockquote><p class="depo__trecho">${esc(trecho)}</p></blockquote>
          <figcaption class="depo__nome">${esc(d.nome)}</figcaption>
          ${prova}
          ${transcricao}
        </figure>`;
}

function cardLive(l, guias) {
  const guia = guias[l.videoId];
  return `<article class="cartao live">
          <img class="live__mini" src="${esc(l.miniatura)}" alt="" loading="lazy" width="320" height="180">
          <div class="live__corpo">
            <h3 class="live__titulo"><a href="https://www.youtube.com/watch?v=${esc(l.videoId)}" target="_blank" rel="noopener">${esc(l.titulo)}</a></h3>
            <p class="live__data">${esc(l.dataExtenso)}</p>
            ${guia ? `<a class="live__guia" href="${esc(guia)}" target="_blank" rel="noopener">Ver o guia da live</a>` : ''}
          </div>
        </article>`;
}

export default function inicio({ cfg, L, depoimentos, lives, guias }) {
  const base = jsonldBase(cfg);
  const videos = depoimentos
    .filter((d) => d.prova === 'video' && d.videoId)
    .map((d) => ({
      '@type': 'VideoObject',
      name: `Depoimento de ${d.nome}`,
      description: d.trecho,
      thumbnailUrl: cfg.dominio + d.imagem,
      embedUrl: `https://www.youtube-nocookie.com/embed/${d.videoId}`,
      contentUrl: `https://www.youtube.com/watch?v=${d.videoId}`,
      ...(d.uploadDate ? { uploadDate: d.uploadDate } : {}),
      ...(d.transcricao ? { transcript: d.transcricao } : {}),
    }));

  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [base.website, base.servico, base.person, breadcrumb(cfg, [['Início', '/']]), ...videos],
  };

  const conteudo = `
  <!-- 1 · Hero -->
  <section class="secao abertura">
    <div class="abertura__texto">
      <div>
        <h1 class="hero-titulo">Você sabe que quer mudar. Mas sozinha ainda não conseguiu.</h1>
        <p class="hero__sub">Uma experiência de leitura e transformação para revelar o que precisa ser visto e trabalhar o que precisa mudar.</p>
        ${botaoConversar(L, { evento: 'quero-conversar-hero' })}
      </div>
    </div>
    <div class="abertura__foto">
      <img src="/img/filipe-retrato-sorrindo-1200.webp"
           srcset="/img/filipe-retrato-sorrindo-640.webp 640w, /img/filipe-retrato-sorrindo-1200.webp 1200w, /img/filipe-retrato-sorrindo-1600.webp 1600w"
           sizes="100vw" width="1200" height="675" fetchpriority="high"
           alt="Filipe Morgado sorrindo, de camiseta amarela, diante de uma parede clara iluminada pelo sol.">
    </div>
  </section>

  <!-- 2 · Para quem é -->
  <section class="secao secao--areia" aria-labelledby="para-quem">
    <div class="secao__dentro">
      <h2 class="titulo" id="para-quem">Talvez isso faça sentido para você</h2>
      <ul class="lista">
        <li>Você sente que tem alguma coisa acontecendo, mas não consegue entender exatamente o quê.</li>
        <li>Você percebe padrões que continuam se repetindo, mesmo tentando fazer diferente.</li>
        <li>Você já tentou entender ou resolver isso por outros caminhos. Talvez até tenha entendido bastante coisa, e mesmo assim continua no mesmo lugar.</li>
        <li>Você chegou naquele ponto de dizer: chega. Eu quero mudar.</li>
        <li>Você busca uma luz, uma resposta para o que está vivendo agora.</li>
        <li>Você não sabe nem qual seria a pergunta, mas sente que existe algo que precisa ser visto.</li>
      </ul>
    </div>
  </section>

  <!-- 3 · Você não precisa saber qual é a pergunta -->
  <section class="secao" aria-labelledby="pergunta">
    <div class="secao__dentro secao__texto">
      <hr class="fio">
      <h2 class="titulo" id="pergunta">Você não precisa saber qual é a pergunta.</h2>
      <p>Você não precisa contar sua história, explicar o que está acontecendo ou chegar com uma questão definida.</p>
      <p>A leitura começa sem informações prévias, e isso faz parte do método: sem uma história contada antes, o que aparece chega mais livre de interpretação. É o próprio processo que revela aquilo que precisa ser percebido, inclusive coisas que você ainda não conseguia enxergar por conta própria.</p>
      <p class="fecho">A leitura conduz. Você só precisa estar presente.</p>
    </div>
  </section>

  <!-- 4 · O que acontece -->
  <section class="secao" data-tema="indigo" aria-labelledby="acontece">
    <div class="secao__dentro">
      <h2 class="titulo" id="acontece">O que acontece em uma leitura</h2>
      <ol class="etapas">
        <li><div><h3 class="etapas__nome">Percepção</h3><p>O processo acessa o campo, e aquilo que precisa aparecer começa a se revelar. Podem surgir sensações, emoções, imagens, símbolos, palavras, padrões, memórias ou orientações.</p></div></li>
        <li><div><h3 class="etapas__nome">Consciência</h3><p>O que apareceu é traduzido e compartilhado com você, de forma simples e compreensível.</p></div></li>
        <li><div><h3 class="etapas__nome">Orientação</h3><p>A leitura aprofunda até o ponto relevante e traz direção sobre aquilo que se revelou.</p></div></li>
        <li><div><h3 class="etapas__nome">Transformação</h3><p>Aquilo que precisa ser trabalhado é trabalhado energeticamente, ainda durante o processo.</p></div></li>
      </ol>
      <p class="forte">Não existe um roteiro fechado. Cada leitura encontra o próprio caminho.</p>
    </div>
  </section>

  <!-- 5 · A leitura não termina quando algo é revelado -->
  <section class="secao" aria-labelledby="nao-termina">
    <div class="secao__dentro secao__texto">
      <h2 class="titulo" id="nao-termina">A leitura não termina quando algo é revelado.</h2>
      <p>Muitas vezes, entender não basta. O que prende costuma estar mais fundo do que a compreensão alcança.</p>
      <p>Por isso aquilo que emerge é trabalhado energeticamente durante o próprio processo, buscando dissolver, transmutar, reorganizar e reprogramar o que precisa ser transformado. Para que você recupere a liberdade de escolher diferente.</p>
      <p class="fecho">Não é uma leitura e depois um tratamento. A transformação acontece dentro da leitura.</p>
    </div>
  </section>

  <!-- 6 · O que pode surgir -->
  <section class="secao secao--areia" aria-labelledby="pode-surgir">
    <div class="secao__dentro secao__texto">
      <h2 class="titulo" id="pode-surgir">Uma experiência espiritual, sem exigir que você conheça o universo espiritual</h2>
      <p>Durante o processo podem surgir diferentes formas de percepção e trabalho: aspectos intuitivos, energéticos e simbólicos, conteúdos relacionados aos Registros Akáshicos, orientações e outras informações relevantes para aquele momento.</p>
      <p>Nada disso é escolhido antes, nem por você, nem por mim. Os recursos se combinam dentro da própria leitura, conforme o que o processo revela.</p>
      <p class="fecho">Você não precisa conhecer nenhuma dessas práticas. Precisa apenas se abrir para a experiência.</p>
    </div>
  </section>

  <!-- 7 · Uma experiência humana -->
  <section class="secao" aria-labelledby="humana">
    <div class="secao__dentro duas">
      <div class="secao__texto">
        <h2 class="titulo" id="humana">Uma experiência humana. Profunda.</h2>
        <p>Você não precisa conhecer técnicas, dominar termos espirituais ou pertencer a nenhum grupo para viver uma leitura.</p>
        <p>O que aparece na leitura é dito de forma simples, com calma, sem promessa e sem espetáculo.</p>
        <p class="fecho">Sou Filipe Morgado. Eu me vejo como um Humano do Silêncio, aquele que restaura a Harmonia.</p>
        <p style="margin-top:var(--espaco-4)"><a class="botao botao--contorno" href="/sobre">Conhecer minha história</a></p>
      </div>
      <div class="duas__foto duas__foto--vertical">
        <img src="/img/filipe-sentado-sorrindo-640.webp"
             srcset="/img/filipe-sentado-sorrindo-640.webp 640w, /img/filipe-sentado-sorrindo-1000.webp 1000w"
             sizes="(min-width: 900px) 460px, 100vw" width="640" height="800" loading="lazy"
             alt="Filipe Morgado sentado, sorrindo, de camiseta amarela, numa sala clara com luz natural.">
      </div>
    </div>
  </section>

  <!-- 8 · Experiência ao vivo -->
  <section class="secao secao--areia" aria-labelledby="ao-vivo">
    <div class="secao__dentro">
      <div class="secao__texto">
        <h2 class="titulo" id="ao-vivo">Conheça a experiência ao vivo</h2>
        <p>Às quintas-feiras, às 19h, realizo leituras ao vivo pelo YouTube.</p>
        <p>São experiências mais curtas, abertas ao público, para que você possa conhecer o processo na prática, sem compromisso e sem precisar entender nada antes. Se estiver assistindo ao vivo e quiser receber uma leitura, é só escrever no chat.</p>
      </div>
      ${lives.length ? `<div class="grade-3">
        ${lives.slice(0, 3).map((l) => cardLive(l, guias)).join('\n        ')}
      </div>` : '<div style="height:var(--espaco-5)"></div>'}
      <a class="botao botao--contorno" href="${esc(L.playlist)}" target="_blank" rel="noopener">Ver todas as leituras</a>
    </div>
  </section>

  <!-- 9 · Depoimentos -->
  <section class="secao" aria-labelledby="depoimentos">
    <div class="secao__dentro">
      <h2 class="titulo" id="depoimentos">O que as pessoas dizem</h2>
      <div class="grade-3">
        ${depoimentos.map(depoimento).join('\n        ')}
      </div>
    </div>
  </section>

  <!-- 10 · A Jornada -->
  <section class="secao secao--areia" aria-labelledby="aprofundar">
    <div class="secao__dentro secao__texto">
      <h2 class="titulo" id="aprofundar">Quando você sente que é hora de aprofundar</h2>
      <p>A leitura pode ser vivida como uma experiência pontual ou como uma jornada de transformação ao longo do tempo.</p>
      <p style="margin-top:var(--espaco-4)"><a class="botao botao--contorno" href="/a-jornada">Conhecer a Jornada</a></p>
    </div>
  </section>

  <!-- 11 · Chamada final -->
  <section class="secao chamada" aria-labelledby="comecar">
    <div class="chamada__foto">
      <img src="/img/filipe-corpo-inteiro-640.webp"
           srcset="/img/filipe-corpo-inteiro-640.webp 640w, /img/filipe-corpo-inteiro-1200.webp 1200w"
           sizes="100vw" width="640" height="427" loading="lazy"
           alt="Filipe Morgado de pé, sorrindo, com as mãos nos bolsos, num ambiente claro e ensolarado.">
    </div>
    <div class="chamada__texto">
      <div>
        <h2 class="titulo" id="comecar">Você não precisa saber por onde começar.</h2>
        <p>Se você sente que chegou a hora de olhar mais profundamente para o que está acontecendo, podemos conversar.</p>
        <p style="margin-top:var(--espaco-4)">${botaoConversar(L, { evento: 'quero-conversar-final' })}</p>
      </div>
    </div>
  </section>`;

  return {
    caminho: '/',
    arquivo: 'index.html',
    atual: 'inicio',
    titulo: 'Leitura energética e transformação | Harmonização Humana',
    descricao: 'Você sabe que quer mudar, mas sozinha ainda não conseguiu. Leitura energética e transformação, sem precisar contar sua história.',
    jsonld,
    preload: ['<link rel="preload" as="image" href="/img/filipe-retrato-sorrindo-1200.webp" imagesrcset="/img/filipe-retrato-sorrindo-640.webp 640w, /img/filipe-retrato-sorrindo-1200.webp 1200w, /img/filipe-retrato-sorrindo-1600.webp 1600w" imagesizes="100vw" fetchpriority="high">'],
    conteudo,
  };
}
