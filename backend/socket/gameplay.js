import gameActions from "../game/gameActions.js";
import gameSave from "../data/gameSave.js";
import { gamesGo, gameGo, playerGo, scoreEntryGo } from "../data/gameObjects.js";

export default function gameHandlers(socket, io){
    socket.on("player:roll", data => {
        const {gameId, playerId, role} = socket.handshake.auth;
        if(role !== "player") return;
        if(!gameSave.ifPlayerExists(gameId, playerId)) return;
        const newRoll = gameActions.rollDice(data);
        gameSave.updateCurrentRoll(gameId, playerId, newRoll);
        socket.emit("player:roll:res", newRoll);
    });

    socket.on("player:save:category", category => {
        const {gameId, playerId, role} = socket.handshake.auth;
        if(role !== "player") return ;
        if(!gameSave.ifPlayerExists(gameId, playerId)) return;
        gameSave.saveCategory(gameId, playerId, category);

        const playerres = gameSave.getPlayer(gameId, playerId);
        console.log(playerres.player.score);

        const parsed = playerGo.safeParse(playerres.player);

        if(!parsed.success){
            socket.disconnect();
            console.log("[socket:onconnect:player] dto parse error:");
            console.log(parsed.error);
            return;
        }

        const player = parsed.data;

        player.score = [...player.score.values()];

        socket.emit("player:save:sync", player);
    })
}