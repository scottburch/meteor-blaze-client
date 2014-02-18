(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;

/* Package-scope variables */
var HTML;

(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/htmljs/utils.js                                                                             //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
                                                                                                        // 1
HTML = {};                                                                                              // 2
                                                                                                        // 3
HTML.isNully = function (node) {                                                                        // 4
  if (node == null)                                                                                     // 5
    // null or undefined                                                                                // 6
    return true;                                                                                        // 7
                                                                                                        // 8
  if (node instanceof Array) {                                                                          // 9
    // is it an empty array or an array of all nully items?                                             // 10
    for (var i = 0; i < node.length; i++)                                                               // 11
      if (! HTML.isNully(node[i]))                                                                      // 12
        return false;                                                                                   // 13
    return true;                                                                                        // 14
  }                                                                                                     // 15
                                                                                                        // 16
  return false;                                                                                         // 17
};                                                                                                      // 18
                                                                                                        // 19
HTML.asciiLowerCase = function (str) {                                                                  // 20
  return str.replace(/[A-Z]/g, function (c) {                                                           // 21
    return String.fromCharCode(c.charCodeAt(0) + 32);                                                   // 22
  });                                                                                                   // 23
};                                                                                                      // 24
                                                                                                        // 25
HTML.escapeData = function (str) {                                                                      // 26
  // string; escape the two special chars in HTML data and RCDATA                                       // 27
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;');                                              // 28
};                                                                                                      // 29
                                                                                                        // 30
var svgCamelCaseAttributes = 'attributeName attributeType baseFrequency baseProfile calcMode clipPathUnits contentScriptType contentStyleType diffuseConstant edgeMode externalResourcesRequired filterRes filterUnits glyphRef glyphRef gradientTransform gradientTransform gradientUnits gradientUnits kernelMatrix kernelUnitLength kernelUnitLength kernelUnitLength keyPoints keySplines keyTimes lengthAdjust limitingConeAngle markerHeight markerUnits markerWidth maskContentUnits maskUnits numOctaves pathLength patternContentUnits patternTransform patternUnits pointsAtX pointsAtY pointsAtZ preserveAlpha preserveAspectRatio primitiveUnits refX refY repeatCount repeatDur requiredExtensions requiredFeatures specularConstant specularExponent specularExponent spreadMethod spreadMethod startOffset stdDeviation stitchTiles surfaceScale surfaceScale systemLanguage tableValues targetX targetY textLength textLength viewBox viewTarget xChannelSelector yChannelSelector zoomAndPan'.split(' ');
var svgCamelCaseElements = 'altGlyph altGlyphDef altGlyphItem animateColor animateMotion animateTransform clipPath feBlend feColorMatrix feComponentTransfer feComposite feConvolveMatrix feDiffuseLighting feDisplacementMap feDistantLight feFlood feFuncA feFuncB feFuncG feFuncR feGaussianBlur feImage feMerge feMergeNode feMorphology feOffset fePointLight feSpecularLighting feSpotLight feTile feTurbulence foreignObject glyphRef linearGradient radialGradient textPath vkern'.split(' ');
var svgCamelCaseAttributesMap = (function (map) {                                                       // 33
  for (var i = 0; i < svgCamelCaseAttributes.length; i++) {                                             // 34
    var a = svgCamelCaseAttributes[i];                                                                  // 35
    map[HTML.asciiLowerCase(a)] = a;                                                                    // 36
  }                                                                                                     // 37
  return map;                                                                                           // 38
})({});                                                                                                 // 39
var svgCamelCaseElementsMap = (function (map) {                                                         // 40
  for (var i = 0; i < svgCamelCaseElements.length; i++) {                                               // 41
    var e = svgCamelCaseElements[i];                                                                    // 42
    map[HTML.asciiLowerCase(e)] = e;                                                                    // 43
  }                                                                                                     // 44
  return map;                                                                                           // 45
})({});                                                                                                 // 46
                                                                                                        // 47
                                                                                                        // 48
// Take a tag name in any case and make it the proper case for HTML.                                    // 49
//                                                                                                      // 50
// Modern browsers let you embed SVG in HTML, but SVG elements are special                              // 51
// in that they have a case-sensitive DOM API (nodeName, getAttribute,                                  // 52
// setAttribute).  For example, it has to be `setAttribute("viewBox")`,                                 // 53
// not `"viewbox"`.  However, the HTML parser will fix the case for you,                                // 54
// so if you write `<svg viewbox="...">` you actually get a `"viewBox"`                                 // 55
// attribute.                                                                                           // 56
HTML.properCaseTagName = function (name) {                                                              // 57
  var lowered = HTML.asciiLowerCase(name);                                                              // 58
  return svgCamelCaseElementsMap.hasOwnProperty(lowered) ?                                              // 59
    svgCamelCaseElementsMap[lowered] : lowered;                                                         // 60
};                                                                                                      // 61
                                                                                                        // 62
// See docs for properCaseTagName.                                                                      // 63
HTML.properCaseAttributeName = function (name) {                                                        // 64
  var lowered = HTML.asciiLowerCase(name);                                                              // 65
  return svgCamelCaseAttributesMap.hasOwnProperty(lowered) ?                                            // 66
    svgCamelCaseAttributesMap[lowered] : lowered;                                                       // 67
};                                                                                                      // 68
                                                                                                        // 69
// The HTML spec and the DOM API (in particular `setAttribute`) have different                          // 70
// definitions of what characters are legal in an attribute.  The HTML                                  // 71
// parser is extremely permissive (allowing, for example, `<a %=%>`), while                             // 72
// `setAttribute` seems to use something like the XML grammar for names (and                            // 73
// throws an error if a name is invalid, making that attribute unsettable).                             // 74
// If we knew exactly what grammar browsers used for `setAttribute`, we could                           // 75
// include various Unicode ranges in what's legal.  For now, allow ASCII chars                          // 76
// that are known to be valid XML, valid HTML, and settable via `setAttribute`:                         // 77
//                                                                                                      // 78
// * Starts with `:`, `_`, `A-Z` or `a-z`                                                               // 79
// * Consists of any of those plus `-`, `.`, and `0-9`.                                                 // 80
//                                                                                                      // 81
// See <http://www.w3.org/TR/REC-xml/#NT-Name> and                                                      // 82
// <http://dev.w3.org/html5/markup/syntax.html#syntax-attributes>.                                      // 83
HTML.isValidAttributeName = function (name) {                                                           // 84
  return /^[:_A-Za-z][:_A-Za-z0-9.\-]*/.test(name);                                                     // 85
};                                                                                                      // 86
                                                                                                        // 87
                                                                                                        // 88
HTML.knownElementNames = 'a abbr acronym address applet area b base basefont bdo big blockquote body br button caption center cite code col colgroup dd del dfn dir div dl dt em fieldset font form frame frameset h1 h2 h3 h4 h5 h6 head hr html i iframe img input ins isindex kbd label legend li link map menu meta noframes noscript object ol optgroup option p param pre q s samp script select small span strike strong style sub sup table tbody td textarea tfoot th thead title tr tt u ul var article aside audio bdi canvas command data datagrid datalist details embed eventsource figcaption figure footer header hgroup keygen mark meter nav output progress ruby rp rt section source summary time track video wbr'.split(' ');
                                                                                                        // 90
HTML.voidElementNames = 'area base br col command embed hr img input keygen link meta param source track wbr'.split(' ');
                                                                                                        // 92
HTML.knownSVGElementNames = 'a altGlyph altGlyphDef altGlyphItem animate animateColor animateMotion animateTransform circle clipPath color-profile cursor defs desc ellipse feBlend feColorMatrix feComponentTransfer feComposite feConvolveMatrix feDiffuseLighting feDisplacementMap feDistantLight feFlood feFuncA feFuncB feFuncG feFuncR feGaussianBlur feImage feMerge feMergeNode feMorphology feOffset fePointLight feSpecularLighting feSpotLight feTile feTurbulence filter font font-face font-face-format font-face-name font-face-src font-face-uri foreignObject g glyph glyphRef hkern image line linearGradient marker mask metadata missing-glyph path pattern polygon polyline radialGradient rect script set stop style svg switch symbol text textPath title tref tspan use view vkern'.split(' ');
                                                                                                        // 94
var YES = {yes:true};                                                                                   // 95
var makeSet = function (array) {                                                                        // 96
  var set = {};                                                                                         // 97
  for (var i = 0; i < array.length; i++)                                                                // 98
    set[array[i]] = YES;                                                                                // 99
  return set;                                                                                           // 100
};                                                                                                      // 101
                                                                                                        // 102
var voidElementSet = makeSet(HTML.voidElementNames);                                                    // 103
var knownElementSet = makeSet(HTML.knownElementNames);                                                  // 104
var knownSVGElementSet = makeSet(HTML.knownSVGElementNames);                                            // 105
                                                                                                        // 106
HTML.isKnownElement = function (name) {                                                                 // 107
  return knownElementSet[HTML.properCaseTagName(name)] === YES;                                         // 108
};                                                                                                      // 109
                                                                                                        // 110
HTML.isVoidElement = function (name) {                                                                  // 111
  return voidElementSet[HTML.properCaseTagName(name)] === YES;                                          // 112
};                                                                                                      // 113
                                                                                                        // 114
HTML.isKnownSVGElement = function (name) {                                                              // 115
  return knownSVGElementSet[HTML.properCaseTagName(name)] === YES;                                      // 116
};                                                                                                      // 117
                                                                                                        // 118
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/htmljs/html.js                                                                              //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
                                                                                                        // 1
// Tag instances are `instanceof HTML.Tag`.                                                             // 2
//                                                                                                      // 3
// This is a private constructor.  Internally, we set                                                   // 4
// `HTML.P.prototype = new HTML.Tag("P")`.                                                              // 5
HTML.Tag = function (tagName) {                                                                         // 6
  this.tagName = tagName;                                                                               // 7
  this.attrs = null;                                                                                    // 8
  this.children = [];                                                                                   // 9
};                                                                                                      // 10
                                                                                                        // 11
// Call all functions and instantiate all components, when fine-grained                                 // 12
// reactivity is not needed (for example, in attributes).                                               // 13
HTML.evaluate = function (node, parentComponent) {                                                      // 14
  if (node == null) {                                                                                   // 15
    return node;                                                                                        // 16
  } else if (typeof node === 'function') {                                                              // 17
    return HTML.evaluate(node(), parentComponent);                                                      // 18
  } else if (node instanceof Array) {                                                                   // 19
    var result = [];                                                                                    // 20
    for (var i = 0; i < node.length; i++)                                                               // 21
      result.push(HTML.evaluate(node[i], parentComponent));                                             // 22
    return result;                                                                                      // 23
  } else if (typeof node.instantiate === 'function') {                                                  // 24
    // component                                                                                        // 25
    var instance = node.instantiate(parentComponent || null);                                           // 26
    var content = instance.render('STATIC');                                                            // 27
    return HTML.evaluate(content, instance);                                                            // 28
  }  else if (node instanceof HTML.Tag) {                                                               // 29
    var newChildren = [];                                                                               // 30
    for (var i = 0; i < node.children.length; i++)                                                      // 31
      newChildren.push(HTML.evaluate(node.children[i], parentComponent));                               // 32
    var newTag = HTML.getTag(node.tagName).apply(null, newChildren);                                    // 33
    newTag.attrs = {};                                                                                  // 34
    for (var k in node.attrs)                                                                           // 35
      newTag.attrs[k] = HTML.evaluate(node.attrs[k], parentComponent);                                  // 36
    return newTag;                                                                                      // 37
  } else {                                                                                              // 38
    return node;                                                                                        // 39
  }                                                                                                     // 40
};                                                                                                      // 41
                                                                                                        // 42
var extendAttrs = function (tgt, src, parentComponent) {                                                // 43
  for (var k in src) {                                                                                  // 44
    if (k === '$dynamic')                                                                               // 45
      continue;                                                                                         // 46
    if (! HTML.isValidAttributeName(k))                                                                 // 47
      throw new Error("Illegal HTML attribute name: " + k);                                             // 48
    var value = HTML.evaluate(src[k], parentComponent);                                                 // 49
    if (! HTML.isNully(value))                                                                          // 50
      tgt[k] = value;                                                                                   // 51
  }                                                                                                     // 52
};                                                                                                      // 53
                                                                                                        // 54
// Process the `attrs.$dynamic` directive, if present, returning the final                              // 55
// attributes dictionary.  The value of `attrs.$dynamic` must be an array                               // 56
// of attributes dictionaries or functions returning attribute dictionaries.                            // 57
// These attributes are used to extend `attrs` as long as they are non-nully.                           // 58
// All attributes are "evaluated," calling functions and instantiating                                  // 59
// components.                                                                                          // 60
HTML.evaluateAttributes = function (attrs, parentComponent) {                                           // 61
  if (! attrs)                                                                                          // 62
    return attrs;                                                                                       // 63
                                                                                                        // 64
  var result = {};                                                                                      // 65
  extendAttrs(result, attrs, parentComponent);                                                          // 66
                                                                                                        // 67
  if ('$dynamic' in attrs) {                                                                            // 68
    if (! (attrs.$dynamic instanceof Array))                                                            // 69
      throw new Error("$dynamic must be an array");                                                     // 70
    // iterate over attrs.$dynamic, calling each element if it                                          // 71
    // is a function and then using it to extend `result`.                                              // 72
    var dynamics = attrs.$dynamic;                                                                      // 73
    for (var i = 0; i < dynamics.length; i++) {                                                         // 74
      var moreAttrs = dynamics[i];                                                                      // 75
      if (typeof moreAttrs === 'function')                                                              // 76
        moreAttrs = moreAttrs();                                                                        // 77
      extendAttrs(result, moreAttrs, parentComponent);                                                  // 78
    }                                                                                                   // 79
  }                                                                                                     // 80
                                                                                                        // 81
  return result;                                                                                        // 82
};                                                                                                      // 83
                                                                                                        // 84
HTML.Tag.prototype.evaluateAttributes = function (parentComponent) {                                    // 85
  return HTML.evaluateAttributes(this.attrs, parentComponent);                                          // 86
};                                                                                                      // 87
                                                                                                        // 88
// Given "P" create the function `HTML.P`.                                                              // 89
var makeTagConstructor = function (tagName) {                                                           // 90
  // Do a little dance so that tags print nicely in the Chrome console.                                 // 91
  // First make tag name suitable for insertion into evaluated JS code,                                 // 92
  // for security reasons mainly.                                                                       // 93
  var sanitizedName = String(tagName).replace(                                                          // 94
      /^[^a-zA-Z_]|[^a-zA-Z_0-9]/g, '_') || 'Tag';                                                      // 95
                                                                                                        // 96
  // Generate a constructor function whose name is the tag name.                                        // 97
  // We try to choose generic-sounding variable names in case V8 infers                                 // 98
  // them as type names and they show up in the developer console.                                      // 99
  // HTMLTag is the constructor function for our specific tag type.                                     // 100
  var HTMLTag = (new Function(                                                                          // 101
    '_constructTag',                                                                                    // 102
    'var Tag; return (Tag = function ' +                                                                // 103
      sanitizedName + '_Tag(/*arguments*/) { ' +                                                        // 104
      'return _constructTag(Tag, this, arguments); });'))(_constructTag);                               // 105
                                                                                                        // 106
  HTMLTag.prototype = new HTML.Tag(tagName);                                                            // 107
  HTMLTag.prototype.constructor = HTMLTag;                                                              // 108
                                                                                                        // 109
  return HTMLTag;                                                                                       // 110
};                                                                                                      // 111
                                                                                                        // 112
// Given "P", create and assign `HTML.P` if it doesn't already exist.                                   // 113
// Then return it.                                                                                      // 114
HTML.getTag = function (tagName) {                                                                      // 115
  tagName = tagName.toUpperCase();                                                                      // 116
                                                                                                        // 117
  if (! HTML[tagName])                                                                                  // 118
    HTML[tagName] = makeTagConstructor(tagName);                                                        // 119
                                                                                                        // 120
  return HTML[tagName];                                                                                 // 121
};                                                                                                      // 122
                                                                                                        // 123
// Given "P", make sure `HTML.P` exists.                                                                // 124
HTML.ensureTag = function (tagName) {                                                                   // 125
  HTML.getTag(tagName); // don't return it                                                              // 126
};                                                                                                      // 127
                                                                                                        // 128
// When you call either `HTML.P(...)` or `new HTML.P(...)`,                                             // 129
// this function handles the actual implementation.                                                     // 130
var _constructTag = function (constructor, instance, args) {                                            // 131
  if (! (instance instanceof HTML.Tag)) {                                                               // 132
    // If you called `HTML.P(...)` without `new`, we don't actually                                     // 133
    // have an instance in `this`.  Create one by calling `new HTML.P`                                  // 134
    // with no arguments (which will invoke `_constructTag` reentrantly,                                // 135
    // but doing essentially nothing).                                                                  // 136
    instance = new constructor;                                                                         // 137
  }                                                                                                     // 138
                                                                                                        // 139
  var i = 0;                                                                                            // 140
  var attrs = (args.length && args[0]);                                                                 // 141
  if (attrs && (typeof attrs === 'object') &&                                                           // 142
      (attrs.constructor === Object)) {                                                                 // 143
    instance.attrs = attrs;                                                                             // 144
    i++;                                                                                                // 145
  }                                                                                                     // 146
  instance.children = Array.prototype.slice.call(args, i);                                              // 147
                                                                                                        // 148
  return instance;                                                                                      // 149
};                                                                                                      // 150
                                                                                                        // 151
HTML.CharRef = function (attrs) {                                                                       // 152
  if (! (this instanceof HTML.CharRef))                                                                 // 153
    // called without `new`                                                                             // 154
    return new HTML.CharRef(attrs);                                                                     // 155
                                                                                                        // 156
  if (! (attrs && attrs.html && attrs.str))                                                             // 157
    throw new Error(                                                                                    // 158
      "HTML.CharRef must be constructed with ({html:..., str:...})");                                   // 159
                                                                                                        // 160
  this.html = attrs.html;                                                                               // 161
  this.str = attrs.str;                                                                                 // 162
};                                                                                                      // 163
                                                                                                        // 164
HTML.Comment = function (value) {                                                                       // 165
  if (! (this instanceof HTML.Comment))                                                                 // 166
    // called without `new`                                                                             // 167
    return new HTML.Comment(value);                                                                     // 168
                                                                                                        // 169
  if (typeof value !== 'string')                                                                        // 170
    throw new Error('HTML.Comment must be constructed with a string');                                  // 171
                                                                                                        // 172
  this.value = value;                                                                                   // 173
  // Kill illegal hyphens in comment value (no way to escape them in HTML)                              // 174
  this.sanitizedValue = value.replace(/^-|--+|-$/g, '');                                                // 175
};                                                                                                      // 176
                                                                                                        // 177
HTML.Raw = function (value) {                                                                           // 178
  if (! (this instanceof HTML.Raw))                                                                     // 179
    // called without `new`                                                                             // 180
    return new HTML.Raw(value);                                                                         // 181
                                                                                                        // 182
  if (typeof value !== 'string')                                                                        // 183
    throw new Error('HTML.Raw must be constructed with a string');                                      // 184
                                                                                                        // 185
  this.value = value;                                                                                   // 186
};                                                                                                      // 187
                                                                                                        // 188
HTML.EmitCode = function (value) {                                                                      // 189
  if (! (this instanceof HTML.EmitCode))                                                                // 190
    // called without `new`                                                                             // 191
    return new HTML.EmitCode(value);                                                                    // 192
                                                                                                        // 193
  if (typeof value !== 'string')                                                                        // 194
    throw new Error('HTML.EmitCode must be constructed with a string');                                 // 195
                                                                                                        // 196
  this.value = value;                                                                                   // 197
};                                                                                                      // 198
                                                                                                        // 199
HTML.isTagEnsured = function (t) {                                                                      // 200
  return HTML.isKnownElement(t) || HTML.isKnownSVGElement(t);                                           // 201
};                                                                                                      // 202
                                                                                                        // 203
(function () {                                                                                          // 204
  for (var i = 0; i < HTML.knownElementNames.length; i++)                                               // 205
    HTML.ensureTag(HTML.knownElementNames[i]);                                                          // 206
                                                                                                        // 207
  for (var i = 0; i < HTML.knownSVGElementNames.length; i++)                                            // 208
    HTML.ensureTag(HTML.knownSVGElementNames[i]);                                                       // 209
})();                                                                                                   // 210
                                                                                                        // 211
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/htmljs/tohtml.js                                                                            //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
                                                                                                        // 1
HTML.toHTML = function (node, parentComponent) {                                                        // 2
  if (node == null) {                                                                                   // 3
    // null or undefined                                                                                // 4
    return '';                                                                                          // 5
  } else if ((typeof node === 'string') || (typeof node === 'boolean') || (typeof node === 'number')) { // 6
    // string; escape special chars                                                                     // 7
    return HTML.escapeData(String(node));                                                               // 8
  } else if (node instanceof Array) {                                                                   // 9
    // array                                                                                            // 10
    var parts = [];                                                                                     // 11
    for (var i = 0; i < node.length; i++)                                                               // 12
      parts.push(HTML.toHTML(node[i], parentComponent));                                                // 13
    return parts.join('');                                                                              // 14
  } else if (typeof node.instantiate === 'function') {                                                  // 15
    // component                                                                                        // 16
    var instance = node.instantiate(parentComponent || null);                                           // 17
    var content = instance.render('STATIC');                                                            // 18
    // recurse with a new value for parentComponent                                                     // 19
    return HTML.toHTML(content, instance);                                                              // 20
  } else if (typeof node === 'function') {                                                              // 21
    return HTML.toHTML(node(), parentComponent);                                                        // 22
  } else if (node.toHTML) {                                                                             // 23
    // Tag or something else                                                                            // 24
    return node.toHTML(parentComponent);                                                                // 25
  } else {                                                                                              // 26
    throw new Error("Expected tag, string, array, component, null, undefined, or " +                    // 27
                    "object with a toHTML method; found: " + node);                                     // 28
  }                                                                                                     // 29
};                                                                                                      // 30
                                                                                                        // 31
HTML.Comment.prototype.toHTML = function () {                                                           // 32
  return '<!--' + this.sanitizedValue + '-->';                                                          // 33
};                                                                                                      // 34
                                                                                                        // 35
HTML.CharRef.prototype.toHTML = function () {                                                           // 36
  return this.html;                                                                                     // 37
};                                                                                                      // 38
                                                                                                        // 39
HTML.Raw.prototype.toHTML = function () {                                                               // 40
  return this.value;                                                                                    // 41
};                                                                                                      // 42
                                                                                                        // 43
HTML.Tag.prototype.toHTML = function (parentComponent) {                                                // 44
  var attrStrs = [];                                                                                    // 45
  var attrs = this.evaluateAttributes(parentComponent);                                                 // 46
  if (attrs) {                                                                                          // 47
    for (var k in attrs) {                                                                              // 48
      k = HTML.properCaseAttributeName(k);                                                              // 49
      var v = HTML.toText(attrs[k], HTML.TEXTMODE.ATTRIBUTE, parentComponent);                          // 50
      attrStrs.push(' ' + k + '="' + v + '"');                                                          // 51
    }                                                                                                   // 52
  }                                                                                                     // 53
                                                                                                        // 54
  var tagName = this.tagName;                                                                           // 55
  var startTag = '<' + HTML.properCaseTagName(tagName) + attrStrs.join('') + '>';                       // 56
                                                                                                        // 57
  var childStrs = [];                                                                                   // 58
  var content;                                                                                          // 59
  if (tagName === 'TEXTAREA') {                                                                         // 60
    for (var i = 0; i < this.children.length; i++)                                                      // 61
      childStrs.push(HTML.toText(this.children[i], HTML.TEXTMODE.RCDATA, parentComponent));             // 62
                                                                                                        // 63
    content = childStrs.join('');                                                                       // 64
    if (content.slice(0, 1) === '\n')                                                                   // 65
      // TEXTAREA will absorb a newline, so if we see one, add                                          // 66
      // another one.                                                                                   // 67
      content = '\n' + content;                                                                         // 68
                                                                                                        // 69
  } else {                                                                                              // 70
    for (var i = 0; i < this.children.length; i++)                                                      // 71
      childStrs.push(HTML.toHTML(this.children[i], parentComponent));                                   // 72
                                                                                                        // 73
    content = childStrs.join('');                                                                       // 74
  }                                                                                                     // 75
                                                                                                        // 76
  var result = startTag + content;                                                                      // 77
                                                                                                        // 78
  if (this.children.length || ! HTML.isVoidElement(tagName)) {                                          // 79
    // "Void" elements like BR are the only ones that don't get a close                                 // 80
    // tag in HTML5.  They shouldn't have contents, either, so we could                                 // 81
    // throw an error upon seeing contents here.                                                        // 82
    result += '</' + HTML.properCaseTagName(tagName) + '>';                                             // 83
  }                                                                                                     // 84
                                                                                                        // 85
  return result;                                                                                        // 86
};                                                                                                      // 87
                                                                                                        // 88
HTML.TEXTMODE = {                                                                                       // 89
  ATTRIBUTE: 1,                                                                                         // 90
  RCDATA: 2,                                                                                            // 91
  STRING: 3                                                                                             // 92
};                                                                                                      // 93
                                                                                                        // 94
HTML.toText = function (node, textMode, parentComponent) {                                              // 95
  if (node == null) {                                                                                   // 96
    // null or undefined                                                                                // 97
    return '';                                                                                          // 98
  } else if ((typeof node === 'string') || (typeof node === 'boolean') || (typeof node === 'number')) { // 99
    node = String(node);                                                                                // 100
    // string                                                                                           // 101
    if (textMode === HTML.TEXTMODE.STRING) {                                                            // 102
      return node;                                                                                      // 103
    } else if (textMode === HTML.TEXTMODE.RCDATA) {                                                     // 104
      return HTML.escapeData(node);                                                                     // 105
    } else if (textMode === HTML.TEXTMODE.ATTRIBUTE) {                                                  // 106
      // escape `&` and `"` this time, not `&` and `<`                                                  // 107
      return node.replace(/&/g, '&amp;').replace(/"/g, '&quot;');                                       // 108
    } else {                                                                                            // 109
      throw new Error("Unknown TEXTMODE: " + textMode);                                                 // 110
    }                                                                                                   // 111
  } else if (node instanceof Array) {                                                                   // 112
    // array                                                                                            // 113
    var parts = [];                                                                                     // 114
    for (var i = 0; i < node.length; i++)                                                               // 115
      parts.push(HTML.toText(node[i], textMode, parentComponent));                                      // 116
    return parts.join('');                                                                              // 117
  } else if (typeof node === 'function') {                                                              // 118
    return HTML.toText(node(), textMode, parentComponent);                                              // 119
  } else if (typeof node.instantiate === 'function') {                                                  // 120
    // component                                                                                        // 121
    var instance = node.instantiate(parentComponent || null);                                           // 122
    var content = instance.render('STATIC');                                                            // 123
    return HTML.toText(content, textMode, instance);                                                    // 124
  } else if (node.toText) {                                                                             // 125
    // Something else                                                                                   // 126
    return node.toText(textMode, parentComponent);                                                      // 127
  } else {                                                                                              // 128
    throw new Error("Expected tag, string, array, component, null, undefined, or " +                    // 129
                    "object with a toText method; found: " + node);                                     // 130
  }                                                                                                     // 131
                                                                                                        // 132
};                                                                                                      // 133
                                                                                                        // 134
HTML.Raw.prototype.toText = function () {                                                               // 135
  return this.value;                                                                                    // 136
};                                                                                                      // 137
                                                                                                        // 138
// used when including templates within {{#markdown}}                                                   // 139
HTML.Tag.prototype.toText = function (textMode, parentComponent) {                                      // 140
  if (textMode === HTML.TEXTMODE.STRING)                                                                // 141
    // stringify the tag as HTML, then convert to text                                                  // 142
    return HTML.toText(this.toHTML(parentComponent), textMode);                                         // 143
  else                                                                                                  // 144
    throw new Error("Can't insert tags in attributes or TEXTAREA elements");                            // 145
};                                                                                                      // 146
                                                                                                        // 147
HTML.CharRef.prototype.toText = function (textMode) {                                                   // 148
  if (textMode === HTML.TEXTMODE.STRING)                                                                // 149
    return this.str;                                                                                    // 150
  else if (textMode === HTML.TEXTMODE.RCDATA)                                                           // 151
    return this.html;                                                                                   // 152
  else if (textMode === HTML.TEXTMODE.ATTRIBUTE)                                                        // 153
    return this.html;                                                                                   // 154
  else                                                                                                  // 155
    throw new Error("Unknown TEXTMODE: " + textMode);                                                   // 156
};                                                                                                      // 157
                                                                                                        // 158
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.htmljs = {
  HTML: HTML
};

})();
