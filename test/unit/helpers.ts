import { expect, expectTypeOf } from 'vitest';
import { type P5QoL } from '../../src/index.ts';

export const sleep = (ms = 300) =>
	new Promise((res) => {
		setTimeout(res, ms);
	});

const getResizeEvent = () =>
	new UIEvent('resize', {
		bubbles: true,
		cancelable: true,
	});

export const defineResizeTo = (win = global.window) => {
	// Simulate window resize event
	// https://gist.github.com/javierarques/d95948ac7e9ddc8097612866ecc63a4b
	// https://developer.mozilla.org/en-US/docs/Web/Events/Creating_and_triggering_events#triggering_built-in_events
	win.resizeTo = (width, height?) => {
		const event = getResizeEvent();

		height = !height ? width : height;
		win.innerWidth = width || win.innerWidth;
		win.innerHeight = height || win.innerHeight;
		win.dispatchEvent(event);
	};
};

export const simulateResizeEvent = async (
	width: number,
	height: number,
	duration = 1000,
	win = global.window
) => {
	const { innerWidth, innerHeight } = win;
	const deltaWidth = width - innerWidth;
	const deltaHeight = height - innerHeight;

	const step = 100;
	const steps = Math.floor(duration / step);

	for (let i = 0; i < steps; i += 1) {
		const delta = (i + 1) / steps;
		win.resizeTo(
			innerWidth + delta * deltaWidth,
			innerHeight + delta * deltaHeight
		);
		// console.log(win.innerWidth, win.innerHeight);
		await sleep(step);
	}
};

export const defineHTMLElementGetters = (win = global.window) => {
	// mock clientWidth, clientHeight
	// https://github.com/jsdom/jsdom/issues/135

	// guard case because of
	// TypeError: Cannot redefine property: clientWidth
	if (!Object.hasOwn(win.HTMLElement.prototype, 'clientWidth')) {
		Object.defineProperties(win.HTMLElement.prototype, {
			clientWidth: {
				get() {
					return parseFloat(this.style.width) || 0;
				},
			},
			clientHeight: {
				get() {
					return parseFloat(this.style.height) || 0;
				},
			},
		});
	}
};

export const expectProperty = (
	p5: P5QoL,
	key: keyof P5QoL,
	val: P5QoL[keyof P5QoL]
) => {
	const actualValue = p5[key];

	expect(p5).toHaveProperty(key);
	expect(p5[key]).not.toBe(null);
	expectTypeOf(actualValue).toMatchTypeOf(val);
	return actualValue;
};
