import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

import { PluginOption } from 'vite';
import { UserConfig } from 'vitest';

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

// Vitest

// https://vitest.dev/config/#onconsolelog
export const onConsoleLog = (
	log: string,
	type: 'stdout' | 'stderr'
): false | void => {
	if (log.startsWith('p5.') && type === 'stdout') return false;
};

export const commonConfig: UserConfig = {
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
};
