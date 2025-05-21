import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
	plugins: [
		sveltekit(),
		VitePWA({
			registerType: 'autoUpdate',
			workbox: {
				maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
				globPatterns: [
					'**/*.{js,css,html,ico,png,svg,webp,avif}',
					'/data/*.json',
					'/assets/images/**/*',

				],
				additionalManifestEntries: [
					{ url: '/data/**/*', revision: '1' },
					{ url: '/assets/**/*', revision: '1' },
					{ url: 'https://api.mapbox.com/v4/mapbox.dark-v11/*', revision: '1' }
				],
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/api\.mapbox\.com\/v4\/mapbox\.dark-v11\/.*/,
						handler: 'CacheFirst',
						options: {
							cacheName: 'mapbox-tiles',
							expiration: {
								maxEntries: 1000,
								maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
							},
							cacheableResponse: {
								statuses: [0, 200]
							}
						}
					}
				]
			},
			includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
			manifest: {
				name: 'Lisbon Trip',
				short_name: 'Lisbon Trip',
				description: 'Your Lisbon travel companion',
				theme_color: '#ffffff',
				icons: [
					{
						src: 'pwa-192x192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: 'pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png'
					}
				]
			}
		})
	],
	server: {
		hmr: {
			protocol: 'ws',
			host: 'localhost',
			port: 5173
		}
	}
});
