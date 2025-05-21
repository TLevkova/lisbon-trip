import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: [vitePreprocess(), mdsvex()],
	kit: {
		adapter: adapter(),
		serviceWorker: {
			register: process.env.NODE_ENV === 'production'
		}
	},
	extensions: ['.svelte', '.svx']
};

export default config;
