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
    SUCCESS: "success"
}

const categories = {
    ONE: "one",
    TWO: "two",
    THREE: "three",
    FOUR: "four",
    FIVE: "five",
    SIX: "six",
    THREE_OF_A_KIND: "three-oak",
    FOUR_OF_A_KIND: "four-oak",
    FULL_HOUSE: "full-h",
    SMALL_STRAIGHT: "small-str",
    BIG_STRAIGHT: "big-str",
    YAHTZEE: "yahtzee",
    CHANCE: "chance"
}