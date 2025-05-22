<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	export let lat = 38.7635;
	export let lng = -9.093;
	export let zoom = 15;

	let mapContainer: HTMLDivElement;

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

		// Initialize map
		const map = L.map(mapContainer, {
			center: [lat, lng],
			zoom,
			zoomControl: false
		});

		// Tile layer
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution: '© OpenStreetMap'
		}).addTo(map);

		// Marker with custom icon
		L.marker([lat, lng], { icon }).addTo(map);
	});
</script>

<!-- Full-width, fixed-height map container -->
<div bind:this={mapContainer} class="h-64 w-full rounded-lg"></div>
