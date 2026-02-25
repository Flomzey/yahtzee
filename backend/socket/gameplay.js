import gameActions from "../game/gameActions.js";
import gameSave from "../data/gameSave.js";

export default function gameHandlers(socket, io){
    socket.on("player:roll", data => {
        const {gameId, playerId, role} = socket.handshake.auth;
        if(role !== "player") return;
        if(!gameSave.ifPlayerExists(gameId, playerId)) return;
        const newRoll = gameActions.rollDice(data);
        console.log(newRoll);
    });
}