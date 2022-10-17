import { read } from "./api/stream";
import fs from 'fs';
//import { writeFileSync} from 'fs';

const options = {
    method: "GET",
    headers: { Authorization: "lip_HGF1VX6voWbIvJLW1xuY", Accept: "application/json" },
};


let stream = fetch(`https://lichess.org/api/stream/game`, options)

const onMessage = (obj: any) => console.log(obj);
const onComplete = () => console.log("The stream has completed");

chrome.action.onClicked.addListener(activeTab => {
    if (!activeTab.active) {
        return;
    }
    var gameID = activeTab.url?.split('/').at(-1);
    var obj = fetch(`https://lichess.org/game/export/${gameID}`, options)
    .then((response) => response.json())
    .then((data) => {return data.moves});

    console.log(obj.toString());

    var filename = "testMoves.txt";

    fs.writeFileSync(filename, obj.toString(), {
        flag: 'w',
    });
    


    // chrome.downloads.download({
    //     url: "http://your.url/to/download",
    //     filename: "suggested/filename/with/relative.path" // Optional
    //   });
});

//stream.then(read(onMessage)).then(onComplete);

