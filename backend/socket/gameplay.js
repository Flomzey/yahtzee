import gameSave from "../data/gameSave.js";

export default function gameHandlers(socket, io){
    socket.on("player:roll", data => {
        const {gameId, playerId, role} = socket.handshake.auth;
        console.log(gameId, playerId, role);
    })
}