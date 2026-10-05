// Adapta os handlers no formato herdado das Netlify Functions
//   (event) => { statusCode, headers, body }
// para a assinatura (req, res) das Vercel Functions em Node.
//
// A Vercel já faz o parse do corpo quando o content-type é application/json
// (req.body vira objeto); aqui o corpo volta a ser string para os handlers
// continuarem fazendo JSON.parse(event.body) como antes.

async function readRawBody(req) {
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === 'string') return req.body;
    if (Buffer.isBuffer(req.body)) return req.body.toString('utf8');
    return JSON.stringify(req.body);
  }
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return chunks.length ? Buffer.concat(chunks).toString('utf8') : '';
}

function toEvent(req, body) {
  const url = new URL(req.url || '/', `https://${req.headers.host || 'localhost'}`);
  return {
    httpMethod: (req.method || 'GET').toUpperCase(),
    // Node entrega os cabeçalhos em minúsculas; os handlers já leem assim.
    headers: req.headers || {},
    path: url.pathname,
    queryStringParameters: Object.fromEntries(url.searchParams),
    body
  };
}

function toVercel(handler) {
  return async function vercelHandler(req, res) {
    let result;
    try {
      result = await handler(toEvent(req, await readRawBody(req)));
    } catch (error) {
      console.error('[api] handler falhou:', error);
      result = {
        statusCode: 500,
        headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
        body: JSON.stringify({ error: error.message || 'Internal error' })
      };
    }
    res.statusCode = result.statusCode || 200;
    for (const [name, value] of Object.entries(result.headers || {})) res.setHeader(name, value);
    res.end(result.body == null ? '' : result.body);
  };
}

module.exports = { toVercel, toEvent, readRawBody };
