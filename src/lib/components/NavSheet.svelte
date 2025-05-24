<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { goto } from '$app/navigation';

	export let isOpen = false; // parent controls this
	const dispatch = createEventDispatcher();

	let sheet: HTMLDivElement;

	// Touch-drag to dismiss
	let startY = 0;
	let currentY = 0;
	let startX = 0;
	let currentX = 0;
	let activeLink: HTMLAnchorElement | null = null;
	let isNavigating = false;

	const links = [
		{ href: '/', text: 'Home' },
		{ href: '/flights', text: 'Flights' },
		{ href: '/stays', text: 'Stays' },
		{ href: '/explore', text: 'Explore' },
		{ href: '/moves', text: 'Moves' },
		{ href: '/local-flavours', text: 'Local Flavours' }
	];

	async function navigateTo(href: string) {
		if (isNavigating) return;
		isNavigating = true;
		dispatch('close');
		await goto(href);
		isNavigating = false;
	}

	function handleTouchStart(e: TouchEvent) {
		if (isNavigating) return;
		startY = e.touches[0].clientY;
		startX = e.touches[0].clientX;
		// Find the closest navigation link
		const touchX = e.touches[0].clientX;
		const touchY = e.touches[0].clientY;
		const linkElements = sheet.querySelectorAll('a');
		let closestLink: HTMLAnchorElement | null = null;
		let minDistance = Infinity;

		linkElements.forEach((link) => {
			const rect = link.getBoundingClientRect();
			const centerX = rect.left + rect.width / 2;
			const centerY = rect.top + rect.height / 2;
			const distance = Math.sqrt(
				Math.pow(touchX - centerX, 2) + Math.pow(touchY - centerY, 2)
			);
			if (distance < minDistance) {
				minDistance = distance;
				closestLink = link;
			}
		});

		activeLink = closestLink;
	}

	function handleTouchMove(e: TouchEvent) {
		if (!isOpen || isNavigating) return;
		currentY = e.touches[0].clientY - startY;
		currentX = e.touches[0].clientX - startX;

		// Handle vertical swipe for dismissing
		if (Math.abs(currentY) > Math.abs(currentX)) {
			if (currentY > 0) {
				sheet.style.transform = `translateY(${currentY}px)`;
			}
		}
		// Handle horizontal swipe for navigation
		else if (activeLink && Math.abs(currentX) > 50) {
			const href = activeLink.getAttribute('href');
			if (href) {
				const currentIndex = links.findIndex(link => link.href === href);
				const direction = currentX > 0 ? 'next' : 'prev';
				const targetIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
				
				if (targetIndex >= 0 && targetIndex < links.length) {
					navigateTo(links[targetIndex].href);
				}
			}
		}
	}

	function handleTouchEnd() {
		if (currentY > 100) dispatch('close');
		sheet.style.transform = '';
		currentY = 0;
		currentX = 0;
		activeLink = null;
	}
</script>

<!-- Slide-up sheet -->
<div
  bind:this={sheet}
  class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-2xl shadow-xl transition-transform duration-300 pointer-events-auto z-50"
  class:translate-y-0={isOpen}
  class:translate-y-full={!isOpen}
  on:touchstart|passive={handleTouchStart}
  on:touchmove|passive={handleTouchMove}
  on:touchend|passive={handleTouchEnd}
>
	<div class="mx-auto my-4 h-1 w-12 rounded-full bg-gray-300 dark:bg-gray-600"></div>
	<slot />
</div>
