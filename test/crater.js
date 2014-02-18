!function () {
    var e, t;
    (function () {
        t = {}
    }).call(this), function () {
        (function () {
            var e = this, n = e._, r = {}, o = Array.prototype, i = Object.prototype, a = Function.prototype, s = o.push, u = o.slice, c = o.concat, l = i.toString, f = i.hasOwnProperty, d = o.forEach, p = o.map, h = o.reduce, g = o.reduceRight, m = o.filter, v = o.every, y = o.some, _ = o.indexOf, b = o.lastIndexOf, w = Array.isArray, x = Object.keys, k = a.bind, E = function (e) {
                return e instanceof E ? e : this instanceof E ? (this._wrapped = e, void 0) : new E(e)
            };
            "undefined" != typeof t ? ("undefined" != typeof module && module.exports && (t = module.exports = E), t._ = E) : e._ = E, E.VERSION = "1.5.2";
            var T = function (e) {
                return"[object Arguments]" === l.call(e)
            };
            T(arguments) || (T = function (e) {
                return!(!e || !f.call(e, "callee") || "function" != typeof e.callee)
            });
            var C = function (e) {
                return e.length === +e.length && (T(e) || e.constructor !== Object)
            }, S = E.each = E.forEach = function (e, t, n) {
                if (null != e)if (d && e.forEach === d)e.forEach(t, n); else if (C(e)) {
                    for (var o = 0, i = e.length; i > o; o++)if (t.call(n, e[o], o, e) === r)return
                } else for (var a = E.keys(e), o = 0, i = a.length; i > o; o++)if (t.call(n, e[a[o]], a[o], e) === r)return
            };
            E.map = E.collect = function (e, t, n) {
                var r = [];
                return null == e ? r : p && e.map === p ? e.map(t, n) : (S(e, function (e, o, i) {
                    r.push(t.call(n, e, o, i))
                }), r)
            };
            var O = "Reduce of empty array with no initial value";
            E.reduce = E.foldl = E.inject = function (e, t, n, r) {
                var o = arguments.length > 2;
                if (null == e && (e = []), h && e.reduce === h)return r && (t = E.bind(t, r)), o ? e.reduce(t, n) : e.reduce(t);
                if (S(e, function (e, i, a) {
                    o ? n = t.call(r, n, e, i, a) : (n = e, o = !0)
                }), !o)throw new TypeError(O);
                return n
            }, E.reduceRight = E.foldr = function (e, t, n, r) {
                var o = arguments.length > 2;
                if (null == e && (e = []), g && e.reduceRight === g)return r && (t = E.bind(t, r)), o ? e.reduceRight(t, n) : e.reduceRight(t);
                var i = e.length;
                if (!C(e)) {
                    var a = E.keys(e);
                    i = a.length
                }
                if (S(e, function (s, u, c) {
                    u = a ? a[--i] : --i, o ? n = t.call(r, n, e[u], u, c) : (n = e[u], o = !0)
                }), !o)throw new TypeError(O);
                return n
            }, E.find = E.detect = function (e, t, n) {
                var r;
                return N(e, function (e, o, i) {
                    return t.call(n, e, o, i) ? (r = e, !0) : void 0
                }), r
            }, E.filter = E.select = function (e, t, n) {
                var r = [];
                return null == e ? r : m && e.filter === m ? e.filter(t, n) : (S(e, function (e, o, i) {
                    t.call(n, e, o, i) && r.push(e)
                }), r)
            }, E.reject = function (e, t, n) {
                return E.filter(e, function (e, r, o) {
                    return!t.call(n, e, r, o)
                }, n)
            }, E.every = E.all = function (e, t, n) {
                t || (t = E.identity);
                var o = !0;
                return null == e ? o : v && e.every === v ? e.every(t, n) : (S(e, function (e, i, a) {
                    return(o = o && t.call(n, e, i, a)) ? void 0 : r
                }), !!o)
            };
            var N = E.some = E.any = function (e, t, n) {
                t || (t = E.identity);
                var o = !1;
                return null == e ? o : y && e.some === y ? e.some(t, n) : (S(e, function (e, i, a) {
                    return o || (o = t.call(n, e, i, a)) ? r : void 0
                }), !!o)
            };
            E.contains = E.include = function (e, t) {
                return null == e ? !1 : _ && e.indexOf === _ ? -1 != e.indexOf(t) : N(e, function (e) {
                    return e === t
                })
            }, E.invoke = function (e, t) {
                var n = u.call(arguments, 2), r = E.isFunction(t);
                return E.map(e, function (e) {
                    return(r ? t : e[t]).apply(e, n)
                })
            }, E.pluck = function (e, t) {
                return E.map(e, function (e) {
                    return e[t]
                })
            }, E.where = function (e, t, n) {
                return E.isEmpty(t) ? n ? void 0 : [] : E[n ? "find" : "filter"](e, function (e) {
                    for (var n in t)if (t[n] !== e[n])return!1;
                    return!0
                })
            }, E.findWhere = function (e, t) {
                return E.where(e, t, !0)
            }, E.max = function (e, t, n) {
                if (!t && E.isArray(e) && e[0] === +e[0] && e.length < 65535)return Math.max.apply(Math, e);
                if (!t && E.isEmpty(e))return-1 / 0;
                var r = {computed: -1 / 0, value: -1 / 0};
                return S(e, function (e, o, i) {
                    var a = t ? t.call(n, e, o, i) : e;
                    a > r.computed && (r = {value: e, computed: a})
                }), r.value
            }, E.min = function (e, t, n) {
                if (!t && E.isArray(e) && e[0] === +e[0] && e.length < 65535)return Math.min.apply(Math, e);
                if (!t && E.isEmpty(e))return 1 / 0;
                var r = {computed: 1 / 0, value: 1 / 0};
                return S(e, function (e, o, i) {
                    var a = t ? t.call(n, e, o, i) : e;
                    a < r.computed && (r = {value: e, computed: a})
                }), r.value
            }, E.shuffle = function (e) {
                var t, n = 0, r = [];
                return S(e, function (e) {
                    t = E.random(n++), r[n - 1] = r[t], r[t] = e
                }), r
            }, E.sample = function (e, t, n) {
                return arguments.length < 2 || n ? e[E.random(e.length - 1)] : E.shuffle(e).slice(0, Math.max(0, t))
            };
            var A = function (e) {
                return E.isFunction(e) ? e : function (t) {
                    return t[e]
                }
            };
            E.sortBy = function (e, t, n) {
                var r = A(t);
                return E.pluck(E.map(e,function (e, t, o) {
                    return{value: e, index: t, criteria: r.call(n, e, t, o)}
                }).sort(function (e, t) {
                    var n = e.criteria, r = t.criteria;
                    if (n !== r) {
                        if (n > r || void 0 === n)return 1;
                        if (r > n || void 0 === r)return-1
                    }
                    return e.index - t.index
                }), "value")
            };
            var M = function (e) {
                return function (t, n, r) {
                    var o = {}, i = null == n ? E.identity : A(n);
                    return S(t, function (n, a) {
                        var s = i.call(r, n, a, t);
                        e(o, s, n)
                    }), o
                }
            };
            E.groupBy = M(function (e, t, n) {
                (E.has(e, t) ? e[t] : e[t] = []).push(n)
            }), E.indexBy = M(function (e, t, n) {
                e[t] = n
            }), E.countBy = M(function (e, t) {
                E.has(e, t) ? e[t]++ : e[t] = 1
            }), E.sortedIndex = function (e, t, n, r) {
                n = null == n ? E.identity : A(n);
                for (var o = n.call(r, t), i = 0, a = e.length; a > i;) {
                    var s = i + a >>> 1;
                    n.call(r, e[s]) < o ? i = s + 1 : a = s
                }
                return i
            }, E.toArray = function (e) {
                return e ? E.isArray(e) ? u.call(e) : C(e) ? E.map(e, E.identity) : E.values(e) : []
            }, E.size = function (e) {
                return null == e ? 0 : C(e) ? e.length : E.keys(e).length
            }, E.first = E.head = E.take = function (e, t, n) {
                return null == e ? void 0 : null == t || n ? e[0] : u.call(e, 0, t)
            }, E.initial = function (e, t, n) {
                return u.call(e, 0, e.length - (null == t || n ? 1 : t))
            }, E.last = function (e, t, n) {
                return null == e ? void 0 : null == t || n ? e[e.length - 1] : u.call(e, Math.max(e.length - t, 0))
            }, E.rest = E.tail = E.drop = function (e, t, n) {
                return u.call(e, null == t || n ? 1 : t)
            }, E.compact = function (e) {
                return E.filter(e, E.identity)
            };
            var I = function (e, t, n) {
                return t && E.every(e, E.isArray) ? c.apply(n, e) : (S(e, function (e) {
                    E.isArray(e) || E.isArguments(e) ? t ? s.apply(n, e) : I(e, t, n) : n.push(e)
                }), n)
            };
            E.flatten = function (e, t) {
                return I(e, t, [])
            }, E.without = function (e) {
                return E.difference(e, u.call(arguments, 1))
            }, E.uniq = E.unique = function (e, t, n, r) {
                E.isFunction(t) && (r = n, n = t, t = !1);
                var o = n ? E.map(e, n, r) : e, i = [], a = [];
                return S(o, function (n, r) {
                    (t ? r && a[a.length - 1] === n : E.contains(a, n)) || (a.push(n), i.push(e[r]))
                }), i
            }, E.union = function () {
                return E.uniq(E.flatten(arguments, !0))
            }, E.intersection = function (e) {
                var t = u.call(arguments, 1);
                return E.filter(E.uniq(e), function (e) {
                    return E.every(t, function (t) {
                        return E.indexOf(t, e) >= 0
                    })
                })
            }, E.difference = function (e) {
                var t = c.apply(o, u.call(arguments, 1));
                return E.filter(e, function (e) {
                    return!E.contains(t, e)
                })
            }, E.zip = function () {
                for (var e = E.max(E.pluck(arguments, "length").concat(0)), t = new Array(e), n = 0; e > n; n++)t[n] = E.pluck(arguments, "" + n);
                return t
            }, E.object = function (e, t) {
                if (null == e)return{};
                for (var n = {}, r = 0, o = e.length; o > r; r++)t ? n[e[r]] = t[r] : n[e[r][0]] = e[r][1];
                return n
            }, E.indexOf = function (e, t, n) {
                if (null == e)return-1;
                var r = 0, o = e.length;
                if (n) {
                    if ("number" != typeof n)return r = E.sortedIndex(e, t), e[r] === t ? r : -1;
                    r = 0 > n ? Math.max(0, o + n) : n
                }
                if (_ && e.indexOf === _)return e.indexOf(t, n);
                for (; o > r; r++)if (e[r] === t)return r;
                return-1
            }, E.lastIndexOf = function (e, t, n) {
                if (null == e)return-1;
                var r = null != n;
                if (b && e.lastIndexOf === b)return r ? e.lastIndexOf(t, n) : e.lastIndexOf(t);
                for (var o = r ? n : e.length; o--;)if (e[o] === t)return o;
                return-1
            }, E.range = function (e, t, n) {
                arguments.length <= 1 && (t = e || 0, e = 0), n = arguments[2] || 1;
                for (var r = Math.max(Math.ceil((t - e) / n), 0), o = 0, i = new Array(r); r > o;)i[o++] = e, e += n;
                return i
            };
            var j = function () {
            };
            E.bind = function (e, t) {
                var n, r;
                if (k && e.bind === k)return k.apply(e, u.call(arguments, 1));
                if (!E.isFunction(e))throw new TypeError;
                return n = u.call(arguments, 2), r = function () {
                    if (!(this instanceof r))return e.apply(t, n.concat(u.call(arguments)));
                    j.prototype = e.prototype;
                    var o = new j;
                    j.prototype = null;
                    var i = e.apply(o, n.concat(u.call(arguments)));
                    return Object(i) === i ? i : o
                }
            }, E.partial = function (e) {
                var t = u.call(arguments, 1);
                return function () {
                    return e.apply(this, t.concat(u.call(arguments)))
                }
            }, E.bindAll = function (e) {
                var t = u.call(arguments, 1);
                if (0 === t.length)throw new Error("bindAll must be passed function names");
                return S(t, function (t) {
                    e[t] = E.bind(e[t], e)
                }), e
            }, E.memoize = function (e, t) {
                var n = {};
                return t || (t = E.identity), function () {
                    var r = t.apply(this, arguments);
                    return E.has(n, r) ? n[r] : n[r] = e.apply(this, arguments)
                }
            }, E.delay = function (e, t) {
                var n = u.call(arguments, 2);
                return setTimeout(function () {
                    return e.apply(null, n)
                }, t)
            }, E.defer = function (e) {
                return E.delay.apply(E, [e, 1].concat(u.call(arguments, 1)))
            }, E.throttle = function (e, t, n) {
                var r, o, i, a = null, s = 0;
                n || (n = {});
                var u = function () {
                    s = n.leading === !1 ? 0 : new Date, a = null, i = e.apply(r, o)
                };
                return function () {
                    var c = new Date;
                    s || n.leading !== !1 || (s = c);
                    var l = t - (c - s);
                    return r = this, o = arguments, 0 >= l ? (clearTimeout(a), a = null, s = c, i = e.apply(r, o)) : a || n.trailing === !1 || (a = setTimeout(u, l)), i
                }
            }, E.debounce = function (e, t, n) {
                var r, o, i, a, s;
                return function () {
                    i = this, o = arguments, a = new Date;
                    var u = function () {
                        var c = new Date - a;
                        t > c ? r = setTimeout(u, t - c) : (r = null, n || (s = e.apply(i, o)))
                    }, c = n && !r;
                    return r || (r = setTimeout(u, t)), c && (s = e.apply(i, o)), s
                }
            }, E.once = function (e) {
                var t, n = !1;
                return function () {
                    return n ? t : (n = !0, t = e.apply(this, arguments), e = null, t)
                }
            }, E.wrap = function (e, t) {
                return function () {
                    var n = [e];
                    return s.apply(n, arguments), t.apply(this, n)
                }
            }, E.compose = function () {
                var e = arguments;
                return function () {
                    for (var t = arguments, n = e.length - 1; n >= 0; n--)t = [e[n].apply(this, t)];
                    return t[0]
                }
            }, E.after = function (e, t) {
                return function () {
                    return--e < 1 ? t.apply(this, arguments) : void 0
                }
            }, E.keys = x || function (e) {
                if (e !== Object(e))throw new TypeError("Invalid object");
                var t = [];
                for (var n in e)E.has(e, n) && t.push(n);
                return t
            }, E.values = function (e) {
                for (var t = E.keys(e), n = t.length, r = new Array(n), o = 0; n > o; o++)r[o] = e[t[o]];
                return r
            }, E.pairs = function (e) {
                for (var t = E.keys(e), n = t.length, r = new Array(n), o = 0; n > o; o++)r[o] = [t[o], e[t[o]]];
                return r
            }, E.invert = function (e) {
                for (var t = {}, n = E.keys(e), r = 0, o = n.length; o > r; r++)t[e[n[r]]] = n[r];
                return t
            }, E.functions = E.methods = function (e) {
                var t = [];
                for (var n in e)E.isFunction(e[n]) && t.push(n);
                return t.sort()
            }, E.extend = function (e) {
                return S(u.call(arguments, 1), function (t) {
                    if (t)for (var n in t)e[n] = t[n]
                }), e
            }, E.pick = function (e) {
                var t = {}, n = c.apply(o, u.call(arguments, 1));
                return S(n, function (n) {
                    n in e && (t[n] = e[n])
                }), t
            }, E.omit = function (e) {
                var t = {}, n = c.apply(o, u.call(arguments, 1));
                for (var r in e)E.contains(n, r) || (t[r] = e[r]);
                return t
            }, E.defaults = function (e) {
                return S(u.call(arguments, 1), function (t) {
                    if (t)for (var n in t)void 0 === e[n] && (e[n] = t[n])
                }), e
            }, E.clone = function (e) {
                return E.isObject(e) ? E.isArray(e) ? e.slice() : E.extend({}, e) : e
            }, E.tap = function (e, t) {
                return t(e), e
            };
            var D = function (e, t, n, r) {
                if (e === t)return 0 !== e || 1 / e == 1 / t;
                if (null == e || null == t)return e === t;
                e instanceof E && (e = e._wrapped), t instanceof E && (t = t._wrapped);
                var o = l.call(e);
                if (o != l.call(t))return!1;
                switch (o) {
                    case"[object String]":
                        return e == String(t);
                    case"[object Number]":
                        return e != +e ? t != +t : 0 == e ? 1 / e == 1 / t : e == +t;
                    case"[object Date]":
                    case"[object Boolean]":
                        return+e == +t;
                    case"[object RegExp]":
                        return e.source == t.source && e.global == t.global && e.multiline == t.multiline && e.ignoreCase == t.ignoreCase
                }
                if ("object" != typeof e || "object" != typeof t)return!1;
                for (var i = n.length; i--;)if (n[i] == e)return r[i] == t;
                var a = e.constructor, s = t.constructor;
                if (a !== s && !(E.isFunction(a) && a instanceof a && E.isFunction(s) && s instanceof s))return!1;
                n.push(e), r.push(t);
                var u = 0, c = !0;
                if ("[object Array]" == o) {
                    if (u = e.length, c = u == t.length)for (; u-- && (c = D(e[u], t[u], n, r)););
                } else {
                    for (var f in e)if (E.has(e, f) && (u++, !(c = E.has(t, f) && D(e[f], t[f], n, r))))break;
                    if (c) {
                        for (f in t)if (E.has(t, f) && !u--)break;
                        c = !u
                    }
                }
                return n.pop(), r.pop(), c
            };
            E.isEqual = function (e, t) {
                return D(e, t, [], [])
            }, E.isEmpty = function (e) {
                if (null == e)return!0;
                if (E.isArray(e) || E.isString(e))return 0 === e.length;
                for (var t in e)if (E.has(e, t))return!1;
                return!0
            }, E.isElement = function (e) {
                return!(!e || 1 !== e.nodeType)
            }, E.isArray = w || function (e) {
                return"[object Array]" == l.call(e)
            }, E.isObject = function (e) {
                return e === Object(e)
            }, S(["Arguments", "Function", "String", "Number", "Date", "RegExp"], function (e) {
                E["is" + e] = function (t) {
                    return l.call(t) == "[object " + e + "]"
                }
            }), E.isArguments(arguments) || (E.isArguments = function (e) {
                return!(!e || !E.has(e, "callee"))
            }), "function" != typeof/./ && (E.isFunction = function (e) {
                return"function" == typeof e
            }), E.isFinite = function (e) {
                return isFinite(e) && !isNaN(parseFloat(e))
            }, E.isNaN = function (e) {
                return E.isNumber(e) && e != +e
            }, E.isBoolean = function (e) {
                return e === !0 || e === !1 || "[object Boolean]" == l.call(e)
            }, E.isNull = function (e) {
                return null === e
            }, E.isUndefined = function (e) {
                return void 0 === e
            }, E.has = function (e, t) {
                return f.call(e, t)
            }, E.noConflict = function () {
                return e._ = n, this
            }, E.identity = function (e) {
                return e
            }, E.times = function (e, t, n) {
                for (var r = Array(Math.max(0, e)), o = 0; e > o; o++)r[o] = t.call(n, o);
                return r
            }, E.random = function (e, t) {
                return null == t && (t = e, e = 0), e + Math.floor(Math.random() * (t - e + 1))
            };
            var P = {escape: {"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#x27;"}};
            P.unescape = E.invert(P.escape);
            var R = {escape: new RegExp("[" + E.keys(P.escape).join("") + "]", "g"), unescape: new RegExp("(" + E.keys(P.unescape).join("|") + ")", "g")};
            E.each(["escape", "unescape"], function (e) {
                E[e] = function (t) {
                    return null == t ? "" : ("" + t).replace(R[e], function (t) {
                        return P[e][t]
                    })
                }
            }), E.result = function (e, t) {
                if (null == e)return void 0;
                var n = e[t];
                return E.isFunction(n) ? n.call(e) : n
            }, E.mixin = function (e) {
                S(E.functions(e), function (t) {
                    var n = E[t] = e[t];
                    E.prototype[t] = function () {
                        var e = [this._wrapped];
                        return s.apply(e, arguments), q.call(this, n.apply(E, e))
                    }
                })
            };
            var $ = 0;
            E.uniqueId = function (e) {
                var t = ++$ + "";
                return e ? e + t : t
            }, E.templateSettings = {evaluate: /<%([\s\S]+?)%>/g, interpolate: /<%=([\s\S]+?)%>/g, escape: /<%-([\s\S]+?)%>/g};
            var L = /(.)^/, B = {"'": "'", "\\": "\\", "\r": "r", "\n": "n", "	": "t", "\u2028": "u2028", "\u2029": "u2029"}, H = /\\|'|\r|\n|\t|\u2028|\u2029/g;
            E.template = function (e, t, n) {
                var r;
                n = E.defaults({}, n, E.templateSettings);
                var o = new RegExp([(n.escape || L).source, (n.interpolate || L).source, (n.evaluate || L).source].join("|") + "|$", "g"), i = 0, a = "__p+='";
                e.replace(o, function (t, n, r, o, s) {
                    return a += e.slice(i, s).replace(H, function (e) {
                        return"\\" + B[e]
                    }), n && (a += "'+\n((__t=(" + n + "))==null?'':_.escape(__t))+\n'"), r && (a += "'+\n((__t=(" + r + "))==null?'':__t)+\n'"), o && (a += "';\n" + o + "\n__p+='"), i = s + t.length, t
                }), a += "';\n", n.variable || (a = "with(obj||{}){\n" + a + "}\n"), a = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + a + "return __p;\n";
                try {
                    r = new Function(n.variable || "obj", "_", a)
                } catch (s) {
                    throw s.source = a, s
                }
                if (t)return r(t, E);
                var u = function (e) {
                    return r.call(this, e, E)
                };
                return u.source = "function(" + (n.variable || "obj") + "){\n" + a + "}", u
            }, E.chain = function (e) {
                return E(e).chain()
            };
            var q = function (e) {
                return this._chain ? E(e).chain() : e
            };
            E.mixin(E), S(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function (e) {
                var t = o[e];
                E.prototype[e] = function () {
                    var n = this._wrapped;
                    return t.apply(n, arguments), "shift" != e && "splice" != e || 0 !== n.length || delete n[0], q.call(this, n)
                }
            }), S(["concat", "join", "slice"], function (e) {
                var t = o[e];
                E.prototype[e] = function () {
                    return q.call(this, t.apply(this._wrapped, arguments))
                }
            }), E.extend(E.prototype, {chain: function () {
                return this._chain = !0, this
            }, value: function () {
                return this._wrapped
            }})
        }).call(this)
    }.call(this), function () {
        e = t._
    }.call(this), "undefined" == typeof Package && (Package = {}), Package.underscore = {_: e}
}(), function () {
    var e, t = Package.underscore._;
    (function () {
        e = {isClient: !0, isServer: !1}, "object" == typeof __meteor_runtime_config__ && __meteor_runtime_config__.PUBLIC_SETTINGS && (e.settings = {"public": __meteor_runtime_config__.PUBLIC_SETTINGS})
    }).call(this), function () {
        if (e.isServer)var n = Npm.require("fibers/future");
        "object" == typeof __meteor_runtime_config__ && __meteor_runtime_config__.meteorRelease && (e.release = __meteor_runtime_config__.meteorRelease), t.extend(e, {_get: function (e) {
            for (var t = 1; t < arguments.length; t++) {
                if (!(arguments[t]in e))return void 0;
                e = e[arguments[t]]
            }
            return e
        }, _ensure: function (e) {
            for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                n in e || (e[n] = {}), e = e[n]
            }
            return e
        }, _delete: function (e) {
            for (var t = [e], n = !0, r = 1; r < arguments.length - 1; r++) {
                var o = arguments[r];
                if (!(o in e)) {
                    n = !1;
                    break
                }
                if (e = e[o], "object" != typeof e)break;
                t.push(e)
            }
            for (var r = t.length - 1; r >= 0; r--) {
                var o = arguments[r + 1];
                if (n)n = !1; else for (var i in t[r][o])return;
                delete t[r][o]
            }
        }, _wrapAsync: function (r) {
            return function () {
                for (var o, i, a = this, s = t.toArray(arguments), u = function (t) {
                    return t ? e._debug("Exception in callback of async function", t.stack ? t.stack : t) : void 0
                }; s.length > 0 && "undefined" == typeof s[s.length - 1];)s.pop();
                s.length > 0 && s[s.length - 1]instanceof Function ? o = s.pop() : e.isClient ? o = u : (i = new n, o = i.resolver()), s.push(e.bindEnvironment(o));
                var c = r.apply(a, s);
                return i ? i.wait() : c
            }
        }})
    }.call(this), function () {
        "use strict";
        function t() {
            if (o.setImmediate) {
                var e = function (e) {
                    o.setImmediate(e)
                };
                return e.implementation = "setImmediate", e
            }
            return null
        }

        function n() {
            function e(e, t) {
                return"string" == typeof e && e.substring(0, t.length) === t
            }

            function t(t) {
                if (t.source === o && e(t.data, s)) {
                    var n = t.data.substring(s.length);
                    try {
                        a[n] && a[n]()
                    } finally {
                        delete a[n]
                    }
                }
            }

            if (!o.postMessage || o.importScripts)return null;
            var n = !0, r = o.onmessage;
            if (o.onmessage = function () {
                n = !1
            }, o.postMessage("", "*"), o.onmessage = r, !n)return null;
            var i = 0, a = {}, s = "Meteor._setImmediate." + Math.random() + ".";
            o.addEventListener ? o.addEventListener("message", t, !1) : o.attachEvent("onmessage", t);
            var u = function (e) {
                ++i, a[i] = e, o.postMessage(s + i, "*")
            };
            return u.implementation = "postMessage", u
        }

        function r() {
            var e = function (e) {
                o.setTimeout(e, 0)
            };
            return e.implementation = "setTimeout", e
        }

        var o = this;
        e._setImmediate = t() || n() || r()
    }.call(this), function () {
        var n = function (e) {
            if (Package.livedata) {
                var t = Package.livedata.DDP._CurrentInvocation;
                if (t.get() && t.get().isSimulation)throw new Error("Can't set timers inside simulations");
                return function () {
                    t.withValue(null, e)
                }
            }
            return e
        }, r = function (t, r) {
            return e.bindEnvironment(n(r), t)
        };
        t.extend(e, {setTimeout: function (e, t) {
            return setTimeout(r("setTimeout callback", e), t)
        }, setInterval: function (e, t) {
            return setInterval(r("setInterval callback", e), t)
        }, clearInterval: function (e) {
            return clearInterval(e)
        }, clearTimeout: function (e) {
            return clearTimeout(e)
        }, defer: function (t) {
            e._setImmediate(r("defer callback", t))
        }})
    }.call(this), function () {
        var t = function (e, t) {
            var n = function () {
            };
            n.prototype = t.prototype, e.prototype = new n, e.prototype.constructor = e
        };
        e.makeErrorType = function (e, n) {
            var r = function () {
                var t = this;
                if (Error.captureStackTrace)Error.captureStackTrace(t, r); else {
                    var o = new Error;
                    o.__proto__ = r.prototype, o instanceof r && (t = o)
                }
                return n.apply(t, arguments), t.errorType = e, t
            };
            return t(r, Error), r
        }, e.Error = e.makeErrorType("Meteor.Error", function (e, t, n) {
            var r = this;
            r.error = e, r.reason = t, r.details = n, r.message = r.reason ? r.reason + " [" + r.error + "]" : "[" + r.error + "]"
        }), e.Error.prototype.clone = function () {
            var t = this;
            return new e.Error(t.error, t.reason, t.details)
        }
    }.call(this), function () {
        e._noYieldsAllowed = function (e) {
            return e()
        }
    }.call(this), function () {
        e._UnyieldingQueue = function () {
            var e = this;
            e._tasks = [], e._running = !1
        }, t.extend(e._UnyieldingQueue.prototype, {runTask: function (n) {
            var r = this;
            if (!r.safeToRunTask())throw new Error("Could not synchronously run a task from a running task");
            r._tasks.push(n);
            var o = r._tasks;
            r._tasks = [], r._running = !0;
            try {
                for (; !t.isEmpty(o);) {
                    var i = o.shift();
                    try {
                        e._noYieldsAllowed(function () {
                            i()
                        })
                    } catch (a) {
                        if (t.isEmpty(o))throw a;
                        e._debug("Exception in queued task: " + a.stack)
                    }
                }
            } finally {
                r._running = !1
            }
        }, queueTask: function (e) {
            var n = this, r = t.isEmpty(n._tasks);
            n._tasks.push(e), r && setTimeout(t.bind(n.flush, n), 0)
        }, flush: function () {
            var e = this;
            e.runTask(function () {
            })
        }, drain: function () {
            var e = this;
            if (e.safeToRunTask())for (; !t.isEmpty(e._tasks);)e.flush()
        }, safeToRunTask: function () {
            var e = this;
            return!e._running
        }})
    }.call(this), function () {
        var t = [], n = "loaded" === document.readyState || "complete" == document.readyState, r = function () {
            for (n = !0; t.length;)t.shift()()
        };
        document.addEventListener ? (document.addEventListener("DOMContentLoaded", r, !1), window.addEventListener("load", r, !1)) : (document.attachEvent("onreadystatechange", function () {
            "complete" === document.readyState && r()
        }), window.attachEvent("load", r)), e.startup = function (r) {
            var o = !document.addEventListener && document.documentElement.doScroll;
            if (o && window === top) {
                try {
                    o("left")
                } catch (i) {
                    return setTimeout(function () {
                        e.startup(r)
                    }, 50), void 0
                }
                r()
            } else n ? r() : t.push(r)
        }
    }.call(this), function () {
        var t = 0;
        e._debug = function () {
            if (t)return t--, void 0;
            if ("undefined" != typeof console && "undefined" != typeof console.log)if (0 == arguments.length)console.log(""); else if ("function" == typeof console.log.apply) {
                for (var e = !0, n = 0; n < arguments.length; n++)"string" != typeof arguments[n] && (e = !1);
                e ? console.log.apply(console, [Array.prototype.join.call(arguments, " ")]) : console.log.apply(console, arguments)
            } else if ("function" == typeof Function.prototype.bind) {
                var r = Function.prototype.bind.call(console.log, console);
                r.apply(console, arguments)
            } else Function.prototype.call.call(console.log, console, Array.prototype.slice.call(arguments))
        }, e._suppress_log = function (e) {
            t += e
        }
    }.call(this), function () {
        var n = 0, r = [];
        e.EnvironmentVariable = function () {
            this.slot = n++
        }, t.extend(e.EnvironmentVariable.prototype, {get: function () {
            return r[this.slot]
        }, withValue: function (e, t) {
            var n = r[this.slot];
            try {
                r[this.slot] = e;
                var o = t()
            } finally {
                r[this.slot] = n
            }
            return o
        }}), e.bindEnvironment = function (n, o, i) {
            var a = t.clone(r);
            if (!o || "string" == typeof o) {
                var s = o || "callback of async function";
                o = function (t) {
                    e._debug("Exception in " + s + ":", t && t.stack || t)
                }
            }
            return function () {
                var e = r;
                try {
                    r = a;
                    var s = n.apply(i, t.toArray(arguments))
                } catch (u) {
                    o(u)
                } finally {
                    r = e
                }
                return s
            }
        }
    }.call(this), function () {
        e.absoluteUrl = function (n, r) {
            r || "object" != typeof n || (r = n, n = void 0), r = t.extend({}, e.absoluteUrl.defaultOptions, r || {});
            var o = r.rootUrl;
            if (!o)throw new Error("Must pass options.rootUrl or set ROOT_URL in the server environment");
            return/^http[s]?:\/\//i.test(o) || (o = "http://" + o), /\/$/.test(o) || (o += "/"), n && (o += n), r.secure && /^http:/.test(o) && !/http:\/\/localhost[:\/]/.test(o) && !/http:\/\/127\.0\.0\.1[:\/]/.test(o) && (o = o.replace(/^http:/, "https:")), r.replaceLocalhost && (o = o.replace(/^http:\/\/localhost([:\/].*)/, "http://127.0.0.1$1")), o
        }, e.absoluteUrl.defaultOptions = {}, "object" == typeof __meteor_runtime_config__ && __meteor_runtime_config__.ROOT_URL && (e.absoluteUrl.defaultOptions.rootUrl = __meteor_runtime_config__.ROOT_URL), e._relativeToSiteRootUrl = function (e) {
            return"object" == typeof __meteor_runtime_config__ && "/" === e.substr(0, 1) && (e = (__meteor_runtime_config__.ROOT_URL_PATH_PREFIX || "") + e), e
        }
    }.call(this), "undefined" == typeof Package && (Package = {}), Package.meteor = {Meteor: e}
}(), function () {
    var Meteor = Package.meteor.Meteor, JSON;
    (function () {
        window.JSON && (JSON = window.JSON)
    }).call(this), function () {
        "object" != typeof JSON && (JSON = {}), function () {
            "use strict";
            function f(e) {
                return 10 > e ? "0" + e : e
            }

            function quote(e) {
                return escapable.lastIndex = 0, escapable.test(e) ? '"' + e.replace(escapable, function (e) {
                    var t = meta[e];
                    return"string" == typeof t ? t : "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
                }) + '"' : '"' + e + '"'
            }

            function str(e, t) {
                var n, r, o, i, a, s = gap, u = t[e];
                switch (u && "object" == typeof u && "function" == typeof u.toJSON && (u = u.toJSON(e)), "function" == typeof rep && (u = rep.call(t, e, u)), typeof u) {
                    case"string":
                        return quote(u);
                    case"number":
                        return isFinite(u) ? String(u) : "null";
                    case"boolean":
                    case"null":
                        return String(u);
                    case"object":
                        if (!u)return"null";
                        if (gap += indent, a = [], "[object Array]" === Object.prototype.toString.apply(u)) {
                            for (i = u.length, n = 0; i > n; n += 1)a[n] = str(n, u) || "null";
                            return o = 0 === a.length ? "[]" : gap ? "[\n" + gap + a.join(",\n" + gap) + "\n" + s + "]" : "[" + a.join(",") + "]", gap = s, o
                        }
                        if (rep && "object" == typeof rep)for (i = rep.length, n = 0; i > n; n += 1)"string" == typeof rep[n] && (r = rep[n], o = str(r, u), o && a.push(quote(r) + (gap ? ": " : ":") + o)); else for (r in u)Object.prototype.hasOwnProperty.call(u, r) && (o = str(r, u), o && a.push(quote(r) + (gap ? ": " : ":") + o));
                        return o = 0 === a.length ? "{}" : gap ? "{\n" + gap + a.join(",\n" + gap) + "\n" + s + "}" : "{" + a.join(",") + "}", gap = s, o
                }
            }

            "function" != typeof Date.prototype.toJSON && (Date.prototype.toJSON = function () {
                return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
            }, String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function () {
                return this.valueOf()
            });
            var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = {"\b": "\\b", "	": "\\t", "\n": "\\n", "\f": "\\f", "\r": "\\r", '"': '\\"', "\\": "\\\\"}, rep;
            "function" != typeof JSON.stringify && (JSON.stringify = function (e, t, n) {
                var r;
                if (gap = "", indent = "", "number" == typeof n)for (r = 0; n > r; r += 1)indent += " "; else"string" == typeof n && (indent = n);
                if (rep = t, t && "function" != typeof t && ("object" != typeof t || "number" != typeof t.length))throw new Error("JSON.stringify");
                return str("", {"": e})
            }), "function" != typeof JSON.parse && (JSON.parse = function (text, reviver) {
                function walk(e, t) {
                    var n, r, o = e[t];
                    if (o && "object" == typeof o)for (n in o)Object.prototype.hasOwnProperty.call(o, n) && (r = walk(o, n), void 0 !== r ? o[n] = r : delete o[n]);
                    return reviver.call(e, t, o)
                }

                var j;
                if (text = String(text), cx.lastIndex = 0, cx.test(text) && (text = text.replace(cx, function (e) {
                    return"\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
                })), /^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, "")))return j = eval("(" + text + ")"), "function" == typeof reviver ? walk({"": j}, "") : j;
                throw new SyntaxError("JSON.parse")
            })
        }()
    }.call(this), "undefined" == typeof Package && (Package = {}), Package.json = {JSON: JSON}
}(), function () {
    var e, t, n, r, o = (Package.meteor.Meteor, Package.json.JSON), i = Package.underscore._;
    (function () {
        e = {}, t = {};
        var a = {};
        e.addType = function (e, t) {
            if (i.has(a, e))throw new Error("Type " + e + " already present");
            a[e] = t
        };
        var s = function (e) {
            return i.isNaN(e) || 1 / 0 === e || e === -1 / 0
        }, u = [
            {matchJSONValue: function (e) {
                return i.has(e, "$date") && 1 === i.size(e)
            }, matchObject: function (e) {
                return e instanceof Date
            }, toJSONValue: function (e) {
                return{$date: e.getTime()}
            }, fromJSONValue: function (e) {
                return new Date(e.$date)
            }},
            {matchJSONValue: function (e) {
                return i.has(e, "$InfNaN") && 1 === i.size(e)
            }, matchObject: s, toJSONValue: function (e) {
                var t;
                return t = i.isNaN(e) ? 0 : 1 / 0 === e ? 1 : -1, {$InfNaN: t}
            }, fromJSONValue: function (e) {
                return e.$InfNaN / 0
            }},
            {matchJSONValue: function (e) {
                return i.has(e, "$binary") && 1 === i.size(e)
            }, matchObject: function (e) {
                return"undefined" != typeof Uint8Array && e instanceof Uint8Array || e && i.has(e, "$Uint8ArrayPolyfill")
            }, toJSONValue: function (e) {
                return{$binary: n(e)}
            }, fromJSONValue: function (e) {
                return r(e.$binary)
            }},
            {matchJSONValue: function (e) {
                return i.has(e, "$escape") && 1 === i.size(e)
            }, matchObject: function (e) {
                return i.isEmpty(e) || i.size(e) > 2 ? !1 : i.any(u, function (t) {
                    return t.matchJSONValue(e)
                })
            }, toJSONValue: function (t) {
                var n = {};
                return i.each(t, function (t, r) {
                    n[r] = e.toJSONValue(t)
                }), {$escape: n}
            }, fromJSONValue: function (t) {
                var n = {};
                return i.each(t.$escape, function (t, r) {
                    n[r] = e.fromJSONValue(t)
                }), n
            }},
            {matchJSONValue: function (e) {
                return i.has(e, "$type") && i.has(e, "$value") && 2 === i.size(e)
            }, matchObject: function (t) {
                return e._isCustomType(t)
            }, toJSONValue: function (e) {
                return{$type: e.typeName(), $value: e.toJSONValue()}
            }, fromJSONValue: function (e) {
                var t = e.$type, n = a[t];
                return n(e.$value)
            }}
        ];
        e._isCustomType = function (e) {
            return e && "function" == typeof e.toJSONValue && "function" == typeof e.typeName && i.has(a, e.typeName())
        };
        var c = e._adjustTypesToJSONValue = function (e) {
            if (null === e)return null;
            var t = l(e);
            return void 0 !== t ? t : "object" != typeof e ? e : (i.each(e, function (t, n) {
                if ("object" == typeof t || void 0 === t || s(t)) {
                    var r = l(t);
                    return r ? (e[n] = r, void 0) : (c(t), void 0)
                }
            }), e)
        }, l = function (e) {
            for (var t = 0; t < u.length; t++) {
                var n = u[t];
                if (n.matchObject(e))return n.toJSONValue(e)
            }
            return void 0
        };
        e.toJSONValue = function (t) {
            var n = l(t);
            return void 0 !== n ? n : ("object" == typeof t && (t = e.clone(t), c(t)), t)
        };
        var f = e._adjustTypesFromJSONValue = function (e) {
            if (null === e)return null;
            var t = d(e);
            return t !== e ? t : "object" != typeof e ? e : (i.each(e, function (t, n) {
                if ("object" == typeof t) {
                    var r = d(t);
                    if (t !== r)return e[n] = r, void 0;
                    f(t)
                }
            }), e)
        }, d = function (e) {
            if ("object" == typeof e && null !== e && i.size(e) <= 2 && i.all(e, function (e, t) {
                return"string" == typeof t && "$" === t.substr(0, 1)
            }))for (var t = 0; t < u.length; t++) {
                var n = u[t];
                if (n.matchJSONValue(e))return n.fromJSONValue(e)
            }
            return e
        };
        e.fromJSONValue = function (t) {
            var n = d(t);
            return n === t && "object" == typeof t ? (t = e.clone(t), f(t), t) : n
        }, e.stringify = function (t, n) {
            var r = e.toJSONValue(t);
            return n && (n.canonical || n.indent) ? e._canonicalStringify(r, n) : o.stringify(r)
        }, e.parse = function (t) {
            if ("string" != typeof t)throw new Error("EJSON.parse argument should be a string");
            return e.fromJSONValue(o.parse(t))
        }, e.isBinary = function (e) {
            return!!("undefined" != typeof Uint8Array && e instanceof Uint8Array || e && e.$Uint8ArrayPolyfill)
        }, e.equals = function (t, n, r) {
            var o, a = !(!r || !r.keyOrderSensitive);
            if (t === n)return!0;
            if (i.isNaN(t) && i.isNaN(n))return!0;
            if (!t || !n)return!1;
            if ("object" != typeof t || "object" != typeof n)return!1;
            if (t instanceof Date && n instanceof Date)return t.valueOf() === n.valueOf();
            if (e.isBinary(t) && e.isBinary(n)) {
                if (t.length !== n.length)return!1;
                for (o = 0; o < t.length; o++)if (t[o] !== n[o])return!1;
                return!0
            }
            if ("function" == typeof t.equals)return t.equals(n, r);
            if (t instanceof Array) {
                if (!(n instanceof Array))return!1;
                if (t.length !== n.length)return!1;
                for (o = 0; o < t.length; o++)if (!e.equals(t[o], n[o], r))return!1;
                return!0
            }
            var s;
            if (a) {
                var u = [];
                return i.each(n, function (e, t) {
                    u.push(t)
                }), o = 0, s = i.all(t, function (t, i) {
                    return o >= u.length ? !1 : i !== u[o] ? !1 : e.equals(t, n[u[o]], r) ? (o++, !0) : !1
                }), s && o === u.length
            }
            return o = 0, s = i.all(t, function (t, a) {
                return i.has(n, a) ? e.equals(t, n[a], r) ? (o++, !0) : !1 : !1
            }), s && i.size(n) === o
        }, e.clone = function (t) {
            var n;
            if ("object" != typeof t)return t;
            if (null === t)return null;
            if (t instanceof Date)return new Date(t.getTime());
            if (e.isBinary(t)) {
                n = e.newBinary(t.length);
                for (var r = 0; r < t.length; r++)n[r] = t[r];
                return n
            }
            if (i.isArray(t) || i.isArguments(t)) {
                for (n = [], r = 0; r < t.length; r++)n[r] = e.clone(t[r]);
                return n
            }
            return"function" == typeof t.clone ? t.clone() : (n = {}, i.each(t, function (t, r) {
                n[r] = e.clone(t)
            }), n)
        }
    }).call(this), function () {
        function t(e) {
            return o.stringify(e)
        }

        var n = function (e, r, o, a, s) {
            var u, c, l, f, d = a, p = r[e];
            switch (typeof p) {
                case"string":
                    return t(p);
                case"number":
                    return isFinite(p) ? String(p) : "null";
                case"boolean":
                    return String(p);
                case"object":
                    if (!p)return"null";
                    if (d = a + o, f = [], i.isArray(p) || i.isArguments(p)) {
                        for (l = p.length, u = 0; l > u; u += 1)f[u] = n(u, p, o, d, s) || "null";
                        return c = 0 === f.length ? "[]" : d ? "[\n" + d + f.join(",\n" + d) + "\n" + a + "]" : "[" + f.join(",") + "]"
                    }
                    var h = i.keys(p);
                    return s && (h = h.sort()), i.each(h, function (e) {
                        c = n(e, p, o, d, s), c && f.push(t(e) + (d ? ": " : ":") + c)
                    }), c = 0 === f.length ? "{}" : d ? "{\n" + d + f.join(",\n" + d) + "\n" + a + "}" : "{" + f.join(",") + "}"
            }
        };
        e._canonicalStringify = function (e, t) {
            if (t = i.extend({indent: "", canonical: !1}, t), t.indent === !0)t.indent = "  "; else if ("number" == typeof t.indent) {
                for (var r = "", o = 0; o < t.indent; o++)r += " ";
                t.indent = r
            }
            return n("", {"": e}, t.indent, "", t.canonical)
        }
    }.call(this), function () {
        for (var o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", i = {}, a = 0; a < o.length; a++)i[o.charAt(a)] = a;
        n = function (e) {
            for (var t = [], n = null, r = null, o = null, i = null, a = 0; a < e.length; a++)switch (a % 3) {
                case 0:
                    n = e[a] >> 2 & 63, r = (3 & e[a]) << 4;
                    break;
                case 1:
                    r |= e[a] >> 4 & 15, o = (15 & e[a]) << 2;
                    break;
                case 2:
                    o |= e[a] >> 6 & 3, i = 63 & e[a], t.push(s(n)), t.push(s(r)), t.push(s(o)), t.push(s(i)), n = null, r = null, o = null, i = null
            }
            return null != n && (t.push(s(n)), t.push(s(r)), null == o ? t.push("=") : t.push(s(o)), null == i && t.push("=")), t.join("")
        };
        var s = function (e) {
            return o.charAt(e)
        }, u = function (e) {
            return"=" === e ? -1 : i[e]
        };
        e.newBinary = function (e) {
            if ("undefined" == typeof Uint8Array || "undefined" == typeof ArrayBuffer) {
                for (var t = [], n = 0; e > n; n++)t.push(0);
                return t.$Uint8ArrayPolyfill = !0, t
            }
            return new Uint8Array(new ArrayBuffer(e))
        }, r = function (t) {
            var n = Math.floor(3 * t.length / 4);
            "=" == t.charAt(t.length - 1) && (n--, "=" == t.charAt(t.length - 2) && n--);
            for (var r = e.newBinary(n), o = null, i = null, a = null, s = 0, c = 0; c < t.length; c++) {
                var l = t.charAt(c), f = u(l);
                switch (c % 4) {
                    case 0:
                        if (0 > f)throw new Error("invalid base64 string");
                        o = f << 2;
                        break;
                    case 1:
                        if (0 > f)throw new Error("invalid base64 string");
                        o |= f >> 4, r[s++] = o, i = (15 & f) << 4;
                        break;
                    case 2:
                        f >= 0 && (i |= f >> 2, r[s++] = i, a = (3 & f) << 6);
                        break;
                    case 3:
                        f >= 0 && (r[s++] = a | f)
                }
            }
            return r
        }, t.base64Encode = n, t.base64Decode = r
    }.call(this), "undefined" == typeof Package && (Package = {}), Package.ejson = {EJSON: e, EJSONTest: t}
}(), function () {
    var e, t = Package.meteor.Meteor, n = Package.underscore._, r = Package.ejson.EJSON;
    (function () {
        e = function () {
            return e.info.apply(this, arguments)
        };
        var o = 0, i = [], a = 0;
        e._intercept = function (e) {
            o += e
        }, e._suppress = function (e) {
            a += e
        }, e._intercepted = function () {
            var e = i;
            return i = [], o = 0, e
        }, e.outputFormat = "json";
        var s = {debug: "green", warn: "magenta", error: "red"}, u = "blue", c = ["time", "timeInexact", "level", "file", "line", "program", "originApp", "satellite", "stderr"], l = c.concat(["app", "message"]), f = function (n) {
            var r = e.format(n), o = n.level;
            "undefined" != typeof console && console[o] ? console[o](r) : t._debug(r)
        };
        e._getCallerDetails = function () {
            var e = function () {
                var e = new Error, t = e.stack;
                return t
            }, t = e();
            if (!t)return{};
            for (var n, r = t.split("\n"), o = 1; o < r.length; ++o) {
                if (n = r[o], n.match(/^\s*at eval \(eval/))return{file: "eval"};
                if (!n.match(/packages\/logging(?:\/|(?::tests)?\.js)/))break
            }
            var i = {}, a = /(?:[@(]| at )([^(]+?):([0-9:]+)(?:\)|$)/.exec(n);
            return a ? (i.line = a[2].split(":")[0], i.file = a[1].split("/").slice(-1)[0].split("?")[0], i) : i
        }, n.each(["debug", "info", "warn", "error"], function (s) {
            e[s] = function (u) {
                if (a)return a--, void 0;
                var l = !1;
                o && (o--, l = !0);
                var d = !n.isObject(u) || n.isRegExp(u) || n.isDate(u) ? {message: new String(u).toString()} : u;
                if (n.each(c, function (e) {
                    if (d[e])throw new Error("Can't set '" + e + "' in log message")
                }), n.has(d, "message") && !n.isString(d.message))throw new Error("The 'message' field in log objects must be a string");
                if (d = n.extend(e._getCallerDetails(), d), d.time = new Date, d.level = s, "debug" !== s)if (l)i.push(r.stringify(d)); else if (t.isServer)if ("colored-text" === e.outputFormat)console.log(e.format(d, {color: !0})); else {
                    if ("json" !== e.outputFormat)throw new Error("Unknown logging output format: " + e.outputFormat);
                    console.log(r.stringify(d))
                } else f(d)
            }
        }), e.parse = function (e) {
            var t = null;
            if (e && "{" === e.charAt(0))try {
                t = r.parse(e)
            } catch (n) {
            }
            return t && t.time && t.time instanceof Date ? t : null
        }, e.format = function (e, o) {
            e = r.clone(e), o = o || {};
            var i = e.time;
            if (!(i instanceof Date))throw new Error("'time' must be a Date object");
            var a = e.timeInexact, c = e.level || "info", f = e.file, d = e.line, p = e.app || "", h = e.originApp, g = e.message || "", m = e.program || "", v = e.satellite, y = e.stderr || "";
            n.each(l, function (t) {
                delete e[t]
            }), n.isEmpty(e) || (g && (g += " "), g += r.stringify(e));
            var _ = function (e) {
                return 10 > e ? "0" + e : e.toString()
            }, b = function (e) {
                return 100 > e ? "0" + _(e) : e.toString()
            }, w = i.getFullYear().toString() + _(i.getMonth() + 1) + _(i.getDate()), x = _(i.getHours()) + ":" + _(i.getMinutes()) + ":" + _(i.getSeconds()) + "." + b(i.getMilliseconds()), k = "(" + -((new Date).getTimezoneOffset() / 60) + ")", E = "";
            p && (E += p), h && h !== p && (E += " via " + h), E && (E = "[" + E + "] ");
            var T = f && d ? ["(", m ? m + ":" : "", f, ":", d, ") "].join("") : "";
            v && (T += ["[", v, "]"].join(""));
            var C = y ? "(STDERR) " : "", S = [c.charAt(0).toUpperCase(), w, "-", x, k, a ? "? " : " ", E, T, C].join(""), O = function (e, n) {
                return o.color && t.isServer && n ? Npm.require("cli-color")[n](e) : e
            };
            return O(S, u) + O(g, s[c])
        }, e.objFromText = function (e, t) {
            var r = {message: e, level: "info", time: new Date, timeInexact: !0};
            return n.extend(r, t)
        }
    }).call(this), "undefined" == typeof Package && (Package = {}), Package.logging = {Log: e}
}(), function () {
    var e, t = Package.meteor.Meteor, n = Package.underscore._, r = (Package.logging.Log, Package.json.JSON);
    (function () {
        var o, i = "Meteor_Reload", a = 3e4, s = {};
        "undefined" != typeof sessionStorage && sessionStorage && (o = sessionStorage.getItem(i), sessionStorage.removeItem(i)), o || (o = "{}");
        var u = {};
        try {
            u = r.parse(o), "object" != typeof u && (t._debug("Got bad data on reload. Ignoring."), u = {})
        } catch (c) {
            t._debug("Got invalid JSON on reload. Ignoring.")
        }
        u.reload && "object" == typeof u.data && u.time + a > (new Date).getTime() && (s = u.data);
        var l = [];
        e = {}, e._onMigrate = function (e, t) {
            t || (t = e, e = void 0), l.push({name: e, callback: t})
        }, e._migrationData = function (e) {
            return s[e]
        };
        var f = !1;
        e._reload = function () {
            if (!f) {
                f = !0;
                var e = function () {
                    n.defer(function () {
                        for (var o = {}, a = n.clone(l); a.length;) {
                            var s = a.shift(), u = s.callback(e);
                            if (!u[0])return;
                            u.length > 1 && s.name && (o[s.name] = u[1])
                        }
                        try {
                            var c = r.stringify({time: (new Date).getTime(), data: o, reload: !0})
                        } catch (f) {
                            throw t._debug("Couldn't serialize data for migration", o), f
                        }
                        "undefined" != typeof sessionStorage && sessionStorage ? sessionStorage.setItem(i, c) : t._debug("Browser does not support sessionStorage. Not saving migration state."), window.location.reload()
                    })
                };
                e()
            }
        }
    }).call(this), function () {
        t._reload = {onMigrate: e._onMigrate, migrationData: e._migrationData, reload: e._reload}
    }.call(this), "undefined" == typeof Package && (Package = {}), Package.reload = {Reload: e}
}(), function () {
    var e, t = Package.meteor.Meteor, n = Package.underscore._;
    (function () {
        e = {}, e.active = !1, e.currentComputation = null;
        var r = function (t) {
            e.currentComputation = t, e.active = !!t
        }, o = function () {
            return"undefined" != typeof t ? t._debug : "undefined" != typeof console && console.log ? console.log : function () {
            }
        }, i = 1, a = [], s = !1, u = !1, c = !1, l = [], f = function () {
            s || (setTimeout(e.flush, 0), s = !0)
        }, d = !1;
        e.Computation = function (e, t) {
            if (!d)throw new Error("Deps.Computation constructor is private; use Deps.autorun");
            d = !1;
            var n = this;
            n.stopped = !1, n.invalidated = !1, n.firstRun = !0, n._id = i++, n._onInvalidateCallbacks = [], n._parent = t, n._func = e, n._recomputing = !1;
            var r = !0;
            try {
                n._compute(), r = !1
            } finally {
                n.firstRun = !1, r && n.stop()
            }
        }, n.extend(e.Computation.prototype, {onInvalidate: function (t) {
            var n = this;
            if ("function" != typeof t)throw new Error("onInvalidate requires a function");
            var r = function () {
                e.nonreactive(function () {
                    t(n)
                })
            };
            n.invalidated ? r() : n._onInvalidateCallbacks.push(r)
        }, invalidate: function () {
            var e = this;
            if (!e.invalidated) {
                e._recomputing || e.stopped || (f(), a.push(this)), e.invalidated = !0;
                for (var t, n = 0; t = e._onInvalidateCallbacks[n]; n++)t();
                e._onInvalidateCallbacks = []
            }
        }, stop: function () {
            this.stopped || (this.stopped = !0, this.invalidate())
        }, _compute: function () {
            var t = this;
            t.invalidated = !1;
            var n = e.currentComputation;
            r(t);
            c = !0;
            try {
                t._func(t)
            } finally {
                r(n), c = !1
            }
        }, _recompute: function () {
            var e = this;
            for (e._recomputing = !0; e.invalidated && !e.stopped;)try {
                e._compute()
            } catch (t) {
                o()("Exception from Deps recompute:", t.stack || t.message)
            }
            e._recomputing = !1
        }}), e.Dependency = function () {
            this._dependentsById = {}
        }, n.extend(e.Dependency.prototype, {depend: function (t) {
            if (!t) {
                if (!e.active)return!1;
                t = e.currentComputation
            }
            var n = this, r = t._id;
            return r in n._dependentsById ? !1 : (n._dependentsById[r] = t, t.onInvalidate(function () {
                delete n._dependentsById[r]
            }), !0)
        }, changed: function () {
            var e = this;
            for (var t in e._dependentsById)e._dependentsById[t].invalidate()
        }, hasDependents: function () {
            var e = this;
            for (var t in e._dependentsById)return!0;
            return!1
        }}), n.extend(e, {flush: function () {
            if (u)throw new Error("Can't call Deps.flush while flushing");
            if (c)throw new Error("Can't flush inside Deps.autorun");
            for (u = !0, s = !0; a.length || l.length;) {
                var e = a;
                a = [];
                for (var t, n = 0; t = e[n]; n++)t._recompute();
                if (l.length) {
                    var r = l.shift();
                    try {
                        r()
                    } catch (i) {
                        o()("Exception from Deps afterFlush function:", i.stack || i.message)
                    }
                }
            }
            u = !1, s = !1
        }, autorun: function (t) {
            if ("function" != typeof t)throw new Error("Deps.autorun requires a function argument");
            d = !0;
            var n = new e.Computation(t, e.currentComputation);
            return e.active && e.onInvalidate(function () {
                n.stop()
            }), n
        }, nonreactive: function (t) {
            var n = e.currentComputation;
            r(null);
            try {
                return t()
            } finally {
                r(n)
            }
        }, _makeNonreactive: function (t) {
            if (t.$isNonreactive)return t;
            var r = function () {
                var r, o = this, i = n.toArray(arguments);
                return e.nonreactive(function () {
                    r = t.apply(o, i)
                }), r
            };
            return r.$isNonreactive = !0, r
        }, onInvalidate: function (t) {
            if (!e.active)throw new Error("Deps.onInvalidate requires a currentComputation");
            e.currentComputation.onInvalidate(t)
        }, afterFlush: function (e) {
            l.push(e), f()
        }, isolateValue: function (t, n) {
            if (!e.active)return t();
            var r, o = new e.Dependency;
            return e.autorun(function (e) {
                var i = t();
                e.firstRun ? r = i : (n ? n(i, r) : i === r) || o.changed()
            }), o.depend(), r
        }})
    }).call(this), function () {
        t.flush = e.flush, t.autorun = e.autorun, t.autosubscribe = e.autorun, e.depend = function (e) {
            return e.depend()
        }
    }.call(this), "undefined" == typeof Package && (Package = {}), Package.deps = {Deps: e}
}(), function () {
    {
        var e, t = Package.meteor.Meteor;
        Package.underscore._
    }
    (function () {
        if (t.isServer)var n = Npm.require("crypto");
        var r = function () {
            function e() {
                var e = 4022871197, t = function (t) {
                    t = t.toString();
                    for (var n = 0; n < t.length; n++) {
                        e += t.charCodeAt(n);
                        var r = .02519603282416938 * e;
                        e = r >>> 0, r -= e, r *= e, e = r >>> 0, r -= e, e += 4294967296 * r
                    }
                    return 2.3283064365386963e-10 * (e >>> 0)
                };
                return t.version = "Mash 0.9", t
            }

            return function (t) {
                var n = 0, r = 0, o = 0, i = 1;
                0 == t.length && (t = [+new Date]);
                var a = e();
                n = a(" "), r = a(" "), o = a(" ");
                for (var s = 0; s < t.length; s++)n -= a(t[s]), 0 > n && (n += 1), r -= a(t[s]), 0 > r && (r += 1), o -= a(t[s]), 0 > o && (o += 1);
                a = null;
                var u = function () {
                    var e = 2091639 * n + 2.3283064365386963e-10 * i;
                    return n = r, r = o, o = e - (i = 0 | e)
                };
                return u.uint32 = function () {
                    return 4294967296 * u()
                }, u.fract53 = function () {
                    return u() + 1.1102230246251565e-16 * (2097152 * u() | 0)
                }, u.version = "Alea 0.9", u.args = t, u
            }(Array.prototype.slice.call(arguments))
        }, o = "23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz", i = function (e) {
            var t = this;
            void 0 !== e && (t.alea = r.apply(null, e))
        };
        i.prototype.fraction = function () {
            var e = this;
            if (e.alea)return e.alea();
            if (n) {
                var t = parseInt(e.hexString(8), 16);
                return 2.3283064365386963e-10 * t
            }
            if ("undefined" != typeof window && window.crypto && window.crypto.getRandomValues) {
                var r = new Uint32Array(1);
                return window.crypto.getRandomValues(r), 2.3283064365386963e-10 * r[0]
            }
        }, i.prototype.hexString = function (e) {
            var t = this;
            if (n && !t.alea) {
                var r, o = Math.ceil(e / 2);
                try {
                    r = n.randomBytes(o)
                } catch (i) {
                    r = n.pseudoRandomBytes(o)
                }
                var a = r.toString("hex");
                return a.substring(0, e)
            }
            for (var s = [], u = 0; e > u; ++u)s.push(t.choice("0123456789abcdef"));
            return s.join("")
        }, i.prototype.id = function () {
            for (var e = [], t = this, n = 0; 17 > n; n++)e[n] = t.choice(o);
            return e.join("")
        }, i.prototype.choice = function (e) {
            var t = Math.floor(this.fraction() * e.length);
            return"string" == typeof e ? e.substr(t, 1) : e[t]
        };
        var a = "undefined" != typeof window && window.innerHeight || "undefined" != typeof document && document.documentElement && document.documentElement.clientHeight || "undefined" != typeof document && document.body && document.body.clientHeight || 1, s = "undefined" != typeof window && window.innerWidth || "undefined" != typeof document && document.documentElement && document.documentElement.clientWidth || "undefined" != typeof document && document.body && document.body.clientWidth || 1, u = "undefined" != typeof navigator && navigator.userAgent || "";
        e = n || "undefined" != typeof window && window.crypto && window.crypto.getRandomValues ? new i : new i([new Date, a, s, u, Math.random()]), e.create = function () {
            return new i(arguments)
        }
    }).call(this), function () {
        t.uuid = function () {
            for (var t = "0123456789abcdef", n = [], r = 0; 36 > r; r++)n[r] = e.choice(t);
            n[14] = "4", n[19] = t.substr(3 & parseInt(n[19], 16) | 8, 1), n[8] = n[13] = n[18] = n[23] = "-";
            var o = n.join("");
            return o
        }
    }.call(this), "undefined" == typeof Package && (Package = {}), Package.random = {Random: e}
}(), function () {
    var e, t = (Package.meteor.Meteor, Package.underscore._), n = Package.random.Random;
    (function () {
        e = function (e) {
            var n = this;
            t.extend(n, t.defaults(t.clone(e || {}), {baseTimeout: 1e3, exponent: 2.2, maxTimeout: 3e5, minTimeout: 10, minCount: 2, fuzz: .5})), n.retryTimer = null
        }, t.extend(e.prototype, {clear: function () {
            var e = this;
            e.retryTimer && clearTimeout(e.retryTimer), e.retryTimer = null
        }, _timeout: function (e) {
            var t = this;
            if (e < t.minCount)return t.minTimeout;
            var r = Math.min(t.maxTimeout, t.baseTimeout * Math.pow(t.exponent, e));
            return r *= n.fraction() * t.fuzz + (1 - t.fuzz / 2)
        }, retryLater: function (e, t) {
            var n = this, r = n._timeout(e);
            return n.retryTimer && clearTimeout(n.retryTimer), n.retryTimer = setTimeout(t, r), r
        }})
    }).call(this), "undefined" == typeof Package && (Package = {}), Package.retry = {Retry: e}
}(), function () {
    var e, t, n = Package.meteor.Meteor, r = Package.underscore._, o = Package.ejson.EJSON;
    (function () {
        var i = new n.EnvironmentVariable;
        e = function (e, n) {
            var r = i.get();
            r && r.checking(e);
            try {
                f(e, n)
            } catch (o) {
                throw o instanceof t.Error && o.path && (o.message += " in field " + o.path), o
            }
        }, t = {Optional: function (e) {
            return new a(e)
        }, OneOf: function () {
            return new s(r.toArray(arguments))
        }, Any: ["__any__"], Where: function (e) {
            return new u(e)
        }, ObjectIncluding: function (e) {
            return new c(e)
        }, Integer: ["__integer__"], Error: n.makeErrorType("Match.Error", function (e) {
            this.message = "Match error: " + e, this.path = "", this.sanitizedError = new n.Error(400, "Match failed")
        }), test: function (e, n) {
            try {
                return f(e, n), !0
            } catch (r) {
                if (r instanceof t.Error)return!1;
                throw r
            }
        }, _failIfArgumentsAreNotAllChecked: function (e, t, n, r) {
            var o = new d(n, r), a = i.withValue(o, function () {
                return e.apply(t, n)
            });
            return o.throwUnlessAllArgumentsHaveBeenChecked(), a
        }};
        var a = function (e) {
            this.pattern = e
        }, s = function (e) {
            if (r.isEmpty(e))throw new Error("Must provide at least one choice to Match.OneOf");
            this.choices = e
        }, u = function (e) {
            this.condition = e
        }, c = function (e) {
            this.pattern = e
        }, l = [
            [String, "string"],
            [Number, "number"],
            [Boolean, "boolean"],
            [void 0, "undefined"]
        ], f = function (e, n) {
            if (n !== t.Any) {
                for (var i = 0; i < l.length; ++i)if (n === l[i][0]) {
                    if (typeof e === l[i][1])return;
                    throw new t.Error("Expected " + l[i][1] + ", got " + typeof e)
                }
                if (null === n) {
                    if (null === e)return;
                    throw new t.Error("Expected null, got " + o.stringify(e))
                }
                if (n === t.Integer) {
                    if ("number" == typeof e && (0 | e) === e)return;
                    throw new t.Error("Expected Integer, got " + (e instanceof Object ? o.stringify(e) : e))
                }
                if (n === Object && (n = t.ObjectIncluding({})), n instanceof Array) {
                    if (1 !== n.length)throw Error("Bad pattern: arrays must have one type element" + o.stringify(n));
                    if (!r.isArray(e) && !r.isArguments(e))throw new t.Error("Expected array, got " + o.stringify(e));
                    return r.each(e, function (e, r) {
                        try {
                            f(e, n[0])
                        } catch (o) {
                            throw o instanceof t.Error && (o.path = h(r, o.path)), o
                        }
                    }), void 0
                }
                if (n instanceof u) {
                    if (n.condition(e))return;
                    throw new t.Error("Failed Match.Where validation")
                }
                if (n instanceof a && (n = t.OneOf(void 0, n.pattern)), n instanceof s) {
                    for (var i = 0; i < n.choices.length; ++i)try {
                        return f(e, n.choices[i]), void 0
                    } catch (d) {
                        if (!(d instanceof t.Error))throw d
                    }
                    throw new t.Error("Failed Match.OneOf or Match.Optional validation")
                }
                if (n instanceof Function) {
                    if (e instanceof n)return;
                    throw new t.Error("Expected " + n.name)
                }
                var p = !1;
                if (n instanceof c && (p = !0, n = n.pattern), "object" != typeof n)throw Error("Bad pattern: unknown pattern type");
                if ("object" != typeof e)throw new t.Error("Expected object, got " + typeof e);
                if (null === e)throw new t.Error("Expected object, got null");
                if (e.constructor !== Object)throw new t.Error("Expected plain object");
                var g = {}, m = {};
                r.each(n, function (e, t) {
                    e instanceof a ? m[t] = e.pattern : g[t] = e
                }), r.each(e, function (e, n) {
                    try {
                        if (r.has(g, n))f(e, g[n]), delete g[n]; else if (r.has(m, n))f(e, m[n]); else if (!p)throw new t.Error("Unknown key")
                    } catch (o) {
                        throw o instanceof t.Error && (o.path = h(n, o.path)), o
                    }
                }), r.each(g, function (e, n) {
                    throw new t.Error("Missing key '" + n + "'")
                })
            }
        }, d = function (e, t) {
            var n = this;
            n.args = r.clone(e), n.args.reverse(), n.description = t
        };
        r.extend(d.prototype, {checking: function (e) {
            var t = this;
            t._checkingOneValue(e) || (r.isArray(e) || r.isArguments(e)) && r.each(e, r.bind(t._checkingOneValue, t))
        }, _checkingOneValue: function (e) {
            for (var t = this, n = 0; n < t.args.length; ++n)if (e === t.args[n])return t.args.splice(n, 1), !0;
            return!1
        }, throwUnlessAllArgumentsHaveBeenChecked: function () {
            var e = this;
            if (!r.isEmpty(e.args))throw new Error("Did not check() all arguments during " + e.description)
        }});
        var p = ["do", "if", "in", "for", "let", "new", "try", "var", "case", "else", "enum", "eval", "false", "null", "this", "true", "void", "with", "break", "catch", "class", "const", "super", "throw", "while", "yield", "delete", "export", "import", "public", "return", "static", "switch", "typeof", "default", "extends", "finally", "package", "private", "continue", "debugger", "function", "arguments", "interface", "protected", "implements", "instanceof"], h = function (e, t) {
            return"number" == typeof e || e.match(/^[0-9]+$/) ? e = "[" + e + "]" : (!e.match(/^[a-z_$][0-9a-z_$]*$/i) || r.contains(p, e)) && (e = JSON.stringify([e])), t && "[" !== t[0] ? e + "." + t : e + t
        }
    }).call(this), "undefined" == typeof Package && (Package = {}), Package.check = {check: e, Match: t}
}(), function () {
    var e, t = (Package.meteor.Meteor, Package.underscore._);
    (function () {
        var n = function (e, t, n, r) {
            return{key: e, value: t, next: n, prev: r}
        };
        e = function () {
            var e = this;
            e._dict = {}, e._first = null, e._last = null, e._size = 0;
            var n = t.toArray(arguments);
            e._stringify = function (e) {
                return e
            }, "function" == typeof n[0] && (e._stringify = n.shift()), t.each(n, function (t) {
                e.putBefore(t[0], t[1], null)
            })
        }, t.extend(e.prototype, {_k: function (e) {
            return" " + this._stringify(e)
        }, empty: function () {
            var e = this;
            return!e._first
        }, size: function () {
            var e = this;
            return e._size
        }, _linkEltIn: function (e) {
            var t = this;
            e.next ? (e.prev = e.next.prev, e.next.prev = e, e.prev && (e.prev.next = e)) : (e.prev = t._last, t._last && (t._last.next = e), t._last = e), (null === t._first || t._first === e.next) && (t._first = e)
        }, _linkEltOut: function (e) {
            var t = this;
            e.next && (e.next.prev = e.prev), e.prev && (e.prev.next = e.next), e === t._last && (t._last = e.prev), e === t._first && (t._first = e.next)
        }, putBefore: function (e, t, r) {
            var o = this;
            if (o._dict[o._k(e)])throw new Error("Item " + e + " already present in OrderedDict");
            var i = r ? n(e, t, o._dict[o._k(r)]) : n(e, t, null);
            if (void 0 === i.next)throw new Error("could not find item to put this one before");
            o._linkEltIn(i), o._dict[o._k(e)] = i, o._size++
        }, append: function (e, t) {
            var n = this;
            n.putBefore(e, t, null)
        }, remove: function (e) {
            var t = this, n = t._dict[t._k(e)];
            if (void 0 === n)throw new Error("Item " + e + " not present in OrderedDict");
            return t._linkEltOut(n), t._size--, delete t._dict[t._k(e)], n.value
        }, get: function (e) {
            var t = this;
            return t.has(e) ? t._dict[t._k(e)].value : void 0
        }, has: function (e) {
            var n = this;
            return t.has(n._dict, n._k(e))
        }, forEach: function (t) {
            for (var n = this, r = 0, o = n._first; null !== o;) {
                var i = t(o.value, o.key, r);
                if (i === e.BREAK)return;
                o = o.next, r++
            }
        }, first: function () {
            var e = this;
            return e.empty() ? void 0 : e._first.key
        }, firstValue: function () {
            var e = this;
            return e.empty() ? void 0 : e._first.value
        }, last: function () {
            var e = this;
            return e.empty() ? void 0 : e._last.key
        }, lastValue: function () {
            var e = this;
            return e.empty() ? void 0 : e._last.value
        }, prev: function (e) {
            var t = this;
            if (t.has(e)) {
                var n = t._dict[t._k(e)];
                if (n.prev)return n.prev.key
            }
            return null
        }, next: function (e) {
            var t = this;
            if (t.has(e)) {
                var n = t._dict[t._k(e)];
                if (n.next)return n.next.key
            }
            return null
        }, moveBefore: function (e, t) {
            var n = this, r = n._dict[n._k(e)], o = t ? n._dict[n._k(t)] : null;
            if (void 0 === r)throw new Error("Item to move is not present");
            if (void 0 === o)throw new Error("Could not find element to move this one before");
            o !== r.next && (n._linkEltOut(r), r.next = o, n._linkEltIn(r))
        }, indexOf: function (t) {
            var n = this, r = null;
            return n.forEach(function (o, i, a) {
                return n._k(i) === n._k(t) ? (r = a, e.BREAK) : void 0
            }), r
        }, _checkRep: function () {
            var e = this;
            t.each(e._dict, function (e, t) {
                if (t.next === t)throw new Error("Next is a loop");
                if (t.prev === t)throw new Error("Prev is a loop")
            })
        }}), e.BREAK = {"break": !0}
    }).call(this), "undefined" == typeof Package && (Package = {}), Package["ordered-dict"] = {OrderedDict: e}
}(), function () {
    {
        var e, t;
        Package.meteor.Meteor
    }
    (function () {
        t = {exports: {}}
    }).call(this), function () {
        !function () {
            function e(e) {
                for (var t = [], n = [], r = 0; r < e[0].length; r++)t.push(e[0][r][1]), n.push(e[0][r][0]);
                return t = t.sort(function (e, t) {
                    return e - t
                }), n = n.sort(function (e, t) {
                    return e - t
                }), [
                    [t[0], n[0]],
                    [t[t.length - 1], n[n.length - 1]]
                ]
            }

            function n(e, t, n) {
                for (var r = [
                    [0, 0]
                ], o = 0; o < n.length; o++) {
                    for (var i = 0; i < n[o].length; i++)r.push(n[o][i]);
                    r.push([0, 0])
                }
                for (var a = !1, o = 0, i = r.length - 1; o < r.length; i = o++)r[o][0] > t != r[i][0] > t && e < (r[i][1] - r[o][1]) * (t - r[o][0]) / (r[i][0] - r[o][0]) + r[o][1] && (a = !a);
                return a
            }

            var r = {};
            "undefined" != typeof t && t.exports && (t.exports = r), r.lineStringsIntersect = function (e, t) {
                for (var n = [], r = 0; r <= e.coordinates.length - 2; ++r)for (var o = 0; o <= t.coordinates.length - 2; ++o) {
                    var i = {x: e.coordinates[r][1], y: e.coordinates[r][0]}, a = {x: e.coordinates[r + 1][1], y: e.coordinates[r + 1][0]}, s = {x: t.coordinates[o][1], y: t.coordinates[o][0]}, u = {x: t.coordinates[o + 1][1], y: t.coordinates[o + 1][0]}, c = (u.x - s.x) * (i.y - s.y) - (u.y - s.y) * (i.x - s.x), l = (a.x - i.x) * (i.y - s.y) - (a.y - i.y) * (i.x - s.x), f = (u.y - s.y) * (a.x - i.x) - (u.x - s.x) * (a.y - i.y);
                    if (0 != f) {
                        var d = c / f, p = l / f;
                        d >= 0 && 1 >= d && p >= 0 && 1 >= p && n.push({type: "Point", coordinates: [i.x + d * (a.x - i.x), i.y + d * (a.y - i.y)]})
                    }
                }
                return 0 == n.length && (n = !1), n
            }, r.pointInBoundingBox = function (e, t) {
                return!(e.coordinates[1] < t[0][0] || e.coordinates[1] > t[1][0] || e.coordinates[0] < t[0][1] || e.coordinates[0] > t[1][1])
            }, r.pointInPolygon = function (t, o) {
                for (var i = "Polygon" == o.type ? [o.coordinates] : o.coordinates, a = !1, s = 0; s < i.length; s++)r.pointInBoundingBox(t, e(i[s])) && (a = !0);
                if (!a)return!1;
                for (var u = !1, s = 0; s < i.length; s++)n(t.coordinates[1], t.coordinates[0], i[s]) && (u = !0);
                return u
            }, r.numberToRadius = function (e) {
                return e * Math.PI / 180
            }, r.numberToDegree = function (e) {
                return 180 * e / Math.PI
            }, r.drawCircle = function (e, t, n) {
                for (var o = [t.coordinates[1], t.coordinates[0]], i = e / 1e3 / 6371, a = [r.numberToRadius(o[0]), r.numberToRadius(o[1])], n = n || 15, s = [
                    [o[0], o[1]]
                ], u = 0; n > u; u++) {
                    var c = 2 * Math.PI * u / n, l = Math.asin(Math.sin(a[0]) * Math.cos(i) + Math.cos(a[0]) * Math.sin(i) * Math.cos(c)), f = a[1] + Math.atan2(Math.sin(c) * Math.sin(i) * Math.cos(a[0]), Math.cos(i) - Math.sin(a[0]) * Math.sin(l));
                    s[u] = [], s[u][1] = r.numberToDegree(l), s[u][0] = r.numberToDegree(f)
                }
                return{type: "Polygon", coordinates: [s]}
            }, r.rectangleCentroid = function (e) {
                var t = e.coordinates[0], n = t[0][0], r = t[0][1], o = t[2][0], i = t[2][1], a = o - n, s = i - r;
                return{type: "Point", coordinates: [n + a / 2, r + s / 2]}
            }, r.pointDistance = function (e, t) {
                var n = e.coordinates[0], o = e.coordinates[1], i = t.coordinates[0], a = t.coordinates[1], s = r.numberToRadius(a - o), u = r.numberToRadius(i - n), c = Math.pow(Math.sin(s / 2), 2) + Math.cos(r.numberToRadius(o)) * Math.cos(r.numberToRadius(a)) * Math.pow(Math.sin(u / 2), 2), l = 2 * Math.atan2(Math.sqrt(c), Math.sqrt(1 - c));
                return 6371 * l * 1e3
            }, r.geometryWithinRadius = function (e, t, n) {
                if ("Point" == e.type)return r.pointDistance(e, t) <= n;
                if ("LineString" == e.type || "Polygon" == e.type) {
                    var o, i = {};
                    o = "Polygon" == e.type ? e.coordinates[0] : e.coordinates;
                    for (var a in o)if (i.coordinates = o[a], r.pointDistance(i, t) > n)return!1
                }
                return!0
            }, r.area = function (e) {
                for (var t, n, r = 0, o = e.coordinates[0], i = o.length - 1, a = 0; a < o.length; i = a++) {
                    var t = {x: o[a][1], y: o[a][0]}, n = {x: o[i][1], y: o[i][0]};
                    r += t.x * n.y, r -= t.y * n.x
                }
                return r /= 2
            }, r.centroid = function (e) {
                for (var t, n, o, i = 0, a = 0, s = e.coordinates[0], u = s.length - 1, c = 0; c < s.length; u = c++) {
                    var n = {x: s[c][1], y: s[c][0]}, o = {x: s[u][1], y: s[u][0]};
                    t = n.x * o.y - o.x * n.y, i += (n.x + o.x) * t, a += (n.y + o.y) * t
                }
                return t = 6 * r.area(e), {type: "Point", coordinates: [a / t, i / t]}
            }, r.simplify = function (e, t) {
                t = t || 20, e = e.map(function (e) {
                    return{lng: e.coordinates[0], lat: e.coordinates[1]}
                });
                var n, r, o, i, a, s, u, c, l, f, d, p, h, g, m, v, y, _, b, w = Math.PI / 180 * .5, x = new Array, k = new Array, E = new Array;
                if (e.length < 3)return e;
                for (n = e.length, f = 360 * t / (2 * Math.PI * 6378137), f *= f, o = 0, k[0] = 0, E[0] = n - 1, r = 1; r > 0;)if (i = k[r - 1], a = E[r - 1], r--, a - i > 1) {
                    for (d = e[a].lng() - e[i].lng(), p = e[a].lat() - e[i].lat(), Math.abs(d) > 180 && (d = 360 - Math.abs(d)), d *= Math.cos(w * (e[a].lat() + e[i].lat())), h = d * d + p * p, s = i + 1, u = i, l = -1; a > s; s++)g = e[s].lng() - e[i].lng(), m = e[s].lat() - e[i].lat(), Math.abs(g) > 180 && (g = 360 - Math.abs(g)), g *= Math.cos(w * (e[s].lat() + e[i].lat())), v = g * g + m * m, y = e[s].lng() - e[a].lng(), _ = e[s].lat() - e[a].lat(), Math.abs(y) > 180 && (y = 360 - Math.abs(y)), y *= Math.cos(w * (e[s].lat() + e[a].lat())), b = y * y + _ * _, c = v >= h + b ? b : b >= h + v ? v : (g * p - m * d) * (g * p - m * d) / h, c > l && (u = s, l = c);
                    f > l ? (x[o] = i, o++) : (r++, k[r - 1] = u, E[r - 1] = a, r++, k[r - 1] = i, E[r - 1] = u)
                } else x[o] = i, o++;
                x[o] = n - 1, o++;
                for (var T = new Array, s = 0; o > s; s++)T.push(e[x[s]]);
                return T.map(function (e) {
                    return{type: "Point", coordinates: [e.lng, e.lat]}
                })
            }, r.destinationPoint = function (e, t, n) {
                n /= 6371, t = r.numberToRadius(t);
                var o = r.numberToRadius(e.coordinates[0]), i = r.numberToRadius(e.coordinates[1]), a = Math.asin(Math.sin(o) * Math.cos(n) + Math.cos(o) * Math.sin(n) * Math.cos(t)), s = i + Math.atan2(Math.sin(t) * Math.sin(n) * Math.cos(o), Math.cos(n) - Math.sin(o) * Math.sin(a));
                return s = (s + 3 * Math.PI) % (2 * Math.PI) - Math.PI, {type: "Point", coordinates: [r.numberToDegree(a), r.numberToDegree(s)]}
            }
        }()
    }.call(this), function () {
        e = t.exports
    }.call(this), "undefined" == typeof Package && (Package = {}), Package["geojson-utils"] = {GeoJSON: e}
}(), function () {
    var e, t, n, r, o, i, a, s, u, c, l, f, d, p, h = Package.meteor.Meteor, g = Package.underscore._, m = Package.json.JSON, v = Package.ejson.EJSON, y = Package["ordered-dict"].OrderedDict, _ = Package.deps.Deps, b = Package.random.Random, w = Package["geojson-utils"].GeoJSON;
    (function () {
        e = function (t) {
            var n = this;
            t = t || {}, n.name = t.name, n._docs = new e._IdMap;
            var r;
            r = h._SynchronousQueue && !t._observeCallbacksWillNeverYield ? h._SynchronousQueue : h._UnyieldingQueue, n._observeQueue = new r, n.next_qid = 1, n.queries = {}, n._savedOriginals = null, n.paused = !1
        }, t = {}, n = {}, e._applyChanges = function (e, t) {
            g.each(t, function (t, n) {
                void 0 === t ? delete e[n] : e[n] = t
            })
        }, r = function (e) {
            var t = new Error(e);
            return t.name = "MinimongoError", t
        }, e.prototype.find = function (t, n) {
            return 0 === arguments.length && (t = {}), new e.Cursor(this, t, n)
        }, e.Cursor = function (n, r, o) {
            var i = this;
            o || (o = {}), this.collection = n, e._selectorIsId(r) ? (i._selectorId = r, i.matcher = new t.Matcher(r, i), i.sorter = void 0) : (i._selectorId = void 0, i.matcher = new t.Matcher(r, i), i.sorter = i.matcher.hasGeoQuery() || o.sort ? new f(o.sort || []) : null), i.skip = o.skip, i.limit = o.limit, i.fields = o.fields, i.fields && (i.projectionFn = e._compileProjection(i.fields)), i._transform = e.wrapTransform(o.transform), i.db_objects = null, i.cursor_pos = 0, "undefined" != typeof _ && (i.reactive = void 0 === o.reactive ? !0 : o.reactive)
        }, e.Cursor.prototype.rewind = function () {
            var e = this;
            e.db_objects = null, e.cursor_pos = 0
        }, e.prototype.findOne = function (e, t) {
            return 0 === arguments.length && (e = {}), t = t || {}, t.limit = 1, this.find(e, t).fetch()[0]
        }, e.Cursor.prototype.forEach = function (e, t) {
            var n = this;
            for (null === n.db_objects && (n.db_objects = n._getRawObjects({ordered: !0})), n.reactive && n._depend({addedBefore: !0, removed: !0, changed: !0, movedBefore: !0}); n.cursor_pos < n.db_objects.length;) {
                var r = v.clone(n.db_objects[n.cursor_pos]);
                n.projectionFn && (r = n.projectionFn(r)), n._transform && (r = n._transform(r)), e.call(t, r, n.cursor_pos, n), ++n.cursor_pos
            }
        }, e.Cursor.prototype.getTransform = function () {
            return this._transform
        }, e.Cursor.prototype.map = function (e, t) {
            var n = this, r = [];
            return n.forEach(function (o, i) {
                r.push(e.call(t, o, i, n))
            }), r
        }, e.Cursor.prototype.fetch = function () {
            var e = this, t = [];
            return e.forEach(function (e) {
                t.push(e)
            }), t
        }, e.Cursor.prototype.count = function () {
            var e = this;
            return e.reactive && e._depend({added: !0, removed: !0}, !0), null === e.db_objects && (e.db_objects = e._getRawObjects({ordered: !0})), e.db_objects.length
        }, e.Cursor.prototype._publishCursor = function (e) {
            var t = this;
            if (!t.collection.name)throw new Error("Can't publish a cursor from a collection without a name.");
            var n = t.collection.name;
            return h.Collection._publishCursor(t, e, n)
        }, e._observeChangesCallbacksAreOrdered = function (e) {
            if (e.added && e.addedBefore)throw new Error("Please specify only one of added() and addedBefore()");
            return!(!e.addedBefore && !e.movedBefore)
        }, e._observeCallbacksAreOrdered = function (e) {
            if (e.addedAt && e.added)throw new Error("Please specify only one of added() and addedAt()");
            if (e.changedAt && e.changed)throw new Error("Please specify only one of changed() and changedAt()");
            if (e.removed && e.removedAt)throw new Error("Please specify only one of removed() and removedAt()");
            return!!(e.addedAt || e.movedTo || e.changedAt || e.removedAt)
        }, e.ObserveHandle = function () {
        }, g.extend(e.Cursor.prototype, {observe: function (t) {
            var n = this;
            return e._observeFromObserveChanges(n, t)
        }, observeChanges: function (t) {
            var n = this, r = e._observeChangesCallbacksAreOrdered(t);
            if (!t._allow_unordered && !r && (n.skip || n.limit))throw new Error("must use ordered observe with skip or limit");
            if (n.fields && (0 === n.fields._id || n.fields._id === !1))throw Error("You may not observe a cursor with {fields: {_id: 0}}");
            var o, i = {matcher: n.matcher, sorter: r && n.sorter, distances: n.matcher.hasGeoQuery() && r && new e._IdMap, resultsSnapshot: null, ordered: r, cursor: n, projectionFn: n.projectionFn};
            n.reactive && (o = n.collection.next_qid++, n.collection.queries[o] = i), i.results = n._getRawObjects({ordered: r, distances: i.distances}), n.collection.paused && (i.resultsSnapshot = r ? [] : new e._IdMap);
            var a = function (e, t, r) {
                return e ? function () {
                    var o = this, i = arguments;
                    n.collection.paused || void 0 !== t && n.projectionFn && (i[t] = n.projectionFn(i[t]), r && g.isEmpty(i[t])) || n.collection._observeQueue.queueTask(function () {
                        e.apply(o, i)
                    })
                } : function () {
                }
            };
            if (i.added = a(t.added, 1), i.changed = a(t.changed, 1, !0), i.removed = a(t.removed), r && (i.addedBefore = a(t.addedBefore, 1), i.movedBefore = a(t.movedBefore)), !t._suppress_initial && !n.collection.paused) {
                var s = r ? g.bind(g.each, null, i.results) : g.bind(i.results.forEach, i.results);
                s(function (e) {
                    var t = v.clone(e);
                    delete t._id, r && i.addedBefore(e._id, t, null), i.added(e._id, t)
                })
            }
            var u = new e.ObserveHandle;
            return g.extend(u, {collection: n.collection, stop: function () {
                n.reactive && delete n.collection.queries[o]
            }}), n.reactive && _.active && _.onInvalidate(function () {
                u.stop()
            }), n.collection._observeQueue.drain(), u
        }}), e.Cursor.prototype._getRawObjects = function (t) {
            var n = this;
            t = t || {};
            var r = t.ordered ? [] : new e._IdMap;
            if (void 0 !== n._selectorId) {
                if (n.skip)return r;
                var o = n.collection._docs.get(n._selectorId);
                return o && (t.ordered ? r.push(o) : r.set(n._selectorId, o)), r
            }
            var i;
            if (n.matcher.hasGeoQuery() && t.ordered && (t.distances ? (i = t.distances, i.clear()) : i = new e._IdMap), n.collection._docs.forEach(function (e, o) {
                var a = n.matcher.documentMatches(e);
                return a.result && (t.ordered ? (r.push(e), i && void 0 !== a.distance && i.set(o, a.distance)) : r.set(o, e)), !n.limit || n.skip || n.sorter || r.length !== n.limit ? !0 : !1
            }), !t.ordered)return r;
            if (n.sorter) {
                var a = n.sorter.getComparator({distances: i});
                r.sort(a)
            }
            var s = n.skip || 0, u = n.limit ? n.limit + s : r.length;
            return r.slice(s, u)
        }, e.Cursor.prototype._depend = function (e, t) {
            var n = this;
            if (_.active) {
                var r = new _.Dependency;
                r.depend();
                var o = g.bind(r.changed, r), i = {_suppress_initial: !0, _allow_unordered: t};
                g.each(["added", "changed", "removed", "addedBefore", "movedBefore"], function (t) {
                    e[t] && (i[t] = o)
                }), n.observeChanges(i)
            }
        }, e.prototype.insert = function (t, n) {
            var o = this;
            t = v.clone(t), g.has(t, "_id") || (t._id = e._useOID ? new e._ObjectID : b.id());
            var i = t._id;
            if (o._docs.has(i))throw r("Duplicate _id '" + i + "'");
            o._saveOriginal(i, void 0), o._docs.set(i, t);
            var a = [];
            for (var s in o.queries) {
                var u = o.queries[s], c = u.matcher.documentMatches(t);
                c.result && (u.distances && void 0 !== c.distance && u.distances.set(i, c.distance), u.cursor.skip || u.cursor.limit ? a.push(s) : e._insertInResults(u, t))
            }
            return g.each(a, function (t) {
                o.queries[t] && e._recomputeResults(o.queries[t])
            }), o._observeQueue.drain(), n && h.defer(function () {
                n(null, i)
            }), i
        }, e.prototype._eachPossiblyMatchingDoc = function (t, n) {
            var r = this, o = e._idsMatchedBySelector(t);
            if (o)for (var i = 0; i < o.length; ++i) {
                var a = o[i], s = r._docs.get(a);
                if (s) {
                    var u = n(s, a);
                    if (u === !1)break
                }
            } else r._docs.forEach(n)
        }, e.prototype.remove = function (n, r) {
            var o = this;
            if (o.paused && !o._savedOriginals && v.equals(n, {})) {
                var i = o._docs.size();
                return o._docs.clear(), g.each(o.queries, function (e) {
                    e.ordered ? e.results = [] : e.results.clear()
                }), r && h.defer(function () {
                    r(null, i)
                }), i
            }
            var a = new t.Matcher(n, o), s = [];
            o._eachPossiblyMatchingDoc(n, function (e, t) {
                a.documentMatches(e).result && s.push(t)
            });
            for (var u = [], c = [], l = 0; l < s.length; l++) {
                var f = s[l], d = o._docs.get(f);
                g.each(o.queries, function (e, t) {
                    e.matcher.documentMatches(d).result && (e.cursor.skip || e.cursor.limit ? u.push(t) : c.push({qid: t, doc: d}))
                }), o._saveOriginal(f, d), o._docs.remove(f)
            }
            return g.each(c, function (t) {
                var n = o.queries[t.qid];
                n && (n.distances && n.distances.remove(t.doc._id), e._removeFromResults(n, t.doc))
            }), g.each(u, function (t) {
                var n = o.queries[t];
                n && e._recomputeResults(n)
            }), o._observeQueue.drain(), i = s.length, r && h.defer(function () {
                r(null, i)
            }), i
        }, e.prototype.update = function (n, r, o, i) {
            var a = this;
            !i && o instanceof Function && (i = o, o = null), o || (o = {});
            var s = new t.Matcher(n, a), u = {};
            g.each(a.queries, function (e, t) {
                !e.cursor.skip && !e.cursor.limit || e.paused || (u[t] = v.clone(e.results))
            });
            var c = {}, l = 0;
            a._eachPossiblyMatchingDoc(n, function (e, t) {
                var n = s.documentMatches(e);
                return n.result && (a._saveOriginal(t, e), a._modifyAndNotify(e, r, c, n.arrayIndex), ++l, !o.multi) ? !1 : !0
            }), g.each(c, function (t, n) {
                var r = a.queries[n];
                r && e._recomputeResults(r, u[n])
            }), a._observeQueue.drain();
            var f;
            if (0 === l && o.upsert) {
                var d = e._removeDollarOperators(n);
                e._modify(d, r, {isInsert: !0}), !d._id && o.insertedId && (d._id = o.insertedId), f = a.insert(d), l = 1
            }
            var p;
            return o._returnObject ? (p = {numberAffected: l}, void 0 !== f && (p.insertedId = f)) : p = l, i && h.defer(function () {
                i(null, p)
            }), p
        }, e.prototype.upsert = function (e, t, n, r) {
            var o = this;
            return r || "function" != typeof n || (r = n, n = {}), o.update(e, t, g.extend({}, n, {upsert: !0, _returnObject: !0}), r)
        }, e.prototype._modifyAndNotify = function (t, n, r, o) {
            var i = this, a = {};
            for (var s in i.queries) {
                var u = i.queries[s];
                a[s] = u.ordered ? u.matcher.documentMatches(t).result : u.results.has(t._id)
            }
            var c = v.clone(t);
            e._modify(t, n, {arrayIndex: o});
            for (s in i.queries) {
                u = i.queries[s];
                var l = a[s], f = u.matcher.documentMatches(t), d = f.result;
                d && u.distances && void 0 !== f.distance && u.distances.set(t._id, f.distance), u.cursor.skip || u.cursor.limit ? (l || d) && (r[s] = !0) : l && !d ? e._removeFromResults(u, t) : !l && d ? e._insertInResults(u, t) : l && d && e._updateInResults(u, t, c)
            }
        }, e._insertInResults = function (t, n) {
            var r = v.clone(n);
            if (delete r._id, t.ordered) {
                if (t.sorter) {
                    var o = e._insertInSortedList(t.sorter.getComparator({distances: t.distances}), t.results, n), i = t.results[o + 1];
                    i = i ? i._id : null, t.addedBefore(n._id, r, i)
                } else t.addedBefore(n._id, r, null), t.results.push(n);
                t.added(n._id, r)
            } else t.added(n._id, r), t.results.set(n._id, n)
        }, e._removeFromResults = function (t, n) {
            if (t.ordered) {
                var r = e._findInOrderedResults(t, n);
                t.removed(n._id), t.results.splice(r, 1)
            } else {
                var o = n._id;
                t.removed(n._id), t.results.remove(o)
            }
        }, e._updateInResults = function (t, n, r) {
            if (!v.equals(n._id, r._id))throw new Error("Can't change a doc's _id while updating");
            var o = e._makeChangedFields(n, r);
            if (!t.ordered)return g.isEmpty(o) || (t.changed(n._id, o), t.results.set(n._id, n)), void 0;
            var i = e._findInOrderedResults(t, n);
            if (g.isEmpty(o) || t.changed(n._id, o), t.sorter) {
                t.results.splice(i, 1);
                var a = e._insertInSortedList(t.sorter.getComparator({distances: t.distances}), t.results, n);
                if (i !== a) {
                    var s = t.results[a + 1];
                    s = s ? s._id : null, t.movedBefore && t.movedBefore(n._id, s)
                }
            }
        }, e._recomputeResults = function (t, n) {
            n || (n = t.results), t.distances && t.distances.clear(), t.results = t.cursor._getRawObjects({ordered: t.ordered, distances: t.distances}), t.paused || e._diffQueryChanges(t.ordered, n, t.results, t)
        }, e._findInOrderedResults = function (e, t) {
            if (!e.ordered)throw new Error("Can't call _findInOrderedResults on unordered query");
            for (var n = 0; n < e.results.length; n++)if (e.results[n] === t)return n;
            throw Error("object missing from query")
        }, e._binarySearch = function (e, t, n) {
            for (var r = 0, o = t.length; o > 0;) {
                var i = Math.floor(o / 2);
                e(n, t[r + i]) >= 0 ? (r += i + 1, o -= i + 1) : o = i
            }
            return r
        }, e._insertInSortedList = function (t, n, r) {
            if (0 === n.length)return n.push(r), 0;
            var o = e._binarySearch(t, n, r);
            return n.splice(o, 0, r), o
        }, e.prototype.saveOriginals = function () {
            var t = this;
            if (t._savedOriginals)throw new Error("Called saveOriginals twice without retrieveOriginals");
            t._savedOriginals = new e._IdMap
        }, e.prototype.retrieveOriginals = function () {
            var e = this;
            if (!e._savedOriginals)throw new Error("Called retrieveOriginals without saveOriginals");
            var t = e._savedOriginals;
            return e._savedOriginals = null, t
        }, e.prototype._saveOriginal = function (e, t) {
            var n = this;
            n._savedOriginals && (n._savedOriginals.has(e) || n._savedOriginals.set(e, v.clone(t)))
        }, e.prototype.pauseObservers = function () {
            if (!this.paused) {
                this.paused = !0;
                for (var e in this.queries) {
                    var t = this.queries[e];
                    t.resultsSnapshot = v.clone(t.results)
                }
            }
        }, e.prototype.resumeObservers = function () {
            var t = this;
            if (this.paused) {
                this.paused = !1;
                for (var n in this.queries) {
                    var r = t.queries[n];
                    e._diffQueryChanges(r.ordered, r.resultsSnapshot, r.results, r), r.resultsSnapshot = null
                }
                t._observeQueue.drain()
            }
        }, e._idStringify = function (t) {
            if (t instanceof e._ObjectID)return t.valueOf();
            if ("string" == typeof t)return"" === t ? t : "-" === t.substr(0, 1) || "~" === t.substr(0, 1) || e._looksLikeObjectID(t) || "{" === t.substr(0, 1) ? "-" + t : t;
            if (void 0 === t)return"-";
            if ("object" == typeof t && null !== t)throw new Error("Meteor does not currently support objects other than ObjectID as ids");
            return"~" + m.stringify(t)
        }, e._idParse = function (t) {
            return"" === t ? t : "-" === t ? void 0 : "-" === t.substr(0, 1) ? t.substr(1) : "~" === t.substr(0, 1) ? m.parse(t.substr(1)) : e._looksLikeObjectID(t) ? new e._ObjectID(t) : t
        }, e._makeChangedFields = function (t, n) {
            var r = {};
            return e._diffObjects(n, t, {leftOnly: function (e) {
                r[e] = void 0
            }, rightOnly: function (e, t) {
                r[e] = t
            }, both: function (e, t, n) {
                v.equals(t, n) || (r[e] = n)
            }}), r
        }
    }).call(this), function () {
        e.wrapTransform = function (e) {
            return e ? function (t) {
                if (!g.has(t, "_id"))throw new Error("can only transform documents with _id");
                var n = t._id, r = _.nonreactive(function () {
                    return e(t)
                });
                if (!i(r))throw new Error("transform must return object");
                if (g.has(r, "_id")) {
                    if (!v.equals(r._id, n))throw new Error("transformed document can't have different _id")
                } else r._id = n;
                return r
            } : null
        }
    }.call(this), function () {
        o = function (e) {
            return g.isArray(e) && !v.isBinary(e)
        }, i = function (t) {
            return t && 3 === e._f._type(t)
        }, a = function (e) {
            return o(e) || i(e)
        }, s = function (e) {
            if (!i(e))return!1;
            var t = void 0;
            return g.each(e, function (n, r) {
                var o = "$" === r.substr(0, 1);
                if (void 0 === t)t = o; else if (t !== o)throw new Error("Inconsistent operator: " + e)
            }), !!t
        }, u = function (e) {
            return/^[0-9]+$/.test(e)
        }
    }.call(this), function () {
        t.Matcher = function (e) {
            var t = this;
            t._paths = {}, t._hasGeoQuery = !1, t._hasWhere = !1, t._isSimple = !0, t._matchingDocument = void 0, t._selector = null, t._docMatcher = t._compileSelector(e)
        }, g.extend(t.Matcher.prototype, {documentMatches: function (e) {
            return this._docMatcher(e)
        }, hasGeoQuery: function () {
            return this._hasGeoQuery
        }, hasWhere: function () {
            return this._hasWhere
        }, isSimple: function () {
            return this._isSimple
        }, _compileSelector: function (t) {
            var n = this;
            if (t instanceof Function)return n._isSimple = !1, n._selector = t, n._recordPathUsed(""), function (e) {
                return{result: !!t.call(e)}
            };
            if (e._selectorIsId(t))return n._selector = {_id: t}, n._recordPathUsed("_id"), function (e) {
                return{result: v.equals(e._id, t)}
            };
            if (!t || "_id"in t && !t._id)return n._isSimple = !1, S;
            if ("boolean" == typeof t || o(t) || v.isBinary(t))throw new Error("Invalid selector: " + t);
            return n._selector = v.clone(t), r(t, n, {isRoot: !0})
        }, _recordPathUsed: function (e) {
            this._paths[e] = !0
        }, _getPaths: function () {
            return g.keys(this._paths)
        }});
        var r = function (e, t, n) {
            n = n || {};
            var r = [];
            return g.each(e, function (e, o) {
                if ("$" === o.substr(0, 1)) {
                    if (!g.has(_, o))throw new Error("Unrecognized logical operator: " + o);
                    t._isSimple = !1, r.push(_[o](e, t, n.inElemMatch))
                } else {
                    n.inElemMatch || t._recordPathUsed(o);
                    var i = c(o), a = f(e, t, n.isRoot);
                    r.push(function (e) {
                        var t = i(e);
                        return a(t)
                    })
                }
            }), A(r)
        }, f = function (e, t, n) {
            return e instanceof RegExp ? (t._isSimple = !1, d(p(e))) : s(e) ? m(e, t, n) : d(h(e))
        }, d = function (e, t) {
            return t = t || {}, function (n) {
                var r = n;
                t.dontExpandLeafArrays || (r = l(n, t.dontIncludeLeafArrays));
                var o = {};
                return o.result = g.any(r, function (t) {
                    var n = e(t.value);
                    return"number" == typeof n && (void 0 === t.arrayIndex && (t.arrayIndex = n), n = !0), n && void 0 !== t.arrayIndex && (o.arrayIndex = t.arrayIndex), n
                }), o
            }
        }, p = function (e) {
            return function (t) {
                return t instanceof RegExp ? g.isEqual(t, e) : "string" != typeof t ? !1 : e.test(t)
            }
        }, h = function (t) {
            if (s(t))throw Error("Can't create equalityValueSelector for operator object");
            return null == t ? function (e) {
                return null == e
            } : function (n) {
                return e._f._equal(t, n)
            }
        }, m = function (e, t, n) {
            var r = [];
            return g.each(e, function (o, i) {
                var a = g.contains(["$lt", "$lte", "$gt", "$gte"], i) && g.isNumber(o), s = "$ne" === i && !g.isObject(o), u = g.contains(["$in", "$nin"], i) && g.isArray(o) && !g.any(o, g.isObject);
                if ("$eq" === i || a || u || s || (t._isSimple = !1), g.has(x, i))r.push(x[i](o, e, t, n)); else {
                    if (!g.has(C, i))throw new Error("Unrecognized operator: " + i);
                    var c = C[i];
                    "function" == typeof c && (c = {compileElementSelector: c}), r.push(d(c.compileElementSelector(o, e, t), c))
                }
            }), M(r)
        }, y = function (e, t, n) {
            if (!o(e) || g.isEmpty(e))throw Error("$and/$or/$nor must be nonempty array");
            return g.map(e, function (e) {
                if (!i(e))throw Error("$or/$and/$nor entries need to be full objects");
                return r(e, t, {inElemMatch: n})
            })
        }, _ = {$and: function (e, t, n) {
            var r = y(e, t, n);
            return A(r)
        }, $or: function (e, t, n) {
            var r = y(e, t, n);
            return 1 === r.length ? r[0] : function (e) {
                var t = g.any(r, function (t) {
                    return t(e).result
                });
                return{result: t}
            }
        }, $nor: function (e, t, n) {
            var r = y(e, t, n);
            return function (e) {
                var t = g.all(r, function (t) {
                    return!t(e).result
                });
                return{result: t}
            }
        }, $where: function (e, t) {
            return t._recordPathUsed(""), t._hasWhere = !0, e instanceof Function || (e = Function("obj", "return " + e)), function (t) {
                return{result: e.call(t, t)}
            }
        }, $comment: function () {
            return function () {
                return{result: !0}
            }
        }}, b = function (e) {
            return function (t) {
                var n = e(t);
                return{result: !n.result}
            }
        }, x = {$not: function (e, t, n) {
            return b(f(e, n))
        }, $ne: function (e) {
            return b(d(h(e)))
        }, $nin: function (e) {
            return b(d(C.$in(e)))
        }, $exists: function (e) {
            var t = d(function (e) {
                return void 0 !== e
            });
            return e ? t : b(t)
        }, $options: function (e, t) {
            if (!t.$regex)throw Error("$options needs a $regex");
            return O
        }, $maxDistance: function (e, t) {
            if (!t.$near)throw Error("$maxDistance needs a $near");
            return O
        }, $all: function (e, t, n) {
            if (!o(e))throw Error("$all requires array");
            if (g.isEmpty(e))return S;
            var r = [];
            return g.each(e, function (e) {
                if (s(e))throw Error("no $ expressions in $all");
                r.push(f(e, n))
            }), M(r)
        }, $near: function (e, t, n, r) {
            if (!r)throw Error("$near can't be inside another $ operator");
            n._hasGeoQuery = !0;
            var a, s, u;
            if (i(e) && g.has(e, "$geometry"))a = e.$maxDistance, s = e.$geometry, u = function (e) {
                return e && e.type ? "Point" === e.type ? w.pointDistance(s, e) : w.geometryWithinRadius(e, s, a) ? 0 : a + 1 : null
            }; else {
                if (a = t.$maxDistance, !o(e) && !i(e))throw Error("$near argument must be coordinate pair or GeoJSON");
                s = E(e), u = function (e) {
                    return o(e) || i(e) ? k(s, e) : null
                }
            }
            return function (e) {
                e = l(e);
                var t = {result: !1};
                return g.each(e, function (e) {
                    var n = u(e.value);
                    null === n || n > a || void 0 !== t.distance && t.distance <= n || (t.result = !0, t.distance = n, void 0 === e.arrayIndex ? delete t.arrayIndex : t.arrayIndex = e.arrayIndex)
                }), t
            }
        }}, k = function (e, t) {
            e = E(e), t = E(t);
            var n = e[0] - t[0], r = e[1] - t[1];
            return g.isNaN(n) || g.isNaN(r) ? null : Math.sqrt(n * n + r * r)
        }, E = function (e) {
            return g.map(e, g.identity)
        }, T = function (t) {
            return function (n) {
                if (o(n))return function () {
                    return!1
                };
                void 0 === n && (n = null);
                var r = e._f._type(n);
                return function (o) {
                    return void 0 === o && (o = null), e._f._type(o) !== r ? !1 : t(e._f._cmp(o, n))
                }
            }
        }, C = {$lt: T(function (e) {
            return 0 > e
        }), $gt: T(function (e) {
            return e > 0
        }), $lte: T(function (e) {
            return 0 >= e
        }), $gte: T(function (e) {
            return e >= 0
        }), $mod: function (e) {
            if (!o(e) || 2 !== e.length || "number" != typeof e[0] || "number" != typeof e[1])throw Error("argument to $mod must be an array of two numbers");
            var t = e[0], n = e[1];
            return function (e) {
                return"number" == typeof e && e % t === n
            }
        }, $in: function (e) {
            if (!o(e))throw Error("$in needs an array");
            var t = [];
            return g.each(e, function (e) {
                if (e instanceof RegExp)t.push(p(e)); else {
                    if (s(e))throw Error("cannot nest $ under $in");
                    t.push(h(e))
                }
            }), function (e) {
                return void 0 === e && (e = null), g.any(t, function (t) {
                    return t(e)
                })
            }
        }, $size: {dontExpandLeafArrays: !0, compileElementSelector: function (e) {
            if ("string" == typeof e)e = 0; else if ("number" != typeof e)throw Error("$size needs a number");
            return function (t) {
                return o(t) && t.length === e
            }
        }}, $type: {dontIncludeLeafArrays: !0, compileElementSelector: function (t) {
            if ("number" != typeof t)throw Error("$type needs a number");
            return function (n) {
                return void 0 !== n && e._f._type(n) === t
            }
        }}, $regex: function (e, t) {
            if (!("string" == typeof e || e instanceof RegExp))throw Error("$regex has to be a string or RegExp");
            var n;
            if (void 0 !== t.$options) {
                if (/[^gim]/.test(t.$options))throw new Error("Only the i, m, and g regexp options are supported");
                var r = e instanceof RegExp ? e.source : e;
                n = new RegExp(r, t.$options)
            } else n = e instanceof RegExp ? e : new RegExp(e);
            return p(n)
        }, $elemMatch: {dontExpandLeafArrays: !0, compileElementSelector: function (e, t, n) {
            if (!i(e))throw Error("$elemMatch need an object");
            var a, u;
            return s(e) ? (a = f(e, n), u = !1) : (a = r(e, n, {inElemMatch: !0}), u = !0), function (e) {
                if (!o(e))return!1;
                for (var t = 0; t < e.length; ++t) {
                    var n, r = e[t];
                    if (u) {
                        if (!i(r) && !o(r))return!1;
                        n = r
                    } else n = [
                        {value: r, dontIterate: !0}
                    ];
                    if (a(n).result)return t
                }
                return!1
            }
        }}};
        c = function (e) {
            var t, n = e.split("."), r = n.length ? n[0] : "", s = u(r);
            n.length > 1 && (t = c(n.slice(1).join(".")));
            var l = function (e) {
                return e.dontIterate || delete e.dontIterate, void 0 === e.arrayIndex && delete e.arrayIndex, e
            };
            return function (e, n) {
                if (o(e)) {
                    if (!(s && r < e.length))return[];
                    void 0 === n && (n = +r)
                }
                var u = e[r];
                if (!t)return[l({value: u, dontIterate: o(e) && o(u), arrayIndex: n})];
                if (!a(u))return o(e) ? [] : [l({value: void 0, arrayIndex: n})];
                var c = [], f = function (e) {
                    Array.prototype.push.apply(c, e)
                };
                return f(t(u, n)), o(u) && g.each(u, function (e, r) {
                    i(e) && f(t(e, void 0 === n ? r : n))
                }), c
            }
        }, n.makeLookupFunction = c, l = function (e, t) {
            var n = [];
            return g.each(e, function (e) {
                var r = o(e.value);
                t && r && !e.dontIterate || n.push({value: e.value, arrayIndex: e.arrayIndex}), r && !e.dontIterate && g.each(e.value, function (t, r) {
                    n.push({value: t, arrayIndex: void 0 === e.arrayIndex ? r : e.arrayIndex})
                })
            }), n
        };
        var S = function () {
            return{result: !1}
        }, O = function () {
            return{result: !0}
        }, N = function (e) {
            return 0 === e.length ? O : 1 === e.length ? e[0] : function (t) {
                var n = {};
                return n.result = g.all(e, function (e) {
                    var r = e(t);
                    return r.result && void 0 !== r.distance && void 0 === n.distance && (n.distance = r.distance), r.result && void 0 !== r.arrayIndex && (n.arrayIndex = r.arrayIndex), r.result
                }), n.result || (delete n.distance, delete n.arrayIndex), n
            }
        }, A = N, M = N;
        e._f = {_type: function (t) {
            return"number" == typeof t ? 1 : "string" == typeof t ? 2 : "boolean" == typeof t ? 8 : o(t) ? 4 : null === t ? 10 : t instanceof RegExp ? 11 : "function" == typeof t ? 13 : t instanceof Date ? 9 : v.isBinary(t) ? 5 : t instanceof e._ObjectID ? 7 : 3
        }, _equal: function (e, t) {
            return v.equals(e, t, {keyOrderSensitive: !0})
        }, _typeorder: function (e) {
            return[-1, 1, 2, 3, 4, 5, -1, 6, 7, 8, 0, 9, -1, 100, 2, 100, 1, 8, 1][e]
        }, _cmp: function (t, n) {
            if (void 0 === t)return void 0 === n ? 0 : -1;
            if (void 0 === n)return 1;
            var r = e._f._type(t), o = e._f._type(n), i = e._f._typeorder(r), a = e._f._typeorder(o);
            if (i !== a)return a > i ? -1 : 1;
            if (r !== o)throw Error("Missing type coercion logic in _cmp");
            if (7 === r && (r = o = 2, t = t.toHexString(), n = n.toHexString()), 9 === r && (r = o = 1, t = t.getTime(), n = n.getTime()), 1 === r)return t - n;
            if (2 === o)return n > t ? -1 : t === n ? 0 : 1;
            if (3 === r) {
                var s = function (e) {
                    var t = [];
                    for (var n in e)t.push(n), t.push(e[n]);
                    return t
                };
                return e._f._cmp(s(t), s(n))
            }
            if (4 === r)for (var u = 0; ; u++) {
                if (u === t.length)return u === n.length ? 0 : -1;
                if (u === n.length)return 1;
                var c = e._f._cmp(t[u], n[u]);
                if (0 !== c)return c
            }
            if (5 === r) {
                if (t.length !== n.length)return t.length - n.length;
                for (u = 0; u < t.length; u++) {
                    if (t[u] < n[u])return-1;
                    if (t[u] > n[u])return 1
                }
                return 0
            }
            if (8 === r)return t ? n ? 0 : 1 : n ? -1 : 0;
            if (10 === r)return 0;
            if (11 === r)throw Error("Sorting not supported on regular expression");
            if (13 === r)throw Error("Sorting not supported on Javascript code");
            throw Error("Unknown type to sort")
        }}, e._removeDollarOperators = function (e) {
            var t = {};
            for (var n in e)"$" !== n.substr(0, 1) && (t[n] = e[n]);
            return t
        }
    }.call(this), function () {
        f = function (n) {
            var r = this, o = [];
            if (n instanceof Array)for (var i = 0; i < n.length; i++)"string" == typeof n[i] ? o.push({lookup: c(n[i]), ascending: !0}) : o.push({lookup: c(n[i][0]), ascending: "desc" !== n[i][1]}); else {
                if ("object" != typeof n)throw Error("Bad sort specification: ", m.stringify(n));
                for (var a in n)o.push({lookup: c(a), ascending: n[a] >= 0})
            }
            var s = function (t, n) {
                t = l(t, !0);
                var r = void 0, o = !0;
                return g.each(t, function (t) {
                    if (o)r = t.value, o = !1; else {
                        var i = e._f._cmp(r, t.value);
                        (n && i > 0 || !n && 0 > i) && (r = t.value)
                    }
                }), r
            }, u = g.map(o, function (t) {
                return function (n, r) {
                    var o = s(t.lookup(n), t.ascending), i = s(t.lookup(r), t.ascending), a = e._f._cmp(o, i);
                    return t.ascending ? a : -a
                }
            });
            r._baseComparator = t(u)
        }, f.prototype.getComparator = function (e) {
            var n = this;
            if (!e || !e.distances)return n._baseComparator;
            var r = e.distances;
            return t([n._baseComparator, function (e, t) {
                if (!r.has(e._id))throw Error("Missing distance for " + e._id);
                if (!r.has(t._id))throw Error("Missing distance for " + t._id);
                return r.get(e._id) - r.get(t._id)
            }])
        }, n.Sorter = f;
        var t = function (e) {
            return function (t, n) {
                for (var r = 0; r < e.length; ++r) {
                    var o = e[r](t, n);
                    if (0 !== o)return o
                }
                return 0
            }
        }
    }.call(this), function () {
        e._compileProjection = function (t) {
            e._checkSupportedProjection(t);
            var n = g.isUndefined(t._id) ? !0 : t._id, r = d(t), o = function (e, t) {
                if (g.isArray(e))return g.map(e, function (e) {
                    return o(e, t)
                });
                var n = r.including ? {} : v.clone(e);
                return g.each(t, function (t, i) {
                    g.has(e, i) && (g.isObject(t) ? g.isObject(e[i]) && (n[i] = o(e[i], t)) : r.including ? n[i] = v.clone(e[i]) : delete n[i])
                }), n
            };
            return function (e) {
                var t = o(e, r.tree);
                return n && g.has(e, "_id") && (t._id = e._id), !n && g.has(t, "_id") && delete t._id, t
            }
        }, d = function (e) {
            var t = g.keys(e).sort();
            t.length > 0 && (1 !== t.length || "_id" !== t[0]) && (t = g.reject(t, function (e) {
                return"_id" === e
            }));
            var n = null;
            g.each(t, function (t) {
                var o = !!e[t];
                if (null === n && (n = o), n !== o)throw r("You cannot currently mix including and excluding fields.")
            });
            var o = p(t, function () {
                return n
            }, function (e, t, n) {
                var o = n, i = t;
                throw r("both " + o + " and " + i + " found in fields option, using both of them may trigger unexpected behavior. Did you mean to use only one of them?")
            });
            return{tree: o, including: n}
        }, p = function (e, t, n, r) {
            return r = r || {}, g.each(e, function (e) {
                var o = r, i = e.split("."), a = g.all(i.slice(0, -1), function (t, r) {
                    if (g.has(o, t)) {
                        if (!g.isObject(o[t]) && (o[t] = n(o[t], i.slice(0, r + 1).join("."), e), !g.isObject(o[t])))return!1
                    } else o[t] = {};
                    return o = o[t], !0
                });
                if (a) {
                    var s = g.last(i);
                    o[s] = g.has(o, s) ? n(o[s], e, e) : t(e)
                }
            }), r
        }, e._checkSupportedProjection = function (e) {
            if (!g.isObject(e) || g.isArray(e))throw r("fields option must be an object");
            g.each(e, function (e, t) {
                if (g.contains(t.split("."), "$"))throw r("Minimongo doesn't support $ operator in projections yet.");
                if (-1 === g.indexOf([1, 0, !0, !1], e))throw r("Projection values should be one of 1, 0, true, or false")
            })
        }
    }.call(this), function () {
        e._modify = function (e, t, a) {
            if (a = a || {}, !i(t))throw r("Modifier must be an object");
            var u, l = s(t);
            if (l)u = v.clone(e), g.each(t, function (e, t) {
                var i = c[t];
                if (a.isInsert && "$setOnInsert" === t && (i = c.$set), !i)throw r("Invalid modifier specified " + t);
                g.each(e, function (e, s) {
                    if (s.length && "." === s[s.length - 1])throw r("Invalid mod field name, may not end in a period");
                    var c = s.split("."), l = (g.has(o, t), n(u, c, {noCreate: o[t], forbidArray: "$rename" === t, arrayIndex: a.arrayIndex})), f = c.pop();
                    i(l, f, e, s, u)
                })
            }); else {
                if (t._id && !v.equals(e._id, t._id))throw r("Cannot change the _id of a document");
                for (var f in t)if (/\./.test(f))throw r("When replacing document, field name may not contain '.'");
                u = t
            }
            g.each(g.keys(e), function (t) {
                ("_id" !== t || a.isInsert) && delete e[t]
            }), g.each(u, function (t, n) {
                e[n] = t
            })
        };
        var n = function (e, t, n) {
            n = n || {};
            for (var o = !1, i = 0; i < t.length; i++) {
                var s = i === t.length - 1, c = t[i], l = a(e);
                if (!l) {
                    if (n.noCreate)return void 0;
                    var f = r("cannot use the part '" + c + "' to traverse " + e);
                    throw f.setPropertyError = !0, f
                }
                if (e instanceof Array) {
                    if (n.forbidArray)return null;
                    if ("$" === c) {
                        if (o)throw r("Too many positional (i.e. '$') elements");
                        if (void 0 === n.arrayIndex)throw r("The positional operator did not find the match needed from the query");
                        c = n.arrayIndex, o = !0
                    } else {
                        if (!u(c)) {
                            if (n.noCreate)return void 0;
                            throw r("can't append to array using string field name [" + c + "]")
                        }
                        c = parseInt(c)
                    }
                    if (s && (t[i] = c), n.noCreate && c >= e.length)return void 0;
                    for (; e.length < c;)e.push(null);
                    if (!s)if (e.length === c)e.push({}); else if ("object" != typeof e[c])throw r("can't modify field '" + t[i + 1] + "' of list value " + m.stringify(e[c]))
                } else {
                    if (c.length && "$" === c.substr(0, 1))throw r("can't set field named " + c);
                    if (!(c in e)) {
                        if (n.noCreate)return void 0;
                        s || (e[c] = {})
                    }
                }
                if (s)return e;
                e = e[c]
            }
        }, o = {$unset: !0, $pop: !0, $rename: !0, $pull: !0, $pullAll: !0}, c = {$inc: function (e, t, n) {
            if ("number" != typeof n)throw r("Modifier $inc allowed for numbers only");
            if (t in e) {
                if ("number" != typeof e[t])throw r("Cannot apply $inc modifier to non-number");
                e[t] += n
            } else e[t] = n
        }, $set: function (e, t, n) {
            if (!g.isObject(e)) {
                var o = r("Cannot set property on non-object field");
                throw o.setPropertyError = !0, o
            }
            if (null === e) {
                var o = r("Cannot set property on null");
                throw o.setPropertyError = !0, o
            }
            if ("_id" === t && !v.equals(n, e._id))throw r("Cannot change the _id of a document");
            e[t] = v.clone(n)
        }, $setOnInsert: function () {
        }, $unset: function (e, t) {
            void 0 !== e && (e instanceof Array ? t in e && (e[t] = null) : delete e[t])
        }, $push: function (t, n, o) {
            if (void 0 === t[n] && (t[n] = []), !(t[n]instanceof Array))throw r("Cannot apply $push modifier to non-array");
            if (!o || !o.$each)return t[n].push(v.clone(o)), void 0;
            var i = o.$each;
            if (!(i instanceof Array))throw r("$each must be an array");
            var a = void 0;
            if ("$slice"in o) {
                if ("number" != typeof o.$slice)throw r("$slice must be a numeric value");
                if (o.$slice > 0)throw r("$slice in $push must be zero or negative");
                a = o.$slice
            }
            var s = void 0;
            if (o.$sort) {
                if (void 0 === a)throw r("$sort requires $slice to be present");
                s = new f(o.$sort).getComparator();
                for (var u = 0; u < i.length; u++)if (3 !== e._f._type(i[u]))throw r("$push like modifiers using $sort require all elements to be objects")
            }
            for (var c = 0; c < i.length; c++)t[n].push(v.clone(i[c]));
            s && t[n].sort(s), void 0 !== a && (t[n] = 0 === a ? [] : t[n].slice(a))
        }, $pushAll: function (e, t, n) {
            if (!("object" == typeof n && n instanceof Array))throw r("Modifier $pushAll/pullAll allowed for arrays only");
            var o = e[t];
            if (void 0 === o)e[t] = n; else {
                if (!(o instanceof Array))throw r("Cannot apply $pushAll modifier to non-array");
                for (var i = 0; i < n.length; i++)o.push(n[i])
            }
        }, $addToSet: function (t, n, o) {
            var i = t[n];
            if (void 0 === i)t[n] = [o]; else {
                if (!(i instanceof Array))throw r("Cannot apply $addToSet modifier to non-array");
                var a = !1;
                if ("object" == typeof o)for (var s in o) {
                    "$each" === s && (a = !0);
                    break
                }
                var u = a ? o.$each : [o];
                g.each(u, function (t) {
                    for (var n = 0; n < i.length; n++)if (e._f._equal(t, i[n]))return;
                    i.push(v.clone(t))
                })
            }
        }, $pop: function (e, t, n) {
            if (void 0 !== e) {
                var o = e[t];
                if (void 0 !== o) {
                    if (!(o instanceof Array))throw r("Cannot apply $pop modifier to non-array");
                    "number" == typeof n && 0 > n ? o.splice(0, 1) : o.pop()
                }
            }
        }, $pull: function (n, o, i) {
            if (void 0 !== n) {
                var a = n[o];
                if (void 0 !== a) {
                    if (!(a instanceof Array))throw r("Cannot apply $pull/pullAll modifier to non-array");
                    var s = [];
                    if ("object" != typeof i || i instanceof Array)for (var u = 0; u < a.length; u++)e._f._equal(a[u], i) || s.push(a[u]); else for (var c = new t.Matcher(i), u = 0; u < a.length; u++)c.documentMatches(a[u]).result || s.push(a[u]);
                    n[o] = s
                }
            }
        }, $pullAll: function (t, n, o) {
            if (!("object" == typeof o && o instanceof Array))throw r("Modifier $pushAll/pullAll allowed for arrays only");
            if (void 0 !== t) {
                var i = t[n];
                if (void 0 !== i) {
                    if (!(i instanceof Array))throw r("Cannot apply $pull/pullAll modifier to non-array");
                    for (var a = [], s = 0; s < i.length; s++) {
                        for (var u = !1, c = 0; c < o.length; c++)if (e._f._equal(i[s], o[c])) {
                            u = !0;
                            break
                        }
                        u || a.push(i[s])
                    }
                    t[n] = a
                }
            }
        }, $rename: function (e, t, o, i, a) {
            if (i === o)throw r("$rename source must differ from target");
            if (null === e)throw r("$rename source field invalid");
            if ("string" != typeof o)throw r("$rename target must be a string");
            if (void 0 !== e) {
                var s = e[t];
                delete e[t];
                var u = o.split("."), c = n(a, u, {forbidArray: !0});
                if (null === c)throw r("$rename target field invalid");
                var l = u.pop();
                c[l] = s
            }
        }, $bit: function () {
            throw r("$bit is not supported")
        }}
    }.call(this), function () {
        e._diffQueryChanges = function (t, n, r, o) {
            t ? e._diffQueryOrderedChanges(n, r, o) : e._diffQueryUnorderedChanges(n, r, o)
        }, e._diffQueryUnorderedChanges = function (t, n, r) {
            if (r.movedBefore)throw new Error("_diffQueryUnordered called with a movedBefore observer!");
            n.forEach(function (n, o) {
                var i = t.get(o);
                if (i)r.changed && !v.equals(i, n) && r.changed(o, e._makeChangedFields(n, i)); else if (r.added) {
                    var a = v.clone(n);
                    delete a._id, r.added(n._id, a)
                }
            }), r.removed && t.forEach(function (e, t) {
                n.has(t) || r.removed(t)
            })
        }, e._diffQueryOrderedChanges = function (t, n, r) {
            var o = {};
            g.each(n, function (e) {
                o[e._id] && h._debug("Duplicate _id in new_results"), o[e._id] = !0
            });
            var i = {};
            g.each(t, function (e, t) {
                e._id in i && h._debug("Duplicate _id in old_results"), i[e._id] = t
            });
            for (var a = [], s = 0, u = n.length, c = new Array(u), l = new Array(u), f = function (e) {
                return i[n[e]._id]
            }, d = 0; u > d; d++)if (void 0 !== i[n[d]._id]) {
                for (var p = s; p > 0 && !(f(c[p - 1]) < f(d));)p--;
                l[d] = 0 === p ? -1 : c[p - 1], c[p] = d, p + 1 > s && (s = p + 1)
            }
            for (var m = 0 === s ? -1 : c[s - 1]; m >= 0;)a.push(m), m = l[m];
            a.reverse(), a.push(n.length), g.each(t, function (e) {
                o[e._id] || r.removed && r.removed(e._id)
            });
            var y = 0;
            g.each(a, function (o) {
                for (var a, s, u, c = n[o] ? n[o]._id : null, l = y; o > l; l++)s = n[l], g.has(i, s._id) ? (a = t[i[s._id]], u = e._makeChangedFields(s, a), g.isEmpty(u) || r.changed && r.changed(s._id, u), r.movedBefore && r.movedBefore(s._id, c)) : (u = v.clone(s), delete u._id, r.addedBefore && r.addedBefore(s._id, u, c), r.added && r.added(s._id, u));
                c && (s = n[o], a = t[i[s._id]], u = e._makeChangedFields(s, a), g.isEmpty(u) || r.changed && r.changed(s._id, u)), y = o + 1
            })
        }, e._diffObjects = function (e, t, n) {
            g.each(e, function (e, r) {
                g.has(t, r) ? n.both && n.both(r, e, t[r]) : n.leftOnly && n.leftOnly(r, e)
            }), n.rightOnly && g.each(t, function (t, r) {
                g.has(e, r) || n.rightOnly(r, t)
            })
        }
    }.call(this), function () {
        e._IdMap = function () {
            var e = this;
            e._map = {}
        }, g.extend(e._IdMap.prototype, {get: function (t) {
            var n = this, r = e._idStringify(t);
            return n._map[r]
        }, set: function (t, n) {
            var r = this, o = e._idStringify(t);
            r._map[o] = n
        }, remove: function (t) {
            var n = this, r = e._idStringify(t);
            delete n._map[r]
        }, has: function (t) {
            var n = this, r = e._idStringify(t);
            return g.has(n._map, r)
        }, empty: function () {
            var e = this;
            return g.isEmpty(e._map)
        }, clear: function () {
            var e = this;
            e._map = {}
        }, forEach: function (t) {
            for (var n = this, r = g.keys(n._map), o = 0; o < r.length; o++) {
                var i = t.call(null, n._map[r[o]], e._idParse(r[o]));
                if (i === !1)return
            }
        }, size: function () {
            var e = this;
            return g.size(e._map)
        }, setDefault: function (t, n) {
            var r = this, o = e._idStringify(t);
            return g.has(r._map, o) ? r._map[o] : (r._map[o] = n, n)
        }, clone: function () {
            var t = this, n = new e._IdMap;
            return t.forEach(function (e, t) {
                n.set(t, v.clone(e))
            }), n
        }})
    }.call(this), function () {
        e._CachingChangeObserver = function (t) {
            var n = this;
            t = t || {};
            var r = t.callbacks && e._observeChangesCallbacksAreOrdered(t.callbacks);
            if (g.has(t, "ordered")) {
                if (n.ordered = t.ordered, t.callbacks && t.ordered !== r)throw Error("ordered option doesn't match callbacks")
            } else {
                if (!t.callbacks)throw Error("must provide ordered or callbacks");
                n.ordered = r
            }
            var o = t.callbacks || {};
            n.ordered ? (n.docs = new y(e._idStringify), n.applyChange = {addedBefore: function (e, t, r) {
                var i = v.clone(t);
                i._id = e, o.addedBefore && o.addedBefore.call(n, e, t, r), o.added && o.added.call(n, e, t), n.docs.putBefore(e, i, r || null)
            }, movedBefore: function (e, t) {
                n.docs.get(e);
                o.movedBefore && o.movedBefore.call(n, e, t), n.docs.moveBefore(e, t || null)
            }}) : (n.docs = new e._IdMap, n.applyChange = {added: function (e, t) {
                var r = v.clone(t);
                o.added && o.added.call(n, e, t), r._id = e, n.docs.set(e, r)
            }}), n.applyChange.changed = function (t, r) {
                var i = n.docs.get(t);
                if (!i)throw new Error("Unknown id for changed: " + t);
                o.changed && o.changed.call(n, t, v.clone(r)), e._applyChanges(i, r)
            }, n.applyChange.removed = function (e) {
                o.removed && o.removed.call(n, e), n.docs.remove(e)
            }
        }, e._observeFromObserveChanges = function (t, n) {
            var r, o = t.getTransform() || function (e) {
                return e
            }, i = !!n._suppress_initial;
            if (e._observeCallbacksAreOrdered(n)) {
                var a = !n._no_indices;
                r = {addedBefore: function (e, t, r) {
                    var s = this;
                    if (!i && (n.addedAt || n.added)) {
                        var u = o(g.extend(t, {_id: e}));
                        if (n.addedAt) {
                            var c = a ? r ? s.docs.indexOf(r) : s.docs.size() : -1;
                            n.addedAt(u, c, r)
                        } else n.added(u)
                    }
                }, changed: function (t, r) {
                    var i = this;
                    if (n.changedAt || n.changed) {
                        var s = v.clone(i.docs.get(t));
                        if (!s)throw new Error("Unknown id for changed: " + t);
                        var u = o(v.clone(s));
                        if (e._applyChanges(s, r), s = o(s), n.changedAt) {
                            var c = a ? i.docs.indexOf(t) : -1;
                            n.changedAt(s, u, c)
                        } else n.changed(s, u)
                    }
                }, movedBefore: function (e, t) {
                    var r = this;
                    if (n.movedTo) {
                        var i = a ? r.docs.indexOf(e) : -1, s = a ? t ? r.docs.indexOf(t) : r.docs.size() : -1;
                        s > i && --s, n.movedTo(o(v.clone(r.docs.get(e))), i, s, t || null)
                    }
                }, removed: function (e) {
                    var t = this;
                    if (n.removedAt || n.removed) {
                        var r = o(t.docs.get(e));
                        if (n.removedAt) {
                            var i = a ? t.docs.indexOf(e) : -1;
                            n.removedAt(r, i)
                        } else n.removed(r)
                    }
                }}
            } else r = {added: function (e, t) {
                if (!i && n.added) {
                    var r = g.extend(t, {_id: e});
                    n.added(o(r))
                }
            }, changed: function (t, r) {
                var i = this;
                if (n.changed) {
                    var a = i.docs.get(t), s = v.clone(a);
                    e._applyChanges(s, r), n.changed(o(s), o(a))
                }
            }, removed: function (e) {
                var t = this;
                n.removed && n.removed(o(t.docs.get(e)))
            }};
            var s = new e._CachingChangeObserver({callbacks: r}), u = t.observeChanges(s.applyChange);
            return i = !1, s.ordered && (u._fetch = function () {
                var e = [];
                return s.docs.forEach(function (t) {
                    e.push(o(v.clone(t)))
                }), e
            }), u
        }
    }.call(this), function () {
        e._looksLikeObjectID = function (e) {
            return 24 === e.length && e.match(/^[0-9a-f]*$/)
        }, e._ObjectID = function (t) {
            var n = this;
            if (t) {
                if (t = t.toLowerCase(), !e._looksLikeObjectID(t))throw new Error("Invalid hexadecimal string for creating an ObjectID");
                n._str = t
            } else n._str = b.hexString(24)
        }, e._ObjectID.prototype.toString = function () {
            var e = this;
            return'ObjectID("' + e._str + '")'
        }, e._ObjectID.prototype.equals = function (t) {
            var n = this;
            return t instanceof e._ObjectID && n.valueOf() === t.valueOf()
        }, e._ObjectID.prototype.clone = function () {
            var t = this;
            return new e._ObjectID(t._str)
        }, e._ObjectID.prototype.typeName = function () {
            return"oid"
        }, e._ObjectID.prototype.getTimestamp = function () {
            var e = this;
            return parseInt(e._str.substr(0, 8), 16)
        }, e._ObjectID.prototype.valueOf = e._ObjectID.prototype.toJSONValue = e._ObjectID.prototype.toHexString = function () {
            return this._str
        }, e._selectorIsId = function (t) {
            return"string" == typeof t || "number" == typeof t || t instanceof e._ObjectID
        }, e._selectorIsIdPerhapsAsObject = function (t) {
            return e._selectorIsId(t) || t && "object" == typeof t && t._id && e._selectorIsId(t._id) && 1 === g.size(t)
        }, e._idsMatchedBySelector = function (t) {
            if (e._selectorIsId(t))return[t];
            if (!t)return null;
            if (g.has(t, "_id"))return e._selectorIsId(t._id) ? [t._id] : t._id && t._id.$in && g.isArray(t._id.$in) && !g.isEmpty(t._id.$in) && g.all(t._id.$in, e._selectorIsId) ? t._id.$in : null;
            if (t.$and && g.isArray(t.$and))for (var n = 0; n < t.$and.length; ++n) {
                var r = e._idsMatchedBySelector(t.$and[n]);
                if (r)return r
            }
            return null
        }, v.addType("oid", function (t) {
            return new e._ObjectID(t)
        })
    }.call(this), "undefined" == typeof Package && (Package = {}), Package.minimongo = {LocalCollection: e, Minimongo: t, MinimongoTest: n}
}(), function () {
    {
        var e, t, n, r, o, i, a, s, u, c, l = Package.meteor.Meteor, f = (Package.check.check, Package.check.Match, Package.random.Random), d = Package.ejson.EJSON, p = Package.json.JSON, h = Package.underscore._, g = Package.deps.Deps, m = (Package.logging.Log, Package.retry.Retry), v = Package.minimongo.LocalCollection;
        Package.minimongo.Minimongo
    }
    (function () {
        t = {}
    }).call(this), function () {
        n = function () {
            var e = document, t = window, n = {}, r = function () {
            };
            r.prototype.addEventListener = function (e, t) {
                this._listeners || (this._listeners = {}), e in this._listeners || (this._listeners[e] = []);
                var r = this._listeners[e];
                -1 === n.arrIndexOf(r, t) && r.push(t)
            }, r.prototype.removeEventListener = function (e, t) {
                if (this._listeners && e in this._listeners) {
                    var r = this._listeners[e], o = n.arrIndexOf(r, t);
                    return-1 !== o ? (r.length > 1 ? this._listeners[e] = r.slice(0, o).concat(r.slice(o + 1)) : delete this._listeners[e], void 0) : void 0
                }
            }, r.prototype.dispatchEvent = function (e) {
                var t = e.type, n = Array.prototype.slice.call(arguments, 0);
                if (this["on" + t] && this["on" + t].apply(this, n), this._listeners && t in this._listeners)for (var r = 0; r < this._listeners[t].length; r++)this._listeners[t][r].apply(this, n)
            };
            var o = function (e, t) {
                if (this.type = e, "undefined" != typeof t)for (var n in t)t.hasOwnProperty(n) && (this[n] = t[n])
            };
            o.prototype.toString = function () {
                var e = [];
                for (var t in this)if (this.hasOwnProperty(t)) {
                    var n = this[t];
                    "function" == typeof n && (n = "[function]"), e.push(t + "=" + n)
                }
                return"SimpleEvent(" + e.join(", ") + ")"
            };
            var i = function (e) {
                var t = this;
                t._events = e || [], t._listeners = {}
            };
            i.prototype.emit = function (e) {
                var t = this;
                if (t._verifyType(e), !t._nuked) {
                    var n = Array.prototype.slice.call(arguments, 1);
                    if (t["on" + e] && t["on" + e].apply(t, n), e in t._listeners)for (var r = 0; r < t._listeners[e].length; r++)t._listeners[e][r].apply(t, n)
                }
            }, i.prototype.on = function (e, t) {
                var n = this;
                n._verifyType(e), n._nuked || (e in n._listeners || (n._listeners[e] = []), n._listeners[e].push(t))
            }, i.prototype._verifyType = function (e) {
                var t = this;
                -1 === n.arrIndexOf(t._events, e) && n.log("Event " + p.stringify(e) + " not listed " + p.stringify(t._events) + " in " + t)
            }, i.prototype.nuke = function () {
                var e = this;
                e._nuked = !0;
                for (var t = 0; t < e._events.length; t++)delete e[e._events[t]];
                e._listeners = {}
            };
            var a = "abcdefghijklmnopqrstuvwxyz0123456789_";
            n.random_string = function (e, t) {
                t = t || a.length;
                var n, r = [];
                for (n = 0; e > n; n++)r.push(a.substr(Math.floor(Math.random() * t), 1));
                return r.join("")
            }, n.random_number = function (e) {
                return Math.floor(Math.random() * e)
            }, n.random_number_string = function (e) {
                var t = ("" + (e - 1)).length, r = Array(t + 1).join("0");
                return(r + n.random_number(e)).slice(-t)
            }, n.getOrigin = function (e) {
                e += "/";
                var t = e.split("/").slice(0, 3);
                return t.join("/")
            }, n.isSameOriginUrl = function (e, n) {
                return n || (n = t.location.href), e.split("/").slice(0, 3).join("/") === n.split("/").slice(0, 3).join("/")
            }, n.isSameOriginScheme = function (e, n) {
                return n || (n = t.location.href), e.split(":")[0] === n.split(":")[0]
            }, n.getParentDomain = function (e) {
                if (/^[0-9.]*$/.test(e))return e;
                if (/^\[/.test(e))return e;
                if (!/[.]/.test(e))return e;
                var t = e.split(".").slice(1);
                return t.join(".")
            }, n.objectExtend = function (e, t) {
                for (var n in t)t.hasOwnProperty(n) && (e[n] = t[n]);
                return e
            };
            var s = "_jp";
            n.polluteGlobalNamespace = function () {
                s in t || (t[s] = {})
            }, n.closeFrame = function (e, t) {
                return"c" + p.stringify([e, t])
            }, n.userSetCode = function (e) {
                return 1e3 === e || e >= 3e3 && 4999 >= e
            }, n.countRTO = function (e) {
                var t;
                return t = e > 100 ? 3 * e : e + 200
            }, n.log = function () {
                t.console && console.log && console.log.apply && console.log.apply(console, arguments)
            }, n.bind = function (e, t) {
                return e.bind ? e.bind(t) : function () {
                    return e.apply(t, arguments)
                }
            }, n.flatUrl = function (e) {
                return-1 === e.indexOf("?") && -1 === e.indexOf("#")
            }, n.amendUrl = function (t) {
                var r = e.location;
                if (!t)throw new Error("Wrong url for SockJS");
                if (!n.flatUrl(t))throw new Error("Only basic urls are supported in SockJS");
                0 === t.indexOf("//") && (t = r.protocol + t), 0 === t.indexOf("/") && (t = r.protocol + "//" + r.host + t), t = t.replace(/[/]+$/, "");
                var o = t.split("/");
                return("http:" === o[0] && /:80$/.test(o[2]) || "https:" === o[0] && /:443$/.test(o[2])) && (o[2] = o[2].replace(/:(80|443)$/, "")), t = o.join("/")
            }, n.arrIndexOf = function (e, t) {
                for (var n = 0; n < e.length; n++)if (e[n] === t)return n;
                return-1
            }, n.arrSkip = function (e, t) {
                var r = n.arrIndexOf(e, t);
                if (-1 === r)return e.slice();
                var o = e.slice(0, r);
                return o.concat(e.slice(r + 1))
            }, n.isArray = Array.isArray || function (e) {
                return{}.toString.call(e).indexOf("Array") >= 0
            }, n.delay = function (e, t) {
                return"function" == typeof e && (t = e, e = 0), setTimeout(t, e)
            };
            var u, c = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, l = {"\x00": "\\u0000", "": "\\u0001", "": "\\u0002", "": "\\u0003", "": "\\u0004", "": "\\u0005", "": "\\u0006", "": "\\u0007", "\b": "\\b", "	": "\\t", "\n": "\\n", "": "\\u000b", "\f": "\\f", "\r": "\\r", "": "\\u000e", "": "\\u000f", "": "\\u0010", "": "\\u0011", "": "\\u0012", "": "\\u0013", "": "\\u0014", "": "\\u0015", "": "\\u0016", "": "\\u0017", "": "\\u0018", "": "\\u0019", "": "\\u001a", "": "\\u001b", "": "\\u001c", "": "\\u001d", "": "\\u001e", "": "\\u001f", '"': '\\"', "\\": "\\\\", "": "\\u007f", "": "\\u0080", "": "\\u0081", "": "\\u0082", "": "\\u0083", "": "\\u0084", "": "\\u0085", "": "\\u0086", "": "\\u0087", "": "\\u0088", "": "\\u0089", "": "\\u008a", "": "\\u008b", "": "\\u008c", "": "\\u008d", "": "\\u008e", "": "\\u008f", "": "\\u0090", "": "\\u0091", "": "\\u0092", "": "\\u0093", "": "\\u0094", "": "\\u0095", "": "\\u0096", "": "\\u0097", "": "\\u0098", "": "\\u0099", "": "\\u009a", "": "\\u009b", "": "\\u009c", "": "\\u009d", "": "\\u009e", "": "\\u009f", "­": "\\u00ad", "؀": "\\u0600", "؁": "\\u0601", "؂": "\\u0602", "؃": "\\u0603", "؄": "\\u0604", "܏": "\\u070f", "឴": "\\u17b4", "឵": "\\u17b5", "‌": "\\u200c", "‍": "\\u200d", "‎": "\\u200e", "‏": "\\u200f", "\u2028": "\\u2028", "\u2029": "\\u2029", "‪": "\\u202a", "‫": "\\u202b", "‬": "\\u202c", "‭": "\\u202d", "‮": "\\u202e", " ": "\\u202f", "⁠": "\\u2060", "⁡": "\\u2061", "⁢": "\\u2062", "⁣": "\\u2063", "⁤": "\\u2064", "⁥": "\\u2065", "⁦": "\\u2066", "⁧": "\\u2067", "⁨": "\\u2068", "⁩": "\\u2069", "⁪": "\\u206a", "⁫": "\\u206b", "⁬": "\\u206c", "⁭": "\\u206d", "⁮": "\\u206e", "⁯": "\\u206f", "﻿": "\\ufeff", "￰": "\\ufff0", "￱": "\\ufff1", "￲": "\\ufff2", "￳": "\\ufff3", "￴": "\\ufff4", "￵": "\\ufff5", "￶": "\\ufff6", "￷": "\\ufff7", "￸": "\\ufff8", "￹": "\\ufff9", "￺": "\\ufffa", "￻": "\\ufffb", "￼": "\\ufffc", "�": "\\ufffd", "￾": "\\ufffe", "￿": "\\uffff"}, f = /[\x00-\x1f\ud800-\udfff\ufffe\uffff\u0300-\u0333\u033d-\u0346\u034a-\u034c\u0350-\u0352\u0357-\u0358\u035c-\u0362\u0374\u037e\u0387\u0591-\u05af\u05c4\u0610-\u0617\u0653-\u0654\u0657-\u065b\u065d-\u065e\u06df-\u06e2\u06eb-\u06ec\u0730\u0732-\u0733\u0735-\u0736\u073a\u073d\u073f-\u0741\u0743\u0745\u0747\u07eb-\u07f1\u0951\u0958-\u095f\u09dc-\u09dd\u09df\u0a33\u0a36\u0a59-\u0a5b\u0a5e\u0b5c-\u0b5d\u0e38-\u0e39\u0f43\u0f4d\u0f52\u0f57\u0f5c\u0f69\u0f72-\u0f76\u0f78\u0f80-\u0f83\u0f93\u0f9d\u0fa2\u0fa7\u0fac\u0fb9\u1939-\u193a\u1a17\u1b6b\u1cda-\u1cdb\u1dc0-\u1dcf\u1dfc\u1dfe\u1f71\u1f73\u1f75\u1f77\u1f79\u1f7b\u1f7d\u1fbb\u1fbe\u1fc9\u1fcb\u1fd3\u1fdb\u1fe3\u1feb\u1fee-\u1fef\u1ff9\u1ffb\u1ffd\u2000-\u2001\u20d0-\u20d1\u20d4-\u20d7\u20e7-\u20e9\u2126\u212a-\u212b\u2329-\u232a\u2adc\u302b-\u302c\uaab2-\uaab3\uf900-\ufa0d\ufa10\ufa12\ufa15-\ufa1e\ufa20\ufa22\ufa25-\ufa26\ufa2a-\ufa2d\ufa30-\ufa6d\ufa70-\ufad9\ufb1d\ufb1f\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40-\ufb41\ufb43-\ufb44\ufb46-\ufb4e\ufff0-\uffff]/g, d = p && p.stringify || function (e) {
                return c.lastIndex = 0, c.test(e) && (e = e.replace(c, function (e) {
                    return l[e]
                })), '"' + e + '"'
            }, h = function (e) {
                var t, n = {}, r = [];
                for (t = 0; 65536 > t; t++)r.push(String.fromCharCode(t));
                return e.lastIndex = 0, r.join("").replace(e, function (e) {
                    return n[e] = "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4), ""
                }), e.lastIndex = 0, n
            };
            n.quote = function (e) {
                var t = d(e);
                return f.lastIndex = 0, f.test(t) ? (u || (u = h(f)), t.replace(f, function (e) {
                    return u[e]
                })) : t
            };
            var g = ["websocket", "xdr-streaming", "xhr-streaming", "iframe-eventsource", "iframe-htmlfile", "xdr-polling", "xhr-polling", "iframe-xhr-polling", "jsonp-polling"];
            n.probeProtocols = function () {
                for (var e = {}, t = 0; t < g.length; t++) {
                    var n = g[t];
                    e[n] = T[n] && T[n].enabled()
                }
                return e
            }, n.detectProtocols = function (e, t, n) {
                var r = {}, o = [];
                t || (t = g);
                for (var i = 0; i < t.length; i++) {
                    var a = t[i];
                    r[a] = e[a]
                }
                var s = function (e) {
                    var t = e.shift();
                    r[t] ? o.push(t) : e.length > 0 && s(e)
                };
                return n.websocket !== !1 && s(["websocket"]), r["xhr-streaming"] && !n.null_origin ? o.push("xhr-streaming") : !r["xdr-streaming"] || n.cookie_needed || n.null_origin ? s(["iframe-eventsource", "iframe-htmlfile"]) : o.push("xdr-streaming"), r["xhr-polling"] && !n.null_origin ? o.push("xhr-polling") : !r["xdr-polling"] || n.cookie_needed || n.null_origin ? s(["iframe-xhr-polling", "jsonp-polling"]) : o.push("xdr-polling"), o
            };
            var m = "_sockjs_global";
            n.createHook = function () {
                var e = "a" + n.random_string(8);
                if (!(m in t)) {
                    var r = {};
                    t[m] = function (e) {
                        return e in r || (r[e] = {id: e, del: function () {
                            delete r[e]
                        }}), r[e]
                    }
                }
                return t[m](e)
            }, n.attachMessage = function (e) {
                n.attachEvent("message", e)
            }, n.attachEvent = function (n, r) {
                "undefined" != typeof t.addEventListener ? t.addEventListener(n, r, !1) : (e.attachEvent("on" + n, r), t.attachEvent("on" + n, r))
            }, n.detachMessage = function (e) {
                n.detachEvent("message", e)
            }, n.detachEvent = function (n, r) {
                "undefined" != typeof t.addEventListener ? t.removeEventListener(n, r, !1) : (e.detachEvent("on" + n, r), t.detachEvent("on" + n, r))
            };
            var v = {}, y = !1, _ = function () {
                for (var e in v)v[e](), delete v[e]
            }, b = function () {
                y || (y = !0, _())
            };
            n.attachEvent("unload", b), n.unload_add = function (e) {
                var t = n.random_string(8);
                return v[t] = e, y && n.delay(_), t
            }, n.unload_del = function (e) {
                e in v && delete v[e]
            }, n.createIframe = function (t, r) {
                var o, i, a = e.createElement("iframe"), s = function () {
                    clearTimeout(o);
                    try {
                        a.onload = null
                    } catch (e) {
                    }
                    a.onerror = null
                }, u = function () {
                    a && (s(), setTimeout(function () {
                        a && a.parentNode.removeChild(a), a = null
                    }, 0), n.unload_del(i))
                }, c = function (e) {
                    a && (u(), r(e))
                }, l = function (e, t) {
                    try {
                        a && a.contentWindow && a.contentWindow.postMessage(e, t)
                    } catch (n) {
                    }
                };
                return a.src = t, a.style.display = "none", a.style.position = "absolute", a.onerror = function () {
                    c("onerror")
                }, a.onload = function () {
                    clearTimeout(o), o = setTimeout(function () {
                        c("onload timeout")
                    }, 2e3)
                }, e.body.appendChild(a), o = setTimeout(function () {
                    c("timeout")
                }, 15e3), i = n.unload_add(u), {post: l, cleanup: u, loaded: s}
            }, n.createHtmlfile = function (e, r) {
                var o, i, a, u = new ActiveXObject("htmlfile"), c = function () {
                    clearTimeout(o)
                }, l = function () {
                    u && (c(), n.unload_del(i), a.parentNode.removeChild(a), a = u = null, CollectGarbage())
                }, f = function (e) {
                    u && (l(), r(e))
                }, d = function (e, t) {
                    try {
                        a && a.contentWindow && a.contentWindow.postMessage(e, t)
                    } catch (n) {
                    }
                };
                u.open(), u.write('<html><script>document.domain="' + document.domain + '";</script></html>'), u.close(), u.parentWindow[s] = t[s];
                var p = u.createElement("div");
                return u.body.appendChild(p), a = u.createElement("iframe"), p.appendChild(a), a.src = e, o = setTimeout(function () {
                    f("timeout")
                }, 15e3), i = n.unload_add(l), {post: d, cleanup: l, loaded: c}
            };
            var w = function () {
            };
            w.prototype = new i(["chunk", "finish"]), w.prototype._start = function (e, r, o, i) {
                var a = this;
                try {
                    a.xhr = new XMLHttpRequest
                } catch (s) {
                }
                if (!a.xhr)try {
                    a.xhr = new t.ActiveXObject("Microsoft.XMLHTTP")
                } catch (s) {
                }
                (t.ActiveXObject || t.XDomainRequest) && (r += (-1 === r.indexOf("?") ? "?" : "&") + "t=" + +new Date), a.unload_ref = n.unload_add(function () {
                    a._cleanup(!0)
                });
                try {
                    a.xhr.open(e, r, !0)
                } catch (u) {
                    return a.emit("finish", 0, ""), a._cleanup(), void 0
                }
                if (i && i.no_credentials || (a.xhr.withCredentials = "true"), i && i.headers)for (var c in i.headers)a.xhr.setRequestHeader(c, i.headers[c]);
                a.xhr.onreadystatechange = function () {
                    if (a.xhr) {
                        var e = a.xhr;
                        switch (e.readyState) {
                            case 3:
                                try {
                                    var t = e.status, n = e.responseText
                                } catch (e) {
                                }
                                1223 === t && (t = 204), n && n.length > 0 && a.emit("chunk", t, n);
                                break;
                            case 4:
                                var t = e.status;
                                1223 === t && (t = 204), a.emit("finish", t, e.responseText), a._cleanup(!1)
                        }
                    }
                }, a.xhr.send(o)
            }, w.prototype._cleanup = function (e) {
                var t = this;
                if (t.xhr) {
                    if (n.unload_del(t.unload_ref), t.xhr.onreadystatechange = function () {
                    }, e)try {
                        t.xhr.abort()
                    } catch (r) {
                    }
                    t.unload_ref = t.xhr = null
                }
            }, w.prototype.close = function () {
                var e = this;
                e.nuke(), e._cleanup(!0)
            };
            var x = n.XHRCorsObject = function () {
                var e = this, t = arguments;
                n.delay(function () {
                    e._start.apply(e, t)
                })
            };
            x.prototype = new w;
            var k = n.XHRLocalObject = function (e, t, r) {
                var o = this;
                n.delay(function () {
                    o._start(e, t, r, {no_credentials: !0})
                })
            };
            k.prototype = new w;
            var E = n.XDRObject = function (e, t, r) {
                var o = this;
                n.delay(function () {
                    o._start(e, t, r)
                })
            };
            E.prototype = new i(["chunk", "finish"]), E.prototype._start = function (e, t, r) {
                var o = this, i = new XDomainRequest;
                t += (-1 === t.indexOf("?") ? "?" : "&") + "t=" + +new Date;
                var a = i.ontimeout = i.onerror = function () {
                    o.emit("finish", 0, ""), o._cleanup(!1)
                };
                i.onprogress = function () {
                    o.emit("chunk", 200, i.responseText)
                }, i.onload = function () {
                    o.emit("finish", 200, i.responseText), o._cleanup(!1)
                }, o.xdr = i, o.unload_ref = n.unload_add(function () {
                    o._cleanup(!0)
                });
                try {
                    o.xdr.open(e, t), o.xdr.send(r)
                } catch (s) {
                    a()
                }
            }, E.prototype._cleanup = function (e) {
                var t = this;
                if (t.xdr) {
                    if (n.unload_del(t.unload_ref), t.xdr.ontimeout = t.xdr.onerror = t.xdr.onprogress = t.xdr.onload = null, e)try {
                        t.xdr.abort()
                    } catch (r) {
                    }
                    t.unload_ref = t.xdr = null
                }
            }, E.prototype.close = function () {
                var e = this;
                e.nuke(), e._cleanup(!0)
            }, n.isXHRCorsCapable = function () {
                return t.XMLHttpRequest && "withCredentials"in new XMLHttpRequest ? 1 : t.XDomainRequest && e.domain ? 2 : L.enabled() ? 3 : 4
            };
            var T = function (e, t, r) {
                if (!(this instanceof T))return new T(e, t, r);
                var o, i = this;
                i._options = {devel: !1, debug: !1, protocols_whitelist: [], info: void 0, rtt: void 0}, r && n.objectExtend(i._options, r), i._base_url = n.amendUrl(e), i._server = i._options.server || n.random_number_string(1e3), i._options.protocols_whitelist && i._options.protocols_whitelist.length ? o = i._options.protocols_whitelist : (o = "string" == typeof t && t.length > 0 ? [t] : n.isArray(t) ? t : null, o && i._debug('Deprecated API: Use "protocols_whitelist" option instead of supplying protocol list as a second parameter to SockJS constructor.')), i._protocols = [], i.protocol = null, i.readyState = T.CONNECTING, i._ir = W(i._base_url), i._ir.onfinish = function (e, t) {
                    i._ir = null, e ? (i._options.info && (e = n.objectExtend(e, i._options.info)), i._options.rtt && (t = i._options.rtt), i._applyInfo(e, t, o), i._didClose()) : i._didClose(1002, "Can't connect to server", !0)
                }
            };
            T.prototype = new r, T.version = "0.3.4", T.CONNECTING = 0, T.OPEN = 1, T.CLOSING = 2, T.CLOSED = 3, T.prototype._debug = function () {
                this._options.debug && n.log.apply(n, arguments)
            }, T.prototype._dispatchOpen = function () {
                var e = this;
                e.readyState === T.CONNECTING ? (e._transport_tref && (clearTimeout(e._transport_tref), e._transport_tref = null), e.readyState = T.OPEN, e.dispatchEvent(new o("open"))) : e._didClose(1006, "Server lost session")
            }, T.prototype._dispatchMessage = function (e) {
                var t = this;
                t.readyState === T.OPEN && t.dispatchEvent(new o("message", {data: e}))
            }, T.prototype._dispatchHeartbeat = function () {
                var e = this;
                e.readyState === T.OPEN && e.dispatchEvent(new o("heartbeat", {}))
            }, T.prototype._didClose = function (e, t, r) {
                var i = this;
                if (i.readyState !== T.CONNECTING && i.readyState !== T.OPEN && i.readyState !== T.CLOSING)throw new Error("INVALID_STATE_ERR");
                i._ir && (i._ir.nuke(), i._ir = null), i._transport && (i._transport.doCleanup(), i._transport = null);
                var a = new o("close", {code: e, reason: t, wasClean: n.userSetCode(e)});
                if (!n.userSetCode(e) && i.readyState === T.CONNECTING && !r) {
                    if (i._try_next_protocol(a))return;
                    a = new o("close", {code: 2e3, reason: "All transports failed", wasClean: !1, last_event: a})
                }
                i.readyState = T.CLOSED, n.delay(function () {
                    i.dispatchEvent(a)
                })
            }, T.prototype._didMessage = function (e) {
                var t = this, n = e.slice(0, 1);
                switch (n) {
                    case"o":
                        t._dispatchOpen();
                        break;
                    case"a":
                        for (var r = p.parse(e.slice(1) || "[]"), o = 0; o < r.length; o++)t._dispatchMessage(r[o]);
                        break;
                    case"m":
                        var r = p.parse(e.slice(1) || "null");
                        t._dispatchMessage(r);
                        break;
                    case"c":
                        var r = p.parse(e.slice(1) || "[]");
                        t._didClose(r[0], r[1]);
                        break;
                    case"h":
                        t._dispatchHeartbeat()
                }
            }, T.prototype._try_next_protocol = function (t) {
                var r = this;
                for (r.protocol && (r._debug("Closed transport:", r.protocol, "" + t), r.protocol = null), r._transport_tref && (clearTimeout(r._transport_tref), r._transport_tref = null); ;) {
                    var o = r.protocol = r._protocols.shift();
                    if (!o)return!1;
                    if (T[o] && T[o].need_body === !0 && (!e.body || "undefined" != typeof e.readyState && "complete" !== e.readyState))return r._protocols.unshift(o), r.protocol = "waiting-for-load", n.attachEvent("load", function () {
                        r._try_next_protocol()
                    }), !0;
                    if (T[o] && T[o].enabled(r._options)) {
                        var i = T[o].roundTrips || 1, a = (r._options.rto || 0) * i || 5e3;
                        r._transport_tref = n.delay(a, function () {
                            r.readyState === T.CONNECTING && r._didClose(2007, "Transport timeouted")
                        });
                        var s = n.random_string(8), u = r._base_url + "/" + r._server + "/" + s;
                        return r._debug("Opening transport:", o, " url:" + u, " RTO:" + r._options.rto), r._transport = new T[o](r, u, r._base_url), !0
                    }
                    r._debug("Skipping transport:", o)
                }
            }, T.prototype.close = function (e, t) {
                var r = this;
                if (e && !n.userSetCode(e))throw new Error("INVALID_ACCESS_ERR");
                return r.readyState !== T.CONNECTING && r.readyState !== T.OPEN ? !1 : (r.readyState = T.CLOSING, r._didClose(e || 1e3, t || "Normal closure"), !0)
            }, T.prototype.send = function (e) {
                var t = this;
                if (t.readyState === T.CONNECTING)throw new Error("INVALID_STATE_ERR");
                return t.readyState === T.OPEN && t._transport.doSend(n.quote("" + e)), !0
            }, T.prototype._applyInfo = function (t, r, o) {
                var i = this;
                i._options.info = t, i._options.rtt = r, i._options.rto = n.countRTO(r), i._options.info.null_origin = !e.domain, t.base_url && (i._base_url = n.amendUrl(t.base_url));
                var a = n.probeProtocols();
                i._protocols = n.detectProtocols(a, o, t), n.isSameOriginScheme(i._base_url) || 2 !== n.isXHRCorsCapable() || (i._protocols = ["jsonp-polling"])
            };
            var C = T.websocket = function (e, r) {
                var o = this, i = r + "/websocket";
                i = "https" === i.slice(0, 5) ? "wss" + i.slice(5) : "ws" + i.slice(4), o.ri = e, o.url = i;
                var a = t.WebSocket || t.MozWebSocket;
                o.ws = new a(o.url), o.ws.onmessage = function (e) {
                    o.ri._didMessage(e.data)
                }, o.unload_ref = n.unload_add(function () {
                    o.ws.close()
                }), o.ws.onclose = function () {
                    o.ri._didMessage(n.closeFrame(1006, "WebSocket connection broken"))
                }
            };
            C.prototype.doSend = function (e) {
                this.ws.send("[" + e + "]")
            }, C.prototype.doCleanup = function () {
                var e = this, t = e.ws;
                t && (t.onmessage = t.onclose = null, t.close(), n.unload_del(e.unload_ref), e.unload_ref = e.ri = e.ws = null)
            }, C.enabled = function () {
                return!(!t.WebSocket && !t.MozWebSocket)
            }, C.roundTrips = 2;
            var S = function () {
            };
            S.prototype.send_constructor = function (e) {
                var t = this;
                t.send_buffer = [], t.sender = e
            }, S.prototype.doSend = function (e) {
                var t = this;
                t.send_buffer.push(e), t.send_stop || t.send_schedule()
            }, S.prototype.send_schedule_wait = function () {
                var e, t = this;
                t.send_stop = function () {
                    t.send_stop = null, clearTimeout(e)
                }, e = n.delay(25, function () {
                    t.send_stop = null, t.send_schedule()
                })
            }, S.prototype.send_schedule = function () {
                var e = this;
                if (e.send_buffer.length > 0) {
                    var t = "[" + e.send_buffer.join(",") + "]";
                    e.send_stop = e.sender(e.trans_url, t, function (t, n) {
                        e.send_stop = null, t === !1 ? e.ri._didClose(1006, "Sending error " + n) : e.send_schedule_wait()
                    }), e.send_buffer = []
                }
            }, S.prototype.send_destructor = function () {
                var e = this;
                e._send_stop && e._send_stop(), e._send_stop = null
            };
            var O = function (t, r, o) {
                var i = this;
                if (!("_send_form"in i)) {
                    var a = i._send_form = e.createElement("form"), s = i._send_area = e.createElement("textarea");
                    s.name = "d", a.style.display = "none", a.style.position = "absolute", a.method = "POST", a.enctype = "application/x-www-form-urlencoded", a.acceptCharset = "UTF-8", a.appendChild(s), e.body.appendChild(a)
                }
                var a = i._send_form, s = i._send_area, u = "a" + n.random_string(8);
                a.target = u, a.action = t + "/jsonp_send?i=" + u;
                var c;
                try {
                    c = e.createElement('<iframe name="' + u + '">')
                } catch (l) {
                    c = e.createElement("iframe"), c.name = u
                }
                c.id = u, a.appendChild(c), c.style.display = "none";
                try {
                    s.value = r
                } catch (f) {
                    n.log("Your browser is seriously broken. Go home! " + f.message)
                }
                a.submit();
                var d = function () {
                    c.onerror && (c.onreadystatechange = c.onerror = c.onload = null, n.delay(500, function () {
                        c.parentNode.removeChild(c), c = null
                    }), s.value = "", o(!0))
                };
                return c.onerror = c.onload = d, c.onreadystatechange = function () {
                    "complete" == c.readyState && d()
                }, d
            }, N = function (e) {
                return function (t, n, r) {
                    var o = new e("POST", t + "/xhr_send", n);
                    return o.onfinish = function (e) {
                        r(200 === e || 204 === e, "http status " + e)
                    }, function (e) {
                        r(!1, e)
                    }
                }
            }, A = function (t, r) {
                var o, i, a = e.createElement("script"), s = function (e) {
                    i && (i.parentNode.removeChild(i), i = null), a && (clearTimeout(o), a.parentNode.removeChild(a), a.onreadystatechange = a.onerror = a.onload = a.onclick = null, a = null, r(e), r = null)
                }, u = !1, c = null;
                if (a.id = "a" + n.random_string(8), a.src = t, a.type = "text/javascript", a.charset = "UTF-8", a.onerror = function () {
                    c || (c = setTimeout(function () {
                        u || s(n.closeFrame(1006, "JSONP script loaded abnormally (onerror)"))
                    }, 1e3))
                }, a.onload = function () {
                    s(n.closeFrame(1006, "JSONP script loaded abnormally (onload)"))
                }, a.onreadystatechange = function () {
                    if (/loaded|closed/.test(a.readyState)) {
                        if (a && a.htmlFor && a.onclick) {
                            u = !0;
                            try {
                                a.onclick()
                            } catch (e) {
                            }
                        }
                        a && s(n.closeFrame(1006, "JSONP script loaded abnormally (onreadystatechange)"))
                    }
                }, "undefined" == typeof a.async && e.attachEvent)if (/opera/i.test(navigator.userAgent))i = e.createElement("script"), i.text = "try{var a = document.getElementById('" + a.id + "'); if(a)a.onerror();}catch(x){};", a.async = i.async = !1; else {
                    try {
                        a.htmlFor = a.id, a.event = "onclick"
                    } catch (l) {
                    }
                    a.async = !0
                }
                "undefined" != typeof a.async && (a.async = !0), o = setTimeout(function () {
                    s(n.closeFrame(1006, "JSONP script loaded abnormally (timeout)"))
                }, 35e3);
                var f = e.getElementsByTagName("head")[0];
                return f.insertBefore(a, f.firstChild), i && f.insertBefore(i, f.firstChild), s
            }, M = T["jsonp-polling"] = function (e, t) {
                n.polluteGlobalNamespace();
                var r = this;
                r.ri = e, r.trans_url = t, r.send_constructor(O), r._schedule_recv()
            };
            M.prototype = new S, M.prototype._schedule_recv = function () {
                var e = this, t = function (t) {
                    e._recv_stop = null, t && (e._is_closing || e.ri._didMessage(t)), e._is_closing || e._schedule_recv()
                };
                e._recv_stop = I(e.trans_url + "/jsonp", A, t)
            }, M.enabled = function () {
                return!0
            }, M.need_body = !0, M.prototype.doCleanup = function () {
                var e = this;
                e._is_closing = !0, e._recv_stop && e._recv_stop(), e.ri = e._recv_stop = null, e.send_destructor()
            };
            var I = function (e, r, o) {
                var i = "a" + n.random_string(6), a = e + "?c=" + escape(s + "." + i), u = 0, c = function (e) {
                    switch (u) {
                        case 0:
                            delete t[s][i], o(e);
                            break;
                        case 1:
                            o(e), u = 2;
                            break;
                        case 2:
                            delete t[s][i]
                    }
                }, l = r(a, c);
                t[s][i] = l;
                var f = function () {
                    t[s][i] && (u = 1, t[s][i](n.closeFrame(1e3, "JSONP user aborted read")))
                };
                return f
            }, j = function () {
            };
            j.prototype = new S, j.prototype.run = function (e, t, n, r, o) {
                var i = this;
                i.ri = e, i.trans_url = t, i.send_constructor(N(o)), i.poll = new Z(e, r, t + n, o)
            }, j.prototype.doCleanup = function () {
                var e = this;
                e.poll && (e.poll.abort(), e.poll = null)
            };
            var D = T["xhr-streaming"] = function (e, t) {
                this.run(e, t, "/xhr_streaming", ot, n.XHRCorsObject)
            };
            D.prototype = new j, D.enabled = function () {
                return t.XMLHttpRequest && "withCredentials"in new XMLHttpRequest && !/opera/i.test(navigator.userAgent)
            }, D.roundTrips = 2, D.need_body = !0;
            var P = T["xdr-streaming"] = function (e, t) {
                this.run(e, t, "/xhr_streaming", ot, n.XDRObject)
            };
            P.prototype = new j, P.enabled = function () {
                return!!t.XDomainRequest
            }, P.roundTrips = 2;
            var R = T["xhr-polling"] = function (e, t) {
                this.run(e, t, "/xhr", ot, n.XHRCorsObject)
            };
            R.prototype = new j, R.enabled = D.enabled, R.roundTrips = 2;
            var $ = T["xdr-polling"] = function (e, t) {
                this.run(e, t, "/xhr", ot, n.XDRObject)
            };
            $.prototype = new j, $.enabled = P.enabled, $.roundTrips = 2;
            var L = function () {
            };
            L.prototype.i_constructor = function (e, t, r) {
                var o = this;
                o.ri = e, o.origin = n.getOrigin(r), o.base_url = r, o.trans_url = t;
                var i = r + "/iframe.html";
                o.ri._options.devel && (i += "?t=" + +new Date), o.window_id = n.random_string(8), i += "#" + o.window_id, o.iframeObj = n.createIframe(i, function (e) {
                    o.ri._didClose(1006, "Unable to load an iframe (" + e + ")")
                }), o.onmessage_cb = n.bind(o.onmessage, o), n.attachMessage(o.onmessage_cb)
            }, L.prototype.doCleanup = function () {
                var e = this;
                if (e.iframeObj) {
                    n.detachMessage(e.onmessage_cb);
                    try {
                        e.iframeObj.iframe.contentWindow && e.postMessage("c")
                    } catch (t) {
                    }
                    e.iframeObj.cleanup(), e.iframeObj = null, e.onmessage_cb = e.iframeObj = null
                }
            }, L.prototype.onmessage = function (e) {
                var t = this;
                if (e.origin === t.origin) {
                    var n = e.data.slice(0, 8), r = e.data.slice(8, 9), o = e.data.slice(9);
                    if (n === t.window_id)switch (r) {
                        case"s":
                            t.iframeObj.loaded(), t.postMessage("s", p.stringify([T.version, t.protocol, t.trans_url, t.base_url]));
                            break;
                        case"t":
                            t.ri._didMessage(o)
                    }
                }
            }, L.prototype.postMessage = function (e, t) {
                var n = this;
                n.iframeObj.post(n.window_id + e + (t || ""), n.origin)
            }, L.prototype.doSend = function (e) {
                this.postMessage("m", e)
            }, L.enabled = function () {
                var e = navigator && navigator.userAgent && -1 !== navigator.userAgent.indexOf("Konqueror");
                return("function" == typeof t.postMessage || "object" == typeof t.postMessage) && !e
            };
            var B, H = function (e, r) {
                parent !== t ? parent.postMessage(B + e + (r || ""), "*") : n.log("Can't postMessage, no parent window.", e, r)
            }, q = function () {
            };
            q.prototype._didClose = function (e, t) {
                H("t", n.closeFrame(e, t))
            }, q.prototype._didMessage = function (e) {
                H("t", e)
            }, q.prototype._doSend = function (e) {
                this._transport.doSend(e)
            }, q.prototype._doCleanup = function () {
                this._transport.doCleanup()
            }, n.parent_origin = void 0, T.bootstrap_iframe = function () {
                var r;
                B = e.location.hash.slice(1);
                var o = function (e) {
                    if (e.source === parent && ("undefined" == typeof n.parent_origin && (n.parent_origin = e.origin), e.origin === n.parent_origin)) {
                        var o = e.data.slice(0, 8), i = e.data.slice(8, 9), a = e.data.slice(9);
                        if (o === B)switch (i) {
                            case"s":
                                var s = p.parse(a), u = s[0], c = s[1], l = s[2], f = s[3];
                                if (u !== T.version && n.log('Incompatibile SockJS! Main site uses: "' + u + '", the iframe: "' + T.version + '".'), !n.flatUrl(l) || !n.flatUrl(f))return n.log("Only basic urls are supported in SockJS"), void 0;
                                if (!n.isSameOriginUrl(l) || !n.isSameOriginUrl(f))return n.log("Can't connect to different domain from within an iframe. (" + p.stringify([t.location.href, l, f]) + ")"), void 0;
                                r = new q, r._transport = new q[c](r, l, f);
                                break;
                            case"m":
                                r._doSend(a);
                                break;
                            case"c":
                                r && r._doCleanup(), r = null
                        }
                    }
                };
                n.attachMessage(o), H("s")
            };
            var F = function (e, t) {
                var r = this;
                n.delay(function () {
                    r.doXhr(e, t)
                })
            };
            F.prototype = new i(["finish"]), F.prototype.doXhr = function (e, t) {
                var r = this, o = (new Date).getTime(), i = new t("GET", e + "/info?cb=" + n.random_string(10)), a = n.delay(8e3, function () {
                    i.ontimeout()
                });
                i.onfinish = function (e, t) {
                    if (clearTimeout(a), a = null, 200 === e) {
                        var n = (new Date).getTime() - o, i = p.parse(t);
                        "object" != typeof i && (i = {}), r.emit("finish", i, n)
                    } else r.emit("finish")
                }, i.ontimeout = function () {
                    i.close(), r.emit("finish")
                }
            };
            var U = function (t) {
                var r = this, o = function () {
                    var e = new L;
                    e.protocol = "w-iframe-info-receiver";
                    var n = function (t) {
                        if ("string" == typeof t && "m" === t.substr(0, 1)) {
                            var n = p.parse(t.substr(1)), o = n[0], i = n[1];
                            r.emit("finish", o, i)
                        } else r.emit("finish");
                        e.doCleanup(), e = null
                    }, o = {_options: {}, _didClose: n, _didMessage: n};
                    e.i_constructor(o, t, t)
                };
                e.body ? o() : n.attachEvent("load", o)
            };
            U.prototype = new i(["finish"]);
            var V = function () {
                var e = this;
                n.delay(function () {
                    e.emit("finish", {}, 2e3)
                })
            };
            V.prototype = new i(["finish"]);
            var W = function (e) {
                if (n.isSameOriginUrl(e))return new F(e, n.XHRLocalObject);
                switch (n.isXHRCorsCapable()) {
                    case 1:
                        return new F(e, n.XHRLocalObject);
                    case 2:
                        return n.isSameOriginScheme(e) ? new F(e, n.XDRObject) : new V;
                    case 3:
                        return new U(e);
                    default:
                        return new V
                }
            }, z = q["w-iframe-info-receiver"] = function (e, t, r) {
                var o = new F(r, n.XHRLocalObject);
                o.onfinish = function (t, n) {
                    e._didMessage("m" + p.stringify([t, n])), e._didClose()
                }
            };
            z.prototype.doCleanup = function () {
            };
            var J = T["iframe-eventsource"] = function () {
                var e = this;
                e.protocol = "w-iframe-eventsource", e.i_constructor.apply(e, arguments)
            };
            J.prototype = new L, J.enabled = function () {
                return"EventSource"in t && L.enabled()
            }, J.need_body = !0, J.roundTrips = 3;
            var X = q["w-iframe-eventsource"] = function (e, t) {
                this.run(e, t, "/eventsource", et, n.XHRLocalObject)
            };
            X.prototype = new j;
            var G = T["iframe-xhr-polling"] = function () {
                var e = this;
                e.protocol = "w-iframe-xhr-polling", e.i_constructor.apply(e, arguments)
            };
            G.prototype = new L, G.enabled = function () {
                return t.XMLHttpRequest && L.enabled()
            }, G.need_body = !0, G.roundTrips = 3;
            var Q = q["w-iframe-xhr-polling"] = function (e, t) {
                this.run(e, t, "/xhr", ot, n.XHRLocalObject)
            };
            Q.prototype = new j;
            var Y = T["iframe-htmlfile"] = function () {
                var e = this;
                e.protocol = "w-iframe-htmlfile", e.i_constructor.apply(e, arguments)
            };
            Y.prototype = new L, Y.enabled = function () {
                return L.enabled()
            }, Y.need_body = !0, Y.roundTrips = 3;
            var K = q["w-iframe-htmlfile"] = function (e, t) {
                this.run(e, t, "/htmlfile", rt, n.XHRLocalObject)
            };
            K.prototype = new j;
            var Z = function (e, t, n, r) {
                var o = this;
                o.ri = e, o.Receiver = t, o.recv_url = n, o.AjaxObject = r, o._scheduleRecv()
            };
            Z.prototype._scheduleRecv = function () {
                var e = this, t = e.poll = new e.Receiver(e.recv_url, e.AjaxObject), n = 0;
                t.onmessage = function (t) {
                    n += 1, e.ri._didMessage(t.data)
                }, t.onclose = function (n) {
                    e.poll = t = t.onmessage = t.onclose = null, e.poll_is_closing || ("permanent" === n.reason ? e.ri._didClose(1006, "Polling error (" + n.reason + ")") : e._scheduleRecv())
                }
            }, Z.prototype.abort = function () {
                var e = this;
                e.poll_is_closing = !0, e.poll && e.poll.abort()
            };
            var et = function (e) {
                var t = this, r = new EventSource(e);
                r.onmessage = function (e) {
                    t.dispatchEvent(new o("message", {data: unescape(e.data)}))
                }, t.es_close = r.onerror = function (e, i) {
                    var a = i ? "user" : 2 !== r.readyState ? "network" : "permanent";
                    t.es_close = r.onmessage = r.onerror = null, r.close(), r = null, n.delay(200, function () {
                        t.dispatchEvent(new o("close", {reason: a}))
                    })
                }
            };
            et.prototype = new r, et.prototype.abort = function () {
                var e = this;
                e.es_close && e.es_close({}, !0)
            };
            var tt, nt = function () {
                if (void 0 === tt)if ("ActiveXObject"in t)try {
                    tt = !!new ActiveXObject("htmlfile")
                } catch (e) {
                } else tt = !1;
                return tt
            }, rt = function (e) {
                var r = this;
                n.polluteGlobalNamespace(), r.id = "a" + n.random_string(6, 26), e += (-1 === e.indexOf("?") ? "?" : "&") + "c=" + escape(s + "." + r.id);
                var i, a = nt() ? n.createHtmlfile : n.createIframe;
                t[s][r.id] = {start: function () {
                    i.loaded()
                }, message: function (e) {
                    r.dispatchEvent(new o("message", {data: e}))
                }, stop: function () {
                    r.iframe_close({}, "network")
                }}, r.iframe_close = function (e, n) {
                    i.cleanup(), r.iframe_close = i = null, delete t[s][r.id], r.dispatchEvent(new o("close", {reason: n}))
                }, i = a(e, function () {
                    r.iframe_close({}, "permanent")
                })
            };
            rt.prototype = new r, rt.prototype.abort = function () {
                var e = this;
                e.iframe_close && e.iframe_close({}, "user")
            };
            var ot = function (e, t) {
                var n = this, r = 0;
                n.xo = new t("POST", e, null), n.xo.onchunk = function (e, t) {
                    if (200 === e)for (; ;) {
                        var i = t.slice(r), a = i.indexOf("\n");
                        if (-1 === a)break;
                        r += a + 1;
                        var s = i.slice(0, a);
                        n.dispatchEvent(new o("message", {data: s}))
                    }
                }, n.xo.onfinish = function (e, t) {
                    n.xo.onchunk(e, t), n.xo = null;
                    var r = 200 === e ? "network" : "permanent";
                    n.dispatchEvent(new o("close", {reason: r}))
                }
            };
            return ot.prototype = new r, ot.prototype.abort = function () {
                var e = this;
                e.xo && (e.xo.close(), e.dispatchEvent(new o("close", {reason: "user"})), e.xo = null)
            }, T.getUtils = function () {
                return n
            }, T.getIframeTransport = function () {
                return L
            }, T
        }(), "_sockjs_onload"in window && setTimeout(_sockjs_onload, 1), "function" == typeof define && define.amd && define("sockjs", [], function () {
            return n
        })
    }.call(this), function () {
        t.ClientStream = function (e, t) {
            var n = this;
            n.options = h.extend({retry: !0}, t), n._initCommon(), n.HEARTBEAT_TIMEOUT = 6e4, n.rawUrl = e, n.socket = null, n.heartbeatTimer = null, "undefined" != typeof window && window.addEventListener && window.addEventListener("online", h.bind(n._online, n), !1), n._launchConnection()
        }, h.extend(t.ClientStream.prototype, {send: function (e) {
            var t = this;
            t.currentStatus.connected && t.socket.send(e)
        }, _changeUrl: function (e) {
            var t = this;
            t.rawUrl = e
        }, _connected: function () {
            var e = this;
            e.connectionTimer && (clearTimeout(e.connectionTimer), e.connectionTimer = null), e.currentStatus.connected || (e.currentStatus.status = "connected", e.currentStatus.connected = !0, e.currentStatus.retryCount = 0, e.statusChanged(), h.each(e.eventCallbacks.reset, function (e) {
                e()
            }))
        }, _cleanup: function () {
            var e = this;
            e._clearConnectionAndHeartbeatTimers(), e.socket && (e.socket.onmessage = e.socket.onclose = e.socket.onerror = e.socket.onheartbeat = function () {
            }, e.socket.close(), e.socket = null)
        }, _clearConnectionAndHeartbeatTimers: function () {
            var e = this;
            e.connectionTimer && (clearTimeout(e.connectionTimer), e.connectionTimer = null), e.heartbeatTimer && (clearTimeout(e.heartbeatTimer), e.heartbeatTimer = null)
        }, _heartbeat_timeout: function () {
            var e = this;
            l._debug("Connection timeout. No heartbeat received."), e._lostConnection()
        }, _heartbeat_received: function () {
            var e = this;
            e._forcedToDisconnect || (e.heartbeatTimer && clearTimeout(e.heartbeatTimer), e.heartbeatTimer = setTimeout(h.bind(e._heartbeat_timeout, e), e.HEARTBEAT_TIMEOUT))
        }, _sockjsProtocolsWhitelist: function () {
            var e = ["xdr-polling", "xhr-polling", "iframe-xhr-polling", "jsonp-polling"], t = navigator && /iPhone|iPad|iPod/.test(navigator.userAgent) && /OS 4_|OS 5_/.test(navigator.userAgent);
            return t || (e = ["websocket"].concat(e)), e
        }, _launchConnection: function () {
            var e = this;
            e._cleanup(), e.socket = new n(r(e.rawUrl), void 0, {debug: !1, protocols_whitelist: e._sockjsProtocolsWhitelist()}), e.socket.onopen = function () {
                e._connected()
            }, e.socket.onmessage = function (t) {
                e._heartbeat_received(), e.currentStatus.connected && h.each(e.eventCallbacks.message, function (e) {
                    e(t.data)
                })
            }, e.socket.onclose = function () {
                e._lostConnection()
            }, e.socket.onerror = function () {
                l._debug("stream error", h.toArray(arguments), (new Date).toDateString())
            }, e.socket.onheartbeat = function () {
                e._heartbeat_received()
            }, e.connectionTimer && clearTimeout(e.connectionTimer), e.connectionTimer = setTimeout(h.bind(e._lostConnection, e), e.CONNECT_TIMEOUT)
        }})
    }.call(this), function () {
        var e = function (e, t) {
            return e.length >= t.length && e.substring(0, t.length) === t
        }, n = function (e, t) {
            return e.length >= t.length && e.substring(e.length - t.length) === t
        }, i = function (t, r, o) {
            r || (r = "http");
            var i, a = t.match(/^ddp(i?)\+sockjs:\/\//), s = t.match(/^http(s?):\/\//);
            if (a) {
                var u = t.substr(a[0].length);
                i = "i" === a[1] ? r : r + "s";
                var c = u.indexOf("/"), d = -1 === c ? u : u.substr(0, c), p = -1 === c ? "" : u.substr(c);
                return d = d.replace(/\*/g, function () {
                    return Math.floor(10 * f.fraction())
                }), i + "://" + d + p
            }
            if (s) {
                i = s[1] ? r + "s" : r;
                var h = t.substr(s[0].length);
                t = i + "://" + h
            }
            return-1 !== t.indexOf("://") || e(t, "/") || (t = r + "://" + t), t = l._relativeToSiteRootUrl(t), n(t, "/") ? t + o : t + "/" + o
        };
        r = function (e) {
            return i(e, "http", "sockjs")
        }, o = function (e) {
            var t = i(e, "ws", "websocket");
            return t
        }, t.toSockjsUrl = r, h.extend(t.ClientStream.prototype, {on: function (e, t) {
            var n = this;
            if ("message" !== e && "reset" !== e)throw new Error("unknown event type: " + e);
            n.eventCallbacks[e] || (n.eventCallbacks[e] = []), n.eventCallbacks[e].push(t)
        }, _initCommon: function () {
            var e = this;
            e.CONNECT_TIMEOUT = 1e4, e.eventCallbacks = {}, e._forcedToDisconnect = !1, e.currentStatus = {status: "connecting", connected: !1, retryCount: 0}, e.statusListeners = "undefined" != typeof g && new g.Dependency, e.statusChanged = function () {
                e.statusListeners && e.statusListeners.changed()
            }, e._retry = new m, e.connectionTimer = null
        }, reconnect: function (e) {
            var t = this;
            return e = e || {}, e.url && t._changeUrl(e.url), t.currentStatus.connected ? ((e._force || e.url) && t._lostConnection(), void 0) : ("connecting" === t.currentStatus.status && t._lostConnection(), t._retry.clear(), t.currentStatus.retryCount -= 1, t._retryNow(), void 0)
        }, disconnect: function (e) {
            var t = this;
            e = e || {}, t._forcedToDisconnect || (e._permanent && (t._forcedToDisconnect = !0), t._cleanup(), t._retry.clear(), t.currentStatus = {status: e._permanent ? "failed" : "offline", connected: !1, retryCount: 0}, e._permanent && e._error && (t.currentStatus.reason = e._error), t.statusChanged())
        }, _lostConnection: function () {
            var e = this;
            e._cleanup(), e._retryLater()
        }, _online: function () {
            "offline" != this.currentStatus.status && this.reconnect()
        }, _retryLater: function () {
            var e = this, t = 0;
            e.options.retry && (t = e._retry.retryLater(e.currentStatus.retryCount, h.bind(e._retryNow, e))), e.currentStatus.status = "waiting", e.currentStatus.connected = !1, e.currentStatus.retryTime = (new Date).getTime() + t, e.statusChanged()
        }, _retryNow: function () {
            var e = this;
            e._forcedToDisconnect || (e.currentStatus.retryCount += 1, e.currentStatus.status = "connecting", e.currentStatus.connected = !1, delete e.currentStatus.retryTime, e.statusChanged(), e._launchConnection())
        }, status: function () {
            var e = this;
            return e.statusListeners && e.statusListeners.depend(), e.currentStatus
        }})
    }.call(this), function () {
        e = {}, i = ["pre1"], t.SUPPORTED_DDP_VERSIONS = i, a = function (e) {
            this.isSimulation = e.isSimulation, this._unblock = e.unblock || function () {
            }, this._calledUnblock = !1, this.userId = e.userId, this._setUserId = e.setUserId || function () {
            }, this.connection = e.connection
        }, h.extend(a.prototype, {unblock: function () {
            var e = this;
            e._calledUnblock = !0, e._unblock()
        }, setUserId: function (e) {
            var t = this;
            if (t._calledUnblock)throw new Error("Can't call setUserId in a method after calling unblock");
            t.userId = e, t._setUserId(e)
        }}), s = function (e) {
            try {
                var t = p.parse(e)
            } catch (n) {
                return l._debug("Discarding message with invalid JSON", e), null
            }
            return null === t || "object" != typeof t ? (l._debug("Discarding non-object DDP message", e), null) : (h.has(t, "cleared") && (h.has(t, "fields") || (t.fields = {}), h.each(t.cleared, function (e) {
                t.fields[e] = void 0
            }), delete t.cleared), h.each(["fields", "params", "result"], function (e) {
                h.has(t, e) && (t[e] = d._adjustTypesFromJSONValue(t[e]))
            }), t)
        }, u = function (e) {
            var t = d.clone(e);
            if (h.has(e, "fields")) {
                var n = [];
                h.each(e.fields, function (e, r) {
                    void 0 === e && (n.push(r), delete t.fields[r])
                }), h.isEmpty(n) || (t.cleared = n), h.isEmpty(t.fields) && delete t.fields
            }
            if (h.each(["fields", "params", "result"], function (e) {
                h.has(t, e) && (t[e] = d._adjustTypesToJSONValue(t[e]))
            }), e.id && "string" != typeof e.id)throw new Error("Message id is not a string");
            return p.stringify(t)
        }, e._CurrentInvocation = new l.EnvironmentVariable
    }.call(this), function () {
        if (l.isServer)var n = Npm.require("path"), r = (Npm.require("fibers"), Npm.require(n.join("fibers", "future")));
        var o = function (e, n) {
            var r = this;
            n = h.extend({onConnected: function () {
            }, onDDPVersionNegotiationFailure: function (e) {
                l._debug(e)
            }, reloadWithOutstanding: !1, supportedDDPVersions: i, retry: !0}, n), r.onReconnect = null, r._stream = "object" == typeof e ? e : new t.ClientStream(e, {retry: n.retry}), r._lastSessionId = null, r._versionSuggestion = null, r._version = null, r._stores = {}, r._methodHandlers = {}, r._nextMethodId = 1, r._supportedDDPVersions = n.supportedDDPVersions, r._methodInvokers = {}, r._outstandingMethodBlocks = [], r._documentsWrittenByStub = {}, r._serverDocuments = {}, r._afterUpdateCallbacks = [], r._messagesBufferedUntilQuiescence = [], r._methodsBlockingQuiescence = {}, r._subsBeingRevived = {}, r._resetStores = !1, r._updatesForUnknownStores = {}, r._retryMigrate = null, r._subscriptions = {}, r._userId = null, r._userIdDeps = "undefined" != typeof g && new g.Dependency, l.isClient && Package.reload && !n.reloadWithOutstanding && Package.reload.Reload._onMigrate(function (e) {
                if (r._readyToMigrate())return[!0];
                if (r._retryMigrate)throw new Error("Two migrations in progress?");
                return r._retryMigrate = e, !1
            });
            var o = function (e) {
                try {
                    var t = s(e)
                } catch (o) {
                    return l._debug("Exception while parsing DDP", o), void 0
                }
                if (null === t || !t.msg)return t && t.server_id || l._debug("discarding invalid livedata message", t), void 0;
                if ("connected" === t.msg)r._version = r._versionSuggestion, n.onConnected(), r._livedata_connected(t); else if ("failed" == t.msg)if (h.contains(r._supportedDDPVersions, t.version))r._versionSuggestion = t.version, r._stream.reconnect({_force: !0}); else {
                    var i = "DDP version negotiation failed; server requested version " + t.version;
                    r._stream.disconnect({_permanent: !0, _error: i}), n.onDDPVersionNegotiationFailure(i)
                } else h.include(["added", "changed", "removed", "ready", "updated"], t.msg) ? r._livedata_data(t) : "nosub" === t.msg ? r._livedata_nosub(t) : "result" === t.msg ? r._livedata_result(t) : "error" === t.msg ? r._livedata_error(t) : l._debug("discarding unknown livedata message type", t)
            }, a = function () {
                var e = {msg: "connect"};
                r._lastSessionId && (e.session = r._lastSessionId), e.version = r._versionSuggestion || r._supportedDDPVersions[0], r._versionSuggestion = e.version, e.support = r._supportedDDPVersions, r._send(e), !h.isEmpty(r._outstandingMethodBlocks) && h.isEmpty(r._outstandingMethodBlocks[0].methods) && r._outstandingMethodBlocks.shift(), h.each(r._methodInvokers, function (e) {
                    e.sentMessage = !1
                }), r.onReconnect ? r._callOnReconnectAndSendAppropriateOutstandingMethods() : r._sendOutstandingMethods(), h.each(r._subscriptions, function (e, t) {
                    r._send({msg: "sub", id: t, name: e.name, params: e.params})
                })
            };
            l.isServer ? (r._stream.on("message", l.bindEnvironment(o, l._debug)), r._stream.on("reset", l.bindEnvironment(a, l._debug))) : (r._stream.on("message", o), r._stream.on("reset", a))
        }, m = function (e) {
            var t = this;
            t.methodId = e.methodId, t.sentMessage = !1, t._callback = e.callback, t._connection = e.connection, t._message = e.message, t._onResultReceived = e.onResultReceived || function () {
            }, t._wait = e.wait, t._methodResult = null, t._dataVisible = !1, t._connection._methodInvokers[t.methodId] = t
        };
        h.extend(m.prototype, {sendMessage: function () {
            var e = this;
            if (e.gotResult())throw new Error("sendingMethod is called on method with result");
            e._dataVisible = !1, e.sentMessage = !0, e._wait && (e._connection._methodsBlockingQuiescence[e.methodId] = !0), e._connection._send(e._message)
        }, _maybeInvokeCallback: function () {
            var e = this;
            e._methodResult && e._dataVisible && (e._callback(e._methodResult[0], e._methodResult[1]), delete e._connection._methodInvokers[e.methodId], e._connection._outstandingMethodFinished())
        }, receiveResult: function (e, t) {
            var n = this;
            if (n.gotResult())throw new Error("Methods should only receive results once");
            n._methodResult = [e, t], n._onResultReceived(e, t), n._maybeInvokeCallback()
        }, dataVisible: function () {
            var e = this;
            e._dataVisible = !0, e._maybeInvokeCallback()
        }, gotResult: function () {
            var e = this;
            return!!e._methodResult
        }}), h.extend(o.prototype, {registerStore: function (e, t) {
            var n = this;
            if (e in n._stores)return!1;
            var r = {};
            h.each(["update", "beginUpdate", "endUpdate", "saveOriginals", "retrieveOriginals"], function (e) {
                r[e] = function () {
                    return t[e] ? t[e].apply(t, arguments) : void 0
                }
            }), n._stores[e] = r;
            var o = n._updatesForUnknownStores[e];
            return o && (r.beginUpdate(o.length, !1), h.each(o, function (e) {
                r.update(e)
            }), r.endUpdate(), delete n._updatesForUnknownStores[e]), !0
        }, subscribe: function (e) {
            var t = this, n = Array.prototype.slice.call(arguments, 1), r = {};
            if (n.length) {
                var o = n[n.length - 1];
                "function" == typeof o ? r.onReady = n.pop() : !o || "function" != typeof o.onReady && "function" != typeof o.onError || (r = n.pop())
            }
            var i, a = h.find(t._subscriptions, function (t) {
                return t.inactive && t.name === e && d.equals(t.params, n)
            });
            a ? (i = a.id, a.inactive = !1, r.onReady && (a.ready || (a.readyCallback = r.onReady)), r.onError && (a.errorCallback = r.onError)) : (i = f.id(), t._subscriptions[i] = {id: i, name: e, params: n, inactive: !1, ready: !1, readyDeps: "undefined" != typeof g && new g.Dependency, readyCallback: r.onReady, errorCallback: r.onError}, t._send({msg: "sub", id: i, name: e, params: n}));
            var s = {stop: function () {
                h.has(t._subscriptions, i) && (t._send({msg: "unsub", id: i}), delete t._subscriptions[i])
            }, ready: function () {
                if (!h.has(t._subscriptions, i))return!1;
                var e = t._subscriptions[i];
                return e.readyDeps && e.readyDeps.depend(), e.ready
            }};
            return g.active && g.onInvalidate(function () {
                h.has(t._subscriptions, i) && (t._subscriptions[i].inactive = !0), g.afterFlush(function () {
                    h.has(t._subscriptions, i) && t._subscriptions[i].inactive && s.stop()
                })
            }), s
        }, _subscribeAndWait: function (e, t, n) {
            var o = this, i = new r, a = !1;
            t = t || [], t.push({onReady: function () {
                a = !0, i["return"]()
            }, onError: function (e) {
                a ? n && n.onLateError && n.onLateError(e) : i["throw"](e)
            }}), o.subscribe.apply(o, [e].concat(t)), i.wait()
        }, methods: function (e) {
            var t = this;
            h.each(e, function (e, n) {
                if (t._methodHandlers[n])throw new Error("A method named '" + n + "' is already defined");
                t._methodHandlers[n] = e
            })
        }, call: function (e) {
            var t = Array.prototype.slice.call(arguments, 1);
            if (t.length && "function" == typeof t[t.length - 1])var n = t.pop();
            return this.apply(e, t, n)
        }, apply: function (t, n, o, i) {
            var s = this;
            i || "function" != typeof o || (i = o, o = {}), o = o || {}, i && (i = l.bindEnvironment(i, "delivering result of invoking '" + t + "'"));
            var u = function () {
                var e;
                return function () {
                    return void 0 === e && (e = "" + s._nextMethodId++), e
                }
            }(), c = e._CurrentInvocation.get(), f = c && c.isSimulation, p = s._methodHandlers[t];
            if (p) {
                var g = function (e) {
                    s.setUserId(e)
                }, v = new a({isSimulation: !0, userId: s.userId(), setUserId: g});
                f || s._saveOriginals();
                try {
                    var y = e._CurrentInvocation.withValue(v, function () {
                        return l.isServer ? l._noYieldsAllowed(function () {
                            return p.apply(v, d.clone(n))
                        }) : p.apply(v, d.clone(n))
                    })
                } catch (_) {
                    var b = _
                }
                f || s._retrieveAndStoreOriginals(u())
            }
            if (f) {
                if (i)return i(b, y), void 0;
                if (b)throw b;
                return y
            }
            if (b && !b.expected && l._debug("Exception while simulating the effect of invoking '" + t + "'", b, b.stack), !i)if (l.isClient)i = function () {
            }; else {
                var w = new r;
                i = w.resolver()
            }
            var x = new m({methodId: u(), callback: i, connection: s, onResultReceived: o.onResultReceived, wait: !!o.wait, message: {msg: "method", method: t, params: n, id: u()}});
            return o.wait ? s._outstandingMethodBlocks.push({wait: !0, methods: [x]}) : ((h.isEmpty(s._outstandingMethodBlocks) || h.last(s._outstandingMethodBlocks).wait) && s._outstandingMethodBlocks.push({wait: !1, methods: []}), h.last(s._outstandingMethodBlocks).methods.push(x)), 1 === s._outstandingMethodBlocks.length && x.sendMessage(), w ? w.wait() : void 0
        }, _saveOriginals: function () {
            var e = this;
            h.each(e._stores, function (e) {
                e.saveOriginals()
            })
        }, _retrieveAndStoreOriginals: function (e) {
            var t = this;
            if (t._documentsWrittenByStub[e])throw new Error("Duplicate methodId in _retrieveAndStoreOriginals");
            var n = [];
            h.each(t._stores, function (r, o) {
                var i = r.retrieveOriginals();
                i && i.forEach(function (r, i) {
                    n.push({collection: o, id: i}), h.has(t._serverDocuments, o) || (t._serverDocuments[o] = new v._IdMap);
                    var a = t._serverDocuments[o].setDefault(i, {});
                    a.writtenByStubs ? a.writtenByStubs[e] = !0 : (a.document = r, a.flushCallbacks = [], a.writtenByStubs = {}, a.writtenByStubs[e] = !0)
                })
            }), h.isEmpty(n) || (t._documentsWrittenByStub[e] = n)
        }, _unsubscribeAll: function () {
            var e = this;
            h.each(h.clone(e._subscriptions), function (t, n) {
                "meteor_autoupdate_clientVersions" !== t.name && (e._send({msg: "unsub", id: n}), delete e._subscriptions[n])
            })
        }, _send: function (e) {
            var t = this;
            t._stream.send(u(e))
        }, status: function () {
            var e = this;
            return e._stream.status.apply(e._stream, arguments)
        }, reconnect: function () {
            var e = this;
            return e._stream.reconnect.apply(e._stream, arguments)
        }, disconnect: function () {
            var e = this;
            return e._stream.disconnect.apply(e._stream, arguments)
        }, close: function () {
            var e = this;
            return e._stream.disconnect({_permanent: !0})
        }, userId: function () {
            var e = this;
            return e._userIdDeps && e._userIdDeps.depend(), e._userId
        }, setUserId: function (e) {
            var t = this;
            t._userId !== e && (t._userId = e, t._userIdDeps && t._userIdDeps.changed())
        }, _waitingForQuiescence: function () {
            var e = this;
            return!h.isEmpty(e._subsBeingRevived) || !h.isEmpty(e._methodsBlockingQuiescence)
        }, _anyMethodsAreOutstanding: function () {
            var e = this;
            return h.any(h.pluck(e._methodInvokers, "sentMessage"))
        }, _livedata_connected: function (e) {
            var t = this;
            if (t._lastSessionId && (t._resetStores = !0), "string" == typeof e.session) {
                var n = t._lastSessionId === e.session;
                t._lastSessionId = e.session
            }
            n || (t._updatesForUnknownStores = {}, t._resetStores && (t._documentsWrittenByStub = {}, t._serverDocuments = {}), t._afterUpdateCallbacks = [], t._subsBeingRevived = {}, h.each(t._subscriptions, function (e, n) {
                e.ready && (t._subsBeingRevived[n] = !0)
            }), t._methodsBlockingQuiescence = {}, t._resetStores && h.each(t._methodInvokers, function (e) {
                e.gotResult() ? t._afterUpdateCallbacks.push(h.bind(e.dataVisible, e)) : e.sentMessage && (t._methodsBlockingQuiescence[e.methodId] = !0)
            }), t._messagesBufferedUntilQuiescence = [], t._waitingForQuiescence() || (t._resetStores && (h.each(t._stores, function (e) {
                e.beginUpdate(0, !0), e.endUpdate()
            }), t._resetStores = !1), t._runAfterUpdateCallbacks()))
        }, _processOneDataMessage: function (e, t) {
            var n = this;
            n["_process_" + e.msg](e, t)
        }, _livedata_data: function (e) {
            var t = this, n = {};
            if (t._waitingForQuiescence()) {
                if (t._messagesBufferedUntilQuiescence.push(e), "nosub" === e.msg && delete t._subsBeingRevived[e.id], h.each(e.subs || [], function (e) {
                    delete t._subsBeingRevived[e]
                }), h.each(e.methods || [], function (e) {
                    delete t._methodsBlockingQuiescence[e]
                }), t._waitingForQuiescence())return;
                h.each(t._messagesBufferedUntilQuiescence, function (e) {
                    t._processOneDataMessage(e, n)
                }), t._messagesBufferedUntilQuiescence = []
            } else t._processOneDataMessage(e, n);
            (t._resetStores || !h.isEmpty(n)) && (h.each(t._stores, function (e, r) {
                e.beginUpdate(h.has(n, r) ? n[r].length : 0, t._resetStores)
            }), t._resetStores = !1, h.each(n, function (e, n) {
                var r = t._stores[n];
                r ? h.each(e, function (e) {
                    r.update(e)
                }) : (h.has(t._updatesForUnknownStores, n) || (t._updatesForUnknownStores[n] = []), Array.prototype.push.apply(t._updatesForUnknownStores[n], e))
            }), h.each(t._stores, function (e) {
                e.endUpdate()
            })), t._runAfterUpdateCallbacks()
        }, _runAfterUpdateCallbacks: function () {
            var e = this, t = e._afterUpdateCallbacks;
            e._afterUpdateCallbacks = [], h.each(t, function (e) {
                e()
            })
        }, _pushUpdate: function (e, t, n) {
            h.has(e, t) || (e[t] = []), e[t].push(n)
        }, _getServerDoc: function (e, t) {
            var n = this;
            if (!h.has(n._serverDocuments, e))return null;
            var r = n._serverDocuments[e];
            return r.get(t) || null
        }, _process_added: function (e, t) {
            var n = this, r = v._idParse(e.id), o = n._getServerDoc(e.collection, r);
            if (o) {
                if (void 0 !== o.document)throw new Error("Server sent add for existing id: " + e.id);
                o.document = e.fields || {}, o.document._id = r
            } else n._pushUpdate(t, e.collection, e)
        }, _process_changed: function (e, t) {
            var n = this, r = n._getServerDoc(e.collection, v._idParse(e.id));
            if (r) {
                if (void 0 === r.document)throw new Error("Server sent changed for nonexisting id: " + e.id);
                v._applyChanges(r.document, e.fields)
            } else n._pushUpdate(t, e.collection, e)
        }, _process_removed: function (e, t) {
            var n = this, r = n._getServerDoc(e.collection, v._idParse(e.id));
            if (r) {
                if (void 0 === r.document)throw new Error("Server sent removed for nonexisting id:" + e.id);
                r.document = void 0
            } else n._pushUpdate(t, e.collection, {msg: "removed", collection: e.collection, id: e.id})
        }, _process_updated: function (e, t) {
            var n = this;
            h.each(e.methods, function (e) {
                h.each(n._documentsWrittenByStub[e], function (r) {
                    var o = n._getServerDoc(r.collection, r.id);
                    if (!o)throw new Error("Lost serverDoc for " + p.stringify(r));
                    if (!o.writtenByStubs[e])throw new Error("Doc " + p.stringify(r) + " not written by  method " + e);
                    delete o.writtenByStubs[e], h.isEmpty(o.writtenByStubs) && (n._pushUpdate(t, r.collection, {msg: "replace", id: v._idStringify(r.id), replace: o.document}), h.each(o.flushCallbacks, function (e) {
                        e()
                    }), n._serverDocuments[r.collection].remove(r.id))
                }), delete n._documentsWrittenByStub[e];
                var r = n._methodInvokers[e];
                if (!r)throw new Error("No callback invoker for method " + e);
                n._runWhenAllServerDocsAreFlushed(h.bind(r.dataVisible, r))
            })
        }, _process_ready: function (e) {
            var t = this;
            h.each(e.subs, function (e) {
                t._runWhenAllServerDocsAreFlushed(function () {
                    var n = t._subscriptions[e];
                    n && (n.ready || (n.readyCallback && n.readyCallback(), n.ready = !0, n.readyDeps && n.readyDeps.changed()))
                })
            })
        }, _runWhenAllServerDocsAreFlushed: function (e) {
            var t = this, n = function () {
                t._afterUpdateCallbacks.push(e)
            }, r = 0, o = function () {
                --r, 0 === r && n()
            };
            h.each(t._serverDocuments, function (e) {
                e.forEach(function (e) {
                    var n = h.any(e.writtenByStubs, function (e, n) {
                        var r = t._methodInvokers[n];
                        return r && r.sentMessage
                    });
                    n && (++r, e.flushCallbacks.push(o))
                })
            }), 0 === r && n()
        }, _livedata_nosub: function (e) {
            var t = this;
            if (t._livedata_data(e), h.has(t._subscriptions, e.id)) {
                var n = t._subscriptions[e.id].errorCallback;
                delete t._subscriptions[e.id], n && e.error && n(new l.Error(e.error.error, e.error.reason, e.error.details))
            }
        }, _process_nosub: function () {
        }, _livedata_result: function (e) {
            var t = this;
            if (h.isEmpty(t._outstandingMethodBlocks))return l._debug("Received method result but no methods outstanding"), void 0;
            for (var n, r = t._outstandingMethodBlocks[0].methods, o = 0; o < r.length && (n = r[o], n.methodId !== e.id); o++);
            return n ? (r.splice(o, 1), h.has(e, "error") ? n.receiveResult(new l.Error(e.error.error, e.error.reason, e.error.details)) : n.receiveResult(void 0, e.result), void 0) : (l._debug("Can't match method response to original method call", e), void 0)
        }, _outstandingMethodFinished: function () {
            var e = this;
            if (!e._anyMethodsAreOutstanding()) {
                if (!h.isEmpty(e._outstandingMethodBlocks)) {
                    var t = e._outstandingMethodBlocks.shift();
                    if (!h.isEmpty(t.methods))throw new Error("No methods outstanding but nonempty block: " + p.stringify(t));
                    h.isEmpty(e._outstandingMethodBlocks) || e._sendOutstandingMethods()
                }
                e._maybeMigrate()
            }
        }, _sendOutstandingMethods: function () {
            var e = this;
            h.isEmpty(e._outstandingMethodBlocks) || h.each(e._outstandingMethodBlocks[0].methods, function (e) {
                e.sendMessage()
            })
        }, _livedata_error: function (e) {
            l._debug("Received error from server: ", e.reason), e.offendingMessage && l._debug("For: ", e.offendingMessage)
        }, _callOnReconnectAndSendAppropriateOutstandingMethods: function () {
            var e = this, t = e._outstandingMethodBlocks;
            if (e._outstandingMethodBlocks = [], e.onReconnect(), !h.isEmpty(t)) {
                if (h.isEmpty(e._outstandingMethodBlocks))return e._outstandingMethodBlocks = t, e._sendOutstandingMethods(), void 0;
                h.last(e._outstandingMethodBlocks).wait || t[0].wait || (h.each(t[0].methods, function (t) {
                    h.last(e._outstandingMethodBlocks).methods.push(t), 1 === e._outstandingMethodBlocks.length && t.sendMessage()
                }), t.shift()), h.each(t, function (t) {
                    e._outstandingMethodBlocks.push(t)
                })
            }
        }, _readyToMigrate: function () {
            var e = this;
            return h.isEmpty(e._methodInvokers)
        }, _maybeMigrate: function () {
            var e = this;
            e._retryMigrate && e._readyToMigrate() && (e._retryMigrate(), e._retryMigrate = null)
        }}), t.Connection = o, e.connect = function (e, t) {
            var n = new o(e, t);
            return c.push(n), n
        }, c = [], e._allSubscriptionsReady = function () {
            return h.all(c, function (e) {
                return h.all(e._subscriptions, function (e) {
                    return e.ready
                })
            })
        }
    }.call(this), function () {
        if (l.refresh = function () {
        }, l.isClient) {
            var t = "/";
            "undefined" != typeof __meteor_runtime_config__ && __meteor_runtime_config__.DDP_DEFAULT_CONNECTION_URL && (t = __meteor_runtime_config__.DDP_DEFAULT_CONNECTION_URL);
            var n = new m, r = function (e) {
                if (l._debug(e), Package.reload) {
                    var t = Package.reload.Reload._migrationData("livedata") || {}, r = t.DDPVersionNegotiationFailures || 0;
                    ++r, Package.reload.Reload._onMigrate("livedata", function () {
                        return[!0, {DDPVersionNegotiationFailures: r}]
                    }), n.retryLater(r, function () {
                        Package.reload.Reload._reload()
                    })
                }
            };
            l.connection = e.connect(t, {onDDPVersionNegotiationFailure: r}), h.each(["subscribe", "methods", "call", "apply", "status", "reconnect", "disconnect"], function (e) {
                l[e] = h.bind(l.connection[e], l.connection)
            })
        } else l.connection = null;
        l.default_connection = l.connection, l.connect = e.connect
    }.call(this), "undefined" == typeof Package && (Package = {}), Package.livedata = {DDP: e, LivedataTest: t}
}(), function () {
    {
        var e;
        Package.meteor.Meteor, Package.logging.Log, Package.underscore._, Package.livedata.DDP, Package.ejson.EJSON
    }
    "undefined" == typeof Package && (Package = {}), Package["follower-livedata"] = {Follower: e}
}(), function () {
    Package.meteor.Meteor, Package.logging.Log, Package.underscore._, Package.livedata.DDP, Package.ejson.EJSON, Package["follower-livedata"].Follower;
    "undefined" == typeof Package && (Package = {}), Package["application-configuration"] = {}
}(), function () {
    Package.meteor.Meteor;
    "undefined" == typeof Package && (Package = {}), Package.insecure = {}
}(), function () {
    var e, t = Package.meteor.Meteor, n = Package.random.Random, r = Package.ejson.EJSON, o = (Package.json.JSON, Package.underscore._), i = Package.minimongo.LocalCollection, a = (Package.minimongo.Minimongo, Package.logging.Log, Package.livedata.DDP), s = (Package.deps.Deps, Package.check.check), u = Package.check.Match;
    (function () {
        e = function () {
            var e = this;
            e.noConnCollections = {}
        };
        var t = function (e, t) {
            return e in t || (t[e] = new i({name: e})), t[e]
        };
        o.extend(e.prototype, {open: function (e, n) {
            var r = this;
            return e ? n ? (n._mongo_livedata_collections || (n._mongo_livedata_collections = {}), t(e, n._mongo_livedata_collections)) : t(e, r.noConnCollections) : new i
        }}), e = new e
    }).call(this), function () {
        t.Collection = function (r, a) {
            var s = this;
            if (!(s instanceof t.Collection))throw new Error('use "new" to construct a Meteor.Collection');
            switch (a && a.methods && (a = {connection: a}), a && a.manager && !a.connection && (a.connection = a.manager), a = o.extend({connection: void 0, idGeneration: "STRING", transform: null, _driver: void 0, _preventAutopublish: !1}, a), a.idGeneration) {
                case"MONGO":
                    s._makeNewID = function () {
                        return new t.Collection.ObjectID
                    };
                    break;
                case"STRING":
                default:
                    s._makeNewID = function () {
                        return n.id()
                    }
            }
            if (s._transform = i.wrapTransform(a.transform), r || null === r || t._debug("Warning: creating anonymous collection. It will not be saved or synchronized over the network. (Pass null for the collection name to turn off this warning.)"), s._connection = r && null !== a.connection ? a.connection ? a.connection : t.isClient ? t.connection : t.server : null, a._driver || (a._driver = r && s._connection === t.server && "undefined" != typeof MongoInternals && MongoInternals.defaultRemoteCollectionDriver ? MongoInternals.defaultRemoteCollectionDriver() : e), s._collection = a._driver.open(r, s._connection), s._name = r, s._connection && s._connection.registerStore) {
                var u = s._connection.registerStore(r, {beginUpdate: function (e, t) {
                    (e > 1 || t) && s._collection.pauseObservers(), t && s._collection.remove({})
                }, update: function (e) {
                    var t = i._idParse(e.id), n = s._collection.findOne(t);
                    if ("replace" === e.msg) {
                        var r = e.replace;
                        return r ? n ? s._collection.update(t, r) : s._collection.insert(r) : n && s._collection.remove(t), void 0
                    }
                    if ("added" === e.msg) {
                        if (n)throw new Error("Expected not to find a document already present for an add");
                        s._collection.insert(o.extend({_id: t}, e.fields))
                    } else if ("removed" === e.msg) {
                        if (!n)throw new Error("Expected to find a document already present for removed");
                        s._collection.remove(t)
                    } else {
                        if ("changed" !== e.msg)throw new Error("I don't know how to deal with this message");
                        if (!n)throw new Error("Expected to find a document to change");
                        if (!o.isEmpty(e.fields)) {
                            var a = {};
                            o.each(e.fields, function (e, t) {
                                void 0 === e ? (a.$unset || (a.$unset = {}), a.$unset[t] = 1) : (a.$set || (a.$set = {}), a.$set[t] = e)
                            }), s._collection.update(t, a)
                        }
                    }
                }, endUpdate: function () {
                    s._collection.resumeObservers()
                }, saveOriginals: function () {
                    s._collection.saveOriginals()
                }, retrieveOriginals: function () {
                    return s._collection.retrieveOriginals()
                }});
                if (!u)throw new Error("There is already a collection named '" + r + "'")
            }
            s._defineMutationMethods(), Package.autopublish && !a._preventAutopublish && s._connection && s._connection.publish && s._connection.publish(null, function () {
                return s.find()
            }, {is_auto: !0})
        }, o.extend(t.Collection.prototype, {_getFindSelector: function (e) {
            return 0 == e.length ? {} : e[0]
        }, _getFindOptions: function (e) {
            var t = this;
            return e.length < 2 ? {transform: t._transform} : o.extend({transform: t._transform}, e[1])
        }, find: function () {
            var e = this, t = o.toArray(arguments);
            return e._collection.find(e._getFindSelector(t), e._getFindOptions(t))
        }, findOne: function () {
            var e = this, t = o.toArray(arguments);
            return e._collection.findOne(e._getFindSelector(t), e._getFindOptions(t))
        }}), t.Collection._publishCursor = function (e, t, n) {
            var r = e.observeChanges({added: function (e, r) {
                t.added(n, e, r)
            }, changed: function (e, r) {
                t.changed(n, e, r)
            }, removed: function (e) {
                t.removed(n, e)
            }});
            t.onStop(function () {
                r.stop()
            })
        }, t.Collection._rewriteSelector = function (e) {
            if (i._selectorIsId(e) && (e = {_id: e}), !e || "_id"in e && !e._id)return{_id: n.id()};
            var r = {};
            return o.each(e, function (e, n) {
                e instanceof RegExp ? r[n] = c(e) : e && e.$regex instanceof RegExp ? (r[n] = c(e.$regex), void 0 !== e.$options && (r[n].$options = e.$options)) : r[n] = o.contains(["$or", "$and", "$nor"], n) ? o.map(e, function (e) {
                    return t.Collection._rewriteSelector(e)
                }) : e
            }), r
        };
        var c = function (e) {
            s(e, RegExp);
            var t = {$regex: e.source}, n = "";
            return e.ignoreCase && (n += "i"), e.multiline && (n += "m"), n && (t.$options = n), t
        }, l = function (e, n) {
            if (!i._selectorIsIdPerhapsAsObject(e))throw new t.Error(403, "Not permitted. Untrusted code may only " + n + " documents by ID.")
        };
        o.each(["insert", "update", "remove"], function (e) {
            t.Collection.prototype[e] = function () {
                var n, r, i, s = this, u = o.toArray(arguments);
                if (u.length && u[u.length - 1]instanceof Function && (n = u.pop()), "insert" === e) {
                    if (!u.length)throw new Error("insert requires an argument");
                    if (u[0] = o.extend({}, u[0]), "_id"in u[0]) {
                        if (r = u[0]._id, !r || !("string" == typeof r || r instanceof t.Collection.ObjectID))throw new Error("Meteor requires document _id fields to be non-empty strings or ObjectIDs")
                    } else r = u[0]._id = s._makeNewID()
                } else if (u[0] = t.Collection._rewriteSelector(u[0]), "update" === e) {
                    var c = u[2] = o.clone(u[2]) || {};
                    if (c && "function" != typeof c && c.upsert)if (c.insertedId) {
                        if (!("string" == typeof c.insertedId || c.insertedId instanceof t.Collection.ObjectID))throw new Error("insertedId must be string or ObjectID")
                    } else c.insertedId = s._makeNewID()
                }
                var f, d = function (t) {
                    return"insert" === e ? r : t
                };
                if (n && (f = function (e, t) {
                    n(e, !e && d(t))
                }), s._connection && s._connection !== t.server) {
                    var p = a._CurrentInvocation.get(), h = p && p.isSimulation;
                    !t.isClient || f || h || (f = function (n) {
                        n && t._debug(e + " failed: " + (n.reason || n.stack))
                    }), h || "insert" === e || l(u[0], e), i = d(s._connection.apply(s._prefix + e, u, f))
                } else {
                    u.push(f);
                    try {
                        var g = s._collection[e].apply(s._collection, u);
                        i = d(g)
                    } catch (m) {
                        if (n)return n(m), null;
                        throw m
                    }
                }
                return i
            }
        }), t.Collection.prototype.upsert = function (e, t, n, r) {
            var i = this;
            return r || "function" != typeof n || (r = n, n = {}), i.update(e, t, o.extend({}, n, {_returnObject: !0, upsert: !0}), r)
        }, t.Collection.prototype._ensureIndex = function (e, t) {
            var n = this;
            if (!n._collection._ensureIndex)throw new Error("Can only call _ensureIndex on server collections");
            n._collection._ensureIndex(e, t)
        }, t.Collection.prototype._dropIndex = function (e) {
            var t = this;
            if (!t._collection._dropIndex)throw new Error("Can only call _dropIndex on server collections");
            t._collection._dropIndex(e)
        }, t.Collection.prototype._dropCollection = function () {
            var e = this;
            if (!e._collection.dropCollection)throw new Error("Can only call _dropCollection on server collections");
            e._collection.dropCollection()
        }, t.Collection.prototype._createCappedCollection = function (e) {
            var t = this;
            if (!t._collection._createCappedCollection)throw new Error("Can only call _createCappedCollection on server collections");
            t._collection._createCappedCollection(e)
        }, t.Collection.ObjectID = i._ObjectID, function () {
            var e = function (e, t) {
                var n = ["insert", "update", "remove", "fetch", "transform"];
                o.each(o.keys(t), function (t) {
                    if (!o.contains(n, t))throw new Error(e + ": Invalid key: " + t)
                });
                var r = this;
                if (r._restricted = !0, o.each(["insert", "update", "remove"], function (n) {
                    if (t[n]) {
                        if (!(t[n]instanceof Function))throw new Error(e + ": Value for `" + n + "` must be a function");
                        t[n].transform = void 0 === t.transform ? r._transform : i.wrapTransform(t.transform), r._validators[n][e].push(t[n])
                    }
                }), t.update || t.remove || t.fetch) {
                    if (t.fetch && !(t.fetch instanceof Array))throw new Error(e + ": Value for `fetch` must be an array");
                    r._updateFetch(t.fetch)
                }
            };
            t.Collection.prototype.allow = function (t) {
                e.call(this, "allow", t)
            }, t.Collection.prototype.deny = function (t) {
                e.call(this, "deny", t)
            }
        }(), t.Collection.prototype._defineMutationMethods = function () {
            var e = this;
            if (e._restricted = !1, e._insecure = void 0, e._validators = {insert: {allow: [], deny: []}, update: {allow: [], deny: []}, remove: {allow: [], deny: []}, upsert: {allow: [], deny: []}, fetch: [], fetchAllFields: !1}, e._name && (e._prefix = "/" + e._name + "/", e._connection)) {
                var n = {};
                o.each(["insert", "update", "remove"], function (r) {
                    n[e._prefix + r] = function () {
                        s(arguments, [u.Any]);
                        try {
                            if (this.isSimulation)return e._collection[r].apply(e._collection, o.toArray(arguments));
                            if ("insert" !== r && l(arguments[0], r), e._restricted) {
                                if (0 === e._validators[r].allow.length)throw new t.Error(403, "Access denied. No allow validators set on restricted collection for method '" + r + "'.");
                                var n = "_validated" + r.charAt(0).toUpperCase() + r.slice(1), i = [this.userId].concat(o.toArray(arguments));
                                return e[n].apply(e, i)
                            }
                            if (e._isInsecure())return e._collection[r].apply(e._collection, o.toArray(arguments));
                            throw new t.Error(403, "Access denied")
                        } catch (a) {
                            throw"MongoError" === a.name || "MinimongoError" === a.name ? new t.Error(409, a.toString()) : a
                        }
                    }
                }), (t.isClient || e._connection === t.server) && e._connection.methods(n)
            }
        }, t.Collection.prototype._updateFetch = function (e) {
            var t = this;
            t._validators.fetchAllFields || (e ? t._validators.fetch = o.union(t._validators.fetch, e) : (t._validators.fetchAllFields = !0, t._validators.fetch = null))
        }, t.Collection.prototype._isInsecure = function () {
            var e = this;
            return void 0 === e._insecure ? !!Package.insecure : e._insecure
        };
        var f = function (e, t) {
            var n = t;
            return e.transform && (n = e.transform(r.clone(t))), n
        };
        t.Collection.prototype._validatedInsert = function (e, n) {
            var r = this;
            if (o.any(r._validators.insert.deny, function (t) {
                return t(e, f(t, n))
            }))throw new t.Error(403, "Access denied");
            if (o.all(r._validators.insert.allow, function (t) {
                return!t(e, f(t, n))
            }))throw new t.Error(403, "Access denied");
            r._collection.insert.call(r._collection, n)
        };
        var d = function (e, t) {
            return e.transform ? e.transform(t) : t
        };
        t.Collection.prototype._validatedUpdate = function (e, n, r, a) {
            var s = this;
            if (a = a || {}, !i._selectorIsIdPerhapsAsObject(n))throw new Error("validated update should be of a single ID");
            if (a.upsert)throw new t.Error(403, "Access denied. Upserts not allowed in a restricted collection.");
            var u = [];
            o.each(r, function (e, n) {
                if ("$" !== n.charAt(0))throw new t.Error(403, "Access denied. In a restricted collection you can only update documents, not replace them. Use a Mongo update operator, such as '$set'.");
                if (!o.has(p, n))throw new t.Error(403, "Access denied. Operator " + n + " not allowed in a restricted collection.");
                o.each(o.keys(e), function (e) {
                    -1 !== e.indexOf(".") && (e = e.substring(0, e.indexOf("."))), o.contains(u, e) || u.push(e)
                })
            });
            var c = {transform: null};
            s._validators.fetchAllFields || (c.fields = {}, o.each(s._validators.fetch, function (e) {
                c.fields[e] = 1
            }));
            var l = s._collection.findOne(n, c);
            if (!l)return 0;
            var f;
            if (o.any(s._validators.update.deny, function (t) {
                return f || (f = d(t, l)), t(e, f, u, r)
            }))throw new t.Error(403, "Access denied");
            if (o.all(s._validators.update.allow, function (t) {
                return f || (f = d(t, l)), !t(e, f, u, r)
            }))throw new t.Error(403, "Access denied");
            return s._collection.update.call(s._collection, n, r, a)
        };
        var p = {$inc: 1, $set: 1, $unset: 1, $addToSet: 1, $pop: 1, $pullAll: 1, $pull: 1, $pushAll: 1, $push: 1, $bit: 1};
        t.Collection.prototype._validatedRemove = function (e, n) {
            var r = this, i = {transform: null};
            r._validators.fetchAllFields || (i.fields = {}, o.each(r._validators.fetch, function (e) {
                i.fields[e] = 1
            }));
            var a = r._collection.findOne(n, i);
            if (!a)return 0;
            if (o.any(r._validators.remove.deny, function (t) {
                return t(e, d(t, a))
            }))throw new t.Error(403, "Access denied");
            if (o.all(r._validators.remove.allow, function (t) {
                return!t(e, d(t, a))
            }))throw new t.Error(403, "Access denied");
            return r._collection.remove.call(r._collection, n)
        }
    }.call(this), "undefined" == typeof Package && (Package = {}), Package["mongo-livedata"] = {}
}(), function () {
    {
        var e, t = Package.meteor.Meteor, n = Package.deps.Deps, r = Package.retry.Retry;
        Package.livedata.DDP
    }
    (function () {
        var o = __meteor_runtime_config__.autoupdateVersion || "unknown", i = new t.Collection("meteor_autoupdate_clientVersions");
        e = {}, e.newClientAvailable = function () {
            return!!i.findOne({$and: [
                {current: !0},
                {_id: {$ne: o}}
            ]})
        };
        var a = new r({minCount: 0, baseTimeout: 3e4}), s = 0;
        e._retrySubscription = function () {
            t.subscribe("meteor_autoupdate_clientVersions", {onError: function (n) {
                t._debug("autoupdate subscription failed:", n), s++, a.retryLater(s, function () {
                    e._retrySubscription()
                })
            }, onReady: function () {
                Package.reload && n.autorun(function (e) {
                    i.findOne({current: !0}) && !i.findOne({_id: o}) && (e.stop(), Package.reload.Reload._reload())
                })
            }})
        }, e._retrySubscription()
    }).call(this), "undefined" == typeof Package && (Package = {}), Package.autoupdate = {Autoupdate: e}
}(), function () {
    Package.meteor.Meteor, Package.reload.Reload, Package.autoupdate.Autoupdate;
    "undefined" == typeof Package && (Package = {}), Package["standard-app-packages"] = {}
}(), function () {
    Package.meteor.Meteor;
    "undefined" == typeof Package && (Package = {}), Package.autopublish = {}
}(), function () {
    var e, t = (Package.meteor.Meteor, Package.underscore._);
    (function () {
        e = {_isCssLoaded: function () {
            return t.find(document.styleSheets, function (e) {
                return e.cssText && !e.cssRules ? e.cssText.match(/_meteor_detect_css/) : t.find(e.cssRules, function (e) {
                    return"._meteor_detect_css" === e.selectorText
                })
            })
        }}
    }).call(this), "undefined" == typeof Package && (Package = {}), Package.webapp = {WebApp: e}
}(), function () {
    var e, t = Package.meteor.Meteor, n = Package.underscore._, r = Package.deps.Deps, o = Package.ejson.EJSON;
    (function () {
        var i = function (e) {
            return void 0 === e ? "undefined" : o.stringify(e)
        }, a = function (e) {
            return void 0 === e || "undefined" === e ? void 0 : o.parse(e)
        };
        e = function (e) {
            this.keys = e || {}, this.keyDeps = {}, this.keyValueDeps = {}
        }, n.extend(e.prototype, {set: function (e, t) {
            var r = this;
            t = i(t);
            var o = "undefined";
            if (n.has(r.keys, e) && (o = r.keys[e]), t !== o) {
                r.keys[e] = t;
                var a = function (e) {
                    e && e.changed()
                };
                a(r.keyDeps[e]), r.keyValueDeps[e] && (a(r.keyValueDeps[e][o]), a(r.keyValueDeps[e][t]))
            }
        }, setDefault: function (e, t) {
            var n = this;
            void 0 === n.keys[e] && n.set(e, t)
        }, get: function (e) {
            var t = this;
            return t._ensureKey(e), t.keyDeps[e].depend(), a(t.keys[e])
        }, equals: function (e, s) {
            var u = this, c = Package["mongo-livedata"] && t.Collection.ObjectID;
            if (!("string" == typeof s || "number" == typeof s || "boolean" == typeof s || "undefined" == typeof s || s instanceof Date || c && s instanceof c || null === s))throw new Error("ReactiveDict.equals: value must be scalar");
            var l = i(s);
            if (r.active) {
                u._ensureKey(e), n.has(u.keyValueDeps[e], l) || (u.keyValueDeps[e][l] = new r.Dependency);
                var f = u.keyValueDeps[e][l].depend();
                f && r.onInvalidate(function () {
                    u.keyValueDeps[e][l].hasDependents() || delete u.keyValueDeps[e][l]
                })
            }
            var d = void 0;
            return n.has(u.keys, e) && (d = a(u.keys[e])), o.equals(d, s)
        }, _ensureKey: function (e) {
            var t = this;
            e in t.keyDeps || (t.keyDeps[e] = new r.Dependency, t.keyValueDeps[e] = {})
        }, getMigrationData: function () {
            return this.keys
        }})
    }).call(this), "undefined" == typeof Package && (Package = {}), Package["reactive-dict"] = {ReactiveDict: e}
}(), function () {
    {
        var e, t = (Package.meteor.Meteor, Package.underscore._, Package["reactive-dict"].ReactiveDict);
        Package.ejson.EJSON
    }
    (function () {
        var n = {};
        if (Package.reload) {
            var r = Package.reload.Reload._migrationData("session");
            r && r.keys && (n = r.keys)
        }
        e = new t(n), Package.reload && Package.reload.Reload._onMigrate("session", function () {
            return[!0, {keys: e.keys}]
        })
    }).call(this), "undefined" == typeof Package && (Package = {}), Package.session = {Session: e}
}(), function () {
    {
        var e, t;
        Package.meteor.Meteor
    }
    (function () {
        !function (e, t) {
            function n(e) {
                var t = e.length, n = lt.type(e);
                return lt.isWindow(e) ? !1 : 1 === e.nodeType && t ? !0 : "array" === n || "function" !== n && (0 === t || "number" == typeof t && t > 0 && t - 1 in e)
            }

            function r(e) {
                var t = Tt[e] = {};
                return lt.each(e.match(dt) || [], function (e, n) {
                    t[n] = !0
                }), t
            }

            function o(e, n, r, o) {
                if (lt.acceptData(e)) {
                    var i, a, s = lt.expando, u = e.nodeType, c = u ? lt.cache : e, l = u ? e[s] : e[s] && s;
                    if (l && c[l] && (o || c[l].data) || r !== t || "string" != typeof n)return l || (l = u ? e[s] = tt.pop() || lt.guid++ : s), c[l] || (c[l] = u ? {} : {toJSON: lt.noop}), ("object" == typeof n || "function" == typeof n) && (o ? c[l] = lt.extend(c[l], n) : c[l].data = lt.extend(c[l].data, n)), a = c[l], o || (a.data || (a.data = {}), a = a.data), r !== t && (a[lt.camelCase(n)] = r), "string" == typeof n ? (i = a[n], null == i && (i = a[lt.camelCase(n)])) : i = a, i
                }
            }

            function i(e, t, n) {
                if (lt.acceptData(e)) {
                    var r, o, i = e.nodeType, a = i ? lt.cache : e, u = i ? e[lt.expando] : lt.expando;
                    if (a[u]) {
                        if (t && (r = n ? a[u] : a[u].data)) {
                            lt.isArray(t) ? t = t.concat(lt.map(t, lt.camelCase)) : t in r ? t = [t] : (t = lt.camelCase(t), t = t in r ? [t] : t.split(" ")), o = t.length;
                            for (; o--;)delete r[t[o]];
                            if (n ? !s(r) : !lt.isEmptyObject(r))return
                        }
                        (n || (delete a[u].data, s(a[u]))) && (i ? lt.cleanData([e], !0) : lt.support.deleteExpando || a != a.window ? delete a[u] : a[u] = null)
                    }
                }
            }

            function a(e, n, r) {
                if (r === t && 1 === e.nodeType) {
                    var o = "data-" + n.replace(St, "-$1").toLowerCase();
                    if (r = e.getAttribute(o), "string" == typeof r) {
                        try {
                            r = "true" === r ? !0 : "false" === r ? !1 : "null" === r ? null : +r + "" === r ? +r : Ct.test(r) ? lt.parseJSON(r) : r
                        } catch (i) {
                        }
                        lt.data(e, n, r)
                    } else r = t
                }
                return r
            }

            function s(e) {
                var t;
                for (t in e)if (("data" !== t || !lt.isEmptyObject(e[t])) && "toJSON" !== t)return!1;
                return!0
            }

            function u() {
                return!0
            }

            function c() {
                return!1
            }

            function l() {
                try {
                    return Q.activeElement
                } catch (e) {
                }
            }

            function f(e, t) {
                do e = e[t]; while (e && 1 !== e.nodeType);
                return e
            }

            function d(e, t, n) {
                if (lt.isFunction(t))return lt.grep(e, function (e, r) {
                    return!!t.call(e, r, e) !== n
                });
                if (t.nodeType)return lt.grep(e, function (e) {
                    return e === t !== n
                });
                if ("string" == typeof t) {
                    if (Ft.test(t))return lt.filter(t, e, n);
                    t = lt.filter(t, e)
                }
                return lt.grep(e, function (e) {
                    return lt.inArray(e, t) >= 0 !== n
                })
            }

            function p(e) {
                var t = zt.split("|"), n = e.createDocumentFragment();
                if (n.createElement)for (; t.length;)n.createElement(t.pop());
                return n
            }

            function h(e, t) {
                return lt.nodeName(e, "table") && lt.nodeName(1 === t.nodeType ? t : t.firstChild, "tr") ? e.getElementsByTagName("tbody")[0] || e.appendChild(e.ownerDocument.createElement("tbody")) : e
            }

            function g(e) {
                return e.type = (null !== lt.find.attr(e, "type")) + "/" + e.type, e
            }

            function m(e) {
                var t = on.exec(e.type);
                return t ? e.type = t[1] : e.removeAttribute("type"), e
            }

            function v(e, t) {
                for (var n, r = 0; null != (n = e[r]); r++)lt._data(n, "globalEval", !t || lt._data(t[r], "globalEval"))
            }

            function y(e, t) {
                if (1 === t.nodeType && lt.hasData(e)) {
                    var n, r, o, i = lt._data(e), a = lt._data(t, i), s = i.events;
                    if (s) {
                        delete a.handle, a.events = {};
                        for (n in s)for (r = 0, o = s[n].length; o > r; r++)lt.event.add(t, n, s[n][r])
                    }
                    a.data && (a.data = lt.extend({}, a.data))
                }
            }

            function _(e, t) {
                var n, r, o;
                if (1 === t.nodeType) {
                    if (n = t.nodeName.toLowerCase(), !lt.support.noCloneEvent && t[lt.expando]) {
                        o = lt._data(t);
                        for (r in o.events)lt.removeEvent(t, r, o.handle);
                        t.removeAttribute(lt.expando)
                    }
                    "script" === n && t.text !== e.text ? (g(t).text = e.text, m(t)) : "object" === n ? (t.parentNode && (t.outerHTML = e.outerHTML), lt.support.html5Clone && e.innerHTML && !lt.trim(t.innerHTML) && (t.innerHTML = e.innerHTML)) : "input" === n && tn.test(e.type) ? (t.defaultChecked = t.checked = e.checked, t.value !== e.value && (t.value = e.value)) : "option" === n ? t.defaultSelected = t.selected = e.defaultSelected : ("input" === n || "textarea" === n) && (t.defaultValue = e.defaultValue)
                }
            }

            function b(e, n) {
                var r, o, i = 0, a = typeof e.getElementsByTagName !== X ? e.getElementsByTagName(n || "*") : typeof e.querySelectorAll !== X ? e.querySelectorAll(n || "*") : t;
                if (!a)for (a = [], r = e.childNodes || e; null != (o = r[i]); i++)!n || lt.nodeName(o, n) ? a.push(o) : lt.merge(a, b(o, n));
                return n === t || n && lt.nodeName(e, n) ? lt.merge([e], a) : a
            }

            function w(e) {
                tn.test(e.type) && (e.defaultChecked = e.checked)
            }

            function x(e, t) {
                if (t in e)return t;
                for (var n = t.charAt(0).toUpperCase() + t.slice(1), r = t, o = Tn.length; o--;)if (t = Tn[o] + n, t in e)return t;
                return r
            }

            function k(e, t) {
                return e = t || e, "none" === lt.css(e, "display") || !lt.contains(e.ownerDocument, e)
            }

            function E(e, t) {
                for (var n, r, o, i = [], a = 0, s = e.length; s > a; a++)r = e[a], r.style && (i[a] = lt._data(r, "olddisplay"), n = r.style.display, t ? (i[a] || "none" !== n || (r.style.display = ""), "" === r.style.display && k(r) && (i[a] = lt._data(r, "olddisplay", O(r.nodeName)))) : i[a] || (o = k(r), (n && "none" !== n || !o) && lt._data(r, "olddisplay", o ? n : lt.css(r, "display"))));
                for (a = 0; s > a; a++)r = e[a], r.style && (t && "none" !== r.style.display && "" !== r.style.display || (r.style.display = t ? i[a] || "" : "none"));
                return e
            }

            function T(e, t, n) {
                var r = yn.exec(t);
                return r ? Math.max(0, r[1] - (n || 0)) + (r[2] || "px") : t
            }

            function C(e, t, n, r, o) {
                for (var i = n === (r ? "border" : "content") ? 4 : "width" === t ? 1 : 0, a = 0; 4 > i; i += 2)"margin" === n && (a += lt.css(e, n + En[i], !0, o)), r ? ("content" === n && (a -= lt.css(e, "padding" + En[i], !0, o)), "margin" !== n && (a -= lt.css(e, "border" + En[i] + "Width", !0, o))) : (a += lt.css(e, "padding" + En[i], !0, o), "padding" !== n && (a += lt.css(e, "border" + En[i] + "Width", !0, o)));
                return a
            }

            function S(e, t, n) {
                var r = !0, o = "width" === t ? e.offsetWidth : e.offsetHeight, i = fn(e), a = lt.support.boxSizing && "border-box" === lt.css(e, "boxSizing", !1, i);
                if (0 >= o || null == o) {
                    if (o = dn(e, t, i), (0 > o || null == o) && (o = e.style[t]), _n.test(o))return o;
                    r = a && (lt.support.boxSizingReliable || o === e.style[t]), o = parseFloat(o) || 0
                }
                return o + C(e, t, n || (a ? "border" : "content"), r, i) + "px"
            }

            function O(e) {
                var t = Q, n = wn[e];
                return n || (n = N(e, t), "none" !== n && n || (ln = (ln || lt("<iframe frameborder='0' width='0' height='0'/>").css("cssText", "display:block !important")).appendTo(t.documentElement), t = (ln[0].contentWindow || ln[0].contentDocument).document, t.write("<!doctype html><html><body>"), t.close(), n = N(e, t), ln.detach()), wn[e] = n), n
            }

            function N(e, t) {
                var n = lt(t.createElement(e)).appendTo(t.body), r = lt.css(n[0], "display");
                return n.remove(), r
            }

            function A(e, t, n, r) {
                var o;
                if (lt.isArray(t))lt.each(t, function (t, o) {
                    n || Sn.test(e) ? r(e, o) : A(e + "[" + ("object" == typeof o ? t : "") + "]", o, n, r)
                }); else if (n || "object" !== lt.type(t))r(e, t); else for (o in t)A(e + "[" + o + "]", t[o], n, r)
            }

            function M(e) {
                return function (t, n) {
                    "string" != typeof t && (n = t, t = "*");
                    var r, o = 0, i = t.toLowerCase().match(dt) || [];
                    if (lt.isFunction(n))for (; r = i[o++];)"+" === r[0] ? (r = r.slice(1) || "*", (e[r] = e[r] || []).unshift(n)) : (e[r] = e[r] || []).push(n)
                }
            }

            function I(e, t, n, r) {
                function o(s) {
                    var u;
                    return i[s] = !0, lt.each(e[s] || [], function (e, s) {
                        var c = s(t, n, r);
                        return"string" != typeof c || a || i[c] ? a ? !(u = c) : void 0 : (t.dataTypes.unshift(c), o(c), !1)
                    }), u
                }

                var i = {}, a = e === Vn;
                return o(t.dataTypes[0]) || !i["*"] && o("*")
            }

            function j(e, n) {
                var r, o, i = lt.ajaxSettings.flatOptions || {};
                for (o in n)n[o] !== t && ((i[o] ? e : r || (r = {}))[o] = n[o]);
                return r && lt.extend(!0, e, r), e
            }

            function D(e, n, r) {
                for (var o, i, a, s, u = e.contents, c = e.dataTypes; "*" === c[0];)c.shift(), i === t && (i = e.mimeType || n.getResponseHeader("Content-Type"));
                if (i)for (s in u)if (u[s] && u[s].test(i)) {
                    c.unshift(s);
                    break
                }
                if (c[0]in r)a = c[0]; else {
                    for (s in r) {
                        if (!c[0] || e.converters[s + " " + c[0]]) {
                            a = s;
                            break
                        }
                        o || (o = s)
                    }
                    a = a || o
                }
                return a ? (a !== c[0] && c.unshift(a), r[a]) : void 0
            }

            function P(e, t, n, r) {
                var o, i, a, s, u, c = {}, l = e.dataTypes.slice();
                if (l[1])for (a in e.converters)c[a.toLowerCase()] = e.converters[a];
                for (i = l.shift(); i;)if (e.responseFields[i] && (n[e.responseFields[i]] = t), !u && r && e.dataFilter && (t = e.dataFilter(t, e.dataType)), u = i, i = l.shift())if ("*" === i)i = u; else if ("*" !== u && u !== i) {
                    if (a = c[u + " " + i] || c["* " + i], !a)for (o in c)if (s = o.split(" "), s[1] === i && (a = c[u + " " + s[0]] || c["* " + s[0]])) {
                        a === !0 ? a = c[o] : c[o] !== !0 && (i = s[0], l.unshift(s[1]));
                        break
                    }
                    if (a !== !0)if (a && e["throws"])t = a(t); else try {
                        t = a(t)
                    } catch (f) {
                        return{state: "parsererror", error: a ? f : "No conversion from " + u + " to " + i}
                    }
                }
                return{state: "success", data: t}
            }

            function R() {
                try {
                    return new e.XMLHttpRequest
                } catch (t) {
                }
            }

            function $() {
                try {
                    return new e.ActiveXObject("Microsoft.XMLHTTP")
                } catch (t) {
                }
            }

            function L() {
                return setTimeout(function () {
                    Zn = t
                }), Zn = lt.now()
            }

            function B(e, t, n) {
                for (var r, o = (ir[t] || []).concat(ir["*"]), i = 0, a = o.length; a > i; i++)if (r = o[i].call(n, t, e))return r
            }

            function H(e, t, n) {
                var r, o, i = 0, a = or.length, s = lt.Deferred().always(function () {
                    delete u.elem
                }), u = function () {
                    if (o)return!1;
                    for (var t = Zn || L(), n = Math.max(0, c.startTime + c.duration - t), r = n / c.duration || 0, i = 1 - r, a = 0, u = c.tweens.length; u > a; a++)c.tweens[a].run(i);
                    return s.notifyWith(e, [c, i, n]), 1 > i && u ? n : (s.resolveWith(e, [c]), !1)
                }, c = s.promise({elem: e, props: lt.extend({}, t), opts: lt.extend(!0, {specialEasing: {}}, n), originalProperties: t, originalOptions: n, startTime: Zn || L(), duration: n.duration, tweens: [], createTween: function (t, n) {
                    var r = lt.Tween(e, c.opts, t, n, c.opts.specialEasing[t] || c.opts.easing);
                    return c.tweens.push(r), r
                }, stop: function (t) {
                    var n = 0, r = t ? c.tweens.length : 0;
                    if (o)return this;
                    for (o = !0; r > n; n++)c.tweens[n].run(1);
                    return t ? s.resolveWith(e, [c, t]) : s.rejectWith(e, [c, t]), this
                }}), l = c.props;
                for (q(l, c.opts.specialEasing); a > i; i++)if (r = or[i].call(c, e, l, c.opts))return r;
                return lt.map(l, B, c), lt.isFunction(c.opts.start) && c.opts.start.call(e, c), lt.fx.timer(lt.extend(u, {elem: e, anim: c, queue: c.opts.queue})), c.progress(c.opts.progress).done(c.opts.done, c.opts.complete).fail(c.opts.fail).always(c.opts.always)
            }

            function q(e, t) {
                var n, r, o, i, a;
                for (n in e)if (r = lt.camelCase(n), o = t[r], i = e[n], lt.isArray(i) && (o = i[1], i = e[n] = i[0]), n !== r && (e[r] = i, delete e[n]), a = lt.cssHooks[r], a && "expand"in a) {
                    i = a.expand(i), delete e[r];
                    for (n in i)n in e || (e[n] = i[n], t[n] = o)
                } else t[r] = o
            }

            function F(e, t, n) {
                var r, o, i, a, s, u, c = this, l = {}, f = e.style, d = e.nodeType && k(e), p = lt._data(e, "fxshow");
                n.queue || (s = lt._queueHooks(e, "fx"), null == s.unqueued && (s.unqueued = 0, u = s.empty.fire, s.empty.fire = function () {
                    s.unqueued || u()
                }), s.unqueued++, c.always(function () {
                    c.always(function () {
                        s.unqueued--, lt.queue(e, "fx").length || s.empty.fire()
                    })
                })), 1 === e.nodeType && ("height"in t || "width"in t) && (n.overflow = [f.overflow, f.overflowX, f.overflowY], "inline" === lt.css(e, "display") && "none" === lt.css(e, "float") && (lt.support.inlineBlockNeedsLayout && "inline" !== O(e.nodeName) ? f.zoom = 1 : f.display = "inline-block")), n.overflow && (f.overflow = "hidden", lt.support.shrinkWrapBlocks || c.always(function () {
                    f.overflow = n.overflow[0], f.overflowX = n.overflow[1], f.overflowY = n.overflow[2]
                }));
                for (r in t)if (o = t[r], tr.exec(o)) {
                    if (delete t[r], i = i || "toggle" === o, o === (d ? "hide" : "show"))continue;
                    l[r] = p && p[r] || lt.style(e, r)
                }
                if (!lt.isEmptyObject(l)) {
                    p ? "hidden"in p && (d = p.hidden) : p = lt._data(e, "fxshow", {}), i && (p.hidden = !d), d ? lt(e).show() : c.done(function () {
                        lt(e).hide()
                    }), c.done(function () {
                        var t;
                        lt._removeData(e, "fxshow");
                        for (t in l)lt.style(e, t, l[t])
                    });
                    for (r in l)a = B(d ? p[r] : 0, r, c), r in p || (p[r] = a.start, d && (a.end = a.start, a.start = "width" === r || "height" === r ? 1 : 0))
                }
            }

            function U(e, t, n, r, o) {
                return new U.prototype.init(e, t, n, r, o)
            }

            function V(e, t) {
                var n, r = {height: e}, o = 0;
                for (t = t ? 1 : 0; 4 > o; o += 2 - t)n = En[o], r["margin" + n] = r["padding" + n] = e;
                return t && (r.opacity = r.width = e), r
            }

            function W(e) {
                return lt.isWindow(e) ? e : 9 === e.nodeType ? e.defaultView || e.parentWindow : !1
            }

            var z, J, X = typeof t, G = e.location, Q = e.document, Y = Q.documentElement, K = e.jQuery, Z = e.$, et = {}, tt = [], nt = "1.10.2", rt = tt.concat, ot = tt.push, it = tt.slice, at = tt.indexOf, st = et.toString, ut = et.hasOwnProperty, ct = nt.trim, lt = function (e, t) {
                return new lt.fn.init(e, t, J)
            }, ft = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source, dt = /\S+/g, pt = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, ht = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/, gt = /^<(\w+)\s*\/?>(?:<\/\1>|)$/, mt = /^[\],:{}\s]*$/, vt = /(?:^|:|,)(?:\s*\[)+/g, yt = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g, _t = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g, bt = /^-ms-/, wt = /-([\da-z])/gi, xt = function (e, t) {
                return t.toUpperCase()
            }, kt = function (e) {
                (Q.addEventListener || "load" === e.type || "complete" === Q.readyState) && (Et(), lt.ready())
            }, Et = function () {
                Q.addEventListener ? (Q.removeEventListener("DOMContentLoaded", kt, !1), e.removeEventListener("load", kt, !1)) : (Q.detachEvent("onreadystatechange", kt), e.detachEvent("onload", kt))
            };
            lt.fn = lt.prototype = {jquery: nt, constructor: lt, init: function (e, n, r) {
                var o, i;
                if (!e)return this;
                if ("string" == typeof e) {
                    if (o = "<" === e.charAt(0) && ">" === e.charAt(e.length - 1) && e.length >= 3 ? [null, e, null] : ht.exec(e), !o || !o[1] && n)return!n || n.jquery ? (n || r).find(e) : this.constructor(n).find(e);
                    if (o[1]) {
                        if (n = n instanceof lt ? n[0] : n, lt.merge(this, lt.parseHTML(o[1], n && n.nodeType ? n.ownerDocument || n : Q, !0)), gt.test(o[1]) && lt.isPlainObject(n))for (o in n)lt.isFunction(this[o]) ? this[o](n[o]) : this.attr(o, n[o]);
                        return this
                    }
                    if (i = Q.getElementById(o[2]), i && i.parentNode) {
                        if (i.id !== o[2])return r.find(e);
                        this.length = 1, this[0] = i
                    }
                    return this.context = Q, this.selector = e, this
                }
                return e.nodeType ? (this.context = this[0] = e, this.length = 1, this) : lt.isFunction(e) ? r.ready(e) : (e.selector !== t && (this.selector = e.selector, this.context = e.context), lt.makeArray(e, this))
            }, selector: "", length: 0, toArray: function () {
                return it.call(this)
            }, get: function (e) {
                return null == e ? this.toArray() : 0 > e ? this[this.length + e] : this[e]
            }, pushStack: function (e) {
                var t = lt.merge(this.constructor(), e);
                return t.prevObject = this, t.context = this.context, t
            }, each: function (e, t) {
                return lt.each(this, e, t)
            }, ready: function (e) {
                return lt.ready.promise().done(e), this
            }, slice: function () {
                return this.pushStack(it.apply(this, arguments))
            }, first: function () {
                return this.eq(0)
            }, last: function () {
                return this.eq(-1)
            }, eq: function (e) {
                var t = this.length, n = +e + (0 > e ? t : 0);
                return this.pushStack(n >= 0 && t > n ? [this[n]] : [])
            }, map: function (e) {
                return this.pushStack(lt.map(this, function (t, n) {
                    return e.call(t, n, t)
                }))
            }, end: function () {
                return this.prevObject || this.constructor(null)
            }, push: ot, sort: [].sort, splice: [].splice}, lt.fn.init.prototype = lt.fn, lt.extend = lt.fn.extend = function () {
                var e, n, r, o, i, a, s = arguments[0] || {}, u = 1, c = arguments.length, l = !1;
                for ("boolean" == typeof s && (l = s, s = arguments[1] || {}, u = 2), "object" == typeof s || lt.isFunction(s) || (s = {}), c === u && (s = this, --u); c > u; u++)if (null != (i = arguments[u]))for (o in i)e = s[o], r = i[o], s !== r && (l && r && (lt.isPlainObject(r) || (n = lt.isArray(r))) ? (n ? (n = !1, a = e && lt.isArray(e) ? e : []) : a = e && lt.isPlainObject(e) ? e : {}, s[o] = lt.extend(l, a, r)) : r !== t && (s[o] = r));
                return s
            }, lt.extend({expando: "jQuery" + (nt + Math.random()).replace(/\D/g, ""), noConflict: function (t) {
                return e.$ === lt && (e.$ = Z), t && e.jQuery === lt && (e.jQuery = K), lt
            }, isReady: !1, readyWait: 1, holdReady: function (e) {
                e ? lt.readyWait++ : lt.ready(!0)
            }, ready: function (e) {
                if (e === !0 ? !--lt.readyWait : !lt.isReady) {
                    if (!Q.body)return setTimeout(lt.ready);
                    lt.isReady = !0, e !== !0 && --lt.readyWait > 0 || (z.resolveWith(Q, [lt]), lt.fn.trigger && lt(Q).trigger("ready").off("ready"))
                }
            }, isFunction: function (e) {
                return"function" === lt.type(e)
            }, isArray: Array.isArray || function (e) {
                return"array" === lt.type(e)
            }, isWindow: function (e) {
                return null != e && e == e.window
            }, isNumeric: function (e) {
                return!isNaN(parseFloat(e)) && isFinite(e)
            }, type: function (e) {
                return null == e ? String(e) : "object" == typeof e || "function" == typeof e ? et[st.call(e)] || "object" : typeof e
            }, isPlainObject: function (e) {
                var n;
                if (!e || "object" !== lt.type(e) || e.nodeType || lt.isWindow(e))return!1;
                try {
                    if (e.constructor && !ut.call(e, "constructor") && !ut.call(e.constructor.prototype, "isPrototypeOf"))return!1
                } catch (r) {
                    return!1
                }
                if (lt.support.ownLast)for (n in e)return ut.call(e, n);
                for (n in e);
                return n === t || ut.call(e, n)
            }, isEmptyObject: function (e) {
                var t;
                for (t in e)return!1;
                return!0
            }, error: function (e) {
                throw new Error(e)
            }, parseHTML: function (e, t, n) {
                if (!e || "string" != typeof e)return null;
                "boolean" == typeof t && (n = t, t = !1), t = t || Q;
                var r = gt.exec(e), o = !n && [];
                return r ? [t.createElement(r[1])] : (r = lt.buildFragment([e], t, o), o && lt(o).remove(), lt.merge([], r.childNodes))
            }, parseJSON: function (t) {
                return e.JSON && e.JSON.parse ? e.JSON.parse(t) : null === t ? t : "string" == typeof t && (t = lt.trim(t), t && mt.test(t.replace(yt, "@").replace(_t, "]").replace(vt, ""))) ? new Function("return " + t)() : (lt.error("Invalid JSON: " + t), void 0)
            }, parseXML: function (n) {
                var r, o;
                if (!n || "string" != typeof n)return null;
                try {
                    e.DOMParser ? (o = new DOMParser, r = o.parseFromString(n, "text/xml")) : (r = new ActiveXObject("Microsoft.XMLDOM"), r.async = "false", r.loadXML(n))
                } catch (i) {
                    r = t
                }
                return r && r.documentElement && !r.getElementsByTagName("parsererror").length || lt.error("Invalid XML: " + n), r
            }, noop: function () {
            }, globalEval: function (t) {
                t && lt.trim(t) && (e.execScript || function (t) {
                    e.eval.call(e, t)
                })(t)
            }, camelCase: function (e) {
                return e.replace(bt, "ms-").replace(wt, xt)
            }, nodeName: function (e, t) {
                return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
            }, each: function (e, t, r) {
                var o, i = 0, a = e.length, s = n(e);
                if (r) {
                    if (s)for (; a > i && (o = t.apply(e[i], r), o !== !1); i++); else for (i in e)if (o = t.apply(e[i], r), o === !1)break
                } else if (s)for (; a > i && (o = t.call(e[i], i, e[i]), o !== !1); i++); else for (i in e)if (o = t.call(e[i], i, e[i]), o === !1)break;
                return e
            }, trim: ct && !ct.call("﻿ ") ? function (e) {
                return null == e ? "" : ct.call(e)
            } : function (e) {
                return null == e ? "" : (e + "").replace(pt, "")
            }, makeArray: function (e, t) {
                var r = t || [];
                return null != e && (n(Object(e)) ? lt.merge(r, "string" == typeof e ? [e] : e) : ot.call(r, e)), r
            }, inArray: function (e, t, n) {
                var r;
                if (t) {
                    if (at)return at.call(t, e, n);
                    for (r = t.length, n = n ? 0 > n ? Math.max(0, r + n) : n : 0; r > n; n++)if (n in t && t[n] === e)return n
                }
                return-1
            }, merge: function (e, n) {
                var r = n.length, o = e.length, i = 0;
                if ("number" == typeof r)for (; r > i; i++)e[o++] = n[i]; else for (; n[i] !== t;)e[o++] = n[i++];
                return e.length = o, e
            }, grep: function (e, t, n) {
                var r, o = [], i = 0, a = e.length;
                for (n = !!n; a > i; i++)r = !!t(e[i], i), n !== r && o.push(e[i]);
                return o
            }, map: function (e, t, r) {
                var o, i = 0, a = e.length, s = n(e), u = [];
                if (s)for (; a > i; i++)o = t(e[i], i, r), null != o && (u[u.length] = o); else for (i in e)o = t(e[i], i, r), null != o && (u[u.length] = o);
                return rt.apply([], u)
            }, guid: 1, proxy: function (e, n) {
                var r, o, i;
                return"string" == typeof n && (i = e[n], n = e, e = i), lt.isFunction(e) ? (r = it.call(arguments, 2), o = function () {
                    return e.apply(n || this, r.concat(it.call(arguments)))
                }, o.guid = e.guid = e.guid || lt.guid++, o) : t
            }, access: function (e, n, r, o, i, a, s) {
                var u = 0, c = e.length, l = null == r;
                if ("object" === lt.type(r)) {
                    i = !0;
                    for (u in r)lt.access(e, n, u, r[u], !0, a, s)
                } else if (o !== t && (i = !0, lt.isFunction(o) || (s = !0), l && (s ? (n.call(e, o), n = null) : (l = n, n = function (e, t, n) {
                    return l.call(lt(e), n)
                })), n))for (; c > u; u++)n(e[u], r, s ? o : o.call(e[u], u, n(e[u], r)));
                return i ? e : l ? n.call(e) : c ? n(e[0], r) : a
            }, now: function () {
                return(new Date).getTime()
            }, swap: function (e, t, n, r) {
                var o, i, a = {};
                for (i in t)a[i] = e.style[i], e.style[i] = t[i];
                o = n.apply(e, r || []);
                for (i in t)e.style[i] = a[i];
                return o
            }}), lt.ready.promise = function (t) {
                if (!z)if (z = lt.Deferred(), "complete" === Q.readyState)setTimeout(lt.ready); else if (Q.addEventListener)Q.addEventListener("DOMContentLoaded", kt, !1), e.addEventListener("load", kt, !1); else {
                    Q.attachEvent("onreadystatechange", kt), e.attachEvent("onload", kt);
                    var n = !1;
                    try {
                        n = null == e.frameElement && Q.documentElement
                    } catch (r) {
                    }
                    n && n.doScroll && !function o() {
                        if (!lt.isReady) {
                            try {
                                n.doScroll("left")
                            } catch (e) {
                                return setTimeout(o, 50)
                            }
                            Et(), lt.ready()
                        }
                    }()
                }
                return z.promise(t)
            }, lt.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (e, t) {
                et["[object " + t + "]"] = t.toLowerCase()
            }), J = lt(Q), function (e, t) {
                function n(e, t, n, r) {
                    var o, i, a, s, u, c, l, f, h, g;
                    if ((t ? t.ownerDocument || t : H) !== I && M(t), t = t || I, n = n || [], !e || "string" != typeof e)return n;
                    if (1 !== (s = t.nodeType) && 9 !== s)return[];
                    if (D && !r) {
                        if (o = _t.exec(e))if (a = o[1]) {
                            if (9 === s) {
                                if (i = t.getElementById(a), !i || !i.parentNode)return n;
                                if (i.id === a)return n.push(i), n
                            } else if (t.ownerDocument && (i = t.ownerDocument.getElementById(a)) && L(t, i) && i.id === a)return n.push(i), n
                        } else {
                            if (o[2])return et.apply(n, t.getElementsByTagName(e)), n;
                            if ((a = o[3]) && k.getElementsByClassName && t.getElementsByClassName)return et.apply(n, t.getElementsByClassName(a)), n
                        }
                        if (k.qsa && (!P || !P.test(e))) {
                            if (f = l = B, h = t, g = 9 === s && e, 1 === s && "object" !== t.nodeName.toLowerCase()) {
                                for (c = d(e), (l = t.getAttribute("id")) ? f = l.replace(xt, "\\$&") : t.setAttribute("id", f), f = "[id='" + f + "'] ", u = c.length; u--;)c[u] = f + p(c[u]);
                                h = pt.test(e) && t.parentNode || t, g = c.join(",")
                            }
                            if (g)try {
                                return et.apply(n, h.querySelectorAll(g)), n
                            } catch (m) {
                            } finally {
                                l || t.removeAttribute("id")
                            }
                        }
                    }
                    return w(e.replace(ct, "$1"), t, n, r)
                }

                function r() {
                    function e(n, r) {
                        return t.push(n += " ") > T.cacheLength && delete e[t.shift()], e[n] = r
                    }

                    var t = [];
                    return e
                }

                function o(e) {
                    return e[B] = !0, e
                }

                function i(e) {
                    var t = I.createElement("div");
                    try {
                        return!!e(t)
                    } catch (n) {
                        return!1
                    } finally {
                        t.parentNode && t.parentNode.removeChild(t), t = null
                    }
                }

                function a(e, t) {
                    for (var n = e.split("|"), r = e.length; r--;)T.attrHandle[n[r]] = t
                }

                function s(e, t) {
                    var n = t && e, r = n && 1 === e.nodeType && 1 === t.nodeType && (~t.sourceIndex || G) - (~e.sourceIndex || G);
                    if (r)return r;
                    if (n)for (; n = n.nextSibling;)if (n === t)return-1;
                    return e ? 1 : -1
                }

                function u(e) {
                    return function (t) {
                        var n = t.nodeName.toLowerCase();
                        return"input" === n && t.type === e
                    }
                }

                function c(e) {
                    return function (t) {
                        var n = t.nodeName.toLowerCase();
                        return("input" === n || "button" === n) && t.type === e
                    }
                }

                function l(e) {
                    return o(function (t) {
                        return t = +t, o(function (n, r) {
                            for (var o, i = e([], n.length, t), a = i.length; a--;)n[o = i[a]] && (n[o] = !(r[o] = n[o]))
                        })
                    })
                }

                function f() {
                }

                function d(e, t) {
                    var r, o, i, a, s, u, c, l = V[e + " "];
                    if (l)return t ? 0 : l.slice(0);
                    for (s = e, u = [], c = T.preFilter; s;) {
                        (!r || (o = ft.exec(s))) && (o && (s = s.slice(o[0].length) || s), u.push(i = [])), r = !1, (o = dt.exec(s)) && (r = o.shift(), i.push({value: r, type: o[0].replace(ct, " ")}), s = s.slice(r.length));
                        for (a in T.filter)!(o = vt[a].exec(s)) || c[a] && !(o = c[a](o)) || (r = o.shift(), i.push({value: r, type: a, matches: o}), s = s.slice(r.length));
                        if (!r)break
                    }
                    return t ? s.length : s ? n.error(e) : V(e, u).slice(0)
                }

                function p(e) {
                    for (var t = 0, n = e.length, r = ""; n > t; t++)r += e[t].value;
                    return r
                }

                function h(e, t, n) {
                    var r = t.dir, o = n && "parentNode" === r, i = F++;
                    return t.first ? function (t, n, i) {
                        for (; t = t[r];)if (1 === t.nodeType || o)return e(t, n, i)
                    } : function (t, n, a) {
                        var s, u, c, l = q + " " + i;
                        if (a) {
                            for (; t = t[r];)if ((1 === t.nodeType || o) && e(t, n, a))return!0
                        } else for (; t = t[r];)if (1 === t.nodeType || o)if (c = t[B] || (t[B] = {}), (u = c[r]) && u[0] === l) {
                            if ((s = u[1]) === !0 || s === E)return s === !0
                        } else if (u = c[r] = [l], u[1] = e(t, n, a) || E, u[1] === !0)return!0
                    }
                }

                function g(e) {
                    return e.length > 1 ? function (t, n, r) {
                        for (var o = e.length; o--;)if (!e[o](t, n, r))return!1;
                        return!0
                    } : e[0]
                }

                function m(e, t, n, r, o) {
                    for (var i, a = [], s = 0, u = e.length, c = null != t; u > s; s++)(i = e[s]) && (!n || n(i, r, o)) && (a.push(i), c && t.push(s));
                    return a
                }

                function v(e, t, n, r, i, a) {
                    return r && !r[B] && (r = v(r)), i && !i[B] && (i = v(i, a)), o(function (o, a, s, u) {
                        var c, l, f, d = [], p = [], h = a.length, g = o || b(t || "*", s.nodeType ? [s] : s, []), v = !e || !o && t ? g : m(g, d, e, s, u), y = n ? i || (o ? e : h || r) ? [] : a : v;
                        if (n && n(v, y, s, u), r)for (c = m(y, p), r(c, [], s, u), l = c.length; l--;)(f = c[l]) && (y[p[l]] = !(v[p[l]] = f));
                        if (o) {
                            if (i || e) {
                                if (i) {
                                    for (c = [], l = y.length; l--;)(f = y[l]) && c.push(v[l] = f);
                                    i(null, y = [], c, u)
                                }
                                for (l = y.length; l--;)(f = y[l]) && (c = i ? nt.call(o, f) : d[l]) > -1 && (o[c] = !(a[c] = f))
                            }
                        } else y = m(y === a ? y.splice(h, y.length) : y), i ? i(null, a, y, u) : et.apply(a, y)
                    })
                }

                function y(e) {
                    for (var t, n, r, o = e.length, i = T.relative[e[0].type], a = i || T.relative[" "], s = i ? 1 : 0, u = h(function (e) {
                        return e === t
                    }, a, !0), c = h(function (e) {
                        return nt.call(t, e) > -1
                    }, a, !0), l = [function (e, n, r) {
                        return!i && (r || n !== N) || ((t = n).nodeType ? u(e, n, r) : c(e, n, r))
                    }]; o > s; s++)if (n = T.relative[e[s].type])l = [h(g(l), n)]; else {
                        if (n = T.filter[e[s].type].apply(null, e[s].matches), n[B]) {
                            for (r = ++s; o > r && !T.relative[e[r].type]; r++);
                            return v(s > 1 && g(l), s > 1 && p(e.slice(0, s - 1).concat({value: " " === e[s - 2].type ? "*" : ""})).replace(ct, "$1"), n, r > s && y(e.slice(s, r)), o > r && y(e = e.slice(r)), o > r && p(e))
                        }
                        l.push(n)
                    }
                    return g(l)
                }

                function _(e, t) {
                    var r = 0, i = t.length > 0, a = e.length > 0, s = function (o, s, u, c, l) {
                        var f, d, p, h = [], g = 0, v = "0", y = o && [], _ = null != l, b = N, w = o || a && T.find.TAG("*", l && s.parentNode || s), x = q += null == b ? 1 : Math.random() || .1;
                        for (_ && (N = s !== I && s, E = r); null != (f = w[v]); v++) {
                            if (a && f) {
                                for (d = 0; p = e[d++];)if (p(f, s, u)) {
                                    c.push(f);
                                    break
                                }
                                _ && (q = x, E = ++r)
                            }
                            i && ((f = !p && f) && g--, o && y.push(f))
                        }
                        if (g += v, i && v !== g) {
                            for (d = 0; p = t[d++];)p(y, h, s, u);
                            if (o) {
                                if (g > 0)for (; v--;)y[v] || h[v] || (h[v] = K.call(c));
                                h = m(h)
                            }
                            et.apply(c, h), _ && !o && h.length > 0 && g + t.length > 1 && n.uniqueSort(c)
                        }
                        return _ && (q = x, N = b), y
                    };
                    return i ? o(s) : s
                }

                function b(e, t, r) {
                    for (var o = 0, i = t.length; i > o; o++)n(e, t[o], r);
                    return r
                }

                function w(e, t, n, r) {
                    var o, i, a, s, u, c = d(e);
                    if (!r && 1 === c.length) {
                        if (i = c[0] = c[0].slice(0), i.length > 2 && "ID" === (a = i[0]).type && k.getById && 9 === t.nodeType && D && T.relative[i[1].type]) {
                            if (t = (T.find.ID(a.matches[0].replace(kt, Et), t) || [])[0], !t)return n;
                            e = e.slice(i.shift().value.length)
                        }
                        for (o = vt.needsContext.test(e) ? 0 : i.length; o-- && (a = i[o], !T.relative[s = a.type]);)if ((u = T.find[s]) && (r = u(a.matches[0].replace(kt, Et), pt.test(i[0].type) && t.parentNode || t))) {
                            if (i.splice(o, 1), e = r.length && p(i), !e)return et.apply(n, r), n;
                            break
                        }
                    }
                    return O(e, c)(r, t, !D, n, pt.test(e)), n
                }

                var x, k, E, T, C, S, O, N, A, M, I, j, D, P, R, $, L, B = "sizzle" + -new Date, H = e.document, q = 0, F = 0, U = r(), V = r(), W = r(), z = !1, J = function (e, t) {
                    return e === t ? (z = !0, 0) : 0
                }, X = typeof t, G = 1 << 31, Q = {}.hasOwnProperty, Y = [], K = Y.pop, Z = Y.push, et = Y.push, tt = Y.slice, nt = Y.indexOf || function (e) {
                    for (var t = 0, n = this.length; n > t; t++)if (this[t] === e)return t;
                    return-1
                }, rt = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", ot = "[\\x20\\t\\r\\n\\f]", it = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+", at = it.replace("w", "w#"), st = "\\[" + ot + "*(" + it + ")" + ot + "*(?:([*^$|!~]?=)" + ot + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + at + ")|)|)" + ot + "*\\]", ut = ":(" + it + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + st.replace(3, 8) + ")*)|.*)\\)|)", ct = new RegExp("^" + ot + "+|((?:^|[^\\\\])(?:\\\\.)*)" + ot + "+$", "g"), ft = new RegExp("^" + ot + "*," + ot + "*"), dt = new RegExp("^" + ot + "*([>+~]|" + ot + ")" + ot + "*"), pt = new RegExp(ot + "*[+~]"), ht = new RegExp("=" + ot + "*([^\\]'\"]*)" + ot + "*\\]", "g"), gt = new RegExp(ut), mt = new RegExp("^" + at + "$"), vt = {ID: new RegExp("^#(" + it + ")"), CLASS: new RegExp("^\\.(" + it + ")"), TAG: new RegExp("^(" + it.replace("w", "w*") + ")"), ATTR: new RegExp("^" + st), PSEUDO: new RegExp("^" + ut), CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + ot + "*(even|odd|(([+-]|)(\\d*)n|)" + ot + "*(?:([+-]|)" + ot + "*(\\d+)|))" + ot + "*\\)|)", "i"), bool: new RegExp("^(?:" + rt + ")$", "i"), needsContext: new RegExp("^" + ot + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + ot + "*((?:-\\d)?\\d*)" + ot + "*\\)|)(?=[^-]|$)", "i")}, yt = /^[^{]+\{\s*\[native \w/, _t = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, bt = /^(?:input|select|textarea|button)$/i, wt = /^h\d$/i, xt = /'|\\/g, kt = new RegExp("\\\\([\\da-f]{1,6}" + ot + "?|(" + ot + ")|.)", "ig"), Et = function (e, t, n) {
                    var r = "0x" + t - 65536;
                    return r !== r || n ? t : 0 > r ? String.fromCharCode(r + 65536) : String.fromCharCode(r >> 10 | 55296, 1023 & r | 56320)
                };
                try {
                    et.apply(Y = tt.call(H.childNodes), H.childNodes), Y[H.childNodes.length].nodeType
                } catch (Tt) {
                    et = {apply: Y.length ? function (e, t) {
                        Z.apply(e, tt.call(t))
                    } : function (e, t) {
                        for (var n = e.length, r = 0; e[n++] = t[r++];);
                        e.length = n - 1
                    }}
                }
                S = n.isXML = function (e) {
                    var t = e && (e.ownerDocument || e).documentElement;
                    return t ? "HTML" !== t.nodeName : !1
                }, k = n.support = {}, M = n.setDocument = function (e) {
                    var t = e ? e.ownerDocument || e : H, n = t.defaultView;
                    return t !== I && 9 === t.nodeType && t.documentElement ? (I = t, j = t.documentElement, D = !S(t), n && n.attachEvent && n !== n.top && n.attachEvent("onbeforeunload", function () {
                        M()
                    }), k.attributes = i(function (e) {
                        return e.className = "i", !e.getAttribute("className")
                    }), k.getElementsByTagName = i(function (e) {
                        return e.appendChild(t.createComment("")), !e.getElementsByTagName("*").length
                    }), k.getElementsByClassName = i(function (e) {
                        return e.innerHTML = "<div class='a'></div><div class='a i'></div>", e.firstChild.className = "i", 2 === e.getElementsByClassName("i").length
                    }), k.getById = i(function (e) {
                        return j.appendChild(e).id = B, !t.getElementsByName || !t.getElementsByName(B).length
                    }), k.getById ? (T.find.ID = function (e, t) {
                        if (typeof t.getElementById !== X && D) {
                            var n = t.getElementById(e);
                            return n && n.parentNode ? [n] : []
                        }
                    }, T.filter.ID = function (e) {
                        var t = e.replace(kt, Et);
                        return function (e) {
                            return e.getAttribute("id") === t
                        }
                    }) : (delete T.find.ID, T.filter.ID = function (e) {
                        var t = e.replace(kt, Et);
                        return function (e) {
                            var n = typeof e.getAttributeNode !== X && e.getAttributeNode("id");
                            return n && n.value === t
                        }
                    }), T.find.TAG = k.getElementsByTagName ? function (e, t) {
                        return typeof t.getElementsByTagName !== X ? t.getElementsByTagName(e) : void 0
                    } : function (e, t) {
                        var n, r = [], o = 0, i = t.getElementsByTagName(e);
                        if ("*" === e) {
                            for (; n = i[o++];)1 === n.nodeType && r.push(n);
                            return r
                        }
                        return i
                    }, T.find.CLASS = k.getElementsByClassName && function (e, t) {
                        return typeof t.getElementsByClassName !== X && D ? t.getElementsByClassName(e) : void 0
                    }, R = [], P = [], (k.qsa = yt.test(t.querySelectorAll)) && (i(function (e) {
                        e.innerHTML = "<select><option selected=''></option></select>", e.querySelectorAll("[selected]").length || P.push("\\[" + ot + "*(?:value|" + rt + ")"), e.querySelectorAll(":checked").length || P.push(":checked")
                    }), i(function (e) {
                        var n = t.createElement("input");
                        n.setAttribute("type", "hidden"), e.appendChild(n).setAttribute("t", ""), e.querySelectorAll("[t^='']").length && P.push("[*^$]=" + ot + "*(?:''|\"\")"), e.querySelectorAll(":enabled").length || P.push(":enabled", ":disabled"), e.querySelectorAll("*,:x"), P.push(",.*:")
                    })), (k.matchesSelector = yt.test($ = j.webkitMatchesSelector || j.mozMatchesSelector || j.oMatchesSelector || j.msMatchesSelector)) && i(function (e) {
                        k.disconnectedMatch = $.call(e, "div"), $.call(e, "[s!='']:x"), R.push("!=", ut)
                    }), P = P.length && new RegExp(P.join("|")), R = R.length && new RegExp(R.join("|")), L = yt.test(j.contains) || j.compareDocumentPosition ? function (e, t) {
                        var n = 9 === e.nodeType ? e.documentElement : e, r = t && t.parentNode;
                        return e === r || !(!r || 1 !== r.nodeType || !(n.contains ? n.contains(r) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(r)))
                    } : function (e, t) {
                        if (t)for (; t = t.parentNode;)if (t === e)return!0;
                        return!1
                    }, J = j.compareDocumentPosition ? function (e, n) {
                        if (e === n)return z = !0, 0;
                        var r = n.compareDocumentPosition && e.compareDocumentPosition && e.compareDocumentPosition(n);
                        return r ? 1 & r || !k.sortDetached && n.compareDocumentPosition(e) === r ? e === t || L(H, e) ? -1 : n === t || L(H, n) ? 1 : A ? nt.call(A, e) - nt.call(A, n) : 0 : 4 & r ? -1 : 1 : e.compareDocumentPosition ? -1 : 1
                    } : function (e, n) {
                        var r, o = 0, i = e.parentNode, a = n.parentNode, u = [e], c = [n];
                        if (e === n)return z = !0, 0;
                        if (!i || !a)return e === t ? -1 : n === t ? 1 : i ? -1 : a ? 1 : A ? nt.call(A, e) - nt.call(A, n) : 0;
                        if (i === a)return s(e, n);
                        for (r = e; r = r.parentNode;)u.unshift(r);
                        for (r = n; r = r.parentNode;)c.unshift(r);
                        for (; u[o] === c[o];)o++;
                        return o ? s(u[o], c[o]) : u[o] === H ? -1 : c[o] === H ? 1 : 0
                    }, t) : I
                }, n.matches = function (e, t) {
                    return n(e, null, null, t)
                }, n.matchesSelector = function (e, t) {
                    if ((e.ownerDocument || e) !== I && M(e), t = t.replace(ht, "='$1']"), !(!k.matchesSelector || !D || R && R.test(t) || P && P.test(t)))try {
                        var r = $.call(e, t);
                        if (r || k.disconnectedMatch || e.document && 11 !== e.document.nodeType)return r
                    } catch (o) {
                    }
                    return n(t, I, null, [e]).length > 0
                }, n.contains = function (e, t) {
                    return(e.ownerDocument || e) !== I && M(e), L(e, t)
                }, n.attr = function (e, n) {
                    (e.ownerDocument || e) !== I && M(e);
                    var r = T.attrHandle[n.toLowerCase()], o = r && Q.call(T.attrHandle, n.toLowerCase()) ? r(e, n, !D) : t;
                    return o === t ? k.attributes || !D ? e.getAttribute(n) : (o = e.getAttributeNode(n)) && o.specified ? o.value : null : o
                }, n.error = function (e) {
                    throw new Error("Syntax error, unrecognized expression: " + e)
                }, n.uniqueSort = function (e) {
                    var t, n = [], r = 0, o = 0;
                    if (z = !k.detectDuplicates, A = !k.sortStable && e.slice(0), e.sort(J), z) {
                        for (; t = e[o++];)t === e[o] && (r = n.push(o));
                        for (; r--;)e.splice(n[r], 1)
                    }
                    return e
                }, C = n.getText = function (e) {
                    var t, n = "", r = 0, o = e.nodeType;
                    if (o) {
                        if (1 === o || 9 === o || 11 === o) {
                            if ("string" == typeof e.textContent)return e.textContent;
                            for (e = e.firstChild; e; e = e.nextSibling)n += C(e)
                        } else if (3 === o || 4 === o)return e.nodeValue
                    } else for (; t = e[r]; r++)n += C(t);
                    return n
                }, T = n.selectors = {cacheLength: 50, createPseudo: o, match: vt, attrHandle: {}, find: {}, relative: {">": {dir: "parentNode", first: !0}, " ": {dir: "parentNode"}, "+": {dir: "previousSibling", first: !0}, "~": {dir: "previousSibling"}}, preFilter: {ATTR: function (e) {
                    return e[1] = e[1].replace(kt, Et), e[3] = (e[4] || e[5] || "").replace(kt, Et), "~=" === e[2] && (e[3] = " " + e[3] + " "), e.slice(0, 4)
                }, CHILD: function (e) {
                    return e[1] = e[1].toLowerCase(), "nth" === e[1].slice(0, 3) ? (e[3] || n.error(e[0]), e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])), e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && n.error(e[0]), e
                }, PSEUDO: function (e) {
                    var n, r = !e[5] && e[2];
                    return vt.CHILD.test(e[0]) ? null : (e[3] && e[4] !== t ? e[2] = e[4] : r && gt.test(r) && (n = d(r, !0)) && (n = r.indexOf(")", r.length - n) - r.length) && (e[0] = e[0].slice(0, n), e[2] = r.slice(0, n)), e.slice(0, 3))
                }}, filter: {TAG: function (e) {
                    var t = e.replace(kt, Et).toLowerCase();
                    return"*" === e ? function () {
                        return!0
                    } : function (e) {
                        return e.nodeName && e.nodeName.toLowerCase() === t
                    }
                }, CLASS: function (e) {
                    var t = U[e + " "];
                    return t || (t = new RegExp("(^|" + ot + ")" + e + "(" + ot + "|$)")) && U(e, function (e) {
                        return t.test("string" == typeof e.className && e.className || typeof e.getAttribute !== X && e.getAttribute("class") || "")
                    })
                }, ATTR: function (e, t, r) {
                    return function (o) {
                        var i = n.attr(o, e);
                        return null == i ? "!=" === t : t ? (i += "", "=" === t ? i === r : "!=" === t ? i !== r : "^=" === t ? r && 0 === i.indexOf(r) : "*=" === t ? r && i.indexOf(r) > -1 : "$=" === t ? r && i.slice(-r.length) === r : "~=" === t ? (" " + i + " ").indexOf(r) > -1 : "|=" === t ? i === r || i.slice(0, r.length + 1) === r + "-" : !1) : !0
                    }
                }, CHILD: function (e, t, n, r, o) {
                    var i = "nth" !== e.slice(0, 3), a = "last" !== e.slice(-4), s = "of-type" === t;
                    return 1 === r && 0 === o ? function (e) {
                        return!!e.parentNode
                    } : function (t, n, u) {
                        var c, l, f, d, p, h, g = i !== a ? "nextSibling" : "previousSibling", m = t.parentNode, v = s && t.nodeName.toLowerCase(), y = !u && !s;
                        if (m) {
                            if (i) {
                                for (; g;) {
                                    for (f = t; f = f[g];)if (s ? f.nodeName.toLowerCase() === v : 1 === f.nodeType)return!1;
                                    h = g = "only" === e && !h && "nextSibling"
                                }
                                return!0
                            }
                            if (h = [a ? m.firstChild : m.lastChild], a && y) {
                                for (l = m[B] || (m[B] = {}), c = l[e] || [], p = c[0] === q && c[1], d = c[0] === q && c[2], f = p && m.childNodes[p]; f = ++p && f && f[g] || (d = p = 0) || h.pop();)if (1 === f.nodeType && ++d && f === t) {
                                    l[e] = [q, p, d];
                                    break
                                }
                            } else if (y && (c = (t[B] || (t[B] = {}))[e]) && c[0] === q)d = c[1]; else for (; (f = ++p && f && f[g] || (d = p = 0) || h.pop()) && ((s ? f.nodeName.toLowerCase() !== v : 1 !== f.nodeType) || !++d || (y && ((f[B] || (f[B] = {}))[e] = [q, d]), f !== t)););
                            return d -= o, d === r || d % r === 0 && d / r >= 0
                        }
                    }
                }, PSEUDO: function (e, t) {
                    var r, i = T.pseudos[e] || T.setFilters[e.toLowerCase()] || n.error("unsupported pseudo: " + e);
                    return i[B] ? i(t) : i.length > 1 ? (r = [e, e, "", t], T.setFilters.hasOwnProperty(e.toLowerCase()) ? o(function (e, n) {
                        for (var r, o = i(e, t), a = o.length; a--;)r = nt.call(e, o[a]), e[r] = !(n[r] = o[a])
                    }) : function (e) {
                        return i(e, 0, r)
                    }) : i
                }}, pseudos: {not: o(function (e) {
                    var t = [], n = [], r = O(e.replace(ct, "$1"));
                    return r[B] ? o(function (e, t, n, o) {
                        for (var i, a = r(e, null, o, []), s = e.length; s--;)(i = a[s]) && (e[s] = !(t[s] = i))
                    }) : function (e, o, i) {
                        return t[0] = e, r(t, null, i, n), !n.pop()
                    }
                }), has: o(function (e) {
                    return function (t) {
                        return n(e, t).length > 0
                    }
                }), contains: o(function (e) {
                    return function (t) {
                        return(t.textContent || t.innerText || C(t)).indexOf(e) > -1
                    }
                }), lang: o(function (e) {
                    return mt.test(e || "") || n.error("unsupported lang: " + e), e = e.replace(kt, Et).toLowerCase(), function (t) {
                        var n;
                        do if (n = D ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang"))return n = n.toLowerCase(), n === e || 0 === n.indexOf(e + "-"); while ((t = t.parentNode) && 1 === t.nodeType);
                        return!1
                    }
                }), target: function (t) {
                    var n = e.location && e.location.hash;
                    return n && n.slice(1) === t.id
                }, root: function (e) {
                    return e === j
                }, focus: function (e) {
                    return e === I.activeElement && (!I.hasFocus || I.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
                }, enabled: function (e) {
                    return e.disabled === !1
                }, disabled: function (e) {
                    return e.disabled === !0
                }, checked: function (e) {
                    var t = e.nodeName.toLowerCase();
                    return"input" === t && !!e.checked || "option" === t && !!e.selected
                }, selected: function (e) {
                    return e.parentNode && e.parentNode.selectedIndex, e.selected === !0
                }, empty: function (e) {
                    for (e = e.firstChild; e; e = e.nextSibling)if (e.nodeName > "@" || 3 === e.nodeType || 4 === e.nodeType)return!1;
                    return!0
                }, parent: function (e) {
                    return!T.pseudos.empty(e)
                }, header: function (e) {
                    return wt.test(e.nodeName)
                }, input: function (e) {
                    return bt.test(e.nodeName)
                }, button: function (e) {
                    var t = e.nodeName.toLowerCase();
                    return"input" === t && "button" === e.type || "button" === t
                }, text: function (e) {
                    var t;
                    return"input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || t.toLowerCase() === e.type)
                }, first: l(function () {
                    return[0]
                }), last: l(function (e, t) {
                    return[t - 1]
                }), eq: l(function (e, t, n) {
                    return[0 > n ? n + t : n]
                }), even: l(function (e, t) {
                    for (var n = 0; t > n; n += 2)e.push(n);
                    return e
                }), odd: l(function (e, t) {
                    for (var n = 1; t > n; n += 2)e.push(n);
                    return e
                }), lt: l(function (e, t, n) {
                    for (var r = 0 > n ? n + t : n; --r >= 0;)e.push(r);
                    return e
                }), gt: l(function (e, t, n) {
                    for (var r = 0 > n ? n + t : n; ++r < t;)e.push(r);
                    return e
                })}}, T.pseudos.nth = T.pseudos.eq;
                for (x in{radio: !0, checkbox: !0, file: !0, password: !0, image: !0})T.pseudos[x] = u(x);
                for (x in{submit: !0, reset: !0})T.pseudos[x] = c(x);
                f.prototype = T.filters = T.pseudos, T.setFilters = new f, O = n.compile = function (e, t) {
                    var n, r = [], o = [], i = W[e + " "];
                    if (!i) {
                        for (t || (t = d(e)), n = t.length; n--;)i = y(t[n]), i[B] ? r.push(i) : o.push(i);
                        i = W(e, _(o, r))
                    }
                    return i
                }, k.sortStable = B.split("").sort(J).join("") === B, k.detectDuplicates = z, M(), k.sortDetached = i(function (e) {
                    return 1 & e.compareDocumentPosition(I.createElement("div"))
                }), i(function (e) {
                    return e.innerHTML = "<a href='#'></a>", "#" === e.firstChild.getAttribute("href")
                }) || a("type|href|height|width", function (e, t, n) {
                    return n ? void 0 : e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2)
                }), k.attributes && i(function (e) {
                    return e.innerHTML = "<input/>", e.firstChild.setAttribute("value", ""), "" === e.firstChild.getAttribute("value")
                }) || a("value", function (e, t, n) {
                    return n || "input" !== e.nodeName.toLowerCase() ? void 0 : e.defaultValue
                }), i(function (e) {
                    return null == e.getAttribute("disabled")
                }) || a(rt, function (e, t, n) {
                    var r;
                    return n ? void 0 : (r = e.getAttributeNode(t)) && r.specified ? r.value : e[t] === !0 ? t.toLowerCase() : null
                }), lt.find = n, lt.expr = n.selectors, lt.expr[":"] = lt.expr.pseudos, lt.unique = n.uniqueSort, lt.text = n.getText, lt.isXMLDoc = n.isXML, lt.contains = n.contains
            }(e);
            var Tt = {};
            lt.Callbacks = function (e) {
                e = "string" == typeof e ? Tt[e] || r(e) : lt.extend({}, e);
                var n, o, i, a, s, u, c = [], l = !e.once && [], f = function (t) {
                    for (o = e.memory && t, i = !0, s = u || 0, u = 0, a = c.length, n = !0; c && a > s; s++)if (c[s].apply(t[0], t[1]) === !1 && e.stopOnFalse) {
                        o = !1;
                        break
                    }
                    n = !1, c && (l ? l.length && f(l.shift()) : o ? c = [] : d.disable())
                }, d = {add: function () {
                    if (c) {
                        var t = c.length;
                        !function r(t) {
                            lt.each(t, function (t, n) {
                                var o = lt.type(n);
                                "function" === o ? e.unique && d.has(n) || c.push(n) : n && n.length && "string" !== o && r(n)
                            })
                        }(arguments), n ? a = c.length : o && (u = t, f(o))
                    }
                    return this
                }, remove: function () {
                    return c && lt.each(arguments, function (e, t) {
                        for (var r; (r = lt.inArray(t, c, r)) > -1;)c.splice(r, 1), n && (a >= r && a--, s >= r && s--)
                    }), this
                }, has: function (e) {
                    return e ? lt.inArray(e, c) > -1 : !(!c || !c.length)
                }, empty: function () {
                    return c = [], a = 0, this
                }, disable: function () {
                    return c = l = o = t, this
                }, disabled: function () {
                    return!c
                }, lock: function () {
                    return l = t, o || d.disable(), this
                }, locked: function () {
                    return!l
                }, fireWith: function (e, t) {
                    return!c || i && !l || (t = t || [], t = [e, t.slice ? t.slice() : t], n ? l.push(t) : f(t)), this
                }, fire: function () {
                    return d.fireWith(this, arguments), this
                }, fired: function () {
                    return!!i
                }};
                return d
            }, lt.extend({Deferred: function (e) {
                var t = [
                    ["resolve", "done", lt.Callbacks("once memory"), "resolved"],
                    ["reject", "fail", lt.Callbacks("once memory"), "rejected"],
                    ["notify", "progress", lt.Callbacks("memory")]
                ], n = "pending", r = {state: function () {
                    return n
                }, always: function () {
                    return o.done(arguments).fail(arguments), this
                }, then: function () {
                    var e = arguments;
                    return lt.Deferred(function (n) {
                        lt.each(t, function (t, i) {
                            var a = i[0], s = lt.isFunction(e[t]) && e[t];
                            o[i[1]](function () {
                                var e = s && s.apply(this, arguments);
                                e && lt.isFunction(e.promise) ? e.promise().done(n.resolve).fail(n.reject).progress(n.notify) : n[a + "With"](this === r ? n.promise() : this, s ? [e] : arguments)
                            })
                        }), e = null
                    }).promise()
                }, promise: function (e) {
                    return null != e ? lt.extend(e, r) : r
                }}, o = {};
                return r.pipe = r.then, lt.each(t, function (e, i) {
                    var a = i[2], s = i[3];
                    r[i[1]] = a.add, s && a.add(function () {
                        n = s
                    }, t[1 ^ e][2].disable, t[2][2].lock), o[i[0]] = function () {
                        return o[i[0] + "With"](this === o ? r : this, arguments), this
                    }, o[i[0] + "With"] = a.fireWith
                }), r.promise(o), e && e.call(o, o), o
            }, when: function (e) {
                var t, n, r, o = 0, i = it.call(arguments), a = i.length, s = 1 !== a || e && lt.isFunction(e.promise) ? a : 0, u = 1 === s ? e : lt.Deferred(), c = function (e, n, r) {
                    return function (o) {
                        n[e] = this, r[e] = arguments.length > 1 ? it.call(arguments) : o, r === t ? u.notifyWith(n, r) : --s || u.resolveWith(n, r)
                    }
                };
                if (a > 1)for (t = new Array(a), n = new Array(a), r = new Array(a); a > o; o++)i[o] && lt.isFunction(i[o].promise) ? i[o].promise().done(c(o, r, i)).fail(u.reject).progress(c(o, n, t)) : --s;
                return s || u.resolveWith(r, i), u.promise()
            }}), lt.support = function (t) {
                var n, r, o, i, a, s, u, c, l, f = Q.createElement("div");
                if (f.setAttribute("className", "t"), f.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", n = f.getElementsByTagName("*") || [], r = f.getElementsByTagName("a")[0], !r || !r.style || !n.length)return t;
                i = Q.createElement("select"), s = i.appendChild(Q.createElement("option")), o = f.getElementsByTagName("input")[0], r.style.cssText = "top:1px;float:left;opacity:.5", t.getSetAttribute = "t" !== f.className, t.leadingWhitespace = 3 === f.firstChild.nodeType, t.tbody = !f.getElementsByTagName("tbody").length, t.htmlSerialize = !!f.getElementsByTagName("link").length, t.style = /top/.test(r.getAttribute("style")), t.hrefNormalized = "/a" === r.getAttribute("href"), t.opacity = /^0.5/.test(r.style.opacity), t.cssFloat = !!r.style.cssFloat, t.checkOn = !!o.value, t.optSelected = s.selected, t.enctype = !!Q.createElement("form").enctype, t.html5Clone = "<:nav></:nav>" !== Q.createElement("nav").cloneNode(!0).outerHTML, t.inlineBlockNeedsLayout = !1, t.shrinkWrapBlocks = !1, t.pixelPosition = !1, t.deleteExpando = !0, t.noCloneEvent = !0, t.reliableMarginRight = !0, t.boxSizingReliable = !0, o.checked = !0, t.noCloneChecked = o.cloneNode(!0).checked, i.disabled = !0, t.optDisabled = !s.disabled;
                try {
                    delete f.test
                } catch (d) {
                    t.deleteExpando = !1
                }
                o = Q.createElement("input"), o.setAttribute("value", ""), t.input = "" === o.getAttribute("value"), o.value = "t", o.setAttribute("type", "radio"), t.radioValue = "t" === o.value, o.setAttribute("checked", "t"), o.setAttribute("name", "t"), a = Q.createDocumentFragment(), a.appendChild(o), t.appendChecked = o.checked, t.checkClone = a.cloneNode(!0).cloneNode(!0).lastChild.checked, f.attachEvent && (f.attachEvent("onclick", function () {
                    t.noCloneEvent = !1
                }), f.cloneNode(!0).click());
                for (l in{submit: !0, change: !0, focusin: !0})f.setAttribute(u = "on" + l, "t"), t[l + "Bubbles"] = u in e || f.attributes[u].expando === !1;
                f.style.backgroundClip = "content-box", f.cloneNode(!0).style.backgroundClip = "", t.clearCloneStyle = "content-box" === f.style.backgroundClip;
                for (l in lt(t))break;
                return t.ownLast = "0" !== l, lt(function () {
                    var n, r, o, i = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;", a = Q.getElementsByTagName("body")[0];
                    a && (n = Q.createElement("div"), n.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px", a.appendChild(n).appendChild(f), f.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", o = f.getElementsByTagName("td"), o[0].style.cssText = "padding:0;margin:0;border:0;display:none", c = 0 === o[0].offsetHeight, o[0].style.display = "", o[1].style.display = "none", t.reliableHiddenOffsets = c && 0 === o[0].offsetHeight, f.innerHTML = "", f.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;", lt.swap(a, null != a.style.zoom ? {zoom: 1} : {}, function () {
                        t.boxSizing = 4 === f.offsetWidth
                    }), e.getComputedStyle && (t.pixelPosition = "1%" !== (e.getComputedStyle(f, null) || {}).top, t.boxSizingReliable = "4px" === (e.getComputedStyle(f, null) || {width: "4px"}).width, r = f.appendChild(Q.createElement("div")), r.style.cssText = f.style.cssText = i, r.style.marginRight = r.style.width = "0", f.style.width = "1px", t.reliableMarginRight = !parseFloat((e.getComputedStyle(r, null) || {}).marginRight)), typeof f.style.zoom !== X && (f.innerHTML = "", f.style.cssText = i + "width:1px;padding:1px;display:inline;zoom:1", t.inlineBlockNeedsLayout = 3 === f.offsetWidth, f.style.display = "block", f.innerHTML = "<div></div>", f.firstChild.style.width = "5px", t.shrinkWrapBlocks = 3 !== f.offsetWidth, t.inlineBlockNeedsLayout && (a.style.zoom = 1)), a.removeChild(n), n = f = o = r = null)
                }), n = i = a = s = r = o = null, t
            }({});
            var Ct = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/, St = /([A-Z])/g;
            lt.extend({cache: {}, noData: {applet: !0, embed: !0, object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"}, hasData: function (e) {
                return e = e.nodeType ? lt.cache[e[lt.expando]] : e[lt.expando], !!e && !s(e)
            }, data: function (e, t, n) {
                return o(e, t, n)
            }, removeData: function (e, t) {
                return i(e, t)
            }, _data: function (e, t, n) {
                return o(e, t, n, !0)
            }, _removeData: function (e, t) {
                return i(e, t, !0)
            }, acceptData: function (e) {
                if (e.nodeType && 1 !== e.nodeType && 9 !== e.nodeType)return!1;
                var t = e.nodeName && lt.noData[e.nodeName.toLowerCase()];
                return!t || t !== !0 && e.getAttribute("classid") === t
            }}), lt.fn.extend({data: function (e, n) {
                var r, o, i = null, s = 0, u = this[0];
                if (e === t) {
                    if (this.length && (i = lt.data(u), 1 === u.nodeType && !lt._data(u, "parsedAttrs"))) {
                        for (r = u.attributes; s < r.length; s++)o = r[s].name, 0 === o.indexOf("data-") && (o = lt.camelCase(o.slice(5)), a(u, o, i[o]));
                        lt._data(u, "parsedAttrs", !0)
                    }
                    return i
                }
                return"object" == typeof e ? this.each(function () {
                    lt.data(this, e)
                }) : arguments.length > 1 ? this.each(function () {
                    lt.data(this, e, n)
                }) : u ? a(u, e, lt.data(u, e)) : null
            }, removeData: function (e) {
                return this.each(function () {
                    lt.removeData(this, e)
                })
            }}), lt.extend({queue: function (e, t, n) {
                var r;
                return e ? (t = (t || "fx") + "queue", r = lt._data(e, t), n && (!r || lt.isArray(n) ? r = lt._data(e, t, lt.makeArray(n)) : r.push(n)), r || []) : void 0
            }, dequeue: function (e, t) {
                t = t || "fx";
                var n = lt.queue(e, t), r = n.length, o = n.shift(), i = lt._queueHooks(e, t), a = function () {
                    lt.dequeue(e, t)
                };
                "inprogress" === o && (o = n.shift(), r--), o && ("fx" === t && n.unshift("inprogress"), delete i.stop, o.call(e, a, i)), !r && i && i.empty.fire()
            }, _queueHooks: function (e, t) {
                var n = t + "queueHooks";
                return lt._data(e, n) || lt._data(e, n, {empty: lt.Callbacks("once memory").add(function () {
                    lt._removeData(e, t + "queue"), lt._removeData(e, n)
                })})
            }}), lt.fn.extend({queue: function (e, n) {
                var r = 2;
                return"string" != typeof e && (n = e, e = "fx", r--), arguments.length < r ? lt.queue(this[0], e) : n === t ? this : this.each(function () {
                    var t = lt.queue(this, e, n);
                    lt._queueHooks(this, e), "fx" === e && "inprogress" !== t[0] && lt.dequeue(this, e)
                })
            }, dequeue: function (e) {
                return this.each(function () {
                    lt.dequeue(this, e)
                })
            }, delay: function (e, t) {
                return e = lt.fx ? lt.fx.speeds[e] || e : e, t = t || "fx", this.queue(t, function (t, n) {
                    var r = setTimeout(t, e);
                    n.stop = function () {
                        clearTimeout(r)
                    }
                })
            }, clearQueue: function (e) {
                return this.queue(e || "fx", [])
            }, promise: function (e, n) {
                var r, o = 1, i = lt.Deferred(), a = this, s = this.length, u = function () {
                    --o || i.resolveWith(a, [a])
                };
                for ("string" != typeof e && (n = e, e = t), e = e || "fx"; s--;)r = lt._data(a[s], e + "queueHooks"), r && r.empty && (o++, r.empty.add(u));
                return u(), i.promise(n)
            }});
            var Ot, Nt, At = /[\t\r\n\f]/g, Mt = /\r/g, It = /^(?:input|select|textarea|button|object)$/i, jt = /^(?:a|area)$/i, Dt = /^(?:checked|selected)$/i, Pt = lt.support.getSetAttribute, Rt = lt.support.input;
            lt.fn.extend({attr: function (e, t) {
                return lt.access(this, lt.attr, e, t, arguments.length > 1)
            }, removeAttr: function (e) {
                return this.each(function () {
                    lt.removeAttr(this, e)
                })
            }, prop: function (e, t) {
                return lt.access(this, lt.prop, e, t, arguments.length > 1)
            }, removeProp: function (e) {
                return e = lt.propFix[e] || e, this.each(function () {
                    try {
                        this[e] = t, delete this[e]
                    } catch (n) {
                    }
                })
            }, addClass: function (e) {
                var t, n, r, o, i, a = 0, s = this.length, u = "string" == typeof e && e;
                if (lt.isFunction(e))return this.each(function (t) {
                    lt(this).addClass(e.call(this, t, this.className))
                });
                if (u)for (t = (e || "").match(dt) || []; s > a; a++)if (n = this[a], r = 1 === n.nodeType && (n.className ? (" " + n.className + " ").replace(At, " ") : " ")) {
                    for (i = 0; o = t[i++];)r.indexOf(" " + o + " ") < 0 && (r += o + " ");
                    n.className = lt.trim(r)
                }
                return this
            }, removeClass: function (e) {
                var t, n, r, o, i, a = 0, s = this.length, u = 0 === arguments.length || "string" == typeof e && e;
                if (lt.isFunction(e))return this.each(function (t) {
                    lt(this).removeClass(e.call(this, t, this.className))
                });
                if (u)for (t = (e || "").match(dt) || []; s > a; a++)if (n = this[a], r = 1 === n.nodeType && (n.className ? (" " + n.className + " ").replace(At, " ") : "")) {
                    for (i = 0; o = t[i++];)for (; r.indexOf(" " + o + " ") >= 0;)r = r.replace(" " + o + " ", " ");
                    n.className = e ? lt.trim(r) : ""
                }
                return this
            }, toggleClass: function (e, t) {
                var n = typeof e;
                return"boolean" == typeof t && "string" === n ? t ? this.addClass(e) : this.removeClass(e) : lt.isFunction(e) ? this.each(function (n) {
                    lt(this).toggleClass(e.call(this, n, this.className, t), t)
                }) : this.each(function () {
                    if ("string" === n)for (var t, r = 0, o = lt(this), i = e.match(dt) || []; t = i[r++];)o.hasClass(t) ? o.removeClass(t) : o.addClass(t); else(n === X || "boolean" === n) && (this.className && lt._data(this, "__className__", this.className), this.className = this.className || e === !1 ? "" : lt._data(this, "__className__") || "")
                })
            }, hasClass: function (e) {
                for (var t = " " + e + " ", n = 0, r = this.length; r > n; n++)if (1 === this[n].nodeType && (" " + this[n].className + " ").replace(At, " ").indexOf(t) >= 0)return!0;
                return!1
            }, val: function (e) {
                var n, r, o, i = this[0];
                {
                    if (arguments.length)return o = lt.isFunction(e), this.each(function (n) {
                        var i;
                        1 === this.nodeType && (i = o ? e.call(this, n, lt(this).val()) : e, null == i ? i = "" : "number" == typeof i ? i += "" : lt.isArray(i) && (i = lt.map(i, function (e) {
                            return null == e ? "" : e + ""
                        })), r = lt.valHooks[this.type] || lt.valHooks[this.nodeName.toLowerCase()], r && "set"in r && r.set(this, i, "value") !== t || (this.value = i))
                    });
                    if (i)return r = lt.valHooks[i.type] || lt.valHooks[i.nodeName.toLowerCase()], r && "get"in r && (n = r.get(i, "value")) !== t ? n : (n = i.value, "string" == typeof n ? n.replace(Mt, "") : null == n ? "" : n)
                }
            }}), lt.extend({valHooks: {option: {get: function (e) {
                var t = lt.find.attr(e, "value");
                return null != t ? t : e.text
            }}, select: {get: function (e) {
                for (var t, n, r = e.options, o = e.selectedIndex, i = "select-one" === e.type || 0 > o, a = i ? null : [], s = i ? o + 1 : r.length, u = 0 > o ? s : i ? o : 0; s > u; u++)if (n = r[u], !(!n.selected && u !== o || (lt.support.optDisabled ? n.disabled : null !== n.getAttribute("disabled")) || n.parentNode.disabled && lt.nodeName(n.parentNode, "optgroup"))) {
                    if (t = lt(n).val(), i)return t;
                    a.push(t)
                }
                return a
            }, set: function (e, t) {
                for (var n, r, o = e.options, i = lt.makeArray(t), a = o.length; a--;)r = o[a], (r.selected = lt.inArray(lt(r).val(), i) >= 0) && (n = !0);
                return n || (e.selectedIndex = -1), i
            }}}, attr: function (e, n, r) {
                var o, i, a = e.nodeType;
                if (e && 3 !== a && 8 !== a && 2 !== a)return typeof e.getAttribute === X ? lt.prop(e, n, r) : (1 === a && lt.isXMLDoc(e) || (n = n.toLowerCase(), o = lt.attrHooks[n] || (lt.expr.match.bool.test(n) ? Nt : Ot)), r === t ? o && "get"in o && null !== (i = o.get(e, n)) ? i : (i = lt.find.attr(e, n), null == i ? t : i) : null !== r ? o && "set"in o && (i = o.set(e, r, n)) !== t ? i : (e.setAttribute(n, r + ""), r) : (lt.removeAttr(e, n), void 0))
            }, removeAttr: function (e, t) {
                var n, r, o = 0, i = t && t.match(dt);
                if (i && 1 === e.nodeType)for (; n = i[o++];)r = lt.propFix[n] || n, lt.expr.match.bool.test(n) ? Rt && Pt || !Dt.test(n) ? e[r] = !1 : e[lt.camelCase("default-" + n)] = e[r] = !1 : lt.attr(e, n, ""), e.removeAttribute(Pt ? n : r)
            }, attrHooks: {type: {set: function (e, t) {
                if (!lt.support.radioValue && "radio" === t && lt.nodeName(e, "input")) {
                    var n = e.value;
                    return e.setAttribute("type", t), n && (e.value = n), t
                }
            }}}, propFix: {"for": "htmlFor", "class": "className"}, prop: function (e, n, r) {
                var o, i, a, s = e.nodeType;
                if (e && 3 !== s && 8 !== s && 2 !== s)return a = 1 !== s || !lt.isXMLDoc(e), a && (n = lt.propFix[n] || n, i = lt.propHooks[n]), r !== t ? i && "set"in i && (o = i.set(e, r, n)) !== t ? o : e[n] = r : i && "get"in i && null !== (o = i.get(e, n)) ? o : e[n]
            }, propHooks: {tabIndex: {get: function (e) {
                var t = lt.find.attr(e, "tabindex");
                return t ? parseInt(t, 10) : It.test(e.nodeName) || jt.test(e.nodeName) && e.href ? 0 : -1
            }}}}), Nt = {set: function (e, t, n) {
                return t === !1 ? lt.removeAttr(e, n) : Rt && Pt || !Dt.test(n) ? e.setAttribute(!Pt && lt.propFix[n] || n, n) : e[lt.camelCase("default-" + n)] = e[n] = !0, n
            }}, lt.each(lt.expr.match.bool.source.match(/\w+/g), function (e, n) {
                var r = lt.expr.attrHandle[n] || lt.find.attr;
                lt.expr.attrHandle[n] = Rt && Pt || !Dt.test(n) ? function (e, n, o) {
                    var i = lt.expr.attrHandle[n], a = o ? t : (lt.expr.attrHandle[n] = t) != r(e, n, o) ? n.toLowerCase() : null;
                    return lt.expr.attrHandle[n] = i, a
                } : function (e, n, r) {
                    return r ? t : e[lt.camelCase("default-" + n)] ? n.toLowerCase() : null
                }
            }), Rt && Pt || (lt.attrHooks.value = {set: function (e, t, n) {
                return lt.nodeName(e, "input") ? (e.defaultValue = t, void 0) : Ot && Ot.set(e, t, n)
            }}), Pt || (Ot = {set: function (e, n, r) {
                var o = e.getAttributeNode(r);
                return o || e.setAttributeNode(o = e.ownerDocument.createAttribute(r)), o.value = n += "", "value" === r || n === e.getAttribute(r) ? n : t
            }}, lt.expr.attrHandle.id = lt.expr.attrHandle.name = lt.expr.attrHandle.coords = function (e, n, r) {
                var o;
                return r ? t : (o = e.getAttributeNode(n)) && "" !== o.value ? o.value : null
            }, lt.valHooks.button = {get: function (e, n) {
                var r = e.getAttributeNode(n);
                return r && r.specified ? r.value : t
            }, set: Ot.set}, lt.attrHooks.contenteditable = {set: function (e, t, n) {
                Ot.set(e, "" === t ? !1 : t, n)
            }}, lt.each(["width", "height"], function (e, t) {
                lt.attrHooks[t] = {set: function (e, n) {
                    return"" === n ? (e.setAttribute(t, "auto"), n) : void 0
                }}
            })), lt.support.hrefNormalized || lt.each(["href", "src"], function (e, t) {
                lt.propHooks[t] = {get: function (e) {
                    return e.getAttribute(t, 4)
                }}
            }), lt.support.style || (lt.attrHooks.style = {get: function (e) {
                return e.style.cssText || t
            }, set: function (e, t) {
                return e.style.cssText = t + ""
            }}), lt.support.optSelected || (lt.propHooks.selected = {get: function (e) {
                var t = e.parentNode;
                return t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex), null
            }}), lt.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function () {
                lt.propFix[this.toLowerCase()] = this
            }), lt.support.enctype || (lt.propFix.enctype = "encoding"), lt.each(["radio", "checkbox"], function () {
                lt.valHooks[this] = {set: function (e, t) {
                    return lt.isArray(t) ? e.checked = lt.inArray(lt(e).val(), t) >= 0 : void 0
                }}, lt.support.checkOn || (lt.valHooks[this].get = function (e) {
                    return null === e.getAttribute("value") ? "on" : e.value
                })
            });
            var $t = /^(?:input|select|textarea)$/i, Lt = /^key/, Bt = /^(?:mouse|contextmenu)|click/, Ht = /^(?:focusinfocus|focusoutblur)$/, qt = /^([^.]*)(?:\.(.+)|)$/;
            lt.event = {global: {}, add: function (e, n, r, o, i) {
                var a, s, u, c, l, f, d, p, h, g, m, v = lt._data(e);
                if (v) {
                    for (r.handler && (c = r, r = c.handler, i = c.selector), r.guid || (r.guid = lt.guid++), (s = v.events) || (s = v.events = {}), (f = v.handle) || (f = v.handle = function (e) {
                        return typeof lt === X || e && lt.event.triggered === e.type ? t : lt.event.dispatch.apply(f.elem, arguments)
                    }, f.elem = e), n = (n || "").match(dt) || [""], u = n.length; u--;)a = qt.exec(n[u]) || [], h = m = a[1], g = (a[2] || "").split(".").sort(), h && (l = lt.event.special[h] || {}, h = (i ? l.delegateType : l.bindType) || h, l = lt.event.special[h] || {}, d = lt.extend({type: h, origType: m, data: o, handler: r, guid: r.guid, selector: i, needsContext: i && lt.expr.match.needsContext.test(i), namespace: g.join(".")}, c), (p = s[h]) || (p = s[h] = [], p.delegateCount = 0, l.setup && l.setup.call(e, o, g, f) !== !1 || (e.addEventListener ? e.addEventListener(h, f, !1) : e.attachEvent && e.attachEvent("on" + h, f))), l.add && (l.add.call(e, d), d.handler.guid || (d.handler.guid = r.guid)), i ? p.splice(p.delegateCount++, 0, d) : p.push(d), lt.event.global[h] = !0);
                    e = null
                }
            }, remove: function (e, t, n, r, o) {
                var i, a, s, u, c, l, f, d, p, h, g, m = lt.hasData(e) && lt._data(e);
                if (m && (l = m.events)) {
                    for (t = (t || "").match(dt) || [""], c = t.length; c--;)if (s = qt.exec(t[c]) || [], p = g = s[1], h = (s[2] || "").split(".").sort(), p) {
                        for (f = lt.event.special[p] || {}, p = (r ? f.delegateType : f.bindType) || p, d = l[p] || [], s = s[2] && new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)"), u = i = d.length; i--;)a = d[i], !o && g !== a.origType || n && n.guid !== a.guid || s && !s.test(a.namespace) || r && r !== a.selector && ("**" !== r || !a.selector) || (d.splice(i, 1), a.selector && d.delegateCount--, f.remove && f.remove.call(e, a));
                        u && !d.length && (f.teardown && f.teardown.call(e, h, m.handle) !== !1 || lt.removeEvent(e, p, m.handle), delete l[p])
                    } else for (p in l)lt.event.remove(e, p + t[c], n, r, !0);
                    lt.isEmptyObject(l) && (delete m.handle, lt._removeData(e, "events"))
                }
            }, trigger: function (n, r, o, i) {
                var a, s, u, c, l, f, d, p = [o || Q], h = ut.call(n, "type") ? n.type : n, g = ut.call(n, "namespace") ? n.namespace.split(".") : [];
                if (u = f = o = o || Q, 3 !== o.nodeType && 8 !== o.nodeType && !Ht.test(h + lt.event.triggered) && (h.indexOf(".") >= 0 && (g = h.split("."), h = g.shift(), g.sort()), s = h.indexOf(":") < 0 && "on" + h, n = n[lt.expando] ? n : new lt.Event(h, "object" == typeof n && n), n.isTrigger = i ? 2 : 3, n.namespace = g.join("."), n.namespace_re = n.namespace ? new RegExp("(^|\\.)" + g.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, n.result = t, n.target || (n.target = o), r = null == r ? [n] : lt.makeArray(r, [n]), l = lt.event.special[h] || {}, i || !l.trigger || l.trigger.apply(o, r) !== !1)) {
                    if (!i && !l.noBubble && !lt.isWindow(o)) {
                        for (c = l.delegateType || h, Ht.test(c + h) || (u = u.parentNode); u; u = u.parentNode)p.push(u), f = u;
                        f === (o.ownerDocument || Q) && p.push(f.defaultView || f.parentWindow || e)
                    }
                    for (d = 0; (u = p[d++]) && !n.isPropagationStopped();)n.type = d > 1 ? c : l.bindType || h, a = (lt._data(u, "events") || {})[n.type] && lt._data(u, "handle"), a && a.apply(u, r), a = s && u[s], a && lt.acceptData(u) && a.apply && a.apply(u, r) === !1 && n.preventDefault();
                    if (n.type = h, !i && !n.isDefaultPrevented() && (!l._default || l._default.apply(p.pop(), r) === !1) && lt.acceptData(o) && s && o[h] && !lt.isWindow(o)) {
                        f = o[s], f && (o[s] = null), lt.event.triggered = h;
                        try {
                            o[h]()
                        } catch (m) {
                        }
                        lt.event.triggered = t, f && (o[s] = f)
                    }
                    return n.result
                }
            }, dispatch: function (e) {
                e = lt.event.fix(e);
                var n, r, o, i, a, s = [], u = it.call(arguments), c = (lt._data(this, "events") || {})[e.type] || [], l = lt.event.special[e.type] || {};
                if (u[0] = e, e.delegateTarget = this, !l.preDispatch || l.preDispatch.call(this, e) !== !1) {
                    for (s = lt.event.handlers.call(this, e, c), n = 0; (i = s[n++]) && !e.isPropagationStopped();)for (e.currentTarget = i.elem, a = 0; (o = i.handlers[a++]) && !e.isImmediatePropagationStopped();)(!e.namespace_re || e.namespace_re.test(o.namespace)) && (e.handleObj = o, e.data = o.data, r = ((lt.event.special[o.origType] || {}).handle || o.handler).apply(i.elem, u), r !== t && (e.result = r) === !1 && (e.preventDefault(), e.stopPropagation()));
                    return l.postDispatch && l.postDispatch.call(this, e), e.result
                }
            }, handlers: function (e, n) {
                var r, o, i, a, s = [], u = n.delegateCount, c = e.target;
                if (u && c.nodeType && (!e.button || "click" !== e.type))for (; c != this; c = c.parentNode || this)if (1 === c.nodeType && (c.disabled !== !0 || "click" !== e.type)) {
                    for (i = [], a = 0; u > a; a++)o = n[a], r = o.selector + " ", i[r] === t && (i[r] = o.needsContext ? lt(r, this).index(c) >= 0 : lt.find(r, this, null, [c]).length), i[r] && i.push(o);
                    i.length && s.push({elem: c, handlers: i})
                }
                return u < n.length && s.push({elem: this, handlers: n.slice(u)}), s
            }, fix: function (e) {
                if (e[lt.expando])return e;
                var t, n, r, o = e.type, i = e, a = this.fixHooks[o];
                for (a || (this.fixHooks[o] = a = Bt.test(o) ? this.mouseHooks : Lt.test(o) ? this.keyHooks : {}), r = a.props ? this.props.concat(a.props) : this.props, e = new lt.Event(i), t = r.length; t--;)n = r[t], e[n] = i[n];
                return e.target || (e.target = i.srcElement || Q), 3 === e.target.nodeType && (e.target = e.target.parentNode), e.metaKey = !!e.metaKey, a.filter ? a.filter(e, i) : e
            }, props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "), fixHooks: {}, keyHooks: {props: "char charCode key keyCode".split(" "), filter: function (e, t) {
                return null == e.which && (e.which = null != t.charCode ? t.charCode : t.keyCode), e
            }}, mouseHooks: {props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "), filter: function (e, n) {
                var r, o, i, a = n.button, s = n.fromElement;
                return null == e.pageX && null != n.clientX && (o = e.target.ownerDocument || Q, i = o.documentElement, r = o.body, e.pageX = n.clientX + (i && i.scrollLeft || r && r.scrollLeft || 0) - (i && i.clientLeft || r && r.clientLeft || 0), e.pageY = n.clientY + (i && i.scrollTop || r && r.scrollTop || 0) - (i && i.clientTop || r && r.clientTop || 0)), !e.relatedTarget && s && (e.relatedTarget = s === e.target ? n.toElement : s), e.which || a === t || (e.which = 1 & a ? 1 : 2 & a ? 3 : 4 & a ? 2 : 0), e
            }}, special: {load: {noBubble: !0}, focus: {trigger: function () {
                if (this !== l() && this.focus)try {
                    return this.focus(), !1
                } catch (e) {
                }
            }, delegateType: "focusin"}, blur: {trigger: function () {
                return this === l() && this.blur ? (this.blur(), !1) : void 0
            }, delegateType: "focusout"}, click: {trigger: function () {
                return lt.nodeName(this, "input") && "checkbox" === this.type && this.click ? (this.click(), !1) : void 0
            }, _default: function (e) {
                return lt.nodeName(e.target, "a")
            }}, beforeunload: {postDispatch: function (e) {
                e.result !== t && (e.originalEvent.returnValue = e.result)
            }}}, simulate: function (e, t, n, r) {
                var o = lt.extend(new lt.Event, n, {type: e, isSimulated: !0, originalEvent: {}});
                r ? lt.event.trigger(o, null, t) : lt.event.dispatch.call(t, o), o.isDefaultPrevented() && n.preventDefault()
            }}, lt.removeEvent = Q.removeEventListener ? function (e, t, n) {
                e.removeEventListener && e.removeEventListener(t, n, !1)
            } : function (e, t, n) {
                var r = "on" + t;
                e.detachEvent && (typeof e[r] === X && (e[r] = null), e.detachEvent(r, n))
            }, lt.Event = function (e, t) {
                return this instanceof lt.Event ? (e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || e.returnValue === !1 || e.getPreventDefault && e.getPreventDefault() ? u : c) : this.type = e, t && lt.extend(this, t), this.timeStamp = e && e.timeStamp || lt.now(), this[lt.expando] = !0, void 0) : new lt.Event(e, t)
            }, lt.Event.prototype = {isDefaultPrevented: c, isPropagationStopped: c, isImmediatePropagationStopped: c, preventDefault: function () {
                var e = this.originalEvent;
                this.isDefaultPrevented = u, e && (e.preventDefault ? e.preventDefault() : e.returnValue = !1)
            }, stopPropagation: function () {
                var e = this.originalEvent;
                this.isPropagationStopped = u, e && (e.stopPropagation && e.stopPropagation(), e.cancelBubble = !0)
            }, stopImmediatePropagation: function () {
                this.isImmediatePropagationStopped = u, this.stopPropagation()
            }}, lt.each({mouseenter: "mouseover", mouseleave: "mouseout"}, function (e, t) {
                lt.event.special[e] = {delegateType: t, bindType: t, handle: function (e) {
                    var n, r = this, o = e.relatedTarget, i = e.handleObj;
                    return(!o || o !== r && !lt.contains(r, o)) && (e.type = i.origType, n = i.handler.apply(this, arguments), e.type = t), n
                }}
            }), lt.support.submitBubbles || (lt.event.special.submit = {setup: function () {
                return lt.nodeName(this, "form") ? !1 : (lt.event.add(this, "click._submit keypress._submit", function (e) {
                    var n = e.target, r = lt.nodeName(n, "input") || lt.nodeName(n, "button") ? n.form : t;
                    r && !lt._data(r, "submitBubbles") && (lt.event.add(r, "submit._submit", function (e) {
                        e._submit_bubble = !0
                    }), lt._data(r, "submitBubbles", !0))
                }), void 0)
            }, postDispatch: function (e) {
                e._submit_bubble && (delete e._submit_bubble, this.parentNode && !e.isTrigger && lt.event.simulate("submit", this.parentNode, e, !0))
            }, teardown: function () {
                return lt.nodeName(this, "form") ? !1 : (lt.event.remove(this, "._submit"), void 0)
            }}), lt.support.changeBubbles || (lt.event.special.change = {setup: function () {
                return $t.test(this.nodeName) ? (("checkbox" === this.type || "radio" === this.type) && (lt.event.add(this, "propertychange._change", function (e) {
                    "checked" === e.originalEvent.propertyName && (this._just_changed = !0)
                }), lt.event.add(this, "click._change", function (e) {
                    this._just_changed && !e.isTrigger && (this._just_changed = !1), lt.event.simulate("change", this, e, !0)
                })), !1) : (lt.event.add(this, "beforeactivate._change", function (e) {
                    var t = e.target;
                    $t.test(t.nodeName) && !lt._data(t, "changeBubbles") && (lt.event.add(t, "change._change", function (e) {
                        !this.parentNode || e.isSimulated || e.isTrigger || lt.event.simulate("change", this.parentNode, e, !0)
                    }), lt._data(t, "changeBubbles", !0))
                }), void 0)
            }, handle: function (e) {
                var t = e.target;
                return this !== t || e.isSimulated || e.isTrigger || "radio" !== t.type && "checkbox" !== t.type ? e.handleObj.handler.apply(this, arguments) : void 0
            }, teardown: function () {
                return lt.event.remove(this, "._change"), !$t.test(this.nodeName)
            }}), lt.support.focusinBubbles || lt.each({focus: "focusin", blur: "focusout"}, function (e, t) {
                var n = 0, r = function (e) {
                    lt.event.simulate(t, e.target, lt.event.fix(e), !0)
                };
                lt.event.special[t] = {setup: function () {
                    0 === n++ && Q.addEventListener(e, r, !0)
                }, teardown: function () {
                    0 === --n && Q.removeEventListener(e, r, !0)
                }}
            }), lt.fn.extend({on: function (e, n, r, o, i) {
                var a, s;
                if ("object" == typeof e) {
                    "string" != typeof n && (r = r || n, n = t);
                    for (a in e)this.on(a, n, r, e[a], i);
                    return this
                }
                if (null == r && null == o ? (o = n, r = n = t) : null == o && ("string" == typeof n ? (o = r, r = t) : (o = r, r = n, n = t)), o === !1)o = c; else if (!o)return this;
                return 1 === i && (s = o, o = function (e) {
                    return lt().off(e), s.apply(this, arguments)
                }, o.guid = s.guid || (s.guid = lt.guid++)), this.each(function () {
                    lt.event.add(this, e, o, r, n)
                })
            }, one: function (e, t, n, r) {
                return this.on(e, t, n, r, 1)
            }, off: function (e, n, r) {
                var o, i;
                if (e && e.preventDefault && e.handleObj)return o = e.handleObj, lt(e.delegateTarget).off(o.namespace ? o.origType + "." + o.namespace : o.origType, o.selector, o.handler), this;
                if ("object" == typeof e) {
                    for (i in e)this.off(i, n, e[i]);
                    return this
                }
                return(n === !1 || "function" == typeof n) && (r = n, n = t), r === !1 && (r = c), this.each(function () {
                    lt.event.remove(this, e, r, n)
                })
            }, trigger: function (e, t) {
                return this.each(function () {
                    lt.event.trigger(e, t, this)
                })
            }, triggerHandler: function (e, t) {
                var n = this[0];
                return n ? lt.event.trigger(e, t, n, !0) : void 0
            }});
            var Ft = /^.[^:#\[\.,]*$/, Ut = /^(?:parents|prev(?:Until|All))/, Vt = lt.expr.match.needsContext, Wt = {children: !0, contents: !0, next: !0, prev: !0};
            lt.fn.extend({find: function (e) {
                var t, n = [], r = this, o = r.length;
                if ("string" != typeof e)return this.pushStack(lt(e).filter(function () {
                    for (t = 0; o > t; t++)if (lt.contains(r[t], this))return!0
                }));
                for (t = 0; o > t; t++)lt.find(e, r[t], n);
                return n = this.pushStack(o > 1 ? lt.unique(n) : n), n.selector = this.selector ? this.selector + " " + e : e, n
            }, has: function (e) {
                var t, n = lt(e, this), r = n.length;
                return this.filter(function () {
                    for (t = 0; r > t; t++)if (lt.contains(this, n[t]))return!0
                })
            }, not: function (e) {
                return this.pushStack(d(this, e || [], !0))
            }, filter: function (e) {
                return this.pushStack(d(this, e || [], !1))
            }, is: function (e) {
                return!!d(this, "string" == typeof e && Vt.test(e) ? lt(e) : e || [], !1).length
            }, closest: function (e, t) {
                for (var n, r = 0, o = this.length, i = [], a = Vt.test(e) || "string" != typeof e ? lt(e, t || this.context) : 0; o > r; r++)for (n = this[r]; n && n !== t; n = n.parentNode)if (n.nodeType < 11 && (a ? a.index(n) > -1 : 1 === n.nodeType && lt.find.matchesSelector(n, e))) {
                    n = i.push(n);
                    break
                }
                return this.pushStack(i.length > 1 ? lt.unique(i) : i)
            }, index: function (e) {
                return e ? "string" == typeof e ? lt.inArray(this[0], lt(e)) : lt.inArray(e.jquery ? e[0] : e, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
            }, add: function (e, t) {
                var n = "string" == typeof e ? lt(e, t) : lt.makeArray(e && e.nodeType ? [e] : e), r = lt.merge(this.get(), n);
                return this.pushStack(lt.unique(r))
            }, addBack: function (e) {
                return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
            }}), lt.each({parent: function (e) {
                var t = e.parentNode;
                return t && 11 !== t.nodeType ? t : null
            }, parents: function (e) {
                return lt.dir(e, "parentNode")
            }, parentsUntil: function (e, t, n) {
                return lt.dir(e, "parentNode", n)
            }, next: function (e) {
                return f(e, "nextSibling")
            }, prev: function (e) {
                return f(e, "previousSibling")
            }, nextAll: function (e) {
                return lt.dir(e, "nextSibling")
            }, prevAll: function (e) {
                return lt.dir(e, "previousSibling")
            }, nextUntil: function (e, t, n) {
                return lt.dir(e, "nextSibling", n)
            }, prevUntil: function (e, t, n) {
                return lt.dir(e, "previousSibling", n)
            }, siblings: function (e) {
                return lt.sibling((e.parentNode || {}).firstChild, e)
            }, children: function (e) {
                return lt.sibling(e.firstChild)
            }, contents: function (e) {
                return lt.nodeName(e, "iframe") ? e.contentDocument || e.contentWindow.document : lt.merge([], e.childNodes)
            }}, function (e, t) {
                lt.fn[e] = function (n, r) {
                    var o = lt.map(this, t, n);
                    return"Until" !== e.slice(-5) && (r = n), r && "string" == typeof r && (o = lt.filter(r, o)), this.length > 1 && (Wt[e] || (o = lt.unique(o)), Ut.test(e) && (o = o.reverse())), this.pushStack(o)
                }
            }), lt.extend({filter: function (e, t, n) {
                var r = t[0];
                return n && (e = ":not(" + e + ")"), 1 === t.length && 1 === r.nodeType ? lt.find.matchesSelector(r, e) ? [r] : [] : lt.find.matches(e, lt.grep(t, function (e) {
                    return 1 === e.nodeType
                }))
            }, dir: function (e, n, r) {
                for (var o = [], i = e[n]; i && 9 !== i.nodeType && (r === t || 1 !== i.nodeType || !lt(i).is(r));)1 === i.nodeType && o.push(i), i = i[n];
                return o
            }, sibling: function (e, t) {
                for (var n = []; e; e = e.nextSibling)1 === e.nodeType && e !== t && n.push(e);
                return n
            }});
            var zt = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video", Jt = / jQuery\d+="(?:null|\d+)"/g, Xt = new RegExp("<(?:" + zt + ")[\\s/>]", "i"), Gt = /^\s+/, Qt = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, Yt = /<([\w:]+)/, Kt = /<tbody/i, Zt = /<|&#?\w+;/, en = /<(?:script|style|link)/i, tn = /^(?:checkbox|radio)$/i, nn = /checked\s*(?:[^=]|=\s*.checked.)/i, rn = /^$|\/(?:java|ecma)script/i, on = /^true\/(.*)/, an = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g, sn = {option: [1, "<select multiple='multiple'>", "</select>"], legend: [1, "<fieldset>", "</fieldset>"], area: [1, "<map>", "</map>"], param: [1, "<object>", "</object>"], thead: [1, "<table>", "</table>"], tr: [2, "<table><tbody>", "</tbody></table>"], col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"], td: [3, "<table><tbody><tr>", "</tr></tbody></table>"], _default: lt.support.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]}, un = p(Q), cn = un.appendChild(Q.createElement("div"));
            sn.optgroup = sn.option, sn.tbody = sn.tfoot = sn.colgroup = sn.caption = sn.thead, sn.th = sn.td, lt.fn.extend({text: function (e) {
                return lt.access(this, function (e) {
                    return e === t ? lt.text(this) : this.empty().append((this[0] && this[0].ownerDocument || Q).createTextNode(e))
                }, null, e, arguments.length)
            }, append: function () {
                return this.domManip(arguments, function (e) {
                    if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                        var t = h(this, e);
                        t.appendChild(e)
                    }
                })
            }, prepend: function () {
                return this.domManip(arguments, function (e) {
                    if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                        var t = h(this, e);
                        t.insertBefore(e, t.firstChild)
                    }
                })
            }, before: function () {
                return this.domManip(arguments, function (e) {
                    this.parentNode && this.parentNode.insertBefore(e, this)
                })
            }, after: function () {
                return this.domManip(arguments, function (e) {
                    this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
                })
            }, remove: function (e, t) {
                for (var n, r = e ? lt.filter(e, this) : this, o = 0; null != (n = r[o]); o++)t || 1 !== n.nodeType || lt.cleanData(b(n)), n.parentNode && (t && lt.contains(n.ownerDocument, n) && v(b(n, "script")), n.parentNode.removeChild(n));
                return this
            }, empty: function () {
                for (var e, t = 0; null != (e = this[t]); t++) {
                    for (1 === e.nodeType && lt.cleanData(b(e, !1)); e.firstChild;)e.removeChild(e.firstChild);
                    e.options && lt.nodeName(e, "select") && (e.options.length = 0)
                }
                return this
            }, clone: function (e, t) {
                return e = null == e ? !1 : e, t = null == t ? e : t, this.map(function () {
                    return lt.clone(this, e, t)
                })
            }, html: function (e) {
                return lt.access(this, function (e) {
                    var n = this[0] || {}, r = 0, o = this.length;
                    if (e === t)return 1 === n.nodeType ? n.innerHTML.replace(Jt, "") : t;
                    if (!("string" != typeof e || en.test(e) || !lt.support.htmlSerialize && Xt.test(e) || !lt.support.leadingWhitespace && Gt.test(e) || sn[(Yt.exec(e) || ["", ""])[1].toLowerCase()])) {
                        e = e.replace(Qt, "<$1></$2>");
                        try {
                            for (; o > r; r++)n = this[r] || {}, 1 === n.nodeType && (lt.cleanData(b(n, !1)), n.innerHTML = e);
                            n = 0
                        } catch (i) {
                        }
                    }
                    n && this.empty().append(e)
                }, null, e, arguments.length)
            }, replaceWith: function () {
                var e = lt.map(this, function (e) {
                    return[e.nextSibling, e.parentNode]
                }), t = 0;
                return this.domManip(arguments, function (n) {
                    var r = e[t++], o = e[t++];
                    o && (r && r.parentNode !== o && (r = this.nextSibling), lt(this).remove(), o.insertBefore(n, r))
                }, !0), t ? this : this.remove()
            }, detach: function (e) {
                return this.remove(e, !0)
            }, domManip: function (e, t, n) {
                e = rt.apply([], e);
                var r, o, i, a, s, u, c = 0, l = this.length, f = this, d = l - 1, p = e[0], h = lt.isFunction(p);
                if (h || !(1 >= l || "string" != typeof p || lt.support.checkClone) && nn.test(p))return this.each(function (r) {
                    var o = f.eq(r);
                    h && (e[0] = p.call(this, r, o.html())), o.domManip(e, t, n)
                });
                if (l && (u = lt.buildFragment(e, this[0].ownerDocument, !1, !n && this), r = u.firstChild, 1 === u.childNodes.length && (u = r), r)) {
                    for (a = lt.map(b(u, "script"), g), i = a.length; l > c; c++)o = u, c !== d && (o = lt.clone(o, !0, !0), i && lt.merge(a, b(o, "script"))), t.call(this[c], o, c);
                    if (i)for (s = a[a.length - 1].ownerDocument, lt.map(a, m), c = 0; i > c; c++)o = a[c], rn.test(o.type || "") && !lt._data(o, "globalEval") && lt.contains(s, o) && (o.src ? lt._evalUrl(o.src) : lt.globalEval((o.text || o.textContent || o.innerHTML || "").replace(an, "")));
                    u = r = null
                }
                return this
            }}), lt.each({appendTo: "append", prependTo: "prepend", insertBefore: "before", insertAfter: "after", replaceAll: "replaceWith"}, function (e, t) {
                lt.fn[e] = function (e) {
                    for (var n, r = 0, o = [], i = lt(e), a = i.length - 1; a >= r; r++)n = r === a ? this : this.clone(!0), lt(i[r])[t](n), ot.apply(o, n.get());
                    return this.pushStack(o)
                }
            }), lt.extend({clone: function (e, t, n) {
                var r, o, i, a, s, u = lt.contains(e.ownerDocument, e);
                if (lt.support.html5Clone || lt.isXMLDoc(e) || !Xt.test("<" + e.nodeName + ">") ? i = e.cloneNode(!0) : (cn.innerHTML = e.outerHTML, cn.removeChild(i = cn.firstChild)), !(lt.support.noCloneEvent && lt.support.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || lt.isXMLDoc(e)))for (r = b(i), s = b(e), a = 0; null != (o = s[a]); ++a)r[a] && _(o, r[a]);
                if (t)if (n)for (s = s || b(e), r = r || b(i), a = 0; null != (o = s[a]); a++)y(o, r[a]); else y(e, i);
                return r = b(i, "script"), r.length > 0 && v(r, !u && b(e, "script")), r = s = o = null, i
            }, buildFragment: function (e, t, n, r) {
                for (var o, i, a, s, u, c, l, f = e.length, d = p(t), h = [], g = 0; f > g; g++)if (i = e[g], i || 0 === i)if ("object" === lt.type(i))lt.merge(h, i.nodeType ? [i] : i); else if (Zt.test(i)) {
                    for (s = s || d.appendChild(t.createElement("div")), u = (Yt.exec(i) || ["", ""])[1].toLowerCase(), l = sn[u] || sn._default, s.innerHTML = l[1] + i.replace(Qt, "<$1></$2>") + l[2], o = l[0]; o--;)s = s.lastChild;
                    if (!lt.support.leadingWhitespace && Gt.test(i) && h.push(t.createTextNode(Gt.exec(i)[0])), !lt.support.tbody)for (i = "table" !== u || Kt.test(i) ? "<table>" !== l[1] || Kt.test(i) ? 0 : s : s.firstChild, o = i && i.childNodes.length; o--;)lt.nodeName(c = i.childNodes[o], "tbody") && !c.childNodes.length && i.removeChild(c);
                    for (lt.merge(h, s.childNodes), s.textContent = ""; s.firstChild;)s.removeChild(s.firstChild);
                    s = d.lastChild
                } else h.push(t.createTextNode(i));
                for (s && d.removeChild(s), lt.support.appendChecked || lt.grep(b(h, "input"), w), g = 0; i = h[g++];)if ((!r || -1 === lt.inArray(i, r)) && (a = lt.contains(i.ownerDocument, i), s = b(d.appendChild(i), "script"), a && v(s), n))for (o = 0; i = s[o++];)rn.test(i.type || "") && n.push(i);
                return s = null, d
            }, cleanData: function (e, t) {
                for (var n, r, o, i, a = 0, s = lt.expando, u = lt.cache, c = lt.support.deleteExpando, l = lt.event.special; null != (n = e[a]); a++)if ((t || lt.acceptData(n)) && (o = n[s], i = o && u[o])) {
                    if (i.events)for (r in i.events)l[r] ? lt.event.remove(n, r) : lt.removeEvent(n, r, i.handle);
                    u[o] && (delete u[o], c ? delete n[s] : typeof n.removeAttribute !== X ? n.removeAttribute(s) : n[s] = null, tt.push(o))
                }
            }, _evalUrl: function (e) {
                return lt.ajax({url: e, type: "GET", dataType: "script", async: !1, global: !1, "throws": !0})
            }}), lt.fn.extend({wrapAll: function (e) {
                if (lt.isFunction(e))return this.each(function (t) {
                    lt(this).wrapAll(e.call(this, t))
                });
                if (this[0]) {
                    var t = lt(e, this[0].ownerDocument).eq(0).clone(!0);
                    this[0].parentNode && t.insertBefore(this[0]), t.map(function () {
                        for (var e = this; e.firstChild && 1 === e.firstChild.nodeType;)e = e.firstChild;
                        return e
                    }).append(this)
                }
                return this
            }, wrapInner: function (e) {
                return lt.isFunction(e) ? this.each(function (t) {
                    lt(this).wrapInner(e.call(this, t))
                }) : this.each(function () {
                    var t = lt(this), n = t.contents();
                    n.length ? n.wrapAll(e) : t.append(e)
                })
            }, wrap: function (e) {
                var t = lt.isFunction(e);
                return this.each(function (n) {
                    lt(this).wrapAll(t ? e.call(this, n) : e)
                })
            }, unwrap: function () {
                return this.parent().each(function () {
                    lt.nodeName(this, "body") || lt(this).replaceWith(this.childNodes)
                }).end()
            }});
            var ln, fn, dn, pn = /alpha\([^)]*\)/i, hn = /opacity\s*=\s*([^)]*)/, gn = /^(top|right|bottom|left)$/, mn = /^(none|table(?!-c[ea]).+)/, vn = /^margin/, yn = new RegExp("^(" + ft + ")(.*)$", "i"), _n = new RegExp("^(" + ft + ")(?!px)[a-z%]+$", "i"), bn = new RegExp("^([+-])=(" + ft + ")", "i"), wn = {BODY: "block"}, xn = {position: "absolute", visibility: "hidden", display: "block"}, kn = {letterSpacing: 0, fontWeight: 400}, En = ["Top", "Right", "Bottom", "Left"], Tn = ["Webkit", "O", "Moz", "ms"];
            lt.fn.extend({css: function (e, n) {
                return lt.access(this, function (e, n, r) {
                    var o, i, a = {}, s = 0;
                    if (lt.isArray(n)) {
                        for (i = fn(e), o = n.length; o > s; s++)a[n[s]] = lt.css(e, n[s], !1, i);
                        return a
                    }
                    return r !== t ? lt.style(e, n, r) : lt.css(e, n)
                }, e, n, arguments.length > 1)
            }, show: function () {
                return E(this, !0)
            }, hide: function () {
                return E(this)
            }, toggle: function (e) {
                return"boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function () {
                    k(this) ? lt(this).show() : lt(this).hide()
                })
            }}), lt.extend({cssHooks: {opacity: {get: function (e, t) {
                if (t) {
                    var n = dn(e, "opacity");
                    return"" === n ? "1" : n
                }
            }}}, cssNumber: {columnCount: !0, fillOpacity: !0, fontWeight: !0, lineHeight: !0, opacity: !0, order: !0, orphans: !0, widows: !0, zIndex: !0, zoom: !0}, cssProps: {"float": lt.support.cssFloat ? "cssFloat" : "styleFloat"}, style: function (e, n, r, o) {
                if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                    var i, a, s, u = lt.camelCase(n), c = e.style;
                    if (n = lt.cssProps[u] || (lt.cssProps[u] = x(c, u)), s = lt.cssHooks[n] || lt.cssHooks[u], r === t)return s && "get"in s && (i = s.get(e, !1, o)) !== t ? i : c[n];
                    if (a = typeof r, "string" === a && (i = bn.exec(r)) && (r = (i[1] + 1) * i[2] + parseFloat(lt.css(e, n)), a = "number"), !(null == r || "number" === a && isNaN(r) || ("number" !== a || lt.cssNumber[u] || (r += "px"), lt.support.clearCloneStyle || "" !== r || 0 !== n.indexOf("background") || (c[n] = "inherit"), s && "set"in s && (r = s.set(e, r, o)) === t)))try {
                        c[n] = r
                    } catch (l) {
                    }
                }
            }, css: function (e, n, r, o) {
                var i, a, s, u = lt.camelCase(n);
                return n = lt.cssProps[u] || (lt.cssProps[u] = x(e.style, u)), s = lt.cssHooks[n] || lt.cssHooks[u], s && "get"in s && (a = s.get(e, !0, r)), a === t && (a = dn(e, n, o)), "normal" === a && n in kn && (a = kn[n]), "" === r || r ? (i = parseFloat(a), r === !0 || lt.isNumeric(i) ? i || 0 : a) : a
            }}), e.getComputedStyle ? (fn = function (t) {
                return e.getComputedStyle(t, null)
            }, dn = function (e, n, r) {
                var o, i, a, s = r || fn(e), u = s ? s.getPropertyValue(n) || s[n] : t, c = e.style;
                return s && ("" !== u || lt.contains(e.ownerDocument, e) || (u = lt.style(e, n)), _n.test(u) && vn.test(n) && (o = c.width, i = c.minWidth, a = c.maxWidth, c.minWidth = c.maxWidth = c.width = u, u = s.width, c.width = o, c.minWidth = i, c.maxWidth = a)), u
            }) : Q.documentElement.currentStyle && (fn = function (e) {
                return e.currentStyle
            }, dn = function (e, n, r) {
                var o, i, a, s = r || fn(e), u = s ? s[n] : t, c = e.style;
                return null == u && c && c[n] && (u = c[n]), _n.test(u) && !gn.test(n) && (o = c.left, i = e.runtimeStyle, a = i && i.left, a && (i.left = e.currentStyle.left), c.left = "fontSize" === n ? "1em" : u, u = c.pixelLeft + "px", c.left = o, a && (i.left = a)), "" === u ? "auto" : u
            }), lt.each(["height", "width"], function (e, t) {
                lt.cssHooks[t] = {get: function (e, n, r) {
                    return n ? 0 === e.offsetWidth && mn.test(lt.css(e, "display")) ? lt.swap(e, xn, function () {
                        return S(e, t, r)
                    }) : S(e, t, r) : void 0
                }, set: function (e, n, r) {
                    var o = r && fn(e);
                    return T(e, n, r ? C(e, t, r, lt.support.boxSizing && "border-box" === lt.css(e, "boxSizing", !1, o), o) : 0)
                }}
            }), lt.support.opacity || (lt.cssHooks.opacity = {get: function (e, t) {
                return hn.test((t && e.currentStyle ? e.currentStyle.filter : e.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : t ? "1" : ""
            }, set: function (e, t) {
                var n = e.style, r = e.currentStyle, o = lt.isNumeric(t) ? "alpha(opacity=" + 100 * t + ")" : "", i = r && r.filter || n.filter || "";
                n.zoom = 1, (t >= 1 || "" === t) && "" === lt.trim(i.replace(pn, "")) && n.removeAttribute && (n.removeAttribute("filter"), "" === t || r && !r.filter) || (n.filter = pn.test(i) ? i.replace(pn, o) : i + " " + o)
            }}), lt(function () {
                lt.support.reliableMarginRight || (lt.cssHooks.marginRight = {get: function (e, t) {
                    return t ? lt.swap(e, {display: "inline-block"}, dn, [e, "marginRight"]) : void 0
                }}), !lt.support.pixelPosition && lt.fn.position && lt.each(["top", "left"], function (e, t) {
                    lt.cssHooks[t] = {get: function (e, n) {
                        return n ? (n = dn(e, t), _n.test(n) ? lt(e).position()[t] + "px" : n) : void 0
                    }}
                })
            }), lt.expr && lt.expr.filters && (lt.expr.filters.hidden = function (e) {
                return e.offsetWidth <= 0 && e.offsetHeight <= 0 || !lt.support.reliableHiddenOffsets && "none" === (e.style && e.style.display || lt.css(e, "display"))
            }, lt.expr.filters.visible = function (e) {
                return!lt.expr.filters.hidden(e)
            }), lt.each({margin: "", padding: "", border: "Width"}, function (e, t) {
                lt.cssHooks[e + t] = {expand: function (n) {
                    for (var r = 0, o = {}, i = "string" == typeof n ? n.split(" ") : [n]; 4 > r; r++)o[e + En[r] + t] = i[r] || i[r - 2] || i[0];
                    return o
                }}, vn.test(e) || (lt.cssHooks[e + t].set = T)
            });
            var Cn = /%20/g, Sn = /\[\]$/, On = /\r?\n/g, Nn = /^(?:submit|button|image|reset|file)$/i, An = /^(?:input|select|textarea|keygen)/i;
            lt.fn.extend({serialize: function () {
                return lt.param(this.serializeArray())
            }, serializeArray: function () {
                return this.map(function () {
                    var e = lt.prop(this, "elements");
                    return e ? lt.makeArray(e) : this
                }).filter(function () {
                    var e = this.type;
                    return this.name && !lt(this).is(":disabled") && An.test(this.nodeName) && !Nn.test(e) && (this.checked || !tn.test(e))
                }).map(function (e, t) {
                    var n = lt(this).val();
                    return null == n ? null : lt.isArray(n) ? lt.map(n, function (e) {
                        return{name: t.name, value: e.replace(On, "\r\n")}
                    }) : {name: t.name, value: n.replace(On, "\r\n")}
                }).get()
            }}), lt.param = function (e, n) {
                var r, o = [], i = function (e, t) {
                    t = lt.isFunction(t) ? t() : null == t ? "" : t, o[o.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t)
                };
                if (n === t && (n = lt.ajaxSettings && lt.ajaxSettings.traditional), lt.isArray(e) || e.jquery && !lt.isPlainObject(e))lt.each(e, function () {
                    i(this.name, this.value)
                }); else for (r in e)A(r, e[r], n, i);
                return o.join("&").replace(Cn, "+")
            }, lt.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function (e, t) {
                lt.fn[t] = function (e, n) {
                    return arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t)
                }
            }), lt.fn.extend({hover: function (e, t) {
                return this.mouseenter(e).mouseleave(t || e)
            }, bind: function (e, t, n) {
                return this.on(e, null, t, n)
            }, unbind: function (e, t) {
                return this.off(e, null, t)
            }, delegate: function (e, t, n, r) {
                return this.on(t, e, n, r)
            }, undelegate: function (e, t, n) {
                return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n)
            }});
            var Mn, In, jn = lt.now(), Dn = /\?/, Pn = /#.*$/, Rn = /([?&])_=[^&]*/, $n = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm, Ln = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, Bn = /^(?:GET|HEAD)$/, Hn = /^\/\//, qn = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/, Fn = lt.fn.load, Un = {}, Vn = {}, Wn = "*/".concat("*");
            try {
                In = G.href
            } catch (zn) {
                In = Q.createElement("a"), In.href = "", In = In.href
            }
            Mn = qn.exec(In.toLowerCase()) || [], lt.fn.load = function (e, n, r) {
                if ("string" != typeof e && Fn)return Fn.apply(this, arguments);
                var o, i, a, s = this, u = e.indexOf(" ");
                return u >= 0 && (o = e.slice(u, e.length), e = e.slice(0, u)), lt.isFunction(n) ? (r = n, n = t) : n && "object" == typeof n && (a = "POST"), s.length > 0 && lt.ajax({url: e, type: a, dataType: "html", data: n}).done(function (e) {
                    i = arguments, s.html(o ? lt("<div>").append(lt.parseHTML(e)).find(o) : e)
                }).complete(r && function (e, t) {
                    s.each(r, i || [e.responseText, t, e])
                }), this
            }, lt.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function (e, t) {
                lt.fn[t] = function (e) {
                    return this.on(t, e)
                }
            }), lt.extend({active: 0, lastModified: {}, etag: {}, ajaxSettings: {url: In, type: "GET", isLocal: Ln.test(Mn[1]), global: !0, processData: !0, async: !0, contentType: "application/x-www-form-urlencoded; charset=UTF-8", accepts: {"*": Wn, text: "text/plain", html: "text/html", xml: "application/xml, text/xml", json: "application/json, text/javascript"}, contents: {xml: /xml/, html: /html/, json: /json/}, responseFields: {xml: "responseXML", text: "responseText", json: "responseJSON"}, converters: {"* text": String, "text html": !0, "text json": lt.parseJSON, "text xml": lt.parseXML}, flatOptions: {url: !0, context: !0}}, ajaxSetup: function (e, t) {
                return t ? j(j(e, lt.ajaxSettings), t) : j(lt.ajaxSettings, e)
            }, ajaxPrefilter: M(Un), ajaxTransport: M(Vn), ajax: function (e, n) {
                function r(e, n, r, o) {
                    var i, f, y, _, w, k = n;
                    2 !== b && (b = 2, u && clearTimeout(u), l = t, s = o || "", x.readyState = e > 0 ? 4 : 0, i = e >= 200 && 300 > e || 304 === e, r && (_ = D(d, x, r)), _ = P(d, _, x, i), i ? (d.ifModified && (w = x.getResponseHeader("Last-Modified"), w && (lt.lastModified[a] = w), w = x.getResponseHeader("etag"), w && (lt.etag[a] = w)), 204 === e || "HEAD" === d.type ? k = "nocontent" : 304 === e ? k = "notmodified" : (k = _.state, f = _.data, y = _.error, i = !y)) : (y = k, (e || !k) && (k = "error", 0 > e && (e = 0))), x.status = e, x.statusText = (n || k) + "", i ? g.resolveWith(p, [f, k, x]) : g.rejectWith(p, [x, k, y]), x.statusCode(v), v = t, c && h.trigger(i ? "ajaxSuccess" : "ajaxError", [x, d, i ? f : y]), m.fireWith(p, [x, k]), c && (h.trigger("ajaxComplete", [x, d]), --lt.active || lt.event.trigger("ajaxStop")))
                }

                "object" == typeof e && (n = e, e = t), n = n || {};
                var o, i, a, s, u, c, l, f, d = lt.ajaxSetup({}, n), p = d.context || d, h = d.context && (p.nodeType || p.jquery) ? lt(p) : lt.event, g = lt.Deferred(), m = lt.Callbacks("once memory"), v = d.statusCode || {}, y = {}, _ = {}, b = 0, w = "canceled", x = {readyState: 0, getResponseHeader: function (e) {
                    var t;
                    if (2 === b) {
                        if (!f)for (f = {}; t = $n.exec(s);)f[t[1].toLowerCase()] = t[2];
                        t = f[e.toLowerCase()]
                    }
                    return null == t ? null : t
                }, getAllResponseHeaders: function () {
                    return 2 === b ? s : null
                }, setRequestHeader: function (e, t) {
                    var n = e.toLowerCase();
                    return b || (e = _[n] = _[n] || e, y[e] = t), this
                }, overrideMimeType: function (e) {
                    return b || (d.mimeType = e), this
                }, statusCode: function (e) {
                    var t;
                    if (e)if (2 > b)for (t in e)v[t] = [v[t], e[t]]; else x.always(e[x.status]);
                    return this
                }, abort: function (e) {
                    var t = e || w;
                    return l && l.abort(t), r(0, t), this
                }};
                if (g.promise(x).complete = m.add, x.success = x.done, x.error = x.fail, d.url = ((e || d.url || In) + "").replace(Pn, "").replace(Hn, Mn[1] + "//"), d.type = n.method || n.type || d.method || d.type, d.dataTypes = lt.trim(d.dataType || "*").toLowerCase().match(dt) || [""], null == d.crossDomain && (o = qn.exec(d.url.toLowerCase()), d.crossDomain = !(!o || o[1] === Mn[1] && o[2] === Mn[2] && (o[3] || ("http:" === o[1] ? "80" : "443")) === (Mn[3] || ("http:" === Mn[1] ? "80" : "443")))), d.data && d.processData && "string" != typeof d.data && (d.data = lt.param(d.data, d.traditional)), I(Un, d, n, x), 2 === b)return x;
                c = d.global, c && 0 === lt.active++ && lt.event.trigger("ajaxStart"), d.type = d.type.toUpperCase(), d.hasContent = !Bn.test(d.type), a = d.url, d.hasContent || (d.data && (a = d.url += (Dn.test(a) ? "&" : "?") + d.data, delete d.data), d.cache === !1 && (d.url = Rn.test(a) ? a.replace(Rn, "$1_=" + jn++) : a + (Dn.test(a) ? "&" : "?") + "_=" + jn++)), d.ifModified && (lt.lastModified[a] && x.setRequestHeader("If-Modified-Since", lt.lastModified[a]), lt.etag[a] && x.setRequestHeader("If-None-Match", lt.etag[a])), (d.data && d.hasContent && d.contentType !== !1 || n.contentType) && x.setRequestHeader("Content-Type", d.contentType), x.setRequestHeader("Accept", d.dataTypes[0] && d.accepts[d.dataTypes[0]] ? d.accepts[d.dataTypes[0]] + ("*" !== d.dataTypes[0] ? ", " + Wn + "; q=0.01" : "") : d.accepts["*"]);
                for (i in d.headers)x.setRequestHeader(i, d.headers[i]);
                if (d.beforeSend && (d.beforeSend.call(p, x, d) === !1 || 2 === b))return x.abort();
                w = "abort";
                for (i in{success: 1, error: 1, complete: 1})x[i](d[i]);
                if (l = I(Vn, d, n, x)) {
                    x.readyState = 1, c && h.trigger("ajaxSend", [x, d]), d.async && d.timeout > 0 && (u = setTimeout(function () {
                        x.abort("timeout")
                    }, d.timeout));
                    try {
                        b = 1, l.send(y, r)
                    } catch (k) {
                        if (!(2 > b))throw k;
                        r(-1, k)
                    }
                } else r(-1, "No Transport");
                return x
            }, getJSON: function (e, t, n) {
                return lt.get(e, t, n, "json")
            }, getScript: function (e, n) {
                return lt.get(e, t, n, "script")
            }}), lt.each(["get", "post"], function (e, n) {
                lt[n] = function (e, r, o, i) {
                    return lt.isFunction(r) && (i = i || o, o = r, r = t), lt.ajax({url: e, type: n, dataType: i, data: r, success: o})
                }
            }), lt.ajaxSetup({accepts: {script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"}, contents: {script: /(?:java|ecma)script/}, converters: {"text script": function (e) {
                return lt.globalEval(e), e
            }}}), lt.ajaxPrefilter("script", function (e) {
                e.cache === t && (e.cache = !1), e.crossDomain && (e.type = "GET", e.global = !1)
            }), lt.ajaxTransport("script", function (e) {
                if (e.crossDomain) {
                    var n, r = Q.head || lt("head")[0] || Q.documentElement;
                    return{send: function (t, o) {
                        n = Q.createElement("script"), n.async = !0, e.scriptCharset && (n.charset = e.scriptCharset), n.src = e.url, n.onload = n.onreadystatechange = function (e, t) {
                            (t || !n.readyState || /loaded|complete/.test(n.readyState)) && (n.onload = n.onreadystatechange = null, n.parentNode && n.parentNode.removeChild(n), n = null, t || o(200, "success"))
                        }, r.insertBefore(n, r.firstChild)
                    }, abort: function () {
                        n && n.onload(t, !0)
                    }}
                }
            });
            var Jn = [], Xn = /(=)\?(?=&|$)|\?\?/;
            lt.ajaxSetup({jsonp: "callback", jsonpCallback: function () {
                var e = Jn.pop() || lt.expando + "_" + jn++;
                return this[e] = !0, e
            }}), lt.ajaxPrefilter("json jsonp", function (n, r, o) {
                var i, a, s, u = n.jsonp !== !1 && (Xn.test(n.url) ? "url" : "string" == typeof n.data && !(n.contentType || "").indexOf("application/x-www-form-urlencoded") && Xn.test(n.data) && "data");
                return u || "jsonp" === n.dataTypes[0] ? (i = n.jsonpCallback = lt.isFunction(n.jsonpCallback) ? n.jsonpCallback() : n.jsonpCallback, u ? n[u] = n[u].replace(Xn, "$1" + i) : n.jsonp !== !1 && (n.url += (Dn.test(n.url) ? "&" : "?") + n.jsonp + "=" + i), n.converters["script json"] = function () {
                    return s || lt.error(i + " was not called"), s[0]
                }, n.dataTypes[0] = "json", a = e[i], e[i] = function () {
                    s = arguments
                }, o.always(function () {
                    e[i] = a, n[i] && (n.jsonpCallback = r.jsonpCallback, Jn.push(i)), s && lt.isFunction(a) && a(s[0]), s = a = t
                }), "script") : void 0
            });
            var Gn, Qn, Yn = 0, Kn = e.ActiveXObject && function () {
                var e;
                for (e in Gn)Gn[e](t, !0)
            };
            lt.ajaxSettings.xhr = e.ActiveXObject ? function () {
                return!this.isLocal && R() || $()
            } : R, Qn = lt.ajaxSettings.xhr(), lt.support.cors = !!Qn && "withCredentials"in Qn, Qn = lt.support.ajax = !!Qn, Qn && lt.ajaxTransport(function (n) {
                if (!n.crossDomain || lt.support.cors) {
                    var r;
                    return{send: function (o, i) {
                        var a, s, u = n.xhr();
                        if (n.username ? u.open(n.type, n.url, n.async, n.username, n.password) : u.open(n.type, n.url, n.async), n.xhrFields)for (s in n.xhrFields)u[s] = n.xhrFields[s];
                        n.mimeType && u.overrideMimeType && u.overrideMimeType(n.mimeType), n.crossDomain || o["X-Requested-With"] || (o["X-Requested-With"] = "XMLHttpRequest");
                        try {
                            for (s in o)u.setRequestHeader(s, o[s])
                        } catch (c) {
                        }
                        u.send(n.hasContent && n.data || null), r = function (e, o) {
                            var s, c, l, f;
                            try {
                                if (r && (o || 4 === u.readyState))if (r = t, a && (u.onreadystatechange = lt.noop, Kn && delete Gn[a]), o)4 !== u.readyState && u.abort(); else {
                                    f = {}, s = u.status, c = u.getAllResponseHeaders(), "string" == typeof u.responseText && (f.text = u.responseText);
                                    try {
                                        l = u.statusText
                                    } catch (d) {
                                        l = ""
                                    }
                                    s || !n.isLocal || n.crossDomain ? 1223 === s && (s = 204) : s = f.text ? 200 : 404
                                }
                            } catch (p) {
                                o || i(-1, p)
                            }
                            f && i(s, l, f, c)
                        }, n.async ? 4 === u.readyState ? setTimeout(r) : (a = ++Yn, Kn && (Gn || (Gn = {}, lt(e).unload(Kn)), Gn[a] = r), u.onreadystatechange = r) : r()
                    }, abort: function () {
                        r && r(t, !0)
                    }}
                }
            });
            var Zn, er, tr = /^(?:toggle|show|hide)$/, nr = new RegExp("^(?:([+-])=|)(" + ft + ")([a-z%]*)$", "i"), rr = /queueHooks$/, or = [F], ir = {"*": [function (e, t) {
                var n = this.createTween(e, t), r = n.cur(), o = nr.exec(t), i = o && o[3] || (lt.cssNumber[e] ? "" : "px"), a = (lt.cssNumber[e] || "px" !== i && +r) && nr.exec(lt.css(n.elem, e)), s = 1, u = 20;
                if (a && a[3] !== i) {
                    i = i || a[3], o = o || [], a = +r || 1;
                    do s = s || ".5", a /= s, lt.style(n.elem, e, a + i); while (s !== (s = n.cur() / r) && 1 !== s && --u)
                }
                return o && (a = n.start = +a || +r || 0, n.unit = i, n.end = o[1] ? a + (o[1] + 1) * o[2] : +o[2]), n
            }]};
            lt.Animation = lt.extend(H, {tweener: function (e, t) {
                lt.isFunction(e) ? (t = e, e = ["*"]) : e = e.split(" ");
                for (var n, r = 0, o = e.length; o > r; r++)n = e[r], ir[n] = ir[n] || [], ir[n].unshift(t)
            }, prefilter: function (e, t) {
                t ? or.unshift(e) : or.push(e)
            }}), lt.Tween = U, U.prototype = {constructor: U, init: function (e, t, n, r, o, i) {
                this.elem = e, this.prop = n, this.easing = o || "swing", this.options = t, this.start = this.now = this.cur(), this.end = r, this.unit = i || (lt.cssNumber[n] ? "" : "px")
            }, cur: function () {
                var e = U.propHooks[this.prop];
                return e && e.get ? e.get(this) : U.propHooks._default.get(this)
            }, run: function (e) {
                var t, n = U.propHooks[this.prop];
                return this.pos = t = this.options.duration ? lt.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : e, this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), n && n.set ? n.set(this) : U.propHooks._default.set(this), this
            }}, U.prototype.init.prototype = U.prototype, U.propHooks = {_default: {get: function (e) {
                var t;
                return null == e.elem[e.prop] || e.elem.style && null != e.elem.style[e.prop] ? (t = lt.css(e.elem, e.prop, ""), t && "auto" !== t ? t : 0) : e.elem[e.prop]
            }, set: function (e) {
                lt.fx.step[e.prop] ? lt.fx.step[e.prop](e) : e.elem.style && (null != e.elem.style[lt.cssProps[e.prop]] || lt.cssHooks[e.prop]) ? lt.style(e.elem, e.prop, e.now + e.unit) : e.elem[e.prop] = e.now
            }}}, U.propHooks.scrollTop = U.propHooks.scrollLeft = {set: function (e) {
                e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
            }}, lt.each(["toggle", "show", "hide"], function (e, t) {
                var n = lt.fn[t];
                lt.fn[t] = function (e, r, o) {
                    return null == e || "boolean" == typeof e ? n.apply(this, arguments) : this.animate(V(t, !0), e, r, o)
                }
            }), lt.fn.extend({fadeTo: function (e, t, n, r) {
                return this.filter(k).css("opacity", 0).show().end().animate({opacity: t}, e, n, r)
            }, animate: function (e, t, n, r) {
                var o = lt.isEmptyObject(e), i = lt.speed(t, n, r), a = function () {
                    var t = H(this, lt.extend({}, e), i);
                    (o || lt._data(this, "finish")) && t.stop(!0)
                };
                return a.finish = a, o || i.queue === !1 ? this.each(a) : this.queue(i.queue, a)
            }, stop: function (e, n, r) {
                var o = function (e) {
                    var t = e.stop;
                    delete e.stop, t(r)
                };
                return"string" != typeof e && (r = n, n = e, e = t), n && e !== !1 && this.queue(e || "fx", []), this.each(function () {
                    var t = !0, n = null != e && e + "queueHooks", i = lt.timers, a = lt._data(this);
                    if (n)a[n] && a[n].stop && o(a[n]); else for (n in a)a[n] && a[n].stop && rr.test(n) && o(a[n]);
                    for (n = i.length; n--;)i[n].elem !== this || null != e && i[n].queue !== e || (i[n].anim.stop(r), t = !1, i.splice(n, 1));
                    (t || !r) && lt.dequeue(this, e)
                })
            }, finish: function (e) {
                return e !== !1 && (e = e || "fx"), this.each(function () {
                    var t, n = lt._data(this), r = n[e + "queue"], o = n[e + "queueHooks"], i = lt.timers, a = r ? r.length : 0;
                    for (n.finish = !0, lt.queue(this, e, []), o && o.stop && o.stop.call(this, !0), t = i.length; t--;)i[t].elem === this && i[t].queue === e && (i[t].anim.stop(!0), i.splice(t, 1));
                    for (t = 0; a > t; t++)r[t] && r[t].finish && r[t].finish.call(this);
                    delete n.finish
                })
            }}), lt.each({slideDown: V("show"), slideUp: V("hide"), slideToggle: V("toggle"), fadeIn: {opacity: "show"}, fadeOut: {opacity: "hide"}, fadeToggle: {opacity: "toggle"}}, function (e, t) {
                lt.fn[e] = function (e, n, r) {
                    return this.animate(t, e, n, r)
                }
            }), lt.speed = function (e, t, n) {
                var r = e && "object" == typeof e ? lt.extend({}, e) : {complete: n || !n && t || lt.isFunction(e) && e, duration: e, easing: n && t || t && !lt.isFunction(t) && t};
                return r.duration = lt.fx.off ? 0 : "number" == typeof r.duration ? r.duration : r.duration in lt.fx.speeds ? lt.fx.speeds[r.duration] : lt.fx.speeds._default, (null == r.queue || r.queue === !0) && (r.queue = "fx"), r.old = r.complete, r.complete = function () {
                    lt.isFunction(r.old) && r.old.call(this), r.queue && lt.dequeue(this, r.queue)
                }, r
            }, lt.easing = {linear: function (e) {
                return e
            }, swing: function (e) {
                return.5 - Math.cos(e * Math.PI) / 2
            }}, lt.timers = [], lt.fx = U.prototype.init, lt.fx.tick = function () {
                var e, n = lt.timers, r = 0;
                for (Zn = lt.now(); r < n.length; r++)e = n[r], e() || n[r] !== e || n.splice(r--, 1);
                n.length || lt.fx.stop(), Zn = t
            }, lt.fx.timer = function (e) {
                e() && lt.timers.push(e) && lt.fx.start()
            }, lt.fx.interval = 13, lt.fx.start = function () {
                er || (er = setInterval(lt.fx.tick, lt.fx.interval))
            }, lt.fx.stop = function () {
                clearInterval(er), er = null
            }, lt.fx.speeds = {slow: 600, fast: 200, _default: 400}, lt.fx.step = {}, lt.expr && lt.expr.filters && (lt.expr.filters.animated = function (e) {
                return lt.grep(lt.timers,function (t) {
                    return e === t.elem
                }).length
            }), lt.fn.offset = function (e) {
                if (arguments.length)return e === t ? this : this.each(function (t) {
                    lt.offset.setOffset(this, e, t)
                });
                var n, r, o = {top: 0, left: 0}, i = this[0], a = i && i.ownerDocument;
                if (a)return n = a.documentElement, lt.contains(n, i) ? (typeof i.getBoundingClientRect !== X && (o = i.getBoundingClientRect()), r = W(a), {top: o.top + (r.pageYOffset || n.scrollTop) - (n.clientTop || 0), left: o.left + (r.pageXOffset || n.scrollLeft) - (n.clientLeft || 0)}) : o
            }, lt.offset = {setOffset: function (e, t, n) {
                var r = lt.css(e, "position");
                "static" === r && (e.style.position = "relative");
                var o, i, a = lt(e), s = a.offset(), u = lt.css(e, "top"), c = lt.css(e, "left"), l = ("absolute" === r || "fixed" === r) && lt.inArray("auto", [u, c]) > -1, f = {}, d = {};
                l ? (d = a.position(), o = d.top, i = d.left) : (o = parseFloat(u) || 0, i = parseFloat(c) || 0), lt.isFunction(t) && (t = t.call(e, n, s)), null != t.top && (f.top = t.top - s.top + o), null != t.left && (f.left = t.left - s.left + i), "using"in t ? t.using.call(e, f) : a.css(f)
            }}, lt.fn.extend({position: function () {
                if (this[0]) {
                    var e, t, n = {top: 0, left: 0}, r = this[0];
                    return"fixed" === lt.css(r, "position") ? t = r.getBoundingClientRect() : (e = this.offsetParent(), t = this.offset(), lt.nodeName(e[0], "html") || (n = e.offset()), n.top += lt.css(e[0], "borderTopWidth", !0), n.left += lt.css(e[0], "borderLeftWidth", !0)), {top: t.top - n.top - lt.css(r, "marginTop", !0), left: t.left - n.left - lt.css(r, "marginLeft", !0)}
                }
            }, offsetParent: function () {
                return this.map(function () {
                    for (var e = this.offsetParent || Y; e && !lt.nodeName(e, "html") && "static" === lt.css(e, "position");)e = e.offsetParent;
                    return e || Y
                })
            }}), lt.each({scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function (e, n) {
                var r = /Y/.test(n);
                lt.fn[e] = function (o) {
                    return lt.access(this, function (e, o, i) {
                        var a = W(e);
                        return i === t ? a ? n in a ? a[n] : a.document.documentElement[o] : e[o] : (a ? a.scrollTo(r ? lt(a).scrollLeft() : i, r ? i : lt(a).scrollTop()) : e[o] = i, void 0)
                    }, e, o, arguments.length, null)
                }
            }), lt.each({Height: "height", Width: "width"}, function (e, n) {
                lt.each({padding: "inner" + e, content: n, "": "outer" + e}, function (r, o) {
                    lt.fn[o] = function (o, i) {
                        var a = arguments.length && (r || "boolean" != typeof o), s = r || (o === !0 || i === !0 ? "margin" : "border");
                        return lt.access(this, function (n, r, o) {
                            var i;
                            return lt.isWindow(n) ? n.document.documentElement["client" + e] : 9 === n.nodeType ? (i = n.documentElement, Math.max(n.body["scroll" + e], i["scroll" + e], n.body["offset" + e], i["offset" + e], i["client" + e])) : o === t ? lt.css(n, r, s) : lt.style(n, r, o, s)
                        }, n, a ? o : t, a, null)
                    }
                })
            }), lt.fn.size = function () {
                return this.length
            }, lt.fn.andSelf = lt.fn.addBack, "object" == typeof module && module && "object" == typeof module.exports ? module.exports = lt : (e.jQuery = e.$ = lt, "function" == typeof define && define.amd && define("jquery", [], function () {
                return lt
            }))
        }(window)
    }).call(this), function () {
        e = t = window.jQuery.noConflict()
    }.call(this), "undefined" == typeof Package && (Package = {}), Package.jquery = {$: e, jQuery: t}
}(), function () {
    {
        var e, t, n = (Package.meteor.Meteor, Package.deps.Deps), r = Package.minimongo.LocalCollection;
        Package.minimongo.Minimongo
    }
    (function () {
        var o;
        o = "undefined" != typeof console && console.warn ? function () {
            e._suppressWarnings ? e._suppressWarnings-- : (console.warn.apply(console, arguments), e._loggedWarnings++)
        } : function () {
        };
        var i = r._idStringify, a = r._idParse;
        e = {_suppressWarnings: 0, _loggedWarnings: 0, observe: function (e, r) {
            var a = null, c = null, l = [], f = n.autorun(function () {
                var f = e();
                n.nonreactive(function () {
                    var e;
                    if (c && (l = _.map(c._fetch(), function (e) {
                        return{_id: e._id, item: e}
                    }), c.stop(), c = null), f)if (f instanceof Array) {
                        var n = {};
                        e = _.map(f, function (e, r) {
                            if ("string" == typeof e || "number" == typeof e || "boolean" == typeof e || void 0 === e)t = e; else {
                                if ("object" != typeof e)throw new Error("unsupported type in {{#each}}: " + typeof e);
                                t = e && e._id || r
                            }
                            var a = i(t);
                            return n[a] ? (o("duplicate id " + t + " in", f), t = Random.id()) : n[a] = !0, {_id: t, item: e}
                        }), u(l, e, r)
                    } else {
                        if (!s(f))throw new Error("Not a recognized sequence type. Currently only arrays, cursors or falsey values accepted.");
                        var d = f;
                        e = [];
                        var p = !0;
                        c = d.observe({addedAt: function (t, n, o) {
                            if (p) {
                                if (null !== o)throw new Error("Expected initial data from observe in order");
                                e.push({_id: t._id, item: t})
                            } else r.addedAt(t._id, t, n, o)
                        }, changed: function (e, t) {
                            r.changed(e._id, e, t)
                        }, removed: function (e) {
                            r.removed(e._id, e)
                        }, movedTo: function (e, t, n, o) {
                            r.movedTo(e._id, e, t, n, o)
                        }}), p = !1, u(l, e, r)
                    } else e = [], u(l, e, r);
                    a = f, l = e
                })
            });
            return{stop: function () {
                f.stop(), c && c.stop()
            }}
        }, fetch: function (e) {
            if (e) {
                if (e instanceof Array)return e;
                if (s(e))return e.fetch();
                throw new Error("Not a recognized sequence type. Currently only arrays, cursors or falsey values accepted.")
            }
            return[]
        }};
        var s = function (e) {
            var t = Package.minimongo;
            return!!t && e instanceof t.LocalCollection.Cursor
        }, u = function (e, t, n) {
            var r = Package.minimongo.LocalCollection._diffQueryOrderedChanges, o = [], s = [], u = {}, c = {};
            _.each(t, function (e, t) {
                s.push(_.pick(e, "_id")), c[i(e._id)] = t
            }), _.each(e, function (e, t) {
                o.push(_.pick(e, "_id")), u[i(e._id)] = t
            }), r(o, s, {addedBefore: function (e, r, o) {
                n.addedAt(e, t[c[i(e)]].item, c[i(e)], o)
            }, movedBefore: function (e, r) {
                n.movedTo(e, t[c[i(e)]].item, u[i(e)], c[i(e)], r)
            }, removed: function (t) {
                n.removed(t, e[u[i(t)]].item)
            }}), _.each(c, function (r, o) {
                var i = a(o);
                if (_.has(u, o)) {
                    var s = t[r].item, c = e[u[o]].item;
                    ("object" == typeof s || s !== c) && n.changed(i, s, c)
                }
            })
        }
    }).call(this), "undefined" == typeof Package && (Package = {}), Package["observe-sequence"] = {ObserveSequence: e}
}(), function () {
    {
        var e;
        Package.meteor.Meteor
    }
    (function () {
        e = {}, e.isNully = function (t) {
            if (null == t)return!0;
            if (t instanceof Array) {
                for (var n = 0; n < t.length; n++)if (!e.isNully(t[n]))return!1;
                return!0
            }
            return!1
        }, e.asciiLowerCase = function (e) {
            return e.replace(/[A-Z]/g, function (e) {
                return String.fromCharCode(e.charCodeAt(0) + 32)
            })
        }, e.escapeData = function (e) {
            return e.replace(/&/g, "&amp;").replace(/</g, "&lt;")
        };
        var t = "attributeName attributeType baseFrequency baseProfile calcMode clipPathUnits contentScriptType contentStyleType diffuseConstant edgeMode externalResourcesRequired filterRes filterUnits glyphRef glyphRef gradientTransform gradientTransform gradientUnits gradientUnits kernelMatrix kernelUnitLength kernelUnitLength kernelUnitLength keyPoints keySplines keyTimes lengthAdjust limitingConeAngle markerHeight markerUnits markerWidth maskContentUnits maskUnits numOctaves pathLength patternContentUnits patternTransform patternUnits pointsAtX pointsAtY pointsAtZ preserveAlpha preserveAspectRatio primitiveUnits refX refY repeatCount repeatDur requiredExtensions requiredFeatures specularConstant specularExponent specularExponent spreadMethod spreadMethod startOffset stdDeviation stitchTiles surfaceScale surfaceScale systemLanguage tableValues targetX targetY textLength textLength viewBox viewTarget xChannelSelector yChannelSelector zoomAndPan".split(" "), n = "altGlyph altGlyphDef altGlyphItem animateColor animateMotion animateTransform clipPath feBlend feColorMatrix feComponentTransfer feComposite feConvolveMatrix feDiffuseLighting feDisplacementMap feDistantLight feFlood feFuncA feFuncB feFuncG feFuncR feGaussianBlur feImage feMerge feMergeNode feMorphology feOffset fePointLight feSpecularLighting feSpotLight feTile feTurbulence foreignObject glyphRef linearGradient radialGradient textPath vkern".split(" "), r = function (n) {
            for (var r = 0; r < t.length; r++) {
                var o = t[r];
                n[e.asciiLowerCase(o)] = o
            }
            return n
        }({}), o = function (t) {
            for (var r = 0; r < n.length; r++) {
                var o = n[r];
                t[e.asciiLowerCase(o)] = o
            }
            return t
        }({});
        e.properCaseTagName = function (t) {
            var n = e.asciiLowerCase(t);
            return o.hasOwnProperty(n) ? o[n] : n
        }, e.properCaseAttributeName = function (t) {
            var n = e.asciiLowerCase(t);
            return r.hasOwnProperty(n) ? r[n] : n
        }, e.isValidAttributeName = function (e) {
            return/^[:_A-Za-z][:_A-Za-z0-9.\-]*/.test(e)
        }, e.knownElementNames = "a abbr acronym address applet area b base basefont bdo big blockquote body br button caption center cite code col colgroup dd del dfn dir div dl dt em fieldset font form frame frameset h1 h2 h3 h4 h5 h6 head hr html i iframe img input ins isindex kbd label legend li link map menu meta noframes noscript object ol optgroup option p param pre q s samp script select small span strike strong style sub sup table tbody td textarea tfoot th thead title tr tt u ul var article aside audio bdi canvas command data datagrid datalist details embed eventsource figcaption figure footer header hgroup keygen mark meter nav output progress ruby rp rt section source summary time track video wbr".split(" "), e.voidElementNames = "area base br col command embed hr img input keygen link meta param source track wbr".split(" "), e.knownSVGElementNames = "a altGlyph altGlyphDef altGlyphItem animate animateColor animateMotion animateTransform circle clipPath color-profile cursor defs desc ellipse feBlend feColorMatrix feComponentTransfer feComposite feConvolveMatrix feDiffuseLighting feDisplacementMap feDistantLight feFlood feFuncA feFuncB feFuncG feFuncR feGaussianBlur feImage feMerge feMergeNode feMorphology feOffset fePointLight feSpecularLighting feSpotLight feTile feTurbulence filter font font-face font-face-format font-face-name font-face-src font-face-uri foreignObject g glyph glyphRef hkern image line linearGradient marker mask metadata missing-glyph path pattern polygon polyline radialGradient rect script set stop style svg switch symbol text textPath title tref tspan use view vkern".split(" ");
        var i = {yes: !0}, a = function (e) {
            for (var t = {}, n = 0; n < e.length; n++)t[e[n]] = i;
            return t
        }, s = a(e.voidElementNames), u = a(e.knownElementNames), c = a(e.knownSVGElementNames);
        e.isKnownElement = function (t) {
            return u[e.properCaseTagName(t)] === i
        }, e.isVoidElement = function (t) {
            return s[e.properCaseTagName(t)] === i
        }, e.isKnownSVGElement = function (t) {
            return c[e.properCaseTagName(t)] === i
        }
    }).call(this), function () {
        e.Tag = function (e) {
            this.tagName = e, this.attrs = null, this.children = []
        }, e.evaluate = function (t, n) {
            if (null == t)return t;
            if ("function" == typeof t)return e.evaluate(t(), n);
            if (t instanceof Array) {
                for (var r = [], o = 0; o < t.length; o++)r.push(e.evaluate(t[o], n));
                return r
            }
            if ("function" == typeof t.instantiate) {
                var i = t.instantiate(n || null), a = i.render("STATIC");
                return e.evaluate(a, i)
            }
            if (t instanceof e.Tag) {
                for (var s = [], o = 0; o < t.children.length; o++)s.push(e.evaluate(t.children[o], n));
                var u = e.getTag(t.tagName).apply(null, s);
                u.attrs = {};
                for (var c in t.attrs)u.attrs[c] = e.evaluate(t.attrs[c], n);
                return u
            }
            return t
        };
        var t = function (t, n, r) {
            for (var o in n)if ("$dynamic" !== o) {
                if (!e.isValidAttributeName(o))throw new Error("Illegal HTML attribute name: " + o);
                var i = e.evaluate(n[o], r);
                e.isNully(i) || (t[o] = i)
            }
        };
        e.evaluateAttributes = function (e, n) {
            if (!e)return e;
            var r = {};
            if (t(r, e, n), "$dynamic"in e) {
                if (!(e.$dynamic instanceof Array))throw new Error("$dynamic must be an array");
                for (var o = e.$dynamic, i = 0; i < o.length; i++) {
                    var a = o[i];
                    "function" == typeof a && (a = a()), t(r, a, n)
                }
            }
            return r
        }, e.Tag.prototype.evaluateAttributes = function (t) {
            return e.evaluateAttributes(this.attrs, t)
        };
        var n = function (t) {
            var n = String(t).replace(/^[^a-zA-Z_]|[^a-zA-Z_0-9]/g, "_") || "Tag", o = new Function("_constructTag", "var Tag; return (Tag = function " + n + "_Tag(/*arguments*/) { return _constructTag(Tag, this, arguments); });")(r);
            return o.prototype = new e.Tag(t), o.prototype.constructor = o, o
        };
        e.getTag = function (t) {
            return t = t.toUpperCase(), e[t] || (e[t] = n(t)), e[t]
        }, e.ensureTag = function (t) {
            e.getTag(t)
        };
        var r = function (t, n, r) {
            n instanceof e.Tag || (n = new t);
            var o = 0, i = r.length && r[0];
            return i && "object" == typeof i && i.constructor === Object && (n.attrs = i, o++), n.children = Array.prototype.slice.call(r, o), n
        };
        e.CharRef = function (t) {
            if (!(this instanceof e.CharRef))return new e.CharRef(t);
            if (!(t && t.html && t.str))throw new Error("HTML.CharRef must be constructed with ({html:..., str:...})");
            this.html = t.html, this.str = t.str
        }, e.Comment = function (t) {
            if (!(this instanceof e.Comment))return new e.Comment(t);
            if ("string" != typeof t)throw new Error("HTML.Comment must be constructed with a string");
            this.value = t, this.sanitizedValue = t.replace(/^-|--+|-$/g, "")
        }, e.Raw = function (t) {
            if (!(this instanceof e.Raw))return new e.Raw(t);
            if ("string" != typeof t)throw new Error("HTML.Raw must be constructed with a string");
            this.value = t
        }, e.EmitCode = function (t) {
            if (!(this instanceof e.EmitCode))return new e.EmitCode(t);
            if ("string" != typeof t)throw new Error("HTML.EmitCode must be constructed with a string");
            this.value = t
        }, e.isTagEnsured = function (t) {
            return e.isKnownElement(t) || e.isKnownSVGElement(t)
        }, function () {
            for (var t = 0; t < e.knownElementNames.length; t++)e.ensureTag(e.knownElementNames[t]);
            for (var t = 0; t < e.knownSVGElementNames.length; t++)e.ensureTag(e.knownSVGElementNames[t])
        }()
    }.call(this), function () {
        e.toHTML = function (t, n) {
            if (null == t)return"";
            if ("string" == typeof t || "boolean" == typeof t || "number" == typeof t)return e.escapeData(String(t));
            if (t instanceof Array) {
                for (var r = [], o = 0; o < t.length; o++)r.push(e.toHTML(t[o], n));
                return r.join("")
            }
            if ("function" == typeof t.instantiate) {
                var i = t.instantiate(n || null), a = i.render("STATIC");
                return e.toHTML(a, i)
            }
            if ("function" == typeof t)return e.toHTML(t(), n);
            if (t.toHTML)return t.toHTML(n);
            throw new Error("Expected tag, string, array, component, null, undefined, or object with a toHTML method; found: " + t)
        }, e.Comment.prototype.toHTML = function () {
            return"<!--" + this.sanitizedValue + "-->"
        }, e.CharRef.prototype.toHTML = function () {
            return this.html
        }, e.Raw.prototype.toHTML = function () {
            return this.value
        }, e.Tag.prototype.toHTML = function (t) {
            var n = [], r = this.evaluateAttributes(t);
            if (r)for (var o in r) {
                o = e.properCaseAttributeName(o);
                var i = e.toText(r[o], e.TEXTMODE.ATTRIBUTE, t);
                n.push(" " + o + '="' + i + '"')
            }
            var a, s = this.tagName, u = "<" + e.properCaseTagName(s) + n.join("") + ">", c = [];
            if ("TEXTAREA" === s) {
                for (var l = 0; l < this.children.length; l++)c.push(e.toText(this.children[l], e.TEXTMODE.RCDATA, t));
                a = c.join(""), "\n" === a.slice(0, 1) && (a = "\n" + a)
            } else {
                for (var l = 0; l < this.children.length; l++)c.push(e.toHTML(this.children[l], t));
                a = c.join("")
            }
            var f = u + a;
            return(this.children.length || !e.isVoidElement(s)) && (f += "</" + e.properCaseTagName(s) + ">"), f
        }, e.TEXTMODE = {ATTRIBUTE: 1, RCDATA: 2, STRING: 3}, e.toText = function (t, n, r) {
            if (null == t)return"";
            if ("string" == typeof t || "boolean" == typeof t || "number" == typeof t) {
                if (t = String(t), n === e.TEXTMODE.STRING)return t;
                if (n === e.TEXTMODE.RCDATA)return e.escapeData(t);
                if (n === e.TEXTMODE.ATTRIBUTE)return t.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
                throw new Error("Unknown TEXTMODE: " + n)
            }
            if (t instanceof Array) {
                for (var o = [], i = 0; i < t.length; i++)o.push(e.toText(t[i], n, r));
                return o.join("")
            }
            if ("function" == typeof t)return e.toText(t(), n, r);
            if ("function" == typeof t.instantiate) {
                var a = t.instantiate(r || null), s = a.render("STATIC");
                return e.toText(s, n, a)
            }
            if (t.toText)return t.toText(n, r);
            throw new Error("Expected tag, string, array, component, null, undefined, or object with a toText method; found: " + t)
        }, e.Raw.prototype.toText = function () {
            return this.value
        }, e.Tag.prototype.toText = function (t, n) {
            if (t === e.TEXTMODE.STRING)return e.toText(this.toHTML(n), t);
            throw new Error("Can't insert tags in attributes or TEXTAREA elements")
        }, e.CharRef.prototype.toText = function (t) {
            if (t === e.TEXTMODE.STRING)return this.str;
            if (t === e.TEXTMODE.RCDATA)return this.html;
            if (t === e.TEXTMODE.ATTRIBUTE)return this.html;
            throw new Error("Unknown TEXTMODE: " + t)
        }
    }.call(this), "undefined" == typeof Package && (Package = {}), Package.htmljs = {HTML: e}
}(), function () {
    var e, t, n, r, o, i, a, s, u, c, l = Package.meteor.Meteor, f = (Package.jquery.$, Package.jquery.jQuery, Package.deps.Deps), d = (Package.random.Random, Package.ejson.EJSON, Package.underscore._), p = (Package["ordered-dict"].OrderedDict, Package.minimongo.LocalCollection), h = (Package.minimongo.Minimongo, Package["observe-sequence"].ObserveSequence), g = Package.htmljs.HTML;
    (function () {
        var e;
        n = function (t, n) {
            e || (e = function () {
                return"undefined" != typeof l ? l._debug : "undefined" != typeof console && console.log ? console.log : function () {
                }
            }), e()(n || "Exception in Meteor UI:", t.stack || t.message)
        }
    }).call(this), function () {
        e = {}, r = function (e, t) {
            for (var n in t)t.hasOwnProperty(n) && (e[n] = t[n]);
            return e
        };
        var t = function (e, t, n) {
            try {
                Object.defineProperty(e, t, {value: n})
            } catch (r) {
                e[t] = n
            }
            return e
        }, n = function (e) {
            return String(e).replace(/^[^a-zA-Z_]|[^a-zA-Z_0-9]+/g, "") || "Component"
        };
        !function () {
            e.Component = function (e) {
                var n = new e;
                return t(n, "_constr", e), t(n, "_super", null), n
            }(function () {
            })
        }(), r(e, {nextGuid: 2, isComponent: function (t) {
            return t && e.isKindOf(t, e.Component)
        }, isKindOf: function (e, t) {
            for (; e;) {
                if (e === t)return!0;
                e = e._super
            }
            return!1
        }, _requireNotDestroyed: function (e) {
            if (e.isDestroyed)throw new Error("Component has been destroyed; can't perform this operation")
        }, _requireInited: function (e) {
            if (!e.isInited)throw new Error("Component must be inited to perform this operation")
        }, _requireDom: function (e) {
            if (!e.dom)throw new Error("Component must be built into DOM to perform this operation")
        }}), o = e.Component, r(e.Component, {kind: "Component", guid: "1", dom: null, isInited: !1, isDestroyed: !1, parent: null, extend: function (o) {
            if (this.isInited)throw new Error("Can't extend an inited Component");
            var i, a = !1;
            o && o.kind ? (i = Function("return function " + n(o.kind) + "() {};")(), a = !0) : i = this._constr, i.prototype = this;
            var s = new i;
            return a && (s._constr = i), o && r(s, o), t(s, "_super", this), s.guid = String(e.nextGuid++), s
        }});
        i = function (e, t) {
            for (; t;) {
                if ("undefined" != typeof t[e])return t;
                t = t.parent
            }
            return null
        }, a = function (e) {
            return e = i("data", e), e ? "function" == typeof e.data ? e.data() : e.data : null
        }, s = function (e) {
            var t = e.templateInstance;
            t.data = a(e), e.dom && !e.isDestroyed ? (t.firstNode = e.dom.startNode().nextSibling, t.lastNode = e.dom.endNode().previousSibling, t.lastNode && t.lastNode.nextSibling === t.firstNode && (t.lastNode = t.firstNode)) : (t.firstNode = null, t.lastNode = null)
        }, r(e.Component, {helpers: function (e) {
            r(this, e)
        }, events: function (e) {
            var t;
            t = this.hasOwnProperty("_events") ? this._events : this._events = [], d.each(e, function (e, n) {
                var r = n.split(/,\s+/);
                d.each(r, function (n) {
                    var r = n.split(/\s+/);
                    if (0 !== r.length) {
                        var o = r.shift(), i = r.join(" ");
                        t.push({events: o, selector: i, handler: e})
                    }
                })
            })
        }}), e.Component.notifyParented = function () {
            for (var t = this, n = t; n; n = n._super) {
                var r = n.hasOwnProperty("_events") && n._events || null;
                !r && n.hasOwnProperty("events") && "object" == typeof n.events && (e.Component.events.call(n, n.events), r = n._events), d.each(r, function (n) {
                    var r = function (r) {
                        var o = e.DomRange.getContainingComponent(r.currentTarget), i = o && a(o);
                        s(t), f.nonreactive(function () {
                            n.handler.call(i, r, t.templateInstance)
                        })
                    };
                    t.dom.on(n.events, n.selector, r)
                })
            }
            t.parented && f.nonreactive(function () {
                s(t), t.parented.call(t.templateInstance)
            }), t.rendered && f.afterFlush(function () {
                t.isDestroyed || (s(t), t.rendered.call(t.templateInstance))
            })
        }, e.Component.preserve = function () {
        }
    }.call(this), function () {
        if (l.isClient) {
            if (!Package.jquery)throw new Error("Meteor UI jQuery adapter: jQuery not found.");
            var t = Package.jquery.jQuery, n = {};
            e.DomBackend = n;
            var r = "meteor_ui_removal_watcher", o = "$meteor_ui_removal_callbacks", i = function () {
            };
            n.removeElement = function (e) {
                t(e).remove()
            }, n.onRemoveElement = function (e, n) {
                e[o] || (e[o] = [], t(e).on(r, i)), e[o].push(n)
            }, t.event.special[r] = {teardown: function () {
                var e = this, t = e[o];
                if (t) {
                    for (var n = 0; n < t.length; n++)t[n](e);
                    e[o] = null
                }
            }}, n.parseHTML = function (e) {
                return t.parseHTML(e) || []
            }, n.findBySelector = function (e, n) {
                return t.find(e, n)
            }, n.newFragment = function (e) {
                return t.buildFragment(e, document)
            }, n.delegateEvents = function (e, n, r, o) {
                t(e).on(n, r, o)
            }, n.undelegateEvents = function (e, n, r) {
                t(e).off(n, r)
            }, n.bindEventCapturer = function (e, n, r, o) {
                var i = t(e), a = function (n) {
                    n = t.event.fix(n), n.currentTarget = n.target;
                    var a = t(n.currentTarget);
                    a.is(i.find(r)) && o.call(e, n)
                };
                o._meteorui_wrapper = a, n = this.parseEventType(n), e.addEventListener(n, a, !0)
            }, n.unbindEventCapturer = function (e, t, n) {
                t = this.parseEventType(t), e.removeEventListener(t, n._meteorui_wrapper, !0)
            }, n.parseEventType = function (e) {
                var t = e.indexOf(".");
                return t >= 0 ? e.slice(0, t) : e
            }
        }
    }.call(this), function () {
        var t = e.DomBackend, n = function (e) {
            e.parentNode.removeChild(e)
        }, r = function (e, t, n) {
            t.insertBefore(e, n || null)
        }, o = function (e, t, n) {
            t.insertBefore(e, n || null)
        }, i = function (e, t) {
            for (var n in t)t.hasOwnProperty(n) && (e[n] = t[n]);
            return e
        }, a = function (e, t) {
            if (!e)return!1;
            for (var n = 0, r = e.length; r > n; n++)if (e[n] === t)return!0;
            return!1
        }, s = function (e) {
            return!("number" != typeof e.length || !e.sort && !e.splice)
        }, u = function (e) {
            return!(3 === e.nodeType && (!e.nodeValue || /^\s+$/.test(e.nodeValue)))
        }, c = function (e) {
            if ("string" != typeof e)throw new Error("id must be a string");
            if (!e)throw new Error("id may not be empty")
        }, l = function () {
            var e = document.createTextNode("");
            try {
                return e.blahblah = !0, !0
            } catch (t) {
                return!1
            }
        }(), f = l ? function () {
            return document.createTextNode("")
        } : function () {
            return document.createComment("IE")
        }, d = function (e) {
            if (!e.isParented) {
                if (e.isParented = !0, !e.owner) {
                    var n = e.parentNode(), r = n.$_uiranges || (n.$_uiranges = {});
                    r[e._rangeId] = e, e._rangeDict = r, t.onRemoveElement(n, function () {
                        p(e)
                    })
                }
                e.component && e.component.notifyParented && e.component.notifyParented();
                var o = e.members;
                for (var i in o) {
                    var a = o[i];
                    a instanceof v && d(a)
                }
            }
        }, p = function (e) {
            e.isRemoved || (e.isRemoved = !0, e._rangeDict && delete e._rangeDict[e._rangeId], e.removed && e.removed(), g(e))
        }, h = function (e, n) {
            if (1 === e.nodeType) {
                for (var r = v.getComponents(e), o = 0, i = r.length; i > o; o++)p(r[o]);
                n || t.removeElement(e)
            }
        }, g = function (e) {
            var t = e.members;
            for (var n in t) {
                var r = t[n];
                r instanceof v ? p(r) : h(r)
            }
        }, m = 1, v = function () {
            var e = f(), n = f(), r = t.newFragment([e, n]);
            r.$_uiIsOffscreen = !0, this.start = e, this.end = n, e.$ui = this, n.$ui = this, this.members = {}, this.nextMemberId = 1, this.owner = null, this._rangeId = m++, this._rangeDict = null, this.isParented = !1, this.isRemoved = !1
        };
        i(v.prototype, {getNodes: function () {
            if (!this.parentNode())return[];
            this.refresh();
            for (var e = this.end.nextSibling, t = [], n = this.start; n && n !== e; n = n.nextSibling)t.push(n);
            return t
        }, removeAll: function () {
            if (this.parentNode()) {
                this.refresh();
                for (var e = this.end, t = [], r = this.start.nextSibling; r && r !== e; r = r.nextSibling)t.push(r);
                for (var o = 0, i = t.length; i > o; o++)n(t[o]);
                g(this), this.members = {}
            }
        }, add: function (e, t, n, o) {
            if (null != e && "string" != typeof e) {
                if ("object" != typeof e)throw new Error("id must be a string");
                n = t, t = e, e = null
            }
            if (!t || "object" != typeof t)throw new Error("Expected component, node, or array");
            if (s(t)) {
                if (1 !== t.length) {
                    if (null != e)throw new Error("Can only add one node or one component if id is given");
                    var i = t;
                    o = this.getInsertionPoint(n);
                    for (var a = 0; a < i.length; a++)this.add(null, i[a], n, o);
                    return
                }
                t = t[0]
            }
            var u = this.parentNode();
            if (u) {
                var l = o || this.getInsertionPoint(n), f = t;
                null == e ? e = this.nextMemberId++ : (c(e), e = " " + e);
                var g = this.members;
                if (g.hasOwnProperty(e)) {
                    var m = g[e];
                    if (m instanceof v) {
                        var _ = m;
                        if (_.start.parentNode === u)throw new Error("Member already exists: " + e.slice(1));
                        delete g[e], _.owner = null, p(_)
                    } else {
                        var w = m;
                        if (w.parentNode === u)throw new Error("Member already exists: " + e.slice(1));
                        h(w), delete g[e]
                    }
                }
                if (f instanceof v) {
                    var x = f;
                    x.owner = this;
                    var k = x.getNodes();
                    y(k, u) && (u = b(this)), g[e] = f;
                    for (var a = 0; a < k.length; a++)r(k[a], u, l);
                    this.isParented && d(x)
                } else {
                    if ("number" != typeof f.nodeType)throw new Error("Expected Component or Node");
                    var E = f;
                    3 !== E.nodeType && (E.$ui = this), y(E, u) && (u = b(this)), g[e] = f, r(E, u, l)
                }
            }
        }, remove: function (e) {
            if (null == e)return this.removeAll(), n(this.start), n(this.end), this.owner = null, p(this), void 0;
            c(e), e = " " + e;
            var t = this.members, r = t.hasOwnProperty(e) && t[e];
            if (delete t[e], r) {
                var o = this.parentNode();
                if (o)if (r instanceof v) {
                    var i = r;
                    i.owner = null, i.start.parentNode === o && r.remove()
                } else {
                    var a = r;
                    a.parentNode === o && n(a)
                }
            }
        }, moveBefore: function (e, t) {
            var n = this.getInsertionPoint(t);
            c(e), e = " " + e;
            var r = this.members, i = r.hasOwnProperty(e) && r[e];
            if (i) {
                var a = this.parentNode();
                if (a)if (i instanceof v) {
                    var s = i;
                    if (s.start.parentNode === a) {
                        s.refresh();
                        for (var u = s.getNodes(), l = 0; l < u.length; l++)o(u[l], a, n)
                    }
                } else {
                    var f = i;
                    o(f, a, n)
                }
            }
        }, get: function (e) {
            c(e), e = " " + e;
            var t = this.members;
            return t.hasOwnProperty(e) ? t[e] : null
        }, parentNode: function () {
            return this.start.parentNode
        }, startNode: function () {
            return this.start
        }, endNode: function () {
            return this.end
        }, eachMember: function (e, t) {
            var n = this.members, r = this.parentNode();
            for (var o in n) {
                var i = n[o];
                if (i instanceof v) {
                    var a = i;
                    a.start.parentNode === r ? t && t(a) : (a.owner = null, delete n[o], p(a))
                } else {
                    var s = i;
                    s.parentNode === r ? e && e(s) : (delete n[o], h(s))
                }
            }
        }, refresh: function () {
            var e = this.parentNode();
            if (e) {
                var t = null, n = null, o = 0, i = null;
                this.eachMember(function (e) {
                    t = e, o++, 3 === e.nodeType && (i = i || [], i.push(e))
                }, function (e) {
                    e.refresh(), n = e, o++
                });
                var s = null, c = null;
                if (0 === o); else if (1 === o)t ? (s = t, c = t) : n && (s = n.start, c = n.end); else for (var l = e.firstChild; l; l = l.nextSibling) {
                    var f;
                    if (l.$ui && (f = l.$ui) && (f === this && l !== this.start && l !== this.end && u(l) || f !== this && f.owner === this && f.start === l)) {
                        if (s)for (var d = s.previousSibling; d && !d.$ui; d = d.previousSibling)this.members[this.nextMemberId++] = d, 3 !== d.nodeType && (d.$ui = this);
                        l.$ui === this ? (s = s || l, c = l) : (s = s || l, l = l.$ui.end, c = l)
                    }
                }
                if (s) {
                    for (var d; (d = s.previousSibling) && (d.$ui && d.$ui === this || a(i, d));)s = d;
                    for (var d; (d = c.nextSibling) && (d.$ui && d.$ui === this || a(i, d));)c = d;
                    s !== this.start && r(this.start, e, s), c !== this.end && r(this.end, e, c.nextSibling)
                }
            }
        }, getInsertionPoint: function (e) {
            var t = this.members, n = this.parentNode();
            if (!e)return this.end;
            c(e), e = " " + e;
            var r = t[e];
            if (r instanceof v) {
                var o = r;
                if (o.start.parentNode === n)return o.refresh(), o.start;
                o.owner = null, p(o)
            } else {
                var i = r;
                if (i.parentNode === n)return i;
                h(i)
            }
            return delete t[e], this.end
        }}), v.prototype.elements = function (e) {
            return e = e || [], this.eachMember(function (t) {
                1 === t.nodeType && e.push(t)
            }, function (t) {
                t.elements(e)
            }), e
        }, v.refresh = function (e) {
            for (var t = v.getComponents(e), n = 0, r = t.length; r > n; n++)t[n].refresh()
        }, v.getComponents = function (e) {
            for (var t = [], n = e.firstChild; n; n = n.nextSibling)n.$ui && n === n.$ui.start && !n.$ui.owner && t.push(n.$ui);
            return t
        }, v.insert = function (e, t, n) {
            var o = e.getNodes();
            y(o, t) && (t = _(t, n));
            for (var i = 0; i < o.length; i++)r(o[i], t, n);
            d(e)
        }, v.getContainingComponent = function (e) {
            for (; e && !e.$ui;)e = e.parentNode;
            for (var t = e && e.$ui; t;) {
                if (t.component)return t.component;
                t = t.owner
            }
            return null
        };
        var y = function (e, t) {
            if ("TABLE" !== t.nodeName)return!1;
            if (s(e)) {
                for (var n = !1, r = 0, o = e.length; o > r; r++) {
                    var i = e[r];
                    if (1 === i.nodeType && "TR" === i.nodeName) {
                        n = !0;
                        break
                    }
                }
                if (!n)return!1
            } else {
                var i = e;
                if (1 !== i.nodeType || "TR" !== i.nodeName)return!1
            }
            return!0
        }, _ = function (e, t) {
            var n = e.getElementsByTagName("tbody")[0];
            return n || (n = e.ownerDocument.createElement("tbody"), e.insertBefore(n, t || null)), n
        }, b = function (e) {
            for (; e.owner;)e = e.owner;
            for (var t = e.getNodes(), n = _(e.parentNode(), e.end.nextSibling), r = 0; r < t.length; r++)n.appendChild(t[r]);
            return n
        };
        v.prototype.contains = function (e) {
            if (!e)throw new Error("Expected Component or Node");
            var t = this.parentNode();
            if (!t)return!1;
            var n;
            if (e instanceof v) {
                n = e;
                var r = n.parentNode();
                if (!r)return!1;
                if (r !== t)return this.contains(r);
                if (n === this)return!1
            } else {
                var o = e;
                if (!C(t, o))return!1;
                for (; o.parentNode !== t;)o = o.parentNode;
                n = o.$ui
            }
            for (; n && n !== this;)n = n.owner;
            return n === this
        }, v.prototype.$ = function (e) {
            var n = this, r = this.parentNode();
            if (!r)throw new Error("Can't select in removed DomRange");
            if (11 === r.nodeType || r.$_uiIsOffscreen)throw new Error("Can't use $ on an offscreen component");
            var o = t.findBySelector(e, r), i = function (e) {
                return"number" == typeof e && (e = this), n.contains(e)
            };
            if (o.filter)o = o.filter(i); else {
                for (var a = [], s = 0; s < o.length; s++) {
                    var u = o[s];
                    i(u) && a.push(u)
                }
                o = a
            }
            return o
        };
        var w = {blur: 1, change: 1, click: 1, focus: 1, focusin: 1, focusout: 1, reset: 1, submit: 1}, x = 0, k = 1, E = 2, T = function (e, n, r, o, i) {
            this.elem = e, this.type = n, this.selector = r, this.handler = o, this.$ui = i, this.mode = x, this.delegatedHandler = function (e) {
                return function (t) {
                    return(e.selector || t.currentTarget === t.target) && e.$ui.contains(t.currentTarget) ? e.handler.call(e.$ui, t) : void 0
                }
            }(this);
            var a = e.addEventListener && !w.hasOwnProperty(t.parseEventType(n));
            a ? this.capturingHandler = function (e) {
                return function (n) {
                    if (e.mode === x) {
                        if (n.bubbles)return e.mode = k, t.unbindEventCapturer(e.elem, e.type, e.capturingHandler), void 0;
                        e.mode = E, t.undelegateEvents(e.elem, e.type, e.delegatedHandler)
                    }
                    e.delegatedHandler(n)
                }
            }(this) : this.mode = k
        };
        T.prototype.bind = function () {
            this.mode !== k && t.bindEventCapturer(this.elem, this.type, this.selector || "*", this.capturingHandler), this.mode !== E && t.delegateEvents(this.elem, this.type, this.selector || "*", this.delegatedHandler)
        }, T.prototype.unbind = function () {
            this.mode !== k && t.unbindEventCapturer(this.elem, this.type, this.capturingHandler), this.mode !== E && t.undelegateEvents(this.elem, this.type, this.delegatedHandler)
        }, v.prototype.on = function (e, t, n) {
            var r = this.parentNode();
            if (r) {
                if (r.$_uiIsOffscreen)throw new Error("Can't bind events before DomRange is inserted");
                var o = [];
                e.replace(/[^ /]+/g, function (e) {
                    o.push(e)
                }), n || "function" != typeof t ? t || (t = null) : (n = t, t = null);
                for (var i = 0, a = o.length; a > i; i++) {
                    var s = o[i], u = r.$_uievents;
                    u || (u = r.$_uievents = {});
                    var c = u[s];
                    c || (c = u[s] = {}, c.handlers = []);
                    var l = c.handlers, f = new T(r, s, t, n, this);
                    f.bind(), l.push(f);
                    for (var d = this.owner; d; d = d.owner)for (var p = 0, h = l.length; h > p; p++) {
                        var g = l[p];
                        g.$ui === d && (g.unbind(), g.bind(), l.splice(p, 1), l.push(g), p--, h--)
                    }
                }
            }
        };
        var C = function (e, t) {
            return 1 !== e.nodeType ? !1 : e === t ? !1 : e.compareDocumentPosition ? 16 & e.compareDocumentPosition(t) : (t = t.parentNode, t && 1 === t.nodeType ? e === t ? !0 : e.contains(t) : !1)
        };
        e.DomRange = v
    }.call(this), function () {
        u = function (e, t) {
            this.name = e, this.value = t
        }, d.extend(u.prototype, {update: function (e, t, n) {
            null === n ? null !== t && e.removeAttribute(this.name) : e.setAttribute(this.name, this.value)
        }}), u.extend = function (e) {
            var t = this, n = function () {
                u.apply(this, arguments)
            };
            return n.prototype = new t, n.extend = t.extend, e && d.extend(n.prototype, e), n
        };
        var e = u.extend({update: function (e, t, n) {
            if (!this.getCurrentValue || !this.setValue)throw new Error("Missing methods in subclass of 'BaseClassHandler'");
            var r = t ? d.compact(t.split(" ")) : [], o = n ? d.compact(n.split(" ")) : [], i = d.compact(this.getCurrentValue(e).split(" "));
            d.each(r, function (e) {
                d.indexOf(o, e) < 0 && (i = d.without(i, e))
            }), d.each(o, function (e) {
                d.indexOf(r, e) < 0 && d.indexOf(i, e) < 0 && i.push(e)
            }), this.setValue(e, i.join(" "))
        }}), t = e.extend({getCurrentValue: function (e) {
            return e.className
        }, setValue: function (e, t) {
            e.className = t
        }}), n = e.extend({getCurrentValue: function (e) {
            return e.className.baseVal
        }, setValue: function (e, t) {
            e.setAttribute("class", t)
        }}), r = u.extend({update: function (e, t, n) {
            var r = this.name;
            null == n ? null != t && (e[r] = !1) : e[r] = !0
        }}), o = u.extend({update: function (e, t, n) {
            var r = e === document.activeElement;
            r || (e.value = n)
        }}), i = function (e) {
            return"ownerSVGElement"in e
        };
        c = function (e, a, s) {
            return"class" === a ? i(e) ? new n(a, s) : new t(a, s) : "selected" === a || "checked" === a ? new r(a, s) : "TEXTAREA" !== e.tagName && "INPUT" !== e.tagName || "value" !== a ? new u(a, s) : new o(a, s)
        }
    }.call(this), function () {
        e.Component.instantiate = function (t) {
            var n = this;
            if (!e.isComponent(n))throw new Error("Expected Component kind");
            if (n.isInited)throw new Error("A component kind is required, not an instance");
            var r = n.extend();
            return r.isInited = !0, r.templateInstance = {findAll: function (e) {
                return r.dom.$(e)
            }, find: function (e) {
                var t = this.findAll(e);
                return t[0] || null
            }, firstNode: null, lastNode: null, data: null, __component__: r}, r.parent = t || null, r.init && r.init(), r.created && (s(r), r.created.call(r.templateInstance)), r
        }, e.Component.render = function () {
            return null
        }, e.emboxValue = function (e, t) {
            if ("function" == typeof e) {
                var n = e, r = null, o = null, i = null;
                return function () {
                    if (!i) {
                        if (!f.active)return n();
                        o = new f.Dependency, i = f.nonreactive(function () {
                            return f.autorun(function (e) {
                                var i = r;
                                r = n(), e.firstRun || (t ? t(r, i) : r === i) || o.changed()
                            })
                        })
                    }
                    if (f.active) {
                        var e = o.depend();
                        e && f.onInvalidate(function () {
                            o && !o.hasDependents() && f.afterFlush(function () {
                                f.afterFlush(function () {
                                    o && !o.hasDependents() && (i.stop(), i = null, o = null)
                                })
                            })
                        })
                    }
                    return r
                }
            }
            var a = e, s = function () {
                return a
            };
            return s._isEmboxedConstant = !0, s
        };
        var t = function (t, n, r) {
            if (!n)throw new Error("Materialization parent required");
            n instanceof e.DomRange ? n.add(t, r) : t instanceof e.DomRange ? e.DomRange.insert(t, n, r) : n.insertBefore(t, r || null)
        }, r = function (e, t, n) {
            if (n)for (var r in n)if (!t.hasOwnProperty(r)) {
                var o = n[r], i = o.value;
                o.value = null, o.update(e, i, null), delete n[r]
            }
            for (var r in t) {
                var i, o = null, a = t[r];
                n && n.hasOwnProperty(r) ? (o = n[r], i = o.value) : null !== a && (o = c(e, r, a), n && (n[r] = o), i = null), o && i !== a && (o.value = a, o.update(e, i, a), null === a && delete n[r])
            }
        };
        e.render = function (t, n) {
            if (t.isInited)throw new Error("Can't render component instance, only component kind");
            var r = t.instantiate(n), o = r.render && r.render(), a = new e.DomRange;
            return r.dom = a, a.component = r, i(o, a, null, r), a.removed = function () {
                r.isDestroyed = !0, r.destroyed && (s(r), r.destroyed.call(r.templateInstance))
            }, r
        };
        var o = function (e, t) {
            return e instanceof g.Raw ? t instanceof g.Raw && e.value === t.value : null == e ? null == t : e === t && ("number" == typeof e || "boolean" == typeof e || "string" == typeof e)
        };
        e.InTemplateScope = function (t, n) {
            if (!(this instanceof e.InTemplateScope))return new e.InTemplateScope(t, n);
            var r = t.parent;
            r.__isTemplateWith && (r = r.parent), this.parentPtr = r, this.content = n
        }, e.InTemplateScope.prototype.toHTML = function () {
            return g.toHTML(this.content, this.parentPtr)
        }, e.InTemplateScope.prototype.toText = function (e) {
            return g.toText(this.content, e, this.parentPtr)
        };
        var i = function (a, s, u, c) {
            if (null == a); else if ("string" == typeof a || "boolean" == typeof a || "number" == typeof a)a = String(a), t(document.createTextNode(a), s, u); else if (a instanceof Array)for (var l = 0; l < a.length; l++)i(a[l], s, u, c); else if ("function" == typeof a) {
                var d = new e.DomRange, p = null, h = f.autorun(function (e) {
                    var t = a();
                    g.isNully(t) ? t = null : t instanceof Array && 1 === t.length && (t = t[0]), o(t, p) || (p = t, e.firstRun || d.removeAll(), f.nonreactive(function () {
                        i(t, d, null, c)
                    }))
                });
                d.removed = function () {
                    h.stop()
                }, t(d, s, u)
            } else if (a instanceof g.Tag) {
                var m, v = g.properCaseTagName(a.tagName);
                m = g.isKnownSVGElement(v) && !g.isKnownElement(v) && document.createElementNS ? document.createElementNS("http://www.w3.org/2000/svg", v) : document.createElement(a.tagName);
                var y = a.attrs, _ = a.children;
                if ("TEXTAREA" === a.tagName && (y = y || {}, y.value = _, _ = []), y) {
                    var b = f.autorun(function (e) {
                        e.handlers || (e.handlers = {});
                        try {
                            var t = g.evaluateAttributes(y, c), o = {};
                            if (t) {
                                for (var i in t)o[i] = g.toText(t[i], g.TEXTMODE.STRING, c);
                                r(m, o, e.handlers)
                            }
                        } catch (a) {
                            n(a)
                        }
                    });
                    e.DomBackend.onRemoveElement(m, function () {
                        b.stop()
                    })
                }
                i(_, m, null, c), t(m, s, u)
            } else if ("function" == typeof a.instantiate) {
                var w = e.render(a, c);
                t(w.dom, s, u)
            } else if (a instanceof g.CharRef)t(document.createTextNode(a.str), s, u); else if (a instanceof g.Comment)t(document.createComment(a.sanitizedValue), s, u); else if (a instanceof g.Raw)for (var x = e.DomBackend.parseHTML(a.value), l = 0; l < x.length; l++)t(x[l], s, u); else {
                if (g.Special && a instanceof g.Special)throw new Error("Can't materialize Special tag, it's just an intermediate rep");
                if (!(a instanceof e.InTemplateScope))throw new Error("Unexpected node in htmljs: " + a);
                i(a.content, s, u, a.parentPtr)
            }
        };
        e.materialize = i, e.body = e.Component.extend({kind: "body", contentParts: [], render: function () {
            return this.contentParts
        }, INSTANTIATED: !1}), e.block = function (t) {
            return e.Component.extend({render: t})
        }, e.toHTML = function (e, t) {
            return g.toHTML(e, t)
        }, e.toRawText = function (e, t) {
            return g.toText(e, g.TEXTMODE.STRING, t)
        }
    }.call(this), function () {
        e.If = function (e, t, o) {
            return n("If", e, t, o), function () {
                return r(e) ? t : o || null
            }
        }, e.Unless = function (e, t, o) {
            return n("Unless", e, t, o), function () {
                return r(e) ? o || null : t
            }
        };
        var t = function (e, t) {
            return e !== t ? !1 : !e || "number" == typeof e || "boolean" == typeof e || "string" == typeof e
        };
        e.With = function (r, o) {
            n("With", r, o);
            var i = o;
            return"data"in i && (i = e.block(function () {
                return o
            })), i.data = e.emboxValue(r, t), i
        }, e.Each = function (t, r, o) {
            return n("Each", t, r, o), e.EachImpl.extend({__sequence: t, __content: r, __elseContent: o})
        };
        var n = function (t, n, r, o) {
            if ("function" != typeof n)throw new Error("First argument to " + t + " must be a function");
            if (!e.isComponent(r))throw new Error("Second argument to " + t + " must be a template or UI.block");
            if (o && !e.isComponent(o))throw new Error("Third argument to " + t + " must be a template or UI.block if present")
        }, r = function (e) {
            return f.isolateValue(function () {
                var t = e();
                return t instanceof Array && 0 === t.length ? !1 : !!t
            })
        }
    }.call(this), function () {
        e.EachImpl = o.extend({typeName: "Each", render: function (e) {
            var t = this, n = t.__content, r = t.__elseContent;
            if ("STATIC" === e) {
                var o = d.map(h.fetch(t.__sequence()), function (e) {
                    return n.extend({data: function () {
                        return e
                    }})
                });
                return o.length ? o : r
            }
            return null
        }, parented: function () {
            var t = this.__component__, n = t.dom, r = t.__content, o = t.__elseContent, i = 0, a = function (r) {
                if (o) {
                    if (0 > i + r)throw new Error("count should never become negative");
                    0 === i && n.removeAll(), i += r, 0 === i && e.materialize(o, n, null, t)
                }
            };
            this.observeHandle = h.observe(function () {
                return t.__sequence()
            }, {addedAt: function (o, i, s, u) {
                a(1), o = p._idStringify(o);
                var c = i, l = new f.Dependency, d = function () {
                    return l.depend(), c
                };
                d.$set = function (e) {
                    c = e, l.changed()
                }, u && (u = p._idStringify(u));
                var h = e.render(r.extend({data: d}), t);
                n.add(o, h.dom, u)
            }, removed: function (e) {
                a(-1), n.remove(p._idStringify(e))
            }, movedTo: function (e, t, r, o, i) {
                n.moveBefore(p._idStringify(e), i && p._idStringify(i))
            }, changed: function (e, t) {
                n.get(p._idStringify(e)).component.data.$set(t)
            }}), a(0)
        }, destroyed: function () {
            this.observeHandle && this.observeHandle.stop()
        }})
    }.call(this), function () {
        var n = (function () {
            return this
        }(), o.extend({kind: "NoOp", render: function () {
            return this.__content
        }})), s = {constant: n, isolate: n};
        r(e.Component, {lookup: function (e, n) {
            var r, o, u = this, c = n && n.template;
            if (!e)throw new Error("must pass id to lookup");
            if (/^\./.test(e)) {
                if (!/^(\.)+$/.test(e))throw new Error("id starting with dot must be a series of dots");
                for (var l = i("data", u), f = 1; f < e.length; f++)l = l ? i("data", l.parent) : null;
                return l ? l.data : null
            }
            if (o = i(e, u))var r = o[e]; else {
                if (d.has(s, e))return s[e];
                if (c && d.has(Template, e))return Template[e];
                if (!t._globalHelpers[e])return function () {
                    var t = a(u);
                    if (!t)return t;
                    var n = t[e];
                    return"function" == typeof n ? n.apply(t, arguments) : n
                };
                r = t._globalHelpers[e]
            }
            return"function" != typeof r || r._isEmboxedConstant ? r : function () {
                var e = a(u);
                return r.apply(e, arguments)
            }
        }, lookupTemplate: function (e) {
            return this.lookup(e, {template: !0})
        }, get: function (e) {
            void 0 === e && (e = ".");
            var t = this.lookup(e);
            return"function" == typeof t ? t() : t
        }, set: function (e, t) {
            var n = i(e, this);
            if (!n || !n[e])throw new Error("Can't find field: " + e);
            if ("function" != typeof n[e])throw new Error("Not a settable field: " + e);
            n[e](t)
        }})
    }.call(this), function () {
        t = {_globalHelpers: {}, registerHelper: function (e, t) {
            this._globalHelpers[e] = t
        }}, t._escape = function () {
            var e = {"<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#x27;", "`": "&#x60;", "&": "&amp;"}, t = function (t) {
                return e[t]
            };
            return function (e) {
                return e.replace(/[&<>"'`]/g, t)
            }
        }(), t.SafeString = function (e) {
            this.string = e
        }, t.SafeString.prototype.toString = function () {
            return this.string.toString()
        }
    }.call(this), "undefined" == typeof Package && (Package = {}), Package.ui = {UI: e, Handlebars: t}
}(), function () {
    var e, t = (Package.meteor.Meteor, Package.htmljs.HTML), n = Package.ui.UI, r = Package.ui.Handlebars;
    (function () {
        e = {}, e.include = function (e, t, r) {
            if (t && !n.isComponent(t))throw new Error("Second argument to Spacebars.include must be a template or UI.block if present");
            if (r && !n.isComponent(r))throw new Error("Third argument to Spacebars.include must be a template or UI.block if present");
            var o = null;
            if (t && (o = o || {}, o.__content = t), r && (o = o || {}, o.__elseContent = r), n.isComponent(e))return e.extend(o);
            var i = e;
            return function () {
                var e = Deps.isolateValue(i);
                if (null === e)return null;
                if (!n.isComponent(e))throw new Error("Expected null or template in return value from inclusion function, found: " + e);
                return e.extend(o)
            }
        }, e.mustacheImpl = function () {
            var t = arguments;
            if (t.length > 1) {
                var n = t[t.length - 1];
                if (n instanceof e.kw) {
                    var r = {};
                    for (var o in n.hash) {
                        var i = n.hash[o];
                        r[o] = "function" == typeof i ? i() : i
                    }
                    t[t.length - 1] = e.kw(r)
                } else n = e.kw(), t = Array.prototype.slice.call(arguments), t.push(n)
            }
            return e.call.apply(null, t)
        }, e.mustache = function () {
            var n = e.mustacheImpl.apply(null, arguments);
            return n instanceof r.SafeString ? t.Raw(n.toString()) : null == n || n === !1 ? null : String(n)
        }, e.attrMustache = function () {
            var n = e.mustacheImpl.apply(null, arguments);
            if (null == n || "" === n)return null;
            if ("object" == typeof n)return n;
            if ("string" == typeof n && t.isValidAttributeName(n)) {
                var r = {};
                return r[n] = "", r
            }
            throw new Error("Expected valid attribute name, '', null, or object")
        }, e.dataMustache = function () {
            var t = e.mustacheImpl.apply(null, arguments);
            return t
        }, e.makeRaw = function (e) {
            return null == e ? null : e instanceof t.Raw ? e : t.Raw(e)
        }, e.call = function (e) {
            if ("function" == typeof e) {
                for (var t = [], n = 1; n < arguments.length; n++) {
                    var r = arguments[n];
                    t[n - 1] = "function" == typeof r ? r() : r
                }
                return e.apply(null, t)
            }
            if (arguments.length > 1)throw new Error("Can't call non-function: " + e);
            return e
        }, e.kw = function (t) {
            return this instanceof e.kw ? (this.hash = t || {}, void 0) : new e.kw(t)
        }, e.SafeString = function (t) {
            return this instanceof e.SafeString ? new r.SafeString(t) : new e.SafeString(t)
        }, e.SafeString.prototype = r.SafeString.prototype, e.dot = function (t, n) {
            if (arguments.length > 2) {
                var r = [];
                return r.push(e.dot(t, n)), r.push.apply(r, Array.prototype.slice.call(arguments, 2)), e.dot.apply(null, r)
            }
            if ("function" == typeof t && (t = t()), !t)return t;
            var o = t[n];
            return"function" != typeof o ? o : function () {
                return o.apply(t, arguments)
            }
        }, e.With = function (e, t, r) {
            var o = n.With(e, t);
            return n.If(o.data, o, r)
        }, e.TemplateWith = function (e, t) {
            var r = n.With(e, t);
            return r.__isTemplateWith = !0, r
        }
    }).call(this), "undefined" == typeof Package && (Package = {}), Package.spacebars = {Spacebars: e}
}(), function () {
    {
        var e, t = (Package.meteor.Meteor, Package.ui.UI);
        Package.ui.Handlebars, Package.htmljs.HTML
    }
    (function () {
        e = {}, e.__define__ = function (n, r) {
            if (e.hasOwnProperty(n))throw new Error("There are multiple templates named '" + n + "'. Each template needs a unique name.");
            e[n] = t.Component.extend({kind: "Template_" + n, render: r})
        }
    }).call(this), "undefined" == typeof Package && (Package = {}), Package.templating = {Template: e}
}(), Meteor = Package.meteor.Meteor, WebApp = Package.webapp.WebApp, Log = Package.logging.Log, Deps = Package.deps.Deps, Session = Package.session.Session, DDP = Package.livedata.DDP, UI = Package.ui.UI, Handlebars = Package.ui.Handlebars, Spacebars = Package.spacebars.Spacebars, Template = Package.templating.Template, check = Package.check.check, Match = Package.check.Match, _ = Package.underscore._, $ = Package.jquery.$, jQuery = Package.jquery.jQuery, Random = Package.random.Random, EJSON = Package.ejson.EJSON, HTML = Package.htmljs.HTML, function () {
    UI.body.contentParts.push(UI.Component.extend({render: function () {
        var e = this;
        return Spacebars.include(e.lookupTemplate("hello"))
    }})), Meteor.startup(function () {
        UI.body.INSTANTIATED || (UI.body.INSTANTIATED = !0, UI.DomRange.insert(UI.render(UI.body).dom, document.body))
    }), Template.__define__("hello", function () {
        var e = this;
        return[HTML.Raw("<h1>Hello World!</h1>\n  "), function () {
            return Spacebars.mustache(e.lookup("greeting"))
        }, HTML.Raw('\n  <input type="button" value="Click">')]
    })
}(), function () {
    Meteor.isClient && (Template.hello.greeting = function () {
        return"Welcome to test."
    }, Template.hello.events({"click input": function () {
        "undefined" != typeof console && console.log("You pressed the button")
    }})), Meteor.isServer && Meteor.startup(function () {
    })
}();