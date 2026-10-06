// Gera o HTML da apresentação em PDF (texto longo do documento 02, com as regras de linguagem e os
// textos já revisados do site). Saída: docs/apresentacao/apresentacao.html.
// Para virar PDF: abrir no Chromium e imprimir em A4 (o site usa src/harmonizacao-humana-apresentacao.pdf).
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { sol, links, esc, youtubeIcone, instagramIcone, whatsappIcone } from './partes.mjs';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cfg = JSON.parse(await readFile(path.join(raiz, 'site.config.json'), 'utf8'));
const depoimentos = JSON.parse(await readFile(path.join(raiz, 'data/depoimentos.json'), 'utf8'));
const L = links(cfg);
const src = (p) => '../../src/' + p;

const css = `
@font-face { font-family: "DM Sans"; src: url(${src('fonts/DMSans-Medium.woff2')}) format("woff2"); font-weight: 500; }
@font-face { font-family: "DM Sans"; src: url(${src('fonts/DMSans-Bold.woff2')}) format("woff2"); font-weight: 700; }
@font-face { font-family: "Manrope"; src: url(${src('fonts/Manrope-Regular.woff2')}) format("woff2"); font-weight: 400; }
@font-face { font-family: "Manrope"; src: url(${src('fonts/Manrope-SemiBold.woff2')}) format("woff2"); font-weight: 600; }
@page { size: A4; margin: 0; }
:root { --indigo: #082B61; --indigo-fundo: #061F47; --ouro: #D6A332; --laranja: #E87716; --marfim: #FFF7E7; --areia: #EFD79A; --brilho: #FECD41; }
* { box-sizing: border-box; }
html, body { margin: 0; background: var(--marfim); color: var(--indigo); -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { font-family: Manrope, sans-serif; font-size: 11pt; line-height: 1.55; }
h1, h2, h3, .t { font-family: "DM Sans", sans-serif; font-weight: 700; letter-spacing: -.02em; line-height: 1.08; margin: 0; }
p { margin: 0 0 10pt; }
.pagina { width: 210mm; height: 297mm; padding: 20mm 22mm 14mm; position: relative; overflow: hidden; page-break-after: always; display: flex; flex-direction: column; }
.pagina:last-child { page-break-after: auto; }
.indigo { background: var(--indigo); color: var(--marfim); }
.areia { background: var(--areia); }
.olho { font-family: "DM Sans"; font-weight: 700; font-size: 8.5pt; letter-spacing: .18em; text-transform: uppercase; color: var(--laranja); margin-bottom: 8mm; }
.indigo .olho { color: var(--brilho); }
h2 { font-size: 28pt; margin-bottom: 7mm; max-width: 15em; }
h3 { font-size: 15pt; margin: 0 0 3mm; }
.ouro { color: var(--ouro); } .indigo .ouro { color: var(--brilho); } .laranja { color: var(--laranja); }
.lead { font-size: 14pt; line-height: 1.5; max-width: 32em; }
.sol { position: absolute; width: 100%; height: 100%; inset: 0; }
.solzinho { position: absolute; width: 150mm; height: 150mm; right: -45mm; top: -45mm; opacity: .9; }
.rodape-pag { margin-top: auto; display: flex; justify-content: space-between; font-size: 8pt; opacity: .7; padding-top: 6mm; }
/* capa */
.capa { padding: 0; }
.capa__foto { position: absolute; left: 0; bottom: 0; width: 210mm; height: 118.1mm; object-fit: cover; }
.capa__fade { position: absolute; left: 0; right: 0; bottom: 88mm; height: 32mm; background: linear-gradient(var(--indigo), rgba(8, 43, 97, 0)); z-index: 0; }
.capa__texto { position: relative; padding: 24mm 22mm; z-index: 1; }
.capa__marca { display: flex; align-items: center; gap: 4mm; font-family: "DM Sans"; font-weight: 700; font-size: 13pt; margin-bottom: 22mm; }
.capa__marca img { width: 14mm; height: 14mm; }
.capa h1 { font-size: 40pt; max-width: 10em; margin-bottom: 7mm; }
.capa .lead { max-width: 24em; font-size: 13pt; }
.capa__sol { position: absolute; width: 170mm; height: 170mm; right: -70mm; top: -60mm; opacity: .45; }
.capa__assinatura { margin-top: 9mm; font-family: "DM Sans"; font-weight: 700; font-size: 11pt; }
.capa__assinatura span { display: block; font-family: Manrope; font-weight: 400; font-size: 9.5pt; opacity: .8; }
/* listas */
.espelho { list-style: none; padding: 0; margin: 0; display: grid; gap: 3mm; }
.espelho li { background: #fff; border-radius: 5mm; padding: 4mm 6mm 4mm 14mm; position: relative; font-size: 12pt; line-height: 1.45; }
.espelho li::before { content: ""; position: absolute; left: 6mm; top: 6mm; width: 3mm; height: 3mm; border-radius: 50%; background: var(--laranja); }
.etapas { list-style: none; padding: 0; margin: 2mm 0 6mm; display: grid; grid-template-columns: 1fr 1fr; gap: 5mm; counter-reset: e; }
.etapas li { background: rgba(255, 247, 231, .08); border: 1px solid rgba(254, 205, 65, .3); border-radius: 5mm; padding: 6mm; counter-increment: e; }
.etapas li::before { content: "0" counter(e); font-family: "DM Sans"; font-weight: 700; color: var(--brilho); font-size: 10pt; display: block; margin-bottom: 2mm; }
.etapas h3 { color: var(--marfim); }
.selo { display: inline-block; background: var(--laranja); color: #fff; border-radius: 99px; padding: 3mm 6mm; font-family: "DM Sans"; font-weight: 700; font-size: 11pt; margin-top: 4mm; }
.verbos { display: flex; gap: 4mm; margin: 6mm 0; }
.verbos div { flex: 1; background: #fff; border-radius: 5mm; padding: 5mm; }
.verbos b { font-family: "DM Sans"; font-size: 15pt; color: var(--laranja); display: block; }
.formatos { display: grid; gap: 5mm; }
.formato { background: #fff; border-radius: 6mm; padding: 5mm 7mm; }
.formato--destaque { background: var(--indigo); color: var(--marfim); }
.formato__tag { font-family: "DM Sans"; font-weight: 700; font-size: 8.5pt; letter-spacing: .14em; text-transform: uppercase; color: var(--laranja); margin-bottom: 2mm; }
.formato--destaque .formato__tag { color: var(--brilho); }
.formato h3 { font-size: 18pt; }
.formato p { font-size: 10pt; margin-bottom: 5pt; }
.formato__nota { font-style: italic; opacity: .8; }
.linha { display: grid; grid-template-columns: 1fr 1fr; gap: 6mm; margin-top: 4mm; }
.linha > div { border-top: 2px solid var(--brilho); padding-top: 3mm; }
.linha p { font-size: 10pt; }
.linha b { font-family: "DM Sans"; color: var(--brilho); font-size: 9pt; letter-spacing: .12em; text-transform: uppercase; }
.chips { list-style: none; padding: 0; margin: 3mm 0 0; display: flex; flex-wrap: wrap; gap: 2.5mm; }
.chips li { border: 1px solid rgba(255, 247, 231, .4); border-radius: 99px; padding: 1.8mm 4mm; font-size: 9.5pt; }
.depos { display: grid; gap: 6mm; }
.depo { margin: 0; background: #fff; border-radius: 6mm; padding: 5mm; display: grid; gap: 6mm; }
.depo--video { grid-template-columns: 40mm 1fr; align-items: start; }
.depo--print { grid-template-columns: 74mm 1fr; align-items: start; }
.depo__capa { position: relative; display: block; border-radius: 4mm; overflow: hidden; }
.depo__capa img { width: 100%; display: block; aspect-ratio: 9 / 16; object-fit: cover; }
.depo__play { position: absolute; left: 50%; top: 50%; width: 15mm; height: 10.6mm; transform: translate(-50%, -50%); }
.depo__play svg { width: 100%; height: 100%; display: block; }
.depo__print { width: 100%; border-radius: 3mm; display: block; }
.depo cite { font-style: normal; font-family: "DM Sans"; font-weight: 700; font-size: 13pt; color: var(--laranja); display: block; margin-bottom: 2mm; }
.depo__texto p { font-size: 9.4pt; line-height: 1.45; margin-bottom: 4pt; }
.depo__link { display: inline-block; margin-top: 2mm; font-family: "DM Sans"; font-weight: 700; font-size: 10pt; color: var(--indigo); text-decoration: none; border-bottom: 2px solid var(--laranja); padding-bottom: 1mm; }
.depo__fonte { font-size: 8.5pt; opacity: .7; margin-top: 3mm; }
.vivo { margin-top: 10mm; }
.retrato { position: absolute; right: 22mm; top: 20mm; width: 46mm; height: 46mm; border-radius: 50%; object-fit: cover; }
.contato { display: grid; gap: 4mm; margin-top: 6mm; }
.contato a { display: flex; align-items: center; gap: 4mm; color: inherit; text-decoration: none; background: rgba(255, 247, 231, .08); border-radius: 5mm; padding: 4.5mm 6mm; font-family: "DM Sans"; font-weight: 700; font-size: 12.5pt; }
.contato a span { display: block; font-family: Manrope; font-weight: 400; font-size: 9.5pt; opacity: .8; }
.contato svg { width: 8mm; height: 8mm; flex: none; color: var(--brilho); }
.aviso { font-size: 8.5pt; opacity: .75; max-width: 40em; margin-top: auto; }
`;

