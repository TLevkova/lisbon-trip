<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import localforage from 'localforage';

  /** @type {any} */
  let movesData = null;
  let loading = true;
  let error = false;

  // Data storage for offline use
  const dataStore = localforage.createInstance({
    name: 'LisbonTripData'
  });

  onMount(async () => {
    if (!browser) return;

    try {
      // Try to get cached data first
      const cachedData = await dataStore.getItem('moves.json');
      if (cachedData) {
        movesData = cachedData;
        loading = false;
        console.log('Loaded moves data from cache');
      }

      // Try to fetch fresh data if online
      if (navigator.onLine) {
        try {
          const response = await fetch('/data/moves.json');
          if (response.ok) {
            const freshData = await response.json();
            movesData = freshData;
            await dataStore.setItem('moves.json', freshData);
            console.log('Updated moves data from server');
          }
        } catch (fetchError) {
          console.log('Failed to fetch fresh data, using cached version');
        }
      }

      if (!movesData) {
        error = true;
      }
    } catch (err) {
      console.error('Error loading moves data:', err);
      error = true;
    } finally {
      loading = false;
    }
  });
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Getting Around Lisbon</h1>

  {#if loading}
    <div class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  {:else if error}
    <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
      <h2 class="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">Unable to Load Transportation Data</h2>
      <p class="text-red-600 dark:text-red-300">Please check your internet connection and try again.</p>
    </div>
  {:else if movesData}
    <!-- Overview Section -->
    <section class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
      <h2 class="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Public Transport Overview</h2>
      
      <div class="prose dark:prose-invert max-w-none mb-6">
        <p class="text-gray-600 dark:text-gray-300">
          {movesData.publicTransport.overview}
        </p>
      </div>

      <!-- Transport Modes -->
      <div class="grid gap-4 md:grid-cols-3 mb-6">
        {#each movesData.publicTransport.modes as mode}
          <div class="flex items-start space-x-3 p-4 bg-{mode.color}-50 dark:bg-{mode.color}-900/20 rounded-lg">
            <div class="w-10 h-10 bg-{mode.color}-100 dark:bg-{mode.color}-900 rounded-full flex items-center justify-center flex-shrink-0">
              {#if mode.id === 'metro'}
                <svg class="h-5 w-5 text-{mode.color}-600 dark:text-{mode.color}-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              {:else if mode.id === 'trams'}
                <svg class="h-5 w-5 text-{mode.color}-600 dark:text-{mode.color}-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              {:else if mode.id === 'buses'}
                <svg class="h-5 w-5 text-{mode.color}-600 dark:text-{mode.color}-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 17l4 4 4-4m-4-5v9m-8-9h16" />
                </svg>
              {/if}
            </div>
            <div>
              <h3 class="font-medium text-gray-900 dark:text-white">{mode.name}</h3>
              <p class="text-sm text-gray-600 dark:text-gray-300">{mode.description}</p>
            </div>
          </div>
        {/each}
      </div>

      <!-- Viva Viagem Card Section -->
      <div class="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">💳 {movesData.vivaViagem.title}</h3>
        <p class="text-gray-600 dark:text-gray-300 mb-4">
          {movesData.vivaViagem.description}
        </p>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
          <h4 class="font-medium text-gray-900 dark:text-white mb-2">Best Option for 1-Week Stay:</h4>
          <div class="flex items-center justify-between mb-2">
            <span class="text-gray-600 dark:text-gray-300">Card cost</span>
            <span class="font-semibold text-blue-600 dark:text-blue-400">€{movesData.vivaViagem.pricing.cardCost}</span>
          </div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-gray-600 dark:text-gray-300">Recommended credit</span>
            <span class="font-semibold text-blue-600 dark:text-blue-400">€{movesData.vivaViagem.pricing.recommendedCredit.min}-{movesData.vivaViagem.pricing.recommendedCredit.max}</span>
          </div>
          <hr class="my-2 border-gray-200 dark:border-gray-600">
          <div class="flex items-center justify-between">
            <span class="text-gray-600 dark:text-gray-300 font-medium">Total cost per person</span>
            <span class="font-bold text-lg text-blue-600 dark:text-blue-400">€{movesData.vivaViagem.pricing.totalCost.min}-{movesData.vivaViagem.pricing.totalCost.max}</span>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">{movesData.vivaViagem.estimatedTrips}</p>
        </div>

        <div class="text-sm text-gray-600 dark:text-gray-300 space-y-1">
          <p><strong>Individual fares:</strong></p>
          <div class="grid grid-cols-2 gap-2">
            <span>• Metro/Bus: €{movesData.vivaViagem.fares.metro}</span>
            <span>• Tram: €{movesData.vivaViagem.fares.tram}</span>
            <span>• Ferry: €{movesData.vivaViagem.fares.ferry}</span>
          </div>
        </div>

        <a href={movesData.vivaViagem.link} target="_blank" rel="noopener noreferrer" 
           class="inline-flex items-center mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Buy Viva Viagem Card
        </a>
      </div>
    </section>

    <!-- Airport Transport Section -->
    <section class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
      <h2 class="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">✈️ Airport to Airbnb</h2>
      
      <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
        <h3 class="font-medium text-blue-900 dark:text-blue-200 mb-2">Your Arrival Details</h3>
        <div class="text-sm text-blue-800 dark:text-blue-300 space-y-1">
          <p><strong>Terminal:</strong> {movesData.airportTransport.arrivalInfo.terminal}</p>
          <p><strong>Arrival Time:</strong> {movesData.airportTransport.arrivalInfo.arrivalTime}</p>
          <p><strong>Passengers:</strong> {movesData.airportTransport.arrivalInfo.passengers} people</p>
          <p><strong>Luggage:</strong> Yes</p>
        </div>
      </div>

      <div class="space-y-6">
        {#each movesData.airportTransport.options as option}
          <div class="border border-gray-200 dark:border-gray-600 rounded-lg p-6 {option.recommended ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-900/10' : ''}">
            {#if option.recommended}
              <div class="flex items-center mb-3">
                <span class="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full mr-2">RECOMMENDED</span>
                <span class="text-green-700 dark:text-green-300 text-sm font-medium">Best for your situation</span>
              </div>
            {/if}
            
            <div class="flex items-start justify-between mb-4">
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <span class="text-2xl mr-2">{option.icon}</span>
                  {option.name}
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">Journey time: {option.journeyTime}</p>
              </div>
              <div class="text-right">
                <div class="text-2xl font-bold text-gray-900 dark:text-white">€{option.cost.amount}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">{option.cost.note}</div>
              </div>
            </div>

            <div class="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 class="font-medium text-green-700 dark:text-green-300 mb-2">✓ Pros</h4>
                <ul class="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  {#each option.pros as pro}
                    <li>• {pro}</li>
                  {/each}
                </ul>
              </div>
              <div>
                <h4 class="font-medium text-red-700 dark:text-red-300 mb-2">✗ Cons</h4>
                <ul class="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  {#each option.cons as con}
                    <li>• {con}</li>
                  {/each}
                </ul>
              </div>
            </div>

            {#if option.route}
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-3">
                <h4 class="font-medium text-gray-900 dark:text-white text-sm mb-1">Route:</h4>
                <p class="text-sm text-gray-600 dark:text-gray-300">{option.route}</p>
              </div>
            {/if}

            {#if option.tip}
              <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                <h4 class="font-medium text-blue-900 dark:text-blue-200 text-sm mb-1">💡 Tip:</h4>
                <p class="text-sm text-blue-800 dark:text-blue-300">{option.tip}</p>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </section>

    <!-- Sintra Day Trip Section -->
    <section class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 class="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">🏰 {movesData.sintraTrip.title}</h2>
      
      <div class="grid md:grid-cols-2 gap-6">
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white mb-3">🚂 Train Details</h3>
          
          <div class="space-y-4">
            <div>
              <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-2">Departure Stations:</h4>
              {#each movesData.sintraTrip.trainDetails.departureStations as station}
                <div class="text-sm text-gray-600 dark:text-gray-300">
                  <strong>{station.name}</strong> - {station.note}
                </div>
              {/each}
            </div>
            
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="font-medium text-gray-700 dark:text-gray-300">First train:</span>
                <div class="text-gray-600 dark:text-gray-300">{movesData.sintraTrip.trainDetails.schedule.firstTrain}</div>
              </div>
              <div>
                <span class="font-medium text-gray-700 dark:text-gray-300">Last train:</span>
                <div class="text-gray-600 dark:text-gray-300">{movesData.sintraTrip.trainDetails.schedule.lastTrain}</div>
              </div>
              <div>
                <span class="font-medium text-gray-700 dark:text-gray-300">Frequency:</span>
                <div class="text-gray-600 dark:text-gray-300">{movesData.sintraTrip.trainDetails.schedule.frequency}</div>
              </div>
              <div>
                <span class="font-medium text-gray-700 dark:text-gray-300">Journey:</span>
                <div class="text-gray-600 dark:text-gray-300">{movesData.sintraTrip.trainDetails.schedule.journeyTime}</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white mb-3">💰 Pricing & Tickets</h3>
          
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
            <div class="flex justify-between items-center mb-2">
              <span class="text-gray-600 dark:text-gray-300">One way</span>
              <span class="font-semibold">€{movesData.sintraTrip.pricing.oneWay}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600 dark:text-gray-300">Return</span>
              <span class="font-bold text-lg">€{movesData.sintraTrip.pricing.return}</span>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{movesData.sintraTrip.pricing.note}</p>
          </div>

          <div>
            <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-2">Ticket Options:</h4>
            <ul class="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              {#each movesData.sintraTrip.ticketing.options as option}
                <li>• {option}</li>
              {/each}
            </ul>
          </div>
        </div>
      </div>

      <div class="mt-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
        <h4 class="font-medium text-yellow-800 dark:text-yellow-200 mb-2">💡 Travel Tips</h4>
        <ul class="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
          {#each movesData.sintraTrip.tips as tip}
            <li>• {tip}</li>
          {/each}
        </ul>
      </div>
    </section>
  {:else}
    <div class="text-center py-12">
      <p class="text-gray-600 dark:text-gray-300">No transportation data available</p>
    </div>
  {/if}
</div> 