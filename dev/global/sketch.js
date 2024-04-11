let radius;
let distance;

function setup() {
	colorMode(HSL, 360, 1, 1, 1);

	createCanvas({
		type: 'window',
		margin: 0.1,
		centerOrigin: true,
		resizeCanvas: true,
		toggleLoop: true,
	});

	radius = 0.125 * Math.min(width, height);
	distance = 0.625 * Math.min(widthHalf, heightHalf);
}

function draw() {
	const t = Math.floor(0.5 * frameCount);

	const hue = t % 360;
	background(0, 0, 0.1);
	stroke(0);
	fill(hue, 1, 0.5);

	const a = (t / 180) * TAU;
	const x = Math.cos(a) * distance;
	const y = Math.sin(a) * distance;
	ellipse(x, y, radius);
}

function windowResizeTriggered(e) {
	console.log('triggered');
}

function windowResizeFinished(e) {
	const ratio =
		resizeRatio < 1
			? Math.min(resizeRatioX, resizeRatioY)
			: Math.max(resizeRatioX, resizeRatioY);

	console.log(resizeRatio, ratio);

	// recalculate variables
	radius *= ratio;
	distance *= ratio;
}
