import gameSave from "../data/gameSave.js";

export default function lobbyHandlers(io, socket){
    socket.on("lobby:create", (gameId) => {
        gameSave.setGameSocketId(gameId, socket.id);
        console.log(`[socket] A new lobby was created id: ${gameId} socketId: ${socket.id}`);
    });

    socket.on("lobby:join", (gameId, playerId) => {
        const hostSocketId = gameSave.getGameSocketId(gameId);
        const joinedPlayer = gameSave.getPlayer(gameId, playerId);
        socket.join(hostSocketId);
        console.log(`[socket] ${playerId} joined lobby: ${gameId}`)
        io.to(hostSocketId).emit("player:joined", joinedPlayer.playerName);
    });
}