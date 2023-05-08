const log = require("debug")("scrape.js:extract");

const { Readability, isProbablyReaderable } = require("@mozilla/readability");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { stripHtml } = require("string-strip-html");


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

function bodyTextFallback(doc, html) {
    let body = stripHtml(html).result;
    let title = doc.window.document.title.trim();
    const meta_description = doc.window.document.querySelector("meta[name='description']")
    let description = null;
    if (meta_description) {
        description = meta_description.getAttribute("content");
    }

    return {
        title,
        description,
        content: body,
    };
}

module.exports = function (url, html) {
    try {
        const doc = new JSDOM(html, { url, virtualConsole });
        const reader = new Readability(doc.window.document);
        let extract = reader.parse();

        if (!extract) {
            log(`falling back to body text ${url}`);
            extract = bodyTextFallback(doc, html);
        }

        if (!extract || !extract.content || !extract.title) {
            throw new Error(`failed to extract for ${url}`);
        }

        const article = cleanArticleHTML(extract.content);
        extract.content = article;

        if (!extract.content) {
            throw new Error(`failed to clean extract for ${url}`);
        }

        return extract;
    } catch (e) {
        log(`error extracting ${url} ${e.message}`);
        throw e;
    }
}