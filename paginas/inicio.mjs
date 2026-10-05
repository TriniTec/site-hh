// Página Início · versão Solar.
// Do documento 02 fica a frase do Hero e a ordem de fundo (reconhecer, desarmar, entender, confiar, agir).
// O resto foi reescrito mais curto e mais visual, sem promessa de resultado.
import { esc, botaoConversar, jsonldBase, breadcrumb, sol } from '../scripts/partes.mjs';

const play = `<span class="depo__play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7 4.5v15l12-7.5z"/></svg></span>`;

function depoimento(d, i) {
  // Palavras das próprias pessoas, sem reescrever. O trecho em destaque sai da transcrição (data/depoimentos.json).
  const pronto = d.trecho && (d.prova === 'video' ? d.videoId : d.imagem);
  const trecho = d.trecho
    ? `<blockquote>${esc(d.trecho)}</blockquote>`
    : `<div class="depo__reservado" aria-hidden="true"><i></i><i></i><i></i></div>`;
  let prova;
  if (d.prova === 'video') {
    prova = d.videoId
      ? `<button class="depo__prova depo__prova--short" type="button" data-video="${esc(d.videoId)}" aria-label="Assistir ao depoimento de ${esc(d.nome)}" data-umami-event="depoimento-play">${d.imagem ? `<img src="${esc(d.imagem)}" alt="" loading="lazy">` : ''}${play}<span class="depo__selo">Depoimento em vídeo</span></button>`
      : `<div class="depo__prova depo__prova--vazia">${play}<span>Depoimento em vídeo</span></div>`;
  } else {
    prova = d.imagem
      ? `<a class="depo__prova depo__prova--print" href="${esc(d.imagem)}" data-ampliar="ampliado-${i}" aria-label="Ampliar o print da mensagem de ${esc(d.nome)}"><img src="${esc(d.miniatura || d.imagem)}" alt="${esc(d.alt || 'Print da mensagem de ' + d.nome)}" loading="lazy" width="640" height="650"><span class="depo__selo">Toque para ampliar</span></a>`
      : `<div class="depo__prova depo__prova--vazia"><span>Print da conversa no WhatsApp</span></div>`;
  }
  const paragrafos = (d.transcricao || '').split(/\n\s*\n/).map((p) => `<p>${esc(p)}</p>`).join('');
  // Vídeo: transcrição abre no próprio cartão. Print: abre grande na página (diálogo), com a mensagem inteira ao lado.
  const transcricao = !d.transcricao ? ''
    : d.prova === 'video'
      ? `<details><summary>Ler a transcrição</summary>${paragrafos}</details>`
      : `<button class="depo__ler" type="button" data-ampliar="ampliado-${i}">Ler a mensagem inteira</button>
         <dialog class="ampliado" id="ampliado-${i}" aria-label="Depoimento de ${esc(d.nome)}">
           <div class="ampliado__caixa">
             <button class="ampliado__fechar" type="button" data-fechar aria-label="Fechar">×</button>
             <div class="ampliado__print"><img src="${esc(d.imagem)}" alt="${esc(d.alt || 'Print da mensagem de ' + d.nome)}" loading="lazy"></div>
             <div class="ampliado__texto"><h2>${esc(d.nome)}</h2>${paragrafos}</div>
           </div>
         </dialog>`;
  return `<figure class="depo surge${pronto ? '' : ' depo--reservado'}" style="--atraso:${i * 0.1}s">${prova}${trecho}<figcaption>${esc(d.nome)}</figcaption>${transcricao}</figure>`;
}

function cardLive(l, guias, i) {
  const guia = guias[l.videoId];
  return `<article class="live surge" style="--atraso:${i * 0.1}s">
          <img src="${esc(l.miniatura)}" alt="" loading="lazy" width="320" height="180">
          <div class="live__corpo">
            <h3><a href="https://www.youtube.com/watch?v=${esc(l.videoId)}" target="_blank" rel="noopener">${esc(l.titulo)}</a></h3>
            <p>${esc(l.dataExtenso)}</p>
            ${guia ? `<a class="guia" href="${esc(guia)}" target="_blank" rel="noopener">Ver o guia da live</a>` : ''}
          </div>
        </article>`;
}

