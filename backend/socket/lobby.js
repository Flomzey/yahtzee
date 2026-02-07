import gameSave from "../data/gameSave.js";

export default function lobbyHandlers(socket, io){
    socket.on("lobby:create", (gameId) => {
        socket.join(gameId);
        console.log(`[socket] A new lobby was created id: ${gameId} socketId: ${socket.id}`);
    });

    socket.on("lobby:join", (gameId, playerId) => {
         //TODO: ID validation join => connect
        const res = gameSave.getPlayer(gameId, playerId); // use session store, dont use the socketId
        socket.join(gameId);
        console.log(`[socket] ${playerId} joined lobby: ${gameId}`)
        io.to(gameId).emit("player:joined", res.player.playerName);
    });

    socket.on("lobby:disconnect", () => {
        
    });
}