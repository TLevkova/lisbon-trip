<script lang="ts">
	import { onMount } from 'svelte';
	import type { Stay } from '$lib/types';
	import ExportButton from '$lib/components/ExportButton.svelte';

	interface Traveller {
		name: string;
		email: string;
	}

	interface StayWithCost extends Stay {
		totalCost?: number;
		id: string;
		description: string;
		rating: number;
		cost?: string;
		location: { lat: number; lng: number };
	}

	let stays: StayWithCost[] = [];
	let travellers: Traveller[] = [];

	function splitCost(
		totalCost: number,
		travellers: Traveller[]
	): { name: string; share: number }[] {
		const share = totalCost / travellers.length;
		return travellers.map((traveller) => ({
			name: traveller.name,
			share: share
		}));
	}

	onMount(async () => {
		// Fetch stays data
		const staysResponse = await fetch('/data/stays.json');
		stays = await staysResponse.json();

		// Fetch flights data to get travellers
		const flightsResponse = await fetch('/data/flights.json');
		const flightsData = await flightsResponse.json();
		travellers = flightsData.travellers || [];
	});

	function formatPrice(amount: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'EUR'
		}).format(amount);
	}
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-8 text-3xl font-bold text-gray-900 dark:text-white">Your Stays</h1>

	<div class="grid gap-8">
		{#each stays as stay}
			<div class="overflow-hidden rounded-xl bg-white shadow-lg dark:bg-gray-800">
				<!-- Stay Header -->
				<div class="relative h-64">
					<img
						src={`/images/${stay.image || 'placeholder.jpg'}`}
						alt={stay.name}
						class="h-full w-full object-cover"
						on:error={(e) => {
							const img = e.currentTarget as HTMLImageElement;
							img.setAttribute('src', '/images/placeholder.jpg');
						}}
					/>
					<div
						class="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/60 to-transparent p-6"
					>
						<h2 class="text-2xl font-bold text-white">{stay.name}</h2>
						<p class="text-white/90">{stay.address}</p>
					</div>
				</div>

				<!-- Stay Details -->
				<div class="p-6">
					<div class="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
						<div>
							<p class="text-sm text-gray-500 dark:text-gray-400">Check-in</p>
							<p class="font-medium">{stay.checkIn}</p>
						</div>
						<div>
							<p class="text-sm text-gray-500 dark:text-gray-400">Check-out</p>
							<p class="font-medium">{stay.checkOut}</p>
						</div>
						<div>
							<p class="text-sm text-gray-500 dark:text-gray-400">Rooms</p>
							<p class="font-medium">{stay.rooms.bedrooms} bed, {stay.rooms.bathrooms} bath</p>
						</div>
						<div>
							<p class="text-sm text-gray-500 dark:text-gray-400">Rating</p>
							<p class="font-medium">{stay.rating} ({stay.reviewCount} reviews)</p>
						</div>
					</div>

					<!-- Cost Split -->
					{#if stay.totalCost}
						<div class="mt-6">
							<h3 class="mb-4 text-lg font-semibold">Cost Split</h3>
							<div class="overflow-x-auto">
								<table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
									<thead>
										<tr>
											<th
												class="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
												>Traveller</th
											>
											<th
												class="px-4 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
												>Share</th
											>
										</tr>
									</thead>
									<tbody class="divide-y divide-gray-200 dark:divide-gray-700">
										{#each splitCost(stay.totalCost, travellers) as share}
											<tr>
												<td class="px-4 py-3 text-sm text-gray-900 dark:text-white">{share.name}</td
												>
												<td class="px-4 py-3 text-right text-sm text-gray-900 dark:text-white"
													>{formatPrice(share.share)}</td
												>
											</tr>
										{/each}
										<tr class="bg-gray-50 dark:bg-gray-700/50">
											<td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white"
												>Total</td
											>
											<td
												class="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white"
												>{formatPrice(stay.totalCost)}</td
											>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					{:else}
						<div class="mt-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
							<p class="text-center text-gray-600 dark:text-gray-300">Cost TBD</p>
						</div>
					{/if}
				</div>
			</div>
		{/each}
	</div>

	<div class="mt-10">
		<ExportButton />
	</div>
</div>
