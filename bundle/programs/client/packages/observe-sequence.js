//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
//                                                                      //
// If you are using Chrome, open the Developer Tools and click the gear //
// icon in its lower right corner. In the General Settings panel, turn  //
// on 'Enable source maps'.                                             //
//                                                                      //
// If you are using Firefox 23, go to `about:config` and set the        //
// `devtools.debugger.source-maps-enabled` preference to true.          //
// (The preference should be on by default in Firefox 24; versions      //
// older than 23 do not support source maps.)                           //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Deps = Package.deps.Deps;
var LocalCollection = Package.minimongo.LocalCollection;
var Minimongo = Package.minimongo.Minimongo;

/* Package-scope variables */
var ObserveSequence, id;

(function () {

////////////////////////////////////////////////////////////////////////////////////
//                                                                                //
// packages/observe-sequence/observe_sequence.js                                  //
//                                                                                //
////////////////////////////////////////////////////////////////////////////////////
                                                                                  //
var warn;                                                                         // 1
if (typeof console !== 'undefined' && console.warn) {                             // 2
  warn = function () {                                                            // 3
    if (ObserveSequence._suppressWarnings) {                                      // 4
      ObserveSequence._suppressWarnings--;                                        // 5
    } else {                                                                      // 6
      console.warn.apply(console, arguments);                                     // 7
      ObserveSequence._loggedWarnings++;                                          // 8
    }                                                                             // 9
  };                                                                              // 10
} else {                                                                          // 11
  warn = function () {};                                                          // 12
}                                                                                 // 13
                                                                                  // 14
var idStringify = LocalCollection._idStringify;                                   // 15
var idParse = LocalCollection._idParse;                                           // 16
                                                                                  // 17
ObserveSequence = {                                                               // 18
  _suppressWarnings: 0,                                                           // 19
  _loggedWarnings: 0,                                                             // 20
                                                                                  // 21
  // A mechanism similar to cursor.observe which receives a reactive              // 22
  // function returning a sequence type and firing appropriate callbacks          // 23
  // when the value changes.                                                      // 24
  //                                                                              // 25
  // @param sequenceFunc {Function} a reactive function returning a               // 26
  //     sequence type. The currently supported sequence types are:               // 27
  //     'null', arrays and cursors.                                              // 28
  //                                                                              // 29
  // @param callbacks {Object} similar to a specific subset of                    // 30
  //     callbacks passed to `cursor.observe`                                     // 31
  //     (http://docs.meteor.com/#observe), with minor variations to              // 32
  //     support the fact that not all sequences contain objects with             // 33
  //     _id fields.  Specifically:                                               // 34
  //                                                                              // 35
  //     * addedAt(id, item, atIndex, beforeId)                                   // 36
  //     * changed(id, newItem, oldItem)                                          // 37
  //     * removed(id, oldItem)                                                   // 38
  //     * movedTo(id, item, fromIndex, toIndex, beforeId)                        // 39
  //                                                                              // 40
  // @returns {Object(stop: Function)} call 'stop' on the return value            // 41
  //     to stop observing this sequence function.                                // 42
  //                                                                              // 43
  // We don't make any assumptions about our ability to compare sequence          // 44
  // elements (ie, we don't assume EJSON.equals works; maybe there is extra       // 45
  // state/random methods on the objects) so unlike cursor.observe, we may        // 46
  // sometimes call changed() when nothing actually changed.                      // 47
  // XXX consider if we *can* make the stronger assumption and avoid              // 48
  //     no-op changed calls (in some cases?)                                     // 49
  //                                                                              // 50
  // XXX currently only supports the callbacks used by our                        // 51
  // implementation of {{#each}}, but this can be expanded.                       // 52
  //                                                                              // 53
  // XXX #each doesn't use the indices (though we'll eventually need              // 54
  // a way to get them when we support `@index`), but calling                     // 55
  // `cursor.observe` causes the index to be calculated on every                  // 56
  // callback using a linear scan (unless you turn it off by passing              // 57
  // `_no_indices`).  Any way to avoid calculating indices on a pure              // 58
  // cursor observe like we used to?                                              // 59
  observe: function (sequenceFunc, callbacks) {                                   // 60
    var lastSeq = null;                                                           // 61
    var activeObserveHandle = null;                                               // 62
                                                                                  // 63
    // 'lastSeqArray' contains the previous value of the sequence                 // 64
    // we're observing. It is an array of objects with '_id' and                  // 65
    // 'item' fields.  'item' is the element in the array, or the                 // 66
    // document in the cursor.                                                    // 67
    //                                                                            // 68
    // '_id' is whichever of the following is relevant, unless it has             // 69
    // already appeared -- in which case it's randomly generated.                 // 70
    //                                                                            // 71
    // * if 'item' is an object:                                                  // 72
    //   * an '_id' field, if present                                             // 73
    //   * otherwise, the index in the array                                      // 74
    //                                                                            // 75
    // * if 'item' is a number or string, use that value                          // 76
    //                                                                            // 77
    // XXX this can be generalized by allowing {{#each}} to accept a              // 78
    // general 'key' argument which could be a function, a dotted                 // 79
    // field name, or the special @index value.                                   // 80
    var lastSeqArray = []; // elements are objects of form {_id, item}            // 81
    var computation = Deps.autorun(function () {                                  // 82
      var seq = sequenceFunc();                                                   // 83
                                                                                  // 84
      Deps.nonreactive(function () {                                              // 85
        var seqArray; // same structure as `lastSeqArray` above.                  // 86
                                                                                  // 87
        // If we were previously observing a cursor, replace lastSeqArray with    // 88
        // more up-to-date information (specifically, the state of the observe    // 89
        // before it was stopped, which may be older than the DB).                // 90
        if (activeObserveHandle) {                                                // 91
          lastSeqArray = _.map(activeObserveHandle._fetch(), function (doc) {     // 92
            return {_id: doc._id, item: doc};                                     // 93
          });                                                                     // 94
          activeObserveHandle.stop();                                             // 95
          activeObserveHandle = null;                                             // 96
        }                                                                         // 97
                                                                                  // 98
        if (!seq) {                                                               // 99
          seqArray = [];                                                          // 100
          diffArray(lastSeqArray, seqArray, callbacks);                           // 101
        } else if (seq instanceof Array) {                                        // 102
          var idsUsed = {};                                                       // 103
          seqArray = _.map(seq, function (item, index) {                          // 104
            if (typeof item === 'string' ||                                       // 105
                typeof item === 'number' ||                                       // 106
                typeof item === 'boolean' ||                                      // 107
                item === undefined)                                               // 108
              id = item;                                                          // 109
            else if (typeof item === 'object')                                    // 110
              id = (item && item._id) || index;                                   // 111
            else                                                                  // 112
              throw new Error("unsupported type in {{#each}}: " + typeof item);   // 113
                                                                                  // 114
            var idString = idStringify(id);                                       // 115
            if (idsUsed[idString]) {                                              // 116
              warn("duplicate id " + id + " in", seq);                            // 117
              id = Random.id();                                                   // 118
            } else {                                                              // 119
              idsUsed[idString] = true;                                           // 120
            }                                                                     // 121
                                                                                  // 122
            return { _id: id, item: item };                                       // 123
          });                                                                     // 124
                                                                                  // 125
          diffArray(lastSeqArray, seqArray, callbacks);                           // 126
        } else if (isMinimongoCursor(seq)) {                                      // 127
          var cursor = seq;                                                       // 128
          seqArray = [];                                                          // 129
                                                                                  // 130
          var initial = true; // are we observing initial data from cursor?       // 131
          activeObserveHandle = cursor.observe({                                  // 132
            addedAt: function (document, atIndex, before) {                       // 133
              if (initial) {                                                      // 134
                // keep track of initial data so that we can diff once            // 135
                // we exit `observe`.                                             // 136
                if (before !== null)                                              // 137
                  throw new Error("Expected initial data from observe in order"); // 138
                seqArray.push({ _id: document._id, item: document });             // 139
              } else {                                                            // 140
                callbacks.addedAt(document._id, document, atIndex, before);       // 141
              }                                                                   // 142
            },                                                                    // 143
            changed: function (newDocument, oldDocument) {                        // 144
              callbacks.changed(newDocument._id, newDocument, oldDocument);       // 145
            },                                                                    // 146
            removed: function (oldDocument) {                                     // 147
              callbacks.removed(oldDocument._id, oldDocument);                    // 148
            },                                                                    // 149
            movedTo: function (document, fromIndex, toIndex, before) {            // 150
              callbacks.movedTo(                                                  // 151
                document._id, document, fromIndex, toIndex, before);              // 152
            }                                                                     // 153
          });                                                                     // 154
          initial = false;                                                        // 155
                                                                                  // 156
          // diff the old sequnce with initial data in the new cursor. this will  // 157
          // fire `addedAt` callbacks on the initial data.                        // 158
          diffArray(lastSeqArray, seqArray, callbacks);                           // 159
                                                                                  // 160
        } else {                                                                  // 161
          throw new Error("Not a recognized sequence type. Currently only " +     // 162
                          "arrays, cursors or falsey values accepted.");          // 163
        }                                                                         // 164
                                                                                  // 165
        lastSeq = seq;                                                            // 166
        lastSeqArray = seqArray;                                                  // 167
      });                                                                         // 168
    });                                                                           // 169
                                                                                  // 170
    return {                                                                      // 171
      stop: function () {                                                         // 172
        computation.stop();                                                       // 173
        if (activeObserveHandle)                                                  // 174
          activeObserveHandle.stop();                                             // 175
      }                                                                           // 176
    };                                                                            // 177
  },                                                                              // 178
                                                                                  // 179
  // Fetch the items of `seq` into an array, where `seq` is of one of the         // 180
  // sequence types accepted by `observe`.  If `seq` is a cursor, a               // 181
  // dependency is established.                                                   // 182
  fetch: function (seq) {                                                         // 183
    if (!seq) {                                                                   // 184
      return [];                                                                  // 185
    } else if (seq instanceof Array) {                                            // 186
      return seq;                                                                 // 187
    } else if (isMinimongoCursor(seq)) {                                          // 188
      return seq.fetch();                                                         // 189
    } else {                                                                      // 190
      throw new Error("Not a recognized sequence type. Currently only " +         // 191
                      "arrays, cursors or falsey values accepted.");              // 192
    }                                                                             // 193
  }                                                                               // 194
};                                                                                // 195
                                                                                  // 196
var isMinimongoCursor = function (seq) {                                          // 197
  var minimongo = Package.minimongo;                                              // 198
  return !!minimongo && (seq instanceof minimongo.LocalCollection.Cursor);        // 199
};                                                                                // 200
                                                                                  // 201
// Calculates the differences between `lastSeqArray` and                          // 202
// `seqArray` and calls appropriate functions from `callbacks`.                   // 203
// Reuses Minimongo's diff algorithm implementation.                              // 204
var diffArray = function (lastSeqArray, seqArray, callbacks) {                    // 205
  var diffFn = Package.minimongo.LocalCollection._diffQueryOrderedChanges;        // 206
  var oldIdObjects = [];                                                          // 207
  var newIdObjects = [];                                                          // 208
  var posOld = {}; // maps from idStringify'd ids                                 // 209
  var posNew = {}; // ditto                                                       // 210
                                                                                  // 211
  _.each(seqArray, function (doc, i) {                                            // 212
    newIdObjects.push(_.pick(doc, '_id'));                                        // 213
    posNew[idStringify(doc._id)] = i;                                             // 214
  });                                                                             // 215
  _.each(lastSeqArray, function (doc, i) {                                        // 216
    oldIdObjects.push(_.pick(doc, '_id'));                                        // 217
    posOld[idStringify(doc._id)] = i;                                             // 218
  });                                                                             // 219
                                                                                  // 220
  // Arrays can contain arbitrary objects. We don't diff the                      // 221
  // objects. Instead we always fire 'changed' callback on every                  // 222
  // object. The consumer of `observe-sequence` should deal with                  // 223
  // it appropriately.                                                            // 224
  diffFn(oldIdObjects, newIdObjects, {                                            // 225
    addedBefore: function (id, doc, before) {                                     // 226
      callbacks.addedAt(                                                          // 227
        id,                                                                       // 228
        seqArray[posNew[idStringify(id)]].item,                                   // 229
        posNew[idStringify(id)],                                                  // 230
        before);                                                                  // 231
    },                                                                            // 232
    movedBefore: function (id, before) {                                          // 233
      callbacks.movedTo(                                                          // 234
        id,                                                                       // 235
        seqArray[posNew[idStringify(id)]].item,                                   // 236
        posOld[idStringify(id)],                                                  // 237
        posNew[idStringify(id)],                                                  // 238
        before);                                                                  // 239
    },                                                                            // 240
    removed: function (id) {                                                      // 241
      callbacks.removed(                                                          // 242
        id,                                                                       // 243
        lastSeqArray[posOld[idStringify(id)]].item);                              // 244
    }                                                                             // 245
  });                                                                             // 246
                                                                                  // 247
  _.each(posNew, function (pos, idString) {                                       // 248
    var id = idParse(idString);                                                   // 249
    if (_.has(posOld, idString)) {                                                // 250
      // specifically for primitive types, compare equality before                // 251
      // firing the changed callback. otherwise, always fire it                   // 252
      // because doing a deep EJSON comparison is not guaranteed to               // 253
      // work (an array can contain arbitrary objects, and 'transform'            // 254
      // can be used on cursors). also, deep diffing is not                       // 255
      // necessarily the most efficient (if only a specific subfield              // 256
      // of the object is later accessed).                                        // 257
      var newItem = seqArray[pos].item;                                           // 258
      var oldItem = lastSeqArray[posOld[idString]].item;                          // 259
                                                                                  // 260
      if (typeof newItem === 'object' || newItem !== oldItem)                     // 261
        callbacks.changed(id, newItem, oldItem);                                  // 262
    }                                                                             // 263
  });                                                                             // 264
};                                                                                // 265
                                                                                  // 266
////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['observe-sequence'] = {
  ObserveSequence: ObserveSequence
};

})();

//# sourceMappingURL=a9897998fa9e65b3bad6c80a147a06e3b05f0eaa.map
