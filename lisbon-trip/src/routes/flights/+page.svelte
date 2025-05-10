<script lang="ts">
  import { onMount } from 'svelte';
  import { flightsStore, outboundFlights, returnFlights } from '$lib/stores/flights';
  import type { Flight } from '$lib/stores/flights';

  let flightsData: { flights: Flight[] };

  onMount(async () => {
    const response = await fetch('/data/flights.json');
    flightsData = await response.json();
    flightsStore.setFlights(flightsData.flights);
  });

  function formatTime(timeString: string): string {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

  function formatDate(timeString: string): string {
    return new Date(timeString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  }
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Available Flights</h1>

  <!-- Outbound Flights -->
  <section class="mb-12">
    <h2 class="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">Outbound Flights</h2>
    <div class="grid gap-6 md:grid-cols-2">
      {#each $outboundFlights as flight}
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div class="p-6">
            <!-- Airline Header -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <span class="text-lg font-bold text-gray-600 dark:text-gray-300">{flight.airlineCode}</span>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white">{flight.airline}</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{flight.duration}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">€{flight.price}</p>
              </div>
            </div>

            <!-- Flight Details -->
            <div class="flex items-center justify-between">
              <div class="text-center">
                <p class="text-2xl font-bold text-gray-900 dark:text-white">{formatTime(flight.departure.time)}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{flight.departure.airport}</p>
                <p class="text-xs text-gray-400 dark:text-gray-500">Terminal {flight.departure.terminal}</p>
              </div>
              <div class="flex-1 px-4">
                <div class="relative">
                  <div class="h-0.5 bg-gray-200 dark:bg-gray-700"></div>
                  <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <svg class="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
              <div class="text-center">
                <p class="text-2xl font-bold text-gray-900 dark:text-white">{formatTime(flight.arrival.time)}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{flight.arrival.airport}</p>
                <p class="text-xs text-gray-400 dark:text-gray-500">Terminal {flight.arrival.terminal}</p>
              </div>
            </div>

            <p class="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
              {formatDate(flight.departure.time)}
            </p>
          </div>
        </div>
      {/each}
    </div>
  </section>

  <!-- Return Flights -->
  <section>
    <h2 class="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">Return Flights</h2>
    <div class="grid gap-6 md:grid-cols-2">
      {#each $returnFlights as flight}
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div class="p-6">
            <!-- Airline Header -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <span class="text-lg font-bold text-gray-600 dark:text-gray-300">{flight.airlineCode}</span>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white">{flight.airline}</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{flight.duration}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">€{flight.price}</p>
              </div>
            </div>

            <!-- Flight Details -->
            <div class="flex items-center justify-between">
              <div class="text-center">
                <p class="text-2xl font-bold text-gray-900 dark:text-white">{formatTime(flight.departure.time)}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{flight.departure.airport}</p>
                <p class="text-xs text-gray-400 dark:text-gray-500">Terminal {flight.departure.terminal}</p>
              </div>
              <div class="flex-1 px-4">
                <div class="relative">
                  <div class="h-0.5 bg-gray-200 dark:bg-gray-700"></div>
                  <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <svg class="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
              <div class="text-center">
                <p class="text-2xl font-bold text-gray-900 dark:text-white">{formatTime(flight.arrival.time)}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{flight.arrival.airport}</p>
                <p class="text-xs text-gray-400 dark:text-gray-500">Terminal {flight.arrival.terminal}</p>
              </div>
            </div>

            <p class="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
              {formatDate(flight.departure.time)}
            </p>
          </div>
        </div>
      {/each}
    </div>
  </section>
</div> 