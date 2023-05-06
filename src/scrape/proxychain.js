const log = require("debug")("scrap.js:proxychain");
const proxychain = require("proxy-chain");

async function create() {
    const proxy = `http://${process.env.ZENROWS_API_KEY}:premium_proxy=true&proxy_country=us@proxy.zenrows.com:8001`;
    const proxy_server = await proxychain.anonymizeProxy(proxy);
    log(`created proxy ${proxy_server}...`)
    return proxy_server;
};

async function close(proxy_server) {
    log(`closing proxy ${proxy_server}...`)
    await proxychain.closeAnonymizedProxy(proxy_server, true);
}

module.exports = { create, close }