export default function inicio({ cfg, L, depoimentos, lives, guias }) {
  const base = jsonldBase(cfg);
  const prontos = depoimentos.filter((d) => d.trecho && (d.prova === 'video' ? d.videoId : d.imagem));
  const videos = prontos.filter((d) => d.prova === 'video').map((d) => ({
    '@type': 'VideoObject', name: `Depoimento de ${d.nome}`, description: d.trecho,
    ...(d.imagem ? { thumbnailUrl: cfg.dominio + d.imagem } : {}), embedUrl: `https://www.youtube-nocookie.com/embed/${d.videoId}`,
    contentUrl: `https://www.youtube.com/watch?v=${d.videoId}`,
    ...(d.uploadDate ? { uploadDate: d.uploadDate } : {}), ...(d.transcricao ? { transcript: d.transcricao } : {}),
  }));
  const jsonld = { '@context': 'https://schema.org', '@graph': [base.website, base.servico, base.person, breadcrumb(cfg, [['Início', '/']]), ...videos] };

  const palavras = ['Clareza', 'Movimento', 'Liberdade', 'Perceber', 'Transformar', 'Fluir'];
  const faixa = [...palavras, ...palavras, ...palavras, ...palavras].map((p) => `<span>${p}</span>`).join('');

  const conteudo = `
  <section class="abertura">
    <div class="dentro abertura__grade">
      <div>
        <p class="olho surge">Leitura e transformação</p>
        <h1 class="surge" style="--atraso:.08s">Você sabe que quer <em>mudar.</em><br>Mas sozinha ainda não conseguiu.</h1>
        <p class="lead surge" style="--atraso:.16s">Uma experiência de leitura e transformação para revelar o que precisa ser visto e trabalhar o que precisa mudar.</p>
        <div class="acoes surge" style="--atraso:.24s">
          ${botaoConversar(L, { evento: 'quero-conversar-hero' })}
          <a class="seta" href="#como">Como funciona <span aria-hidden="true">→</span></a>
        </div>
      </div>
      <div class="retrato surge" style="--atraso:.1s">
        <div class="retrato__halo"></div>
        ${sol({ id: 'h' })}
        <div class="retrato__foto">
          <img src="/img/filipe-rosto-800.webp" srcset="/img/filipe-rosto-480.webp 480w, /img/filipe-rosto-800.webp 800w"
               sizes="(min-width: 900px) 340px, 60vw" width="800" height="800" fetchpriority="high"
               alt="Filipe Morgado sorrindo, de camiseta amarela, numa parede clara iluminada pelo sol.">
        </div>
      </div>
    </div>
  </section>

  <div class="faixa" aria-hidden="true"><div class="faixa__trilho">${faixa}</div></div>

  <section class="bloco bloco--areia" aria-labelledby="espelho">
    <div class="dentro">
      <p class="olho surge">Talvez seja você</p>
      <h2 class="grande surge" id="espelho">Alguma dessas frases<br>já passou pela sua cabeça?</h2>
      <ul class="espelho">
        <li class="surge">Tem alguma coisa acontecendo comigo. Só não sei o quê.</li>
        <li class="surge" style="--atraso:.08s">O mesmo padrão volta. Mesmo quando eu tento fazer diferente.</li>
        <li class="surge" style="--atraso:.16s">Já entendi tanta coisa. E continuo no mesmo lugar.</li>
        <li class="surge">Chega. Eu quero mudar.</li>
        <li class="surge" style="--atraso:.08s">Eu só queria uma luz. Uma resposta para o que estou vivendo.</li>
        <li class="surge" style="--atraso:.16s">Eu nem sei qual seria a pergunta.</li>
      </ul>
      <p class="espelho__fecho surge">Alguma delas é sua? A boa notícia vem a seguir.</p>
    </div>
  </section>

  <section class="bloco declaracao" data-tema="indigo" aria-labelledby="pergunta">
    <div class="declaracao__luz" aria-hidden="true">${sol({ id: 'd', raios: 48, onda: 1.2 })}</div>
    <div class="dentro">
      <h2 class="surge" id="pergunta">Você não precisa saber a <span class="ouro">pergunta.</span></h2>
      <p class="lead surge">Nem contar sua história. A leitura começa sem nada prévio, e é o próprio processo que revela o que precisa ser visto. Inclusive o que você ainda não conseguia enxergar sozinha.</p>
      <p class="assinatura surge">A leitura conduz. Você só precisa estar presente.</p>
    </div>
  </section>

  <section class="bloco" id="como" aria-labelledby="como-titulo">
    <div class="dentro">
      <p class="olho surge">Como acontece</p>
      <h2 class="grande surge" id="como-titulo">Do que aparece<br>ao que se transforma.</h2>
      <div class="caminho-caixa">
        <span class="caminho__linha" aria-hidden="true"><i></i></span>
        <ol class="caminho">
          <li class="surge"><h3>Percepção</h3><p>O que precisa aparecer começa a se revelar: sensações, imagens, palavras, padrões, memórias.</p></li>
          <li class="surge" style="--atraso:.1s"><h3>Consciência</h3><p>Eu traduzo o que aparece e compartilho com você, de forma simples.</p></li>
          <li class="surge" style="--atraso:.2s"><h3>Orientação</h3><p>A leitura aprofunda até o ponto que importa e traz direção.</p></li>
          <li class="surge" style="--atraso:.3s"><h3>Transformação</h3><p>O que precisa ser trabalhado é trabalhado ali mesmo, ainda durante a leitura.</p></li>
        </ol>
      </div>
      <p class="caminho__fecho surge">Não existe roteiro. Cada leitura encontra o próprio caminho.</p>
    </div>
  </section>

  <section class="bloco bloco--areia basta" aria-labelledby="basta">
    <div class="dentro">
      <div class="par basta__topo">
        <h2 class="citacao surge" id="basta">Entender<br>não basta.</h2>
        <p class="basta__frase surge" style="--atraso:.1s">O que prende costuma estar <strong>mais fundo</strong> do que a compreensão alcança.</p>
      </div>
      <ol class="basta__passos">
        <li class="surge"><span>1</span><em><b>Ver</b> o que prende</em></li>
        <li class="surge" style="--atraso:.1s"><span>2</span><em><b>Soltar</b> o que trava</em></li>
        <li class="surge" style="--atraso:.2s"><span>3</span><em><b>Escolher</b> diferente</em></li>
      </ol>
      <div class="par basta__fim">
        <p class="lead surge">Por isso, o que emerge na leitura é trabalhado energeticamente, buscando dissolver, transmutar e reprogramar o que trava. Para você recuperar a <strong>liberdade de escolher diferente.</strong></p>
        <p class="basta__selo surge" style="--atraso:.1s">Não é uma leitura e depois um tratamento. <span>A transformação acontece dentro da leitura.</span></p>
      </div>
    </div>
  </section>

  <section class="bloco surgir" aria-labelledby="surgir">
    <div class="dentro">
      <p class="olho surge">Uma experiência espiritual</p>
      <h2 class="grande surge" id="surgir">Nada é escolhido antes.<br><span class="laranja">Nem por você, nem por mim.</span></h2>
      <div class="par surgir__par">
        <p class="lead surge">Durante a leitura podem surgir aspectos intuitivos, energéticos e simbólicos, conteúdos dos Registros Akáshicos, orientações. Não é um cardápio: os recursos se combinam dentro da própria leitura, conforme o que o processo revela.</p>
        <p class="lead forte surge" style="--atraso:.1s">Você não precisa conhecer nenhuma dessas práticas. Nem pertencer a nenhum grupo. Só se abrir para a experiência.</p>
      </div>
    </div>
  </section>

  <section class="bloco bloco--areia" aria-labelledby="filipe">
    <div class="dentro par par--foto-esq">
      <div class="surge">
        <p class="olho">Quem conduz</p>
        <h2 class="oi" id="filipe">Oi, meu nome é Filipe.</h2>
        <p class="lead">Escuto antes de interferir. Percebo antes de interpretar. O que aparece na leitura eu digo de forma simples, com calma, sem promessa e sem espetáculo.</p>
        <p class="filipe__marca">Sou um Humano do Silêncio, aquele que restaura a Harmonia.</p>
        <a class="seta" href="/sobre">Conhecer minha história <span aria-hidden="true">→</span></a>
      </div>
      <div class="filipe__foto surge" style="--atraso:.1s">
        <img src="/img/filipe-sentado-sorrindo-640.webp" srcset="/img/filipe-sentado-sorrindo-640.webp 640w, /img/filipe-sentado-sorrindo-1000.webp 1000w"
             sizes="(min-width: 900px) 480px, 100vw" width="640" height="800" loading="lazy"
             alt="Filipe Morgado sentado, sorrindo, de camiseta amarela, numa sala clara com luz natural.">
        <span class="filipe__selo"><img src="/img/hh-logo-96.webp" width="32" height="32" alt="">Filipe Morgado</span>
      </div>
    </div>
  </section>

  <section class="bloco ao-vivo" data-tema="indigo" aria-labelledby="vivo">
    <div class="dentro">
      <div class="par">
        <div class="surge">
          <p class="selo-vivo"><i></i>Ao vivo no YouTube · quintas, 19h</p>
          <h2 class="grande" id="vivo">Veja uma leitura <span class="ouro">acontecendo.</span></h2>
        </div>
        <div class="surge" style="--atraso:.1s">
          <p class="lead">Toda quinta, às 19h, eu faço leituras ao vivo no YouTube. É aberto, de graça, sem compromisso e sem precisar entender nada antes. Quer receber uma? É só escrever no chat.</p>
          <p style="margin-top:32px"><a class="botao botao--claro botao--yt" href="${esc(lives.length ? L.playlist : cfg.youtube)}" target="_blank" rel="noopener"><svg class="yt" viewBox="0 0 28 20" aria-hidden="true"><rect width="28" height="20" rx="5" fill="#FF0000"/><path d="M11.2 5.6v8.8l7.4-4.4z" fill="#fff"/></svg>Assistir no YouTube</a></p>
        </div>
      </div>
      ${lives.length ? `<div class="lives">${lives.slice(0, 3).map((l, i) => cardLive(l, guias, i)).join('')}</div>` : ''}
    </div>
  </section>

  <section class="bloco" aria-labelledby="dizem">
    <div class="dentro">
      <div class="par" style="align-items:end">
        <div>
          <p class="olho surge">Quem já viveu</p>
          <h2 class="grande surge" id="dizem">O que as pessoas dizem</h2>
        </div>
        <p class="lead surge" style="--atraso:.1s">O que mais aparece nas palavras de quem passou pela leitura não é espetáculo. É <span class="forte">clareza, precisão, acolhimento e direção.</span></p>
      </div>
      <div class="depos">${depoimentos.map(depoimento).join('')}</div>
    </div>
  </section>

  <section class="bloco bloco--areia" aria-labelledby="comecar-titulo">
    <div class="dentro">
      <p class="olho surge">Por onde começar</p>
      <h2 class="grande surge" id="comecar-titulo">Uma leitura. Ou uma jornada.</h2>
      <div class="formatos">
        <article class="formato surge">
          <p class="formato__tag">Cerca de 1 hora · por vídeo</p>
          <h3>Sessão individual</h3>
          <p>Uma leitura completa, para o seu momento. Para olhar algo mais pontual ou sentir como o processo funciona. Sem preparar nada.</p>
          <p class="empurra"><a class="seta" href="/a-jornada#sessao">Como é <span aria-hidden="true">→</span></a></p>
        </article>
        <article class="formato formato--destaque surge" style="--atraso:.1s">
          <span class="formato__recomendada">Recomendada</span>
          <p class="formato__tag">10 semanas · 1 por semana</p>
          <h3>A Jornada</h3>
          <p>Para quem quer mudar profundamente. Dez semanas em que o trabalho vai fundo, camada por camada, buscando a transformação.</p>
          <p class="empurra"><a class="seta" href="/a-jornada#jornada">Como é <span aria-hidden="true">→</span></a></p>
        </article>
        <article class="formato surge" style="--atraso:.2s">
          <p class="formato__tag">Na dúvida</p>
          <h3>Vamos conversar</h3>
          <p>Você me conta, do seu jeito, o que trouxe você até aqui. E a gente vê junto qual formato faz sentido agora.</p>
          <p class="empurra">${botaoConversar(L, { evento: 'quero-conversar-formatos' })}</p>
        </article>
      </div>
    </div>
  </section>

  <section class="final" aria-labelledby="final">
    <div class="final__foto">
      <img src="/img/filipe-corpo-inteiro-640.webp" srcset="/img/filipe-corpo-inteiro-640.webp 640w, /img/filipe-corpo-inteiro-1200.webp 1200w"
           sizes="100vw" width="640" height="427" loading="lazy"
           alt="Filipe Morgado de pé, sorrindo, com as mãos nos bolsos, num ambiente claro e ensolarado.">
    </div>
    <div class="dentro final__texto">
      <div class="surge">
        <h2 id="final">Você não precisa saber por onde começar.</h2>
        <p class="lead">Sente que chegou a hora de olhar mais fundo para o que está acontecendo? Então vamos conversar.</p>
        ${botaoConversar(L, { evento: 'quero-conversar-final' })}
      </div>
    </div>
  </section>`;

  return {
    caminho: '/', arquivo: 'index.html', atual: 'inicio',
    titulo: 'Leitura energética e transformação | Harmonização Humana',
    descricao: 'Você sabe que quer mudar, mas sozinha ainda não conseguiu. Leitura energética e transformação, sem precisar contar sua história.',
    jsonld,
    preload: ['<link rel="preload" as="image" href="/img/filipe-rosto-800.webp" imagesrcset="/img/filipe-rosto-480.webp 480w, /img/filipe-rosto-800.webp 800w" imagesizes="(min-width: 900px) 340px, 60vw" fetchpriority="high">'],
    conteudo,
  };
}
