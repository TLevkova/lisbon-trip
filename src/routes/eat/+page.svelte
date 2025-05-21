<script lang="ts">
	import { onMount } from 'svelte';
	import type { EatSpot } from '$lib/types';

	let spots: EatSpot[] = [];

	onMount(async () => {
		const response = await fetch('/data/eat.json');
		spots = await response.json();
	});

	function formatRating(rating: number): string {
		return rating.toFixed(1);
	}

	function getGoogleMapsUrl(lat: number, lng: number, name: string): string {
		return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${encodeURIComponent(name)}`;
	}
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-8 text-3xl font-bold text-gray-900 dark:text-white">Eat & Drink in Lisbon</h1>

	<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
		{#each spots as spot}
			<div class="overflow-hidden rounded-xl bg-white shadow-lg dark:bg-gray-800">
				<div class="relative h-48">
					<img
						src={`/images/${spot.image || 'placeholder.jpg'}`}
						alt={spot.name}
						class="h-full w-full object-cover"
						on:error={(e) => {
							const img = e.currentTarget as HTMLImageElement;
							img.setAttribute('src', '/images/placeholder.jpg');
						}}
					/>
					<div
						class="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-white px-2 py-1 text-sm font-semibold dark:bg-gray-900"
					>
						<svg class="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
							<path
								d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
							/>
						</svg>
						{formatRating(spot.rating)}
					</div>
				</div>
				<div class="p-4">
					<h3 class="mb-2 text-lg font-semibold text-gray-900 dark:text-white">{spot.name}</h3>
					<p class="mb-2 text-sm text-gray-500 dark:text-gray-400">{spot.cuisine}</p>
					<p class="mb-3 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
						{spot.description}
					</p>

					<div class="flex flex-wrap gap-2 text-sm">
						<a
							href={getGoogleMapsUrl(spot.location.lat, spot.location.lng, spot.name)}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-1 text-blue-600 hover:underline dark:text-blue-400"
						>
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
								/>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
								/>
							</svg>
							Map
						</a>
						{#if spot.menu}
							<a
								href={spot.menu}
								target="_blank"
								rel="noopener noreferrer"
								class="inline-flex items-center gap-1 text-blue-600 hover:underline dark:text-blue-400"
							>
								<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
									/>
								</svg>
								Menu
							</a>
						{/if}
						{#if spot.reservations}
							<a
								href={spot.reservations}
								target="_blank"
								rel="noopener noreferrer"
								class="inline-flex items-center gap-1 text-blue-600 hover:underline dark:text-blue-400"
							>
								<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
									/>
								</svg>
								Reserve
							</a>
						{/if}
					</div>

					<div class="mt-3 text-sm text-gray-500 dark:text-gray-400">
						<p>{spot.priceRange}</p>
						<p>{spot.openHours}</p>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
