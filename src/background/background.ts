import { notifyOnFinishStream } from "../api/utils";

const token = "lip_dpwOr9eC6UfChJPefDog";

const config =  {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    }
}

notifyOnFinishStream(config);
