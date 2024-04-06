import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vite';
import { build } from 'tsup';

const file = fileURLToPath(import.meta.url);
const dir = dirname(file);

const onError = () => ({
	name: 'handleError',
	buildEnd: (error?: Error) => {
		if (error) {
			console.error(error);
			throw new Error('❌ Failed');
		}
	},
});

const tsup = () => ({
	name: 'buildDeclarations',
	closeBundle: async () => {
		await build({
			entry: ['src/index.ts'],
			clean: false,
			format: ['esm'],
			outDir: 'lib',
			dts: { only: true },
		});
	},
});

export default defineConfig({
	// cacheDir: resolve(dir, '../../node_modules/.vite/core'),
	build: {
		// sourcemap: true,
		emptyOutDir: true,
		target: 'esnext',
		outDir: 'lib',
		lib: {
			entry: resolve(dir, 'src/index.ts'),
			formats: ['es', 'iife'],
			name: 'p5QoL',
			fileName: (format) => (format === 'iife' ? 'p5.qol.min.js' : 'p5.qol.js'),
		},
		minify: 'esbuild',
	},
	optimizeDeps: {
		include: [],
	},
	plugins: [onError(), tsup()],
});
