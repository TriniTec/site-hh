// whatsapp.harmonizacaohumana.com.br/<origem> → wa.me com a mensagem daquela origem (302, temporário).
// O número e as mensagens vêm de site.config.json (via destinos.js, gerado no build): trocar o número
// é mudar um lugar só. Cada acesso é contado no Umami como evento "whatsapp-<origem>", sem cookie e sem
// guardar nada da pessoa. Se a contagem falhar, o redirecionamento acontece do mesmo jeito.
import { destinos, umamiWebsiteId, subdominio } from './destinos.js';

export default async (request, context) => {
  const url = new URL(request.url);
  // Só no subdomínio do WhatsApp; no domínio principal estes caminhos seguem como qualquer outro.
  if (subdominio && url.hostname !== subdominio) return context.next();
  const origem = url.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
  const destino = destinos[origem];
  if (!destino) return context.next();

  if (umamiWebsiteId) {
    const contar = fetch('https://cloud.umami.is/api/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'User-Agent': request.headers.get('user-agent') || 'Mozilla/5.0' },
      body: JSON.stringify({
        type: 'event',
        payload: {
          website: umamiWebsiteId,
          hostname: subdominio || url.hostname,
          url: `/${origem}`,
          referrer: request.headers.get('referer') || '',
          language: (request.headers.get('accept-language') || '').split(',')[0],
          name: `whatsapp-${origem}`,
        },
      }),
      signal: AbortSignal.timeout(2000),
    }).catch(() => {});
    if (typeof context.waitUntil === 'function') context.waitUntil(contar);
    else await contar;
  }

  return new Response(null, { status: 302, headers: { Location: destino, 'Cache-Control': 'no-store' } });
};

// Ao criar uma origem nova em site.config.json, acrescente o caminho aqui também.
export const config = { path: ['/site', '/site/', '/sessao', '/sessao/', '/jornada', '/jornada/', '/mensagem', '/mensagem/', '/instagram', '/instagram/', '/youtube', '/youtube/'] };
