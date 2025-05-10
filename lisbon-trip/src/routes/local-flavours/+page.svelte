<script lang="ts">
  import { onMount } from 'svelte';

  onMount(async () => {
    // TODO: Fetch local flavours data when available
  });
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Local Flavours of Lisbon</h1>

  <div class="grid gap-8 md:grid-cols-2">
    <!-- Traditional Food -->
    <section class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 class="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Traditional Food</h2>
      <div class="space-y-6">
        <div class="flex items-start space-x-4">
          <div class="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h3 class="font-medium text-gray-900 dark:text-white">Pastéis de Nata</h3>
            <p class="text-gray-600 dark:text-gray-300">The famous Portuguese custard tart, best enjoyed warm with a sprinkle of cinnamon.</p>
          </div>
        </div>

        <div class="flex items-start space-x-4">
          <div class="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
            </svg>
          </div>
          <div>
            <h3 class="font-medium text-gray-900 dark:text-white">Bacalhau</h3>
            <p class="text-gray-600 dark:text-gray-300">Traditional salted cod fish, prepared in countless ways in Portuguese cuisine.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Local Markets -->
    <section class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 class="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Local Markets</h2>
      <div class="space-y-6">
        <div class="flex items-start space-x-4">
          <div class="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h3 class="font-medium text-gray-900 dark:text-white">Mercado da Ribeira</h3>
            <p class="text-gray-600 dark:text-gray-300">Also known as Time Out Market, this is a food hall featuring the best of Lisbon's restaurants.</p>
          </div>
        </div>

        <div class="flex items-start space-x-4">
          <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h3 class="font-medium text-gray-900 dark:text-white">Mercado de Campo de Ourique</h3>
            <p class="text-gray-600 dark:text-gray-300">A local market with fresh produce and traditional food stalls in a residential neighborhood.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</div> 