import "./style.css";
import { downloadGame, mimetype } from "../api/get";

const token = "";

const config = {
    method: "get",
    headers: { Authorization: `Bearer ${token}`, Accept: mimetype },
};

document.getElementById("yes")!.addEventListener("click", handleYes)!;
const query = { active: true, currentWindow: true };

function handleYes() {
    function callback(tabs: any) {
        var url = new URL(tabs[0].url);
        var gameId = url.pathname.split("/")[1];
        if (gameId) {
            downloadGame(gameId, config);
        }
    }

    chrome.tabs.query(query, callback);
}