const capa = `
<section class="pagina capa indigo">
  <div class="capa__sol">${sol({ id: 'c', raios: 40, onda: 1.6 })}</div>
  <img class="capa__foto" src="${src('img/filipe-retrato-sorrindo-1600.webp')}" alt="">
  <div class="capa__fade"></div>
  <div class="capa__texto">
    <p class="capa__marca"><img src="${src('img/hh-logo-192.webp')}" alt="">Harmonização Humana</p>
    <h1>Você sabe que quer mudar. <span class="ouro">Mas sozinha ainda não conseguiu.</span></h1>
    <p class="lead">Uma experiência de leitura e transformação para revelar o que precisa ser visto e trabalhar o que precisa mudar.</p>
    <p class="capa__assinatura">Filipe Morgado<span>harmonizacaohumana.com.br</span></p>
  </div>
</section>`;

const rodapePag = (n) => `<div class="rodape-pag"><span>Harmonização Humana · Filipe Morgado</span><span>${n}</span></div>`;

const p2 = `
<section class="pagina">
  <p class="olho">Para quem é</p>
  <h2>Talvez isso faça sentido <span class="laranja">para você.</span></h2>
  <ul class="espelho">
    <li>Você sente que tem alguma coisa acontecendo, mas não consegue entender exatamente o quê.</li>
    <li>Você percebe padrões que continuam se repetindo, mesmo tentando fazer diferente.</li>
    <li>Você já tentou entender ou resolver isso por outros caminhos. Talvez até tenha entendido bastante coisa, e mesmo assim continua no mesmo lugar.</li>
    <li>Você chegou naquele ponto de dizer: chega. Eu quero mudar.</li>
    <li>Você busca uma luz, uma resposta para o que está vivendo agora.</li>
    <li>Você não sabe nem qual seria a pergunta, mas sente que existe algo que precisa ser visto.</li>
  </ul>
  <div style="margin-top:9mm">
    <h3 style="font-size:19pt">Você não precisa saber qual é a pergunta.</h3>
    <p>Você não precisa contar sua história, explicar o que está acontecendo ou chegar com uma questão definida.</p>
    <p>A leitura começa sem informações prévias, e isso faz parte do método: sem uma história contada antes, o que aparece chega mais livre de interpretação. É o próprio processo que revela aquilo que precisa ser percebido, inclusive coisas que você ainda não conseguia enxergar por conta própria.</p>
    <p><b>A leitura conduz. Você só precisa estar presente.</b></p>
  </div>
  ${rodapePag(2)}
</section>`;

