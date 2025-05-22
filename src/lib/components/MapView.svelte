<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import type { ExploreLocation } from '$lib/data/explore';
	import { goto } from '$app/navigation';

	export let locations: ExploreLocation[] = [];

	let map: any;

	onMount(async () => {
		if (!browser) return;
		
		// Dynamically import Leaflet and its CSS only in the browser
		const L = (await import('leaflet')).default;
		await import('leaflet/dist/leaflet.css');
		
		// Custom icon configuration
		const icon = L.icon({
			iconUrl: '/images/leaflet/marker-icon.png',
			iconRetinaUrl: '/images/leaflet/marker-icon-2x.png',
			shadowUrl: '/images/leaflet/marker-shadow.png',
			iconSize: [25, 41],
			iconAnchor: [12, 41],
			popupAnchor: [1, -34],
			shadowSize: [41, 41]
		});
		
		// create map
		map = L.map('explore-map', {
			scrollWheelZoom: false,
			attributionControl: false
		}).setView([38.7167, -9.1333], 12);

		/* LIGHT tile layer (OpenStreetMap) — replaces previous dark layer */
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);

		// markers
		locations.forEach((loc) => {
			const marker = L.marker([loc.coordinates.lat, loc.coordinates.lng], { icon })
				.addTo(map)
				.bindPopup(`
					<div class="p-2">
						<h3 class="mb-2 font-semibold text-gray-900">${loc.title}</h3>
						<p class="mb-3 text-sm text-gray-600">${loc.description.substring(0, 150)}...</p>
						<button class="w-full rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-blue-700">
							View Details
						</button>
					</div>
				`);

			// Make popup clickable
			marker.on('popupopen', () => {
				const popup = marker.getPopup();
				if (!popup) return;
				
				const popupElement = popup.getElement();
				if (popupElement) {
					popupElement.style.cursor = 'pointer';
					popupElement.addEventListener('click', () => {
						goto(`/explore/${loc.slug}`);
					});
				}
			});
		});
	});
</script>

<div id="explore-map" class="h-full w-full"></div>

<style>
	/* Ensure the map never sits above the navigation sheet */
	:global(.leaflet-container) {
		z-index: 0;
		background: #fff;
	}

	/* Make popups more clickable and styled */
	:global(.leaflet-popup-content-wrapper) {
		cursor: pointer;
		padding: 0;
		border-radius: 0.5rem;
	}

	:global(.leaflet-popup-content) {
		margin: 0;
		min-width: 200px;
	}

	:global(.leaflet-popup-tip) {
		background: white;
	}
</style>
