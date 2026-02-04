import { nanoid } from "nanoid";

export let currentGames = new Map();

/**
 * Creates a game entry with no players
 * @returns object {ok: boolean, game: gameObject}
 */
export function createGame(){
    const gameId = nanoid(6);// missing logic for collision
    const game = {
        id : gameId,
        players : new Map(),
        state : "waiting",
        round : 0
    };
    currentGames.set(gameId, game);
    return {
        ok: true,
        game: game
    }
}
/**
 * 
 * @param {String, String} gameId playerName 
 * @returns object {ok: boolean, game: gameObject || error: String}
 */
export function joinGame(gameId, playerName){
    if(currentGames.has(gameId)){
        const playerId = nanoid(4); //missing logic for collision
        const game = currentGames.get(gameId);
        game.players.set(playerId, playerName);
        currentGames.set(gameId, game);
        console.log(game)
        return {
            ok: true,
            id: playerId,
            name : playerName,
            players : players.values()
        };
    }
    return {
        ok: false,
        error: "game does not exist"
    }
}