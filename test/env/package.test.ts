import { it, expect } from 'vitest';
import p5 from 'p5';

import initialize from '../../src/index.ts';
import { libraryName } from '../../src/config.ts';

it('Should provide a default export', () => {
	expect(typeof initialize === 'function').toBe(true);
});

it('Initialization should extend p5.prototype', () => {
	expect(p5.prototype).not.toHaveProperty(libraryName);
	initialize(p5);
	expect(p5.prototype).toHaveProperty(libraryName);
});

// suite('Compiler or Bundler environment', () => {
// });
