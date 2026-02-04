const modal = document.getElementById("modal");
const idModal = document.getElementById("modal-id");
const nameModal = document.getElementById("modal-name");
const idInput = document.getElementById("modal-input-id");
const nameInput = document.getElementById("modal-input-name");
const idButton = document.getElementById("modal-button-id");
const nameButton = document.getElementById("modal-button-name");
const params = new URLSearchParams(window.location.search);
let gameId = params.get("gameId");
let name = "";

main();

async function main(){
    modal.style.display = "flex";
    if(gameId === null){
        gameId = await askCode();
        name = await askName();
    }else{
        name = await askName();
    }
    modal.style.display = "none";
    console.log(`GameId:${gameId} PlayerName:${name}`);
    const res = await joinGame();
    console.log(res);
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
    return new Promise((resolve) => {
        const res = fetch("/api/game/join", {
            method: "POST",
            headers : {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                gameId: gameId,
                name: name
            })
        });

    });
}



idInput.addEventListener("keydown", (e) => {
    if(e.keyCode === "Enter" && idInput.value !== ""){
        gameId = idInput.value;
    }
})