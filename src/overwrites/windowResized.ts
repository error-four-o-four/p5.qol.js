import type { P5, P5QoL, P5QoLProps } from '../types.ts';

import { getPrivateProperty, setPrivateProperty } from '../config.ts';

import {
	debounce,
	extendPrototype,
	getContext,
	getWindowDimensions,
} from '../utils.ts';

// p5.prototype._events
// Bind events to window
// https://github.com/processing/p5.js/blob/b5797a52b7c84c746d5c07bda0d3cae16d8ac04f/src/core/main.js#L589

// p5.prototype._onresize
// https://github.com/processing/p5.js/blob/b5797a52b7c84c746d5c07bda0d3cae16d8ac04f/src/core/environment.js#L772

type Extensions = {
	// @todo consider absolute and relative ratios
	windowResizeRatioX: number;
	windowResizeRatioY: number;
	windowResizeTriggered: (event: UIEvent) => boolean | void;
	windowResizeFinished: (event: UIEvent) => boolean | void;
};

// @todo noRedraw ??? 3rd argument of resizeCanvas
type PrivateProperties = {
	initialWindowWidth: number;
	initialWindowHeight: number;
	isResizing: boolean;
	resizeCanvas: boolean;
	resizeDelay: number;
	toggleLoop: boolean;
};

type Properties = Pick<Extensions, 'windowResizeRatioX' | 'windowResizeRatioY'>;
type Methods = Omit<Extensions, keyof Properties>;

const privateDefaults: PrivateProperties = {
	initialWindowWidth: 1,
	initialWindowHeight: 1,
	isResizing: false,
	resizeCanvas: false,
	resizeDelay: 600,
	toggleLoop: false,
};

const defaults: Properties = {
	windowResizeRatioX: 1,
	windowResizeRatioY: 1,
};

export {
	type Extensions as WindowResizedExtensions,
	type PrivateProperties as WindowResizedPrivateProperties,
	privateDefaults as windowResizedPrivateDefaults,
};

// //////////////// Private Hooks

function addResizeTriggeredListener(this: P5QoL) {
	const type = 'resize';
	const listener = onResizeTiggered.bind(this);
	const options = { once: true };

	window.addEventListener(type, listener, options);
}

function onResizeTiggered(this: P5QoL, e: UIEvent) {
	const context = getContext(this);

	const toggleLoop = <P5QoLProps['toggleLoop']>(
		getPrivateProperty.call(context, 'toggleLoop')
	);

	execute.call(context, e, 'windowResizeTriggered');
	setPrivateProperty.call(context, 'isResizing', true);

	if (toggleLoop) context.noLoop();
}

function addResizeFinishedListener(this: P5QoL) {
	const type = 'resize';
	const delay = <P5QoLProps['resizeDelay']>(
		getPrivateProperty.call(this, 'resizeDelay')
	);

	const listener = debounce(onResizeFinished.bind(this), delay);

	window.addEventListener(type, listener);
}

function onResizeFinished(this: P5QoL, e: UIEvent) {
	const context = getContext(this);

	const toggleLoop = <P5QoLProps['toggleLoop']>(
		getPrivateProperty.call(context, 'toggleLoop')
	);

	const resizeCanvas = <P5QoLProps['resizeCanvas']>(
		getPrivateProperty.call(context, 'resizeCanvas')
	);

	// uses `initialWindowWidth` and `initalWindowHeight`
	if (resizeCanvas) context.resizeCanvas();

	setPrivateProperty.call(context, 'isResizing', false);

	// set the new values which are used next time
	setPrivateProperty.call(context, 'initialWindowWidth', context.windowWidth);
	setPrivateProperty.call(context, 'initialWindowHeight', context.windowHeight);

	execute.call(context, e, 'windowResizeFinished');

	if (toggleLoop) context.loop();

	addResizeTriggeredListener.call(context);
}

// //////////////// Overwrite

function _onresize(this: P5QoL, e: UIEvent) {
	const context = getContext(this);
	const [windowWidth, windowHeight] = getWindowDimensions();

	const pWindowWidth = context.windowWidth;
	const pWindowHeight = context.windowHeight;

	const windowResizeRatioX = windowWidth / pWindowWidth;
	const windowResizeRatioY = windowHeight / pWindowHeight;

	context._setProperty('windowWidth', windowWidth);
	context._setProperty('windowHeight', windowHeight);
	context._setProperty('windowResizeRatioX', windowResizeRatioX);
	context._setProperty('windowResizeRatioY', windowResizeRatioY);

	execute.call(context, e, 'windowResized');
}

function execute(this: P5QoL, e: UIEvent, fn: keyof Methods | 'windowResized') {
	let executeDefault;
	if (typeof this[fn] === 'function') {
		executeDefault = this[fn](e);
		if (executeDefault !== undefined && !executeDefault) {
			e.preventDefault();
		}
	}
}

// //////////////// Initialization

export default function register(p5: P5) {
	extendPrototype(p5, {
		_onresize,
		...defaults,
	});

	p5.prototype.registerMethod('afterSetup', function () {
		const context = getContext(this);

		setPrivateProperty.call(context, 'initialWindowWidth', context.windowWidth);
		setPrivateProperty.call(
			context,
			'initialWindowHeight',
			context.windowHeight
		);

		// add Listeners
		addResizeTriggeredListener.call(context);
		addResizeFinishedListener.call(context);
	});
}
