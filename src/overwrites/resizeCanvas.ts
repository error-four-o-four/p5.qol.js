import { getPrivateProperty } from '../config.ts';
import type { P5, P5QoL, P5QoLProps } from '../types.ts';

import { extendPrototype, getContext, isNumber } from '../utils.ts';
import { DimensionTypes, getParamsFromDefaultOptions } from './createCanvas.ts';

// p5.prototype.resizeCanvas
// https://github.com/processing/p5.js/blob/1f3727add6a000092f6a3d2d2a807d8306c6faa5/src/core/rendering.js#L192

type Extensions = {
	widthHalf: number;
	heightHalf: number;
	resizeRatio: number;
	resizeRatioX: number;
	resizeRatioY: number;
	resizeCanvas(
		this: P5QoL,
		w: number,
		h: number,
		noRedraw?: boolean | undefined
	): void;
	resizeCanvas(this: P5QoL, w?: number, noRedraw?: boolean | undefined): void;
}

type Properties = Omit<Extensions, 'resizeCanvas'>;

const defaults: Properties = {
	widthHalf: 0,
	heightHalf: 0,
	resizeRatio: 1,
	resizeRatioX: 1,
	resizeRatioY: 1,
};

export { type Extensions as ResizeCanvasExtensions };

// //////////////// Private

/**
 * extend the p5 default arguments
 * arg[0]: number | undefined
 * arg[1]: number | noRedraw | undefined
 * arg[2]: noRedraw | undefined
 */

function getParamsFromOptions(context: P5QoL) {
	// use thes private properties
	const keys = <(keyof P5QoLProps)[]>[
		'type',
		'margin',
		'initialWindowWidth',
		'initialWindowHeight',
	];

	// get values
	const [type, margin, initialWindowWidth, initialWindowHeight] = keys.map(
		(key) => <P5QoLProps[typeof key]>getPrivateProperty.call(context, key)
	) as [DimensionTypes, number, number, number];

	if (type === 'window' || type === 'fill') {
		const [_, w, h] = getParamsFromDefaultOptions(context, { type, margin });
		return [w, h];
	}

	// @todo
	// consider other cases
	const resizeRatioX = context.windowWidth / initialWindowWidth;
	const resizeRatioY = context.windowHeight / initialWindowHeight;

	return [context.width * resizeRatioX, context.height * resizeRatioY];
}

// //////////////// Internal method

export function _updateProps(this: P5QoL) {
	const { width, height } = this;

	this._setProperty('widthHalf', 0.5 * width);
	this._setProperty('heightHalf', 0.5 * height);
}

// //////////////// Initialization

export default function (p5: P5) {
	extendPrototype(p5, defaults);

	const _resizeCanvas = p5.prototype.resizeCanvas;

	// patched function
	p5.prototype.resizeCanvas = <Extensions['resizeCanvas']>function (...args) {
		const context = getContext(this);
		const boundResizeCanvas = _resizeCanvas.bind(context);
		const boundUpdateProps = _updateProps.bind(context);

		const pWidth = context.width;
		const pHeight = context.height;

		let width = pWidth;
		let height = pHeight;
		let noRedraw = Boolean(args[2]);

		if (args[0] !== undefined) {
			// satisfy original p5 arguments
			width = args[0];
			height = isNumber(args[1]) ? args[1] : width;
		} else {
			// use P5QoLConfigs
			[width, height] = getParamsFromOptions(context);
		}

		boundResizeCanvas(width, height, noRedraw);
		boundUpdateProps();

		const resizeRatio = (context.width * context.height) / (pWidth * pHeight);
		context._setProperty('resizeRatio', resizeRatio);
		context._setProperty('resizeRatioX', context.width / pWidth);
		context._setProperty('resizeRatioY', context.height / pHeight);
	};
}
