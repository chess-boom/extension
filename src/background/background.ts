import { apiNotifyOnGameEvent } from "../api/utils";

const gameEvent = "gameFinish";

const token = "lip_dpwOr9eC6UfChJPefDog";

const config = {
    method: "GET",
    headers: {
        Accept: "application/x-ndjson",
        Authorization: `Bearer ${token}`,
    },
};

apiNotifyOnGameEvent(gameEvent, config);
