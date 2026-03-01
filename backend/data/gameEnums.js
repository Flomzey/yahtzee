export{
    states,
    categories,
    reasons
}

const states = {
    LOBBY: "lobby",
    PLAYING: "playing",
    FINISHED: "finished",
    END: "end"
}

const reasons = {
    ALREADYEXISTS: "alexist",
    ALREADYSTARTED: "alrplay",
    JOINABLE: "canjoin",
    DOESNTEXIST: "noexist",
    CREATIONFAIL: "crefail",
    SUCCESS: "success",
    EXISTS: "exists"
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