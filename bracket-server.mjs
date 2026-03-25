import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3001;
const STATE_FILE = path.join(__dirname, 'bracket-state.json');

const DEFAULT_RESULTS = {
  sweet16: { e1: 'Kansas State', e2: 'Florida Atlantic', s1: 'San Diego State', s2: 'Creighton', m1: 'Miami (FL)', m2: 'Texas', w1: 'UConn', w2: 'Gonzaga' },
  elite8:  { ee1: 'Florida Atlantic', es1: 'San Diego State', em1: 'Miami (FL)', ew1: 'UConn' },
  final4:  { f1: 'San Diego State', f2: 'UConn' },
  championship: { c1: 'UConn' }
};

function getDefaultState() {
  return {
    results: JSON.parse(JSON.stringify(DEFAULT_RESULTS)),
    picks: {},
    submitted: {},
    roundOpen: { sweet16: true, elite8: false, final4: false, championship: false }
  };
}

function readState() {
  try { return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')); }
  catch { return getDefaultState(); }
}

function writeState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
  '.mjs': 'application/javascript', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  const urlPath = req.url.split('?')[0];

  if (urlPath === '/api/state') {
    if (req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(readState()));
      return;
    }
    if (req.method === 'POST') {
      let body = '';
      req.on('data', c => body += c);
      req.on('end', () => {
        try {
          writeState(JSON.parse(body));
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end('{"ok":true}');
        } catch { res.writeHead(400); res.end('Bad request'); }
      });
      return;
    }
  }

  const filePath = path.join(__dirname, urlPath === '/' ? '/johnson-bracket.html' : urlPath);
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`\n🏀 Johnson Family Bracket running at http://localhost:${PORT}`);
  console.log(`   Open: http://localhost:${PORT}/johnson-bracket.html\n`);
});
