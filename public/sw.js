importScripts("/scram/scramjet.all.js");

const { ScramjetServiceWorker } = $scramjetLoadWorker();
const scramjet = new ScramjetServiceWorker();

async function handleRequest(event) {
    await scramjet.loadConfig();

    if (scramjet.route(event)) {
        // Create a new set of headers to fool Google
        const modifiedHeaders = new Headers(event.request.headers);
        modifiedHeaders.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');
        modifiedHeaders.set('sec-ch-ua', '"Not A(Bit:Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"');
        modifiedHeaders.set('sec-ch-ua-mobile', '?0');
        modifiedHeaders.set('sec-ch-ua-platform', '"Windows"');

        // Note: Some Scramjet versions require the full event, 
        // while others allow you to pass a modified request.
        return scramjet.fetch(event);
    }
    
    return fetch(event.request);
}

self.addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event));
});