const p3 = `
<section class="pagina indigo">
  <p class="olho">Como funciona</p>
  <h2>O que acontece em <span class="ouro">uma leitura.</span></h2>
  <ol class="etapas">
    <li><h3>Percepção</h3><p>O processo acessa o campo, e aquilo que precisa aparecer começa a se revelar. Podem surgir sensações, emoções, imagens, símbolos, palavras, padrões, memórias ou orientações.</p></li>
    <li><h3>Consciência</h3><p>O que apareceu é traduzido e compartilhado com você, de forma simples e compreensível.</p></li>
    <li><h3>Orientação</h3><p>A leitura aprofunda até o ponto relevante e traz direção sobre aquilo que se revelou.</p></li>
    <li><h3>Transformação</h3><p>Aquilo que precisa ser trabalhado é trabalhado energeticamente, ainda durante o processo.</p></li>
  </ol>
  <p class="lead">Não existe um roteiro fechado. Cada leitura encontra o próprio caminho.</p>
  ${rodapePag(3)}
</section>`;

const p4 = `
<section class="pagina">
  <p class="olho">Entender não basta</p>
  <h2>A leitura não termina quando algo <span class="laranja">é revelado.</span></h2>
  <p class="lead">Muitas vezes, entender não basta. O que prende costuma estar mais fundo do que a compreensão alcança.</p>
  <p>Por isso aquilo que emerge é trabalhado energeticamente durante o próprio processo, buscando dissolver, transmutar, reorganizar e reprogramar o que precisa ser transformado. Para que você recupere a liberdade de escolher diferente.</p>
  <div class="verbos">
    <div><b>Ver</b>o que prende</div>
    <div><b>Soltar</b>o que trava</div>
    <div><b>Escolher</b>diferente</div>
  </div>
  <p>Não é uma leitura e depois um tratamento. <span class="selo">A transformação acontece dentro da leitura.</span></p>
  <div style="margin-top:12mm">
    <h3 style="font-size:20pt">Uma experiência espiritual, sem exigir que você conheça o universo espiritual.</h3>
    <p>Durante o processo podem surgir diferentes formas de percepção e trabalho: aspectos intuitivos, energéticos e simbólicos, conteúdos relacionados aos Registros Akáshicos, orientações e outras informações relevantes para aquele momento.</p>
    <p><b>Nada é escolhido antes. Nem por você, nem por mim.</b> Os recursos se combinam dentro da própria leitura, conforme o que o processo revela.</p>
    <p>Você não precisa conhecer nenhuma dessas práticas. Precisa apenas se abrir para a experiência.</p>
  </div>
  ${rodapePag(4)}
</section>`;

