import { kv } from '@vercel/kv';

const KEY = 'johnson_bracket_2026_v1';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const data = await kv.get(KEY);
    res.status(200).json(data || null);
  } else if (req.method === 'POST') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    await kv.set(KEY, body);
    res.status(200).json({ ok: true });
  } else {
    res.status(405).end();
  }
}
