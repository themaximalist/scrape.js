const log = require("debug")("scrape.js:scrape");

const vanilla = require("./vanilla");
const headless = require("./headless");

module.exports = async function scrape(url, options = null) {
    if (!options) options = {};
    if (!options.timeout) options.timeout = 3500;
    if (typeof options.headless == "undefined") options.headless = true;
    if (typeof options.proxy == "undefined") options.proxy = true;

    log(`scraping ${url} with options ${JSON.stringify(options)}`);

    try {
        let result;
        if (options.headless) {
            result = await headless(url, options);
        } else {
            result = await vanilla(url, options);
        }

        if (!result || !result.url || !result.html) {
            throw new Error(`Invalid response from ${url} with options ${JSON.stringify(options)}`);
        }

        if (result.url !== url) result.original_url = url;

        result.options = options;

        return result;
    } catch (e) {
        log(`erroring scraping ${url}: ${e.message}`);
        throw new Error(`Error scraping ${url}: ${e.message}`);
    }
}