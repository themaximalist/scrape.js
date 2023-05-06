const log = require("debug")("scrap.js:extract");

const { Readability, isProbablyReaderable } = require("@mozilla/readability");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const clean = require("./clean");

const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on("error", () => { });

module.exports = function (url, html) {
    try {
        const cleaned = clean(html);
        if (!cleaned) throw new Error("html is not cleanable");

        const doc = new JSDOM(html, { url, virtualConsole });
        // too many false positives...just try to parse
        // if (!isProbablyReaderable(doc.window.document)) throw new Error("html is probably not readerable");
        const reader = new Readability(doc.window.document);
        return reader.parse();
    } catch (e) {
        log(`error extracting ${url} ${e.message}`);
        throw e;
    }
}