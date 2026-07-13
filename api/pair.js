// Vercel serverless function — jis yon "relè" (proxy).
// Li pa fè travay pairing la limenm (Vercel pa ka kenbe koneksyon Baileys louvri),
// li jis pran rekèt moun nan epi voye l bay VPS Pterodactyl la ki gen vrè
// koneksyon WhatsApp/Baileys la ap kouri sou li.

const VPS_URL = process.env.VPS_PAIR_URL || 'http://185.214.134.21:8009/api/pair';

module.exports = async (req, res) => {
  // Sèlman aksepte POST
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method not allowed' });
    return;
  }

  try {
    const { number } = req.body || {};

    if (!number) {
      res.status(400).json({ success: false, error: 'Antre yon nimewo dabò.' });
      return;
    }

    // Relaye rekèt la bay VPS la, ak yon timeout pou pa rete bloke
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    const vpsResponse = await fetch(VPS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ number }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    const data = await vpsResponse.json();
    res.status(200).json(data);

  } catch (err) {
    console.error('[Vercel proxy] Erreur relay pair:', err);

    const isTimeout = err.name === 'AbortError';
    res.status(502).json({
      success: false,
      error: isTimeout
        ? 'Sèvè a pran twòp tan pou reponn. Eseye ankò.'
        : 'Pa t rive konekte ak sèvè bot la. Eseye ankò nan yon ti moman.'
    });
  }
};
