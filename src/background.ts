const EXT = "pgn";
const MIMETYPE = "application/x-chess-pgn";

const options = {
    method: "GET",
    headers: { Authorization: "...", Accept: MIMETYPE },
};

function downloadGame(gameData: string, gameId?: string) {
    chrome.downloads.download({
        url: `data:${MIMETYPE},${gameData}`,
        filename: `${gameId}.${EXT}`,
    });
}

chrome.action.onClicked.addListener(activeTab => {
    if (!activeTab.active) {
        return;
    }
    var gameId = activeTab.url?.split("/").at(-1);
    fetch(`https://lichess.org/game/export/${gameId}`, options)
        .then(response => response.body)
        .then(rb => {
            const reader = rb?.getReader();
            return new ReadableStream({
                start(controller) {
                    // The following function handles each data chunk
                    function push() {
                        // "done" is a Boolean and value a "Uint8Array"
                        reader?.read().then(({ done, value }) => {
                            // If there is no more data to read
                            if (done) {
                                console.log("done", done);
                                controller.close();
                                return;
                            }
                            // Get the data and send it to the browser via the controller
                            controller.enqueue(value);
                            // Check chunks by logging to the console
                            console.log(done, value);
                            push();
                        });
                    }
                    push();
                },
            });
        })
        .then(stream =>
            // Respond with our stream
            new Response(stream, { headers: { "Content-Type": "text/plain" } }).text()
        )
        .then(gameData => {
            // console.log(gameData);
            downloadGame(gameData, gameId);
        });
});
