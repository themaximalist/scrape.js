const log = require("debug")("scrap.js:extract");

const { Readability, isProbablyReaderable } = require("@mozilla/readability");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const clean = require("./clean");

const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on("error", () => { });

function cleanArticleHTML(content) {
    const clean_content = clean(content);
    const cleanedDom = new JSDOM(clean_content, { virtualConsole });
    const text = cleanedDom.window.document.body.textContent;
    const lines = text.split("\n");
    return lines.filter(line => {
        if (line.trim().length == 0) return false;
        if (line.trim() == "\n") return false;
        return true;
    }).map(line => {
        return line.trim();
    }).join("\n");
}

module.exports = function (url, html) {
    try {
        const doc = new JSDOM(html, { url, virtualConsole });
        const reader = new Readability(doc.window.document);
        const extract = reader.parse();
        const article = cleanArticleHTML(extract.content);
        extract.content = article;
        return extract;
    } catch (e) {
        log(`error extracting ${url} ${e.message}`);
        throw e;
    }
}