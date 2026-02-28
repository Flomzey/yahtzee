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
    BONUS: { key: "bonus" },

    THREE_OF_A_KIND: { key: "three-oak" },
    FOUR_OF_A_KIND: { key: "four-oak" },
    FULL_HOUSE: { key: "full-h" },
    SMALL_STRAIGHT: { key: "small-str" },
    BIG_STRAIGHT: { key: "big-str" },
    YAHTZEE: { key: "yahtzee" },
    CHANCE: { key: "chance" },

    COMBINATION_SUM: { key: "sum-comb" },
}