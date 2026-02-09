import z from "zod";
import { categories, states } from "./gameEnums.js";

export {
    games as gamesGo,
    game as gameGo,
    player as playerGo,
    scoreEntry as scoreEntryGo
}

const scoreEntry = z.object({
    entryTitle: z.enum(Object.values(categories)),
    points: z.int().nullable(),
    dice: z.array(z.int).nullable()
});

const player = z.object({
    playerName: z.string(),
    score: scoreEntry.nullable(),
    socketId: z.string().nullable(),
    isTurn: z.boolean(),
    isReady: z.boolean(),
    rollsLeft: z.int()
});

const game = z.object({
    gameId: z.string(6),
    socketId: z.string().nullable(),
    players: z.map(z.string(4), player),
    playerNames: z.map(z.string(), z.string(4)),
    state: z.enum(Object.values(states)),
    roundsLeft: z.int(),
    lastAction: z.date()
});

const games = z.map(z.string(6), game);