import { nanoid } from "nanoid";
import { states, reasons } from "./gameEnums.js"
import * as z from "zod";

let games = new Map();

export default{
    createGame,
    ifExists,
    joinGame,
    setGameSocketId,
    getGameSocketId,
    getPlayer
}

/**
 * Creates a game entry with no players
 * @returns object {ok: boolean, game: gameObject}
 */
export function createGame(){
    const gameId = nanoid(6);// missing logic for collision
    const game = {
        gameId: gameId,
        socketId: null,
        players: new Map(),
        state: states.LOBBY,
        roundsLeft: 13,
        lastAction: new Date() //later check if newdate.getTime() - olddate.getTime() > some value in ms
    };
    games.set(gameId, game);
    return {
        ok: true,
        game: game,
        reason: reasons.CREATIONSUCCESS
    }
}

/**
 * checks if a game is joinable
 * @param {*} gameId 
 * @returns ok:true if the game exists and is in state "lobby" ok:false if otherwise also provides reason as to why
 */
export function ifExists(gameId){
    if(!games.has(gameId)) return {
        ok: false,
        reason: reasons.DOESNTEXIST
    };
    if(games.get(gameId).state !== states.LOBBY) return {
        ok:false,
        reason: reasons.ALREADYSTARTED
    };
    return {
        ok: true,
        reason: reasons.JOINABLE
    };
}

/**
 * adds a player to the game playerlist if it exists
 * @param {String, String} gameId playerName 
 * @returns object {ok: boolean, playerId: nanoid(4), reason: gameEnums.reasons}
 */
export function joinGame(gameId, playerName){
    if(games.has(gameId)){
        const game = games.get(gameId);
        const playerId = nanoid(4); //missing logic for collision

        const player = createNewPlayer(playerName, playerId);
        player.score = createNewScoreSheet();

        game.players.set(playerId, player);
        game.lastAction = new Date();
        games.set(gameId, game);

        console.log(`[Api] ${playerId} wants to join the game ${gameId}`);

        return {
            ok: true,
            playerId: playerId,
            reason: reasons.JOINSUCCESS
        };
    }else{
        return {
            ok: false,
            playerId: null,
            reason: reason.DOESNTEXIST
        };
    }
}

/**
 * adds the socketId to the game belonging to the gameId
 * @param {*} gameId 
 * @param {*} socketId 
 * @returns true if game exists and SocketId was added, false if game doesnt exist and socketId couldn't be added
 */
export function setGameSocketId(gameId, socketId){
    if(!games.has(gameId)) return false; //TODO: return DTO
    const game = games.get(gameId);
    game.socketId = socketId;
    return true;
}

//TODO: return DTOS
export function getGameSocketId(gameId){
    if(!games.has(gameId)) return undefined;
    return games.get(gameId).socketId;
}

export function getPlayer(gameId, playerId){
    if(!games.has(gameId)) return {
        ok: false,
        player: null,
        reason: reasons.DOESNTEXIST
    };
    if(!games.get(gameId).players.has(playerId)) return{
        ok:false,
        player: null,
        reason: reasons.DOESNTEXIST
    };
    return {
        ok: true,
        player: games.get(gameId).players.get(playerId),
        reason: reasons.GETSUCCESS
    };
}

function createNewPlayer(playerName, playerId){
    return {
        id: playerId,
        playerName: playerName,
        score: null,
        isTurn: false,
        isReady: false,
        rollsLeft: 0
    };
}

function createNewScoreSheet(){
    return {
        one: null,
        two: null,
        three: null,
        four: null,
        three: null,
        five: null,
        six: null,
        threeOak: null,
        fourOak: null,
        fullH: null,
        smallStr: null,
        bigStr: null,
        yahtzee: null,
        chance: null
    };
}