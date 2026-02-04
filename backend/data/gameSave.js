import { nanoid } from "nanoid";
import gameEnums from "./gameEnums.js"

let games = new Map();

/**
 * Creates a game entry with no players
 * @returns object {ok: boolean, game: gameObject}
 */
export function createGame(){
    const gameId = nanoid(6);// missing logic for collision
    const game = {
        id: gameId,
        socketid: null,
        players: new Map(),
        state: gameEnums.states.LOBBY,
        roundsLeft: 13,
        lastAction: new Date() //later check if newdate.getTime() - olddate.getTime() > some value in ms
    };
    games.set(gameId, game);
    return {
        ok: true,
        game: game
    }
}

/**
 * adds the socketId to the game belonging to the gameId
 * @param {*} gameId 
 * @param {*} socketId 
 * @returns true if game exists and SocketId was added, false if game doesnt exist and socketId couldn't be added
 */
export function setGameSocketId(gameId, socketId){
    if(!games.has(gameId)) return false;
    const game = games.get(gameId);
    game.socketId = socketId;
    return true;
}

export function getGameSocketId(gameId){
    if(!games.has(gameId)) return null;
    return games.get(gameId).socketId;
}

export function getPlayerName(gameId, playerId){
    if(!games.has(gameId)) return null;
    return games.get(gameId).players.get(playerId).name;
}

/**
 * 
 * @param {String, String} gameId playerName 
 * @returns object {ok: boolean, game: gameObject || error: String}
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
        console.log(game)
        return {
            ok: true,
            player: player,
        };
    }
    return {
        ok: false,
        error: "game does not exist"
    }
}

function createNewPlayer(playerName, playerId){
    return {
        id: playerId,
        name: playerName,
        score: null,
        isTurn: false,
        isReady: false,
        rollsLeft: 0
    }
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
    }
}

export default{
    createGame,
    joinGame,
    setGameSocketId,
    getGameSocketId,
    getPlayerName
}