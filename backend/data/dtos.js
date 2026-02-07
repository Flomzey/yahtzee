import * as z from "zod";
import {reasons, states, categories} from "./gameEnums.js"

export {
    createGameResDto,
    playerJoinDto,
    getPlayerDto,
    getPlayerResDto,
    playerJoinResDto,
    ifExistsDto,
    ifExistsResDto,
    getGameResDto
}

const scoreEntry = z.object({
    entryTitle: z.enum(Object.values(categories)),
    points: z.int().nullable(),
    dice: z.array().nullable()
});

const player = z.object({
    playerName: z.string(),
    score: z.map(z.string(), scoreEntry),
    isTurn: z.boolean(),
    isReady: z.boolean(),
    rollsLeft: z.int()
});

const gameOnCreation = z.object({
    gameId: z.string(6),
    state: z.enum(Object.values(states)),
    roundsLeft: z.int()
});

const game = z.object({
    gameId: z.string(6),
    players: z.array(player),
    state: z.enum(Object.values(states)),
    roundsLeft: z.int()
});

const createGameResDto = z.object({
    ok: z.boolean(),
    game: gameOnCreation,
    reason: z.enum(Object.values(reasons))
});

const playerJoinDto = z.object({
    gameId : z.string(6),
    playerName : z.string()
});

const playerJoinResDto = z.object({
    ok: z.boolean(),
    playerId: z.string(4).nullable(),
    reason: z.enum(Object.values(reasons))
});

const getPlayerDto = z.object({
    gameId: z.string(6),
    identifyer: z.string()
});

const getPlayerResDto = z.object({
    ok: z.boolean(),
    player: player.nullable(),
    reason: z.enum(Object.values(reasons))
})

const ifExistsDto = z.object({
    gameId: z.string(6)
});

const ifExistsResDto = z.object({
    ok: z.boolean(),
    reason: z.enum(Object.values(reasons))
});

const getGameResDto = z.object({
    ok: z.boolean(),
    game: game.nullable(),
    reason: z.enum(Object.values(reasons))
});