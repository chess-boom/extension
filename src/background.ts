import { read } from "./api/stream";

const options = {
    method: "GET",
    headers: { Authorization: "", Accept: "application/x-ndjson" },
};

let stream = fetch(`https://lichess.org/api/stream/event`, options)

const onMessage = (obj: any) => console.log(obj);
const onComplete = () => console.log("The stream has completed");

stream.then(read(onMessage)).then(onComplete);
