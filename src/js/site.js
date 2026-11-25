// Movimento da página: elementos que surgem, o caminho que acende, o topo e o botão fixo.
// Tudo leve, sem bibliotecas. Quem pede menos movimento no aparelho vê a página parada.
(function () {
  var reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Surgir ao rolar
  var surgem = document.querySelectorAll('.surge');
  if ('IntersectionObserver' in window && !reduz) {
    var obs = new IntersectionObserver(function (itens) {
      itens.forEach(function (i) { if (i.isIntersecting) { i.target.classList.add('visto'); obs.unobserve(i.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    surgem.forEach(function (el) { obs.observe(el); });
  } else {
    surgem.forEach(function (el) { el.classList.add('visto'); });
  }

  // O caminho dourado acende conforme a pessoa rola
  var caminho = document.querySelector('.caminho');
  var passos = caminho ? caminho.querySelectorAll('li') : [];
  var linha = document.querySelector('.caminho__linha');

  var topo = document.querySelector('.topo');
  var fixo = document.querySelector('.botao-fixo');
  var abertura = document.querySelector('.abertura, .entrada');

  function aoRolar() {
    var y = window.scrollY, h = window.innerHeight;
    if (topo) topo.classList.toggle('rolou', y > 8);
    if (fixo) {
      var limite = abertura ? abertura.offsetTop + abertura.offsetHeight - 80 : h * 0.6;
      fixo.classList.toggle('visivel', y > limite);
    }
    if (caminho && linha) {
      var r = caminho.getBoundingClientRect();
      var p = reduz ? 1 : Math.min(1, Math.max(0, (h * 0.75 - r.top) / (r.height + h * 0.1)));
      linha.style.setProperty('--progresso', p.toFixed(3));
      passos.forEach(function (li, i) { li.classList.toggle('aceso', p >= (i / passos.length) + 0.02 || reduz); });
    }
  }
  // O botão fixo sai de cena quando o rodapé ou a chamada final estão à vista
  var finais = document.querySelectorAll('.final, .rodape');
  if (fixo && 'IntersectionObserver' in window) {
    var vistos = new Set();
    var obsFim = new IntersectionObserver(function (itens) {
      itens.forEach(function (i) { if (i.isIntersecting) vistos.add(i.target); else vistos.delete(i.target); });
      fixo.classList.toggle('escondido', vistos.size > 0);
    }, { threshold: 0.15 });
    finais.forEach(function (el) { obsFim.observe(el); });
  }

  var pedido = false;
  window.addEventListener('scroll', function () {
    if (!pedido) { pedido = true; requestAnimationFrame(function () { pedido = false; aoRolar(); }); }
  }, { passive: true });
  aoRolar();

  // Print do depoimento: abre grande na própria página (sem nova aba). Fecha no X, no Esc ou tocando fora.
  document.querySelectorAll('[data-ampliar]').forEach(function (gatilho) {
    var dialogo = document.getElementById(gatilho.getAttribute('data-ampliar'));
    if (!dialogo || typeof dialogo.showModal !== 'function') return;
    gatilho.addEventListener('click', function (e) { e.preventDefault(); dialogo.showModal(); });
  });
  document.querySelectorAll('dialog.ampliado').forEach(function (dialogo) {
    dialogo.addEventListener('click', function (e) {
      if (e.target === dialogo || e.target.hasAttribute('data-fechar')) dialogo.close();
    });
  });

  // Faixa da live, pelo relógio de quem visita: nos 10 minutos antes do início, a contagem ("Ao vivo em 8 min");
  // da hora do início até 90 minutos depois, "Ao vivo agora"; fora disso, escondida. Antes do início não diz "agora",
  // porque quem entra e encontra a live sem ter começado acha que está errado (Filipe, 24/11). Confere a cada
  // 15 segundos: quem está com a página aberta vê a contagem andar, virar "agora" e a faixa sair.
  var faixa = document.querySelector('[data-ao-vivo]');
  if (faixa) {
    var inicioLive = Date.parse(faixa.getAttribute('data-ao-vivo'));
    var textoLive = faixa.querySelector('b');
    var conferirLive = function () {
      var falta = inicioLive - Date.now();
      faixa.hidden = falta > 10 * 60e3 || falta < -90 * 60e3;
      textoLive.textContent = falta > 0 ? 'Ao vivo em ' + Math.ceil(falta / 60e3) + ' min' : 'Ao vivo agora';
    };
    conferirLive();
    setInterval(conferirLive, 15e3);
  }

  // Aviso de live fora do dia de sempre: a faixa dourada fica no alto até 10 minutos antes do início, quando entra a
  // faixa "Ao vivo" (as duas nunca aparecem juntas). A janela central abre na primeira visita, uma vez por live em
  // cada aparelho, só nesse mesmo período; fecha no X, no "Entendi", no lembrete, no Esc ou tocando fora.
  var aviso = document.querySelector('[data-aviso-live]');
  if (aviso) {
    var inicioAviso = Date.parse(aviso.getAttribute('data-aviso-live'));
    var janela = document.getElementById('aviso-live');
    var conferirAviso = function () {
      aviso.hidden = inicioAviso - Date.now() <= 10 * 60e3;
      if (aviso.hidden && janela && janela.open) janela.close();
    };
    conferirAviso();
    setInterval(conferirAviso, 15e3);
    if (!aviso.hidden && janela && typeof janela.showModal === 'function') {
      var chave = 'hh-aviso-live-' + janela.getAttribute('data-video');
      var visto = false;
      try { visto = localStorage.getItem(chave) === '1'; } catch (e) { /* sem armazenamento: mostra */ }
      if (!visto) {
        setTimeout(function () {
          if (aviso.hidden) return;
          janela.showModal();
          try { localStorage.setItem(chave, '1'); } catch (e) { /* segue */ }
        }, 600);
      }
      janela.addEventListener('click', function (e) {
        if (e.target === janela || e.target.closest('[data-fechar]')) janela.close();
      });
    }
  }

  // Página dos guias: busca por texto (sem acento) e filtro por tema, juntos.
  var guias = document.querySelector('[data-guias]');
  if (guias) {
    var campo = guias.querySelector('#busca-guias');
    var cartoes = [].slice.call(guias.querySelectorAll('.guia'));
    var botoes = [].slice.call(guias.querySelectorAll('.guias-filtros button'));
    var contagem = guias.querySelector('[data-contagem]');
    var vazio = guias.querySelector('[data-vazio]');
    var tema = '';
    var normalizar = function (t) { return t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim(); };
    var aplicar = function () {
      var termos = normalizar(campo.value).split(/\s+/).filter(Boolean);
      var vistos = 0;
      cartoes.forEach(function (c) {
        var texto = c.getAttribute('data-busca');
        var cats = c.getAttribute('data-cat').split('|');
        var ok = termos.every(function (t) { return texto.indexOf(t) >= 0; }) && (!tema || cats.indexOf(tema) >= 0);
        c.hidden = !ok;
        if (ok) { vistos++; c.classList.add('visto'); }
      });
      contagem.textContent = vistos + (vistos === 1 ? ' guia' : ' guias');
      vazio.hidden = vistos > 0;
    };
    campo.addEventListener('input', aplicar);
    botoes.forEach(function (b) {
      b.addEventListener('click', function () {
        tema = b.getAttribute('data-cat');
        botoes.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        aplicar();
      });
    });
  }

  // Depoimentos em vídeo: a imagem dá lugar ao player só depois do toque (youtube-nocookie.com).
  document.querySelectorAll('[data-video]').forEach(function (botao) {
    botao.addEventListener('click', function () {
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(botao.getAttribute('data-video')) + '?autoplay=1&rel=0&playsinline=1';
      iframe.title = botao.getAttribute('aria-label') || 'Depoimento em vídeo';
      iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      iframe.allowFullscreen = true;
      var caixa = document.createElement('div');
      caixa.className = botao.className;
      caixa.appendChild(iframe);
      botao.replaceWith(caixa);
    });
  });
})();
