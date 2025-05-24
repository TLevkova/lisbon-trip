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
	'/data/explore.json',
	'/data/moves.json'
];

// Static assets to cache (only those not already in files)
const STATIC_ASSETS = [
	'/',
	'/moves',
	'/explore',
	'/flights', 
	'/stays',
	'/images/landing-bg.png',
	'/images/leaflet/marker-icon.png',
	'/images/leaflet/marker-icon-2x.png',
	'/images/leaflet/marker-shadow.png',
	'/images/icons/icon-192x192.png',
	'/images/icons/icon-512x512.png'
];

// Runtime caching for SvelteKit dynamic imports
const RUNTIME_CACHE_PATTERNS = [
	/\/_app\/immutable\/chunks\//,
	/\/_app\/immutable\/nodes\//,
	/\/_app\/immutable\/entry\//,
	/\/\.svelte-kit\/generated\/client\/nodes\//
];

// Dynamic content patterns to cache at runtime
const DYNAMIC_CACHE_PATTERNS = [
	/\/descriptions\/.*\.txt$/,     // All description text files
	/\/images\/explore\/.*\.(jpg|jpeg|png|webp)$/,  // All explore images
	/\/audio\/.*\.wav$/,            // Audio files (when online)
	/\/data\/.*\.json$/             // Data files
];

// Combine all assets to cache (remove duplicates)
const ASSETS = [...new Set([...build, ...files, ...STATIC_ASSETS, ...DATA_FILES])];

// Paths that should not be cached (development server paths only)
const DEV_PATHS = [
	'/node_modules/',
	'/.vite/',
	'/@fs/',
	'/@vite/',
	'/__vite_ping'
];

// Development mode patterns that need special handling
const DEV_PATTERNS = [
	/@fs\//,
	/@vite\//,
	/\.svelte-kit\/generated\/client\//,
	/node_modules\/@sveltejs\/kit\/src\/runtime\/client\//
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
				
				// Always cache SvelteKit runtime files and our app routes
				const shouldCache = RUNTIME_CACHE_PATTERNS.some(pattern => pattern.test(request.url)) ||
					DYNAMIC_CACHE_PATTERNS.some(pattern => pattern.test(request.url)) ||
					['/moves', '/explore', '/flights', '/stays'].some(route => request.url.endsWith(route)) ||
					/\/explore\/[^\/]+$/.test(request.url); // Cache explore slug routes

				if (shouldCache) {
					const cache = await caches.open(CACHE);
					await cache.put(request, responseToCache);
				}
				
				return response;
			} catch (error) {
				// Special handling for development mode paths when offline
				if (DEV_PATTERNS.some(pattern => pattern.test(request.url))) {
					console.warn(`Development resource unavailable offline: ${request.url}`);
					// For navigation requests, serve the app shell
					if (request.mode === 'navigate' || request.destination === 'document') {
						const indexResponse = await caches.match('/');
						if (indexResponse) {
							return indexResponse;
						}
					}
					// For script/module requests, return a minimal response to prevent errors
					return new Response('// Development resource unavailable offline', {
						status: 200,
						headers: { 'Content-Type': 'application/javascript' }
					});
				}

				// If offline, try to serve from cache again (in case of cache miss)
				const cachedResponse = await caches.match(request);
				if (cachedResponse) {
					return cachedResponse;
				}

				// For navigation requests when offline, serve the app shell
				if (request.mode === 'navigate' || request.destination === 'document') {
					const indexResponse = await caches.match('/');
					if (indexResponse) {
						return indexResponse;
					}
				}

				// For dynamic content (descriptions, images, audio), try cache
				if (DYNAMIC_CACHE_PATTERNS.some(pattern => pattern.test(request.url))) {
					const cachedContent = await caches.match(request);
					if (cachedContent) {
						return cachedContent;
					}
					// For missing content, return appropriate error responses
					if (request.url.includes('/descriptions/')) {
						return new Response('Description not available offline', { status: 404 });
					}
					if (request.url.includes('/audio/')) {
						return new Response('Audio not available offline', { status: 404 });
					}
					if (request.url.includes('/images/')) {
						return new Response('Image not available offline', { status: 404 });
					}
				}

				// For page routes, serve the app shell and let client-side routing handle it
				const pageRoutes = ['/moves', '/explore', '/flights', '/stays'];
				if (pageRoutes.some(route => request.url.endsWith(route)) || 
					/\/explore\/[^\/]+$/.test(request.url)) { // Include explore slug routes
					const indexResponse = await caches.match('/');
					if (indexResponse) {
						return indexResponse;
					}
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
