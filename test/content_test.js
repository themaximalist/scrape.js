require("dotenv").config();

const assert = require("assert");

const Scrape = require("../src/service/Scrape");

describe("Content Extractor", function () {
    this.slow(2500);
    this.timeout(15000);

    it("should extract clean content", async function () {
        const url = "https://www.insider.com/ed-sheeran-trial-verdict-good-for-music-2023-5";
        const data = await Scrape(url);
        assert(data);
        assert(data.content);
        assert(data.content.length > 100);
        assert(data.title.includes("Ed Sheeran"));
        assert(data.content.includes("Ed Sheeran"));
        assert(!data.content.includes("<div"));
        assert(!data.content.includes("<span"));
        assert(!data.content.includes("<img"));
        assert(!data.content.includes("<p"));
    });
});
