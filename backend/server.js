const { createServer } = require("node:http");
const fs = require("fs");
const path = require("path");
const expressApp = require("./api");

const hostname = '127.0.0.1';
const port = 3000;

const server = createServer((req, res) => {

  if(req.url.startsWith("/api")){
    req.url = req.url.replace("/api", "");
    return expressApp(req, res);
  }

  const basePath = path.resolve(__dirname, '../public');
  const requestedPath = req.url === '/' ? '/main.html' : req.url;
  const filePath = path.resolve(basePath,'.' + requestedPath);

  fs.readFile(filePath, (err, data) => {
    if(err){
      res.writeHead(404);
      res.end("Not found!");
      return;
    }

    if(!filePath.startsWith(basePath)){
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    res.writeHead(200, {
      "content-type": filePath.endsWith(".png")
        ? "image/png"
        : "text/html"
    });
    res.end(data);

  })
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});