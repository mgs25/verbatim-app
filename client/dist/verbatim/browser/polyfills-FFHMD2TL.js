var ce = globalThis;
function te(e) {
    return (ce.__Zone_symbol_prefix || "__zone_symbol__") + e;
}
function dt() {
    let e = ce.performance;
    function n(M) {
        e && e.mark && e.mark(M);
    }
    function a(M, s) {
        e && e.measure && e.measure(M, s);
    }
    n("Zone");
    class t {
        static {
            this.__symbol__ = te;
        }
        static assertZonePatched() {
            if (ce.Promise !== S.ZoneAwarePromise)
                throw new Error(
                    "Zone.js has detected that ZoneAwarePromise `(window|global).Promise` has been overwritten.\nMost likely cause is that a Promise polyfill has been loaded after Zone.js (Polyfilling Promise api is not necessary when zone.js is loaded. If you must load one, do so before loading zone.js.)",
                );
        }
        static get root() {
            let s = t.current;
            for (; s.parent; ) s = s.parent;
            return s;
        }
        static get current() {
            return b.zone;
        }
        static get currentTask() {
            return D;
        }
        static __load_patch(s, i, o = !1) {
            if (S.hasOwnProperty(s)) {
                let g = ce[te("forceDuplicateZoneCheck")] === !0;
                if (!o && g) throw Error("Already loaded patch: " + s);
            } else if (!ce["__Zone_disable_" + s]) {
                let g = "Zone:" + s;
                (n(g), (S[s] = i(ce, t, w)), a(g, g));
            }
        }
        get parent() {
            return this._parent;
        }
        get name() {
            return this._name;
        }
        constructor(s, i) {
            ((this._parent = s),
                (this._name = i ? i.name || "unnamed" : "<root>"),
                (this._properties = (i && i.properties) || {}),
                (this._zoneDelegate = new f(
                    this,
                    this._parent && this._parent._zoneDelegate,
                    i,
                )));
        }
        get(s) {
            let i = this.getZoneWith(s);
            if (i) return i._properties[s];
        }
        getZoneWith(s) {
            let i = this;
            for (; i; ) {
                if (i._properties.hasOwnProperty(s)) return i;
                i = i._parent;
            }
            return null;
        }
        fork(s) {
            if (!s) throw new Error("ZoneSpec required!");
            return this._zoneDelegate.fork(this, s);
        }
        wrap(s, i) {
            if (typeof s != "function")
                throw new Error("Expecting function got: " + s);
            let o = this._zoneDelegate.intercept(this, s, i),
                g = this;
            return function () {
                return g.runGuarded(o, this, arguments, i);
            };
        }
        run(s, i, o, g) {
            b = { parent: b, zone: this };
            try {
                return this._zoneDelegate.invoke(this, s, i, o, g);
            } finally {
                b = b.parent;
            }
        }
        runGuarded(s, i = null, o, g) {
            b = { parent: b, zone: this };
            try {
                try {
                    return this._zoneDelegate.invoke(this, s, i, o, g);
                } catch (V) {
                    if (this._zoneDelegate.handleError(this, V)) throw V;
                }
            } finally {
                b = b.parent;
            }
        }
        runTask(s, i, o) {
            if (s.zone != this)
                throw new Error(
                    "A task can only be run in the zone of creation! (Creation: " +
                        (s.zone || J).name +
                        "; Execution: " +
                        this.name +
                        ")",
                );
            let g = s,
                {
                    type: V,
                    data: { isPeriodic: ee = !1, isRefreshable: Z = !1 } = {},
                } = s;
            if (s.state === q && (V === z || V === y)) return;
            let he = s.state != A;
            he && g._transitionTo(A, d);
            let _e = D;
            ((D = g), (b = { parent: b, zone: this }));
            try {
                V == y && s.data && !ee && !Z && (s.cancelFn = void 0);
                try {
                    return this._zoneDelegate.invokeTask(this, g, i, o);
                } catch (Q) {
                    if (this._zoneDelegate.handleError(this, Q)) throw Q;
                }
            } finally {
                let Q = s.state;
                if (Q !== q && Q !== X)
                    if (V == z || ee || (Z && Q === k))
                        he && g._transitionTo(d, A, k);
                    else {
                        let Ee = g._zoneDelegates;
                        (this._updateTaskCount(g, -1),
                            he && g._transitionTo(q, A, q),
                            Z && (g._zoneDelegates = Ee));
                    }
                ((b = b.parent), (D = _e));
            }
        }
        scheduleTask(s) {
            if (s.zone && s.zone !== this) {
                let o = this;
                for (; o; ) {
                    if (o === s.zone)
                        throw Error(
                            `can not reschedule task to ${this.name} which is descendants of the original zone ${s.zone.name}`,
                        );
                    o = o.parent;
                }
            }
            s._transitionTo(k, q);
            let i = [];
            ((s._zoneDelegates = i), (s._zone = this));
            try {
                s = this._zoneDelegate.scheduleTask(this, s);
            } catch (o) {
                throw (
                    s._transitionTo(X, k, q),
                    this._zoneDelegate.handleError(this, o),
                    o
                );
            }
            return (
                s._zoneDelegates === i && this._updateTaskCount(s, 1),
                s.state == k && s._transitionTo(d, k),
                s
            );
        }
        scheduleMicroTask(s, i, o, g) {
            return this.scheduleTask(new E(G, s, i, o, g, void 0));
        }
        scheduleMacroTask(s, i, o, g, V) {
            return this.scheduleTask(new E(y, s, i, o, g, V));
        }
        scheduleEventTask(s, i, o, g, V) {
            return this.scheduleTask(new E(z, s, i, o, g, V));
        }
        cancelTask(s) {
            if (s.zone != this)
                throw new Error(
                    "A task can only be cancelled in the zone of creation! (Creation: " +
                        (s.zone || J).name +
                        "; Execution: " +
                        this.name +
                        ")",
                );
            if (!(s.state !== d && s.state !== A)) {
                s._transitionTo(x, d, A);
                try {
                    this._zoneDelegate.cancelTask(this, s);
                } catch (i) {
                    throw (
                        s._transitionTo(X, x),
                        this._zoneDelegate.handleError(this, i),
                        i
                    );
                }
                return (
                    this._updateTaskCount(s, -1),
                    s._transitionTo(q, x),
                    (s.runCount = -1),
                    s
                );
            }
        }
        _updateTaskCount(s, i) {
            let o = s._zoneDelegates;
            i == -1 && (s._zoneDelegates = null);
            for (let g = 0; g < o.length; g++) o[g]._updateTaskCount(s.type, i);
        }
    }
    let c = {
        name: "",
        onHasTask: (M, s, i, o) => M.hasTask(i, o),
        onScheduleTask: (M, s, i, o) => M.scheduleTask(i, o),
        onInvokeTask: (M, s, i, o, g, V) => M.invokeTask(i, o, g, V),
        onCancelTask: (M, s, i, o) => M.cancelTask(i, o),
    };
    class f {
        get zone() {
            return this._zone;
        }
        constructor(s, i, o) {
            ((this._taskCounts = { microTask: 0, macroTask: 0, eventTask: 0 }),
                (this._zone = s),
                (this._parentDelegate = i),
                (this._forkZS = o && (o && o.onFork ? o : i._forkZS)),
                (this._forkDlgt = o && (o.onFork ? i : i._forkDlgt)),
                (this._forkCurrZone =
                    o && (o.onFork ? this._zone : i._forkCurrZone)),
                (this._interceptZS = o && (o.onIntercept ? o : i._interceptZS)),
                (this._interceptDlgt =
                    o && (o.onIntercept ? i : i._interceptDlgt)),
                (this._interceptCurrZone =
                    o && (o.onIntercept ? this._zone : i._interceptCurrZone)),
                (this._invokeZS = o && (o.onInvoke ? o : i._invokeZS)),
                (this._invokeDlgt = o && (o.onInvoke ? i : i._invokeDlgt)),
                (this._invokeCurrZone =
                    o && (o.onInvoke ? this._zone : i._invokeCurrZone)),
                (this._handleErrorZS =
                    o && (o.onHandleError ? o : i._handleErrorZS)),
                (this._handleErrorDlgt =
                    o && (o.onHandleError ? i : i._handleErrorDlgt)),
                (this._handleErrorCurrZone =
                    o &&
                    (o.onHandleError ? this._zone : i._handleErrorCurrZone)),
                (this._scheduleTaskZS =
                    o && (o.onScheduleTask ? o : i._scheduleTaskZS)),
                (this._scheduleTaskDlgt =
                    o && (o.onScheduleTask ? i : i._scheduleTaskDlgt)),
                (this._scheduleTaskCurrZone =
                    o &&
                    (o.onScheduleTask ? this._zone : i._scheduleTaskCurrZone)),
                (this._invokeTaskZS =
                    o && (o.onInvokeTask ? o : i._invokeTaskZS)),
                (this._invokeTaskDlgt =
                    o && (o.onInvokeTask ? i : i._invokeTaskDlgt)),
                (this._invokeTaskCurrZone =
                    o && (o.onInvokeTask ? this._zone : i._invokeTaskCurrZone)),
                (this._cancelTaskZS =
                    o && (o.onCancelTask ? o : i._cancelTaskZS)),
                (this._cancelTaskDlgt =
                    o && (o.onCancelTask ? i : i._cancelTaskDlgt)),
                (this._cancelTaskCurrZone =
                    o && (o.onCancelTask ? this._zone : i._cancelTaskCurrZone)),
                (this._hasTaskZS = null),
                (this._hasTaskDlgt = null),
                (this._hasTaskDlgtOwner = null),
                (this._hasTaskCurrZone = null));
            let g = o && o.onHasTask,
                V = i && i._hasTaskZS;
            (g || V) &&
                ((this._hasTaskZS = g ? o : c),
                (this._hasTaskDlgt = i),
                (this._hasTaskDlgtOwner = this),
                (this._hasTaskCurrZone = this._zone),
                o.onScheduleTask ||
                    ((this._scheduleTaskZS = c),
                    (this._scheduleTaskDlgt = i),
                    (this._scheduleTaskCurrZone = this._zone)),
                o.onInvokeTask ||
                    ((this._invokeTaskZS = c),
                    (this._invokeTaskDlgt = i),
                    (this._invokeTaskCurrZone = this._zone)),
                o.onCancelTask ||
                    ((this._cancelTaskZS = c),
                    (this._cancelTaskDlgt = i),
                    (this._cancelTaskCurrZone = this._zone)));
        }
        fork(s, i) {
            return this._forkZS
                ? this._forkZS.onFork(this._forkDlgt, this.zone, s, i)
                : new t(s, i);
        }
        intercept(s, i, o) {
            return this._interceptZS
                ? this._interceptZS.onIntercept(
                      this._interceptDlgt,
                      this._interceptCurrZone,
                      s,
                      i,
                      o,
                  )
                : i;
        }
        invoke(s, i, o, g, V) {
            return this._invokeZS
                ? this._invokeZS.onInvoke(
                      this._invokeDlgt,
                      this._invokeCurrZone,
                      s,
                      i,
                      o,
                      g,
                      V,
                  )
                : i.apply(o, g);
        }
        handleError(s, i) {
            return this._handleErrorZS
                ? this._handleErrorZS.onHandleError(
                      this._handleErrorDlgt,
                      this._handleErrorCurrZone,
                      s,
                      i,
                  )
                : !0;
        }
        scheduleTask(s, i) {
            let o = i;
            if (this._scheduleTaskZS)
                (this._hasTaskZS &&
                    o._zoneDelegates.push(this._hasTaskDlgtOwner),
                    (o = this._scheduleTaskZS.onScheduleTask(
                        this._scheduleTaskDlgt,
                        this._scheduleTaskCurrZone,
                        s,
                        i,
                    )),
                    o || (o = i));
            else if (i.scheduleFn) i.scheduleFn(i);
            else if (i.type == G) U(i);
            else throw new Error("Task is missing scheduleFn.");
            return o;
        }
        invokeTask(s, i, o, g) {
            return this._invokeTaskZS
                ? this._invokeTaskZS.onInvokeTask(
                      this._invokeTaskDlgt,
                      this._invokeTaskCurrZone,
                      s,
                      i,
                      o,
                      g,
                  )
                : i.callback.apply(o, g);
        }
        cancelTask(s, i) {
            let o;
            if (this._cancelTaskZS)
                o = this._cancelTaskZS.onCancelTask(
                    this._cancelTaskDlgt,
                    this._cancelTaskCurrZone,
                    s,
                    i,
                );
            else {
                if (!i.cancelFn) throw Error("Task is not cancelable");
                o = i.cancelFn(i);
            }
            return o;
        }
        hasTask(s, i) {
            try {
                this._hasTaskZS &&
                    this._hasTaskZS.onHasTask(
                        this._hasTaskDlgt,
                        this._hasTaskCurrZone,
                        s,
                        i,
                    );
            } catch (o) {
                this.handleError(s, o);
            }
        }
        _updateTaskCount(s, i) {
            let o = this._taskCounts,
                g = o[s],
                V = (o[s] = g + i);
            if (V < 0)
                throw new Error("More tasks executed then were scheduled.");
            if (g == 0 || V == 0) {
                let ee = {
                    microTask: o.microTask > 0,
                    macroTask: o.macroTask > 0,
                    eventTask: o.eventTask > 0,
                    change: s,
                };
                this.hasTask(this._zone, ee);
            }
        }
    }
    class E {
        constructor(s, i, o, g, V, ee) {
            if (
                ((this._zone = null),
                (this.runCount = 0),
                (this._zoneDelegates = null),
                (this._state = "notScheduled"),
                (this.type = s),
                (this.source = i),
                (this.data = g),
                (this.scheduleFn = V),
                (this.cancelFn = ee),
                !o)
            )
                throw new Error("callback is not defined");
            this.callback = o;
            let Z = this;
            s === z && g && g.useG
                ? (this.invoke = E.invokeTask)
                : (this.invoke = function () {
                      return E.invokeTask.call(ce, Z, this, arguments);
                  });
        }
        static invokeTask(s, i, o) {
            (s || (s = this), K++);
            try {
                return (s.runCount++, s.zone.runTask(s, i, o));
            } finally {
                (K == 1 && $(), K--);
            }
        }
        get zone() {
            return this._zone;
        }
        get state() {
            return this._state;
        }
        cancelScheduleRequest() {
            this._transitionTo(q, k);
        }
        _transitionTo(s, i, o) {
            if (this._state === i || this._state === o)
                ((this._state = s), s == q && (this._zoneDelegates = null));
            else
                throw new Error(
                    `${this.type} '${this.source}': can not transition to '${s}', expecting state '${i}'${o ? " or '" + o + "'" : ""}, was '${this._state}'.`,
                );
        }
        toString() {
            return this.data && typeof this.data.handleId < "u"
                ? this.data.handleId.toString()
                : Object.prototype.toString.call(this);
        }
        toJSON() {
            return {
                type: this.type,
                state: this.state,
                source: this.source,
                zone: this.zone.name,
                runCount: this.runCount,
            };
        }
    }
    let T = te("setTimeout"),
        p = te("Promise"),
        C = te("then"),
        _ = [],
        P = !1,
        I;
    function H(M) {
        if ((I || (ce[p] && (I = ce[p].resolve(0))), I)) {
            let s = I[C];
            (s || (s = I.then), s.call(I, M));
        } else ce[T](M, 0);
    }
    function U(M) {
        (K === 0 && _.length === 0 && H($), M && _.push(M));
    }
    function $() {
        if (!P) {
            for (P = !0; _.length; ) {
                let M = _;
                _ = [];
                for (let s = 0; s < M.length; s++) {
                    let i = M[s];
                    try {
                        i.zone.runTask(i, null, null);
                    } catch (o) {
                        w.onUnhandledError(o);
                    }
                }
            }
            (w.microtaskDrainDone(), (P = !1));
        }
    }
    let J = { name: "NO ZONE" },
        q = "notScheduled",
        k = "scheduling",
        d = "scheduled",
        A = "running",
        x = "canceling",
        X = "unknown",
        G = "microTask",
        y = "macroTask",
        z = "eventTask",
        S = {},
        w = {
            symbol: te,
            currentZoneFrame: () => b,
            onUnhandledError: W,
            microtaskDrainDone: W,
            scheduleMicroTask: U,
            showUncaughtError: () => !t[te("ignoreConsoleErrorUncaughtError")],
            patchEventTarget: () => [],
            patchOnProperties: W,
            patchMethod: () => W,
            bindArguments: () => [],
            patchThen: () => W,
            patchMacroTask: () => W,
            patchEventPrototype: () => W,
            isIEOrEdge: () => !1,
            getGlobalObjects: () => {},
            ObjectDefineProperty: () => W,
            ObjectGetOwnPropertyDescriptor: () => {},
            ObjectCreate: () => {},
            ArraySlice: () => [],
            patchClass: () => W,
            wrapWithCurrentZone: () => W,
            filterProperties: () => [],
            attachOriginToPatched: () => W,
            _redefineProperty: () => W,
            patchCallbacks: () => W,
            nativeScheduleMicroTask: H,
        },
        b = { parent: null, zone: new t(null, null) },
        D = null,
        K = 0;
    function W() {}
    return (a("Zone", "Zone"), t);
}
function _t() {
    let e = globalThis,
        n = e[te("forceDuplicateZoneCheck")] === !0;
    if (e.Zone && (n || typeof e.Zone.__symbol__ != "function"))
        throw new Error("Zone already loaded.");
    return ((e.Zone ??= dt()), e.Zone);
}
var be = Object.getOwnPropertyDescriptor,
    Ae = Object.defineProperty,
    je = Object.getPrototypeOf,
    Et = Object.create,
    Tt = Array.prototype.slice,
    He = "addEventListener",
    xe = "removeEventListener",
    Le = te(He),
    Ie = te(xe),
    ae = "true",
    le = "false",
    Pe = te("");
