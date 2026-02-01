const { createServer } = require('node:http');
const fs = require('fs');
const path = require('path');

const hostname = '127.0.0.1';
const port = 3000;

const server = createServer((req, res) => {
  const basePath = path.resolve(__dirname, '../public');
  const requestedPath = req.url === '/' ? '/main.html' : req.url;
  const filePath = path.resolve(basePath,'.' + requestedPath);
  console.log(filePath)

  fs.readFile(filePath, (err, data) => {
    if(err){
      res.writeHead("404", {"content-type":"text/plain"})
      res.end('Not found!');
      console.log("not found")
      return;
    }

    if(!filePath.startsWith(basePath)){
      res.writeHead("403", {"content-type":"text/plain"})
      res.end('Forbidden');
      console.log("forbidden")
      return;
    }

    if(filePath.includes("images")){
      res.writeHead("200", {"content-type":"image/png"});
      res.end(data);
    }else{
      res.writeHead("200", {"content-type":"text/html"});
      res.end(data);
    }
  })
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});