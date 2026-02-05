export{
    states,
    category,
    reasons
}

const states = {
    LOBBY: "lobby",
    PLAYING: "playing",
    FINISHED: "finished",
    END: "end"
}

const reasons = {
    ALREADYSTARTED: "playing",
    JOINABLE: "canjoin",
    DOESNTEXIST: "noexist",
    JOINSUCCESS: "joinsuc",
    CREATIONSUCCESS: "cresucc",
    CREATIONFAIL: "crefail",
    GETSUCCESS: "getsucc"
}

const category = {
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