const middleBox = document.getElementById("middle-box");
const scoreBox = document.getElementById("score-box");
const clickableScoreItems = document.querySelectorAll(".score-item.clickable");
const rollBtn = document.getElementById("roll-dice");

let players;
let localPlayer;
let localScoreSheet = new Array;

const socket = io("ws://127.0.0.1:3000", 
    {
        transports: ["websocket"],
        autoconnect: false
    }
);

main();

function main(){
    socket.auth = {
        gameId: sessionStorage.getItem("gameId"),
        playerId: sessionStorage.getItem("playerId"),
        role: "player"
    };
    socket.connect();
    addButtonAnimations();
}

function addScoreListClickListeners(){
    const scores = document.querySelectorAll(".score-item");
    scores.forEach(score => {
        if(score.classList.contains("clickable")){
            score.addEventListener("click", () =>{
                localScoreSheet.forEach(scoreEntry => {
                    if(scoreEntry.entryTitle === score.dataset.entryTitle){
                        scoreEntry.selected = true;
                    }else{
                        if(scoreEntry.selected) scoreEntry.selected = false;
                    }
                });
                buildScoresheet(); // have to rebuild the scoresheet to make changes effective
            });
        }
    });
}

function addButtonAnimations(){
    const buttons = document.querySelectorAll(".button");
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            buttonAnimation(button);
            handleButtonPress(button);
        });
    });
}

socket.on("connect:sync", player => {
    localPlayer = player;
    localScoreSheet = player.score;
    buildScoresheet();
    updateScore();
});

socket.on("reconnect:sync", res => {
    localPlayer = res.player;
    localScoreSheet = res.player.score.map(scoreEntry => ({
        ...scoreEntry,
        selected: false
    }));
    buildScoresheet();
    updateScore();
    const game = res.publicGame.game;
    players = game.players;
});

function handleButtonPress(button){
    switch(button.id){
        case "roll-dice":
            socket.emit("player:roll", localPlayer);
            break;
        case "save": console.log("save")
            break;
        case "menu": console.log("menu")
            break;
        case "quit": console.log("quit")
    }
}

async function buttonAnimation(button){
    button.classList.add("pressed");
    await sleep(180);
    button.classList.remove("pressed");
}

function buildScoresheet(){
    middleBox.innerHTML = null;
    for(let i = 0; i < localScoreSheet.length; i++){
        const div = document.createElement("div");
        div.dataset.entryTitle = localScoreSheet[i].entryTitle;
        div.classList.add("score-item");
        //div.innerHTML = `${localScoreSheet[i].entryTitle}`//temporary, missing proper UI

        if(isClickable(localScoreSheet[i])) {
            div.classList.add("clickable");
            renderEntry(i, div);
        }
        else{
            if(localScoreSheet[i].selected) div.classList.add("selected");
            else if(isSumEntry(localScoreSheet[i])) div.classList.add("sum-item");
            else div.classList.add("noclickable");
        }
        middleBox.appendChild(div);
    }
    addScoreListClickListeners(); //readd the listeners so the next click is registered
}

function isSumEntry(scoreEntry){
    return scoreEntry.entryTitle === "sum-comb" || 
    scoreEntry.entryTitle === "sum-nbr" ||
    scoreEntry.entryTitle === "bonus";
}

function isClickable(scoreEntry){
    return scoreEntry.entryTitle !== "sum-comb" && 
    scoreEntry.entryTitle !== "sum-nbr" && 
    scoreEntry.entryTitle !== "bonus" && 
    !scoreEntry.selected &&
    scoreEntry.points === null;
}

function renderEntry(i, div){
    if(i === 0 || i === 8){
        div.classList.add("top");
    }
    if(i === 7 || i === 15){
        div.classList.add("bot");
    }
    if(i < 8){
        div.classList.add("left");
    }else{
        div.classList.add("right");
    }

    if(i === 0){//topleft corner
        if(!isClickable(localScoreSheet[i+1])) div.classList.add("bot"); //bottom element is non clickable
        if(!isClickable(localScoreSheet[i+8])) div.classList.add("right"); //right element is non clickable 
        return;
    }
    if(i === 8){//topright corner
        if(!isClickable(localScoreSheet[i+1])) div.classList.add("bot"); //bottom element is non clickable
        if(!isClickable(localScoreSheet[i-8])) div.classList.add("left"); //left element is non clickable 
        return;
    }
    if(i === 7){//botleft corner
        if(!isClickable(localScoreSheet[i-1])) div.classList.add("top"); //top element is non clickable
        if(!isClickable(localScoreSheet[i+8])) div.classList.add("right"); //right element is non clickable 
        return;
    }
    if(i === 15){
        if(!isClickable(localScoreSheet[i-1])) div.classList.add("top"); //top element is non clickable
        if(!isClickable(localScoreSheet[i-8])) div.classList.add("left"); //left element is non clickable 
        return;
    }

    if(i < 8){
        if(!isClickable(localScoreSheet[i-1])) div.classList.add("top");
        if(!isClickable(localScoreSheet[i+1])) div.classList.add("bot");
        if(!isClickable(localScoreSheet[i+8])) div.classList.add("right");
    }else{
        if(!isClickable(localScoreSheet[i-1])) div.classList.add("top");
        if(!isClickable(localScoreSheet[i+1])) div.classList.add("bot");
        if(!isClickable(localScoreSheet[i-8])) div.classList.add("left");
    }
}

function updateScore(){
    scoreBox.innerHTML = localPlayer.totalPoints;
}

function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}