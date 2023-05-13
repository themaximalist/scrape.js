module.exports = async function setupBlockResources(page) {
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        const BLOCKED = [
            "image",
            "stylesheet",
            "font",
        ]
        if (BLOCKED.includes(req.resourceType())) {
            // log(`blocked request ${req.resourceType()} ${req.url()}`);
            req.abort();
        }
        else {
            req.continue();
        }
    });

    const client = await page.target().createCDPSession();

    // intercept request when response headers was received
    await client.send('Network.setRequestInterception', {
        patterns: [{
            urlPattern: '*',
            resourceType: 'Document',
            interceptionStage: 'HeadersReceived'
        }],
    });

    await client.on('Network.requestIntercepted', async e => {
        const BLOCKED = [
            "image/jpg",
            "image/jpeg",
            "image/png",
            "image/gif",
            "video/mp4",
            "audio/mpeg",
            "application/pdf",
            "application/octet-stream",
            "application/zip",
            "application/x-www-form-urlencoded",
            "image/webp",
            "application/json",
            "application/javascript",
            "image/svg+xml",
            "application/xml",
            "audio/wav",
            "video/webm",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "application/x-rar-compressed",
            "application/x-tar",
            "application/java-archive",
        ];

        let headers = e.responseHeaders || {};
        let contentType = headers['content-type'] || headers['Content-Type'] || '';
        let obj = { interceptionId: e.interceptionId };

        if (BLOCKED.includes(contentType)) {
            // log(`blocked page ${scrape_url} because of unhandled contentType ${contentType}`);
            obj['errorReason'] = `BlockedByClient`;
        }

        await client.send('Network.continueInterceptedRequest', obj);
    });
}