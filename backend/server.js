import express from "express";
import path, { dirname } from "path";
import apiRouter from "./api/index.js";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import { createServer } from "http";
import setupSockets from "./socket/index.js";
const hostname = "127.0.0.1";
const port = 3000;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicPath = path.join(__dirname, "../public");

app.use(express.json());
app.use("/api", apiRouter);
app.use(express.static(publicPath));
setupSockets(io);


app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});