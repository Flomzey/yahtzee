const modal = document.getElementById("modal");
const idModal = document.getElementById("modal-id");
const nameModal = document.getElementById("modal-name");
const idInput = document.getElementById("modal-input-id");
const nameInput = document.getElementById("modal-input-name");
const idButton = document.getElementById("modal-button-id");
const nameButton = document.getElementById("modal-button-name");
const params = new URLSearchParams(window.location.search);
let gameId = "";
let playerName = "";

main();

async function main(){
    modal.style.display = "flex";
    gameId = await checkGameId(params.get("gameId"));
    playerName = await askName();
    modal.style.display = "none";
    console.log(`GameId:${gameId} PlayerName:${playerName}`);
    sessionStorage.setItem("gameId", gameId);
    const res = await joinGame();
    const data = await res.json();
    sessionStorage.setItem("playerId", data.playerId)
    window.location.href = "../game"
}

async function checkGameId(id){
    if(id !== null){
        res = await ifGameExists(id);
        data = await res.json();
        if(data.ok){
            return id;
        }else{
            return await wrongGameId();
        }
    }
    return await wrongGameId();
}

async function wrongGameId(){
    let id = "";
    do{
        id = await askCode();
        res = await ifGameExists(id);
        data = await res.json();
        if(data.reason === "playing"){
            console.log(data.reason)
            //TODO: UI Feedback
        }
        if(data.reason === "noexist"){
            console.log(data.reason)
            //TODO: UI Feedback
        }
    }while(!data.ok)
    return id;
}

async function askCode(){
    return new Promise(resolve => {
        idModal.style.display = "flex";

        const handlerClick = () => finish();
        const handlerKey = (e) => {
            if(e.key === "Enter") finish();
        };

        const finish = () => {
            const input = idInput.value.trim();
            if(input === "") return;
            idInput.value = "";
            idModal.style.display = "none";
            idButton.removeEventListener("click", handlerClick);
            idInput.removeEventListener("keydown", handlerKey);
            resolve(input);
        };

        idButton.addEventListener("click", handlerClick);
        idInput.addEventListener("keydown", handlerKey);
    });
}

async function askName(){
    return new Promise((resolve) => {
        nameModal.style.display = "flex";

        const handlerClick = (e) => finish();
        const handlerKey = (e) => {
            if(e.key === "Enter") finish();
        }

        finish = () => {
            if(nameInput.value === "") return;
            const input = nameInput.value;
            nameInput.value = "";
            nameModal.style.display = "none";
            nameInput.removeEventListener("click", handlerClick);
            nameInput.removeEventListener("keydown", handlerKey);
            resolve(input);
        }

        nameButton.addEventListener("click", handlerClick);
        nameInput.addEventListener("keydown", handlerKey);
    });
}

async function ifGameExists(id){
    return fetch("/api/game/exists", {
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            gameId: id
        })
    });
}

async function joinGame(){
    return fetch("/api/game/join", {
        method: "POST",
        headers : {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            gameId: gameId,
            playerName: playerName
        })
    });
}



idInput.addEventListener("keydown", (e) => {
    if(e.keyCode === "Enter" && idInput.value !== ""){
        gameId = idInput.value;
    }
})