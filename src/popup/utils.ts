import { apiDownloadGame } from "../api/utils";
import { notification, tabQuery } from "../chrome/utils";

export function handleYes(): void {
    const query = { active: true, currentWindow: true };

    const downloadOnGameIdExists = (tabs: any) => {
        const gameIdLength = 8;
        const lichessURL = "https://lichess.org";
        const url = new URL(tabs[0].url);
        const isLichessURL = url.origin.includes(lichessURL);
        const gameId = url.pathname.split("/")[1].substring(0, gameIdLength);
        // safeguard against non-lichess urls
        if (gameId && isLichessURL) {
            apiDownloadGame(gameId);
        } else {
            const message = "Please use this extension while on the Lichess site with url origin \"https://lichess.org\"";
            notification(message);
        }
    }
    
    tabQuery(query, downloadOnGameIdExists);
};