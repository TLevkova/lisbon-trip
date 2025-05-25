<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { ExploreLocation } from '$lib/data/explore';
	import localforage from 'localforage';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';

	export let data: { item: ExploreLocation };

	let visited = false;
	let visitedAt: string | null = null;
	let loading = true;
	let toggling = false;
	let toast = { show: false, message: '', type: '' };
	let isExpanded = false;
	let comprehensiveDescription = '';
	let isOnline = true;
	let showOfflineModal = false;
	let audio: HTMLAudioElement | null = null;
	let isPlaying = false;

	interface VisitedData {
		visited: boolean;
		visitedAt: string;
		plannedVisitDate: string | null;
	}

	const visitedStore = localforage.createInstance({
		name: 'lisbon-trip',
		storeName: 'visited'
	});

	let plannedVisitDate: string | null = null;
	let isSettingDate = false;

	onMount(async () => {
		try {
			const visitedData = await visitedStore.getItem<VisitedData>(data.item.slug);
			if (visitedData) {
				visited = visitedData.visited;
				visitedAt = visitedData.visitedAt;
				plannedVisitDate = visitedData.plannedVisitDate;
			}

			// Load comprehensive description for all locations
			const textResponse = await fetch(`/descriptions/${data.item.slug}.txt`);
			const audioResponse = await fetch(`/audio/${data.item.slug}.wav`);

			// Only proceed if both text and audio files exist
			if (textResponse.ok && audioResponse.ok) {
				const text = await textResponse.text();
				// Fix the text formatting by adding spaces between words
				comprehensiveDescription = text
					.replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase
					.replace(/([a-z])([0-9])/g, '$1 $2') // Add space between letter and number
					.replace(/([0-9])([a-z])/g, '$1 $2') // Add space between number and letter
					.replace(/([a-z])([a-z])([A-Z])/g, '$1$2 $3'); // Handle cases like "oneof" -> "one of"

				// Initialize audio
				audio = new Audio(`/audio/${data.item.slug}.wav`);
				audio.addEventListener('ended', () => {
					isPlaying = false;
				});
			}

			// Check online status
			isOnline = navigator.onLine;
			window.addEventListener('online', () => (isOnline = true));
			window.addEventListener('offline', () => (isOnline = false));
		} catch (error) {
			console.error('Error loading data:', error);
			showToast('Error loading data', 'error');
		} finally {
			loading = false;
		}
	});

	function showToast(message: string, type: 'success' | 'error') {
		toast = { show: true, message, type };
		setTimeout(() => (toast.show = false), 3000);
	}

	async function toggleVisited() {
		if (toggling) return;
		toggling = true;
		try {
			visited = !visited;
			visitedAt = visited ? new Date().toISOString() : null;
			const visitedData: VisitedData = { visited, visitedAt: visitedAt || '', plannedVisitDate };
			await visitedStore.setItem(data.item.slug, visitedData);
			showToast(visited ? 'Marked as visited!' : 'Removed from visited places', 'success');
		} catch (error) {
			console.error('Error saving visited status:', error);
			visited = !visited;
			visitedAt = null;
			showToast('Error saving visited status', 'error');
		} finally {
			toggling = false;
		}
	}

	async function setPlannedVisitDate(date: string | null) {
		if (isSettingDate) return;
		isSettingDate = true;
		try {
			plannedVisitDate = date;
			const visitedData: VisitedData = {
				visited,
				visitedAt: visitedAt || '',
				plannedVisitDate: date
			};
			await visitedStore.setItem(data.item.slug, visitedData);
			showToast(date ? 'Visit date set!' : 'Visit date removed', 'success');
		} catch (error) {
			console.error('Error saving planned visit date:', error);
			plannedVisitDate = null;
			showToast('Error saving planned visit date', 'error');
		} finally {
			isSettingDate = false;
		}
	}

	function getGoogleMapsLink() {
		const { lat, lng } = data.item.coordinates;
		return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
	}

	

	function formatVisitedDate(date: string) {
		return new Date(date).toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function toggleAudio() {
		if (!isOnline) {
			showOfflineModal = true;
			return;
		}

		if (!audio) return;

		if (isPlaying) {
			audio.pause();
			audio.currentTime = 0;
		} else {
			audio.play();
		}
		isPlaying = !isPlaying;
	}

	onDestroy(() => {
		if (audio) {
			audio.pause();
			audio.currentTime = 0;
			isPlaying = false;
		}
	});
</script>

{#if toast.show}
	<div
		class="fixed bottom-4 right-4 z-50 rounded-lg px-4 py-2 shadow-lg transition-opacity duration-300"
		class:bg-green-500={toast.type === 'success'}
		class:bg-red-500={toast.type === 'error'}
	>
		<p class="font-medium text-white">{toast.message}</p>
	</div>
{/if}

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
	<!-- Hero Image (pulled up to cover layout padding) -->
	<div class="relative -mt-24 h-[70vh] w-full">
		<img
			src={data.item.heroImg || data.item.image}
			alt={data.item.title}
			class="h-full w-full object-cover"
		/>
		<!-- Gradient overlay with blur effect at bottom -->
		<div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
		<div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent backdrop-blur-sm"></div>
		
		<div class="absolute bottom-0 left-0 right-0 p-6 text-white">
			<h1 class="mb-2 text-4xl font-bold drop-shadow-lg">{data.item.title}</h1>
			<div class="flex items-center space-x-3">
				<p class="text-lg opacity-90 drop-shadow-md">{data.item.category}</p>
				{#if data.item.zone}
					<span class="rounded-full px-3 py-1 text-sm font-medium drop-shadow-md" style="background-color: {data.item.zone.color}; color: white;">
						{data.item.zone.name}
					</span>
				{/if}
			</div>
		</div>
	</div>

	<div class="container mx-auto max-w-3xl px-4 py-12">
		<!-- Price and Rating -->
		<div class="mb-6 flex items-center justify-between">
					{#if data.item.price && data.item.price.toLowerCase() !== 'n/a'}				<div class="flex items-center space-x-4">					<span class="text-2xl font-bold text-gray-900 dark:text-white">						{data.item.price}					</span>					{#if data.item.price.toLowerCase() !== 'free'}						<span class="text-sm text-gray-500 dark:text-gray-400">per person</span>					{/if}				</div>			{/if}
			<div class="flex items-center space-x-1">
				{#each Array(5) as _, i}
					{#if i < Math.floor(data.item.rating)}
						<!-- Full star -->
						<svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
							<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
						</svg>
					{:else if i === Math.floor(data.item.rating) && data.item.rating % 1 !== 0}
						<!-- Partial star -->
						<div class="relative h-5 w-5">
							<svg class="absolute h-5 w-5 text-gray-300 dark:text-gray-600" fill="currentColor" viewBox="0 0 20 20">
								<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
							</svg>
							<div class="absolute overflow-hidden" style="width: {(data.item.rating % 1) * 100}%">
								<svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
									<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
								</svg>
							</div>
						</div>
					{:else}
						<!-- Empty star -->
						<svg class="h-5 w-5 text-gray-300 dark:text-gray-600" fill="currentColor" viewBox="0 0 20 20">
							<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
						</svg>
					{/if}
				{/each}
			</div>
		</div>

		<!-- Description -->
		<div class="prose dark:prose-invert mb-8 max-w-none">
			<p class="text-gray-700 dark:text-gray-300">{data.item.description}</p>
		</div>

		<!-- Visited Toggle -->
		<div class="mb-12 space-y-8">
			<div class="relative">
				<h2 class="mb-6 text-xl font-bold text-gray-900 dark:text-white pl-3 border-l-4 border-[#b74d95] hover:pl-4 transition-all duration-300">
					Been there?
				</h2>
				<div class="flex items-center justify-between">
					{#if visited && visitedAt}
						<p class="text-sm text-gray-500 dark:text-gray-400">
							Visited on {formatVisitedDate(visitedAt)}
						</p>
					{:else}
						<p class="text-sm text-gray-500 dark:text-gray-400">Mark this place as visited</p>
					{/if}
					<button
						class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
						class:bg-blue-600={visited}
						class:bg-gray-200={!visited}
						on:click={toggleVisited}
						disabled={loading || toggling}
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

			<!-- Planned Visit Date -->
			<div class="relative">
				<h2 class="mb-6 text-xl font-bold text-gray-900 dark:text-white pl-3 border-l-4 border-[#b74d95] hover:pl-4 transition-all duration-300">
					Plan to Visit
				</h2>
				<div class="space-y-3">
					<div class="flex items-center space-x-2">
						<input
							type="date"
							class="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
							value={plannedVisitDate || ''}
							min={new Date().toISOString().split('T')[0]}
							on:change={(e) => setPlannedVisitDate(e.currentTarget.value || null)}
							disabled={loading || isSettingDate}
						/>
						{#if plannedVisitDate}
							<button
								class="rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
								on:click={() => setPlannedVisitDate(null)}
								disabled={loading || isSettingDate}
							>
								Clear
							</button>
						{/if}
					</div>
					{#if plannedVisitDate}
						<p class="text-sm text-gray-500 dark:text-gray-400">
							Planned for {formatVisitedDate(plannedVisitDate)}
						</p>
					{:else}
						<p class="text-sm text-gray-500 dark:text-gray-400">Set a date for your visit</p>
					{/if}
				</div>
			</div>
		</div>

		<!-- Opening Hours -->
		{#if data.item.openingHours && data.item.openingHours.toLowerCase() !== 'n/a'}
			<div class="relative mb-12">
				<h2 class="mb-6 text-xl font-bold text-gray-900 dark:text-white pl-3 border-l-4 border-[#b74d95] hover:pl-4 transition-all duration-300">
					Opening Hours
				</h2>
				<div class="pl-3">
					<p class="text-gray-900 dark:text-white leading-relaxed text-base sm:text-lg">
						{data.item.openingHours}
					</p>
				</div>
			</div>
		{/if}

		<!-- Location -->
		<div class="relative mb-12">
			<h2 class="mb-6 text-xl font-bold text-gray-900 dark:text-white pl-3 border-l-4 border-[#b74d95] hover:pl-4 transition-all duration-300">
				Location
			</h2>
			<div class="pl-3">
				<p class="mb-4 text-gray-600 dark:text-gray-400">{data.item.address}</p>
				<a
					href={getGoogleMapsLink()}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
				>
					Open in Maps
				</a>
			</div>
		</div>

		<!-- Comprehensive Description -->
		{#if comprehensiveDescription}
			<div class="relative mb-12">
				<div class="flex items-center justify-between">
					<h2 class="mb-6 text-xl font-bold text-gray-900 dark:text-white pl-3 border-l-4 border-[#b74d95] hover:pl-4 transition-all duration-300">
						Description
					</h2>
					<button
						class="ml-4 rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
						on:click={toggleAudio}
						title={isPlaying ? 'Stop audio' : 'Play audio description'}
					>
						{#if isPlaying}
							<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
								<rect
									x="9"
									y="9"
									width="6"
									height="6"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
								/>
							</svg>
						{:else}
							<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
								/>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						{/if}
					</button>
				</div>
				<div class="pl-3">
					<button
						class="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
						on:click={() => (isExpanded = !isExpanded)}
					>
						<svg
							class="mr-2 h-5 w-5 transform transition-transform duration-200"
							class:rotate-180={isExpanded}
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 9l-7 7-7-7"
							/>
						</svg>
						<span class="text-sm font-medium">{isExpanded ? 'Show less' : 'Show more'}</span>
					</button>
					{#if isExpanded}
						<div class="mt-4">
							<div class="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert">
								<p class="text-gray-700 dark:text-gray-300">
									{#each comprehensiveDescription.split('\n') as paragraph}
										{#if paragraph.trim()}
											<span class="mb-4 block">{paragraph}</span>
										{/if}
									{/each}
								</p>
							</div>
						</div>
					{/if}
				</div>
			</div>
		{/if}

		<!-- Offline Modal -->
		{#if showOfflineModal}
			<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
				<div class="mx-4 max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
					<h3 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Offline Mode</h3>
					<p class="mb-6 text-gray-600 dark:text-gray-400">
						Audio description is only available when you're online. Please check your internet
						connection and try again.
					</p>
					<button
						class="w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
						on:click={() => (showOfflineModal = false)}
					>
						Close
					</button>
				</div>
			</div>
		{/if}
	</div>
</div>
