import type { P5, P5QoL, P5QoLOptions } from './types.ts';

import addPrivateConfigs from './config.ts';

import registerCenterOrigin from './addons/centerOrigin.ts';
import registerToggleFullscreen from './addons/toggleFullscreen.ts';
import registerToggleLoop from './addons/toggleLoop.ts';

import overwriteCreateCanvas from './overwrites/createCanvas.ts';
import overwriteResizeCanvas from './overwrites/resizeCanvas.ts';
import overwriteWindowResized from './overwrites/windowResized.ts';

const initialize = (p5: P5) => {
	addPrivateConfigs(p5);

	registerCenterOrigin(p5);
	registerToggleFullscreen(p5);
	registerToggleLoop(p5);

	overwriteResizeCanvas(p5);
	overwriteCreateCanvas(p5);
	overwriteWindowResized(p5);

	console.log('%cp5.QoL.js', 'color: white; background: #ff1493;');
};

// @ts-ignore
if (window.p5 !== undefined) initialize(window.p5);

export default initialize;

export { type P5, type P5QoL, type P5QoLOptions };
