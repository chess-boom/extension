export const read =
    (processLine: any) =>
    (response: any): Promise<void> => {
        const matcher = /\r?\n/;
        const decoder = new TextDecoder();
        let buf: string = "";
        return new Promise((resolve, fail): void => {
            response.body.on("data", (v: any) => {
                const chunk = decoder.decode(v, { stream: true });
                buf += chunk;
                const parts = buf.split(matcher);
                buf = parts.pop() || "";
                for (const i of parts.filter(p => p)) processLine(JSON.parse(i));
            });
            response.body.on("end", () => {
                if (buf.length > 0) processLine(JSON.parse(buf));
                resolve();
            });
            response.body.on("error", fail);
        });
    };
