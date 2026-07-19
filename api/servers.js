// api/servers.js
// Bay estati LIVE 3 sèvè yo (count/max) pou moun ka DESIDE
// pou kont yo ki sèvè yo vle konekte sou.

const SERVERS = [
  { id: 1, label: 'Sèvè 1', base: process.env.NYXEN_SERVER_1 },
  { id: 2, label: 'Sèvè 2', base: process.env.NYXEN_SERVER_2 },
  { id: 3, label: 'Sèvè 3', base: process.env.NYXEN_SERVER_3 },
].filter(s => s.base);

async function getStats(server) {
  try {
    const res = await fetch(`${server.base}/api/stats`, { signal: AbortSignal.timeout(4000) });
    const data = await res.json();
    if (!data.success) throw new Error('bad response');
    return { ...server, count: data.count, max: data.max, online: true };
  } catch (_) {
    return { ...server, count: null, max: null, online: false };
  }
}

module.exports = async (req, res) => {
  const results = await Promise.all(SERVERS.map(getStats));
  // pa voye 'base' bay browser la (URL entèn sèvè yo pa dwe piblik)
  const safe = results.map(({ id, label, count, max, online }) => ({ id, label, count, max, online }));
  return res.json({ success: true, servers: safe });
};
