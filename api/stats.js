// Relaye estatistik yo (konbyen moun ki pair) soti nan VPS la.

const VPS_STATS_URL = process.env.VPS_STATS_URL || 'http://185.214.134.21:8009/api/stats';

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ success: false, error: 'Method not allowed' });
    return;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const vpsResponse = await fetch(VPS_STATS_URL, { signal: controller.signal });
    clearTimeout(timeout);

    const data = await vpsResponse.json();
    res.status(200).json(data);

  } catch (err) {
    console.error('[Vercel proxy] Erreur relay stats:', err);
    res.status(502).json({ success: false, error: 'Pa t rive jwenn estatistik yo.' });
  }
};
