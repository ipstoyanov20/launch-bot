import puppeteer from "puppeteer"
import {config} from "dotenv"
config();


const scrapeLogic = async (res) => {
  
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    headless: false,
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });
  try {
    const page = await browser.newPage();

    // Navigate to the page that will perform the tests.
    await page.goto("https://menu.codingburgas.bg", {
      waitUntil: "networkidle2",
    });
    await new Promise((resolve) => setTimeout(resolve, 5000));

    const Office = await page.waitForSelector("button.btn.btn-danger");
    await Office.click();

    const emailInput = await page.waitForSelector("input#i0116");
    await emailInput.type(process.env.M_USR);

    const next = await page.waitForSelector(
      "input#idSIButton9.win-button.button_primary.button.ext-button.primary.ext-primary",
    );
    await next.click();

    const passInput = await page.waitForSelector("input#i0118");
    await passInput.type(process.env.M_PWD);

    setTimeout(async () => {
      await page.keyboard.press("Enter");
    }, 1000);

    await page
      .waitForSelector("div.text-block-body.overflow-hidden.no-margin-top")
      .then(async () => {
        await page.keyboard.press("Enter");
      });

    new Promise((resolve) => setTimeout(resolve, 2000));

    await page.waitForSelector("a.btn.btn-primary", {
      timeout: 3500,
    });

    const stayIn = await page.$$("a.btn.btn-primary");

    for (let i = 0; i <= stayIn.length; i++) {
      await page.waitForSelector("a.btn.btn-primary");
      const checkbox = await page.$("a.btn.btn-primary");
      await checkbox.click();

      // Wait for the elements you want to interact with in the same context
      await page.waitForSelector("input#AvailablePackets_0__Selected");
      const packet = await page.$("input#AvailablePackets_0__Selected");
      await packet.click();

      await page.waitForSelector("input.btn.btn-primary");
      const reserve = await page.$("input.btn.btn-primary");
      await reserve.click();
    }
    res.send(`Here we are:`);
  } catch (e) {
    console.error(e);
    res.send(`Something went wrong while running Puppeteer: ${e}`);
  } finally {
    await browser.close();
    res.send(`Closed:`);
  }

};
export {scrapeLogic};
