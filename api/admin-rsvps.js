const { toVercel } = require('../lib/vercel');
const { json, requireAdmin } = require('../lib/http');
const { listRsvps } = require('../lib/db');

async function handler(event) {
  if (!requireAdmin(event)) return json(401, { error: 'Unauthorized' });
  if (event.httpMethod !== 'GET') return json(405, { error: 'Method not allowed' });

  try {
    return json(200, { rsvps: await listRsvps() });
  } catch (error) {
    return json(500, { error: error.message || 'Failed to load RSVPs' });
  }
}

module.exports = toVercel(handler);
