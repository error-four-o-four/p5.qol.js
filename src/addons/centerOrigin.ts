import { getPrivateProperty, setPrivateProperty } from '../config.ts';
import { type P5, type P5QoL } from '../types.ts';
import { extendPrototype } from '../utils.ts';

// //////////////// Properties

type Extensions = {
	centerOrigin(arg?: boolean): void;
}

type PrivateProperties = {
	centerOrigin: boolean;
};

// this property can be set by the public method
// or by the arguments passed in `createCanvas`
const privateDefaults: PrivateProperties = {
	centerOrigin: false,
};

export {
	type Extensions as CenterOriginExtensions,
	type PrivateProperties as CenterOriginPrivateProperties,
	privateDefaults as centerOriginPrivateDefaults,
};

// //////////////// Public Methods

function centerOrigin(this: P5QoL, arg = true) {
	const val = getPrivateProperty.call(this, 'centerOrigin');

	if (arg === val) return;

	setPrivateProperty.call(this, 'centerOrigin', arg);
}

// //////////////// Private Hooks

function _translate(this: P5QoL) {
	const val = getPrivateProperty.call(this, 'centerOrigin');

	if (!val) return;

	// @todo
	// Property 'isP3D' does not exist on type 'Renderer'
	// @ts-ignore
	if (this._renderer.isP3D) return;

	this.translate(this.widthHalf, this.heightHalf);
}

// //////////////// Initialization

export default function register(p5: P5) {
	// private properties are set in `config.ts`

	// add `centerOrigin` as a public method
	extendPrototype(p5, {
		centerOrigin,
	});

	p5.prototype.registerMethod('pre', function () {
		_translate.call(this);
	});
}
