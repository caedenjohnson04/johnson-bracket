const KEY = 'johnson_bracket_2026_v1';

export default async function handler(req, res) {
  const url   = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    res.status(500).json({ error: 'Redis env vars not set' });
    return;
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  if (req.method === 'GET') {
    const r = await fetch(`${url}/get/${KEY}`, { headers });
    const { result } = await r.json();
    res.status(200).json(result ? JSON.parse(result) : null);

  } else if (req.method === 'POST') {
    const val = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(['SET', KEY, val]),
    });
    res.status(200).json({ ok: true });

  } else {
    res.status(405).end();
  }
}
