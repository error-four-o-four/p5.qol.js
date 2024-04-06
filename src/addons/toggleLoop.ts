import type { P5, P5QoL } from '../types.ts';
import { extendPrototype } from '../utils.ts';

// https://github.com/processing/p5.js/blob/3754ce63deab32842fd81c393c62ff9e388f8637/src/core/structure.js#L188C1-L190C3
// p5.prototype.isLooping = function() {
//   return this._loop;
// };

// https://github.com/processing/p5.js/blob/3754ce63deab32842fd81c393c62ff9e388f8637/src/core/structure.js#L78C1-L80C3
// p5.prototype.noLoop = function() {
//   this._loop = false;
// };

// https://github.com/processing/p5.js/blob/3754ce63deab32842fd81c393c62ff9e388f8637/src/core/structure.js#L124C1-L131C3
// p5.prototype.loop = function() {
//   if (!this._loop) {
//     this._loop = true;
//     if (this._setupDone) {
//       this._draw();
//     }
//   }
// };

type Extensions = {
	toggleLoop(): boolean;
};

export { type Extensions as ToggleLoopExtensions };

// //////////////// Public Methods

function toggleLoop(this: P5QoL) {
	const val = this.isLooping();
	const arg = !val;

	arg ? this.loop() : this.noLoop();
	this._setProperty('_loop', arg);

	return arg;
}

// //////////////// Initialization

export default function register(p5: P5) {
	extendPrototype(p5, { toggleLoop });
}
