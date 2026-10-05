// Cadastra no banco os presentes do catálogo padrão (os que estavam fixos no site).
// POST /api/gifts-seed  { "overwrite": false }
//   overwrite=false (padrão): só insere os que ainda não existem.
//   overwrite=true: também atualiza nome, preço e imagem dos existentes.
const { toVercel } = require('../lib/vercel');
const { json, requireAdmin } = require('../lib/http');
const { seedGifts } = require('../lib/db');

async function handler(event) {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });
  if (!requireAdmin(event)) return json(401, { error: 'Unauthorized' });

  try {
    const payload = JSON.parse(event.body || '{}');
    const result = await seedGifts({ overwrite: Boolean(payload.overwrite) });
    return json(200, result);
  } catch (error) {
    return json(500, { error: error.message || 'Não foi possível importar o catálogo' });
  }
}

module.exports = toVercel(handler);
