<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { flightsStore, outboundFlights, returnFlights } from '$lib/stores/flights';
	import type { Flight } from '$lib/stores/flights';

	let flightCode: string = '';
	let flightNumber: string = '';
	let flightDate: string = '';
	let flightType: 'outbound' | 'return' = 'outbound';
	let showConfirmRemove = false;
	let flightToRemove: Flight | null = null;
	let errorMessage: string | null = null;
	let showAddFlight = true;
	let showStatusDetails: Flight | null = null;
	let statusPopupPosition: { x: number; y: number } | null = null;

	if (browser) {
		const savedFlights = localStorage.getItem('flights');
		if (savedFlights) {
			flightsStore.setFlights(JSON.parse(savedFlights));
		}
	}

	async function addFlight() {
		if (!browser) return;
		
		errorMessage = null;
		
		try {
			const res = await fetch(`/api/flights?carrierCode=${flightCode}&flightNumber=${flightNumber}&departureDateTime=${flightDate}`);
			const data = await res.json();
			
			if (!res.ok) {
				throw new Error(data.error || 'Failed to fetch flight data');
			}
			
			if (!data.flights || data.flights.length === 0) {
				throw new Error('No flight data found');
			}

			// Set the correct type before saving
			data.flights[0].type = flightType;

			// Update store with new flight
			flightsStore.update(currentFlights => {
				const newFlights = [...currentFlights];
				const existingIndex = newFlights.findIndex(f => f.id === data.flights[0].id);
				
				if (existingIndex >= 0) {
					newFlights[existingIndex] = data.flights[0];
				} else {
					newFlights.push(data.flights[0]);
				}
				
				// Save to localStorage
				localStorage.setItem('flights', JSON.stringify(newFlights));
				return newFlights;
			});

			// Reset form
			flightCode = '';
			flightNumber = '';
			flightDate = '';
		} catch (error) {
			console.error('Error adding flight:', error);
			errorMessage = error instanceof Error ? error.message : 'An error occurred while adding the flight';
		}
	}

	function confirmRemove(flight: Flight) {
		flightToRemove = flight;
		showConfirmRemove = true;
	}

	function removeFlight() {
		if (!flightToRemove) return;
		
		flightsStore.update(currentFlights => {
			const newFlights = currentFlights.filter(f => f.id !== flightToRemove!.id);
			localStorage.setItem('flights', JSON.stringify(newFlights));
			return newFlights;
		});
		
		showConfirmRemove = false;
		flightToRemove = null;
	}

	function formatTime(timeString: string): string {
		return new Date(timeString).toLocaleTimeString('en-US', {
			hour: '2-digit',
			minute: '2-digit',
			hour12: false
		});
	}

	function formatDate(timeString: string): string {
		return new Date(timeString).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric'
		});
	}

	function formatDateTime(utcString: string): string {
		if (!utcString || utcString === 'Not updated yet') return utcString;
		return new Date(utcString).toLocaleString();
	}

	function getStatusColor(status: string | undefined): string {
		if (!status || status === 'Status Unknown') return 'bg-gray-100 text-gray-600';
		
		switch (status.toLowerCase()) {
			case 'scheduled':
				return 'bg-green-100 text-green-800';
			case 'delayed':
				return 'bg-yellow-100 text-yellow-800';
			case 'cancelled':
				return 'bg-red-100 text-red-800';
			case 'diverted':
				return 'bg-orange-100 text-orange-800';
			case 'landed':
				return 'bg-blue-100 text-blue-800';
			default:
				return 'bg-gray-100 text-gray-600';
		}
	}

	function handleStatusClick(event: MouseEvent, flight: Flight) {
		const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;
		const popupWidth = 256; // 64 * 4 (w-64 = 16rem = 256px)
		const popupHeight = 120; // Approximate height of the popup
		
		// Calculate the left position to ensure the popup is fully visible
		let left = rect.left + rect.width / 2;
		if (left + popupWidth / 2 > viewportWidth) {
			left = viewportWidth - popupWidth / 2;
		} else if (left - popupWidth / 2 < 0) {
			left = popupWidth / 2;
		}

		// Check if there's enough space below the badge
		const spaceBelow = viewportHeight - rect.bottom;
		const spaceAbove = rect.top;
		
		// Position the popup above or below based on available space
		const y = spaceBelow >= popupHeight + 8 
			? rect.bottom + 8  // Position below with 8px margin
			: rect.top - popupHeight - 8; // Position above with 8px margin

		statusPopupPosition = { x: left, y };
		showStatusDetails = showStatusDetails?.id === flight.id ? null : flight;
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.status-details-popup') && !target.closest('.status-badge')) {
			showStatusDetails = null;
			statusPopupPosition = null;
		}
	}

	async function refreshFlight(flight: Flight) {
		if (!browser) return;
		
		try {
			const [carrierCode, flightNumber] = flight.id.match(/([A-Z]+)(\d+)/)?.slice(1) || [];
			const departureDate = flight.departure.time.split('T')[0];
			
			const res = await fetch(`/api/flights?carrierCode=${carrierCode}&flightNumber=${flightNumber}&departureDateTime=${departureDate}`);
			const data = await res.json();
			
			if (!res.ok) {
				throw new Error(data.error || 'Failed to fetch flight data');
			}
			
			if (!data.flights || data.flights.length === 0) {
				throw new Error('No flight data found');
			}

			// Preserve the flight type
			data.flights[0].type = flight.type;

			// Update store with new flight data
			flightsStore.update(currentFlights => {
				const newFlights = [...currentFlights];
				const existingIndex = newFlights.findIndex(f => f.id === flight.id);
				
				if (existingIndex >= 0) {
					newFlights[existingIndex] = data.flights[0];
				}
				
				// Save to localStorage
				localStorage.setItem('flights', JSON.stringify(newFlights));
				return newFlights;
			});
		} catch (error) {
			console.error('Error refreshing flight:', error);
			errorMessage = error instanceof Error ? error.message : 'An error occurred while refreshing the flight';
		}
	}

	onMount(() => {
		if (browser) {
			document.addEventListener('click', handleClickOutside);
			const savedFlights = localStorage.getItem('flights');
			if (savedFlights) {
				flightsStore.setFlights(JSON.parse(savedFlights));
			}
		}

		return () => {
			if (browser) {
				document.removeEventListener('click', handleClickOutside);
			}
		};
	});