const p5 = `
<section class="pagina">
  <p class="olho">Formatos</p>
  <h2>Escolha por onde <span class="laranja">começar.</span></h2>
  <div class="formatos">
    <div class="formato">
      <p class="formato__tag">Até 5 minutos · em áudio</p>
      <h3>Mensagem</h3>
      <p>Uma mensagem curta, enviada em áudio. Você não precisa marcar horário nem estar presente. Envia seu nome completo e sua data de nascimento, e eu devolvo o que aparecer para você naquele momento.</p>
      <p>É para quando você busca uma luz, uma orientação, uma resposta. ${esc(cfg.mensagemPrazo)}</p>
      <p class="formato__nota">A Mensagem aponta. A sessão trabalha. São experiências e profundidades diferentes.</p>
    </div>
    <div class="formato">
      <p class="formato__tag">Cerca de 1 hora · videochamada</p>
      <h3>Sessão individual</h3>
      <p><b>Uma leitura completa para o seu momento.</b> Você pode viver a experiência de forma independente, sem compromisso de continuidade. Não precisa preparar nada, não precisa chegar com um problema definido, não precisa contar sua história.</p>
      <p>Nos primeiros minutos eu explico como vai ser. Depois a leitura flui: eu traduzo em voz alta o que aparece, e você recebe. Quando possível, abro espaço para uma pergunta. Já no primeiro encontro pode começar a surgir clareza sobre o que está acontecendo, durante ou depois da sessão.</p>
    </div>
    <div class="formato formato--destaque">
      <p class="formato__tag">Recomendada · 10 sessões · 1 por semana</p>
      <h3>A Jornada</h3>
      <p><b>Para quem quer mudar profundamente.</b> Dez sessões de aproximadamente uma hora, uma por semana. É a forma recomendada para quem deseja aprofundar o processo, permitindo que o trabalho se desenvolva ao longo do tempo e que diferentes camadas sejam acessadas e trabalhadas progressivamente.</p>
      <p>Os horários são limitados: cada jornada ocupa o mesmo horário durante dez semanas.</p>
    </div>
  </div>
  ${rodapePag(5)}
</section>`;