function Ve(e, n) {
    return Zone.current.wrap(e, n);
}
function Ge(e, n, a, t, c) {
    return Zone.current.scheduleMacroTask(e, n, a, t, c);
}
var j = te,
    De = typeof window < "u",
    pe = De ? window : void 0,
    Y = (De && pe) || globalThis,
    gt = "removeAttribute";
function Fe(e, n) {
    for (let a = e.length - 1; a >= 0; a--)
        typeof e[a] == "function" && (e[a] = Ve(e[a], n + "_" + a));
    return e;
}
function yt(e, n) {
    let a = e.constructor.name;
    for (let t = 0; t < n.length; t++) {
        let c = n[t],
            f = e[c];
        if (f) {
            let E = be(e, c);
            if (!tt(E)) continue;
            e[c] = ((T) => {
                let p = function () {
                    return T.apply(this, Fe(arguments, a + "." + c));
                };
                return (fe(p, T), p);
            })(f);
        }
    }
}
function tt(e) {
    return e
        ? e.writable === !1
            ? !1
            : !(typeof e.get == "function" && typeof e.set > "u")
        : !0;
}
var nt = typeof WorkerGlobalScope < "u" && self instanceof WorkerGlobalScope,
    Se =
        !("nw" in Y) &&
        typeof Y.process < "u" &&
        Y.process.toString() === "[object process]",
    Be = !Se && !nt && !!(De && pe.HTMLElement),
    rt =
        typeof Y.process < "u" &&
        Y.process.toString() === "[object process]" &&
        !nt &&
        !!(De && pe.HTMLElement),
    Ce = {},
    mt = j("enable_beforeunload"),
    Ye = function (e) {
        if (((e = e || Y.event), !e)) return;
        let n = Ce[e.type];
        n || (n = Ce[e.type] = j("ON_PROPERTY" + e.type));
        let a = this || e.target || Y,
            t = a[n],
            c;
        if (Be && a === pe && e.type === "error") {
            let f = e;
            ((c =
                t &&
                t.call(
                    this,
                    f.message,
                    f.filename,
                    f.lineno,
                    f.colno,
                    f.error,
                )),
                c === !0 && e.preventDefault());
        } else
            ((c = t && t.apply(this, arguments)),
                e.type === "beforeunload" && Y[mt] && typeof c == "string"
                    ? (e.returnValue = c)
                    : c != null && !c && e.preventDefault());
        return c;
    };
