import { nanoid, customAlphabet } from "nanoid";
import { categories, reasons, states } from "./gameEnums.js";
import { gameGo, publicGameGo } from "./gameObjects.js";
import { gameDto } from "./dtos.js"
import { check } from "zod";
import { en } from "zod/v4/locales";

let games = new Map();
const alphabet = "0123456789";

export default{
    createGame,
    ifExists,
    joinGame,
    getPlayer,
    setPlayerSocketId,
    getGame,
    setGameSocketId,
    getPublicGame,
    ifPlayerExists,
    updateCurrentRoll,
    saveCategory
}

/**
 * Creates a game entry with no players
 * @returns object {ok: boolean, game: gameObject}
 */
export function createGame(){
    const gameIdCreator = customAlphabet(alphabet, 6)
    const gameId = gameIdCreator();// missing logic for collision
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

export function ifPlayerExists(gameId, playerId){
    const {ok} = ifExists(gameId);
    if(ok){
        if(games.get(gameId).players.has(playerId)) return {
            ok: true,
            reason: reasons.EXISTS
        };
        return {
            ok: false,
            reason: reasons.DOESNTEXIST
        };
    }
    return {
        ok: false,
        reason: reasons.DOESNTEXIST
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

        Object.values(categories).map(c => c.key).forEach(entryTitle => {
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
    return{
        ok: true,
        game: games.get(gameId),
        reason: reasons.SUCCESS
    }
}

export function getPublicGame(gameId){
    if(!games.has(gameId)) return{
        ok: false,
        game: null,
        reason: reasons.DOESNTEXIST
    };
    const rawGame = games.get(gameId);
    const noPlayerIdGame = removeIds(rawGame);
    const resGame = extractMaps(noPlayerIdGame);
    return{
        ok: true,
        game: resGame,
        reason: reasons.SUCCESS
    }
}

export function setPlayerSocketId(gameId, playerId, newId){
    if(!games.has(gameId)) return false;
    if(!games.get(gameId).players.has(playerId)) return false;
    games.get(gameId).players.get(playerId).socketId = newId;
    return true;
}

export function saveCategory(gameId, playerId, categoryTitle){
    if(!games.has(gameId)) return false;
    if(!games.get(gameId).players.has(playerId)) return false;
    const player = games.get(gameId).players.get(playerId);
    const scoreToChange = player.score.get(categoryTitle);
    if(scoreToChange.dice[1] !== null) return false;
    scoreToChange.dice = player.currentRoll;
    calculateCategoryScore(scoreToChange);
    calculateSumScores(player.score);
    calculateBonus(player.score);
    player.totalPoints = 
    player.score.get(categories.NBR_SUM_BONUS.key).points + 
    player.score.get(categories.COMBINATION_SUM.key).points;
    return true;
}

function calculateSumScores(playerScore){
    let sum = 0;
    playerScore.forEach(entry => {
        switch(entry.entryTitle){
            case categories.NBR_SUM.key:
                entry.points = sum;
            break;
            case categories.COMBINATION_SUM.key:
                entry.points = sum;
                sum = 0;
            break;
            case categories.NBR_SUM_BONUS.key:
                entry.points = sum;
                sum = 0;
            break;
            case categories.BONUS.key:
                if(sum >= 63){
                    entry.points = categories.BONUS.number;
                    sum += entry.points;
                }
                else entry.points = 0;
            break;
            default:
                sum += entry.points;
            break;
        }
        console.log(entry.entryTitle, entry.points)
    });
}

function calculateBonus(playerScore){
    const numbersum = playerScore.get(categories.NBR_SUM.key).points;
    if(numbersum >= 63){
        playerScore.get(categories.BONUS.key).points = categories.BONUS.number;
        playerScore.get(categories.NBR_SUM_BONUS.key).points = numbersum + categories.BONUS.number;
    }
}

function calculateCategoryScore(category){
    category.points = 0;
    let isRight = false;
    let existingNumbers = new Array;
    switch(category.entryTitle){
        case categories.ONE.key:
        case categories.TWO.key:
        case categories.THREE.key:
        case categories.FOUR.key:
        case categories.FIVE.key:
        case categories.SIX.key:
            const categoryLookup = Object.fromEntries(
                Object.values(categories)
                .filter(c => typeof c.number === "number")
                .map(c => [c.key, c.number])
            );
            category.dice.forEach(die => {
                if(categoryLookup[category.entryTitle] === die) category.points += die;
            });
        break;
        case categories.THREE_OF_A_KIND.key:
            category.dice.forEach(die => {
                category.points += die;
                if(isRight) return;
                if(existingNumbers.includes(die)) return;
                else existingNumbers.push(die);
                isRight = 
                checkForMinRepeations(die, 3, category.dice);
            });
            if(!isRight) category.points = 0;
        break;
        case categories.FOUR_OF_A_KIND.key:
            category.dice.forEach(die => {
                category.points += die;
                if(isRight) return;
                if(existingNumbers.includes(die)) return;
                else existingNumbers.push(die);
                isRight = 
                checkForMinRepeations(die, 4, category.dice);
            });
            if(!isRight) category.points = 0;
        break;
        case categories.FULL_HOUSE.key:
            category.dice.forEach(die => {
                if(existingNumbers.includes(die)) return;
                else existingNumbers.push(die);
            });
            if(existingNumbers.length > 2) return;
            if(checkForRepeations(existingNumbers[0], 1, category.dice)) return;
            category.points = categories.FULL_HOUSE.number;
        break;
        case categories.SMALL_STRAIGHT.key:
            if(checkForBigStraight(category.dice)) category.points = categories.SMALL_STRAIGHT.number;
            if(checkForSmlStraight(category.dice)) category.points = categories.SMALL_STRAIGHT.number;
        break;
        case categories.BIG_STRAIGHT.key:
            if(checkForBigStraight(category.dice)) category.points = categories.BIG_STRAIGHT.number;
        break;
        case categories.YAHTZEE.key:
            if(checkForMinRepeations(category.dice[0], 5, category.dice)) category.points = categories.YAHTZEE.number;
        break;
        case categories.CHANCE.key:
            category.dice.forEach(die => {
                category.points += die;
            });
        break;

    }
}

function checkForMinRepeations(number, repetition, checkArray){
    let count = 0;
    checkArray.forEach(nbr => {
        if(nbr === number) count++;
    });
    if(count >= repetition) return true;
    return false;
}

function checkForRepeations(number, repetition, checkArray){
    let count = 0;
    checkArray.forEach(nbr => {
        if(nbr === number) count++;
    });
    if(count === repetition) return true;
    return false;
}

function checkForBigStraight(array){
    return (
        [1, 2, 3, 4, 5].every(nbr => array.includes(nbr)) || 
        [2, 3, 4, 5, 6].every(nbr => array.includes(nbr))
    );
}

function checkForSmlStraight(array){
    const pos = [
        [1, 2, 3, 4],
        [2, 3, 4, 5],
        [3, 4, 5, 6]
    ];
    let isSmStraight = false;
    let count = 0;
    pos.forEach(arr => {
        if(isSmStraight) return;
        arr.forEach(nbr => {
            if(array.includes(nbr)) count++;
        });
        isSmStraight = count === 4;
        count = 0;
    });
    return isSmStraight;
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

function updateCurrentRoll(gameId, playerId, newRoll){
    const {ok} = ifPlayerExists(gameId, playerId);
    if(ok){
        games.get(gameId).players.get(playerId).currentRoll = newRoll;
        return {
            ok: true,
            reason: reasons.SUCCESS
        };
    }
    return {
        ok: false,
        reason: reasons.DOESNTEXIST
    };
}

function removeIds(game){
    const parsed = publicGameGo.safeParse(game);

    if(!parsed.success){
        return null;
    }

    const gameCopy = parsed.data;
    const playerArrayWithoutIds = new Array();

    gameCopy.players.forEach(player => {
        playerArrayWithoutIds.push(player);
    });

    gameCopy.players = playerArrayWithoutIds;

    return gameCopy;
}

function extractMaps(gameWithoutPlayerIds){
    gameWithoutPlayerIds.players = [...gameWithoutPlayerIds.players.values()];
    return gameWithoutPlayerIds;
}

function createNewPlayer(playerName){
    return {
        playerName: playerName,
        score: null,
        socketId: null,
        isTurn: false,
        isReady: false,
        currentRoll: [null, null, null, null, null],
        rollsLeft: 0,
        totalPoints: 0
    };
}

function createNewScoreEntry(entryTitle){
    return{
        entryTitle: entryTitle,
        points: null,
        dice: [null, null, null, null, null]
    }
}