import gameActions from "../game/gameActions.js";

export default function gameHandlers(socket, io){
    socket.on("player:roll", data => {
        const {gameId, playerId, role} = socket.handshake.auth;
        console.log(gameActions.rollDice([null, null, null, null, null]));
    })
}