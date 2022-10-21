chrome.action.onClicked.addListener(activeTab => {
    console.log(activeTab);
});

export const apiconfig = () => {
    // GET TOKEN FROM THE STATE
    const token = "";

    // SET UP HEADERS
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    };

    return config;
};

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
