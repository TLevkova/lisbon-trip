import { writable } from 'svelte/store';

/** `true` ⇢ nav-sheet is open.  
 *  Lives outside any component so it survives SvelteKit
 *  layout re-initialisation when you navigate. */
export const navOpen = writable(false);