const p6 = `
<section class="pagina indigo">
  <p class="olho">A Jornada · 10 semanas</p>
  <h2>Como a Jornada <span class="ouro">se desenvolve.</span></h2>
  <p class="lead">O trabalho se desenvolve ao longo do tempo: diferentes camadas são acessadas e trabalhadas, progressivamente.</p>
  <div class="linha">
    <div><b>Sessões 1 a 4</b><h3 style="margin-top:2mm">Começa aberta</h3><p>O processo começa de forma aberta, sem que você precise trazer um tema. Essas sessões permitem uma organização mais ampla, deixando que o próprio processo revele o que precisa ser trabalhado.</p></div>
    <div><b>Sessões 5 a 10</b><h3 style="margin-top:2mm">Você indica o território</h3><p>A partir daí, caso faça sentido, você pode trazer um tema amplo para aprofundamento: relacionamentos, trabalho, família, prosperidade, autoestima ou outro aspecto importante da sua vida.</p></div>
  </div>
  <p style="margin-top:6mm"><b class="ouro">Você pode trazer um tema. Não precisa trazer uma história.</b> Não é necessário narrar o que aconteceu, explicar o contexto ou detalhar a situação. Basta indicar o território. O processo conduz o restante.</p>
  <h3 style="margin-top:6mm">O que a Jornada busca</h3>
  <div class="linha" style="margin-top:2mm">
    <div><b>Ver</b><ul class="chips"><li>Mais consciência sobre si</li><li>Clareza sobre padrões que se repetem</li><li>Novas perspectivas</li><li>Orientação</li></ul></div>
    <div><b>Transformar</b><ul class="chips"><li>Dissolver e reprogramar o que trava</li><li>Transformar o que se revela</li><li>Movimento onde havia estagnação</li><li>Liberdade para escolher diferente</li></ul></div>
  </div>
  <p class="lead" style="margin-top:6mm;font-size:13pt">A Jornada existe para a transformação acontecer. Soltar o que prende e abrir espaço para uma nova versão de você. Cada processo é único e o resultado só se conhece percorrendo o caminho.</p>
  ${rodapePag(6)}
</section>`;

const p7 = `
<section class="pagina">
  <p class="olho">Quem conduz</p>
  <h2 style="max-width:9.5em">Um Humano do Silêncio, aquele que restaura <span class="laranja">a Harmonia.</span></h2>
  <img class="retrato" src="${src('img/filipe-rosto-800.webp')}" alt="">
  <p class="lead">Meu nome é Filipe Morgado.</p>
  <p>Alguém que busca escutar antes de interferir, perceber antes de interpretar e compreender antes de agir. Meu trabalho é ajudar a restaurar a harmonia quando algo deixou de fluir.</p>
  <p>Minha trajetória passou pela engenharia e pela computação. Depois pela fotografia, que foi o que me fez olhar para mim mesmo e abriu o caminho. Vieram os passeios e as viagens fotográficas, e com eles uma forma diferente de perceber. Foi por aí que a espiritualidade chegou, e depois o trabalho terapêutico.</p>
  <p>Não vejo essas coisas como fases separadas. Racionalidade e intuição, estrutura e sensibilidade, tecnologia e espiritualidade: para mim são partes da mesma Humanidade.</p>
  <p>Talvez por isso eu não me encaixe perfeitamente na bolha espiritual, nem em nenhuma outra. E talvez seja exatamente isso que permite que este trabalho aconteça de forma simples, humana e sem espetáculo.</p>
  <p><b>Meu trabalho não está preso a uma técnica.</b> Cada pessoa apresenta um campo diferente, e o processo conduz aquilo que precisa ser visto e trabalhado. A ferramenta mais adequada surge dentro do processo, não antes dele.</p>
    ${rodapePag(7)}
</section>`;

