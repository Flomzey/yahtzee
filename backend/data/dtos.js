import * as z from "zod";

export {
    createGameResDto,
    playerJoinDto,
    getPlayerDto,
    getPlayerResDto,
    playerJoinResDto,
    ifExistsDto,
    ifExistsResDto
}

const gameOnCreate = z.object({
    gameId: z.string(6),
    state: z.string(),
});

const createGameResDto = z.object({
    ok: z.boolean(),
    game: gameOnCreate,
    reason: z.string(7)
});

const playerJoinDto = z.object({
    gameId : z.string(6),
    playerName : z.string()
});

const playerJoinResDto = z.object({
    ok: z.boolean(),
    playerId: z.string(4),
    reason: z.string(7)
});

const getPlayerDto = z.object({
    gameId: z.string(6),
    playerId : z.string(4)
});

const getPlayerResDto = z.object({
    ok: z.boolean(),
    player: z.object(),
    reason: z.string(7)
})

const ifExistsDto = z.object({
    gameId: z.string(6)
});

const ifExistsResDto = z.object({
    ok: z.boolean(),
    reason: z.string(7)
});