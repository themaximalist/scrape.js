const log = require("debug")("scrap.js:Scrape");
const scrape = require("../scrape");

module.exports = async function Scrape(scrape_url) {
    let result;

    result = await scrape(scrape_url);
    if (result && result.content) return result;

    log(`headless scrape failed for ${scrape_url}... trying proxy`);
    result = await scrape(scrape_url, { proxy: true });
    if (result && result.content) return result;

    /*
    log(`vanilla scrape failed for ${scrape_url}... trying headless`);
    result = await scrape(scrape_url, { headless: true });
    if (result && result.content) return result;
    */

    /*

    log(`proxy scrape failed for ${scrape_url}... trying headless proxy`);
    result = await scrape(scrape_url, { headless: true, proxy: true });
    if (result && result.content) return result;
    */

    throw new Error(`failed to scrape: ${scrape_url}`);
}