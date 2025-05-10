<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import type { ExploreItem } from '$lib/types/explore';
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';

  export let items: ExploreItem[] = [];
  export let mapboxToken: string;

  let mapContainer: HTMLDivElement;
  let map: L.Map;
  let markers: L.Marker[] = [];

  // Custom dark style from Mapbox
  const mapboxStyle = 'mapbox://styles/mapbox/dark-v11';
  const tileUrl = `https://api.mapbox.com/v4/mapbox.dark-v11/{z}/{x}/{y}@2x.png?access_token=${mapboxToken}`;

  onMount(() => {
    // Initialize map
    map = L.map(mapContainer, {
      center: [38.7169, -9.1399],
      zoom: 13,
      zoomControl: false,
      attributionControl: false
    });

    // Add tile layer
    L.tileLayer(tileUrl, {
      maxZoom: 19,
      tileSize: 512,
      zoomOffset: -1,
      attribution: '© Mapbox'
    }).addTo(map);

    // Add zoom control
    L.control.zoom({
      position: 'bottomright'
    }).addTo(map);

    // Create markers for each item
    markers = items.map(item => {
      const marker = L.marker([item.location.lat, item.location.lng])
        .bindPopup(`
          <div class="p-2">
            <h3 class="font-semibold text-gray-900">${item.title}</h3>
            <p class="text-sm text-gray-600">${item.category}</p>
          </div>
        `);

      marker.on('click', () => {
        goto(`/explore/${item.slug}`);
      });

      return marker;
    });

    // Add markers to map
    const markerGroup = L.layerGroup(markers).addTo(map);

    // Fit bounds to show all markers
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map(m => m.getLatLng()));
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    return () => {
      map.remove();
    };
  });
</script>

<div class="relative w-full h-full">
  <div
    bind:this={mapContainer}
    class="w-full h-full rounded-xl overflow-hidden"
  ></div>
</div>

<style>
  :global(.leaflet-container) {
    background: #1a1a1a;
  }

  :global(.leaflet-popup-content-wrapper) {
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  }

  :global(.leaflet-popup-tip) {
    background: white;
  }

  :global(.leaflet-control-zoom) {
    border: none !important;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) !important;
  }

  :global(.leaflet-control-zoom a) {
    background: white !important;
    color: #374151 !important;
    border: none !important;
    width: 32px !important;
    height: 32px !important;
    line-height: 32px !important;
  }

  :global(.leaflet-control-zoom a:hover) {
    background: #f3f4f6 !important;
  }
</style> 