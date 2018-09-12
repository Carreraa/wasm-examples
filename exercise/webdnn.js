(function (e, t) {
    'object' == typeof exports && 'object' == typeof module ? module.exports = t() : 'function' == typeof define && define.amd ? define([], t) : 'object' == typeof exports ? exports.WebDNN = t() : e.WebDNN = t()
})('undefined' == typeof self ? this : self, function () {
    var e = String.fromCharCode;
    return function (e) {
        function t(n) {
            if (a[n]) return a[n].exports;
            var r = a[n] = {i: n, l: !1, exports: {}};
            return e[n].call(r.exports, r, r.exports, t), r.l = !0, r.exports
        }

        var a = {};
        return t.m = e, t.c = a, t.d = function (e, a, n) {
            t.o(e, a) || Object.defineProperty(e, a, {configurable: !1, enumerable: !0, get: n})
        }, t.n = function (e) {
            var a = e && e.__esModule ? function () {
                return e['default']
            } : function () {
                return e
            };
            return t.d(a, 'a', a), a
        }, t.o = function (e, t) {
            return Object.prototype.hasOwnProperty.call(e, t)
        }, t.p = '', t(t.s = 1)
    }([function (e, t) {
        'use strict';

        function a(e, t) {
            return Object.prototype.hasOwnProperty.call(e, t)
        }

        var n = 'undefined' != typeof Uint8Array && 'undefined' != typeof Uint16Array && 'undefined' != typeof Int32Array;
        t.assign = function (e) {
            for (var t = Array.prototype.slice.call(arguments, 1); t.length;) {
                var n = t.shift();
                if (n) {
                    if ('object' != typeof n) throw new TypeError(n + 'must be non-object');
                    for (var r in n) a(n, r) && (e[r] = n[r])
                }
            }
            return e
        }, t.shrinkBuf = function (e, t) {
            return e.length === t ? e : e.subarray ? e.subarray(0, t) : (e.length = t, e)
        };
        var r = {
            arraySet: function (e, t, a, n, r) {
                if (t.subarray && e.subarray) return void e.set(t.subarray(a, a + n), r);
                for (var o = 0; o < n; o++) e[r + o] = t[a + o]
            }, flattenChunks: function (e) {
                var t, a, n, r, i, o;
                for (n = 0, t = 0, a = e.length; t < a; t++) n += e[t].length;
                for (o = new Uint8Array(n), r = 0, (t = 0, a = e.length); t < a; t++) i = e[t], o.set(i, r), r += i.length;
                return o
            }
        }, i = {
            arraySet: function (e, t, a, n, r) {
                for (var o = 0; o < n; o++) e[r + o] = t[a + o]
            }, flattenChunks: function (e) {
                return [].concat.apply([], e)
            }
        };
        t.setTyped = function (e) {
            e ? (t.Buf8 = Uint8Array, t.Buf16 = Uint16Array, t.Buf32 = Int32Array, t.assign(t, r)) : (t.Buf8 = Array, t.Buf16 = Array, t.Buf32 = Array, t.assign(t, i))
        }, t.setTyped(n)
    }, function (e, t, a) {
        'use strict';

        function n() {
            let e = {
                webgpu: h.webgpu.checkAvailability(),
                webgl: h.webgl.checkAvailability(),
                webassembly: h.webassembly.checkAvailability(),
                fallback: h.fallback.checkAvailability()
            }, t = ['webgpu', 'webgl', 'webassembly', 'fallback'].filter((t) => e[t]);
            return {status: e, defaultOrder: t}
        }

        async function r(e, t) {
            if (!(e in h)) throw new Error(`Unknown backend: "${e}"`);
            let a;
            try {
                a = new h[e](t), await a.init()
            } catch (t) {
                return console.warn(`Failed to initialize ${e} backend: ${t}`), null
            }
            return a
        }

        Object.defineProperty(t, '__esModule', {value: !0}), t.getConfiguration = function (e, t) {
            return e in u ? u[e] : t
        }, t.setConfiguration = function (e, t) {
            u[e] = t
        }, t.getBackendAvailability = n, t.load = async function (e, t = {}) {
            let {backendOrder: s = null, backendOptions: d = {}, cacheStrategy: l = 'latest', saveCache: c = !0, progressCallback: a, weightDirectory: i, transformUrlDelegate: o} = t;
            s || (s = n().defaultOrder), 'string' == typeof s && (s = [s]), s = s.slice(), -1 === s.indexOf('fallback') && s.concat(['fallback']);
            for (let n = (t) => (i && /\.bin/.test(t) && (t = t.replace(e, i)), o && (t = o(t)), t); 0 < s.length;) {
                let t = s.shift(), i = Object.assign({}, d[t]);
                i.transformUrlDelegate = n;
                let o = await r(t, i);
                if (o) {
                    try {
                        let t, n, r, i;
                        switch (l) {
                            case'latest':
                                if (r = await o.fetchDescriptor(e).catch(() => null), i = await o.restoreCachedDescriptor(e), i && r && i.converted_at === r.converted_at && (t = i, n = await o.restoreCachedParameters(e, a), n)) break;
                                if (r && (t = r, n = await o.fetchParameters(e, a), n)) break;
                                if (i && (t = i, n = await o.restoreCachedParameters(e, a), n)) break;
                                throw Error('Network error is occurred and no cache is exist.');
                            case'networkOnly':
                            case'networkFirst':
                                if (r = await o.fetchDescriptor(e).catch(() => null), r && (t = r, n = await o.fetchParameters(e, a), n)) break;
                                if ('networkOnly' === l) throw Error('Network error is occurred in "networkOnly" cache strategy');
                                if (i = await o.restoreCachedDescriptor(e), i && (t = i, n = await o.restoreCachedParameters(e, a), n)) break;
                                throw Error('Network error is occurred and no cache is exist.');
                            case'cacheOnly':
                            case'cacheFirst':
                                if (i = await o.restoreCachedDescriptor(e), i && (t = i, n = await o.restoreCachedParameters(e, a), n)) break;
                                if ('cacheOnly' === l) throw Error('No cache is exist in "cacheOnly" cache strategy');
                                if (r = await o.fetchDescriptor(e).catch(() => null), r && (t = r, n = await o.fetchParameters(e, a), n)) break;
                                throw Error('Network error is occurred and no cache is exist.');
                            default:
                                throw Error(`"${l}" is not valid cache strategy name: "latest", "networkFirst", "networkOnly", "cacheFirst", "cacheOnly" is available.`);
                        }
                        if (c) try {
                            await o.saveCache(e, t, n)
                        } catch (t) {
                        }
                        await o.setDescriptorAndParameters(t, n)
                    } catch (e) {
                        console.warn(`Model loading failed for ${t} backend. Trying next backend: ${e.message}`);
                        continue
                    }
                    return o
                }
            }
            throw new Error('No backend is available')
        };
        var i = a(21), o = a(36), s = a(37), d = a(39), l = a(40), c = a(43);
        a.d(t, 'Math', function () {
            return c
        }), a.d(t, 'Image', function () {
            return l
        });
        let u = {};
        const h = {webgpu: d.a, webgl: s.a, webassembly: o.a, fallback: i.a}
    }, function (e, t, a) {
        (function (t) {
            var a, a;
            /*!
    localForage -- Offline Storage, Improved
    Version 1.7.1
    https://localforage.github.io/localForage
    (c) 2013-2017 Mozilla, Apache License 2.0
*/
            (function (t) {
                e.exports = t()
            })(function () {
                return function d(c, e, t) {
                    function r(i, o) {
                        if (!e[i]) {
                            if (!c[i]) {
                                if (!o && 'function' == typeof a && a) return a(i, !0);
                                if (n) return n(i, !0);
                                var s = new Error('Cannot find module \'' + i + '\'');
                                throw s.code = 'MODULE_NOT_FOUND', s
                            }
                            var h = e[i] = {exports: {}};
                            c[i][0].call(h.exports, function (t) {
                                var e = c[i][1][t];
                                return r(e ? e : t)
                            }, h, h.exports, d, c, e, t)
                        }
                        return e[i].exports
                    }

                    for (var n = 'function' == typeof a && a, i = 0; i < t.length; i++) r(t[i]);
                    return r
                }({
                    1: [function (e, a) {
                        (function (e) {
                            'use strict';

                            function t() {
                                c = !0;
                                for (var e = l.length, t, a; e;) {
                                    for (a = l, l = [], t = -1; ++t < e;) a[t]();
                                    e = l.length
                                }
                                c = !1
                            }

                            var n = e.MutationObserver || e.WebKitMutationObserver, r;
                            if (n) {
                                var i = 0, o = new n(t), s = e.document.createTextNode('');
                                o.observe(s, {characterData: !0}), r = function () {
                                    s.data = i = ++i % 2
                                }
                            } else if (!e.setImmediate && 'undefined' != typeof e.MessageChannel) {
                                var d = new e.MessageChannel;
                                d.port1.onmessage = t, r = function () {
                                    d.port2.postMessage(0)
                                }
                            } else r = 'document' in e && 'onreadystatechange' in e.document.createElement('script') ? function () {
                                var a = e.document.createElement('script');
                                a.onreadystatechange = function () {
                                    t(), a.onreadystatechange = null, a.parentNode.removeChild(a), a = null
                                }, e.document.documentElement.appendChild(a)
                            } : function () {
                                setTimeout(t, 0)
                            };
                            var l = [], c;
                            a.exports = function (e) {
                                1 !== l.push(e) || c || r()
                            }
                        }).call(this, 'undefined' == typeof t ? 'undefined' == typeof self ? 'undefined' == typeof window ? {} : window : self : t)
                    }, {}], 2: [function (e, t) {
                        'use strict';

                        function a() {
                        }

                        function n(e) {
                            if ('function' != typeof e) throw new TypeError('resolver must be a function');
                            this.state = f, this.queue = [], this.outcome = void 0, e !== a && s(this, e)
                        }

                        function r(e, t, a) {
                            this.promise = e, 'function' == typeof t && (this.onFulfilled = t, this.callFulfilled = this.otherCallFulfilled), 'function' == typeof a && (this.onRejected = a, this.callRejected = this.otherCallRejected)
                        }

                        function i(t, e, a) {
                            l(function () {
                                var n;
                                try {
                                    n = e(a)
                                } catch (a) {
                                    return c.reject(t, a)
                                }
                                n === t ? c.reject(t, new TypeError('Cannot resolve promise with itself')) : c.resolve(t, n)
                            })
                        }

                        function o(e) {
                            var t = e && e.then;
                            if (e && ('object' == typeof e || 'function' == typeof e) && 'function' == typeof t) return function () {
                                t.apply(e, arguments)
                            }
                        }

                        function s(e, t) {
                            function a(t) {
                                r || (r = !0, c.reject(e, t))
                            }

                            function n(t) {
                                r || (r = !0, c.resolve(e, t))
                            }

                            var r = !1, i = d(function () {
                                t(n, a)
                            });
                            'error' === i.status && a(i.value)
                        }

                        function d(e, t) {
                            var a = {};
                            try {
                                a.value = e(t), a.status = 'success'
                            } catch (t) {
                                a.status = 'error', a.value = t
                            }
                            return a
                        }

                        var l = e(1), c = {}, u = ['REJECTED'], h = ['FULFILLED'], f = ['PENDING'];
                        t.exports = n, n.prototype['catch'] = function (e) {
                            return this.then(null, e)
                        }, n.prototype.then = function (e, t) {
                            if ('function' != typeof e && this.state === h || 'function' != typeof t && this.state === u) return this;
                            var n = new this.constructor(a);
                            if (this.state !== f) {
                                var o = this.state === h ? e : t;
                                i(n, o, this.outcome)
                            } else this.queue.push(new r(n, e, t));
                            return n
                        }, r.prototype.callFulfilled = function (e) {
                            c.resolve(this.promise, e)
                        }, r.prototype.otherCallFulfilled = function (e) {
                            i(this.promise, this.onFulfilled, e)
                        }, r.prototype.callRejected = function (e) {
                            c.reject(this.promise, e)
                        }, r.prototype.otherCallRejected = function (e) {
                            i(this.promise, this.onRejected, e)
                        }, c.resolve = function (e, t) {
                            var a = d(o, t);
                            if ('error' === a.status) return c.reject(e, a.value);
                            var n = a.value;
                            if (n) s(e, n); else {
                                e.state = h, e.outcome = t;
                                for (var r = -1, i = e.queue.length; ++r < i;) e.queue[r].callFulfilled(t)
                            }
                            return e
                        }, c.reject = function (e, t) {
                            e.state = u, e.outcome = t;
                            for (var a = -1, n = e.queue.length; ++a < n;) e.queue[a].callRejected(t);
                            return e
                        }, n.resolve = function (e) {
                            return e instanceof this ? e : c.resolve(new this(a), e)
                        }, n.reject = function (e) {
                            var t = new this(a);
                            return c.reject(t, e)
                        }, n.all = function (e) {
                            function t(e, t) {
                                n.resolve(e).then(function (e) {
                                    s[t] = e, ++d !== r || o || (o = !0, c.resolve(u, s))
                                }, function (e) {
                                    o || (o = !0, c.reject(u, e))
                                })
                            }

                            var n = this;
                            if ('[object Array]' !== Object.prototype.toString.call(e)) return this.reject(new TypeError('must be an array'));
                            var r = e.length, o = !1;
                            if (!r) return this.resolve([]);
                            for (var s = Array(r), d = 0, l = -1, u = new this(a); ++l < r;) t(e[l], l);
                            return u
                        }, n.race = function (e) {
                            function t(e) {
                                n.resolve(e).then(function (e) {
                                    o || (o = !0, c.resolve(i, e))
                                }, function (e) {
                                    o || (o = !0, c.reject(i, e))
                                })
                            }

                            var n = this;
                            if ('[object Array]' !== Object.prototype.toString.call(e)) return this.reject(new TypeError('must be an array'));
                            var r = e.length, o = !1;
                            if (!r) return this.resolve([]);
                            for (var s = -1, i = new this(a); ++s < r;) t(e[s]);
                            return i
                        }
                    }, {1: 1}], 3: [function (e) {
                        (function (t) {
                            'use strict';
                            'function' != typeof t.Promise && (t.Promise = e(2))
                        }).call(this, 'undefined' == typeof t ? 'undefined' == typeof self ? 'undefined' == typeof window ? {} : window : self : t)
                    }, {2: 2}], 4: [function (e, t) {
                        'use strict';

                        function a(e, t) {
                            if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function')
                        }

                        function n(e, t) {
                            e = e || [], t = t || {};
                            try {
                                return new Blob(e, t)
                            } catch (i) {
                                if ('TypeError' !== i.name) throw i;
                                for (var a = 'undefined' == typeof BlobBuilder ? 'undefined' == typeof MSBlobBuilder ? 'undefined' == typeof MozBlobBuilder ? WebKitBlobBuilder : MozBlobBuilder : MSBlobBuilder : BlobBuilder, n = new a, r = 0; r < e.length; r += 1) n.append(e[r]);
                                return n.getBlob(t.type)
                            }
                        }

                        function r(e, t) {
                            t && e.then(function (e) {
                                t(null, e)
                            }, function (e) {
                                t(e)
                            })
                        }

                        function i(e, t, a) {
                            'function' == typeof t && e.then(t), 'function' == typeof a && e['catch'](a)
                        }

                        function o(e) {
                            return 'string' != typeof e && (console.warn(e + ' used as a key, but it is not a string.'), e += ''), e
                        }

                        function s() {
                            if (arguments.length && 'function' == typeof arguments[arguments.length - 1]) return arguments[arguments.length - 1]
                        }

                        function d(e) {
                            for (var t = e.length, a = new ArrayBuffer(t), n = new Uint8Array(a), r = 0; r < t; r++) n[r] = e.charCodeAt(r);
                            return a
                        }

                        function l(e) {
                            return new F(function (t) {
                                var a = e.transaction(M, H), r = n(['']);
                                a.objectStore(M).put(r, 'key'), a.onabort = function (a) {
                                    a.preventDefault(), a.stopPropagation(), t(!1)
                                }, a.oncomplete = function () {
                                    var e = navigator.userAgent.match(/Chrome\/(\d+)/),
                                        a = navigator.userAgent.match(/Edge\//);
                                    t(a || !e || 43 <= parseInt(e[1], 10))
                                }
                            })['catch'](function () {
                                return !1
                            })
                        }

                        function c(e) {
                            return 'boolean' == typeof xe ? F.resolve(xe) : l(e).then(function (e) {
                                return xe = e, xe
                            })
                        }

                        function u(e) {
                            var t = U[e.name], a = {};
                            a.promise = new F(function (e, t) {
                                a.resolve = e, a.reject = t
                            }), t.deferredOperations.push(a), t.dbReady = t.dbReady ? t.dbReady.then(function () {
                                return a.promise
                            }) : a.promise
                        }

                        function h(e) {
                            var t = U[e.name], a = t.deferredOperations.pop();
                            if (a) return a.resolve(), a.promise
                        }

                        function f(e, t) {
                            var a = U[e.name], n = a.deferredOperations.pop();
                            if (n) return n.reject(t), n.promise
                        }

                        function _(t, e) {
                            return new F(function (a, n) {
                                if (U[t.name] = U[t.name] || k(), t.db) if (e) u(t), t.db.close(); else return a(t.db);
                                var r = [t.name];
                                e && r.push(t.version);
                                var i = O.open.apply(O, r);
                                e && (i.onupgradeneeded = function (a) {
                                    var e = i.result;
                                    try {
                                        e.createObjectStore(t.storeName), 1 >= a.oldVersion && e.createObjectStore(M)
                                    } catch (e) {
                                        if ('ConstraintError' === e.name) console.warn('The database "' + t.name + '" has been upgraded from version ' + a.oldVersion + ' to version ' + a.newVersion + ', but the storage "' + t.storeName + '" already exists.'); else throw e
                                    }
                                }), i.onerror = function (t) {
                                    t.preventDefault(), n(i.error)
                                }, i.onsuccess = function () {
                                    a(i.result), h(t)
                                }
                            })
                        }

                        function m(e) {
                            return _(e, !1)
                        }

                        function p(e) {
                            return _(e, !0)
                        }

                        function g(e, t) {
                            if (!e.db) return !0;
                            var a = !e.db.objectStoreNames.contains(e.storeName), n = e.version < e.db.version,
                                r = e.version > e.db.version;
                            if (n && (e.version !== t && console.warn('The database "' + e.name + '" can\'t be downgraded from version ' + e.db.version + ' to version ' + e.version + '.'), e.version = e.db.version), r || a) {
                                if (a) {
                                    var i = e.db.version + 1;
                                    i > e.version && (e.version = i)
                                }
                                return !0
                            }
                            return !1
                        }

                        function b(t) {
                            return new F(function (a, e) {
                                var n = new FileReader;
                                n.onerror = e, n.onloadend = function (n) {
                                    var e = btoa(n.target.result || '');
                                    a({__local_forage_encoded_blob: !0, data: e, type: t.type})
                                }, n.readAsBinaryString(t)
                            })
                        }

                        function y(e) {
                            var t = d(atob(e.data));
                            return n([t], {type: e.type})
                        }

                        function v(e) {
                            return e && e.__local_forage_encoded_blob
                        }

                        function w(e) {
                            var t = this, a = t._initReady().then(function () {
                                var e = U[t._dbInfo.name];
                                if (e && e.dbReady) return e.dbReady
                            });
                            return i(a, e, e), a
                        }

                        function E(e) {
                            u(e);
                            for (var t = U[e.name], a = t.forages, n = 0, r; n < a.length; n++) r = a[n], r._dbInfo.db && (r._dbInfo.db.close(), r._dbInfo.db = null);
                            return e.db = null, m(e).then(function (t) {
                                return e.db = t, g(e) ? p(e) : t
                            }).then(function (n) {
                                e.db = t.db = n;
                                for (var r = 0; r < a.length; r++) a[r]._dbInfo.db = n
                            })['catch'](function (t) {
                                throw f(e, t), t
                            })
                        }

                        function x(e, t, a, n) {
                            n === void 0 && (n = 1);
                            try {
                                var r = e.db.transaction(e.storeName, t);
                                a(null, r)
                            } catch (r) {
                                if (0 < n && (!e.db || 'InvalidStateError' === r.name || 'NotFoundError' === r.name)) return F.resolve().then(function () {
                                    if (!e.db || 'NotFoundError' === r.name && !e.db.objectStoreNames.contains(e.storeName) && e.version <= e.db.version) return e.db && (e.version = e.db.version + 1), p(e)
                                }).then(function () {
                                    return E(e).then(function () {
                                        x(e, t, a, n - 1)
                                    })
                                })['catch'](a);
                                a(r)
                            }
                        }

                        function k() {
                            return {forages: [], db: null, dbReady: null, deferredOperations: []}
                        }

                        function T(e) {
                            var t = 0.75 * e.length, a = e.length, n = 0, r, i, o, s, d;
                            '=' === e[e.length - 1] && (t--, '=' === e[e.length - 2] && t--);
                            var l = new ArrayBuffer(t), c = new Uint8Array(l);
                            for (r = 0; r < a; r += 4) i = X.indexOf(e[r]), o = X.indexOf(e[r + 1]), s = X.indexOf(e[r + 2]), d = X.indexOf(e[r + 3]), c[n++] = i << 2 | o >> 4, c[n++] = (15 & o) << 4 | s >> 2, c[n++] = (3 & s) << 6 | 63 & d;
                            return l
                        }

                        function I(e) {
                            var t = new Uint8Array(e), a = '', n;
                            for (n = 0; n < t.length; n += 3) a += X[t[n] >> 2], a += X[(3 & t[n]) << 4 | t[n + 1] >> 4], a += X[(15 & t[n + 1]) << 2 | t[n + 2] >> 6], a += X[63 & t[n + 2]];
                            return 2 == t.length % 3 ? a = a.substring(0, a.length - 1) + '=' : 1 == t.length % 3 && (a = a.substring(0, a.length - 2) + '=='), a
                        }

                        function R(e, t, a, n) {
                            e.executeSql('CREATE TABLE IF NOT EXISTS ' + t.storeName + ' (id INTEGER PRIMARY KEY, key unique, value)', [], a, n)
                        }

                        function S(e, a, n, r, i, o) {
                            e.executeSql(n, r, i, function (e, s) {
                                s.code === s.SYNTAX_ERR ? e.executeSql('SELECT name FROM sqlite_master WHERE type=\'table\' AND name = ?', [name], function (e, t) {
                                    t.rows.length ? o(e, s) : R(e, a, function () {
                                        e.executeSql(n, r, i, o)
                                    }, o)
                                }, o) : o(e, s)
                            }, o)
                        }

                        function C(e, t, a, n) {
                            var i = this;
                            e = o(e);
                            var s = new F(function (r, o) {
                                i.ready().then(function () {
                                    void 0 === t && (t = null);
                                    var s = t, d = i._dbInfo;
                                    d.serializer.serialize(t, function (l, t) {
                                        t ? o(t) : d.db.transaction(function (a) {
                                            S(a, d, 'INSERT OR REPLACE INTO ' + d.storeName + ' (key, value) VALUES (?, ?)', [e, l], function () {
                                                r(s)
                                            }, function (e, t) {
                                                o(t)
                                            })
                                        }, function (t) {
                                            if (t.code === t.QUOTA_ERR) {
                                                if (0 < n) return void r(C.apply(i, [e, s, a, n - 1]));
                                                o(t)
                                            }
                                        })
                                    })
                                })['catch'](o)
                            });
                            return r(s, a), s
                        }

                        function B(e) {
                            return new F(function (a, n) {
                                e.transaction(function (r) {
                                    r.executeSql('SELECT name FROM sqlite_master WHERE type=\'table\' AND name <> \'__WebKitDatabaseInfoTable__\'', [], function (n, t) {
                                        for (var r = [], o = 0; o < t.rows.length; o++) r.push(t.rows.item(o).name);
                                        a({db: e, storeNames: r})
                                    }, function (e, t) {
                                        n(t)
                                    })
                                }, function (e) {
                                    n(e)
                                })
                            })
                        }

                        function D(e, t) {
                            var a = e.name + '/';
                            return e.storeName !== t.storeName && (a += e.storeName + '/'), a
                        }

                        function A() {
                            var e = '_localforage_support_test';
                            try {
                                return localStorage.setItem(e, !0), localStorage.removeItem(e), !1
                            } catch (t) {
                                return !0
                            }
                        }

                        function z() {
                            return !A() || 0 < localStorage.length
                        }

                        function N(e, t) {
                            e[t] = function () {
                                var a = arguments;
                                return e.ready().then(function () {
                                    return e[t].apply(e, a)
                                })
                            }
                        }

                        function L() {
                            for (var e = 1, t; e < arguments.length; e++) if (t = arguments[e], t) for (var a in t) t.hasOwnProperty(a) && (arguments[0][a] = fe(t[a]) ? t[a].slice() : t[a]);
                            return arguments[0]
                        }

                        var P = 'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator ? function (e) {
                            return typeof e
                        } : function (e) {
                            return e && 'function' == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? 'symbol' : typeof e
                        }, O = function () {
                            try {
                                if ('undefined' != typeof indexedDB) return indexedDB;
                                if ('undefined' != typeof webkitIndexedDB) return webkitIndexedDB;
                                if ('undefined' != typeof mozIndexedDB) return mozIndexedDB;
                                if ('undefined' != typeof OIndexedDB) return OIndexedDB;
                                if ('undefined' != typeof msIndexedDB) return msIndexedDB
                            } catch (t) {
                            }
                        }();
                        'undefined' == typeof Promise && e(3);
                        var F = Promise, M = 'local-forage-detect-blob-support', U = {}, j = Object.prototype.toString,
                            W = 'readonly', H = 'readwrite', G = {
                                _driver: 'asyncStorage', _initStorage: function (e) {
                                    function t() {
                                        return F.resolve()
                                    }

                                    var a = this, n = {db: null};
                                    if (e) for (var r in e) n[r] = e[r];
                                    var i = U[n.name];
                                    i || (i = k(), U[n.name] = i), i.forages.push(a), a._initReady || (a._initReady = a.ready, a.ready = w);
                                    for (var o = [], s = 0, d; s < i.forages.length; s++) d = i.forages[s], d !== a && o.push(d._initReady()['catch'](t));
                                    var l = i.forages.slice(0);
                                    return F.all(o).then(function () {
                                        return n.db = i.db, m(n)
                                    }).then(function (e) {
                                        return n.db = e, g(n, a._defaultConfig.version) ? p(n) : e
                                    }).then(function (e) {
                                        n.db = i.db = e, a._dbInfo = n;
                                        for (var t = 0, r; t < l.length; t++) r = l[t], r !== a && (r._dbInfo.db = n.db, r._dbInfo.version = n.version)
                                    })
                                }, _support: function () {
                                    try {
                                        if (!O) return !1;
                                        var e = 'undefined' != typeof openDatabase && /(Safari|iPhone|iPad|iPod)/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent) && !/BlackBerry/.test(navigator.platform),
                                            t = 'function' == typeof fetch && -1 !== fetch.toString().indexOf('[native code');
                                        return (!e || t) && 'undefined' != typeof indexedDB && 'undefined' != typeof IDBKeyRange
                                    } catch (t) {
                                        return !1
                                    }
                                }(), iterate: function (e, t) {
                                    var a = this, n = new F(function (t, n) {
                                        a.ready().then(function () {
                                            x(a._dbInfo, W, function (r, i) {
                                                if (r) return n(r);
                                                try {
                                                    var o = i.objectStore(a._dbInfo.storeName), s = o.openCursor(), d = 1;
                                                    s.onsuccess = function () {
                                                        var a = s.result;
                                                        if (a) {
                                                            var n = a.value;
                                                            v(n) && (n = y(n));
                                                            var r = e(n, a.key, d++);
                                                            void 0 === r ? a['continue']() : t(r)
                                                        } else t()
                                                    }, s.onerror = function () {
                                                        n(s.error)
                                                    }
                                                } catch (t) {
                                                    n(t)
                                                }
                                            })
                                        })['catch'](n)
                                    });
                                    return r(n, t), n
                                }, getItem: function (e, t) {
                                    var a = this;
                                    e = o(e);
                                    var n = new F(function (t, n) {
                                        a.ready().then(function () {
                                            x(a._dbInfo, W, function (r, i) {
                                                if (r) return n(r);
                                                try {
                                                    var o = i.objectStore(a._dbInfo.storeName), s = o.get(e);
                                                    s.onsuccess = function () {
                                                        var e = s.result;
                                                        void 0 === e && (e = null), v(e) && (e = y(e)), t(e)
                                                    }, s.onerror = function () {
                                                        n(s.error)
                                                    }
                                                } catch (t) {
                                                    n(t)
                                                }
                                            })
                                        })['catch'](n)
                                    });
                                    return r(n, t), n
                                }, setItem: function (e, t, a) {
                                    var n = this;
                                    e = o(e);
                                    var i = new F(function (a, r) {
                                        var i;
                                        n.ready().then(function () {
                                            return i = n._dbInfo, '[object Blob]' === j.call(t) ? c(i.db).then(function (e) {
                                                return e ? t : b(t)
                                            }) : t
                                        }).then(function (t) {
                                            x(n._dbInfo, H, function (i, o) {
                                                if (i) return r(i);
                                                try {
                                                    var s = o.objectStore(n._dbInfo.storeName);
                                                    null === t && (t = void 0);
                                                    var d = s.put(t, e);
                                                    o.oncomplete = function () {
                                                        void 0 === t && (t = null), a(t)
                                                    }, o.onabort = o.onerror = function () {
                                                        var e = d.error ? d.error : d.transaction.error;
                                                        r(e)
                                                    }
                                                } catch (t) {
                                                    r(t)
                                                }
                                            })
                                        })['catch'](r)
                                    });
                                    return r(i, a), i
                                }, removeItem: function (e, t) {
                                    var a = this;
                                    e = o(e);
                                    var n = new F(function (t, n) {
                                        a.ready().then(function () {
                                            x(a._dbInfo, H, function (r, i) {
                                                if (r) return n(r);
                                                try {
                                                    var o = i.objectStore(a._dbInfo.storeName), s = o['delete'](e);
                                                    i.oncomplete = function () {
                                                        t()
                                                    }, i.onerror = function () {
                                                        n(s.error)
                                                    }, i.onabort = function () {
                                                        var e = s.error ? s.error : s.transaction.error;
                                                        n(e)
                                                    }
                                                } catch (t) {
                                                    n(t)
                                                }
                                            })
                                        })['catch'](n)
                                    });
                                    return r(n, t), n
                                }, clear: function (e) {
                                    var t = this, a = new F(function (e, a) {
                                        t.ready().then(function () {
                                            x(t._dbInfo, H, function (n, r) {
                                                if (n) return a(n);
                                                try {
                                                    var i = r.objectStore(t._dbInfo.storeName), o = i.clear();
                                                    r.oncomplete = function () {
                                                        e()
                                                    }, r.onabort = r.onerror = function () {
                                                        var e = o.error ? o.error : o.transaction.error;
                                                        a(e)
                                                    }
                                                } catch (t) {
                                                    a(t)
                                                }
                                            })
                                        })['catch'](a)
                                    });
                                    return r(a, e), a
                                }, length: function (e) {
                                    var t = this, a = new F(function (e, a) {
                                        t.ready().then(function () {
                                            x(t._dbInfo, W, function (n, r) {
                                                if (n) return a(n);
                                                try {
                                                    var i = r.objectStore(t._dbInfo.storeName), o = i.count();
                                                    o.onsuccess = function () {
                                                        e(o.result)
                                                    }, o.onerror = function () {
                                                        a(o.error)
                                                    }
                                                } catch (t) {
                                                    a(t)
                                                }
                                            })
                                        })['catch'](a)
                                    });
                                    return r(a, e), a
                                }, key: function (e, t) {
                                    var a = this, n = new F(function (t, n) {
                                        return 0 > e ? void t(null) : void a.ready().then(function () {
                                            x(a._dbInfo, W, function (r, i) {
                                                if (r) return n(r);
                                                try {
                                                    var o = i.objectStore(a._dbInfo.storeName), s = !1, d = o.openCursor();
                                                    d.onsuccess = function () {
                                                        var a = d.result;
                                                        return a ? void(0 === e ? t(a.key) : s ? t(a.key) : (s = !0, a.advance(e))) : void t(null)
                                                    }, d.onerror = function () {
                                                        n(d.error)
                                                    }
                                                } catch (t) {
                                                    n(t)
                                                }
                                            })
                                        })['catch'](n)
                                    });
                                    return r(n, t), n
                                }, keys: function (e) {
                                    var t = this, a = new F(function (e, a) {
                                        t.ready().then(function () {
                                            x(t._dbInfo, W, function (n, r) {
                                                if (n) return a(n);
                                                try {
                                                    var i = r.objectStore(t._dbInfo.storeName), o = i.openCursor(), s = [];
                                                    o.onsuccess = function () {
                                                        var t = o.result;
                                                        return t ? void(s.push(t.key), t['continue']()) : void e(s)
                                                    }, o.onerror = function () {
                                                        a(o.error)
                                                    }
                                                } catch (t) {
                                                    a(t)
                                                }
                                            })
                                        })['catch'](a)
                                    });
                                    return r(a, e), a
                                }, dropInstance: function (e, t) {
                                    t = s.apply(this, arguments);
                                    var a = this.config();
                                    e = 'function' != typeof e && e || {}, e.name || (e.name = e.name || a.name, e.storeName = e.storeName || a.storeName);
                                    var n = this, i;
                                    if (!e.name) i = F.reject('Invalid arguments'); else {
                                        var o = e.name === a.name && n._dbInfo.db,
                                            d = o ? F.resolve(n._dbInfo.db) : m(e).then(function (t) {
                                                var a = U[e.name], n = a.forages;
                                                a.db = t;
                                                for (var r = 0; r < n.length; r++) n[r]._dbInfo.db = t;
                                                return t
                                            });
                                        i = e.storeName ? d.then(function (t) {
                                            if (t.objectStoreNames.contains(e.storeName)) {
                                                var a = t.version + 1;
                                                u(e);
                                                var n = U[e.name], r = n.forages;
                                                t.close();
                                                for (var o = 0, i; o < r.length; o++) i = r[o], i._dbInfo.db = null, i._dbInfo.version = a;
                                                var s = new F(function (t, n) {
                                                    var r = O.open(e.name, a);
                                                    r.onerror = function (e) {
                                                        var t = r.result;
                                                        t.close(), n(e)
                                                    }, r.onupgradeneeded = function () {
                                                        var t = r.result;
                                                        t.deleteObjectStore(e.storeName)
                                                    }, r.onsuccess = function () {
                                                        var e = r.result;
                                                        e.close(), t(e)
                                                    }
                                                });
                                                return s.then(function (e) {
                                                    n.db = e;
                                                    for (var t = 0, a; t < r.length; t++) a = r[t], a._dbInfo.db = e, h(a._dbInfo)
                                                })['catch'](function (t) {
                                                    throw(f(e, t) || F.resolve())['catch'](function () {
                                                    }), t
                                                })
                                            }
                                        }) : d.then(function (t) {
                                            u(e);
                                            var a = U[e.name], n = a.forages;
                                            t.close();
                                            for (var r = 0, i; r < n.length; r++) i = n[r], i._dbInfo.db = null;
                                            var o = new F(function (t, a) {
                                                var n = O.deleteDatabase(e.name);
                                                n.onerror = n.onblocked = function (e) {
                                                    var t = n.result;
                                                    t && t.close(), a(e)
                                                }, n.onsuccess = function () {
                                                    var e = n.result;
                                                    e && e.close(), t(e)
                                                }
                                            });
                                            return o.then(function (e) {
                                                a.db = e;
                                                for (var t = 0, r; t < n.length; t++) r = n[t], h(r._dbInfo)
                                            })['catch'](function (t) {
                                                throw(f(e, t) || F.resolve())['catch'](function () {
                                                }), t
                                            })
                                        })
                                    }
                                    return r(i, t), i
                                }
                            }, X = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
                            Y = /^~~local_forage_type~([^~]+)~/, V = '__lfsc__:', Z = V.length, K = 'arbf', q = 'blob',
                            Q = 'si08', J = 'ui08', $ = 'uic8', ee = 'si16', te = 'si32', ae = 'ur16', ne = 'ui32',
                            re = 'fl32', ie = 'fl64', oe = Z + K.length, se = Object.prototype.toString, de = {
                                serialize: function (t, a) {
                                    var e = '';
                                    if (t && (e = se.call(t)), t && ('[object ArrayBuffer]' === e || t.buffer && '[object ArrayBuffer]' === se.call(t.buffer))) {
                                        var n = V, r;
                                        t instanceof ArrayBuffer ? (r = t, n += K) : (r = t.buffer, '[object Int8Array]' === e ? n += Q : '[object Uint8Array]' === e ? n += J : '[object Uint8ClampedArray]' === e ? n += $ : '[object Int16Array]' === e ? n += ee : '[object Uint16Array]' === e ? n += ae : '[object Int32Array]' === e ? n += te : '[object Uint32Array]' === e ? n += ne : '[object Float32Array]' === e ? n += re : '[object Float64Array]' === e ? n += ie : a(new Error('Failed to get type for BinaryArray'))), a(n + I(r))
                                    } else if ('[object Blob]' === e) {
                                        var i = new FileReader;
                                        i.onload = function () {
                                            var e = '~~local_forage_type~' + t.type + '~' + I(this.result);
                                            a(V + q + e)
                                        }, i.readAsArrayBuffer(t)
                                    } else try {
                                        a(JSON.stringify(t))
                                    } catch (n) {
                                        console.error('Couldn\'t convert value into a JSON string: ', t), a(null, n)
                                    }
                                }, deserialize: function (e) {
                                    if (e.substring(0, Z) !== V) return JSON.parse(e);
                                    var t = e.substring(oe), a = e.substring(Z, oe), r;
                                    if (a === q && Y.test(t)) {
                                        var i = t.match(Y);
                                        r = i[1], t = t.substring(i[0].length)
                                    }
                                    var o = T(t);
                                    switch (a) {
                                        case K:
                                            return o;
                                        case q:
                                            return n([o], {type: r});
                                        case Q:
                                            return new Int8Array(o);
                                        case J:
                                            return new Uint8Array(o);
                                        case $:
                                            return new Uint8ClampedArray(o);
                                        case ee:
                                            return new Int16Array(o);
                                        case ae:
                                            return new Uint16Array(o);
                                        case te:
                                            return new Int32Array(o);
                                        case ne:
                                            return new Uint32Array(o);
                                        case re:
                                            return new Float32Array(o);
                                        case ie:
                                            return new Float64Array(o);
                                        default:
                                            throw new Error('Unkown type: ' + a);
                                    }
                                }, stringToBuffer: T, bufferToString: I
                            }, le = {
                                _driver: 'webSQLStorage', _initStorage: function (e) {
                                    var t = this, a = {db: null};
                                    if (e) for (var n in e) a[n] = 'string' == typeof e[n] ? e[n] : e[n].toString();
                                    var r = new F(function (e, n) {
                                        try {
                                            a.db = openDatabase(a.name, a.version + '', a.description, a.size)
                                        } catch (t) {
                                            return n(t)
                                        }
                                        a.db.transaction(function (r) {
                                            R(r, a, function () {
                                                t._dbInfo = a, e()
                                            }, function (e, t) {
                                                n(t)
                                            })
                                        }, n)
                                    });
                                    return a.serializer = de, r
                                }, _support: function () {
                                    return 'function' == typeof openDatabase
                                }(), iterate: function (e, t) {
                                    var a = this, n = new F(function (n, r) {
                                        a.ready().then(function () {
                                            var o = a._dbInfo;
                                            o.db.transaction(function (a) {
                                                S(a, o, 'SELECT * FROM ' + o.storeName, [], function (a, t) {
                                                    for (var r = t.rows, s = r.length, d = 0; d < s; d++) {
                                                        var i = r.item(d), l = i.value;
                                                        if (l && (l = o.serializer.deserialize(l)), l = e(l, i.key, d + 1), void 0 !== l) return void n(l)
                                                    }
                                                    n()
                                                }, function (e, t) {
                                                    r(t)
                                                })
                                            })
                                        })['catch'](r)
                                    });
                                    return r(n, t), n
                                }, getItem: function (e, t) {
                                    var a = this;
                                    e = o(e);
                                    var n = new F(function (n, r) {
                                        a.ready().then(function () {
                                            var i = a._dbInfo;
                                            i.db.transaction(function (a) {
                                                S(a, i, 'SELECT * FROM ' + i.storeName + ' WHERE key = ? LIMIT 1', [e], function (e, t) {
                                                    var a = t.rows.length ? t.rows.item(0).value : null;
                                                    a && (a = i.serializer.deserialize(a)), n(a)
                                                }, function (e, t) {
                                                    r(t)
                                                })
                                            })
                                        })['catch'](r)
                                    });
                                    return r(n, t), n
                                }, setItem: function (e, t, a) {
                                    return C.apply(this, [e, t, a, 1])
                                }, removeItem: function (e, t) {
                                    var a = this;
                                    e = o(e);
                                    var n = new F(function (t, n) {
                                        a.ready().then(function () {
                                            var r = a._dbInfo;
                                            r.db.transaction(function (a) {
                                                S(a, r, 'DELETE FROM ' + r.storeName + ' WHERE key = ?', [e], function () {
                                                    t()
                                                }, function (e, t) {
                                                    n(t)
                                                })
                                            })
                                        })['catch'](n)
                                    });
                                    return r(n, t), n
                                }, clear: function (e) {
                                    var t = this, a = new F(function (e, a) {
                                        t.ready().then(function () {
                                            var n = t._dbInfo;
                                            n.db.transaction(function (r) {
                                                S(r, n, 'DELETE FROM ' + n.storeName, [], function () {
                                                    e()
                                                }, function (e, t) {
                                                    a(t)
                                                })
                                            })
                                        })['catch'](a)
                                    });
                                    return r(a, e), a
                                }, length: function (e) {
                                    var t = this, a = new F(function (e, a) {
                                        t.ready().then(function () {
                                            var n = t._dbInfo;
                                            n.db.transaction(function (r) {
                                                S(r, n, 'SELECT COUNT(key) as c FROM ' + n.storeName, [], function (a, t) {
                                                    var n = t.rows.item(0).c;
                                                    e(n)
                                                }, function (e, t) {
                                                    a(t)
                                                })
                                            })
                                        })['catch'](a)
                                    });
                                    return r(a, e), a
                                }, key: function (e, t) {
                                    var a = this, n = new F(function (n, r) {
                                        a.ready().then(function () {
                                            var i = a._dbInfo;
                                            i.db.transaction(function (a) {
                                                S(a, i, 'SELECT key FROM ' + i.storeName + ' WHERE id = ? LIMIT 1', [e + 1], function (e, t) {
                                                    var a = t.rows.length ? t.rows.item(0).key : null;
                                                    n(a)
                                                }, function (e, t) {
                                                    r(t)
                                                })
                                            })
                                        })['catch'](r)
                                    });
                                    return r(n, t), n
                                }, keys: function (e) {
                                    var t = this, a = new F(function (e, a) {
                                        t.ready().then(function () {
                                            var n = t._dbInfo;
                                            n.db.transaction(function (r) {
                                                S(r, n, 'SELECT key FROM ' + n.storeName, [], function (a, t) {
                                                    for (var n = [], r = 0; r < t.rows.length; r++) n.push(t.rows.item(r).key);
                                                    e(n)
                                                }, function (e, t) {
                                                    a(t)
                                                })
                                            })
                                        })['catch'](a)
                                    });
                                    return r(a, e), a
                                }, dropInstance: function (e, t) {
                                    t = s.apply(this, arguments);
                                    var a = this.config();
                                    e = 'function' != typeof e && e || {}, e.name || (e.name = e.name || a.name, e.storeName = e.storeName || a.storeName);
                                    var n = this, i;
                                    return i = e.name ? new F(function (t) {
                                        var r;
                                        r = e.name === a.name ? n._dbInfo.db : openDatabase(e.name, '', '', 0), e.storeName ? t({
                                            db: r,
                                            storeNames: [e.storeName]
                                        }) : t(B(r))
                                    }).then(function (e) {
                                        return new F(function (t, a) {
                                            e.db.transaction(function (n) {
                                                function r(e) {
                                                    return new F(function (t, a) {
                                                        n.executeSql('DROP TABLE IF EXISTS ' + e, [], function () {
                                                            t()
                                                        }, function (e, t) {
                                                            a(t)
                                                        })
                                                    })
                                                }

                                                for (var o = [], s = 0, i = e.storeNames.length; s < i; s++) o.push(r(e.storeNames[s]));
                                                F.all(o).then(function () {
                                                    t()
                                                })['catch'](function (t) {
                                                    a(t)
                                                })
                                            }, function (e) {
                                                a(e)
                                            })
                                        })
                                    }) : F.reject('Invalid arguments'), r(i, t), i
                                }
                            }, ce = {
                                _driver: 'localStorageWrapper', _initStorage: function (e) {
                                    var t = this, a = {};
                                    if (e) for (var n in e) a[n] = e[n];
                                    return (a.keyPrefix = D(e, t._defaultConfig), !z()) ? F.reject() : (t._dbInfo = a, a.serializer = de, F.resolve())
                                }, _support: function () {
                                    try {
                                        return 'undefined' != typeof localStorage && 'setItem' in localStorage && !!localStorage.setItem
                                    } catch (t) {
                                        return !1
                                    }
                                }(), iterate: function (e, t) {
                                    var a = this, n = a.ready().then(function () {
                                        for (var t = a._dbInfo, n = t.keyPrefix, r = n.length, o = localStorage.length, s = 1, d = 0, i; d < o; d++) if (i = localStorage.key(d), 0 === i.indexOf(n)) {
                                            var l = localStorage.getItem(i);
                                            if (l && (l = t.serializer.deserialize(l)), l = e(l, i.substring(r), s++), void 0 !== l) return l
                                        }
                                    });
                                    return r(n, t), n
                                }, getItem: function (e, t) {
                                    var a = this;
                                    e = o(e);
                                    var n = a.ready().then(function () {
                                        var t = a._dbInfo, n = localStorage.getItem(t.keyPrefix + e);
                                        return n && (n = t.serializer.deserialize(n)), n
                                    });
                                    return r(n, t), n
                                }, setItem: function (e, t, a) {
                                    var n = this;
                                    e = o(e);
                                    var i = n.ready().then(function () {
                                        void 0 === t && (t = null);
                                        var a = t;
                                        return new F(function (r, i) {
                                            var o = n._dbInfo;
                                            o.serializer.serialize(t, function (t, n) {
                                                if (n) i(n); else try {
                                                    localStorage.setItem(o.keyPrefix + e, t), r(a)
                                                } catch (t) {
                                                    ('QuotaExceededError' === t.name || 'NS_ERROR_DOM_QUOTA_REACHED' === t.name) && i(t), i(t)
                                                }
                                            })
                                        })
                                    });
                                    return r(i, a), i
                                }, removeItem: function (e, t) {
                                    var a = this;
                                    e = o(e);
                                    var n = a.ready().then(function () {
                                        var t = a._dbInfo;
                                        localStorage.removeItem(t.keyPrefix + e)
                                    });
                                    return r(n, t), n
                                }, clear: function (e) {
                                    var t = this, a = t.ready().then(function () {
                                        for (var e = t._dbInfo.keyPrefix, a = localStorage.length - 1, n; 0 <= a; a--) n = localStorage.key(a), 0 === n.indexOf(e) && localStorage.removeItem(n)
                                    });
                                    return r(a, e), a
                                }, length: function (e) {
                                    var t = this, a = t.keys().then(function (e) {
                                        return e.length
                                    });
                                    return r(a, e), a
                                }, key: function (e, t) {
                                    var a = this, n = a.ready().then(function () {
                                        var t = a._dbInfo, n;
                                        try {
                                            n = localStorage.key(e)
                                        } catch (e) {
                                            n = null
                                        }
                                        return n && (n = n.substring(t.keyPrefix.length)), n
                                    });
                                    return r(n, t), n
                                }, keys: function (e) {
                                    var t = this, a = t.ready().then(function () {
                                        for (var e = t._dbInfo, a = localStorage.length, n = [], r = 0, i; r < a; r++) i = localStorage.key(r), 0 === i.indexOf(e.keyPrefix) && n.push(i.substring(e.keyPrefix.length));
                                        return n
                                    });
                                    return r(a, e), a
                                }, dropInstance: function (e, t) {
                                    if (t = s.apply(this, arguments), e = 'function' != typeof e && e || {}, !e.name) {
                                        var a = this.config();
                                        e.name = e.name || a.name, e.storeName = e.storeName || a.storeName
                                    }
                                    var n = this, i;
                                    return i = e.name ? new F(function (t) {
                                        e.storeName ? t(D(e, n._defaultConfig)) : t(e.name + '/')
                                    }).then(function (e) {
                                        for (var t = localStorage.length - 1, a; 0 <= t; t--) a = localStorage.key(t), 0 === a.indexOf(e) && localStorage.removeItem(a)
                                    }) : F.reject('Invalid arguments'), r(i, t), i
                                }
                            }, ue = function (e, t) {
                                return e === t || 'number' == typeof e && 'number' == typeof t && isNaN(e) && isNaN(t)
                            }, he = function (e, t) {
                                for (var a = e.length, n = 0; n < a;) {
                                    if (ue(e[n], t)) return !0;
                                    n++
                                }
                                return !1
                            }, fe = Array.isArray || function (e) {
                                return '[object Array]' === Object.prototype.toString.call(e)
                            }, _e = {}, me = {}, pe = {INDEXEDDB: G, WEBSQL: le, LOCALSTORAGE: ce},
                            ge = [pe.INDEXEDDB._driver, pe.WEBSQL._driver, pe.LOCALSTORAGE._driver],
                            be = ['dropInstance'],
                            ye = ['clear', 'getItem', 'iterate', 'key', 'keys', 'length', 'removeItem', 'setItem'].concat(be),
                            ve = {
                                description: '',
                                driver: ge.slice(),
                                name: 'localforage',
                                size: 4980736,
                                storeName: 'keyvaluepairs',
                                version: 1
                            }, we = function () {
                                function e(t) {
                                    for (var n in a(this, e), pe) if (pe.hasOwnProperty(n)) {
                                        var r = pe[n], i = r._driver;
                                        this[n] = i, _e[i] || this.defineDriver(r)
                                    }
                                    this._defaultConfig = L({}, ve), this._config = L({}, this._defaultConfig, t), this._driverSet = null, this._initDriver = null, this._ready = !1, this._dbInfo = null, this._wrapLibraryMethodsWithReady(), this.setDriver(this._config.driver)['catch'](function () {
                                    })
                                }

                                return e.prototype.config = function (e) {
                                    if ('object' === ('undefined' == typeof e ? 'undefined' : P(e))) {
                                        if (this._ready) return new Error('Can\'t call config() after localforage has been used.');
                                        for (var t in e) {
                                            if ('storeName' == t && (e[t] = e[t].replace(/\W/g, '_')), 'version' == t && 'number' != typeof e[t]) return new Error('Database version must be a number.');
                                            this._config[t] = e[t]
                                        }
                                        return 'driver' in e && e.driver ? this.setDriver(this._config.driver) : !0
                                    }
                                    return 'string' == typeof e ? this._config[e] : this._config
                                }, e.prototype.defineDriver = function (e, t, a) {
                                    var n = new F(function (t, a) {
                                        try {
                                            var n = e._driver,
                                                o = new Error('Custom driver not compliant; see https://mozilla.github.io/localForage/#definedriver');
                                            if (!e._driver) return void a(o);
                                            for (var s = ye.concat('_initStorage'), d = 0, i = s.length; d < i; d++) {
                                                var l = s[d], c = !he(be, l);
                                                if ((c || e[l]) && 'function' != typeof e[l]) return void a(o)
                                            }
                                            var u = function () {
                                                for (var t = function (e) {
                                                    return function () {
                                                        var t = new Error('Method ' + e + ' is not implemented by the current driver'),
                                                            a = F.reject(t);
                                                        return r(a, arguments[arguments.length - 1]), a
                                                    }
                                                }, a = 0, n = be.length, i; a < n; a++) i = be[a], e[i] || (e[i] = t(i))
                                            };
                                            u();
                                            var h = function (a) {
                                                _e[n] && console.info('Redefining LocalForage driver: ' + n), _e[n] = e, me[n] = a, t()
                                            };
                                            '_support' in e ? e._support && 'function' == typeof e._support ? e._support().then(h, a) : h(!!e._support) : h(!0)
                                        } catch (t) {
                                            a(t)
                                        }
                                    });
                                    return i(n, t, a), n
                                }, e.prototype.driver = function () {
                                    return this._driver || null
                                }, e.prototype.getDriver = function (e, t, a) {
                                    var n = _e[e] ? F.resolve(_e[e]) : F.reject(new Error('Driver not found.'));
                                    return i(n, t, a), n
                                }, e.prototype.getSerializer = function (e) {
                                    var t = F.resolve(de);
                                    return i(t, e), t
                                }, e.prototype.ready = function (e) {
                                    var t = this, a = t._driverSet.then(function () {
                                        return null === t._ready && (t._ready = t._initDriver()), t._ready
                                    });
                                    return i(a, e, e), a
                                }, e.prototype.setDriver = function (e, t, a) {
                                    function n() {
                                        s._config.driver = s.driver()
                                    }

                                    function r(e) {
                                        return s._extend(e), n(), s._ready = s._initStorage(s._config), s._ready
                                    }

                                    function o(e) {
                                        return function () {
                                            function t() {
                                                for (; a < e.length;) {
                                                    var i = e[a];
                                                    return a++, s._dbInfo = null, s._ready = null, s.getDriver(i).then(r)['catch'](t)
                                                }
                                                n();
                                                var o = new Error('No available storage method found.');
                                                return s._driverSet = F.reject(o), s._driverSet
                                            }

                                            var a = 0;
                                            return t()
                                        }
                                    }

                                    var s = this;
                                    fe(e) || (e = [e]);
                                    var d = this._getSupportedDrivers(e),
                                        l = null === this._driverSet ? F.resolve() : this._driverSet['catch'](function () {
                                            return F.resolve()
                                        });
                                    return this._driverSet = l.then(function () {
                                        var e = d[0];
                                        return s._dbInfo = null, s._ready = null, s.getDriver(e).then(function (e) {
                                            s._driver = e._driver, n(), s._wrapLibraryMethodsWithReady(), s._initDriver = o(d)
                                        })
                                    })['catch'](function () {
                                        n();
                                        var e = new Error('No available storage method found.');
                                        return s._driverSet = F.reject(e), s._driverSet
                                    }), i(this._driverSet, t, a), this._driverSet
                                }, e.prototype.supports = function (e) {
                                    return !!me[e]
                                }, e.prototype._extend = function (e) {
                                    L(this, e)
                                }, e.prototype._getSupportedDrivers = function (e) {
                                    for (var t = [], a = 0, n = e.length, r; a < n; a++) r = e[a], this.supports(r) && t.push(r);
                                    return t
                                }, e.prototype._wrapLibraryMethodsWithReady = function () {
                                    for (var e = 0, t = ye.length; e < t; e++) N(this, ye[e])
                                }, e.prototype.createInstance = function (t) {
                                    return new e(t)
                                }, e
                            }(), Ee = new we, xe;
                        t.exports = Ee
                    }, {3: 3}]
                }, {}, [4])(4)
            })
        }).call(t, a(22))
    }, function (e, t, a) {
        'use strict';
        t.a = function (e) {
            switch (e) {
                case'raw':
                    return new r.a;
                case'eightbit':
                    return new n.a;
                default:
                    throw new Error('Unknown weight encoding');
            }
        };
        var n = a(23), r = a(33)
    }, function (e, t, a) {
        'use strict';

        function n() {
            if (!window.hasOwnProperty('ProgressEvent') || !window.hasOwnProperty('FormData')) return !1;
            let e = new XMLHttpRequest;
            if ('string' == typeof e.responseType) try {
                return e.responseType = 'blob', 'blob' === e.responseType
            } catch (t) {
                return !1
            } else return !1
        }

        function r(e, t) {
            return new Promise(function (a, n) {
                let r = new XMLHttpRequest;
                r.open('GET', e, !0), r.responseType = 'blob';
                let o = new i.a;
                r.onload = function () {
                    o.forceDispatch();
                    let e = new Response(r.response);
                    a(e)
                }, r.onprogress = function (e) {
                    t && o.request(function () {
                        return t(e.loaded, e.total)
                    })
                }, r.onerror = function (e) {
                    n(e)
                }, r.send(null)
            })
        }

        t.a = async function (e, t, a) {
            e = 'string' == typeof e ? t(e) + (a && a.ignoreCache ? '?t=' + Date.now() : '') : Object.assign({}, e, {url: t(e.url) + (a && a.ignoreCache ? '?t=' + Date.now() : '')});
            let i;
            if (i = 'string' == typeof e && n() ? await r(e, a && a.progressCallback) : await fetch(e, a), !i.ok) throw new Error(`Fetch returns status code ${i.status}: ${i.statusText}`);
            return i
        }, t.b = function (e, t) {
            function a(e) {
                return o.set(e.value, s), s += e.value.length, t && l.request(() => t(s, r)), s == r ? (l.forceDispatch(), o.buffer) : d.read().then(a)
            }

            if (!t || !e.body) return e.arrayBuffer();
            let n = e.headers.get('Content-Length');
            if (!n) return e.arrayBuffer();
            const r = parseInt(n);
            let o = new Uint8Array(r), s = 0, d = e.body.getReader(), l = new i.a;
            return d.read().then(a)
        };
        var i = a(34)
    }, function (e, t, a) {
        'use strict';

        class n {
            constructor(e) {
                this.values = {}, e && this.update(e)
            }

            get isResolved() {
                return Object.values(this.values).every((e) => 'number' == typeof e)
            }

            update(e) {
                this.values = Object.assign(this.values, e)
            }

            resolve(e) {
                if ('object' != typeof e) return e;
                if (1 == Object.keys(e).length && 'eval' in e) {
                    if (!this.isResolved) throw Error(`Not all placeholders are resolved: ${this}`);
                    return eval('(function(placeholders){return ' + e.eval + ';})')(this.values)
                }
                return e instanceof Array ? e.map((e) => this.resolve(e)) : Object.entries(e).reduce((e, [t, a]) => (e[t] = this.resolve(a), e), {})
            }

            toString() {
                return JSON.stringify(this.values)
            }
        }

        t.a = n
    }, function (e, t, a) {
        'use strict';
        var n = a(35);

        class r extends n.a {
            constructor() {
                super(...arguments), this.BYTES_PER_ELEMENT = 4
            }

            toActual() {
                if (!this.buffer) throw new Error('Internal buffer for this variable is not set. DescriptorRunner.setPlaceholderValue() have to be called before calling this function.');
                return new Float32Array(this.buffer, this.byteOffset, this.length)
            }

            every(e, t) {
                return this.toActual().every(e, t)
            }

            filter(e, t) {
                return this.toActual().filter(e, t)
            }

            find(e, t) {
                return this.toActual().find(e, t)
            }

            findIndex(e, t) {
                return this.toActual().findIndex(e, t)
            }

            forEach(e, t) {
                return this.toActual().forEach(e, t)
            }

            map(e, t) {
                return this.toActual().map(e, t)
            }

            reduce(e, t) {
                return this.toActual().reduce(e, t)
            }

            reduceRight(e, t) {
                return this.toActual().reduceRight(e, t)
            }

            reverse() {
                return this.toActual().reverse()
            }

            slice(e, t) {
                return this.toActual().slice(e, t)
            }

            some(e, t) {
                return this.toActual().some(e, t)
            }

            subarray(e, t) {
                return this.toActual().subarray(e, t)
            }

            includes(e, t) {
                return this.toActual().includes(e, t)
            }
        }

        t.a = r, r.BYTES_PER_ELEMENT = 4
    }, function (e, t) {
        'use strict';
        t.a = class {
            constructor(e = {}) {
                this.descriptor = null;
                let {
                    transformUrlDelegate: t = function (e) {
                        return e
                    }
                } = e;
                this.transformUrlDelegate = t
            }

            static checkAvailability() {
                return !1
            }
        }
    }, function (e) {
        'use strict';
        e.exports = {
            0: '',
            1: 'stream end',
            2: 'need dictionary',
            "-1": 'file error',
            "-2": 'stream error',
            "-3": 'data error',
            "-4": 'insufficient memory',
            "-5": 'buffer error',
            "-6": 'incompatible version'
        }
    }, function (e) {
        'use strict';
        e.exports = function (e, t, a, r) {
            for (var i = 0 | 65535 & e, o = 0 | 65535 & e >>> 16, s = 0; 0 !== a;) {
                s = 2e3 < a ? 2e3 : a, a -= s;
                do i = 0 | i + t[r++], o = 0 | o + i; while (--s);
                i %= 65521, o %= 65521
            }
            return 0 | (i | o << 16)
        }
    }, function (e) {
        'use strict';
        var t = function () {
            for (var e = [], t = 0, a; 256 > t; t++) {
                a = t;
                for (var n = 0; 8 > n; n++) a = 1 & a ? 3988292384 ^ a >>> 1 : a >>> 1;
                e[t] = a
            }
            return e
        }();
        e.exports = function (e, a, n, r) {
            e ^= -1;
            for (var o = r; o < r + n; o++) e = e >>> 8 ^ t[255 & (e ^ a[o])];
            return -1 ^ e
        }
    }, function (t, a, n) {
        'use strict';

        function r(t, a) {
            if (65537 > a && (t.subarray && d || !t.subarray && s)) return e.apply(null, o.shrinkBuf(t, a));
            for (var n = '', r = 0; r < a; r++) n += e(t[r]);
            return n
        }

        var o = n(0), s = !0, d = !0;
        try {
            e.apply(null, [0])
        } catch (e) {
            s = !1
        }
        try {
            e.apply(null, new Uint8Array(1))
        } catch (e) {
            d = !1
        }
        for (var l = new o.Buf8(256), i = 0; 256 > i; i++) l[i] = 252 <= i ? 6 : 248 <= i ? 5 : 240 <= i ? 4 : 224 <= i ? 3 : 192 <= i ? 2 : 1;
        l[254] = l[254] = 1, a.string2buf = function (e) {
            var t = e.length, a = 0, n, r, s, d, l;
            for (d = 0; d < t; d++) r = e.charCodeAt(d), 55296 == (64512 & r) && d + 1 < t && (s = e.charCodeAt(d + 1), 56320 == (64512 & s) && (r = 65536 + (r - 55296 << 10) + (s - 56320), d++)), a += 128 > r ? 1 : 2048 > r ? 2 : 65536 > r ? 3 : 4;
            for (n = new o.Buf8(a), l = 0, d = 0; l < a; d++) r = e.charCodeAt(d), 55296 == (64512 & r) && d + 1 < t && (s = e.charCodeAt(d + 1), 56320 == (64512 & s) && (r = 65536 + (r - 55296 << 10) + (s - 56320), d++)), 128 > r ? n[l++] = r : 2048 > r ? (n[l++] = 192 | r >>> 6, n[l++] = 128 | 63 & r) : 65536 > r ? (n[l++] = 224 | r >>> 12, n[l++] = 128 | 63 & r >>> 6, n[l++] = 128 | 63 & r) : (n[l++] = 240 | r >>> 18, n[l++] = 128 | 63 & r >>> 12, n[l++] = 128 | 63 & r >>> 6, n[l++] = 128 | 63 & r);
            return n
        }, a.buf2binstring = function (e) {
            return r(e, e.length)
        }, a.binstring2buf = function (e) {
            for (var t = new o.Buf8(e.length), a = 0, n = t.length; a < n; a++) t[a] = e.charCodeAt(a);
            return t
        }, a.buf2string = function (e, t) {
            var a = t || e.length, n = Array(2 * a), o, i, s, d;
            for (i = 0, o = 0; o < a;) {
                if (s = e[o++], 128 > s) {
                    n[i++] = s;
                    continue
                }
                if (d = l[s], 4 < d) {
                    n[i++] = 65533, o += d - 1;
                    continue
                }
                for (s &= 2 === d ? 31 : 3 === d ? 15 : 7; 1 < d && o < a;) s = s << 6 | 63 & e[o++], d--;
                if (1 < d) {
                    n[i++] = 65533;
                    continue
                }
                65536 > s ? n[i++] = s : (s -= 65536, n[i++] = 55296 | 1023 & s >> 10, n[i++] = 56320 | 1023 & s)
            }
            return r(n, i)
        }, a.utf8border = function (e, t) {
            var a;
            for (t = t || e.length, t > e.length && (t = e.length), a = t - 1; 0 <= a && 128 == (192 & e[a]);) a--;
            return 0 > a ? t : 0 === a ? t : a + l[e[a]] > t ? a : t
        }
    }, function (e) {
        'use strict';
        e.exports = function () {
            this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = '', this.state = null, this.data_type = 2, this.adler = 0
        }
    }, function (e) {
        'use strict';
        e.exports = {
            Z_NO_FLUSH: 0,
            Z_PARTIAL_FLUSH: 1,
            Z_SYNC_FLUSH: 2,
            Z_FULL_FLUSH: 3,
            Z_FINISH: 4,
            Z_BLOCK: 5,
            Z_TREES: 6,
            Z_OK: 0,
            Z_STREAM_END: 1,
            Z_NEED_DICT: 2,
            Z_ERRNO: -1,
            Z_STREAM_ERROR: -2,
            Z_DATA_ERROR: -3,
            Z_BUF_ERROR: -5,
            Z_NO_COMPRESSION: 0,
            Z_BEST_SPEED: 1,
            Z_BEST_COMPRESSION: 9,
            Z_DEFAULT_COMPRESSION: -1,
            Z_FILTERED: 1,
            Z_HUFFMAN_ONLY: 2,
            Z_RLE: 3,
            Z_FIXED: 4,
            Z_DEFAULT_STRATEGY: 0,
            Z_BINARY: 0,
            Z_TEXT: 1,
            Z_UNKNOWN: 2,
            Z_DEFLATED: 8
        }
    }, function (e, t, a) {
        'use strict';

        function n(e) {
            return 'WebGL2RenderingContext' === e.constructor.name
        }

        function r(e) {
            if (null === e) throw Error('Null is detected');
            return e
        }

        t.b = n;
        var i = a(1);
        let o;

        class s {
            constructor() {
                this.gl = r(s.initializeContext())
            }

            static getInstance() {
                return o || (o = new s), o
            }

            createTexture(e, t, a, n) {
                let i = this.gl, o = r(i.createTexture());
                return i.activeTexture(i.TEXTURE0 + 9), i.bindTexture(i.TEXTURE_2D, o), i.texImage2D(i.TEXTURE_2D, 0, a, e, t, 0, n, i.FLOAT, null), i.texParameteri(i.TEXTURE_2D, i.TEXTURE_WRAP_S, i.CLAMP_TO_EDGE), i.texParameteri(i.TEXTURE_2D, i.TEXTURE_WRAP_T, i.CLAMP_TO_EDGE), i.texParameteri(i.TEXTURE_2D, i.TEXTURE_MIN_FILTER, i.NEAREST), i.texParameteri(i.TEXTURE_2D, i.TEXTURE_MAG_FILTER, i.NEAREST), i.bindTexture(i.TEXTURE_2D, null), o
            }

            createVertexShader(e) {
                return this.createShader(this.gl.VERTEX_SHADER, e)
            }

            createFragmentShader(e) {
                return this.createShader(this.gl.FRAGMENT_SHADER, e)
            }

            createShader(e, t) {
                let a = r(this.gl.createShader(e));
                if (this.gl.shaderSource(a, t), this.gl.compileShader(a), !this.gl.getShaderParameter(a, this.gl.COMPILE_STATUS)) throw console.error(this.gl.getShaderInfoLog(a)), Error('Shader Compile failed: ' + this.gl.getShaderInfoLog(a));
                return a
            }

            createProgram(e, t) {
                let a = r(this.gl.createProgram());
                if (this.gl.attachShader(a, t), this.gl.attachShader(a, e), this.gl.linkProgram(a), !this.gl.getProgramParameter(a, this.gl.LINK_STATUS)) throw console.error(this.gl.getProgramInfoLog(a)), Error('ShaderProgram Initialization failed.');
                return a
            }

            createArrayBuffer(e) {
                let t = r(this.gl.createBuffer());
                return this.gl.bindBuffer(this.gl.ARRAY_BUFFER, t), this.gl.bufferData(this.gl.ARRAY_BUFFER, e, this.gl.STATIC_DRAW), t
            }

            createFrameBuffer() {
                return r(this.gl.createFramebuffer())
            }

            bindArrayBuffer(e) {
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, e)
            }

            bindFrameBuffer(e, t, a) {
                this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, e), this.gl.viewport(0, 0, t, a), this.gl.scissor(0, 0, t, a)
            }

            useProgram(e) {
                this.gl.useProgram(e)
            }

            deleteTexture(e) {
                this.gl.deleteTexture(e)
            }

            static initializeWebGL2Context(e = document.createElement('canvas')) {
                let t;
                return t = e.getContext('webgl2'), t ? t.getExtension('EXT_color_buffer_float') ? Object(i.getConfiguration)('DEBUG', !1) && !t.getExtension('WEBGL_debug_renderer_info') ? null : t : null : null
            }

            static initializeWebGL1Context(e = document.createElement('canvas')) {
                let t = e.getContext('webgl') || e.getContext('experimental-webgl');
                return t ? t.getExtension('OES_texture_float') ? s.IS_SAFARI ? null : Object(i.getConfiguration)('DEBUG', !1) && !t.getExtension('WEBGL_debug_renderer_info') ? null : t : null : null
            }

            static initializeContext() {
                let e = document.createElement('canvas'), t;
                if (t = s.initializeWebGL2Context(e), t) Object(i.getConfiguration)('DEBUG', !1) && console.info('WebGL2 is enabled'); else if (t = s.initializeWebGL1Context(e), t) Object(i.getConfiguration)('DEBUG', !1) && console.info('WebGL2 is disabled'); else return null;
                return t.disable(t.DEPTH_TEST), t.disable(t.STENCIL_TEST), t.disable(t.BLEND), t.disable(t.DITHER), t.disable(t.POLYGON_OFFSET_FILL), t.disable(t.SAMPLE_COVERAGE), t.enable(t.SCISSOR_TEST), t.enable(t.CULL_FACE), t.cullFace(t.BACK), t
            }

            static checkAvailability() {
                if (null === d) {
                    let e = s.initializeContext();
                    d = !!e && !(4096 > Object(i.getConfiguration)('MAX_TEXTURE_SIZE', e.getParameter(e.MAX_TEXTURE_SIZE)))
                }
                return d
            }

            async waitForComplete() {
                let e = this.gl;
                if (n(e)) {
                    let t = e.fenceSync(e.SYNC_GPU_COMMANDS_COMPLETE, 0), a = e.clientWaitSync(t, 0, 0);
                    for (; a !== e.CONDITION_SATISFIED && a !== e.ALREADY_SIGNALED;) await new Promise((e) => setTimeout(e, 1)), a = e.clientWaitSync(t, 0, 0);
                    e.deleteSync(t)
                } else e.finish()
            }

            get MAX_TEXTURE_SIZE() {
                let e = Object(i.getConfiguration)('MAX_TEXTURE_SIZE', this.gl.getParameter(this.gl.MAX_TEXTURE_SIZE));
                if (16384 <= e) return 4096;
                if (8192 <= e) return 4096;
                if (4096 <= e) return 4096;
                throw new Error(`MAX_TEXTURE_SIZE is too small: ${e}`)
            }
        }

        t.a = s, s.IS_SAFARI = -1 !== navigator.userAgent.toLowerCase().indexOf('safari') && -1 === navigator.userAgent.toLowerCase().indexOf('chrome');
        let d = null
    }, function (e, t) {
        'use strict';
        t.a = class {
            constructor(e, t) {
                this.byteLength = e, this.backend = t
            }
        }
    }, function (e, t, a) {
        'use strict';
        var n = a(17), r = a(15);

        class i extends r.a {
            constructor(e) {
                super(e, 'webgpu'), 0 == e && (e = 4), this.handler = n.b.getInstance(), this.buffer = this.handler.createBuffer(new Uint8Array(e)), this.bufferView = new Uint8Array(this.buffer.contents)
            }

            async write(e, t) {
                await this.handler.sync();
                let a = new e.constructor(this.bufferView.buffer);
                a.set(e, t)
            }

            async read(e, t = 0, a) {
                if (!e) throw new Error('dst cannot be null');
                if (await this.handler.sync(), 0 !== this.byteLength) {
                    let n = e.constructor,
                        r = new n(this.bufferView.buffer, this.bufferView.byteOffset + t * n.BYTES_PER_ELEMENT, a);
                    e.set(r)
                }
            }

            getWriteView(e, t, a) {
                return new a(this.bufferView.buffer, this.bufferView.byteOffset + e * a.BYTES_PER_ELEMENT, t)
            }

            getReadView(e, t, a) {
                return new a(this.bufferView.buffer, this.bufferView.byteOffset + e * a.BYTES_PER_ELEMENT, t)
            }

            async syncWriteViews() {
            }

            async syncReadViews() {
                await this.handler.sync()
            }
        }

        t.a = i
    }, function (e, t, a) {
        'use strict';
        var n = a(16);
        let r;

        class i {
            constructor() {
                if (this.pipelineStates = new Map, !o) throw new Error('This browser does not support WebGPU');
                let e;
                try {
                    e = document.createElement('canvas').getContext('webgpu')
                } catch (e) {
                    throw new Error(`During initializing WebGPURenderingContext, unexpected error is occurred: ${e.message}`)
                }
                if (!e) throw new Error('WebGPURenderingContext initialization failed');
                this.context = e, this.commandQueue = e.createCommandQueue(), this.loadKernel('kernel void sync(){}', 'basic')
            }

            static getInstance() {
                return r || (r = new i), r
            }

            createBuffer(e) {
                return this.context.createBuffer(e)
            }

            loadKernel(e, t = '') {
                let a = this.context.createLibrary(e);
                for (let n of a.functionNames) {
                    let e = a.functionWithName(n), r = this.context.createComputePipelineState(e);
                    this.pipelineStates.set(t + '.' + n, r)
                }
            }

            createCommandBuffer() {
                return this.commandQueue.createCommandBuffer()
            }

            getPipelineStateByName(e) {
                let t = this.pipelineStates.get(e);
                if (!t) throw TypeError(`Kernel function "${e}" is not loaded.`);
                return t
            }

            executeSinglePipelineState(e, t, a, r, i) {
                let o = this.commandBuffer || (this.commandBuffer = this.createCommandBuffer()),
                    s = o.createComputeCommandEncoder();
                s.setComputePipelineState(this.getPipelineStateByName(e));
                for (let o = 0; o < r.length; o++) {
                    let e = r[o], t;
                    t = e instanceof n.a ? e.buffer : e, s.setBuffer(t, 0, o)
                }
                s.dispatch(t, a), s.endEncoding();
                let d = null;
                return i && (d = o.completed), this.commandBuffer = null, o.commit(), d
            }

            async sync() {
                let e = this.createCommandBuffer(), t = e.createComputeCommandEncoder();
                t.setComputePipelineState(this.getPipelineStateByName('basic.sync')), t.dispatch({
                    width: 1,
                    height: 1,
                    depth: 1
                }, {width: 1, height: 1, depth: 1}), t.endEncoding();
                let a = e.completed;
                return e.commit(), a
            }
        }

        t.b = i;
        const o = 'WebGPURenderingContext' in window && 'WebGPUComputeCommandEncoder' in window;
        t.a = o
    }, function (e, t, a) {
        'use strict';
        a.d(t, 'b', function () {
            return n
        }), a.d(t, 'a', function () {
            return r
        });
        var n;
        (function (e) {
            e[e.CHW = 0] = 'CHW', e[e.HWC = 1] = 'HWC'
        })(n || (n = {}));
        var r;
        (function (e) {
            e[e.RGB = 0] = 'RGB', e[e.BGR = 1] = 'BGR', e[e.GREY = 2] = 'GREY', e[e.RGBA = 3] = 'RGBA', e[e.BGRA = 4] = 'BGRA'
        })(r || (r = {}))
    }, function (e, t) {
        'use strict';
        t.a = function (e) {
            let t = e.getContext('2d');
            if (!t) throw Error('CanvasRenderingContext2D initialization failed');
            return t
        }
    }, function (e, t) {
        'use strict';

        async function a(e) {
            let t = document.createElement('img');
            return new Promise((a, n) => {
                t.onload = a, t.onerror = n, t.src = e
            }).then(() => t)
        }

        async function n(e) {
            let t = e.files;
            if (!t || 0 == t.length) throw new Error('No file is selected');
            let n = URL.createObjectURL(t[0]);
            return a(n)
        }

        t.b = a, t.c = n, t.a = async function () {
            let e = document.createElement('input');
            return e.type = 'file', e.accept = 'image/*', new Promise((t) => {
                e.onchange = () => t(n(e)), e.click()
            })
        }
    }, function (e, t, a) {
        'use strict';

        function n(e = 10) {
            return new Promise((t) => setTimeout(t, e))
        }

        var r = a(2), i = a.n(r), o = a(3), s = a(4), d = a(5), l = a(6), c = a(7);

        class u extends c.a {
            constructor(e = {}) {
                super(e), this.backendName = 'fallback'
            }

            static checkAvailability() {
                return !0
            }

            async init() {
            }

            async setDescriptorAndParameters(e, t) {
                this.setDescriptor(e), await this.compile(), await this.initializeStaticBuffer(t), this.placeholderContext && this.placeholderContext.isResolved && (await this.initializeDynamicBuffer())
            }

            async fetchDescriptor(e) {
                this.directory = e;
                let t = await Object(s.a)(`${e}/graph_${this.backendName}.json`, this.transformUrlDelegate);
                return t.json()
            }

            async fetchParameters(e, t) {
                let a = await Object(s.a)(`${e}/weight_${this.backendName}.bin`, this.transformUrlDelegate);
                return Object(s.b)(a, t)
            }

            async restoreCachedDescriptor(e) {
                return r.getItem(`${e}_${this.backendName}_descriptor`).catch(() => null)
            }

            async restoreCachedParameters(e, t) {
                let a = await r.getItem(`${e}_${this.backendName}_parameters`).catch(() => null);
                return a && t && t(a.byteLength, a.byteLength), a
            }

            async saveCache(e, t, a) {
                await Promise.all([r.setItem(`${e}_${this.backendName}_descriptor`, t), r.setItem(`${e}_${this.backendName}_parameters`, a)])
            }

            setDescriptor(e) {
                this.descriptor = e, this.placeholderContext = new d.a, this.placeholderContext.update(e.placeholders), this.kernelObj = null, this.variableMap = null, this.staticBuffer = null, this.dynamicBuffer = null
            }

            async compile() {
                if (!this.descriptor) throw new Error('Descriptor is not loaded');
                await new Promise((e) => {
                    let t = document.createElement('script');
                    t.type = 'text/javascript', t.readyState ? t.onreadystatechange = () => {
                        ('loaded' == t.readyState || 'complete' == t.readyState) && (t.onreadystatechange = null, e())
                    } : t.onload = e, t.src = this.transformUrlDelegate(`${this.directory}/kernels_fallback.js`), document.getElementsByTagName('head')[0].appendChild(t)
                }), this.kernelObj = window.dnn_fallback_kernel
            }

            async initializeStaticBuffer(e) {
                if (!this.descriptor) throw new Error('Descriptor is not loaded');
                let t = this.descriptor, a = new Float32Array(t.memory_layout.static.size);
                this.staticBuffer = a;
                let n = this.variableMap || new Map;
                this.variableMap = n, Object.entries(t.memory_layout.static.allocations).forEach(([e, t]) => {
                    n.set(e, new Float32Array(a.buffer, t.offset * Float32Array.BYTES_PER_ELEMENT, t.size))
                });
                let r = Object(o.a)(this.descriptor.weight_encoding);
                a.set((await r.decode(new Uint8Array(e)))), (await this.getInputViews()).filter((e) => !e.isDynamic).forEach((e) => {
                    e.buffer = a.buffer
                }), (await this.getOutputViews()).filter((e) => !e.isDynamic).forEach((e) => {
                    e.buffer = a.buffer
                })
            }

            async initializeDynamicBuffer() {
                if (!this.descriptor) throw new Error('Descriptor is not loaded');
                if (!this.placeholderContext) throw new Error('PlaceholderContext is not initialized');
                let e = this.descriptor, t = this.placeholderContext,
                    a = new Float32Array(t.resolve(e.memory_layout.dynamic.size));
                this.dynamicBuffer = a;
                let n = this.variableMap || new Map;
                this.variableMap = n, Object.entries(e.memory_layout.dynamic.allocations).forEach(([e, r]) => {
                    n.set(e, new Float32Array(a.buffer, t.resolve(r.offset) * Float32Array.BYTES_PER_ELEMENT, t.resolve(r.size)))
                }), (await this.getInputViews()).filter((e) => e.isDynamic).forEach((e) => {
                    e.buffer = a.buffer
                }), (await this.getOutputViews()).filter((e) => e.isDynamic).forEach((e) => {
                    e.buffer = a.buffer
                })
            }

            async setPlaceholderValue(e) {
                if (!this.placeholderContext) throw new Error('placeholderContext is not initialized');
                let t = this.placeholderContext;
                t.update(e);
                t.isResolved && (await this.initializeDynamicBuffer())
            }

            async run() {
                if (!this.descriptor) throw new Error('Descriptor is not loaded');
                if (!this.placeholderContext) throw new Error('placeholderContext is not initialized');
                if (!this.variableMap) throw new Error('Variable map is not initialized');
                if (!this.staticBuffer) throw new Error('StaticBuffer map is not initialized');
                if (!this.dynamicBuffer) throw new Error('DynamicBuffer map is not initialized');
                let e = this.variableMap, t = this.placeholderContext,
                    a = this.descriptor.exec_infos.map((e) => t.resolve(e)), r = Date.now(), o = Date.now();
                for (let t = 0, i; t < a.length; t++) {
                    i = Date.now(), 1e3 <= i - o && (console.log(`Processed ${t}/${a.length} kernels in ${i - r} ms`), o = i, await n());
                    let s = a[t], d = s.inputs.map((t) => e.get(t)), l = s.outputs.map((t) => e.get(t));
                    this.kernelObj[s.entry_func_name](d, l, s.call_option)
                }
                console.log(`Processed ${a.length}/${a.length} kernels in ${Date.now() - r} ms`)
            }

            getInputViews() {
                if (this.inputs) return this.inputs;
                if (!this.descriptor) throw new Error('Descriptor is not loaded');
                if (!this.placeholderContext) throw new Error('PlaceholderContext is not initialized');
                let e = this.descriptor, t = this.placeholderContext;
                return this.inputs = e.inputs.map((a) => {
                    let n = e.memory_layout.static.allocations[a] || e.memory_layout.dynamic.allocations[a],
                        r = new l.a(null, n.offset * l.a.BYTES_PER_ELEMENT, n.size, t);
                    return r
                }), this.inputs
            }

            getOutputViews() {
                if (this.outputs) return this.outputs;
                if (!this.descriptor) throw new Error('Descriptor is not loaded');
                if (!this.placeholderContext) throw new Error('PlaceholderContext is not initialized');
                let e = this.descriptor, t = this.placeholderContext;
                return this.outputs = e.outputs.map((a) => {
                    let n = e.memory_layout.static.allocations[a] || e.memory_layout.dynamic.allocations[a],
                        r = new l.a(null, n.offset * l.a.BYTES_PER_ELEMENT, n.size, t);
                    return r
                }), this.outputs
            }
        }

        t.a = u
    }, function (e) {
        var t = function () {
            return this
        }();
        try {
            t = t || Function('return this')() || (1, eval)('this')
        } catch (a) {
            'object' == typeof window && (t = window)
        }
        e.exports = t
    }, function (e, t, a) {
        'use strict';
        var n = a(24), r = a.n(n);

        class o {
            async decode(e) {
                let t = [], a = 0, r = new DataView(e.buffer, e.byteOffset), i = 0;
                for (; i < e.length;) {
                    r.getInt32(i, !0);
                    i += 4;
                    let s = r.getInt32(i, !0);
                    i += 4;
                    let d = r.getFloat32(i, !0);
                    i += 8;
                    let l = new Float32Array(256);
                    for (let e = 0; 256 > e; e++) l[e] = o.decode_table[127 & e] * d * (128 > e ? 1 : -1);
                    let c = new Uint8Array(e.buffer, e.byteOffset + i, s), u = n.inflate(c), h = u.length,
                        f = new Float32Array(h);
                    for (let e = 0; e < h; e++) f[e] = l[u[e]];
                    t.push(f), a += h, i += s
                }
                let s = new Float32Array(a), d = 0;
                for (let a = 0; a < t.length; a++) s.set(t[a], d), d += t[a].length;
                return s
            }
        }

        t.a = o, o.decode_table = [0, 0.000002750000021, 0.000007249999726, 0.00001875000089, 0.00003624999954, 0.00005874999624, 0.00008624999464, 0.0001437500032, 0.0002312500001, 0.0003187500115, 0.0004062500084, 0.0005187499919, 0.0006562499912, 0.0007937499322, 0.0009312499315, 0.001218750025, 0.00165624998, 0.002093750052, 0.002531250007, 0.002968749963, 0.003406249918, 0.003843750106, 0.004281249829, 0.004843750037, 0.005531250034, 0.006218749564, 0.00690624956, 0.007593749557, 0.008281249553, 0.008968749084, 0.009656248614, 0.01109374966, 0.01328125037, 0.01546875015, 0.01765624993, 0.0198437497, 0.02203124948, 0.02421874925, 0.02640625089, 0.02859375067, 0.03078125045, 0.03296874836, 0.03515625, 0.03734375164, 0.03953124955, 0.04171875119, 0.04390624911, 0.04671875015, 0.0501562506, 0.05359374732, 0.05703124776, 0.06046874821, 0.06390624493, 0.06734374911, 0.07078124583, 0.07421874255, 0.07765624672, 0.08109374344, 0.08453124017, 0.08796874434, 0.09140624106, 0.09484373778, 0.09828124195, 0.10546875, 0.116406247, 0.127343744, 0.138281256, 0.149218753, 0.16015625, 0.171093747, 0.182031244, 0.192968756, 0.203906253, 0.21484375, 0.225781247, 0.236718744, 0.247656256, 0.2585937381, 0.26953125, 0.2804687619, 0.291406244, 0.302343756, 0.3132812381, 0.32421875, 0.3351562619, 0.346093744, 0.357031256, 0.3679687381, 0.37890625, 0.3898437619, 0.400781244, 0.411718756, 0.4226562381, 0.43359375, 0.4445312619, 0.458593756, 0.4757812321, 0.4929687381, 0.5101562142, 0.52734375, 0.5445312262, 0.5617187023, 0.5789062381, 0.5960937142, 0.61328125, 0.6304687262, 0.6476562023, 0.6648437381, 0.6820312142, 0.6992186904, 0.7164062262, 0.7335937023, 0.7507811785, 0.7679687142, 0.7851561904, 0.8023436666, 0.8195312023, 0.8367186785, 0.8539061546, 0.8710936904, 0.8882811666, 0.9054686427, 0.9226561785, 0.9398436546, 0.9570311308, 0.9742186666, 0.9914061427, 1]
    }, function (e, t, a) {
        'use strict';
        var n = a(0).assign, r = a(25), i = a(28), o = a(13), s = {};
        n(s, r, i, o), e.exports = s
    }, function (e, t, a) {
        'use strict';

        function n(e) {
            if (!(this instanceof n)) return new n(e);
            this.options = o.assign({
                level: m,
                method: g,
                chunkSize: 16384,
                windowBits: 15,
                memLevel: 8,
                strategy: p,
                to: ''
            }, e || {});
            var t = this.options;
            t.raw && 0 < t.windowBits ? t.windowBits = -t.windowBits : t.gzip && 0 < t.windowBits && 16 > t.windowBits && (t.windowBits += 16), this.err = 0, this.msg = '', this.ended = !1, this.chunks = [], this.strm = new l, this.strm.avail_out = 0;
            var a = i.deflateInit2(this.strm, t.level, t.method, t.windowBits, t.memLevel, t.strategy);
            if (a !== h) throw new Error(d[a]);
            if (t.header && i.deflateSetHeader(this.strm, t.header), t.dictionary) {
                var r;
                if (r = 'string' == typeof t.dictionary ? s.string2buf(t.dictionary) : '[object ArrayBuffer]' === c.call(t.dictionary) ? new Uint8Array(t.dictionary) : t.dictionary, a = i.deflateSetDictionary(this.strm, r), a !== h) throw new Error(d[a]);
                this._dict_set = !0
            }
        }

        function r(e, t) {
            var a = new n(t);
            if (a.push(e, !0), a.err) throw a.msg || d[a.err];
            return a.result
        }

        var i = a(26), o = a(0), s = a(11), d = a(8), l = a(12), c = Object.prototype.toString, u = 4, h = 0, f = 1,
            _ = 2, m = -1, p = 0, g = 8;
        n.prototype.push = function (e, t) {
            var a = this.strm, n = this.options.chunkSize, r, d;
            if (this.ended) return !1;
            d = t === ~~t ? t : !0 === t ? u : 0, a.input = 'string' == typeof e ? s.string2buf(e) : '[object ArrayBuffer]' === c.call(e) ? new Uint8Array(e) : e, a.next_in = 0, a.avail_in = a.input.length;
            do {
                if (0 === a.avail_out && (a.output = new o.Buf8(n), a.next_out = 0, a.avail_out = n), r = i.deflate(a, d), r !== f && r !== h) return this.onEnd(r), this.ended = !0, !1;
                (0 === a.avail_out || 0 === a.avail_in && (d === u || d === _)) && ('string' === this.options.to ? this.onData(s.buf2binstring(o.shrinkBuf(a.output, a.next_out))) : this.onData(o.shrinkBuf(a.output, a.next_out)))
            } while ((0 < a.avail_in || 0 === a.avail_out) && r !== f);
            return d === u ? (r = i.deflateEnd(this.strm), this.onEnd(r), this.ended = !0, r === h) : d !== _ || (this.onEnd(h), a.avail_out = 0, !0)
        }, n.prototype.onData = function (e) {
            this.chunks.push(e)
        }, n.prototype.onEnd = function (e) {
            e === h && ('string' === this.options.to ? this.result = this.chunks.join('') : this.result = o.flattenChunks(this.chunks)), this.chunks = [], this.err = e, this.msg = this.strm.msg
        }, t.Deflate = n, t.deflate = r, t.deflateRaw = function (e, t) {
            return t = t || {}, t.raw = !0, r(e, t)
        }, t.gzip = function (e, t) {
            return t = t || {}, t.gzip = !0, r(e, t)
        }
    }, function (e, t, a) {
        'use strict';

        function n(e, t) {
            return e.msg = R[t], t
        }

        function r(e) {
            return (e << 1) - (4 < e ? 9 : 0)
        }

        function i(e) {
            for (var t = e.length; 0 <= --t;) e[t] = 0
        }

        function o(e) {
            var t = e.state, a = t.pending;
            a > e.avail_out && (a = e.avail_out);
            0 === a || (x.arraySet(e.output, t.pending_buf, t.pending_out, a, e.next_out), e.next_out += a, t.pending_out += a, e.total_out += a, e.avail_out -= a, t.pending -= a, 0 === t.pending && (t.pending_out = 0))
        }

        function d(e, t) {
            k._tr_flush_block(e, 0 <= e.block_start ? e.block_start : -1, e.strstart - e.block_start, t), e.block_start = e.strstart, o(e.strm)
        }

        function l(e, t) {
            e.pending_buf[e.pending++] = t
        }

        function c(e, t) {
            e.pending_buf[e.pending++] = 255 & t >>> 8, e.pending_buf[e.pending++] = 255 & t
        }

        function u(e, t, a, n) {
            var r = e.avail_in;
            return (r > n && (r = n), 0 === r) ? 0 : (e.avail_in -= r, x.arraySet(t, e.input, e.next_in, r, a), 1 === e.state.wrap ? e.adler = T(e.adler, t, r, a) : 2 === e.state.wrap && (e.adler = I(e.adler, t, r, a)), e.next_in += r, e.total_in += r, r)
        }

        function h(e, t) {
            var a = e.max_chain_length, n = e.strstart, r = e.prev_length, i = e.nice_match,
                o = e.strstart > e.w_size - K ? e.strstart - (e.w_size - K) : 0, s = e.window, d = e.w_mask, l = e.prev,
                c = e.strstart + Z, u = s[n + r - 1], h = s[n + r], f, _;
            e.prev_length >= e.good_match && (a >>= 2), i > e.lookahead && (i = e.lookahead);
            do {
                if (f = t, s[f + r] !== h || s[f + r - 1] !== u || s[f] !== s[n] || s[++f] !== s[n + 1]) continue;
                n += 2, f++;
                do ; while (s[++n] === s[++f] && s[++n] === s[++f] && s[++n] === s[++f] && s[++n] === s[++f] && s[++n] === s[++f] && s[++n] === s[++f] && s[++n] === s[++f] && s[++n] === s[++f] && n < c);
                if (_ = Z - (c - n), n = c - Z, _ > r) {
                    if (e.match_start = t, r = _, _ >= i) break;
                    u = s[n + r - 1], h = s[n + r]
                }
            } while ((t = l[t & d]) > o && 0 != --a);
            return r <= e.lookahead ? r : e.lookahead
        }

        function f(e) {
            var t = e.w_size, a, r, n, i, o;
            do {
                if (i = e.window_size - e.lookahead - e.strstart, e.strstart >= t + (t - K)) {
                    x.arraySet(e.window, e.window, t, t, 0), e.match_start -= t, e.strstart -= t, e.block_start -= t, r = e.hash_size, a = r;
                    do n = e.head[--a], e.head[a] = n >= t ? n - t : 0; while (--r);
                    r = t, a = r;
                    do n = e.prev[--a], e.prev[a] = n >= t ? n - t : 0; while (--r);
                    i += t
                }
                if (0 === e.strm.avail_in) break;
                if (r = u(e.strm, e.window, e.strstart + e.lookahead, i), e.lookahead += r, e.lookahead + e.insert >= V) for (o = e.strstart - e.insert, e.ins_h = e.window[o], e.ins_h = (e.ins_h << e.hash_shift ^ e.window[o + 1]) & e.hash_mask; e.insert && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[o + V - 1]) & e.hash_mask, e.prev[o & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = o, o++, e.insert--, !(e.lookahead + e.insert < V));) ;
            } while (e.lookahead < K && 0 !== e.strm.avail_in)
        }

        function s(e, t) {
            for (var a, n; ;) {
                if (e.lookahead < K) {
                    if (f(e), e.lookahead < K && t === S) return ne;
                    if (0 === e.lookahead) break
                }
                if (a = 0, e.lookahead >= V && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + V - 1]) & e.hash_mask, a = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart), 0 !== a && e.strstart - a <= e.w_size - K && (e.match_length = h(e, a)), !(e.match_length >= V)) n = k._tr_tally(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++; else if (n = k._tr_tally(e, e.strstart - e.match_start, e.match_length - V), e.lookahead -= e.match_length, e.match_length <= e.max_lazy_match && e.lookahead >= V) {
                    e.match_length--;
                    do e.strstart++, e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + V - 1]) & e.hash_mask, a = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart; while (0 != --e.match_length);
                    e.strstart++
                } else e.strstart += e.match_length, e.match_length = 0, e.ins_h = e.window[e.strstart], e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + 1]) & e.hash_mask;
                if (n && (d(e, !1), 0 === e.strm.avail_out)) return ne
            }
            return e.insert = e.strstart < V - 1 ? e.strstart : V - 1, t === C ? (d(e, !0), 0 === e.strm.avail_out ? ie : oe) : e.last_lit && (d(e, !1), 0 === e.strm.avail_out) ? ne : re
        }

        function _(e, t) {
            for (var a, n, r; ;) {
                if (e.lookahead < K) {
                    if (f(e), e.lookahead < K && t === S) return ne;
                    if (0 === e.lookahead) break
                }
                if (a = 0, e.lookahead >= V && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + V - 1]) & e.hash_mask, a = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart), e.prev_length = e.match_length, e.prev_match = e.match_start, e.match_length = V - 1, 0 !== a && e.prev_length < e.max_lazy_match && e.strstart - a <= e.w_size - K && (e.match_length = h(e, a), 5 >= e.match_length && (e.strategy === P || e.match_length === V && 4096 < e.strstart - e.match_start) && (e.match_length = V - 1)), e.prev_length >= V && e.match_length <= e.prev_length) {
                    r = e.strstart + e.lookahead - V, n = k._tr_tally(e, e.strstart - 1 - e.prev_match, e.prev_length - V), e.lookahead -= e.prev_length - 1, e.prev_length -= 2;
                    do ++e.strstart <= r && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + V - 1]) & e.hash_mask, a = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart); while (0 != --e.prev_length);
                    if (e.match_available = 0, e.match_length = V - 1, e.strstart++, n && (d(e, !1), 0 === e.strm.avail_out)) return ne
                } else if (!e.match_available) e.match_available = 1, e.strstart++, e.lookahead--; else if (n = k._tr_tally(e, 0, e.window[e.strstart - 1]), n && d(e, !1), e.strstart++, e.lookahead--, 0 === e.strm.avail_out) return ne
            }
            return e.match_available && (n = k._tr_tally(e, 0, e.window[e.strstart - 1]), e.match_available = 0), e.insert = e.strstart < V - 1 ? e.strstart : V - 1, t === C ? (d(e, !0), 0 === e.strm.avail_out ? ie : oe) : e.last_lit && (d(e, !1), 0 === e.strm.avail_out) ? ne : re
        }

        function m(e, t) {
            for (var a = e.window, n, r, i, o; ;) {
                if (e.lookahead <= Z) {
                    if (f(e), e.lookahead <= Z && t === S) return ne;
                    if (0 === e.lookahead) break
                }
                if (e.match_length = 0, e.lookahead >= V && 0 < e.strstart && (i = e.strstart - 1, r = a[i], r === a[++i] && r === a[++i] && r === a[++i])) {
                    o = e.strstart + Z;
                    do ; while (r === a[++i] && r === a[++i] && r === a[++i] && r === a[++i] && r === a[++i] && r === a[++i] && r === a[++i] && r === a[++i] && i < o);
                    e.match_length = Z - (o - i), e.match_length > e.lookahead && (e.match_length = e.lookahead)
                }
                if (e.match_length >= V ? (n = k._tr_tally(e, 1, e.match_length - V), e.lookahead -= e.match_length, e.strstart += e.match_length, e.match_length = 0) : (n = k._tr_tally(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++), n && (d(e, !1), 0 === e.strm.avail_out)) return ne
            }
            return e.insert = 0, t === C ? (d(e, !0), 0 === e.strm.avail_out ? ie : oe) : e.last_lit && (d(e, !1), 0 === e.strm.avail_out) ? ne : re
        }

        function p(e, t) {
            for (var a; ;) {
                if (0 === e.lookahead && (f(e), 0 === e.lookahead)) {
                    if (t === S) return ne;
                    break
                }
                if (e.match_length = 0, a = k._tr_tally(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++, a && (d(e, !1), 0 === e.strm.avail_out)) return ne
            }
            return e.insert = 0, t === C ? (d(e, !0), 0 === e.strm.avail_out ? ie : oe) : e.last_lit && (d(e, !1), 0 === e.strm.avail_out) ? ne : re
        }

        function g(e, t, a, n, r) {
            this.good_length = e, this.max_lazy = t, this.nice_length = a, this.max_chain = n, this.func = r
        }

        function b(e) {
            e.window_size = 2 * e.w_size, i(e.head), e.max_lazy_match = se[e.level].max_lazy, e.good_match = se[e.level].good_length, e.nice_match = se[e.level].nice_length, e.max_chain_length = se[e.level].max_chain, e.strstart = 0, e.block_start = 0, e.lookahead = 0, e.insert = 0, e.match_length = e.prev_length = V - 1, e.match_available = 0, e.ins_h = 0
        }

        function y() {
            this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = U, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new x.Buf16(2 * X), this.dyn_dtree = new x.Buf16(2 * (2 * H + 1)), this.bl_tree = new x.Buf16(2 * (2 * G + 1)), i(this.dyn_ltree), i(this.dyn_dtree), i(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new x.Buf16(Y + 1), this.heap = new x.Buf16(2 * W + 1), i(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new x.Buf16(2 * W + 1), i(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0
        }

        function v(e) {
            var t;
            return e && e.state ? (e.total_in = e.total_out = 0, e.data_type = M, t = e.state, t.pending = 0, t.pending_out = 0, 0 > t.wrap && (t.wrap = -t.wrap), t.status = t.wrap ? q : te, e.adler = 2 === t.wrap ? 0 : 1, t.last_flush = S, k._tr_init(t), D) : n(e, z)
        }

        function w(e) {
            var t = v(e);
            return t === D && b(e.state), t
        }

        function E(e, t, a, r, i, o) {
            if (!e) return z;
            var d = 1;
            if (t === L && (t = 6), 0 > r ? (d = 0, r = -r) : 15 < r && (d = 2, r -= 16), 1 > i || i > j || a !== U || 8 > r || 15 < r || 0 > t || 9 < t || 0 > o || o > F) return n(e, z);
            8 === r && (r = 9);
            var l = new y;
            return e.state = l, l.strm = e, l.wrap = d, l.gzhead = null, l.w_bits = r, l.w_size = 1 << l.w_bits, l.w_mask = l.w_size - 1, l.hash_bits = i + 7, l.hash_size = 1 << l.hash_bits, l.hash_mask = l.hash_size - 1, l.hash_shift = ~~((l.hash_bits + V - 1) / V), l.window = new x.Buf8(2 * l.w_size), l.head = new x.Buf16(l.hash_size), l.prev = new x.Buf16(l.w_size), l.lit_bufsize = 1 << i + 6, l.pending_buf_size = 4 * l.lit_bufsize, l.pending_buf = new x.Buf8(l.pending_buf_size), l.d_buf = 1 * l.lit_bufsize, l.l_buf = 3 * l.lit_bufsize, l.level = t, l.strategy = o, l.method = a, w(e)
        }

        var x = a(0), k = a(27), T = a(9), I = a(10), R = a(8), S = 0, C = 4, B = 5, D = 0, A = 1, z = -2, N = -5,
            L = -1, P = 1, O = 2, F = 4, M = 2, U = 8, j = 9, W = 256 + 1 + 29, H = 30, G = 19, X = 2 * W + 1, Y = 15,
            V = 3, Z = 258, K = Z + V + 1, q = 42, Q = 69, J = 73, $ = 91, ee = 103, te = 113, ae = 666, ne = 1, re = 2,
            ie = 3, oe = 4, se;
        se = [new g(0, 0, 0, 0, function (e, t) {
            var a = 65535;
            for (a > e.pending_buf_size - 5 && (a = e.pending_buf_size - 5); ;) {
                if (1 >= e.lookahead) {
                    if (f(e), 0 === e.lookahead && t === S) return ne;
                    if (0 === e.lookahead) break
                }
                e.strstart += e.lookahead, e.lookahead = 0;
                var n = e.block_start + a;
                if ((0 === e.strstart || e.strstart >= n) && (e.lookahead = e.strstart - n, e.strstart = n, d(e, !1), 0 === e.strm.avail_out)) return ne;
                if (e.strstart - e.block_start >= e.w_size - K && (d(e, !1), 0 === e.strm.avail_out)) return ne
            }
            return e.insert = 0, t === C ? (d(e, !0), 0 === e.strm.avail_out ? ie : oe) : e.strstart > e.block_start && (d(e, !1), 0 === e.strm.avail_out) ? ne : ne
        }), new g(4, 4, 8, 4, s), new g(4, 5, 16, 8, s), new g(4, 6, 32, 32, s), new g(4, 4, 16, 16, _), new g(8, 16, 32, 32, _), new g(8, 16, 128, 128, _), new g(8, 32, 128, 256, _), new g(32, 128, 258, 1024, _), new g(32, 258, 258, 4096, _)], t.deflateInit = function (e, t) {
            return E(e, t, U, 15, 8, 0)
        }, t.deflateInit2 = E, t.deflateReset = w, t.deflateResetKeep = v, t.deflateSetHeader = function (e, t) {
            return e && e.state ? 2 === e.state.wrap ? (e.state.gzhead = t, D) : z : z
        }, t.deflate = function (e, t) {
            var a, d, s, u;
            if (!e || !e.state || t > B || 0 > t) return e ? n(e, z) : z;
            if (d = e.state, !e.output || !e.input && 0 !== e.avail_in || d.status === ae && t !== C) return n(e, 0 === e.avail_out ? N : z);
            if (d.strm = e, a = d.last_flush, d.last_flush = t, d.status === q) if (2 === d.wrap) e.adler = 0, l(d, 31), l(d, 139), l(d, 8), d.gzhead ? (l(d, (d.gzhead.text ? 1 : 0) + (d.gzhead.hcrc ? 2 : 0) + (d.gzhead.extra ? 4 : 0) + (d.gzhead.name ? 8 : 0) + (d.gzhead.comment ? 16 : 0)), l(d, 255 & d.gzhead.time), l(d, 255 & d.gzhead.time >> 8), l(d, 255 & d.gzhead.time >> 16), l(d, 255 & d.gzhead.time >> 24), l(d, 9 === d.level ? 2 : d.strategy >= O || 2 > d.level ? 4 : 0), l(d, 255 & d.gzhead.os), d.gzhead.extra && d.gzhead.extra.length && (l(d, 255 & d.gzhead.extra.length), l(d, 255 & d.gzhead.extra.length >> 8)), d.gzhead.hcrc && (e.adler = I(e.adler, d.pending_buf, d.pending, 0)), d.gzindex = 0, d.status = Q) : (l(d, 0), l(d, 0), l(d, 0), l(d, 0), l(d, 0), l(d, 9 === d.level ? 2 : d.strategy >= O || 2 > d.level ? 4 : 0), l(d, 3), d.status = te); else {
                var h = U + (d.w_bits - 8 << 4) << 8, f = -1;
                f = d.strategy >= O || 2 > d.level ? 0 : 6 > d.level ? 1 : 6 === d.level ? 2 : 3, h |= f << 6, 0 !== d.strstart && (h |= 32), h += 31 - h % 31, d.status = te, c(d, h), 0 !== d.strstart && (c(d, e.adler >>> 16), c(d, 65535 & e.adler)), e.adler = 1
            }
            if (d.status === Q) if (d.gzhead.extra) {
                for (s = d.pending; d.gzindex < (65535 & d.gzhead.extra.length) && !(d.pending === d.pending_buf_size && (d.gzhead.hcrc && d.pending > s && (e.adler = I(e.adler, d.pending_buf, d.pending - s, s)), o(e), s = d.pending, d.pending === d.pending_buf_size));) l(d, 255 & d.gzhead.extra[d.gzindex]), d.gzindex++;
                d.gzhead.hcrc && d.pending > s && (e.adler = I(e.adler, d.pending_buf, d.pending - s, s)), d.gzindex === d.gzhead.extra.length && (d.gzindex = 0, d.status = J)
            } else d.status = J;
            if (d.status === J) if (d.gzhead.name) {
                s = d.pending;
                do {
                    if (d.pending === d.pending_buf_size && (d.gzhead.hcrc && d.pending > s && (e.adler = I(e.adler, d.pending_buf, d.pending - s, s)), o(e), s = d.pending, d.pending === d.pending_buf_size)) {
                        u = 1;
                        break
                    }
                    u = d.gzindex < d.gzhead.name.length ? 255 & d.gzhead.name.charCodeAt(d.gzindex++) : 0, l(d, u)
                } while (0 !== u);
                d.gzhead.hcrc && d.pending > s && (e.adler = I(e.adler, d.pending_buf, d.pending - s, s)), 0 === u && (d.gzindex = 0, d.status = $)
            } else d.status = $;
            if (d.status === $) if (d.gzhead.comment) {
                s = d.pending;
                do {
                    if (d.pending === d.pending_buf_size && (d.gzhead.hcrc && d.pending > s && (e.adler = I(e.adler, d.pending_buf, d.pending - s, s)), o(e), s = d.pending, d.pending === d.pending_buf_size)) {
                        u = 1;
                        break
                    }
                    u = d.gzindex < d.gzhead.comment.length ? 255 & d.gzhead.comment.charCodeAt(d.gzindex++) : 0, l(d, u)
                } while (0 !== u);
                d.gzhead.hcrc && d.pending > s && (e.adler = I(e.adler, d.pending_buf, d.pending - s, s)), 0 === u && (d.status = ee)
            } else d.status = ee;
            if (d.status === ee && (d.gzhead.hcrc ? (d.pending + 2 > d.pending_buf_size && o(e), d.pending + 2 <= d.pending_buf_size && (l(d, 255 & e.adler), l(d, 255 & e.adler >> 8), e.adler = 0, d.status = te)) : d.status = te), 0 !== d.pending) {
                if (o(e), 0 === e.avail_out) return d.last_flush = -1, D;
            } else if (0 === e.avail_in && r(t) <= r(a) && t !== C) return n(e, N);
            if (d.status === ae && 0 !== e.avail_in) return n(e, N);
            if (0 !== e.avail_in || 0 !== d.lookahead || t !== S && d.status !== ae) {
                var _ = d.strategy === O ? p(d, t) : d.strategy === 3 ? m(d, t) : se[d.level].func(d, t);
                if ((_ === ie || _ === oe) && (d.status = ae), _ === ne || _ === ie) return 0 === e.avail_out && (d.last_flush = -1), D;
                if (_ === re && (t === 1 ? k._tr_align(d) : t !== B && (k._tr_stored_block(d, 0, 0, !1), t === 3 && (i(d.head), 0 === d.lookahead && (d.strstart = 0, d.block_start = 0, d.insert = 0))), o(e), 0 === e.avail_out)) return d.last_flush = -1, D
            }
            return t === C ? 0 >= d.wrap ? A : (2 === d.wrap ? (l(d, 255 & e.adler), l(d, 255 & e.adler >> 8), l(d, 255 & e.adler >> 16), l(d, 255 & e.adler >> 24), l(d, 255 & e.total_in), l(d, 255 & e.total_in >> 8), l(d, 255 & e.total_in >> 16), l(d, 255 & e.total_in >> 24)) : (c(d, e.adler >>> 16), c(d, 65535 & e.adler)), o(e), 0 < d.wrap && (d.wrap = -d.wrap), 0 === d.pending ? A : D) : D
        }, t.deflateEnd = function (e) {
            var t;
            return e && e.state ? (t = e.state.status, t !== q && t !== Q && t !== J && t !== $ && t !== ee && t !== te && t !== ae) ? n(e, z) : (e.state = null, t === te ? n(e, -3) : D) : z
        }, t.deflateSetDictionary = function (e, t) {
            var a = t.length, r, o, s, n, d, l, c, u;
            if (!e || !e.state) return z;
            if (r = e.state, n = r.wrap, 2 === n || 1 === n && r.status !== q || r.lookahead) return z;
            for (1 === n && (e.adler = T(e.adler, t, a, 0)), r.wrap = 0, a >= r.w_size && (0 === n && (i(r.head), r.strstart = 0, r.block_start = 0, r.insert = 0), u = new x.Buf8(r.w_size), x.arraySet(u, t, a - r.w_size, r.w_size, 0), t = u, a = r.w_size), d = e.avail_in, l = e.next_in, c = e.input, e.avail_in = a, e.next_in = 0, e.input = t, f(r); r.lookahead >= V;) {
                o = r.strstart, s = r.lookahead - (V - 1);
                do r.ins_h = (r.ins_h << r.hash_shift ^ r.window[o + V - 1]) & r.hash_mask, r.prev[o & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = o, o++; while (--s);
                r.strstart = o, r.lookahead = V - 1, f(r)
            }
            return r.strstart += r.lookahead, r.block_start = r.strstart, r.insert = r.lookahead, r.lookahead = 0, r.match_length = r.prev_length = V - 1, r.match_available = 0, e.next_in = l, e.input = c, e.avail_in = d, r.wrap = n, D
        }, t.deflateInfo = 'pako deflate (from Nodeca project)'
    }, function (e, t, a) {
        'use strict';

        function n(e) {
            for (var t = e.length; 0 <= --t;) e[t] = 0
        }

        function r(e, t, a, n, r) {
            this.static_tree = e, this.extra_bits = t, this.extra_base = a, this.elems = n, this.max_length = r, this.has_stree = e && e.length
        }

        function i(e, t) {
            this.dyn_tree = e, this.max_code = 0, this.stat_desc = t
        }

        function o(e) {
            return 256 > e ? J[e] : J[256 + (e >>> 7)]
        }

        function d(e, t) {
            e.pending_buf[e.pending++] = 255 & t, e.pending_buf[e.pending++] = 255 & t >>> 8
        }

        function l(e, t, a) {
            e.bi_valid > U - a ? (e.bi_buf |= 65535 & t << e.bi_valid, d(e, e.bi_buf), e.bi_buf = t >> U - e.bi_valid, e.bi_valid += a - U) : (e.bi_buf |= 65535 & t << e.bi_valid, e.bi_valid += a)
        }

        function c(e, t, a) {
            l(e, a[2 * t], a[2 * t + 1])
        }

        function s(e, t) {
            var a = 0;
            do a |= 1 & e, e >>>= 1, a <<= 1; while (0 < --t);
            return a >>> 1
        }

        function u(e) {
            16 === e.bi_valid ? (d(e, e.bi_buf), e.bi_buf = 0, e.bi_valid = 0) : 8 <= e.bi_valid && (e.pending_buf[e.pending++] = 255 & e.bi_buf, e.bi_buf >>= 8, e.bi_valid -= 8)
        }

        function h(e, t) {
            var a = t.dyn_tree, r = t.max_code, i = t.stat_desc.static_tree, o = t.stat_desc.has_stree,
                s = t.stat_desc.extra_bits, d = t.stat_desc.extra_base, l = t.stat_desc.max_length, c = 0, u, h, n, _,
                m, p;
            for (_ = 0; _ <= M; _++) e.bl_count[_] = 0;
            for (a[2 * e.heap[e.heap_max] + 1] = 0, u = e.heap_max + 1; u < F; u++) (h = e.heap[u], _ = a[2 * a[2 * h + 1] + 1] + 1, _ > l && (_ = l, c++), a[2 * h + 1] = _, !(h > r)) && (e.bl_count[_]++, m = 0, h >= d && (m = s[h - d]), p = a[2 * h], e.opt_len += p * (_ + m), o && (e.static_len += p * (i[2 * h + 1] + m)));
            if (0 != c) {
                do {
                    for (_ = l - 1; 0 === e.bl_count[_];) _--;
                    e.bl_count[_]--, e.bl_count[_ + 1] += 2, e.bl_count[l]--, c -= 2
                } while (0 < c);
                for (_ = l; 0 !== _; _--) for (h = e.bl_count[_]; 0 !== h;) (n = e.heap[--u], !(n > r)) && (a[2 * n + 1] !== _ && (e.opt_len += (_ - a[2 * n + 1]) * a[2 * n], a[2 * n + 1] = _), h--)
            }
        }

        function f(e, t, a) {
            var r = Array(M + 1), i = 0, o, d;
            for (o = 1; o <= M; o++) r[o] = i = i + a[o - 1] << 1;
            for (d = 0; d <= t; d++) {
                var n = e[2 * d + 1];
                0 !== n && (e[2 * d] = s(r[n]++, n))
            }
        }

        function _() {
            var e = Array(M + 1), t, a, n, i, o;
            for (n = 0, i = 0; i < z - 1; i++) for (ee[i] = n, t = 0; t < 1 << Y[i]; t++) $[n++] = i;
            for ($[n - 1] = i, o = 0, i = 0; 16 > i; i++) for (te[i] = o, t = 0; t < 1 << V[i]; t++) J[o++] = i;
            for (o >>= 7; i < P; i++) for (te[i] = o << 7, t = 0; t < 1 << V[i] - 7; t++) J[256 + o++] = i;
            for (a = 0; a <= M; a++) e[a] = 0;
            for (t = 0; 143 >= t;) q[2 * t + 1] = 8, t++, e[8]++;
            for (; 255 >= t;) q[2 * t + 1] = 9, t++, e[9]++;
            for (; 279 >= t;) q[2 * t + 1] = 7, t++, e[7]++;
            for (; 287 >= t;) q[2 * t + 1] = 8, t++, e[8]++;
            for (f(q, L + 1, e), t = 0; t < P; t++) Q[2 * t + 1] = 5, Q[2 * t] = s(t, 5);
            ne = new r(q, Y, N + 1, L, M), re = new r(Q, V, 0, P, M), ie = new r([], Z, 0, O, j)
        }

        function m(e) {
            var t;
            for (t = 0; t < L; t++) e.dyn_ltree[2 * t] = 0;
            for (t = 0; t < P; t++) e.dyn_dtree[2 * t] = 0;
            for (t = 0; t < O; t++) e.bl_tree[2 * t] = 0;
            e.dyn_ltree[2 * W] = 1, e.opt_len = e.static_len = 0, e.last_lit = e.matches = 0
        }

        function p(e) {
            8 < e.bi_valid ? d(e, e.bi_buf) : 0 < e.bi_valid && (e.pending_buf[e.pending++] = e.bi_buf), e.bi_buf = 0, e.bi_valid = 0
        }

        function g(e, t, a, n) {
            p(e), n && (d(e, a), d(e, ~a)), S.arraySet(e.pending_buf, e.window, t, a, e.pending), e.pending += a
        }

        function b(e, t, a, n) {
            var r = 2 * t, i = 2 * a;
            return e[r] < e[i] || e[r] === e[i] && n[t] <= n[a]
        }

        function y(e, t, a) {
            for (var n = e.heap[a], r = a << 1; r <= e.heap_len && (r < e.heap_len && b(t, e.heap[r + 1], e.heap[r], e.depth) && r++, !b(t, n, e.heap[r], e.depth));) e.heap[a] = e.heap[r], a = r, r <<= 1;
            e.heap[a] = n
        }

        function v(e, t, a) {
            var n = 0, r, i, s, d;
            if (0 !== e.last_lit) do r = e.pending_buf[e.d_buf + 2 * n] << 8 | e.pending_buf[e.d_buf + 2 * n + 1], i = e.pending_buf[e.l_buf + n], n++, 0 === r ? c(e, i, t) : (s = $[i], c(e, s + N + 1, t), d = Y[s], 0 !== d && (i -= ee[s], l(e, i, d)), r--, s = o(r), c(e, s, a), d = V[s], 0 !== d && (r -= te[s], l(e, r, d))); while (n < e.last_lit);
            c(e, W, t)
        }

        function w(e, t) {
            var a = t.dyn_tree, r = t.stat_desc.static_tree, i = t.stat_desc.has_stree, o = t.stat_desc.elems, s = -1,
                d, n, l;
            for (e.heap_len = 0, e.heap_max = F, d = 0; d < o; d++) 0 === a[2 * d] ? a[2 * d + 1] = 0 : (e.heap[++e.heap_len] = s = d, e.depth[d] = 0);
            for (; 2 > e.heap_len;) l = e.heap[++e.heap_len] = 2 > s ? ++s : 0, a[2 * l] = 1, e.depth[l] = 0, e.opt_len--, i && (e.static_len -= r[2 * l + 1]);
            for (t.max_code = s, d = e.heap_len >> 1; 1 <= d; d--) y(e, a, d);
            l = o;
            do d = e.heap[1], e.heap[1] = e.heap[e.heap_len--], y(e, a, 1), n = e.heap[1], e.heap[--e.heap_max] = d, e.heap[--e.heap_max] = n, a[2 * l] = a[2 * d] + a[2 * n], e.depth[l] = (e.depth[d] >= e.depth[n] ? e.depth[d] : e.depth[n]) + 1, a[2 * d + 1] = a[2 * n + 1] = l, e.heap[1] = l++, y(e, a, 1); while (2 <= e.heap_len);
            e.heap[--e.heap_max] = e.heap[1], h(e, t), f(a, s, e.bl_count)
        }

        function E(e, t, a) {
            var r = -1, i = t[1], o = 0, s = 7, d = 4, l, n;
            for (0 === i && (s = 138, d = 3), t[2 * (a + 1) + 1] = 65535, l = 0; l <= a; l++) {
                if (n = i, i = t[2 * (l + 1) + 1], ++o < s && n === i) continue; else o < d ? e.bl_tree[2 * n] += o : 0 === n ? 10 >= o ? e.bl_tree[2 * G]++ : e.bl_tree[2 * X]++ : (n !== r && e.bl_tree[2 * n]++, e.bl_tree[2 * H]++);
                o = 0, r = n, 0 === i ? (s = 138, d = 3) : n === i ? (s = 6, d = 3) : (s = 7, d = 4)
            }
        }

        function x(e, t, a) {
            var r = -1, i = t[1], o = 0, s = 7, d = 4, u, n;
            for (0 === i && (s = 138, d = 3), u = 0; u <= a; u++) {
                if (n = i, i = t[2 * (u + 1) + 1], ++o < s && n === i) continue; else if (o < d) do c(e, n, e.bl_tree); while (0 != --o); else 0 === n ? 10 >= o ? (c(e, G, e.bl_tree), l(e, o - 3, 3)) : (c(e, X, e.bl_tree), l(e, o - 11, 7)) : (n !== r && (c(e, n, e.bl_tree), o--), c(e, H, e.bl_tree), l(e, o - 3, 2));
                o = 0, r = n, 0 === i ? (s = 138, d = 3) : n === i ? (s = 6, d = 3) : (s = 7, d = 4)
            }
        }

        function k(e) {
            var t;
            for (E(e, e.dyn_ltree, e.l_desc.max_code), E(e, e.dyn_dtree, e.d_desc.max_code), w(e, e.bl_desc), t = O - 1; 3 <= t && 0 === e.bl_tree[2 * K[t] + 1]; t--) ;
            return e.opt_len += 3 * (t + 1) + 5 + 5 + 4, t
        }

        function T(e, t, a, n) {
            var r;
            for (l(e, t - 257, 5), l(e, a - 1, 5), l(e, n - 4, 4), r = 0; r < n; r++) l(e, e.bl_tree[2 * K[r] + 1], 3);
            x(e, e.dyn_ltree, t - 1), x(e, e.dyn_dtree, a - 1)
        }

        function I(e) {
            var t = 4093624447, a;
            for (a = 0; 31 >= a; a++, t >>>= 1) if (1 & t && 0 !== e.dyn_ltree[2 * a]) return C;
            if (0 !== e.dyn_ltree[18] || 0 !== e.dyn_ltree[20] || 0 !== e.dyn_ltree[26]) return B;
            for (a = 32; a < N; a++) if (0 !== e.dyn_ltree[2 * a]) return B;
            return C
        }

        function R(e, t, a, n) {
            l(e, (D << 1) + (n ? 1 : 0), 3), g(e, t, a, !0)
        }

        var S = a(0), C = 0, B = 1, D = 0, A = 1, z = 29, N = 256, L = N + 1 + z, P = 30, O = 19, F = 2 * L + 1, M = 15,
            U = 16, j = 7, W = 256, H = 16, G = 17, X = 18,
            Y = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0],
            V = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13],
            Z = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7],
            K = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], q = Array(2 * (L + 2));
        n(q);
        var Q = Array(2 * P);
        n(Q);
        var J = Array(512);
        n(J);
        var $ = Array(258 - 3 + 1);
        n($);
        var ee = Array(z);
        n(ee);
        var te = Array(P);
        n(te);
        var ae = !1, ne, re, ie;
        t._tr_init = function (e) {
            ae || (_(), ae = !0), e.l_desc = new i(e.dyn_ltree, ne), e.d_desc = new i(e.dyn_dtree, re), e.bl_desc = new i(e.bl_tree, ie), e.bi_buf = 0, e.bi_valid = 0, m(e)
        }, t._tr_stored_block = R, t._tr_flush_block = function (e, t, a, n) {
            var r = 0, i, o;
            0 < e.level ? (e.strm.data_type === 2 && (e.strm.data_type = I(e)), w(e, e.l_desc), w(e, e.d_desc), r = k(e), i = e.opt_len + 3 + 7 >>> 3, o = e.static_len + 3 + 7 >>> 3, o <= i && (i = o)) : i = o = a + 5, a + 4 <= i && -1 !== t ? R(e, t, a, n) : e.strategy === 4 || o === i ? (l(e, (A << 1) + (n ? 1 : 0), 3), v(e, q, Q)) : (l(e, (2 << 1) + (n ? 1 : 0), 3), T(e, e.l_desc.max_code + 1, e.d_desc.max_code + 1, r + 1), v(e, e.dyn_ltree, e.dyn_dtree)), m(e), n && p(e)
        }, t._tr_tally = function (e, t, a) {
            return e.pending_buf[e.d_buf + 2 * e.last_lit] = 255 & t >>> 8, e.pending_buf[e.d_buf + 2 * e.last_lit + 1] = 255 & t, e.pending_buf[e.l_buf + e.last_lit] = 255 & a, e.last_lit++, 0 === t ? e.dyn_ltree[2 * a]++ : (e.matches++, t--, e.dyn_ltree[2 * ($[a] + N + 1)]++, e.dyn_dtree[2 * o(t)]++), e.last_lit === e.lit_bufsize - 1
        }, t._tr_align = function (e) {
            l(e, A << 1, 3), c(e, W, q), u(e)
        }
    }, function (e, t, a) {
        'use strict';

        function n(e) {
            if (!(this instanceof n)) return new n(e);
            this.options = o.assign({chunkSize: 16384, windowBits: 0, to: ''}, e || {});
            var t = this.options;
            t.raw && 0 <= t.windowBits && 16 > t.windowBits && (t.windowBits = -t.windowBits, 0 === t.windowBits && (t.windowBits = -15)), 0 <= t.windowBits && 16 > t.windowBits && !(e && e.windowBits) && (t.windowBits += 32), 15 < t.windowBits && 48 > t.windowBits && 0 == (15 & t.windowBits) && (t.windowBits |= 15), this.err = 0, this.msg = '', this.ended = !1, this.chunks = [], this.strm = new c, this.strm.avail_out = 0;
            var a = i.inflateInit2(this.strm, t.windowBits);
            if (a !== d.Z_OK) throw new Error(l[a]);
            this.header = new u, i.inflateGetHeader(this.strm, this.header)
        }

        function r(e, t) {
            var a = new n(t);
            if (a.push(e, !0), a.err) throw a.msg || l[a.err];
            return a.result
        }

        var i = a(29), o = a(0), s = a(11), d = a(13), l = a(8), c = a(12), u = a(32), h = Object.prototype.toString;
        n.prototype.push = function (e, t) {
            var a = this.strm, n = this.options.chunkSize, r = this.options.dictionary, l = !1, c, u, f, _, m, p;
            if (this.ended) return !1;
            u = t === ~~t ? t : !0 === t ? d.Z_FINISH : d.Z_NO_FLUSH, a.input = 'string' == typeof e ? s.binstring2buf(e) : '[object ArrayBuffer]' === h.call(e) ? new Uint8Array(e) : e, a.next_in = 0, a.avail_in = a.input.length;
            do {
                if (0 === a.avail_out && (a.output = new o.Buf8(n), a.next_out = 0, a.avail_out = n), c = i.inflate(a, d.Z_NO_FLUSH), c === d.Z_NEED_DICT && r && (p = 'string' == typeof r ? s.string2buf(r) : '[object ArrayBuffer]' === h.call(r) ? new Uint8Array(r) : r, c = i.inflateSetDictionary(this.strm, p)), c === d.Z_BUF_ERROR && !0 == l && (c = d.Z_OK, l = !1), c !== d.Z_STREAM_END && c !== d.Z_OK) return this.onEnd(c), this.ended = !0, !1;
                a.next_out && (0 === a.avail_out || c === d.Z_STREAM_END || 0 === a.avail_in && (u === d.Z_FINISH || u === d.Z_SYNC_FLUSH)) && ('string' === this.options.to ? (f = s.utf8border(a.output, a.next_out), _ = a.next_out - f, m = s.buf2string(a.output, f), a.next_out = _, a.avail_out = n - _, _ && o.arraySet(a.output, a.output, f, _, 0), this.onData(m)) : this.onData(o.shrinkBuf(a.output, a.next_out))), 0 === a.avail_in && 0 === a.avail_out && (l = !0)
            } while ((0 < a.avail_in || 0 === a.avail_out) && c !== d.Z_STREAM_END);
            return c === d.Z_STREAM_END && (u = d.Z_FINISH), u === d.Z_FINISH ? (c = i.inflateEnd(this.strm), this.onEnd(c), this.ended = !0, c === d.Z_OK) : u !== d.Z_SYNC_FLUSH || (this.onEnd(d.Z_OK), a.avail_out = 0, !0)
        }, n.prototype.onData = function (e) {
            this.chunks.push(e)
        }, n.prototype.onEnd = function (e) {
            e === d.Z_OK && ('string' === this.options.to ? this.result = this.chunks.join('') : this.result = o.flattenChunks(this.chunks)), this.chunks = [], this.err = e, this.msg = this.strm.msg
        }, t.Inflate = n, t.inflate = r, t.inflateRaw = function (e, t) {
            return t = t || {}, t.raw = !0, r(e, t)
        }, t.ungzip = r
    }, function (t, a, n) {
        'use strict';

        function r(e) {
            return (255 & e >>> 24) + (65280 & e >>> 8) + ((65280 & e) << 8) + ((255 & e) << 24)
        }

        function i() {
            this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new h.Buf16(320), this.work = new h.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0
        }

        function o(e) {
            var t;
            return e && e.state ? (t = e.state, e.total_in = e.total_out = t.total = 0, e.msg = '', t.wrap && (e.adler = 1 & t.wrap), t.mode = I, t.last = 0, t.havedict = 0, t.dmax = 32768, t.head = null, t.hold = 0, t.bits = 0, t.lencode = t.lendyn = new h.Buf32(ne), t.distcode = t.distdyn = new h.Buf32(re), t.sane = 1, t.back = -1, w) : E
        }

        function s(e) {
            var t;
            return e && e.state ? (t = e.state, t.wsize = 0, t.whave = 0, t.wnext = 0, o(e)) : E
        }

        function d(e, t) {
            var a, n;
            return e && e.state ? (n = e.state, 0 > t ? (a = 0, t = -t) : (a = (t >> 4) + 1, 48 > t && (t &= 15)), t && (8 > t || 15 < t)) ? E : (null !== n.window && n.wbits !== t && (n.window = null), n.wrap = a, n.wbits = t, s(e)) : E
        }

        function l(e, t) {
            var a, n;
            return e ? (n = new i, e.state = n, n.window = null, a = d(e, t), a !== w && (e.state = null), a) : E
        }

        function c(e) {
            if (ie) {
                var t;
                for (oe = new h.Buf32(512), se = new h.Buf32(32), t = 0; 144 > t;) e.lens[t++] = 8;
                for (; 256 > t;) e.lens[t++] = 9;
                for (; 280 > t;) e.lens[t++] = 7;
                for (; 288 > t;) e.lens[t++] = 8;
                for (p(g, e.lens, 0, 288, oe, 0, e.work, {bits: 9}), t = 0; 32 > t;) e.lens[t++] = 5;
                p(b, e.lens, 0, 32, se, 0, e.work, {bits: 5}), ie = !1
            }
            e.lencode = oe, e.lenbits = 9, e.distcode = se, e.distbits = 5
        }

        function u(e, t, a, n) {
            var r = e.state, i;
            return null === r.window && (r.wsize = 1 << r.wbits, r.wnext = 0, r.whave = 0, r.window = new h.Buf8(r.wsize)), n >= r.wsize ? (h.arraySet(r.window, t, a - r.wsize, r.wsize, 0), r.wnext = 0, r.whave = r.wsize) : (i = r.wsize - r.wnext, i > n && (i = n), h.arraySet(r.window, t, a - n, i, r.wnext), n -= i, n ? (h.arraySet(r.window, t, a - n, n, 0), r.wnext = n, r.whave = r.wsize) : (r.wnext += i, r.wnext === r.wsize && (r.wnext = 0), r.whave < r.wsize && (r.whave += i))), 0
        }

        var h = n(0), f = n(9), _ = n(10), m = n(30), p = n(31), g = 1, b = 2, y = 4, v = 6, w = 0, E = -2, x = -3,
            k = -4, T = 8, I = 1, R = 2, S = 3, C = 4, B = 5, D = 6, A = 7, z = 8, N = 9, L = 10, P = 11, O = 12,
            F = 13, M = 14, U = 15, j = 16, W = 17, H = 18, G = 19, X = 20, Y = 21, V = 22, Z = 23, K = 24, q = 25,
            Q = 26, J = 27, $ = 28, ee = 29, te = 30, ae = 31, ne = 852, re = 592, ie = !0, oe, se;
        a.inflateReset = s, a.inflateReset2 = d, a.inflateResetKeep = o, a.inflateInit = function (e) {
            return l(e, 15)
        }, a.inflateInit2 = l, a.inflate = function (t, a) {
            var i = 0, o = new h.Buf8(4), s = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], d, l,
                ne, re, ie, oe, se, de, le, ce, ue, he, fe, _e, me, pe, ge, be, ye, ve, we, Ee, xe, ke;
            if (!t || !t.state || !t.output || !t.input && 0 !== t.avail_in) return E;
            d = t.state, d.mode === O && (d.mode = F), ie = t.next_out, ne = t.output, se = t.avail_out, re = t.next_in, l = t.input, oe = t.avail_in, de = d.hold, le = d.bits, ce = oe, ue = se, Ee = w;
            inf_leave:for (; ;) switch (d.mode) {
                case I:
                    if (0 === d.wrap) {
                        d.mode = F;
                        break
                    }
                    for (; 16 > le;) {
                        if (0 === oe) break inf_leave;
                        oe--, de += l[re++] << le, le += 8
                    }
                    if (2 & d.wrap && 35615 === de) {
                        d.check = 0, o[0] = 255 & de, o[1] = 255 & de >>> 8, d.check = _(d.check, o, 2, 0), de = 0, le = 0, d.mode = R;
                        break
                    }
                    if (d.flags = 0, d.head && (d.head.done = !1), !(1 & d.wrap) || (((255 & de) << 8) + (de >> 8)) % 31) {
                        t.msg = 'incorrect header check', d.mode = te;
                        break
                    }
                    if ((15 & de) != T) {
                        t.msg = 'unknown compression method', d.mode = te;
                        break
                    }
                    if (de >>>= 4, le -= 4, we = (15 & de) + 8, 0 === d.wbits) d.wbits = we; else if (we > d.wbits) {
                        t.msg = 'invalid window size', d.mode = te;
                        break
                    }
                    d.dmax = 1 << we, t.adler = d.check = 1, d.mode = 512 & de ? L : O, de = 0, le = 0;
                    break;
                case R:
                    for (; 16 > le;) {
                        if (0 === oe) break inf_leave;
                        oe--, de += l[re++] << le, le += 8
                    }
                    if (d.flags = de, (255 & d.flags) != T) {
                        t.msg = 'unknown compression method', d.mode = te;
                        break
                    }
                    if (57344 & d.flags) {
                        t.msg = 'unknown header flags set', d.mode = te;
                        break
                    }
                    d.head && (d.head.text = 1 & de >> 8), 512 & d.flags && (o[0] = 255 & de, o[1] = 255 & de >>> 8, d.check = _(d.check, o, 2, 0)), de = 0, le = 0, d.mode = S;
                case S:
                    for (; 32 > le;) {
                        if (0 === oe) break inf_leave;
                        oe--, de += l[re++] << le, le += 8
                    }
                    d.head && (d.head.time = de), 512 & d.flags && (o[0] = 255 & de, o[1] = 255 & de >>> 8, o[2] = 255 & de >>> 16, o[3] = 255 & de >>> 24, d.check = _(d.check, o, 4, 0)), de = 0, le = 0, d.mode = C;
                case C:
                    for (; 16 > le;) {
                        if (0 === oe) break inf_leave;
                        oe--, de += l[re++] << le, le += 8
                    }
                    d.head && (d.head.xflags = 255 & de, d.head.os = de >> 8), 512 & d.flags && (o[0] = 255 & de, o[1] = 255 & de >>> 8, d.check = _(d.check, o, 2, 0)), de = 0, le = 0, d.mode = B;
                case B:
                    if (1024 & d.flags) {
                        for (; 16 > le;) {
                            if (0 === oe) break inf_leave;
                            oe--, de += l[re++] << le, le += 8
                        }
                        d.length = de, d.head && (d.head.extra_len = de), 512 & d.flags && (o[0] = 255 & de, o[1] = 255 & de >>> 8, d.check = _(d.check, o, 2, 0)), de = 0, le = 0
                    } else d.head && (d.head.extra = null);
                    d.mode = D;
                case D:
                    if (1024 & d.flags && (he = d.length, he > oe && (he = oe), he && (d.head && (we = d.head.extra_len - d.length, !d.head.extra && (d.head.extra = Array(d.head.extra_len)), h.arraySet(d.head.extra, l, re, he, we)), 512 & d.flags && (d.check = _(d.check, l, he, re)), oe -= he, re += he, d.length -= he), d.length)) break inf_leave;
                    d.length = 0, d.mode = A;
                case A:
                    if (2048 & d.flags) {
                        if (0 === oe) break inf_leave;
                        he = 0;
                        do we = l[re + he++], d.head && we && 65536 > d.length && (d.head.name += e(we)); while (we && he < oe);
                        if (512 & d.flags && (d.check = _(d.check, l, he, re)), oe -= he, re += he, we) break inf_leave
                    } else d.head && (d.head.name = null);
                    d.length = 0, d.mode = z;
                case z:
                    if (4096 & d.flags) {
                        if (0 === oe) break inf_leave;
                        he = 0;
                        do we = l[re + he++], d.head && we && 65536 > d.length && (d.head.comment += e(we)); while (we && he < oe);
                        if (512 & d.flags && (d.check = _(d.check, l, he, re)), oe -= he, re += he, we) break inf_leave
                    } else d.head && (d.head.comment = null);
                    d.mode = N;
                case N:
                    if (512 & d.flags) {
                        for (; 16 > le;) {
                            if (0 === oe) break inf_leave;
                            oe--, de += l[re++] << le, le += 8
                        }
                        if (de !== (65535 & d.check)) {
                            t.msg = 'header crc mismatch', d.mode = te;
                            break
                        }
                        de = 0, le = 0
                    }
                    d.head && (d.head.hcrc = 1 & d.flags >> 9, d.head.done = !0), t.adler = d.check = 0, d.mode = O;
                    break;
                case L:
                    for (; 32 > le;) {
                        if (0 === oe) break inf_leave;
                        oe--, de += l[re++] << le, le += 8
                    }
                    t.adler = d.check = r(de), de = 0, le = 0, d.mode = P;
                case P:
                    if (0 === d.havedict) return t.next_out = ie, t.avail_out = se, t.next_in = re, t.avail_in = oe, d.hold = de, d.bits = le, 2;
                    t.adler = d.check = 1, d.mode = O;
                case O:
                    if (a === 5 || a === v) break inf_leave;
                case F:
                    if (d.last) {
                        de >>>= 7 & le, le -= 7 & le, d.mode = J;
                        break
                    }
                    for (; 3 > le;) {
                        if (0 === oe) break inf_leave;
                        oe--, de += l[re++] << le, le += 8
                    }
                    switch (d.last = 1 & de, de >>>= 1, le -= 1, 3 & de) {
                        case 0:
                            d.mode = M;
                            break;
                        case 1:
                            if (c(d), d.mode = X, a === v) {
                                de >>>= 2, le -= 2;
                                break inf_leave
                            }
                            break;
                        case 2:
                            d.mode = W;
                            break;
                        case 3:
                            t.msg = 'invalid block type', d.mode = te;
                    }
                    de >>>= 2, le -= 2;
                    break;
                case M:
                    for (de >>>= 7 & le, le -= 7 & le; 32 > le;) {
                        if (0 === oe) break inf_leave;
                        oe--, de += l[re++] << le, le += 8
                    }
                    if ((65535 & de) != (65535 ^ de >>> 16)) {
                        t.msg = 'invalid stored block lengths', d.mode = te;
                        break
                    }
                    if (d.length = 65535 & de, de = 0, le = 0, d.mode = U, a === v) break inf_leave;
                case U:
                    d.mode = j;
                case j:
                    if (he = d.length, he) {
                        if (he > oe && (he = oe), he > se && (he = se), 0 === he) break inf_leave;
                        h.arraySet(ne, l, re, he, ie), oe -= he, re += he, se -= he, ie += he, d.length -= he;
                        break
                    }
                    d.mode = O;
                    break;
                case W:
                    for (; 14 > le;) {
                        if (0 === oe) break inf_leave;
                        oe--, de += l[re++] << le, le += 8
                    }
                    if (d.nlen = (31 & de) + 257, de >>>= 5, le -= 5, d.ndist = (31 & de) + 1, de >>>= 5, le -= 5, d.ncode = (15 & de) + 4, de >>>= 4, le -= 4, 286 < d.nlen || 30 < d.ndist) {
                        t.msg = 'too many length or distance symbols', d.mode = te;
                        break
                    }
                    d.have = 0, d.mode = H;
                case H:
                    for (; d.have < d.ncode;) {
                        for (; 3 > le;) {
                            if (0 === oe) break inf_leave;
                            oe--, de += l[re++] << le, le += 8
                        }
                        d.lens[s[d.have++]] = 7 & de, de >>>= 3, le -= 3
                    }
                    for (; 19 > d.have;) d.lens[s[d.have++]] = 0;
                    if (d.lencode = d.lendyn, d.lenbits = 7, xe = {bits: d.lenbits}, Ee = p(0, d.lens, 0, 19, d.lencode, 0, d.work, xe), d.lenbits = xe.bits, Ee) {
                        t.msg = 'invalid code lengths set', d.mode = te;
                        break
                    }
                    d.have = 0, d.mode = G;
                case G:
                    for (; d.have < d.nlen + d.ndist;) {
                        for (; ;) {
                            if (i = d.lencode[de & (1 << d.lenbits) - 1], me = i >>> 24, pe = 255 & i >>> 16, ge = 65535 & i, me <= le) break;
                            if (0 === oe) break inf_leave;
                            oe--, de += l[re++] << le, le += 8
                        }
                        if (16 > ge) de >>>= me, le -= me, d.lens[d.have++] = ge; else {
                            if (16 === ge) {
                                for (ke = me + 2; le < ke;) {
                                    if (0 === oe) break inf_leave;
                                    oe--, de += l[re++] << le, le += 8
                                }
                                if (de >>>= me, le -= me, 0 === d.have) {
                                    t.msg = 'invalid bit length repeat', d.mode = te;
                                    break
                                }
                                we = d.lens[d.have - 1], he = 3 + (3 & de), de >>>= 2, le -= 2
                            } else if (17 === ge) {
                                for (ke = me + 3; le < ke;) {
                                    if (0 === oe) break inf_leave;
                                    oe--, de += l[re++] << le, le += 8
                                }
                                de >>>= me, le -= me, we = 0, he = 3 + (7 & de), de >>>= 3, le -= 3
                            } else {
                                for (ke = me + 7; le < ke;) {
                                    if (0 === oe) break inf_leave;
                                    oe--, de += l[re++] << le, le += 8
                                }
                                de >>>= me, le -= me, we = 0, he = 11 + (127 & de), de >>>= 7, le -= 7
                            }
                            if (d.have + he > d.nlen + d.ndist) {
                                t.msg = 'invalid bit length repeat', d.mode = te;
                                break
                            }
                            for (; he--;) d.lens[d.have++] = we
                        }
                    }
                    if (d.mode === te) break;
                    if (0 === d.lens[256]) {
                        t.msg = 'invalid code -- missing end-of-block', d.mode = te;
                        break
                    }
                    if (d.lenbits = 9, xe = {bits: d.lenbits}, Ee = p(g, d.lens, 0, d.nlen, d.lencode, 0, d.work, xe), d.lenbits = xe.bits, Ee) {
                        t.msg = 'invalid literal/lengths set', d.mode = te;
                        break
                    }
                    if (d.distbits = 6, d.distcode = d.distdyn, xe = {bits: d.distbits}, Ee = p(b, d.lens, d.nlen, d.ndist, d.distcode, 0, d.work, xe), d.distbits = xe.bits, Ee) {
                        t.msg = 'invalid distances set', d.mode = te;
                        break
                    }
                    if (d.mode = X, a === v) break inf_leave;
                case X:
                    d.mode = Y;
                case Y:
                    if (6 <= oe && 258 <= se) {
                        t.next_out = ie, t.avail_out = se, t.next_in = re, t.avail_in = oe, d.hold = de, d.bits = le, m(t, ue), ie = t.next_out, ne = t.output, se = t.avail_out, re = t.next_in, l = t.input, oe = t.avail_in, de = d.hold, le = d.bits, d.mode === O && (d.back = -1);
                        break
                    }
                    for (d.back = 0; ;) {
                        if (i = d.lencode[de & (1 << d.lenbits) - 1], me = i >>> 24, pe = 255 & i >>> 16, ge = 65535 & i, me <= le) break;
                        if (0 === oe) break inf_leave;
                        oe--, de += l[re++] << le, le += 8
                    }
                    if (pe && 0 == (240 & pe)) {
                        for (be = me, ye = pe, ve = ge; ;) {
                            if (i = d.lencode[ve + ((de & (1 << be + ye) - 1) >> be)], me = i >>> 24, pe = 255 & i >>> 16, ge = 65535 & i, be + me <= le) break;
                            if (0 === oe) break inf_leave;
                            oe--, de += l[re++] << le, le += 8
                        }
                        de >>>= be, le -= be, d.back += be
                    }
                    if (de >>>= me, le -= me, d.back += me, d.length = ge, 0 === pe) {
                        d.mode = Q;
                        break
                    }
                    if (32 & pe) {
                        d.back = -1, d.mode = O;
                        break
                    }
                    if (64 & pe) {
                        t.msg = 'invalid literal/length code', d.mode = te;
                        break
                    }
                    d.extra = 15 & pe, d.mode = V;
                case V:
                    if (d.extra) {
                        for (ke = d.extra; le < ke;) {
                            if (0 === oe) break inf_leave;
                            oe--, de += l[re++] << le, le += 8
                        }
                        d.length += de & (1 << d.extra) - 1, de >>>= d.extra, le -= d.extra, d.back += d.extra
                    }
                    d.was = d.length, d.mode = Z;
                case Z:
                    for (; ;) {
                        if (i = d.distcode[de & (1 << d.distbits) - 1], me = i >>> 24, pe = 255 & i >>> 16, ge = 65535 & i, me <= le) break;
                        if (0 === oe) break inf_leave;
                        oe--, de += l[re++] << le, le += 8
                    }
                    if (0 == (240 & pe)) {
                        for (be = me, ye = pe, ve = ge; ;) {
                            if (i = d.distcode[ve + ((de & (1 << be + ye) - 1) >> be)], me = i >>> 24, pe = 255 & i >>> 16, ge = 65535 & i, be + me <= le) break;
                            if (0 === oe) break inf_leave;
                            oe--, de += l[re++] << le, le += 8
                        }
                        de >>>= be, le -= be, d.back += be
                    }
                    if (de >>>= me, le -= me, d.back += me, 64 & pe) {
                        t.msg = 'invalid distance code', d.mode = te;
                        break
                    }
                    d.offset = ge, d.extra = 15 & pe, d.mode = K;
                case K:
                    if (d.extra) {
                        for (ke = d.extra; le < ke;) {
                            if (0 === oe) break inf_leave;
                            oe--, de += l[re++] << le, le += 8
                        }
                        d.offset += de & (1 << d.extra) - 1, de >>>= d.extra, le -= d.extra, d.back += d.extra
                    }
                    if (d.offset > d.dmax) {
                        t.msg = 'invalid distance too far back', d.mode = te;
                        break
                    }
                    d.mode = q;
                case q:
                    if (0 === se) break inf_leave;
                    if (he = ue - se, d.offset > he) {
                        if (he = d.offset - he, he > d.whave && d.sane) {
                            t.msg = 'invalid distance too far back', d.mode = te;
                            break
                        }
                        he > d.wnext ? (he -= d.wnext, fe = d.wsize - he) : fe = d.wnext - he, he > d.length && (he = d.length), _e = d.window
                    } else _e = ne, fe = ie - d.offset, he = d.length;
                    he > se && (he = se), se -= he, d.length -= he;
                    do ne[ie++] = _e[fe++]; while (--he);
                    0 === d.length && (d.mode = Y);
                    break;
                case Q:
                    if (0 === se) break inf_leave;
                    ne[ie++] = d.length, se--, d.mode = Y;
                    break;
                case J:
                    if (d.wrap) {
                        for (; 32 > le;) {
                            if (0 === oe) break inf_leave;
                            oe--, de |= l[re++] << le, le += 8
                        }
                        if (ue -= se, t.total_out += ue, d.total += ue, ue && (t.adler = d.check = d.flags ? _(d.check, ne, ue, ie - ue) : f(d.check, ne, ue, ie - ue)), ue = se, (d.flags ? de : r(de)) !== d.check) {
                            t.msg = 'incorrect data check', d.mode = te;
                            break
                        }
                        de = 0, le = 0
                    }
                    d.mode = $;
                case $:
                    if (d.wrap && d.flags) {
                        for (; 32 > le;) {
                            if (0 === oe) break inf_leave;
                            oe--, de += l[re++] << le, le += 8
                        }
                        if (de !== (4294967295 & d.total)) {
                            t.msg = 'incorrect length check', d.mode = te;
                            break
                        }
                        de = 0, le = 0
                    }
                    d.mode = ee;
                case ee:
                    Ee = 1;
                    break inf_leave;
                case te:
                    Ee = x;
                    break inf_leave;
                case ae:
                    return k;
                case 32:
                default:
                    return E;
            }
            return (t.next_out = ie, t.avail_out = se, t.next_in = re, t.avail_in = oe, d.hold = de, d.bits = le, (d.wsize || ue !== t.avail_out && d.mode < te && (d.mode < J || a !== y)) && u(t, t.output, t.next_out, ue - t.avail_out)) ? (d.mode = ae, k) : (ce -= t.avail_in, ue -= t.avail_out, t.total_in += ce, t.total_out += ue, d.total += ue, d.wrap && ue && (t.adler = d.check = d.flags ? _(d.check, ne, ue, t.next_out - ue) : f(d.check, ne, ue, t.next_out - ue)), t.data_type = d.bits + (d.last ? 64 : 0) + (d.mode === O ? 128 : 0) + (d.mode === X || d.mode === U ? 256 : 0), (0 === ce && 0 === ue || a === y) && Ee === w && (Ee = -5), Ee)
        }, a.inflateEnd = function (e) {
            if (!e || !e.state) return E;
            var t = e.state;
            return t.window && (t.window = null), e.state = null, w
        }, a.inflateGetHeader = function (e, t) {
            var a;
            return e && e.state ? (a = e.state, 0 == (2 & a.wrap)) ? E : (a.head = t, t.done = !1, w) : E
        }, a.inflateSetDictionary = function (e, t) {
            var a = t.length, n, r, i;
            return e && e.state ? (n = e.state, 0 !== n.wrap && n.mode !== P) ? E : n.mode === P && (r = 1, r = f(r, t, a, 0), r !== n.check) ? x : (i = u(e, t, a, a), i) ? (n.mode = ae, k) : (n.havedict = 1, w) : E
        }, a.inflateInfo = 'pako inflate (from Nodeca project)'
    }, function (e) {
        'use strict';
        var t = 30;
        e.exports = function (e, a) {
            var n, r, i, o, s, d, l, c, u, h, f, _, m, p, g, b, y, v, w, E, x, k, T, I, R;
            n = e.state, r = e.next_in, I = e.input, i = r + (e.avail_in - 5), o = e.next_out, R = e.output, s = o - (a - e.avail_out), d = o + (e.avail_out - 257), l = n.dmax, c = n.wsize, u = n.whave, h = n.wnext, f = n.window, _ = n.hold, m = n.bits, p = n.lencode, g = n.distcode, b = (1 << n.lenbits) - 1, y = (1 << n.distbits) - 1;
            top:do {
                15 > m && (_ += I[r++] << m, m += 8, _ += I[r++] << m, m += 8), v = p[_ & b];
                dolen:for (; ;) {
                    if (w = v >>> 24, _ >>>= w, m -= w, w = 255 & v >>> 16, 0 === w) R[o++] = 65535 & v; else if (16 & w) {
                        E = 65535 & v, w &= 15, w && (m < w && (_ += I[r++] << m, m += 8), E += _ & (1 << w) - 1, _ >>>= w, m -= w), 15 > m && (_ += I[r++] << m, m += 8, _ += I[r++] << m, m += 8), v = g[_ & y];
                        dodist:for (; ;) {
                            if (w = v >>> 24, _ >>>= w, m -= w, w = 255 & v >>> 16, 16 & w) {
                                if (x = 65535 & v, w &= 15, m < w && (_ += I[r++] << m, m += 8, m < w && (_ += I[r++] << m, m += 8)), x += _ & (1 << w) - 1, x > l) {
                                    e.msg = 'invalid distance too far back', n.mode = t;
                                    break top
                                }
                                if (_ >>>= w, m -= w, w = o - s, x > w) {
                                    if (w = x - w, w > u && n.sane) {
                                        e.msg = 'invalid distance too far back', n.mode = t;
                                        break top
                                    }
                                    if (k = 0, T = f, 0 === h) {
                                        if (k += c - w, w < E) {
                                            E -= w;
                                            do R[o++] = f[k++]; while (--w);
                                            k = o - x, T = R
                                        }
                                    } else if (h < w) {
                                        if (k += c + h - w, w -= h, w < E) {
                                            E -= w;
                                            do R[o++] = f[k++]; while (--w);
                                            if (k = 0, h < E) {
                                                w = h, E -= w;
                                                do R[o++] = f[k++]; while (--w);
                                                k = o - x, T = R
                                            }
                                        }
                                    } else if (k += h - w, w < E) {
                                        E -= w;
                                        do R[o++] = f[k++]; while (--w);
                                        k = o - x, T = R
                                    }
                                    for (; 2 < E;) R[o++] = T[k++], R[o++] = T[k++], R[o++] = T[k++], E -= 3;
                                    E && (R[o++] = T[k++], 1 < E && (R[o++] = T[k++]))
                                } else {
                                    k = o - x;
                                    do R[o++] = R[k++], R[o++] = R[k++], R[o++] = R[k++], E -= 3; while (2 < E);
                                    E && (R[o++] = R[k++], 1 < E && (R[o++] = R[k++]))
                                }
                            } else if (0 == (64 & w)) {
                                v = g[(65535 & v) + (_ & (1 << w) - 1)];
                                continue dodist
                            } else {
                                e.msg = 'invalid distance code', n.mode = t;
                                break top
                            }
                            break
                        }
                    } else if (0 == (64 & w)) {
                        v = p[(65535 & v) + (_ & (1 << w) - 1)];
                        continue dolen
                    } else if (32 & w) {
                        n.mode = 12;
                        break top
                    } else {
                        e.msg = 'invalid literal/length code', n.mode = t;
                        break top
                    }
                    break
                }
            } while (r < i && o < d);
            return E = m >> 3, r -= E, m -= E << 3, _ &= (1 << m) - 1, e.next_in = r, e.next_out = o, e.avail_in = r < i ? 5 + (i - r) : 5 - (r - i), e.avail_out = o < d ? 257 + (d - o) : 257 - (o - d), n.hold = _, void(n.bits = m)
        }
    }, function (e, t, a) {
        'use strict';
        var n = a(0), r = 15, i = 852, o = 592, s = 0, d = 1, l = 2,
            c = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0],
            u = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78],
            h = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0],
            f = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
        e.exports = function (e, t, a, _, m, p, g, b) {
            var y = b.bits, v = 0, w = 0, E = 0, x = 0, k = 0, T = 0, I = 0, R = 0, S = 0, C = 0, B = null, D = 0,
                A = new n.Buf16(r + 1), z = new n.Buf16(r + 1), N = null, L = 0, P, O, F, M, U, j, W, H, G;
            for (v = 0; v <= r; v++) A[v] = 0;
            for (w = 0; w < _; w++) A[t[a + w]]++;
            for (k = y, x = r; 1 <= x && 0 === A[x]; x--) ;
            if (k > x && (k = x), 0 == x) return m[p++] = 20971520, m[p++] = 20971520, b.bits = 1, 0;
            for (E = 1; E < x && 0 === A[E]; E++) ;
            for (k < E && (k = E), R = 1, v = 1; v <= r; v++) if (R <<= 1, R -= A[v], 0 > R) return -1;
            if (0 < R && (e === s || 1 != x)) return -1;
            for (z[1] = 0, v = 1; v < r; v++) z[v + 1] = z[v] + A[v];
            for (w = 0; w < _; w++) 0 !== t[a + w] && (g[z[t[a + w]]++] = w);
            if (e === s ? (B = N = g, j = 19) : e === d ? (B = c, D -= 257, N = u, L -= 257, j = 256) : (B = h, N = f, j = -1), C = 0, w = 0, v = E, U = p, T = k, I = 0, F = -1, S = 1 << k, M = S - 1, e === d && S > i || e === l && S > o) return 1;
            for (; ;) {
                W = v - I, g[w] < j ? (H = 0, G = g[w]) : g[w] > j ? (H = N[L + g[w]], G = B[D + g[w]]) : (H = 96, G = 0), P = 1 << v - I, O = 1 << T, E = O;
                do O -= P, m[U + (C >> I) + O] = 0 | (W << 24 | H << 16 | G); while (0 !== O);
                for (P = 1 << v - 1; C & P;) P >>= 1;
                if (0 === P ? C = 0 : (C &= P - 1, C += P), w++, 0 == --A[v]) {
                    if (v == x) break;
                    v = t[a + g[w]]
                }
                if (v > k && (C & M) !== F) {
                    for (0 == I && (I = k), U += E, T = v - I, R = 1 << T; T + I < x && (R -= A[T + I], !(0 >= R));) T++, R <<= 1;
                    if (S += 1 << T, e === d && S > i || e === l && S > o) return 1;
                    F = C & M, m[F] = 0 | (k << 24 | T << 16 | U - p)
                }
            }
            return 0 !== C && (m[U + C] = 0 | (4194304 | v - I << 24)), b.bits = k, 0
        }
    }, function (e) {
        'use strict';
        e.exports = function () {
            this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = '', this.comment = '', this.hcrc = 0, this.done = !1
        }
    }, function (e, t) {
        'use strict';
        t.a = class {
            async decode(e) {
                return new Float32Array(e.buffer, e.byteOffset, e.byteLength / 4)
            }
        }
    }, function (e, t) {
        'use strict';
        const a = -1;
        t.a = class {
            constructor() {
                this.scheduledCallbackId = a
            }

            request(e) {
                this.fn = e, this.scheduledCallbackId == a && (this.scheduledCallbackId = requestAnimationFrame(() => this.forceDispatch()))
            }

            forceDispatch() {
                this.scheduledCallbackId == a || (this.cancel(), this.fn())
            }

            cancel() {
                this.scheduledCallbackId == a || (cancelAnimationFrame(this.scheduledCallbackId), this.scheduledCallbackId = a)
            }
        }
    }, function (e, t) {
        'use strict';

        function a(e) {
            let t = [];
            for (let n = 0, r; n < e.length; n++) r = e[n], r instanceof Array ? t.splice(t.length, 0, a(r)) : t[t.length] = r;
            return t
        }

        class n {
            constructor(e = null, t = 0, a, n = null) {
                if (this.placeholderContext = n, this._byteOffset = t, this._buffer = e, e) this._length = void 0 === a ? e.byteLength / this.BYTES_PER_ELEMENT : a; else {
                    if (void 0 === a) throw Error('"butter" or "length" must be specified.');
                    this._length = a
                }
                if (this.isDynamic && !n) throw Error('PlaceholderContext must be required when SymbolicTypedArray is initialized as dynamic buffer view.')
            }

            get buffer() {
                return this._buffer || (this._buffer = new ArrayBuffer(this.byteOffset + this.byteLength)), this._buffer
            }

            set buffer(e) {
                this._buffer = e
            }

            get byteLength() {
                return this.length * this.BYTES_PER_ELEMENT
            }

            get offset() {
                return this.byteOffset / this.BYTES_PER_ELEMENT
            }

            get isDynamic() {
                return 'number' != typeof this._byteOffset || 'number' != typeof this._length
            }

            get length() {
                return this.isDynamic ? this.placeholderContext.resolve(this._length) : this._length
            }

            get byteOffset() {
                return this.isDynamic ? this.placeholderContext.resolve(this._byteOffset) : this._byteOffset
            }

            copyWithin(e, t, a) {
                return this.toActual().copyWithin(e, t, a), this
            }

            fill(e, t, a) {
                return this.toActual().fill(e, t, a), this
            }

            indexOf(e, t) {
                return this.toActual().indexOf(e, t)
            }

            join(e) {
                return this.toActual().join(e)
            }

            lastIndexOf(e, t) {
                return this.toActual().lastIndexOf(e, t)
            }

            sort(e) {
                return this.toActual().sort(e), this
            }

            includes(e, t) {
                return this.toActual().includes(e, t)
            }

            set(e, t) {
                return this.toActual().set(a(e), t)
            }

            toLocaleString() {
                return this.toActual().toLocaleString()
            }

            toString() {
                return this.toActual().toString()
            }

            [Symbol.iterator]() {
                return this.toActual()[Symbol.iterator]()
            }

            entries() {
                return this.toActual().entries()
            }

            keys() {
                return this.toActual().keys()
            }

            values() {
                return this.toActual().values()
            }
        }

        t.a = n
    }, function (e, t, a) {
        'use strict';
        var n = a(2), r = a.n(n), i = a(3), o = a(4), s = a(5), d = a(6), l = a(7);

        class c extends l.a {
            constructor(e = {}) {
                if (super(e), this.backendName = 'webassembly', this.worker_promise_reject_func = null, this.worker_initial_error = null, 'undefined' == typeof Worker) throw new Error('WebWorker is needed for WebAssembly backend');
                'object' != typeof WebAssembly && console.warn('WebAssembly is not supported on this browser, trying to use asm.js code')
            }

            static checkAvailability() {
                return 'Worker' in window
            }

            init() {
                if (!c.checkAvailability()) throw Error('WebAssembly backend is not supported in this browser.');
                return Promise.resolve()
            }

            absolutePath(t) {
                var a = document.createElement('span');
                return a.insertAdjacentHTML('beforeend', '<a href="' + t + '" />'), a.firstChild.href
            }

            async setDescriptorAndParameters(e, t) {
                this.descriptor = e, this.placeholderContext = new s.a(this.descriptor.placeholders);
                let a = 'object' == typeof WebAssembly ? 'webassembly' : 'asmjs';
                0 <= window.navigator.userAgent.indexOf('iPhone OS 11_2') && (a = 'asmjs');
                let n = `${this.directory}/kernels_${a}.js`;
                n = this.transformUrlDelegate(n), this.worker_entry_js_path = n;
                let r = await fetch(this.worker_entry_js_path), i = await r.text(), o = (e, t) => {
                    let a = this.absolutePath(`${this.directory}/${e}`), n = this.transformUrlDelegate(a);
                    i = i.replace(t, n)
                };
                'webassembly' == a ? o('kernels_webassembly.wasm', 'WEBDNN_URL_KERNELS_WASM') : o('kernels_asmjs.js.mem', 'WEBDNN_URL_KERNELS_ASMJS_MEM'), await this.compile(i), await this.loadWeights(new Uint8Array(t)), (await this.getInputViews()).filter((e) => !e.isDynamic).forEach((e) => {
                    e.buffer = new Float32Array(e.length).buffer
                }), (await this.getOutputViews()).filter((e) => !e.isDynamic).forEach((e) => {
                    e.buffer = new Float32Array(e.length).buffer
                })
            }

            async fetchDescriptor(e) {
                this.directory = e;
                let t = await Object(o.a)(`${e}/graph_${this.backendName}.json`, this.transformUrlDelegate);
                return t.json()
            }

            async fetchParameters(e, t) {
                let a = `${e}/weight_${this.backendName}.bin`, n = await Object(o.a)(a, this.transformUrlDelegate);
                return Object(o.b)(n, t)
            }

            async restoreCachedDescriptor(e) {
                return this.directory = e, n.getItem(`${e}_${this.backendName}_descriptor`).catch(() => null)
            }

            async restoreCachedParameters(e, t) {
                let a = await n.getItem(`${e}_${this.backendName}_parameters`).catch(() => null);
                return a && t && t(a.byteLength, a.byteLength), a
            }

            async saveCache(e, t, a) {
                await Promise.all([n.setItem(`${e}_${this.backendName}_descriptor`, t), n.setItem(`${e}_${this.backendName}_parameters`, a)])
            }

            async setPlaceholderValue(e) {
                if (!this.placeholderContext) throw new Error('PlaceholderContext is not initialized.');
                let t = this.placeholderContext;
                if (t.update(e), !t.isResolved) return;
                if (!this.descriptor) throw new Error('Descriptor is not loaded');
                let a = this.descriptor, n = a.unresolved_value_lists, r = [];
                for (let a = 0, i; a < n.length; a++) i = n[a], i.forEach((e) => {
                    let n = t.resolve(e.placeholder);
                    r.push(a, e.offset, n)
                });
                (await this.getInputViews()).filter((e) => e.isDynamic).forEach((e) => {
                    e.buffer = new Float32Array(e.length).buffer
                }), (await this.getOutputViews()).filter((e) => e.isDynamic).forEach((e) => {
                    e.buffer = new Float32Array(e.length).buffer
                });
                let i = this.placeholderContext.resolve(this.descriptor.memory_layout.dynamic.size);
                await this.setPlaceholderValueWorker(i, new Int32Array(r))
            }

            setPlaceholderValueWorker(e, t) {
                if (!this.worker) throw Error('Worker is not initialized');
                let a = this.worker;
                return new Promise((n, r) => {
                    a.onmessage = (e) => {
                        0 === e.data ? n() : (console.log(e.data), a.terminate(), r(new Error(e.data)))
                    }, a.postMessage({type: 'set_dynamic_buffer', size: e, data: t})
                })
            }

            compile(e) {
                let t = new Blob([e], {type: 'text/javascript'}), a = URL.createObjectURL(t), n = new Worker(a);
                n.onerror = (e) => {
                    console.error(e), this.worker_promise_reject_func ? this.worker_promise_reject_func(e) : this.worker_initial_error = e
                };
                let r = new Promise((e, t) => this.worker_initial_error ? t(this.worker_initial_error) : void(this.worker_promise_reject_func = t, n.onmessage = (a) => {
                    0 === a.data ? e() : (console.error(a.data), n.terminate(), t(new Error(a.data)))
                }));
                return this.worker = n, r
            }

            async loadWeights(e) {
                if (!this.descriptor) throw new Error('Descriptor is not loaded');
                if (!this.worker) throw new Error('Worker is not initialized');
                let t = Object(i.a)(this.descriptor.weight_encoding), a = await t.decode(e), n = this.worker,
                    r = new Promise((e, t) => {
                        this.worker_promise_reject_func = t, n.onmessage = (a) => {
                            0 === a.data ? e() : (console.log(a.data), n.terminate(), t(new Error(a.data)))
                        }, n.postMessage({type: 'weight', data: a}, [a.buffer])
                    });
                return r
            }

            getInputViews() {
                if (this.inputs) return this.inputs;
                if (!this.descriptor) throw new Error('Descriptor is not loaded');
                if (!this.placeholderContext) throw new Error('PlaceholderContext is not initialized');
                let e = this.descriptor, t = this.placeholderContext;
                return this.inputs = e.inputs.map((a) => {
                    let n = e.memory_layout.static.allocations[a] || e.memory_layout.dynamic.allocations[a],
                        r = new d.a(null, 0, n.size, t);
                    return r
                }), this.inputs
            }

            getOutputViews() {
                if (this.outputs) return this.outputs;
                if (!this.descriptor) throw new Error('Descriptor is not loaded');
                if (!this.placeholderContext) throw new Error('PlaceholderContext is not initialized');
                let e = this.descriptor, t = this.placeholderContext;
                return this.outputs = e.outputs.map((a) => {
                    let n = e.memory_layout.static.allocations[a] || e.memory_layout.dynamic.allocations[a],
                        r = new d.a(null, 0, n.size, t);
                    return r
                }), this.outputs
            }

            async run() {
                if (!this.descriptor) throw new Error('Descriptor is not loaded');
                if (!this.worker) throw new Error('Worker is not initialized');
                if (!this.placeholderContext.isResolved) throw new Error('Not all placeholder is resolved');
                let e = this.placeholderContext, t = this.descriptor, a = this.worker, n = new Promise((n, r) => {
                    this.worker_promise_reject_func = r, a.onmessage = (e) => {
                        if (Array.isArray(e.data)) {
                            for (let t = 0; t < e.data.length; t++) this.outputs[t].set(e.data[t]);
                            n()
                        } else console.log(e.data), a.terminate(), r(new Error(e.data))
                    };
                    let o = [t.memory_layout.static.allocations, t.memory_layout.dynamic.allocations], s = [];
                    for (let a = 0; a < t.inputs.length; a++) for (let n = 0, r; 2 > n; n++) if (r = o[n][t.inputs[a]], r) {
                        let t = this.inputs[a];
                        s.push({space: n, offset: e.resolve(r.offset), size: t.length, data: t.toActual()});
                        break
                    }
                    let d = [];
                    for (let a = 0; a < t.outputs.length; a++) for (let n = 0, r; 2 > n; n++) if (r = o[n][t.outputs[a]], r) {
                        let t = this.outputs[a];
                        d.push({space: n, offset: e.resolve(r.offset), size: t.length});
                        break
                    }
                    a.postMessage({type: 'run', inputs: s, outputs: d})
                });
                return n
            }
        }

        t.a = c
    }, function (e, t, a) {
        'use strict';
        var n = a(2), r = a.n(n), i = a(38), o = a(3), s = a(4), d = a(5), l = a(6), c = a(1), u = a(14), h = a(7);
        const f = new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]);

        class _ extends h.a {
            constructor(e = {}) {
                super(e), this.backendName = 'webgl'
            }

            static checkAvailability() {
                return u.a.checkAvailability()
            }

            async init() {
                if (!_.checkAvailability()) throw Error('WebGL backend is not supported in this browser.');
                this.handler = u.a.getInstance();
                let e = this.handler.createArrayBuffer(f);
                this.handler.bindArrayBuffer(e), this.buffers = new Map
            }

            async fetchDescriptor(e) {
                let t = await Object(s.a)(`${e}/graph_${this.backendName}_${this.handler.MAX_TEXTURE_SIZE}.json`, this.transformUrlDelegate);
                return t.json()
            }

            async fetchParameters(e, t) {
                let a = await Object(s.a)(`${e}/weight_${this.backendName}_${this.handler.MAX_TEXTURE_SIZE}.bin`, this.transformUrlDelegate);
                return Object(s.b)(a, t)
            }

            async restoreCachedDescriptor(e) {
                return n.getItem(`${e}_${this.backendName}_${this.handler.MAX_TEXTURE_SIZE}_descriptor`).catch(() => null)
            }

            async restoreCachedParameters(e, t) {
                let a = await n.getItem(`${e}_${this.backendName}_${this.handler.MAX_TEXTURE_SIZE}_parameters`).catch(() => null);
                return a && t && t(a.byteLength, a.byteLength), a
            }

            async saveCache(e, t, a) {
                await Promise.all([n.setItem(`${e}_${this.backendName}_${this.handler.MAX_TEXTURE_SIZE}_descriptor`, t), n.setItem(`${e}_${this.backendName}_${this.handler.MAX_TEXTURE_SIZE}_parameters`, a)])
            }

            async setDescriptorAndParameters(e, t) {
                await this.setDescriptor(e), await this.compile(), await this.initializeStaticBuffer(t), this.placeholderContext && this.placeholderContext.isResolved && (await this.initializeDynamicBuffer())
            }

            async initializeStaticBuffer(e) {
                if (!this.descriptor) throw new Error('Descriptor is not loaded');
                let t = this.descriptor, a = Object(o.a)(this.descriptor.weight_encoding),
                    n = await a.decode(new Uint8Array(e)), r = this.buffers, s = t.memory_layout.mapping;
                Object.entries(t.memory_layout.static.allocations).forEach(([e, {width: t, height: a, size: n, channel_mode: o}]) => {
                    r.set(e, new i.a(n * Float32Array.BYTES_PER_ELEMENT, t, a, e, null, o))
                }), Object.entries(t.constants_map).forEach(([e, {size: t, byte_offset: a}]) => {
                    r.get(e).array.set(new Float32Array(n.buffer, a, t))
                }), (await this.getInputViews()).filter((e) => !e.isDynamic).forEach((e) => {
                    e.buffer = r.get(s[e.name]).getWriteView(0, e.length, Float32Array).buffer
                }), (await this.getOutputViews()).filter((e) => !e.isDynamic).forEach((e) => {
                    e.buffer = r.get(s[e.name]).getReadView(0, e.length, Float32Array).buffer
                })
            }

            async initializeDynamicBuffer() {
                if (!this.descriptor) throw Error('GraphDescriptor is not loaded.');
                if (!this.placeholderContext) throw Error('PlaceholderContext is not initialized.');
                let e = this.descriptor, t = this.placeholderContext, a = this.buffers, n = e.memory_layout.mapping;
                Object.entries(e.memory_layout.dynamic.allocations).forEach(([e, {width: n, height: r, size: o, channel_mode: s}]) => {
                    a.set(e, new i.a(t.resolve(o) * Float32Array.BYTES_PER_ELEMENT, t.resolve(n), t.resolve(r), e, null, s))
                }), (await this.getInputViews()).filter((e) => e.isDynamic).forEach((e) => {
                    e.buffer = a.get(n[e.name]).getWriteView(0, t.resolve(e.length), Float32Array).buffer
                }), (await this.getOutputViews()).filter((e) => e.isDynamic).forEach((e) => {
                    e.buffer = a.get(n[e.name]).getReadView(0, t.resolve(e.length), Float32Array).buffer
                }), this.buildPipeline()
            }

            async setDescriptor(e) {
                this.descriptor = e, this.placeholderContext = new d.a(e.placeholders)
            }

            async compile() {
                if (!this.descriptor) throw new Error('Descriptor is not loaded');
                let e = this.descriptor;
                this.programs = new Map, this.vertexShader = this.handler.createVertexShader(`
            precision highp float;
            attribute vec2 _xy;
            void main() { 
              gl_Position = vec4(_xy, 0, 1); 
            }
        `), Object.keys(e.shader_sources).forEach((t) => {
                    let a = this.handler.createFragmentShader(e.shader_sources[t]),
                        n = this.handler.createProgram(this.vertexShader, a);
                    this.programs.set(t, n)
                })
            }

            async setPlaceholderValue(e) {
                if (!this.placeholderContext) throw new Error('PlaceholderContext is not initialized.');
                let t = this.placeholderContext;
                if (t.update(e), !!t.isResolved) {
                    if (!this.descriptor) throw new Error('Descriptor is not loaded');
                    if (await this.initializeDynamicBuffer(), 0 < Object.keys(this.descriptor.placeholders).length) throw Error('Currently, WebGL backend doesn\'t support Placeholder feature.')
                }
            }

            getInputViews() {
                if (this.inputs) return this.inputs;
                if (!this.descriptor) throw new Error('Descriptor is not loaded');
                if (!this.placeholderContext) throw new Error('PlaceholderContext is not initialized');
                let e = this.descriptor, t = this.placeholderContext, a = this.descriptor.memory_layout.mapping;
                return this.inputs = e.inputs.map((e) => {
                    let n = new l.a(null, 0, this.buffers.get(a[e]).length, t);
                    return n.name = e, n
                }), this.inputs
            }

            getOutputViews() {
                if (this.outputs) return this.outputs;
                if (!this.descriptor) throw new Error('Descriptor is not loaded');
                if (!this.placeholderContext) throw new Error('PlaceholderContext is not initialized');
                let e = this.descriptor, t = this.placeholderContext, a = this.descriptor.memory_layout.mapping;
                return this.outputs = e.outputs.map((e) => {
                    let n = new l.a(null, 0, this.buffers.get(a[e]).length, t);
                    return n.name = e, n
                }), this.outputs
            }

            buildPipeline() {
                if (!this.descriptor) throw new Error('Descriptor is not loaded');
                if (!this.placeholderContext) throw new Error('PlaceholderContext is not initialized');
                if (!this.placeholderContext.isResolved) throw new Error(`Not all placeholders are resolved: ${this.placeholderContext}`);
                let e = this.handler.gl, t = this.buffers, a = this.descriptor.memory_layout.mapping, n = new Map;
                this.runtimeInfo = {
                    inputs: this.getInputViews().map((e) => t.get(a[e.name])),
                    outputs: this.getOutputViews().map((e) => t.get(a[e.name])),
                    programs: this.descriptor.exec_infos.map((r) => {
                        let i = r.inputs.map((e) => {
                            let r = t.get(a[e.variable_name]);
                            return n.has(r) || n.set(r, 0), n.set(r, n.get(r) + 1), {buffer: r, uniformIndex: e.value}
                        }), o = t.get(a[r.output]), s = this.programs.get(r.shader_name);
                        this.handler.useProgram(s);
                        let d = Object.keys(r.uniforms).map((t) => {
                            let {type: a, value: n} = r.uniforms[t];
                            switch (a) {
                                case'int':
                                    return {func: e.uniform1i, args: [e.getUniformLocation(s, t), n]};
                                case'float':
                                    return {func: e.uniform1f, args: [e.getUniformLocation(s, t), n]};
                                case'vec2':
                                    return {func: e.uniform2fv, args: [e.getUniformLocation(s, t), n]};
                                case'vec3':
                                    return {func: e.uniform3fv, args: [e.getUniformLocation(s, t), n]};
                                case'vec4':
                                    return {func: e.uniform4fv, args: [e.getUniformLocation(s, t), n]};
                                case'ivec2':
                                    return {func: e.uniform2iv, args: [e.getUniformLocation(s, t), n]};
                                case'ivec3':
                                    return {func: e.uniform3iv, args: [e.getUniformLocation(s, t), n]};
                                case'ivec4':
                                    return {func: e.uniform4iv, args: [e.getUniformLocation(s, t), n]};
                                case'sampler2D':
                                    return {func: e.uniform1i, args: [e.getUniformLocation(s, t), n]};
                                default:
                                    throw TypeError(`Incompatible type for uniform parameter: ${a}`);
                            }
                        }), l = e.getAttribLocation(s, '_xy');
                        return {
                            program: s,
                            frameBuffer: this.handler.createFrameBuffer(),
                            name: r.shader_name,
                            width: o.textureWidth,
                            height: o.textureHeight,
                            inputs: i,
                            output: o,
                            xyAttribLoc: l,
                            uniforms: d,
                            disposable: []
                        }
                    })
                };
                for (let e of this.runtimeInfo.programs) e.inputs.forEach(({buffer: t}) => {
                    let a = n.get(t) - 1;
                    0 == a && e.disposable.push(t), n.set(t, a)
                })
            }

            async run() {
                if (!this.descriptor) throw new Error('Descriptor is not loaded');
                if (!this.placeholderContext) throw new Error('PlaceholderContext is not initialized');
                if (!this.placeholderContext.isResolved) throw new Error(`Not all placeholders are resolved: ${this.placeholderContext}`);
                let e = this.handler.gl, t = this.runtimeInfo;
                if (0 < this.runtimeInfo.programs.length) {
                    for (let e of t.inputs) await e.syncWriteViews();
                    if (Object(c.getConfiguration)('DEBUG', !1)) {
                        let a = [], n = 0;
                        for (let r of t.programs) {
                            let t = performance.now();
                            this.handler.bindFrameBuffer(r.frameBuffer, r.width, r.height);
                            for (let {buffer: e, uniformIndex: t}of r.inputs) await e.bindToReadTexture(t);
                            r.output.bindToDrawTexture(), this.handler.useProgram(r.program);
                            for (let t of r.uniforms) t.func.apply(e, t.args);
                            e.vertexAttribPointer(r.xyAttribLoc, 2, e.FLOAT, !0, 8, 0), e.enableVertexAttribArray(r.xyAttribLoc), e.drawArrays(e.TRIANGLE_STRIP, 0, f.length / 2), await this.handler.waitForComplete();
                            let i = performance.now() - t;
                            n += i;
                            let o = [];
                            for (let {buffer: e}of r.inputs) e.unbindFromReadTexture(), await e.syncReadViews(), o.push(e.array.slice());
                            r.output.unbindFromDrawTexture(), await r.output.syncReadViews();
                            let s = r.output.array.slice();
                            a.push({Kernel: r.name, "Elapsed time [ms]": i, xs: o, y: s})
                        }
                        let r = Array.from(Object.values(a.reduce((e, t) => (t.Kernel in e || (e[t.Kernel] = {
                            Kernel: t.Kernel,
                            Count: 0,
                            "Elapsed time [ms]": 0
                        }), e[t.Kernel].Count++, e[t.Kernel]['Elapsed time [ms]'] += t['Elapsed time [ms]'], e), {})));
                        r.forEach((e) => e['Ratio [%]'] = (e['Elapsed time [ms]'] / n).toFixed(2)), console.table(a), console.table(r)
                    } else for (let a of t.programs) {
                        this.handler.bindFrameBuffer(a.frameBuffer, a.width, a.height);
                        for (let {buffer: e, uniformIndex: t}of a.inputs) await e.bindToReadTexture(t);
                        a.output.bindToDrawTexture(), this.handler.useProgram(a.program);
                        for (let t of a.uniforms) t.func.apply(e, t.args);
                        e.vertexAttribPointer(a.xyAttribLoc, 2, e.FLOAT, !0, 8, 0), e.enableVertexAttribArray(a.xyAttribLoc), e.drawArrays(e.TRIANGLE_STRIP, 0, f.length / 2);
                        for (let {buffer: e}of a.inputs) e.unbindFromReadTexture();
                        a.output.unbindFromDrawTexture()
                    }
                    for (let e of t.outputs) await e.syncReadViews()
                }
            }
        }

        t.a = _
    }, function (e, t, a) {
        'use strict';
        var n = a(14), r = a(15);

        class i extends r.a {
            constructor(e, t, a, r, i, o) {
                switch (super(e, 'webgl'), this._texture = null, this.readTextureUnitIndices = [], this.isBoundToDrawFrameBuffer = !1, this.handler = n.a.getInstance(), this.name = r, this.channelMode = o, o) {
                    case'RGBA':
                        this.elementsPerPixel = 4;
                        break;
                    case'R':
                        this.elementsPerPixel = 1;
                        break;
                    default:
                        throw Error('Unknown channel mode');
                }
                if (Object(n.b)(this.handler.gl)) switch (o) {
                    case'RGBA':
                        this.textureFormat = this.handler.gl.RGBA, this.textureInternalFormat = this.handler.gl.RGBA32F, this.pixelStride = 4;
                        break;
                    case'R':
                        this.textureFormat = this.handler.gl.RED, this.textureInternalFormat = this.handler.gl.R32F, this.pixelStride = 1;
                        break;
                    default:
                        throw Error('Unknown channel mode');
                } else this.textureFormat = this.handler.gl.RGBA, this.textureInternalFormat = this.handler.gl.RGBA, this.pixelStride = 4;
                if (this.pixelStride < this.elementsPerPixel) throw Error('elementsPerPixel must be smaller than pixelStride');
                this.array = i || new Float32Array(this.length), this.textureWidth = t, this.textureHeight = a
            }

            get texture() {
                return this._texture
            }

            get length() {
                return this.byteLength / Float32Array.BYTES_PER_ELEMENT
            }

            async write(e, t) {
                this.array.set(e, t), await this.syncWriteViews()
            }

            async read(e, t = 0, a) {
                if (e !== Float32Array) throw new Error('Currently, only Float32Array is supported for parameter \'dst\'.');
                await this.syncReadViews(), new Float32Array(this.array.buffer, t * Float32Array.BYTES_PER_ELEMENT, a)
            }

            getWriteView(e, t, a) {
                return new a(this.array.buffer, e * a.BYTES_PER_ELEMENT, t)
            }

            getReadView(e, t, a) {
                return new a(this.array.buffer, e * a.BYTES_PER_ELEMENT, t)
            }

            async syncWriteViews() {
                let e = this.handler.gl;
                this.texture || this.allocateTexture();
                let t = this.pack(this.array);
                if (t.length != this.textureWidth * this.textureHeight * this.pixelStride) {
                    let e = new Float32Array(this.textureWidth * this.textureHeight * this.elementsPerPixel);
                    e.set(t, 0), t = e
                }
                await this.bindToReadTexture(9), e.texSubImage2D(e.TEXTURE_2D, 0, 0, 0, this.textureWidth, this.textureHeight, this.textureFormat, e.FLOAT, t), this.unbindFromReadTexture()
            }

            async syncReadViews() {
                let e = this.handler.gl;
                const t = e.RGBA;
                let a = new Float32Array(this.textureWidth * this.textureHeight * 4);
                this.bindToDrawTexture(), e.readPixels(0, 0, this.textureWidth, this.textureHeight, t, e.FLOAT, a), this.unbindFromDrawTexture(), a = this.unpack(a), this.array.set(a.slice(0, this.length), 0)
            }

            async bindToReadTexture(e) {
                if (this.isBoundToDrawFrameBuffer) throw Error('This buffer is already registered as draw buffer. You may forgot to unbind the binding while previous operations.');
                let t = this.handler.gl;
                this.texture || (this.allocateTexture(), await this.syncWriteViews()), t.activeTexture(t.TEXTURE0 + e), t.bindTexture(t.TEXTURE_2D, this.texture), this.readTextureUnitIndices.push(e)
            }

            unbindFromReadTexture() {
                let e = this.handler.gl;
                for (let t of this.readTextureUnitIndices) e.activeTexture(e.TEXTURE0 + t), e.bindTexture(e.TEXTURE_2D, null);
                this.readTextureUnitIndices = []
            }

            bindToDrawTexture() {
                if (0 < this.readTextureUnitIndices.length) throw Error('This buffer is already registered as read buffer. You cannot bind a texture as both read and draw texture buffer at same time.');
                if (this.isBoundToDrawFrameBuffer) throw Error('This buffer is already registered as draw buffer. You may forgot to unbind the binding while previous operations.');
                let e = this.handler.gl;
                this.texture || this.allocateTexture(), e.framebufferTexture2D(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.TEXTURE_2D, this.texture, 0), this.isBoundToDrawFrameBuffer = !0
            }

            unbindFromDrawTexture() {
                if (this.isBoundToDrawFrameBuffer) {
                    let e = this.handler.gl;
                    e.framebufferTexture2D(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.TEXTURE_2D, null, 0), this.isBoundToDrawFrameBuffer = !1
                }
            }

            pack(e) {
                let t = this.pixelStride / this.elementsPerPixel;
                if (1 == t) return new Float32Array(e); else {
                    let a = new Float32Array(e.length * t);
                    for (let n = 0; n < e.length; n++) a[n * t] = e[n];
                    return a
                }
            }

            unpack(e) {
                let t = 4 / this.elementsPerPixel;
                if (1 == t) return new Float32Array(e); else {
                    let a = new Float32Array(e.length / t);
                    for (let n = 0; n < e.length / t; n++) a[n] = e[n * t];
                    return a
                }
            }

            allocateTexture() {
                if (this.texture) throw Error('Texture is already allocated.');
                this._texture = this.handler.createTexture(this.textureWidth, this.textureHeight, this.textureInternalFormat, this.textureFormat)
            }
        }

        t.a = i
    }, function (e, t, a) {
        'use strict';
        var n = a(2), r = a.n(n), i = a(16), o = a(3), s = a(4), d = a(5), l = a(6), c = a(1), u = a(17), h = a(7);
        const f = navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad');

        class _ extends h.a {
            constructor(e = {}) {
                super(e), this.backendName = 'webgpu'
            }

            static checkAvailability() {
                return u.a
            }

            async init() {
                this.webgpuHandler = u.b.getInstance(), await this.checkIncompatibleGPU()
            }

            async checkIncompatibleGPU() {
                this.webgpuHandler.loadKernel(`
#include <metal_stdlib>
using namespace metal;
        kernel void check_compatibility(
            device uint *A[[buffer(0)]],
            uint global_index[[thread_position_in_grid]],
            uint thread_execution_width[[thread_execution_width]]
        ){
            if (global_index == 0) {
                A[0] = thread_execution_width;
            }
        }`, 'basic');
                let e = this.webgpuHandler.createBuffer(new Uint32Array(1));
                await this.webgpuHandler.executeSinglePipelineState('basic.check_compatibility', {
                    width: 1,
                    height: 1,
                    depth: 1
                }, {width: 1, height: 1, depth: 1}, [e], !0);
                let t = new Uint32Array(e.contents)[0];
                if (32 != t) throw new Error(`Sorry, this GPU does not compatible with WebGPU (thread_execution_width == ${t}. See checkIncompatibleGPU method of https://github.com/mil-tokyo/webdnn/blob/master/src/descriptor_runner/descriptor_runner/descriptor_runner_webgpu.ts`)
            }

            async fetchDescriptor(e) {
                let t = await Object(s.a)(`${e}/graph_${this.backendName}.json`, this.transformUrlDelegate);
                return t.json()
            }

            async fetchParameters(e, t) {
                let a = await Object(s.a)(`${e}/weight_${this.backendName}.bin`, this.transformUrlDelegate);
                return Object(s.b)(a, t)
            }

            async restoreCachedDescriptor(e) {
                return n.getItem(`${e}_${this.backendName}_descriptor`).catch(() => null)
            }

            async restoreCachedParameters(e, t) {
                let a = await n.getItem(`${e}_${this.backendName}_parameters`).catch(() => null);
                return a && t && t(a.byteLength, a.byteLength), a
            }

            async saveCache(e, t, a) {
                await Promise.all([n.setItem(`${e}_${this.backendName}_descriptor`, t), n.setItem(`${e}_${this.backendName}_parameters`, a)])
            }

            async setDescriptorAndParameters(e, t) {
                this.descriptor = e, this.staticBuffer = null, this.dynamicBuffer = null, this.metaBuffers = null, this.placeholderContext = new d.a(e.placeholders), this.executionInfos = e.exec_infos, this.webgpuHandler.loadKernel(this.descriptor.kernel_source, 'descriptor'), await this.initializeStaticBuffer(t), await this.initializeMetaBuffers(), await this.setPlaceholderValue({__MAX_THREADS_PER_THREADGROUP__: f ? 512 : 1024}), this.placeholderContext && this.placeholderContext.isResolved && (await this.initializeDynamicBuffer())
            }

            async initializeStaticBuffer(e) {
                if (!this.descriptor) throw Error('GraphDescriptor is not loaded.');
                let t = this.descriptor, a = new i.a(t.memory_layout.static.size * Float32Array.BYTES_PER_ELEMENT);
                this.staticBuffer = a;
                let n = Object(o.a)(t.weight_encoding);
                await a.write((await n.decode(new Uint8Array(e)))), (await this.getInputViews()).filter((e) => !e.isDynamic).forEach((e) => {
                    e.buffer = a.bufferView.buffer
                }), (await this.getOutputViews()).filter((e) => !e.isDynamic).forEach((e) => {
                    e.buffer = a.bufferView.buffer
                })
            }

            async initializeMetaBuffers() {
                if (!this.descriptor) throw Error('GraphDescriptor is not loaded.');
                this.metaBuffers = await Promise.all(this.descriptor.exec_infos.map(async (e) => {
                    let t = new i.a(e.meta_buffer.length * Int32Array.BYTES_PER_ELEMENT);
                    return await t.write(new Uint8Array(e.meta_buffer)), t
                }))
            }

            async initializeDynamicBuffer() {
                if (!this.descriptor) throw Error('GraphDescriptor is not loaded.');
                if (!this.placeholderContext) throw Error('PlaceholderContext is not initialized.');
                let e = this.descriptor, t = this.placeholderContext, a = t.resolve(e.memory_layout.dynamic.size),
                    n = new i.a(a * Float32Array.BYTES_PER_ELEMENT);
                this.dynamicBuffer = n, (await this.getInputViews()).filter((e) => e.isDynamic).forEach((e) => {
                    e.buffer = n.bufferView.buffer
                }), (await this.getOutputViews()).filter((e) => e.isDynamic).forEach((e) => {
                    e.buffer = n.bufferView.buffer
                })
            }

            async setPlaceholderValue(e) {
                if (!this.placeholderContext) throw new Error('PlaceholderContext is not initialized.');
                let t = this.placeholderContext;
                if (t.update(e), !t.isResolved) return;
                if (!this.descriptor) throw new Error('Descriptor is not loaded');
                if (!this.metaBuffers) throw new Error('MetaBuffers are not initialized');
                let a = this.descriptor, n = this.metaBuffers;
                await this.initializeDynamicBuffer(), this.executionInfos = await Promise.all(a.exec_infos.map(async (e, a) => {
                    let r = new Int32Array(n[a].bufferView.buffer);
                    for (let n of e.unresolved_value_list) r[n.offset] = t.resolve(n.placeholder);
                    return t.resolve(e)
                }))
            }

            getInputViews() {
                if (this.inputs) return this.inputs;
                if (!this.descriptor) throw new Error('Descriptor is not loaded');
                if (!this.placeholderContext) throw new Error('PlaceholderContext is not initialized');
                let e = this.descriptor, t = this.placeholderContext;
                return this.inputs = e.inputs.map((a) => {
                    let n = e.memory_layout.static.allocations[a] || e.memory_layout.dynamic.allocations[a],
                        r = new l.a(null, n.offset * l.a.BYTES_PER_ELEMENT, n.size, t);
                    return r
                }), this.inputs
            }

            getOutputViews() {
                if (this.outputs) return this.outputs;
                if (!this.descriptor) throw new Error('Descriptor is not loaded');
                if (!this.placeholderContext) throw new Error('PlaceholderContext is not initialized');
                let e = this.descriptor, t = this.placeholderContext;
                return this.outputs = e.outputs.map((a) => {
                    let n = e.memory_layout.static.allocations[a] || e.memory_layout.dynamic.allocations[a],
                        r = new l.a(null, n.offset * l.a.BYTES_PER_ELEMENT, n.size, t);
                    return r
                }), this.outputs
            }

            async run() {
                if (!this.executionInfos) throw new Error('ExecutionInfos is not loaded');
                if (!this.staticBuffer) throw new Error('StaticBuffer is not initialized');
                if (!this.dynamicBuffer) throw new Error('DynamicBuffer is not initialized');
                if (!this.metaBuffers) throw new Error('MetaBuffer is not initialized');
                if (!this.placeholderContext) throw new Error('PlaceholderContext is not initialized');
                if (!this.placeholderContext.isResolved) throw new Error(`Not all placeholders are resolved: ${this.placeholderContext}`);
                let e = this.staticBuffer, t = this.dynamicBuffer, a = this.metaBuffers;
                if (Object(c.getConfiguration)('DEBUG', !1)) {
                    let n = [], r = 0;
                    for (let o = 0; o < this.executionInfos.length; o++) {
                        let i = this.executionInfos[o], s = performance.now();
                        await this.webgpuHandler.executeSinglePipelineState('descriptor.' + i.entry_func_name, i.threadgroups_per_grid, i.threads_per_thread_group, [e, t, a[o]], !0);
                        let d = performance.now() - s;
                        n.push({Kernel: i.entry_func_name, "Elapsed time [ms]": d}), r += d
                    }
                    let i = Array.from(Object.values(n.reduce((e, t) => (t.Kernel in e || (e[t.Kernel] = {
                        Kernel: t.Kernel,
                        Count: 0,
                        "Elapsed time [ms]": 0
                    }), e[t.Kernel].Count++, e[t.Kernel]['Elapsed time [ms]'] += t['Elapsed time [ms]'], e), {})));
                    i.forEach((e) => e['Ratio [%]'] = (e['Elapsed time [ms]'] / r).toFixed(2)), console.table(n), console.table(i)
                } else {
                    let n = null;
                    for (let r = 0; r < this.executionInfos.length; r++) {
                        let i = this.executionInfos[r], o = r == this.executionInfos.length - 1;
                        n = this.webgpuHandler.executeSinglePipelineState('descriptor.' + i.entry_func_name, i.threadgroups_per_grid, i.threads_per_thread_group, [e, t, a[r]], o)
                    }
                    return n
                }
            }
        }

        t.a = _
    }, function (e, t, a) {
        'use strict';
        Object.defineProperty(t, '__esModule', {value: !0});
        var n = a(18);
        a.d(t, 'Order', function () {
            return n.b
        }), a.d(t, 'Color', function () {
            return n.a
        });
        var r = a(41);
        a.d(t, 'getImageArrayFromImageData', function () {
            return r.d
        }), a.d(t, 'getImageArrayFromCanvas', function () {
            return r.b
        }), a.d(t, 'getImageArrayFromDrawable', function () {
            return r.c
        }), a.d(t, 'getImageArray', function () {
            return r.a
        }), a.d(t, 'setImageArrayToCanvas', function () {
            return r.e
        });
        var i = a(20);
        a.d(t, 'loadImageByUrl', function () {
            return i.b
        }), a.d(t, 'loadImageFromFileInput', function () {
            return i.c
        }), a.d(t, 'loadImageByDialog', function () {
            return i.a
        })
    }, function (e, t, a) {
        'use strict';

        function n(e) {
            return e instanceof Array ? Array.prototype.concat.apply([], e.map((e) => n(e))) : e
        }

        function r(e) {
            if ('number' == typeof e) return [e, e, e, e];
            if (4 == e.length) return [e[0], e[1], e[2], e[3]];
            if (3 == e.length) return [e[0], e[1], e[2], e[0]];
            if (1 == e.length) return [e[0], e[0], e[0], e[0]];
            throw new Error('bias and scale must be scalar number or array of length 1 or 3 or 4.')
        }

        function i(e, t = {}) {
            let {type: a = Float32Array, color: n = c.a.RGB, order: i = c.b.HWC, bias: o = [0, 0, 0], scale: s = [1, 1, 1]} = t;
            const d = r(o), l = r(s), u = e.width, f = e.height;
            let _ = e.data, m, p, y, v, g, E, x, k, b;
            switch (n) {
                case c.a.RGB:
                    switch (m = new a(3 * (u * f)), [E, x, k] = l, [p, y, v] = d, i) {
                        case c.b.HWC:
                            for (let e = 0; e < f; e++) for (let t = 0; t < u; t++) m[3 * (e * u + t) + 0] = (_[4 * (e * u + t) + 0] - p) / E, m[3 * (e * u + t) + 1] = (_[4 * (e * u + t) + 1] - y) / x, m[3 * (e * u + t) + 2] = (_[4 * (e * u + t) + 2] - v) / k;
                            break;
                        case c.b.CHW:
                            for (let e = 0; e < f; e++) for (let t = 0; t < u; t++) m[(0 * f + e) * u + t] = (_[4 * (e * u + t) + 0] - p) / E, m[(1 * f + e) * u + t] = (_[4 * (e * u + t) + 1] - y) / x, m[(2 * f + e) * u + t] = (_[4 * (e * u + t) + 2] - v) / k;
                    }
                    break;
                case c.a.BGR:
                    switch (m = new a(3 * (u * f)), [p, y, v] = d, [E, x, k] = l, i) {
                        case c.b.HWC:
                            for (let e = 0; e < f; e++) for (let t = 0; t < u; t++) m[3 * (e * u + t) + 0] = (_[4 * (e * u + t) + 2] - v) / k, m[3 * (e * u + t) + 1] = (_[4 * (e * u + t) + 1] - y) / x, m[3 * (e * u + t) + 2] = (_[4 * (e * u + t) + 0] - p) / E;
                            break;
                        case c.b.CHW:
                            for (let e = 0; e < f; e++) for (let t = 0; t < u; t++) m[(0 * f + e) * u + t] = (_[4 * (e * u + t) + 2] - v) / k, m[(1 * f + e) * u + t] = (_[4 * (e * u + t) + 1] - y) / x, m[(2 * f + e) * u + t] = (_[4 * (e * u + t) + 0] - p) / E;
                    }
                    break;
                case c.a.RGBA:
                    switch (m = new a(4 * (u * f)), [E, x, k, b] = l, [p, y, v, g] = d, i) {
                        case c.b.HWC:
                            for (let e = 0; e < f; e++) for (let t = 0; t < u; t++) m[4 * (e * u + t) + 0] = (_[4 * (e * u + t) + 0] - p) / E, m[4 * (e * u + t) + 1] = (_[4 * (e * u + t) + 1] - y) / x, m[4 * (e * u + t) + 2] = (_[4 * (e * u + t) + 2] - v) / k, m[4 * (e * u + t) + 3] = (_[4 * (e * u + t) + 3] - g) / b;
                            break;
                        case c.b.CHW:
                            for (let e = 0; e < f; e++) for (let t = 0; t < u; t++) m[(0 * f + e) * u + t] = (_[4 * (e * u + t) + 0] - p) / E, m[(1 * f + e) * u + t] = (_[4 * (e * u + t) + 1] - y) / x, m[(2 * f + e) * u + t] = (_[4 * (e * u + t) + 2] - v) / k, m[(3 * f + e) * u + t] = (_[4 * (e * u + t) + 3] - g) / b;
                    }
                    break;
                case c.a.BGRA:
                    switch (m = new a(4 * (u * f)), [p, y, v, g] = d, [E, x, k, b] = l, i) {
                        case c.b.HWC:
                            for (let e = 0; e < f; e++) for (let t = 0; t < u; t++) m[4 * (e * u + t) + 0] = (_[4 * (e * u + t) + 2] - v) / k, m[4 * (e * u + t) + 1] = (_[4 * (e * u + t) + 1] - y) / x, m[4 * (e * u + t) + 2] = (_[4 * (e * u + t) + 0] - p) / E, m[4 * (e * u + t) + 3] = (_[4 * (e * u + t) + 3] - g) / b;
                            break;
                        case c.b.CHW:
                            for (let e = 0; e < f; e++) for (let t = 0; t < u; t++) m[(0 * f + e) * u + t] = (_[4 * (e * u + t) + 2] - v) / k, m[(1 * f + e) * u + t] = (_[4 * (e * u + t) + 1] - y) / x, m[(2 * f + e) * u + t] = (_[4 * (e * u + t) + 0] - p) / E, m[(3 * f + e) * u + t] = (_[4 * (e * u + t) + 3] - g) / b;
                    }
                    break;
                case c.a.GREY:
                    m = new a(u * f), [E, x, k] = l, [p, y, v] = d;
                    for (let e = 0; e < f; e++) for (let t = 0; t < u; t++) {
                        let a = _[4 * (e * u + t) + 0], n = _[4 * (e * u + t) + 1], r = _[4 * (e * u + t) + 2];
                        m[e * u + t] = 0.2126 * (a - p) / E + 0.7162 * (n - y) / x + 0.0722 * (r - v) / k
                    }
                    break;
                default:
                    throw Error(`Unknown color format: ${n}`);
            }
            return m
        }

        function o(e, t = {}) {
            let {type: a = Float32Array, color: n = c.a.RGB, order: r = c.b.HWC, srcX: o = 0, srcY: s = 0, srcW: d = e.width, srcH: l = e.height, dstX: h = 0, dstY: f = 0, bias: _ = [0, 0, 0], scale: m = [1, 1, 1]} = t, {dstW: p = d, dstH: g = l} = t,
                b = Object(u.a)(e, {srcX: o, srcY: s, srcW: d, srcH: l, dstX: h, dstY: f, dstW: p, dstH: g});
            return i(b, {type: a, color: n, order: r, bias: _, scale: m})
        }

        function s(e, t = {}) {
            let a, n;
            if (e instanceof HTMLVideoElement) a = e.videoWidth, n = e.videoHeight; else if (e instanceof HTMLImageElement) a = e.naturalWidth, n = e.naturalHeight; else {
                if (e instanceof HTMLCanvasElement) return o(e, t);
                if (e instanceof ImageData) {
                    let a = document.createElement('canvas');
                    a.height = e.height, a.width = e.width;
                    let n = Object(l.a)(a);
                    return n.putImageData(e, 0, 0), o(a, t)
                }
                throw TypeError('Failed to execute "getImageDataFromDrawable(drawable, options)": "drawable" must be an instanceof Drawable')
            }
            let {type: r = Float32Array, color: i = c.a.RGB, order: s = c.b.HWC, srcX: d = 0, srcY: u = 0, dstX: h = 0, dstY: f = 0, dstW: _ = a, dstH: m = n, bias: p = [0, 0, 0], scale: g = [1, 1, 1]} = t,
                b = document.createElement('canvas');
            b.width = h + _, b.height = f + m;
            let y = Object(l.a)(b);
            return y.drawImage(e, d, u, a, n, h, f, _, m), o(b, {type: r, color: i, order: s, bias: p, scale: g})
        }

        function d(t, a, n) {
            try {
                return new ImageData(t, a, n)
            } catch (r) {
                console.warn(`new ImageData failed: ${r}`);
                let e = document.createElement('canvas'), i = Object(l.a)(e), o = i.createImageData(a, n);
                return o.data.set(t), o
            }
        }

        t.d = i, t.b = o, t.c = s, t.a = async function (e, t = {}) {
            if ('string' == typeof e) return s((await Object(h.b)(e)), t);
            if (e instanceof HTMLInputElement) return s((await Object(h.c)(e)), t);
            if (e instanceof HTMLCanvasElement) return o(e, t);
            if (e instanceof HTMLImageElement || e instanceof HTMLVideoElement || e instanceof ImageData) return s(e, t);
            throw TypeError('Failed to execute "getImageData(image, options)": "image" must be an instance of string, HTMLInputElement, HTMLCanvasElement, HTMLImageElement, HTMLVideoElement, or ImageData object')
        }, t.e = function (e, t, a, i, o = {}) {
            let {color: s = c.a.RGB, order: l = c.b.HWC, srcX: f = 0, srcY: _ = 0, dstX: h = 0, dstY: m = 0, dstW: p = i.width, dstH: g = i.height, bias: b = [0, 0, 0], scale: y = [1, 1, 1]} = o;
            const v = r(b), w = r(y);
            let E = t, x = a;
            e = n(e);
            let k = new Uint8ClampedArray(4 * (E * x)), T, I, R, S, C, B, D, A;
            switch (s) {
                case c.a.RGB:
                    switch ([T, I, R] = v, [C, B, D] = w, l) {
                        case c.b.HWC:
                            for (let a = _; a < _ + x; a++) for (let n = f; n < f + E; n++) k[4 * (a * t + n) + 0] = e[3 * (a * t + n) + 0] * C + T, k[4 * (a * t + n) + 1] = e[3 * (a * t + n) + 1] * B + I, k[4 * (a * t + n) + 2] = e[3 * (a * t + n) + 2] * D + R, k[4 * (a * t + n) + 3] = 255;
                            break;
                        case c.b.CHW:
                            for (let n = _; n < _ + x; n++) for (let r = f; r < f + E; r++) k[4 * (n * t + r) + 0] = e[(0 * a + n) * t + r] * C + T, k[4 * (n * t + r) + 1] = e[(1 * a + n) * t + r] * B + I, k[4 * (n * t + r) + 2] = e[(2 * a + n) * t + r] * D + R, k[4 * (n * t + r) + 3] = 255;
                    }
                    break;
                case c.a.BGR:
                    switch ([T, I, R] = v, [C, B, D] = w, l) {
                        case c.b.HWC:
                            for (let a = _; a < _ + x; a++) for (let n = f; n < f + E; n++) k[4 * (a * t + n) + 0] = e[3 * (a * t + n) + 2] * C + T, k[4 * (a * t + n) + 1] = e[3 * (a * t + n) + 1] * B + I, k[4 * (a * t + n) + 2] = e[3 * (a * t + n) + 0] * D + R, k[4 * (a * t + n) + 3] = 255;
                            break;
                        case c.b.CHW:
                            for (let n = _; n < _ + x; n++) for (let r = f; r < f + E; r++) k[4 * (n * t + r) + 0] = e[(2 * a + n) * t + r] * C + T, k[4 * (n * t + r) + 1] = e[(1 * a + n) * t + r] * B + I, k[4 * (n * t + r) + 2] = e[(0 * a + n) * t + r] * D + R, k[4 * (n * t + r) + 3] = 255;
                    }
                    break;
                case c.a.RGBA:
                    switch ([T, I, R, S] = v, [C, B, D, A] = w, l) {
                        case c.b.HWC:
                            for (let a = _; a < _ + x; a++) for (let n = f; n < f + E; n++) k[4 * (a * t + n) + 0] = e[3 * (a * t + n) + 0] * C + T, k[4 * (a * t + n) + 1] = e[3 * (a * t + n) + 1] * B + I, k[4 * (a * t + n) + 2] = e[3 * (a * t + n) + 2] * D + R, k[4 * (a * t + n) + 3] = e[3 * (a * t + n) + 3] * A + S;
                            break;
                        case c.b.CHW:
                            for (let n = _; n < _ + x; n++) for (let r = f; r < f + E; r++) k[4 * (n * t + r) + 0] = e[(0 * a + n) * t + r] * C + T, k[4 * (n * t + r) + 1] = e[(1 * a + n) * t + r] * B + I, k[4 * (n * t + r) + 2] = e[(2 * a + n) * t + r] * D + R, k[4 * (n * t + r) + 3] = e[(3 * a + n) * t + r] * A + S;
                    }
                    break;
                case c.a.BGRA:
                    switch ([T, I, R, S] = v, [C, B, D, A] = w, l) {
                        case c.b.HWC:
                            for (let a = _; a < _ + x; a++) for (let n = f; n < f + E; n++) k[4 * (a * t + n) + 0] = e[4 * (a * t + n) + 2] * C + T, k[4 * (a * t + n) + 1] = e[4 * (a * t + n) + 1] * B + I, k[4 * (a * t + n) + 2] = e[4 * (a * t + n) + 0] * D + R, k[4 * (a * t + n) + 3] = e[4 * (a * t + n) + 3] * A + S;
                            break;
                        case c.b.CHW:
                            for (let n = _; n < _ + x; n++) for (let r = f; r < f + E; r++) k[4 * (n * t + r) + 0] = e[(2 * a + n) * t + r] * C + T, k[4 * (n * t + r) + 1] = e[(1 * a + n) * t + r] * B + I, k[4 * (n * t + r) + 2] = e[(0 * a + n) * t + r] * D + R, k[4 * (n * t + r) + 3] = e[(3 * a + n) * t + r] * A + S;
                    }
                    break;
                case c.a.GREY:
                    for (let a = _; a < _ + x; a++) for (let n = f; n < f + E; n++) k[4 * (a * t + n) + 0] = k[4 * (a * t + n) + 1] = k[4 * (a * t + n) + 2] = e[a * t + n] * y[0] + b[0], k[4 * (a * t + n) + 3] = 255;
            }
            Object(u.b)(d(k, E, x), i, {srcX: f, srcY: _, srcW: E, srcH: x, dstX: h, dstY: m, dstW: p, dstH: g})
        };
        var l = a(19), c = a(18), u = a(42), h = a(20)
    }, function (e, t, a) {
        'use strict';

        function n(e, t = {}) {
            let {srcX: a = 0, srcY: n = 0, srcW: r = e.width, srcH: s = e.height, dstX: d = 0, dstY: l = 0} = t, {dstW: c = r, dstH: u = s} = t,
                h = Object(o.a)(e).getImageData(a, n, r, s);
            return (0 !== d || 0 !== l || r !== c || s !== u) && (h = i(h, {dstX: d, dstY: l, dstW: c, dstH: u})), h
        }

        function r(e, t = {}) {
            let a, n;
            if (e instanceof HTMLVideoElement) a = e.videoWidth, n = e.videoHeight; else if (e instanceof HTMLImageElement) a = e.naturalWidth, n = e.naturalHeight; else throw TypeError('Failed to execute "getImageDataFromDrawable(drawable, options)": "drawable" must be an instanceof HTMLVideoElement or HTMLImageElement');
            let {srcX: r = 0, srcY: i = 0, dstX: s = 0, dstY: d = 0, dstW: l = a, dstH: c = n} = t,
                u = document.createElement('canvas');
            u.width = s + l, u.height = d + c;
            let h = Object(o.a)(u);
            return h.drawImage(e, r, i, a, n, s, d, l, c), h.getImageData(0, 0, s + l, d + c)
        }

        function i(e, t = {}) {
            let {srcX: a = 0, srcY: n = 0, srcW: r = e.width, srcH: i = e.height, dstX: s = 0, dstY: d = 0} = t, {dstW: l = r, dstH: c = i} = t,
                u = document.createElement('canvas');
            u.width = r, u.height = i;
            let h = Object(o.a)(u);
            h.putImageData(e, -a, -n);
            let f = document.createElement('canvas');
            f.width = s + l, f.height = d + c;
            let _ = Object(o.a)(f);
            return _.drawImage(u, 0, 0, r, i, s, d, l, c), _.getImageData(0, 0, s + l, d + c)
        }

        t.a = function (e, t = {}) {
            if (e instanceof HTMLCanvasElement) return n(e, t);
            if (e instanceof HTMLVideoElement || e instanceof HTMLImageElement) return r(e, t);
            throw TypeError('Failed to execute "getImageData(image, options)": "image" must be an instance of HTMLCanvasElement, HTMLVideoElement, or HTMLImageElement')
        }, t.b = function (e, t, a = {}) {
            let {srcX: n = 0, srcY: r = 0, srcW: s = e.width, srcH: d = e.height, dstX: l = 0, dstY: c = 0} = a, {dstW: u = s, dstH: h = d} = a;
            (0 !== n || 0 !== r || s !== u || d !== h) && (e = i(e, {
                srcX: n,
                srcY: r,
                srcW: s,
                srcH: d,
                dstW: u,
                dstH: h
            })), Object(o.a)(t).putImageData(e, l, c)
        };
        var o = a(19)
    }, function (e, t, a) {
        'use strict';
        Object.defineProperty(t, '__esModule', {value: !0});
        var n = a(44);
        a.d(t, 'argmax', function () {
            return n.a
        }), a.d(t, 'argmin', function () {
            return n.b
        })
    }, function (e, t) {
        'use strict';
        t.a = function (e, t = 1) {
            e = e.slice();
            let a = [[0, e.length]], n = [];
            for (let a = 0; a < e.length; a++) n[a] = a;
            for (; 0 < a.length;) {
                let [r, i] = a.pop(), o = e[i - 1], s = r, d = i - 2, l;
                if (!(r >= i - 1)) {
                    for (; ;) {
                        for (; e[s] > o && s <= d;) s++;
                        for (; e[d] <= o && s <= d;) d--;
                        if (s >= d) break;
                        l = e[s], e[s] = e[d], e[d] = l, l = n[s], n[s] = n[d], n[d] = l
                    }
                    e[i - 1] = e[s], e[s] = o, l = n[i - 1], n[i - 1] = n[s], n[s] = l, a.push([r, s]), s + 1 < t && a.push([s + 1, i])
                }
            }
            let r = [];
            for (let a = 0; a < t; a++) r.push(n[a]);
            return r
        }, t.b = function (e, t = 1) {
            e = e.slice();
            let a = [[0, e.length]], n = [];
            for (let a = 0; a < e.length; a++) n[a] = a;
            for (; 0 < a.length;) {
                let [r, i] = a.pop(), o = e[i - 1], s = r, d = i - 2, l;
                if (!(r >= i - 1)) {
                    for (; ;) {
                        for (; e[s] < o && s <= d;) s++;
                        for (; e[d] >= o && s <= d;) d--;
                        if (s >= d) break;
                        l = e[s], e[s] = e[d], e[d] = l, l = n[s], n[s] = n[d], n[d] = l
                    }
                    e[i - 1] = e[s], e[s] = o, l = n[i - 1], n[i - 1] = n[s], n[s] = l, a.push([r, s]), s + 1 < t && a.push([s + 1, i])
                }
            }
            let r = [];
            for (let a = 0; a < t; a++) r.push(n[a]);
            return r
        }
    }])
});
//# sourceMappingURL=webdnn.js.map