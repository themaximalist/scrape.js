const log = require("debug")("scrap.js:SmartUserAgent");

const USER_AGENT_AXIOS = "Axios 0.0.1";
const USER_AGENT_CURL = "curl/7.85.0";
const USER_AGENT_CHROME = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36";

module.exports = function (url) {
    const { hostname } = new URL(url);
    switch (hostname) {
        case "news.google.com":
            log(`using ${USER_AGENT_CURL} user agent for ${hostname}`);
            return USER_AGENT_CURL;
        case "usnews.com":
        case "www.usnews.com":
            log(`using ${USER_AGENT_AXIOS} user agent for ${hostname}`);
            return USER_AGENT_AXIOS;
        default:
            return USER_AGENT_CHROME;
    }
}