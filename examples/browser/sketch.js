function setup() {
	colorMode(HSL, 360, 1, 1, 1);

	createCanvas({
		type: 'window',
		// margin: 0.05,
		centerOrigin: true,
		resizeCanvas: true,
		toggleLoop: true,
	});
}

function draw() {
	const t = Math.floor(0.5 * frameCount);

	const hue = t % 360;
	background(0, 0, 0.1);
	stroke(0);
	fill(hue, 1, 0.5);

	const a = (t / 180) * TAU;
	const d = 50;
	const x = Math.cos(a) * d;
	const y = Math.sin(a) * d;
	ellipse(x, y, 50);
}

function windowResizeTriggered(e) {
	console.log('triggered');
	console.log(e);
}

function windowResizeFinished(e) {
	console.log('finished');
	console.log(e);
}
