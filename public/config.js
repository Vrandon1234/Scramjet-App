let _CONFIG = {};

// Optional override for the Wisp transport server.
// Leave null to auto-select: a local "/wisp/" server during development, or a
// public hosted Wisp server when deployed to a host that can't run WebSockets
// (e.g. Vercel). Set to a "wss://your-wisp-server/" URL to use your own.
window.WISP_URL = null;
