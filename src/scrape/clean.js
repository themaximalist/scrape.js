const createDOMPurify = require("dompurify");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on("error", () => { });

module.exports = function clean(html) {
    const window = new JSDOM("", { virtualConsole }).window;
    const DOMPurify = createDOMPurify(window);
    return DOMPurify.sanitize(html, { WHOLE_DOCUMENT: true });
}