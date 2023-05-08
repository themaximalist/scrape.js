const log = require("debug")("scrape.js:vanilla");

const axios = require("axios");
const { HttpProxyAgent } = require("http-proxy-agent");
const { HttpsProxyAgent } = require("https-proxy-agent");

const SmartUserAgent = require("../service/SmartUserAgent");
const { getProxy } = require("../service/proxies");
const GetCanonicalURL = require("../service/GetCanonicalURL");

function getURLFromResponse(response) {
    const canonicalURL = GetCanonicalURL(response.data);
    if (canonicalURL) return canonicalURL;

    return response.request.res.responseUrl;
}

module.exports = async function vanilla(url, options = null) {
    if (!options) options = {};
    if (!options.method) options.method = "GET";
    if (!options.timeout) options.timeout = 3000;
    if (!options.userAgent) options.userAgent = SmartUserAgent(url);
    if (typeof options.proxy === "undefined") options.proxy = false;

    const request = {
        url,
        method: options.method,
        timeout: options.timeout,
        headers: { "User-Agent": options.userAgent }
    };

    if (options.proxy) {
        const proxy = getProxy();
        const httpAgent = new HttpProxyAgent(proxy);
        const httpsAgent = new HttpsProxyAgent(proxy);

        request.httpAgent = httpAgent;
        request.httpsAgent = httpsAgent;

        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    }

    log(`scraping ${url} with params ${JSON.stringify(request)}}`);
    try {
        const response = await axios(request);

        if (response.status !== 200) {
            throw new Error(`status code ${response.status}`);
        }

        if (!response.data || typeof response.data !== "string") {
            throw new Error(`invalid response data`);
        }

        const html = response.data;
        const responseURL = getURLFromResponse(response);

        return { url: responseURL, html };
    } catch (e) {
        log(`error scraping ${url} ${e.message}`);
        return null;
    }
}
