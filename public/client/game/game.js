const middleBox = document.getElementById("middle-box");
const scoreBox = document.getElementById("score-box");

let players;
let localPlayer;

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
}

socket.on("connect:sync", player => {
    localPlayer = player;
    buildScoresheet();
    updateScore();
});

socket.on("reconnect:sync", res => {
    localPlayer = res.player;
    buildScoresheet();
    updateScore();
    const game = res.publicGame.game;
    players = game.players;
    players.forEach(p => {
        
    });
});

function buildScoresheet(){
    middleBox.innerHTML = null;
    const playerScore = localPlayer.score;
    let i = 0;
    playerScore.forEach(scoreEntry => {
        if(scoreEntry.entryTitle === "sum-comb" || scoreEntry.entryTitle === "sum-nbr" || 
        scoreEntry.entryTitle === "bonus" || scoreEntry.points !== null){
            middleBox.innerHTML += `
                <div class="score-item" id="score-item-noclickable">${scoreEntry.entryTitle}</div>
            `
        }else{
            if(i === 0 || i === 8){
                middleBox.innerHTML += `
                    <div class="score-item" id="score-item-clickable" style="border-top:inset #a5a184">${scoreEntry.entryTitle}</div>
                `
            }else{
                middleBox.innerHTML += `
                    <div class="score-item" id="score-item-clickable">${scoreEntry.entryTitle}</div>
                `
            }
        }
        i++;
    });
}

function updateScore(){
    scoreBox.innerHTML = localPlayer.totalPoints;
}