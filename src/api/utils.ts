import { download, notification } from "../chrome/utils";
import { getReadableStream, handleStreamResponse } from "./streamUtils";

const downloadMimetype = "application/x-chess-pgn";
const gameEventMimetype = "application/x-ndjson";
const token = ""; // don't forget to add your token here!
const ext = "pgn";

export enum LichessGameEvent {
    finish = "gameFinish",
    start = "gameStart"
};

function _config(acceptType: string){
    return {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: acceptType
        },
    }
};

function _notifyOnGameEvent (event: LichessGameEvent): (response: Response) => void {
    const notifConfig = {
        iconUrl: "icons/icon48.png",
        title: "Chess Boom",
        message: "Great game! Click on the Chess Boom icon to begin analysis!"
    }

    // here is where we define response data logic
    const executeNotifOnGameEvent = (data: string): void => {
        const gameEvent = JSON.parse(data);
        if (gameEvent.type == event) {
            notification(notifConfig);
        }
    };

    return (response: Response): void => handleStreamResponse(response, executeNotifOnGameEvent);
};

export function apiDownloadGame(gameId: string): void {
    fetch(`https://lichess.org/game/export/${gameId}`, _config(downloadMimetype))
        .then(response => response.body)
        .then(rb => {
            const reader = rb?.getReader();
            if (reader) {
                return getReadableStream(reader);
            }
        })
        .then(stream => new Response(stream, { headers: { "Content-Type": "text/plain" } }).text())
        .then(gameData => {
            const url = `data:${downloadMimetype},${gameData}`;
            const filename = `${gameId}.${ext}`

            download(url, filename);
        });
};

export function apiNotifyOnGameEvent(event: LichessGameEvent): void {
    fetch("https://lichess.org/api/stream/event", _config(gameEventMimetype))
        .then(_notifyOnGameEvent(event))
        .catch(error => {
            console.error(error);
        });
};
