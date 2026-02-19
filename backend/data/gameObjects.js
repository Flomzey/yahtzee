import z from "zod";
import { categories, states } from "./gameEnums.js";

export {
    games as gamesGo,
    game as gameGo,
    player as playerGo,
    scoreEntry as scoreEntryGo,
    publicGame as publicGameGo,
    publicPlayer as publicPlayerGo
}

const scoreEntry = z.object({
    entryTitle: z.enum(Object.values(categories)),
    points: z.int().nullable(),
    dice: z.array(z.int()).nullable()
});

const player = z.object({
    playerName: z.string(),
    score: z.map(z.enum(Object.values(categories)), scoreEntry),
    socketId: z.string().nullable(),
    isTurn: z.boolean(),
    isReady: z.boolean(),
    rollsLeft: z.int()
});

const publicPlayer = z.object({
    playerName: z.string(),
    score: z.map(z.enum(Object.values(categories)), scoreEntry),
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

const publicGame = z.object({
    gameId: z.string(6),
    players: z.map(z.string(4), publicPlayer),
    state: z.enum(Object.values(states)),
    roundsLeft: z.int(),
    lastAction: z.date()
});

const games = z.map(z.string(6), game);