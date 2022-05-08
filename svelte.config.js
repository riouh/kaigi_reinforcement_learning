import adapter_node from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';
import autoprefixer from 'autoprefixer';

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
		// vite: {
		// 	plugins: [
		// 		{
        //             name: 'custom-ws-server',
        //             configureServer: configureServer
        //         }
		// 	]
		// }
	}
};

export default config;
