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

    const gameExistRes = gameSave.ifExists(gameId);
    const parsed = dtos.ifExistsResDto.safeParse(gameExistRes);

    if(!parsed.success){
        socket.disconnect();
        console.log("[socket:onconnect] dto parse error:");
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
        handleHostConnection(socket);
    }

    if(role === "player"){
        handlePlayerConnection(socket);
    }

    socket.disconnect();
}

function onDisconnect(socket, reason){

}

function handleHostConnection(socket){
    const {gameId, role} = socket.handshake.auth;

    const gameRes = gameSave.getGame(gameId);
    const gameParse = dtos.getGameResDto.safeParse(gameRes);
    
    if(!gameParse.success){
        socket.disconnect();
        console.log(`[socket:onconnect:host] host ${gameId} dto parse error`);
        console.log(gameParse.error)
        return;
    }

    const game = gameParse.data;
    const isReconnect = !!game.socketId;

    gameSave.setGameSocketId(gameId, socket.id);

    if(isReconnect){
        socket.emit("reconnect:sync", gameSave.getGame()); //TODO: use dto parse
        console.log(`[socket:onconnect:host] host ${gameId} has reconnected`);
        return;
    }
    socket.emit("reconnect:sync", gameSave.getGame());
    console.log(`[socket:onconnect:host] host ${gameId} has connected`);
}

function handlePlayerConnection(socket){
    
    const{gameId, playerId, role} = socket.handshake.auth;
    const playerres = gameSave.getPlayer(gameId, playerId);
    const parsed = dtos.getPlayerResDto.safeParse(playerres);

    if(!parsed.success){
        socket.disconnect();
        console.log("[socket:onconnect:player] dto parse error:")
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

    if(isReconnect){
        socket.to(gameId).emit("reconnect:sync", player);
        socket.emit("reconnect:sync", gameSave.getGame()); //TODO: use DTO parse
        console.log(`[socket:onconnect:player] player ${playerId} reconnected to ${gameId}`);
        return;
    }

    socket.to(gameId).emit("connect:sync", player);
}