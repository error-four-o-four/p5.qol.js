import p5, { RENDERER, Renderer } from 'p5';

type Extensions$5 = {
    centerOrigin(arg?: boolean): void;
};
type PrivateProperties$2 = {
    centerOrigin: boolean;
};

type Extensions$4 = {
    toggleFullscreen(): boolean;
};

type Extensions$3 = {
    toggleLoop(): boolean;
};

type Extensions$2 = {
    widthHalf: number;
    heightHalf: number;
    resizeRatio: number;
    resizeRatioX: number;
    resizeRatioY: number;
    resizeCanvas(this: P5QoL, w: number, h: number, noRedraw?: boolean | undefined): void;
    resizeCanvas(this: P5QoL, w?: number, noRedraw?: boolean | undefined): void;
};

type Extensions$1 = {
    windowResizeRatioX: number;
    windowResizeRatioY: number;
    windowResizeTriggered: (event: UIEvent) => boolean | void;
    windowResizeFinished: (event: UIEvent) => boolean | void;
};
type PrivateProperties$1 = {
    initialWindowWidth: number;
    initialWindowHeight: number;
    isResizing: boolean;
    resizeCanvas: boolean;
    resizeDelay: number;
    toggleLoop: boolean;
};

type Extensions = {
    createCanvas(this: P5QoL, w: number, h: number, renderer?: RENDERER, canvas?: object): Renderer;
    createCanvas(this: P5QoL, w: number, h: number, rendererOrCanvas?: RENDERER | object): Renderer;
    createCanvas(this: P5QoL, s: number, rendererOrCanvas?: RENDERER | object): Renderer;
    createCanvas(this: P5QoL, options?: CreateCanvasOptions): Renderer;
};
type DimensionTypes = 'window' | 'square' | 'fill' | 'custom';
type PrivateProperties = {
    type: DimensionTypes;
    margin: number;
};
interface OptionalOptions extends Partial<PrivateProperties$2>, Partial<Omit<PrivateProperties$1, 'isResizing'>>, Partial<Pick<PrivateProperties, 'margin'>> {
    renderer?: RENDERER;
}
type DefaultOptions = {
    type: Extract<DimensionTypes, 'window' | 'fill'>;
};
type SquareOptions = {
    type: Extract<DimensionTypes, 'square'>;
    width?: number;
    margin?: number;
    height?: never;
} & ({
    width?: number;
    margin?: never;
} | {
    width?: never;
    margin?: number;
});
type CustomOptions = {
    width: number;
    height?: number;
    margin?: never;
};
type CanvasOptions = DefaultOptions | SquareOptions | CustomOptions;
type CreateCanvasOptions = OptionalOptions & CanvasOptions & {
    renderer?: RENDERER;
};

declare const libraryName = "_QoLConfig";

interface P5QoLExtensions extends Extensions$5, Extensions$4, Extensions$3, Extensions, Extensions$2, Extensions$1 {
}
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
type AnyHook = 'init' | 'beforePreload' | 'afterPreload' | 'beforeSetup' | 'afterSetup' | 'pre' | 'post' | 'remove';
type AnyMethod = (this: P5QoL, ...args: any[]) => any;
type P5 = typeof p5;
type P5QoL = InstanceType<typeof p5> & P5QoLExtensions;
interface P5QoLProps extends PrivateProperties$2, PrivateProperties, PrivateProperties$1 {
}

declare const initialize: (p5: P5) => void;

export { type P5, type P5QoL, type CreateCanvasOptions as P5QoLOptions, initialize as default };
