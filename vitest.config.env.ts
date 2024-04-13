import { join } from 'node:path';

import { configDefaults, defineConfig } from 'vitest/config';

import { commonConfig, onConsoleLog } from './vite.utils.ts';

const root = join(__dirname, 'test', 'env');

export default defineConfig({
	test: {
		root,
		// include: ['./**/createCanvas.{test,spec}.ts'],
		// include: ['./**/extensions.{test,spec}.ts'],
		include: ['./**/*.{test,spec}.ts'],
		exclude: [...configDefaults.exclude],

		// launch vite dev server
		// to create jsdom windows
		globalSetup: '../vitest.setup.server.ts',

		// setup vitest-canvas-mock
		// https://github.com/wobsoriano/vitest-canvas-mock?tab=readme-ov-file#usage
		setupFiles: '../vitest.mock.canvas.ts',
		environment: 'jsdom',
		...commonConfig,
		onConsoleLog,
	},
});
