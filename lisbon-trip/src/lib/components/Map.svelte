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

		// Marker
		L.marker([lat, lng]).addTo(map);
	});
</script>

<!-- Full-width, fixed-height map container -->
<div bind:this={mapContainer} class="h-64 w-full rounded-lg"></div>
