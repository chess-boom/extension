import puppeteer from "puppeteer";
import path from "path";

const pathToExtension = path.join(__dirname, "..", "..", "dist");
const extensionId = "npjeelapenljoafjpkeaabokjoibeoal";

async function getExtensionId(browser: puppeteer.Browser): Promise<string> {
    var page = await browser.newPage();
    await page?.goto("chrome://extensions");
    await page.click("cr-toggle#devMode");

    await page.waitForSelector("div#extension-id");
    const extensionIdElem = await page.$("div#extension-id");
    const extensionIdText = await extensionIdElem?.evaluate((e: { innerHTML: any }) => e.innerHTML);
    const [_, extensionId] = extensionIdText.split(": ");

    console.log(extensionId);

    page.close();

    return extensionId;
}

describe("Test index.html", () => {
    it("should check if elements are rendered correctly", async () => {
        const browser = await puppeteer.launch({
            headless: false,
            args: [`--disable-extensions-except=${pathToExtension}`, `--load-extension=${pathToExtension}`],
        });

        // TODO : fix
        // const extensionId = getExtensionId(browser);

        var page = await browser.newPage();

        await page.goto(`chrome-extension://${extensionId}/index.html`);

        expect(page).toBeDefined();

        await page.waitForSelector("button#yes");
        const textElemYes = await page.$("button#yes");
        const yes = await textElemYes?.evaluate((e: { innerHTML: any }) => e.innerHTML);

        await page.waitForSelector("button#no");
        const textElemNo = await page.$("button#no");
        const no = await textElemNo?.evaluate((e: { innerHTML: any }) => e.innerHTML);

        await page.waitForSelector("h1");
        const textElemHeader = await page.$("h1");
        const header = await textElemHeader?.evaluate((e: { innerHTML: any }) => e.innerHTML);

        expect(yes).toEqual("Yes, show me!");
        expect(no).toEqual("No thanks");
        expect(header).toEqual("Analyze Game?");

        browser.close();
    });
});
