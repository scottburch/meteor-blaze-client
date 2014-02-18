(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Deps = Package.deps.Deps;
var Random = Package.random.Random;
var EJSON = Package.ejson.EJSON;
var _ = Package.underscore._;
var OrderedDict = Package['ordered-dict'].OrderedDict;
var LocalCollection = Package.minimongo.LocalCollection;
var Minimongo = Package.minimongo.Minimongo;
var ObserveSequence = Package['observe-sequence'].ObserveSequence;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var UI, Handlebars, reportUIException, _extend, Component, findComponentWithProp, getComponentData, updateTemplateInstance, AttributeHandler, makeAttributeHandler;

(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/ui/exceptions.js                                                                            //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
                                                                                                        // 1
var debugFunc;                                                                                          // 2
                                                                                                        // 3
// Meteor UI calls into user code in many places, and it's nice to catch exceptions                     // 4
// propagated from user code immediately so that the whole system doesn't just                          // 5
// break.  Catching exceptions is easy; reporting them is hard.  This helper                            // 6
// reports exceptions.                                                                                  // 7
//                                                                                                      // 8
// Usage:                                                                                               // 9
//                                                                                                      // 10
// ```                                                                                                  // 11
// try {                                                                                                // 12
//   // ... someStuff ...                                                                               // 13
// } catch (e) {                                                                                        // 14
//   reportUIException(e);                                                                              // 15
// }                                                                                                    // 16
// ```                                                                                                  // 17
//                                                                                                      // 18
// An optional second argument overrides the default message.                                           // 19
                                                                                                        // 20
reportUIException = function (e, msg) {                                                                 // 21
  if (! debugFunc)                                                                                      // 22
    // adapted from Deps                                                                                // 23
    debugFunc = function () {                                                                           // 24
      return (typeof Meteor !== "undefined" ? Meteor._debug :                                           // 25
              ((typeof console !== "undefined") && console.log ? console.log :                          // 26
               function () {}));                                                                        // 27
    };                                                                                                  // 28
                                                                                                        // 29
  // In Chrome, `e.stack` is a multiline string that starts with the message                            // 30
  // and contains a stack trace.  Furthermore, `console.log` makes it clickable.                        // 31
  // `console.log` supplies the space between the two arguments.                                        // 32
  debugFunc()(msg || 'Exception in Meteor UI:', e.stack || e.message);                                  // 33
};                                                                                                      // 34
                                                                                                        // 35
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/ui/base.js                                                                                  //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
UI = {};                                                                                                // 1
                                                                                                        // 2
// A very basic operation like Underscore's `_.extend` that                                             // 3
// copies `src`'s own, enumerable properties onto `tgt` and                                             // 4
// returns `tgt`.                                                                                       // 5
_extend = function (tgt, src) {                                                                         // 6
  for (var k in src)                                                                                    // 7
    if (src.hasOwnProperty(k))                                                                          // 8
      tgt[k] = src[k];                                                                                  // 9
  return tgt;                                                                                           // 10
};                                                                                                      // 11
                                                                                                        // 12
// Defines a single non-enumerable, read-only property                                                  // 13
// on `tgt`.                                                                                            // 14
// It won't be non-enumerable in IE 8, so its                                                           // 15
// non-enumerability can't be relied on for logic                                                       // 16
// purposes, it just makes things prettier in                                                           // 17
// the dev console.                                                                                     // 18
var _defineNonEnum = function (tgt, name, value) {                                                      // 19
  try {                                                                                                 // 20
    Object.defineProperty(tgt, name, {value: value});                                                   // 21
  } catch (e) {                                                                                         // 22
    // IE < 9                                                                                           // 23
    tgt[name] = value;                                                                                  // 24
  }                                                                                                     // 25
  return tgt;                                                                                           // 26
};                                                                                                      // 27
                                                                                                        // 28
// Make `typeName` a non-empty string starting with an ASCII                                            // 29
// letter or underscore and containing only letters, underscores,                                       // 30
// and numbers.  This makes it safe to insert into evaled JS                                            // 31
// code.                                                                                                // 32
var sanitizeTypeName = function (typeName) {                                                            // 33
  return String(typeName).replace(/^[^a-zA-Z_]|[^a-zA-Z_0-9]+/g,                                        // 34
                                  '') || 'Component';                                                   // 35
};                                                                                                      // 36
                                                                                                        // 37
// Named function (like `function Component() {}` below) make                                           // 38
// inspection in debuggers more descriptive. In IE, this sets the                                       // 39
// value of the `Component` var in the function scope in which it's                                     // 40
// executed. We already have a top-level `Component` var so we create                                   // 41
// a new function scope to not write it over in IE.                                                     // 42
(function () {                                                                                          // 43
                                                                                                        // 44
  // Components and Component kinds are the same thing, just                                            // 45
  // objects; there are no constructor functions, no `new`,                                             // 46
  // and no `instanceof`.  A Component object is like a class,                                          // 47
  // until it is inited, at which point it becomes more like                                            // 48
  // an instance.                                                                                       // 49
  //                                                                                                    // 50
  // `y = x.extend({ ...new props })` creates a new Component                                           // 51
  // `y` with `x` as its prototype, plus additional properties                                          // 52
  // on `y` itself.  `extend` is used both to subclass and to                                           // 53
  // create instances (and the hope is we can gloss over the                                            // 54
  // difference in the docs).                                                                           // 55
  UI.Component = (function (constr) {                                                                   // 56
                                                                                                        // 57
    // Make sure the "class name" that Chrome infers for                                                // 58
    // UI.Component is "Component", and that                                                            // 59
    // `new UI.Component._constr` (which is what `extend`                                               // 60
    // does) also produces objects whose inferred class                                                 // 61
    // name is "Component".  Chrome's name inference rules                                              // 62
    // are a little mysterious, but a function name in                                                  // 63
    // the source code (as in `function Component() {}`)                                                // 64
    // seems to be reliable and high precedence.                                                        // 65
    var C = new constr;                                                                                 // 66
    _defineNonEnum(C, '_constr', constr);                                                               // 67
    _defineNonEnum(C, '_super', null);                                                                  // 68
    return C;                                                                                           // 69
  })(function Component() {});                                                                          // 70
})();                                                                                                   // 71
                                                                                                        // 72
_extend(UI, {                                                                                           // 73
  nextGuid: 2, // Component is 1!                                                                       // 74
                                                                                                        // 75
  isComponent: function (obj) {                                                                         // 76
    return obj && UI.isKindOf(obj, UI.Component);                                                       // 77
  },                                                                                                    // 78
  // `UI.isKindOf(a, b)` where `a` and `b` are Components                                               // 79
  // (or kinds) asks if `a` is or descends from                                                         // 80
  // (transitively extends) `b`.                                                                        // 81
  isKindOf: function (a, b) {                                                                           // 82
    while (a) {                                                                                         // 83
      if (a === b)                                                                                      // 84
        return true;                                                                                    // 85
      a = a._super;                                                                                     // 86
    }                                                                                                   // 87
    return false;                                                                                       // 88
  },                                                                                                    // 89
  // use these to produce error messages for developers                                                 // 90
  // (though throwing a more specific error message is                                                  // 91
  // even better)                                                                                       // 92
  _requireNotDestroyed: function (c) {                                                                  // 93
    if (c.isDestroyed)                                                                                  // 94
      throw new Error("Component has been destroyed; can't perform this operation");                    // 95
  },                                                                                                    // 96
  _requireInited: function (c) {                                                                        // 97
    if (! c.isInited)                                                                                   // 98
      throw new Error("Component must be inited to perform this operation");                            // 99
  },                                                                                                    // 100
  _requireDom: function (c) {                                                                           // 101
    if (! c.dom)                                                                                        // 102
      throw new Error("Component must be built into DOM to perform this operation");                    // 103
  }                                                                                                     // 104
});                                                                                                     // 105
                                                                                                        // 106
Component = UI.Component;                                                                               // 107
                                                                                                        // 108
_extend(UI.Component, {                                                                                 // 109
  // If a Component has a `kind` property set via `extend`,                                             // 110
  // we make it use that name when printed in Chrome Dev Tools.                                         // 111
  // If you then extend this Component and don't supply any                                             // 112
  // new `kind`, it should use the same value of kind (or the                                           // 113
  // most specific one in the case of an `extend` chain with                                            // 114
  // `kind` set at multiple points).                                                                    // 115
  //                                                                                                    // 116
  // To accomplish this, keeping performance in mind,                                                   // 117
  // any Component where `kind` is explicitly set                                                       // 118
  // also has a function property `_constr` whose source-code                                           // 119
  // name is `kind`.  `extend` creates this `_constr`                                                   // 120
  // function, which can then be used internally as a                                                   // 121
  // constructor to quickly create new instances that                                                   // 122
  // pretty-print correctly.                                                                            // 123
  kind: "Component",                                                                                    // 124
  guid: "1",                                                                                            // 125
  dom: null,                                                                                            // 126
  // Has this Component ever been inited?                                                               // 127
  isInited: false,                                                                                      // 128
  // Has this Component been destroyed?  Only inited Components                                         // 129
  // can be destroyed.                                                                                  // 130
  isDestroyed: false,                                                                                   // 131
  // Component that created this component (typically also                                              // 132
  // the DOM containment parent).                                                                       // 133
  // No child pointers (except in `dom`).                                                               // 134
  parent: null,                                                                                         // 135
                                                                                                        // 136
  // create a new subkind or instance whose proto pointer                                               // 137
  // points to this, with additional props set.                                                         // 138
  extend: function (props) {                                                                            // 139
    // this function should never cause `props` to be                                                   // 140
    // mutated in case people want to reuse `props` objects                                             // 141
    // in a mixin-like way.                                                                             // 142
                                                                                                        // 143
    if (this.isInited)                                                                                  // 144
      // Disallow extending inited Components so that                                                   // 145
      // inited Components don't inherit instance-specific                                              // 146
      // properties from other inited Components, just                                                  // 147
      // default values.                                                                                // 148
      throw new Error("Can't extend an inited Component");                                              // 149
                                                                                                        // 150
    var constr;                                                                                         // 151
    var constrMade = false;                                                                             // 152
    // Any Component with a kind of "Foo" (say) is given                                                // 153
    // a `._constr` of the form `function Foo() {}`.                                                    // 154
    if (props && props.kind) {                                                                          // 155
      constr = Function("return function " +                                                            // 156
                        sanitizeTypeName(props.kind) +                                                  // 157
                        "() {};")();                                                                    // 158
      constrMade = true;                                                                                // 159
    } else {                                                                                            // 160
      constr = this._constr;                                                                            // 161
    }                                                                                                   // 162
                                                                                                        // 163
    // We don't know where we're getting `constr` from --                                               // 164
    // it might be from some supertype -- just that it has                                              // 165
    // the right function name.  So set the `prototype`                                                 // 166
    // property each time we use it as a constructor.                                                   // 167
    constr.prototype = this;                                                                            // 168
                                                                                                        // 169
    var c = new constr;                                                                                 // 170
    if (constrMade)                                                                                     // 171
      c._constr = constr;                                                                               // 172
                                                                                                        // 173
    if (props)                                                                                          // 174
      _extend(c, props);                                                                                // 175
                                                                                                        // 176
    // for efficient Component instantiations, we assign                                                // 177
    // as few things as possible here.                                                                  // 178
    _defineNonEnum(c, '_super', this);                                                                  // 179
    c.guid = String(UI.nextGuid++);                                                                     // 180
                                                                                                        // 181
    return c;                                                                                           // 182
  }                                                                                                     // 183
});                                                                                                     // 184
                                                                                                        // 185
//callChainedCallback = function (comp, propName, orig) {                                               // 186
  // Call `comp.foo`, `comp._super.foo`,                                                                // 187
  // `comp._super._super.foo`, and so on, but in reverse                                                // 188
  // order, and only if `foo` is an "own property" in each                                              // 189
  // case.  Furthermore, the passed value of `this` should                                              // 190
  // remain `comp` for all calls (which is achieved by                                                  // 191
  // filling in `orig` when recursing).                                                                 // 192
//  if (comp._super)                                                                                    // 193
//    callChainedCallback(comp._super, propName, orig || comp);                                         // 194
//                                                                                                      // 195
//  if (comp.hasOwnProperty(propName))                                                                  // 196
//    comp[propName].call(orig || comp);                                                                // 197
//};                                                                                                    // 198
                                                                                                        // 199
                                                                                                        // 200
// Returns 0 if the nodes are the same or either one contains the other;                                // 201
// otherwise, -1 if a comes before b, or else 1 if b comes before a in                                  // 202
// document order.                                                                                      // 203
// Requires: `a` and `b` are element nodes in the same document tree.                                   // 204
var compareElementIndex = function (a, b) {                                                             // 205
  // See http://ejohn.org/blog/comparing-document-position/                                             // 206
  if (a === b)                                                                                          // 207
    return 0;                                                                                           // 208
  if (a.compareDocumentPosition) {                                                                      // 209
    var n = a.compareDocumentPosition(b);                                                               // 210
    return ((n & 0x18) ? 0 : ((n & 0x4) ? -1 : 1));                                                     // 211
  } else {                                                                                              // 212
    // Only old IE is known to not have compareDocumentPosition (though Safari                          // 213
    // originally lacked it).  Thankfully, IE gives us a way of comparing elements                      // 214
    // via the "sourceIndex" property.                                                                  // 215
    if (a.contains(b) || b.contains(a))                                                                 // 216
      return 0;                                                                                         // 217
    return (a.sourceIndex < b.sourceIndex ? -1 : 1);                                                    // 218
  }                                                                                                     // 219
};                                                                                                      // 220
                                                                                                        // 221
findComponentWithProp = function (id, comp) {                                                           // 222
  while (comp) {                                                                                        // 223
    if (typeof comp[id] !== 'undefined')                                                                // 224
      return comp;                                                                                      // 225
    comp = comp.parent;                                                                                 // 226
  }                                                                                                     // 227
  return null;                                                                                          // 228
};                                                                                                      // 229
                                                                                                        // 230
getComponentData = function (comp) {                                                                    // 231
  comp = findComponentWithProp('data', comp);                                                           // 232
  return (comp ?                                                                                        // 233
          (typeof comp.data === 'function' ?                                                            // 234
           comp.data() : comp.data) :                                                                   // 235
          null);                                                                                        // 236
};                                                                                                      // 237
                                                                                                        // 238
updateTemplateInstance = function (comp) {                                                              // 239
  // Populate `comp.templateInstance.{firstNode,lastNode,data}`                                         // 240
  // on demand.                                                                                         // 241
  var tmpl = comp.templateInstance;                                                                     // 242
  tmpl.data = getComponentData(comp);                                                                   // 243
                                                                                                        // 244
  if (comp.dom && !comp.isDestroyed) {                                                                  // 245
    tmpl.firstNode = comp.dom.startNode().nextSibling;                                                  // 246
    tmpl.lastNode = comp.dom.endNode().previousSibling;                                                 // 247
    // Catch the case where the DomRange is empty and we'd                                              // 248
    // otherwise pass the out-of-order nodes (end, start)                                               // 249
    // as (firstNode, lastNode).                                                                        // 250
    if (tmpl.lastNode && tmpl.lastNode.nextSibling === tmpl.firstNode)                                  // 251
      tmpl.lastNode = tmpl.firstNode;                                                                   // 252
  } else {                                                                                              // 253
    // on 'created' or 'destroyed' callbacks we don't have a DomRange                                   // 254
    tmpl.firstNode = null;                                                                              // 255
    tmpl.lastNode = null;                                                                               // 256
  }                                                                                                     // 257
};                                                                                                      // 258
                                                                                                        // 259
_extend(UI.Component, {                                                                                 // 260
  // We implement the old APIs here, including how data is passed                                       // 261
  // to helpers in `this`.                                                                              // 262
  helpers: function (dict) {                                                                            // 263
    _extend(this, dict);                                                                                // 264
  },                                                                                                    // 265
  events: function (dict) {                                                                             // 266
    var events;                                                                                         // 267
    if (this.hasOwnProperty('_events'))                                                                 // 268
      events = this._events;                                                                            // 269
    else                                                                                                // 270
      events = (this._events = []);                                                                     // 271
                                                                                                        // 272
    _.each(dict, function (handler, spec) {                                                             // 273
      var clauses = spec.split(/,\s+/);                                                                 // 274
      // iterate over clauses of spec, e.g. ['click .foo', 'click .bar']                                // 275
      _.each(clauses, function (clause) {                                                               // 276
        var parts = clause.split(/\s+/);                                                                // 277
        if (parts.length === 0)                                                                         // 278
          return;                                                                                       // 279
                                                                                                        // 280
        var newEvents = parts.shift();                                                                  // 281
        var selector = parts.join(' ');                                                                 // 282
        events.push({events: newEvents,                                                                 // 283
                     selector: selector,                                                                // 284
                     handler: handler});                                                                // 285
      });                                                                                               // 286
    });                                                                                                 // 287
  }                                                                                                     // 288
});                                                                                                     // 289
                                                                                                        // 290
// XXX we don't really want this to be a user-visible callback,                                         // 291
// it's just a particular signal we need from DomRange.                                                 // 292
UI.Component.notifyParented = function () {                                                             // 293
  var self = this;                                                                                      // 294
  for (var comp = self; comp; comp = comp._super) {                                                     // 295
    var events = (comp.hasOwnProperty('_events') && comp._events) || null;                              // 296
    if ((! events) && comp.hasOwnProperty('events') &&                                                  // 297
        typeof comp.events === 'object') {                                                              // 298
      // Provide limited back-compat support for `.events = {...}`                                      // 299
      // syntax.  Pass `comp.events` to the original `.events(...)`                                     // 300
      // function.  This code must run only once per component, in                                      // 301
      // order to not bind the handlers more than once, which is                                        // 302
      // ensured by the fact that we only do this when `comp._events`                                   // 303
      // is falsy, and we cause it to be set now.                                                       // 304
      UI.Component.events.call(comp, comp.events);                                                      // 305
      events = comp._events;                                                                            // 306
    }                                                                                                   // 307
    _.each(events, function (esh) { // {events, selector, handler}                                      // 308
      // wrap the handler here, per instance of the template that                                       // 309
      // declares the event map, so we can pass the instance to                                         // 310
      // the event handler.                                                                             // 311
      var wrappedHandler = function (event) {                                                           // 312
        var comp = UI.DomRange.getContainingComponent(event.currentTarget);                             // 313
        var data = comp && getComponentData(comp);                                                      // 314
        updateTemplateInstance(self);                                                                   // 315
        Deps.nonreactive(function () {                                                                  // 316
          // Don't want to be in a deps context, even if we were somehow                                // 317
          // triggered synchronously in an existing deps context                                        // 318
          // (the `blur` event can do this).                                                            // 319
          // XXX we should probably do what Spark did and block all                                     // 320
          // event handling during our DOM manip.  Many apps had weird                                  // 321
          // unanticipated bugs until we did that.                                                      // 322
          esh.handler.call(data, event, self.templateInstance);                                         // 323
        });                                                                                             // 324
      };                                                                                                // 325
                                                                                                        // 326
      self.dom.on(esh.events, esh.selector, wrappedHandler);                                            // 327
    });                                                                                                 // 328
  }                                                                                                     // 329
                                                                                                        // 330
  // XXX this is an undocumented callback                                                               // 331
  if (self.parented) {                                                                                  // 332
    Deps.nonreactive(function () {                                                                      // 333
      updateTemplateInstance(self);                                                                     // 334
      self.parented.call(self.templateInstance);                                                        // 335
    });                                                                                                 // 336
  }                                                                                                     // 337
                                                                                                        // 338
  if (self.rendered) {                                                                                  // 339
    // Defer rendered callback until flush time.                                                        // 340
    Deps.afterFlush(function () {                                                                       // 341
      if (! self.isDestroyed) {                                                                         // 342
        updateTemplateInstance(self);                                                                   // 343
        self.rendered.call(self.templateInstance);                                                      // 344
      }                                                                                                 // 345
    });                                                                                                 // 346
  }                                                                                                     // 347
};                                                                                                      // 348
                                                                                                        // 349
// past compat                                                                                          // 350
UI.Component.preserve = function () {};                                                                 // 351
                                                                                                        // 352
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/ui/attrs.js                                                                                 //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
                                                                                                        // 1
// An AttributeHandler object is responsible for updating a particular attribute                        // 2
// of a particular element.  AttributeHandler subclasses implement                                      // 3
// browser-specific logic for dealing with particular attributes across                                 // 4
// different browsers.                                                                                  // 5
//                                                                                                      // 6
// To define a new type of AttributeHandler, use                                                        // 7
// `var FooHandler = AttributeHandler.extend({ update: function ... })`                                 // 8
// where the `update` function takes arguments `(element, oldValue, value)`.                            // 9
// The `element` argument is always the same between calls to `update` on                               // 10
// the same instance.  `oldValue` and `value` are each either `null` or                                 // 11
// a Unicode string of the type that might be passed to the value argument                              // 12
// of `setAttribute` (i.e. not an HTML string with character references).                               // 13
// When an AttributeHandler is installed, an initial call to `update` is                                // 14
// always made with `oldValue = null`.  The `update` method can access                                  // 15
// `this.name` if the AttributeHandler class is a generic one that applies                              // 16
// to multiple attribute names.                                                                         // 17
//                                                                                                      // 18
// AttributeHandlers can store custom properties on `this`, as long as they                             // 19
// don't use the names `element`, `name`, `value`, and `oldValue`.                                      // 20
//                                                                                                      // 21
// AttributeHandlers can't influence how attributes appear in rendered HTML,                            // 22
// only how they are updated after materialization as DOM.                                              // 23
                                                                                                        // 24
AttributeHandler = function (name, value) {                                                             // 25
  this.name = name;                                                                                     // 26
  this.value = value;                                                                                   // 27
};                                                                                                      // 28
                                                                                                        // 29
_.extend(AttributeHandler.prototype, {                                                                  // 30
  update: function (element, oldValue, value) {                                                         // 31
    if (value === null) {                                                                               // 32
      if (oldValue !== null)                                                                            // 33
        element.removeAttribute(this.name);                                                             // 34
    } else {                                                                                            // 35
      element.setAttribute(this.name, this.value);                                                      // 36
    }                                                                                                   // 37
  }                                                                                                     // 38
});                                                                                                     // 39
                                                                                                        // 40
AttributeHandler.extend = function (options) {                                                          // 41
  var curType = this;                                                                                   // 42
  var subType = function AttributeHandlerSubtype(/*arguments*/) {                                       // 43
    AttributeHandler.apply(this, arguments);                                                            // 44
  };                                                                                                    // 45
  subType.prototype = new curType;                                                                      // 46
  subType.extend = curType.extend;                                                                      // 47
  if (options)                                                                                          // 48
    _.extend(subType.prototype, options);                                                               // 49
  return subType;                                                                                       // 50
};                                                                                                      // 51
                                                                                                        // 52
// Extended below to support both regular and SVG elements                                              // 53
var BaseClassHandler = AttributeHandler.extend({                                                        // 54
  update: function (element, oldValue, value) {                                                         // 55
    if (!this.getCurrentValue || !this.setValue)                                                        // 56
      throw new Error("Missing methods in subclass of 'BaseClassHandler'");                             // 57
                                                                                                        // 58
    var oldClasses = oldValue ? _.compact(oldValue.split(' ')) : [];                                    // 59
    var newClasses = value ? _.compact(value.split(' ')) : [];                                          // 60
                                                                                                        // 61
    // the current classes on the element, which we will mutate.                                        // 62
    var classes = _.compact(this.getCurrentValue(element).split(' '));                                  // 63
                                                                                                        // 64
    // optimize this later (to be asymptotically faster) if necessary                                   // 65
    _.each(oldClasses, function (c) {                                                                   // 66
      if (_.indexOf(newClasses, c) < 0)                                                                 // 67
        classes = _.without(classes, c);                                                                // 68
    });                                                                                                 // 69
    _.each(newClasses, function (c) {                                                                   // 70
      if (_.indexOf(oldClasses, c) < 0 &&                                                               // 71
          _.indexOf(classes, c) < 0)                                                                    // 72
        classes.push(c);                                                                                // 73
    });                                                                                                 // 74
                                                                                                        // 75
    this.setValue(element, classes.join(' '));                                                          // 76
  }                                                                                                     // 77
});                                                                                                     // 78
                                                                                                        // 79
var ClassHandler = BaseClassHandler.extend({                                                            // 80
  // @param rawValue {String}                                                                           // 81
  getCurrentValue: function (element) {                                                                 // 82
    return element.className;                                                                           // 83
  },                                                                                                    // 84
  setValue: function (element, className) {                                                             // 85
    element.className = className;                                                                      // 86
  }                                                                                                     // 87
});                                                                                                     // 88
                                                                                                        // 89
var SVGClassHandler = BaseClassHandler.extend({                                                         // 90
  getCurrentValue: function (element) {                                                                 // 91
    return element.className.baseVal;                                                                   // 92
  },                                                                                                    // 93
  setValue: function (element, className) {                                                             // 94
    element.setAttribute('class', className);                                                           // 95
  }                                                                                                     // 96
});                                                                                                     // 97
                                                                                                        // 98
var BooleanHandler = AttributeHandler.extend({                                                          // 99
  update: function (element, oldValue, value) {                                                         // 100
    var name = this.name;                                                                               // 101
    if (value == null) {                                                                                // 102
      if (oldValue != null)                                                                             // 103
        element[name] = false;                                                                          // 104
    } else {                                                                                            // 105
      element[name] = true;                                                                             // 106
    }                                                                                                   // 107
  }                                                                                                     // 108
});                                                                                                     // 109
                                                                                                        // 110
var ValueHandler = AttributeHandler.extend({                                                            // 111
  update: function (element, oldValue, value) {                                                         // 112
    var focused = (element === document.activeElement);                                                 // 113
                                                                                                        // 114
    if (!focused)                                                                                       // 115
      element.value = value;                                                                            // 116
  }                                                                                                     // 117
});                                                                                                     // 118
                                                                                                        // 119
// cross-browser version of `instanceof SVGElement`                                                     // 120
var isSVGElement = function (elem) {                                                                    // 121
  return 'ownerSVGElement' in elem;                                                                     // 122
};                                                                                                      // 123
                                                                                                        // 124
// XXX make it possible for users to register attribute handlers!                                       // 125
makeAttributeHandler = function (elem, name, value) {                                                   // 126
  // generally, use setAttribute but certain attributes need to be set                                  // 127
  // by directly setting a JavaScript property on the DOM element.                                      // 128
  if (name === 'class') {                                                                               // 129
    if (isSVGElement(elem)) {                                                                           // 130
      return new SVGClassHandler(name, value);                                                          // 131
    } else {                                                                                            // 132
      return new ClassHandler(name, value);                                                             // 133
    }                                                                                                   // 134
  } else if (name === 'selected' || name === 'checked') {                                               // 135
    return new BooleanHandler(name, value);                                                             // 136
  } else if ((elem.tagName === 'TEXTAREA' || elem.tagName === 'INPUT')                                  // 137
             && name === 'value') {                                                                     // 138
    // internally, TEXTAREAs tracks their value in the 'value'                                          // 139
    // attribute just like INPUTs.                                                                      // 140
    return new ValueHandler(name, value);                                                               // 141
  } else {                                                                                              // 142
    return new AttributeHandler(name, value);                                                           // 143
  }                                                                                                     // 144
                                                                                                        // 145
  // XXX will need one for 'style' on IE, though modern browsers                                        // 146
  // seem to handle setAttribute ok.                                                                    // 147
};                                                                                                      // 148
                                                                                                        // 149
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/ui/render.js                                                                                //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
                                                                                                        // 1
UI.Component.instantiate = function (parent) {                                                          // 2
  var kind = this;                                                                                      // 3
                                                                                                        // 4
  // check arguments                                                                                    // 5
  if (UI.isComponent(kind)) {                                                                           // 6
    if (kind.isInited)                                                                                  // 7
      throw new Error("A component kind is required, not an instance");                                 // 8
  } else {                                                                                              // 9
    throw new Error("Expected Component kind");                                                         // 10
  }                                                                                                     // 11
                                                                                                        // 12
  var inst = kind.extend(); // XXX args go here                                                         // 13
  inst.isInited = true;                                                                                 // 14
                                                                                                        // 15
  // XXX messy to define this here                                                                      // 16
  inst.templateInstance = {                                                                             // 17
    findAll: function (selector) {                                                                      // 18
      // XXX check that `.dom` exists here?                                                             // 19
      return inst.dom.$(selector);                                                                      // 20
    },                                                                                                  // 21
    find: function (selector) {                                                                         // 22
      var result = this.findAll(selector);                                                              // 23
      return result[0] || null;                                                                         // 24
    },                                                                                                  // 25
    firstNode: null,                                                                                    // 26
    lastNode: null,                                                                                     // 27
    data: null,                                                                                         // 28
    __component__: inst                                                                                 // 29
  };                                                                                                    // 30
                                                                                                        // 31
  inst.parent = (parent || null);                                                                       // 32
                                                                                                        // 33
  if (inst.init)                                                                                        // 34
    inst.init();                                                                                        // 35
                                                                                                        // 36
  if (inst.created) {                                                                                   // 37
    updateTemplateInstance(inst);                                                                       // 38
    inst.created.call(inst.templateInstance);                                                           // 39
  }                                                                                                     // 40
                                                                                                        // 41
  return inst;                                                                                          // 42
};                                                                                                      // 43
                                                                                                        // 44
UI.Component.render = function () {                                                                     // 45
  return null;                                                                                          // 46
};                                                                                                      // 47
                                                                                                        // 48
                                                                                                        // 49
// Takes a reactive function (call it `inner`) and returns a reactive function                          // 50
// `outer` which is equivalent except in its reactive behavior.  Specifically,                          // 51
// `outer` has the following two special properties:                                                    // 52
//                                                                                                      // 53
// 1. Isolation:  An invocation of `outer()` only invalidates its context                               // 54
//    when the value of `inner()` changes.  For example, `inner` may be a                               // 55
//    function that gets one or more Session variables and calculates a                                 // 56
//    true/false value.  `outer` blocks invalidation signals caused by the                              // 57
//    Session variables changing and sends a signal out only when the value                             // 58
//    changes between true and false (in this example).  The value can be                               // 59
//    of any type, and it is compared with `===` unless an `equals` function                            // 60
//    is provided.                                                                                      // 61
//                                                                                                      // 62
// 2. Value Sharing:  The `outer` function returned by `emboxValue` can be                              // 63
//    shared between different contexts, for example by assigning it to an                              // 64
//    object as a method that can be accessed at any time, such as by                                   // 65
//    different templates or different parts of a template.  No matter                                  // 66
//    how many times `outer` is called, `inner` is only called once until                               // 67
//    it changes.  The most recent value is stored internally.                                          // 68
//                                                                                                      // 69
// Conceptually, an emboxed value is much like a Session variable which is                              // 70
// kept up to date by an autorun.  Session variables provide storage                                    // 71
// (value sharing) and they don't notify their listeners unless a value                                 // 72
// actually changes (isolation).  The biggest difference is that such an                                // 73
// autorun would never be stopped, and the Session variable would never be                              // 74
// deleted even if it wasn't used any more.  An emboxed value, on the other                             // 75
// hand, automatically stops computing when it's not being used, and starts                             // 76
// again when called from a reactive context.  This means that when it stops                            // 77
// being used, it can be completely garbage-collected.                                                  // 78
//                                                                                                      // 79
// If a non-function value is supplied to `emboxValue` instead of a reactive                            // 80
// function, then `outer` is still a function but it simply returns the value.                          // 81
//                                                                                                      // 82
UI.emboxValue = function (funcOrValue, equals) {                                                        // 83
  if (typeof funcOrValue === 'function') {                                                              // 84
    var func = funcOrValue;                                                                             // 85
                                                                                                        // 86
    var curResult = null;                                                                               // 87
    // There's one shared Dependency and Computation for all callers of                                 // 88
    // our box function.  It gets kicked off if necessary, and when                                     // 89
    // there are no more dependents, it gets stopped to avoid leaking                                   // 90
    // memory.                                                                                          // 91
    var resultDep = null;                                                                               // 92
    var computation = null;                                                                             // 93
                                                                                                        // 94
    return function () {                                                                                // 95
      if (! computation) {                                                                              // 96
        if (! Deps.active) {                                                                            // 97
          // Not in a reactive context.  Just call func, and don't start a                              // 98
          // computation if there isn't one running already.                                            // 99
          return func();                                                                                // 100
        }                                                                                               // 101
                                                                                                        // 102
        // No running computation, so kick one off.  Since this computation                             // 103
        // will be shared, avoid any association with the current computation                           // 104
        // by using `Deps.nonreactive`.                                                                 // 105
        resultDep = new Deps.Dependency;                                                                // 106
                                                                                                        // 107
        computation = Deps.nonreactive(function () {                                                    // 108
          return Deps.autorun(function (c) {                                                            // 109
            var oldResult = curResult;                                                                  // 110
            curResult = func();                                                                         // 111
            if (! c.firstRun) {                                                                         // 112
              if (! (equals ? equals(curResult, oldResult) :                                            // 113
                     curResult === oldResult))                                                          // 114
                resultDep.changed();                                                                    // 115
            }                                                                                           // 116
          });                                                                                           // 117
        });                                                                                             // 118
      }                                                                                                 // 119
                                                                                                        // 120
      if (Deps.active) {                                                                                // 121
        var isNew = resultDep.depend();                                                                 // 122
        if (isNew) {                                                                                    // 123
          // For each new dependent, schedule a task for after that dependent's                         // 124
          // invalidation time and the subsequent flush. The task checks                                // 125
          // whether the computation should be torn down.                                               // 126
          Deps.onInvalidate(function () {                                                               // 127
            if (resultDep && ! resultDep.hasDependents()) {                                             // 128
              Deps.afterFlush(function () {                                                             // 129
                // use a second afterFlush to bump ourselves to the END of the                          // 130
                // flush, after computation re-runs have had a chance to                                // 131
                // re-establish their connections to our computation.                                   // 132
                Deps.afterFlush(function () {                                                           // 133
                  if (resultDep && ! resultDep.hasDependents()) {                                       // 134
                    computation.stop();                                                                 // 135
                    computation = null;                                                                 // 136
                    resultDep = null;                                                                   // 137
                  }                                                                                     // 138
                });                                                                                     // 139
              });                                                                                       // 140
            }                                                                                           // 141
          });                                                                                           // 142
        }                                                                                               // 143
      }                                                                                                 // 144
                                                                                                        // 145
      return curResult;                                                                                 // 146
    };                                                                                                  // 147
                                                                                                        // 148
  } else {                                                                                              // 149
    var value = funcOrValue;                                                                            // 150
    var result = function () {                                                                          // 151
      return value;                                                                                     // 152
    };                                                                                                  // 153
    result._isEmboxedConstant = true;                                                                   // 154
    return result;                                                                                      // 155
  }                                                                                                     // 156
};                                                                                                      // 157
                                                                                                        // 158
                                                                                                        // 159
////////////////////////////////////////                                                                // 160
                                                                                                        // 161
// Insert a DOM node or DomRange into a DOM element or DomRange.                                        // 162
//                                                                                                      // 163
// One of three things happens depending on what needs to be inserted into what:                        // 164
// - `range.add` (anything into DomRange)                                                               // 165
// - `UI.DomRange.insert` (DomRange into element)                                                       // 166
// - `elem.insertBefore` (node into element)                                                            // 167
//                                                                                                      // 168
// The optional `before` argument is an existing node or id to insert before in                         // 169
// the parent element or DomRange.                                                                      // 170
var insert = function (nodeOrRange, parent, before) {                                                   // 171
  if (! parent)                                                                                         // 172
    throw new Error("Materialization parent required");                                                 // 173
                                                                                                        // 174
  if (parent instanceof UI.DomRange) {                                                                  // 175
    parent.add(nodeOrRange, before);                                                                    // 176
  } else if (nodeOrRange instanceof UI.DomRange) {                                                      // 177
    // parent is an element; inserting a range                                                          // 178
    UI.DomRange.insert(nodeOrRange, parent, before);                                                    // 179
  } else {                                                                                              // 180
    // parent is an element; inserting an element                                                       // 181
    parent.insertBefore(nodeOrRange, before || null); // `null` for IE                                  // 182
  }                                                                                                     // 183
};                                                                                                      // 184
                                                                                                        // 185
// Update attributes on `elem` to the dictionary `attrs`, using the                                     // 186
// dictionary of existing `handlers` if provided.                                                       // 187
//                                                                                                      // 188
// Values in the `attrs` dictionary are in pseudo-DOM form -- a string,                                 // 189
// CharRef, or array of strings and CharRefs -- but they are passed to                                  // 190
// the AttributeHandler in string form.                                                                 // 191
var updateAttributes = function(elem, newAttrs, handlers) {                                             // 192
                                                                                                        // 193
  if (handlers) {                                                                                       // 194
    for (var k in handlers) {                                                                           // 195
      if (! newAttrs.hasOwnProperty(k)) {                                                               // 196
        // remove attributes (and handlers) for attribute names                                         // 197
        // that don't exist as keys of `newAttrs` and so won't                                          // 198
        // be visited when traversing it.  (Attributes that                                             // 199
        // exist in the `newAttrs` object but are `null`                                                // 200
        // are handled later.)                                                                          // 201
        var handler = handlers[k];                                                                      // 202
        var oldValue = handler.value;                                                                   // 203
        handler.value = null;                                                                           // 204
        handler.update(elem, oldValue, null);                                                           // 205
        delete handlers[k];                                                                             // 206
      }                                                                                                 // 207
    }                                                                                                   // 208
  }                                                                                                     // 209
                                                                                                        // 210
  for (var k in newAttrs) {                                                                             // 211
    var handler = null;                                                                                 // 212
    var oldValue;                                                                                       // 213
    var value = newAttrs[k];                                                                            // 214
    if ((! handlers) || (! handlers.hasOwnProperty(k))) {                                               // 215
      if (value !== null) {                                                                             // 216
        // make new handler                                                                             // 217
        handler = makeAttributeHandler(elem, k, value);                                                 // 218
        if (handlers)                                                                                   // 219
          handlers[k] = handler;                                                                        // 220
        oldValue = null;                                                                                // 221
      }                                                                                                 // 222
    } else {                                                                                            // 223
      handler = handlers[k];                                                                            // 224
      oldValue = handler.value;                                                                         // 225
    }                                                                                                   // 226
    if (handler && oldValue !== value) {                                                                // 227
      handler.value = value;                                                                            // 228
      handler.update(elem, oldValue, value);                                                            // 229
      if (value === null)                                                                               // 230
        delete handlers[k];                                                                             // 231
    }                                                                                                   // 232
  }                                                                                                     // 233
};                                                                                                      // 234
                                                                                                        // 235
UI.render = function (kind, parentComponent) {                                                          // 236
  if (kind.isInited)                                                                                    // 237
    throw new Error("Can't render component instance, only component kind");                            // 238
  var inst = kind.instantiate(parentComponent);                                                         // 239
                                                                                                        // 240
  var content = (inst.render && inst.render());                                                         // 241
                                                                                                        // 242
  var range = new UI.DomRange;                                                                          // 243
  inst.dom = range;                                                                                     // 244
  range.component = inst;                                                                               // 245
                                                                                                        // 246
  materialize(content, range, null, inst);                                                              // 247
                                                                                                        // 248
  range.removed = function () {                                                                         // 249
    inst.isDestroyed = true;                                                                            // 250
    if (inst.destroyed) {                                                                               // 251
      updateTemplateInstance(inst);                                                                     // 252
      inst.destroyed.call(inst.templateInstance);                                                       // 253
    }                                                                                                   // 254
  };                                                                                                    // 255
                                                                                                        // 256
  return inst;                                                                                          // 257
};                                                                                                      // 258
                                                                                                        // 259
var contentEquals = function (a, b) {                                                                   // 260
  if (a instanceof HTML.Raw) {                                                                          // 261
    return (b instanceof HTML.Raw) && (a.value === b.value);                                            // 262
  } else if (a == null) {                                                                               // 263
    return (b == null);                                                                                 // 264
  } else {                                                                                              // 265
    return (a === b) &&                                                                                 // 266
      ((typeof a === 'number') || (typeof a === 'boolean') ||                                           // 267
       (typeof a === 'string'));                                                                        // 268
  }                                                                                                     // 269
};                                                                                                      // 270
                                                                                                        // 271
UI.InTemplateScope = function (tmplInstance, content) {                                                 // 272
  if (! (this instanceof UI.InTemplateScope))                                                           // 273
    // called without `new`                                                                             // 274
    return new UI.InTemplateScope(tmplInstance, content);                                               // 275
                                                                                                        // 276
  var parentPtr = tmplInstance.parent;                                                                  // 277
  if (parentPtr.__isTemplateWith)                                                                       // 278
    parentPtr = parentPtr.parent;                                                                       // 279
                                                                                                        // 280
  this.parentPtr = parentPtr;                                                                           // 281
  this.content = content;                                                                               // 282
};                                                                                                      // 283
                                                                                                        // 284
UI.InTemplateScope.prototype.toHTML = function (parentComponent) {                                      // 285
  return HTML.toHTML(this.content, this.parentPtr);                                                     // 286
};                                                                                                      // 287
                                                                                                        // 288
UI.InTemplateScope.prototype.toText = function (textMode, parentComponent) {                            // 289
  return HTML.toText(this.content, textMode, this.parentPtr);                                           // 290
};                                                                                                      // 291
                                                                                                        // 292
// Convert the pseudoDOM `node` into reactive DOM nodes and insert them                                 // 293
// into the element or DomRange `parent`, before the node or id `before`.                               // 294
var materialize = function (node, parent, before, parentComponent) {                                    // 295
  // XXX should do more error-checking for the case where user is supplying the tags.                   // 296
  // For example, check that CharRef has `html` and `str` properties and no content.                    // 297
  // Check that Comment has a single string child and no attributes.  Etc.                              // 298
                                                                                                        // 299
  if (node == null) {                                                                                   // 300
    // null or undefined.                                                                               // 301
    // do nothinge.                                                                                     // 302
  } else if ((typeof node === 'string') || (typeof node === 'boolean') || (typeof node === 'number')) { // 303
    node = String(node);                                                                                // 304
    insert(document.createTextNode(node), parent, before);                                              // 305
  } else if (node instanceof Array) {                                                                   // 306
    for (var i = 0; i < node.length; i++)                                                               // 307
      materialize(node[i], parent, before, parentComponent);                                            // 308
  } else if (typeof node === 'function') {                                                              // 309
                                                                                                        // 310
    var range = new UI.DomRange;                                                                        // 311
    var lastContent = null;                                                                             // 312
    var rangeUpdater = Deps.autorun(function (c) {                                                      // 313
      var content = node();                                                                             // 314
      // normalize content a little, for easier comparison                                              // 315
      if (HTML.isNully(content))                                                                        // 316
        content = null;                                                                                 // 317
      else if ((content instanceof Array) && content.length === 1)                                      // 318
        content = content[0];                                                                           // 319
                                                                                                        // 320
      // update if content is different from last time                                                  // 321
      if (! contentEquals(content, lastContent)) {                                                      // 322
        lastContent = content;                                                                          // 323
                                                                                                        // 324
        if (! c.firstRun)                                                                               // 325
          range.removeAll();                                                                            // 326
                                                                                                        // 327
        Deps.nonreactive(function () {                                                                  // 328
          materialize(content, range, null, parentComponent);                                           // 329
        });                                                                                             // 330
      }                                                                                                 // 331
    });                                                                                                 // 332
    range.removed = function () {                                                                       // 333
      rangeUpdater.stop();                                                                              // 334
    };                                                                                                  // 335
    insert(range, parent, before);                                                                      // 336
  } else if (node instanceof HTML.Tag) {                                                                // 337
    var tagName = HTML.properCaseTagName(node.tagName);                                                 // 338
    var elem;                                                                                           // 339
    if (HTML.isKnownSVGElement(tagName) && (! HTML.isKnownElement(tagName)) &&                          // 340
        document.createElementNS) {                                                                     // 341
      elem = document.createElementNS('http://www.w3.org/2000/svg', tagName);                           // 342
    } else {                                                                                            // 343
      elem = document.createElement(node.tagName);                                                      // 344
    }                                                                                                   // 345
                                                                                                        // 346
    var rawAttrs = node.attrs;                                                                          // 347
    var children = node.children;                                                                       // 348
    if (node.tagName === 'TEXTAREA') {                                                                  // 349
      rawAttrs = (rawAttrs || {});                                                                      // 350
      rawAttrs.value = children;                                                                        // 351
      children = [];                                                                                    // 352
    };                                                                                                  // 353
                                                                                                        // 354
    if (rawAttrs) {                                                                                     // 355
      var attrUpdater = Deps.autorun(function (c) {                                                     // 356
        if (! c.handlers)                                                                               // 357
          c.handlers = {};                                                                              // 358
                                                                                                        // 359
        try {                                                                                           // 360
          var attrs = HTML.evaluateAttributes(rawAttrs, parentComponent);                               // 361
          var stringAttrs = {};                                                                         // 362
          if (attrs) {                                                                                  // 363
            for (var k in attrs) {                                                                      // 364
              stringAttrs[k] = HTML.toText(attrs[k], HTML.TEXTMODE.STRING,                              // 365
                                           parentComponent);                                            // 366
            }                                                                                           // 367
            updateAttributes(elem, stringAttrs, c.handlers);                                            // 368
          }                                                                                             // 369
        } catch (e) {                                                                                   // 370
          reportUIException(e);                                                                         // 371
        }                                                                                               // 372
      });                                                                                               // 373
      UI.DomBackend.onRemoveElement(elem, function () {                                                 // 374
        attrUpdater.stop();                                                                             // 375
      });                                                                                               // 376
    }                                                                                                   // 377
    materialize(children, elem, null, parentComponent);                                                 // 378
                                                                                                        // 379
    insert(elem, parent, before);                                                                       // 380
  } else if (typeof node.instantiate === 'function') {                                                  // 381
    // component                                                                                        // 382
    var instance = UI.render(node, parentComponent);                                                    // 383
                                                                                                        // 384
    insert(instance.dom, parent, before);                                                               // 385
  } else if (node instanceof HTML.CharRef) {                                                            // 386
    insert(document.createTextNode(node.str), parent, before);                                          // 387
  } else if (node instanceof HTML.Comment) {                                                            // 388
    insert(document.createComment(node.sanitizedValue), parent, before);                                // 389
  } else if (node instanceof HTML.Raw) {                                                                // 390
    // Get an array of DOM nodes by using the browser's HTML parser                                     // 391
    // (like innerHTML).                                                                                // 392
    var htmlNodes = UI.DomBackend.parseHTML(node.value);                                                // 393
    for (var i = 0; i < htmlNodes.length; i++)                                                          // 394
      insert(htmlNodes[i], parent, before);                                                             // 395
  } else if (HTML.Special && (node instanceof HTML.Special)) {                                          // 396
    throw new Error("Can't materialize Special tag, it's just an intermediate rep");                    // 397
  } else if (node instanceof UI.InTemplateScope) {                                                      // 398
    materialize(node.content, parent, before, node.parentPtr);                                          // 399
  } else {                                                                                              // 400
    // can't get here                                                                                   // 401
    throw new Error("Unexpected node in htmljs: " + node);                                              // 402
  }                                                                                                     // 403
};                                                                                                      // 404
                                                                                                        // 405
                                                                                                        // 406
                                                                                                        // 407
// XXX figure out the right names, and namespace, for these.                                            // 408
// for example, maybe some of them go in the HTML package.                                              // 409
UI.materialize = materialize;                                                                           // 410
                                                                                                        // 411
UI.body = UI.Component.extend({                                                                         // 412
  kind: 'body',                                                                                         // 413
  contentParts: [],                                                                                     // 414
  render: function () {                                                                                 // 415
    return this.contentParts;                                                                           // 416
  },                                                                                                    // 417
  // XXX revisit how body works.                                                                        // 418
  INSTANTIATED: false                                                                                   // 419
});                                                                                                     // 420
                                                                                                        // 421
UI.block = function (renderFunc) {                                                                      // 422
  return UI.Component.extend({ render: renderFunc });                                                   // 423
};                                                                                                      // 424
                                                                                                        // 425
UI.toHTML = function (content, parentComponent) {                                                       // 426
  return HTML.toHTML(content, parentComponent);                                                         // 427
};                                                                                                      // 428
                                                                                                        // 429
UI.toRawText = function (content, parentComponent) {                                                    // 430
  return HTML.toText(content, HTML.TEXTMODE.STRING, parentComponent);                                   // 431
};                                                                                                      // 432
                                                                                                        // 433
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/ui/builtins.js                                                                              //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
                                                                                                        // 1
UI.If = function (argFunc, contentBlock, elseContentBlock) {                                            // 2
  checkBlockHelperArguments('If', argFunc, contentBlock, elseContentBlock);                             // 3
                                                                                                        // 4
  return function () {                                                                                  // 5
    if (getCondition(argFunc))                                                                          // 6
      return contentBlock;                                                                              // 7
    else                                                                                                // 8
      return elseContentBlock || null;                                                                  // 9
  };                                                                                                    // 10
};                                                                                                      // 11
                                                                                                        // 12
                                                                                                        // 13
UI.Unless = function (argFunc, contentBlock, elseContentBlock) {                                        // 14
  checkBlockHelperArguments('Unless', argFunc, contentBlock, elseContentBlock);                         // 15
                                                                                                        // 16
  return function () {                                                                                  // 17
    if (! getCondition(argFunc))                                                                        // 18
      return contentBlock;                                                                              // 19
    else                                                                                                // 20
      return elseContentBlock || null;                                                                  // 21
  };                                                                                                    // 22
};                                                                                                      // 23
                                                                                                        // 24
// Returns true if `a` and `b` are `===`, unless they are of a mutable type.                            // 25
// (Because then, they may be equal references to an object that was mutated,                           // 26
// and we'll never know.  We save only a reference to the old object; we don't                          // 27
// do any deep-copying or diffing.)                                                                     // 28
var safeEquals = function (a, b) {                                                                      // 29
  if (a !== b)                                                                                          // 30
    return false;                                                                                       // 31
  else                                                                                                  // 32
    return ((!a) || (typeof a === 'number') || (typeof a === 'boolean') ||                              // 33
            (typeof a === 'string'));                                                                   // 34
};                                                                                                      // 35
                                                                                                        // 36
// Unlike Spacebars.With, there's no else case and no conditional logic.                                // 37
//                                                                                                      // 38
// We don't do any reactive emboxing of `argFunc` here; it should be done                               // 39
// by the caller if efficiency and/or number of calls to the data source                                // 40
// is important.                                                                                        // 41
UI.With = function (argFunc, contentBlock) {                                                            // 42
  checkBlockHelperArguments('With', argFunc, contentBlock);                                             // 43
                                                                                                        // 44
  var block = contentBlock;                                                                             // 45
  if ('data' in block) {                                                                                // 46
    // XXX TODO: get religion about where `data` property goes                                          // 47
    block = UI.block(function () {                                                                      // 48
      return contentBlock;                                                                              // 49
    });                                                                                                 // 50
  }                                                                                                     // 51
  block.data = UI.emboxValue(argFunc, safeEquals);                                                      // 52
                                                                                                        // 53
  return block;                                                                                         // 54
};                                                                                                      // 55
                                                                                                        // 56
UI.Each = function (argFunc, contentBlock, elseContentBlock) {                                          // 57
  checkBlockHelperArguments('Each', argFunc, contentBlock, elseContentBlock);                           // 58
                                                                                                        // 59
  return UI.EachImpl.extend({                                                                           // 60
    __sequence: argFunc,                                                                                // 61
    __content: contentBlock,                                                                            // 62
    __elseContent: elseContentBlock                                                                     // 63
  });                                                                                                   // 64
};                                                                                                      // 65
                                                                                                        // 66
var checkBlockHelperArguments = function (which, argFunc, contentBlock, elseContentBlock) {             // 67
  if (typeof argFunc !== 'function')                                                                    // 68
    throw new Error('First argument to ' + which + ' must be a function');                              // 69
  if (! UI.isComponent(contentBlock))                                                                   // 70
    throw new Error('Second argument to ' + which + ' must be a template or UI.block');                 // 71
  if (elseContentBlock && ! UI.isComponent(elseContentBlock))                                           // 72
    throw new Error('Third argument to ' + which + ' must be a template or UI.block if present');       // 73
};                                                                                                      // 74
                                                                                                        // 75
// Acts like `!! conditionFunc()` except:                                                               // 76
//                                                                                                      // 77
// - Empty array is considered falsy                                                                    // 78
// - The result is Deps.isolated (doesn't trigger invalidation                                          // 79
//   as long as the condition stays truthy or stays falsy                                               // 80
var getCondition = function (conditionFunc) {                                                           // 81
  return Deps.isolateValue(function () {                                                                // 82
    // `condition` is emboxed; it is always a function,                                                 // 83
    // and it only triggers invalidation if its return                                                  // 84
    // value actually changes.  We still need to isolate                                                // 85
    // the calculation of whether it is truthy or falsy                                                 // 86
    // in order to not re-render if it changes from one                                                 // 87
    // truthy or falsy value to another.                                                                // 88
    var cond = conditionFunc();                                                                         // 89
                                                                                                        // 90
    // empty arrays are treated as falsey values                                                        // 91
    if (cond instanceof Array && cond.length === 0)                                                     // 92
      return false;                                                                                     // 93
    else                                                                                                // 94
      return !! cond;                                                                                   // 95
  });                                                                                                   // 96
};                                                                                                      // 97
                                                                                                        // 98
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/ui/each.js                                                                                  //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
UI.EachImpl = Component.extend({                                                                        // 1
  typeName: 'Each',                                                                                     // 2
  render: function (modeHint) {                                                                         // 3
    var self = this;                                                                                    // 4
    var content = self.__content;                                                                       // 5
    var elseContent = self.__elseContent;                                                               // 6
                                                                                                        // 7
    if (modeHint === 'STATIC') {                                                                        // 8
      // This is a hack.  The caller gives us a hint if the                                             // 9
      // value we return will be static (in HTML or text)                                               // 10
      // or dynamic (materialized DOM).  The dynamic path                                               // 11
      // returns `null` and then we populate the DOM from                                               // 12
      // the `parented` callback.                                                                       // 13
      //                                                                                                // 14
      // It would be much cleaner to always return the same                                             // 15
      // value here, and to have that value be some special                                             // 16
      // object that encapsulates the logic for populating                                              // 17
      // the #each using a mode-agnostic interface that                                                 // 18
      // works for HTML, text, and DOM.  Alternatively, we                                              // 19
      // could formalize the current pattern, e.g. defining                                             // 20
      // a method like component.populate(domRange) and one                                             // 21
      // like renderStatic() or even renderHTML / renderText.                                           // 22
      var parts = _.map(                                                                                // 23
        ObserveSequence.fetch(self.__sequence()),                                                       // 24
        function (item) {                                                                               // 25
          return content.extend({data: function () {                                                    // 26
            return item;                                                                                // 27
          }});                                                                                          // 28
        });                                                                                             // 29
                                                                                                        // 30
      if (parts.length) {                                                                               // 31
        return parts;                                                                                   // 32
      } else {                                                                                          // 33
        return elseContent;                                                                             // 34
      }                                                                                                 // 35
      return parts;                                                                                     // 36
    } else {                                                                                            // 37
      return null;                                                                                      // 38
    }                                                                                                   // 39
  },                                                                                                    // 40
  parented: function () {                                                                               // 41
    var self = this.__component__;                                                                      // 42
                                                                                                        // 43
    var range = self.dom;                                                                               // 44
                                                                                                        // 45
    var content = self.__content;                                                                       // 46
    var elseContent = self.__elseContent;                                                               // 47
                                                                                                        // 48
    // if there is an else clause, keep track of the number of                                          // 49
    // rendered items.  use this to display the else clause when count                                  // 50
    // becomes zero, and remove it when count becomes positive.                                         // 51
    var itemCount = 0;                                                                                  // 52
    var addToCount = function(delta) {                                                                  // 53
      if (!elseContent) // if no else, no need to keep track of count                                   // 54
        return;                                                                                         // 55
                                                                                                        // 56
      if (itemCount + delta < 0)                                                                        // 57
        throw new Error("count should never become negative");                                          // 58
                                                                                                        // 59
      if (itemCount === 0) {                                                                            // 60
        // remove else clause                                                                           // 61
        range.removeAll();                                                                              // 62
      }                                                                                                 // 63
      itemCount += delta;                                                                               // 64
      if (itemCount === 0) {                                                                            // 65
        UI.materialize(elseContent, range, null, self);                                                 // 66
      }                                                                                                 // 67
    };                                                                                                  // 68
                                                                                                        // 69
    this.observeHandle = ObserveSequence.observe(function () {                                          // 70
      return self.__sequence();                                                                         // 71
    }, {                                                                                                // 72
      addedAt: function (id, item, i, beforeId) {                                                       // 73
        addToCount(1);                                                                                  // 74
        id = LocalCollection._idStringify(id);                                                          // 75
                                                                                                        // 76
        var data = item;                                                                                // 77
        var dep = new Deps.Dependency;                                                                  // 78
                                                                                                        // 79
        // function to become `comp.data`                                                               // 80
        var dataFunc = function () {                                                                    // 81
          dep.depend();                                                                                 // 82
          return data;                                                                                  // 83
        };                                                                                              // 84
        // Storing `$set` on `comp.data` lets us                                                        // 85
        // access it from `changed`.                                                                    // 86
        dataFunc.$set = function (v) {                                                                  // 87
          data = v;                                                                                     // 88
          dep.changed();                                                                                // 89
        };                                                                                              // 90
                                                                                                        // 91
        if (beforeId)                                                                                   // 92
          beforeId = LocalCollection._idStringify(beforeId);                                            // 93
                                                                                                        // 94
        var renderedItem = UI.render(content.extend({data: dataFunc}), self);                           // 95
        range.add(id, renderedItem.dom, beforeId);                                                      // 96
      },                                                                                                // 97
      removed: function (id, item) {                                                                    // 98
        addToCount(-1);                                                                                 // 99
        range.remove(LocalCollection._idStringify(id));                                                 // 100
      },                                                                                                // 101
      movedTo: function (id, item, i, j, beforeId) {                                                    // 102
        range.moveBefore(                                                                               // 103
          LocalCollection._idStringify(id),                                                             // 104
          beforeId && LocalCollection._idStringify(beforeId));                                          // 105
      },                                                                                                // 106
      changed: function (id, newItem) {                                                                 // 107
        range.get(LocalCollection._idStringify(id)).component.data.$set(newItem);                       // 108
      }                                                                                                 // 109
    });                                                                                                 // 110
                                                                                                        // 111
      // on initial render, display the else clause if no items                                         // 112
      addToCount(0);                                                                                    // 113
  },                                                                                                    // 114
  destroyed: function () {                                                                              // 115
    if (this.observeHandle)                                                                             // 116
      this.observeHandle.stop();                                                                        // 117
  }                                                                                                     // 118
});                                                                                                     // 119
                                                                                                        // 120
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/ui/fields.js                                                                                //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
                                                                                                        // 1
var global = (function () { return this; })();                                                          // 2
                                                                                                        // 3
// Searches for the given property in `comp` or a parent,                                               // 4
// and returns it as is (without call it if it's a function).                                           // 5
var lookupComponentProp = function (comp, prop) {                                                       // 6
  comp = findComponentWithProp(prop, comp);                                                             // 7
  var result = (comp ? comp.data : null);                                                               // 8
  if (typeof result === 'function')                                                                     // 9
    result = _.bind(result, comp);                                                                      // 10
  return result;                                                                                        // 11
};                                                                                                      // 12
                                                                                                        // 13
// Component that's a no-op when used as a block helper like                                            // 14
// `{{#foo}}...{{/foo}}`.                                                                               // 15
var noOpComponent = Component.extend({                                                                  // 16
  kind: 'NoOp',                                                                                         // 17
  render: function () {                                                                                 // 18
    return this.__content;                                                                              // 19
  }                                                                                                     // 20
});                                                                                                     // 21
                                                                                                        // 22
// This map is searched first when you do something like `{{#foo}}` in                                  // 23
// a template.                                                                                          // 24
var builtInComponents = {                                                                               // 25
  // for past compat:                                                                                   // 26
  'constant': noOpComponent,                                                                            // 27
  'isolate': noOpComponent                                                                              // 28
};                                                                                                      // 29
                                                                                                        // 30
_extend(UI.Component, {                                                                                 // 31
  // Options:                                                                                           // 32
  //                                                                                                    // 33
  // - template {Boolean} If true, look at the list of templates after                                  // 34
  //   helpers and before data context.                                                                 // 35
  lookup: function (id, opts) {                                                                         // 36
    var self = this;                                                                                    // 37
    var template = opts && opts.template;                                                               // 38
    var result;                                                                                         // 39
    var comp;                                                                                           // 40
                                                                                                        // 41
    if (!id)                                                                                            // 42
      throw new Error("must pass id to lookup");                                                        // 43
                                                                                                        // 44
    if (/^\./.test(id)) {                                                                               // 45
      // starts with a dot. must be a series of dots which maps to an                                   // 46
      // ancestor of the appropriate height.                                                            // 47
      if (!/^(\.)+$/.test(id)) {                                                                        // 48
        throw new Error("id starting with dot must be a series of dots");                               // 49
      }                                                                                                 // 50
                                                                                                        // 51
      var compWithData = findComponentWithProp('data', self);                                           // 52
      for (var i = 1; i < id.length; i++) {                                                             // 53
        compWithData = compWithData ? findComponentWithProp('data', compWithData.parent) : null;        // 54
      }                                                                                                 // 55
                                                                                                        // 56
      return (compWithData ? compWithData.data : null);                                                 // 57
                                                                                                        // 58
    } else if ((comp = findComponentWithProp(id, self))) {                                              // 59
      // found a property or method of a component                                                      // 60
      // (`self` or one of its ancestors)                                                               // 61
      var result = comp[id];                                                                            // 62
                                                                                                        // 63
    } else if (_.has(builtInComponents, id)) {                                                          // 64
      return builtInComponents[id];                                                                     // 65
                                                                                                        // 66
    // Code to search the global namespace for capitalized names                                        // 67
    // like component classes, `Template`, `StringUtils.foo`,                                           // 68
    // etc.                                                                                             // 69
    //                                                                                                  // 70
    // } else if (/^[A-Z]/.test(id) && (id in global)) {                                                // 71
    //   // Only look for a global identifier if `id` is                                                // 72
    //   // capitalized.  This avoids having `{{name}}` mean                                            // 73
    //   // `window.name`.                                                                              // 74
    //   result = global[id];                                                                           // 75
    //   return function (/*arguments*/) {                                                              // 76
    //     var data = getComponentData(self);                                                           // 77
    //     if (typeof result === 'function')                                                            // 78
    //       return result.apply(data, arguments);                                                      // 79
    //     return result;                                                                               // 80
    //   };                                                                                             // 81
    } else if (template && _.has(Template, id)) {                                                       // 82
      return Template[id];                                                                              // 83
                                                                                                        // 84
    } else if (Handlebars._globalHelpers[id]) {                                                         // 85
      // Backwards compatibility for helpers defined with                                               // 86
      // `Handlebars.registerHelper`. XXX what is the future pattern                                    // 87
      // for this? We should definitely not put it on the Handlebars                                    // 88
      // namespace.                                                                                     // 89
      result = Handlebars._globalHelpers[id];                                                           // 90
                                                                                                        // 91
    } else {                                                                                            // 92
      // Resolve id `foo` as `data.foo` (with a "soft dot").                                            // 93
      return function (/*arguments*/) {                                                                 // 94
        var data = getComponentData(self);                                                              // 95
        if (! data)                                                                                     // 96
          return data;                                                                                  // 97
        var result = data[id];                                                                          // 98
        if (typeof result === 'function')                                                               // 99
          return result.apply(data, arguments);                                                         // 100
        return result;                                                                                  // 101
      };                                                                                                // 102
    }                                                                                                   // 103
                                                                                                        // 104
    if (typeof result === 'function' && ! result._isEmboxedConstant) {                                  // 105
      // Wrap the function `result`, binding `this` to `getComponentData(self)`.                        // 106
      // This creates a dependency when the result function is called.                                  // 107
      // Don't do this if the function is really just an emboxed constant.                              // 108
      return function (/*arguments*/) {                                                                 // 109
        var data = getComponentData(self);                                                              // 110
        return result.apply(data, arguments);                                                           // 111
      };                                                                                                // 112
    } else {                                                                                            // 113
      return result;                                                                                    // 114
    };                                                                                                  // 115
  },                                                                                                    // 116
  lookupTemplate: function (id) {                                                                       // 117
    return this.lookup(id, {template: true});                                                           // 118
  },                                                                                                    // 119
  get: function (id) {                                                                                  // 120
    // support `this.get()` to get the data context.                                                    // 121
    if (id === undefined)                                                                               // 122
      id = ".";                                                                                         // 123
                                                                                                        // 124
    var result = this.lookup(id);                                                                       // 125
    return (typeof result === 'function' ? result() : result);                                          // 126
  },                                                                                                    // 127
  set: function (id, value) {                                                                           // 128
    var comp = findComponentWithProp(id, this);                                                         // 129
    if (! comp || ! comp[id])                                                                           // 130
      throw new Error("Can't find field: " + id);                                                       // 131
    if (typeof comp[id] !== 'function')                                                                 // 132
      throw new Error("Not a settable field: " + id);                                                   // 133
    comp[id](value);                                                                                    // 134
  }                                                                                                     // 135
});                                                                                                     // 136
                                                                                                        // 137
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/ui/handlebars_backcompat.js                                                                 //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
Handlebars = {                                                                                          // 1
  _globalHelpers: {},                                                                                   // 2
                                                                                                        // 3
  registerHelper: function (name, func) {                                                               // 4
    this._globalHelpers[name] = func;                                                                   // 5
  }                                                                                                     // 6
};                                                                                                      // 7
                                                                                                        // 8
// Utility to HTML-escape a string.                                                                     // 9
Handlebars._escape = (function() {                                                                      // 10
  var escape_map = {                                                                                    // 11
    "<": "&lt;",                                                                                        // 12
    ">": "&gt;",                                                                                        // 13
    '"': "&quot;",                                                                                      // 14
    "'": "&#x27;",                                                                                      // 15
    "`": "&#x60;", /* IE allows backtick-delimited attributes?? */                                      // 16
    "&": "&amp;"                                                                                        // 17
  };                                                                                                    // 18
  var escape_one = function(c) {                                                                        // 19
    return escape_map[c];                                                                               // 20
  };                                                                                                    // 21
                                                                                                        // 22
  return function (x) {                                                                                 // 23
    return x.replace(/[&<>"'`]/g, escape_one);                                                          // 24
  };                                                                                                    // 25
})();                                                                                                   // 26
                                                                                                        // 27
// Return these from {{...}} helpers to achieve the same as returning                                   // 28
// strings from {{{...}}} helpers                                                                       // 29
Handlebars.SafeString = function(string) {                                                              // 30
  this.string = string;                                                                                 // 31
};                                                                                                      // 32
Handlebars.SafeString.prototype.toString = function() {                                                 // 33
  return this.string.toString();                                                                        // 34
};                                                                                                      // 35
                                                                                                        // 36
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.ui = {
  UI: UI,
  Handlebars: Handlebars
};

})();
