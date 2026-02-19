const middleBox = document.getElementById("middle-box");

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
});

socket.on("reconnect:sync", res => {
    localPlayer = res.player;
    buildScoresheet();
    const game = res.publicGame.game;
    players = game.players;
    players.forEach(p => {
        
    });
});

function buildScoresheet(){
    middleBox.innerHTML = null;
    const playerScore = localPlayer.score;
    playerScore.forEach(scoreEntry => {
        middleBox.innerHTML += `
        <div class="score-item">${scoreEntry.entryTitle}</div>
        `
    });
}