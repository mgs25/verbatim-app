var Hf = Object.defineProperty,
    zf = Object.defineProperties;
var qf = Object.getOwnPropertyDescriptors;
var za = Object.getOwnPropertySymbols;
var Gf = Object.prototype.hasOwnProperty,
    Wf = Object.prototype.propertyIsEnumerable;
var qa = (e, t, n) =>
        t in e
            ? Hf(e, t, {
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                  value: n,
              })
            : (e[t] = n),
    m = (e, t) => {
        for (var n in (t ||= {})) Gf.call(t, n) && qa(e, n, t[n]);
        if (za) for (var n of za(t)) Wf.call(t, n) && qa(e, n, t[n]);
        return e;
    },
    F = (e, t) => zf(e, qf(t));
function Zf(e, t) {
    return Object.is(e, t);
}
var $ = null,
    nr = !1,
    qo = 1,
    gt = Symbol("SIGNAL");
function R(e) {
    let t = $;
    return (($ = e), t);
}
function Wa() {
    return $;
}
var rr = {
    version: 0,
    lastCleanEpoch: 0,
    dirty: !1,
    producerNode: void 0,
    producerLastReadVersion: void 0,
    producerIndexOfThis: void 0,
    nextProducerIndex: 0,
    liveConsumerNode: void 0,
    liveConsumerIndexOfThis: void 0,
    consumerAllowSignalWrites: !1,
    consumerIsAlwaysLive: !1,
    kind: "unknown",
    producerMustRecompute: () => !1,
    producerRecomputeValue: () => {},
    consumerMarkedDirty: () => {},
    consumerOnSignalRead: () => {},
};
function Za(e) {
    if (nr) throw new Error("");
    if ($ === null) return;
    $.consumerOnSignalRead(e);
    let t = $.nextProducerIndex++;
    if (
        (ir($), t < $.producerNode.length && $.producerNode[t] !== e && rn($))
    ) {
        let n = $.producerNode[t];
        or(n, $.producerIndexOfThis[t]);
    }
    ($.producerNode[t] !== e &&
        (($.producerNode[t] = e),
        ($.producerIndexOfThis[t] = rn($) ? Ka(e, $, t) : 0)),
        ($.producerLastReadVersion[t] = e.version));
}
function Qf() {
    qo++;
}
function Yf(e) {
    if (!(rn(e) && !e.dirty) && !(!e.dirty && e.lastCleanEpoch === qo)) {
        if (!e.producerMustRecompute(e) && !Wo(e)) {
            Ga(e);
            return;
        }
        (e.producerRecomputeValue(e), Ga(e));
    }
}
function Qa(e) {
    if (e.liveConsumerNode === void 0) return;
    let t = nr;
    nr = !0;
    try {
        for (let n of e.liveConsumerNode) n.dirty || Jf(n);
    } finally {
        nr = t;
    }
}
function Kf() {
    return $?.consumerAllowSignalWrites !== !1;
}
function Jf(e) {
    ((e.dirty = !0), Qa(e), e.consumerMarkedDirty?.(e));
}
function Ga(e) {
    ((e.dirty = !1), (e.lastCleanEpoch = qo));
}
function Go(e) {
    return (e && (e.nextProducerIndex = 0), R(e));
}
function Ya(e, t) {
    if (
        (R(t),
        !(
            !e ||
            e.producerNode === void 0 ||
            e.producerIndexOfThis === void 0 ||
            e.producerLastReadVersion === void 0
        ))
    ) {
        if (rn(e))
            for (let n = e.nextProducerIndex; n < e.producerNode.length; n++)
                or(e.producerNode[n], e.producerIndexOfThis[n]);
        for (; e.producerNode.length > e.nextProducerIndex; )
            (e.producerNode.pop(),
                e.producerLastReadVersion.pop(),
                e.producerIndexOfThis.pop());
    }
}
function Wo(e) {
    ir(e);
    for (let t = 0; t < e.producerNode.length; t++) {
        let n = e.producerNode[t],
            r = e.producerLastReadVersion[t];
        if (r !== n.version || (Yf(n), r !== n.version)) return !0;
    }
    return !1;
}
function Zo(e) {
    if ((ir(e), rn(e)))
        for (let t = 0; t < e.producerNode.length; t++)
            or(e.producerNode[t], e.producerIndexOfThis[t]);
    ((e.producerNode.length =
        e.producerLastReadVersion.length =
        e.producerIndexOfThis.length =
            0),
        e.liveConsumerNode &&
            (e.liveConsumerNode.length = e.liveConsumerIndexOfThis.length = 0));
}
function Ka(e, t, n) {
    if ((Ja(e), e.liveConsumerNode.length === 0 && Xa(e)))
        for (let r = 0; r < e.producerNode.length; r++)
            e.producerIndexOfThis[r] = Ka(e.producerNode[r], e, r);
    return (e.liveConsumerIndexOfThis.push(n), e.liveConsumerNode.push(t) - 1);
}
function or(e, t) {
    if ((Ja(e), e.liveConsumerNode.length === 1 && Xa(e)))
        for (let r = 0; r < e.producerNode.length; r++)
            or(e.producerNode[r], e.producerIndexOfThis[r]);
    let n = e.liveConsumerNode.length - 1;
    if (
        ((e.liveConsumerNode[t] = e.liveConsumerNode[n]),
        (e.liveConsumerIndexOfThis[t] = e.liveConsumerIndexOfThis[n]),
        e.liveConsumerNode.length--,
        e.liveConsumerIndexOfThis.length--,
        t < e.liveConsumerNode.length)
    ) {
        let r = e.liveConsumerIndexOfThis[t],
            o = e.liveConsumerNode[t];
        (ir(o), (o.producerIndexOfThis[r] = t));
    }
}
function rn(e) {
    return e.consumerIsAlwaysLive || (e?.liveConsumerNode?.length ?? 0) > 0;
}
function ir(e) {
    ((e.producerNode ??= []),
        (e.producerIndexOfThis ??= []),
        (e.producerLastReadVersion ??= []));
}
function Ja(e) {
    ((e.liveConsumerNode ??= []), (e.liveConsumerIndexOfThis ??= []));
}
function Xa(e) {
    return e.producerNode !== void 0;
}
function Xf() {
    throw new Error();
}
var ec = Xf;
function eh(e) {
    ec(e);
}
function tc(e) {
    ec = e;
}
var th = null;
function nc(e, t) {
    (Kf() || eh(e), e.equal(e.value, t) || ((e.value = t), nh(e)));
}
var rc = F(m({}, rr), { equal: Zf, value: void 0, kind: "signal" });
function nh(e) {
    (e.version++, Qf(), Qa(e), th?.());
}
function y(e) {
    return typeof e == "function";
}
function mt(e) {
    let n = e((r) => {
        (Error.call(r), (r.stack = new Error().stack));
    });
    return (
        (n.prototype = Object.create(Error.prototype)),
        (n.prototype.constructor = n),
        n
    );
}
var sr = mt(
    (e) =>
        function (n) {
            (e(this),
                (this.message = n
                    ? `${n.length} errors occurred during unsubscription:
${n.map((r, o) => `${o + 1}) ${r.toString()}`).join(`
  `)}`
                    : ""),
                (this.name = "UnsubscriptionError"),
                (this.errors = n));
        },
);
function on(e, t) {
    if (e) {
        let n = e.indexOf(t);
        0 <= n && e.splice(n, 1);
    }
}
var B = class e {
    constructor(t) {
        ((this.initialTeardown = t),
            (this.closed = !1),
            (this._parentage = null),
            (this._finalizers = null));
    }
    unsubscribe() {
        let t;
        if (!this.closed) {
            this.closed = !0;
            let { _parentage: n } = this;
            if (n)
                if (((this._parentage = null), Array.isArray(n)))
                    for (let i of n) i.remove(this);
                else n.remove(this);
            let { initialTeardown: r } = this;
            if (y(r))
                try {
                    r();
                } catch (i) {
                    t = i instanceof sr ? i.errors : [i];
                }
            let { _finalizers: o } = this;
            if (o) {
                this._finalizers = null;
                for (let i of o)
                    try {
                        oc(i);
                    } catch (s) {
                        ((t = t ?? []),
                            s instanceof sr
                                ? (t = [...t, ...s.errors])
                                : t.push(s));
                    }
            }
            if (t) throw new sr(t);
        }
    }
    add(t) {
        var n;
        if (t && t !== this)
            if (this.closed) oc(t);
            else {
                if (t instanceof e) {
                    if (t.closed || t._hasParent(this)) return;
                    t._addParent(this);
                }
                (this._finalizers =
                    (n = this._finalizers) !== null && n !== void 0
                        ? n
                        : []).push(t);
            }
    }
    _hasParent(t) {
        let { _parentage: n } = this;
        return n === t || (Array.isArray(n) && n.includes(t));
    }
    _addParent(t) {
        let { _parentage: n } = this;
        this._parentage = Array.isArray(n) ? (n.push(t), n) : n ? [n, t] : t;
    }
    _removeParent(t) {
        let { _parentage: n } = this;
        n === t ? (this._parentage = null) : Array.isArray(n) && on(n, t);
    }
    remove(t) {
        let { _finalizers: n } = this;
        (n && on(n, t), t instanceof e && t._removeParent(this));
    }
};
B.EMPTY = (() => {
    let e = new B();
    return ((e.closed = !0), e);
})();
var Qo = B.EMPTY;
function ar(e) {
    return (
        e instanceof B ||
        (e && "closed" in e && y(e.remove) && y(e.add) && y(e.unsubscribe))
    );
}
function oc(e) {
    y(e) ? e() : e.unsubscribe();
}
var ve = {
    onUnhandledError: null,
    onStoppedNotification: null,
    Promise: void 0,
    useDeprecatedSynchronousErrorHandling: !1,
    useDeprecatedNextContext: !1,
};
var vt = {
    setTimeout(e, t, ...n) {
        let { delegate: r } = vt;
        return r?.setTimeout
            ? r.setTimeout(e, t, ...n)
            : setTimeout(e, t, ...n);
    },
    clearTimeout(e) {
        let { delegate: t } = vt;
        return (t?.clearTimeout || clearTimeout)(e);
    },
    delegate: void 0,
};
function cr(e) {
    vt.setTimeout(() => {
        let { onUnhandledError: t } = ve;
        if (t) t(e);
        else throw e;
    });
}
function sn() {}
var ic = Yo("C", void 0, void 0);
function sc(e) {
    return Yo("E", void 0, e);
}
function ac(e) {
    return Yo("N", e, void 0);
}
function Yo(e, t, n) {
    return { kind: e, value: t, error: n };
}
var Je = null;
function yt(e) {
    if (ve.useDeprecatedSynchronousErrorHandling) {
        let t = !Je;
        if ((t && (Je = { errorThrown: !1, error: null }), e(), t)) {
            let { errorThrown: n, error: r } = Je;
            if (((Je = null), n)) throw r;
        }
    } else e();
}
function cc(e) {
    ve.useDeprecatedSynchronousErrorHandling &&
        Je &&
        ((Je.errorThrown = !0), (Je.error = e));
}
var Xe = class extends B {
        constructor(t) {
            (super(),
                (this.isStopped = !1),
                t
                    ? ((this.destination = t), ar(t) && t.add(this))
                    : (this.destination = ih));
        }
        static create(t, n, r) {
            return new Dt(t, n, r);
        }
        next(t) {
            this.isStopped ? Jo(ac(t), this) : this._next(t);
        }
        error(t) {
            this.isStopped
                ? Jo(sc(t), this)
                : ((this.isStopped = !0), this._error(t));
        }
        complete() {
            this.isStopped
                ? Jo(ic, this)
                : ((this.isStopped = !0), this._complete());
        }
        unsubscribe() {
            this.closed ||
                ((this.isStopped = !0),
                super.unsubscribe(),
                (this.destination = null));
        }
        _next(t) {
            this.destination.next(t);
        }
        _error(t) {
            try {
                this.destination.error(t);
            } finally {
                this.unsubscribe();
            }
        }
        _complete() {
            try {
                this.destination.complete();
            } finally {
                this.unsubscribe();
            }
        }
    },
    rh = Function.prototype.bind;
function Ko(e, t) {
    return rh.call(e, t);
}
var Xo = class {
        constructor(t) {
            this.partialObserver = t;
        }
        next(t) {
            let { partialObserver: n } = this;
            if (n.next)
                try {
                    n.next(t);
                } catch (r) {
                    ur(r);
                }
        }
        error(t) {
            let { partialObserver: n } = this;
            if (n.error)
                try {
                    n.error(t);
                } catch (r) {
                    ur(r);
                }
            else ur(t);
        }
        complete() {
            let { partialObserver: t } = this;
            if (t.complete)
                try {
                    t.complete();
                } catch (n) {
                    ur(n);
                }
        }
    },
    Dt = class extends Xe {
        constructor(t, n, r) {
            super();
            let o;
            if (y(t) || !t)
                o = {
                    next: t ?? void 0,
                    error: n ?? void 0,
                    complete: r ?? void 0,
                };
            else {
                let i;
                this && ve.useDeprecatedNextContext
                    ? ((i = Object.create(t)),
                      (i.unsubscribe = () => this.unsubscribe()),
                      (o = {
                          next: t.next && Ko(t.next, i),
                          error: t.error && Ko(t.error, i),
                          complete: t.complete && Ko(t.complete, i),
                      }))
                    : (o = t);
            }
            this.destination = new Xo(o);
        }
    };
function ur(e) {
    ve.useDeprecatedSynchronousErrorHandling ? cc(e) : cr(e);
}
function oh(e) {
    throw e;
}
function Jo(e, t) {
    let { onStoppedNotification: n } = ve;
    n && vt.setTimeout(() => n(e, t));
}
var ih = { closed: !0, next: sn, error: oh, complete: sn };
var wt = (typeof Symbol == "function" && Symbol.observable) || "@@observable";
function ie(e) {
    return e;
}
function ei(...e) {
    return ti(e);
}
function ti(e) {
    return e.length === 0
        ? ie
        : e.length === 1
          ? e[0]
          : function (n) {
                return e.reduce((r, o) => o(r), n);
            };
}
var k = (() => {
    class e {
        constructor(n) {
            n && (this._subscribe = n);
        }
        lift(n) {
            let r = new e();
            return ((r.source = this), (r.operator = n), r);
        }
        subscribe(n, r, o) {
            let i = ah(n) ? n : new Dt(n, r, o);
            return (
                yt(() => {
                    let { operator: s, source: c } = this;
                    i.add(
                        s
                            ? s.call(i, c)
                            : c
                              ? this._subscribe(i)
                              : this._trySubscribe(i),
                    );
                }),
                i
            );
        }
        _trySubscribe(n) {
            try {
                return this._subscribe(n);
            } catch (r) {
                n.error(r);
            }
        }
        forEach(n, r) {
            return (
                (r = uc(r)),
                new r((o, i) => {
                    let s = new Dt({
                        next: (c) => {
                            try {
                                n(c);
                            } catch (a) {
                                (i(a), s.unsubscribe());
                            }
                        },
                        error: i,
                        complete: o,
                    });
                    this.subscribe(s);
                })
            );
        }
        _subscribe(n) {
            var r;
            return (r = this.source) === null || r === void 0
                ? void 0
                : r.subscribe(n);
        }
        [wt]() {
            return this;
        }
        pipe(...n) {
            return ti(n)(this);
        }
        toPromise(n) {
            return (
                (n = uc(n)),
                new n((r, o) => {
                    let i;
                    this.subscribe(
                        (s) => (i = s),
                        (s) => o(s),
                        () => r(i),
                    );
                })
            );
        }
    }
    return ((e.create = (t) => new e(t)), e);
})();
function uc(e) {
    var t;
    return (t = e ?? ve.Promise) !== null && t !== void 0 ? t : Promise;
}
function sh(e) {
    return e && y(e.next) && y(e.error) && y(e.complete);
}
function ah(e) {
    return (e && e instanceof Xe) || (sh(e) && ar(e));
}
function ni(e) {
    return y(e?.lift);
}
function T(e) {
    return (t) => {
        if (ni(t))
            return t.lift(function (n) {
                try {
                    return e(n, this);
                } catch (r) {
                    this.error(r);
                }
            });
        throw new TypeError("Unable to lift unknown Observable type");
    };
}
function x(e, t, n, r, o) {
    return new ri(e, t, n, r, o);
}
var ri = class extends Xe {
    constructor(t, n, r, o, i, s) {
        (super(t),
            (this.onFinalize = i),
            (this.shouldUnsubscribe = s),
            (this._next = n
                ? function (c) {
                      try {
                          n(c);
                      } catch (a) {
                          t.error(a);
                      }
                  }
                : super._next),
            (this._error = o
                ? function (c) {
                      try {
                          o(c);
                      } catch (a) {
                          t.error(a);
                      } finally {
                          this.unsubscribe();
                      }
                  }
                : super._error),
            (this._complete = r
                ? function () {
                      try {
                          r();
                      } catch (c) {
                          t.error(c);
                      } finally {
                          this.unsubscribe();
                      }
                  }
                : super._complete));
    }
    unsubscribe() {
        var t;
        if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
            let { closed: n } = this;
            (super.unsubscribe(),
                !n &&
                    ((t = this.onFinalize) === null ||
                        t === void 0 ||
                        t.call(this)));
        }
    }
};
function Ct() {
    return T((e, t) => {
        let n = null;
        e._refCount++;
        let r = x(t, void 0, void 0, void 0, () => {
            if (!e || e._refCount <= 0 || 0 < --e._refCount) {
                n = null;
                return;
            }
            let o = e._connection,
                i = n;
            ((n = null),
                o && (!i || o === i) && o.unsubscribe(),
                t.unsubscribe());
        });
        (e.subscribe(r), r.closed || (n = e.connect()));
    });
}
var Et = class extends k {
    constructor(t, n) {
        (super(),
            (this.source = t),
            (this.subjectFactory = n),
            (this._subject = null),
            (this._refCount = 0),
            (this._connection = null),
            ni(t) && (this.lift = t.lift));
    }
    _subscribe(t) {
        return this.getSubject().subscribe(t);
    }
    getSubject() {
        let t = this._subject;
        return (
            (!t || t.isStopped) && (this._subject = this.subjectFactory()),
            this._subject
        );
    }
    _teardown() {
        this._refCount = 0;
        let { _connection: t } = this;
        ((this._subject = this._connection = null), t?.unsubscribe());
    }
    connect() {
        let t = this._connection;
        if (!t) {
            t = this._connection = new B();
            let n = this.getSubject();
            (t.add(
                this.source.subscribe(
                    x(
                        n,
                        void 0,
                        () => {
                            (this._teardown(), n.complete());
                        },
                        (r) => {
                            (this._teardown(), n.error(r));
                        },
                        () => this._teardown(),
                    ),
                ),
            ),
                t.closed && ((this._connection = null), (t = B.EMPTY)));
        }
        return t;
    }
    refCount() {
        return Ct()(this);
    }
};
var lc = mt(
    (e) =>
        function () {
            (e(this),
                (this.name = "ObjectUnsubscribedError"),
                (this.message = "object unsubscribed"));
        },
);
var K = (() => {
        class e extends k {
            constructor() {
                (super(),
                    (this.closed = !1),
                    (this.currentObservers = null),
                    (this.observers = []),
                    (this.isStopped = !1),
                    (this.hasError = !1),
                    (this.thrownError = null));
            }
            lift(n) {
                let r = new lr(this, this);
                return ((r.operator = n), r);
            }
            _throwIfClosed() {
                if (this.closed) throw new lc();
            }
            next(n) {
                yt(() => {
                    if ((this._throwIfClosed(), !this.isStopped)) {
                        this.currentObservers ||
                            (this.currentObservers = Array.from(
                                this.observers,
                            ));
                        for (let r of this.currentObservers) r.next(n);
                    }
                });
            }
            error(n) {
                yt(() => {
                    if ((this._throwIfClosed(), !this.isStopped)) {
                        ((this.hasError = this.isStopped = !0),
                            (this.thrownError = n));
                        let { observers: r } = this;
                        for (; r.length; ) r.shift().error(n);
                    }
                });
            }
            complete() {
                yt(() => {
                    if ((this._throwIfClosed(), !this.isStopped)) {
                        this.isStopped = !0;
                        let { observers: n } = this;
                        for (; n.length; ) n.shift().complete();
                    }
                });
            }
            unsubscribe() {
                ((this.isStopped = this.closed = !0),
                    (this.observers = this.currentObservers = null));
            }
            get observed() {
                var n;
                return (
                    ((n = this.observers) === null || n === void 0
                        ? void 0
                        : n.length) > 0
                );
            }
            _trySubscribe(n) {
                return (this._throwIfClosed(), super._trySubscribe(n));
            }
            _subscribe(n) {
                return (
                    this._throwIfClosed(),
                    this._checkFinalizedStatuses(n),
                    this._innerSubscribe(n)
                );
            }
            _innerSubscribe(n) {
                let { hasError: r, isStopped: o, observers: i } = this;
                return r || o
                    ? Qo
                    : ((this.currentObservers = null),
                      i.push(n),
                      new B(() => {
                          ((this.currentObservers = null), on(i, n));
                      }));
            }
            _checkFinalizedStatuses(n) {
                let { hasError: r, thrownError: o, isStopped: i } = this;
                r ? n.error(o) : i && n.complete();
            }
            asObservable() {
                let n = new k();
                return ((n.source = this), n);
            }
        }
        return ((e.create = (t, n) => new lr(t, n)), e);
    })(),
    lr = class extends K {
        constructor(t, n) {
            (super(), (this.destination = t), (this.source = n));
        }
        next(t) {
            var n, r;
            (r =
                (n = this.destination) === null || n === void 0
                    ? void 0
                    : n.next) === null ||
                r === void 0 ||
                r.call(n, t);
        }
        error(t) {
            var n, r;
            (r =
                (n = this.destination) === null || n === void 0
                    ? void 0
                    : n.error) === null ||
                r === void 0 ||
                r.call(n, t);
        }
        complete() {
            var t, n;
            (n =
                (t = this.destination) === null || t === void 0
                    ? void 0
                    : t.complete) === null ||
                n === void 0 ||
                n.call(t);
        }
        _subscribe(t) {
            var n, r;
            return (r =
                (n = this.source) === null || n === void 0
                    ? void 0
                    : n.subscribe(t)) !== null && r !== void 0
                ? r
                : Qo;
        }
    };
var W = class extends K {
    constructor(t) {
        (super(), (this._value = t));
    }
    get value() {
        return this.getValue();
    }
    _subscribe(t) {
        let n = super._subscribe(t);
        return (!n.closed && t.next(this._value), n);
    }
    getValue() {
        let { hasError: t, thrownError: n, _value: r } = this;
        if (t) throw n;
        return (this._throwIfClosed(), r);
    }
    next(t) {
        super.next((this._value = t));
    }
};
var ne = new k((e) => e.complete());
function dc(e) {
    return e && y(e.schedule);
}
function fc(e) {
    return e[e.length - 1];
}
function hc(e) {
    return y(fc(e)) ? e.pop() : void 0;
}
function Be(e) {
    return dc(fc(e)) ? e.pop() : void 0;
}
function gc(e, t, n, r) {
    function o(i) {
        return i instanceof n
            ? i
            : new n(function (s) {
                  s(i);
              });
    }
    return new (n || (n = Promise))(function (i, s) {
        function c(l) {
            try {
                u(r.next(l));
            } catch (d) {
                s(d);
            }
        }
        function a(l) {
            try {
                u(r.throw(l));
            } catch (d) {
                s(d);
            }
        }
        function u(l) {
            l.done ? i(l.value) : o(l.value).then(c, a);
        }
        u((r = r.apply(e, t || [])).next());
    });
}
function pc(e) {
    var t = typeof Symbol == "function" && Symbol.iterator,
        n = t && e[t],
        r = 0;
    if (n) return n.call(e);
    if (e && typeof e.length == "number")
        return {
            next: function () {
                return (
                    e && r >= e.length && (e = void 0),
                    { value: e && e[r++], done: !e }
                );
            },
        };
    throw new TypeError(
        t ? "Object is not iterable." : "Symbol.iterator is not defined.",
    );
}
function et(e) {
    return this instanceof et ? ((this.v = e), this) : new et(e);
}
function mc(e, t, n) {
    if (!Symbol.asyncIterator)
        throw new TypeError("Symbol.asyncIterator is not defined.");
    var r = n.apply(e, t || []),
        o,
        i = [];
    return (
        (o = Object.create(
            (typeof AsyncIterator == "function" ? AsyncIterator : Object)
                .prototype,
        )),
        c("next"),
        c("throw"),
        c("return", s),
        (o[Symbol.asyncIterator] = function () {
            return this;
        }),
        o
    );
    function s(f) {
        return function (g) {
            return Promise.resolve(g).then(f, d);
        };
    }
    function c(f, g) {
        r[f] &&
            ((o[f] = function (E) {
                return new Promise(function (j, V) {
                    i.push([f, E, j, V]) > 1 || a(f, E);
                });
            }),
            g && (o[f] = g(o[f])));
    }
    function a(f, g) {
        try {
            u(r[f](g));
        } catch (E) {
            h(i[0][3], E);
        }
    }
    function u(f) {
        f.value instanceof et
            ? Promise.resolve(f.value.v).then(l, d)
            : h(i[0][2], f);
    }
    function l(f) {
        a("next", f);
    }
    function d(f) {
        a("throw", f);
    }
    function h(f, g) {
        (f(g), i.shift(), i.length && a(i[0][0], i[0][1]));
    }
}
function vc(e) {
    if (!Symbol.asyncIterator)
        throw new TypeError("Symbol.asyncIterator is not defined.");
    var t = e[Symbol.asyncIterator],
        n;
    return t
        ? t.call(e)
        : ((e = typeof pc == "function" ? pc(e) : e[Symbol.iterator]()),
          (n = {}),
          r("next"),
          r("throw"),
          r("return"),
          (n[Symbol.asyncIterator] = function () {
              return this;
          }),
          n);
    function r(i) {
        n[i] =
            e[i] &&
            function (s) {
                return new Promise(function (c, a) {
                    ((s = e[i](s)), o(c, a, s.done, s.value));
                });
            };
    }
    function o(i, s, c, a) {
        Promise.resolve(a).then(function (u) {
            i({ value: u, done: c });
        }, s);
    }
}
var dr = (e) => e && typeof e.length == "number" && typeof e != "function";
function fr(e) {
    return y(e?.then);
}
function hr(e) {
    return y(e[wt]);
}
function pr(e) {
    return Symbol.asyncIterator && y(e?.[Symbol.asyncIterator]);
}
function gr(e) {
    return new TypeError(
        `You provided ${e !== null && typeof e == "object" ? "an invalid object" : `'${e}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`,
    );
}
function ch() {
    return typeof Symbol != "function" || !Symbol.iterator
        ? "@@iterator"
        : Symbol.iterator;
}
var mr = ch();
function vr(e) {
    return y(e?.[mr]);
}
function yr(e) {
    return mc(this, arguments, function* () {
        let n = e.getReader();
        try {
            for (;;) {
                let { value: r, done: o } = yield et(n.read());
                if (o) return yield et(void 0);
                yield yield et(r);
            }
        } finally {
            n.releaseLock();
        }
    });
}
function Dr(e) {
    return y(e?.getReader);
}
function G(e) {
    if (e instanceof k) return e;
    if (e != null) {
        if (hr(e)) return uh(e);
        if (dr(e)) return lh(e);
        if (fr(e)) return dh(e);
        if (pr(e)) return yc(e);
        if (vr(e)) return fh(e);
        if (Dr(e)) return hh(e);
    }
    throw gr(e);
}
function uh(e) {
    return new k((t) => {
        let n = e[wt]();
        if (y(n.subscribe)) return n.subscribe(t);
        throw new TypeError(
            "Provided object does not correctly implement Symbol.observable",
        );
    });
}
function lh(e) {
    return new k((t) => {
        for (let n = 0; n < e.length && !t.closed; n++) t.next(e[n]);
        t.complete();
    });
}
function dh(e) {
    return new k((t) => {
        e.then(
            (n) => {
                t.closed || (t.next(n), t.complete());
            },
            (n) => t.error(n),
        ).then(null, cr);
    });
}
function fh(e) {
    return new k((t) => {
        for (let n of e) if ((t.next(n), t.closed)) return;
        t.complete();
    });
}
function yc(e) {
    return new k((t) => {
        ph(e, t).catch((n) => t.error(n));
    });
}
function hh(e) {
    return yc(yr(e));
}
function ph(e, t) {
    var n, r, o, i;
    return gc(this, void 0, void 0, function* () {
        try {
            for (n = vc(e); (r = yield n.next()), !r.done; ) {
                let s = r.value;
                if ((t.next(s), t.closed)) return;
            }
        } catch (s) {
            o = { error: s };
        } finally {
            try {
                r && !r.done && (i = n.return) && (yield i.call(n));
            } finally {
                if (o) throw o.error;
            }
        }
        t.complete();
    });
}
function re(e, t, n, r = 0, o = !1) {
    let i = t.schedule(function () {
        (n(), o ? e.add(this.schedule(null, r)) : this.unsubscribe());
    }, r);
    if ((e.add(i), !o)) return i;
}
function wr(e, t = 0) {
    return T((n, r) => {
        n.subscribe(
            x(
                r,
                (o) => re(r, e, () => r.next(o), t),
                () => re(r, e, () => r.complete(), t),
                (o) => re(r, e, () => r.error(o), t),
            ),
        );
    });
}
function Cr(e, t = 0) {
    return T((n, r) => {
        r.add(e.schedule(() => n.subscribe(r), t));
    });
}
function Dc(e, t) {
    return G(e).pipe(Cr(t), wr(t));
}
function wc(e, t) {
    return G(e).pipe(Cr(t), wr(t));
}
function Cc(e, t) {
    return new k((n) => {
        let r = 0;
        return t.schedule(function () {
            r === e.length
                ? n.complete()
                : (n.next(e[r++]), n.closed || this.schedule());
        });
    });
}
function Ec(e, t) {
    return new k((n) => {
        let r;
        return (
            re(n, t, () => {
                ((r = e[mr]()),
                    re(
                        n,
                        t,
                        () => {
                            let o, i;
                            try {
                                ({ value: o, done: i } = r.next());
                            } catch (s) {
                                n.error(s);
                                return;
                            }
                            i ? n.complete() : n.next(o);
                        },
                        0,
                        !0,
                    ));
            }),
            () => y(r?.return) && r.return()
        );
    });
}
function Er(e, t) {
    if (!e) throw new Error("Iterable cannot be null");
    return new k((n) => {
        re(n, t, () => {
            let r = e[Symbol.asyncIterator]();
            re(
                n,
                t,
                () => {
                    r.next().then((o) => {
                        o.done ? n.complete() : n.next(o.value);
                    });
                },
                0,
                !0,
            );
        });
    });
}
function Ic(e, t) {
    return Er(yr(e), t);
}
function bc(e, t) {
    if (e != null) {
        if (hr(e)) return Dc(e, t);
        if (dr(e)) return Cc(e, t);
        if (fr(e)) return wc(e, t);
        if (pr(e)) return Er(e, t);
        if (vr(e)) return Ec(e, t);
        if (Dr(e)) return Ic(e, t);
    }
    throw gr(e);
}
function U(e, t) {
    return t ? bc(e, t) : G(e);
}
function I(...e) {
    let t = Be(e);
    return U(e, t);
}
function It(e, t) {
    let n = y(e) ? e : () => e,
        r = (o) => o.error(n());
    return new k(t ? (o) => t.schedule(r, 0, o) : r);
}
function oi(e) {
    return !!e && (e instanceof k || (y(e.lift) && y(e.subscribe)));
}
var Ae = mt(
    (e) =>
        function () {
            (e(this),
                (this.name = "EmptyError"),
                (this.message = "no elements in sequence"));
        },
);
function N(e, t) {
    return T((n, r) => {
        let o = 0;
        n.subscribe(
            x(r, (i) => {
                r.next(e.call(t, i, o++));
            }),
        );
    });
}
var { isArray: gh } = Array;
function mh(e, t) {
    return gh(t) ? e(...t) : e(t);
}
function Sc(e) {
    return N((t) => mh(e, t));
}
var { isArray: vh } = Array,
    { getPrototypeOf: yh, prototype: Dh, keys: wh } = Object;
function Mc(e) {
    if (e.length === 1) {
        let t = e[0];
        if (vh(t)) return { args: t, keys: null };
        if (Ch(t)) {
            let n = wh(t);
            return { args: n.map((r) => t[r]), keys: n };
        }
    }
    return { args: e, keys: null };
}
function Ch(e) {
    return e && typeof e == "object" && yh(e) === Dh;
}
function _c(e, t) {
    return e.reduce((n, r, o) => ((n[r] = t[o]), n), {});
}
function Ir(...e) {
    let t = Be(e),
        n = hc(e),
        { args: r, keys: o } = Mc(e);
    if (r.length === 0) return U([], t);
    let i = new k(Eh(r, t, o ? (s) => _c(o, s) : ie));
    return n ? i.pipe(Sc(n)) : i;
}
function Eh(e, t, n = ie) {
    return (r) => {
        Tc(
            t,
            () => {
                let { length: o } = e,
                    i = new Array(o),
                    s = o,
                    c = o;
                for (let a = 0; a < o; a++)
                    Tc(
                        t,
                        () => {
                            let u = U(e[a], t),
                                l = !1;
                            u.subscribe(
                                x(
                                    r,
                                    (d) => {
                                        ((i[a] = d),
                                            l || ((l = !0), c--),
                                            c || r.next(n(i.slice())));
                                    },
                                    () => {
                                        --s || r.complete();
                                    },
                                ),
                            );
                        },
                        r,
                    );
            },
            r,
        );
    };
}
function Tc(e, t, n) {
    e ? re(n, e, t) : t();
}
function xc(e, t, n, r, o, i, s, c) {
    let a = [],
        u = 0,
        l = 0,
        d = !1,
        h = () => {
            d && !a.length && !u && t.complete();
        },
        f = (E) => (u < r ? g(E) : a.push(E)),
        g = (E) => {
            (i && t.next(E), u++);
            let j = !1;
            G(n(E, l++)).subscribe(
                x(
                    t,
                    (V) => {
                        (o?.(V), i ? f(V) : t.next(V));
                    },
                    () => {
                        j = !0;
                    },
                    void 0,
                    () => {
                        if (j)
                            try {
                                for (u--; a.length && u < r; ) {
                                    let V = a.shift();
                                    s ? re(t, s, () => g(V)) : g(V);
                                }
                                h();
                            } catch (V) {
                                t.error(V);
                            }
                    },
                ),
            );
        };
    return (
        e.subscribe(
            x(t, f, () => {
                ((d = !0), h());
            }),
        ),
        () => {
            c?.();
        }
    );
}
function H(e, t, n = 1 / 0) {
    return y(t)
        ? H((r, o) => N((i, s) => t(r, i, o, s))(G(e(r, o))), n)
        : (typeof t == "number" && (n = t), T((r, o) => xc(r, o, e, n)));
}
function ii(e = 1 / 0) {
    return H(ie, e);
}
function Nc() {
    return ii(1);
}
function bt(...e) {
    return Nc()(U(e, Be(e)));
}
function br(e) {
    return new k((t) => {
        G(e()).subscribe(t);
    });
}
function ye(e, t) {
    return T((n, r) => {
        let o = 0;
        n.subscribe(x(r, (i) => e.call(t, i, o++) && r.next(i)));
    });
}
function $e(e) {
    return T((t, n) => {
        let r = null,
            o = !1,
            i;
        ((r = t.subscribe(
            x(n, void 0, void 0, (s) => {
                ((i = G(e(s, $e(e)(t)))),
                    r
                        ? (r.unsubscribe(), (r = null), i.subscribe(n))
                        : (o = !0));
            }),
        )),
            o && (r.unsubscribe(), (r = null), i.subscribe(n)));
    });
}
function Ac(e, t, n, r, o) {
    return (i, s) => {
        let c = n,
            a = t,
            u = 0;
        i.subscribe(
            x(
                s,
                (l) => {
                    let d = u++;
                    ((a = c ? e(a, l, d) : ((c = !0), l)), r && s.next(a));
                },
                o &&
                    (() => {
                        (c && s.next(a), s.complete());
                    }),
            ),
        );
    };
}
function St(e, t) {
    return y(t) ? H(e, t, 1) : H(e, 1);
}
function Ue(e) {
    return T((t, n) => {
        let r = !1;
        t.subscribe(
            x(
                n,
                (o) => {
                    ((r = !0), n.next(o));
                },
                () => {
                    (r || n.next(e), n.complete());
                },
            ),
        );
    });
}
function Re(e) {
    return e <= 0
        ? () => ne
        : T((t, n) => {
              let r = 0;
              t.subscribe(
                  x(n, (o) => {
                      ++r <= e && (n.next(o), e <= r && n.complete());
                  }),
              );
          });
}
function Sr(e = Ih) {
    return T((t, n) => {
        let r = !1;
        t.subscribe(
            x(
                n,
                (o) => {
                    ((r = !0), n.next(o));
                },
                () => (r ? n.complete() : n.error(e())),
            ),
        );
    });
}
function Ih() {
    return new Ae();
}
function an(e) {
    return T((t, n) => {
        try {
            t.subscribe(n);
        } finally {
            n.add(e);
        }
    });
}
function Oe(e, t) {
    let n = arguments.length >= 2;
    return (r) =>
        r.pipe(
            e ? ye((o, i) => e(o, i, r)) : ie,
            Re(1),
            n ? Ue(t) : Sr(() => new Ae()),
        );
}
function Mt(e) {
    return e <= 0
        ? () => ne
        : T((t, n) => {
              let r = [];
              t.subscribe(
                  x(
                      n,
                      (o) => {
                          (r.push(o), e < r.length && r.shift());
                      },
                      () => {
                          for (let o of r) n.next(o);
                          n.complete();
                      },
                      void 0,
                      () => {
                          r = null;
                      },
                  ),
              );
          });
}
function si(e, t) {
    let n = arguments.length >= 2;
    return (r) =>
        r.pipe(
            e ? ye((o, i) => e(o, i, r)) : ie,
            Mt(1),
            n ? Ue(t) : Sr(() => new Ae()),
        );
}
function ai(e, t) {
    return T(Ac(e, t, arguments.length >= 2, !0));
}
function ci(...e) {
    let t = Be(e);
    return T((n, r) => {
        (t ? bt(e, n, t) : bt(e, n)).subscribe(r);
    });
}
function De(e, t) {
    return T((n, r) => {
        let o = null,
            i = 0,
            s = !1,
            c = () => s && !o && r.complete();
        n.subscribe(
            x(
                r,
                (a) => {
                    o?.unsubscribe();
                    let u = 0,
                        l = i++;
                    G(e(a, l)).subscribe(
                        (o = x(
                            r,
                            (d) => r.next(t ? t(a, d, l, u++) : d),
                            () => {
                                ((o = null), c());
                            },
                        )),
                    );
                },
                () => {
                    ((s = !0), c());
                },
            ),
        );
    });
}
function ui(e) {
    return T((t, n) => {
        (G(e).subscribe(x(n, () => n.complete(), sn)),
            !n.closed && t.subscribe(n));
    });
}
function Z(e, t, n) {
    let r = y(e) || t || n ? { next: e, error: t, complete: n } : e;
    return r
        ? T((o, i) => {
              var s;
              (s = r.subscribe) === null || s === void 0 || s.call(r);
              let c = !0;
              o.subscribe(
                  x(
                      i,
                      (a) => {
                          var u;
                          ((u = r.next) === null ||
                              u === void 0 ||
                              u.call(r, a),
                              i.next(a));
                      },
                      () => {
                          var a;
                          ((c = !1),
                              (a = r.complete) === null ||
                                  a === void 0 ||
                                  a.call(r),
                              i.complete());
                      },
                      (a) => {
                          var u;
                          ((c = !1),
                              (u = r.error) === null ||
                                  u === void 0 ||
                                  u.call(r, a),
                              i.error(a));
                      },
                      () => {
                          var a, u;
                          (c &&
                              ((a = r.unsubscribe) === null ||
                                  a === void 0 ||
                                  a.call(r)),
                              (u = r.finalize) === null ||
                                  u === void 0 ||
                                  u.call(r));
                      },
                  ),
              );
          })
        : ie;
}
var vu = "https://g.co/ng/security#xss",
    v = class extends Error {
        code;
        constructor(t, n) {
            (super(ns(t, n)), (this.code = t));
        }
    };
function ns(e, t) {
    return `${`NG0${Math.abs(e)}`}${t ? ": " + t : ""}`;
}
var yu = Symbol("InputSignalNode#UNSET"),
    Sh = F(m({}, rc), {
        transformFn: void 0,
        applyValueToInputSignal(e, t) {
            nc(e, t);
        },
    });
function Du(e, t) {
    let n = Object.create(Sh);
    ((n.value = e), (n.transformFn = t?.transform));
    function r() {
        if ((Za(n), n.value === yu)) throw new v(-950, !1);
        return n.value;
    }
    return ((r[gt] = n), r);
}
function rs(e) {
    return { toString: e }.toString();
}
function P(e) {
    for (let t in e) if (e[t] === P) return t;
    throw Error("Could not find renamed property on target object.");
}
function ae(e) {
    if (typeof e == "string") return e;
    if (Array.isArray(e)) return `[${e.map(ae).join(", ")}]`;
    if (e == null) return "" + e;
    let t = e.overriddenName || e.name;
    if (t) return `${t}`;
    let n = e.toString();
    if (n == null) return "" + n;
    let r = n.indexOf(`
`);
    return r >= 0 ? n.slice(0, r) : n;
}
function Rc(e, t) {
    return e ? (t ? `${e} ${t}` : e) : t || "";
}
var Mh = P({ __forward_ref__: P });
function wu(e) {
    return (
        (e.__forward_ref__ = wu),
        (e.toString = function () {
            return ae(this());
        }),
        e
    );
}
function he(e) {
    return Cu(e) ? e() : e;
}
function Cu(e) {
    return (
        typeof e == "function" &&
        e.hasOwnProperty(Mh) &&
        e.__forward_ref__ === wu
    );
}
function C(e) {
    return {
        token: e.token,
        providedIn: e.providedIn || null,
        factory: e.factory,
        value: void 0,
    };
}
function Xr(e) {
    return Oc(e, Iu) || Oc(e, bu);
}
function Eu(e) {
    return Xr(e) !== null;
}
function Oc(e, t) {
    return e.hasOwnProperty(t) ? e[t] : null;
}
function _h(e) {
    let t = e && (e[Iu] || e[bu]);
    return t || null;
}
function kc(e) {
    return e && (e.hasOwnProperty(Pc) || e.hasOwnProperty(Th)) ? e[Pc] : null;
}
var Iu = P({ ɵprov: P }),
    Pc = P({ ɵinj: P }),
    bu = P({ ngInjectableDef: P }),
    Th = P({ ngInjectorDef: P }),
    w = class {
        _desc;
        ngMetadataName = "InjectionToken";
        ɵprov;
        constructor(t, n) {
            ((this._desc = t),
                (this.ɵprov = void 0),
                typeof n == "number"
                    ? (this.__NG_ELEMENT_ID__ = n)
                    : n !== void 0 &&
                      (this.ɵprov = C({
                          token: this,
                          providedIn: n.providedIn || "root",
                          factory: n.factory,
                      })));
        }
        get multi() {
            return this;
        }
        toString() {
            return `InjectionToken ${this._desc}`;
        }
    };
function Su(e) {
    return e && !!e.ɵproviders;
}
var xh = P({ ɵcmp: P }),
    Nh = P({ ɵdir: P }),
    Ah = P({ ɵpipe: P }),
    Rh = P({ ɵmod: P }),
    Ar = P({ ɵfac: P }),
    dn = P({ __NG_ELEMENT_ID__: P }),
    Fc = P({ __NG_ENV_ID__: P });
function os(e) {
    return typeof e == "string" ? e : e == null ? "" : String(e);
}
function Oh(e) {
    return typeof e == "function"
        ? e.name || e.toString()
        : typeof e == "object" && e != null && typeof e.type == "function"
          ? e.type.name || e.type.toString()
          : os(e);
}
function kh(e, t) {
    throw new v(-200, e);
}
function is(e, t) {
    throw new v(-201, !1);
}
var S = (function (e) {
        return (
            (e[(e.Default = 0)] = "Default"),
            (e[(e.Host = 1)] = "Host"),
            (e[(e.Self = 2)] = "Self"),
            (e[(e.SkipSelf = 4)] = "SkipSelf"),
            (e[(e.Optional = 8)] = "Optional"),
            e
        );
    })(S || {}),
    Di;
function Mu() {
    return Di;
}
function fe(e) {
    let t = Di;
    return ((Di = e), t);
}
function _u(e, t, n) {
    let r = Xr(e);
    if (r && r.providedIn == "root")
        return r.value === void 0 ? (r.value = r.factory()) : r.value;
    if (n & S.Optional) return null;
    if (t !== void 0) return t;
    is(e, "Injector");
}
var Ph = {},
    fn = Ph,
    Fh = "__NG_DI_FLAG__",
    Rr = "ngTempTokenPath",
    Lh = "ngTokenPath",
    jh = /\n/gm,
    Vh = "\u0275",
    Lc = "__source",
    Nt;
function Bh() {
    return Nt;
}
function He(e) {
    let t = Nt;
    return ((Nt = e), t);
}
function $h(e, t = S.Default) {
    if (Nt === void 0) throw new v(-203, !1);
    return Nt === null
        ? _u(e, void 0, t)
        : Nt.get(e, t & S.Optional ? null : void 0, t);
}
function M(e, t = S.Default) {
    return (Mu() || $h)(he(e), t);
}
function p(e, t = S.Default) {
    return M(e, eo(t));
}
function eo(e) {
    return typeof e > "u" || typeof e == "number"
        ? e
        : 0 |
              (e.optional && 8) |
              (e.host && 1) |
              (e.self && 2) |
              (e.skipSelf && 4);
}
function wi(e) {
    let t = [];
    for (let n = 0; n < e.length; n++) {
        let r = he(e[n]);
        if (Array.isArray(r)) {
            if (r.length === 0) throw new v(900, !1);
            let o,
                i = S.Default;
            for (let s = 0; s < r.length; s++) {
                let c = r[s],
                    a = Uh(c);
                typeof a == "number"
                    ? a === -1
                        ? (o = c.token)
                        : (i |= a)
                    : (o = c);
            }
            t.push(M(o, i));
        } else t.push(M(r));
    }
    return t;
}
function Uh(e) {
    return e[Fh];
}
function Hh(e, t, n, r) {
    let o = e[Rr];
    throw (
        t[Lc] && o.unshift(t[Lc]),
        (e.message = zh(
            `
` + e.message,
            o,
            n,
            r,
        )),
        (e[Lh] = o),
        (e[Rr] = null),
        e
    );
}
function zh(e, t, n, r = null) {
    e =
        e &&
        e.charAt(0) ===
            `
` &&
        e.charAt(1) == Vh
            ? e.slice(2)
            : e;
    let o = ae(t);
    if (Array.isArray(t)) o = t.map(ae).join(" -> ");
    else if (typeof t == "object") {
        let i = [];
        for (let s in t)
            if (t.hasOwnProperty(s)) {
                let c = t[s];
                i.push(
                    s +
                        ":" +
                        (typeof c == "string" ? JSON.stringify(c) : ae(c)),
                );
            }
        o = `{${i.join(", ")}}`;
    }
    return `${n}${r ? "(" + r + ")" : ""}[${o}]: ${e.replace(
        jh,
        `
  `,
    )}`;
}
function Rt(e, t) {
    let n = e.hasOwnProperty(Ar);
    return n ? e[Ar] : null;
}
function ss(e, t) {
    e.forEach((n) => (Array.isArray(n) ? ss(n, t) : t(n)));
}
function Tu(e, t, n) {
    t >= e.length ? e.push(n) : e.splice(t, 0, n);
}
function Or(e, t) {
    return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0];
}
var Ot = {},
    kt = [],
    Pt = new w(""),
    xu = new w("", -1),
    Nu = new w(""),
    kr = class {
        get(t, n = fn) {
            if (n === fn) {
                let r = new Error(
                    `NullInjectorError: No provider for ${ae(t)}!`,
                );
                throw ((r.name = "NullInjectorError"), r);
            }
            return n;
        }
    };
function Au(e, t) {
    let n = e[Rh] || null;
    if (!n && t === !0)
        throw new Error(`Type ${ae(e)} does not have '\u0275mod' property.`);
    return n;
}
function rt(e) {
    return e[xh] || null;
}
function Ru(e) {
    return e[Nh] || null;
}
function Ou(e) {
    return e[Ah] || null;
}
function ku(e) {
    let t = rt(e) || Ru(e) || Ou(e);
    return t !== null && t.standalone;
}
function to(e) {
    return { ɵproviders: e };
}
function qh(...e) {
    return { ɵproviders: Pu(!0, e), ɵfromNgModule: !0 };
}
function Pu(e, ...t) {
    let n = [],
        r = new Set(),
        o,
        i = (s) => {
            n.push(s);
        };
    return (
        ss(t, (s) => {
            let c = s;
            Ci(c, i, [], r) && ((o ||= []), o.push(c));
        }),
        o !== void 0 && Fu(o, i),
        n
    );
}
function Fu(e, t) {
    for (let n = 0; n < e.length; n++) {
        let { ngModule: r, providers: o } = e[n];
        as(o, (i) => {
            t(i, r);
        });
    }
}
function Ci(e, t, n, r) {
    if (((e = he(e)), !e)) return !1;
    let o = null,
        i = kc(e),
        s = !i && rt(e);
    if (!i && !s) {
        let a = e.ngModule;
        if (((i = kc(a)), i)) o = a;
        else return !1;
    } else {
        if (s && !s.standalone) return !1;
        o = e;
    }
    let c = r.has(o);
    if (s) {
        if (c) return !1;
        if ((r.add(o), s.dependencies)) {
            let a =
                typeof s.dependencies == "function"
                    ? s.dependencies()
                    : s.dependencies;
            for (let u of a) Ci(u, t, n, r);
        }
    } else if (i) {
        if (i.imports != null && !c) {
            r.add(o);
            let u;
            try {
                ss(i.imports, (l) => {
                    Ci(l, t, n, r) && ((u ||= []), u.push(l));
                });
            } finally {
            }
            u !== void 0 && Fu(u, t);
        }
        if (!c) {
            let u = Rt(o) || (() => new o());
            (t({ provide: o, useFactory: u, deps: kt }, o),
                t({ provide: Nu, useValue: o, multi: !0 }, o),
                t({ provide: Pt, useValue: () => M(o), multi: !0 }, o));
        }
        let a = i.providers;
        if (a != null && !c) {
            let u = e;
            as(a, (l) => {
                t(l, u);
            });
        }
    } else return !1;
    return o !== e && e.providers !== void 0;
}
function as(e, t) {
    for (let n of e)
        (Su(n) && (n = n.ɵproviders), Array.isArray(n) ? as(n, t) : t(n));
}
var Gh = P({ provide: String, useValue: P });
function Lu(e) {
    return e !== null && typeof e == "object" && Gh in e;
}
function Wh(e) {
    return !!(e && e.useExisting);
}
function Zh(e) {
    return !!(e && e.useFactory);
}
function Ei(e) {
    return typeof e == "function";
}
var no = new w(""),
    Mr = {},
    Qh = {},
    li;
function cs() {
    return (li === void 0 && (li = new kr()), li);
}
var pe = class {},
    hn = class extends pe {
        parent;
        source;
        scopes;
        records = new Map();
        _ngOnDestroyHooks = new Set();
        _onDestroyHooks = [];
        get destroyed() {
            return this._destroyed;
        }
        _destroyed = !1;
        injectorDefTypes;
        constructor(t, n, r, o) {
            (super(),
                (this.parent = n),
                (this.source = r),
                (this.scopes = o),
                bi(t, (s) => this.processProvider(s)),
                this.records.set(xu, _t(void 0, this)),
                o.has("environment") && this.records.set(pe, _t(void 0, this)));
            let i = this.records.get(no);
            (i != null &&
                typeof i.value == "string" &&
                this.scopes.add(i.value),
                (this.injectorDefTypes = new Set(this.get(Nu, kt, S.Self))));
        }
        destroy() {
            (un(this), (this._destroyed = !0));
            let t = R(null);
            try {
                for (let r of this._ngOnDestroyHooks) r.ngOnDestroy();
                let n = this._onDestroyHooks;
                this._onDestroyHooks = [];
                for (let r of n) r();
            } finally {
                (this.records.clear(),
                    this._ngOnDestroyHooks.clear(),
                    this.injectorDefTypes.clear(),
                    R(t));
            }
        }
        onDestroy(t) {
            return (
                un(this),
                this._onDestroyHooks.push(t),
                () => this.removeOnDestroy(t)
            );
        }
        runInContext(t) {
            un(this);
            let n = He(this),
                r = fe(void 0),
                o;
            try {
                return t();
            } finally {
                (He(n), fe(r));
            }
        }
        get(t, n = fn, r = S.Default) {
            if ((un(this), t.hasOwnProperty(Fc))) return t[Fc](this);
            r = eo(r);
            let o,
                i = He(this),
                s = fe(void 0);
            try {
                if (!(r & S.SkipSelf)) {
                    let a = this.records.get(t);
                    if (a === void 0) {
                        let u = tp(t) && Xr(t);
                        (u && this.injectableDefInScope(u)
                            ? (a = _t(Ii(t), Mr))
                            : (a = null),
                            this.records.set(t, a));
                    }
                    if (a != null) return this.hydrate(t, a);
                }
                let c = r & S.Self ? cs() : this.parent;
                return (
                    (n = r & S.Optional && n === fn ? null : n),
                    c.get(t, n)
                );
            } catch (c) {
                if (c.name === "NullInjectorError") {
                    if (((c[Rr] = c[Rr] || []).unshift(ae(t)), i)) throw c;
                    return Hh(c, t, "R3InjectorError", this.source);
                } else throw c;
            } finally {
                (fe(s), He(i));
            }
        }
        resolveInjectorInitializers() {
            let t = R(null),
                n = He(this),
                r = fe(void 0),
                o;
            try {
                let i = this.get(Pt, kt, S.Self);
                for (let s of i) s();
            } finally {
                (He(n), fe(r), R(t));
            }
        }
        toString() {
            let t = [],
                n = this.records;
            for (let r of n.keys()) t.push(ae(r));
            return `R3Injector[${t.join(", ")}]`;
        }
        processProvider(t) {
            t = he(t);
            let n = Ei(t) ? t : he(t && t.provide),
                r = Kh(t);
            if (!Ei(t) && t.multi === !0) {
                let o = this.records.get(n);
                (o ||
                    ((o = _t(void 0, Mr, !0)),
                    (o.factory = () => wi(o.multi)),
                    this.records.set(n, o)),
                    (n = t),
                    o.multi.push(t));
            }
            this.records.set(n, r);
        }
        hydrate(t, n) {
            let r = R(null);
            try {
                return (
                    n.value === Mr && ((n.value = Qh), (n.value = n.factory())),
                    typeof n.value == "object" &&
                        n.value &&
                        ep(n.value) &&
                        this._ngOnDestroyHooks.add(n.value),
                    n.value
                );
            } finally {
                R(r);
            }
        }
        injectableDefInScope(t) {
            if (!t.providedIn) return !1;
            let n = he(t.providedIn);
            return typeof n == "string"
                ? n === "any" || this.scopes.has(n)
                : this.injectorDefTypes.has(n);
        }
        removeOnDestroy(t) {
            let n = this._onDestroyHooks.indexOf(t);
            n !== -1 && this._onDestroyHooks.splice(n, 1);
        }
    };
function Ii(e) {
    let t = Xr(e),
        n = t !== null ? t.factory : Rt(e);
    if (n !== null) return n;
    if (e instanceof w) throw new v(204, !1);
    if (e instanceof Function) return Yh(e);
    throw new v(204, !1);
}
function Yh(e) {
    if (e.length > 0) throw new v(204, !1);
    let n = _h(e);
    return n !== null ? () => n.factory(e) : () => new e();
}
function Kh(e) {
    if (Lu(e)) return _t(void 0, e.useValue);
    {
        let t = Jh(e);
        return _t(t, Mr);
    }
}
function Jh(e, t, n) {
    let r;
    if (Ei(e)) {
        let o = he(e);
        return Rt(o) || Ii(o);
    } else if (Lu(e)) r = () => he(e.useValue);
    else if (Zh(e)) r = () => e.useFactory(...wi(e.deps || []));
    else if (Wh(e)) r = () => M(he(e.useExisting));
    else {
        let o = he(e && (e.useClass || e.provide));
        if (Xh(e)) r = () => new o(...wi(e.deps));
        else return Rt(o) || Ii(o);
    }
    return r;
}
function un(e) {
    if (e.destroyed) throw new v(205, !1);
}
function _t(e, t, n = !1) {
    return { factory: e, value: t, multi: n ? [] : void 0 };
}
function Xh(e) {
    return !!e.deps;
}
function ep(e) {
    return (
        e !== null && typeof e == "object" && typeof e.ngOnDestroy == "function"
    );
}
function tp(e) {
    return typeof e == "function" || (typeof e == "object" && e instanceof w);
}
function bi(e, t) {
    for (let n of e)
        Array.isArray(n) ? bi(n, t) : n && Su(n) ? bi(n.ɵproviders, t) : t(n);
}
function Ie(e, t) {
    e instanceof hn && un(e);
    let n,
        r = He(e),
        o = fe(void 0);
    try {
        return t();
    } finally {
        (He(r), fe(o));
    }
}
function np() {
    return Mu() !== void 0 || Bh() != null;
}
function rp(e) {
    return typeof e == "function";
}
var Fe = 0,
    _ = 1,
    D = 2,
    ee = 3,
    Ce = 4,
    be = 5,
    pn = 6,
    jc = 7,
    J = 8,
    gn = 9,
    ke = 10,
    ue = 11,
    mn = 12,
    Vc = 13,
    In = 14,
    Ee = 15,
    Ft = 16,
    Tt = 17,
    Lt = 18,
    ro = 19,
    ju = 20,
    ze = 21,
    di = 22,
    Pr = 23,
    ce = 24,
    fi = 25,
    _e = 26,
    Vu = 1;
var ot = 7,
    Fr = 8,
    Lr = 9,
    X = 10;
function tt(e) {
    return Array.isArray(e) && typeof e[Vu] == "object";
}
function Le(e) {
    return Array.isArray(e) && e[Vu] === !0;
}
function Bu(e) {
    return (e.flags & 4) !== 0;
}
function bn(e) {
    return e.componentOffset > -1;
}
function $u(e) {
    return (e.flags & 1) === 1;
}
function at(e) {
    return !!e.template;
}
function jr(e) {
    return (e[D] & 512) !== 0;
}
function Sn(e) {
    return (e[D] & 256) === 256;
}
var Si = class {
    previousValue;
    currentValue;
    firstChange;
    constructor(t, n, r) {
        ((this.previousValue = t),
            (this.currentValue = n),
            (this.firstChange = r));
    }
    isFirstChange() {
        return this.firstChange;
    }
};
function Uu(e, t, n, r) {
    t !== null ? t.applyValueToInputSignal(t, r) : (e[n] = r);
}
var us = (() => {
    let e = () => Hu;
    return ((e.ngInherit = !0), e);
})();
function Hu(e) {
    return (e.type.prototype.ngOnChanges && (e.setInput = ip), op);
}
function op() {
    let e = qu(this),
        t = e?.current;
    if (t) {
        let n = e.previous;
        if (n === Ot) e.previous = t;
        else for (let r in t) n[r] = t[r];
        ((e.current = null), this.ngOnChanges(t));
    }
}
function ip(e, t, n, r, o) {
    let i = this.declaredInputs[r],
        s = qu(e) || sp(e, { previous: Ot, current: null }),
        c = s.current || (s.current = {}),
        a = s.previous,
        u = a[i];
    ((c[i] = new Si(u && u.currentValue, n, a === Ot)), Uu(e, t, o, n));
}
var zu = "__ngSimpleChanges__";
function qu(e) {
    return e[zu] || null;
}
function sp(e, t) {
    return (e[zu] = t);
}
var Bc = null;
var L = function (e, t = null, n) {
        Bc?.(e, t, n);
    },
    Gu = "svg",
    ap = "math";
function Pe(e) {
    for (; Array.isArray(e); ) e = e[Fe];
    return e;
}
function cp(e, t) {
    return Pe(t[e]);
}
function Qe(e, t) {
    return Pe(t[e.index]);
}
function ls(e, t) {
    return e.data[t];
}
function qe(e, t) {
    let n = t[e];
    return tt(n) ? n : n[Fe];
}
function ds(e) {
    return (e[D] & 128) === 128;
}
function up(e) {
    return Le(e[ee]);
}
function vn(e, t) {
    return t == null ? null : e[t];
}
function Wu(e) {
    e[Tt] = 0;
}
function fs(e) {
    e[D] & 1024 || ((e[D] |= 1024), ds(e) && io(e));
}
function oo(e) {
    return !!(e[D] & 9216 || e[ce]?.dirty);
}
function Mi(e) {
    (e[ke].changeDetectionScheduler?.notify(8),
        e[D] & 64 && (e[D] |= 1024),
        oo(e) && io(e));
}
function io(e) {
    e[ke].changeDetectionScheduler?.notify(0);
    let t = it(e);
    for (; t !== null && !(t[D] & 8192 || ((t[D] |= 8192), !ds(t))); )
        t = it(t);
}
function Zu(e, t) {
    if (Sn(e)) throw new v(911, !1);
    (e[ze] === null && (e[ze] = []), e[ze].push(t));
}
function lp(e, t) {
    if (e[ze] === null) return;
    let n = e[ze].indexOf(t);
    n !== -1 && e[ze].splice(n, 1);
}
function it(e) {
    let t = e[ee];
    return Le(t) ? t[ee] : t;
}
var A = { lFrame: rl(null), bindingsEnabled: !0, skipHydrationRootTNode: null };
var _i = !1;
function dp() {
    return A.lFrame.elementDepthCount;
}
function fp() {
    A.lFrame.elementDepthCount++;
}
function hp() {
    A.lFrame.elementDepthCount--;
}
function Qu() {
    return A.bindingsEnabled;
}
function pp() {
    return A.skipHydrationRootTNode !== null;
}
function gp(e) {
    return A.skipHydrationRootTNode === e;
}
function mp() {
    A.skipHydrationRootTNode = null;
}
function z() {
    return A.lFrame.lView;
}
function Ut() {
    return A.lFrame.tView;
}
function ct() {
    let e = Yu();
    for (; e !== null && e.type === 64; ) e = e.parent;
    return e;
}
function Yu() {
    return A.lFrame.currentTNode;
}
function vp() {
    let e = A.lFrame,
        t = e.currentTNode;
    return e.isParent ? t : t.parent;
}
function Mn(e, t) {
    let n = A.lFrame;
    ((n.currentTNode = e), (n.isParent = t));
}
function Ku() {
    return A.lFrame.isParent;
}
function yp() {
    A.lFrame.isParent = !1;
}
function Ju() {
    return _i;
}
function $c(e) {
    let t = _i;
    return ((_i = e), t);
}
function Xu() {
    let e = A.lFrame,
        t = e.bindingRootIndex;
    return (
        t === -1 && (t = e.bindingRootIndex = e.tView.bindingStartIndex),
        t
    );
}
function Dp(e) {
    return (A.lFrame.bindingIndex = e);
}
function hs() {
    return A.lFrame.bindingIndex++;
}
function wp() {
    return A.lFrame.inI18n;
}
function Cp(e, t) {
    let n = A.lFrame;
    ((n.bindingIndex = n.bindingRootIndex = e), Ti(t));
}
function Ep() {
    return A.lFrame.currentDirectiveIndex;
}
function Ti(e) {
    A.lFrame.currentDirectiveIndex = e;
}
function el(e) {
    A.lFrame.currentQueryIndex = e;
}
function Ip(e) {
    let t = e[_];
    return t.type === 2 ? t.declTNode : t.type === 1 ? e[be] : null;
}
function tl(e, t, n) {
    if (n & S.SkipSelf) {
        let o = t,
            i = e;
        for (; (o = o.parent), o === null && !(n & S.Host); )
            if (((o = Ip(i)), o === null || ((i = i[In]), o.type & 10))) break;
        if (o === null) return !1;
        ((t = o), (e = i));
    }
    let r = (A.lFrame = nl());
    return ((r.currentTNode = t), (r.lView = e), !0);
}
function ps(e) {
    let t = nl(),
        n = e[_];
    ((A.lFrame = t),
        (t.currentTNode = n.firstChild),
        (t.lView = e),
        (t.tView = n),
        (t.contextLView = e),
        (t.bindingIndex = n.bindingStartIndex),
        (t.inI18n = !1));
}
function nl() {
    let e = A.lFrame,
        t = e === null ? null : e.child;
    return t === null ? rl(e) : t;
}
function rl(e) {
    let t = {
        currentTNode: null,
        isParent: !0,
        lView: null,
        tView: null,
        selectedIndex: -1,
        contextLView: null,
        elementDepthCount: 0,
        currentNamespace: null,
        currentDirectiveIndex: -1,
        bindingRootIndex: -1,
        bindingIndex: -1,
        currentQueryIndex: 0,
        parent: e,
        child: null,
        inI18n: !1,
    };
    return (e !== null && (e.child = t), t);
}
function ol() {
    let e = A.lFrame;
    return (
        (A.lFrame = e.parent),
        (e.currentTNode = null),
        (e.lView = null),
        e
    );
}
var il = ol;
function gs() {
    let e = ol();
    ((e.isParent = !0),
        (e.tView = null),
        (e.selectedIndex = -1),
        (e.contextLView = null),
        (e.elementDepthCount = 0),
        (e.currentDirectiveIndex = -1),
        (e.currentNamespace = null),
        (e.bindingRootIndex = -1),
        (e.bindingIndex = -1),
        (e.currentQueryIndex = 0));
}
function so() {
    return A.lFrame.selectedIndex;
}
function st(e) {
    A.lFrame.selectedIndex = e;
}
function bp() {
    let e = A.lFrame;
    return ls(e.tView, e.selectedIndex);
}
function Ht() {
    A.lFrame.currentNamespace = Gu;
}
function _n() {
    Sp();
}
function Sp() {
    A.lFrame.currentNamespace = null;
}
function Mp() {
    return A.lFrame.currentNamespace;
}
var sl = !0;
function ms() {
    return sl;
}
function vs(e) {
    sl = e;
}
function _p(e, t, n) {
    let { ngOnChanges: r, ngOnInit: o, ngDoCheck: i } = t.type.prototype;
    if (r) {
        let s = Hu(t);
        ((n.preOrderHooks ??= []).push(e, s),
            (n.preOrderCheckHooks ??= []).push(e, s));
    }
    (o && (n.preOrderHooks ??= []).push(0 - e, o),
        i &&
            ((n.preOrderHooks ??= []).push(e, i),
            (n.preOrderCheckHooks ??= []).push(e, i)));
}
function al(e, t) {
    for (let n = t.directiveStart, r = t.directiveEnd; n < r; n++) {
        let i = e.data[n].type.prototype,
            {
                ngAfterContentInit: s,
                ngAfterContentChecked: c,
                ngAfterViewInit: a,
                ngAfterViewChecked: u,
                ngOnDestroy: l,
            } = i;
        (s && (e.contentHooks ??= []).push(-n, s),
            c &&
                ((e.contentHooks ??= []).push(n, c),
                (e.contentCheckHooks ??= []).push(n, c)),
            a && (e.viewHooks ??= []).push(-n, a),
            u &&
                ((e.viewHooks ??= []).push(n, u),
                (e.viewCheckHooks ??= []).push(n, u)),
            l != null && (e.destroyHooks ??= []).push(n, l));
    }
}
function _r(e, t, n) {
    cl(e, t, 3, n);
}
function Tr(e, t, n, r) {
    (e[D] & 3) === n && cl(e, t, n, r);
}
function hi(e, t) {
    let n = e[D];
    (n & 3) === t && ((n &= 16383), (n += 1), (e[D] = n));
}
function cl(e, t, n, r) {
    let o = r !== void 0 ? e[Tt] & 65535 : 0,
        i = r ?? -1,
        s = t.length - 1,
        c = 0;
    for (let a = o; a < s; a++)
        if (typeof t[a + 1] == "number") {
            if (((c = t[a]), r != null && c >= r)) break;
        } else
            (t[a] < 0 && (e[Tt] += 65536),
                (c < i || i == -1) &&
                    (Tp(e, n, t, a), (e[Tt] = (e[Tt] & 4294901760) + a + 2)),
                a++);
}
function Uc(e, t) {
    L(4, e, t);
    let n = R(null);
    try {
        t.call(e);
    } finally {
        (R(n), L(5, e, t));
    }
}
function Tp(e, t, n, r) {
    let o = n[r] < 0,
        i = n[r + 1],
        s = o ? -n[r] : n[r],
        c = e[s];
    o
        ? e[D] >> 14 < e[Tt] >> 16 &&
          (e[D] & 3) === t &&
          ((e[D] += 16384), Uc(c, i))
        : Uc(c, i);
}
var At = -1,
    yn = class {
        factory;
        injectImpl;
        resolving = !1;
        canSeeViewProviders;
        multi;
        componentProviders;
        index;
        providerFactory;
        constructor(t, n, r) {
            ((this.factory = t),
                (this.canSeeViewProviders = n),
                (this.injectImpl = r));
        }
    };
function xp(e) {
    return e instanceof yn;
}
function Np(e) {
    return (e.flags & 8) !== 0;
}
function Ap(e) {
    return (e.flags & 16) !== 0;
}
function Rp(e, t, n) {
    let r = 0;
    for (; r < n.length; ) {
        let o = n[r];
        if (typeof o == "number") {
            if (o !== 0) break;
            r++;
            let i = n[r++],
                s = n[r++],
                c = n[r++];
            e.setAttribute(t, s, c, i);
        } else {
            let i = o,
                s = n[++r];
            (kp(i) ? e.setProperty(t, i, s) : e.setAttribute(t, i, s), r++);
        }
    }
    return r;
}
function Op(e) {
    return e === 3 || e === 4 || e === 6;
}
function kp(e) {
    return e.charCodeAt(0) === 64;
}
function ys(e, t) {
    if (!(t === null || t.length === 0))
        if (e === null || e.length === 0) e = t.slice();
        else {
            let n = -1;
            for (let r = 0; r < t.length; r++) {
                let o = t[r];
                typeof o == "number"
                    ? (n = o)
                    : n === 0 ||
                      (n === -1 || n === 2
                          ? Hc(e, n, o, null, t[++r])
                          : Hc(e, n, o, null, null));
            }
        }
    return e;
}
function Hc(e, t, n, r, o) {
    let i = 0,
        s = e.length;
    if (t === -1) s = -1;
    else
        for (; i < e.length; ) {
            let c = e[i++];
            if (typeof c == "number") {
                if (c === t) {
                    s = -1;
                    break;
                } else if (c > t) {
                    s = i - 1;
                    break;
                }
            }
        }
    for (; i < e.length; ) {
        let c = e[i];
        if (typeof c == "number") break;
        if (c === n) {
            if (r === null) {
                o !== null && (e[i + 1] = o);
                return;
            } else if (r === e[i + 1]) {
                e[i + 2] = o;
                return;
            }
        }
        (i++, r !== null && i++, o !== null && i++);
    }
    (s !== -1 && (e.splice(s, 0, t), (i = s + 1)),
        e.splice(i++, 0, n),
        r !== null && e.splice(i++, 0, r),
        o !== null && e.splice(i++, 0, o));
}
var pi = {},
    xi = class {
        injector;
        parentInjector;
        constructor(t, n) {
            ((this.injector = t), (this.parentInjector = n));
        }
        get(t, n, r) {
            r = eo(r);
            let o = this.injector.get(t, pi, r);
            return o !== pi || n === pi ? o : this.parentInjector.get(t, n, r);
        }
    };
function ul(e) {
    return e !== At;
}
function Vr(e) {
    return e & 32767;
}
function Pp(e) {
    return e >> 16;
}
function Br(e, t) {
    let n = Pp(e),
        r = t;
    for (; n > 0; ) ((r = r[In]), n--);
    return r;
}
var Ni = !0;
function zc(e) {
    let t = Ni;
    return ((Ni = e), t);
}
var Fp = 256,
    ll = Fp - 1,
    dl = 5,
    Lp = 0,
    Me = {};
function jp(e, t, n) {
    let r;
    (typeof n == "string"
        ? (r = n.charCodeAt(0) || 0)
        : n.hasOwnProperty(dn) && (r = n[dn]),
        r == null && (r = n[dn] = Lp++));
    let o = r & ll,
        i = 1 << o;
    t.data[e + (o >> dl)] |= i;
}
function fl(e, t) {
    let n = hl(e, t);
    if (n !== -1) return n;
    let r = t[_];
    r.firstCreatePass &&
        ((e.injectorIndex = t.length),
        gi(r.data, e),
        gi(t, null),
        gi(r.blueprint, null));
    let o = Ds(e, t),
        i = e.injectorIndex;
    if (ul(o)) {
        let s = Vr(o),
            c = Br(o, t),
            a = c[_].data;
        for (let u = 0; u < 8; u++) t[i + u] = c[s + u] | a[s + u];
    }
    return ((t[i + 8] = o), i);
}
function gi(e, t) {
    e.push(0, 0, 0, 0, 0, 0, 0, 0, t);
}
function hl(e, t) {
    return e.injectorIndex === -1 ||
        (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
        t[e.injectorIndex + 8] === null
        ? -1
        : e.injectorIndex;
}
function Ds(e, t) {
    if (e.parent && e.parent.injectorIndex !== -1)
        return e.parent.injectorIndex;
    let n = 0,
        r = null,
        o = t;
    for (; o !== null; ) {
        if (((r = yl(o)), r === null)) return At;
        if ((n++, (o = o[In]), r.injectorIndex !== -1))
            return r.injectorIndex | (n << 16);
    }
    return At;
}
function Vp(e, t, n) {
    jp(e, t, n);
}
function pl(e, t, n) {
    if (n & S.Optional || e !== void 0) return e;
    is(t, "NodeInjector");
}
function gl(e, t, n, r) {
    if (
        (n & S.Optional && r === void 0 && (r = null),
        (n & (S.Self | S.Host)) === 0)
    ) {
        let o = e[gn],
            i = fe(void 0);
        try {
            return o ? o.get(t, r, n & S.Optional) : _u(t, r, n & S.Optional);
        } finally {
            fe(i);
        }
    }
    return pl(r, t, n);
}
function ml(e, t, n, r = S.Default, o) {
    if (e !== null) {
        if (t[D] & 2048 && !(r & S.Self)) {
            let s = zp(e, t, n, r, Me);
            if (s !== Me) return s;
        }
        let i = vl(e, t, n, r, Me);
        if (i !== Me) return i;
    }
    return gl(t, n, r, o);
}
function vl(e, t, n, r, o) {
    let i = Up(n);
    if (typeof i == "function") {
        if (!tl(t, e, r)) return r & S.Host ? pl(o, n, r) : gl(t, n, r, o);
        try {
            let s;
            if (((s = i(r)), s == null && !(r & S.Optional))) is(n);
            else return s;
        } finally {
            il();
        }
    } else if (typeof i == "number") {
        let s = null,
            c = hl(e, t),
            a = At,
            u = r & S.Host ? t[Ee][be] : null;
        for (
            (c === -1 || r & S.SkipSelf) &&
            ((a = c === -1 ? Ds(e, t) : t[c + 8]),
            a === At || !Gc(r, !1)
                ? (c = -1)
                : ((s = t[_]), (c = Vr(a)), (t = Br(a, t))));
            c !== -1;

        ) {
            let l = t[_];
            if (qc(i, c, l.data)) {
                let d = Bp(c, t, n, s, r, u);
                if (d !== Me) return d;
            }
            ((a = t[c + 8]),
                a !== At && Gc(r, t[_].data[c + 8] === u) && qc(i, c, t)
                    ? ((s = l), (c = Vr(a)), (t = Br(a, t)))
                    : (c = -1));
        }
    }
    return o;
}
function Bp(e, t, n, r, o, i) {
    let s = t[_],
        c = s.data[e + 8],
        a = r == null ? bn(c) && Ni : r != s && (c.type & 3) !== 0,
        u = o & S.Host && i === c,
        l = $p(c, s, n, a, u);
    return l !== null ? Ai(t, s, l, c) : Me;
}
function $p(e, t, n, r, o) {
    let i = e.providerIndexes,
        s = t.data,
        c = i & 1048575,
        a = e.directiveStart,
        u = e.directiveEnd,
        l = i >> 20,
        d = r ? c : c + l,
        h = o ? c + l : u;
    for (let f = d; f < h; f++) {
        let g = s[f];
        if ((f < a && n === g) || (f >= a && g.type === n)) return f;
    }
    if (o) {
        let f = s[a];
        if (f && at(f) && f.type === n) return a;
    }
    return null;
}
function Ai(e, t, n, r) {
    let o = e[n],
        i = t.data;
    if (xp(o)) {
        let s = o;
        s.resolving && kh(Oh(i[n]));
        let c = zc(s.canSeeViewProviders);
        s.resolving = !0;
        let a,
            u = s.injectImpl ? fe(s.injectImpl) : null,
            l = tl(e, r, S.Default);
        try {
            ((o = e[n] = s.factory(void 0, i, e, r)),
                t.firstCreatePass && n >= r.directiveStart && _p(n, i[n], t));
        } finally {
            (u !== null && fe(u), zc(c), (s.resolving = !1), il());
        }
    }
    return o;
}
function Up(e) {
    if (typeof e == "string") return e.charCodeAt(0) || 0;
    let t = e.hasOwnProperty(dn) ? e[dn] : void 0;
    return typeof t == "number" ? (t >= 0 ? t & ll : Hp) : t;
}
function qc(e, t, n) {
    let r = 1 << e;
    return !!(n[t + (e >> dl)] & r);
}
function Gc(e, t) {
    return !(e & S.Self) && !(e & S.Host && t);
}
var nt = class {
    _tNode;
    _lView;
    constructor(t, n) {
        ((this._tNode = t), (this._lView = n));
    }
    get(t, n, r) {
        return ml(this._tNode, this._lView, t, eo(r), n);
    }
};
function Hp() {
    return new nt(ct(), z());
}
function ws(e) {
    return rs(() => {
        let t = e.prototype.constructor,
            n = t[Ar] || Ri(t),
            r = Object.prototype,
            o = Object.getPrototypeOf(e.prototype).constructor;
        for (; o && o !== r; ) {
            let i = o[Ar] || Ri(o);
            if (i && i !== n) return i;
            o = Object.getPrototypeOf(o);
        }
        return (i) => new i();
    });
}
function Ri(e) {
    return Cu(e)
        ? () => {
              let t = Ri(he(e));
              return t && t();
          }
        : Rt(e);
}
function zp(e, t, n, r, o) {
    let i = e,
        s = t;
    for (; i !== null && s !== null && s[D] & 2048 && !jr(s); ) {
        let c = vl(i, s, n, r | S.Self, Me);
        if (c !== Me) return c;
        let a = i.parent;
        if (!a) {
            let u = s[ju];
            if (u) {
                let l = u.get(n, Me, r);
                if (l !== Me) return l;
            }
            ((a = yl(s)), (s = s[In]));
        }
        i = a;
    }
    return o;
}
function yl(e) {
    let t = e[_],
        n = t.type;
    return n === 2 ? t.declTNode : n === 1 ? e[be] : null;
}
function Wc(e, t = null, n = null, r) {
    let o = Dl(e, t, n, r);
    return (o.resolveInjectorInitializers(), o);
}
function Dl(e, t = null, n = null, r, o = new Set()) {
    let i = [n || kt, qh(e)];
    return (
        (r = r || (typeof e == "object" ? void 0 : ae(e))),
        new hn(i, t || cs(), r || null, o)
    );
}
var Te = class e {
    static THROW_IF_NOT_FOUND = fn;
    static NULL = new kr();
    static create(t, n) {
        if (Array.isArray(t)) return Wc({ name: "" }, n, t, "");
        {
            let r = t.name ?? "";
            return Wc({ name: r }, t.parent, t.providers, r);
        }
    }
    static ɵprov = C({ token: e, providedIn: "any", factory: () => M(xu) });
    static __NG_ELEMENT_ID__ = -1;
};
var qp = new w("");
qp.__NG_ELEMENT_ID__ = (e) => {
    let t = ct();
    if (t === null) throw new v(204, !1);
    if (t.type & 2) return t.value;
    if (e & S.Optional) return null;
    throw new v(204, !1);
};
var wl = !1,
    ao = (() => {
        class e {
            static __NG_ELEMENT_ID__ = Gp;
            static __NG_ENV_ID__ = (n) => n;
        }
        return e;
    })(),
    Oi = class extends ao {
        _lView;
        constructor(t) {
            (super(), (this._lView = t));
        }
        onDestroy(t) {
            return (Zu(this._lView, t), () => lp(this._lView, t));
        }
    };
function Gp() {
    return new Oi(z());
}
var Dn = class {},
    co = new w("", { providedIn: "root", factory: () => !1 });
var Cl = new w(""),
    El = new w(""),
    zt = (() => {
        class e {
            taskId = 0;
            pendingTasks = new Set();
            get _hasPendingTasks() {
                return this.hasPendingTasks.value;
            }
            hasPendingTasks = new W(!1);
            add() {
                this._hasPendingTasks || this.hasPendingTasks.next(!0);
                let n = this.taskId++;
                return (this.pendingTasks.add(n), n);
            }
            has(n) {
                return this.pendingTasks.has(n);
            }
            remove(n) {
                (this.pendingTasks.delete(n),
                    this.pendingTasks.size === 0 &&
                        this._hasPendingTasks &&
                        this.hasPendingTasks.next(!1));
            }
            ngOnDestroy() {
                (this.pendingTasks.clear(),
                    this._hasPendingTasks && this.hasPendingTasks.next(!1));
            }
            static ɵprov = C({
                token: e,
                providedIn: "root",
                factory: () => new e(),
            });
        }
        return e;
    })();
var ki = class extends K {
        __isAsync;
        destroyRef = void 0;
        pendingTasks = void 0;
        constructor(t = !1) {
            (super(),
                (this.__isAsync = t),
                np() &&
                    ((this.destroyRef = p(ao, { optional: !0 }) ?? void 0),
                    (this.pendingTasks = p(zt, { optional: !0 }) ?? void 0)));
        }
        emit(t) {
            let n = R(null);
            try {
                super.next(t);
            } finally {
                R(n);
            }
        }
        subscribe(t, n, r) {
            let o = t,
                i = n || (() => null),
                s = r;
            if (t && typeof t == "object") {
                let a = t;
                ((o = a.next?.bind(a)),
                    (i = a.error?.bind(a)),
                    (s = a.complete?.bind(a)));
            }
            this.__isAsync &&
                ((i = this.wrapInTimeout(i)),
                o && (o = this.wrapInTimeout(o)),
                s && (s = this.wrapInTimeout(s)));
            let c = super.subscribe({ next: o, error: i, complete: s });
            return (t instanceof B && t.add(c), c);
        }
        wrapInTimeout(t) {
            return (n) => {
                let r = this.pendingTasks?.add();
                setTimeout(() => {
                    (t(n), r !== void 0 && this.pendingTasks?.remove(r));
                });
            };
        }
    },
    se = ki;
function $r(...e) {}
function Il(e) {
    let t, n;
    function r() {
        e = $r;
        try {
            (n !== void 0 &&
                typeof cancelAnimationFrame == "function" &&
                cancelAnimationFrame(n),
                t !== void 0 && clearTimeout(t));
        } catch {}
    }
    return (
        (t = setTimeout(() => {
            (e(), r());
        })),
        typeof requestAnimationFrame == "function" &&
            (n = requestAnimationFrame(() => {
                (e(), r());
            })),
        () => r()
    );
}
function Zc(e) {
    return (
        queueMicrotask(() => e()),
        () => {
            e = $r;
        }
    );
}
var Cs = "isAngularZone",
    Ur = Cs + "_ID",
    Wp = 0,
    Q = class e {
        hasPendingMacrotasks = !1;
        hasPendingMicrotasks = !1;
        isStable = !0;
        onUnstable = new se(!1);
        onMicrotaskEmpty = new se(!1);
        onStable = new se(!1);
        onError = new se(!1);
        constructor(t) {
            let {
                enableLongStackTrace: n = !1,
                shouldCoalesceEventChangeDetection: r = !1,
                shouldCoalesceRunChangeDetection: o = !1,
                scheduleInRootZone: i = wl,
            } = t;
            if (typeof Zone > "u") throw new v(908, !1);
            Zone.assertZonePatched();
            let s = this;
            ((s._nesting = 0),
                (s._outer = s._inner = Zone.current),
                Zone.TaskTrackingZoneSpec &&
                    (s._inner = s._inner.fork(new Zone.TaskTrackingZoneSpec())),
                n &&
                    Zone.longStackTraceZoneSpec &&
                    (s._inner = s._inner.fork(Zone.longStackTraceZoneSpec)),
                (s.shouldCoalesceEventChangeDetection = !o && r),
                (s.shouldCoalesceRunChangeDetection = o),
                (s.callbackScheduled = !1),
                (s.scheduleInRootZone = i),
                Yp(s));
        }
        static isInAngularZone() {
            return typeof Zone < "u" && Zone.current.get(Cs) === !0;
        }
        static assertInAngularZone() {
            if (!e.isInAngularZone()) throw new v(909, !1);
        }
        static assertNotInAngularZone() {
            if (e.isInAngularZone()) throw new v(909, !1);
        }
        run(t, n, r) {
            return this._inner.run(t, n, r);
        }
        runTask(t, n, r, o) {
            let i = this._inner,
                s = i.scheduleEventTask("NgZoneEvent: " + o, t, Zp, $r, $r);
            try {
                return i.runTask(s, n, r);
            } finally {
                i.cancelTask(s);
            }
        }
        runGuarded(t, n, r) {
            return this._inner.runGuarded(t, n, r);
        }
        runOutsideAngular(t) {
            return this._outer.run(t);
        }
    },
    Zp = {};
function Es(e) {
    if (e._nesting == 0 && !e.hasPendingMicrotasks && !e.isStable)
        try {
            (e._nesting++, e.onMicrotaskEmpty.emit(null));
        } finally {
            if ((e._nesting--, !e.hasPendingMicrotasks))
                try {
                    e.runOutsideAngular(() => e.onStable.emit(null));
                } finally {
                    e.isStable = !0;
                }
        }
}
function Qp(e) {
    if (e.isCheckStableRunning || e.callbackScheduled) return;
    e.callbackScheduled = !0;
    function t() {
        Il(() => {
            ((e.callbackScheduled = !1),
                Pi(e),
                (e.isCheckStableRunning = !0),
                Es(e),
                (e.isCheckStableRunning = !1));
        });
    }
    (e.scheduleInRootZone
        ? Zone.root.run(() => {
              t();
          })
        : e._outer.run(() => {
              t();
          }),
        Pi(e));
}
function Yp(e) {
    let t = () => {
            Qp(e);
        },
        n = Wp++;
    e._inner = e._inner.fork({
        name: "angular",
        properties: { [Cs]: !0, [Ur]: n, [Ur + n]: !0 },
        onInvokeTask: (r, o, i, s, c, a) => {
            if (Kp(a)) return r.invokeTask(i, s, c, a);
            try {
                return (Qc(e), r.invokeTask(i, s, c, a));
            } finally {
                (((e.shouldCoalesceEventChangeDetection &&
                    s.type === "eventTask") ||
                    e.shouldCoalesceRunChangeDetection) &&
                    t(),
                    Yc(e));
            }
        },
        onInvoke: (r, o, i, s, c, a, u) => {
            try {
                return (Qc(e), r.invoke(i, s, c, a, u));
            } finally {
                (e.shouldCoalesceRunChangeDetection &&
                    !e.callbackScheduled &&
                    !Jp(a) &&
                    t(),
                    Yc(e));
            }
        },
        onHasTask: (r, o, i, s) => {
            (r.hasTask(i, s),
                o === i &&
                    (s.change == "microTask"
                        ? ((e._hasPendingMicrotasks = s.microTask),
                          Pi(e),
                          Es(e))
                        : s.change == "macroTask" &&
                          (e.hasPendingMacrotasks = s.macroTask)));
        },
        onHandleError: (r, o, i, s) => (
            r.handleError(i, s),
            e.runOutsideAngular(() => e.onError.emit(s)),
            !1
        ),
    });
}
function Pi(e) {
    e._hasPendingMicrotasks ||
    ((e.shouldCoalesceEventChangeDetection ||
        e.shouldCoalesceRunChangeDetection) &&
        e.callbackScheduled === !0)
        ? (e.hasPendingMicrotasks = !0)
        : (e.hasPendingMicrotasks = !1);
}
function Qc(e) {
    (e._nesting++, e.isStable && ((e.isStable = !1), e.onUnstable.emit(null)));
}
function Yc(e) {
    (e._nesting--, Es(e));
}
var Fi = class {
    hasPendingMicrotasks = !1;
    hasPendingMacrotasks = !1;
    isStable = !0;
    onUnstable = new se();
    onMicrotaskEmpty = new se();
    onStable = new se();
    onError = new se();
    run(t, n, r) {
        return t.apply(n, r);
    }
    runGuarded(t, n, r) {
        return t.apply(n, r);
    }
    runOutsideAngular(t) {
        return t();
    }
    runTask(t, n, r, o) {
        return t.apply(n, r);
    }
};
function Kp(e) {
    return bl(e, "__ignore_ng_zone__");
}
function Jp(e) {
    return bl(e, "__scheduler_tick__");
}
function bl(e, t) {
    return !Array.isArray(e) || e.length !== 1 ? !1 : e[0]?.data?.[t] === !0;
}
var Ge = class {
        _console = console;
        handleError(t) {
            this._console.error("ERROR", t);
        }
    },
    Xp = new w("", {
        providedIn: "root",
        factory: () => {
            let e = p(Q),
                t = p(Ge);
            return (n) => e.runOutsideAngular(() => t.handleError(n));
        },
    });
function Kc(e, t) {
    return Du(e, t);
}
function eg(e) {
    return Du(yu, e);
}
var Sl = ((Kc.required = eg), Kc);
function tg() {
    return Is(ct(), z());
}
function Is(e, t) {
    return new uo(Qe(e, t));
}
var uo = (() => {
    class e {
        nativeElement;
        constructor(n) {
            this.nativeElement = n;
        }
        static __NG_ELEMENT_ID__ = tg;
    }
    return e;
})();
function Ml(e) {
    return (e.flags & 128) === 128;
}
var _l = (function (e) {
        return (
            (e[(e.OnPush = 0)] = "OnPush"),
            (e[(e.Default = 1)] = "Default"),
            e
        );
    })(_l || {}),
    Tl = new Map(),
    ng = 0;
function rg() {
    return ng++;
}
function og(e) {
    Tl.set(e[ro], e);
}
function Li(e) {
    Tl.delete(e[ro]);
}
var Jc = "__ngContext__";
function Tn(e, t) {
    tt(t) ? ((e[Jc] = t[ro]), og(t)) : (e[Jc] = t);
}
function xl(e) {
    return Al(e[mn]);
}
function Nl(e) {
    return Al(e[Ce]);
}
function Al(e) {
    for (; e !== null && !Le(e); ) e = e[Ce];
    return e;
}
var ji;
function Rl(e) {
    ji = e;
}
function ig() {
    if (ji !== void 0) return ji;
    if (typeof document < "u") return document;
    throw new v(210, !1);
}
var bs = new w("", { providedIn: "root", factory: () => sg }),
    sg = "ng",
    Ss = new w(""),
    xn = new w("", { providedIn: "platform", factory: () => "unknown" });
var Ms = new w("", {
    providedIn: "root",
    factory: () =>
        ig().body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce") ||
        null,
});
var ag = "h",
    cg = "b";
var Ol = !1,
    ug = new w("", { providedIn: "root", factory: () => Ol });
var kl = (function (e) {
        return (
            (e[(e.CHANGE_DETECTION = 0)] = "CHANGE_DETECTION"),
            (e[(e.AFTER_NEXT_RENDER = 1)] = "AFTER_NEXT_RENDER"),
            e
        );
    })(kl || {}),
    lo = new w(""),
    Xc = new Set();
function fo(e) {
    Xc.has(e) ||
        (Xc.add(e),
        performance?.mark?.("mark_feature_usage", { detail: { feature: e } }));
}
var lg = (() => {
    class e {
        impl = null;
        execute() {
            this.impl?.execute();
        }
        static ɵprov = C({
            token: e,
            providedIn: "root",
            factory: () => new e(),
        });
    }
    return e;
})();
var dg = () => null;
function Pl(e, t, n = !1) {
    return dg(e, t, n);
}
function Fl(e, t) {
    let n = e.contentQueries;
    if (n !== null) {
        let r = R(null);
        try {
            for (let o = 0; o < n.length; o += 2) {
                let i = n[o],
                    s = n[o + 1];
                if (s !== -1) {
                    let c = e.data[s];
                    (el(i), c.contentQueries(2, t[s], s));
                }
            }
        } finally {
            R(r);
        }
    }
}
function Vi(e, t, n) {
    el(0);
    let r = R(null);
    try {
        t(e, n);
    } finally {
        R(r);
    }
}
function Ll(e, t, n) {
    if (Bu(t)) {
        let r = R(null);
        try {
            let o = t.directiveStart,
                i = t.directiveEnd;
            for (let s = o; s < i; s++) {
                let c = e.data[s];
                if (c.contentQueries) {
                    let a = n[s];
                    c.contentQueries(1, a, s);
                }
            }
        } finally {
            R(r);
        }
    }
}
var xe = (function (e) {
    return (
        (e[(e.Emulated = 0)] = "Emulated"),
        (e[(e.None = 2)] = "None"),
        (e[(e.ShadowDom = 3)] = "ShadowDom"),
        e
    );
})(xe || {});
var Hr = class {
    changingThisBreaksApplicationSecurity;
    constructor(t) {
        this.changingThisBreaksApplicationSecurity = t;
    }
    toString() {
        return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${vu})`;
    }
};
function _s(e) {
    return e instanceof Hr ? e.changingThisBreaksApplicationSecurity : e;
}
function jl(e, t) {
    let n = fg(e);
    if (n != null && n !== t) {
        if (n === "ResourceURL" && t === "URL") return !0;
        throw new Error(`Required a safe ${t}, got a ${n} (see ${vu})`);
    }
    return n === t;
}
function fg(e) {
    return (e instanceof Hr && e.getTypeName()) || null;
}
var hg = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
function Vl(e) {
    return ((e = String(e)), e.match(hg) ? e : "unsafe:" + e);
}
var Ts = (function (e) {
    return (
        (e[(e.NONE = 0)] = "NONE"),
        (e[(e.HTML = 1)] = "HTML"),
        (e[(e.STYLE = 2)] = "STYLE"),
        (e[(e.SCRIPT = 3)] = "SCRIPT"),
        (e[(e.URL = 4)] = "URL"),
        (e[(e.RESOURCE_URL = 5)] = "RESOURCE_URL"),
        e
    );
})(Ts || {});
function Bl(e) {
    let t = pg();
    return t ? t.sanitize(Ts.URL, e) || "" : jl(e, "URL") ? _s(e) : Vl(os(e));
}
function pg() {
    let e = z();
    return e && e[ke].sanitizer;
}
function $l(e) {
    return e instanceof Function ? e() : e;
}
function gg(e, t, n) {
    let r = e.length;
    for (;;) {
        let o = e.indexOf(t, n);
        if (o === -1) return o;
        if (o === 0 || e.charCodeAt(o - 1) <= 32) {
            let i = t.length;
            if (o + i === r || e.charCodeAt(o + i) <= 32) return o;
        }
        n = o + 1;
    }
}
var Ul = "ng-template";
function mg(e, t, n, r) {
    let o = 0;
    if (r) {
        for (; o < t.length && typeof t[o] == "string"; o += 2)
            if (t[o] === "class" && gg(t[o + 1].toLowerCase(), n, 0) !== -1)
                return !0;
    } else if (xs(e)) return !1;
    if (((o = t.indexOf(1, o)), o > -1)) {
        let i;
        for (; ++o < t.length && typeof (i = t[o]) == "string"; )
            if (i.toLowerCase() === n) return !0;
    }
    return !1;
}
function xs(e) {
    return e.type === 4 && e.value !== Ul;
}
function vg(e, t, n) {
    let r = e.type === 4 && !n ? Ul : e.value;
    return t === r;
}
function yg(e, t, n) {
    let r = 4,
        o = e.attrs,
        i = o !== null ? Cg(o) : 0,
        s = !1;
    for (let c = 0; c < t.length; c++) {
        let a = t[c];
        if (typeof a == "number") {
            if (!s && !we(r) && !we(a)) return !1;
            if (s && we(a)) continue;
            ((s = !1), (r = a | (r & 1)));
            continue;
        }
        if (!s)
            if (r & 4) {
                if (
                    ((r = 2 | (r & 1)),
                    (a !== "" && !vg(e, a, n)) || (a === "" && t.length === 1))
                ) {
                    if (we(r)) return !1;
                    s = !0;
                }
            } else if (r & 8) {
                if (o === null || !mg(e, o, a, n)) {
                    if (we(r)) return !1;
                    s = !0;
                }
            } else {
                let u = t[++c],
                    l = Dg(a, o, xs(e), n);
                if (l === -1) {
                    if (we(r)) return !1;
                    s = !0;
                    continue;
                }
                if (u !== "") {
                    let d;
                    if (
                        (l > i ? (d = "") : (d = o[l + 1].toLowerCase()),
                        r & 2 && u !== d)
                    ) {
                        if (we(r)) return !1;
                        s = !0;
                    }
                }
            }
    }
    return we(r) || s;
}
function we(e) {
    return (e & 1) === 0;
}
function Dg(e, t, n, r) {
    if (t === null) return -1;
    let o = 0;
    if (r || !n) {
        let i = !1;
        for (; o < t.length; ) {
            let s = t[o];
            if (s === e) return o;
            if (s === 3 || s === 6) i = !0;
            else if (s === 1 || s === 2) {
                let c = t[++o];
                for (; typeof c == "string"; ) c = t[++o];
                continue;
            } else {
                if (s === 4) break;
                if (s === 0) {
                    o += 4;
                    continue;
                }
            }
            o += i ? 1 : 2;
        }
        return -1;
    } else return Eg(t, e);
}
function wg(e, t, n = !1) {
    for (let r = 0; r < t.length; r++) if (yg(e, t[r], n)) return !0;
    return !1;
}
function Cg(e) {
    for (let t = 0; t < e.length; t++) {
        let n = e[t];
        if (Op(n)) return t;
    }
    return e.length;
}
function Eg(e, t) {
    let n = e.indexOf(4);
    if (n > -1)
        for (n++; n < e.length; ) {
            let r = e[n];
            if (typeof r == "number") return -1;
            if (r === t) return n;
            n++;
        }
    return -1;
}
function eu(e, t) {
    return e ? ":not(" + t.trim() + ")" : t;
}
function Ig(e) {
    let t = e[0],
        n = 1,
        r = 2,
        o = "",
        i = !1;
    for (; n < e.length; ) {
        let s = e[n];
        if (typeof s == "string")
            if (r & 2) {
                let c = e[++n];
                o += "[" + s + (c.length > 0 ? '="' + c + '"' : "") + "]";
            } else r & 8 ? (o += "." + s) : r & 4 && (o += " " + s);
        else
            (o !== "" && !we(s) && ((t += eu(i, o)), (o = "")),
                (r = s),
                (i = i || !we(r)));
        n++;
    }
    return (o !== "" && (t += eu(i, o)), t);
}
function bg(e) {
    return e.map(Ig).join(",");
}
function Sg(e) {
    let t = [],
        n = [],
        r = 1,
        o = 2;
    for (; r < e.length; ) {
        let i = e[r];
        if (typeof i == "string")
            o === 2 ? i !== "" && t.push(i, e[++r]) : o === 8 && n.push(i);
        else {
            if (!we(o)) break;
            o = i;
        }
        r++;
    }
    return (n.length && t.push(1, ...n), t);
}
var Nn = {};
function Mg(e, t) {
    return e.createText(t);
}
function _g(e, t, n) {
    e.setValue(t, n);
}
function Hl(e, t, n) {
    return e.createElement(t, n);
}
function zr(e, t, n, r, o) {
    e.insertBefore(t, n, r, o);
}
function zl(e, t, n) {
    e.appendChild(t, n);
}
function tu(e, t, n, r, o) {
    r !== null ? zr(e, t, n, r, o) : zl(e, t, n);
}
function Tg(e, t, n) {
    e.removeChild(null, t, n);
}
function xg(e, t, n) {
    e.setAttribute(t, "style", n);
}
function Ng(e, t, n) {
    n === "" ? e.removeAttribute(t, "class") : e.setAttribute(t, "class", n);
}
function ql(e, t, n) {
    let { mergedAttrs: r, classes: o, styles: i } = n;
    (r !== null && Rp(e, t, r),
        o !== null && Ng(e, t, o),
        i !== null && xg(e, t, i));
}
function Ns(e, t, n, r, o, i, s, c, a, u, l) {
    let d = _e + r,
        h = d + o,
        f = Ag(d, h),
        g = typeof u == "function" ? u() : u;
    return (f[_] = {
        type: e,
        blueprint: f,
        template: n,
        queries: null,
        viewQuery: c,
        declTNode: t,
        data: f.slice().fill(null, d),
        bindingStartIndex: d,
        expandoStartIndex: h,
        hostBindingOpCodes: null,
        firstCreatePass: !0,
        firstUpdatePass: !0,
        staticViewQueries: !1,
        staticContentQueries: !1,
        preOrderHooks: null,
        preOrderCheckHooks: null,
        contentHooks: null,
        contentCheckHooks: null,
        viewHooks: null,
        viewCheckHooks: null,
        destroyHooks: null,
        cleanup: null,
        contentQueries: null,
        components: null,
        directiveRegistry: typeof i == "function" ? i() : i,
        pipeRegistry: typeof s == "function" ? s() : s,
        firstChild: null,
        schemas: a,
        consts: g,
        incompleteFirstPass: !1,
        ssrId: l,
    });
}
function Ag(e, t) {
    let n = [];
    for (let r = 0; r < t; r++) n.push(r < e ? null : Nn);
    return n;
}
function Rg(e) {
    let t = e.tView;
    return t === null || t.incompleteFirstPass
        ? (e.tView = Ns(
              1,
              null,
              e.template,
              e.decls,
              e.vars,
              e.directiveDefs,
              e.pipeDefs,
              e.viewQuery,
              e.schemas,
              e.consts,
              e.id,
          ))
        : t;
}
function As(e, t, n, r, o, i, s, c, a, u, l) {
    let d = t.blueprint.slice();
    return (
        (d[Fe] = o),
        (d[D] = r | 4 | 128 | 8 | 64 | 1024),
        (u !== null || (e && e[D] & 2048)) && (d[D] |= 2048),
        Wu(d),
        (d[ee] = d[In] = e),
        (d[J] = n),
        (d[ke] = s || (e && e[ke])),
        (d[ue] = c || (e && e[ue])),
        (d[gn] = a || (e && e[gn]) || null),
        (d[be] = i),
        (d[ro] = rg()),
        (d[pn] = l),
        (d[ju] = u),
        (d[Ee] = t.type == 2 ? e[Ee] : d),
        d
    );
}
function Og(e, t, n) {
    let r = Qe(t, e),
        o = Rg(n),
        i = e[ke].rendererFactory,
        s = Rs(
            e,
            As(
                e,
                o,
                null,
                Gl(n),
                r,
                t,
                null,
                i.createRenderer(r, n),
                null,
                null,
                null,
            ),
        );
    return (e[t.index] = s);
}
function Gl(e) {
    let t = 16;
    return (e.signals ? (t = 4096) : e.onPush && (t = 64), t);
}
function Wl(e, t, n, r) {
    if (n === 0) return -1;
    let o = t.length;
    for (let i = 0; i < n; i++)
        (t.push(r), e.blueprint.push(r), e.data.push(null));
    return o;
}
function Rs(e, t) {
    return (e[mn] ? (e[Vc][Ce] = t) : (e[mn] = t), (e[Vc] = t), t);
}
function ho(e = 1) {
    Zl(Ut(), z(), so() + e, !1);
}
function Zl(e, t, n, r) {
    if (!r)
        if ((t[D] & 3) === 3) {
            let i = e.preOrderCheckHooks;
            i !== null && _r(t, i, n);
        } else {
            let i = e.preOrderHooks;
            i !== null && Tr(t, i, 0, n);
        }
    st(n);
}
var po = (function (e) {
    return (
        (e[(e.None = 0)] = "None"),
        (e[(e.SignalBased = 1)] = "SignalBased"),
        (e[(e.HasDecoratorInputTransform = 2)] = "HasDecoratorInputTransform"),
        e
    );
})(po || {});
function Bi(e, t, n, r) {
    let o = R(null);
    try {
        let [i, s, c] = e.inputs[n],
            a = null;
        ((s & po.SignalBased) !== 0 && (a = t[i][gt]),
            a !== null && a.transformFn !== void 0
                ? (r = a.transformFn(r))
                : c !== null && (r = c.call(t, r)),
            e.setInput !== null ? e.setInput(t, a, r, n, i) : Uu(t, a, i, r));
    } finally {
        R(o);
    }
}
function Ql(e, t, n, r, o) {
    let i = so(),
        s = r & 2;
    try {
        (st(-1),
            s && t.length > _e && Zl(e, t, _e, !1),
            L(s ? 2 : 0, o),
            n(r, o));
    } finally {
        (st(i), L(s ? 3 : 1, o));
    }
}
function Os(e, t, n) {
    (Bg(e, t, n), (n.flags & 64) === 64 && $g(e, t, n));
}
function Yl(e, t, n = Qe) {
    let r = t.localNames;
    if (r !== null) {
        let o = t.index + 1;
        for (let i = 0; i < r.length; i += 2) {
            let s = r[i + 1],
                c = s === -1 ? n(t, e) : e[s];
            e[o++] = c;
        }
    }
}
function kg(e, t, n, r) {
    let i = r.get(ug, Ol) || n === xe.ShadowDom,
        s = e.selectRootElement(t, i);
    return (Pg(s), s);
}
function Pg(e) {
    Fg(e);
}
var Fg = () => null;
function Lg(e) {
    return e === "class"
        ? "className"
        : e === "for"
          ? "htmlFor"
          : e === "formaction"
            ? "formAction"
            : e === "innerHtml"
              ? "innerHTML"
              : e === "readonly"
                ? "readOnly"
                : e === "tabindex"
                  ? "tabIndex"
                  : e;
}
function jg(e, t, n, r, o, i, s, c) {
    if (!c && ks(t, e, n, r, o)) {
        bn(t) && Vg(n, t.index);
        return;
    }
    if (t.type & 3) {
        let a = Qe(t, n);
        ((r = Lg(r)),
            (o = s != null ? s(o, t.value || "", r) : o),
            i.setProperty(a, r, o));
    } else t.type & 12;
}
function Vg(e, t) {
    let n = qe(t, e);
    n[D] & 16 || (n[D] |= 64);
}
function Bg(e, t, n) {
    let r = n.directiveStart,
        o = n.directiveEnd;
    (bn(n) && Og(t, n, e.data[r + n.componentOffset]),
        e.firstCreatePass || fl(n, t));
    let i = n.initialInputs;
    for (let s = r; s < o; s++) {
        let c = e.data[s],
            a = Ai(t, e, s, n);
        if ((Tn(a, t), i !== null && Hg(t, s - r, a, c, n, i), at(c))) {
            let u = qe(n.index, t);
            u[J] = Ai(t, e, s, n);
        }
    }
}
function $g(e, t, n) {
    let r = n.directiveStart,
        o = n.directiveEnd,
        i = n.index,
        s = Ep();
    try {
        st(i);
        for (let c = r; c < o; c++) {
            let a = e.data[c],
                u = t[c];
            (Ti(c),
                (a.hostBindings !== null ||
                    a.hostVars !== 0 ||
                    a.hostAttrs !== null) &&
                    Ug(a, u));
        }
    } finally {
        (st(-1), Ti(s));
    }
}
function Ug(e, t) {
    e.hostBindings !== null && e.hostBindings(1, t);
}
function Kl(e, t) {
    let n = e.directiveRegistry,
        r = null;
    if (n)
        for (let o = 0; o < n.length; o++) {
            let i = n[o];
            wg(t, i.selectors, !1) &&
                ((r ??= []), at(i) ? r.unshift(i) : r.push(i));
        }
    return r;
}
function Hg(e, t, n, r, o, i) {
    let s = i[t];
    if (s !== null)
        for (let c = 0; c < s.length; c += 2) {
            let a = s[c],
                u = s[c + 1];
            Bi(r, n, a, u);
        }
}
function zg(e, t) {
    let n = e[gn],
        r = n ? n.get(Ge, null) : null;
    r && r.handleError(t);
}
function ks(e, t, n, r, o) {
    let i = e.inputs?.[r],
        s = e.hostDirectiveInputs?.[r],
        c = !1;
    if (s)
        for (let a = 0; a < s.length; a += 2) {
            let u = s[a],
                l = s[a + 1],
                d = t.data[u];
            (Bi(d, n[u], l, o), (c = !0));
        }
    if (i)
        for (let a of i) {
            let u = n[a],
                l = t.data[a];
            (Bi(l, u, r, o), (c = !0));
        }
    return c;
}
function qg(e, t) {
    let n = qe(t, e),
        r = n[_];
    Gg(r, n);
    let o = n[Fe];
    (o !== null && n[pn] === null && (n[pn] = Pl(o, n[gn])),
        L(18),
        Ps(r, n, n[J]),
        L(19, n[J]));
}
function Gg(e, t) {
    for (let n = t.length; n < e.blueprint.length; n++) t.push(e.blueprint[n]);
}
function Ps(e, t, n) {
    ps(t);
    try {
        let r = e.viewQuery;
        r !== null && Vi(1, r, n);
        let o = e.template;
        (o !== null && Ql(e, t, o, 1, n),
            e.firstCreatePass && (e.firstCreatePass = !1),
            t[Lt]?.finishViewCreation(e),
            e.staticContentQueries && Fl(e, t),
            e.staticViewQueries && Vi(2, e.viewQuery, n));
        let i = e.components;
        i !== null && Wg(t, i);
    } catch (r) {
        throw (
            e.firstCreatePass &&
                ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)),
            r
        );
    } finally {
        ((t[D] &= -5), gs());
    }
}
function Wg(e, t) {
    for (let n = 0; n < t.length; n++) qg(e, t[n]);
}
function Jl(e, t, n, r) {
    let o = R(null);
    try {
        let i = t.tView,
            c = e[D] & 4096 ? 4096 : 16,
            a = As(
                e,
                i,
                n,
                c,
                null,
                t,
                null,
                null,
                r?.injector ?? null,
                r?.embeddedViewInjector ?? null,
                r?.dehydratedView ?? null,
            ),
            u = e[t.index];
        a[Ft] = u;
        let l = e[Lt];
        return (
            l !== null && (a[Lt] = l.createEmbeddedView(i)),
            Ps(i, a, n),
            a
        );
    } finally {
        R(o);
    }
}
function qr(e, t) {
    return !t || t.firstChild === null || Ml(e);
}
var Zg;
function Fs(e, t) {
    return Zg(e, t);
}
var ut = (function (e) {
    return (
        (e[(e.Important = 1)] = "Important"),
        (e[(e.DashCase = 2)] = "DashCase"),
        e
    );
})(ut || {});
function Xl(e) {
    return (e.flags & 32) === 32;
}
function xt(e, t, n, r, o) {
    if (r != null) {
        let i,
            s = !1;
        Le(r) ? (i = r) : tt(r) && ((s = !0), (r = r[Fe]));
        let c = Pe(r);
        (e === 0 && n !== null
            ? o == null
                ? zl(t, n, c)
                : zr(t, n, c, o || null, !0)
            : e === 1 && n !== null
              ? zr(t, n, c, o || null, !0)
              : e === 2
                ? Tg(t, c, s)
                : e === 3 && t.destroyNode(c),
            i != null && sm(t, e, i, n, o));
    }
}
function Qg(e, t) {
    (ed(e, t), (t[Fe] = null), (t[be] = null));
}
function Yg(e, t, n, r, o, i) {
    ((r[Fe] = o), (r[be] = t), mo(e, r, n, 1, o, i));
}
function ed(e, t) {
    (t[ke].changeDetectionScheduler?.notify(9), mo(e, t, t[ue], 2, null, null));
}
function Kg(e) {
    let t = e[mn];
    if (!t) return mi(e[_], e);
    for (; t; ) {
        let n = null;
        if (tt(t)) n = t[mn];
        else {
            let r = t[X];
            r && (n = r);
        }
        if (!n) {
            for (; t && !t[Ce] && t !== e; )
                (tt(t) && mi(t[_], t), (t = t[ee]));
            (t === null && (t = e), tt(t) && mi(t[_], t), (n = t && t[Ce]));
        }
        t = n;
    }
}
function Ls(e, t) {
    let n = e[Lr],
        r = n.indexOf(t);
    n.splice(r, 1);
}
function go(e, t) {
    if (Sn(t)) return;
    let n = t[ue];
    (n.destroyNode && mo(e, t, n, 3, null, null), Kg(t));
}
function mi(e, t) {
    if (Sn(t)) return;
    let n = R(null);
    try {
        ((t[D] &= -129),
            (t[D] |= 256),
            t[ce] && Zo(t[ce]),
            Xg(e, t),
            Jg(e, t),
            t[_].type === 1 && t[ue].destroy());
        let r = t[Ft];
        if (r !== null && Le(t[ee])) {
            r !== t[ee] && Ls(r, t);
            let o = t[Lt];
            o !== null && o.detachView(e);
        }
        Li(t);
    } finally {
        R(n);
    }
}
function Jg(e, t) {
    let n = e.cleanup,
        r = t[jc];
    if (n !== null)
        for (let s = 0; s < n.length - 1; s += 2)
            if (typeof n[s] == "string") {
                let c = n[s + 3];
                (c >= 0 ? r[c]() : r[-c].unsubscribe(), (s += 2));
            } else {
                let c = r[n[s + 1]];
                n[s].call(c);
            }
    r !== null && (t[jc] = null);
    let o = t[ze];
    if (o !== null) {
        t[ze] = null;
        for (let s = 0; s < o.length; s++) {
            let c = o[s];
            c();
        }
    }
    let i = t[Pr];
    if (i !== null) {
        t[Pr] = null;
        for (let s of i) s.destroy();
    }
}
function Xg(e, t) {
    let n;
    if (e != null && (n = e.destroyHooks) != null)
        for (let r = 0; r < n.length; r += 2) {
            let o = t[n[r]];
            if (!(o instanceof yn)) {
                let i = n[r + 1];
                if (Array.isArray(i))
                    for (let s = 0; s < i.length; s += 2) {
                        let c = o[i[s]],
                            a = i[s + 1];
                        L(4, c, a);
                        try {
                            a.call(c);
                        } finally {
                            L(5, c, a);
                        }
                    }
                else {
                    L(4, o, i);
                    try {
                        i.call(o);
                    } finally {
                        L(5, o, i);
                    }
                }
            }
        }
}
function em(e, t, n) {
    return tm(e, t.parent, n);
}
function tm(e, t, n) {
    let r = t;
    for (; r !== null && r.type & 168; ) ((t = r), (r = t.parent));
    if (r === null) return n[Fe];
    if (bn(r)) {
        let { encapsulation: o } = e.data[r.directiveStart + r.componentOffset];
        if (o === xe.None || o === xe.Emulated) return null;
    }
    return Qe(r, n);
}
function nm(e, t, n) {
    return om(e, t, n);
}
function rm(e, t, n) {
    return e.type & 40 ? Qe(e, n) : null;
}
var om = rm,
    nu;
function js(e, t, n, r) {
    let o = em(e, r, t),
        i = t[ue],
        s = r.parent || t[be],
        c = nm(s, r, t);
    if (o != null)
        if (Array.isArray(n))
            for (let a = 0; a < n.length; a++) tu(i, o, n[a], c, !1);
        else tu(i, o, n, c, !1);
    nu !== void 0 && nu(i, r, t, n, o);
}
function ln(e, t) {
    if (t !== null) {
        let n = t.type;
        if (n & 3) return Qe(t, e);
        if (n & 4) return $i(-1, e[t.index]);
        if (n & 8) {
            let r = t.child;
            if (r !== null) return ln(e, r);
            {
                let o = e[t.index];
                return Le(o) ? $i(-1, o) : Pe(o);
            }
        } else {
            if (n & 128) return ln(e, t.next);
            if (n & 32) return Fs(t, e)() || Pe(e[t.index]);
            {
                let r = td(e, t);
                if (r !== null) {
                    if (Array.isArray(r)) return r[0];
                    let o = it(e[Ee]);
                    return ln(o, r);
                } else return ln(e, t.next);
            }
        }
    }
    return null;
}
function td(e, t) {
    if (t !== null) {
        let r = e[Ee][be],
            o = t.projection;
        return r.projection[o];
    }
    return null;
}
function $i(e, t) {
    let n = X + e + 1;
    if (n < t.length) {
        let r = t[n],
            o = r[_].firstChild;
        if (o !== null) return ln(r, o);
    }
    return t[ot];
}
function Vs(e, t, n, r, o, i, s) {
    for (; n != null; ) {
        if (n.type === 128) {
            n = n.next;
            continue;
        }
        let c = r[n.index],
            a = n.type;
        if ((s && t === 0 && (c && Tn(Pe(c), r), (n.flags |= 2)), !Xl(n)))
            if (a & 8) (Vs(e, t, n.child, r, o, i, !1), xt(t, e, o, c, i));
            else if (a & 32) {
                let u = Fs(n, r),
                    l;
                for (; (l = u()); ) xt(t, e, o, l, i);
                xt(t, e, o, c, i);
            } else a & 16 ? im(e, t, r, n, o, i) : xt(t, e, o, c, i);
        n = s ? n.projectionNext : n.next;
    }
}
function mo(e, t, n, r, o, i) {
    Vs(n, r, e.firstChild, t, o, i, !1);
}
function im(e, t, n, r, o, i) {
    let s = n[Ee],
        a = s[be].projection[r.projection];
    if (Array.isArray(a))
        for (let u = 0; u < a.length; u++) {
            let l = a[u];
            xt(t, e, o, l, i);
        }
    else {
        let u = a,
            l = s[ee];
        (Ml(r) && (u.flags |= 128), Vs(e, t, u, l, o, i, !0));
    }
}
function sm(e, t, n, r, o) {
    let i = n[ot],
        s = Pe(n);
    i !== s && xt(t, e, r, i, o);
    for (let c = X; c < n.length; c++) {
        let a = n[c];
        mo(a[_], a, e, t, r, i);
    }
}
function Gr(e, t, n, r, o = !1) {
    for (; n !== null; ) {
        if (n.type === 128) {
            n = o ? n.projectionNext : n.next;
            continue;
        }
        let i = t[n.index];
        (i !== null && r.push(Pe(i)), Le(i) && am(i, r));
        let s = n.type;
        if (s & 8) Gr(e, t, n.child, r);
        else if (s & 32) {
            let c = Fs(n, t),
                a;
            for (; (a = c()); ) r.push(a);
        } else if (s & 16) {
            let c = td(t, n);
            if (Array.isArray(c)) r.push(...c);
            else {
                let a = it(t[Ee]);
                Gr(a[_], a, c, r, !0);
            }
        }
        n = o ? n.projectionNext : n.next;
    }
    return r;
}
function am(e, t) {
    for (let n = X; n < e.length; n++) {
        let r = e[n],
            o = r[_].firstChild;
        o !== null && Gr(r[_], r, o, t);
    }
    e[ot] !== e[Fe] && t.push(e[ot]);
}
function nd(e) {
    if (e[fi] !== null) {
        for (let t of e[fi]) t.impl.addSequence(t);
        e[fi].length = 0;
    }
}
var rd = [];
function cm(e) {
    return e[ce] ?? um(e);
}
function um(e) {
    let t = rd.pop() ?? Object.create(dm);
    return ((t.lView = e), t);
}
function lm(e) {
    e.lView[ce] !== e && ((e.lView = null), rd.push(e));
}
var dm = F(m({}, rr), {
    consumerIsAlwaysLive: !0,
    kind: "template",
    consumerMarkedDirty: (e) => {
        io(e.lView);
    },
    consumerOnSignalRead() {
        this.lView[ce] = this;
    },
});
function fm(e) {
    let t = e[ce] ?? Object.create(hm);
    return ((t.lView = e), t);
}
var hm = F(m({}, rr), {
    consumerIsAlwaysLive: !0,
    kind: "template",
    consumerMarkedDirty: (e) => {
        let t = it(e.lView);
        for (; t && !od(t[_]); ) t = it(t);
        t && fs(t);
    },
    consumerOnSignalRead() {
        this.lView[ce] = this;
    },
});
function od(e) {
    return e.type !== 2;
}
function id(e) {
    if (e[Pr] === null) return;
    let t = !0;
    for (; t; ) {
        let n = !1;
        for (let r of e[Pr])
            r.dirty &&
                ((n = !0),
                r.zone === null || Zone.current === r.zone
                    ? r.run()
                    : r.zone.run(() => r.run()));
        t = n && !!(e[D] & 8192);
    }
}
var pm = 100;
function sd(e, t = !0, n = 0) {
    let o = e[ke].rendererFactory,
        i = !1;
    i || o.begin?.();
    try {
        gm(e, n);
    } catch (s) {
        throw (t && zg(e, s), s);
    } finally {
        i || o.end?.();
    }
}
function gm(e, t) {
    let n = Ju();
    try {
        ($c(!0), Ui(e, t));
        let r = 0;
        for (; oo(e); ) {
            if (r === pm) throw new v(103, !1);
            (r++, Ui(e, 1));
        }
    } finally {
        $c(n);
    }
}
function mm(e, t, n, r) {
    if (Sn(t)) return;
    let o = t[D],
        i = !1,
        s = !1;
    ps(t);
    let c = !0,
        a = null,
        u = null;
    i ||
        (od(e)
            ? ((u = cm(t)), (a = Go(u)))
            : Wa() === null
              ? ((c = !1), (u = fm(t)), (a = Go(u)))
              : t[ce] && (Zo(t[ce]), (t[ce] = null)));
    try {
        (Wu(t), Dp(e.bindingStartIndex), n !== null && Ql(e, t, n, 2, r));
        let l = (o & 3) === 3;
        if (!i)
            if (l) {
                let f = e.preOrderCheckHooks;
                f !== null && _r(t, f, null);
            } else {
                let f = e.preOrderHooks;
                (f !== null && Tr(t, f, 0, null), hi(t, 0));
            }
        if (
            (s || vm(t),
            id(t),
            ad(t, 0),
            e.contentQueries !== null && Fl(e, t),
            !i)
        )
            if (l) {
                let f = e.contentCheckHooks;
                f !== null && _r(t, f);
            } else {
                let f = e.contentHooks;
                (f !== null && Tr(t, f, 1), hi(t, 1));
            }
        Dm(e, t);
        let d = e.components;
        d !== null && ud(t, d, 0);
        let h = e.viewQuery;
        if ((h !== null && Vi(2, h, r), !i))
            if (l) {
                let f = e.viewCheckHooks;
                f !== null && _r(t, f);
            } else {
                let f = e.viewHooks;
                (f !== null && Tr(t, f, 2), hi(t, 2));
            }
        if ((e.firstUpdatePass === !0 && (e.firstUpdatePass = !1), t[di])) {
            for (let f of t[di]) f();
            t[di] = null;
        }
        i || (nd(t), (t[D] &= -73));
    } catch (l) {
        throw (i || io(t), l);
    } finally {
        (u !== null && (Ya(u, a), c && lm(u)), gs());
    }
}
function ad(e, t) {
    for (let n = xl(e); n !== null; n = Nl(n))
        for (let r = X; r < n.length; r++) {
            let o = n[r];
            cd(o, t);
        }
}
function vm(e) {
    for (let t = xl(e); t !== null; t = Nl(t)) {
        if (!(t[D] & 2)) continue;
        let n = t[Lr];
        for (let r = 0; r < n.length; r++) {
            let o = n[r];
            fs(o);
        }
    }
}
function ym(e, t, n) {
    L(18);
    let r = qe(t, e);
    (cd(r, n), L(19, r[J]));
}
function cd(e, t) {
    ds(e) && Ui(e, t);
}
function Ui(e, t) {
    let r = e[_],
        o = e[D],
        i = e[ce],
        s = !!(t === 0 && o & 16);
    if (
        ((s ||= !!(o & 64 && t === 0)),
        (s ||= !!(o & 1024)),
        (s ||= !!(i?.dirty && Wo(i))),
        (s ||= !1),
        i && (i.dirty = !1),
        (e[D] &= -9217),
        s)
    )
        mm(r, e, r.template, e[J]);
    else if (o & 8192) {
        (id(e), ad(e, 1));
        let c = r.components;
        (c !== null && ud(e, c, 1), nd(e));
    }
}
function ud(e, t, n) {
    for (let r = 0; r < t.length; r++) ym(e, t[r], n);
}
function Dm(e, t) {
    let n = e.hostBindingOpCodes;
    if (n !== null)
        try {
            for (let r = 0; r < n.length; r++) {
                let o = n[r];
                if (o < 0) st(~o);
                else {
                    let i = o,
                        s = n[++r],
                        c = n[++r];
                    Cp(s, i);
                    let a = t[i];
                    (L(24, a), c(2, a), L(25, a));
                }
            }
        } finally {
            st(-1);
        }
}
function ld(e, t) {
    let n = Ju() ? 64 : 1088;
    for (e[ke].changeDetectionScheduler?.notify(t); e; ) {
        e[D] |= n;
        let r = it(e);
        if (jr(e) && !r) return e;
        e = r;
    }
    return null;
}
function dd(e, t, n, r) {
    return [e, !0, 0, t, null, r, null, n, null, null];
}
function wm(e, t) {
    let n = X + t;
    if (n < e.length) return e[n];
}
function Bs(e, t, n, r = !0) {
    let o = t[_];
    if ((Em(o, t, e, n), r)) {
        let s = $i(n, e),
            c = t[ue],
            a = c.parentNode(e[ot]);
        a !== null && Yg(o, e[be], c, t, a, s);
    }
    let i = t[pn];
    i !== null && i.firstChild !== null && (i.firstChild = null);
}
function Cm(e, t) {
    let n = wn(e, t);
    return (n !== void 0 && go(n[_], n), n);
}
function wn(e, t) {
    if (e.length <= X) return;
    let n = X + t,
        r = e[n];
    if (r) {
        let o = r[Ft];
        (o !== null && o !== e && Ls(o, r), t > 0 && (e[n - 1][Ce] = r[Ce]));
        let i = Or(e, X + t);
        Qg(r[_], r);
        let s = i[Lt];
        (s !== null && s.detachView(i[_]),
            (r[ee] = null),
            (r[Ce] = null),
            (r[D] &= -129));
    }
    return r;
}
function Em(e, t, n, r) {
    let o = X + r,
        i = n.length;
    (r > 0 && (n[o - 1][Ce] = t),
        r < i - X
            ? ((t[Ce] = n[o]), Tu(n, X + r, t))
            : (n.push(t), (t[Ce] = null)),
        (t[ee] = n));
    let s = t[Ft];
    s !== null && n !== s && fd(s, t);
    let c = t[Lt];
    (c !== null && c.insertView(e), Mi(t), (t[D] |= 128));
}
function fd(e, t) {
    let n = e[Lr],
        r = t[ee];
    if (tt(r)) e[D] |= 2;
    else {
        let o = r[ee][Ee];
        t[Ee] !== o && (e[D] |= 2);
    }
    n === null ? (e[Lr] = [t]) : n.push(t);
}
var jt = class {
    _lView;
    _cdRefInjectingView;
    notifyErrorHandler;
    _appRef = null;
    _attachedToViewContainer = !1;
    get rootNodes() {
        let t = this._lView,
            n = t[_];
        return Gr(n, t, n.firstChild, []);
    }
    constructor(t, n, r = !0) {
        ((this._lView = t),
            (this._cdRefInjectingView = n),
            (this.notifyErrorHandler = r));
    }
    get context() {
        return this._lView[J];
    }
    get dirty() {
        return !!(this._lView[D] & 9280) || !!this._lView[ce]?.dirty;
    }
    set context(t) {
        this._lView[J] = t;
    }
    get destroyed() {
        return Sn(this._lView);
    }
    destroy() {
        if (this._appRef) this._appRef.detachView(this);
        else if (this._attachedToViewContainer) {
            let t = this._lView[ee];
            if (Le(t)) {
                let n = t[Fr],
                    r = n ? n.indexOf(this) : -1;
                r > -1 && (wn(t, r), Or(n, r));
            }
            this._attachedToViewContainer = !1;
        }
        go(this._lView[_], this._lView);
    }
    onDestroy(t) {
        Zu(this._lView, t);
    }
    markForCheck() {
        ld(this._cdRefInjectingView || this._lView, 4);
    }
    markForRefresh() {
        fs(this._cdRefInjectingView || this._lView);
    }
    detach() {
        this._lView[D] &= -129;
    }
    reattach() {
        (Mi(this._lView), (this._lView[D] |= 128));
    }
    detectChanges() {
        ((this._lView[D] |= 1024), sd(this._lView, this.notifyErrorHandler));
    }
    checkNoChanges() {}
    attachToViewContainerRef() {
        if (this._appRef) throw new v(902, !1);
        this._attachedToViewContainer = !0;
    }
    detachFromAppRef() {
        this._appRef = null;
        let t = jr(this._lView),
            n = this._lView[Ft];
        (n !== null && !t && Ls(n, this._lView),
            ed(this._lView[_], this._lView));
    }
    attachToAppRef(t) {
        if (this._attachedToViewContainer) throw new v(902, !1);
        this._appRef = t;
        let n = jr(this._lView),
            r = this._lView[Ft];
        (r !== null && !n && fd(r, this._lView), Mi(this._lView));
    }
};
function $s(e, t, n, r, o) {
    let i = e.data[t];
    if (i === null) ((i = Im(e, t, n, r, o)), wp() && (i.flags |= 32));
    else if (i.type & 64) {
        ((i.type = n), (i.value = r), (i.attrs = o));
        let s = vp();
        i.injectorIndex = s === null ? -1 : s.injectorIndex;
    }
    return (Mn(i, !0), i);
}
function Im(e, t, n, r, o) {
    let i = Yu(),
        s = Ku(),
        c = s ? i : i && i.parent,
        a = (e.data[t] = Sm(e, c, n, t, r, o));
    return (bm(e, a, i, s), a);
}
function bm(e, t, n, r) {
    (e.firstChild === null && (e.firstChild = t),
        n !== null &&
            (r
                ? n.child == null && t.parent !== null && (n.child = t)
                : n.next === null && ((n.next = t), (t.prev = n))));
}
function Sm(e, t, n, r, o, i) {
    let s = t ? t.injectorIndex : -1,
        c = 0;
    return (
        pp() && (c |= 128),
        {
            type: n,
            index: r,
            insertBeforeIndex: null,
            injectorIndex: s,
            directiveStart: -1,
            directiveEnd: -1,
            directiveStylingLast: -1,
            componentOffset: -1,
            propertyBindings: null,
            flags: c,
            providerIndexes: 0,
            value: o,
            attrs: i,
            mergedAttrs: null,
            localNames: null,
            initialInputs: null,
            inputs: null,
            hostDirectiveInputs: null,
            outputs: null,
            hostDirectiveOutputs: null,
            directiveToIndex: null,
            tView: null,
            next: null,
            prev: null,
            projectionNext: null,
            child: null,
            parent: t,
            projection: null,
            styles: null,
            stylesWithoutHost: null,
            residualStyles: void 0,
            classes: null,
            classesWithoutHost: null,
            residualClasses: void 0,
            classBindings: 0,
            styleBindings: 0,
        }
    );
}
var Gb = new RegExp(`^(\\d+)*(${cg}|${ag})*(.*)`);
var Mm = () => null;
function Wr(e, t) {
    return Mm(e, t);
}
var Hi = class {},
    Zr = class {},
    zi = class {
        resolveComponentFactory(t) {
            throw Error(`No component factory found for ${ae(t)}.`);
        }
    },
    Vt = class {
        static NULL = new zi();
    },
    Bt = class {};
var _m = (() => {
    class e {
        static ɵprov = C({ token: e, providedIn: "root", factory: () => null });
    }
    return e;
})();
function ru(e, t, n) {
    let r = n ? e.styles : null,
        o = n ? e.classes : null,
        i = 0;
    if (t !== null)
        for (let s = 0; s < t.length; s++) {
            let c = t[s];
            if (typeof c == "number") i = c;
            else if (i == 1) o = Rc(o, c);
            else if (i == 2) {
                let a = c,
                    u = t[++s];
                r = Rc(r, a + ": " + u + ";");
            }
        }
    (n ? (e.styles = r) : (e.stylesWithoutHost = r),
        n ? (e.classes = o) : (e.classesWithoutHost = o));
}
function Us(e, t = S.Default) {
    let n = z();
    if (n === null) return M(e, t);
    let r = ct();
    return ml(r, n, he(e), t);
}
function hd(e, t, n, r, o) {
    let i = r === null ? null : { "": -1 },
        s = o(e, n);
    if (s !== null) {
        let c,
            a = null,
            u = null,
            l = xm(s);
        (l === null ? (c = s) : ([c, a, u] = l), Rm(e, t, n, c, i, a, u));
    }
    i !== null && r !== null && Tm(n, r, i);
}
function Tm(e, t, n) {
    let r = (e.localNames = []);
    for (let o = 0; o < t.length; o += 2) {
        let i = n[t[o + 1]];
        if (i == null) throw new v(-301, !1);
        r.push(t[o], i);
    }
}
function xm(e) {
    let t = null,
        n = !1;
    for (let s = 0; s < e.length; s++) {
        let c = e[s];
        if ((s === 0 && at(c) && (t = c), c.findHostDirectiveDefs !== null)) {
            n = !0;
            break;
        }
    }
    if (!n) return null;
    let r = null,
        o = null,
        i = null;
    for (let s of e)
        (s.findHostDirectiveDefs !== null &&
            ((r ??= []), (o ??= new Map()), (i ??= new Map()), Nm(s, r, i, o)),
            s === t && ((r ??= []), r.push(s)));
    return r !== null
        ? (r.push(...(t === null ? e : e.slice(1))), [r, o, i])
        : null;
}
function Nm(e, t, n, r) {
    let o = t.length;
    (e.findHostDirectiveDefs(e, t, r), n.set(e, [o, t.length - 1]));
}
function Am(e, t, n) {
    ((t.componentOffset = n), (e.components ??= []).push(t.index));
}
function Rm(e, t, n, r, o, i, s) {
    let c = r.length,
        a = !1;
    for (let h = 0; h < c; h++) {
        let f = r[h];
        (!a && at(f) && ((a = !0), Am(e, n, h)), Vp(fl(n, t), e, f.type));
    }
    jm(n, e.data.length, c);
    for (let h = 0; h < c; h++) {
        let f = r[h];
        f.providersResolver && f.providersResolver(f);
    }
    let u = !1,
        l = !1,
        d = Wl(e, t, c, null);
    c > 0 && (n.directiveToIndex = new Map());
    for (let h = 0; h < c; h++) {
        let f = r[h];
        if (
            ((n.mergedAttrs = ys(n.mergedAttrs, f.hostAttrs)),
            km(e, n, t, d, f),
            Lm(d, f, o),
            s !== null && s.has(f))
        ) {
            let [E, j] = s.get(f);
            n.directiveToIndex.set(f.type, [
                d,
                E + n.directiveStart,
                j + n.directiveStart,
            ]);
        } else (i === null || !i.has(f)) && n.directiveToIndex.set(f.type, d);
        (f.contentQueries !== null && (n.flags |= 4),
            (f.hostBindings !== null ||
                f.hostAttrs !== null ||
                f.hostVars !== 0) &&
                (n.flags |= 64));
        let g = f.type.prototype;
        (!u &&
            (g.ngOnChanges || g.ngOnInit || g.ngDoCheck) &&
            ((e.preOrderHooks ??= []).push(n.index), (u = !0)),
            !l &&
                (g.ngOnChanges || g.ngDoCheck) &&
                ((e.preOrderCheckHooks ??= []).push(n.index), (l = !0)),
            d++);
    }
    Om(e, n, i);
}
function Om(e, t, n) {
    for (let r = t.directiveStart; r < t.directiveEnd; r++) {
        let o = e.data[r];
        if (n === null || !n.has(o))
            (ou(0, t, o, r), ou(1, t, o, r), su(t, r, !1));
        else {
            let i = n.get(o);
            (iu(0, t, i, r), iu(1, t, i, r), su(t, r, !0));
        }
    }
}
function ou(e, t, n, r) {
    let o = e === 0 ? n.inputs : n.outputs;
    for (let i in o)
        if (o.hasOwnProperty(i)) {
            let s;
            (e === 0 ? (s = t.inputs ??= {}) : (s = t.outputs ??= {}),
                (s[i] ??= []),
                s[i].push(r),
                pd(t, i));
        }
}
function iu(e, t, n, r) {
    let o = e === 0 ? n.inputs : n.outputs;
    for (let i in o)
        if (o.hasOwnProperty(i)) {
            let s = o[i],
                c;
            (e === 0
                ? (c = t.hostDirectiveInputs ??= {})
                : (c = t.hostDirectiveOutputs ??= {}),
                (c[s] ??= []),
                c[s].push(r, i),
                pd(t, s));
        }
}
function pd(e, t) {
    t === "class" ? (e.flags |= 8) : t === "style" && (e.flags |= 16);
}
function su(e, t, n) {
    let { attrs: r, inputs: o, hostDirectiveInputs: i } = e;
    if (r === null || (!n && o === null) || (n && i === null) || xs(e)) {
        ((e.initialInputs ??= []), e.initialInputs.push(null));
        return;
    }
    let s = null,
        c = 0;
    for (; c < r.length; ) {
        let a = r[c];
        if (a === 0) {
            c += 4;
            continue;
        } else if (a === 5) {
            c += 2;
            continue;
        } else if (typeof a == "number") break;
        if (!n && o.hasOwnProperty(a)) {
            let u = o[a];
            for (let l of u)
                if (l === t) {
                    ((s ??= []), s.push(a, r[c + 1]));
                    break;
                }
        } else if (n && i.hasOwnProperty(a)) {
            let u = i[a];
            for (let l = 0; l < u.length; l += 2)
                if (u[l] === t) {
                    ((s ??= []), s.push(u[l + 1], r[c + 1]));
                    break;
                }
        }
        c += 2;
    }
    ((e.initialInputs ??= []), e.initialInputs.push(s));
}
function km(e, t, n, r, o) {
    e.data[r] = o;
    let i = o.factory || (o.factory = Rt(o.type, !0)),
        s = new yn(i, at(o), Us);
    ((e.blueprint[r] = s),
        (n[r] = s),
        Pm(e, t, r, Wl(e, n, o.hostVars, Nn), o));
}
function Pm(e, t, n, r, o) {
    let i = o.hostBindings;
    if (i) {
        let s = e.hostBindingOpCodes;
        s === null && (s = e.hostBindingOpCodes = []);
        let c = ~t.index;
        (Fm(s) != c && s.push(c), s.push(n, r, i));
    }
}
function Fm(e) {
    let t = e.length;
    for (; t > 0; ) {
        let n = e[--t];
        if (typeof n == "number" && n < 0) return n;
    }
    return 0;
}
function Lm(e, t, n) {
    if (n) {
        if (t.exportAs)
            for (let r = 0; r < t.exportAs.length; r++) n[t.exportAs[r]] = e;
        at(t) && (n[""] = e);
    }
}
function jm(e, t, n) {
    ((e.flags |= 1),
        (e.directiveStart = t),
        (e.directiveEnd = t + n),
        (e.providerIndexes = t));
}
function gd(e, t, n, r, o, i, s, c) {
    let a = t.consts,
        u = vn(a, s),
        l = $s(t, e, 2, r, u);
    return (
        i && hd(t, n, l, vn(a, c), o),
        (l.mergedAttrs = ys(l.mergedAttrs, l.attrs)),
        l.attrs !== null && ru(l, l.attrs, !1),
        l.mergedAttrs !== null && ru(l, l.mergedAttrs, !0),
        t.queries !== null && t.queries.elementStart(t, l),
        l
    );
}
function md(e, t) {
    (al(e, t), Bu(t) && e.queries.elementEnd(t));
}
var Qr = class extends Vt {
    ngModule;
    constructor(t) {
        (super(), (this.ngModule = t));
    }
    resolveComponentFactory(t) {
        let n = rt(t);
        return new Cn(n, this.ngModule);
    }
};
function Vm(e) {
    return Object.keys(e).map((t) => {
        let [n, r, o] = e[t],
            i = {
                propName: n,
                templateName: t,
                isSignal: (r & po.SignalBased) !== 0,
            };
        return (o && (i.transform = o), i);
    });
}
function Bm(e) {
    return Object.keys(e).map((t) => ({ propName: e[t], templateName: t }));
}
function $m(e, t, n) {
    let r = t instanceof pe ? t : t?.injector;
    return (
        r &&
            e.getStandaloneInjector !== null &&
            (r = e.getStandaloneInjector(r) || r),
        r ? new xi(n, r) : n
    );
}
function Um(e) {
    let t = e.get(Bt, null);
    if (t === null) throw new v(407, !1);
    let n = e.get(_m, null),
        r = e.get(Dn, null);
    return { rendererFactory: t, sanitizer: n, changeDetectionScheduler: r };
}
function Hm(e, t) {
    let n = (e.selectors[0][0] || "div").toLowerCase();
    return Hl(t, n, n === "svg" ? Gu : n === "math" ? ap : null);
}
var Cn = class extends Zr {
        componentDef;
        ngModule;
        selector;
        componentType;
        ngContentSelectors;
        isBoundToModule;
        get inputs() {
            return Vm(this.componentDef.inputs);
        }
        get outputs() {
            return Bm(this.componentDef.outputs);
        }
        constructor(t, n) {
            (super(),
                (this.componentDef = t),
                (this.ngModule = n),
                (this.componentType = t.type),
                (this.selector = bg(t.selectors)),
                (this.ngContentSelectors = t.ngContentSelectors ?? []),
                (this.isBoundToModule = !!n));
        }
        create(t, n, r, o) {
            L(22);
            let i = R(null);
            try {
                let s = this.componentDef,
                    c = r
                        ? ["ng-version", "19.2.0"]
                        : Sg(this.componentDef.selectors[0]),
                    a = Ns(
                        0,
                        null,
                        null,
                        1,
                        0,
                        null,
                        null,
                        null,
                        null,
                        [c],
                        null,
                    ),
                    u = $m(s, o || this.ngModule, t),
                    l = Um(u),
                    d = l.rendererFactory.createRenderer(null, s),
                    h = r ? kg(d, r, s.encapsulation, u) : Hm(s, d),
                    f = As(
                        null,
                        a,
                        null,
                        512 | Gl(s),
                        null,
                        null,
                        l,
                        d,
                        u,
                        null,
                        Pl(h, u, !0),
                    );
                ((f[_e] = h), ps(f));
                let g = null;
                try {
                    let E = gd(
                        _e,
                        a,
                        f,
                        "#host",
                        () => [this.componentDef],
                        !0,
                        0,
                    );
                    (h && (ql(d, h, E), Tn(h, f)),
                        Os(a, f, E),
                        Ll(a, E, f),
                        md(a, E),
                        n !== void 0 && zm(E, this.ngContentSelectors, n),
                        (g = qe(E.index, f)),
                        (f[J] = g[J]),
                        Ps(a, f, null));
                } catch (E) {
                    throw (g !== null && Li(g), Li(f), E);
                } finally {
                    (L(23), gs());
                }
                return new qi(this.componentType, f);
            } finally {
                R(i);
            }
        }
    },
    qi = class extends Hi {
        _rootLView;
        instance;
        hostView;
        changeDetectorRef;
        componentType;
        location;
        previousInputValues = null;
        _tNode;
        constructor(t, n) {
            (super(),
                (this._rootLView = n),
                (this._tNode = ls(n[_], _e)),
                (this.location = Is(this._tNode, n)),
                (this.instance = qe(this._tNode.index, n)[J]),
                (this.hostView = this.changeDetectorRef =
                    new jt(n, void 0, !1)),
                (this.componentType = t));
        }
        setInput(t, n) {
            let r = this._tNode;
            if (
                ((this.previousInputValues ??= new Map()),
                this.previousInputValues.has(t) &&
                    Object.is(this.previousInputValues.get(t), n))
            )
                return;
            let o = this._rootLView,
                i = ks(r, o[_], o, t, n);
            this.previousInputValues.set(t, n);
            let s = qe(r.index, o);
            ld(s, 1);
        }
        get injector() {
            return new nt(this._tNode, this._rootLView);
        }
        destroy() {
            this.hostView.destroy();
        }
        onDestroy(t) {
            this.hostView.onDestroy(t);
        }
    };
function zm(e, t, n) {
    let r = (e.projection = []);
    for (let o = 0; o < t.length; o++) {
        let i = n[o];
        r.push(i != null && i.length ? Array.from(i) : null);
    }
}
var vo = (() => {
    class e {
        static __NG_ELEMENT_ID__ = qm;
    }
    return e;
})();
function qm() {
    let e = ct();
    return Wm(e, z());
}
var Gm = vo,
    vd = class extends Gm {
        _lContainer;
        _hostTNode;
        _hostLView;
        constructor(t, n, r) {
            (super(),
                (this._lContainer = t),
                (this._hostTNode = n),
                (this._hostLView = r));
        }
        get element() {
            return Is(this._hostTNode, this._hostLView);
        }
        get injector() {
            return new nt(this._hostTNode, this._hostLView);
        }
        get parentInjector() {
            let t = Ds(this._hostTNode, this._hostLView);
            if (ul(t)) {
                let n = Br(t, this._hostLView),
                    r = Vr(t),
                    o = n[_].data[r + 8];
                return new nt(o, n);
            } else return new nt(null, this._hostLView);
        }
        clear() {
            for (; this.length > 0; ) this.remove(this.length - 1);
        }
        get(t) {
            let n = au(this._lContainer);
            return (n !== null && n[t]) || null;
        }
        get length() {
            return this._lContainer.length - X;
        }
        createEmbeddedView(t, n, r) {
            let o, i;
            typeof r == "number"
                ? (o = r)
                : r != null && ((o = r.index), (i = r.injector));
            let s = Wr(this._lContainer, t.ssrId),
                c = t.createEmbeddedViewImpl(n || {}, i, s);
            return (this.insertImpl(c, o, qr(this._hostTNode, s)), c);
        }
        createComponent(t, n, r, o, i) {
            let s = t && !rp(t),
                c;
            if (s) c = n;
            else {
                let g = n || {};
                ((c = g.index),
                    (r = g.injector),
                    (o = g.projectableNodes),
                    (i = g.environmentInjector || g.ngModuleRef));
            }
            let a = s ? t : new Cn(rt(t)),
                u = r || this.parentInjector;
            if (!i && a.ngModule == null) {
                let E = (s ? u : this.parentInjector).get(pe, null);
                E && (i = E);
            }
            let l = rt(a.componentType ?? {}),
                d = Wr(this._lContainer, l?.id ?? null),
                h = d?.firstChild ?? null,
                f = a.create(u, o, h, i);
            return (this.insertImpl(f.hostView, c, qr(this._hostTNode, d)), f);
        }
        insert(t, n) {
            return this.insertImpl(t, n, !0);
        }
        insertImpl(t, n, r) {
            let o = t._lView;
            if (up(o)) {
                let c = this.indexOf(t);
                if (c !== -1) this.detach(c);
                else {
                    let a = o[ee],
                        u = new vd(a, a[be], a[ee]);
                    u.detach(u.indexOf(t));
                }
            }
            let i = this._adjustIndex(n),
                s = this._lContainer;
            return (
                Bs(s, o, i, r),
                t.attachToViewContainerRef(),
                Tu(vi(s), i, t),
                t
            );
        }
        move(t, n) {
            return this.insert(t, n);
        }
        indexOf(t) {
            let n = au(this._lContainer);
            return n !== null ? n.indexOf(t) : -1;
        }
        remove(t) {
            let n = this._adjustIndex(t, -1),
                r = wn(this._lContainer, n);
            r && (Or(vi(this._lContainer), n), go(r[_], r));
        }
        detach(t) {
            let n = this._adjustIndex(t, -1),
                r = wn(this._lContainer, n);
            return r && Or(vi(this._lContainer), n) != null ? new jt(r) : null;
        }
        _adjustIndex(t, n = 0) {
            return t ?? this.length + n;
        }
    };
function au(e) {
    return e[Fr];
}
function vi(e) {
    return e[Fr] || (e[Fr] = []);
}
function Wm(e, t) {
    let n,
        r = t[e.index];
    return (
        Le(r) ? (n = r) : ((n = dd(r, t, null, e)), (t[e.index] = n), Rs(t, n)),
        Qm(n, t, e, r),
        new vd(n, e, t)
    );
}
function Zm(e, t) {
    let n = e[ue],
        r = n.createComment(""),
        o = Qe(t, e),
        i = n.parentNode(o);
    return (zr(n, i, r, n.nextSibling(o), !1), r);
}
var Qm = Jm,
    Ym = () => !1;
function Km(e, t, n) {
    return Ym(e, t, n);
}
function Jm(e, t, n, r) {
    if (e[ot]) return;
    let o;
    (n.type & 8 ? (o = Pe(r)) : (o = Zm(t, n)), (e[ot] = o));
}
var We = class {},
    En = class {};
var Gi = class extends We {
        ngModuleType;
        _parent;
        _bootstrapComponents = [];
        _r3Injector;
        instance;
        destroyCbs = [];
        componentFactoryResolver = new Qr(this);
        constructor(t, n, r, o = !0) {
            (super(), (this.ngModuleType = t), (this._parent = n));
            let i = Au(t);
            ((this._bootstrapComponents = $l(i.bootstrap)),
                (this._r3Injector = Dl(
                    t,
                    n,
                    [
                        { provide: We, useValue: this },
                        {
                            provide: Vt,
                            useValue: this.componentFactoryResolver,
                        },
                        ...r,
                    ],
                    ae(t),
                    new Set(["environment"]),
                )),
                o && this.resolveInjectorInitializers());
        }
        resolveInjectorInitializers() {
            (this._r3Injector.resolveInjectorInitializers(),
                (this.instance = this._r3Injector.get(this.ngModuleType)));
        }
        get injector() {
            return this._r3Injector;
        }
        destroy() {
            let t = this._r3Injector;
            (!t.destroyed && t.destroy(),
                this.destroyCbs.forEach((n) => n()),
                (this.destroyCbs = null));
        }
        onDestroy(t) {
            this.destroyCbs.push(t);
        }
    },
    Wi = class extends En {
        moduleType;
        constructor(t) {
            (super(), (this.moduleType = t));
        }
        create(t) {
            return new Gi(this.moduleType, t, []);
        }
    };
var Yr = class extends We {
    injector;
    componentFactoryResolver = new Qr(this);
    instance = null;
    constructor(t) {
        super();
        let n = new hn(
            [
                ...t.providers,
                { provide: We, useValue: this },
                { provide: Vt, useValue: this.componentFactoryResolver },
            ],
            t.parent || cs(),
            t.debugName,
            new Set(["environment"]),
        );
        ((this.injector = n),
            t.runEnvironmentInitializers && n.resolveInjectorInitializers());
    }
    destroy() {
        this.injector.destroy();
    }
    onDestroy(t) {
        this.injector.onDestroy(t);
    }
};
function Hs(e, t, n = null) {
    return new Yr({
        providers: e,
        parent: t,
        debugName: n,
        runEnvironmentInitializers: !0,
    }).injector;
}
var Xm = (() => {
    class e {
        _injector;
        cachedInjectors = new Map();
        constructor(n) {
            this._injector = n;
        }
        getOrCreateStandaloneInjector(n) {
            if (!n.standalone) return null;
            if (!this.cachedInjectors.has(n)) {
                let r = Pu(!1, n.type),
                    o =
                        r.length > 0
                            ? Hs(
                                  [r],
                                  this._injector,
                                  `Standalone[${n.type.name}]`,
                              )
                            : null;
                this.cachedInjectors.set(n, o);
            }
            return this.cachedInjectors.get(n);
        }
        ngOnDestroy() {
            try {
                for (let n of this.cachedInjectors.values())
                    n !== null && n.destroy();
            } finally {
                this.cachedInjectors.clear();
            }
        }
        static ɵprov = C({
            token: e,
            providedIn: "environment",
            factory: () => new e(M(pe)),
        });
    }
    return e;
})();
function yo(e) {
    return rs(() => {
        let t = yd(e),
            n = F(m({}, t), {
                decls: e.decls,
                vars: e.vars,
                template: e.template,
                consts: e.consts || null,
                ngContentSelectors: e.ngContentSelectors,
                onPush: e.changeDetection === _l.OnPush,
                directiveDefs: null,
                pipeDefs: null,
                dependencies: (t.standalone && e.dependencies) || null,
                getStandaloneInjector: t.standalone
                    ? (o) => o.get(Xm).getOrCreateStandaloneInjector(n)
                    : null,
                getExternalStyles: null,
                signals: e.signals ?? !1,
                data: e.data || {},
                encapsulation: e.encapsulation || xe.Emulated,
                styles: e.styles || kt,
                _: null,
                schemas: e.schemas || null,
                tView: null,
                id: "",
            });
        (t.standalone && fo("NgStandalone"), Dd(n));
        let r = e.dependencies;
        return (
            (n.directiveDefs = cu(r, !1)),
            (n.pipeDefs = cu(r, !0)),
            (n.id = ov(n)),
            n
        );
    });
}
function ev(e) {
    return rt(e) || Ru(e);
}
function tv(e) {
    return e !== null;
}
function nv(e, t) {
    if (e == null) return Ot;
    let n = {};
    for (let r in e)
        if (e.hasOwnProperty(r)) {
            let o = e[r],
                i,
                s,
                c,
                a;
            (Array.isArray(o)
                ? ((c = o[0]), (i = o[1]), (s = o[2] ?? i), (a = o[3] || null))
                : ((i = o), (s = o), (c = po.None), (a = null)),
                (n[i] = [r, c, a]),
                (t[i] = s));
        }
    return n;
}
function rv(e) {
    if (e == null) return Ot;
    let t = {};
    for (let n in e) e.hasOwnProperty(n) && (t[e[n]] = n);
    return t;
}
function zs(e) {
    return rs(() => {
        let t = yd(e);
        return (Dd(t), t);
    });
}
function yd(e) {
    let t = {};
    return {
        type: e.type,
        providersResolver: null,
        factory: null,
        hostBindings: e.hostBindings || null,
        hostVars: e.hostVars || 0,
        hostAttrs: e.hostAttrs || null,
        contentQueries: e.contentQueries || null,
        declaredInputs: t,
        inputConfig: e.inputs || Ot,
        exportAs: e.exportAs || null,
        standalone: e.standalone ?? !0,
        signals: e.signals === !0,
        selectors: e.selectors || kt,
        viewQuery: e.viewQuery || null,
        features: e.features || null,
        setInput: null,
        findHostDirectiveDefs: null,
        hostDirectives: null,
        inputs: nv(e.inputs, t),
        outputs: rv(e.outputs),
        debugInfo: null,
    };
}
function Dd(e) {
    e.features?.forEach((t) => t(e));
}
function cu(e, t) {
    if (!e) return null;
    let n = t ? Ou : ev;
    return () => (typeof e == "function" ? e() : e).map((r) => n(r)).filter(tv);
}
function ov(e) {
    let t = 0,
        n = typeof e.consts == "function" ? "" : e.consts,
        r = [
            e.selectors,
            e.ngContentSelectors,
            e.hostVars,
            e.hostAttrs,
            n,
            e.vars,
            e.decls,
            e.encapsulation,
            e.standalone,
            e.signals,
            e.exportAs,
            JSON.stringify(e.inputs),
            JSON.stringify(e.outputs),
            Object.getOwnPropertyNames(e.type.prototype),
            !!e.contentQueries,
            !!e.viewQuery,
        ];
    for (let i of r.join("|")) t = (Math.imul(31, t) + i.charCodeAt(0)) << 0;
    return ((t += 2147483648), "c" + t);
}
function wd(e, t, n) {
    return (e[t] = n);
}
function Cd(e, t) {
    return e[t];
}
function $t(e, t, n) {
    let r = e[t];
    return Object.is(r, n) ? !1 : ((e[t] = n), !0);
}
function uu(e, t, n, r) {
    let o = $t(e, t, n);
    return $t(e, t + 1, r) || o;
}
function iv(e, t, n, r, o, i) {
    let s = uu(e, t, n, r);
    return uu(e, t + 2, o, i) || s;
}
function sv(e, t, n, r, o, i, s, c, a) {
    let u = t.consts,
        l = $s(t, e, 4, s || null, c || null);
    (Qu() && hd(t, n, l, vn(u, a), Kl),
        (l.mergedAttrs = ys(l.mergedAttrs, l.attrs)),
        al(t, l));
    let d = (l.tView = Ns(
        2,
        l,
        r,
        o,
        i,
        t.directiveRegistry,
        t.pipeRegistry,
        null,
        t.schemas,
        u,
        null,
    ));
    return (
        t.queries !== null &&
            (t.queries.template(t, l),
            (d.queries = t.queries.embeddedTView(l))),
        l
    );
}
function lu(e, t, n, r, o, i, s, c, a, u) {
    let l = n + _e,
        d = t.firstCreatePass ? sv(l, t, e, r, o, i, s, c, a) : t.data[l];
    Mn(d, !1);
    let h = av(t, e, d, n);
    (ms() && js(t, e, h, d), Tn(h, e));
    let f = dd(h, e, h, d);
    return (
        (e[l] = f),
        Rs(e, f),
        Km(f, d, e),
        $u(d) && Os(t, e, d),
        a != null && Yl(e, d, u),
        d
    );
}
var av = cv;
function cv(e, t, n, r) {
    return (vs(!0), t[ue].createComment(""));
}
var qs = (() => {
    class e {
        log(n) {
            console.log(n);
        }
        warn(n) {
            console.warn(n);
        }
        static ɵfac = function (r) {
            return new (r || e)();
        };
        static ɵprov = C({ token: e, factory: e.ɵfac, providedIn: "platform" });
    }
    return e;
})();
var Ed = new w("");
var uv = (() => {
        class e {
            static ɵprov = C({
                token: e,
                providedIn: "root",
                factory: () => new Zi(),
            });
        }
        return e;
    })(),
    Zi = class {
        queuedEffectCount = 0;
        queues = new Map();
        schedule(t) {
            this.enqueue(t);
        }
        remove(t) {
            let n = t.zone,
                r = this.queues.get(n);
            r.has(t) && (r.delete(t), this.queuedEffectCount--);
        }
        enqueue(t) {
            let n = t.zone;
            this.queues.has(n) || this.queues.set(n, new Set());
            let r = this.queues.get(n);
            r.has(t) || (this.queuedEffectCount++, r.add(t));
        }
        flush() {
            for (; this.queuedEffectCount > 0; )
                for (let [t, n] of this.queues)
                    t === null
                        ? this.flushQueue(n)
                        : t.run(() => this.flushQueue(n));
        }
        flushQueue(t) {
            for (let n of t) (t.delete(n), this.queuedEffectCount--, n.run());
        }
    };
function An(e) {
    return !!e && typeof e.then == "function";
}
function Id(e) {
    return !!e && typeof e.subscribe == "function";
}
var bd = new w("");
var Sd = (() => {
        class e {
            resolve;
            reject;
            initialized = !1;
            done = !1;
            donePromise = new Promise((n, r) => {
                ((this.resolve = n), (this.reject = r));
            });
            appInits = p(bd, { optional: !0 }) ?? [];
            injector = p(Te);
            constructor() {}
            runInitializers() {
                if (this.initialized) return;
                let n = [];
                for (let o of this.appInits) {
                    let i = Ie(this.injector, o);
                    if (An(i)) n.push(i);
                    else if (Id(i)) {
                        let s = new Promise((c, a) => {
                            i.subscribe({ complete: c, error: a });
                        });
                        n.push(s);
                    }
                }
                let r = () => {
                    ((this.done = !0), this.resolve());
                };
                (Promise.all(n)
                    .then(() => {
                        r();
                    })
                    .catch((o) => {
                        this.reject(o);
                    }),
                    n.length === 0 && r(),
                    (this.initialized = !0));
            }
            static ɵfac = function (r) {
                return new (r || e)();
            };
            static ɵprov = C({ token: e, factory: e.ɵfac, providedIn: "root" });
        }
        return e;
    })(),
    Gs = new w("");
function lv() {
    tc(() => {
        throw new v(600, !1);
    });
}
function dv(e) {
    return e.isBoundToModule;
}
var fv = 10;
var Ze = (() => {
    class e {
        _runningTick = !1;
        _destroyed = !1;
        _destroyListeners = [];
        _views = [];
        internalErrorHandler = p(Xp);
        afterRenderManager = p(lg);
        zonelessEnabled = p(co);
        rootEffectScheduler = p(uv);
        dirtyFlags = 0;
        tracingSnapshot = null;
        externalTestViews = new Set();
        afterTick = new K();
        get allViews() {
            return [...this.externalTestViews.keys(), ...this._views];
        }
        get destroyed() {
            return this._destroyed;
        }
        componentTypes = [];
        components = [];
        isStable = p(zt).hasPendingTasks.pipe(N((n) => !n));
        constructor() {
            p(lo, { optional: !0 });
        }
        whenStable() {
            let n;
            return new Promise((r) => {
                n = this.isStable.subscribe({
                    next: (o) => {
                        o && r();
                    },
                });
            }).finally(() => {
                n.unsubscribe();
            });
        }
        _injector = p(pe);
        _rendererFactory = null;
        get injector() {
            return this._injector;
        }
        bootstrap(n, r) {
            L(10);
            let o = n instanceof Zr;
            if (!this._injector.get(Sd).done) {
                let h = !o && ku(n),
                    f = !1;
                throw new v(405, f);
            }
            let s;
            (o
                ? (s = n)
                : (s = this._injector.get(Vt).resolveComponentFactory(n)),
                this.componentTypes.push(s.componentType));
            let c = dv(s) ? void 0 : this._injector.get(We),
                a = r || s.selector,
                u = s.create(Te.NULL, [], a, c),
                l = u.location.nativeElement,
                d = u.injector.get(Ed, null);
            return (
                d?.registerApplication(l),
                u.onDestroy(() => {
                    (this.detachView(u.hostView),
                        xr(this.components, u),
                        d?.unregisterApplication(l));
                }),
                this._loadComponent(u),
                L(11, u),
                u
            );
        }
        tick() {
            (this.zonelessEnabled || (this.dirtyFlags |= 1), this._tick());
        }
        _tick() {
            (L(12),
                this.tracingSnapshot !== null
                    ? this.tracingSnapshot.run(
                          kl.CHANGE_DETECTION,
                          this.tickImpl,
                      )
                    : this.tickImpl());
        }
        tickImpl = () => {
            if (this._runningTick) throw new v(101, !1);
            let n = R(null);
            try {
                ((this._runningTick = !0), this.synchronize());
            } catch (r) {
                this.internalErrorHandler(r);
            } finally {
                ((this._runningTick = !1),
                    this.tracingSnapshot?.dispose(),
                    (this.tracingSnapshot = null),
                    R(n),
                    this.afterTick.next(),
                    L(13));
            }
        };
        synchronize() {
            this._rendererFactory === null &&
                !this._injector.destroyed &&
                (this._rendererFactory = this._injector.get(Bt, null, {
                    optional: !0,
                }));
            let n = 0;
            for (; this.dirtyFlags !== 0 && n++ < fv; )
                (L(14), this.synchronizeOnce(), L(15));
        }
        synchronizeOnce() {
            if (
                (this.dirtyFlags & 16 &&
                    ((this.dirtyFlags &= -17),
                    this.rootEffectScheduler.flush()),
                this.dirtyFlags & 7)
            ) {
                let n = !!(this.dirtyFlags & 1);
                ((this.dirtyFlags &= -8), (this.dirtyFlags |= 8));
                for (let { _lView: r, notifyErrorHandler: o } of this.allViews)
                    hv(r, o, n, this.zonelessEnabled);
                if (
                    ((this.dirtyFlags &= -5),
                    this.syncDirtyFlagsWithViews(),
                    this.dirtyFlags & 23)
                )
                    return;
            } else
                (this._rendererFactory?.begin?.(),
                    this._rendererFactory?.end?.());
            (this.dirtyFlags & 8 &&
                ((this.dirtyFlags &= -9), this.afterRenderManager.execute()),
                this.syncDirtyFlagsWithViews());
        }
        syncDirtyFlagsWithViews() {
            if (this.allViews.some(({ _lView: n }) => oo(n))) {
                this.dirtyFlags |= 2;
                return;
            } else this.dirtyFlags &= -8;
        }
        attachView(n) {
            let r = n;
            (this._views.push(r), r.attachToAppRef(this));
        }
        detachView(n) {
            let r = n;
            (xr(this._views, r), r.detachFromAppRef());
        }
        _loadComponent(n) {
            (this.attachView(n.hostView),
                this.tick(),
                this.components.push(n),
                this._injector.get(Gs, []).forEach((o) => o(n)));
        }
        ngOnDestroy() {
            if (!this._destroyed)
                try {
                    (this._destroyListeners.forEach((n) => n()),
                        this._views.slice().forEach((n) => n.destroy()));
                } finally {
                    ((this._destroyed = !0),
                        (this._views = []),
                        (this._destroyListeners = []));
                }
        }
        onDestroy(n) {
            return (
                this._destroyListeners.push(n),
                () => xr(this._destroyListeners, n)
            );
        }
        destroy() {
            if (this._destroyed) throw new v(406, !1);
            let n = this._injector;
            n.destroy && !n.destroyed && n.destroy();
        }
        get viewCount() {
            return this._views.length;
        }
        static ɵfac = function (r) {
            return new (r || e)();
        };
        static ɵprov = C({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
    return e;
})();
function xr(e, t) {
    let n = e.indexOf(t);
    n > -1 && e.splice(n, 1);
}
function hv(e, t, n, r) {
    if (!n && !oo(e)) return;
    sd(e, t, n && !r ? 0 : 1);
}
function pv(e, t, n, r) {
    return $t(e, hs(), n) ? t + os(n) + r : Nn;
}
function Ws(e, t, n) {
    let r = z(),
        o = hs();
    if ($t(r, o, t)) {
        let i = Ut(),
            s = bp();
        jg(i, s, r, e, t, r[ue], n, !1);
    }
    return Ws;
}
function du(e, t, n, r, o) {
    ks(t, e, n, o ? "class" : "style", r);
}
var Qi = class {
    destroy(t) {}
    updateValue(t, n) {}
    swap(t, n) {
        let r = Math.min(t, n),
            o = Math.max(t, n),
            i = this.detach(o);
        if (o - r > 1) {
            let s = this.detach(r);
            (this.attach(r, i), this.attach(o, s));
        } else this.attach(r, i);
    }
    move(t, n) {
        this.attach(n, this.detach(t));
    }
};
function yi(e, t, n, r, o) {
    return e === n && Object.is(t, r)
        ? 1
        : Object.is(o(e, t), o(n, r))
          ? -1
          : 0;
}
function gv(e, t, n) {
    let r,
        o,
        i = 0,
        s = e.length - 1,
        c = void 0;
    if (Array.isArray(t)) {
        let a = t.length - 1;
        for (; i <= s && i <= a; ) {
            let u = e.at(i),
                l = t[i],
                d = yi(i, u, i, l, n);
            if (d !== 0) {
                (d < 0 && e.updateValue(i, l), i++);
                continue;
            }
            let h = e.at(s),
                f = t[a],
                g = yi(s, h, a, f, n);
            if (g !== 0) {
                (g < 0 && e.updateValue(s, f), s--, a--);
                continue;
            }
            let E = n(i, u),
                j = n(s, h),
                V = n(i, l);
            if (Object.is(V, j)) {
                let Ke = n(a, f);
                (Object.is(Ke, E)
                    ? (e.swap(i, s), e.updateValue(s, f), a--, s--)
                    : e.move(s, i),
                    e.updateValue(i, l),
                    i++);
                continue;
            }
            if (((r ??= new Kr()), (o ??= hu(e, i, s, n)), Yi(e, r, i, V)))
                (e.updateValue(i, l), i++, s++);
            else if (o.has(V)) (r.set(E, e.detach(i)), s--);
            else {
                let Ke = e.create(i, t[i]);
                (e.attach(i, Ke), i++, s++);
            }
        }
        for (; i <= a; ) (fu(e, r, n, i, t[i]), i++);
    } else if (t != null) {
        let a = t[Symbol.iterator](),
            u = a.next();
        for (; !u.done && i <= s; ) {
            let l = e.at(i),
                d = u.value,
                h = yi(i, l, i, d, n);
            if (h !== 0) (h < 0 && e.updateValue(i, d), i++, (u = a.next()));
            else {
                ((r ??= new Kr()), (o ??= hu(e, i, s, n)));
                let f = n(i, d);
                if (Yi(e, r, i, f))
                    (e.updateValue(i, d), i++, s++, (u = a.next()));
                else if (!o.has(f))
                    (e.attach(i, e.create(i, d)), i++, s++, (u = a.next()));
                else {
                    let g = n(i, l);
                    (r.set(g, e.detach(i)), s--);
                }
            }
        }
        for (; !u.done; ) (fu(e, r, n, e.length, u.value), (u = a.next()));
    }
    for (; i <= s; ) e.destroy(e.detach(s--));
    r?.forEach((a) => {
        e.destroy(a);
    });
}
function Yi(e, t, n, r) {
    return t !== void 0 && t.has(r)
        ? (e.attach(n, t.get(r)), t.delete(r), !0)
        : !1;
}
function fu(e, t, n, r, o) {
    if (Yi(e, t, r, n(r, o))) e.updateValue(r, o);
    else {
        let i = e.create(r, o);
        e.attach(r, i);
    }
}
function hu(e, t, n, r) {
    let o = new Set();
    for (let i = t; i <= n; i++) o.add(r(i, e.at(i)));
    return o;
}
var Kr = class {
    kvMap = new Map();
    _vMap = void 0;
    has(t) {
        return this.kvMap.has(t);
    }
    delete(t) {
        if (!this.has(t)) return !1;
        let n = this.kvMap.get(t);
        return (
            this._vMap !== void 0 && this._vMap.has(n)
                ? (this.kvMap.set(t, this._vMap.get(n)), this._vMap.delete(n))
                : this.kvMap.delete(t),
            !0
        );
    }
    get(t) {
        return this.kvMap.get(t);
    }
    set(t, n) {
        if (this.kvMap.has(t)) {
            let r = this.kvMap.get(t);
            this._vMap === void 0 && (this._vMap = new Map());
            let o = this._vMap;
            for (; o.has(r); ) r = o.get(r);
            o.set(r, n);
        } else this.kvMap.set(t, n);
    }
    forEach(t) {
        for (let [n, r] of this.kvMap)
            if ((t(r, n), this._vMap !== void 0)) {
                let o = this._vMap;
                for (; o.has(r); ) ((r = o.get(r)), t(r, n));
            }
    }
};
var Ki = class {
    lContainer;
    $implicit;
    $index;
    constructor(t, n, r) {
        ((this.lContainer = t), (this.$implicit = n), (this.$index = r));
    }
    get $count() {
        return this.lContainer.length - X;
    }
};
var Ji = class {
    hasEmptyBlock;
    trackByFn;
    liveCollection;
    constructor(t, n, r) {
        ((this.hasEmptyBlock = t),
            (this.trackByFn = n),
            (this.liveCollection = r));
    }
};
function Md(e, t, n, r, o, i, s, c, a, u, l, d, h) {
    fo("NgControlFlow");
    let f = z(),
        g = Ut(),
        E = a !== void 0,
        j = z(),
        V = c ? s.bind(j[Ee][J]) : s,
        Ke = new Ji(E, V);
    ((j[_e + e] = Ke),
        lu(f, g, e + 1, t, n, r, o, vn(g.consts, i)),
        E && lu(f, g, e + 2, a, u, l, d, vn(g.consts, h)));
}
var Xi = class extends Qi {
    lContainer;
    hostLView;
    templateTNode;
    operationsCounter = void 0;
    needsIndexUpdate = !1;
    constructor(t, n, r) {
        (super(),
            (this.lContainer = t),
            (this.hostLView = n),
            (this.templateTNode = r));
    }
    get length() {
        return this.lContainer.length - X;
    }
    at(t) {
        return this.getLView(t)[J].$implicit;
    }
    attach(t, n) {
        let r = n[pn];
        ((this.needsIndexUpdate ||= t !== this.length),
            Bs(this.lContainer, n, t, qr(this.templateTNode, r)));
    }
    detach(t) {
        return (
            (this.needsIndexUpdate ||= t !== this.length - 1),
            mv(this.lContainer, t)
        );
    }
    create(t, n) {
        let r = Wr(this.lContainer, this.templateTNode.tView.ssrId),
            o = Jl(
                this.hostLView,
                this.templateTNode,
                new Ki(this.lContainer, n, t),
                { dehydratedView: r },
            );
        return (this.operationsCounter?.recordCreate(), o);
    }
    destroy(t) {
        (go(t[_], t), this.operationsCounter?.recordDestroy());
    }
    updateValue(t, n) {
        this.getLView(t)[J].$implicit = n;
    }
    reset() {
        ((this.needsIndexUpdate = !1), this.operationsCounter?.reset());
    }
    updateIndexes() {
        if (this.needsIndexUpdate)
            for (let t = 0; t < this.length; t++)
                this.getLView(t)[J].$index = t;
    }
    getLView(t) {
        return vv(this.lContainer, t);
    }
};
function _d(e) {
    let t = R(null),
        n = so();
    try {
        let r = z(),
            o = r[_],
            i = r[n],
            s = n + 1,
            c = pu(r, s);
        if (i.liveCollection === void 0) {
            let u = gu(o, s);
            i.liveCollection = new Xi(c, r, u);
        } else i.liveCollection.reset();
        let a = i.liveCollection;
        if ((gv(a, e, i.trackByFn), a.updateIndexes(), i.hasEmptyBlock)) {
            let u = hs(),
                l = a.length === 0;
            if ($t(r, u, l)) {
                let d = n + 2,
                    h = pu(r, d);
                if (l) {
                    let f = gu(o, d),
                        g = Wr(h, f.tView.ssrId),
                        E = Jl(r, f, void 0, { dehydratedView: g });
                    Bs(h, E, 0, qr(f, g));
                } else Cm(h, 0);
            }
        }
    } finally {
        R(t);
    }
}
function pu(e, t) {
    return e[t];
}
function mv(e, t) {
    return wn(e, t);
}
function vv(e, t) {
    return wm(e, t);
}
function gu(e, t) {
    return ls(e, t);
}
function q(e, t, n, r) {
    let o = z(),
        i = Ut(),
        s = _e + e,
        c = o[ue],
        a = i.firstCreatePass ? gd(s, i, o, t, Kl, Qu(), n, r) : i.data[s],
        u = yv(i, o, a, c, t, e);
    o[s] = u;
    let l = $u(a);
    return (
        Mn(a, !0),
        ql(c, u, a),
        !Xl(a) && ms() && js(i, o, u, a),
        (dp() === 0 || l) && Tn(u, o),
        fp(),
        l && (Os(i, o, a), Ll(i, a, o)),
        r !== null && Yl(o, a),
        q
    );
}
function te() {
    let e = ct();
    Ku() ? yp() : ((e = e.parent), Mn(e, !1));
    let t = e;
    (gp(t) && mp(), hp());
    let n = Ut();
    return (
        n.firstCreatePass && md(n, t),
        t.classesWithoutHost != null &&
            Np(t) &&
            du(n, t, z(), t.classesWithoutHost, !0),
        t.stylesWithoutHost != null &&
            Ap(t) &&
            du(n, t, z(), t.stylesWithoutHost, !1),
        te
    );
}
function oe(e, t, n, r) {
    return (q(e, t, n, r), te(), oe);
}
var yv = (e, t, n, r, o, i) => (vs(!0), Hl(r, o, Mp()));
var Jr = "en-US";
var Dv = Jr;
function wv(e) {
    typeof e == "string" && (Dv = e.toLowerCase().replace(/_/g, "-"));
}
function Do(e, t = "") {
    let n = z(),
        r = Ut(),
        o = e + _e,
        i = r.firstCreatePass ? $s(r, o, 1, t, null) : r.data[o],
        s = Cv(r, n, i, t, e);
    ((n[o] = s), ms() && js(r, n, s, i), Mn(i, !1));
}
var Cv = (e, t, n, r, o) => (vs(!0), Mg(t[ue], r));
function Zs(e) {
    return (wo("", e, ""), Zs);
}
function wo(e, t, n) {
    let r = z(),
        o = pv(r, e, t, n);
    return (o !== Nn && Ev(r, so(), o), wo);
}
function Ev(e, t, n) {
    let r = cp(t, e);
    _g(e[ue], r, n);
}
function qt(e, t, n) {
    let r = Xu() + e,
        o = z();
    return o[r] === Nn ? wd(o, r, n ? t.call(n) : t()) : Cd(o, r);
}
function Td(e, t, n, r, o, i, s, c) {
    let a = Xu() + e,
        u = z(),
        l = iv(u, a, n, r, o, i);
    return $t(u, a + 4, s) || l
        ? wd(u, a + 5, c ? t.call(c, n, r, o, i, s) : t(n, r, o, i, s))
        : Cd(u, a + 5);
}
var es = class {
        ngModuleFactory;
        componentFactories;
        constructor(t, n) {
            ((this.ngModuleFactory = t), (this.componentFactories = n));
        }
    },
    Qs = (() => {
        class e {
            compileModuleSync(n) {
                return new Wi(n);
            }
            compileModuleAsync(n) {
                return Promise.resolve(this.compileModuleSync(n));
            }
            compileModuleAndAllComponentsSync(n) {
                let r = this.compileModuleSync(n),
                    o = Au(n),
                    i = $l(o.declarations).reduce((s, c) => {
                        let a = rt(c);
                        return (a && s.push(new Cn(a)), s);
                    }, []);
                return new es(r, i);
            }
            compileModuleAndAllComponentsAsync(n) {
                return Promise.resolve(
                    this.compileModuleAndAllComponentsSync(n),
                );
            }
            clearCache() {}
            clearCacheFor(n) {}
            getModuleId(n) {}
            static ɵfac = function (r) {
                return new (r || e)();
            };
            static ɵprov = C({ token: e, factory: e.ɵfac, providedIn: "root" });
        }
        return e;
    })();
var Iv = (() => {
        class e {
            zone = p(Q);
            changeDetectionScheduler = p(Dn);
            applicationRef = p(Ze);
            _onMicrotaskEmptySubscription;
            initialize() {
                this._onMicrotaskEmptySubscription ||
                    (this._onMicrotaskEmptySubscription =
                        this.zone.onMicrotaskEmpty.subscribe({
                            next: () => {
                                this.changeDetectionScheduler.runningTick ||
                                    this.zone.run(() => {
                                        this.applicationRef.tick();
                                    });
                            },
                        }));
            }
            ngOnDestroy() {
                this._onMicrotaskEmptySubscription?.unsubscribe();
            }
            static ɵfac = function (r) {
                return new (r || e)();
            };
            static ɵprov = C({ token: e, factory: e.ɵfac, providedIn: "root" });
        }
        return e;
    })(),
    bv = new w("", { factory: () => !1 });
function xd({
    ngZoneFactory: e,
    ignoreChangesOutsideZone: t,
    scheduleInRootZone: n,
}) {
    return (
        (e ??= () => new Q(F(m({}, Ad()), { scheduleInRootZone: n }))),
        [
            { provide: Q, useFactory: e },
            {
                provide: Pt,
                multi: !0,
                useFactory: () => {
                    let r = p(Iv, { optional: !0 });
                    return () => r.initialize();
                },
            },
            {
                provide: Pt,
                multi: !0,
                useFactory: () => {
                    let r = p(Sv);
                    return () => {
                        r.initialize();
                    };
                },
            },
            t === !0 ? { provide: Cl, useValue: !0 } : [],
            { provide: El, useValue: n ?? wl },
        ]
    );
}
function Nd(e) {
    let t = e?.ignoreChangesOutsideZone,
        n = e?.scheduleInRootZone,
        r = xd({
            ngZoneFactory: () => {
                let o = Ad(e);
                return (
                    (o.scheduleInRootZone = n),
                    o.shouldCoalesceEventChangeDetection &&
                        fo("NgZone_CoalesceEvent"),
                    new Q(o)
                );
            },
            ignoreChangesOutsideZone: t,
            scheduleInRootZone: n,
        });
    return to([
        { provide: bv, useValue: !0 },
        { provide: co, useValue: !1 },
        r,
    ]);
}
function Ad(e) {
    return {
        enableLongStackTrace: !1,
        shouldCoalesceEventChangeDetection: e?.eventCoalescing ?? !1,
        shouldCoalesceRunChangeDetection: e?.runCoalescing ?? !1,
    };
}
var Sv = (() => {
    class e {
        subscription = new B();
        initialized = !1;
        zone = p(Q);
        pendingTasks = p(zt);
        initialize() {
            if (this.initialized) return;
            this.initialized = !0;
            let n = null;
            (!this.zone.isStable &&
                !this.zone.hasPendingMacrotasks &&
                !this.zone.hasPendingMicrotasks &&
                (n = this.pendingTasks.add()),
                this.zone.runOutsideAngular(() => {
                    this.subscription.add(
                        this.zone.onStable.subscribe(() => {
                            (Q.assertNotInAngularZone(),
                                queueMicrotask(() => {
                                    n !== null &&
                                        !this.zone.hasPendingMacrotasks &&
                                        !this.zone.hasPendingMicrotasks &&
                                        (this.pendingTasks.remove(n),
                                        (n = null));
                                }));
                        }),
                    );
                }),
                this.subscription.add(
                    this.zone.onUnstable.subscribe(() => {
                        (Q.assertInAngularZone(),
                            (n ??= this.pendingTasks.add()));
                    }),
                ));
        }
        ngOnDestroy() {
            this.subscription.unsubscribe();
        }
        static ɵfac = function (r) {
            return new (r || e)();
        };
        static ɵprov = C({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
    return e;
})();
var Mv = (() => {
    class e {
        appRef = p(Ze);
        taskService = p(zt);
        ngZone = p(Q);
        zonelessEnabled = p(co);
        tracing = p(lo, { optional: !0 });
        disableScheduling = p(Cl, { optional: !0 }) ?? !1;
        zoneIsDefined = typeof Zone < "u" && !!Zone.root.run;
        schedulerTickApplyArgs = [{ data: { __scheduler_tick__: !0 } }];
        subscriptions = new B();
        angularZoneId = this.zoneIsDefined ? this.ngZone._inner?.get(Ur) : null;
        scheduleInRootZone =
            !this.zonelessEnabled &&
            this.zoneIsDefined &&
            (p(El, { optional: !0 }) ?? !1);
        cancelScheduledCallback = null;
        useMicrotaskScheduler = !1;
        runningTick = !1;
        pendingRenderTaskId = null;
        constructor() {
            (this.subscriptions.add(
                this.appRef.afterTick.subscribe(() => {
                    this.runningTick || this.cleanup();
                }),
            ),
                this.subscriptions.add(
                    this.ngZone.onUnstable.subscribe(() => {
                        this.runningTick || this.cleanup();
                    }),
                ),
                (this.disableScheduling ||=
                    !this.zonelessEnabled &&
                    (this.ngZone instanceof Fi || !this.zoneIsDefined)));
        }
        notify(n) {
            if (!this.zonelessEnabled && n === 5) return;
            let r = !1;
            switch (n) {
                case 0: {
                    this.appRef.dirtyFlags |= 2;
                    break;
                }
                case 3:
                case 2:
                case 4:
                case 5:
                case 1: {
                    this.appRef.dirtyFlags |= 4;
                    break;
                }
                case 6: {
                    ((this.appRef.dirtyFlags |= 2), (r = !0));
                    break;
                }
                case 12: {
                    ((this.appRef.dirtyFlags |= 16), (r = !0));
                    break;
                }
                case 13: {
                    ((this.appRef.dirtyFlags |= 2), (r = !0));
                    break;
                }
                case 11: {
                    r = !0;
                    break;
                }
                case 9:
                case 8:
                case 7:
                case 10:
                default:
                    this.appRef.dirtyFlags |= 8;
            }
            if (
                ((this.appRef.tracingSnapshot =
                    this.tracing?.snapshot(this.appRef.tracingSnapshot) ??
                    null),
                !this.shouldScheduleTick(r))
            )
                return;
            let o = this.useMicrotaskScheduler ? Zc : Il;
            ((this.pendingRenderTaskId = this.taskService.add()),
                this.scheduleInRootZone
                    ? (this.cancelScheduledCallback = Zone.root.run(() =>
                          o(() => this.tick()),
                      ))
                    : (this.cancelScheduledCallback =
                          this.ngZone.runOutsideAngular(() =>
                              o(() => this.tick()),
                          )));
        }
        shouldScheduleTick(n) {
            return !(
                (this.disableScheduling && !n) ||
                this.appRef.destroyed ||
                this.pendingRenderTaskId !== null ||
                this.runningTick ||
                this.appRef._runningTick ||
                (!this.zonelessEnabled &&
                    this.zoneIsDefined &&
                    Zone.current.get(Ur + this.angularZoneId))
            );
        }
        tick() {
            if (this.runningTick || this.appRef.destroyed) return;
            if (this.appRef.dirtyFlags === 0) {
                this.cleanup();
                return;
            }
            !this.zonelessEnabled &&
                this.appRef.dirtyFlags & 7 &&
                (this.appRef.dirtyFlags |= 1);
            let n = this.taskService.add();
            try {
                this.ngZone.run(
                    () => {
                        ((this.runningTick = !0), this.appRef._tick());
                    },
                    void 0,
                    this.schedulerTickApplyArgs,
                );
            } catch (r) {
                throw (this.taskService.remove(n), r);
            } finally {
                this.cleanup();
            }
            ((this.useMicrotaskScheduler = !0),
                Zc(() => {
                    ((this.useMicrotaskScheduler = !1),
                        this.taskService.remove(n));
                }));
        }
        ngOnDestroy() {
            (this.subscriptions.unsubscribe(), this.cleanup());
        }
        cleanup() {
            if (
                ((this.runningTick = !1),
                this.cancelScheduledCallback?.(),
                (this.cancelScheduledCallback = null),
                this.pendingRenderTaskId !== null)
            ) {
                let n = this.pendingRenderTaskId;
                ((this.pendingRenderTaskId = null), this.taskService.remove(n));
            }
        }
        static ɵfac = function (r) {
            return new (r || e)();
        };
        static ɵprov = C({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
    return e;
})();
function _v() {
    return (typeof $localize < "u" && $localize.locale) || Jr;
}
var Ys = new w("", {
    providedIn: "root",
    factory: () => p(Ys, S.Optional | S.SkipSelf) || _v(),
});
var ts = new w(""),
    Tv = new w("");
function cn(e) {
    return !e.moduleRef;
}
function xv(e) {
    let t = cn(e) ? e.r3Injector : e.moduleRef.injector,
        n = t.get(Q);
    return n.run(() => {
        cn(e)
            ? e.r3Injector.resolveInjectorInitializers()
            : e.moduleRef.resolveInjectorInitializers();
        let r = t.get(Ge, null),
            o;
        if (
            (n.runOutsideAngular(() => {
                o = n.onError.subscribe({
                    next: (i) => {
                        r.handleError(i);
                    },
                });
            }),
            cn(e))
        ) {
            let i = () => t.destroy(),
                s = e.platformInjector.get(ts);
            (s.add(i),
                t.onDestroy(() => {
                    (o.unsubscribe(), s.delete(i));
                }));
        } else {
            let i = () => e.moduleRef.destroy(),
                s = e.platformInjector.get(ts);
            (s.add(i),
                e.moduleRef.onDestroy(() => {
                    (xr(e.allPlatformModules, e.moduleRef),
                        o.unsubscribe(),
                        s.delete(i));
                }));
        }
        return Av(r, n, () => {
            let i = t.get(Sd);
            return (
                i.runInitializers(),
                i.donePromise.then(() => {
                    let s = t.get(Ys, Jr);
                    if ((wv(s || Jr), !t.get(Tv, !0)))
                        return cn(e)
                            ? t.get(Ze)
                            : (e.allPlatformModules.push(e.moduleRef),
                              e.moduleRef);
                    if (cn(e)) {
                        let a = t.get(Ze);
                        return (
                            e.rootComponent !== void 0 &&
                                a.bootstrap(e.rootComponent),
                            a
                        );
                    } else
                        return (
                            Nv(e.moduleRef, e.allPlatformModules),
                            e.moduleRef
                        );
                })
            );
        });
    });
}
function Nv(e, t) {
    let n = e.injector.get(Ze);
    if (e._bootstrapComponents.length > 0)
        e._bootstrapComponents.forEach((r) => n.bootstrap(r));
    else if (e.instance.ngDoBootstrap) e.instance.ngDoBootstrap(n);
    else throw new v(-403, !1);
    t.push(e);
}
function Av(e, t, n) {
    try {
        let r = n();
        return An(r)
            ? r.catch((o) => {
                  throw (t.runOutsideAngular(() => e.handleError(o)), o);
              })
            : r;
    } catch (r) {
        throw (t.runOutsideAngular(() => e.handleError(r)), r);
    }
}
var Nr = null;
function Rv(e = [], t) {
    return Te.create({
        name: t,
        providers: [
            { provide: no, useValue: "platform" },
            { provide: ts, useValue: new Set([() => (Nr = null)]) },
            ...e,
        ],
    });
}
function Ov(e = []) {
    if (Nr) return Nr;
    let t = Rv(e);
    return ((Nr = t), lv(), kv(t), t);
}
function kv(e) {
    let t = e.get(Ss, null);
    Ie(e, () => {
        t?.forEach((n) => n());
    });
}
var Rn = (() => {
    class e {
        static __NG_ELEMENT_ID__ = Pv;
    }
    return e;
})();
function Pv(e) {
    return Fv(ct(), z(), (e & 16) === 16);
}
function Fv(e, t, n) {
    if (bn(e) && !n) {
        let r = qe(e.index, t);
        return new jt(r, r);
    } else if (e.type & 175) {
        let r = t[Ee];
        return new jt(r, t);
    }
    return null;
}
function Rd(e) {
    L(8);
    try {
        let { rootComponent: t, appProviders: n, platformProviders: r } = e,
            o = Ov(r),
            i = [xd({}), { provide: Dn, useExisting: Mv }, ...(n || [])],
            s = new Yr({
                providers: i,
                parent: o,
                debugName: "",
                runEnvironmentInitializers: !1,
            });
        return xv({
            r3Injector: s.injector,
            platformInjector: o,
            rootComponent: t,
        });
    } catch (t) {
        return Promise.reject(t);
    } finally {
        L(9);
    }
}
var mu = class {
    [gt];
    constructor(t) {
        this[gt] = t;
    }
    destroy() {
        this[gt].destroy();
    }
};
var Vd = null;
function Gt() {
    return Vd;
}
function Bd(e) {
    Vd ??= e;
}
var Eo = class {};
var ge = new w(""),
    $d = (() => {
        class e {
            historyGo(n) {
                throw new Error("");
            }
            static ɵfac = function (r) {
                return new (r || e)();
            };
            static ɵprov = C({
                token: e,
                factory: () => p(Vv),
                providedIn: "platform",
            });
        }
        return e;
    })();
var Vv = (() => {
    class e extends $d {
        _location;
        _history;
        _doc = p(ge);
        constructor() {
            (super(),
                (this._location = window.location),
                (this._history = window.history));
        }
        getBaseHrefFromDOM() {
            return Gt().getBaseHref(this._doc);
        }
        onPopState(n) {
            let r = Gt().getGlobalEventTarget(this._doc, "window");
            return (
                r.addEventListener("popstate", n, !1),
                () => r.removeEventListener("popstate", n)
            );
        }
        onHashChange(n) {
            let r = Gt().getGlobalEventTarget(this._doc, "window");
            return (
                r.addEventListener("hashchange", n, !1),
                () => r.removeEventListener("hashchange", n)
            );
        }
        get href() {
            return this._location.href;
        }
        get protocol() {
            return this._location.protocol;
        }
        get hostname() {
            return this._location.hostname;
        }
        get port() {
            return this._location.port;
        }
        get pathname() {
            return this._location.pathname;
        }
        get search() {
            return this._location.search;
        }
        get hash() {
            return this._location.hash;
        }
        set pathname(n) {
            this._location.pathname = n;
        }
        pushState(n, r, o) {
            this._history.pushState(n, r, o);
        }
        replaceState(n, r, o) {
            this._history.replaceState(n, r, o);
        }
        forward() {
            this._history.forward();
        }
        back() {
            this._history.back();
        }
        historyGo(n = 0) {
            this._history.go(n);
        }
        getState() {
            return this._history.state;
        }
        static ɵfac = function (r) {
            return new (r || e)();
        };
        static ɵprov = C({
            token: e,
            factory: () => new e(),
            providedIn: "platform",
        });
    }
    return e;
})();
function Ud(e, t) {
    return e
        ? t
            ? e.endsWith("/")
                ? t.startsWith("/")
                    ? e + t.slice(1)
                    : e + t
                : t.startsWith("/")
                  ? e + t
                  : `${e}/${t}`
            : e
        : t;
}
function Od(e) {
    let t = e.search(/#|\?|$/);
    return e[t - 1] === "/" ? e.slice(0, t - 1) + e.slice(t) : e;
}
function lt(e) {
    return e && e[0] !== "?" ? `?${e}` : e;
}
var bo = (() => {
        class e {
            historyGo(n) {
                throw new Error("");
            }
            static ɵfac = function (r) {
                return new (r || e)();
            };
            static ɵprov = C({
                token: e,
                factory: () => p(Hd),
                providedIn: "root",
            });
        }
        return e;
    })(),
    Bv = new w(""),
    Hd = (() => {
        class e extends bo {
            _platformLocation;
            _baseHref;
            _removeListenerFns = [];
            constructor(n, r) {
                (super(),
                    (this._platformLocation = n),
                    (this._baseHref =
                        r ??
                        this._platformLocation.getBaseHrefFromDOM() ??
                        p(ge).location?.origin ??
                        ""));
            }
            ngOnDestroy() {
                for (; this._removeListenerFns.length; )
                    this._removeListenerFns.pop()();
            }
            onPopState(n) {
                this._removeListenerFns.push(
                    this._platformLocation.onPopState(n),
                    this._platformLocation.onHashChange(n),
                );
            }
            getBaseHref() {
                return this._baseHref;
            }
            prepareExternalUrl(n) {
                return Ud(this._baseHref, n);
            }
            path(n = !1) {
                let r =
                        this._platformLocation.pathname +
                        lt(this._platformLocation.search),
                    o = this._platformLocation.hash;
                return o && n ? `${r}${o}` : r;
            }
            pushState(n, r, o, i) {
                let s = this.prepareExternalUrl(o + lt(i));
                this._platformLocation.pushState(n, r, s);
            }
            replaceState(n, r, o, i) {
                let s = this.prepareExternalUrl(o + lt(i));
                this._platformLocation.replaceState(n, r, s);
            }
            forward() {
                this._platformLocation.forward();
            }
            back() {
                this._platformLocation.back();
            }
            getState() {
                return this._platformLocation.getState();
            }
            historyGo(n = 0) {
                this._platformLocation.historyGo?.(n);
            }
            static ɵfac = function (r) {
                return new (r || e)(M($d), M(Bv, 8));
            };
            static ɵprov = C({ token: e, factory: e.ɵfac, providedIn: "root" });
        }
        return e;
    })();
var On = (() => {
    class e {
        _subject = new K();
        _basePath;
        _locationStrategy;
        _urlChangeListeners = [];
        _urlChangeSubscription = null;
        constructor(n) {
            this._locationStrategy = n;
            let r = this._locationStrategy.getBaseHref();
            ((this._basePath = Hv(Od(kd(r)))),
                this._locationStrategy.onPopState((o) => {
                    this._subject.next({
                        url: this.path(!0),
                        pop: !0,
                        state: o.state,
                        type: o.type,
                    });
                }));
        }
        ngOnDestroy() {
            (this._urlChangeSubscription?.unsubscribe(),
                (this._urlChangeListeners = []));
        }
        path(n = !1) {
            return this.normalize(this._locationStrategy.path(n));
        }
        getState() {
            return this._locationStrategy.getState();
        }
        isCurrentPathEqualTo(n, r = "") {
            return this.path() == this.normalize(n + lt(r));
        }
        normalize(n) {
            return e.stripTrailingSlash(Uv(this._basePath, kd(n)));
        }
        prepareExternalUrl(n) {
            return (
                n && n[0] !== "/" && (n = "/" + n),
                this._locationStrategy.prepareExternalUrl(n)
            );
        }
        go(n, r = "", o = null) {
            (this._locationStrategy.pushState(o, "", n, r),
                this._notifyUrlChangeListeners(
                    this.prepareExternalUrl(n + lt(r)),
                    o,
                ));
        }
        replaceState(n, r = "", o = null) {
            (this._locationStrategy.replaceState(o, "", n, r),
                this._notifyUrlChangeListeners(
                    this.prepareExternalUrl(n + lt(r)),
                    o,
                ));
        }
        forward() {
            this._locationStrategy.forward();
        }
        back() {
            this._locationStrategy.back();
        }
        historyGo(n = 0) {
            this._locationStrategy.historyGo?.(n);
        }
        onUrlChange(n) {
            return (
                this._urlChangeListeners.push(n),
                (this._urlChangeSubscription ??= this.subscribe((r) => {
                    this._notifyUrlChangeListeners(r.url, r.state);
                })),
                () => {
                    let r = this._urlChangeListeners.indexOf(n);
                    (this._urlChangeListeners.splice(r, 1),
                        this._urlChangeListeners.length === 0 &&
                            (this._urlChangeSubscription?.unsubscribe(),
                            (this._urlChangeSubscription = null)));
                }
            );
        }
        _notifyUrlChangeListeners(n = "", r) {
            this._urlChangeListeners.forEach((o) => o(n, r));
        }
        subscribe(n, r, o) {
            return this._subject.subscribe({
                next: n,
                error: r ?? void 0,
                complete: o ?? void 0,
            });
        }
        static normalizeQueryParams = lt;
        static joinWithSlash = Ud;
        static stripTrailingSlash = Od;
        static ɵfac = function (r) {
            return new (r || e)(M(bo));
        };
        static ɵprov = C({ token: e, factory: () => $v(), providedIn: "root" });
    }
    return e;
})();
function $v() {
    return new On(M(bo));
}
function Uv(e, t) {
    if (!e || !t.startsWith(e)) return t;
    let n = t.substring(e.length);
    return n === "" || ["/", ";", "?", "#"].includes(n[0]) ? n : t;
}
function kd(e) {
    return e.replace(/\/index.html$/, "");
}
function Hv(e) {
    if (new RegExp("^(https?:)?//").test(e)) {
        let [, n] = e.split(/\/\/[^\/]+/);
        return n;
    }
    return e;
}
function zd(e, t) {
    t = encodeURIComponent(t);
    for (let n of e.split(";")) {
        let r = n.indexOf("="),
            [o, i] = r == -1 ? [n, ""] : [n.slice(0, r), n.slice(r + 1)];
        if (o.trim() === t) return decodeURIComponent(i);
    }
    return null;
}
var qd = "browser",
    zv = "server";
function Ks(e) {
    return e === zv;
}
var Io = class {};
var Xs = class extends Eo {
        supportsDOMEvents = !0;
    },
    ea = class e extends Xs {
        static makeCurrent() {
            Bd(new e());
        }
        onAndCancel(t, n, r, o) {
            return (
                t.addEventListener(n, r, o),
                () => {
                    t.removeEventListener(n, r, o);
                }
            );
        }
        dispatchEvent(t, n) {
            t.dispatchEvent(n);
        }
        remove(t) {
            t.remove();
        }
        createElement(t, n) {
            return ((n = n || this.getDefaultDocument()), n.createElement(t));
        }
        createHtmlDocument() {
            return document.implementation.createHTMLDocument("fakeTitle");
        }
        getDefaultDocument() {
            return document;
        }
        isElementNode(t) {
            return t.nodeType === Node.ELEMENT_NODE;
        }
        isShadowRoot(t) {
            return t instanceof DocumentFragment;
        }
        getGlobalEventTarget(t, n) {
            return n === "window"
                ? window
                : n === "document"
                  ? t
                  : n === "body"
                    ? t.body
                    : null;
        }
        getBaseHref(t) {
            let n = qv();
            return n == null ? null : Gv(n);
        }
        resetBaseElement() {
            kn = null;
        }
        getUserAgent() {
            return window.navigator.userAgent;
        }
        getCookie(t) {
            return zd(document.cookie, t);
        }
    },
    kn = null;
function qv() {
    return (
        (kn = kn || document.querySelector("base")),
        kn ? kn.getAttribute("href") : null
    );
}
function Gv(e) {
    return new URL(e, document.baseURI).pathname;
}
var Wv = (() => {
        class e {
            build() {
                return new XMLHttpRequest();
            }
            static ɵfac = function (r) {
                return new (r || e)();
            };
            static ɵprov = C({ token: e, factory: e.ɵfac });
        }
        return e;
    })(),
    ta = new w(""),
    Kd = (() => {
        class e {
            _zone;
            _plugins;
            _eventNameToPlugin = new Map();
            constructor(n, r) {
                ((this._zone = r),
                    n.forEach((o) => {
                        o.manager = this;
                    }),
                    (this._plugins = n.slice().reverse()));
            }
            addEventListener(n, r, o, i) {
                return this._findPluginFor(r).addEventListener(n, r, o, i);
            }
            getZone() {
                return this._zone;
            }
            _findPluginFor(n) {
                let r = this._eventNameToPlugin.get(n);
                if (r) return r;
                if (((r = this._plugins.find((i) => i.supports(n))), !r))
                    throw new v(5101, !1);
                return (this._eventNameToPlugin.set(n, r), r);
            }
            static ɵfac = function (r) {
                return new (r || e)(M(ta), M(Q));
            };
            static ɵprov = C({ token: e, factory: e.ɵfac });
        }
        return e;
    })(),
    Mo = class {
        _doc;
        constructor(t) {
            this._doc = t;
        }
        manager;
    },
    So = "ng-app-id";
function Gd(e) {
    for (let t of e) t.remove();
}
function Wd(e, t) {
    let n = t.createElement("style");
    return ((n.textContent = e), n);
}
function Zv(e, t, n, r) {
    let o = e.head?.querySelectorAll(`style[${So}="${t}"],link[${So}="${t}"]`);
    if (o)
        for (let i of o)
            (i.removeAttribute(So),
                i instanceof HTMLLinkElement
                    ? r.set(i.href.slice(i.href.lastIndexOf("/") + 1), {
                          usage: 0,
                          elements: [i],
                      })
                    : i.textContent &&
                      n.set(i.textContent, { usage: 0, elements: [i] }));
}
function na(e, t) {
    let n = t.createElement("link");
    return (n.setAttribute("rel", "stylesheet"), n.setAttribute("href", e), n);
}
var Jd = (() => {
        class e {
            doc;
            appId;
            nonce;
            inline = new Map();
            external = new Map();
            hosts = new Set();
            isServer;
            constructor(n, r, o, i = {}) {
                ((this.doc = n),
                    (this.appId = r),
                    (this.nonce = o),
                    (this.isServer = Ks(i)),
                    Zv(n, r, this.inline, this.external),
                    this.hosts.add(n.head));
            }
            addStyles(n, r) {
                for (let o of n) this.addUsage(o, this.inline, Wd);
                r?.forEach((o) => this.addUsage(o, this.external, na));
            }
            removeStyles(n, r) {
                for (let o of n) this.removeUsage(o, this.inline);
                r?.forEach((o) => this.removeUsage(o, this.external));
            }
            addUsage(n, r, o) {
                let i = r.get(n);
                i
                    ? i.usage++
                    : r.set(n, {
                          usage: 1,
                          elements: [...this.hosts].map((s) =>
                              this.addElement(s, o(n, this.doc)),
                          ),
                      });
            }
            removeUsage(n, r) {
                let o = r.get(n);
                o && (o.usage--, o.usage <= 0 && (Gd(o.elements), r.delete(n)));
            }
            ngOnDestroy() {
                for (let [, { elements: n }] of [
                    ...this.inline,
                    ...this.external,
                ])
                    Gd(n);
                this.hosts.clear();
            }
            addHost(n) {
                this.hosts.add(n);
                for (let [r, { elements: o }] of this.inline)
                    o.push(this.addElement(n, Wd(r, this.doc)));
                for (let [r, { elements: o }] of this.external)
                    o.push(this.addElement(n, na(r, this.doc)));
            }
            removeHost(n) {
                this.hosts.delete(n);
            }
            addElement(n, r) {
                return (
                    this.nonce && r.setAttribute("nonce", this.nonce),
                    this.isServer && r.setAttribute(So, this.appId),
                    n.appendChild(r)
                );
            }
            static ɵfac = function (r) {
                return new (r || e)(M(ge), M(bs), M(Ms, 8), M(xn));
            };
            static ɵprov = C({ token: e, factory: e.ɵfac });
        }
        return e;
    })(),
    Js = {
        svg: "http://www.w3.org/2000/svg",
        xhtml: "http://www.w3.org/1999/xhtml",
        xlink: "http://www.w3.org/1999/xlink",
        xml: "http://www.w3.org/XML/1998/namespace",
        xmlns: "http://www.w3.org/2000/xmlns/",
        math: "http://www.w3.org/1998/Math/MathML",
    },
    oa = /%COMP%/g;
var Xd = "%COMP%",
    Qv = `_nghost-${Xd}`,
    Yv = `_ngcontent-${Xd}`,
    Kv = !0,
    Jv = new w("", { providedIn: "root", factory: () => Kv });
function Xv(e) {
    return Yv.replace(oa, e);
}
function ey(e) {
    return Qv.replace(oa, e);
}
function ef(e, t) {
    return t.map((n) => n.replace(oa, e));
}
var Zd = (() => {
        class e {
            eventManager;
            sharedStylesHost;
            appId;
            removeStylesOnCompDestroy;
            doc;
            platformId;
            ngZone;
            nonce;
            tracingService;
            rendererByCompId = new Map();
            defaultRenderer;
            platformIsServer;
            constructor(n, r, o, i, s, c, a, u = null, l = null) {
                ((this.eventManager = n),
                    (this.sharedStylesHost = r),
                    (this.appId = o),
                    (this.removeStylesOnCompDestroy = i),
                    (this.doc = s),
                    (this.platformId = c),
                    (this.ngZone = a),
                    (this.nonce = u),
                    (this.tracingService = l),
                    (this.platformIsServer = Ks(c)),
                    (this.defaultRenderer = new Pn(
                        n,
                        s,
                        a,
                        this.platformIsServer,
                        this.tracingService,
                    )));
            }
            createRenderer(n, r) {
                if (!n || !r) return this.defaultRenderer;
                this.platformIsServer &&
                    r.encapsulation === xe.ShadowDom &&
                    (r = F(m({}, r), { encapsulation: xe.Emulated }));
                let o = this.getOrCreateRenderer(n, r);
                return (
                    o instanceof _o
                        ? o.applyToHost(n)
                        : o instanceof Fn && o.applyStyles(),
                    o
                );
            }
            getOrCreateRenderer(n, r) {
                let o = this.rendererByCompId,
                    i = o.get(r.id);
                if (!i) {
                    let s = this.doc,
                        c = this.ngZone,
                        a = this.eventManager,
                        u = this.sharedStylesHost,
                        l = this.removeStylesOnCompDestroy,
                        d = this.platformIsServer,
                        h = this.tracingService;
                    switch (r.encapsulation) {
                        case xe.Emulated:
                            i = new _o(a, u, r, this.appId, l, s, c, d, h);
                            break;
                        case xe.ShadowDom:
                            return new ra(a, u, n, r, s, c, this.nonce, d, h);
                        default:
                            i = new Fn(a, u, r, l, s, c, d, h);
                            break;
                    }
                    o.set(r.id, i);
                }
                return i;
            }
            ngOnDestroy() {
                this.rendererByCompId.clear();
            }
            componentReplaced(n) {
                this.rendererByCompId.delete(n);
            }
            static ɵfac = function (r) {
                return new (r || e)(
                    M(Kd),
                    M(Jd),
                    M(bs),
                    M(Jv),
                    M(ge),
                    M(xn),
                    M(Q),
                    M(Ms),
                    M(lo, 8),
                );
            };
            static ɵprov = C({ token: e, factory: e.ɵfac });
        }
        return e;
    })(),
    Pn = class {
        eventManager;
        doc;
        ngZone;
        platformIsServer;
        tracingService;
        data = Object.create(null);
        throwOnSyntheticProps = !0;
        constructor(t, n, r, o, i) {
            ((this.eventManager = t),
                (this.doc = n),
                (this.ngZone = r),
                (this.platformIsServer = o),
                (this.tracingService = i));
        }
        destroy() {}
        destroyNode = null;
        createElement(t, n) {
            return n
                ? this.doc.createElementNS(Js[n] || n, t)
                : this.doc.createElement(t);
        }
        createComment(t) {
            return this.doc.createComment(t);
        }
        createText(t) {
            return this.doc.createTextNode(t);
        }
        appendChild(t, n) {
            (Qd(t) ? t.content : t).appendChild(n);
        }
        insertBefore(t, n, r) {
            t && (Qd(t) ? t.content : t).insertBefore(n, r);
        }
        removeChild(t, n) {
            n.remove();
        }
        selectRootElement(t, n) {
            let r = typeof t == "string" ? this.doc.querySelector(t) : t;
            if (!r) throw new v(-5104, !1);
            return (n || (r.textContent = ""), r);
        }
        parentNode(t) {
            return t.parentNode;
        }
        nextSibling(t) {
            return t.nextSibling;
        }
        setAttribute(t, n, r, o) {
            if (o) {
                n = o + ":" + n;
                let i = Js[o];
                i ? t.setAttributeNS(i, n, r) : t.setAttribute(n, r);
            } else t.setAttribute(n, r);
        }
        removeAttribute(t, n, r) {
            if (r) {
                let o = Js[r];
                o ? t.removeAttributeNS(o, n) : t.removeAttribute(`${r}:${n}`);
            } else t.removeAttribute(n);
        }
        addClass(t, n) {
            t.classList.add(n);
        }
        removeClass(t, n) {
            t.classList.remove(n);
        }
        setStyle(t, n, r, o) {
            o & (ut.DashCase | ut.Important)
                ? t.style.setProperty(n, r, o & ut.Important ? "important" : "")
                : (t.style[n] = r);
        }
        removeStyle(t, n, r) {
            r & ut.DashCase ? t.style.removeProperty(n) : (t.style[n] = "");
        }
        setProperty(t, n, r) {
            t != null && (t[n] = r);
        }
        setValue(t, n) {
            t.nodeValue = n;
        }
        listen(t, n, r, o) {
            if (
                typeof t == "string" &&
                ((t = Gt().getGlobalEventTarget(this.doc, t)), !t)
            )
                throw new Error(`Unsupported event target ${t} for event ${n}`);
            let i = this.decoratePreventDefault(r);
            return (
                this.tracingService !== null &&
                    this.tracingService.wrapEventListener &&
                    (i = this.tracingService.wrapEventListener(t, n, i)),
                this.eventManager.addEventListener(t, n, i, o)
            );
        }
        decoratePreventDefault(t) {
            return (n) => {
                if (n === "__ngUnwrap__") return t;
                (this.platformIsServer
                    ? this.ngZone.runGuarded(() => t(n))
                    : t(n)) === !1 && n.preventDefault();
            };
        }
    };
function Qd(e) {
    return e.tagName === "TEMPLATE" && e.content !== void 0;
}
var ra = class extends Pn {
        sharedStylesHost;
        hostEl;
        shadowRoot;
        constructor(t, n, r, o, i, s, c, a, u) {
            (super(t, i, s, a, u),
                (this.sharedStylesHost = n),
                (this.hostEl = r),
                (this.shadowRoot = r.attachShadow({ mode: "open" })),
                this.sharedStylesHost.addHost(this.shadowRoot));
            let l = o.styles;
            l = ef(o.id, l);
            for (let h of l) {
                let f = document.createElement("style");
                (c && f.setAttribute("nonce", c),
                    (f.textContent = h),
                    this.shadowRoot.appendChild(f));
            }
            let d = o.getExternalStyles?.();
            if (d)
                for (let h of d) {
                    let f = na(h, i);
                    (c && f.setAttribute("nonce", c),
                        this.shadowRoot.appendChild(f));
                }
        }
        nodeOrShadowRoot(t) {
            return t === this.hostEl ? this.shadowRoot : t;
        }
        appendChild(t, n) {
            return super.appendChild(this.nodeOrShadowRoot(t), n);
        }
        insertBefore(t, n, r) {
            return super.insertBefore(this.nodeOrShadowRoot(t), n, r);
        }
        removeChild(t, n) {
            return super.removeChild(null, n);
        }
        parentNode(t) {
            return this.nodeOrShadowRoot(
                super.parentNode(this.nodeOrShadowRoot(t)),
            );
        }
        destroy() {
            this.sharedStylesHost.removeHost(this.shadowRoot);
        }
    },
    Fn = class extends Pn {
        sharedStylesHost;
        removeStylesOnCompDestroy;
        styles;
        styleUrls;
        constructor(t, n, r, o, i, s, c, a, u) {
            (super(t, i, s, c, a),
                (this.sharedStylesHost = n),
                (this.removeStylesOnCompDestroy = o));
            let l = r.styles;
            ((this.styles = u ? ef(u, l) : l),
                (this.styleUrls = r.getExternalStyles?.(u)));
        }
        applyStyles() {
            this.sharedStylesHost.addStyles(this.styles, this.styleUrls);
        }
        destroy() {
            this.removeStylesOnCompDestroy &&
                this.sharedStylesHost.removeStyles(this.styles, this.styleUrls);
        }
    },
    _o = class extends Fn {
        contentAttr;
        hostAttr;
        constructor(t, n, r, o, i, s, c, a, u) {
            let l = o + "-" + r.id;
            (super(t, n, r, i, s, c, a, u, l),
                (this.contentAttr = Xv(l)),
                (this.hostAttr = ey(l)));
        }
        applyToHost(t) {
            (this.applyStyles(), this.setAttribute(t, this.hostAttr, ""));
        }
        createElement(t, n) {
            let r = super.createElement(t, n);
            return (super.setAttribute(r, this.contentAttr, ""), r);
        }
    },
    ty = (() => {
        class e extends Mo {
            constructor(n) {
                super(n);
            }
            supports(n) {
                return !0;
            }
            addEventListener(n, r, o, i) {
                return (
                    n.addEventListener(r, o, i),
                    () => this.removeEventListener(n, r, o, i)
                );
            }
            removeEventListener(n, r, o, i) {
                return n.removeEventListener(r, o, i);
            }
            static ɵfac = function (r) {
                return new (r || e)(M(ge));
            };
            static ɵprov = C({ token: e, factory: e.ɵfac });
        }
        return e;
    })(),
    Yd = ["alt", "control", "meta", "shift"],
    ny = {
        "\b": "Backspace",
        "	": "Tab",
        "\x7F": "Delete",
        "\x1B": "Escape",
        Del: "Delete",
        Esc: "Escape",
        Left: "ArrowLeft",
        Right: "ArrowRight",
        Up: "ArrowUp",
        Down: "ArrowDown",
        Menu: "ContextMenu",
        Scroll: "ScrollLock",
        Win: "OS",
    },
    ry = {
        alt: (e) => e.altKey,
        control: (e) => e.ctrlKey,
        meta: (e) => e.metaKey,
        shift: (e) => e.shiftKey,
    },
    oy = (() => {
        class e extends Mo {
            constructor(n) {
                super(n);
            }
            supports(n) {
                return e.parseEventName(n) != null;
            }
            addEventListener(n, r, o, i) {
                let s = e.parseEventName(r),
                    c = e.eventCallback(s.fullKey, o, this.manager.getZone());
                return this.manager
                    .getZone()
                    .runOutsideAngular(() =>
                        Gt().onAndCancel(n, s.domEventName, c, i),
                    );
            }
            static parseEventName(n) {
                let r = n.toLowerCase().split("."),
                    o = r.shift();
                if (r.length === 0 || !(o === "keydown" || o === "keyup"))
                    return null;
                let i = e._normalizeKey(r.pop()),
                    s = "",
                    c = r.indexOf("code");
                if (
                    (c > -1 && (r.splice(c, 1), (s = "code.")),
                    Yd.forEach((u) => {
                        let l = r.indexOf(u);
                        l > -1 && (r.splice(l, 1), (s += u + "."));
                    }),
                    (s += i),
                    r.length != 0 || i.length === 0)
                )
                    return null;
                let a = {};
                return ((a.domEventName = o), (a.fullKey = s), a);
            }
            static matchEventFullKeyCode(n, r) {
                let o = ny[n.key] || n.key,
                    i = "";
                return (
                    r.indexOf("code.") > -1 && ((o = n.code), (i = "code.")),
                    o == null || !o
                        ? !1
                        : ((o = o.toLowerCase()),
                          o === " " ? (o = "space") : o === "." && (o = "dot"),
                          Yd.forEach((s) => {
                              if (s !== o) {
                                  let c = ry[s];
                                  c(n) && (i += s + ".");
                              }
                          }),
                          (i += o),
                          i === r)
                );
            }
            static eventCallback(n, r, o) {
                return (i) => {
                    e.matchEventFullKeyCode(i, n) && o.runGuarded(() => r(i));
                };
            }
            static _normalizeKey(n) {
                return n === "esc" ? "escape" : n;
            }
            static ɵfac = function (r) {
                return new (r || e)(M(ge));
            };
            static ɵprov = C({ token: e, factory: e.ɵfac });
        }
        return e;
    })();
function tf(e, t) {
    return Rd(m({ rootComponent: e }, iy(t)));
}
function iy(e) {
    return {
        appProviders: [...ly, ...(e?.providers ?? [])],
        platformProviders: uy,
    };
}
function sy() {
    ea.makeCurrent();
}
function ay() {
    return new Ge();
}
function cy() {
    return (Rl(document), document);
}
var uy = [
    { provide: xn, useValue: qd },
    { provide: Ss, useValue: sy, multi: !0 },
    { provide: ge, useFactory: cy, deps: [] },
];
var ly = [
    { provide: no, useValue: "root" },
    { provide: Ge, useFactory: ay, deps: [] },
    { provide: ta, useClass: ty, multi: !0, deps: [ge] },
    { provide: ta, useClass: oy, multi: !0, deps: [ge] },
    Zd,
    Jd,
    Kd,
    { provide: Bt, useExisting: Zd },
    { provide: Io, useClass: Wv, deps: [] },
    [],
];
var nf = (() => {
    class e {
        _doc;
        constructor(n) {
            this._doc = n;
        }
        getTitle() {
            return this._doc.title;
        }
        setTitle(n) {
            this._doc.title = n || "";
        }
        static ɵfac = function (r) {
            return new (r || e)(M(ge));
        };
        static ɵprov = C({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
    return e;
})();
var b = "primary",
    Jn = Symbol("RouteTitle"),
    ua = class {
        params;
        constructor(t) {
            this.params = t || {};
        }
        has(t) {
            return Object.prototype.hasOwnProperty.call(this.params, t);
        }
        get(t) {
            if (this.has(t)) {
                let n = this.params[t];
                return Array.isArray(n) ? n[0] : n;
            }
            return null;
        }
        getAll(t) {
            if (this.has(t)) {
                let n = this.params[t];
                return Array.isArray(n) ? n : [n];
            }
            return [];
        }
        get keys() {
            return Object.keys(this.params);
        }
    };
function Jt(e) {
    return new ua(e);
}
function fy(e, t, n) {
    let r = n.path.split("/");
    if (
        r.length > e.length ||
        (n.pathMatch === "full" && (t.hasChildren() || r.length < e.length))
    )
        return null;
    let o = {};
    for (let i = 0; i < r.length; i++) {
        let s = r[i],
            c = e[i];
        if (s[0] === ":") o[s.substring(1)] = c;
        else if (s !== c.path) return null;
    }
    return { consumed: e.slice(0, r.length), posParams: o };
}
function hy(e, t) {
    if (e.length !== t.length) return !1;
    for (let n = 0; n < e.length; ++n) if (!Ne(e[n], t[n])) return !1;
    return !0;
}
function Ne(e, t) {
    let n = e ? la(e) : void 0,
        r = t ? la(t) : void 0;
    if (!n || !r || n.length != r.length) return !1;
    let o;
    for (let i = 0; i < n.length; i++)
        if (((o = n[i]), !df(e[o], t[o]))) return !1;
    return !0;
}
function la(e) {
    return [...Object.keys(e), ...Object.getOwnPropertySymbols(e)];
}
function df(e, t) {
    if (Array.isArray(e) && Array.isArray(t)) {
        if (e.length !== t.length) return !1;
        let n = [...e].sort(),
            r = [...t].sort();
        return n.every((o, i) => r[i] === o);
    } else return e === t;
}
function ff(e) {
    return e.length > 0 ? e[e.length - 1] : null;
}
function Ye(e) {
    return oi(e) ? e : An(e) ? U(Promise.resolve(e)) : I(e);
}
var py = { exact: pf, subset: gf },
    hf = { exact: gy, subset: my, ignored: () => !0 };
function rf(e, t, n) {
    return (
        py[n.paths](e.root, t.root, n.matrixParams) &&
        hf[n.queryParams](e.queryParams, t.queryParams) &&
        !(n.fragment === "exact" && e.fragment !== t.fragment)
    );
}
function gy(e, t) {
    return Ne(e, t);
}
function pf(e, t, n) {
    if (
        !ft(e.segments, t.segments) ||
        !No(e.segments, t.segments, n) ||
        e.numberOfChildren !== t.numberOfChildren
    )
        return !1;
    for (let r in t.children)
        if (!e.children[r] || !pf(e.children[r], t.children[r], n)) return !1;
    return !0;
}
function my(e, t) {
    return (
        Object.keys(t).length <= Object.keys(e).length &&
        Object.keys(t).every((n) => df(e[n], t[n]))
    );
}
function gf(e, t, n) {
    return mf(e, t, t.segments, n);
}
function mf(e, t, n, r) {
    if (e.segments.length > n.length) {
        let o = e.segments.slice(0, n.length);
        return !(!ft(o, n) || t.hasChildren() || !No(o, n, r));
    } else if (e.segments.length === n.length) {
        if (!ft(e.segments, n) || !No(e.segments, n, r)) return !1;
        for (let o in t.children)
            if (!e.children[o] || !gf(e.children[o], t.children[o], r))
                return !1;
        return !0;
    } else {
        let o = n.slice(0, e.segments.length),
            i = n.slice(e.segments.length);
        return !ft(e.segments, o) || !No(e.segments, o, r) || !e.children[b]
            ? !1
            : mf(e.children[b], t, i, r);
    }
}
function No(e, t, n) {
    return t.every((r, o) => hf[n](e[o].parameters, r.parameters));
}
var Ve = class {
        root;
        queryParams;
        fragment;
        _queryParamMap;
        constructor(t = new O([], {}), n = {}, r = null) {
            ((this.root = t), (this.queryParams = n), (this.fragment = r));
        }
        get queryParamMap() {
            return (
                (this._queryParamMap ??= Jt(this.queryParams)),
                this._queryParamMap
            );
        }
        toString() {
            return Dy.serialize(this);
        }
    },
    O = class {
        segments;
        children;
        parent = null;
        constructor(t, n) {
            ((this.segments = t),
                (this.children = n),
                Object.values(n).forEach((r) => (r.parent = this)));
        }
        hasChildren() {
            return this.numberOfChildren > 0;
        }
        get numberOfChildren() {
            return Object.keys(this.children).length;
        }
        toString() {
            return Ao(this);
        }
    },
    dt = class {
        path;
        parameters;
        _parameterMap;
        constructor(t, n) {
            ((this.path = t), (this.parameters = n));
        }
        get parameterMap() {
            return (
                (this._parameterMap ??= Jt(this.parameters)),
                this._parameterMap
            );
        }
        toString() {
            return yf(this);
        }
    };
function vy(e, t) {
    return ft(e, t) && e.every((n, r) => Ne(n.parameters, t[r].parameters));
}
function ft(e, t) {
    return e.length !== t.length ? !1 : e.every((n, r) => n.path === t[r].path);
}
function yy(e, t) {
    let n = [];
    return (
        Object.entries(e.children).forEach(([r, o]) => {
            r === b && (n = n.concat(t(o, r)));
        }),
        Object.entries(e.children).forEach(([r, o]) => {
            r !== b && (n = n.concat(t(o, r)));
        }),
        n
    );
}
var Fa = (() => {
        class e {
            static ɵfac = function (r) {
                return new (r || e)();
            };
            static ɵprov = C({
                token: e,
                factory: () => new Un(),
                providedIn: "root",
            });
        }
        return e;
    })(),
    Un = class {
        parse(t) {
            let n = new fa(t);
            return new Ve(
                n.parseRootSegment(),
                n.parseQueryParams(),
                n.parseFragment(),
            );
        }
        serialize(t) {
            let n = `/${Ln(t.root, !0)}`,
                r = Ey(t.queryParams),
                o = typeof t.fragment == "string" ? `#${wy(t.fragment)}` : "";
            return `${n}${r}${o}`;
        }
    },
    Dy = new Un();
function Ao(e) {
    return e.segments.map((t) => yf(t)).join("/");
}
function Ln(e, t) {
    if (!e.hasChildren()) return Ao(e);
    if (t) {
        let n = e.children[b] ? Ln(e.children[b], !1) : "",
            r = [];
        return (
            Object.entries(e.children).forEach(([o, i]) => {
                o !== b && r.push(`${o}:${Ln(i, !1)}`);
            }),
            r.length > 0 ? `${n}(${r.join("//")})` : n
        );
    } else {
        let n = yy(e, (r, o) =>
            o === b ? [Ln(e.children[b], !1)] : [`${o}:${Ln(r, !1)}`],
        );
        return Object.keys(e.children).length === 1 && e.children[b] != null
            ? `${Ao(e)}/${n[0]}`
            : `${Ao(e)}/(${n.join("//")})`;
    }
}
function vf(e) {
    return encodeURIComponent(e)
        .replace(/%40/g, "@")
        .replace(/%3A/gi, ":")
        .replace(/%24/g, "$")
        .replace(/%2C/gi, ",");
}
function To(e) {
    return vf(e).replace(/%3B/gi, ";");
}
function wy(e) {
    return encodeURI(e);
}
function da(e) {
    return vf(e)
        .replace(/\(/g, "%28")
        .replace(/\)/g, "%29")
        .replace(/%26/gi, "&");
}
function Ro(e) {
    return decodeURIComponent(e);
}
function of(e) {
    return Ro(e.replace(/\+/g, "%20"));
}
function yf(e) {
    return `${da(e.path)}${Cy(e.parameters)}`;
}
function Cy(e) {
    return Object.entries(e)
        .map(([t, n]) => `;${da(t)}=${da(n)}`)
        .join("");
}
function Ey(e) {
    let t = Object.entries(e)
        .map(([n, r]) =>
            Array.isArray(r)
                ? r.map((o) => `${To(n)}=${To(o)}`).join("&")
                : `${To(n)}=${To(r)}`,
        )
        .filter((n) => n);
    return t.length ? `?${t.join("&")}` : "";
}
var Iy = /^[^\/()?;#]+/;
function ia(e) {
    let t = e.match(Iy);
    return t ? t[0] : "";
}
var by = /^[^\/()?;=#]+/;
function Sy(e) {
    let t = e.match(by);
    return t ? t[0] : "";
}
var My = /^[^=?&#]+/;
function _y(e) {
    let t = e.match(My);
    return t ? t[0] : "";
}
var Ty = /^[^&#]+/;
function xy(e) {
    let t = e.match(Ty);
    return t ? t[0] : "";
}
var fa = class {
    url;
    remaining;
    constructor(t) {
        ((this.url = t), (this.remaining = t));
    }
    parseRootSegment() {
        return (
            this.consumeOptional("/"),
            this.remaining === "" ||
            this.peekStartsWith("?") ||
            this.peekStartsWith("#")
                ? new O([], {})
                : new O([], this.parseChildren())
        );
    }
    parseQueryParams() {
        let t = {};
        if (this.consumeOptional("?"))
            do this.parseQueryParam(t);
            while (this.consumeOptional("&"));
        return t;
    }
    parseFragment() {
        return this.consumeOptional("#")
            ? decodeURIComponent(this.remaining)
            : null;
    }
    parseChildren() {
        if (this.remaining === "") return {};
        this.consumeOptional("/");
        let t = [];
        for (
            this.peekStartsWith("(") || t.push(this.parseSegment());
            this.peekStartsWith("/") &&
            !this.peekStartsWith("//") &&
            !this.peekStartsWith("/(");

        )
            (this.capture("/"), t.push(this.parseSegment()));
        let n = {};
        this.peekStartsWith("/(") &&
            (this.capture("/"), (n = this.parseParens(!0)));
        let r = {};
        return (
            this.peekStartsWith("(") && (r = this.parseParens(!1)),
            (t.length > 0 || Object.keys(n).length > 0) && (r[b] = new O(t, n)),
            r
        );
    }
    parseSegment() {
        let t = ia(this.remaining);
        if (t === "" && this.peekStartsWith(";")) throw new v(4009, !1);
        return (this.capture(t), new dt(Ro(t), this.parseMatrixParams()));
    }
    parseMatrixParams() {
        let t = {};
        for (; this.consumeOptional(";"); ) this.parseParam(t);
        return t;
    }
    parseParam(t) {
        let n = Sy(this.remaining);
        if (!n) return;
        this.capture(n);
        let r = "";
        if (this.consumeOptional("=")) {
            let o = ia(this.remaining);
            o && ((r = o), this.capture(r));
        }
        t[Ro(n)] = Ro(r);
    }
    parseQueryParam(t) {
        let n = _y(this.remaining);
        if (!n) return;
        this.capture(n);
        let r = "";
        if (this.consumeOptional("=")) {
            let s = xy(this.remaining);
            s && ((r = s), this.capture(r));
        }
        let o = of(n),
            i = of(r);
        if (t.hasOwnProperty(o)) {
            let s = t[o];
            (Array.isArray(s) || ((s = [s]), (t[o] = s)), s.push(i));
        } else t[o] = i;
    }
    parseParens(t) {
        let n = {};
        for (
            this.capture("(");
            !this.consumeOptional(")") && this.remaining.length > 0;

        ) {
            let r = ia(this.remaining),
                o = this.remaining[r.length];
            if (o !== "/" && o !== ")" && o !== ";") throw new v(4010, !1);
            let i;
            r.indexOf(":") > -1
                ? ((i = r.slice(0, r.indexOf(":"))),
                  this.capture(i),
                  this.capture(":"))
                : t && (i = b);
            let s = this.parseChildren();
            ((n[i] = Object.keys(s).length === 1 ? s[b] : new O([], s)),
                this.consumeOptional("//"));
        }
        return n;
    }
    peekStartsWith(t) {
        return this.remaining.startsWith(t);
    }
    consumeOptional(t) {
        return this.peekStartsWith(t)
            ? ((this.remaining = this.remaining.substring(t.length)), !0)
            : !1;
    }
    capture(t) {
        if (!this.consumeOptional(t)) throw new v(4011, !1);
    }
};
function Df(e) {
    return e.segments.length > 0 ? new O([], { [b]: e }) : e;
}
function wf(e) {
    let t = {};
    for (let [r, o] of Object.entries(e.children)) {
        let i = wf(o);
        if (r === b && i.segments.length === 0 && i.hasChildren())
            for (let [s, c] of Object.entries(i.children)) t[s] = c;
        else (i.segments.length > 0 || i.hasChildren()) && (t[r] = i);
    }
    let n = new O(e.segments, t);
    return Ny(n);
}
function Ny(e) {
    if (e.numberOfChildren === 1 && e.children[b]) {
        let t = e.children[b];
        return new O(e.segments.concat(t.segments), t.children);
    }
    return e;
}
function Hn(e) {
    return e instanceof Ve;
}
function Ay(e, t, n = null, r = null) {
    let o = Cf(e);
    return Ef(o, t, n, r);
}
function Cf(e) {
    let t;
    function n(i) {
        let s = {};
        for (let a of i.children) {
            let u = n(a);
            s[a.outlet] = u;
        }
        let c = new O(i.url, s);
        return (i === e && (t = c), c);
    }
    let r = n(e.root),
        o = Df(r);
    return t ?? o;
}
function Ef(e, t, n, r) {
    let o = e;
    for (; o.parent; ) o = o.parent;
    if (t.length === 0) return sa(o, o, o, n, r);
    let i = Ry(t);
    if (i.toRoot()) return sa(o, o, new O([], {}), n, r);
    let s = Oy(i, o, e),
        c = s.processChildren
            ? Vn(s.segmentGroup, s.index, i.commands)
            : bf(s.segmentGroup, s.index, i.commands);
    return sa(o, s.segmentGroup, c, n, r);
}
function Oo(e) {
    return typeof e == "object" && e != null && !e.outlets && !e.segmentPath;
}
function zn(e) {
    return typeof e == "object" && e != null && e.outlets;
}
function sa(e, t, n, r, o) {
    let i = {};
    r &&
        Object.entries(r).forEach(([a, u]) => {
            i[a] = Array.isArray(u) ? u.map((l) => `${l}`) : `${u}`;
        });
    let s;
    e === t ? (s = n) : (s = If(e, t, n));
    let c = Df(wf(s));
    return new Ve(c, i, o);
}
function If(e, t, n) {
    let r = {};
    return (
        Object.entries(e.children).forEach(([o, i]) => {
            i === t ? (r[o] = n) : (r[o] = If(i, t, n));
        }),
        new O(e.segments, r)
    );
}
var ko = class {
    isAbsolute;
    numberOfDoubleDots;
    commands;
    constructor(t, n, r) {
        if (
            ((this.isAbsolute = t),
            (this.numberOfDoubleDots = n),
            (this.commands = r),
            t && r.length > 0 && Oo(r[0]))
        )
            throw new v(4003, !1);
        let o = r.find(zn);
        if (o && o !== ff(r)) throw new v(4004, !1);
    }
    toRoot() {
        return (
            this.isAbsolute &&
            this.commands.length === 1 &&
            this.commands[0] == "/"
        );
    }
};
function Ry(e) {
    if (typeof e[0] == "string" && e.length === 1 && e[0] === "/")
        return new ko(!0, 0, e);
    let t = 0,
        n = !1,
        r = e.reduce((o, i, s) => {
            if (typeof i == "object" && i != null) {
                if (i.outlets) {
                    let c = {};
                    return (
                        Object.entries(i.outlets).forEach(([a, u]) => {
                            c[a] = typeof u == "string" ? u.split("/") : u;
                        }),
                        [...o, { outlets: c }]
                    );
                }
                if (i.segmentPath) return [...o, i.segmentPath];
            }
            return typeof i != "string"
                ? [...o, i]
                : s === 0
                  ? (i.split("/").forEach((c, a) => {
                        (a == 0 && c === ".") ||
                            (a == 0 && c === ""
                                ? (n = !0)
                                : c === ".."
                                  ? t++
                                  : c != "" && o.push(c));
                    }),
                    o)
                  : [...o, i];
        }, []);
    return new ko(n, t, r);
}
var Qt = class {
    segmentGroup;
    processChildren;
    index;
    constructor(t, n, r) {
        ((this.segmentGroup = t), (this.processChildren = n), (this.index = r));
    }
};
function Oy(e, t, n) {
    if (e.isAbsolute) return new Qt(t, !0, 0);
    if (!n) return new Qt(t, !1, NaN);
    if (n.parent === null) return new Qt(n, !0, 0);
    let r = Oo(e.commands[0]) ? 0 : 1,
        o = n.segments.length - 1 + r;
    return ky(n, o, e.numberOfDoubleDots);
}
function ky(e, t, n) {
    let r = e,
        o = t,
        i = n;
    for (; i > o; ) {
        if (((i -= o), (r = r.parent), !r)) throw new v(4005, !1);
        o = r.segments.length;
    }
    return new Qt(r, !1, o - i);
}
function Py(e) {
    return zn(e[0]) ? e[0].outlets : { [b]: e };
}
function bf(e, t, n) {
    if (((e ??= new O([], {})), e.segments.length === 0 && e.hasChildren()))
        return Vn(e, t, n);
    let r = Fy(e, t, n),
        o = n.slice(r.commandIndex);
    if (r.match && r.pathIndex < e.segments.length) {
        let i = new O(e.segments.slice(0, r.pathIndex), {});
        return (
            (i.children[b] = new O(e.segments.slice(r.pathIndex), e.children)),
            Vn(i, 0, o)
        );
    } else
        return r.match && o.length === 0
            ? new O(e.segments, {})
            : r.match && !e.hasChildren()
              ? ha(e, t, n)
              : r.match
                ? Vn(e, 0, o)
                : ha(e, t, n);
}
function Vn(e, t, n) {
    if (n.length === 0) return new O(e.segments, {});
    {
        let r = Py(n),
            o = {};
        if (
            Object.keys(r).some((i) => i !== b) &&
            e.children[b] &&
            e.numberOfChildren === 1 &&
            e.children[b].segments.length === 0
        ) {
            let i = Vn(e.children[b], t, n);
            return new O(e.segments, i.children);
        }
        return (
            Object.entries(r).forEach(([i, s]) => {
                (typeof s == "string" && (s = [s]),
                    s !== null && (o[i] = bf(e.children[i], t, s)));
            }),
            Object.entries(e.children).forEach(([i, s]) => {
                r[i] === void 0 && (o[i] = s);
            }),
            new O(e.segments, o)
        );
    }
}
function Fy(e, t, n) {
    let r = 0,
        o = t,
        i = { match: !1, pathIndex: 0, commandIndex: 0 };
    for (; o < e.segments.length; ) {
        if (r >= n.length) return i;
        let s = e.segments[o],
            c = n[r];
        if (zn(c)) break;
        let a = `${c}`,
            u = r < n.length - 1 ? n[r + 1] : null;
        if (o > 0 && a === void 0) break;
        if (a && u && typeof u == "object" && u.outlets === void 0) {
            if (!af(a, u, s)) return i;
            r += 2;
        } else {
            if (!af(a, {}, s)) return i;
            r++;
        }
        o++;
    }
    return { match: !0, pathIndex: o, commandIndex: r };
}
function ha(e, t, n) {
    let r = e.segments.slice(0, t),
        o = 0;
    for (; o < n.length; ) {
        let i = n[o];
        if (zn(i)) {
            let a = Ly(i.outlets);
            return new O(r, a);
        }
        if (o === 0 && Oo(n[0])) {
            let a = e.segments[t];
            (r.push(new dt(a.path, sf(n[0]))), o++);
            continue;
        }
        let s = zn(i) ? i.outlets[b] : `${i}`,
            c = o < n.length - 1 ? n[o + 1] : null;
        s && c && Oo(c)
            ? (r.push(new dt(s, sf(c))), (o += 2))
            : (r.push(new dt(s, {})), o++);
    }
    return new O(r, {});
}
function Ly(e) {
    let t = {};
    return (
        Object.entries(e).forEach(([n, r]) => {
            (typeof r == "string" && (r = [r]),
                r !== null && (t[n] = ha(new O([], {}), 0, r)));
        }),
        t
    );
}
function sf(e) {
    let t = {};
    return (Object.entries(e).forEach(([n, r]) => (t[n] = `${r}`)), t);
}
function af(e, t, n) {
    return e == n.path && Ne(t, n.parameters);
}
var Bn = "imperative",
    Y = (function (e) {
        return (
            (e[(e.NavigationStart = 0)] = "NavigationStart"),
            (e[(e.NavigationEnd = 1)] = "NavigationEnd"),
            (e[(e.NavigationCancel = 2)] = "NavigationCancel"),
            (e[(e.NavigationError = 3)] = "NavigationError"),
            (e[(e.RoutesRecognized = 4)] = "RoutesRecognized"),
            (e[(e.ResolveStart = 5)] = "ResolveStart"),
            (e[(e.ResolveEnd = 6)] = "ResolveEnd"),
            (e[(e.GuardsCheckStart = 7)] = "GuardsCheckStart"),
            (e[(e.GuardsCheckEnd = 8)] = "GuardsCheckEnd"),
            (e[(e.RouteConfigLoadStart = 9)] = "RouteConfigLoadStart"),
            (e[(e.RouteConfigLoadEnd = 10)] = "RouteConfigLoadEnd"),
            (e[(e.ChildActivationStart = 11)] = "ChildActivationStart"),
            (e[(e.ChildActivationEnd = 12)] = "ChildActivationEnd"),
            (e[(e.ActivationStart = 13)] = "ActivationStart"),
            (e[(e.ActivationEnd = 14)] = "ActivationEnd"),
            (e[(e.Scroll = 15)] = "Scroll"),
            (e[(e.NavigationSkipped = 16)] = "NavigationSkipped"),
            e
        );
    })(Y || {}),
    me = class {
        id;
        url;
        constructor(t, n) {
            ((this.id = t), (this.url = n));
        }
    },
    qn = class extends me {
        type = Y.NavigationStart;
        navigationTrigger;
        restoredState;
        constructor(t, n, r = "imperative", o = null) {
            (super(t, n),
                (this.navigationTrigger = r),
                (this.restoredState = o));
        }
        toString() {
            return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
        }
    },
    ht = class extends me {
        urlAfterRedirects;
        type = Y.NavigationEnd;
        constructor(t, n, r) {
            (super(t, n), (this.urlAfterRedirects = r));
        }
        toString() {
            return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
        }
    },
    de = (function (e) {
        return (
            (e[(e.Redirect = 0)] = "Redirect"),
            (e[(e.SupersededByNewNavigation = 1)] =
                "SupersededByNewNavigation"),
            (e[(e.NoDataFromResolver = 2)] = "NoDataFromResolver"),
            (e[(e.GuardRejected = 3)] = "GuardRejected"),
            e
        );
    })(de || {}),
    pa = (function (e) {
        return (
            (e[(e.IgnoredSameUrlNavigation = 0)] = "IgnoredSameUrlNavigation"),
            (e[(e.IgnoredByUrlHandlingStrategy = 1)] =
                "IgnoredByUrlHandlingStrategy"),
            e
        );
    })(pa || {}),
    je = class extends me {
        reason;
        code;
        type = Y.NavigationCancel;
        constructor(t, n, r, o) {
            (super(t, n), (this.reason = r), (this.code = o));
        }
        toString() {
            return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
        }
    },
    pt = class extends me {
        reason;
        code;
        type = Y.NavigationSkipped;
        constructor(t, n, r, o) {
            (super(t, n), (this.reason = r), (this.code = o));
        }
    },
    Gn = class extends me {
        error;
        target;
        type = Y.NavigationError;
        constructor(t, n, r, o) {
            (super(t, n), (this.error = r), (this.target = o));
        }
        toString() {
            return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
        }
    },
    Po = class extends me {
        urlAfterRedirects;
        state;
        type = Y.RoutesRecognized;
        constructor(t, n, r, o) {
            (super(t, n), (this.urlAfterRedirects = r), (this.state = o));
        }
        toString() {
            return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
    },
    ga = class extends me {
        urlAfterRedirects;
        state;
        type = Y.GuardsCheckStart;
        constructor(t, n, r, o) {
            (super(t, n), (this.urlAfterRedirects = r), (this.state = o));
        }
        toString() {
            return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
    },
    ma = class extends me {
        urlAfterRedirects;
        state;
        shouldActivate;
        type = Y.GuardsCheckEnd;
        constructor(t, n, r, o, i) {
            (super(t, n),
                (this.urlAfterRedirects = r),
                (this.state = o),
                (this.shouldActivate = i));
        }
        toString() {
            return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
        }
    },
    va = class extends me {
        urlAfterRedirects;
        state;
        type = Y.ResolveStart;
        constructor(t, n, r, o) {
            (super(t, n), (this.urlAfterRedirects = r), (this.state = o));
        }
        toString() {
            return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
    },
    ya = class extends me {
        urlAfterRedirects;
        state;
        type = Y.ResolveEnd;
        constructor(t, n, r, o) {
            (super(t, n), (this.urlAfterRedirects = r), (this.state = o));
        }
        toString() {
            return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
    },
    Da = class {
        route;
        type = Y.RouteConfigLoadStart;
        constructor(t) {
            this.route = t;
        }
        toString() {
            return `RouteConfigLoadStart(path: ${this.route.path})`;
        }
    },
    wa = class {
        route;
        type = Y.RouteConfigLoadEnd;
        constructor(t) {
            this.route = t;
        }
        toString() {
            return `RouteConfigLoadEnd(path: ${this.route.path})`;
        }
    },
    Ca = class {
        snapshot;
        type = Y.ChildActivationStart;
        constructor(t) {
            this.snapshot = t;
        }
        toString() {
            return `ChildActivationStart(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
        }
    },
    Ea = class {
        snapshot;
        type = Y.ChildActivationEnd;
        constructor(t) {
            this.snapshot = t;
        }
        toString() {
            return `ChildActivationEnd(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
        }
    },
    Ia = class {
        snapshot;
        type = Y.ActivationStart;
        constructor(t) {
            this.snapshot = t;
        }
        toString() {
            return `ActivationStart(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
        }
    },
    ba = class {
        snapshot;
        type = Y.ActivationEnd;
        constructor(t) {
            this.snapshot = t;
        }
        toString() {
            return `ActivationEnd(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
        }
    };
var Wn = class {},
    Xt = class {
        url;
        navigationBehaviorOptions;
        constructor(t, n) {
            ((this.url = t), (this.navigationBehaviorOptions = n));
        }
    };
function jy(e, t) {
    return (
        e.providers &&
            !e._injector &&
            (e._injector = Hs(e.providers, t, `Route: ${e.path}`)),
        e._injector ?? t
    );
}
function Se(e) {
    return e.outlet || b;
}
function Vy(e, t) {
    let n = e.filter((r) => Se(r) === t);
    return (n.push(...e.filter((r) => Se(r) !== t)), n);
}
function Xn(e) {
    if (!e) return null;
    if (e.routeConfig?._injector) return e.routeConfig._injector;
    for (let t = e.parent; t; t = t.parent) {
        let n = t.routeConfig;
        if (n?._loadedInjector) return n._loadedInjector;
        if (n?._injector) return n._injector;
    }
    return null;
}
var Sa = class {
        rootInjector;
        outlet = null;
        route = null;
        children;
        attachRef = null;
        get injector() {
            return Xn(this.route?.snapshot) ?? this.rootInjector;
        }
        constructor(t) {
            ((this.rootInjector = t),
                (this.children = new Uo(this.rootInjector)));
        }
    },
    Uo = (() => {
        class e {
            rootInjector;
            contexts = new Map();
            constructor(n) {
                this.rootInjector = n;
            }
            onChildOutletCreated(n, r) {
                let o = this.getOrCreateContext(n);
                ((o.outlet = r), this.contexts.set(n, o));
            }
            onChildOutletDestroyed(n) {
                let r = this.getContext(n);
                r && ((r.outlet = null), (r.attachRef = null));
            }
            onOutletDeactivated() {
                let n = this.contexts;
                return ((this.contexts = new Map()), n);
            }
            onOutletReAttached(n) {
                this.contexts = n;
            }
            getOrCreateContext(n) {
                let r = this.getContext(n);
                return (
                    r ||
                        ((r = new Sa(this.rootInjector)),
                        this.contexts.set(n, r)),
                    r
                );
            }
            getContext(n) {
                return this.contexts.get(n) || null;
            }
            static ɵfac = function (r) {
                return new (r || e)(M(pe));
            };
            static ɵprov = C({ token: e, factory: e.ɵfac, providedIn: "root" });
        }
        return e;
    })(),
    Fo = class {
        _root;
        constructor(t) {
            this._root = t;
        }
        get root() {
            return this._root.value;
        }
        parent(t) {
            let n = this.pathFromRoot(t);
            return n.length > 1 ? n[n.length - 2] : null;
        }
        children(t) {
            let n = Ma(t, this._root);
            return n ? n.children.map((r) => r.value) : [];
        }
        firstChild(t) {
            let n = Ma(t, this._root);
            return n && n.children.length > 0 ? n.children[0].value : null;
        }
        siblings(t) {
            let n = _a(t, this._root);
            return n.length < 2
                ? []
                : n[n.length - 2].children
                      .map((o) => o.value)
                      .filter((o) => o !== t);
        }
        pathFromRoot(t) {
            return _a(t, this._root).map((n) => n.value);
        }
    };
function Ma(e, t) {
    if (e === t.value) return t;
    for (let n of t.children) {
        let r = Ma(e, n);
        if (r) return r;
    }
    return null;
}
function _a(e, t) {
    if (e === t.value) return [t];
    for (let n of t.children) {
        let r = _a(e, n);
        if (r.length) return (r.unshift(t), r);
    }
    return [];
}
var le = class {
    value;
    children;
    constructor(t, n) {
        ((this.value = t), (this.children = n));
    }
    toString() {
        return `TreeNode(${this.value})`;
    }
};
function Zt(e) {
    let t = {};
    return (e && e.children.forEach((n) => (t[n.value.outlet] = n)), t);
}
var Lo = class extends Fo {
    snapshot;
    constructor(t, n) {
        (super(t), (this.snapshot = n), La(this, t));
    }
    toString() {
        return this.snapshot.toString();
    }
};
function Sf(e) {
    let t = By(e),
        n = new W([new dt("", {})]),
        r = new W({}),
        o = new W({}),
        i = new W({}),
        s = new W(""),
        c = new en(n, r, i, s, o, b, e, t.root);
    return ((c.snapshot = t.root), new Lo(new le(c, []), t));
}
function By(e) {
    let t = {},
        n = {},
        r = {},
        o = "",
        i = new Yt([], t, r, o, n, b, e, null, {});
    return new Vo("", new le(i, []));
}
var en = class {
    urlSubject;
    paramsSubject;
    queryParamsSubject;
    fragmentSubject;
    dataSubject;
    outlet;
    component;
    snapshot;
    _futureSnapshot;
    _routerState;
    _paramMap;
    _queryParamMap;
    title;
    url;
    params;
    queryParams;
    fragment;
    data;
    constructor(t, n, r, o, i, s, c, a) {
        ((this.urlSubject = t),
            (this.paramsSubject = n),
            (this.queryParamsSubject = r),
            (this.fragmentSubject = o),
            (this.dataSubject = i),
            (this.outlet = s),
            (this.component = c),
            (this._futureSnapshot = a),
            (this.title = this.dataSubject?.pipe(N((u) => u[Jn])) ?? I(void 0)),
            (this.url = t),
            (this.params = n),
            (this.queryParams = r),
            (this.fragment = o),
            (this.data = i));
    }
    get routeConfig() {
        return this._futureSnapshot.routeConfig;
    }
    get root() {
        return this._routerState.root;
    }
    get parent() {
        return this._routerState.parent(this);
    }
    get firstChild() {
        return this._routerState.firstChild(this);
    }
    get children() {
        return this._routerState.children(this);
    }
    get pathFromRoot() {
        return this._routerState.pathFromRoot(this);
    }
    get paramMap() {
        return (
            (this._paramMap ??= this.params.pipe(N((t) => Jt(t)))),
            this._paramMap
        );
    }
    get queryParamMap() {
        return (
            (this._queryParamMap ??= this.queryParams.pipe(N((t) => Jt(t)))),
            this._queryParamMap
        );
    }
    toString() {
        return this.snapshot
            ? this.snapshot.toString()
            : `Future(${this._futureSnapshot})`;
    }
};
function jo(e, t, n = "emptyOnly") {
    let r,
        { routeConfig: o } = e;
    return (
        t !== null &&
        (n === "always" ||
            o?.path === "" ||
            (!t.component && !t.routeConfig?.loadComponent))
            ? (r = {
                  params: m(m({}, t.params), e.params),
                  data: m(m({}, t.data), e.data),
                  resolve: m(
                      m(m(m({}, e.data), t.data), o?.data),
                      e._resolvedData,
                  ),
              })
            : (r = {
                  params: m({}, e.params),
                  data: m({}, e.data),
                  resolve: m(m({}, e.data), e._resolvedData ?? {}),
              }),
        o && _f(o) && (r.resolve[Jn] = o.title),
        r
    );
}
var Yt = class {
        url;
        params;
        queryParams;
        fragment;
        data;
        outlet;
        component;
        routeConfig;
        _resolve;
        _resolvedData;
        _routerState;
        _paramMap;
        _queryParamMap;
        get title() {
            return this.data?.[Jn];
        }
        constructor(t, n, r, o, i, s, c, a, u) {
            ((this.url = t),
                (this.params = n),
                (this.queryParams = r),
                (this.fragment = o),
                (this.data = i),
                (this.outlet = s),
                (this.component = c),
                (this.routeConfig = a),
                (this._resolve = u));
        }
        get root() {
            return this._routerState.root;
        }
        get parent() {
            return this._routerState.parent(this);
        }
        get firstChild() {
            return this._routerState.firstChild(this);
        }
        get children() {
            return this._routerState.children(this);
        }
        get pathFromRoot() {
            return this._routerState.pathFromRoot(this);
        }
        get paramMap() {
            return ((this._paramMap ??= Jt(this.params)), this._paramMap);
        }
        get queryParamMap() {
            return (
                (this._queryParamMap ??= Jt(this.queryParams)),
                this._queryParamMap
            );
        }
        toString() {
            let t = this.url.map((r) => r.toString()).join("/"),
                n = this.routeConfig ? this.routeConfig.path : "";
            return `Route(url:'${t}', path:'${n}')`;
        }
    },
    Vo = class extends Fo {
        url;
        constructor(t, n) {
            (super(n), (this.url = t), La(this, n));
        }
        toString() {
            return Mf(this._root);
        }
    };
function La(e, t) {
    ((t.value._routerState = e), t.children.forEach((n) => La(e, n)));
}
function Mf(e) {
    let t =
        e.children.length > 0 ? ` { ${e.children.map(Mf).join(", ")} } ` : "";
    return `${e.value}${t}`;
}
function aa(e) {
    if (e.snapshot) {
        let t = e.snapshot,
            n = e._futureSnapshot;
        ((e.snapshot = n),
            Ne(t.queryParams, n.queryParams) ||
                e.queryParamsSubject.next(n.queryParams),
            t.fragment !== n.fragment && e.fragmentSubject.next(n.fragment),
            Ne(t.params, n.params) || e.paramsSubject.next(n.params),
            hy(t.url, n.url) || e.urlSubject.next(n.url),
            Ne(t.data, n.data) || e.dataSubject.next(n.data));
    } else
        ((e.snapshot = e._futureSnapshot),
            e.dataSubject.next(e._futureSnapshot.data));
}
function Ta(e, t) {
    let n = Ne(e.params, t.params) && vy(e.url, t.url),
        r = !e.parent != !t.parent;
    return n && !r && (!e.parent || Ta(e.parent, t.parent));
}
function _f(e) {
    return typeof e.title == "string" || e.title === null;
}
var $y = new w(""),
    ja = (() => {
        class e {
            activated = null;
            get activatedComponentRef() {
                return this.activated;
            }
            _activatedRoute = null;
            name = b;
            activateEvents = new se();
            deactivateEvents = new se();
            attachEvents = new se();
            detachEvents = new se();
            routerOutletData = Sl(void 0);
            parentContexts = p(Uo);
            location = p(vo);
            changeDetector = p(Rn);
            inputBinder = p(Va, { optional: !0 });
            supportsBindingToComponentInputs = !0;
            ngOnChanges(n) {
                if (n.name) {
                    let { firstChange: r, previousValue: o } = n.name;
                    if (r) return;
                    (this.isTrackedInParentContexts(o) &&
                        (this.deactivate(),
                        this.parentContexts.onChildOutletDestroyed(o)),
                        this.initializeOutletWithName());
                }
            }
            ngOnDestroy() {
                (this.isTrackedInParentContexts(this.name) &&
                    this.parentContexts.onChildOutletDestroyed(this.name),
                    this.inputBinder?.unsubscribeFromRouteData(this));
            }
            isTrackedInParentContexts(n) {
                return this.parentContexts.getContext(n)?.outlet === this;
            }
            ngOnInit() {
                this.initializeOutletWithName();
            }
            initializeOutletWithName() {
                if (
                    (this.parentContexts.onChildOutletCreated(this.name, this),
                    this.activated)
                )
                    return;
                let n = this.parentContexts.getContext(this.name);
                n?.route &&
                    (n.attachRef
                        ? this.attach(n.attachRef, n.route)
                        : this.activateWith(n.route, n.injector));
            }
            get isActivated() {
                return !!this.activated;
            }
            get component() {
                if (!this.activated) throw new v(4012, !1);
                return this.activated.instance;
            }
            get activatedRoute() {
                if (!this.activated) throw new v(4012, !1);
                return this._activatedRoute;
            }
            get activatedRouteData() {
                return this._activatedRoute
                    ? this._activatedRoute.snapshot.data
                    : {};
            }
            detach() {
                if (!this.activated) throw new v(4012, !1);
                this.location.detach();
                let n = this.activated;
                return (
                    (this.activated = null),
                    (this._activatedRoute = null),
                    this.detachEvents.emit(n.instance),
                    n
                );
            }
            attach(n, r) {
                ((this.activated = n),
                    (this._activatedRoute = r),
                    this.location.insert(n.hostView),
                    this.inputBinder?.bindActivatedRouteToOutletComponent(this),
                    this.attachEvents.emit(n.instance));
            }
            deactivate() {
                if (this.activated) {
                    let n = this.component;
                    (this.activated.destroy(),
                        (this.activated = null),
                        (this._activatedRoute = null),
                        this.deactivateEvents.emit(n));
                }
            }
            activateWith(n, r) {
                if (this.isActivated) throw new v(4013, !1);
                this._activatedRoute = n;
                let o = this.location,
                    s = n.snapshot.component,
                    c = this.parentContexts.getOrCreateContext(
                        this.name,
                    ).children,
                    a = new xa(n, c, o.injector, this.routerOutletData);
                ((this.activated = o.createComponent(s, {
                    index: o.length,
                    injector: a,
                    environmentInjector: r,
                })),
                    this.changeDetector.markForCheck(),
                    this.inputBinder?.bindActivatedRouteToOutletComponent(this),
                    this.activateEvents.emit(this.activated.instance));
            }
            static ɵfac = function (r) {
                return new (r || e)();
            };
            static ɵdir = zs({
                type: e,
                selectors: [["router-outlet"]],
                inputs: {
                    name: "name",
                    routerOutletData: [1, "routerOutletData"],
                },
                outputs: {
                    activateEvents: "activate",
                    deactivateEvents: "deactivate",
                    attachEvents: "attach",
                    detachEvents: "detach",
                },
                exportAs: ["outlet"],
                features: [us],
            });
        }
        return e;
    })(),
    xa = class e {
        route;
        childContexts;
        parent;
        outletData;
        __ngOutletInjector(t) {
            return new e(this.route, this.childContexts, t, this.outletData);
        }
        constructor(t, n, r, o) {
            ((this.route = t),
                (this.childContexts = n),
                (this.parent = r),
                (this.outletData = o));
        }
        get(t, n) {
            return t === en
                ? this.route
                : t === Uo
                  ? this.childContexts
                  : t === $y
                    ? this.outletData
                    : this.parent.get(t, n);
        }
    },
    Va = new w("");
function Uy(e, t, n) {
    let r = Zn(e, t._root, n ? n._root : void 0);
    return new Lo(r, t);
}
function Zn(e, t, n) {
    if (n && e.shouldReuseRoute(t.value, n.value.snapshot)) {
        let r = n.value;
        r._futureSnapshot = t.value;
        let o = Hy(e, t, n);
        return new le(r, o);
    } else {
        if (e.shouldAttach(t.value)) {
            let i = e.retrieve(t.value);
            if (i !== null) {
                let s = i.route;
                return (
                    (s.value._futureSnapshot = t.value),
                    (s.children = t.children.map((c) => Zn(e, c))),
                    s
                );
            }
        }
        let r = zy(t.value),
            o = t.children.map((i) => Zn(e, i));
        return new le(r, o);
    }
}
function Hy(e, t, n) {
    return t.children.map((r) => {
        for (let o of n.children)
            if (e.shouldReuseRoute(r.value, o.value.snapshot))
                return Zn(e, r, o);
        return Zn(e, r);
    });
}
function zy(e) {
    return new en(
        new W(e.url),
        new W(e.params),
        new W(e.queryParams),
        new W(e.fragment),
        new W(e.data),
        e.outlet,
        e.component,
        e,
    );
}
var Qn = class {
        redirectTo;
        navigationBehaviorOptions;
        constructor(t, n) {
            ((this.redirectTo = t), (this.navigationBehaviorOptions = n));
        }
    },
    Tf = "ngNavigationCancelingError";
function Bo(e, t) {
    let { redirectTo: n, navigationBehaviorOptions: r } = Hn(t)
            ? { redirectTo: t, navigationBehaviorOptions: void 0 }
            : t,
        o = xf(!1, de.Redirect);
    return ((o.url = n), (o.navigationBehaviorOptions = r), o);
}
function xf(e, t) {
    let n = new Error(`NavigationCancelingError: ${e || ""}`);
    return ((n[Tf] = !0), (n.cancellationCode = t), n);
}
function qy(e) {
    return Nf(e) && Hn(e.url);
}
function Nf(e) {
    return !!e && e[Tf];
}
var Gy = (e, t, n, r) =>
        N(
            (o) => (
                new Na(
                    t,
                    o.targetRouterState,
                    o.currentRouterState,
                    n,
                    r,
                ).activate(e),
                o
            ),
        ),
    Na = class {
        routeReuseStrategy;
        futureState;
        currState;
        forwardEvent;
        inputBindingEnabled;
        constructor(t, n, r, o, i) {
            ((this.routeReuseStrategy = t),
                (this.futureState = n),
                (this.currState = r),
                (this.forwardEvent = o),
                (this.inputBindingEnabled = i));
        }
        activate(t) {
            let n = this.futureState._root,
                r = this.currState ? this.currState._root : null;
            (this.deactivateChildRoutes(n, r, t),
                aa(this.futureState.root),
                this.activateChildRoutes(n, r, t));
        }
        deactivateChildRoutes(t, n, r) {
            let o = Zt(n);
            (t.children.forEach((i) => {
                let s = i.value.outlet;
                (this.deactivateRoutes(i, o[s], r), delete o[s]);
            }),
                Object.values(o).forEach((i) => {
                    this.deactivateRouteAndItsChildren(i, r);
                }));
        }
        deactivateRoutes(t, n, r) {
            let o = t.value,
                i = n ? n.value : null;
            if (o === i)
                if (o.component) {
                    let s = r.getContext(o.outlet);
                    s && this.deactivateChildRoutes(t, n, s.children);
                } else this.deactivateChildRoutes(t, n, r);
            else i && this.deactivateRouteAndItsChildren(n, r);
        }
        deactivateRouteAndItsChildren(t, n) {
            t.value.component &&
            this.routeReuseStrategy.shouldDetach(t.value.snapshot)
                ? this.detachAndStoreRouteSubtree(t, n)
                : this.deactivateRouteAndOutlet(t, n);
        }
        detachAndStoreRouteSubtree(t, n) {
            let r = n.getContext(t.value.outlet),
                o = r && t.value.component ? r.children : n,
                i = Zt(t);
            for (let s of Object.values(i))
                this.deactivateRouteAndItsChildren(s, o);
            if (r && r.outlet) {
                let s = r.outlet.detach(),
                    c = r.children.onOutletDeactivated();
                this.routeReuseStrategy.store(t.value.snapshot, {
                    componentRef: s,
                    route: t,
                    contexts: c,
                });
            }
        }
        deactivateRouteAndOutlet(t, n) {
            let r = n.getContext(t.value.outlet),
                o = r && t.value.component ? r.children : n,
                i = Zt(t);
            for (let s of Object.values(i))
                this.deactivateRouteAndItsChildren(s, o);
            r &&
                (r.outlet &&
                    (r.outlet.deactivate(), r.children.onOutletDeactivated()),
                (r.attachRef = null),
                (r.route = null));
        }
        activateChildRoutes(t, n, r) {
            let o = Zt(n);
            (t.children.forEach((i) => {
                (this.activateRoutes(i, o[i.value.outlet], r),
                    this.forwardEvent(new ba(i.value.snapshot)));
            }),
                t.children.length &&
                    this.forwardEvent(new Ea(t.value.snapshot)));
        }
        activateRoutes(t, n, r) {
            let o = t.value,
                i = n ? n.value : null;
            if ((aa(o), o === i))
                if (o.component) {
                    let s = r.getOrCreateContext(o.outlet);
                    this.activateChildRoutes(t, n, s.children);
                } else this.activateChildRoutes(t, n, r);
            else if (o.component) {
                let s = r.getOrCreateContext(o.outlet);
                if (this.routeReuseStrategy.shouldAttach(o.snapshot)) {
                    let c = this.routeReuseStrategy.retrieve(o.snapshot);
                    (this.routeReuseStrategy.store(o.snapshot, null),
                        s.children.onOutletReAttached(c.contexts),
                        (s.attachRef = c.componentRef),
                        (s.route = c.route.value),
                        s.outlet &&
                            s.outlet.attach(c.componentRef, c.route.value),
                        aa(c.route.value),
                        this.activateChildRoutes(t, null, s.children));
                } else
                    ((s.attachRef = null),
                        (s.route = o),
                        s.outlet && s.outlet.activateWith(o, s.injector),
                        this.activateChildRoutes(t, null, s.children));
            } else this.activateChildRoutes(t, null, r);
        }
    },
    $o = class {
        path;
        route;
        constructor(t) {
            ((this.path = t), (this.route = this.path[this.path.length - 1]));
        }
    },
    Kt = class {
        component;
        route;
        constructor(t, n) {
            ((this.component = t), (this.route = n));
        }
    };
function Wy(e, t, n) {
    let r = e._root,
        o = t ? t._root : null;
    return jn(r, o, n, [r.value]);
}
function Zy(e) {
    let t = e.routeConfig ? e.routeConfig.canActivateChild : null;
    return !t || t.length === 0 ? null : { node: e, guards: t };
}
function nn(e, t) {
    let n = Symbol(),
        r = t.get(e, n);
    return r === n ? (typeof e == "function" && !Eu(e) ? e : t.get(e)) : r;
}
function jn(
    e,
    t,
    n,
    r,
    o = { canDeactivateChecks: [], canActivateChecks: [] },
) {
    let i = Zt(t);
    return (
        e.children.forEach((s) => {
            (Qy(s, i[s.value.outlet], n, r.concat([s.value]), o),
                delete i[s.value.outlet]);
        }),
        Object.entries(i).forEach(([s, c]) => $n(c, n.getContext(s), o)),
        o
    );
}
function Qy(
    e,
    t,
    n,
    r,
    o = { canDeactivateChecks: [], canActivateChecks: [] },
) {
    let i = e.value,
        s = t ? t.value : null,
        c = n ? n.getContext(e.value.outlet) : null;
    if (s && i.routeConfig === s.routeConfig) {
        let a = Yy(s, i, i.routeConfig.runGuardsAndResolvers);
        (a
            ? o.canActivateChecks.push(new $o(r))
            : ((i.data = s.data), (i._resolvedData = s._resolvedData)),
            i.component
                ? jn(e, t, c ? c.children : null, r, o)
                : jn(e, t, n, r, o),
            a &&
                c &&
                c.outlet &&
                c.outlet.isActivated &&
                o.canDeactivateChecks.push(new Kt(c.outlet.component, s)));
    } else
        (s && $n(t, c, o),
            o.canActivateChecks.push(new $o(r)),
            i.component
                ? jn(e, null, c ? c.children : null, r, o)
                : jn(e, null, n, r, o));
    return o;
}
function Yy(e, t, n) {
    if (typeof n == "function") return n(e, t);
    switch (n) {
        case "pathParamsChange":
            return !ft(e.url, t.url);
        case "pathParamsOrQueryParamsChange":
            return !ft(e.url, t.url) || !Ne(e.queryParams, t.queryParams);
        case "always":
            return !0;
        case "paramsOrQueryParamsChange":
            return !Ta(e, t) || !Ne(e.queryParams, t.queryParams);
        case "paramsChange":
        default:
            return !Ta(e, t);
    }
}
function $n(e, t, n) {
    let r = Zt(e),
        o = e.value;
    (Object.entries(r).forEach(([i, s]) => {
        o.component
            ? t
                ? $n(s, t.children.getContext(i), n)
                : $n(s, null, n)
            : $n(s, t, n);
    }),
        o.component
            ? t && t.outlet && t.outlet.isActivated
                ? n.canDeactivateChecks.push(new Kt(t.outlet.component, o))
                : n.canDeactivateChecks.push(new Kt(null, o))
            : n.canDeactivateChecks.push(new Kt(null, o)));
}
function er(e) {
    return typeof e == "function";
}
function Ky(e) {
    return typeof e == "boolean";
}
function Jy(e) {
    return e && er(e.canLoad);
}
function Xy(e) {
    return e && er(e.canActivate);
}
function eD(e) {
    return e && er(e.canActivateChild);
}
function tD(e) {
    return e && er(e.canDeactivate);
}
function nD(e) {
    return e && er(e.canMatch);
}
function Af(e) {
    return e instanceof Ae || e?.name === "EmptyError";
}
var xo = Symbol("INITIAL_VALUE");
function tn() {
    return De((e) =>
        Ir(e.map((t) => t.pipe(Re(1), ci(xo)))).pipe(
            N((t) => {
                for (let n of t)
                    if (n !== !0) {
                        if (n === xo) return xo;
                        if (n === !1 || rD(n)) return n;
                    }
                return !0;
            }),
            ye((t) => t !== xo),
            Re(1),
        ),
    );
}
function rD(e) {
    return Hn(e) || e instanceof Qn;
}
function oD(e, t) {
    return H((n) => {
        let {
            targetSnapshot: r,
            currentSnapshot: o,
            guards: { canActivateChecks: i, canDeactivateChecks: s },
        } = n;
        return s.length === 0 && i.length === 0
            ? I(F(m({}, n), { guardsResult: !0 }))
            : iD(s, r, o, e).pipe(
                  H((c) => (c && Ky(c) ? sD(r, i, e, t) : I(c))),
                  N((c) => F(m({}, n), { guardsResult: c })),
              );
    });
}
function iD(e, t, n, r) {
    return U(e).pipe(
        H((o) => dD(o.component, o.route, n, t, r)),
        Oe((o) => o !== !0, !0),
    );
}
function sD(e, t, n, r) {
    return U(t).pipe(
        St((o) =>
            bt(
                cD(o.route.parent, r),
                aD(o.route, r),
                lD(e, o.path, n),
                uD(e, o.route, n),
            ),
        ),
        Oe((o) => o !== !0, !0),
    );
}
function aD(e, t) {
    return (e !== null && t && t(new Ia(e)), I(!0));
}
function cD(e, t) {
    return (e !== null && t && t(new Ca(e)), I(!0));
}
function uD(e, t, n) {
    let r = t.routeConfig ? t.routeConfig.canActivate : null;
    if (!r || r.length === 0) return I(!0);
    let o = r.map((i) =>
        br(() => {
            let s = Xn(t) ?? n,
                c = nn(i, s),
                a = Xy(c) ? c.canActivate(t, e) : Ie(s, () => c(t, e));
            return Ye(a).pipe(Oe());
        }),
    );
    return I(o).pipe(tn());
}
function lD(e, t, n) {
    let r = t[t.length - 1],
        i = t
            .slice(0, t.length - 1)
            .reverse()
            .map((s) => Zy(s))
            .filter((s) => s !== null)
            .map((s) =>
                br(() => {
                    let c = s.guards.map((a) => {
                        let u = Xn(s.node) ?? n,
                            l = nn(a, u),
                            d = eD(l)
                                ? l.canActivateChild(r, e)
                                : Ie(u, () => l(r, e));
                        return Ye(d).pipe(Oe());
                    });
                    return I(c).pipe(tn());
                }),
            );
    return I(i).pipe(tn());
}
function dD(e, t, n, r, o) {
    let i = t && t.routeConfig ? t.routeConfig.canDeactivate : null;
    if (!i || i.length === 0) return I(!0);
    let s = i.map((c) => {
        let a = Xn(t) ?? o,
            u = nn(c, a),
            l = tD(u)
                ? u.canDeactivate(e, t, n, r)
                : Ie(a, () => u(e, t, n, r));
        return Ye(l).pipe(Oe());
    });
    return I(s).pipe(tn());
}
function fD(e, t, n, r) {
    let o = t.canLoad;
    if (o === void 0 || o.length === 0) return I(!0);
    let i = o.map((s) => {
        let c = nn(s, e),
            a = Jy(c) ? c.canLoad(t, n) : Ie(e, () => c(t, n));
        return Ye(a);
    });
    return I(i).pipe(tn(), Rf(r));
}
function Rf(e) {
    return ei(
        Z((t) => {
            if (typeof t != "boolean") throw Bo(e, t);
        }),
        N((t) => t === !0),
    );
}
function hD(e, t, n, r) {
    let o = t.canMatch;
    if (!o || o.length === 0) return I(!0);
    let i = o.map((s) => {
        let c = nn(s, e),
            a = nD(c) ? c.canMatch(t, n) : Ie(e, () => c(t, n));
        return Ye(a);
    });
    return I(i).pipe(tn(), Rf(r));
}
var Yn = class {
        segmentGroup;
        constructor(t) {
            this.segmentGroup = t || null;
        }
    },
    Kn = class extends Error {
        urlTree;
        constructor(t) {
            (super(), (this.urlTree = t));
        }
    };
function Wt(e) {
    return It(new Yn(e));
}
function pD(e) {
    return It(new v(4e3, !1));
}
function gD(e) {
    return It(xf(!1, de.GuardRejected));
}
var Aa = class {
        urlSerializer;
        urlTree;
        constructor(t, n) {
            ((this.urlSerializer = t), (this.urlTree = n));
        }
        lineralizeSegments(t, n) {
            let r = [],
                o = n.root;
            for (;;) {
                if (((r = r.concat(o.segments)), o.numberOfChildren === 0))
                    return I(r);
                if (o.numberOfChildren > 1 || !o.children[b])
                    return pD(`${t.redirectTo}`);
                o = o.children[b];
            }
        }
        applyRedirectCommands(t, n, r, o, i) {
            if (typeof n != "string") {
                let c = n,
                    {
                        queryParams: a,
                        fragment: u,
                        routeConfig: l,
                        url: d,
                        outlet: h,
                        params: f,
                        data: g,
                        title: E,
                    } = o,
                    j = Ie(i, () =>
                        c({
                            params: f,
                            data: g,
                            queryParams: a,
                            fragment: u,
                            routeConfig: l,
                            url: d,
                            outlet: h,
                            title: E,
                        }),
                    );
                if (j instanceof Ve) throw new Kn(j);
                n = j;
            }
            let s = this.applyRedirectCreateUrlTree(
                n,
                this.urlSerializer.parse(n),
                t,
                r,
            );
            if (n[0] === "/") throw new Kn(s);
            return s;
        }
        applyRedirectCreateUrlTree(t, n, r, o) {
            let i = this.createSegmentGroup(t, n.root, r, o);
            return new Ve(
                i,
                this.createQueryParams(n.queryParams, this.urlTree.queryParams),
                n.fragment,
            );
        }
        createQueryParams(t, n) {
            let r = {};
            return (
                Object.entries(t).forEach(([o, i]) => {
                    if (typeof i == "string" && i[0] === ":") {
                        let c = i.substring(1);
                        r[o] = n[c];
                    } else r[o] = i;
                }),
                r
            );
        }
        createSegmentGroup(t, n, r, o) {
            let i = this.createSegments(t, n.segments, r, o),
                s = {};
            return (
                Object.entries(n.children).forEach(([c, a]) => {
                    s[c] = this.createSegmentGroup(t, a, r, o);
                }),
                new O(i, s)
            );
        }
        createSegments(t, n, r, o) {
            return n.map((i) =>
                i.path[0] === ":"
                    ? this.findPosParam(t, i, o)
                    : this.findOrReturn(i, r),
            );
        }
        findPosParam(t, n, r) {
            let o = r[n.path.substring(1)];
            if (!o) throw new v(4001, !1);
            return o;
        }
        findOrReturn(t, n) {
            let r = 0;
            for (let o of n) {
                if (o.path === t.path) return (n.splice(r), o);
                r++;
            }
            return t;
        }
    },
    Ra = {
        matched: !1,
        consumedSegments: [],
        remainingSegments: [],
        parameters: {},
        positionalParamSegments: {},
    };
function mD(e, t, n, r, o) {
    let i = Of(e, t, n);
    return i.matched
        ? ((r = jy(t, r)),
          hD(r, t, n, o).pipe(N((s) => (s === !0 ? i : m({}, Ra)))))
        : I(i);
}
function Of(e, t, n) {
    if (t.path === "**") return vD(n);
    if (t.path === "")
        return t.pathMatch === "full" && (e.hasChildren() || n.length > 0)
            ? m({}, Ra)
            : {
                  matched: !0,
                  consumedSegments: [],
                  remainingSegments: n,
                  parameters: {},
                  positionalParamSegments: {},
              };
    let o = (t.matcher || fy)(n, e, t);
    if (!o) return m({}, Ra);
    let i = {};
    Object.entries(o.posParams ?? {}).forEach(([c, a]) => {
        i[c] = a.path;
    });
    let s =
        o.consumed.length > 0
            ? m(m({}, i), o.consumed[o.consumed.length - 1].parameters)
            : i;
    return {
        matched: !0,
        consumedSegments: o.consumed,
        remainingSegments: n.slice(o.consumed.length),
        parameters: s,
        positionalParamSegments: o.posParams ?? {},
    };
}
function vD(e) {
    return {
        matched: !0,
        parameters: e.length > 0 ? ff(e).parameters : {},
        consumedSegments: e,
        remainingSegments: [],
        positionalParamSegments: {},
    };
}
function cf(e, t, n, r) {
    return n.length > 0 && wD(e, n, r)
        ? {
              segmentGroup: new O(t, DD(r, new O(n, e.children))),
              slicedSegments: [],
          }
        : n.length === 0 && CD(e, n, r)
          ? {
                segmentGroup: new O(e.segments, yD(e, n, r, e.children)),
                slicedSegments: n,
            }
          : { segmentGroup: new O(e.segments, e.children), slicedSegments: n };
}
function yD(e, t, n, r) {
    let o = {};
    for (let i of n)
        if (Ho(e, t, i) && !r[Se(i)]) {
            let s = new O([], {});
            o[Se(i)] = s;
        }
    return m(m({}, r), o);
}
function DD(e, t) {
    let n = {};
    n[b] = t;
    for (let r of e)
        if (r.path === "" && Se(r) !== b) {
            let o = new O([], {});
            n[Se(r)] = o;
        }
    return n;
}
function wD(e, t, n) {
    return n.some((r) => Ho(e, t, r) && Se(r) !== b);
}
function CD(e, t, n) {
    return n.some((r) => Ho(e, t, r));
}
function Ho(e, t, n) {
    return (e.hasChildren() || t.length > 0) && n.pathMatch === "full"
        ? !1
        : n.path === "";
}
function ED(e, t, n) {
    return t.length === 0 && !e.children[n];
}
var Oa = class {};
function ID(e, t, n, r, o, i, s = "emptyOnly") {
    return new ka(e, t, n, r, o, s, i).recognize();
}
var bD = 31,
    ka = class {
        injector;
        configLoader;
        rootComponentType;
        config;
        urlTree;
        paramsInheritanceStrategy;
        urlSerializer;
        applyRedirects;
        absoluteRedirectCount = 0;
        allowRedirects = !0;
        constructor(t, n, r, o, i, s, c) {
            ((this.injector = t),
                (this.configLoader = n),
                (this.rootComponentType = r),
                (this.config = o),
                (this.urlTree = i),
                (this.paramsInheritanceStrategy = s),
                (this.urlSerializer = c),
                (this.applyRedirects = new Aa(
                    this.urlSerializer,
                    this.urlTree,
                )));
        }
        noMatchError(t) {
            return new v(4002, `'${t.segmentGroup}'`);
        }
        recognize() {
            let t = cf(this.urlTree.root, [], [], this.config).segmentGroup;
            return this.match(t).pipe(
                N(({ children: n, rootSnapshot: r }) => {
                    let o = new le(r, n),
                        i = new Vo("", o),
                        s = Ay(
                            r,
                            [],
                            this.urlTree.queryParams,
                            this.urlTree.fragment,
                        );
                    return (
                        (s.queryParams = this.urlTree.queryParams),
                        (i.url = this.urlSerializer.serialize(s)),
                        { state: i, tree: s }
                    );
                }),
            );
        }
        match(t) {
            let n = new Yt(
                [],
                Object.freeze({}),
                Object.freeze(m({}, this.urlTree.queryParams)),
                this.urlTree.fragment,
                Object.freeze({}),
                b,
                this.rootComponentType,
                null,
                {},
            );
            return this.processSegmentGroup(
                this.injector,
                this.config,
                t,
                b,
                n,
            ).pipe(
                N((r) => ({ children: r, rootSnapshot: n })),
                $e((r) => {
                    if (r instanceof Kn)
                        return (
                            (this.urlTree = r.urlTree),
                            this.match(r.urlTree.root)
                        );
                    throw r instanceof Yn ? this.noMatchError(r) : r;
                }),
            );
        }
        processSegmentGroup(t, n, r, o, i) {
            return r.segments.length === 0 && r.hasChildren()
                ? this.processChildren(t, n, r, i)
                : this.processSegment(t, n, r, r.segments, o, !0, i).pipe(
                      N((s) => (s instanceof le ? [s] : [])),
                  );
        }
        processChildren(t, n, r, o) {
            let i = [];
            for (let s of Object.keys(r.children))
                s === "primary" ? i.unshift(s) : i.push(s);
            return U(i).pipe(
                St((s) => {
                    let c = r.children[s],
                        a = Vy(n, s);
                    return this.processSegmentGroup(t, a, c, s, o);
                }),
                ai((s, c) => (s.push(...c), s)),
                Ue(null),
                si(),
                H((s) => {
                    if (s === null) return Wt(r);
                    let c = kf(s);
                    return (SD(c), I(c));
                }),
            );
        }
        processSegment(t, n, r, o, i, s, c) {
            return U(n).pipe(
                St((a) =>
                    this.processSegmentAgainstRoute(
                        a._injector ?? t,
                        n,
                        a,
                        r,
                        o,
                        i,
                        s,
                        c,
                    ).pipe(
                        $e((u) => {
                            if (u instanceof Yn) return I(null);
                            throw u;
                        }),
                    ),
                ),
                Oe((a) => !!a),
                $e((a) => {
                    if (Af(a)) return ED(r, o, i) ? I(new Oa()) : Wt(r);
                    throw a;
                }),
            );
        }
        processSegmentAgainstRoute(t, n, r, o, i, s, c, a) {
            return Se(r) !== s && (s === b || !Ho(o, i, r))
                ? Wt(o)
                : r.redirectTo === void 0
                  ? this.matchSegmentAgainstRoute(t, o, r, i, s, a)
                  : this.allowRedirects && c
                    ? this.expandSegmentAgainstRouteUsingRedirect(
                          t,
                          o,
                          n,
                          r,
                          i,
                          s,
                          a,
                      )
                    : Wt(o);
        }
        expandSegmentAgainstRouteUsingRedirect(t, n, r, o, i, s, c) {
            let {
                matched: a,
                parameters: u,
                consumedSegments: l,
                positionalParamSegments: d,
                remainingSegments: h,
            } = Of(n, o, i);
            if (!a) return Wt(n);
            typeof o.redirectTo == "string" &&
                o.redirectTo[0] === "/" &&
                (this.absoluteRedirectCount++,
                this.absoluteRedirectCount > bD && (this.allowRedirects = !1));
            let f = new Yt(
                    i,
                    u,
                    Object.freeze(m({}, this.urlTree.queryParams)),
                    this.urlTree.fragment,
                    uf(o),
                    Se(o),
                    o.component ?? o._loadedComponent ?? null,
                    o,
                    lf(o),
                ),
                g = jo(f, c, this.paramsInheritanceStrategy);
            ((f.params = Object.freeze(g.params)),
                (f.data = Object.freeze(g.data)));
            let E = this.applyRedirects.applyRedirectCommands(
                l,
                o.redirectTo,
                d,
                f,
                t,
            );
            return this.applyRedirects
                .lineralizeSegments(o, E)
                .pipe(
                    H((j) =>
                        this.processSegment(t, r, n, j.concat(h), s, !1, c),
                    ),
                );
        }
        matchSegmentAgainstRoute(t, n, r, o, i, s) {
            let c = mD(n, r, o, t, this.urlSerializer);
            return (
                r.path === "**" && (n.children = {}),
                c.pipe(
                    De((a) =>
                        a.matched
                            ? ((t = r._injector ?? t),
                              this.getChildConfig(t, r, o).pipe(
                                  De(({ routes: u }) => {
                                      let l = r._loadedInjector ?? t,
                                          {
                                              parameters: d,
                                              consumedSegments: h,
                                              remainingSegments: f,
                                          } = a,
                                          g = new Yt(
                                              h,
                                              d,
                                              Object.freeze(
                                                  m(
                                                      {},
                                                      this.urlTree.queryParams,
                                                  ),
                                              ),
                                              this.urlTree.fragment,
                                              uf(r),
                                              Se(r),
                                              r.component ??
                                                  r._loadedComponent ??
                                                  null,
                                              r,
                                              lf(r),
                                          ),
                                          E = jo(
                                              g,
                                              s,
                                              this.paramsInheritanceStrategy,
                                          );
                                      ((g.params = Object.freeze(E.params)),
                                          (g.data = Object.freeze(E.data)));
                                      let {
                                          segmentGroup: j,
                                          slicedSegments: V,
                                      } = cf(n, h, f, u);
                                      if (V.length === 0 && j.hasChildren())
                                          return this.processChildren(
                                              l,
                                              u,
                                              j,
                                              g,
                                          ).pipe(N((tr) => new le(g, tr)));
                                      if (u.length === 0 && V.length === 0)
                                          return I(new le(g, []));
                                      let Ke = Se(r) === i;
                                      return this.processSegment(
                                          l,
                                          u,
                                          j,
                                          V,
                                          Ke ? b : i,
                                          !0,
                                          g,
                                      ).pipe(
                                          N(
                                              (tr) =>
                                                  new le(
                                                      g,
                                                      tr instanceof le
                                                          ? [tr]
                                                          : [],
                                                  ),
                                          ),
                                      );
                                  }),
                              ))
                            : Wt(n),
                    ),
                )
            );
        }
        getChildConfig(t, n, r) {
            return n.children
                ? I({ routes: n.children, injector: t })
                : n.loadChildren
                  ? n._loadedRoutes !== void 0
                      ? I({
                            routes: n._loadedRoutes,
                            injector: n._loadedInjector,
                        })
                      : fD(t, n, r, this.urlSerializer).pipe(
                            H((o) =>
                                o
                                    ? this.configLoader.loadChildren(t, n).pipe(
                                          Z((i) => {
                                              ((n._loadedRoutes = i.routes),
                                                  (n._loadedInjector =
                                                      i.injector));
                                          }),
                                      )
                                    : gD(n),
                            ),
                        )
                  : I({ routes: [], injector: t });
        }
    };
function SD(e) {
    e.sort((t, n) =>
        t.value.outlet === b
            ? -1
            : n.value.outlet === b
              ? 1
              : t.value.outlet.localeCompare(n.value.outlet),
    );
}
function MD(e) {
    let t = e.value.routeConfig;
    return t && t.path === "";
}
function kf(e) {
    let t = [],
        n = new Set();
    for (let r of e) {
        if (!MD(r)) {
            t.push(r);
            continue;
        }
        let o = t.find((i) => r.value.routeConfig === i.value.routeConfig);
        o !== void 0 ? (o.children.push(...r.children), n.add(o)) : t.push(r);
    }
    for (let r of n) {
        let o = kf(r.children);
        t.push(new le(r.value, o));
    }
    return t.filter((r) => !n.has(r));
}
function uf(e) {
    return e.data || {};
}
function lf(e) {
    return e.resolve || {};
}
function _D(e, t, n, r, o, i) {
    return H((s) =>
        ID(e, t, n, r, s.extractedUrl, o, i).pipe(
            N(({ state: c, tree: a }) =>
                F(m({}, s), { targetSnapshot: c, urlAfterRedirects: a }),
            ),
        ),
    );
}
function TD(e, t) {
    return H((n) => {
        let {
            targetSnapshot: r,
            guards: { canActivateChecks: o },
        } = n;
        if (!o.length) return I(n);
        let i = new Set(o.map((a) => a.route)),
            s = new Set();
        for (let a of i) if (!s.has(a)) for (let u of Pf(a)) s.add(u);
        let c = 0;
        return U(s).pipe(
            St((a) =>
                i.has(a)
                    ? xD(a, r, e, t)
                    : ((a.data = jo(a, a.parent, e).resolve), I(void 0)),
            ),
            Z(() => c++),
            Mt(1),
            H((a) => (c === s.size ? I(n) : ne)),
        );
    });
}
function Pf(e) {
    let t = e.children.map((n) => Pf(n)).flat();
    return [e, ...t];
}
function xD(e, t, n, r) {
    let o = e.routeConfig,
        i = e._resolve;
    return (
        o?.title !== void 0 && !_f(o) && (i[Jn] = o.title),
        ND(i, e, t, r).pipe(
            N(
                (s) => (
                    (e._resolvedData = s),
                    (e.data = jo(e, e.parent, n).resolve),
                    null
                ),
            ),
        )
    );
}
function ND(e, t, n, r) {
    let o = la(e);
    if (o.length === 0) return I({});
    let i = {};
    return U(o).pipe(
        H((s) =>
            AD(e[s], t, n, r).pipe(
                Oe(),
                Z((c) => {
                    if (c instanceof Qn) throw Bo(new Un(), c);
                    i[s] = c;
                }),
            ),
        ),
        Mt(1),
        N(() => i),
        $e((s) => (Af(s) ? ne : It(s))),
    );
}
function AD(e, t, n, r) {
    let o = Xn(t) ?? r,
        i = nn(e, o),
        s = i.resolve ? i.resolve(t, n) : Ie(o, () => i(t, n));
    return Ye(s);
}
function ca(e) {
    return De((t) => {
        let n = e(t);
        return n ? U(n).pipe(N(() => t)) : I(t);
    });
}
var Ff = (() => {
        class e {
            buildTitle(n) {
                let r,
                    o = n.root;
                for (; o !== void 0; )
                    ((r = this.getResolvedTitleForRoute(o) ?? r),
                        (o = o.children.find((i) => i.outlet === b)));
                return r;
            }
            getResolvedTitleForRoute(n) {
                return n.data[Jn];
            }
            static ɵfac = function (r) {
                return new (r || e)();
            };
            static ɵprov = C({
                token: e,
                factory: () => p(RD),
                providedIn: "root",
            });
        }
        return e;
    })(),
    RD = (() => {
        class e extends Ff {
            title;
            constructor(n) {
                (super(), (this.title = n));
            }
            updateTitle(n) {
                let r = this.buildTitle(n);
                r !== void 0 && this.title.setTitle(r);
            }
            static ɵfac = function (r) {
                return new (r || e)(M(nf));
            };
            static ɵprov = C({ token: e, factory: e.ɵfac, providedIn: "root" });
        }
        return e;
    })(),
    Ba = new w("", { providedIn: "root", factory: () => ({}) }),
    OD = (() => {
        class e {
            static ɵfac = function (r) {
                return new (r || e)();
            };
            static ɵcmp = yo({
                type: e,
                selectors: [["ng-component"]],
                exportAs: ["emptyRouterOutlet"],
                decls: 1,
                vars: 0,
                template: function (r, o) {
                    r & 1 && oe(0, "router-outlet");
                },
                dependencies: [ja],
                encapsulation: 2,
            });
        }
        return e;
    })();
function $a(e) {
    let t = e.children && e.children.map($a),
        n = t ? F(m({}, e), { children: t }) : m({}, e);
    return (
        !n.component &&
            !n.loadComponent &&
            (t || n.loadChildren) &&
            n.outlet &&
            n.outlet !== b &&
            (n.component = OD),
        n
    );
}
var Ua = new w(""),
    kD = (() => {
        class e {
            componentLoaders = new WeakMap();
            childrenLoaders = new WeakMap();
            onLoadStartListener;
            onLoadEndListener;
            compiler = p(Qs);
            loadComponent(n) {
                if (this.componentLoaders.get(n))
                    return this.componentLoaders.get(n);
                if (n._loadedComponent) return I(n._loadedComponent);
                this.onLoadStartListener && this.onLoadStartListener(n);
                let r = Ye(n.loadComponent()).pipe(
                        N(Lf),
                        Z((i) => {
                            (this.onLoadEndListener &&
                                this.onLoadEndListener(n),
                                (n._loadedComponent = i));
                        }),
                        an(() => {
                            this.componentLoaders.delete(n);
                        }),
                    ),
                    o = new Et(r, () => new K()).pipe(Ct());
                return (this.componentLoaders.set(n, o), o);
            }
            loadChildren(n, r) {
                if (this.childrenLoaders.get(r))
                    return this.childrenLoaders.get(r);
                if (r._loadedRoutes)
                    return I({
                        routes: r._loadedRoutes,
                        injector: r._loadedInjector,
                    });
                this.onLoadStartListener && this.onLoadStartListener(r);
                let i = PD(r, this.compiler, n, this.onLoadEndListener).pipe(
                        an(() => {
                            this.childrenLoaders.delete(r);
                        }),
                    ),
                    s = new Et(i, () => new K()).pipe(Ct());
                return (this.childrenLoaders.set(r, s), s);
            }
            static ɵfac = function (r) {
                return new (r || e)();
            };
            static ɵprov = C({ token: e, factory: e.ɵfac, providedIn: "root" });
        }
        return e;
    })();
function PD(e, t, n, r) {
    return Ye(e.loadChildren()).pipe(
        N(Lf),
        H((o) =>
            o instanceof En || Array.isArray(o)
                ? I(o)
                : U(t.compileModuleAsync(o)),
        ),
        N((o) => {
            r && r(e);
            let i,
                s,
                c = !1;
            return (
                Array.isArray(o)
                    ? ((s = o), (c = !0))
                    : ((i = o.create(n).injector),
                      (s = i.get(Ua, [], { optional: !0, self: !0 }).flat())),
                { routes: s.map($a), injector: i }
            );
        }),
    );
}
function FD(e) {
    return e && typeof e == "object" && "default" in e;
}
function Lf(e) {
    return FD(e) ? e.default : e;
}
var Ha = (() => {
        class e {
            static ɵfac = function (r) {
                return new (r || e)();
            };
            static ɵprov = C({
                token: e,
                factory: () => p(LD),
                providedIn: "root",
            });
        }
        return e;
    })(),
    LD = (() => {
        class e {
            shouldProcessUrl(n) {
                return !0;
            }
            extract(n) {
                return n;
            }
            merge(n, r) {
                return n;
            }
            static ɵfac = function (r) {
                return new (r || e)();
            };
            static ɵprov = C({ token: e, factory: e.ɵfac, providedIn: "root" });
        }
        return e;
    })(),
    jD = new w("");
var VD = new w(""),
    BD = (() => {
        class e {
            currentNavigation = null;
            currentTransition = null;
            lastSuccessfulNavigation = null;
            events = new K();
            transitionAbortSubject = new K();
            configLoader = p(kD);
            environmentInjector = p(pe);
            destroyRef = p(ao);
            urlSerializer = p(Fa);
            rootContexts = p(Uo);
            location = p(On);
            inputBindingEnabled = p(Va, { optional: !0 }) !== null;
            titleStrategy = p(Ff);
            options = p(Ba, { optional: !0 }) || {};
            paramsInheritanceStrategy =
                this.options.paramsInheritanceStrategy || "emptyOnly";
            urlHandlingStrategy = p(Ha);
            createViewTransition = p(jD, { optional: !0 });
            navigationErrorHandler = p(VD, { optional: !0 });
            navigationId = 0;
            get hasRequestedNavigation() {
                return this.navigationId !== 0;
            }
            transitions;
            afterPreactivation = () => I(void 0);
            rootComponentType = null;
            destroyed = !1;
            constructor() {
                let n = (o) => this.events.next(new Da(o)),
                    r = (o) => this.events.next(new wa(o));
                ((this.configLoader.onLoadEndListener = r),
                    (this.configLoader.onLoadStartListener = n),
                    this.destroyRef.onDestroy(() => {
                        this.destroyed = !0;
                    }));
            }
            complete() {
                this.transitions?.complete();
            }
            handleNavigationRequest(n) {
                let r = ++this.navigationId;
                this.transitions?.next(
                    F(m(m({}, this.transitions.value), n), { id: r }),
                );
            }
            setupNavigations(n, r, o) {
                return (
                    (this.transitions = new W({
                        id: 0,
                        currentUrlTree: r,
                        currentRawUrl: r,
                        extractedUrl: this.urlHandlingStrategy.extract(r),
                        urlAfterRedirects: this.urlHandlingStrategy.extract(r),
                        rawUrl: r,
                        extras: {},
                        resolve: () => {},
                        reject: () => {},
                        promise: Promise.resolve(!0),
                        source: Bn,
                        restoredState: null,
                        currentSnapshot: o.snapshot,
                        targetSnapshot: null,
                        currentRouterState: o,
                        targetRouterState: null,
                        guards: {
                            canActivateChecks: [],
                            canDeactivateChecks: [],
                        },
                        guardsResult: null,
                    })),
                    this.transitions.pipe(
                        ye((i) => i.id !== 0),
                        N((i) =>
                            F(m({}, i), {
                                extractedUrl: this.urlHandlingStrategy.extract(
                                    i.rawUrl,
                                ),
                            }),
                        ),
                        De((i) => {
                            let s = !1,
                                c = !1;
                            return I(i).pipe(
                                De((a) => {
                                    if (this.navigationId > i.id)
                                        return (
                                            this.cancelNavigationTransition(
                                                i,
                                                "",
                                                de.SupersededByNewNavigation,
                                            ),
                                            ne
                                        );
                                    ((this.currentTransition = i),
                                        (this.currentNavigation = {
                                            id: a.id,
                                            initialUrl: a.rawUrl,
                                            extractedUrl: a.extractedUrl,
                                            targetBrowserUrl:
                                                typeof a.extras.browserUrl ==
                                                "string"
                                                    ? this.urlSerializer.parse(
                                                          a.extras.browserUrl,
                                                      )
                                                    : a.extras.browserUrl,
                                            trigger: a.source,
                                            extras: a.extras,
                                            previousNavigation: this
                                                .lastSuccessfulNavigation
                                                ? F(
                                                      m(
                                                          {},
                                                          this
                                                              .lastSuccessfulNavigation,
                                                      ),
                                                      {
                                                          previousNavigation:
                                                              null,
                                                      },
                                                  )
                                                : null,
                                        }));
                                    let u =
                                            !n.navigated ||
                                            this.isUpdatingInternalState() ||
                                            this.isUpdatedBrowserUrl(),
                                        l =
                                            a.extras.onSameUrlNavigation ??
                                            n.onSameUrlNavigation;
                                    if (!u && l !== "reload") {
                                        let d = "";
                                        return (
                                            this.events.next(
                                                new pt(
                                                    a.id,
                                                    this.urlSerializer.serialize(
                                                        a.rawUrl,
                                                    ),
                                                    d,
                                                    pa.IgnoredSameUrlNavigation,
                                                ),
                                            ),
                                            a.resolve(!1),
                                            ne
                                        );
                                    }
                                    if (
                                        this.urlHandlingStrategy.shouldProcessUrl(
                                            a.rawUrl,
                                        )
                                    )
                                        return I(a).pipe(
                                            De((d) => {
                                                let h =
                                                    this.transitions?.getValue();
                                                return (
                                                    this.events.next(
                                                        new qn(
                                                            d.id,
                                                            this.urlSerializer.serialize(
                                                                d.extractedUrl,
                                                            ),
                                                            d.source,
                                                            d.restoredState,
                                                        ),
                                                    ),
                                                    h !==
                                                    this.transitions?.getValue()
                                                        ? ne
                                                        : Promise.resolve(d)
                                                );
                                            }),
                                            _D(
                                                this.environmentInjector,
                                                this.configLoader,
                                                this.rootComponentType,
                                                n.config,
                                                this.urlSerializer,
                                                this.paramsInheritanceStrategy,
                                            ),
                                            Z((d) => {
                                                ((i.targetSnapshot =
                                                    d.targetSnapshot),
                                                    (i.urlAfterRedirects =
                                                        d.urlAfterRedirects),
                                                    (this.currentNavigation = F(
                                                        m(
                                                            {},
                                                            this
                                                                .currentNavigation,
                                                        ),
                                                        {
                                                            finalUrl:
                                                                d.urlAfterRedirects,
                                                        },
                                                    )));
                                                let h = new Po(
                                                    d.id,
                                                    this.urlSerializer.serialize(
                                                        d.extractedUrl,
                                                    ),
                                                    this.urlSerializer.serialize(
                                                        d.urlAfterRedirects,
                                                    ),
                                                    d.targetSnapshot,
                                                );
                                                this.events.next(h);
                                            }),
                                        );
                                    if (
                                        u &&
                                        this.urlHandlingStrategy.shouldProcessUrl(
                                            a.currentRawUrl,
                                        )
                                    ) {
                                        let {
                                                id: d,
                                                extractedUrl: h,
                                                source: f,
                                                restoredState: g,
                                                extras: E,
                                            } = a,
                                            j = new qn(
                                                d,
                                                this.urlSerializer.serialize(h),
                                                f,
                                                g,
                                            );
                                        this.events.next(j);
                                        let V = Sf(
                                            this.rootComponentType,
                                        ).snapshot;
                                        return (
                                            (this.currentTransition = i =
                                                F(m({}, a), {
                                                    targetSnapshot: V,
                                                    urlAfterRedirects: h,
                                                    extras: F(m({}, E), {
                                                        skipLocationChange: !1,
                                                        replaceUrl: !1,
                                                    }),
                                                })),
                                            (this.currentNavigation.finalUrl =
                                                h),
                                            I(i)
                                        );
                                    } else {
                                        let d = "";
                                        return (
                                            this.events.next(
                                                new pt(
                                                    a.id,
                                                    this.urlSerializer.serialize(
                                                        a.extractedUrl,
                                                    ),
                                                    d,
                                                    pa.IgnoredByUrlHandlingStrategy,
                                                ),
                                            ),
                                            a.resolve(!1),
                                            ne
                                        );
                                    }
                                }),
                                Z((a) => {
                                    let u = new ga(
                                        a.id,
                                        this.urlSerializer.serialize(
                                            a.extractedUrl,
                                        ),
                                        this.urlSerializer.serialize(
                                            a.urlAfterRedirects,
                                        ),
                                        a.targetSnapshot,
                                    );
                                    this.events.next(u);
                                }),
                                N(
                                    (a) => (
                                        (this.currentTransition = i =
                                            F(m({}, a), {
                                                guards: Wy(
                                                    a.targetSnapshot,
                                                    a.currentSnapshot,
                                                    this.rootContexts,
                                                ),
                                            })),
                                        i
                                    ),
                                ),
                                oD(this.environmentInjector, (a) =>
                                    this.events.next(a),
                                ),
                                Z((a) => {
                                    if (
                                        ((i.guardsResult = a.guardsResult),
                                        a.guardsResult &&
                                            typeof a.guardsResult != "boolean")
                                    )
                                        throw Bo(
                                            this.urlSerializer,
                                            a.guardsResult,
                                        );
                                    let u = new ma(
                                        a.id,
                                        this.urlSerializer.serialize(
                                            a.extractedUrl,
                                        ),
                                        this.urlSerializer.serialize(
                                            a.urlAfterRedirects,
                                        ),
                                        a.targetSnapshot,
                                        !!a.guardsResult,
                                    );
                                    this.events.next(u);
                                }),
                                ye((a) =>
                                    a.guardsResult
                                        ? !0
                                        : (this.cancelNavigationTransition(
                                              a,
                                              "",
                                              de.GuardRejected,
                                          ),
                                          !1),
                                ),
                                ca((a) => {
                                    if (a.guards.canActivateChecks.length)
                                        return I(a).pipe(
                                            Z((u) => {
                                                let l = new va(
                                                    u.id,
                                                    this.urlSerializer.serialize(
                                                        u.extractedUrl,
                                                    ),
                                                    this.urlSerializer.serialize(
                                                        u.urlAfterRedirects,
                                                    ),
                                                    u.targetSnapshot,
                                                );
                                                this.events.next(l);
                                            }),
                                            De((u) => {
                                                let l = !1;
                                                return I(u).pipe(
                                                    TD(
                                                        this
                                                            .paramsInheritanceStrategy,
                                                        this
                                                            .environmentInjector,
                                                    ),
                                                    Z({
                                                        next: () => (l = !0),
                                                        complete: () => {
                                                            l ||
                                                                this.cancelNavigationTransition(
                                                                    u,
                                                                    "",
                                                                    de.NoDataFromResolver,
                                                                );
                                                        },
                                                    }),
                                                );
                                            }),
                                            Z((u) => {
                                                let l = new ya(
                                                    u.id,
                                                    this.urlSerializer.serialize(
                                                        u.extractedUrl,
                                                    ),
                                                    this.urlSerializer.serialize(
                                                        u.urlAfterRedirects,
                                                    ),
                                                    u.targetSnapshot,
                                                );
                                                this.events.next(l);
                                            }),
                                        );
                                }),
                                ca((a) => {
                                    let u = (l) => {
                                        let d = [];
                                        l.routeConfig?.loadComponent &&
                                            !l.routeConfig._loadedComponent &&
                                            d.push(
                                                this.configLoader
                                                    .loadComponent(
                                                        l.routeConfig,
                                                    )
                                                    .pipe(
                                                        Z((h) => {
                                                            l.component = h;
                                                        }),
                                                        N(() => {}),
                                                    ),
                                            );
                                        for (let h of l.children)
                                            d.push(...u(h));
                                        return d;
                                    };
                                    return Ir(u(a.targetSnapshot.root)).pipe(
                                        Ue(null),
                                        Re(1),
                                    );
                                }),
                                ca(() => this.afterPreactivation()),
                                De(() => {
                                    let {
                                            currentSnapshot: a,
                                            targetSnapshot: u,
                                        } = i,
                                        l = this.createViewTransition?.(
                                            this.environmentInjector,
                                            a.root,
                                            u.root,
                                        );
                                    return l ? U(l).pipe(N(() => i)) : I(i);
                                }),
                                N((a) => {
                                    let u = Uy(
                                        n.routeReuseStrategy,
                                        a.targetSnapshot,
                                        a.currentRouterState,
                                    );
                                    return (
                                        (this.currentTransition = i =
                                            F(m({}, a), {
                                                targetRouterState: u,
                                            })),
                                        (this.currentNavigation.targetRouterState =
                                            u),
                                        i
                                    );
                                }),
                                Z(() => {
                                    this.events.next(new Wn());
                                }),
                                Gy(
                                    this.rootContexts,
                                    n.routeReuseStrategy,
                                    (a) => this.events.next(a),
                                    this.inputBindingEnabled,
                                ),
                                Re(1),
                                Z({
                                    next: (a) => {
                                        ((s = !0),
                                            (this.lastSuccessfulNavigation =
                                                this.currentNavigation),
                                            this.events.next(
                                                new ht(
                                                    a.id,
                                                    this.urlSerializer.serialize(
                                                        a.extractedUrl,
                                                    ),
                                                    this.urlSerializer.serialize(
                                                        a.urlAfterRedirects,
                                                    ),
                                                ),
                                            ),
                                            this.titleStrategy?.updateTitle(
                                                a.targetRouterState.snapshot,
                                            ),
                                            a.resolve(!0));
                                    },
                                    complete: () => {
                                        s = !0;
                                    },
                                }),
                                ui(
                                    this.transitionAbortSubject.pipe(
                                        Z((a) => {
                                            throw a;
                                        }),
                                    ),
                                ),
                                an(() => {
                                    (!s &&
                                        !c &&
                                        this.cancelNavigationTransition(
                                            i,
                                            "",
                                            de.SupersededByNewNavigation,
                                        ),
                                        this.currentTransition?.id === i.id &&
                                            ((this.currentNavigation = null),
                                            (this.currentTransition = null)));
                                }),
                                $e((a) => {
                                    if (this.destroyed)
                                        return (i.resolve(!1), ne);
                                    if (((c = !0), Nf(a)))
                                        (this.events.next(
                                            new je(
                                                i.id,
                                                this.urlSerializer.serialize(
                                                    i.extractedUrl,
                                                ),
                                                a.message,
                                                a.cancellationCode,
                                            ),
                                        ),
                                            qy(a)
                                                ? this.events.next(
                                                      new Xt(
                                                          a.url,
                                                          a.navigationBehaviorOptions,
                                                      ),
                                                  )
                                                : i.resolve(!1));
                                    else {
                                        let u = new Gn(
                                            i.id,
                                            this.urlSerializer.serialize(
                                                i.extractedUrl,
                                            ),
                                            a,
                                            i.targetSnapshot ?? void 0,
                                        );
                                        try {
                                            let l = Ie(
                                                this.environmentInjector,
                                                () =>
                                                    this.navigationErrorHandler?.(
                                                        u,
                                                    ),
                                            );
                                            if (l instanceof Qn) {
                                                let {
                                                    message: d,
                                                    cancellationCode: h,
                                                } = Bo(this.urlSerializer, l);
                                                (this.events.next(
                                                    new je(
                                                        i.id,
                                                        this.urlSerializer.serialize(
                                                            i.extractedUrl,
                                                        ),
                                                        d,
                                                        h,
                                                    ),
                                                ),
                                                    this.events.next(
                                                        new Xt(
                                                            l.redirectTo,
                                                            l.navigationBehaviorOptions,
                                                        ),
                                                    ));
                                            } else
                                                throw (this.events.next(u), a);
                                        } catch (l) {
                                            this.options
                                                .resolveNavigationPromiseOnError
                                                ? i.resolve(!1)
                                                : i.reject(l);
                                        }
                                    }
                                    return ne;
                                }),
                            );
                        }),
                    )
                );
            }
            cancelNavigationTransition(n, r, o) {
                let i = new je(
                    n.id,
                    this.urlSerializer.serialize(n.extractedUrl),
                    r,
                    o,
                );
                (this.events.next(i), n.resolve(!1));
            }
            isUpdatingInternalState() {
                return (
                    this.currentTransition?.extractedUrl.toString() !==
                    this.currentTransition?.currentUrlTree.toString()
                );
            }
            isUpdatedBrowserUrl() {
                let n = this.urlHandlingStrategy.extract(
                        this.urlSerializer.parse(this.location.path(!0)),
                    ),
                    r =
                        this.currentNavigation?.targetBrowserUrl ??
                        this.currentNavigation?.extractedUrl;
                return (
                    n.toString() !== r?.toString() &&
                    !this.currentNavigation?.extras.skipLocationChange
                );
            }
            static ɵfac = function (r) {
                return new (r || e)();
            };
            static ɵprov = C({ token: e, factory: e.ɵfac, providedIn: "root" });
        }
        return e;
    })();
function $D(e) {
    return e !== Bn;
}
var UD = (() => {
        class e {
            static ɵfac = function (r) {
                return new (r || e)();
            };
            static ɵprov = C({
                token: e,
                factory: () => p(HD),
                providedIn: "root",
            });
        }
        return e;
    })(),
    Pa = class {
        shouldDetach(t) {
            return !1;
        }
        store(t, n) {}
        shouldAttach(t) {
            return !1;
        }
        retrieve(t) {
            return null;
        }
        shouldReuseRoute(t, n) {
            return t.routeConfig === n.routeConfig;
        }
    },
    HD = (() => {
        class e extends Pa {
            static ɵfac = (() => {
                let n;
                return function (o) {
                    return (n || (n = ws(e)))(o || e);
                };
            })();
            static ɵprov = C({ token: e, factory: e.ɵfac, providedIn: "root" });
        }
        return e;
    })(),
    jf = (() => {
        class e {
            static ɵfac = function (r) {
                return new (r || e)();
            };
            static ɵprov = C({
                token: e,
                factory: () => p(zD),
                providedIn: "root",
            });
        }
        return e;
    })(),
    zD = (() => {
        class e extends jf {
            location = p(On);
            urlSerializer = p(Fa);
            options = p(Ba, { optional: !0 }) || {};
            canceledNavigationResolution =
                this.options.canceledNavigationResolution || "replace";
            urlHandlingStrategy = p(Ha);
            urlUpdateStrategy = this.options.urlUpdateStrategy || "deferred";
            currentUrlTree = new Ve();
            getCurrentUrlTree() {
                return this.currentUrlTree;
            }
            rawUrlTree = this.currentUrlTree;
            getRawUrlTree() {
                return this.rawUrlTree;
            }
            currentPageId = 0;
            lastSuccessfulId = -1;
            restoredState() {
                return this.location.getState();
            }
            get browserPageId() {
                return this.canceledNavigationResolution !== "computed"
                    ? this.currentPageId
                    : (this.restoredState()?.ɵrouterPageId ??
                          this.currentPageId);
            }
            routerState = Sf(null);
            getRouterState() {
                return this.routerState;
            }
            stateMemento = this.createStateMemento();
            createStateMemento() {
                return {
                    rawUrlTree: this.rawUrlTree,
                    currentUrlTree: this.currentUrlTree,
                    routerState: this.routerState,
                };
            }
            registerNonRouterCurrentEntryChangeListener(n) {
                return this.location.subscribe((r) => {
                    r.type === "popstate" && n(r.url, r.state);
                });
            }
            handleRouterEvent(n, r) {
                if (n instanceof qn)
                    this.stateMemento = this.createStateMemento();
                else if (n instanceof pt) this.rawUrlTree = r.initialUrl;
                else if (n instanceof Po) {
                    if (
                        this.urlUpdateStrategy === "eager" &&
                        !r.extras.skipLocationChange
                    ) {
                        let o = this.urlHandlingStrategy.merge(
                            r.finalUrl,
                            r.initialUrl,
                        );
                        this.setBrowserUrl(r.targetBrowserUrl ?? o, r);
                    }
                } else
                    n instanceof Wn
                        ? ((this.currentUrlTree = r.finalUrl),
                          (this.rawUrlTree = this.urlHandlingStrategy.merge(
                              r.finalUrl,
                              r.initialUrl,
                          )),
                          (this.routerState = r.targetRouterState),
                          this.urlUpdateStrategy === "deferred" &&
                              !r.extras.skipLocationChange &&
                              this.setBrowserUrl(
                                  r.targetBrowserUrl ?? this.rawUrlTree,
                                  r,
                              ))
                        : n instanceof je &&
                            (n.code === de.GuardRejected ||
                                n.code === de.NoDataFromResolver)
                          ? this.restoreHistory(r)
                          : n instanceof Gn
                            ? this.restoreHistory(r, !0)
                            : n instanceof ht &&
                              ((this.lastSuccessfulId = n.id),
                              (this.currentPageId = this.browserPageId));
            }
            setBrowserUrl(n, r) {
                let o = n instanceof Ve ? this.urlSerializer.serialize(n) : n;
                if (
                    this.location.isCurrentPathEqualTo(o) ||
                    r.extras.replaceUrl
                ) {
                    let i = this.browserPageId,
                        s = m(
                            m({}, r.extras.state),
                            this.generateNgRouterState(r.id, i),
                        );
                    this.location.replaceState(o, "", s);
                } else {
                    let i = m(
                        m({}, r.extras.state),
                        this.generateNgRouterState(
                            r.id,
                            this.browserPageId + 1,
                        ),
                    );
                    this.location.go(o, "", i);
                }
            }
            restoreHistory(n, r = !1) {
                if (this.canceledNavigationResolution === "computed") {
                    let o = this.browserPageId,
                        i = this.currentPageId - o;
                    i !== 0
                        ? this.location.historyGo(i)
                        : this.currentUrlTree === n.finalUrl &&
                          i === 0 &&
                          (this.resetState(n), this.resetUrlToCurrentUrlTree());
                } else
                    this.canceledNavigationResolution === "replace" &&
                        (r && this.resetState(n),
                        this.resetUrlToCurrentUrlTree());
            }
            resetState(n) {
                ((this.routerState = this.stateMemento.routerState),
                    (this.currentUrlTree = this.stateMemento.currentUrlTree),
                    (this.rawUrlTree = this.urlHandlingStrategy.merge(
                        this.currentUrlTree,
                        n.finalUrl ?? this.rawUrlTree,
                    )));
            }
            resetUrlToCurrentUrlTree() {
                this.location.replaceState(
                    this.urlSerializer.serialize(this.rawUrlTree),
                    "",
                    this.generateNgRouterState(
                        this.lastSuccessfulId,
                        this.currentPageId,
                    ),
                );
            }
            generateNgRouterState(n, r) {
                return this.canceledNavigationResolution === "computed"
                    ? { navigationId: n, ɵrouterPageId: r }
                    : { navigationId: n };
            }
            static ɵfac = (() => {
                let n;
                return function (o) {
                    return (n || (n = ws(e)))(o || e);
                };
            })();
            static ɵprov = C({ token: e, factory: e.ɵfac, providedIn: "root" });
        }
        return e;
    })();
function qD(e, t) {
    e.events
        .pipe(
            ye(
                (n) =>
                    n instanceof ht ||
                    n instanceof je ||
                    n instanceof Gn ||
                    n instanceof pt,
            ),
            N((n) =>
                n instanceof ht || n instanceof pt
                    ? 0
                    : (
                            n instanceof je
                                ? n.code === de.Redirect ||
                                  n.code === de.SupersededByNewNavigation
                                : !1
                        )
                      ? 2
                      : 1,
            ),
            ye((n) => n !== 2),
            Re(1),
        )
        .subscribe(() => {
            t();
        });
}
var GD = {
        paths: "exact",
        fragment: "ignored",
        matrixParams: "ignored",
        queryParams: "exact",
    },
    WD = {
        paths: "subset",
        fragment: "ignored",
        matrixParams: "ignored",
        queryParams: "subset",
    },
    Vf = (() => {
        class e {
            get currentUrlTree() {
                return this.stateManager.getCurrentUrlTree();
            }
            get rawUrlTree() {
                return this.stateManager.getRawUrlTree();
            }
            disposed = !1;
            nonRouterCurrentEntryChangeSubscription;
            console = p(qs);
            stateManager = p(jf);
            options = p(Ba, { optional: !0 }) || {};
            pendingTasks = p(zt);
            urlUpdateStrategy = this.options.urlUpdateStrategy || "deferred";
            navigationTransitions = p(BD);
            urlSerializer = p(Fa);
            location = p(On);
            urlHandlingStrategy = p(Ha);
            _events = new K();
            get events() {
                return this._events;
            }
            get routerState() {
                return this.stateManager.getRouterState();
            }
            navigated = !1;
            routeReuseStrategy = p(UD);
            onSameUrlNavigation = this.options.onSameUrlNavigation || "ignore";
            config = p(Ua, { optional: !0 })?.flat() ?? [];
            componentInputBindingEnabled = !!p(Va, { optional: !0 });
            constructor() {
                (this.resetConfig(this.config),
                    this.navigationTransitions
                        .setupNavigations(
                            this,
                            this.currentUrlTree,
                            this.routerState,
                        )
                        .subscribe({
                            error: (n) => {
                                this.console.warn(n);
                            },
                        }),
                    this.subscribeToNavigationEvents());
            }
            eventsSubscription = new B();
            subscribeToNavigationEvents() {
                let n = this.navigationTransitions.events.subscribe((r) => {
                    try {
                        let o = this.navigationTransitions.currentTransition,
                            i = this.navigationTransitions.currentNavigation;
                        if (o !== null && i !== null) {
                            if (
                                (this.stateManager.handleRouterEvent(r, i),
                                r instanceof je &&
                                    r.code !== de.Redirect &&
                                    r.code !== de.SupersededByNewNavigation)
                            )
                                this.navigated = !0;
                            else if (r instanceof ht) this.navigated = !0;
                            else if (r instanceof Xt) {
                                let s = r.navigationBehaviorOptions,
                                    c = this.urlHandlingStrategy.merge(
                                        r.url,
                                        o.currentRawUrl,
                                    ),
                                    a = m(
                                        {
                                            browserUrl: o.extras.browserUrl,
                                            info: o.extras.info,
                                            skipLocationChange:
                                                o.extras.skipLocationChange,
                                            replaceUrl:
                                                o.extras.replaceUrl ||
                                                this.urlUpdateStrategy ===
                                                    "eager" ||
                                                $D(o.source),
                                        },
                                        s,
                                    );
                                this.scheduleNavigation(c, Bn, null, a, {
                                    resolve: o.resolve,
                                    reject: o.reject,
                                    promise: o.promise,
                                });
                            }
                        }
                        QD(r) && this._events.next(r);
                    } catch (o) {
                        this.navigationTransitions.transitionAbortSubject.next(
                            o,
                        );
                    }
                });
                this.eventsSubscription.add(n);
            }
            resetRootComponentType(n) {
                ((this.routerState.root.component = n),
                    (this.navigationTransitions.rootComponentType = n));
            }
            initialNavigation() {
                (this.setUpLocationChangeListener(),
                    this.navigationTransitions.hasRequestedNavigation ||
                        this.navigateToSyncWithBrowser(
                            this.location.path(!0),
                            Bn,
                            this.stateManager.restoredState(),
                        ));
            }
            setUpLocationChangeListener() {
                this.nonRouterCurrentEntryChangeSubscription ??=
                    this.stateManager.registerNonRouterCurrentEntryChangeListener(
                        (n, r) => {
                            setTimeout(() => {
                                this.navigateToSyncWithBrowser(
                                    n,
                                    "popstate",
                                    r,
                                );
                            }, 0);
                        },
                    );
            }
            navigateToSyncWithBrowser(n, r, o) {
                let i = { replaceUrl: !0 },
                    s = o?.navigationId ? o : null;
                if (o) {
                    let a = m({}, o);
                    (delete a.navigationId,
                        delete a.ɵrouterPageId,
                        Object.keys(a).length !== 0 && (i.state = a));
                }
                let c = this.parseUrl(n);
                this.scheduleNavigation(c, r, s, i);
            }
            get url() {
                return this.serializeUrl(this.currentUrlTree);
            }
            getCurrentNavigation() {
                return this.navigationTransitions.currentNavigation;
            }
            get lastSuccessfulNavigation() {
                return this.navigationTransitions.lastSuccessfulNavigation;
            }
            resetConfig(n) {
                ((this.config = n.map($a)), (this.navigated = !1));
            }
            ngOnDestroy() {
                this.dispose();
            }
            dispose() {
                (this._events.unsubscribe(),
                    this.navigationTransitions.complete(),
                    this.nonRouterCurrentEntryChangeSubscription &&
                        (this.nonRouterCurrentEntryChangeSubscription.unsubscribe(),
                        (this.nonRouterCurrentEntryChangeSubscription =
                            void 0)),
                    (this.disposed = !0),
                    this.eventsSubscription.unsubscribe());
            }
            createUrlTree(n, r = {}) {
                let {
                        relativeTo: o,
                        queryParams: i,
                        fragment: s,
                        queryParamsHandling: c,
                        preserveFragment: a,
                    } = r,
                    u = a ? this.currentUrlTree.fragment : s,
                    l = null;
                switch (c ?? this.options.defaultQueryParamsHandling) {
                    case "merge":
                        l = m(m({}, this.currentUrlTree.queryParams), i);
                        break;
                    case "preserve":
                        l = this.currentUrlTree.queryParams;
                        break;
                    default:
                        l = i || null;
                }
                l !== null && (l = this.removeEmptyProps(l));
                let d;
                try {
                    let h = o ? o.snapshot : this.routerState.snapshot.root;
                    d = Cf(h);
                } catch {
                    ((typeof n[0] != "string" || n[0][0] !== "/") && (n = []),
                        (d = this.currentUrlTree.root));
                }
                return Ef(d, n, l, u ?? null);
            }
            navigateByUrl(n, r = { skipLocationChange: !1 }) {
                let o = Hn(n) ? n : this.parseUrl(n),
                    i = this.urlHandlingStrategy.merge(o, this.rawUrlTree);
                return this.scheduleNavigation(i, Bn, null, r);
            }
            navigate(n, r = { skipLocationChange: !1 }) {
                return (ZD(n), this.navigateByUrl(this.createUrlTree(n, r), r));
            }
            serializeUrl(n) {
                return this.urlSerializer.serialize(n);
            }
            parseUrl(n) {
                try {
                    return this.urlSerializer.parse(n);
                } catch {
                    return this.urlSerializer.parse("/");
                }
            }
            isActive(n, r) {
                let o;
                if (
                    (r === !0
                        ? (o = m({}, GD))
                        : r === !1
                          ? (o = m({}, WD))
                          : (o = r),
                    Hn(n))
                )
                    return rf(this.currentUrlTree, n, o);
                let i = this.parseUrl(n);
                return rf(this.currentUrlTree, i, o);
            }
            removeEmptyProps(n) {
                return Object.entries(n).reduce(
                    (r, [o, i]) => (i != null && (r[o] = i), r),
                    {},
                );
            }
            scheduleNavigation(n, r, o, i, s) {
                if (this.disposed) return Promise.resolve(!1);
                let c, a, u;
                s
                    ? ((c = s.resolve), (a = s.reject), (u = s.promise))
                    : (u = new Promise((d, h) => {
                          ((c = d), (a = h));
                      }));
                let l = this.pendingTasks.add();
                return (
                    qD(this, () => {
                        queueMicrotask(() => this.pendingTasks.remove(l));
                    }),
                    this.navigationTransitions.handleNavigationRequest({
                        source: r,
                        restoredState: o,
                        currentUrlTree: this.currentUrlTree,
                        currentRawUrl: this.currentUrlTree,
                        rawUrl: n,
                        extras: i,
                        resolve: c,
                        reject: a,
                        promise: u,
                        currentSnapshot: this.routerState.snapshot,
                        currentRouterState: this.routerState,
                    }),
                    u.catch((d) => Promise.reject(d))
                );
            }
            static ɵfac = function (r) {
                return new (r || e)();
            };
            static ɵprov = C({ token: e, factory: e.ɵfac, providedIn: "root" });
        }
        return e;
    })();
function ZD(e) {
    for (let t = 0; t < e.length; t++) if (e[t] == null) throw new v(4008, !1);
}
function QD(e) {
    return !(e instanceof Wn) && !(e instanceof Xt);
}
var YD = new w("");
function Bf(e, ...t) {
    return to([
        { provide: Ua, multi: !0, useValue: e },
        [],
        { provide: en, useFactory: KD, deps: [Vf] },
        { provide: Gs, multi: !0, useFactory: JD },
        t.map((n) => n.ɵproviders),
    ]);
}
function KD(e) {
    return e.routerState.root;
}
function JD() {
    let e = p(Te);
    return (t) => {
        let n = e.get(Ze);
        if (t !== n.components[0]) return;
        let r = e.get(Vf),
            o = e.get(XD);
        (e.get(ew) === 1 && r.initialNavigation(),
            e.get(tw, null, S.Optional)?.setUpPreloading(),
            e.get(YD, null, S.Optional)?.init(),
            r.resetRootComponentType(n.componentTypes[0]),
            o.closed || (o.next(), o.complete(), o.unsubscribe()));
    };
}
var XD = new w("", { factory: () => new K() }),
    ew = new w("", { providedIn: "root", factory: () => 1 });
var tw = new w("");
var $f = [];
var Uf = { providers: [Nd({ eventCoalescing: !0 }), Bf($f)] };
var nw = () => ({ title: "Explore the Docs", link: "https://angular.dev" }),
    rw = () => ({
        title: "Learn with Tutorials",
        link: "https://angular.dev/tutorials",
    }),
    ow = () => ({ title: "CLI Docs", link: "https://angular.dev/tools/cli" }),
    iw = () => ({
        title: "Angular Language Service",
        link: "https://angular.dev/tools/language-service",
    }),
    sw = () => ({
        title: "Angular DevTools",
        link: "https://angular.dev/tools/devtools",
    }),
    aw = (e, t, n, r, o) => [e, t, n, r, o],
    cw = (e, t) => t.title;
function uw(e, t) {
    if (
        (e & 1 &&
            (q(0, "a", 21)(1, "span"),
            Do(2),
            te(),
            Ht(),
            q(3, "svg", 32),
            oe(4, "path", 33),
            te()()),
        e & 2)
    ) {
        let n = t.$implicit;
        (Ws("href", n.link, Bl), ho(2), Zs(n.title));
    }
}
var zo = class e {
    title = "verbatim.app";
    static ɵfac = function (n) {
        return new (n || e)();
    };
    static ɵcmp = yo({
        type: e,
        selectors: [["app-root"]],
        decls: 39,
        vars: 12,
        consts: [
            [1, "main"],
            [1, "content"],
            [1, "left-side"],
            [
                "xmlns",
                "http://www.w3.org/2000/svg",
                "viewBox",
                "0 0 982 239",
                "fill",
                "none",
                1,
                "angular-logo",
            ],
            ["clip-path", "url(#a)"],
            [
                "fill",
                "url(#b)",
                "d",
                "M388.676 191.625h30.849L363.31 31.828h-35.758l-56.215 159.797h30.848l13.174-39.356h60.061l13.256 39.356Zm-65.461-62.675 21.602-64.311h1.227l21.602 64.311h-44.431Zm126.831-7.527v70.202h-28.23V71.839h27.002v20.374h1.392c2.782-6.71 7.2-12.028 13.255-15.956 6.056-3.927 13.584-5.89 22.503-5.89 8.264 0 15.465 1.8 21.684 5.318 6.137 3.518 10.964 8.673 14.319 15.382 3.437 6.71 5.074 14.81 4.992 24.383v76.175h-28.23v-71.92c0-8.019-2.046-14.237-6.219-18.819-4.173-4.5-9.819-6.791-17.102-6.791-4.91 0-9.328 1.063-13.174 3.272-3.846 2.128-6.792 5.237-9.001 9.328-2.046 4.009-3.191 8.918-3.191 14.728ZM589.233 239c-10.147 0-18.82-1.391-26.103-4.091-7.282-2.7-13.092-6.382-17.511-10.964-4.418-4.582-7.528-9.655-9.164-15.219l25.448-6.136c1.145 2.372 2.782 4.663 4.991 6.954 2.209 2.291 5.155 4.255 8.837 5.81 3.683 1.554 8.428 2.291 14.074 2.291 8.019 0 14.647-1.964 19.884-5.81 5.237-3.845 7.856-10.227 7.856-19.064v-22.665h-1.391c-1.473 2.946-3.601 5.892-6.383 9.001-2.782 3.109-6.464 5.645-10.965 7.691-4.582 2.046-10.228 3.109-17.101 3.109-9.165 0-17.511-2.209-25.039-6.545-7.446-4.337-13.42-10.883-17.757-19.474-4.418-8.673-6.628-19.473-6.628-32.565 0-13.091 2.21-24.301 6.628-33.383 4.419-9.082 10.311-15.955 17.839-20.7 7.528-4.746 15.874-7.037 25.039-7.037 7.037 0 12.846 1.145 17.347 3.518 4.582 2.373 8.182 5.236 10.883 8.51 2.7 3.272 4.746 6.382 6.137 9.327h1.554v-19.8h27.821v121.749c0 10.228-2.454 18.737-7.364 25.447-4.91 6.709-11.538 11.7-20.048 15.055-8.509 3.355-18.165 4.991-28.884 4.991Zm.245-71.266c5.974 0 11.047-1.473 15.302-4.337 4.173-2.945 7.446-7.118 9.573-12.519 2.21-5.482 3.274-12.027 3.274-19.637 0-7.609-1.064-14.155-3.274-19.8-2.127-5.646-5.318-10.064-9.491-13.255-4.174-3.11-9.329-4.746-15.384-4.746s-11.537 1.636-15.792 4.91c-4.173 3.272-7.365 7.772-9.492 13.418-2.128 5.727-3.191 12.191-3.191 19.392 0 7.2 1.063 13.745 3.273 19.228 2.127 5.482 5.318 9.736 9.573 12.764 4.174 3.027 9.41 4.582 15.629 4.582Zm141.56-26.51V71.839h28.23v119.786h-27.412v-21.273h-1.227c-2.7 6.709-7.119 12.191-13.338 16.446-6.137 4.255-13.747 6.382-22.748 6.382-7.855 0-14.81-1.718-20.783-5.237-5.974-3.518-10.72-8.591-14.075-15.382-3.355-6.709-5.073-14.891-5.073-24.464V71.839h28.312v71.921c0 7.609 2.046 13.664 6.219 18.083 4.173 4.5 9.655 6.709 16.365 6.709 4.173 0 8.183-.982 12.111-3.028 3.927-2.045 7.118-5.072 9.655-9.082 2.537-4.091 3.764-9.164 3.764-15.218Zm65.707-109.395v159.796h-28.23V31.828h28.23Zm44.841 162.169c-7.61 0-14.402-1.391-20.457-4.091-6.055-2.7-10.883-6.791-14.32-12.109-3.518-5.319-5.237-11.946-5.237-19.801 0-6.791 1.228-12.355 3.765-16.773 2.536-4.419 5.891-7.937 10.228-10.637 4.337-2.618 9.164-4.664 14.647-6.055 5.4-1.391 11.046-2.373 16.856-3.027 7.037-.737 12.683-1.391 17.102-1.964 4.337-.573 7.528-1.555 9.574-2.782 1.963-1.309 3.027-3.273 3.027-5.973v-.491c0-5.891-1.718-10.391-5.237-13.664-3.518-3.191-8.51-4.828-15.056-4.828-6.955 0-12.356 1.473-16.447 4.5-4.009 3.028-6.71 6.546-8.183 10.719l-26.348-3.764c2.046-7.282 5.483-13.336 10.31-18.328 4.746-4.909 10.638-8.59 17.511-11.045 6.955-2.455 14.565-3.682 22.912-3.682 5.809 0 11.537.654 17.265 2.045s10.965 3.6 15.711 6.71c4.746 3.109 8.51 7.282 11.455 12.6 2.864 5.318 4.337 11.946 4.337 19.883v80.184h-27.166v-16.446h-.9c-1.719 3.355-4.092 6.464-7.201 9.328-3.109 2.864-6.955 5.237-11.619 6.955-4.828 1.718-10.229 2.536-16.529 2.536Zm7.364-20.701c5.646 0 10.556-1.145 14.729-3.354 4.173-2.291 7.364-5.237 9.655-9.001 2.292-3.763 3.355-7.854 3.355-12.273v-14.155c-.9.737-2.373 1.391-4.5 2.046-2.128.654-4.419 1.145-7.037 1.636-2.619.491-5.155.9-7.692 1.227-2.537.328-4.746.655-6.628.901-4.173.572-8.019 1.472-11.292 2.781-3.355 1.31-5.973 3.11-7.855 5.401-1.964 2.291-2.864 5.318-2.864 8.918 0 5.237 1.882 9.164 5.728 11.782 3.682 2.782 8.51 4.091 14.401 4.091Zm64.643 18.328V71.839h27.412v19.965h1.227c2.21-6.955 5.974-12.274 11.292-16.038 5.319-3.763 11.456-5.645 18.329-5.645 1.555 0 3.355.082 5.237.163 1.964.164 3.601.328 4.91.573v25.938c-1.227-.41-3.109-.819-5.646-1.146a58.814 58.814 0 0 0-7.446-.49c-5.155 0-9.738 1.145-13.829 3.354-4.091 2.209-7.282 5.236-9.655 9.164-2.373 3.927-3.519 8.427-3.519 13.5v70.448h-28.312ZM222.077 39.192l-8.019 125.923L137.387 0l84.69 39.192Zm-53.105 162.825-57.933 33.056-57.934-33.056 11.783-28.556h92.301l11.783 28.556ZM111.039 62.675l30.357 73.803H80.681l30.358-73.803ZM7.937 165.115 0 39.192 84.69 0 7.937 165.115Z",
            ],
            [
                "fill",
                "url(#c)",
                "d",
                "M388.676 191.625h30.849L363.31 31.828h-35.758l-56.215 159.797h30.848l13.174-39.356h60.061l13.256 39.356Zm-65.461-62.675 21.602-64.311h1.227l21.602 64.311h-44.431Zm126.831-7.527v70.202h-28.23V71.839h27.002v20.374h1.392c2.782-6.71 7.2-12.028 13.255-15.956 6.056-3.927 13.584-5.89 22.503-5.89 8.264 0 15.465 1.8 21.684 5.318 6.137 3.518 10.964 8.673 14.319 15.382 3.437 6.71 5.074 14.81 4.992 24.383v76.175h-28.23v-71.92c0-8.019-2.046-14.237-6.219-18.819-4.173-4.5-9.819-6.791-17.102-6.791-4.91 0-9.328 1.063-13.174 3.272-3.846 2.128-6.792 5.237-9.001 9.328-2.046 4.009-3.191 8.918-3.191 14.728ZM589.233 239c-10.147 0-18.82-1.391-26.103-4.091-7.282-2.7-13.092-6.382-17.511-10.964-4.418-4.582-7.528-9.655-9.164-15.219l25.448-6.136c1.145 2.372 2.782 4.663 4.991 6.954 2.209 2.291 5.155 4.255 8.837 5.81 3.683 1.554 8.428 2.291 14.074 2.291 8.019 0 14.647-1.964 19.884-5.81 5.237-3.845 7.856-10.227 7.856-19.064v-22.665h-1.391c-1.473 2.946-3.601 5.892-6.383 9.001-2.782 3.109-6.464 5.645-10.965 7.691-4.582 2.046-10.228 3.109-17.101 3.109-9.165 0-17.511-2.209-25.039-6.545-7.446-4.337-13.42-10.883-17.757-19.474-4.418-8.673-6.628-19.473-6.628-32.565 0-13.091 2.21-24.301 6.628-33.383 4.419-9.082 10.311-15.955 17.839-20.7 7.528-4.746 15.874-7.037 25.039-7.037 7.037 0 12.846 1.145 17.347 3.518 4.582 2.373 8.182 5.236 10.883 8.51 2.7 3.272 4.746 6.382 6.137 9.327h1.554v-19.8h27.821v121.749c0 10.228-2.454 18.737-7.364 25.447-4.91 6.709-11.538 11.7-20.048 15.055-8.509 3.355-18.165 4.991-28.884 4.991Zm.245-71.266c5.974 0 11.047-1.473 15.302-4.337 4.173-2.945 7.446-7.118 9.573-12.519 2.21-5.482 3.274-12.027 3.274-19.637 0-7.609-1.064-14.155-3.274-19.8-2.127-5.646-5.318-10.064-9.491-13.255-4.174-3.11-9.329-4.746-15.384-4.746s-11.537 1.636-15.792 4.91c-4.173 3.272-7.365 7.772-9.492 13.418-2.128 5.727-3.191 12.191-3.191 19.392 0 7.2 1.063 13.745 3.273 19.228 2.127 5.482 5.318 9.736 9.573 12.764 4.174 3.027 9.41 4.582 15.629 4.582Zm141.56-26.51V71.839h28.23v119.786h-27.412v-21.273h-1.227c-2.7 6.709-7.119 12.191-13.338 16.446-6.137 4.255-13.747 6.382-22.748 6.382-7.855 0-14.81-1.718-20.783-5.237-5.974-3.518-10.72-8.591-14.075-15.382-3.355-6.709-5.073-14.891-5.073-24.464V71.839h28.312v71.921c0 7.609 2.046 13.664 6.219 18.083 4.173 4.5 9.655 6.709 16.365 6.709 4.173 0 8.183-.982 12.111-3.028 3.927-2.045 7.118-5.072 9.655-9.082 2.537-4.091 3.764-9.164 3.764-15.218Zm65.707-109.395v159.796h-28.23V31.828h28.23Zm44.841 162.169c-7.61 0-14.402-1.391-20.457-4.091-6.055-2.7-10.883-6.791-14.32-12.109-3.518-5.319-5.237-11.946-5.237-19.801 0-6.791 1.228-12.355 3.765-16.773 2.536-4.419 5.891-7.937 10.228-10.637 4.337-2.618 9.164-4.664 14.647-6.055 5.4-1.391 11.046-2.373 16.856-3.027 7.037-.737 12.683-1.391 17.102-1.964 4.337-.573 7.528-1.555 9.574-2.782 1.963-1.309 3.027-3.273 3.027-5.973v-.491c0-5.891-1.718-10.391-5.237-13.664-3.518-3.191-8.51-4.828-15.056-4.828-6.955 0-12.356 1.473-16.447 4.5-4.009 3.028-6.71 6.546-8.183 10.719l-26.348-3.764c2.046-7.282 5.483-13.336 10.31-18.328 4.746-4.909 10.638-8.59 17.511-11.045 6.955-2.455 14.565-3.682 22.912-3.682 5.809 0 11.537.654 17.265 2.045s10.965 3.6 15.711 6.71c4.746 3.109 8.51 7.282 11.455 12.6 2.864 5.318 4.337 11.946 4.337 19.883v80.184h-27.166v-16.446h-.9c-1.719 3.355-4.092 6.464-7.201 9.328-3.109 2.864-6.955 5.237-11.619 6.955-4.828 1.718-10.229 2.536-16.529 2.536Zm7.364-20.701c5.646 0 10.556-1.145 14.729-3.354 4.173-2.291 7.364-5.237 9.655-9.001 2.292-3.763 3.355-7.854 3.355-12.273v-14.155c-.9.737-2.373 1.391-4.5 2.046-2.128.654-4.419 1.145-7.037 1.636-2.619.491-5.155.9-7.692 1.227-2.537.328-4.746.655-6.628.901-4.173.572-8.019 1.472-11.292 2.781-3.355 1.31-5.973 3.11-7.855 5.401-1.964 2.291-2.864 5.318-2.864 8.918 0 5.237 1.882 9.164 5.728 11.782 3.682 2.782 8.51 4.091 14.401 4.091Zm64.643 18.328V71.839h27.412v19.965h1.227c2.21-6.955 5.974-12.274 11.292-16.038 5.319-3.763 11.456-5.645 18.329-5.645 1.555 0 3.355.082 5.237.163 1.964.164 3.601.328 4.91.573v25.938c-1.227-.41-3.109-.819-5.646-1.146a58.814 58.814 0 0 0-7.446-.49c-5.155 0-9.738 1.145-13.829 3.354-4.091 2.209-7.282 5.236-9.655 9.164-2.373 3.927-3.519 8.427-3.519 13.5v70.448h-28.312ZM222.077 39.192l-8.019 125.923L137.387 0l84.69 39.192Zm-53.105 162.825-57.933 33.056-57.934-33.056 11.783-28.556h92.301l11.783 28.556ZM111.039 62.675l30.357 73.803H80.681l30.358-73.803ZM7.937 165.115 0 39.192 84.69 0 7.937 165.115Z",
            ],
            [
                "id",
                "c",
                "cx",
                "0",
                "cy",
                "0",
                "r",
                "1",
                "gradientTransform",
                "rotate(118.122 171.182 60.81) scale(205.794)",
                "gradientUnits",
                "userSpaceOnUse",
            ],
            ["stop-color", "#FF41F8"],
            ["offset", ".707", "stop-color", "#FF41F8", "stop-opacity", ".5"],
            ["offset", "1", "stop-color", "#FF41F8", "stop-opacity", "0"],
            [
                "id",
                "b",
                "x1",
                "0",
                "x2",
                "982",
                "y1",
                "192",
                "y2",
                "192",
                "gradientUnits",
                "userSpaceOnUse",
            ],
            ["stop-color", "#F0060B"],
            ["offset", "0", "stop-color", "#F0070C"],
            ["offset", ".526", "stop-color", "#CC26D5"],
            ["offset", "1", "stop-color", "#7702FF"],
            ["id", "a"],
            ["fill", "#fff", "d", "M0 0h982v239H0z"],
            ["role", "separator", "aria-label", "Divider", 1, "divider"],
            [1, "right-side"],
            [1, "pill-group"],
            ["target", "_blank", "rel", "noopener", 1, "pill", 3, "href"],
            [1, "social-links"],
            [
                "href",
                "https://github.com/angular/angular",
                "aria-label",
                "Github",
                "target",
                "_blank",
                "rel",
                "noopener",
            ],
            [
                "width",
                "25",
                "height",
                "24",
                "viewBox",
                "0 0 25 24",
                "fill",
                "none",
                "xmlns",
                "http://www.w3.org/2000/svg",
                "alt",
                "Github",
            ],
            [
                "d",
                "M12.3047 0C5.50634 0 0 5.50942 0 12.3047C0 17.7423 3.52529 22.3535 8.41332 23.9787C9.02856 24.0946 9.25414 23.7142 9.25414 23.3871C9.25414 23.0949 9.24389 22.3207 9.23876 21.2953C5.81601 22.0377 5.09414 19.6444 5.09414 19.6444C4.53427 18.2243 3.72524 17.8449 3.72524 17.8449C2.61064 17.082 3.81137 17.0973 3.81137 17.0973C5.04697 17.1835 5.69604 18.3647 5.69604 18.3647C6.79321 20.2463 8.57636 19.7029 9.27978 19.3881C9.39052 18.5924 9.70736 18.0499 10.0591 17.7423C7.32641 17.4347 4.45429 16.3765 4.45429 11.6618C4.45429 10.3185 4.9311 9.22133 5.72065 8.36C5.58222 8.04931 5.16694 6.79833 5.82831 5.10337C5.82831 5.10337 6.85883 4.77319 9.2121 6.36459C10.1965 6.09082 11.2424 5.95546 12.2883 5.94931C13.3342 5.95546 14.3801 6.09082 15.3644 6.36459C17.7023 4.77319 18.7328 5.10337 18.7328 5.10337C19.3942 6.79833 18.9789 8.04931 18.8559 8.36C19.6403 9.22133 20.1171 10.3185 20.1171 11.6618C20.1171 16.3888 17.2409 17.4296 14.5031 17.7321C14.9338 18.1012 15.3337 18.8559 15.3337 20.0084C15.3337 21.6552 15.3183 22.978 15.3183 23.3779C15.3183 23.7009 15.5336 24.0854 16.1642 23.9623C21.0871 22.3484 24.6094 17.7341 24.6094 12.3047C24.6094 5.50942 19.0999 0 12.3047 0Z",
            ],
            [
                "href",
                "https://twitter.com/angular",
                "aria-label",
                "Twitter",
                "target",
                "_blank",
                "rel",
                "noopener",
            ],
            [
                "width",
                "24",
                "height",
                "24",
                "viewBox",
                "0 0 24 24",
                "fill",
                "none",
                "xmlns",
                "http://www.w3.org/2000/svg",
                "alt",
                "Twitter",
            ],
            [
                "d",
                "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
            ],
            [
                "href",
                "https://www.youtube.com/channel/UCbn1OgGei-DV7aSRo_HaAiw",
                "aria-label",
                "Youtube",
                "target",
                "_blank",
                "rel",
                "noopener",
            ],
            [
                "width",
                "29",
                "height",
                "20",
                "viewBox",
                "0 0 29 20",
                "fill",
                "none",
                "xmlns",
                "http://www.w3.org/2000/svg",
                "alt",
                "Youtube",
            ],
            [
                "fill-rule",
                "evenodd",
                "clip-rule",
                "evenodd",
                "d",
                "M27.4896 1.52422C27.9301 1.96749 28.2463 2.51866 28.4068 3.12258C29.0004 5.35161 29.0004 10 29.0004 10C29.0004 10 29.0004 14.6484 28.4068 16.8774C28.2463 17.4813 27.9301 18.0325 27.4896 18.4758C27.0492 18.9191 26.5 19.2389 25.8972 19.4032C23.6778 20 14.8068 20 14.8068 20C14.8068 20 5.93586 20 3.71651 19.4032C3.11363 19.2389 2.56449 18.9191 2.12405 18.4758C1.68361 18.0325 1.36732 17.4813 1.20683 16.8774C0.613281 14.6484 0.613281 10 0.613281 10C0.613281 10 0.613281 5.35161 1.20683 3.12258C1.36732 2.51866 1.68361 1.96749 2.12405 1.52422C2.56449 1.08095 3.11363 0.76113 3.71651 0.596774C5.93586 0 14.8068 0 14.8068 0C14.8068 0 23.6778 0 25.8972 0.596774C26.5 0.76113 27.0492 1.08095 27.4896 1.52422ZM19.3229 10L11.9036 5.77905V14.221L19.3229 10Z",
            ],
            [
                "xmlns",
                "http://www.w3.org/2000/svg",
                "height",
                "14",
                "viewBox",
                "0 -960 960 960",
                "width",
                "14",
                "fill",
                "currentColor",
            ],
            [
                "d",
                "M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z",
            ],
        ],
        template: function (n, r) {
            (n & 1 &&
                (q(0, "main", 0)(1, "div", 1)(2, "div", 2),
                Ht(),
                q(3, "svg", 3)(4, "g", 4),
                oe(5, "path", 5)(6, "path", 6),
                te(),
                q(7, "defs")(8, "radialGradient", 7),
                oe(9, "stop", 8)(10, "stop", 9)(11, "stop", 10),
                te(),
                q(12, "linearGradient", 11),
                oe(13, "stop", 12)(14, "stop", 13)(15, "stop", 14)(
                    16,
                    "stop",
                    15,
                ),
                te(),
                q(17, "clipPath", 16),
                oe(18, "path", 17),
                te()()(),
                _n(),
                q(19, "h1"),
                Do(20),
                te(),
                q(21, "p"),
                Do(22, "Congratulations! Your app is running. \u{1F389}"),
                te()(),
                oe(23, "div", 18),
                q(24, "div", 19)(25, "div", 20),
                Md(26, uw, 5, 2, "a", 21, cw),
                te(),
                q(28, "div", 22)(29, "a", 23),
                Ht(),
                q(30, "svg", 24),
                oe(31, "path", 25),
                te()(),
                _n(),
                q(32, "a", 26),
                Ht(),
                q(33, "svg", 27),
                oe(34, "path", 28),
                te()(),
                _n(),
                q(35, "a", 29),
                Ht(),
                q(36, "svg", 30),
                oe(37, "path", 31),
                te()()()()()(),
                _n(),
                oe(38, "router-outlet")),
                n & 2 &&
                    (ho(20),
                    wo("Hello, ", r.title, ""),
                    ho(6),
                    _d(
                        Td(
                            6,
                            aw,
                            qt(1, nw),
                            qt(2, rw),
                            qt(3, ow),
                            qt(4, iw),
                            qt(5, sw),
                        ),
                    )));
        },
        dependencies: [ja],
        styles: [
            '[_nghost-%COMP%]{--bright-blue: oklch(51.01% .274 263.83);--electric-violet: oklch(53.18% .28 296.97);--french-violet: oklch(47.66% .246 305.88);--vivid-pink: oklch(69.02% .277 332.77);--hot-red: oklch(61.42% .238 15.34);--orange-red: oklch(63.32% .24 31.68);--gray-900: oklch(19.37% .006 300.98);--gray-700: oklch(36.98% .014 302.71);--gray-400: oklch(70.9% .015 304.04);--red-to-pink-to-purple-vertical-gradient: linear-gradient( 180deg, var(--orange-red) 0%, var(--vivid-pink) 50%, var(--electric-violet) 100% );--red-to-pink-to-purple-horizontal-gradient: linear-gradient( 90deg, var(--orange-red) 0%, var(--vivid-pink) 50%, var(--electric-violet) 100% );--pill-accent: var(--bright-blue);font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol;box-sizing:border-box;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}h1[_ngcontent-%COMP%]{font-size:3.125rem;color:var(--gray-900);font-weight:500;line-height:100%;letter-spacing:-.125rem;margin:0;font-family:Inter Tight,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol}p[_ngcontent-%COMP%]{margin:0;color:var(--gray-700)}main[_ngcontent-%COMP%]{width:100%;min-height:100%;display:flex;justify-content:center;align-items:center;padding:1rem;box-sizing:inherit;position:relative}.angular-logo[_ngcontent-%COMP%]{max-width:9.2rem}.content[_ngcontent-%COMP%]{display:flex;justify-content:space-around;width:100%;max-width:700px;margin-bottom:3rem}.content[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{margin-top:1.75rem}.content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin-top:1.5rem}.divider[_ngcontent-%COMP%]{width:1px;background:var(--red-to-pink-to-purple-vertical-gradient);margin-inline:.5rem}.pill-group[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:start;flex-wrap:wrap;gap:1.25rem}.pill[_ngcontent-%COMP%]{display:flex;align-items:center;--pill-accent: var(--bright-blue);background:color-mix(in srgb,var(--pill-accent) 5%,transparent);color:var(--pill-accent);padding-inline:.75rem;padding-block:.375rem;border-radius:2.75rem;border:0;transition:background .3s ease;font-family:var(--inter-font);font-size:.875rem;font-style:normal;font-weight:500;line-height:1.4rem;letter-spacing:-.00875rem;text-decoration:none}.pill[_ngcontent-%COMP%]:hover{background:color-mix(in srgb,var(--pill-accent) 15%,transparent)}.pill-group[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:nth-child(6n+1){--pill-accent: var(--bright-blue)}.pill-group[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:nth-child(6n+2){--pill-accent: var(--french-violet)}.pill-group[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:nth-child(6n+3), .pill-group[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:nth-child(6n+4), .pill-group[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:nth-child(6n+5){--pill-accent: var(--hot-red)}.pill-group[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%]{margin-inline-start:.25rem}.social-links[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.73rem;margin-top:1.5rem}.social-links[_ngcontent-%COMP%]   path[_ngcontent-%COMP%]{transition:fill .3s ease;fill:var(--gray-400)}.social-links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%]   path[_ngcontent-%COMP%]{fill:var(--gray-900)}@media screen and (max-width: 650px){.content[_ngcontent-%COMP%]{flex-direction:column;width:max-content}.divider[_ngcontent-%COMP%]{height:1px;width:100%;background:var(--red-to-pink-to-purple-horizontal-gradient);margin-block:1.5rem}}',
        ],
    });
};
tf(zo, Uf).catch((e) => console.error(e));
