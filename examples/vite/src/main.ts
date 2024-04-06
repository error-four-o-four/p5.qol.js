import './style.css';
import p5 from 'p5';
import init, { type P5QoL } from '@http404/p5.qol.js';

const main = document.querySelector('main')!;

init(p5);

new p5((p: P5QoL) => {
	p.setup = () => {
		p.colorMode(p.HSL, 360, 1, 1, 1);

		// write some tests!

		// p5 original arguments
		// p.createCanvas(300); // ✅
		// p.createCanvas(300, p.WEBGL); // ✅
		// p.createCanvas(300, 200); // ✅
		// p.createCanvas(300, 200, p.WEBGL); // ✅

		// patched arguments
		// p.createCanvas({ width: 100 }); // => square ✅
		// p.createCanvas({ width: 100, height: 200 }); // => custom ✅
		// p.createCanvas({ width: 100, height: 200, renderer: p.WEBGL }); // => custom ✅
		// p.createCanvas({ width: 100, margin: 0.1 }); // => Expect TypeError ❌✅

		// ❌ TypeError - just use the original arguments
		// p.createCanvas({ type: 'custom', width: 100 });
		// p.createCanvas({ type: 'custom', width: 100, height: 200 });

		// optional configs
		// p.createCanvas({ width: 100, renderer: p.WEBGL }); // => square ✅
		// p.createCanvas({ width: 100, height: 200, renderer: p.WEBGL }); // ✅
		// p.createCanvas({ width: 100, centerOrigin: true }); // ✅
		// p.createCanvas({ width: 100, resizeCanvas: true }); // ✅
		// p.createCanvas({ width: 100, resizeCanvas: true, resizeDelay: 1200 }); // ✅
		// p.createCanvas({ width: 100, toggleLoop: true }); // ✅

		// p.createCanvas({ type: 'fill', centerOrigin: true }); // ✅
		// p.createCanvas({ type: 'fill', margin: 0.1 }); // ✅
		// p.createCanvas({ type: 'fill', width: 100 }); // => Expect TypeError ❌✅
		// p.createCanvas({ type: 'fill', width: 100, margin: 0.1, }); // => Expect TypeError ❌✅

		// p.createCanvas({ type: 'square' }); // ✅
		// p.createCanvas({ type: 'square', margin: 0.1 }); // ✅
		// p.createCanvas({ type: 'square', width: 200 }); // ✅
		// p.createCanvas({ type: 'square', width: 200, margin: 0.1 }); // => Expect TypeError ❌✅
		// p.createCanvas({ type: 'square', width: 200, height: 100 }); // => Expect TypeError ❌✅

		// p.createCanvas({ type: 'window', centerOrigin: true }); // ✅
		// p.createCanvas({ type: 'window', margin: 0.1, centerOrigin: true }); // ✅
		// p.createCanvas({ type: 'window', width: 100, centerOrigin: true }); // => Expect TypeError ❌✅

		p.createCanvas({
			type: 'window',
			// margin: 0.05,
			centerOrigin: true,
			resizeCanvas: true,
			toggleLoop: true,
		});

		// p.centerOrigin();

		// display private configs
		// Object.entries(p._QoLConfig).forEach(([key, val]) => console.log(key, val));
		// console.log(p.width, p.height);
		// console.log(p.widthHalf, p.heightHalf);
	};

	p.draw = () => {
		// @todo improve this
		if (p._QoLConfig.isResizing) {
			p.background(0, 0, 0.1, 0.6);
			p.noStroke();
			p.fill(0, 0, 1);
			p.textAlign(p.CENTER);
			p.text('resizing', 0, 0);
			return;
		}

		const t = Math.floor(0.5 * p.frameCount);

		const hue = t % 360;
		p.background(0, 0, 0.1);
		p.stroke(0);
		p.fill(hue, 1, 0.5);

		const a = (t / 180) * p.TAU;
		const d = 50;
		const x = Math.cos(a) * d;
		const y = Math.sin(a) * d;
		p.ellipse(x, y, 50);
	};

	p.windowResizeTriggered = (e) => {
		// p.noLoop();
		console.log('triggered');
		console.log(e);
	};

	p.windowResizeFinished = (e) => {
		// p.loop();
		console.log('finished', p.windowResizeRatioX, p.windowResizeRatioY);
		console.log(e);
	};
}, main);

