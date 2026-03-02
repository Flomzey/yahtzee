
export default{
    calculateCategoryScore
}

const categories = {
    ONE: { key: "one", number: 1 },
    TWO: { key: "two", number: 2 },
    THREE: { key: "three", number: 3 },
    FOUR: { key: "four", number: 4 },
    FIVE: { key: "five", number: 5 },
    SIX: { key: "six", number: 6 },

    NBR_SUM: { key: "sum-nbr" },
    BONUS: { key: "bonus" , number: 35 },
    NBR_SUM_BONUS: { key: "sum-nbr-bonus" },

    THREE_OF_A_KIND: { key: "three-oak" },
    FOUR_OF_A_KIND: { key: "four-oak" },
    FULL_HOUSE: { key: "full-h", number: 25 },
    SMALL_STRAIGHT: { key: "small-str", number: 30 },
    BIG_STRAIGHT: { key: "big-str", number: 40 },
    YAHTZEE: { key: "yahtzee", number: 50 },
    CHANCE: { key: "chance" },

    COMBINATION_SUM: { key: "sum-comb" },
}


function calculateCategoryScore(category, currentDice){
    if(currentDice[0] === null) return 0;
    let points = 0;
    let isRight = false
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
            currentDice.forEach(die => {
                if(categoryLookup[category.entryTitle] === die) points += die;
            });
        break;
        case categories.THREE_OF_A_KIND.key:
            currentDice.forEach(die => {
                points += die;
                if(isRight) return 0;
                if(existingNumbers.includes(die)) return 0;
                else existingNumbers.push(die);
                isRight = 
                checkForMinRepeations(die, 3, currentDice);
            });
            if(!isRight) points = 0;
        break;
        case categories.FOUR_OF_A_KIND.key:
            currentDice.forEach(die => {
                points += die;
                if(isRight) return 0;
                if(existingNumbers.includes(die)) return 0;
                else existingNumbers.push(die);
                isRight = 
                checkForMinRepeations(die, 4, currentDice);
            });
            if(!isRight) points = 0;
        break;
        case categories.FULL_HOUSE.key:
            currentDice.forEach(die => {
                if(existingNumbers.includes(die)) return 0;
                else existingNumbers.push(die);
            });
            if(existingNumbers.length > 2) return 0;
            if(checkForRepeations(existingNumbers[0], 1, currentDice)) return 0;
            points = categories.FULL_HOUSE.number;
        break;
        case categories.SMALL_STRAIGHT.key:
            if(checkForBigStraight(currentDice)) points = categories.SMALL_STRAIGHT.number;
            if(checkForSmlStraight(currentDice)) points = categories.SMALL_STRAIGHT.number;
        break;
        case categories.BIG_STRAIGHT.key:
            if(checkForBigStraight(currentDice)) points = categories.BIG_STRAIGHT.number;
        break;
        case categories.YAHTZEE.key:
            if(checkForMinRepeations(currentDice[0], 5, currentDice)) points = categories.YAHTZEE.number;
        break;
        case categories.CHANCE.key:
            currentDice.forEach(die => {
                points += die;
            });
        break;

    }
    console.log(points)
    return points;
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