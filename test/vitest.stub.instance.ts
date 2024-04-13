import { beforeAll, vi } from 'vitest';

import p5 from 'p5';
import initialize, { type P5QoL } from '../src/index.ts';

initialize(p5);

export const createInstance = async (): Promise<P5QoL> => {
	const promised = new Promise((resolve) => {
		new p5((p: P5QoL) => {
			p.setup = () => {
				p.noLoop();
				resolve(p);
			};
		});
	});

	return (await promised) as P5QoL;
};

const pInst = await createInstance();

vi.stubGlobal('p5', p5);
vi.stubGlobal('pInst', pInst);

beforeAll(() => {
	pInst.createCanvas(200);
});

declare module 'p5' {
	interface p5InstanceExtensions {
		_setupDone: boolean;
		// _loop: boolean;
	}
}

declare global {
	var pInst: P5QoL;
}
