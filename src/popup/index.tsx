import "./style.css";
import { downloadGame, mimetype } from "../api/utils";

const token = "";

const config = {
    method: "GET",
    headers: { Authorization: `Bearer ${token}`, Accept: mimetype },
};

document.getElementById("yes")!.addEventListener("click", handleYes)!;
const query = { active: true, currentWindow: true };

function handleYes() {
    function callback(tabs: any) {
        var url = new URL(tabs[0].url);
        var gameId = url.pathname.split("/")[1].substring(0,8);
        if (gameId) {
            downloadGame(gameId, config);
        }
    }

    chrome.tabs.query(query, callback);
}
