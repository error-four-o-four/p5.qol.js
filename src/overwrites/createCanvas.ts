import type { P5, P5QoL, RENDERER, Renderer } from '../types.ts';

import type { CenterOriginPrivateProperties } from '../addons/centerOrigin.ts';
import type { WindowResizedPrivateProperties } from './windowResized.ts';

import { _updateProps } from './resizeCanvas.ts';

import { setPrivateProperty } from '../config.ts';

import {
	getContext,
	isNumber,
	isRenderer,
	isCanvas,
	getParentDimensions,
} from '../utils.ts';

type Extensions = {
	// p5 default
	createCanvas(
		this: P5QoL,
		w: number,
		h: number,
		renderer?: RENDERER,
		canvas?: object
	): Renderer;
	createCanvas(
		this: P5QoL,
		w: number,
		h: number,
		rendererOrCanvas?: RENDERER | object
	): Renderer;
	// extension
	createCanvas(
		this: P5QoL,
		s: number,
		rendererOrCanvas?: RENDERER | object
	): Renderer;
	// specify options or pass no argument
	createCanvas(this: P5QoL, options?: CreateCanvasOptions): Renderer;
};

type DimensionTypes = 'window' | 'square' | 'fill' | 'custom';

type PrivateProperties = {
	type: DimensionTypes;
	margin: number;
};

const privateDefaults: PrivateProperties = {
	type: 'custom',
	margin: 0,
};

export {
	type Extensions as CreateCanvasExtensions,
	type PrivateProperties as CreateCanvasPrivateProperties,
	type CreateCanvasOptions as CreateCanvasOptions,
	type DimensionTypes,
	privateDefaults as createCanvasPrivateDefaults,
};

// //////////////// Private

/**
 * satisfy (and extend) the p5 default arguments
 * arg[0]: number
 * arg[1]: number | RENDERER | undefined
 * arg[2]: RENDERER | object | undefined
 * arg[3]: object | undefined
 */

function useOriginalP5Arguments(
	arg: number | CreateCanvasOptions | undefined
): arg is number {
	return arg !== undefined && isNumber(arg);
}

function getParamsFromP5Arguments(
	...args: [number, unknown, unknown, unknown]
) {
	// extension: use width as the height if there's only one number argument
	const width = isNumber(args[0]) ? Math.max(0, args[0]) : 100;
	const height = isNumber(args[1]) ? Math.max(0, args[1]) : width;

	// stored as private prop which us used by `resizeCanvas`
	const type: DimensionTypes = width === height ? 'square' : 'custom';

	// passed to `createCanvas`
	const renderer: RENDERER = isRenderer(args[1])
		? args[1]
		: isRenderer(args[2])
		? args[2]
		: 'p2d';

	const canvas = isCanvas(args[2])
		? args[2]
		: isCanvas(args[3])
		? args[3]
		: undefined;

	return [type, width, height, renderer, canvas] as CreateCanvasParams;
}

// //////////////// Define a bunch of possible Options Argument (Gnaaa!)

// options from the other extensions
interface OptionalOptions
	extends Partial<CenterOriginPrivateProperties>,
		Partial<Omit<WindowResizedPrivateProperties, 'isResizing'>>,
		Partial<Pick<PrivateProperties, 'margin'>> {
	renderer?: RENDERER;
}

type DefaultOptions = {
	type: Extract<DimensionTypes, 'window' | 'fill'>;
};

function usePatchedArguments(
	arg: number | CreateCanvasOptions | undefined
): arg is CreateCanvasOptions | undefined {
	return !isNumber(arg) || arg === undefined;
}

function isDefaultOptionsArgument(
	arg: CreateCanvasOptions
): arg is DefaultOptions {
	if ('type' in arg) {
		const { type } = arg;
		return type === 'window' || type === 'fill';
	}
	return false;
}

export function getParamsFromDefaultOptions(
	context: P5QoL,
	options: DefaultOptions & OptionalOptions
): [DimensionTypes, number, number] {
	const margin = options.margin || privateDefaults.margin;

	let params =
		options.type === 'window'
			? [context.windowWidth, context.windowHeight]
			: getParentDimensions(context);

	if (margin > 0) {
		params = params.map((value) => (1 - margin) * value);
	}
	return [options.type, params[0], params[1]];
}

type SquareOptions =
	| {
			type: Extract<DimensionTypes, 'square'>;
			width?: number;
			margin?: number;
			height?: never;
	  } & (
			| {
					width?: number;
					margin?: never;
			  }
			| {
					width?: never;
					margin?: number;
			  }
	  );

