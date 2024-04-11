import { type ViteDevServer, createServer } from 'vite';
import {} from 'vitest';
import viteConfig from '../vite.config.ts';

let server: ViteDevServer;

// @TODO !!!!
// Binding element 'provide' implicitly has an 'any' type.ts(7031)
// @ts-ignore
export async function setup({ provide }) {
	server = await createServer(
		viteConfig({
			mode: 'test',
			command: 'serve',
			isSsrBuild: false,
			isPreview: false,
		})
	);

	await server.listen();

	const url = server.resolvedUrls?.local[0] || 'http://localhost:5173';
	console.log('ViteDevServer is listening on:', url);

	provide('url', url);
}

export async function teardown() {
	server && (await server.close());
}

declare module 'vitest' {
	export interface ProvidedContext {
		url: string;
	}
}
