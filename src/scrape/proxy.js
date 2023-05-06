const log = require("debug")("scrap.js:proxy");

const axios = require("axios");
const { HttpProxyAgent } = require("http-proxy-agent");
const { HttpsProxyAgent } = require("https-proxy-agent");

const SmartUserAgent = require("../service/SmartUserAgent");

module.exports = async function vanilla(url, options = null) {
    if (!options) options = {};
    if (!options.method) options.method = "GET";
    if (!options.timeout) options.timeout = 2000;
    if (!options.userAgent) options.userAgent = SmartUserAgent(url);

    const proxy = `http://${process.env.ZENROWS_API_KEY}:custom_headers=true@proxy.zenrows.com:8001`;
    const httpAgent = new HttpProxyAgent(proxy);
    const httpsAgent = new HttpsProxyAgent(proxy);
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    log(`scraping ${url}`);
    try {
        const response = await axios({
            url,
            httpAgent,
            httpsAgent,
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
