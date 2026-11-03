const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

let PORT = parseInt(process.env.PORT || '3000', 10);
const BASE_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

function startServer(port) {
  const server = http.createServer((req, res) => {
    let cleanUrl = req.url.split('?')[0];

    // Local routing for Serverless APIs (/api/*)
    if (cleanUrl.startsWith('/api/')) {
      let bodyData = '';
      req.on('data', chunk => { bodyData += chunk; });
      req.on('end', () => {
        try {
          req.body = bodyData ? JSON.parse(bodyData) : {};
        } catch {
          req.body = bodyData;
        }

        const urlParts = req.url.split('?');
        req.query = {};
        if (urlParts[1]) {
          const searchParams = new URLSearchParams(urlParts[1]);
          for (const [k, v] of searchParams.entries()) {
            req.query[k] = v;
          }
        }

        res.status = (code) => {
          res.statusCode = code;
          return res;
        };
        res.json = (data) => {
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify(data));
        };

        if (cleanUrl === '/api/orders') {
          return require('./api/orders.js')(req, res);
        }
        if (cleanUrl === '/api/vouchers/verify') {
          return require('./api/vouchers/verify.js')(req, res);
        }
        if (cleanUrl === '/api/orders/track') {
          return require('./api/orders/track.js')(req, res);
        }

        res.status(404).json({ success: false, message: 'API endpoint not found' });
      });
      return;
    }

    let filePath = path.join(BASE_DIR, cleanUrl === '/' ? 'index.html' : cleanUrl);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
      if (err) {
        if (err.code === 'ENOENT') {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('404 Not Found');
        } else {
          res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('500 Internal Server Error');
        }
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`Port ${port} dang ban, chuyen sang thu port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Loi may chu:', err);
    }
  });

  server.listen(port, () => {
    const url = `http://localhost:${port}`;
    console.log(`====================================================`);
    console.log(`  May chu RE-BORN dang chay tai: ${url}`);
    console.log(`  De dung may chu, nhan to hop phim Ctrl + C`);
    console.log(`====================================================`);

    // Tu dong mo trinh duyet dung port sau khi may chu da san sang
    exec(`start ${url}`);
  });
}

startServer(PORT);