function $e(e, n, a) {
    let t = be(e, n);
    if (
        (!t && a && be(a, n) && (t = { enumerable: !0, configurable: !0 }),
        !t || !t.configurable)
    )
        return;
    let c = j("on" + n + "patched");
    if (e.hasOwnProperty(c) && e[c]) return;
    (delete t.writable, delete t.value);
    let f = t.get,
        E = t.set,
        T = n.slice(2),
        p = Ce[T];
    (p || (p = Ce[T] = j("ON_PROPERTY" + T)),
        (t.set = function (C) {
            let _ = this;
            if ((!_ && e === Y && (_ = Y), !_)) return;
            (typeof _[p] == "function" && _.removeEventListener(T, Ye),
                E && E.call(_, null),
                (_[p] = C),
                typeof C == "function" && _.addEventListener(T, Ye, !1));
        }),
        (t.get = function () {
            let C = this;
            if ((!C && e === Y && (C = Y), !C)) return null;
            let _ = C[p];
            if (_) return _;
            if (f) {
                let P = f.call(this);
                if (P)
                    return (
                        t.set.call(this, P),
                        typeof C[gt] == "function" && C.removeAttribute(n),
                        P
                    );
            }
            return null;
        }),
        Ae(e, n, t),
        (e[c] = !0));
}
function ot(e, n, a) {
    if (n) for (let t = 0; t < n.length; t++) $e(e, "on" + n[t], a);
    else {
        let t = [];
        for (let c in e) c.slice(0, 2) == "on" && t.push(c);
        for (let c = 0; c < t.length; c++) $e(e, t[c], a);
    }
}
var oe = j("originalInstance");
function ve(e) {
    let n = Y[e];
    if (!n) return;
    ((Y[j(e)] = n),
        (Y[e] = function () {
            let c = Fe(arguments, e);
            switch (c.length) {
                case 0:
                    this[oe] = new n();
                    break;
                case 1:
                    this[oe] = new n(c[0]);
                    break;
                case 2:
                    this[oe] = new n(c[0], c[1]);
                    break;
                case 3:
                    this[oe] = new n(c[0], c[1], c[2]);
                    break;
                case 4:
                    this[oe] = new n(c[0], c[1], c[2], c[3]);
                    break;
                default:
                    throw new Error("Arg list too long.");
            }
        }),
        fe(Y[e], n));
    let a = new n(function () {}),
        t;
    for (t in a)
        (e === "XMLHttpRequest" && t === "responseBlob") ||
            (function (c) {
                typeof a[c] == "function"
                    ? (Y[e].prototype[c] = function () {
                          return this[oe][c].apply(this[oe], arguments);
                      })
                    : Ae(Y[e].prototype, c, {
                          set: function (f) {
                              typeof f == "function"
                                  ? ((this[oe][c] = Ve(f, e + "." + c)),
                                    fe(this[oe][c], f))
                                  : (this[oe][c] = f);
                          },
                          get: function () {
                              return this[oe][c];
                          },
                      });
            })(t);
    for (t in n) t !== "prototype" && n.hasOwnProperty(t) && (Y[e][t] = n[t]);
}
function ue(e, n, a) {
    let t = e;
    for (; t && !t.hasOwnProperty(n); ) t = je(t);
    !t && e[n] && (t = e);
    let c = j(n),
        f = null;
    if (t && (!(f = t[c]) || !t.hasOwnProperty(c))) {
        f = t[c] = t[n];
        let E = t && be(t, n);
        if (tt(E)) {
            let T = a(f, c, n);
            ((t[n] = function () {
                return T(this, arguments);
            }),
                fe(t[n], f));
        }
    }
    return f;
}
function pt(e, n, a) {
    let t = null;
    function c(f) {
        let E = f.data;
        return (
            (E.args[E.cbIdx] = function () {
                f.invoke.apply(this, arguments);
            }),
            t.apply(E.target, E.args),
            f
        );
    }
    t = ue(
        e,
        n,
        (f) =>
            function (E, T) {
                let p = a(E, T);
                return p.cbIdx >= 0 && typeof T[p.cbIdx] == "function"
                    ? Ge(p.name, T[p.cbIdx], p, c)
                    : f.apply(E, T);
            },
    );
}
function fe(e, n) {
    e[j("OriginalDelegate")] = n;
}
var Je = !1,
    Me = !1;
