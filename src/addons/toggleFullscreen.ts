import type { P5, P5QoL } from '../types.ts';
import { extendPrototype } from '../utils.ts';

type Extensions = {
	toggleFullscreen(): boolean;
};

export { type Extensions as ToggleFullscreenExtensions };

// //////////////// Public Methods

function toggleFullscreen(this: P5QoL) {
	const val = this.fullscreen();
	const arg = !val;
	this.fullscreen(arg);
	return arg;
}

// //////////////// Initialization

export default function register(p5: P5) {
	extendPrototype(p5, { toggleFullscreen });
}
