const log = require("debug")("scrape.js:headless");

const puppeteer = require("puppeteer-extra");
const proxies = require("../service/proxies");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const SmartUserAgent = require("../service/SmartUserAgent");

module.exports = async function headless(scrape_url, options = null) {
    if (!options) options = {};
    if (!options.timeout) options.timeout = 3500;
    if (!options.userAgent) options.userAgent = SmartUserAgent(scrape_url);
    if (typeof options.proxy == "undefined") options.proxy = false;

    const browser_options = {
        ignoreHTTPSErrors: true,
        headless: "new",
    };

    if (options.proxy) {
        options.proxy_server = await proxies.createWrapper();
        browser_options.args = [`--proxy-server=${options.proxy_server.replace("http://", "http=")}`]; // chrome expects http= instead of http://
    }

    log(`scraping ${scrape_url} with options ${JSON.stringify(options)} and browser options ${JSON.stringify(browser_options)}`);

    const browser = await puppeteer.launch(browser_options);
    const page = await browser.newPage();

    try {
        await page.goto(scrape_url, { waitUntil: 'networkidle0', timeout: options.timeout });
    } catch (e) {
        console.log(e);
        log(`Navigation timeout reached for ${scrape_url} ...attempting to scrape the current content.`);
    }

    const html = await page.evaluate(() => document.querySelector('*').outerHTML);
    const url = page.url();

    await browser.close();
    if (options.proxy) {
        await proxies.closeWrapper(options.proxy_server);
    }

    return { url, html };
}