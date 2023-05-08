# scrape.js

`scrape.js` is an easy to use web scraping library for node.js

* Extremely Fast
* Scrape nearly any website
* Auto-retries with increasing sophistication
* Auto proxy rotation
* ...it just works

```javascript
const data = await scrape("https://example.com");
// { url, html, content, title, author, description }
```

You can specify additional options to `scrape()` for more control:

```javascript
const data = await scrape("https://example.com", { headless: true, extract: false, proxy: true});
// { url, html }
```

The best way to use `scrape.js` is with `Scrape`, which tries to scrape the page in the fastest way possible, and falls back to more sophisticated techniques that may take longer.

```javascript
const data = await Scrape("https://complex-url.com/with/heavy/js.html");
// tries & fails with vanilla scraper, falls back to headless or headless proxy if needed
// { url, html, content, title, author, description }
```



## Installation

```bash
npm install @themaximalist/scrape.js
```

```javascript
const { scrape, Scrape } = require("@themaximalist/scrape.js");
await scrape("http://example.com"); // one-shot and fail if not successful
await Scrape("http://example.com"); // multi-try, escalating sophistication
```

That's it!



## Examples

View [test](https://github.com/themaximal1st/scrape.js/tree/main/test) on how to use `scrape.js`.



## Projects

`scrape.js` is currently used in the following projects:

-   [News Score](https://newsscore.com)



## Author

-   [The Maximalist](https://themaximalist.com/)
-   [@themaximal1st](https://twitter.com/themaximal1st)



## License

MIT
