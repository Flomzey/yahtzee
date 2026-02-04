import gameSave from "../data/gameSave.js";
import express from "express";
import z from "zod";

const app = express();

const playerJoinDto = z.object({
    gameId : z.string(6),
    name : z.string()
});

const playerDto = z.object({
    id : z.string(4),
    name : z.string()
});

app.post("/create", (req, res) => {
    try{
        return res.status(200).json(gameSave.createGame());
    }catch(error){
        console.log(`[Error] ${error.toString}`);
        return res.status(500).json({
            error: "something went wrong"
        });
    }
});

app.post("/join", (req, res) => {
    try{
        const newPlayer = playerJoinDto.parse(req.body);
        console.log("test")
        const data = gameSave.joinGame(newPlayer.gameId, newPlayer.name);
        return res.status(200).json(
            data.player
        );
    }catch(error){
        console.log(`[Error] ${error.toString}`);
        if(error instanceof z.ZodError){
            return res.status(500).json({
                error: "dto parse error"
            });
        }
        return res.status(500).json({
            error: "something went wrong"
        });
    }
});

export default app;