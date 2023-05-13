const log = require("debug")("scrape.js:rotate_user_agent");

// TODO: rotate user agents
const USER_AGENT_CHROME = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36";

module.exports = function (url) {
    return USER_AGENT_CHROME;
}