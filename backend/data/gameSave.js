import { nanoid } from "nanoid";
import { states, reasons } from "./gameEnums.js"
import * as z from "zod";

let games = new Map();

export default{
    createGame,
    ifExists,
    joinGame,
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

export function getPlayer(gameId, identifyer){
    if(!games.has(gameId)) return {
        ok: false,
        player: null,
        reason: reasons.DOESNTEXIST
    };
    if(games.get(gameId).playerNames.has(identifyer)) { 
        playerId = games.get(gameId).playerNames.get(identifyer);
        return{
            ok: true,
            player: games.get(gameId).players.get(playerId),
            reason: reasons.GETSUCCESS
        };
    }
    else{
        if(games.get(gameId).players.has(identifyer)){
            return {
                ok: true,
                player: games.get(gameId).players.get(identifyer),
                reason: reasons.GETSUCCESS
            };
        }
        else{
            return {
                ok: false,
                player: null,
                reason: reasons.DOESNTEXIST
            };
        }
    }
}

function createNewPlayer(playerName){
    return {
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