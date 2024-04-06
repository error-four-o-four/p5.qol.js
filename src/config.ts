import type { P5, P5QoL, P5QoLProps } from './types.ts';

import { centerOriginPrivateDefaults } from './addons/centerOrigin.ts';
import { createCanvasPrivateDefaults } from './overwrites/createCanvas.ts';
import { windowResizedPrivateDefaults } from './overwrites/windowResized.ts';

export const libraryName = '_QoLConfig';

export const defaults: P5QoLProps = {
	...centerOriginPrivateDefaults,
	...createCanvasPrivateDefaults,
	...windowResizedPrivateDefaults,
};

export default function addPrivateConfigs(p5: P5) {
	p5.prototype[libraryName] = { ...defaults };
}

export function setPrivateProperty<
	T extends P5QoLProps,
	K extends keyof P5QoLProps
>(this: P5QoL, key: K, value: T[K]) {
	const prop = this[libraryName][key];
	const typeOfProp = typeof prop;
	const typeOfValue = typeof value;

	if (typeOfProp !== typeOfValue) {
		console.log(
			`Wrong argument for ${key}.\nExpected typeof ${typeOfProp} but received ${typeOfValue}:${value}`
		);
		return;
	}

	this[libraryName][key] = value;
}

export function getPrivateProperty<V extends P5QoLProps[keyof P5QoLProps]>(
	this: P5QoL,
	key: keyof P5QoLProps
) {
	let value = this[libraryName][key];

	if (value === null || value === undefined) {
		console.log(`Something went wrong.\nPrivate property ${key} is ${value}.`);
		value = defaults[key];
	}

	return value as V;
}
