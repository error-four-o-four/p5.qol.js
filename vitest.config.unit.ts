import { join } from 'node:path';

import { configDefaults, defineConfig } from 'vitest/config';

import { commonConfig, onConsoleLog } from './vite.utils.ts';

const root = join(__dirname, 'test', 'unit');

export default defineConfig({
	test: {
		root,
		// include: ['./**/createCanvas.{test,spec}.ts'],
		// include: ['./**/extensions.{test,spec}.ts'],
		include: ['./**/*.{test,spec}.ts'],
		exclude: [...configDefaults.exclude],

		// setup vitest-canvas-mock
		// https://github.com/wobsoriano/vitest-canvas-mock?tab=readme-ov-file#usage
		setupFiles: ['../vitest.mock.canvas.ts', '../vitest.stub.instance.ts'],
		environment: 'jsdom',
		environmentOptions: {
			jsdom: {
				resources: 'usable',
				pretendToBeVisual: true,
			},
		},
		...commonConfig,
		onConsoleLog,
	},
});
