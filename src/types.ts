import type { Renderer, RENDERER } from 'p5';
import p5 from 'p5';

import type {
	CenterOriginExtensions,
	CenterOriginPrivateProperties,
} from './addons/centerOrigin.ts';

import type { ToggleFullscreenExtensions } from './addons/toggleFullscreen.ts';
import type { ToggleLoopExtensions } from './addons/toggleLoop.ts';

import type { ResizeCanvasExtensions } from './overwrites/resizeCanvas.ts';

import type {
	CreateCanvasExtensions,
	CreateCanvasPrivateProperties,
	CreateCanvasOptions as P5QoLOptions,
} from './overwrites/createCanvas.ts';

import type {
	WindowResizedExtensions,
	WindowResizedPrivateProperties,
} from './overwrites/windowResized.ts';

import { libraryName } from './config.ts';

interface P5QoLExtensions
	extends CenterOriginExtensions,
		ToggleFullscreenExtensions,
		ToggleLoopExtensions,
		CreateCanvasExtensions,
		ResizeCanvasExtensions,
		WindowResizedExtensions {}

declare module 'p5' {
	interface p5InstanceExtensions extends P5QoLExtensions {
		[libraryName]: P5QoLProps;
		_isGlobal: boolean;
		_loop: boolean;
		_renderer: p5.Renderer;
		_setProperty(key: keyof P5QoL, val: any): any;
		canvas: HTMLCanvasElement;
		registerMethod(hook: AnyHook, method: AnyMethod): void;
	}
}

type AnyHook =
	| 'init'
	| 'beforePreload'
	| 'afterPreload'
	| 'beforeSetup'
	| 'afterSetup'
	| 'pre'
	| 'post'
	| 'remove';

type AnyMethod = (this: P5QoL, ...args: any[]) => any;

type AnyRecord = Record<string, any>;

type P5 = typeof p5;

type P5QoL = InstanceType<typeof p5> & P5QoLExtensions;

interface P5QoLProps
	extends CenterOriginPrivateProperties,
		CreateCanvasPrivateProperties,
		WindowResizedPrivateProperties {}

export {
	type AnyRecord,
	type P5,
	type P5QoL,
	type P5QoLProps,
	type P5QoLOptions,
	type RENDERER,
	type Renderer,
};
