(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var HTML = Package.htmljs.HTML;
var UI = Package.ui.UI;
var Handlebars = Package.ui.Handlebars;

/* Package-scope variables */
var Spacebars;

(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                          //
// packages/spacebars/spacebars-runtime.js                                                                  //
//                                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                            //
Spacebars = {};                                                                                             // 1
                                                                                                            // 2
// * `templateOrFunction` - template (component) or function returning a template                           // 3
// or null                                                                                                  // 4
Spacebars.include = function (templateOrFunction, contentBlock, elseContentBlock) {                         // 5
  if (contentBlock && ! UI.isComponent(contentBlock))                                                       // 6
    throw new Error('Second argument to Spacebars.include must be a template or UI.block if present');      // 7
  if (elseContentBlock && ! UI.isComponent(elseContentBlock))                                               // 8
    throw new Error('Third argument to Spacebars.include must be a template or UI.block if present');       // 9
                                                                                                            // 10
  var props = null;                                                                                         // 11
  if (contentBlock) {                                                                                       // 12
    props = (props || {});                                                                                  // 13
    props.__content = contentBlock;                                                                         // 14
  }                                                                                                         // 15
  if (elseContentBlock) {                                                                                   // 16
    props = (props || {});                                                                                  // 17
    props.__elseContent = elseContentBlock;                                                                 // 18
  }                                                                                                         // 19
                                                                                                            // 20
  if (UI.isComponent(templateOrFunction))                                                                   // 21
    return templateOrFunction.extend(props);                                                                // 22
                                                                                                            // 23
  var func = templateOrFunction;                                                                            // 24
                                                                                                            // 25
  return function () {                                                                                      // 26
    var tmpl = Deps.isolateValue(func);                                                                     // 27
                                                                                                            // 28
    if (tmpl === null)                                                                                      // 29
      return null;                                                                                          // 30
    if (! UI.isComponent(tmpl))                                                                             // 31
      throw new Error("Expected null or template in return value from inclusion function, found: " + tmpl); // 32
                                                                                                            // 33
    return tmpl.extend(props);                                                                              // 34
  };                                                                                                        // 35
};                                                                                                          // 36
                                                                                                            // 37
// Executes `{{foo bar baz}}` when called on `(foo, bar, baz)`.                                             // 38
// If `bar` and `baz` are functions, they are called before                                                 // 39
// `foo` is called on them.                                                                                 // 40
//                                                                                                          // 41
// This is the shared part of Spacebars.mustache and                                                        // 42
// Spacebars.attrMustache, which differ in how they post-process the                                        // 43
// result.                                                                                                  // 44
Spacebars.mustacheImpl = function (value/*, args*/) {                                                       // 45
  var args = arguments;                                                                                     // 46
  // if we have any arguments (pos or kw), add an options argument                                          // 47
  // if there isn't one.                                                                                    // 48
  if (args.length > 1) {                                                                                    // 49
    var kw = args[args.length - 1];                                                                         // 50
    if (! (kw instanceof Spacebars.kw)) {                                                                   // 51
      kw = Spacebars.kw();                                                                                  // 52
      // clone arguments into an actual array, then push                                                    // 53
      // the empty kw object.                                                                               // 54
      args = Array.prototype.slice.call(arguments);                                                         // 55
      args.push(kw);                                                                                        // 56
    } else {                                                                                                // 57
      // For each keyword arg, call it if it's a function                                                   // 58
      var newHash = {};                                                                                     // 59
      for (var k in kw.hash) {                                                                              // 60
        var v = kw.hash[k];                                                                                 // 61
        newHash[k] = (typeof v === 'function' ? v() : v);                                                   // 62
      }                                                                                                     // 63
      args[args.length - 1] = Spacebars.kw(newHash);                                                        // 64
    }                                                                                                       // 65
  }                                                                                                         // 66
                                                                                                            // 67
  return Spacebars.call.apply(null, args);                                                                  // 68
};                                                                                                          // 69
                                                                                                            // 70
Spacebars.mustache = function (value/*, args*/) {                                                           // 71
  var result = Spacebars.mustacheImpl.apply(null, arguments);                                               // 72
                                                                                                            // 73
  if (result instanceof Handlebars.SafeString)                                                              // 74
    return HTML.Raw(result.toString());                                                                     // 75
  else                                                                                                      // 76
    // map `null`, `undefined`, and `false` to null, which is important                                     // 77
    // so that attributes with nully values are considered absent.                                          // 78
    // stringify anything else (e.g. strings, booleans, numbers including 0).                               // 79
    return (result == null || result === false) ? null : String(result);                                    // 80
};                                                                                                          // 81
                                                                                                            // 82
Spacebars.attrMustache = function (value/*, args*/) {                                                       // 83
  var result = Spacebars.mustacheImpl.apply(null, arguments);                                               // 84
                                                                                                            // 85
  if (result == null || result === '') {                                                                    // 86
    return null;                                                                                            // 87
  } else if (typeof result === 'object') {                                                                  // 88
    return result;                                                                                          // 89
  } else if (typeof result === 'string' && HTML.isValidAttributeName(result)) {                             // 90
    var obj = {};                                                                                           // 91
    obj[result] = '';                                                                                       // 92
    return obj;                                                                                             // 93
  } else {                                                                                                  // 94
    throw new Error("Expected valid attribute name, '', null, or object");                                  // 95
  }                                                                                                         // 96
};                                                                                                          // 97
                                                                                                            // 98
Spacebars.dataMustache = function (value/*, args*/) {                                                       // 99
  var result = Spacebars.mustacheImpl.apply(null, arguments);                                               // 100
                                                                                                            // 101
  return result;                                                                                            // 102
};                                                                                                          // 103
                                                                                                            // 104
// Idempotently wrap in `HTML.Raw`.                                                                         // 105
//                                                                                                          // 106
// Called on the return value from `Spacebars.mustache` in case the                                         // 107
// template uses triple-stache (`{{{foo bar baz}}}`).                                                       // 108
Spacebars.makeRaw = function (value) {                                                                      // 109
  if (value == null) // null or undefined                                                                   // 110
    return null;                                                                                            // 111
  else if (value instanceof HTML.Raw)                                                                       // 112
    return value;                                                                                           // 113
  else                                                                                                      // 114
    return HTML.Raw(value);                                                                                 // 115
};                                                                                                          // 116
                                                                                                            // 117
// If `value` is a function, called it on the `args`, after                                                 // 118
// evaluating the args themselves (by calling them if they are                                              // 119
// functions).  Otherwise, simply return `value` (and assert that                                           // 120
// there are no args).                                                                                      // 121
Spacebars.call = function (value/*, args*/) {                                                               // 122
  if (typeof value === 'function') {                                                                        // 123
    // evaluate arguments if they are functions (by calling them)                                           // 124
    var newArgs = [];                                                                                       // 125
    for (var i = 1; i < arguments.length; i++) {                                                            // 126
      var arg = arguments[i];                                                                               // 127
      newArgs[i-1] = (typeof arg === 'function' ? arg() : arg);                                             // 128
    }                                                                                                       // 129
                                                                                                            // 130
    return value.apply(null, newArgs);                                                                      // 131
  } else {                                                                                                  // 132
    if (arguments.length > 1)                                                                               // 133
      throw new Error("Can't call non-function: " + value);                                                 // 134
                                                                                                            // 135
    return value;                                                                                           // 136
  }                                                                                                         // 137
};                                                                                                          // 138
                                                                                                            // 139
// Call this as `Spacebars.kw({ ... })`.  The return value                                                  // 140
// is `instanceof Spacebars.kw`.                                                                            // 141
Spacebars.kw = function (hash) {                                                                            // 142
  if (! (this instanceof Spacebars.kw))                                                                     // 143
    // called without new; call with new                                                                    // 144
    return new Spacebars.kw(hash);                                                                          // 145
                                                                                                            // 146
  this.hash = hash || {};                                                                                   // 147
};                                                                                                          // 148
                                                                                                            // 149
// Call this as `Spacebars.SafeString("some HTML")`.  The return value                                      // 150
// is `instanceof Spacebars.SafeString` (and `instanceof Handlebars.SafeString).                            // 151
Spacebars.SafeString = function (html) {                                                                    // 152
  if (! (this instanceof Spacebars.SafeString))                                                             // 153
    // called without new; call with new                                                                    // 154
    return new Spacebars.SafeString(html);                                                                  // 155
                                                                                                            // 156
  return new Handlebars.SafeString(html);                                                                   // 157
};                                                                                                          // 158
Spacebars.SafeString.prototype = Handlebars.SafeString.prototype;                                           // 159
                                                                                                            // 160
// `Spacebars.dot(foo, "bar", "baz")` performs a special kind                                               // 161
// of `foo.bar.baz` that allows safe indexing of `null` and                                                 // 162
// indexing of functions (which calls the function).  If the                                                // 163
// result is a function, it is always a bound function (e.g.                                                // 164
// a wrapped version of `baz` that always uses `foo.bar` as                                                 // 165
// `this`).                                                                                                 // 166
//                                                                                                          // 167
// In `Spacebars.dot(foo, "bar")`, `foo` is assumed to be either                                            // 168
// a non-function value or a "fully-bound" function wrapping a value,                                       // 169
// where fully-bound means it takes no arguments and ignores `this`.                                        // 170
//                                                                                                          // 171
// `Spacebars.dot(foo, "bar")` performs the following steps:                                                // 172
//                                                                                                          // 173
// * If `foo` is falsy, return `foo`.                                                                       // 174
//                                                                                                          // 175
// * If `foo` is a function, call it (set `foo` to `foo()`).                                                // 176
//                                                                                                          // 177
// * If `foo` is falsy now, return `foo`.                                                                   // 178
//                                                                                                          // 179
// * Return `foo.bar`, binding it to `foo` if it's a function.                                              // 180
Spacebars.dot = function (value, id1/*, id2, ...*/) {                                                       // 181
  if (arguments.length > 2) {                                                                               // 182
    // Note: doing this recursively is probably less efficient than                                         // 183
    // doing it in an iterative loop.                                                                       // 184
    var argsForRecurse = [];                                                                                // 185
    argsForRecurse.push(Spacebars.dot(value, id1));                                                         // 186
    argsForRecurse.push.apply(argsForRecurse,                                                               // 187
                              Array.prototype.slice.call(arguments, 2));                                    // 188
    return Spacebars.dot.apply(null, argsForRecurse);                                                       // 189
  }                                                                                                         // 190
                                                                                                            // 191
  if (typeof value === 'function')                                                                          // 192
    value = value();                                                                                        // 193
                                                                                                            // 194
  if (! value)                                                                                              // 195
    return value; // falsy, don't index, pass through                                                       // 196
                                                                                                            // 197
  var result = value[id1];                                                                                  // 198
  if (typeof result !== 'function')                                                                         // 199
    return result;                                                                                          // 200
  // `value[id1]` (or `value()[id1]`) is a function.                                                        // 201
  // Bind it so that when called, `value` will be placed in `this`.                                         // 202
  return function (/*arguments*/) {                                                                         // 203
    return result.apply(value, arguments);                                                                  // 204
  };                                                                                                        // 205
};                                                                                                          // 206
                                                                                                            // 207
// Implement Spacebars's #with, which renders its else case (or nothing)                                    // 208
// if the argument is falsy.                                                                                // 209
Spacebars.With = function (argFunc, contentBlock, elseContentBlock) {                                       // 210
  // UI.With emboxes argFunc, and then we want to be sure to only call                                      // 211
  // argFunc that way so we don't call it any extra times.                                                  // 212
  var w = UI.With(argFunc, contentBlock);                                                                   // 213
  return UI.If(w.data, w, elseContentBlock);                                                                // 214
};                                                                                                          // 215
                                                                                                            // 216
Spacebars.TemplateWith = function (argFunc, contentBlock) {                                                 // 217
  var w = UI.With(argFunc, contentBlock);                                                                   // 218
  w.__isTemplateWith = true;                                                                                // 219
  return w;                                                                                                 // 220
};                                                                                                          // 221
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.spacebars = {
  Spacebars: Spacebars
};

})();
