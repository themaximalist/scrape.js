const log = require("debug")("scrap.js:scrape");

const vanilla = require("./vanilla");
const headless = require("./headless");
const proxy = require("./proxy");
const extract = require("./extract");

module.exports = async function scrape(scrape_url, options = null) {
    if (!options) options = {};
    if (!options.timeout) options.timeout = 10000;
    if (typeof options.extract == "undefined") options.extract = true;
    if (typeof options.proxy == "undefined") options.proxy = false;
    if (typeof options.headless == "undefined") options.headless = false;

    log(`scraping ${scrape_url} with options ${JSON.stringify(options)}`);

    try {
        let result;
        if (options.headless) {
            result = await headless(scrape_url, options);
        } else if (options.proxy) {
            result = await proxy(scrape_url, options);
        } else {
            result = await vanilla(scrape_url, options);
        }

        if (!result || !result.url || !result.html) {
            throw new Error(`Invalid response from ${scrape_url} with options ${JSON.stringify(options)}`);
        }

        if (options.extract) {
            const article = await extract(result.url, result.html);
            if (!article) {
                log(`article extract failed`);
                return result;
            }

            if (article.title) result.title = article.title;
            if (article.byline) result.author = article.byline;
            if (article.content) result.content = article.content;
            if (article.excerpt) result.description = article.excerpt;
            if (article.lang) result.language = article.lang;
        }

        return result;
    } catch (e) {
        log(`erroring scraping ${scrape_url}: ${e.message}`);
    }
}