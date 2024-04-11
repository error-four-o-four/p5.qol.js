import { fileURLToPath } from 'node:url';
import { dirname, join, sep } from 'node:path';
import { statSync, readdirSync, copyFileSync } from 'node:fs';

import { PluginOption } from 'vite';
import { build } from 'tsup';

export const __dirname = dirname(fileURLToPath(import.meta.url));

export const onError = (): PluginOption => ({
	name: 'handle-error',
	buildEnd: (error?: Error) => {
		if (error) {
			console.error(error);
			throw new Error('❌ Failed');
		}
	},
});

export const onCloseBundle = (
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

		console.log('\nCopy files to public dir');
		readdirSync(outDir).forEach((item) => {
			const src = join(outDir, item);

			if (statSync(src).isFile()) {
				copyFileSync(src, join(publicDir, item));
			}
		});

		console.log('✅ Done');
	},
});
