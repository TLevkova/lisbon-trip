<script lang="ts">
  import { onMount } from 'svelte';
  
  let sheet: HTMLDivElement;
  let startY = 0;
  let currentY = 0;
  let isOpen = false;
  
  const sections = [
    'Flights',
    'Stays',
    'Explore',
    'Eat & Drink',
    'Moves',
    'Local Flavours'
  ];

  function handleTouchStart(e: TouchEvent) {
    startY = e.touches[0].clientY;
  }

  function handleTouchMove(e: TouchEvent) {
    if (!isOpen) return;
    
    currentY = e.touches[0].clientY - startY;
    if (currentY > 0) {
      sheet.style.transform = `translateY(${currentY}px)`;
    }
  }

  function handleTouchEnd() {
    if (currentY > 100) {
      isOpen = false;
    }
    sheet.style.transform = '';
    currentY = 0;
  }

  function toggleSheet() {
    isOpen = !isOpen;
  }
</script>

<div class="fixed inset-0 z-50 pointer-events-none">
  <!-- Backdrop -->
  <div 
    class="absolute inset-0 bg-black/50 transition-opacity duration-300 pointer-events-auto"
    class:opacity-0={!isOpen}
    class:opacity-100={isOpen}
    on:click={toggleSheet}
    on:keydown={e => e.key === 'Escape' && toggleSheet()}
    role="button"
    tabindex="0"
  ></div>

  <!-- Sheet -->
  <div
    bind:this={sheet}
    class="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-2xl shadow-xl transition-transform duration-300 pointer-events-auto"
    class:translate-y-full={!isOpen}
    class:translate-y-0={isOpen}
    on:touchstart={handleTouchStart}
    on:touchmove={handleTouchMove}
    on:touchend={handleTouchEnd}
  >
    <!-- Handle -->
    <div class="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto my-3"></div>

    <!-- Content -->
    <nav class="px-4 pb-8">
      <ul class="space-y-4">
        {#each sections as section}
          <li>
            <button
              class="w-full text-left px-4 py-3 text-lg font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
              on:click={() => {
                // Handle section click
                isOpen = false;
              }}
            >
              {section}
            </button>
          </li>
        {/each}
      </ul>
    </nav>
  </div>
</div>

<!-- Trigger button -->
<button
  class="fixed bottom-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-colors"
  on:click={toggleSheet}
  aria-label="Open navigation menu"
>
  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
</button> 