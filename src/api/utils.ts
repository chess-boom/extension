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

function notify() {
    chrome.notifications.create(
        {
            type: "basic",
            iconUrl: "images/icon-32.png",
            title: "Chess BOOOM",
            message: "Great game! Click on Chess Boom to begin analysis!",
            silent: false,
        },
        () => {}
    );
}

export const readStream =
    (processLine: any) =>
    (response: any): Promise<void> => {
        // const matcher = /\r?\n/;
        const decoder = new TextDecoder();
        let buf: string = "";
        return new Promise((resolve, fail): void => {
            response.body.on("data", (buffer: Buffer) => {
                const chunk = decoder.decode(buffer, { stream: true });
                const eventString = chunk.toString();
                // Check if buffer is more than LF (Line Feed)
                if (eventString.length > 1) {
                    const event = JSON.parse(eventString);
                    process.stdout.write(event.type + "\n");
                    if (event.type == "gameFinish") {
                        notify();
                    }
                }
            });
            // response.body.on("data", (buffer: Buffer) => {
            //     const chunk = decoder.decode(buffer, { stream: true });
            //     process.stdout.write(chunk + "\n");
            //     buf += chunk;
            //     const parts = buf.split(matcher);
            //     buf = parts.pop() || "";
            //     for (const i of parts.filter(p => p)) processLine(JSON.parse(i));
            // });
            response.body.on("end", () => {
                if (buf.length > 0) processLine(JSON.parse(buf));
                resolve();
            });
            response.body.on("error", fail);
        });
    };

export function notifyOnFinishStream(onMessage: any, config: any): void {
    const stream = fetch("https://lichess.org/api/stream/event", config);
    stream
        .then(response => {
            console.log(response);
            readStream(onMessage);
        });
}
