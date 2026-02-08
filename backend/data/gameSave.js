import { nanoid } from "nanoid";
import { categories, reasons, states } from "./gameEnums.js";

let games = new Map();

export default{
    createGame,
    ifExists,
    joinGame,
    getPlayer,
    getGame,
    setGameSocketId
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
        playerNames: new Map(),
        state: states.LOBBY,
        roundsLeft: 13,
        lastAction: new Date() //later check if newdate.getTime() - olddate.getTime() > some value in ms
    };
    games.set(gameId, game);
    return {
        ok: true,
        game: game,
        reason: reasons.SUCCESS
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
        ok: true,
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
        if(game.playerNames.has(playerName)) return{
            ok: false,
            playerId: null,
            reason: reasons.ALREADYEXISTS
        };
        const playerId = nanoid(4); //missing logic for collision

        const player = createNewPlayer(playerName, playerId);
        const score = new Map();

        Object.values(categories).forEach(entryTitle => {
            score.set(entryTitle, createNewScoreEntry(entryTitle));
        });

        player.score = score;

        game.players.set(playerId, player);
        game.playerNames.set(playerName, playerId);
        game.lastAction = new Date();
        games.set(gameId, game);

        console.log(`[api:joingame] ${playerId} wants to join the game ${gameId}`);

        return {
            ok: true,
            playerId: playerId,
            reason: reasons.SUCCESS
        };
    }else{
        return {
            ok: false,
            playerId: null,
            reason: reason.DOESNTEXIST
        };
    }
}

export function getGame(gameId){
    if(!games.has(gameId)) return{
        ok: false,
        game: null,
        reason: reasons.DOESNTEXIST
    };
    const rawgame = games.get(gameId);
    const resgame = removePlayerIds(rawgame);
    return{
        ok: true,
        game: resgame,
        reason: reasons.SUCCESS
    }
}

/**
 * do not use this function in the API, it does not use dtos as pararmeters, backend use only
 * @param {*} gameId id of the game to set the socket id
 * @param {*} newId new socket id
 * @returns true if game exists and socketid was set false if otherwise
 */
export function setGameSocketId(gameId, newId){
    if(!games.has(gameId)){
        return false;
    }
    const game = games.get(gameId);
    game.socketId = newId;
    games.set(gameId, game);
    return true;
}

export function getPlayer(gameId, identifyer){
    if(!games.has(gameId)) return {
        ok: false,
        player: null,
        reason: reasons.DOESNTEXIST
    };
    const playerNames = games.get(gameId).playerNames;
    if(playerNames.has(identifyer)) { 
        playerId = games.get(gameId).playerNames.get(identifyer);
        return{
            ok: true,
            player: games.get(gameId).players.get(playerId),
            reason: reasons.SUCCESS
        };
    }
    console.log(games)
    console.log(games.get(gameId).players instanceof Map) //temp 
    if(games.get(gameId).players.has(identifyer)){
        return {
            ok: true,
            player: games.get(gameId).players.get(identifyer),
            reason: reasons.SUCCESS
        };
    }
    return {
        ok: false,
        player: null,
        reason: reasons.DOESNTEXIST
    };
}

function removePlayerIds(game){
    const ret = { game };
    const playerArrayWithoutIds = new Array();

    ret.game.players.forEach(player => {
        playerArrayWithoutIds.push(player);
    });

    ret.game.players = playerArrayWithoutIds;

    return ret.game;
}

function createNewPlayer(playerName){
    return {
        playerName: playerName,
        score: null,
        socketId: null,
        isTurn: false,
        isReady: false,
        rollsLeft: 0
    };
}

function createNewScoreEntry(entryTitle){
    return{
        entryTitle: entryTitle,
        points: null,
        dice: null
    }
}