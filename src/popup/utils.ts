import { apiDownloadGame, mimetype } from "../api/utils";

export function handleYes(): void {
    const query = { active: true, currentWindow: true };
    
    const token = "";
    
    const config = {
        method: "GET",
        headers: { Authorization: `Bearer ${token}`, Accept: mimetype },
    };
    
    const downloadOnValidGameId = (tabs: any) => {
        const gameIdLength = 8;
        const url = new URL(tabs[0].url);
        const gameId = url.pathname.split("/")[1].substring(0, gameIdLength);
        if (gameId) {
            apiDownloadGame(gameId, config);
        }
    }
    
    chrome.tabs.query(query, downloadOnValidGameId);
}