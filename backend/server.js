const express = require("express");
const path = require("path");

const apiApp = require("./api");

const hostname = "127.0.0.1";
const port = 3000;

const app = express();

app.use("/api", apiApp);

const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

app.listen(port, hostname, () => {
  console.log(`Server läuft auf http://${hostname}:${port}`);
});