// api/pair.js
// Voye demand pairing an DIREKTEMAN bay sèvè moun nan CHWAZI a.

const SERVERS = {
  1: process.env.DOBERTO_SERVER_1,
  2: process.env.DOBERTO_SERVER_2,
  3: process.env.DOBERTO_SERVER_3,
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { number, server } = req.body || {};
  const target = SERVERS[server];

  if (!target) {
    return res.json({ success: false, error: 'Chwazi yon sèvè (1, 2, oswa 3) anvan.' });
  }

  try {
    const upstream = await fetch(`${target}/api/pair`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ number }),
      signal: AbortSignal.timeout(25000),
    });
    const data = await upstream.json();
    return res.json(data);
  } catch (err) {
    return res.json({ success: false, error: `Sèvè ${server} pa reponn kounye a. Eseye yon lòt sèvè.` });
  }
};
