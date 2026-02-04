import express from "express";
import path, { dirname } from "path";
import apiRouter from "./api/index.js";
import { fileURLToPath } from "url";
const hostname = "127.0.0.1";
const port = 3000;
const app = express();

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.json());
app.use("/api", apiRouter);

const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});