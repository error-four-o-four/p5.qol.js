import { join, sep } from 'node:path';
import { statSync, readdirSync, copyFileSync } from 'node:fs';

import { defineConfig, type LibraryOptions, type PluginOption } from 'vite';
import { build } from 'tsup';

import { __dirname, onError } from './vite.utils.ts';

const name = 'p5QoL';
const entry = join(__dirname, 'src/index.ts');
const outDir = join(__dirname, 'lib');
const publicDir = join(__dirname, 'dev/public');

// ### Build Library ###
const formats: LibraryOptions['formats'] = ['es', 'iife'];
const fileName: LibraryOptions['fileName'] = (format) =>
	format === 'iife' ? 'p5.qol.min.js' : 'p5.qol.js';

const onCloseBundle = (
	entry: string,
	outDir: string,
	publicDir: string
): PluginOption => ({
	name: 'close-bundle',
	closeBundle: async () => {
		const input = entry.replace(__dirname, '').split(sep).slice(1).join('/');

		console.log('\nBuild Declarations');
		await build({
			entry: [input],
			clean: false,
			format: ['esm'],
			outDir,
			dts: { only: true },
		});

		console.log('\nCopying files to public dir');
		readdirSync(outDir).forEach((item) => {
			const src = join(outDir, item);

			if (statSync(src).isFile()) {
				copyFileSync(src, join(publicDir, item));
			}
		});

		console.log('✅ Done');
	},
});

export default defineConfig({
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
});
