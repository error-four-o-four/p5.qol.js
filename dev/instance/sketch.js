p5.disableFriendlyErrors = true;
window.instance = new p5(sketch, document.querySelector('main'));

function sketch(p) {
	p.setup = () => {
		p.createCanvas({
			type: 'fill',
			// centerOrigin: true,
			resizeCanvas: true,
		});
		p.noLoop();
	};

	p.draw = () => {
		p.background('#ed225d');
		p.noStroke();
		p.fill(255);
		p.rect(p.widthHalf, 0, p.widthHalf, p.height);
		// p.textSize(0.5 * Math.min(p.width, p.height));
		// p.textAlign(p.CENTER, p.CENTER);
		// p.text('p5.qol', 0, -40);
		// p.ellipse(0, 0, 50);
	};
}
