require("dotenv").config();

const assert = require("assert");
const scrape = require("../src/index");

describe.only("Basic Scraper", function () {
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

    it("should be able to scrape news.google.com redirect", async function () { // redirect
        const data = await scrape("https://news.google.com/rss/articles/CBMiR2h0dHBzOi8vd3d3Lm55dGltZXMuY29tLzIwMjMvMDUvMDQvbnlyZWdpb24vdHJ1bXAtYnJhZ2ctdHJpYWwtZGF0ZS5odG1s0gEA?oc=5");
        assert.ok(data);
        assert.equal(data.url, "https://www.nytimes.com/2023/05/04/nyregion/trump-bragg-trial-date.html"); // redirect
        assert.equal(data.original_url, "https://news.google.com/rss/articles/CBMiR2h0dHBzOi8vd3d3Lm55dGltZXMuY29tLzIwMjMvMDUvMDQvbnlyZWdpb24vdHJ1bXAtYnJhZ2ctdHJpYWwtZGF0ZS5odG1s0gEA?oc=5");
        assert.ok(data.html);
        assert.ok(data.html.length > 100);
        assert.ok(data.html.includes("nytimes.com"));
        assert.ok(data.html.includes("Donald J. Trump"));
    });

    it("should be able to scrape usnews.com", async function () { // works well with Axios user agent for some reason
        const data = await scrape("https://www.usnews.com/news/world/articles/2023-05-04/exclusive-israel-seized-binance-crypto-accounts-to-thwart-islamic-state-document-shows");
        assert.ok(data);
        assert.equal(data.url, "https://www.usnews.com/news/world/articles/2023-05-04/exclusive-israel-seized-binance-crypto-accounts-to-thwart-islamic-state-document-shows");
        assert.ok(data.html);
        assert.ok(data.html.length > 100);
        assert.ok(data.html.includes("usnews.com"));
        assert.ok(data.html.includes("Crypto"));
    });

    it("should be able to scrape vancouver.citynews.ca", async function () { // needs headless content, doesn't work with vanilla
        const data = await scrape("https://vancouver.citynews.ca/2023/05/04/ubc-funding-cancer-treatment-research/");
        assert.ok(data);
        assert.equal(data.url, "https://vancouver.citynews.ca/2023/05/04/ubc-funding-cancer-treatment-research/");
        assert.ok(data.html);
        assert.ok(data.html.length > 100);
        assert.ok(data.html.includes("vancouver.citynews.ca"));
        assert.ok(data.html.includes("funding"));
        assert.ok(data.html.includes("research"));
    });

    it("should be able to scrape investors.com", async function () { // needs headless stealth mode
        const data = await scrape("https://www.investors.com/news/technology/amd-stock-rises-on-report-of-team-up-with-microsoft-on-ai-chips/");
        assert.ok(data);
        assert.equal(data.url, "https://www.investors.com/news/technology/amd-stock-rises-on-report-of-team-up-with-microsoft-on-ai-chips/");
        assert.ok(data.html);
        assert.ok(data.html.length > 100);
        assert.ok(data.html.includes("investors.com"));
        assert.ok(data.html.includes("AMD"));
        assert.ok(data.html.includes("stock"));
        assert.ok(data.html.includes("Microsoft"));
    });

    it("should fail on pdfs", async function () {
        try {
            const data = await scrape("https://bitcoin.org/bitcoin.pdf");
            assert.fail("should have failed");
        } catch (e) {
            assert.ok("expected failure");
        }
    });
});