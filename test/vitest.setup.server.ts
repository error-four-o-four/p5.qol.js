import { createServer, type ViteDevServer } from 'vite';
import viteConfig from '../vite.config.ts';

let server: ViteDevServer | undefined;

// @TODO !!!!
// Binding element 'provide' implicitly has an 'any' type.ts(7031)
// @ts-ignore
export async function setup({ provide }) {
	server = await createServer(viteConfig);

	await server.listen();

	const url = server.resolvedUrls?.local[0] || 'http://localhost:5173';
	// console.log('ViteDevServer is listening on:', url);

	provide('url', url);
}

export async function teardown() {
	server && (await server.close());
	server = undefined;
}

declare module 'vitest' {
	export interface ProvidedContext {
		url: string;
	}
}
