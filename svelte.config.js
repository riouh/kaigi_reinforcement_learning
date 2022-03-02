import adapter_node from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';
import autoprefixer from 'autoprefixer';
import {configureServer} from "./src/lib/server.js";

const adapter = adapter_node();

const prep = preprocess({
	scss: {
		includePaths: ['static']
	},
	postcss: {
		plugins: [autoprefixer()]
	}
});

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: prep,

	kit: {
		adapter,

		// Override http methods in the Todo forms
		methodOverride: {
			allowed: ['PATCH', 'DELETE']
		},
		vite: {
			plugins: [
				{
                    name: 'custom-ws-server',
                    configureServer: configureServer
                }
			]
		}
	}
};

export default config;
