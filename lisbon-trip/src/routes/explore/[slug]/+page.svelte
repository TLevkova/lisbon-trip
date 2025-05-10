<script lang="ts">
  import { onMount } from 'svelte';
  import type { ExploreItem } from '$lib/types/explore';
  import localforage from 'localforage';
  import { page } from '$app/stores';

  export let data: { item: ExploreItem };

  let visited = false;
  let loading = true;

  // Initialize LocalForage
  const visitedStore = localforage.createInstance({
    name: 'lisbon-trip',
    storeName: 'visited'
  });

  onMount(async () => {
    try {
      const hasVisited = await visitedStore.getItem(data.item.slug);
      visited = hasVisited === true;
    } catch (error) {
      console.error('Error loading visited status:', error);
    } finally {
      loading = false;
    }
  });

  async function toggleVisited() {
    try {
      visited = !visited;
      await visitedStore.setItem(data.item.slug, visited);
    } catch (error) {
      console.error('Error saving visited status:', error);
      visited = !visited; // Revert on error
    }
  }

  function getGoogleMapsLink() {
    const { lat, lng } = data.item.location;
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }

  function formatOpeningHours() {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    return days.map(day => ({
      day: day.charAt(0).toUpperCase() + day.slice(1),
      hours: data.item.openingHours[day] || 'Closed'
    }));
  }
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
  <!-- Hero Image -->
  <div class="relative h-[50vh] w-full">
    <img
      src={data.item.heroImage}
      alt={data.item.title}
      class="w-full h-full object-cover"
    />
    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
    <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
      <h1 class="text-4xl font-bold mb-2">{data.item.title}</h1>
      <p class="text-lg opacity-90">{data.item.category}</p>
    </div>
  </div>

  <!-- Content -->
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-3xl mx-auto">
      <!-- Price and Rating -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-4">
          <span class="text-2xl font-bold text-gray-900 dark:text-white">
            {data.item.price.currency} {data.item.price.amount}
          </span>
          <span class="text-sm text-gray-500 dark:text-gray-400">per person</span>
        </div>
        <div class="flex items-center space-x-1">
          {#each Array(5) as _, i}
            <svg
              class="w-5 h-5 {i < Math.floor(data.item.rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          {/each}
        </div>
      </div>

      <!-- Description -->
      <div class="prose dark:prose-invert max-w-none mb-8">
        <p class="text-gray-700 dark:text-gray-300">{data.item.description}</p>
      </div>

      <!-- Opening Hours -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 shadow-sm">
        <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Opening Hours</h2>
        <div class="space-y-2">
          {#each formatOpeningHours() as { day, hours }}
            <div class="flex justify-between items-center">
              <span class="text-gray-600 dark:text-gray-400">{day}</span>
              <span class="font-medium text-gray-900 dark:text-white">{hours}</span>
            </div>
          {/each}
        </div>
      </div>

      <!-- Location -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 shadow-sm">
        <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Location</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-4">{data.item.location.address}</p>
        <a
          href={getGoogleMapsLink()}
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Open in Maps
        </a>
      </div>

      <!-- Visited Toggle -->
      <div class="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Been there?</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">Mark this place as visited</p>
        </div>
        <button
          class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          class:bg-blue-600={visited}
          class:bg-gray-200={!visited}
          on:click={toggleVisited}
          disabled={loading}
        >
          <span class="sr-only">Toggle visited status</span>
          <span
            class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
            class:translate-x-6={visited}
            class:translate-x-1={!visited}
          ></span>
        </button>
      </div>
    </div>
  </div>
</div> 