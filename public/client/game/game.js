const socket = io("ws://127.0.0.1:3000", {transports: ["websocket"]}, {
    autoconnect: false, //stops the socket from connection now we need to wait for the creation of the game
});

main();

function main(){
    socket.auth = {
        gameId: sessionStorage.getItem("gameId"),
        playerId: sessionStorage.getItem("playerId"),
        role: "player"
    };
    socket.connect();
}

socket.on("reconnect:sync", player => {
    console.log(player)
});