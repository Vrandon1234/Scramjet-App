"use strict";
/**
 * @type {HTMLFormElement}
 */
const form = document.getElementById("sj-form");
/**
 * @type {HTMLInputElement}
 */
const address = document.getElementById("sj-address");
/**
 * @type {HTMLInputElement}
 */
const searchEngine = document.getElementById("sj-search-engine");
/**
 * @type {HTMLParagraphElement}
 */
const error = document.getElementById("sj-error");
/**
 * @type {HTMLPreElement}
 */
const errorCode = document.getElementById("sj-error-code");

const { ScramjetController } = $scramjetLoadController();

const scramjet = new ScramjetController({
	files: {
		wasm: "/scram/scramjet.wasm.wasm",
		all: "/scram/scramjet.all.js",
		sync: "/scram/scramjet.sync.js",
	},
});

scramjet.init();

const connection = new BareMux.BareMuxConnection("/baremux/worker.js");

form.addEventListener("submit", async (event) => {
	event.preventDefault();

	try {
		await registerSW();
	} catch (err) {
		error.textContent = "Failed to register service worker.";
		errorCode.textContent = err.toString();
		throw err;
	}

	const url = search(address.value, searchEngine.value);

	// Scramjet tunnels all traffic through a persistent WebSocket "Wisp" server.
	// Vercel's serverless platform can't host that long-lived connection, so when
	// we're not on localhost we fall back to a public hosted Wisp server.
	// Override by setting window.WISP_URL (see config.js).
	const isLocal = ["localhost", "127.0.0.1"].includes(location.hostname);
	const wispUrl =
		window.WISP_URL ||
		(isLocal
			? (location.protocol === "https:" ? "wss" : "ws") +
				"://" +
				location.host +
				"/wisp/"
			: "wss://wisp.mercurywork.shop/");
	if ((await connection.getTransport()) !== "/libcurl/index.mjs") {
		await connection.setTransport("/libcurl/index.mjs", [
			{ websocket: wispUrl },
		]);
	}
	const frame = scramjet.createFrame();
	frame.frame.id = "sj-frame";
	document.body.appendChild(frame.frame);
	frame.go(url);
});

// Quick-launch site chips: fill the address bar and submit the form.
for (const chip of document.querySelectorAll(".site-chip")) {
	chip.addEventListener("click", () => {
		address.value = chip.dataset.url || chip.textContent.trim();
		form.requestSubmit();
	});
}
