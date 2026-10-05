// URL pública do site, usada nos callbacks do checkout da Asaas.
//
// Ordem: SITE_URL explícita (ou URL, nome herdado da Netlify) > Origin da
// requisição (domínio real que o convidado está usando) > domínio de produção
// que a Vercel expõe > URL do deployment atual > localhost do `vercel dev`.
function siteUrl(event) {
  const explicit = (process.env.SITE_URL || process.env.URL || '').trim();
  if (explicit) return explicit.replace(/\/+$/, '');

  const origin = String(event?.headers?.origin || '').trim();
  if (/^https?:\/\//.test(origin)) return origin.replace(/\/+$/, '');

  if (process.env.VERCEL_ENV === 'production' && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}

module.exports = { siteUrl };
