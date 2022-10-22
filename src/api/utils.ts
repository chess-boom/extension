export const ext = "pgn";
export const mimetype = "application/x-chess-pgn";
const eol = /\r?\n/;

function getReadableStream(reader: ReadableStreamDefaultReader<Uint8Array>): ReadableStream {
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

export function downloadGame(gameId: string, config: any): void {
    fetch(`https://lichess.org/game/export/${gameId}`, config)
        .then(response => response.body)
        .then(rb => {
            const reader = rb?.getReader();
            if (reader) {
                return getReadableStream(reader);
            }
        })
        .then(stream => new Response(stream, { headers: { "Content-Type": "text/plain" } }).text())
        .then(gameData => {
            chrome.downloads.download({
                url: `data:${mimetype},${gameData}`,
                filename: `${gameId}.${ext}`,
            });
        });
}

function notify() {
    chrome.notifications.create(
        {
            type: "basic",
            iconUrl: "images/icon-32.png",
            title: "Chess Boom",
            message: "Great game! Click on the Chess Boom icon to begin analysis!",
            silent: false,
        },
        () => {}
    );
}

const listen =
    (event: string): any =>
    (response: Response): any => {
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
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
                            console.log(gameEvent);
                            if (gameEvent.type == event) {
                                notify();
                            }
                        }
                        return loop();
                    }
                    if (buffer.length > 0) {
                        gameEvent = JSON.parse(buffer);
                        console.log(gameEvent);
                        if (gameEvent.type == event) {
                            notify();
                        }
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        return loop();
    };

export function notifyOnEvent(event: string, config: any): void {
    fetch("https://lichess.org/api/stream/event", config)
        .then(listen(event))
        .catch(error => {
            console.error(error);
        });
}
