import gameActions from "../game/gameActions.js";
import gameSave from "../data/gameSave.js";
import { gamesGo, gameGo, playerGo, scoreEntryGo } from "../data/gameObjects.js";

export default function gameHandlers(socket, io){
    socket.on("player:roll", data => {
        const {gameId, playerId, role} = socket.handshake.auth;
        if(role !== "player") return;
        if(!gameSave.ifPlayerExists(gameId, playerId)) return;
        const currentRoll = gameSave.getCurrentRoll(gameId, playerId);
        const newRoll = gameActions.rollDice(data, currentRoll);
        gameSave.updateCurrentRoll(gameId, playerId, newRoll);
        socket.emit("player:roll:res", newRoll);
    });

    socket.on("player:save:category", category => {
        const {gameId, playerId, role} = socket.handshake.auth;
        if(role !== "player") return ;
        if(!gameSave.ifPlayerExists(gameId, playerId)) return;
        gameSave.saveCategory(gameId, playerId, category);
        gameSave.updateCurrentRoll(gameId, playerId, [null, null, null, null, null]);

        if(!gameSave.updateRollingPlayer(gameId)) return;

        const playerres = gameSave.getPlayer(gameId, playerId);

        const publicGame = gameSave.getPublicGame(gameId);

        const parsed = playerGo.safeParse(playerres.player);

        if(!parsed.success){
            socket.disconnect();
            console.log("[socket:player:save:category] dto parse error:");
            console.log(parsed.error);
            return;
        }

        const player = parsed.data;

        player.score = [...player.score.values()];

        socket.to(gameId).emit("player:save:sync:public", {
            publicGame: publicGame
        })

        socket.emit("player:save:sync", {
            player: player,
            publicGame: publicGame
        });
    })

    
}