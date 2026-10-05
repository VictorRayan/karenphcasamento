const { toVercel } = require('../lib/vercel');
const { json } = require('../lib/http');
const { listPaidGiftIds } = require('../lib/db');

async function handler(event) {
  if (event.httpMethod !== 'GET') return json(405, { error: 'Method not allowed' });

  try {
    return json(200, { paidGiftIds: await listPaidGiftIds() });
  } catch (error) {
    return json(500, { error: error.message || 'Failed to load paid gifts' });
  }
}

module.exports = toVercel(handler);
