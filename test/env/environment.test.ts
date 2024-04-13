import { inject, describe, it, expect } from 'vitest';
import { JSDOM, type BaseOptions } from 'jsdom';

import { libraryName } from '../../src/config.ts';

// get the url from the ViteDevServer
const url = inject('url');

const options: BaseOptions = {
	resources: 'usable',
	runScripts: 'dangerously',
	pretendToBeVisual: true,
	includeNodeLocations: true,
};

const domGlobalMode = await JSDOM.fromURL(url + 'global/', options);
const domInstanceMode = await JSDOM.fromURL(url + 'instance/', options);

// expect(window).toBeUndefined();

describe('Browser environment', () => {
	it('should be initialized automatically', () => {
		expect(domGlobalMode.window).toHaveProperty('p5');
		expect(domGlobalMode.window).toHaveProperty('p5QoL');
		expect(domGlobalMode.window.p5.prototype).toHaveProperty(libraryName);
	});

	it('should work in global mode', () => {
		expect(domGlobalMode.window).toHaveProperty(libraryName);
		expect(domGlobalMode.window.p5.instance).toHaveProperty(libraryName);
	});

	it('should work in instance mode', () => {
		expect(domInstanceMode.window).toHaveProperty('instance');
		expect(domInstanceMode.window.instance).toHaveProperty(libraryName);
	});
});
