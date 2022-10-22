type NotifConfig = {
    iconUrl: string,
    title: string,
    message: string
}

export function download(url: string, filename: string): void {
    chrome.downloads.download({
        url: url,
        filename: filename,
    });
}

export function notification(notifConfig: NotifConfig): void {
    const { iconUrl, title, message } = notifConfig;

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