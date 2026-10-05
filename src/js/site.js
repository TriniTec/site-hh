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
