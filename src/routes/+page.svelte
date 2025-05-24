<script lang="ts">
	import { browser } from '$app/environment';

	import { onMount } from 'svelte';
	import localforage from 'localforage';

	const dataFiles = [
		'flights.json',
		'stays.json',
		'explore.json'
	];

	const dataStore = localforage.createInstance({
		name: 'lisbon-trip',
		storeName: 'data'
	});

	// PWA Install state
	let deferredPrompt: any = null;
	let showInstallButton = false;

	onMount(async () => {
		if (!browser) return;

		// Manual service worker registration for testing (uncomment to test offline)
		// if ('serviceWorker' in navigator) {
		// 	try {
		// 		const registration = await navigator.serviceWorker.register('/service-worker.js');
		// 		console.log('Service Worker registered with scope:', registration.scope);
		// 	} catch (error) {
		// 		console.error('Service Worker registration failed:', error);
		// 	}
		// }

		// Handle PWA installation
		window.addEventListener('beforeinstallprompt', (e) => {
			e.preventDefault();
			deferredPrompt = e;
			showInstallButton = true;
		});

		// Hide install button if app is already installed
		window.addEventListener('appinstalled', () => {
			showInstallButton = false;
			deferredPrompt = null;
		});

		try {
			// Check if data is already initialized
			const isInitialized = await dataStore.getItem('initialized');
			
			if (!isInitialized) {
				console.log('First time install - downloading data files...');
				
				// Download and store each file
				await Promise.all(dataFiles.map(async (filename) => {
					try {
						const response = await fetch(`/data/${filename}`);
						if (!response.ok) throw new Error(`Failed to fetch ${filename}`);
						
						const data = await response.json();
						await dataStore.setItem(filename, data);
						console.log(`Successfully stored ${filename}`);
					} catch (error) {
						console.error(`Error downloading ${filename}:`, error);
					}
				}));

				// Mark as initialized
				await dataStore.setItem('initialized', true);
				console.log('Data initialization complete');
			} else {
				// Even if initialized, ensure all data is up to date
				console.log('Checking for data updates...');
				await Promise.all(dataFiles.map(async (filename) => {
					try {
						const response = await fetch(`/data/${filename}`);
						if (!response.ok) throw new Error(`Failed to fetch ${filename}`);
						
						const data = await response.json();
						await dataStore.setItem(filename, data);
						console.log(`Successfully updated ${filename}`);
					} catch (error) {
						console.error(`Error updating ${filename}:`, error);
					}
				}));
			}
		} catch (error) {
			console.error('Error during data initialization:', error);
		}
	});

	async function installApp() {
		if (!deferredPrompt) return;

		try {
			// Show the install prompt
			deferredPrompt.prompt();
			
			// Wait for the user to respond to the prompt
			const { outcome } = await deferredPrompt.userChoice;
			
			if (outcome === 'accepted') {
				console.log('User accepted the install prompt');
			} else {
				console.log('User dismissed the install prompt');
			}
			
			// Clear the deferredPrompt
			deferredPrompt = null;
			showInstallButton = false;
		} catch (error) {
			console.error('Error installing app:', error);
		}
	}
</script>

<!-- Hero fills the screen, no scroll -->
<section class="relative h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-900">
	<!-- Background image via CSS so it always covers -->
	<div class="absolute inset-0 bg-[url('/images/landing-bg.png')] bg-cover bg-center"></div>

	<!-- Dark overlay -->
	<div class="absolute inset-0 bg-black/40"></div>

	<!-- Install button (shown when installable) -->
	{#if showInstallButton}
		<button
			on:click={installApp}
			class="absolute top-6 right-6 z-20 flex items-center space-x-2 rounded-lg bg-white/90 px-4 py-2 text-sm font-medium text-gray-900 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
		>
			<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
			</svg>
			<span>Install App</span>
		</button>
	{/if}

	<!-- Text content -->
	<div class="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
		<h1 class="text-3xl font-bold text-white sm:text-5xl">Lisbon Trip Planner</h1>
		<p class="mt-2 text-lg text-white/80">Discover the best of Lisbon, on any device.</p>
		
		{#if showInstallButton}
			<button
				on:click={installApp}
				class="mt-8 flex items-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black"
			>
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
				</svg>
				<span>Install for Offline Access</span>
			</button>
		{/if}
	</div>
</section>

<!-- Features Section -->
<section class="w-full bg-white py-16">
	<div class="container mx-auto px-4">
		<h2 class="mb-12 text-center text-3xl font-bold text-gray-900">Plan Your Perfect Trip</h2>
		<div class="grid gap-8 md:grid-cols-3">
			<!-- Flight Planning -->
			<div class="rounded-xl bg-gray-50 p-6 text-center">
				<div class="mb-4 flex justify-center">
					<svg class="h-12 w-12 text-[#b74d95]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
					</svg>
				</div>
				<h3 class="mb-2 text-xl font-semibold text-gray-900">Flight Planning</h3>
				<p class="text-gray-600">Track your flights and get real-time updates on your journey.</p>
			</div>

			<!-- Accommodation -->
			<div class="rounded-xl bg-gray-50 p-6 text-center">
				<div class="mb-4 flex justify-center">
					<svg class="h-12 w-12 text-[#b74d95]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
					</svg>
				</div>
				<h3 class="mb-2 text-xl font-semibold text-gray-900">Accommodation</h3>
				<p class="text-gray-600">Find and manage your perfect stay in Lisbon.</p>
			</div>

			<!-- Local Experiences -->
			<div class="rounded-xl bg-gray-50 p-6 text-center">
				<div class="mb-4 flex justify-center">
					<svg class="h-12 w-12 text-[#b74d95]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
					</svg>
				</div>
				<h3 class="mb-2 text-xl font-semibold text-gray-900">Local Experiences</h3>
				<p class="text-gray-600">Discover the best places to stay and explore.</p>
			</div>
		</div>
	</div>
</section>


