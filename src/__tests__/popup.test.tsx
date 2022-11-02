import puppeteer from 'puppeteer'
const EXTENSION_PATH = "./dist";
const EXTENSION_ID = "olacamfdpjchhfblnegjjpimpeckmhdb";


describe('Test Extension', () =>{
    it("first test", async ()=>{
        const browser = await puppeteer.launch({
            headless: false,
            args: [
            `--disable-extensions-except=${EXTENSION_PATH}`,
            `--load-extension=${EXTENSION_PATH}`
            ],
        })
        var [page] = await browser.pages();
        await page.goto(`chrome-extension://${EXTENSION_ID}/index.html`);
        await page.waitForSelector("button#yes");
        const textEl = await page.$("button#yes");
        const text = await textEl?.evaluate((e) => e.innerHTML);

        await page.waitForSelector("button#no");
        const textEl1 = await page.$("button#no");
        const text1 = await textEl1?.evaluate((e) => e.innerHTML);

        await page.waitForSelector("h1");
        const textEl2 = await page.$("h1");
        const text2 = await textEl2?.evaluate((e) => e.innerText);
        
        console.log(text);
        console.log(text1);
        console.log(text2);
        expect(text).toEqual("Yes, show me!");
        expect(text1).toEqual("No thanks");
        expect(text2).toEqual("Analyze Game?");

        browser.close();
    });

    
})