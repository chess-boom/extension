import { notifyOnEvent } from "../api/utils";

const token = "";

const config = {
    method: "GET",
    headers: {
        Accept: "application/x-ndjson",
        Authorization: `Bearer ${token}`,
    },
};

notifyOnEvent("gameFinish", config);
