const modal = document.getElementById("modal");
const input = document.getElementById("name-input");
const notEnough = document.getElementById("not-enough");
const okButton = document.getElementById("button-ok");
const socket = io();
let players = new Array;
let gameId = "";

main();

async function main(){
    gameId = await createGame();
    socket.emit("lobby:create", gameId);
}

socket.on("player:joined", (playerName) => {
    console.log(playerName + " joined")
    players.push(playerName);
    updateList();
});

async function createGame() {
    const res = await fetch("/api/game/create", {method:"POST"});
    const data = await res.json();
    document.getElementById("game-id").innerHTML = data.game.id;
    return data.game.id;
}

async function addPlayer(name){
    const res = await fetch("/api/game/join",{
        method: "POST",
        headers : {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            gameId: gameId,
            name: name
        })
    });
    console.log(res);
    players.push(await res.json());
    console.log(players)
}

document.getElementById("start-btn").onclick = () => {
    console.log(players.length)
    if(players.length <= 1){
        modal.style.display = "flex";
        notEnough.style.display = "flex";
    }else{
        //start game
    }
}

okButton.onclick = () => {
    modal.style.display = "none";
    notEnough.style.display = "none";
}

document.getElementById("add-btn").onclick = () => {
    modal.style.display = "flex";
    input.style.display = "flex";
    input.focus();
};

input.addEventListener("keydown", (e) => {
    if(e.key === "Escape"){
        input.value = "";
        modal.style.display = "none";
        input.style.display = "none";
    }
    if(e.key === "Enter" && input.value !== ""){
        addPlayer(input.value).then(() => {
            input.value = "";
            modal.style.display = "none";
            input.style.display = "none";
            updateList();
        });
    }
});

function updateList(){
    const botbox = document.getElementById("bot-box");
    botbox.innerHTML = "";
    players.forEach(player => {
        const nameElement = document.createElement("div");
        nameElement.classList.add("name-list-item");
        nameElement.textContent = player;
        botbox.appendChild(nameElement);
    });
}