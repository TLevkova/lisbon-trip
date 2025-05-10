/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

const sw = self as unknown as ServiceWorkerGlobalScope;

import { build, files, version } from '$service-worker';

const CACHE = `cache-${version}`;

/** extra static assets we want available offline */
const EXTRA_ASSETS: string[] = [];

const ASSETS = [...build, ...files, ...EXTRA_ASSETS];

// —— install ——
sw.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
	);
});

// —— activate ——
sw.addEventListener('activate', (event) => {
	event.waitUntil(
		(async () => {
			for (const key of await caches.keys()) {
				if (key !== CACHE) await caches.delete(key);
			}
			await sw.clients.claim();
		})()
	);
});

// —— fetch ——
sw.addEventListener('fetch', (event) => {
	const { request } = event;
	if (request.method !== 'GET') return;

	event.respondWith(
		(async (): Promise<Response> => {
			// try cache first
			const cached = await caches.match(request);
			if (cached) return cached;

			try {
				const response = await fetch(request);
				// stash a clone for offline
				const responseClone = response.clone();
				const cache = await caches.open(CACHE);
				await cache.put(request, responseClone);
				return response;
			} catch {
				if (request.mode === 'navigate') {
					// guaranteed Response: either cached index.html or an error response
					return (await caches.match('/index.html')) || Response.error();
				}
				return Response.error();
			}
		})()
	);
});
