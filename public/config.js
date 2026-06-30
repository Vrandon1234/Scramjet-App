let _CONFIG = {};

// Override for the Wisp transport server (your wispbyte server).
// NOTE: browsers block insecure ws:// connections from an https:// page
// (mixed content). Your wispbyte server is plain http/ws, so this only works
// when the site itself is also served over http (e.g. http://localhost or an
// http deployment). On an https Vercel URL this will be blocked by the browser.
window.WISP_URL = "ws://93.115.101.157:13889/";
