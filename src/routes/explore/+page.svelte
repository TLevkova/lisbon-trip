<script lang="ts">
	import { exploreLocations } from '$lib/data/explore';
	import type { ExploreLocation } from '$lib/data/explore';
	import { zones } from '$lib/data/zones';
	import { goto } from '$app/navigation';
	import MapView from '$lib/components/MapView.svelte';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
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

	// Filtering and ordering state
	let showFilters = false;
	let orderBy: 'default' | 'planned-date' | 'visited' | 'zones' = 'default';
	let filterByZone: string | null = null;
	let filterByPlannedDate: string | null = null;
	let filterByVisited: boolean | null = null;

	// Get unique zones from locations for the legend
	$: uniqueZones = Array.from(new Set(locations.filter(loc => loc.zone).map(loc => loc.zone?.id)))
		.map(zoneId => zones.find(zone => zone.id === zoneId))
		.filter((zone): zone is NonNullable<typeof zone> => zone !== undefined);

	// Get available planned dates for filtering
	$: availablePlannedDates = Array.from(new Set(
		Object.values(visitedStatus)
			.filter(status => status.plannedVisitDate)
			.map(status => status.plannedVisitDate!)
	)).sort();

	// Check if any locations have visited status
	$: hasVisitedLocations = Object.values(visitedStatus).some(status => status.visited);

	// Apply filtering and ordering
	$: filteredAndOrderedLocations = (() => {
		let filtered = [...locations];

		// Apply filters
		if (filterByZone) {
			filtered = filtered.filter(loc => loc.zone?.id === filterByZone);
		}

		if (filterByPlannedDate) {
			filtered = filtered.filter(loc => visitedStatus[loc.slug]?.plannedVisitDate === filterByPlannedDate);
		}

		if (filterByVisited !== null) {
			filtered = filtered.filter(loc => visitedStatus[loc.slug]?.visited === filterByVisited);
		}

		// Apply ordering
		switch (orderBy) {
			case 'planned-date':
				filtered.sort((a, b) => {
					const aDate = visitedStatus[a.slug]?.plannedVisitDate;
					const bDate = visitedStatus[b.slug]?.plannedVisitDate;
					
					// Items with dates first, ordered by date (most recent first)
					if (aDate && !bDate) return -1;
					if (!aDate && bDate) return 1;
					if (aDate && bDate) {
						const dateCompare = new Date(aDate).getTime() - new Date(bDate).getTime();
						if (dateCompare !== 0) return dateCompare;
					}
					
					// Secondary: zones
					const aZoneIndex = a.zone ? zones.findIndex(z => z.id === a.zone!.id) : 999;
					const bZoneIndex = b.zone ? zones.findIndex(z => z.id === b.zone!.id) : 999;
					if (aZoneIndex !== bZoneIndex) return aZoneIndex - bZoneIndex;
					
					// Tertiary: slug id
					return a.slug.localeCompare(b.slug);
				});
				break;

			case 'visited':
				filtered.sort((a, b) => {
					const aVisited = visitedStatus[a.slug]?.visited || false;
					const bVisited = visitedStatus[b.slug]?.visited || false;
					
					// Visited items first
					if (aVisited && !bVisited) return -1;
					if (!aVisited && bVisited) return 1;
					
					// Secondary: zones
					const aZoneIndex = a.zone ? zones.findIndex(z => z.id === a.zone!.id) : 999;
					const bZoneIndex = b.zone ? zones.findIndex(z => z.id === b.zone!.id) : 999;
					if (aZoneIndex !== bZoneIndex) return aZoneIndex - bZoneIndex;
					
					// Tertiary: slug id
					return a.slug.localeCompare(b.slug);
				});
				break;

			case 'zones':
				filtered.sort((a, b) => {
					const aZoneIndex = a.zone ? zones.findIndex(z => z.id === a.zone!.id) : 999;
					const bZoneIndex = b.zone ? zones.findIndex(z => z.id === b.zone!.id) : 999;
					if (aZoneIndex !== bZoneIndex) return aZoneIndex - bZoneIndex;
					
					// Secondary: slug id
					return a.slug.localeCompare(b.slug);
				});
				break;

			default:
				// Keep original order
				break;
		}

		return filtered;
	})();

	// Check if any filters are active
	$: hasActiveFilters = filterByZone || filterByPlannedDate || filterByVisited !== null;

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

	// Reactive statement to handle URL parameter changes
	$: if (browser && $page.url.searchParams.has('view')) {
		const viewParam = $page.url.searchParams.get('view');
		if (viewParam === 'map' || viewParam === 'list') {
			console.log('Setting view to:', viewParam);
			view = viewParam;
		}
	}

	function formatDate(date: string) {
		return new Date(date).toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function handleLocationClick(location: ExploreLocation) {
		// Before navigating, update the current URL to include the view parameter
		// This ensures when user navigates back, they return to the correct view
		const currentUrl = new URL(window.location.href);
		currentUrl.searchParams.set('view', view);
		window.history.replaceState(window.history.state, '', currentUrl.toString());
		
		// Then navigate to the location page
		goto(`/explore/${location.slug}?from=${view}`);
	}

	function clearAllFilters() {
		filterByZone = null;
		filterByPlannedDate = null;
		filterByVisited = null;
		orderBy = 'default';
	}

	function clearFilters() {
		filterByZone = null;
		filterByPlannedDate = null;
		filterByVisited = null;
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

		<!-- Filters and Ordering (List view only) -->
		{#if view === 'list' && !loading}
			<div class="mb-6">
				<!-- Filter Toggle Button -->
				<div class="flex items-center justify-center space-x-4 mb-4">
					<button
						class="inline-flex items-center space-x-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#b74d95] focus:ring-offset-2"
						on:click={() => (showFilters = !showFilters)}
					>
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
						</svg>
						<span>Filters & Ordering</span>
						<svg 
							class="h-4 w-4 transform transition-transform duration-200" 
							class:rotate-180={showFilters}
							fill="none" 
							stroke="currentColor" 
							viewBox="0 0 24 24"
						>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
						</svg>
					</button>

					<!-- Active filters indicator -->
					{#if hasActiveFilters || orderBy !== 'default'}
						<span class="inline-flex items-center rounded-full bg-[#b74d95] px-2.5 py-0.5 text-xs font-medium text-white">
							{(hasActiveFilters ? 1 : 0) + (orderBy !== 'default' ? 1 : 0)} active
						</span>
					{/if}

					<!-- Quick clear all button -->
					{#if hasActiveFilters || orderBy !== 'default'}
						<button
							class="text-sm text-gray-500 hover:text-gray-700 underline"
							on:click={clearAllFilters}
						>
							Clear all
						</button>
					{/if}
				</div>

				<!-- Collapsible Filters Panel -->
				{#if showFilters}
					<div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
						<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
							<!-- Order By -->
							<div>
								<label for="order-by-select" class="block text-sm font-medium text-gray-700 mb-2">Order By</label>
								<select
									id="order-by-select"
									bind:value={orderBy}
									class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#b74d95] focus:outline-none focus:ring-1 focus:ring-[#b74d95]"
								>
									<option value="default">Default</option>
									{#if availablePlannedDates.length > 0}
										<option value="planned-date">Planned Visit Date</option>
									{/if}
									{#if hasVisitedLocations}
										<option value="visited">Visited Status</option>
									{/if}
									<option value="zones">Zones</option>
								</select>
							</div>

							<!-- Filter by Zone -->
							<div>
								<label for="zone-filter-select" class="block text-sm font-medium text-gray-700 mb-2">Zone</label>
								<select
									id="zone-filter-select"
									bind:value={filterByZone}
									class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#b74d95] focus:outline-none focus:ring-1 focus:ring-[#b74d95]"
								>
									<option value={null}>All Zones</option>
									{#each uniqueZones as zone}
										<option value={zone.id}>{zone.name}</option>
									{/each}
								</select>
							</div>

							<!-- Filter by Planned Date -->
							{#if availablePlannedDates.length > 0}
								<div>
									<label for="planned-date-filter-select" class="block text-sm font-medium text-gray-700 mb-2">Planned Date</label>
									<select
										id="planned-date-filter-select"
										bind:value={filterByPlannedDate}
										class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#b74d95] focus:outline-none focus:ring-1 focus:ring-[#b74d95]"
									>
										<option value={null}>All Dates</option>
										{#each availablePlannedDates as date}
											<option value={date}>{formatDate(date)}</option>
										{/each}
									</select>
								</div>
							{/if}

							<!-- Filter by Visited Status -->
							{#if hasVisitedLocations}
								<div>
									<label for="visited-filter-select" class="block text-sm font-medium text-gray-700 mb-2">Visited Status</label>
									<select
										id="visited-filter-select"
										bind:value={filterByVisited}
										class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#b74d95] focus:outline-none focus:ring-1 focus:ring-[#b74d95]"
									>
										<option value={null}>All</option>
										<option value={true}>Visited</option>
										<option value={false}>Not Visited</option>
									</select>
								</div>
							{/if}
						</div>

						<!-- Clear Filters Button -->
						{#if hasActiveFilters}
							<div class="mt-4 flex justify-end">
								<button
									class="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
									on:click={clearFilters}
								>
									Clear Filters
								</button>
							</div>
						{/if}
					</div>
				{/if}

				<!-- Results Summary -->
				{#if hasActiveFilters || orderBy !== 'default'}
					<div class="mt-4 text-sm text-gray-600">
						Showing {filteredAndOrderedLocations.length} of {locations.length} locations
						{#if orderBy !== 'default'}
							• Ordered by {orderBy === 'planned-date' ? 'planned visit date' : orderBy === 'visited' ? 'visited status' : 'zones'}
						{/if}
					</div>
				{/if}
			</div>
		{/if}

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
				{#each filteredAndOrderedLocations as loc}
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

			<!-- No results message -->
			{#if filteredAndOrderedLocations.length === 0 && !loading}
				<div class="text-center py-12">
					<svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 6.306a7.962 7.962 0 00-6 0m6 0V4a2 2 0 00-2-2h-2a2 2 0 00-2 2v2.306" />
					</svg>
					<h3 class="mt-2 text-sm font-medium text-gray-900">No locations found</h3>
					<p class="mt-1 text-sm text-gray-500">Try adjusting your filters to see more results.</p>
					<div class="mt-6">
						<button
							class="inline-flex items-center rounded-md bg-[#b74d95] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#a64287] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b74d95]"
							on:click={clearAllFilters}
						>
							Clear all filters
						</button>
					</div>
				</div>
			{/if}
		{/if}
	</div>
</div>
