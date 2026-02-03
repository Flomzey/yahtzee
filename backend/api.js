const gameSave = require("./data/gameSave");
const express = require("express");
const z = require("zod");

const app = express();
app.use(express.json());

const playerJoinDto = z.object({
    gameId : z.string(6),
    name : z.string()
});

const playerDto = z.object({
    id : z.string(4),
    name : z.string()
});

app.post("/game/create", (req, res) => {
    return res.json(gameSave.createGame());
});

app.post("/game/join", (req, res) => {
    try{
        const newPlayer = playerJoinDto.parse(req.body);
        const data = gameSave.joinGame(newPlayer.gameId, newPlayer.name);
        console.log(data)
        return res.status(200).json(
            [data.id, data.name]
        );
    }catch(error){
        if(error instanceof z.ZodError){
            return res.status(500).json({
                error: "dto parse error"
            });
        }
        return res.status(500).json({
            error: error
        });
    }
});

module.exports = app;