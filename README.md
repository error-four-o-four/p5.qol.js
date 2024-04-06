> **Does this seem familiar to you?**

```js
let centerX;
let centerY;

function setup() {
	createCanvas(windowWidth, windowHeight);
	centerX = 0.5 * width;
	centerY = 0.5 * height;
	// some fancy code ...
}

function draw() {
	translate(centerX, centerY);
	// more fancy code ...
}
```

> **Does it bother you to declare a `windowResized` function which solves only a single purpose?**

> **Are you fed up with passing `windowWidth` and `windowHeight` to `createCanvas` or `resizeCanvas` over and over again?**

> **All you want to have is a single, nice canvas but you're just as lazy as I am?**

### Then here's the solution to all your problems!

# p5.qol.js

QoL stands for 'Quality of Life' and this library will increase yours to the immeasurable!

Use it like this:

```js
function setup() {
	createCanvas();
}
```

### 🚀 Bam! You're done!

Here's what you get, right out of the box:
* A canvas which has the dimensions of your window!
* A canvas which automagically resizes when the dimensions of your window change!
* A canvas which stops looping while these dimensions change! No more glitches! Yay!

But there's more to it than that! 😮

Because
* you're a *self-determined* being, aren't you?
* You want to have *full* control, don't you?
* *You* want to decide how you're canvas should behave and look like, right!

### Guess what! You can decide, right from the beginning or even on the fly!

Just pass an option argument to `createCanvas` with all your wishes and desires.

```js
function setup() {
	createCanvas({
		type: 'window', // 'square' | 'fill'
		margin: 0.1, // [0, 1]
		centerOrigin: true,
		resizeCanvas: true,
		resizeDelay: 600,
		toggleLoop: true,
	});
};
```

Or use the original arguments and gain even more control with these functions!

```js
function windowResizeTriggered(e) {
	// This code is executed when you start to resize the window!
	console.log(e.type);
	noLoop();
};

function windowResizeFinished(e) {
	// This code is executed when you're done resizing the window
	console.log(e.type);
	// `resizeCanvas` uses the inital `createCanvas` settings
	resizeCanvas();
	loop();
};
```

### And there's even more!

If you download this type-aware library right now, you'll get these properties and methods on top!\
🌟*For free!*
* `widthHalf` and `heightHalf`
* `resizeRatioX`, `resizeRatioY` and `resizeRatio`
* `windowResizeRatioX` and `windowResizeRatioY`
* `centerOrign()`
* `toggleLoop()` aaand
* `toggleFullscreen()`


## Usage

See these various [Examples](https://github.com/error-four-o-four/p5.qol.js/tree/main/examples).

## Docs

Not yet ...

## Contribute

Yes.