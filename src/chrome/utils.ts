export function download(url: string, filename: string): void {
    chrome.downloads.download({
        url: url,
        filename: filename,
    });
}

export function notification(message: string): void {
    const iconUrl = "icons/icon48.png";
    const title = "Chess Boom";

    chrome.notifications.create(
        {
            type: "basic",
            iconUrl: iconUrl,
            title: title,
            message: message,
            silent: false,
        },
        () => {}
    );
}

export function tabQuery(queryData: Object, callback: (args: any) => void ): void {
    chrome.tabs.query(queryData, callback);
}