import { nanoid } from "nanoid";

export let currentGames = new Map();

export function createGame(){
    const gameId = nanoid(6);
    const game = {
        id : gameId,
        players : new Map(),
        state : "waiting",
        round : 0
    };
    currentGames.set(gameId, game);
    console.log(currentGames)
    return game;
}