import gameSave from "../data/gameSave.js";

export default{
    rollDice,
}

/**
 * rolls the dice according to the array if an element is not 
 * truthy a new random number from 1 to 6 is generated
 * @param {int[]} rollArray 
 * @returns {int[]} returns an array with only integers, the 
 * before sent array will have new random integers instead
 * of the null elements
 */
function rollDice(rollArray){
    const res = new Array;
    for(let i = 0; i < rollArray.length; i++){
        if(!rollArray[i]) res[i] = getRandomInt(6);
        else res[i] = rollArray[i];
    }
    return res;
}

/**
 * This method returns a random integer decided by the maximum integer value starting from 1 => max
 * @param {int} max the maximum number the random number will have 
 * @returns 
 */
function getRandomInt(max){
    return Math.ceil(Math.random() * max);
}