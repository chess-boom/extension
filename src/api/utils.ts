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

export function notifyOnFinishStream(config: any): void {
    fetch('https://lichess.org/api/stream/event', config)
        // .then(response => response.body?.pipeTo()

        // .then(rb => {
        //     const reader = rb?.getReader();
        //     if (reader) {
        //         return getReadableStream(reader);
        //     }
        // })
        // .then(stream => {
        //     console.log(stream);
        // })
            
        //     new Response(stream, { headers: { "Content-Type": "application/json" } }).json())
        // .then(data => {
        //     console.log(data);            
        // })
        // .then(res => {
        //     res.body?.on('data', (chunk: Buffer) => {
        //         const eventString = chunk.toString();
        //         // Check if buffer is more that LF (Line Feed)
        //         if (eventString.length > 1){
        //             const event = JSON.parse(eventString);
        //             process.stdout.write(event.type+"\n");
        //             if (event.type == 'gameFinish'){
        //                 chrome.notifications.create(
        //                     {
        //                         type: "basic",
        //                         iconUrl: "images/icon-32.png",
        //                         title: "Chess BOOOM",
        //                         message: "Great game! Click on Chess Boom to begin analysis!",
        //                         silent: false,
        //                     },
        //                     () => {}
        //                 );
        //             }
        //         }
        //     })
        // })
        .catch(err => {
            console.log(err.response.data);
        });
}
