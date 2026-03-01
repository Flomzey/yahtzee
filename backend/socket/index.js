import lobbyHandlers from "./lobby.js";
import gameHandlers from "./gameplay.js";
import * as dtos  from "../data/dtos.js";
import gameSave from "../data/gameSave.js";
import { gamesGo, gameGo, playerGo, scoreEntryGo } from "../data/gameObjects.js";

export default function setupSockets(io){
    io.on("connection", (socket) => {
        onConnect(socket);

        lobbyHandlers(socket, io);
        gameHandlers(socket, io);

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
}

function onDisconnect(socket, reason){
    const{ gameId, role } = socket.handshake.auth;
    console.log(`[socket:ondisconnect] a ${role} disconnected from ${gameId}`)
}

function handleHostConnection(socket){
    const {gameId, role} = socket.handshake.auth;

    const game = gameSave.getPublicGame(gameId);
    
    /*if(!gameParse.success){
        socket.disconnect();
        console.log(`[socket:onconnect:host] host ${gameId} dto parse error`);
        console.log(gameParse.error)
        return;
    }*/

    const isReconnect = !!game.socketId;
    gameSave.setGameSocketId(gameId, socket.id);

    if(isReconnect){
        socket.emit("host:reconnect:sync", game); //TODO: use dto parse
        console.log(`[socket:onconnect:host] host ${gameId} has reconnected`);
        return;
    }
    socket.emit("host:reconnect:sync", game);
    console.log(`[socket:onconnect:host] host ${gameId} has connected`);
}

function handlePlayerConnection(socket){
    const{gameId, playerId, role} = socket.handshake.auth;
    const playerres = gameSave.getPlayer(gameId, playerId);
    const parsed = playerGo.safeParse(playerres.player);

    if(!parsed.success){
        socket.disconnect();
        console.log("[socket:onconnect:player] dto parse error:");
        console.log(parsed.error);
        return;
    }

    const player = parsed.data;
    
    const isReconnect = !!player.socketId;
    const idWasAdded = gameSave.setPlayerSocketId(gameId, playerId, socket.id);
    if(!idWasAdded){
        console.log("[socket:onconnect:player] couldnt set new socketid of player");
    }
    socket.data.gameId = gameId;
    socket.data.playerId = playerId;

    const publicGame = gameSave.getPublicGame(gameId);

    player.score = [...player.score.values()];

    if(isReconnect){
        socket.to(gameId).emit("reconnect:sync:public", publicGame);
        socket.emit("reconnect:sync", {
            player: player,
            publicGame: publicGame.game
        }); //TODO: use DTO parse
        console.log(`[socket:onconnect:player] player ${playerId} reconnected to ${gameId}`);
        return;
    }

    socket.to(gameId).emit("connect:sync:public", publicGame);
    socket.emit("connect:sync", {
        player: player,
        publicGame: publicGame.game
    });
    console.log(`[socket:onconnect:player] player ${playerId} connected to ${gameId}`);
}