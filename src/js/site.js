// Depoimentos em vídeo: a imagem (hospedada no site) dá lugar ao player só depois do toque.
// Nada do YouTube carrega antes disso. Player no modo de privacidade (youtube-nocookie.com).
document.querySelectorAll('[data-video]').forEach(function (botao) {
  botao.addEventListener('click', function () {
    var id = botao.getAttribute('data-video');
    var iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1&rel=0&playsinline=1';
    iframe.title = botao.getAttribute('aria-label') || 'Depoimento em vídeo';
    iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    iframe.allowFullscreen = true;
    var caixa = document.createElement('div');
    caixa.className = 'depo__prova';
    caixa.appendChild(iframe);
    botao.replaceWith(caixa);
  });
});
