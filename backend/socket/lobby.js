import gameSave from "../data/gameSave.js";

export default function lobbyHandlers(io, socket){
    socket.on("lobby:create", (gameId) => {
        gameSave.setGameSocketId(gameId, socket.id);
    });

    socket.on("lobby:join", ({gameId, playerId}) => {
        const hostSocketId = gameSave.getGameSocketId(gameId);
        const joinedPlayerName = gameSave.getPlayerName(gameId, playerId);
        socket.join(hostSocketId);
        io.to(hostSocketId).emit("player:joined", joinedPlayerName)
    });
}