function isSquareOptionsArgument(
	arg: CreateCanvasOptions
): arg is SquareOptions {
	if ('type' in arg) {
		const { type } = arg;
		return type === 'square';
	}

	return false;
}

function getParamsFromSquareOptions(
	context: P5QoL,
	options: SquareOptions & OptionalOptions
): [DimensionTypes, number, number] {
	let size: number;

	if (options.width && !options.margin) {
		size = options.width;
	} else {
		const margin = options.margin || privateDefaults.margin;
		size = Math.min(context.windowWidth, context.windowHeight);
		size = (1 - margin) * size;
	}

	return ['square', size, size];
}

// type CinemaOptionsArgument = {
// 	type: Extract<DimensionOptions, 'cinema'>;
// } & (
// 	| {
// 			width?: number;
// 			height: never;
// 			margin: never;
// 	  }
// 	| {
// 			width: never;
// 			height?: number;
// 			margin: never;
// 	  }
// );

type CustomOptions = {
	width: number;
	height?: number;
	margin?: never;
};

function isCustomOptionsArgument(arg: CanvasOptions): arg is CustomOptions {
	return !('type' in arg);
}

function getParamsFromCustomOptions(
	options: CustomOptions
): [DimensionTypes, number, number] {
	const { width, height } = options;
	return height ? ['custom', width, height] : ['square', width, width];
}

type CanvasOptions =
	| DefaultOptions
	| SquareOptions
	// | CinemaOptionsArgument
	| CustomOptions;

type CreateCanvasOptions = OptionalOptions &
	CanvasOptions & { renderer?: RENDERER };

type CreateCanvasParams = [DimensionTypes, number, number, RENDERER, object?];

// this is where the magic happens. uuuh!
function getParamsFromOptions(
	context: P5QoL,
	options: CreateCanvasOptions
): CreateCanvasParams {
	// not a private property
	const renderer = options.renderer || 'p2d';

	// consider: privateDefaults are already set
	let type = privateDefaults.type;
	let width = 0;
	let height = 0;

	if (isDefaultOptionsArgument(options)) {
		[type, width, height] = getParamsFromDefaultOptions(context, options);
	}

	if (isSquareOptionsArgument(options)) {
		[type, width, height] = getParamsFromSquareOptions(context, options);
	}

	if (isCustomOptionsArgument(options)) {
		[type, width, height] = getParamsFromCustomOptions(options);
	}

	// just in case
	if (!width && !height) {
		console.log('Something went wrong.');
	}

	return [type, width, height, renderer];
}

export default function (p5: P5) {
	// original function
	// https://github.com/processing/p5.js/blob/3754ce63deab32842fd81c393c62ff9e388f8637/src/core/rendering.js#L71
	const _createCanvas = p5.prototype.createCanvas;

	// patched function
	p5.prototype.createCanvas = <Extensions['createCanvas']>(
		function (arg1, ...args) {
			const context = getContext(this);
			const boundCreateCanvas = _createCanvas.bind(context);
			const boundUpdateProps = _updateProps.bind(context);

			let type: DimensionTypes | undefined;
			let width: number | undefined;
			let height: number | undefined;
			let renderer: RENDERER | undefined;
			let canvas: object | undefined;

			if (useOriginalP5Arguments(arg1)) {
				[type, width, height, renderer, canvas] = getParamsFromP5Arguments(
					arg1,
					...args
				);
			}

			if (usePatchedArguments(arg1)) {
				// when the user passes no arguments use convenient options
				// else get user options or an empty object
				const options: CreateCanvasOptions = arg1
					? arg1
					: {
							type: 'window',
							margin: 0.1,
							resizeCanvas: true,
							toggleLoop: true,
					  };

				// iterate over these private properties
				// if the user did not set the value of a property
				// the default value is kept which was already set in `config.ts`
				const keys: (keyof Omit<OptionalOptions, 'renderer'>)[] = [
					'margin',
					'centerOrigin',
					'resizeCanvas',
					'toggleLoop',
					'resizeDelay',
				];

				for (const key of keys) {
					const value = options[key];
					value && setPrivateProperty.call(context, key, value);
				}

				// set params
				[type, width, height, renderer] = getParamsFromOptions(
					context,
					options
				);
			}

			// use a fallback
			if (width === undefined || height === undefined) {
				console.log('`createCanvas` - Using fallback values ...');
				width = height = 100;
				type = 'square';
			}

			if (type !== undefined) {
				setPrivateProperty.call(context, 'type', type);
			}

			// do it
			const _renderer = boundCreateCanvas(width, height, renderer, canvas);

			// update widthHalf and heightHalf
			boundUpdateProps();

			return _renderer;
		}
	);
}
