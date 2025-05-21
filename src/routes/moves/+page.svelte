<script lang="ts">
  import { onMount } from 'svelte';

  onMount(async () => {
    // TODO: Fetch moves data when available
  });
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Getting Around Lisbon</h1>

  <div class="grid gap-8 md:grid-cols-2">
    <!-- Public Transport -->
    <section class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 class="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Public Transport</h2>
      <div class="space-y-4">
        <div class="flex items-start space-x-4">
          <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <div>
            <h3 class="font-medium text-gray-900 dark:text-white">Metro</h3>
            <p class="text-gray-600 dark:text-gray-300">Lisbon's metro system is modern and efficient, connecting major areas of the city.</p>
          </div>
        </div>

        <div class="flex items-start space-x-4">
          <div class="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <div>
            <h3 class="font-medium text-gray-900 dark:text-white">Trams</h3>
            <p class="text-gray-600 dark:text-gray-300">Iconic yellow trams, especially Tram 28, offer a scenic way to explore the city.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Taxis & Rideshare -->
    <section class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 class="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Taxis & Rideshare</h2>
      <div class="space-y-4">
        <div class="flex items-start space-x-4">
          <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <div>
            <h3 class="font-medium text-gray-900 dark:text-white">Taxis</h3>
            <p class="text-gray-600 dark:text-gray-300">Official taxis are black and green, with meters and fixed rates for airport transfers.</p>
          </div>
        </div>

        <div class="flex items-start space-x-4">
          <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h3 class="font-medium text-gray-900 dark:text-white">Rideshare</h3>
            <p class="text-gray-600 dark:text-gray-300">Popular rideshare apps like Uber and Bolt operate in Lisbon.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</div> 