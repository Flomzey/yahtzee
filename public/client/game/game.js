const middleBox = document.getElementById("middle-box");
const scoreBox = document.getElementById("score-box");
const clickableScoreItems = document.querySelectorAll(".score-item.clickable");
const upperRoll = document.getElementById("dice-box-top");
const lowerRoll = document.getElementById("dice-box-bot");
const rollBtn = document.getElementById("roll-dice");
const diceBox = document.getElementById("dice-box");
const saveBtn = document.getElementById("save");

let players;
let localPlayer;
let localCurrentDice = [null, null, null, null, null];
let selectedDice = [false, false, false, false, false];
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
    addButtonListeners();
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
                if(localCurrentDice[1] !== null) saveBtn.classList.remove("pressed");
                buildScoresheet(); // have to rebuild the scoresheet to make changes effective
            });
        }
    });
}

function addDiceClickListeners(){
    const dice = document.querySelectorAll(".die");
    dice.forEach(die => {
        die.addEventListener("click", () => {
            const index = die.dataset.index;

            if(selectedDice[index]){
                die.classList.remove("pressed");
                die.classList.add("no-pressed");
            }else{
                die.classList.remove("no-pressed");
                die.classList.add("pressed");
            }
            selectedDice[index] = !selectedDice[index];
        })
    });
}

function addButtonListeners(){
    const buttons = document.querySelectorAll(".button");
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            if(button.classList.contains("pressed")) return;
            buttonAnimation(button);
            handleButtonPress(button);
        });
    });
}

socket.on("connect:sync", data => {
    syncLocalData(data);
});

socket.on("reconnect:sync", data => {
    syncLocalData(data);
    buildDiceRoll();
});

socket.on("player:sync", data => {
    syncLocalData(data);
    buildDiceRoll();
});

socket.on("player:roll:res", dice => {
    localCurrentDice = dice;
    buildDiceRoll();
    buildScoresheet();
});

socket.on("player:save:sync", data => {//TODO: send publicGame data from server
    syncLocalData(data);
});

function syncLocalData(data){
    localPlayer = data.player;
    localScoreSheet = data.player.score.map(scoreEntry => ({
        ...scoreEntry,
        selected: false
    }));
    players = data.publicGame.game.players;
    if(localPlayer.isTurn) rollBtn.classList.remove("pressed");
    //else rollBtn.classList.add("pressed");  first implement the whole game logic and logos
    localCurrentDice = localPlayer.currentRoll;
    buildScoresheet();
    updateScore();
}

function handleButtonPress(button){
    switch(button.id){
        case "roll-dice":
            console.log(localCurrentDice);
            let reqDice = localCurrentDice;
            console.log(selectedDice)
            console.log(reqDice)
            for(let i = 0; i < selectedDice.length; i++){
                console.log(i)
                if(!selectedDice[i]){
                    reqDice[i] = null;
                }
            }
            socket.emit("player:roll", reqDice);
            unselectScoresheet();
        break;
        case "save":
            localScoreSheet.forEach(entry => {
                if(entry.selected){
                    socket.emit("player:save:category", entry.entryTitle);
                }
            });
            refreshDice();
            saveBtn.classList.add("pressed");
        break;
        case "menu": console.log("menu")
        break;
        case "quit": console.log("quit")
    }
}

async function buttonAnimation(button){
    if(button.id === "save") return;
    button.classList.add("pressed");
    await sleep(180);
    button.classList.remove("pressed");
}

function buildDiceRoll(){
    if(localCurrentDice[1] === null) return;
    lowerRoll.innerHTML = null;
    upperRoll.innerHTML = null;
    let i = 0;
    for(i = 0; i < 2; i++){
        const div = renderDie(localCurrentDice[i], selectedDice[i]);
        div.dataset.index = i;
        upperRoll.appendChild(div);
    }
    for(i = i; i < 5; i++){
        const div = renderDie(localCurrentDice[i], selectedDice[i]);
        div.dataset.index = i;
        lowerRoll.appendChild(div);
    }
    addDiceClickListeners();
}

function renderDie(dots, pressed){
    const res = document.createElement("div");
    if(pressed){
        res.classList.add("die", "pressed", `eye${dots}`);
        return res;
    }
    res.classList.add("die", "no-pressed", `eye${dots}`);
    return res;
}

function buildScoresheet(){
    middleBox.innerHTML = null;
    for(let i = 0; i < localScoreSheet.length; i++){
        const div = document.createElement("div");
        div.dataset.entryTitle = localScoreSheet[i].entryTitle;
        div.classList.add("score-item");

        if(isClickable(localScoreSheet[i])) {
            if(localCurrentDice[1] === null) div.classList.add("noclickable");
            else div.classList.add("clickable");
        }
        else{
            if(localScoreSheet[i].selected) div.classList.add("selected");
            else if(isSumEntry(localScoreSheet[i])) div.classList.add("sum-item");
            else div.classList.add("noclickable");
        }
        renderInnerEntry(i, div);
        middleBox.appendChild(div);
    }
    addScoreListClickListeners(); //read the listeners so the next click is registered
}

function unselectScoresheet(){
    localScoreSheet.forEach(entry => {
        if(entry.selected) entry.selected = false;
    });
    saveBtn.classList.add("pressed");
    console.log(saveBtn);}

function refreshDice(){
    localCurrentDice = [null, null, null, null, null];
    selectedDice = [false, false, false, false, false];
    upperRoll.innerHTML = null;
    lowerRoll.innerHTML = null;
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

function renderInnerEntry(i, div){
    const entryLogoDiv = document.createElement("div");
    entryLogoDiv.classList.add("score-item-inner-logo");
    renderInnerLogo(entryLogoDiv, div.dataset.entryTitle);
    div.appendChild(entryLogoDiv);

    const entryDiceDiv = document.createElement("div");
    entryDiceDiv.classList.add("score-item-inner-dice");
    if(!isSumEntry(localScoreSheet[i])) renderInnerDice(i, entryDiceDiv);
    div.appendChild(entryDiceDiv);

    const entryScoreText = document.createElement("div");
    entryScoreText.classList.add("score-item-points");
    entryScoreText.innerHTML = localScoreSheet[i].points === null ? "0" : localScoreSheet[i].points;
    const entryScoreDiv = document.createElement("div");
    entryScoreDiv.appendChild(entryScoreText);

    entryScoreDiv.classList.add("score-item-inner-points");
    div.appendChild(entryScoreDiv);
}

function renderInnerDice(i, entryDiceDiv){
    for(let j = 0; j < localScoreSheet[i].dice.length; j++){
        const dieDiv = document.createElement("div");
        dieDiv.classList.add("score-die");
        if(!localScoreSheet[i].dice[j]) dieDiv.classList.add(`eye${localCurrentDice[j]}`);
        else dieDiv.classList.add(`eye${localScoreSheet[i].dice[j]}`);
        entryDiceDiv.appendChild(dieDiv);
    }
}

function renderInnerLogo(entryLogoDiv, entryTitle){
    switch(entryTitle){
        case "one":
            entryLogoDiv.classList.add("eye1");
            break;
        case "two":
            entryLogoDiv.classList.add("eye2");
            break;
        case "three":
            entryLogoDiv.classList.add("eye3");
            break;
        case "four":
            entryLogoDiv.classList.add("eye4");
            break;
        case "five":
            entryLogoDiv.classList.add("eye5");
            break;
        case "six":
            entryLogoDiv.classList.add("eye6");
            break;
    }
}

function updateScore(){
    scoreBox.innerHTML = localPlayer.totalPoints;
}

function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}