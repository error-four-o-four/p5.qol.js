function P(t) {
  if (t === null)
    throw new Error("Expected NonNullable");
}
function E(t, e = 300) {
  let i;
  return function(...o) {
    clearTimeout(i), i = setTimeout(() => t.apply(this, o), e);
  };
}
function w(t) {
  return typeof t == "number" && t === t;
}
function F(t) {
  return typeof t == "string";
}
function b(t) {
  return F(t) && ["p2d", "webgl"].includes(t);
}
function C(t) {
  return typeof t == "object" && t === t;
}
function g(t, e) {
  Object.keys(e).forEach((i) => {
    t.prototype[i] = e[i];
  });
}
function f(t) {
  return t._isGlobal ? window : t;
}
function q(t) {
  return P(t.canvas), P(t.canvas.parentElement), [
    t.canvas.parentElement.clientWidth,
    t.canvas.parentElement.clientHeight
  ];
}
function x() {
  return window.innerWidth || document.documentElement && document.documentElement.clientWidth || document.body && document.body.clientWidth || 0;
}
function A() {
  return window.innerHeight || document.documentElement && document.documentElement.clientHeight || document.body && document.body.clientHeight || 0;
}
function N() {
  return [x(), A()];
}
const S = {
  centerOrigin: !1
};
function X(t = !0) {
  const e = h.call(this, "centerOrigin");
  t !== e && d.call(this, "centerOrigin", t);
}
function Y() {
  h.call(this, "centerOrigin") && (this._renderer.isP3D || this.translate(this.widthHalf, this.heightHalf));
}
function M(t) {
  g(t, {
    centerOrigin: X
  }), t.prototype.registerMethod("pre", function() {
    Y.call(this);
  });
}
const T = {
  widthHalf: 0,
  heightHalf: 0,
  resizeRatio: 1,
  resizeRatioX: 1,
  resizeRatioY: 1
};
function j(t) {
  const e = [
    "type",
    "margin",
    "initialWindowWidth",
    "initialWindowHeight"
  ], [i, n, o, r] = e.map(
    (c) => h.call(t, c)
  );
  if (i === "window" || i === "fill") {
    const [c, a, u] = _(t, { type: i, margin: n });
    return [a, u];
  }
  const l = t.windowWidth / o, s = t.windowHeight / r;
  return [t.width * l, t.height * s];
}
function H() {
  const { width: t, height: e } = this;
  this._setProperty("widthHalf", 0.5 * t), this._setProperty("heightHalf", 0.5 * e);
}
function U(t) {
  g(t, T);
  const e = t.prototype.resizeCanvas;
  t.prototype.resizeCanvas = function(...i) {
    const n = f(this), o = e.bind(n), r = H.bind(n), l = n.width, s = n.height;
    let c = l, a = s, u = !!i[2];
    i[0] !== void 0 ? (c = i[0], a = w(i[1]) ? i[1] : c) : [c, a] = j(n), o(c, a, u), r();
    const p = n.width * n.height / (l * s);
    n._setProperty("resizeRatio", p), n._setProperty("resizeRatioX", n.width / l), n._setProperty("resizeRatioY", n.height / s);
  };
}
const y = {
  type: "custom",
  margin: 0
};
function Q(t) {
  return t !== void 0 && w(t);
}
function k(...t) {
  const e = w(t[0]) ? Math.max(0, t[0]) : 100, i = w(t[1]) ? Math.max(0, t[1]) : e, n = e === i ? "square" : "custom", o = b(t[1]) ? t[1] : b(t[2]) ? t[2] : "p2d", r = C(t[2]) ? t[2] : C(t[3]) ? t[3] : void 0;
  return [n, e, i, o, r];
}
function B(t) {
  return !w(t) || t === void 0;
}
function G(t) {
  if ("type" in t) {
    const { type: e } = t;
    return e === "window" || e === "fill";
  }
  return !1;
}
function _(t, e) {
  const i = e.margin || y.margin;
  let n = e.type === "window" ? [t.windowWidth, t.windowHeight] : q(t);
  return i > 0 && (n = n.map((o) => (1 - i) * o)), [e.type, n[0], n[1]];
}
function V(t) {
  if ("type" in t) {
    const { type: e } = t;
    return e === "square";
  }
  return !1;
}
function I(t, e) {
  let i;
  if (e.width && !e.margin)
    i = e.width;
  else {
    const n = e.margin || y.margin;
    i = Math.min(t.windowWidth, t.windowHeight), i = (1 - n) * i;
  }
  return ["square", i, i];
}
function J(t) {
  return !("type" in t);
}
function K(t) {
  const { width: e, height: i } = t;
  return i ? ["custom", e, i] : ["square", e, e];
}
function Z(t, e) {
  const i = e.renderer || "p2d";
  let n = y.type, o = 0, r = 0;
  return G(e) && ([n, o, r] = _(t, e)), V(e) && ([n, o, r] = I(t, e)), J(e) && ([n, o, r] = K(e)), !o && !r && console.log("Something went wrong."), [n, o, r, i];
}
function tt(t) {
  const e = t.prototype.createCanvas;
  t.prototype.createCanvas = function(i, ...n) {
    const o = f(this), r = e.bind(o), l = H.bind(o);
    let s, c, a, u, p;
    if (Q(i) && ([s, c, a, u, p] = k(
      i,
      ...n
    )), B(i)) {
      const z = i || {
        type: "window",
        margin: 0.1,
        resizeCanvas: !0,
        toggleLoop: !0
      }, D = [
        "margin",
        "centerOrigin",
        "resizeCanvas",
        "toggleLoop",
        "resizeDelay"
      ];
      for (const W of D) {
        const R = z[W];
        R && d.call(o, W, R);
      }
      [s, c, a, u] = Z(
        o,
        z
      );
    }
    (c === void 0 || a === void 0) && (console.log("`createCanvas` - Using fallback values ..."), c = a = 100, s = "square"), s !== void 0 && d.call(o, "type", s);
    const $ = r(c, a, u, p);
    return l(), $;
  };
}
const et = {
  initialWindowWidth: 1,
  initialWindowHeight: 1,
  isResizing: !1,
  resizeCanvas: !1,
  resizeDelay: 600,
  toggleLoop: !1
}, it = {
  windowResizeRatioX: 1,
  windowResizeRatioY: 1
};
function O() {
  const t = "resize", e = nt.bind(this), i = { once: !0 };
  window.addEventListener(t, e, i);
}
function nt(t) {
  const e = f(this), i = h.call(e, "toggleLoop");
  v.call(e, t, "windowResizeTriggered"), d.call(e, "isResizing", !0), i && e.noLoop();
}
function ot() {
  const t = "resize", e = h.call(this, "resizeDelay"), i = E(rt.bind(this), e);
  window.addEventListener(t, i);
}
function rt(t) {
  const e = f(this), i = h.call(e, "toggleLoop");
  h.call(e, "resizeCanvas") && e.resizeCanvas(), d.call(e, "isResizing", !1), d.call(e, "initialWindowWidth", e.windowWidth), d.call(e, "initialWindowHeight", e.windowHeight), v.call(e, t, "windowResizeFinished"), i && e.loop(), O.call(e);
}
function st(t) {
  const e = f(this), [i, n] = N(), o = e.windowWidth, r = e.windowHeight, l = i / o, s = n / r;
  e._setProperty("windowWidth", i), e._setProperty("windowHeight", n), e._setProperty("windowResizeRatioX", l), e._setProperty("windowResizeRatioY", s), v.call(e, t, "windowResized");
}
function v(t, e) {
  let i;
  typeof this[e] == "function" && (i = this[e](t), i !== void 0 && !i && t.preventDefault());
}
function ct(t) {
  g(t, {
    _onresize: st,
    ...it
  }), t.prototype.registerMethod("afterSetup", function() {
    const e = f(this);
    d.call(e, "initialWindowWidth", e.windowWidth), d.call(
      e,
      "initialWindowHeight",
      e.windowHeight
    ), O.call(e), ot.call(e);
  });
}
const m = "_QoLConfig", L = {
  ...S,
  ...y,
  ...et
};
function at(t) {
  t.prototype[m] = { ...L };
}
function d(t, e) {
  const n = typeof this[m][t], o = typeof e;
  if (n !== o) {
    console.log(
      `Wrong argument for ${t}.
Expected typeof ${n} but received ${o}:${e}`
    );
    return;
  }
  this[m][t] = e;
}
function h(t) {
  let e = this[m][t];
  return e == null && (console.log(`Something went wrong.
Private property ${t} is ${e}.`), e = L[t]), e;
}
function lt() {
  const e = !this.fullscreen();
  return this.fullscreen(e), e;
}
function dt(t) {
  g(t, { toggleFullscreen: lt });
}
function ut() {
  const e = !this.isLooping();
  return e ? this.loop() : this.noLoop(), this._setProperty("_loop", e), e;
}
function ht(t) {
  g(t, { toggleLoop: ut });
}
const ft = (t) => {
  at(t), M(t), dt(t), ht(t), U(t), tt(t), ct(t), console.log("%cp5.QoL.js", "color: white; background: #ff1493;");
};
window.p5 !== void 0 && ft(window.p5);
export {
  ft as default
};
