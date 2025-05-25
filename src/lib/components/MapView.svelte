<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import type { ExploreLocation } from '$lib/data/explore';
	import { goto } from '$app/navigation';

	export let locations: ExploreLocation[] = [];

	let map: any;

	function createZoneIcon(L: any, color: string) {
		// Create a colored marker icon using SVG
		const svgIcon = `
			<svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
				<path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 10.9 12.5 28.5 12.5 28.5s12.5-17.6 12.5-28.5C25 5.6 19.4 0 12.5 0z" fill="${color}"/>
				<circle cx="12.5" cy="12.5" r="6" fill="white"/>
			</svg>
		`;
		
		return L.divIcon({
			html: svgIcon,
			iconSize: [25, 41],
			iconAnchor: [12, 41],
			popupAnchor: [1, -34],
			className: 'zone-marker'
		});
	}

	onMount(async () => {
		if (!browser) return;
		
		// Dynamically import Leaflet and its CSS only in the browser
		const L = (await import('leaflet')).default;
		await import('leaflet/dist/leaflet.css');
		
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

		// markers with zone-based colors
		locations.forEach((loc) => {
			const zoneColor = loc.zone?.color || '#6B7280'; // Default gray for no zone
			const icon = createZoneIcon(L, zoneColor);
			
			const marker = L.marker([loc.coordinates.lat, loc.coordinates.lng], { icon })
				.addTo(map)
				.bindPopup(`
					<div class="p-2">
						<div class="mb-2 flex items-center justify-between">
							<h3 class="font-semibold text-gray-900">${loc.title}</h3>
							${loc.zone ? `<span class="rounded-full px-2 py-0.5 text-xs font-medium text-white" style="background-color: ${loc.zone.color}">${loc.zone.name}</span>` : ''}
						</div>
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

	/* Style for zone markers */
	:global(.zone-marker) {
		background: none;
		border: none;
	}
</style>
