<script lang="ts">
	import { browser } from '$app/environment';
	import MapView from '$lib/components/MapView.svelte';
	import { exploreLocations } from '$lib/data/explore';
</script>

<!-- Hero fills the screen, no scroll -->
<section class="relative h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-900">
	<!-- Background image via CSS so it always covers -->
	<div class="absolute inset-0 bg-[url('/images/landing-bg.png')] bg-cover bg-center"></div>

	<!-- Dark overlay -->
	<div class="absolute inset-0 bg-black/40"></div>

	<!-- Text content -->
	<div class="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
		<h1 class="text-3xl font-bold text-white sm:text-5xl">Lisbon Trip Planner</h1>
		<p class="mt-2 text-lg text-white/80">Discover the best of Lisbon, on any device.</p>
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
				<p class="text-gray-600">Discover the best places to eat, drink, and explore.</p>
			</div>
		</div>
	</div>
</section>

<!-- (Other page content, e.g. MapView, goes below) -->
