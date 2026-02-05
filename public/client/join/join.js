const modal = document.getElementById("modal");
const idModal = document.getElementById("modal-id");
const nameModal = document.getElementById("modal-name");
const idInput = document.getElementById("modal-input-id");
const nameInput = document.getElementById("modal-input-name");
const idButton = document.getElementById("modal-button-id");
const nameButton = document.getElementById("modal-button-name");
const params = new URLSearchParams(window.location.search);
let gameId = params.get("gameId");
let playerName = "";

main();

async function main(){
    modal.style.display = "flex";
    if(gameId === null){
        gameId = await askCode();
        playerName = await askName();
    }else{
        playerName = await askName();
    }
    modal.style.display = "none";
    console.log(`GameId:${gameId} PlayerName:${playerName}`);
    sessionStorage.setItem("gameId", gameId);
    joinGame()
    .then(res => res.json())
    .then(data => sessionStorage.setItem("playerId", data.playerId))
    .then(() => window.location.href = "../game");
}

async function askCode(){
    return new Promise((resolve) => {
        idModal.style.display = "flex";

        const handler = (e) => {
            const input = idInput.value;
            if(e.type === "keydown"){
                if(e.key === "Enter" && input !== ""){
                    idInput.value = "";
                    idModal.style.display = "none";
                    idInput.removeEventListener("keydown", handler);
                    resolve(input);
                }
            }
            if(e.type === "click" && input !== ""){
                idInput.value = "";
                idModal.style.display = "none";
                idInput.removeEventListener("click", handler);
                resolve(input);
            }
        };
        idButton.addEventListener("click", handler);
        idInput.addEventListener("keydown", handler);

    });
}

async function askName(){
    return new Promise((resolve) => {
        nameModal.style.display = "flex";

        const handler = (e) => {
            const input = nameInput.value;
            if(e.type === "keydown"){
                if(e.key === "Enter" && input !== ""){
                    nameInput.value = "";
                    nameModal.style.display = "none";
                    nameInput.removeEventListener("keydown", handler);
                    resolve(input);
                }
            }
            if(e.type === "click" && input !== ""){
                nameInput.value = "";
                nameModal.style.display = "none";
                nameInput.removeEventListener("click", handler);
                resolve(input);
            }
            
        };
        nameButton.addEventListener("click", handler);
        nameInput.addEventListener("keydown", handler);
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