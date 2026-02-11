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
    console.log(player.score)
});

socket.on("reconnect:sync", publicGame => {
    console.log(publicGame)
});