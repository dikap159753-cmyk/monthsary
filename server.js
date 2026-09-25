const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const port = Number(process.env.PORT) || 8000;
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon'
};

http.createServer((req, res) => {
  const decodedUrl = decodeURIComponent(req.url || '/');

  if (decodedUrl === '/Gending Temanten Adat Jawa kebo giro.mp3') {
    const songPath = path.join(root, 'Gending Temanten Adat Jawa kebo giro.mp3');
    if (!fs.existsSync(songPath)) {
      res.statusCode = 404;
      res.end('Song not found');
      return;
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    fs.createReadStream(songPath).pipe(res);
    return;
  }

  const requestedPath = decodedUrl === '/' ? '/index.html' : decodedUrl;
  const filePath = path.join(root, requestedPath);

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.statusCode = 404;
    res.end('Not found');
    return;
  }

  const extension = path.extname(filePath).toLowerCase();
  res.setHeader('Content-Type', mimeTypes[extension] || 'text/plain; charset=utf-8');
  fs.createReadStream(filePath).pipe(res);
}).listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
