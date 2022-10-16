import { join } from "path";

import "./style.css";

const options = {
    method: "GET",
    headers: { Authorization: "", Accept: "application/x-ndjson" },
};

// chrome.fileBrowserHandler.selectFile(
//     selectionParams: object,
//     callback?: function,
// )

function write(filename: string, data: any) {
    // can't use Fs
}

// let fileHandle;
// butOpenFile.addEventListener("click", async () => {
//     [fileHandle] = await window.showOpenFilePicker();
// });

const yes_button = document.getElementById("yes");
if (yes_button != null) {
    console.log("button");
    yes_button.addEventListener("click", () => {
        const gameId = "QELifyUb";
        // const ws = Fs.createWriteStream(`.debug/${gameId}.pgn`);
        fetch(`https://lichess.org/game/export/${gameId}`, options)
            .then(response => console.log(response))
            .then(response => write(`${gameId}.pgn`, response))
            .catch(err => console.error(err));
    });
}
