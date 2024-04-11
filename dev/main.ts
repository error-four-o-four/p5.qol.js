import './main.css';

import p5 from 'p5';
import init, { type P5QoL } from '../src/index.ts';

init(p5);

const sketch = (p: P5QoL) => {
	p.setup = () => {
		p.colorMode(p.HSL, 360, 1, 1, 1);
		p.createCanvas({ type: 'fill' });
	};

	p.draw = () => {
		const t = Math.floor(0.5 * p.frameCount);
		const hue = t % 360;
		p.background(hue, 0.25, 0.25);
	};
};

const wrapperCanvasElt = document.getElementById('wrapper-canvas')!;

declare global {
	var instance: p5;
}

window.instance = new p5(sketch, wrapperCanvasElt);
