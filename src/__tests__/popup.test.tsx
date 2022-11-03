import puppeteer from "puppeteer";

const EXTENSION_PATH = "./dist";
const EXTENSION_ID = "";

async function getExtensionId(browser: puppeteer.Browser): Promise<string | undefined> {
    const targets = await browser.targets();
    const extension_target = targets.find(target => {
        target.type() == "service_worker";
    });
    if (extension_target) {
        const url = extension_target.url() || "";
        const [, , extension_id] = url.split("/");
        return extension_id;
    }
}

describe("Test index.html", () => {
    it("should check if elements are rendered correctly", async () => {
        const browser = await puppeteer.launch({
            headless: false,
            args: [`--disable-extensions-except=${EXTENSION_PATH}`, `--load-extension=${EXTENSION_PATH}`],
        });
        var [page] = await browser.pages();
        // var extension_id = await getExtensionId(browser);
        await page.goto(`chrome-extension://${EXTENSION_ID}/index.html`);

        await page.waitForSelector("button#yes");
        const textElemYes = await page.$("button#yes");
        const yes = await textElemYes?.evaluate(e => e.innerHTML);

        await page.waitForSelector("button#no");
        const textElemNo = await page.$("button#no");
        const no = await textElemNo?.evaluate(e => e.innerHTML);

        await page.waitForSelector("h1");
        const textElemHeader = await page.$("h1");
        const header = await textElemHeader?.evaluate(e => e.innerText);

        expect(yes).toEqual("Yes, show me!");
        expect(no).toEqual("No thanks");
        expect(header).toEqual("Analyze Game?");

        browser.close();
    });
});
