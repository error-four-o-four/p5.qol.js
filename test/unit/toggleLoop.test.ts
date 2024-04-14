import { beforeAll, expect, it, suite, vi } from 'vitest';

import { sleep } from './helpers.ts';

beforeAll(() => {
	pInst.noCanvas();
	pInst.draw = function () {};
});

suite('The method `toggleLoop`', () => {
	it('should start looping a sketch', async () => {
		// get initial values
		pInst.noLoop();
		await sleep(200);

		const spy = vi.spyOn(pInst, 'draw');
		let frameCount = pInst.frameCount;

		expect(pInst.isLooping()).toBe(false);
		expect(spy).not.toHaveBeenCalled();
		expect(spy.mock.calls.length).toEqual(pInst.frameCount);

		// call the method and let it loop
		pInst.toggleLoop();
		await sleep(200);

		expect(pInst.isLooping()).toBe(true);
		expect(spy).toHaveBeenCalled();
		expect(spy.mock.calls.length).approximately(pInst.frameCount, 1);
	});

	it('should stop looping a sketch', async () => {
		// get initial values
		pInst.loop();
		const spy = vi.spyOn(pInst, 'draw');

		await sleep(200);
		expect(pInst.isLooping()).toBe(true);
		expect(spy).toHaveBeenCalled();

		pInst.toggleLoop();
		await sleep(200);

		const expectedCalls = spy.mock.calls.length;
		await sleep(200);

		expect(pInst.isLooping()).toBe(false);
		expect(spy).toHaveBeenCalledTimes(expectedCalls);
	});

	// @TODO
	// 'should be handled automatically on resize events' ...
});
