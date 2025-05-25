<script lang="ts">
	import { exploreLocations } from '$lib/data/explore';
	import type { ExploreLocation } from '$lib/data/explore';
	import { zones } from '$lib/data/zones';
	import { goto } from '$app/navigation';
	import MapView from '$lib/components/MapView.svelte';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import localforage from 'localforage';

	interface VisitedData {
		visited: boolean;
		visitedAt: string;
		plannedVisitDate: string | null;
	}

	let locations: ExploreLocation[] = exploreLocations;
	let view: 'list' | 'map' = 'list';
	let visitedStatus: Record<string, VisitedData> = {};
	let loading = true;

	// Get unique zones from locations for the legend
	$: uniqueZones = Array.from(new Set(locations.filter(loc => loc.zone).map(loc => loc.zone?.id)))
		.map(zoneId => zones.find(zone => zone.id === zoneId))
		.filter((zone): zone is NonNullable<typeof zone> => zone !== undefined);

	const visitedStore = localforage.createInstance({
		name: 'lisbon-trip',
		storeName: 'visited'
	});

	onMount(async () => {
		try {
			// Load visited status for all locations
			const statuses = await Promise.all(
				locations.map(async (loc) => {
					const data = await visitedStore.getItem<VisitedData>(loc.slug);
					return [loc.slug, data || { visited: false, visitedAt: '', plannedVisitDate: null }];
				})
			);
			visitedStatus = Object.fromEntries(statuses);
		} catch (error) {
			console.error('Error loading visited statuses:', error);
		} finally {
			loading = false;
		}
	});

	function formatDate(date: string) {
		return new Date(date).toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function handleLocationClick(location: ExploreLocation) {
		goto(`/explore/${location.slug}`);
	}
</script>

<div class="min-h-screen w-full bg-slate-100 py-8">
	<!-- inner section: edge-to-edge, centred like Flights -->
	<div class="mx-auto w-full max-w-5xl px-4 text-center">
		<h1 class="mb-6 text-3xl font-bold text-gray-800">Explore Lisbon</h1>

		<!-- View-toggle buttons (Flights-style) -->
		<div class="mb-4 flex justify-center space-x-2">
			<button
				class="rounded-full px-4 py-2 font-semibold transition focus:outline-none"
				class:bg-[#b74d95]={view === 'list'}
				class:text-white={view === 'list'}
				class:ring-2={view !== 'list'}
				class:ring-[#b74d95]={view !== 'list'}
				class:text-[#b74d95]={view !== 'list'}
				class:bg-transparent={view !== 'list'}
				on:click={() => (view = 'list')}
			>
				View List
			</button>

			<button
				class="rounded-full px-4 py-2 font-semibold transition focus:outline-none"
				class:bg-[#b74d95]={view === 'map'}
				class:text-white={view === 'map'}
				class:ring-2={view !== 'map'}
				class:ring-[#b74d95]={view !== 'map'}
				class:text-[#b74d95]={view !== 'map'}
				class:bg-transparent={view !== 'map'}
				on:click={() => (view = 'map')}
			>
				Open Map
			</button>
		</div>

		{#if view === 'map' && browser}
			<!-- Map view -->
			<div class="mb-8 w-full">
				<div class="h-96 w-full overflow-hidden rounded-xl shadow-lg">
					<MapView {locations} />
				</div>
				
				<!-- Zone Legend -->
				<div class="mt-4 rounded-lg bg-white p-4 shadow-lg">
					<h4 class="mb-3 text-sm font-semibold text-gray-900">Zones</h4>
					<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
						{#each uniqueZones as zone}
							<div class="flex items-center space-x-2 text-sm">
								<div class="h-3 w-3 rounded-full flex-shrink-0" style="background-color: {zone.color}"></div>
								<span class="text-gray-700">{zone.name}</span>
							</div>
						{/each}
					</div>
				</div>
			</div>
		{/if}

		{#if view === 'list'}
			<!-- List view -->
			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{#each locations as loc}
					<div
						role="link"
						tabindex="0"
						class="cursor-pointer overflow-hidden rounded-xl bg-white shadow-lg transition dark:bg-gray-800"
						style="border-left: 4px solid {loc.zone?.color || '#E5E7EB'}"
						on:click={() => handleLocationClick(loc)}
						on:keydown={(e: KeyboardEvent) => {
							if (e.key === 'Enter' || e.key === ' ') handleLocationClick(loc);
						}}
					>
						<img src={loc.heroImg} alt={loc.title} class="h-48 w-full object-cover" />
						<div class="p-4">
							<div class="flex items-start justify-between">
								<div class="text-left">
									<h2 class="text-xl font-semibold text-gray-900 dark:text-white">
										{loc.title}
									</h2>
									<p class="mt-1 text-left text-gray-600 dark:text-gray-400">{loc.category}</p>
								</div>
								{#if !loading}
									<div class="flex flex-col items-end space-y-1">
										{#if loc.zone}
											<span 
												class="rounded-full px-2 py-0.5 text-xs font-medium text-white"
												style="background-color: {loc.zone.color}"
											>
												{loc.zone.name}
											</span>
										{/if}
										{#if visitedStatus[loc.slug]?.visited}
											<span class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
												<svg class="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
													<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
												</svg>
												Visited
											</span>
										{/if}
										{#if visitedStatus[loc.slug]?.plannedVisitDate}
											<span class="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
												<svg class="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
													<path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
												</svg>
												{formatDate(visitedStatus[loc.slug].plannedVisitDate!)}
											</span>
										{/if}
									</div>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
