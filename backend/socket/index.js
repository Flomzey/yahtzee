import lobbyHandlers from "./lobby.js";

export default function setupSockets(io){
    io.on("connection", (socket) => {
        lobbyHandlers(io, socket);
    });
}