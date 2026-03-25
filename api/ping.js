export default function handler(req, res) {
  res.status(200).json({
    ok: true,
    hasUrl:   !!process.env.UPSTASH_REDIS_REST_URL,
    hasToken: !!process.env.UPSTASH_REDIS_REST_TOKEN,
    node:     process.version,
  });
}
