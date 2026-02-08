const socket = io({
    auth:{
        gameId: sessionStorage.getItem("gameId"),
        playerId: sessionStorage.getItem("playerId"),
        role: "player"
    }
});

main();

function main(){
    
}