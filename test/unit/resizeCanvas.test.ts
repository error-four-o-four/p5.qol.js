import { expect, it, suite } from 'vitest';

suite('The method `resizeCanvas`', () => {
	it('should update the properties `width`, `height`, `widthHalf` and `heightHalf`', () => {
		const size = 300;
		const sizeHalf = 0.5 * size;
		pInst.resizeCanvas(size);

		expect(pInst.width).toEqual(size);
		expect(pInst.height).toEqual(size);
		expect(pInst.widthHalf).toEqual(sizeHalf);
		expect(pInst.heightHalf).toEqual(sizeHalf);
	});

	// @TODO
	// passed as optional prop to createCanvas
});
