import { describe, it, expect, assert } from 'vitest';

import type { P5QoL, P5QoLProps } from '../../src/types.ts';

import { libraryName } from '../../src/config.ts';
import { centerOriginPrivateDefaults } from '../../src/addons/centerOrigin.ts';
import { createCanvasPrivateDefaults } from '../../src/overwrites/createCanvas.ts';
import { windowResizedPrivateDefaults } from '../../src/overwrites/windowResized.ts';

const dimension = 200;

const privateDefaults: P5QoLProps = {
	...centerOriginPrivateDefaults,
	...createCanvasPrivateDefaults,
	...windowResizedPrivateDefaults,
} as const;

const privateKeys = Object.keys(privateDefaults) as (keyof P5QoLProps)[];

describe('The package provides new p5 methods and properties', () => {
	it('Should add a single private properties object', () => {
		expect(pInst).toHaveProperty(libraryName);
	});

	describe('The private properties object should have ...', () => {
		privateKeys.forEach((key) => {
			const expectedValue = privateDefaults[key];
			it(`'${key}' set to [${typeof expectedValue} : ${expectedValue}]`, () => {
				const actualValue = pInst[libraryName][key];

				expect(pInst[libraryName]).toHaveProperty(key);
				expect(pInst[libraryName][key]).not.toBe(null);
				expect(typeof expectedValue === typeof actualValue).toBe(true);
			});
		});
	});

	describe('Adds public properties', () => {
		const props: (keyof Partial<P5QoL>)[] = [
			'resizeRatio',
			'resizeRatioX',
			'resizeRatioY',
			'windowResizeRatioX',
			'windowResizeRatioY',
		];

		props.forEach((key) => {
			const expectedValue = 1;
			it(`Should set '${key}' to [${typeof expectedValue} : ${expectedValue}]`, () => {
				const actualValue = pInst[key];

				expect(pInst).toHaveProperty(key);
				expect(pInst[key]).not.toBe(null);
				expect(typeof expectedValue === typeof actualValue).toBe(true);
				expect(actualValue).toBeCloseTo(expectedValue, 0.1);
			});
		});

		const canvas = window.document.querySelector('canvas');
		expect(canvas).not.toBeNull();
		assert(canvas, 'Canvas should exist!');

		const expectedValue = 0.5 * dimension;
		let key: keyof P5QoL = 'widthHalf';

		it(`Should set '${key}' to [${typeof expectedValue} : ${expectedValue}]`, () => {
			const actualValue = pInst[key];

			expect(pInst).toHaveProperty(key);
			expect(pInst[key]).not.toBe(null);
			expect(typeof expectedValue === typeof actualValue).toBe(true);
			expect(actualValue).toBeCloseTo(expectedValue, 1);
		});

		key = 'heightHalf';

		it(`Should set '${key}' to [${typeof expectedValue} : ${expectedValue}]`, () => {
			const actualValue = pInst[key];

			expect(pInst).toHaveProperty(key);
			expect(pInst[key]).not.toBe(null);
			expect(typeof expectedValue === typeof actualValue).toBe(true);
			expect(actualValue).toBeCloseTo(expectedValue, 1);
		});
	});

	describe('Adds public methods', () => {
		const methods: (keyof Partial<P5QoL>)[] = [
			'centerOrigin',
			'toggleFullscreen',
			'toggleLoop',
		];

		methods.forEach((key) => {
			it(`Should have '${key}'`, () => {
				expect(pInst).toHaveProperty(key);
				expect(pInst[key]).toBeTypeOf('function');
			});
		});
	});
});
