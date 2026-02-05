import gameSave from "../data/gameSave.js";
import express from "express";
import * as DTO from "../data/dtos.js"
import z from "zod";

const app = express();

export default app;

app.post("/create", (req, res) => {
    try{
        const data = gameSave.createGame();
        return res.status(200).json(
            DTO.createGameResDto.parse(data)
        );
    }catch(error){
        console.log(`[Error] ${error.toString()}`);
        return res.status(500).json({
            error: "something went wrong"
        });
    }
});

app.post("/join", (req, res) => {
    try{
        const newPlayer = DTO.playerJoinDto.parse(req.body);
        const data = gameSave.joinGame(newPlayer.gameId, newPlayer.playerName);
        return res.status(200).json(
            DTO.playerJoinResDto.parse(data)
        );
    }catch(error){
        if(error instanceof z.ZodError){
            return res.status(500).json({
                error: "dto parse error"
            });
        }
        console.log(`[Error] ${error.toString()}`);
        return res.status(500).json({
            error: "something went wrong"
        });
    }
});

app.post("/exists", (req, res) => {
    try{
        const searchedGame = DTO.ifExistsDto.parse(req.body);
        console.log(searchedGame);
        const data = gameSave.ifExists(searchedGame.gameId);
        return res.status(200).json(
            DTO.ifExistsResDto.parse(data)
        )

    }catch(error){
        //TODO: exception handling
    }
})

app.post("/getPlayer", (req, res) => {
    try{
        const playerData = DTO.getPlayerDto.parse(req.body);
        const data = gameSave.getPlayer(playerData.gameId, playerData.playerId);

        return res.status(200).json({
            player: DTO.getPlayerResDto.parse(data)
        })
    }catch(error){
        if(error instanceof z.ZodError){
            return res.status(500).json({
                error: "dto parse error"
            });
        }
        console.log(`[Error] ${error.toString()}`);
        return res.status(500).json({
            error: "something went wrong"
        });
    }

})