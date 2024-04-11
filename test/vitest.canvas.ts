import 'vitest-canvas-mock';

import { inject, vi } from 'vitest';

// https://github.com/jsdom/jsdom
import { JSDOM, VirtualConsole, type BaseOptions } from 'jsdom';

// stub for vitest-canvas-mock
vi.stubGlobal('jest', vi);

// get the url of the ViteDevServer
const url = inject('url');

const options: BaseOptions = {
	pretendToBeVisual: true,
	resources: 'usable',
	runScripts: 'dangerously',
	includeNodeLocations: true,
};

// use a bare template with no p5 instance
const dom = await JSDOM.fromURL(url + 'template/', options);

export { dom };
