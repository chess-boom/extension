export const ext = "pgn";
export const mimetype = "application/x-chess-pgn";

function getReadableStream(reader: ReadableStreamDefaultReader<Uint8Array>): ReadableStream {
    return new ReadableStream({
        start(controller) {
            function push() {
                // "done" is a Boolean and value a "Uint8Array"
                reader?.read().then(({ done, value }) => {
                    // If there is no more data to read
                    if (done) {
                        console.log("downloaded", done);
                        controller.close();
                        return;
                    }
                    // Get the data and send it to the browser via the controller
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
