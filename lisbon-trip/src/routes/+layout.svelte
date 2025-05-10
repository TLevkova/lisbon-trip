<script lang="ts">
	import '../app.css';
	import NavSheet from '$lib/components/NavSheet.svelte';
	import { browser } from '$app/environment';
	import { navOpen } from '$lib/stores/nav'; // persistent store
	import { afterNavigate } from '$app/navigation';

	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	export const online = writable(true);

	/** close handler passed to NavSheet and backdrop */
	function closeSheet(): void {
		navOpen.set(false);
	}

	/** lock body scroll while the sheet is open (client-side only) */
	$: if (browser) {
		document.body.style.overflow = $navOpen ? 'hidden' : '';
	}

	// track online/offline status
	onMount(() => {
		const update = () => online.set(navigator.onLine);
		window.addEventListener('online', update);
		window.addEventListener('offline', update);
		return () => {
			window.removeEventListener('online', update);
			window.removeEventListener('offline', update);
		};
	});
</script>

<!-- dimmed backdrop -->
{#if $navOpen}
	<button
		aria-label="Close navigation"
		class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm focus:outline-none"
		on:click={closeSheet}
		on:keydown={(e: KeyboardEvent) => {
			if (e.key === 'Escape') closeSheet();
		}}
	></button>
{/if}

<!-- floating action button -->
<button
	aria-label="Open navigation"
	class="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg focus:outline-none"
	on:click={() => navOpen.set(true)}
>
	<svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
		<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
	</svg>
</button>

<!-- slide-up navigation sheet -->
<NavSheet isOpen={$navOpen} on:close={closeSheet}>
	<nav class="flex flex-col space-y-4 p-6 text-lg font-medium">
		<a href="/" class="hover:text-blue-600" on:click={() => navOpen.set(false)}> Home </a>
		<a href="/flights" class="hover:text-blue-600" on:click={() => navOpen.set(false)}> Flights </a>
		<a href="/stays" class="hover:text-blue-600" on:click={() => navOpen.set(false)}> Stays </a>
		<a href="/explore" class="hover:text-blue-600" on:click={() => navOpen.set(false)}> Explore </a>
		<a href="/eat" class="hover:text-blue-600" on:click={() => navOpen.set(false)}>
			Eat &amp; Drink
		</a>
		<a href="/moves" class="hover:text-blue-600" on:click={() => navOpen.set(false)}> Moves </a>
		<a href="/local-flavours" class="hover:text-blue-600" on:click={() => navOpen.set(false)}>
			Local Flavours
		</a>
	</nav>
</NavSheet>

{#if $online === false}
	<div
		class="fixed left-0 top-0 z-50 w-full rounded-b bg-gray-50 px-4 py-2 text-center text-gray-700 shadow-sm dark:bg-gray-800 dark:text-gray-200"
	>
		<span class="text-sm font-bold uppercase tracking-wide">
			You're offline – some features may not be available.
		</span>
	</div>
{/if}

<!-- page content -->
<main class="flex min-h-screen flex-col items-center gap-4">
	<slot />
</main>
