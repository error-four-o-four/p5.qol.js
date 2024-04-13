import { describe, expect, it, suite } from 'vitest';

import { libraryName } from '../../src/config.ts';
import { assertNotNull } from '../../src/utils.ts';

suite('The method `createCanvas` is extended', () => {
	it('`createCanvas(200, P2D);` should create a canvas with equal dimensions', () => {
		const size = 200;
		const renderer = pInst.P2D;

		pInst.createCanvas(size, renderer);
		expect(pInst.width).toEqual(size);
		expect(pInst.height).toEqual(size);
	});

	it('`createCanvas(200, WEBGL);` should use the specified renderer', () => {
		const size = 200;
		const renderer = pInst.WEBGL;
		expect(() => pInst.createCanvas(size, renderer)).toThrowError(
			/Error creating webgl context/
		);
	});

	describe('Should accept an object as an argument', () => {
		// it('any', () => {
		// 	expect(true).toBe(true);
		// });

		describe('The property `type` should be handled correctly', () => {
			it("`createCanvas({ type: 'window' })`", () => {
				const type = 'window';
				pInst.createCanvas({ type });

				const { width, height, windowWidth, windowHeight } = pInst;

				expect(width).toEqual(windowWidth);
				expect(height).toEqual(windowHeight);
				expect(pInst[libraryName].type).toBe(type);
			});

			it("`createCanvas({ type: 'square' })`", () => {
				const type = 'square';
				pInst.createCanvas({ type });

				const { width, height, windowWidth, windowHeight } = pInst;
				const expected = Math.min(windowWidth, windowHeight);

				expect(width).toEqual(expected);
				expect(width).toEqual(height);
				expect(pInst[libraryName].type).toBe(type);
			});

			it("`createCanvas({ type: 'fill' })`", () => {
				const parent = pInst.canvas.parentElement;
				const main = window.document.querySelector('main');

				expect(parent).not.toBeNull();
				expect(main).not.toBeNull();
				expect(parent).toEqual(main);

				assertNotNull(parent);
				assertNotNull(main);

				const eltWidth = 320;
				const eltHeight = 240;

				main.style.width = `${eltWidth}px`;
				main.style.height = `${eltHeight}px`;

				const type = 'fill';
				pInst.createCanvas({ type });

				const { width, height } = pInst;

				expect(width).toEqual(eltWidth);
				expect(height).toEqual(eltHeight);
				expect(pInst[libraryName].type).toBe(type);
			});
		});

		describe('The property `margin` should be handled correctly', () => {
			it("`createCanvas({ type: 'window', margin: 0.1 })`", () => {
				const type = 'window';
				pInst.createCanvas({ type, margin: 0.1 });

				const { width, height, windowWidth, windowHeight } = pInst;

				expect(width).toEqual(0.9 * windowWidth);
				expect(height).toEqual(0.9 * windowHeight);
				expect(pInst[libraryName].type).toBe(type);
			});

			it("`createCanvas({ type: 'fill', margin: 0.1 })`", () => {
				const main = window.document.querySelector('main');

				expect(main).not.toBeNull();
				assertNotNull(main);

				const eltWidth = 320;
				const eltHeight = 240;

				main.style.width = `${eltWidth}px`;
				main.style.height = `${eltHeight}px`;

				const type = 'fill';
				pInst.createCanvas({ type, margin: 0.1 });

				const { width, height } = pInst;

				expect(width).toEqual(0.9 * eltWidth);
				expect(height).toEqual(0.9 * eltHeight);
				expect(pInst[libraryName].type).toBe(type);
			});
		});
	});
});
