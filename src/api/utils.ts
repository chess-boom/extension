import { download, notification } from "../chrome/utils";

export const mimetype = "application/x-chess-pgn";
const ext = "pgn";

function _getReadableStream(reader: ReadableStreamDefaultReader<Uint8Array>): ReadableStream {
    return new ReadableStream({
        start(controller) {
            function push() {
                reader?.read().then(({ done, value }) => {
                    if (done) {
                        controller.close();
                        return;
                    }
                    controller.enqueue(value);
                    push();
                });
            }
            push();
        },
    });
}

function _notifyOnGameEvent (event: string): any {
    const notifConfig = {
        iconUrl: "images/icon-32.png",
        title: "Chess Boom",
        message: "Great game! Click on the Chess Boom icon to begin analysis!"
    }

    return (response: Response): any => {
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        const eol = /\r?\n/;

        var buffer = "";
        var gameEvent: any;

        const loop: any = () =>
            reader
                .read()
                .then(({ done, value }) => {
                    if (!done) {
                        const chunk: any = decoder.decode(value, {
                            stream: true,
                        });
                        buffer += chunk;
                        const parts = buffer.split(eol);
                        buffer = parts.pop()!;
                        for (const part of parts.filter(p => p)) {
                            gameEvent = JSON.parse(part);
                            if (gameEvent.type == event) {
                                notification(notifConfig);
                            }
                        }
                        return loop();
                    }
                    if (buffer.length > 0) {
                        gameEvent = JSON.parse(buffer);
                        if (gameEvent.type == event) {
                            notification(notifConfig);
                        }
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        return loop();
    };
};
    
export function apiDownloadGame(gameId: string, config: any): void {
    fetch(`https://lichess.org/game/export/${gameId}`, config)
        .then(response => response.body)
        .then(rb => {
            const reader = rb?.getReader();
            if (reader) {
                return _getReadableStream(reader);
            }
        })
        .then(stream => new Response(stream, { headers: { "Content-Type": "text/plain" } }).text())
        .then(gameData => {
            const url = `data:${mimetype},${gameData}`;
            const filename = `${gameId}.${ext}`

            download(url, filename);
        });
}

export function apiNotifyOnGameEvent(event: string, config: any): void {
    fetch("https://lichess.org/api/stream/event", config)
        .then(_notifyOnGameEvent(event))
        .catch(error => {
            console.error(error);
        });
}
