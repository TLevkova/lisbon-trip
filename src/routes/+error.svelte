<script context="module">
	// In +error.svelte, load receives { error, status } directly
	export function load({ error, status }: { error: Error; status: number }) {
		return { error, status };
	}
</script>

<script lang="ts">
	export let error: Error;
	export let status: number;
</script>

<section class="relative h-[100dvh] w-full overflow-hidden bg-gray-50 dark:bg-gray-900">
	<h1 class="mb-4 text-5xl font-extrabold text-gray-800 dark:text-gray-100">
		{status}
	</h1>
	<p class="mb-6 text-lg text-gray-600 dark:text-gray-300">
		{error?.message ?? 'Something went wrong.'}
	</p>
	<a href="/" class="rounded bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700">
		Go back home
	</a>
</section>