const yt = (d) => `https://youtube.com/shorts/${d.videoId}`;
const paragrafos = (t) => t.split(/\n\n+/).map((x) => `<p>${esc(x).replace(/\n/g, '<br>')}</p>`).join('');
const depoVideo = (d) => `
  <figure class="depo depo--video">
    <a class="depo__capa" href="${yt(d)}"><img src="${src(d.imagem.replace(/^\//, ''))}" alt=""><span class="depo__play"><svg viewBox="0 0 68 48"><path d="M66.5 7.7a8.6 8.6 0 0 0-6-6C55.2.2 34 .2 34 .2s-21.2 0-26.5 1.4a8.6 8.6 0 0 0-6 6C.1 13.1.1 24 .1 24s0 10.9 1.4 16.3a8.6 8.6 0 0 0 6 6C12.8 47.8 34 47.8 34 47.8s21.2 0 26.5-1.4a8.6 8.6 0 0 0 6-6C67.9 34.9 67.9 24 67.9 24s0-10.9-1.4-16.3z" fill="#FF0000"/><path d="M45 24 27 14v20z" fill="#fff"/></svg></span></a>
    <div>
      <cite>${esc(d.nome)}</cite>
      <div class="depo__texto">${paragrafos(d.transcricao)}</div>
      <a class="depo__link" href="${yt(d)}">Assistir ao depoimento no YouTube →</a>
    </div>
  </figure>`;

const geruza = depoimentos.find((d) => d.prova === 'print');
const p8 = `
<section class="pagina areia">
  <p class="olho">Depoimentos</p>
  <h2>O que as pessoas <span class="laranja">dizem.</span></h2>
  <div class="depos">${depoimentos.filter((d) => d.prova === 'video').map(depoVideo).join('')}</div>
  ${rodapePag(8)}
</section>`;

const p8b = `
<section class="pagina areia">
  ${geruza ? `<figure class="depo depo--print">
    <img class="depo__print" src="${src(geruza.imagem.replace(/^\//, ''))}" alt="">
    <div><cite>${esc(geruza.nome)}</cite><div class="depo__texto">${paragrafos(geruza.transcricao.replace(/\n\nGeruza Cristina\s*$/, ''))}</div><p class="depo__fonte">Mensagem de WhatsApp, reproduzida sem edição.</p></div>
  </figure>` : ''}
  <div class="vivo">
    <p class="olho" style="margin-bottom:4mm">Ao vivo no YouTube · quintas, 19h</p>
    <h3 style="font-size:20pt">Veja uma leitura acontecendo.</h3>
    <p>Toda quinta, às 19h, eu faço leituras ao vivo no YouTube. É aberto, de graça, sem compromisso e sem precisar entender nada antes. Quer receber uma? É só escrever no chat.</p>
    <a class="depo__link" href="${esc(L.playlist)}">Assistir às leituras ao vivo no YouTube →</a>
  </div>
  ${rodapePag(9)}
</section>`;

const p9 = `
<section class="pagina indigo">
  <p class="olho">Vamos conversar</p>
  <h2>Sente que chegou a hora de olhar mais fundo para o que está acontecendo? <span class="ouro">Então vamos conversar.</span></h2>
  <p class="lead">Você pode começar por uma Mensagem, por uma sessão, ou simplesmente conversando comigo sobre a Jornada.</p>
  <div class="contato">
    <a href="${esc(L.whatsapp)}">${whatsappIcone}<div>WhatsApp<span>Quero conversar</span></div></a>
    <a href="https://harmonizacaohumana.com.br"><img src="${src('img/hh-logo-96.webp')}" alt="" style="width:8mm;height:8mm"><div>harmonizacaohumana.com.br<span>O site</span></div></a>
    <a href="${esc(L.youtube)}">${youtubeIcone}<div>YouTube<span>Ao vivo às quintas, 19h</span></div></a>
    <a href="${esc(L.instagram)}">${instagramIcone}<div>Instagram<span>@filipemorgado.hh</span></div></a>
  </div>
  <p class="aviso">Este trabalho não substitui acompanhamento médico, psicológico ou psiquiátrico, nem outros cuidados profissionais de saúde. Não são feitas promessas de cura ou garantia de resultados.</p>
</section>`;

const html = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><title>Harmonização Humana · Apresentação</title><style>${css}</style></head>
<body>${capa}${p2}${p3}${p4}${p5}${p6}${p7}${p8}${p8b}${p9}</body></html>`;

await mkdir(path.join(raiz, 'docs/apresentacao'), { recursive: true });
await writeFile(path.join(raiz, 'docs/apresentacao/apresentacao.html'), html);
console.log('docs/apresentacao/apresentacao.html');
