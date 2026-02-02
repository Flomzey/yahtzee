const gameSave = require("./data/gameSave");
const express = require("express");

const app = express();

app.use(express.json());

app.post("/game/create", (req, res) => {
    res.json(gameSave.createGame().id);
});

module.exports = app;