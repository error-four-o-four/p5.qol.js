import { beforeAll, expect, it, suite, vi } from 'vitest';

import { expectProperty, simulateResizeEvent, sleep } from './helpers.ts';
import { libraryName } from '../../src/config.ts';
import { type P5QoL } from '../../src/types.ts';

beforeAll(() => {
	pInst.noCanvas();
	pInst.noLoop();
	pInst.windowResizeTriggered = function () {};
	pInst.windowResizeFinished = function () {};
});

suite('The package extends the behaviour of window resize events', () => {
	const delay = pInst[libraryName].resizeDelay;

	it('Should set `windowResizeRatioX` and `windowResizeRatioY` by default to `1`', () => {
		const props: (keyof P5QoL)[] = ['windowResizeRatioX', 'windowResizeRatioY'];
		const expectedValue = 1;

		props.forEach((key) => {
			const actualValue = expectProperty(pInst, key, expectedValue);
			expect(actualValue).toBeCloseTo(expectedValue, 0.1);
		});
	});

	it('Should update the corresponding properties accordingly', async () => {
		const delta = 1.5;
		const { innerWidth, innerHeight } = window;

		window.resizeTo(delta * innerWidth, delta * innerHeight);
		await sleep(1.5 * delay);

		expect(pInst.windowResizeRatioX).toEqual(delta);
		expect(pInst.windowResizeRatioY).toEqual(delta);
	});

	it('`windowResizeTriggered` and `windowResizeFinished` should be called only once', async () => {
		const spyTriggered = vi.spyOn(pInst, 'windowResizeTriggered');
		const spyFinished = vi.spyOn(pInst, 'windowResizeFinished');

		expect(spyTriggered).not.toHaveBeenCalled();
		expect(spyFinished).not.toHaveBeenCalled();
		await simulateResizeEvent(
			1.5 * window.innerWidth,
			1.5 * window.innerHeight,
			500
		);

		expect(spyFinished).not.toHaveBeenCalled();
		await sleep(1.5 * delay);

		expect(spyFinished).toHaveBeenCalledOnce();
		expect(spyTriggered).toHaveBeenCalledOnce();
	});
});
