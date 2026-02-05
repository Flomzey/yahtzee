const socket = io();

main();

function main(){
    socket.emit(
        "lobby:join", 
        sessionStorage.getItem("gameId"),
        sessionStorage.getItem("playerId")
    );
}