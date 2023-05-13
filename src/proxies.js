const log = require("debug")("scrape.js:proxies");
const proxychain = require("proxy-chain");

function getProxy() {
    return `http://${process.env.ZENROWS_API_KEY}:premium_proxy=true&proxy_country=us@proxy.zenrows.com:8001`;
}

async function createWrapper() {
    const proxy_server = await proxychain.anonymizeProxy(getProxy());
    log(`created proxy ${proxy_server}...`)
    return proxy_server;
};

async function closeWrapper(proxy_server) {
    log(`closing proxy ${proxy_server}...`)
    await proxychain.closeAnonymizedProxy(proxy_server, true);
}

module.exports = {
    getProxy,
    createWrapper,
    closeWrapper,
}