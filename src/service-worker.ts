/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

const sw = self as unknown as ServiceWorkerGlobalScope;

import { build, files, version } from '$service-worker';

const CACHE = `cache-${version}`;

// Data files to cache
const DATA_FILES = [
	'/data/flights.json',
	'/data/stays.json',
	'/data/explore.json'
];

// Static assets to cache (only those not already in files)
const STATIC_ASSETS = [
	'/',
	'/images/landing-bg.png',
	'/images/leaflet/marker-icon.png',
	'/images/leaflet/marker-icon-2x.png',
	'/images/leaflet/marker-shadow.png',
	'/images/icons/icon-192x192.png',
	'/images/icons/icon-512x512.png'
];

// Combine all assets to cache (remove duplicates)
const ASSETS = [...new Set([...build, ...files, ...STATIC_ASSETS, ...DATA_FILES])];

// Paths that should not be cached (development server paths only)
const DEV_PATHS = [
	'/node_modules/',
	'/.vite/',
	'/@fs/'
];

// —— install ——
sw.addEventListener('install', (event) => {
	event.waitUntil(
		(async () => {
			const cache = await caches.open(CACHE);
			// Filter out any invalid URLs and cache valid ones
			const validAssets = ASSETS.filter(asset => asset && typeof asset === 'string');
			await cache.addAll(validAssets);
		})()
	);
});

// —— activate ——
sw.addEventListener('activate', (event) => {
	event.waitUntil(
		(async () => {
			// Delete old caches
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
	
	// Skip non-GET requests
	if (request.method !== 'GET') return;
	
	// Skip cross-origin requests
	if (!request.url.startsWith(self.location.origin)) return;

	// Skip only specific development server paths
	if (DEV_PATHS.some(path => request.url.includes(path))) {
		return;
	}

	// Skip audio files - they will be handled by the app's offline logic
	if (request.url.endsWith('.wav')) {
		return;
	}

	// Skip Chrome DevTools requests
	if (request.url.includes('.well-known/appspecific/com.chrome.devtools')) {
		return;
	}

	event.respondWith(
		(async (): Promise<Response> => {
			// Try cache first
			const cached = await caches.match(request);
			if (cached) return cached;

			try {
				const response = await fetch(request);
				
				// Check if we received a valid response
				if (!response || response.status !== 200 || response.type !== 'basic') {
					return response;
				}

				// Clone the response
				const responseToCache = response.clone();
				
				// Cache the response for future use
				const cache = await caches.open(CACHE);
				await cache.put(request, responseToCache);
				
				return response;
			} catch (error) {
				// If offline, try to serve from cache again (in case of cache miss)
				const cachedResponse = await caches.match(request);
				if (cachedResponse) {
					return cachedResponse;
				}

				// If it's a navigation request, serve the main app
				if (request.mode === 'navigate') {
					const indexResponse = await caches.match('/');
					return indexResponse || new Response('<!DOCTYPE html><html><head><title>Offline</title></head><body><h1>Offline</h1><p>Please check your internet connection.</p></body></html>', {
						status: 200,
						headers: new Headers({
							'Content-Type': 'text/html'
						})
					});
				}

				// For other requests, return a network error
				return new Response('Network error', {
					status: 503,
					statusText: 'Service Unavailable',
					headers: new Headers({
						'Content-Type': 'text/plain'
					})
				});
			}
		})()
	);
});
