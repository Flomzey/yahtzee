const modal = document.getElementById("modal");
const input = document.getElementById("name-input");
const names = [];

document.getElementById("add-btn").onclick = () => {
    modal.style.display = "flex";
    input.focus();
};

input.addEventListener("keydown", (e) => {
    if(e.key === "Escape"){
        input.value = "";
        modal.style.display = "none";
    }
    if(e.key === "Enter" && input.value !== ""){
        names.push(input.value);
        input.value = "";
        modal.style.display = "none";
        updateList();
    }
});

function updateList(){
    const botbox = document.getElementById("bot-box");
    botbox.innerHTML = "";
    names.forEach(name => {
        const nameElement = document.createElement("div");
        nameElement.classList.add("name-list-item");
        nameElement.textContent = name;
        console.log(name);
        botbox.appendChild(nameElement);
    });
}