//import { read } from "./api/stream";
const options = {
    method: "GET",
    headers: { Authorization: "lip_HGF1VX6voWbIvJLW1xuY", Accept: "application/json" },
};


//let stream = fetch(`https://lichess.org/api/stream/game`, options)
var filename = "testMoves.txt";

const onMessage = (obj: any) => console.log(obj);
const onComplete = () => console.log("The stream has completed");

function download(moves: string){
    chrome.downloads.download({
        url: 'data:text/plain;base64,' + btoa(moves),
        filename: filename
      });
};

chrome.action.onClicked.addListener(activeTab => {
    if (!activeTab.active) {
        return;
    }
    var gameID = activeTab.url?.split('/').at(-1);
    fetch(`https://lichess.org/game/export/${gameID}`, options)
    .then((response) => response.json())
    .then((data) => {download(data.moves.toString())});
});

//stream.then(read(onMessage)).then(onComplete);

