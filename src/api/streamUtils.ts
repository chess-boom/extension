export function getReadableStream(reader: ReadableStreamDefaultReader<Uint8Array>): ReadableStream {
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
};

export function handleStreamResponse(response: Response, responseDataLogic: (data: string) => void): void {
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    const eol = /\r?\n/;

    let buffer = "";
    
    const loop: any = () =>
        reader.read()
            .then(({ done, value }) => {
                if (!done) {
                    const chunk: string = decoder.decode(value, {stream: true});
                    buffer += chunk;

                    const parts = buffer.split(eol);
                    buffer = parts.pop()!;

                    // parts filter removes empty strings
                    for (const part of parts.filter(p => p)) {
                        responseDataLogic(part);
                    }
                    return loop(responseDataLogic);
                }
                if (buffer.length > 0) {
                    responseDataLogic(buffer);
                }
            })
            .catch(error => {
                console.error(error);
            });
            
    return loop();
};