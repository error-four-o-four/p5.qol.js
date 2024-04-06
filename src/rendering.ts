// import type P5 from 'p5';

// import type { PrivateProps, UserInput } from './types.ts';

// import { libraryName } from './config.ts';
// import { getParentDimensions, getWindowDimensions } from './utils.ts';

// function getCanvasProps(p5: P5, input: UserInput) {
// 	const config: PrivateProps = {
// 		// get defaults
// 		...p5[libraryName],
// 		// apply user config
// 		...input,
// 	};

// 	// clamp margin
// 	// @todo use literals like '1rem'
// 	config.margin = Math.max(0, Math.min(1, config.margin));

// 	// set user config
// 	p5._setProperty(libraryName, config);

// 	const { type } = config;
// 	const [windowWidth, windowHeight] = getWindowDimensions();

// 	let width = 0;
// 	let height = 0;

// 	if (type === 'full') {
// 		[width, height] = [windowWidth, windowHeight];
// 	}

// 	if (type === 'square') {
// 		const min = Math.min(windowWidth, windowHeight);
// 		[width, height] = [min, min];
// 	}

// 	if (type === 'cinema') {
// 		[width, height] = [windowWidth, Math.floor((windowWidth / 16) * 9)];
// 	}

// 	if (type === 'fill') {
// 		[width, height] = getParentDimensions(p5);
// 	}

// 	return [width, height, input.renderer || 'p2d'];
// }

// export function updateCanvasProps(p5: P5.p5InstanceExtensions) {
// 	const { width, height } = p5;

// 	p5._setProperty('widthHalf', 0.5 * width);
// 	p5._setProperty('heightHalf', 0.5 * height);
// }

// export function overrideCreateCanvas(p5: P5) {
// 	/* https://github.com/processing/p5.js/blob/66a386b1c406f69952eb78d7684019bcb424c70a/src/core/rendering.js#L55
// 	/* Overwrite createCanvas() */ ///////////////////////////////////////////////////////////////////////////////

// 	// @ts-ignore
// 	const fnCreate = p5.prototype.createCanvas;

// 	// @ts-ignore
// 	p5.prototype.createCanvas = function (...args) {
// 		if (typeof args[0] === 'object' || args.length === 0) {
// 			const [w, h, r] = getCanvasProps(this, args[0]);
// 			const renderer = fnCreate.call(this, w, h, r);

// 			updateCanvasProps(this);

// 			this.pixelDensity(1);
// 			this.ellipseMode(p5.RADIUS);
// 			this.angleMode(p5.RADIANS);

// 			return renderer;
// 		}

// 		return fnCreate.call(this, ...args);
// 	};
// }
