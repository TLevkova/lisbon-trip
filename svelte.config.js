import { mdsvex } from 'mdsvex';
import vercel from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: [vitePreprocess(), mdsvex()],
	kit: {
		adapter: vercel(),
		serviceWorker: {
			register: process.env.NODE_ENV === 'production'
		}
	},
	extensions: ['.svelte', '.svx']
};

export default config;
