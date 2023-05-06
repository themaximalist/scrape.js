const log = require("debug")("scrap.js:vanilla");
const axios = require("axios");
const SmartUserAgent = require("../service/SmartUserAgent");

module.exports = async function vanilla(url, options = null) {
    if (!options) options = {};
    if (!options.method) options.method = "GET";
    if (!options.timeout) options.timeout = 3000;
    if (!options.userAgent) options.userAgent = SmartUserAgent(url);

    log(`scraping ${url}`);
    try {
        const response = await axios({
            url,
            method: options.method,
            timeout: options.timeout,
            headers: { "User-Agent": options.userAgent }
        });

        if (response.status !== 200) {
            throw new Error(`status code ${response.status}`);
        }

        const html = response.data;
        const responseURL = response.request.res.responseUrl;

        return {
            url: responseURL,
            html,
        };
    } catch (e) {
        log(`error scraping ${url} ${e.message}`);
        return null;
    }
}
