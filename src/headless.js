const log = require("debug")("scrape.js:headless");

const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const proxies = require("./proxies");
const rotate_user_agent = require("./rotate_user_agent");
const block_resources = require("./block_resources");

class ScrapeError extends Error { }


module.exports = async function headless(scrape_url, options = null) {

    if (!options) options = {};
    if (!options.timeout) options.timeout = 3500;
    if (!options.userAgent) options.userAgent = rotate_user_agent(scrape_url);
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

    try {
        const page = await browser.newPage();

        await block_resources(page);

        try {
            await Promise.all([
                page.goto(scrape_url, { waitUntil: 'networkidle2', timeout: options.timeout }),
                page.waitForNavigation({ waitUntil: 'networkidle2', timeout: options.timeout }),
            ]);
        } catch (e) {
            if (e.name == "TimeoutError") {
                log(`Navigation timeout reached for ${scrape_url} ...attempting to scrape the current state.`);
            } else if (e.toString().indexOf("ERR_BLOCKED_BY_CLIENT") > -1) {
                log(`Navigation was blocked by client...probably a pdf or other binary content we don't handle`)
                throw new ScrapeError("Navigation was blocked by client...unable to handle contentType");
            } else {
                throw e;
            }
        }

        const html = await page.evaluate(() => document.querySelector('*').outerHTML);
        const url = page.url();

        if (url == "chrome-error://chromewebdata/") throw new Error("Chrome error");

        return { url, html };

    } catch (e) {
        console.log("ERROR", e);
        throw e;
    } finally {
        await browser.close();

        if (options.proxy) {
            await proxies.closeWrapper(options.proxy_server);
        }

    }
}