function kt() {
    try {
        let e = pe.navigator.userAgent;
        if (e.indexOf("MSIE ") !== -1 || e.indexOf("Trident/") !== -1)
            return !0;
    } catch {}
    return !1;
}
function vt() {
    if (Je) return Me;
    Je = !0;
    try {
        let e = pe.navigator.userAgent;
        (e.indexOf("MSIE ") !== -1 ||
            e.indexOf("Trident/") !== -1 ||
            e.indexOf("Edge/") !== -1) &&
            (Me = !0);
    } catch {}
    return Me;
}
function Ke(e) {
    return typeof e == "function";
}
function Qe(e) {
    return typeof e == "number";
}
var me = !1;
if (typeof window < "u")
    try {
        let e = Object.defineProperty({}, "passive", {
            get: function () {
                me = !0;
            },
        });
        (window.addEventListener("test", e, e),
            window.removeEventListener("test", e, e));
    } catch {
        me = !1;
    }
var bt = { useG: !0 },
    ne = {},
    st = {},
    it = new RegExp("^" + Pe + "(\\w+)(true|false)$"),
    ct = j("propagationStopped");
function at(e, n) {
    let a = (n ? n(e) : e) + le,
        t = (n ? n(e) : e) + ae,
        c = Pe + a,
        f = Pe + t;
    ((ne[e] = {}), (ne[e][le] = c), (ne[e][ae] = f));
}
function Pt(e, n, a, t) {
    let c = (t && t.add) || He,
        f = (t && t.rm) || xe,
        E = (t && t.listeners) || "eventListeners",
        T = (t && t.rmAll) || "removeAllListeners",
        p = j(c),
        C = "." + c + ":",
        _ = "prependListener",
        P = "." + _ + ":",
        I = function (k, d, A) {
            if (k.isRemoved) return;
            let x = k.callback;
            typeof x == "object" &&
                x.handleEvent &&
                ((k.callback = (y) => x.handleEvent(y)),
                (k.originalDelegate = x));
            let X;
            try {
                k.invoke(k, d, [A]);
            } catch (y) {
                X = y;
            }
            let G = k.options;
            if (G && typeof G == "object" && G.once) {
                let y = k.originalDelegate ? k.originalDelegate : k.callback;
                d[f].call(d, A.type, y, G);
            }
            return X;
        };
    function H(k, d, A) {
        if (((d = d || e.event), !d)) return;
        let x = k || d.target || e,
            X = x[ne[d.type][A ? ae : le]];
        if (X) {
            let G = [];
            if (X.length === 1) {
                let y = I(X[0], x, d);
                y && G.push(y);
            } else {
                let y = X.slice();
                for (let z = 0; z < y.length && !(d && d[ct] === !0); z++) {
                    let S = I(y[z], x, d);
                    S && G.push(S);
                }
            }
            if (G.length === 1) throw G[0];
            for (let y = 0; y < G.length; y++) {
                let z = G[y];
                n.nativeScheduleMicroTask(() => {
                    throw z;
                });
            }
        }
    }
    let U = function (k) {
            return H(this, k, !1);
        },
        $ = function (k) {
            return H(this, k, !0);
        };
    function J(k, d) {
        if (!k) return !1;
        let A = !0;
        d && d.useG !== void 0 && (A = d.useG);
        let x = d && d.vh,
            X = !0;
        d && d.chkDup !== void 0 && (X = d.chkDup);
        let G = !1;
        d && d.rt !== void 0 && (G = d.rt);
        let y = k;
        for (; y && !y.hasOwnProperty(c); ) y = je(y);
        if ((!y && k[c] && (y = k), !y || y[p])) return !1;
        let z = d && d.eventNameToString,
            S = {},
            w = (y[p] = y[c]),
            b = (y[j(f)] = y[f]),
            D = (y[j(E)] = y[E]),
            K = (y[j(T)] = y[T]),
            W;
        d && d.prepend && (W = y[j(d.prepend)] = y[d.prepend]);
        function M(r, u) {
            return !me && typeof r == "object" && r
                ? !!r.capture
                : !me || !u
                  ? r
                  : typeof r == "boolean"
                    ? { capture: r, passive: !0 }
                    : r
                      ? typeof r == "object" && r.passive !== !1
                          ? { ...r, passive: !0 }
                          : r
                      : { passive: !0 };
        }
        let s = function (r) {
                if (!S.isExisting)
                    return w.call(
                        S.target,
                        S.eventName,
                        S.capture ? $ : U,
                        S.options,
                    );
            },
            i = function (r) {
                if (!r.isRemoved) {
                    let u = ne[r.eventName],
                        v;
                    u && (v = u[r.capture ? ae : le]);
                    let R = v && r.target[v];
                    if (R) {
                        for (let m = 0; m < R.length; m++)
                            if (R[m] === r) {
                                (R.splice(m, 1),
                                    (r.isRemoved = !0),
                                    r.removeAbortListener &&
                                        (r.removeAbortListener(),
                                        (r.removeAbortListener = null)),
                                    R.length === 0 &&
                                        ((r.allRemoved = !0),
                                        (r.target[v] = null)));
                                break;
                            }
                    }
                }
                if (r.allRemoved)
                    return b.call(
                        r.target,
                        r.eventName,
                        r.capture ? $ : U,
                        r.options,
                    );
            },
            o = function (r) {
                return w.call(S.target, S.eventName, r.invoke, S.options);
            },
            g = function (r) {
                return W.call(S.target, S.eventName, r.invoke, S.options);
            },
            V = function (r) {
                return b.call(r.target, r.eventName, r.invoke, r.options);
            },
            ee = A ? s : o,
            Z = A ? i : V,
            he = function (r, u) {
                let v = typeof u;
                return (
                    (v === "function" && r.callback === u) ||
                    (v === "object" && r.originalDelegate === u)
                );
            },
            _e = d && d.diff ? d.diff : he,
            Q = Zone[j("UNPATCHED_EVENTS")],
            Ee = e[j("PASSIVE_EVENTS")];
        function h(r) {
            if (typeof r == "object" && r !== null) {
                let u = { ...r };
                return (r.signal && (u.signal = r.signal), u);
            }
            return r;
        }
        let l = function (r, u, v, R, m = !1, O = !1) {
            return function () {
                let N = this || e,
                    L = arguments[0];
                d && d.transferEventName && (L = d.transferEventName(L));
                let F = arguments[1];
                if (!F) return r.apply(this, arguments);
                if (Se && L === "uncaughtException")
                    return r.apply(this, arguments);
                let B = !1;
                if (typeof F != "function") {
                    if (!F.handleEvent) return r.apply(this, arguments);
                    B = !0;
                }
                if (x && !x(r, F, N, arguments)) return;
                let de = me && !!Ee && Ee.indexOf(L) !== -1,
                    se = h(M(arguments[2], de)),
                    Te = se?.signal;
                if (Te?.aborted) return;
                if (Q) {
                    for (let ie = 0; ie < Q.length; ie++)
                        if (L === Q[ie])
                            return de
                                ? r.call(N, L, F, se)
                                : r.apply(this, arguments);
                }
                let Oe = se ? (typeof se == "boolean" ? !0 : se.capture) : !1,
                    Ue = se && typeof se == "object" ? se.once : !1,
                    ht = Zone.current,
                    Ne = ne[L];
                Ne || (at(L, z), (Ne = ne[L]));
                let ze = Ne[Oe ? ae : le],
                    ge = N[ze],
                    We = !1;
                if (ge) {
                    if (((We = !0), X)) {
                        for (let ie = 0; ie < ge.length; ie++)
                            if (_e(ge[ie], F)) return;
                    }
                } else ge = N[ze] = [];
                let we,
                    qe = N.constructor.name,
                    Xe = st[qe];
                (Xe && (we = Xe[L]),
                    we || (we = qe + u + (z ? z(L) : L)),
                    (S.options = se),
                    Ue && (S.options.once = !1),
                    (S.target = N),
                    (S.capture = Oe),
                    (S.eventName = L),
                    (S.isExisting = We));
                let ke = A ? bt : void 0;
                (ke && (ke.taskData = S), Te && (S.options.signal = void 0));
                let re = ht.scheduleEventTask(we, F, ke, v, R);
                if (Te) {
                    S.options.signal = Te;
                    let ie = () => re.zone.cancelTask(re);
                    (r.call(Te, "abort", ie, { once: !0 }),
                        (re.removeAbortListener = () =>
                            Te.removeEventListener("abort", ie)));
                }
                if (
                    ((S.target = null),
                    ke && (ke.taskData = null),
                    Ue && (S.options.once = !0),
                    (!me && typeof re.options == "boolean") ||
                        (re.options = se),
                    (re.target = N),
                    (re.capture = Oe),
                    (re.eventName = L),
                    B && (re.originalDelegate = F),
                    O ? ge.unshift(re) : ge.push(re),
                    m)
                )
                    return N;
            };
        };
        return (
            (y[c] = l(w, C, ee, Z, G)),
            W && (y[_] = l(W, P, g, Z, G, !0)),
            (y[f] = function () {
                let r = this || e,
                    u = arguments[0];
                d && d.transferEventName && (u = d.transferEventName(u));
                let v = arguments[2],
                    R = v ? (typeof v == "boolean" ? !0 : v.capture) : !1,
                    m = arguments[1];
                if (!m) return b.apply(this, arguments);
                if (x && !x(b, m, r, arguments)) return;
                let O = ne[u],
                    N;
                O && (N = O[R ? ae : le]);
                let L = N && r[N];
                if (L)
                    for (let F = 0; F < L.length; F++) {
                        let B = L[F];
                        if (_e(B, m)) {
                            if (
                                (L.splice(F, 1),
                                (B.isRemoved = !0),
                                L.length === 0 &&
                                    ((B.allRemoved = !0),
                                    (r[N] = null),
                                    !R && typeof u == "string"))
                            ) {
                                let de = Pe + "ON_PROPERTY" + u;
                                r[de] = null;
                            }
                            return (B.zone.cancelTask(B), G ? r : void 0);
                        }
                    }
                return b.apply(this, arguments);
            }),
            (y[E] = function () {
                let r = this || e,
                    u = arguments[0];
                d && d.transferEventName && (u = d.transferEventName(u));
                let v = [],
                    R = lt(r, z ? z(u) : u);
                for (let m = 0; m < R.length; m++) {
                    let O = R[m],
                        N = O.originalDelegate
                            ? O.originalDelegate
                            : O.callback;
                    v.push(N);
                }
                return v;
            }),
            (y[T] = function () {
                let r = this || e,
                    u = arguments[0];
                if (u) {
                    d && d.transferEventName && (u = d.transferEventName(u));
                    let v = ne[u];
                    if (v) {
                        let R = v[le],
                            m = v[ae],
                            O = r[R],
                            N = r[m];
                        if (O) {
                            let L = O.slice();
                            for (let F = 0; F < L.length; F++) {
                                let B = L[F],
                                    de = B.originalDelegate
                                        ? B.originalDelegate
                                        : B.callback;
                                this[f].call(this, u, de, B.options);
                            }
                        }
                        if (N) {
                            let L = N.slice();
                            for (let F = 0; F < L.length; F++) {
                                let B = L[F],
                                    de = B.originalDelegate
                                        ? B.originalDelegate
                                        : B.callback;
                                this[f].call(this, u, de, B.options);
                            }
                        }
                    }
                } else {
                    let v = Object.keys(r);
                    for (let R = 0; R < v.length; R++) {
                        let m = v[R],
                            O = it.exec(m),
                            N = O && O[1];
                        N && N !== "removeListener" && this[T].call(this, N);
                    }
                    this[T].call(this, "removeListener");
                }
                if (G) return this;
            }),
            fe(y[c], w),
            fe(y[f], b),
            K && fe(y[T], K),
            D && fe(y[E], D),
            !0
        );
    }
    let q = [];
    for (let k = 0; k < a.length; k++) q[k] = J(a[k], t);
    return q;
}
function lt(e, n) {
    if (!n) {
        let f = [];
        for (let E in e) {
            let T = it.exec(E),
                p = T && T[1];
            if (p && (!n || p === n)) {
                let C = e[E];
                if (C) for (let _ = 0; _ < C.length; _++) f.push(C[_]);
            }
        }
        return f;
    }
    let a = ne[n];
    a || (at(n), (a = ne[n]));
    let t = e[a[le]],
        c = e[a[ae]];
    return t ? (c ? t.concat(c) : t.slice()) : c ? c.slice() : [];
}
function wt(e, n) {
    let a = e.Event;
    a &&
        a.prototype &&
        n.patchMethod(
            a.prototype,
            "stopImmediatePropagation",
            (t) =>
                function (c, f) {
                    ((c[ct] = !0), t && t.apply(c, f));
                },
        );
}
function Rt(e, n) {
    n.patchMethod(
        e,
        "queueMicrotask",
        (a) =>
            function (t, c) {
                Zone.current.scheduleMicroTask("queueMicrotask", c[0]);
            },
    );
}
var Re = j("zoneTask");
function ye(e, n, a, t) {
    let c = null,
        f = null;
    ((n += t), (a += t));
    let E = {};
    function T(C) {
        let _ = C.data;
        _.args[0] = function () {
            return C.invoke.apply(this, arguments);
        };
        let P = c.apply(e, _.args);
        return (
            Qe(P)
                ? (_.handleId = P)
                : ((_.handle = P), (_.isRefreshable = Ke(P.refresh))),
            C
        );
    }
    function p(C) {
        let { handle: _, handleId: P } = C.data;
        return f.call(e, _ ?? P);
    }
    ((c = ue(
        e,
        n,
        (C) =>
            function (_, P) {
                if (Ke(P[0])) {
                    let I = {
                            isRefreshable: !1,
                            isPeriodic: t === "Interval",
                            delay:
                                t === "Timeout" || t === "Interval"
                                    ? P[1] || 0
                                    : void 0,
                            args: P,
                        },
                        H = P[0];
                    P[0] = function () {
                        try {
                            return H.apply(this, arguments);
                        } finally {
                            let {
                                handle: A,
                                handleId: x,
                                isPeriodic: X,
                                isRefreshable: G,
                            } = I;
                            !X && !G && (x ? delete E[x] : A && (A[Re] = null));
                        }
                    };
                    let U = Ge(n, P[0], I, T, p);
                    if (!U) return U;
                    let {
                        handleId: $,
                        handle: J,
                        isRefreshable: q,
                        isPeriodic: k,
                    } = U.data;
                    if ($) E[$] = U;
                    else if (J && ((J[Re] = U), q && !k)) {
                        let d = J.refresh;
                        J.refresh = function () {
                            let { zone: A, state: x } = U;
                            return (
                                x === "notScheduled"
                                    ? ((U._state = "scheduled"),
                                      A._updateTaskCount(U, 1))
                                    : x === "running" &&
                                      (U._state = "scheduling"),
                                d.call(this)
                            );
                        };
                    }
                    return J ?? $ ?? U;
                } else return C.apply(e, P);
            },
    )),
        (f = ue(
            e,
            a,
            (C) =>
                function (_, P) {
                    let I = P[0],
                        H;
                    (Qe(I)
                        ? ((H = E[I]), delete E[I])
                        : ((H = I?.[Re]), H ? (I[Re] = null) : (H = I)),
                        H?.type
                            ? H.cancelFn && H.zone.cancelTask(H)
                            : C.apply(e, P));
                },
        )));
}
function Ct(e, n) {
    let { isBrowser: a, isMix: t } = n.getGlobalObjects();
    if ((!a && !t) || !e.customElements || !("customElements" in e)) return;
    let c = [
        "connectedCallback",
        "disconnectedCallback",
        "adoptedCallback",
        "attributeChangedCallback",
        "formAssociatedCallback",
        "formDisabledCallback",
        "formResetCallback",
        "formStateRestoreCallback",
    ];
    n.patchCallbacks(n, e.customElements, "customElements", "define", c);
}
function Dt(e, n) {
    if (Zone[n.symbol("patchEventTarget")]) return;
    let {
        eventNames: a,
        zoneSymbolEventNames: t,
        TRUE_STR: c,
        FALSE_STR: f,
        ZONE_SYMBOL_PREFIX: E,
    } = n.getGlobalObjects();
    for (let p = 0; p < a.length; p++) {
        let C = a[p],
            _ = C + f,
            P = C + c,
            I = E + _,
            H = E + P;
        ((t[C] = {}), (t[C][f] = I), (t[C][c] = H));
    }
    let T = e.EventTarget;
    if (!(!T || !T.prototype))
        return (n.patchEventTarget(e, n, [T && T.prototype]), !0);
}
function St(e, n) {
    n.patchEventPrototype(e, n);
}
function ut(e, n, a) {
    if (!a || a.length === 0) return n;
    let t = a.filter((f) => f.target === e);
    if (!t || t.length === 0) return n;
    let c = t[0].ignoreProperties;
    return n.filter((f) => c.indexOf(f) === -1);
}
function et(e, n, a, t) {
    if (!e) return;
    let c = ut(e, n, a);
    ot(e, c, t);
}
function Ze(e) {
    return Object.getOwnPropertyNames(e)
        .filter((n) => n.startsWith("on") && n.length > 2)
        .map((n) => n.substring(2));
}
function Ot(e, n) {
    if ((Se && !rt) || Zone[e.symbol("patchEvents")]) return;
    let a = n.__Zone_ignore_on_properties,
        t = [];
    if (Be) {
        let c = window;
        t = t.concat([
            "Document",
            "SVGElement",
            "Element",
            "HTMLElement",
            "HTMLBodyElement",
            "HTMLMediaElement",
            "HTMLFrameSetElement",
            "HTMLFrameElement",
            "HTMLIFrameElement",
            "HTMLMarqueeElement",
            "Worker",
        ]);
        let f = kt() ? [{ target: c, ignoreProperties: ["error"] }] : [];
        et(c, Ze(c), a && a.concat(f), je(c));
    }
    t = t.concat([
        "XMLHttpRequest",
        "XMLHttpRequestEventTarget",
        "IDBIndex",
        "IDBRequest",
        "IDBOpenDBRequest",
        "IDBDatabase",
        "IDBTransaction",
        "IDBCursor",
        "WebSocket",
    ]);
    for (let c = 0; c < t.length; c++) {
        let f = n[t[c]];
        f && f.prototype && et(f.prototype, Ze(f.prototype), a);
    }
}
function Nt(e) {
    (e.__load_patch("legacy", (n) => {
        let a = n[e.__symbol__("legacyPatch")];
        a && a();
    }),
        e.__load_patch("timers", (n) => {
            let a = "set",
                t = "clear";
            (ye(n, a, t, "Timeout"),
                ye(n, a, t, "Interval"),
                ye(n, a, t, "Immediate"));
        }),
        e.__load_patch("requestAnimationFrame", (n) => {
            (ye(n, "request", "cancel", "AnimationFrame"),
                ye(n, "mozRequest", "mozCancel", "AnimationFrame"),
                ye(n, "webkitRequest", "webkitCancel", "AnimationFrame"));
        }),
        e.__load_patch("blocking", (n, a) => {
            let t = ["alert", "prompt", "confirm"];
            for (let c = 0; c < t.length; c++) {
                let f = t[c];
                ue(
                    n,
                    f,
                    (E, T, p) =>
                        function (C, _) {
                            return a.current.run(E, n, _, p);
                        },
                );
            }
        }),
        e.__load_patch("EventTarget", (n, a, t) => {
            (St(n, t), Dt(n, t));
            let c = n.XMLHttpRequestEventTarget;
            c && c.prototype && t.patchEventTarget(n, t, [c.prototype]);
        }),
        e.__load_patch("MutationObserver", (n, a, t) => {
            (ve("MutationObserver"), ve("WebKitMutationObserver"));
        }),
        e.__load_patch("IntersectionObserver", (n, a, t) => {
            ve("IntersectionObserver");
        }),
        e.__load_patch("FileReader", (n, a, t) => {
            ve("FileReader");
        }),
        e.__load_patch("on_property", (n, a, t) => {
            Ot(t, n);
        }),
        e.__load_patch("customElements", (n, a, t) => {
            Ct(n, t);
        }),
        e.__load_patch("XHR", (n, a) => {
            C(n);
            let t = j("xhrTask"),
                c = j("xhrSync"),
                f = j("xhrListener"),
                E = j("xhrScheduled"),
                T = j("xhrURL"),
                p = j("xhrErrorBeforeScheduled");
            function C(_) {
                let P = _.XMLHttpRequest;
                if (!P) return;
                let I = P.prototype;
                function H(w) {
                    return w[t];
                }
                let U = I[Le],
                    $ = I[Ie];
                if (!U) {
                    let w = _.XMLHttpRequestEventTarget;
                    if (w) {
                        let b = w.prototype;
                        ((U = b[Le]), ($ = b[Ie]));
                    }
                }
                let J = "readystatechange",
                    q = "scheduled";
                function k(w) {
                    let b = w.data,
                        D = b.target;
                    ((D[E] = !1), (D[p] = !1));
                    let K = D[f];
                    (U || ((U = D[Le]), ($ = D[Ie])), K && $.call(D, J, K));
                    let W = (D[f] = () => {
                        if (D.readyState === D.DONE)
                            if (!b.aborted && D[E] && w.state === q) {
                                let s = D[a.__symbol__("loadfalse")];
                                if (D.status !== 0 && s && s.length > 0) {
                                    let i = w.invoke;
                                    ((w.invoke = function () {
                                        let o = D[a.__symbol__("loadfalse")];
                                        for (let g = 0; g < o.length; g++)
                                            o[g] === w && o.splice(g, 1);
                                        !b.aborted &&
                                            w.state === q &&
                                            i.call(w);
                                    }),
                                        s.push(w));
                                } else w.invoke();
                            } else !b.aborted && D[E] === !1 && (D[p] = !0);
                    });
                    return (
                        U.call(D, J, W),
                        D[t] || (D[t] = w),
                        z.apply(D, b.args),
                        (D[E] = !0),
                        w
                    );
                }
                function d() {}
                function A(w) {
                    let b = w.data;
                    return ((b.aborted = !0), S.apply(b.target, b.args));
                }
                let x = ue(
                        I,
                        "open",
                        () =>
                            function (w, b) {
                                return (
                                    (w[c] = b[2] == !1),
                                    (w[T] = b[1]),
                                    x.apply(w, b)
                                );
                            },
                    ),
                    X = "XMLHttpRequest.send",
                    G = j("fetchTaskAborting"),
                    y = j("fetchTaskScheduling"),
                    z = ue(
                        I,
                        "send",
                        () =>
                            function (w, b) {
                                if (a.current[y] === !0 || w[c])
                                    return z.apply(w, b);
                                {
                                    let D = {
                                            target: w,
                                            url: w[T],
                                            isPeriodic: !1,
                                            args: b,
                                            aborted: !1,
                                        },
                                        K = Ge(X, d, D, k, A);
                                    w &&
                                        w[p] === !0 &&
                                        !D.aborted &&
                                        K.state === q &&
                                        K.invoke();
                                }
                            },
                    ),
                    S = ue(
                        I,
                        "abort",
                        () =>
                            function (w, b) {
                                let D = H(w);
                                if (D && typeof D.type == "string") {
                                    if (
                                        D.cancelFn == null ||
                                        (D.data && D.data.aborted)
                                    )
                                        return;
                                    D.zone.cancelTask(D);
                                } else if (a.current[G] === !0)
                                    return S.apply(w, b);
                            },
                    );
            }
        }),
        e.__load_patch("geolocation", (n) => {
            n.navigator &&
                n.navigator.geolocation &&
                yt(n.navigator.geolocation, [
                    "getCurrentPosition",
                    "watchPosition",
                ]);
        }),
        e.__load_patch("PromiseRejectionEvent", (n, a) => {
            function t(c) {
                return function (f) {
                    lt(n, c).forEach((T) => {
                        let p = n.PromiseRejectionEvent;
                        if (p) {
                            let C = new p(c, {
                                promise: f.promise,
                                reason: f.rejection,
                            });
                            T.invoke(C);
                        }
                    });
                };
            }
            n.PromiseRejectionEvent &&
                ((a[j("unhandledPromiseRejectionHandler")] =
                    t("unhandledrejection")),
                (a[j("rejectionHandledHandler")] = t("rejectionhandled")));
        }),
        e.__load_patch("queueMicrotask", (n, a, t) => {
            Rt(n, t);
        }));
}
function Lt(e) {
    e.__load_patch("ZoneAwarePromise", (n, a, t) => {
        let c = Object.getOwnPropertyDescriptor,
            f = Object.defineProperty;
        function E(h) {
            if (h && h.toString === Object.prototype.toString) {
                let l = h.constructor && h.constructor.name;
                return (l || "") + ": " + JSON.stringify(h);
            }
            return h ? h.toString() : Object.prototype.toString.call(h);
        }
        let T = t.symbol,
            p = [],
            C = n[T("DISABLE_WRAPPING_UNCAUGHT_PROMISE_REJECTION")] !== !1,
            _ = T("Promise"),
            P = T("then"),
            I = "__creationTrace__";
        ((t.onUnhandledError = (h) => {
            if (t.showUncaughtError()) {
                let l = h && h.rejection;
                l
                    ? console.error(
                          "Unhandled Promise rejection:",
                          l instanceof Error ? l.message : l,
                          "; Zone:",
                          h.zone.name,
                          "; Task:",
                          h.task && h.task.source,
                          "; Value:",
                          l,
                          l instanceof Error ? l.stack : void 0,
                      )
                    : console.error(h);
            }
        }),
            (t.microtaskDrainDone = () => {
                for (; p.length; ) {
                    let h = p.shift();
                    try {
                        h.zone.runGuarded(() => {
                            throw h.throwOriginal ? h.rejection : h;
                        });
                    } catch (l) {
                        U(l);
                    }
                }
            }));
        let H = T("unhandledPromiseRejectionHandler");
        function U(h) {
            t.onUnhandledError(h);
            try {
                let l = a[H];
                typeof l == "function" && l.call(this, h);
            } catch {}
        }
        function $(h) {
            return h && h.then;
        }
        function J(h) {
            return h;
        }
        function q(h) {
            return Z.reject(h);
        }
        let k = T("state"),
            d = T("value"),
            A = T("finally"),
            x = T("parentPromiseValue"),
            X = T("parentPromiseState"),
            G = "Promise.then",
            y = null,
            z = !0,
            S = !1,
            w = 0;
        function b(h, l) {
            return (r) => {
                try {
                    M(h, l, r);
                } catch (u) {
                    M(h, !1, u);
                }
            };
        }
        let D = function () {
                let h = !1;
                return function (r) {
                    return function () {
                        h || ((h = !0), r.apply(null, arguments));
                    };
                };
            },
            K = "Promise resolved with itself",
            W = T("currentTaskTrace");
        function M(h, l, r) {
            let u = D();
            if (h === r) throw new TypeError(K);
            if (h[k] === y) {
                let v = null;
                try {
                    (typeof r == "object" || typeof r == "function") &&
                        (v = r && r.then);
                } catch (R) {
                    return (
                        u(() => {
                            M(h, !1, R);
                        })(),
                        h
                    );
                }
                if (
                    l !== S &&
                    r instanceof Z &&
                    r.hasOwnProperty(k) &&
                    r.hasOwnProperty(d) &&
                    r[k] !== y
                )
                    (i(r), M(h, r[k], r[d]));
                else if (l !== S && typeof v == "function")
                    try {
                        v.call(r, u(b(h, l)), u(b(h, !1)));
                    } catch (R) {
                        u(() => {
                            M(h, !1, R);
                        })();
                    }
                else {
                    h[k] = l;
                    let R = h[d];
                    if (
                        ((h[d] = r),
                        h[A] === A && l === z && ((h[k] = h[X]), (h[d] = h[x])),
                        l === S && r instanceof Error)
                    ) {
                        let m =
                            a.currentTask &&
                            a.currentTask.data &&
                            a.currentTask.data[I];
                        m &&
                            f(r, W, {
                                configurable: !0,
                                enumerable: !1,
                                writable: !0,
                                value: m,
                            });
                    }
                    for (let m = 0; m < R.length; )
                        o(h, R[m++], R[m++], R[m++], R[m++]);
                    if (R.length == 0 && l == S) {
                        h[k] = w;
                        let m = r;
                        try {
                            throw new Error(
                                "Uncaught (in promise): " +
                                    E(r) +
                                    (r && r.stack
                                        ? `
` + r.stack
                                        : ""),
                            );
                        } catch (O) {
                            m = O;
                        }
                        (C && (m.throwOriginal = !0),
                            (m.rejection = r),
                            (m.promise = h),
                            (m.zone = a.current),
                            (m.task = a.currentTask),
                            p.push(m),
                            t.scheduleMicroTask());
                    }
                }
            }
            return h;
        }
        let s = T("rejectionHandledHandler");
        function i(h) {
            if (h[k] === w) {
                try {
                    let l = a[s];
                    l &&
                        typeof l == "function" &&
                        l.call(this, { rejection: h[d], promise: h });
                } catch {}
                h[k] = S;
                for (let l = 0; l < p.length; l++)
                    h === p[l].promise && p.splice(l, 1);
            }
        }
        function o(h, l, r, u, v) {
            i(h);
            let R = h[k],
                m = R
                    ? typeof u == "function"
                        ? u
                        : J
                    : typeof v == "function"
                      ? v
                      : q;
            l.scheduleMicroTask(
                G,
                () => {
                    try {
                        let O = h[d],
                            N = !!r && A === r[A];
                        N && ((r[x] = O), (r[X] = R));
                        let L = l.run(
                            m,
                            void 0,
                            N && m !== q && m !== J ? [] : [O],
                        );
                        M(r, !0, L);
                    } catch (O) {
                        M(r, !1, O);
                    }
                },
                r,
            );
        }
        let g = "function ZoneAwarePromise() { [native code] }",
            V = function () {},
            ee = n.AggregateError;
        class Z {
            static toString() {
                return g;
            }
            static resolve(l) {
                return l instanceof Z ? l : M(new this(null), z, l);
            }
            static reject(l) {
                return M(new this(null), S, l);
            }
            static withResolvers() {
                let l = {};
                return (
                    (l.promise = new Z((r, u) => {
                        ((l.resolve = r), (l.reject = u));
                    })),
                    l
                );
            }
            static any(l) {
                if (!l || typeof l[Symbol.iterator] != "function")
                    return Promise.reject(
                        new ee([], "All promises were rejected"),
                    );
                let r = [],
                    u = 0;
                try {
                    for (let m of l) (u++, r.push(Z.resolve(m)));
                } catch {
                    return Promise.reject(
                        new ee([], "All promises were rejected"),
                    );
                }
                if (u === 0)
                    return Promise.reject(
                        new ee([], "All promises were rejected"),
                    );
                let v = !1,
                    R = [];
                return new Z((m, O) => {
                    for (let N = 0; N < r.length; N++)
                        r[N].then(
                            (L) => {
                                v || ((v = !0), m(L));
                            },
                            (L) => {
                                (R.push(L),
                                    u--,
                                    u === 0 &&
                                        ((v = !0),
                                        O(
                                            new ee(
                                                R,
                                                "All promises were rejected",
                                            ),
                                        )));
                            },
                        );
                });
            }
            static race(l) {
                let r,
                    u,
                    v = new this((O, N) => {
                        ((r = O), (u = N));
                    });
                function R(O) {
                    r(O);
                }
                function m(O) {
                    u(O);
                }
                for (let O of l) ($(O) || (O = this.resolve(O)), O.then(R, m));
                return v;
            }
            static all(l) {
                return Z.allWithCallback(l);
            }
            static allSettled(l) {
                return (
                    this && this.prototype instanceof Z ? this : Z
                ).allWithCallback(l, {
                    thenCallback: (u) => ({ status: "fulfilled", value: u }),
                    errorCallback: (u) => ({ status: "rejected", reason: u }),
                });
            }
            static allWithCallback(l, r) {
                let u,
                    v,
                    R = new this((L, F) => {
                        ((u = L), (v = F));
                    }),
                    m = 2,
                    O = 0,
                    N = [];
                for (let L of l) {
                    $(L) || (L = this.resolve(L));
                    let F = O;
                    try {
                        L.then(
                            (B) => {
                                ((N[F] = r ? r.thenCallback(B) : B),
                                    m--,
                                    m === 0 && u(N));
                            },
                            (B) => {
                                r
                                    ? ((N[F] = r.errorCallback(B)),
                                      m--,
                                      m === 0 && u(N))
                                    : v(B);
                            },
                        );
                    } catch (B) {
                        v(B);
                    }
                    (m++, O++);
                }
                return ((m -= 2), m === 0 && u(N), R);
            }
            constructor(l) {
                let r = this;
                if (!(r instanceof Z))
                    throw new Error("Must be an instanceof Promise.");
                ((r[k] = y), (r[d] = []));
                try {
                    let u = D();
                    l && l(u(b(r, z)), u(b(r, S)));
                } catch (u) {
                    M(r, !1, u);
                }
            }
            get [Symbol.toStringTag]() {
                return "Promise";
            }
            get [Symbol.species]() {
                return Z;
            }
            then(l, r) {
                let u = this.constructor?.[Symbol.species];
                (!u || typeof u != "function") && (u = this.constructor || Z);
                let v = new u(V),
                    R = a.current;
                return (
                    this[k] == y
                        ? this[d].push(R, v, l, r)
                        : o(this, R, v, l, r),
                    v
                );
            }
            catch(l) {
                return this.then(null, l);
            }
            finally(l) {
                let r = this.constructor?.[Symbol.species];
                (!r || typeof r != "function") && (r = Z);
                let u = new r(V);
                u[A] = A;
                let v = a.current;
                return (
                    this[k] == y
                        ? this[d].push(v, u, l, l)
                        : o(this, v, u, l, l),
                    u
                );
            }
        }
        ((Z.resolve = Z.resolve),
            (Z.reject = Z.reject),
            (Z.race = Z.race),
            (Z.all = Z.all));
        let he = (n[_] = n.Promise);
        n.Promise = Z;
        let _e = T("thenPatched");
        function Q(h) {
            let l = h.prototype,
                r = c(l, "then");
            if (r && (r.writable === !1 || !r.configurable)) return;
            let u = l.then;
            ((l[P] = u),
                (h.prototype.then = function (v, R) {
                    return new Z((O, N) => {
                        u.call(this, O, N);
                    }).then(v, R);
                }),
                (h[_e] = !0));
        }
        t.patchThen = Q;
        function Ee(h) {
            return function (l, r) {
                let u = h.apply(l, r);
                if (u instanceof Z) return u;
                let v = u.constructor;
                return (v[_e] || Q(v), u);
            };
        }
        return (
            he && (Q(he), ue(n, "fetch", (h) => Ee(h))),
            (Promise[a.__symbol__("uncaughtPromiseErrors")] = p),
            Z
        );
    });
}
function It(e) {
    e.__load_patch("toString", (n) => {
        let a = Function.prototype.toString,
            t = j("OriginalDelegate"),
            c = j("Promise"),
            f = j("Error"),
            E = function () {
                if (typeof this == "function") {
                    let _ = this[t];
                    if (_)
                        return typeof _ == "function"
                            ? a.call(_)
                            : Object.prototype.toString.call(_);
                    if (this === Promise) {
                        let P = n[c];
                        if (P) return a.call(P);
                    }
                    if (this === Error) {
                        let P = n[f];
                        if (P) return a.call(P);
                    }
                }
                return a.call(this);
            };
        ((E[t] = a), (Function.prototype.toString = E));
        let T = Object.prototype.toString,
            p = "[object Promise]";
        Object.prototype.toString = function () {
            return typeof Promise == "function" && this instanceof Promise
                ? p
                : T.call(this);
        };
    });
}
function Mt(e, n, a, t, c) {
    let f = Zone.__symbol__(t);
    if (n[f]) return;
    let E = (n[f] = n[t]);
    ((n[t] = function (T, p, C) {
        return (
            p &&
                p.prototype &&
                c.forEach(function (_) {
                    let P = `${a}.${t}::` + _,
                        I = p.prototype;
                    try {
                        if (I.hasOwnProperty(_)) {
                            let H = e.ObjectGetOwnPropertyDescriptor(I, _);
                            H && H.value
                                ? ((H.value = e.wrapWithCurrentZone(
                                      H.value,
                                      P,
                                  )),
                                  e._redefineProperty(p.prototype, _, H))
                                : I[_] &&
                                  (I[_] = e.wrapWithCurrentZone(I[_], P));
                        } else I[_] && (I[_] = e.wrapWithCurrentZone(I[_], P));
                    } catch {}
                }),
            E.call(n, T, p, C)
        );
    }),
        e.attachOriginToPatched(n[t], E));
}
function Zt(e) {
    e.__load_patch("util", (n, a, t) => {
        let c = Ze(n);
        ((t.patchOnProperties = ot),
            (t.patchMethod = ue),
            (t.bindArguments = Fe),
            (t.patchMacroTask = pt));
        let f = a.__symbol__("BLACK_LISTED_EVENTS"),
            E = a.__symbol__("UNPATCHED_EVENTS");
        (n[E] && (n[f] = n[E]),
            n[f] && (a[f] = a[E] = n[f]),
            (t.patchEventPrototype = wt),
            (t.patchEventTarget = Pt),
            (t.isIEOrEdge = vt),
            (t.ObjectDefineProperty = Ae),
            (t.ObjectGetOwnPropertyDescriptor = be),
            (t.ObjectCreate = Et),
            (t.ArraySlice = Tt),
            (t.patchClass = ve),
            (t.wrapWithCurrentZone = Ve),
            (t.filterProperties = ut),
            (t.attachOriginToPatched = fe),
            (t._redefineProperty = Object.defineProperty),
            (t.patchCallbacks = Mt),
            (t.getGlobalObjects = () => ({
                globalSources: st,
                zoneSymbolEventNames: ne,
                eventNames: c,
                isBrowser: Be,
                isMix: rt,
                isNode: Se,
                TRUE_STR: ae,
                FALSE_STR: le,
                ZONE_SYMBOL_PREFIX: Pe,
                ADD_EVENT_LISTENER_STR: He,
                REMOVE_EVENT_LISTENER_STR: xe,
            })));
    });
}
function At(e) {
    (Lt(e), It(e), Zt(e));
}
var ft = _t();
At(ft);
Nt(ft);
