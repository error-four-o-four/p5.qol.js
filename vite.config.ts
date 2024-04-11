import { join } from 'path';

import { defineConfig, type LibraryOptions, type UserConfig } from 'vite';
import { configDefaults } from 'vitest/config';

import { __dirname, onError, onCloseBundle } from './vite.utils.ts';

const name = 'p5QoL';
const entry = join(__dirname, 'src/index.ts');
const outDir = join(__dirname, 'lib');
const publicDir = join(__dirname, 'dev/public');
// const cacheDir = join(__dirname, 'node_modules/.vite/core'),

// ### Build Library ###

const getBuildConfig = (): UserConfig => {
	const formats: LibraryOptions['formats'] = ['es', 'iife'];
	const fileName: LibraryOptions['fileName'] = (format) =>
		format === 'iife' ? 'p5.qol.min.js' : 'p5.qol.js';

	return {
		build: {
			target: 'esnext',
			outDir,
			lib: {
				entry,
				formats,
				name,
				fileName,
			},
			minify: 'esbuild',
			emptyOutDir: true,
			// sourcemap: true,
		},
		optimizeDeps: {
			include: [],
		},
		// copy files to public dev folder
		plugins: [onError(), onCloseBundle(entry, outDir, publicDir)],
	};
};

// ### Launch ViteDevServer ###

const getMPAConfig = (): UserConfig => {
	// run vite dev server
	// with multiple entry points

	const entries = ['global', 'instance', 'template'];
	const input = {
		main: join(__dirname, 'dev/index.html'),
		...entries
			.map((page) => [page, join(__dirname, `dev/${page}/index.html`)])
			.reduce((all, [key, val]) => Object.assign(all, { [key]: val }), {}),
	};

	const root = join(__dirname, 'dev');

	return {
		root,
		publicDir,
		plugins: [onError()],
		build: {
			rollupOptions: {
				input,
			},
		},
	};
};

const getTestConfig = (): UserConfig => {
	// setup vitest-canvas-mock
	// https://github.com/wobsoriano/vitest-canvas-mock?tab=readme-ov-file#usage
	const root = join(__dirname, 'test');

	return {
		test: {
			root,
			include: ['./unit/**/*.{test,spec}.ts'],
			exclude: [...configDefaults.exclude],
			setupFiles: './vitest.canvas.ts',
			globalSetup: './vitest.setup.ts',
			environment: 'jsdom',
			deps: {
				optimizer: {
					web: {
						include: ['vitest-canvas-mock', 'p5'],
					},
				},
			},
			poolOptions: {
				threads: {
					singleThread: true,
				},
			},
			// environmentOptions: {
			// 	jsdom: {
			// 		resources: 'usable',
			// 	},
			// },
		},
	};
};

const getDevConfig = (): UserConfig => {
	return {
		...getMPAConfig(),
		...getTestConfig(),
	};
};

export default defineConfig((config) =>
	config.mode !== 'production' ? getDevConfig() : getBuildConfig()
);
