const { toVercel } = require('../lib/vercel');
const { json, requireAdmin } = require('../lib/http');
const { storageBackend } = require('../lib/db');
const { describeSupabaseConfig } = require('../lib/supabase');

async function handler(event) {
  if (event.httpMethod !== 'GET') return json(405, { error: 'Method not allowed' });
  if (!requireAdmin(event)) return json(401, { error: 'Unauthorized' });
  return json(200, { ok: true, storage: storageBackend(), supabase: describeSupabaseConfig() });
}

module.exports = toVercel(handler);
