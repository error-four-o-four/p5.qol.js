import { describe, expect, it, suite, vi } from 'vitest';

import { libraryName } from '../../src/config.ts';
import { type P5QoL } from '../../src/types.ts';
import { expectProperty, sleep } from './helpers.ts';

suite('The method `resizeCanvas`', () => {
	const delay = pInst[libraryName].resizeDelay;

	it('Should update `width`, `height`, `widthHalf` and `heightHalf`', () => {
		const width = 200;
		const height = 200;
		const delta = 1.5;

		const expectedValues = <{ [K in keyof P5QoL]: P5QoL[K] }>{
			width: delta * width,
			height: delta * height,
			widthHalf: 0.5 * delta * width,
			heightHalf: 0.5 * delta * height,
		};

		pInst.createCanvas(width, height);
		pInst.resizeCanvas(delta * width, delta * height);

		const keys = <[keyof P5QoL]>Object.keys(expectedValues);
		keys.forEach((key) => {
			const expectedValue = expectedValues[key];
			const actualValue = expectProperty(pInst, key, expectedValue);
			expect(actualValue).toBeCloseTo(expectedValue, 1);
		});
	});

	describe('`resizeCanvas` is an optional parameter of `createCanvas`', () => {
		it('Should _not_ be called when the option is _not_ enabled', () => {
			pInst.createCanvas(250, 250);

			const spy = vi.spyOn(pInst, 'resizeCanvas');
			const { width, height } = pInst;

			window.resizeTo(500, 500);
			sleep(1.5 * delay);

			expect(pInst.width).toEqual(width);
			expect(pInst.height).toEqual(height);
			expect(spy).not.toHaveBeenCalled();
		});

		it('Should be called _once_ after a resize event when the options is enabled', async () => {
			pInst.createCanvas({ type: 'window', resizeCanvas: true });

			const spy = vi.spyOn(pInst, 'resizeCanvas');
			expect(spy).not.toHaveBeenCalled();
			expect(pInst[libraryName].resizeCanvas).toBe(true);

			window.resizeTo(100, 100);

			expect(spy).not.toHaveBeenCalled();
			await sleep(1.5 * delay);

			expect(spy).toHaveBeenCalledOnce();
		});
		// it('Should update `width`, `height`, `widthHalf` and `heightHalf` after a resize event was dispatched', () => {});
	});
});
