import lobbyHandlers from "./lobby.js";
import * as dtos  from "../data/dtos.js";
import gameSave from "../data/gameSave.js";


export default function setupSockets(io){
    io.on("connection", (socket) => {
        onConnect(socket);

        lobbyHandlers(socket, io);

        socket.on("disconnect", (reason) => {
            onDisconnect(socket, reason);
        });
    });
}

function onConnect(socket){
    const{gameId, role} = socket.handshake.auth;

    if(!gameId || !role){
        socket.disconnect();
        return;
    }

    const gameExistres = gameSave.ifExists(gameId);
    const parsed = dtos.ifExistsResDto.safeParse(gameExistres);

    if(!parsed.success){
        socket.disconnect();
        console.log("[socket:onconnect] dto parse error:")
        console.log(parsed.error);
        return;
    }

    const gameExist = parsed.data;

    if(!gameExist.ok){
        socket.disconnect();
        return;
    }

    socket.join(gameId);

    if(role === "host"){
        //host method
    }

    if(role === "player"){
        handlePlayerConnection(socket);
    }

    socket.disconnect();
}

function onDisconnect(socket, reason){

}

function handlePlayerConnection(socket){
    
    const{gameId, playerId, role} = socket.handshake.auth;
    const playerres = gameSave.getPlayer(gameId, playerId);
    const parsed = dtos.getPlayerResDto.safeParse(playerres);

    if(!parsed.success){
        socket.disconnect();
        console.log("[socket:onconnect] dto parse error:")
        console.log(parsed.error);
        return;
    }

    const player = parsed.data;

    if(!player.ok){
        socket.disconnect();
        return;
    }
    
    const isReconnect = !!player.socketId;
    player.socketId = socket.id;
    socket.data.gameId = gameId;
    socket.data.playerId = playerId;

    socket.join(gameId);

    if(isReconnect){
        socket.to(gameId).emit("reconnect:sync", player);
        socket.emit("reconnect:sync", gameSave.getGame());
        console.log(`[socket:onconnect] player ${playerId} reconnected to ${gameId}`);
        return;
    }

    socket.to(gameId).emit("connect:sync", player);
}