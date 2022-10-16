// chrome.action.onClicked.addListener((tab) => {
//     console.log(tab);
// });

import axios from 'axios';

export const apiconfig = () => {

    // GET TOKEN FROM THE STATE
    const token = "lip_dpwOr9eC6UfChJPefDog";

    // SET UP HEADERS
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }    

    return config;
};

// axios.get('https://lichess.org/api/account', apiconfig())
//     .then(res => {
//         console.log("hello");
//         console.log(res);
        chrome.notifications.create(
            {
                type: "basic",
                iconUrl: "images/icon-32.png",
                title: "Chess BOOOM",
                message: "Great game! Click on Chess Boom to begin analysis!",
                silent: false
            },
            () => {}
        )
    // }).catch(err => {
    //     console.log(err);
    // });

