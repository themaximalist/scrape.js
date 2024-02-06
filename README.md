# scrape.js

<img src="logo.png" />

<div class="badges" style="text-align: center">
<img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/themaximal1st/scrape.js">
<img alt="NPM Downloads" src="https://img.shields.io/npm/dt/%40themaximalist%2Fscrape.js">
<img alt="GitHub code size in bytes" src="https://img.shields.io/github/languages/code-size/themaximal1st/scrape.js">
<img alt="GitHub License" src="https://img.shields.io/github/license/themaximal1st/scrape.js">
</div>

<br />

`Scrape.js` is an easy to use web scraping library for Node.js:

* Extremely Fast
* Scrape nearly any website
* Auto-retries with increasing sophistication
* Auto proxy rotation
* ...it just works

```javascript
const data = await scrape("https://example.com");
// { url, html, original_url, options }
```

You can specify additional options to `scrape()` for more control:

```javascript
const data = await scrape("https://example.com", { headless: true, proxy: true});
// { url, html }
```



## Installation

```bash
npm install @themaximalist/scrape.js
```



## Usage

```javascript
const scrape = require("@themaximalist/scrape.js");
await scrape("http://example.com");
```



## Configuration

`scrape.js` uses Zen Rows for proxy rotation. To use it acquire a Zen Rows API key and setup the environment variable. `scrape.js` can be used without proxies, but is less effective.

```bash
ZENROWS_API_KEY=abcxyz123
```



## Examples

View [test](https://github.com/themaximal1st/scrape.js/tree/main/test) on how to use `scrape.js`.



## Projects

`scrape.js` is currently used in the following projects:

-   [News Score](https://newsscore.com) — score the news, score the news, rewrite the headlines



## Author

-   [The Maximalist](https://themaximalist.com/)
-   [@themaximal1st](https://twitter.com/themaximal1st)



## License

MIT
