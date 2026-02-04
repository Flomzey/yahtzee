import express from "express";
import server from "./contentHandling.js";
import { nanoid } from "nanoid";

 
const hostname = "127.0.0.1";
const port = 3000;

const io = new Server(server, {
    cors: {
        origin: [
            `http://${hostname}:${port}`
        ]
    }
})