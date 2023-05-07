const log = require("debug")("scrap.js:Scrape");
const scrape = require("../scrape");

module.exports = async function Scrape(scrape_url) {
    const options = [
        { headless: false, proxy: false },
        { headless: false, proxy: true },
        { headless: true, proxy: false },
        { headless: true, proxy: true },
    ];

    for (const option of options) {
        log(`scraping ${scrape_url} with options ${JSON.stringify(option)}`);

        const result = await scrape(scrape_url, option);
        if (result && result.content) return result;
        log(`failed scraping ${scrape_url} with options ${JSON.stringify(option)}`);
    }

    throw new Error(`failed to scrape: ${scrape_url}`);
}