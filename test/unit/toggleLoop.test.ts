import { beforeAll, expect, it, suite } from 'vitest';

beforeAll(() => {
	expect(pInst).not.toBeNull();
	pInst.noCanvas();
	pInst.loop();
});

suite('The method `toggleLoop` is extended', () => {
	it('should alter the private property `_loop`', () => {
		expect(pInst._loop).toBe(true);
		pInst.toggleLoop();
		expect(pInst._loop).toBe(false);
		pInst.toggleLoop();
		expect(pInst._loop).toBe(true);
	});

	// @TODO
	// 'draw should have been called x times' ...
});
