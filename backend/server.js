const { createServer } = require('node:http');
const fs = require('fs');
const path = require('path');

const hostname = '127.0.0.1';
const port = 3000;

const server = createServer((req, res) => {
  const basePath = path.resolve(__dirname, '../public');
  const requestedPath = req.url === '/' ? '/main.html' : req.url;
  const filePath = path.resolve(basePath,'.' + requestedPath);

  fs.readFile(filePath, (err, data) => {
    if(err){
      res.statusCode = 404;
      res.end('Not found!');
      return;
    }

    if(!filePath.startsWith(basePath)){
      res.statusCode = 403;
      res.end('Forbidden');
      return;
    }

    res.statusCode = 200;
    res.end(data);
  })
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});