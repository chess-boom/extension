import axios from 'axios';
import { readFileSync } from "fs";

import * as dotenv from "dotenv";
dotenv.config({ path: "../.." });

const downloadMimetype = "text/plain";
const gameId = "PECf1rUw";
const gameFile = `src/__tests__/assets/${gameId}.pgn`;

function _config(acceptType: string) {
    return {
        headers: {
            Authorization: `Bearer ${process.env.token}`,
            Accept: acceptType,
        },
    };
}

describe("download a Lichess game", () => {
    it("should download a valid game", async () => {
        const game = readFileSync(gameFile, "utf-8");

        axios.get(`https://lichess.org/game/export/${gameId}`, _config(downloadMimetype))
            .then(response => response.data)
            .then(data => expect(data).toEqual(game));
    });
});
