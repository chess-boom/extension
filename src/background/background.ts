import { notifyOnFinishStream } from "../api/utils";

const token = "lip_JhlqKV2dGbC66p7kTnL9";

const onMessage = (obj: any): void => console.log(obj);

const config = {
    method: "GET",
    headers: {
        Accept: "application/x-ndjson",
        Authorization: `Bearer ${token}`,
    },
};

notifyOnFinishStream(onMessage, config);
