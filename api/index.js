const env = require("dotenv");
env.config();
const app = require("express")();


let chrome = {};
let puppeteer;

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
	const chromeLambda = require("chrome-aws-lambda");
	chrome = chromeLambda;
	const puppeteerCore = require("puppeteer-core");
	puppeteer = puppeteerCore;
} else {
  const puppeteerModule = require("puppeteer");
  puppeteer = puppeteerModule;
}

app.get("/api", async (req, res) => {


	try {

	let options = {};

  if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    options = {
      args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath,
      headless: true,
      ignoreHTTPSErrors: true,
    };
  } else {
		options = {
			headless: false,
			defaultViewport: null,
			args: ["--start-maximized"],
		};
	}
	const browser = await puppeteer.launch(options);
	const page = await browser.newPage();

	// Navigate to the page that will perform the tests.
	await page.goto("https://menu.codingburgas.bg", {
		waitUntil: "networkidle2",
	});

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
		timeout:3500,
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

	res.send("I Am in");
	await browser.close();
} catch (error) {
	console.log(error);
}

	res.send("Success");
});

module.exports = app;
