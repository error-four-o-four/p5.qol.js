import { join } from 'node:path';
import { defineConfig } from 'vite';

import { __dirname, onError } from './vite.utils.ts';

// ### MAP Setup ###

const root = join(__dirname, 'dev');
const publicDir = join(root, 'public');

const entries = ['global', 'instance'];
const input = {
	main: join(__dirname, 'dev/index.html'),
	...entries
		.map((page) => [page, join(root, page, 'index.html')])
		.reduce((all, [key, val]) => Object.assign(all, { [key]: val }), {}),
};

export default defineConfig({
	root,
	publicDir,
	plugins: [onError()],
	build: {
		rollupOptions: {
			input,
		},
	},
});
