const log = require("debug")("scrape.js:Scrape");
const scrape = require("../scrape");

module.exports = async function Scrape(scrape_url, opts = null) {
    if (!opts) opts = { extract: true };

    const configurations = [
        { headless: false, proxy: false },
        { headless: false, proxy: true },
        { headless: true, proxy: false },
        { headless: true, proxy: true },
    ];

    for (const config of configurations) {
        const option = Object.assign({}, config, opts);

        log(`scraping ${scrape_url} with options ${JSON.stringify(option)}`);

        const result = await scrape(scrape_url, option);

        if (result) {
            if (option.extract && result.content && result.content.length > 0 && result.title && result.title.length > 0) {
                return result;
            }

            if (result.html) {
                return result;
            }
        }

        log(`couldn't scrape ${scrape_url} with options ${JSON.stringify(option)}`);
    }

    log(`failed to scrape ${scrape_url}`);
}