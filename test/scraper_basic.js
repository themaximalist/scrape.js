require("dotenv").config();

const assert = require("assert");
const scrape = require("../src/scrape");
const Scrape = require("../src/service/Scrape");

describe("Scraper", function () {
    this.slow(2500);
    this.timeout(15000);

    it("should be able to scrape example.com", async function () {
        const data = await scrape("https://example.com"); // vanilla scrape should work
        assert.ok(data);
        assert.equal(data.url, "https://example.com/"); // trailing slash
        assert.ok(data.html);
        assert.ok(data.html.length > 100);
        assert.ok(data.html.includes("<h1>Example Domain</h1>"));
    });

    it("should be able to scrape news.google.com redirect", async function () { // works well with cURL but normal user agents will render javascript redirect
        const data = await scrape("https://news.google.com/rss/articles/CBMiR2h0dHBzOi8vd3d3Lm55dGltZXMuY29tLzIwMjMvMDUvMDQvbnlyZWdpb24vdHJ1bXAtYnJhZ2ctdHJpYWwtZGF0ZS5odG1s0gEA?oc=5");
        assert.ok(data);
        assert.equal(data.url, "https://www.nytimes.com/2023/05/04/nyregion/trump-bragg-trial-date.html"); // redirect
        assert.ok(data.html);
        assert.ok(data.html.length > 100);
        assert.ok(data.html.includes("nytimes.com"));
        assert.ok(data.content);
        assert.ok(data.title);
        assert.ok(data.author);
        assert.ok(data.description);
        assert.ok(data.content.includes("Donald J. Trump"));
        assert.ok(data.description.includes("Donald J. Trump"));
    });

    it("should be able to scrape usnews.com", async function () { // works well with Axios user agent for some reason
        const data = await scrape("https://www.usnews.com/news/world/articles/2023-05-04/exclusive-israel-seized-binance-crypto-accounts-to-thwart-islamic-state-document-shows");
        assert.ok(data);
        assert.equal(data.url, "https://www.usnews.com/news/world/articles/2023-05-04/exclusive-israel-seized-binance-crypto-accounts-to-thwart-islamic-state-document-shows");
        assert.ok(data.html);
        assert.ok(data.html.length > 100);
        assert.ok(data.html.includes("usnews.com"));
        assert.ok(data.content);
        assert.ok(data.title);
        assert.ok(data.author);
        assert.ok(data.description);
        assert.ok(data.title.includes("Crypto"));
        assert.ok(data.content.includes("crypto"));
    });

    it("should be able to scrape vancouver.citynews.ca", async function () { // needs headless content, doesn't work with vanilla
        const data = await Scrape("https://vancouver.citynews.ca/2023/05/04/ubc-funding-cancer-treatment-research/");
        assert.ok(data);
        assert.equal(data.url, "https://vancouver.citynews.ca/2023/05/04/ubc-funding-cancer-treatment-research/");
        assert.ok(data.html);
        assert.ok(data.html.length > 100);
        assert.ok(data.html.includes("vancouver.citynews.ca"));
        assert.ok(data.content);
        assert.ok(data.title);
        assert.ok(data.author);
        assert.ok(data.description);
        assert.ok(data.title.includes("funding"));
        assert.ok(data.content.includes("research"));
    });

    it.only("should be able to scrape investors.com", async function () { // needs headless stealth mode
        const data = await Scrape("https://www.investors.com/news/technology/amd-stock-rises-on-report-of-team-up-with-microsoft-on-ai-chips/");
        assert.ok(data);
        console.log(data.content);
        assert.equal(data.url, "https://www.investors.com/news/technology/amd-stock-rises-on-report-of-team-up-with-microsoft-on-ai-chips/");
        assert.ok(data.html);
        assert.ok(data.html.length > 100);
        assert.ok(data.html.includes("investors.com"));
        assert.ok(data.content);
        assert.ok(data.title);
        assert.ok(data.author);
        assert.ok(data.description);
        assert.ok(data.title.includes("AMD"));
        assert.ok(data.content.includes("stock"));
        assert.ok(data.content.includes("Microsoft"));
    });

    it("should be able to scrape with proxy", async function () {
        const data = await scrape("https://example.com", { proxy: true });
        assert.ok(data);
        assert.equal(data.url, "https://example.com/"); // trailing slash
        assert.ok(data.html);
        assert.ok(data.html.length > 100);
        assert.ok(data.html.includes("<h1>Example Domain</h1>"));
    });

    it("should be able to scrape headless with proxy", async function () {
        const data = await scrape("https://example.com", { headless: true, proxy: true });
        assert.ok(data);
        assert.equal(data.url, "https://example.com/"); // trailing slash
        assert.ok(data.html);
        assert.ok(data.html.length > 100);
        assert.ok(data.html.includes("<h1>Example Domain</h1>"));
    });


});