</script>

<div class="min-h-screen w-full bg-slate-100 p-4">
	<!-- Add Flight Form -->
	<div class="mx-auto mb-8 w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
		<div class="mb-4 flex items-center justify-between">
			<button
				on:click={() => (showAddFlight = !showAddFlight)}
				class="flex items-center justify-between text-xl font-bold text-gray-800"
			>
				<span>Add Flight</span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6 transform transition-transform {showAddFlight ? 'rotate-180' : ''}"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
				</svg>
			</button>
		</div>
		{#if showAddFlight}
			{#if errorMessage}
				<div class="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">
					{errorMessage}
				</div>
			{/if}
			<div class="space-y-4">
				<div class="flex gap-4">
					<div class="flex-1">
						<label for="flightCode" class="block text-sm font-medium text-gray-700">Airline Code</label>
						<input
							id="flightCode"
							type="text"
							bind:value={flightCode}
							placeholder="e.g. FB"
							class="mt-1 w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-[#b74d95]"
						/>
					</div>
					<div class="flex-1">
						<label for="flightNumber" class="block text-sm font-medium text-gray-700">Flight Number</label>
						<input
							id="flightNumber"
							type="text"
							bind:value={flightNumber}
							placeholder="e.g. 563"
							class="mt-1 w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-[#b74d95]"
						/>
					</div>
				</div>
				<div>
					<label for="flightDate" class="block text-sm font-medium text-gray-700">Flight Date</label>
					<input
						id="flightDate"
						type="date"
						bind:value={flightDate}
						min={new Date().toISOString().split('T')[0]}
						class="mt-1 w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-[#b74d95]"
					/>
				</div>
				<div>
					<label for="flightType" class="block text-sm font-medium text-gray-700">Flight Type</label>
					<select
						id="flightType"
						bind:value={flightType}
						class="mt-1 w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-[#b74d95]"
					>
						<option value="outbound">Outbound</option>
						<option value="return">Return</option>
					</select>
				</div>
				<button
					on:click={addFlight}
					class="w-full rounded-full bg-[#b74d95] px-5 py-3 font-semibold text-white shadow-md transition hover:bg-[#995d86]"
					>Add Flight</button
				>
			</div>
		{/if}
	</div>

	<!-- Outbound Flights -->
	{#if $outboundFlights.length}
		<section class="mx-auto mb-12 w-full max-w-4xl px-4">
			<h2 class="mb-6 text-center text-3xl font-bold text-gray-800">Outbound Flights</h2>
			<div class="grid gap-6 {$outboundFlights.length === 1 ? 'md:grid-cols-1 md:max-w-2xl md:mx-auto' : 'md:grid-cols-2'}">
				{#each $outboundFlights as flight (flight.id)}
					<div class="overflow-hidden rounded-2xl bg-white shadow-lg">
						<div class="p-6">
							<div class="mb-4 flex items-center justify-between">
								<div class="flex items-center space-x-4">
									<div
										class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#b74d95]"
									>
										<span class="text-lg font-bold text-white">{flight.airlineCode}</span>
									</div>
									<div class="min-w-0">
										<h3 class="truncate text-lg font-semibold text-gray-800">{flight.airline}</h3>
										<p class="text-sm text-gray-500">{flight.duration}</p>
									</div>
								</div>
								<div class="flex flex-col items-end">
									<button
										on:click={() => confirmRemove(flight)}
										class="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
										aria-label="Remove flight {flight.id}"
									>
										<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
											<path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
										</svg>
									</button>
									<span class="mt-2 text-lg font-bold text-[#b74d95]">{flight.id}</span>
								</div>
							</div>

							<div class="flex items-center justify-between">
								<div class="text-center">
									<p class="text-3xl font-bold text-gray-900">
										{formatTime(flight.departure.time)}
									</p>
									<p class="text-sm text-gray-500">{flight.departure.airport}</p>
									<p class="text-xs text-gray-400">Terminal {flight.departure.terminal}</p>
								</div>
								<div class="flex-1 px-4">
									<hr class="border-t-2 border-dashed border-gray-200" />
								</div>
								<div class="text-center">
									<p class="text-3xl font-bold text-gray-900">{formatTime(flight.arrival.time)}</p>
									<p class="text-sm text-gray-500">{flight.arrival.airport}</p>
									<p class="text-xs text-gray-400">Terminal {flight.arrival.terminal}</p>
								</div>
							</div>

							<div class="mt-4 flex items-center justify-between">
								<p class="text-sm text-gray-500">
									{formatDate(flight.departure.time)}
								</p>
								<div class="flex flex-col items-center space-y-2">
									<div class="relative">
										<button
											on:click|stopPropagation={(e) => handleStatusClick(e, flight)}
											class="status-badge rounded-full px-3 py-1 text-sm font-medium {getStatusColor(flight.status)}"
										>
											{flight.status}
										</button>
									</div>
									<button
										on:click={() => refreshFlight(flight)}
										class="rounded-full bg-[#d296bb] px-3 py-1 text-sm font-medium text-white hover:bg-[#6d2d57]"
									>
										Refresh Flight
									</button>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Return Flights -->
	{#if $returnFlights.length}
		<section class="mx-auto mb-12 w-full max-w-4xl px-4">
			<h2 class="mb-6 text-center text-3xl font-bold text-gray-800">Return Flights</h2>
			<div class="grid gap-6 {$returnFlights.length === 1 ? 'md:grid-cols-1 md:max-w-2xl md:mx-auto' : 'md:grid-cols-2'}">
				{#each $returnFlights as flight (flight.id)}
					<div class="overflow-hidden rounded-2xl bg-white shadow-lg">
						<div class="p-6">
							<div class="mb-4 flex items-center justify-between">
								<div class="flex items-center space-x-4">
									<div
										class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#b74d95]"
									>
										<span class="text-lg font-bold text-white">{flight.airlineCode}</span>
									</div>
									<div class="min-w-0">
										<h3 class="truncate text-lg font-semibold text-gray-800">{flight.airline}</h3>
										<p class="text-sm text-gray-500">{flight.duration}</p>
									</div>
								</div>
								<div class="flex flex-col items-end">
									<button
										on:click={() => confirmRemove(flight)}
										class="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
										aria-label="Remove flight {flight.id}"
									>
										<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
											<path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
										</svg>
									</button>
									<span class="mt-2 text-lg font-bold text-[#b74d95]">{flight.id}</span>
								</div>
							</div>

							<div class="flex items-center justify-between">
								<div class="text-center">
									<p class="text-3xl font-bold text-gray-900">
										{formatTime(flight.departure.time)}
									</p>
									<p class="text-sm text-gray-500">{flight.departure.airport}</p>
									<p class="text-xs text-gray-400">Terminal {flight.departure.terminal}</p>
								</div>
								<div class="flex-1 px-4">
									<hr class="border-t-2 border-dashed border-gray-200" />
								</div>
								<div class="text-center">
									<p class="text-3xl font-bold text-gray-900">{formatTime(flight.arrival.time)}</p>
									<p class="text-sm text-gray-500">{flight.arrival.airport}</p>
									<p class="text-xs text-gray-400">Terminal {flight.arrival.terminal}</p>
								</div>
							</div>

							<div class="mt-4 flex items-center justify-between">
								<p class="text-sm text-gray-500">
									{formatDate(flight.departure.time)}
								</p>
								<div class="flex flex-col items-center space-y-2">
									<div class="relative">
										<button
											on:click|stopPropagation={(e) => handleStatusClick(e, flight)}
											class="status-badge rounded-full px-3 py-1 text-sm font-medium {getStatusColor(flight.status)}"
										>
											{flight.status}
										</button>
									</div>
									<button
										on:click={() => refreshFlight(flight)}
										class="rounded-full bg-[#d296bb] px-3 py-1 text-sm font-medium text-white hover:bg-[#6d2d57]"
									>
										Refresh Flight
									</button>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Remove Confirmation Modal -->
	{#if showConfirmRemove}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<div class="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
				<h3 class="mb-4 text-xl font-bold text-gray-800">Remove Flight</h3>
				<p class="mb-6 text-gray-600">
					Are you sure you want to remove flight {flightToRemove?.id}? This action cannot be undone.
				</p>
				<div class="flex justify-end space-x-4">
					<button
						on:click={() => (showConfirmRemove = false)}
						class="rounded-full bg-gray-100 px-4 py-2 font-medium text-gray-600 hover:bg-gray-200"
					>
						Cancel
					</button>
					<button
						on:click={removeFlight}
						class="rounded-full bg-red-500 px-4 py-2 font-medium text-white hover:bg-red-600"
					>
						Remove
					</button>
				</div>
			</div>
		</div>
	{/if}

	{#if showStatusDetails && statusPopupPosition}
		<button
			type="button"
			class="fixed inset-0 z-[99]"
			on:click={() => (showStatusDetails = null)}
			aria-label="Close status details"
		></button>
		<div
			class="status-details-popup fixed z-[100] w-64 rounded-lg bg-white p-4 shadow-lg"
			style="position: fixed; left: {statusPopupPosition.x}px; top: {statusPopupPosition.y}px; transform: translate(-50%, 0); pointer-events: auto; will-change: transform; isolation: isolate;"
		>
			<div class="space-y-2">
				<div>
					<p class="text-xs text-gray-500">Actual Departure</p>
					<p class="text-sm font-medium text-gray-900">
						{formatDateTime(showStatusDetails.statusDetails?.actualDeparture || 'Not updated yet')}
					</p>
				</div>
				<div>
					<p class="text-xs text-gray-500">Last Updated</p>
					<p class="text-sm font-medium text-gray-900">
						{formatDateTime(showStatusDetails.statusDetails?.lastUpdated || 'Not updated yet')}
					</p>
				</div>
			</div>
		</div>
	{/if}
</div>
