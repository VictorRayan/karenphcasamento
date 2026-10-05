// URL pública do site, usada nos callbacks do checkout da Asaas.
//
// Ordem: SITE_URL explícita (ou URL, nome herdado da Netlify) > domínio de
// produção que a Vercel expõe > host da própria requisição (x-forwarded-host /
// host) > URL do deployment atual > localhost do `vercel dev`.
//
// O header Origin NÃO é usado: ele é controlado pelo cliente e iria parar nos
// callbacks do checkout da Asaas (redirecionando o convidado para outro site).
function siteUrl(event) {
  const explicit = (process.env.SITE_URL || process.env.URL || '').trim();
  if (explicit) return explicit.replace(/\/+$/, '');

  if (process.env.VERCEL_ENV === 'production' && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  const headers = event?.headers || {};
  const host = String(headers['x-forwarded-host'] || headers.host || '').split(',')[0].trim();
  if (host) {
    const proto = /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host) ? 'http' : 'https';
    return `${proto}://${host}`;
  }

  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}

module.exports = { siteUrl };
