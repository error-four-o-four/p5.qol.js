import type { P5, P5QoL, AnyRecord, RENDERER } from './types.ts';

// //////////////// Common

export function assertNotNull(
	value: unknown
): asserts value is NonNullable<typeof value> {
	if (value === null) throw new Error('Expected NonNullable');
}

export function debounce(fn: (...args: any[]) => unknown, ms = 300) {
	let timeout: ReturnType<typeof setTimeout>;
	return function wait(this: any, ...args: any[]) {
		clearTimeout(timeout);
		timeout = setTimeout(() => fn.apply(this, args), ms);
	};
}

export function isNumber(val: any): val is number {
	return typeof val === 'number' && val === val;
}

export function isString<T = any>(str: string | T): str is string {
	return typeof str === 'string';
}

export function isRenderer(val: unknown): val is RENDERER {
	return isString(val) && ['p2d', 'webgl'].includes(val);
}

export function isCanvas(val: unknown): val is object {
	return typeof val === 'object' && val === val;
}

// //////////////// Specific

export function extendPrototype<T extends AnyRecord>(p5: P5, input: T) {
	Object.keys(input).forEach((key) => {
		// ~~Element implicitly has an 'any' type
		// because expression of type 'string' can't be used
		// to index type 'import("@types/p5/index.d.ts")'.~~

		// @todo
		// Cannot assign to 'ADD' because it is a read-only property.
		// @ts-ignore
		p5.prototype[key as keyof P5QoL] = input[key];
	});
}

export function getContext<T extends P5QoL>(instance: T) {
	return instance._isGlobal
		? (window as Window & typeof globalThis & T)
		: (instance as T);
}

/**
 * https://github.com/processing/p5.js/blob/3754ce63deab32842fd81c393c62ff9e388f8637/src/core/main.js#L343
 * P5 creates a default canvas before calling the setup function which will be replaced.
 * `getParentDimensions` is called by `createCanvas`
 */
export function getParentDimensions(p5: P5QoL) {
	// `noCanvas` just adds a `hidden` property to the defaultCanvas
	assertNotNull(p5.canvas);
	assertNotNull(p5.canvas.parentElement);
	return [
		p5.canvas.parentElement.clientWidth,
		p5.canvas.parentElement.clientHeight,
	];
}

function getWindowWidth() {
	return (
		window.innerWidth ||
		(document.documentElement && document.documentElement.clientWidth) ||
		(document.body && document.body.clientWidth) ||
		0
	);
}

function getWindowHeight() {
	return (
		window.innerHeight ||
		(document.documentElement && document.documentElement.clientHeight) ||
		(document.body && document.body.clientHeight) ||
		0
	);
}

export function getWindowDimensions() {
	return [getWindowWidth(), getWindowHeight()];
}

const constants = [
	'VERSION',
	'P2D',
	'WEBGL',
	'WEBGL2',
	'ARROW',
	'CROSS',
	'HAND',
	'MOVE',
	'TEXT',
	'WAIT',
	'HALF_PI',
	'PI',
	'QUARTER_PI',
	'TAU',
	'TWO_PI',
	'DEGREES',
	'RADIANS',
	'CORNER',
	'CORNERS',
	'RADIUS',
	'RIGHT',
	'LEFT',
	'CENTER',
	'TOP',
	'BOTTOM',
	'BASELINE',
	'POINTS',
	'LINES',
	'LINE_STRIP',
	'LINE_LOOP',
	'TRIANGLES',
	'TRIANGLE_FAN',
	'TRIANGLE_STRIP',
	'QUADS',
	'QUAD_STRIP',
	'TESS',
	'CLOSE',
	'OPEN',
	'CHORD',
	'PIE',
	'PROJECT',
	'SQUARE',
	'ROUND',
	'BEVEL',
	'MITER',
	'RGB',
	'HSB',
	'HSL',
	'AUTO',
	'ALT',
	'BACKSPACE',
	'CONTROL',
	'DELETE',
	'DOWN_ARROW',
	'ENTER',
	'ESCAPE',
	'LEFT_ARROW',
	'OPTION',
	'RETURN',
	'RIGHT_ARROW',
	'SHIFT',
	'TAB',
	'UP_ARROW',
	'BLEND',
	'REMOVE',
	'ADD',
	'DARKEST',
	'LIGHTEST',
	'DIFFERENCE',
	'SUBTRACT',
	'EXCLUSION',
	'MULTIPLY',
	'SCREEN',
	'REPLACE',
	'OVERLAY',
	'HARD_LIGHT',
	'SOFT_LIGHT',
	'DODGE',
	'BURN',
	'THRESHOLD',
	'GRAY',
	'OPAQUE',
	'INVERT',
	'POSTERIZE',
	'DILATE',
	'ERODE',
	'BLUR',
	'NORMAL',
	'ITALIC',
	'BOLD',
	'BOLDITALIC',
	'CHAR',
	'WORD',
	'LINEAR',
	'QUADRATIC',
	'BEZIER',
	'CURVE',
	'STROKE',
	'FILL',
	'TEXTURE',
	'IMMEDIATE',
	'IMAGE',
	'NEAREST',
	'REPEAT',
	'CLAMP',
	'MIRROR',
	'LANDSCAPE',
	'PORTRAIT',
	'GRID',
	'AXES',
	'LABEL',
	'FALLBACK',
	'CONTAIN',
	'COVER',
	'UNSIGNED_BYTE',
	'UNSIGNED_INT',
	'HALF_FLOAT',
	'FLOAT',
	'RGBA',
] as const;

type Constants = (typeof constants)[number];

export function assertNotConstant(
	value: string
): asserts value is keyof Omit<P5, Constants> {
	if (constants.includes(value as Constants))
		throw new Error(`${value} can't be overwritten!`);
}
