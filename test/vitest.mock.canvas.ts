import { vi } from 'vitest';
import 'vitest-canvas-mock';

// stub for vitest-canvas-mock
vi.stubGlobal('jest', vi);

// mock clientWidth, clientHeight
// https://github.com/jsdom/jsdom/issues/135

// guard case becaus of
// TypeError: Cannot redefine property: clientWidth
if (!Object.hasOwn(window.HTMLElement.prototype, 'clientWidth')) {
	Object.defineProperties(window.HTMLElement.prototype, {
		clientWidth: {
			get() {
				return parseFloat(this.style.width) || 0;
			},
		},
		clientHeight: {
			get() {
				return parseFloat(this.style.height) || 0;
			},
		},
	});
}
