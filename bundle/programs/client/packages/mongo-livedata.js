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
var Random = Package.random.Random;
var EJSON = Package.ejson.EJSON;
var JSON = Package.json.JSON;
var _ = Package.underscore._;
var LocalCollection = Package.minimongo.LocalCollection;
var Minimongo = Package.minimongo.Minimongo;
var Log = Package.logging.Log;
var DDP = Package.livedata.DDP;
var Deps = Package.deps.Deps;
var check = Package.check.check;
var Match = Package.check.Match;

/* Package-scope variables */
var LocalCollectionDriver;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// packages/mongo-livedata/local_collection_driver.js                                                  //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
LocalCollectionDriver = function () {                                                                  // 1
  var self = this;                                                                                     // 2
  self.noConnCollections = {};                                                                         // 3
};                                                                                                     // 4
                                                                                                       // 5
var ensureCollection = function (name, collections) {                                                  // 6
  if (!(name in collections))                                                                          // 7
    collections[name] = new LocalCollection({name: name});                                             // 8
  return collections[name];                                                                            // 9
};                                                                                                     // 10
                                                                                                       // 11
_.extend(LocalCollectionDriver.prototype, {                                                            // 12
  open: function (name, conn) {                                                                        // 13
    var self = this;                                                                                   // 14
    if (!name)                                                                                         // 15
      return new LocalCollection;                                                                      // 16
    if (! conn) {                                                                                      // 17
      return ensureCollection(name, self.noConnCollections);                                           // 18
    }                                                                                                  // 19
    if (! conn._mongo_livedata_collections)                                                            // 20
      conn._mongo_livedata_collections = {};                                                           // 21
    // XXX is there a way to keep track of a connection's collections without                          // 22
    // dangling it off the connection object?                                                          // 23
    return ensureCollection(name, conn._mongo_livedata_collections);                                   // 24
  }                                                                                                    // 25
});                                                                                                    // 26
                                                                                                       // 27
// singleton                                                                                           // 28
LocalCollectionDriver = new LocalCollectionDriver;                                                     // 29
                                                                                                       // 30
/////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// packages/mongo-livedata/collection.js                                                               //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
// options.connection, if given, is a LivedataClient or LivedataServer                                 // 1
// XXX presently there is no way to destroy/clean up a Collection                                      // 2
                                                                                                       // 3
Meteor.Collection = function (name, options) {                                                         // 4
  var self = this;                                                                                     // 5
  if (! (self instanceof Meteor.Collection))                                                           // 6
    throw new Error('use "new" to construct a Meteor.Collection');                                     // 7
  if (options && options.methods) {                                                                    // 8
    // Backwards compatibility hack with original signature (which passed                              // 9
    // "connection" directly instead of in options. (Connections must have a "methods"                 // 10
    // method.)                                                                                        // 11
    // XXX remove before 1.0                                                                           // 12
    options = {connection: options};                                                                   // 13
  }                                                                                                    // 14
  // Backwards compatibility: "connection" used to be called "manager".                                // 15
  if (options && options.manager && !options.connection) {                                             // 16
    options.connection = options.manager;                                                              // 17
  }                                                                                                    // 18
  options = _.extend({                                                                                 // 19
    connection: undefined,                                                                             // 20
    idGeneration: 'STRING',                                                                            // 21
    transform: null,                                                                                   // 22
    _driver: undefined,                                                                                // 23
    _preventAutopublish: false                                                                         // 24
  }, options);                                                                                         // 25
                                                                                                       // 26
  switch (options.idGeneration) {                                                                      // 27
  case 'MONGO':                                                                                        // 28
    self._makeNewID = function () {                                                                    // 29
      return new Meteor.Collection.ObjectID();                                                         // 30
    };                                                                                                 // 31
    break;                                                                                             // 32
  case 'STRING':                                                                                       // 33
  default:                                                                                             // 34
    self._makeNewID = function () {                                                                    // 35
      return Random.id();                                                                              // 36
    };                                                                                                 // 37
    break;                                                                                             // 38
  }                                                                                                    // 39
                                                                                                       // 40
  self._transform = LocalCollection.wrapTransform(options.transform);                                  // 41
                                                                                                       // 42
  if (!name && (name !== null)) {                                                                      // 43
    Meteor._debug("Warning: creating anonymous collection. It will not be " +                          // 44
                  "saved or synchronized over the network. (Pass null for " +                          // 45
                  "the collection name to turn off this warning.)");                                   // 46
  }                                                                                                    // 47
                                                                                                       // 48
  if (! name || options.connection === null)                                                           // 49
    // note: nameless collections never have a connection                                              // 50
    self._connection = null;                                                                           // 51
  else if (options.connection)                                                                         // 52
    self._connection = options.connection;                                                             // 53
  else if (Meteor.isClient)                                                                            // 54
    self._connection = Meteor.connection;                                                              // 55
  else                                                                                                 // 56
    self._connection = Meteor.server;                                                                  // 57
                                                                                                       // 58
  if (!options._driver) {                                                                              // 59
    if (name && self._connection === Meteor.server &&                                                  // 60
        typeof MongoInternals !== "undefined" &&                                                       // 61
        MongoInternals.defaultRemoteCollectionDriver) {                                                // 62
      options._driver = MongoInternals.defaultRemoteCollectionDriver();                                // 63
    } else {                                                                                           // 64
      options._driver = LocalCollectionDriver;                                                         // 65
    }                                                                                                  // 66
  }                                                                                                    // 67
                                                                                                       // 68
  self._collection = options._driver.open(name, self._connection);                                     // 69
  self._name = name;                                                                                   // 70
                                                                                                       // 71
  if (self._connection && self._connection.registerStore) {                                            // 72
    // OK, we're going to be a slave, replicating some remote                                          // 73
    // database, except possibly with some temporary divergence while                                  // 74
    // we have unacknowledged RPC's.                                                                   // 75
    var ok = self._connection.registerStore(name, {                                                    // 76
      // Called at the beginning of a batch of updates. batchSize is the number                        // 77
      // of update calls to expect.                                                                    // 78
      //                                                                                               // 79
      // XXX This interface is pretty janky. reset probably ought to go back to                        // 80
      // being its own function, and callers shouldn't have to calculate                               // 81
      // batchSize. The optimization of not calling pause/remove should be                             // 82
      // delayed until later: the first call to update() should buffer its                             // 83
      // message, and then we can either directly apply it at endUpdate time if                        // 84
      // it was the only update, or do pauseObservers/apply/apply at the next                          // 85
      // update() if there's another one.                                                              // 86
      beginUpdate: function (batchSize, reset) {                                                       // 87
        // pause observers so users don't see flicker when updating several                            // 88
        // objects at once (including the post-reconnect reset-and-reapply                             // 89
        // stage), and so that a re-sorting of a query can take advantage of the                       // 90
        // full _diffQuery moved calculation instead of applying change one at a                       // 91
        // time.                                                                                       // 92
        if (batchSize > 1 || reset)                                                                    // 93
          self._collection.pauseObservers();                                                           // 94
                                                                                                       // 95
        if (reset)                                                                                     // 96
          self._collection.remove({});                                                                 // 97
      },                                                                                               // 98
                                                                                                       // 99
      // Apply an update.                                                                              // 100
      // XXX better specify this interface (not in terms of a wire message)?                           // 101
      update: function (msg) {                                                                         // 102
        var mongoId = LocalCollection._idParse(msg.id);                                                // 103
        var doc = self._collection.findOne(mongoId);                                                   // 104
                                                                                                       // 105
        // Is this a "replace the whole doc" message coming from the quiescence                        // 106
        // of method writes to an object? (Note that 'undefined' is a valid                            // 107
        // value meaning "remove it".)                                                                 // 108
        if (msg.msg === 'replace') {                                                                   // 109
          var replace = msg.replace;                                                                   // 110
          if (!replace) {                                                                              // 111
            if (doc)                                                                                   // 112
              self._collection.remove(mongoId);                                                        // 113
          } else if (!doc) {                                                                           // 114
            self._collection.insert(replace);                                                          // 115
          } else {                                                                                     // 116
            // XXX check that replace has no $ ops                                                     // 117
            self._collection.update(mongoId, replace);                                                 // 118
          }                                                                                            // 119
          return;                                                                                      // 120
        } else if (msg.msg === 'added') {                                                              // 121
          if (doc) {                                                                                   // 122
            throw new Error("Expected not to find a document already present for an add");             // 123
          }                                                                                            // 124
          self._collection.insert(_.extend({_id: mongoId}, msg.fields));                               // 125
        } else if (msg.msg === 'removed') {                                                            // 126
          if (!doc)                                                                                    // 127
            throw new Error("Expected to find a document already present for removed");                // 128
          self._collection.remove(mongoId);                                                            // 129
        } else if (msg.msg === 'changed') {                                                            // 130
          if (!doc)                                                                                    // 131
            throw new Error("Expected to find a document to change");                                  // 132
          if (!_.isEmpty(msg.fields)) {                                                                // 133
            var modifier = {};                                                                         // 134
            _.each(msg.fields, function (value, key) {                                                 // 135
              if (value === undefined) {                                                               // 136
                if (!modifier.$unset)                                                                  // 137
                  modifier.$unset = {};                                                                // 138
                modifier.$unset[key] = 1;                                                              // 139
              } else {                                                                                 // 140
                if (!modifier.$set)                                                                    // 141
                  modifier.$set = {};                                                                  // 142
                modifier.$set[key] = value;                                                            // 143
              }                                                                                        // 144
            });                                                                                        // 145
            self._collection.update(mongoId, modifier);                                                // 146
          }                                                                                            // 147
        } else {                                                                                       // 148
          throw new Error("I don't know how to deal with this message");                               // 149
        }                                                                                              // 150
                                                                                                       // 151
      },                                                                                               // 152
                                                                                                       // 153
      // Called at the end of a batch of updates.                                                      // 154
      endUpdate: function () {                                                                         // 155
        self._collection.resumeObservers();                                                            // 156
      },                                                                                               // 157
                                                                                                       // 158
      // Called around method stub invocations to capture the original versions                        // 159
      // of modified documents.                                                                        // 160
      saveOriginals: function () {                                                                     // 161
        self._collection.saveOriginals();                                                              // 162
      },                                                                                               // 163
      retrieveOriginals: function () {                                                                 // 164
        return self._collection.retrieveOriginals();                                                   // 165
      }                                                                                                // 166
    });                                                                                                // 167
                                                                                                       // 168
    if (!ok)                                                                                           // 169
      throw new Error("There is already a collection named '" + name + "'");                           // 170
  }                                                                                                    // 171
                                                                                                       // 172
  self._defineMutationMethods();                                                                       // 173
                                                                                                       // 174
  // autopublish                                                                                       // 175
  if (Package.autopublish && !options._preventAutopublish && self._connection                          // 176
      && self._connection.publish) {                                                                   // 177
    self._connection.publish(null, function () {                                                       // 178
      return self.find();                                                                              // 179
    }, {is_auto: true});                                                                               // 180
  }                                                                                                    // 181
};                                                                                                     // 182
                                                                                                       // 183
///                                                                                                    // 184
/// Main collection API                                                                                // 185
///                                                                                                    // 186
                                                                                                       // 187
                                                                                                       // 188
_.extend(Meteor.Collection.prototype, {                                                                // 189
                                                                                                       // 190
  _getFindSelector: function (args) {                                                                  // 191
    if (args.length == 0)                                                                              // 192
      return {};                                                                                       // 193
    else                                                                                               // 194
      return args[0];                                                                                  // 195
  },                                                                                                   // 196
                                                                                                       // 197
  _getFindOptions: function (args) {                                                                   // 198
    var self = this;                                                                                   // 199
    if (args.length < 2) {                                                                             // 200
      return { transform: self._transform };                                                           // 201
    } else {                                                                                           // 202
      return _.extend({                                                                                // 203
        transform: self._transform                                                                     // 204
      }, args[1]);                                                                                     // 205
    }                                                                                                  // 206
  },                                                                                                   // 207
                                                                                                       // 208
  find: function (/* selector, options */) {                                                           // 209
    // Collection.find() (return all docs) behaves differently                                         // 210
    // from Collection.find(undefined) (return 0 docs).  so be                                         // 211
    // careful about the length of arguments.                                                          // 212
    var self = this;                                                                                   // 213
    var argArray = _.toArray(arguments);                                                               // 214
    return self._collection.find(self._getFindSelector(argArray),                                      // 215
                                 self._getFindOptions(argArray));                                      // 216
  },                                                                                                   // 217
                                                                                                       // 218
  findOne: function (/* selector, options */) {                                                        // 219
    var self = this;                                                                                   // 220
    var argArray = _.toArray(arguments);                                                               // 221
    return self._collection.findOne(self._getFindSelector(argArray),                                   // 222
                                    self._getFindOptions(argArray));                                   // 223
  }                                                                                                    // 224
                                                                                                       // 225
});                                                                                                    // 226
                                                                                                       // 227
Meteor.Collection._publishCursor = function (cursor, sub, collection) {                                // 228
  var observeHandle = cursor.observeChanges({                                                          // 229
    added: function (id, fields) {                                                                     // 230
      sub.added(collection, id, fields);                                                               // 231
    },                                                                                                 // 232
    changed: function (id, fields) {                                                                   // 233
      sub.changed(collection, id, fields);                                                             // 234
    },                                                                                                 // 235
    removed: function (id) {                                                                           // 236
      sub.removed(collection, id);                                                                     // 237
    }                                                                                                  // 238
  });                                                                                                  // 239
                                                                                                       // 240
  // We don't call sub.ready() here: it gets called in livedata_server, after                          // 241
  // possibly calling _publishCursor on multiple returned cursors.                                     // 242
                                                                                                       // 243
  // register stop callback (expects lambda w/ no args).                                               // 244
  sub.onStop(function () {observeHandle.stop();});                                                     // 245
};                                                                                                     // 246
                                                                                                       // 247
// protect against dangerous selectors.  falsey and {_id: falsey} are both                             // 248
// likely programmer error, and not what you want, particularly for destructive                        // 249
// operations.  JS regexps don't serialize over DDP but can be trivially                               // 250
// replaced by $regex.                                                                                 // 251
Meteor.Collection._rewriteSelector = function (selector) {                                             // 252
  // shorthand -- scalars match _id                                                                    // 253
  if (LocalCollection._selectorIsId(selector))                                                         // 254
    selector = {_id: selector};                                                                        // 255
                                                                                                       // 256
  if (!selector || (('_id' in selector) && !selector._id))                                             // 257
    // can't match anything                                                                            // 258
    return {_id: Random.id()};                                                                         // 259
                                                                                                       // 260
  var ret = {};                                                                                        // 261
  _.each(selector, function (value, key) {                                                             // 262
    // Mongo supports both {field: /foo/} and {field: {$regex: /foo/}}                                 // 263
    if (value instanceof RegExp) {                                                                     // 264
      ret[key] = convertRegexpToMongoSelector(value);                                                  // 265
    } else if (value && value.$regex instanceof RegExp) {                                              // 266
      ret[key] = convertRegexpToMongoSelector(value.$regex);                                           // 267
      // if value is {$regex: /foo/, $options: ...} then $options                                      // 268
      // override the ones set on $regex.                                                              // 269
      if (value.$options !== undefined)                                                                // 270
        ret[key].$options = value.$options;                                                            // 271
    }                                                                                                  // 272
    else if (_.contains(['$or','$and','$nor'], key)) {                                                 // 273
      // Translate lower levels of $and/$or/$nor                                                       // 274
      ret[key] = _.map(value, function (v) {                                                           // 275
        return Meteor.Collection._rewriteSelector(v);                                                  // 276
      });                                                                                              // 277
    } else {                                                                                           // 278
      ret[key] = value;                                                                                // 279
    }                                                                                                  // 280
  });                                                                                                  // 281
  return ret;                                                                                          // 282
};                                                                                                     // 283
                                                                                                       // 284
// convert a JS RegExp object to a Mongo {$regex: ..., $options: ...}                                  // 285
// selector                                                                                            // 286
var convertRegexpToMongoSelector = function (regexp) {                                                 // 287
  check(regexp, RegExp); // safety belt                                                                // 288
                                                                                                       // 289
  var selector = {$regex: regexp.source};                                                              // 290
  var regexOptions = '';                                                                               // 291
  // JS RegExp objects support 'i', 'm', and 'g'. Mongo regex $options                                 // 292
  // support 'i', 'm', 'x', and 's'. So we support 'i' and 'm' here.                                   // 293
  if (regexp.ignoreCase)                                                                               // 294
    regexOptions += 'i';                                                                               // 295
  if (regexp.multiline)                                                                                // 296
    regexOptions += 'm';                                                                               // 297
  if (regexOptions)                                                                                    // 298
    selector.$options = regexOptions;                                                                  // 299
                                                                                                       // 300
  return selector;                                                                                     // 301
};                                                                                                     // 302
                                                                                                       // 303
var throwIfSelectorIsNotId = function (selector, methodName) {                                         // 304
  if (!LocalCollection._selectorIsIdPerhapsAsObject(selector)) {                                       // 305
    throw new Meteor.Error(                                                                            // 306
      403, "Not permitted. Untrusted code may only " + methodName +                                    // 307
        " documents by ID.");                                                                          // 308
  }                                                                                                    // 309
};                                                                                                     // 310
                                                                                                       // 311
// 'insert' immediately returns the inserted document's new _id.                                       // 312
// The others return values immediately if you are in a stub, an in-memory                             // 313
// unmanaged collection, or a mongo-backed collection and you don't pass a                             // 314
// callback. 'update' and 'remove' return the number of affected                                       // 315
// documents. 'upsert' returns an object with keys 'numberAffected' and, if an                         // 316
// insert happened, 'insertedId'.                                                                      // 317
//                                                                                                     // 318
// Otherwise, the semantics are exactly like other methods: they take                                  // 319
// a callback as an optional last argument; if no callback is                                          // 320
// provided, they block until the operation is complete, and throw an                                  // 321
// exception if it fails; if a callback is provided, then they don't                                   // 322
// necessarily block, and they call the callback when they finish with error and                       // 323
// result arguments.  (The insert method provides the document ID as its result;                       // 324
// update and remove provide the number of affected docs as the result; upsert                         // 325
// provides an object with numberAffected and maybe insertedId.)                                       // 326
//                                                                                                     // 327
// On the client, blocking is impossible, so if a callback                                             // 328
// isn't provided, they just return immediately and any error                                          // 329
// information is lost.                                                                                // 330
//                                                                                                     // 331
// There's one more tweak. On the client, if you don't provide a                                       // 332
// callback, then if there is an error, a message will be logged with                                  // 333
// Meteor._debug.                                                                                      // 334
//                                                                                                     // 335
// The intent (though this is actually determined by the underlying                                    // 336
// drivers) is that the operations should be done synchronously, not                                   // 337
// generating their result until the database has acknowledged                                         // 338
// them. In the future maybe we should provide a flag to turn this                                     // 339
// off.                                                                                                // 340
_.each(["insert", "update", "remove"], function (name) {                                               // 341
  Meteor.Collection.prototype[name] = function (/* arguments */) {                                     // 342
    var self = this;                                                                                   // 343
    var args = _.toArray(arguments);                                                                   // 344
    var callback;                                                                                      // 345
    var insertId;                                                                                      // 346
    var ret;                                                                                           // 347
                                                                                                       // 348
    if (args.length && args[args.length - 1] instanceof Function)                                      // 349
      callback = args.pop();                                                                           // 350
                                                                                                       // 351
    if (name === "insert") {                                                                           // 352
      if (!args.length)                                                                                // 353
        throw new Error("insert requires an argument");                                                // 354
      // shallow-copy the document and generate an ID                                                  // 355
      args[0] = _.extend({}, args[0]);                                                                 // 356
      if ('_id' in args[0]) {                                                                          // 357
        insertId = args[0]._id;                                                                        // 358
        if (!insertId || !(typeof insertId === 'string'                                                // 359
              || insertId instanceof Meteor.Collection.ObjectID))                                      // 360
          throw new Error("Meteor requires document _id fields to be non-empty strings or ObjectIDs"); // 361
      } else {                                                                                         // 362
        insertId = args[0]._id = self._makeNewID();                                                    // 363
      }                                                                                                // 364
    } else {                                                                                           // 365
      args[0] = Meteor.Collection._rewriteSelector(args[0]);                                           // 366
                                                                                                       // 367
      if (name === "update") {                                                                         // 368
        // Mutate args but copy the original options object. We need to add                            // 369
        // insertedId to options, but don't want to mutate the caller's options                        // 370
        // object. We need to mutate `args` because we pass `args` into the                            // 371
        // driver below.                                                                               // 372
        var options = args[2] = _.clone(args[2]) || {};                                                // 373
        if (options && typeof options !== "function" && options.upsert) {                              // 374
          // set `insertedId` if absent.  `insertedId` is a Meteor extension.                          // 375
          if (options.insertedId) {                                                                    // 376
            if (!(typeof options.insertedId === 'string'                                               // 377
                  || options.insertedId instanceof Meteor.Collection.ObjectID))                        // 378
              throw new Error("insertedId must be string or ObjectID");                                // 379
          } else {                                                                                     // 380
            options.insertedId = self._makeNewID();                                                    // 381
          }                                                                                            // 382
        }                                                                                              // 383
      }                                                                                                // 384
    }                                                                                                  // 385
                                                                                                       // 386
    // On inserts, always return the id that we generated; on all other                                // 387
    // operations, just return the result from the collection.                                         // 388
    var chooseReturnValueFromCollectionResult = function (result) {                                    // 389
      if (name === "insert")                                                                           // 390
        return insertId;                                                                               // 391
      else                                                                                             // 392
        return result;                                                                                 // 393
    };                                                                                                 // 394
                                                                                                       // 395
    var wrappedCallback;                                                                               // 396
    if (callback) {                                                                                    // 397
      wrappedCallback = function (error, result) {                                                     // 398
        callback(error, ! error && chooseReturnValueFromCollectionResult(result));                     // 399
      };                                                                                               // 400
    }                                                                                                  // 401
                                                                                                       // 402
    if (self._connection && self._connection !== Meteor.server) {                                      // 403
      // just remote to another endpoint, propagate return value or                                    // 404
      // exception.                                                                                    // 405
                                                                                                       // 406
      var enclosing = DDP._CurrentInvocation.get();                                                    // 407
      var alreadyInSimulation = enclosing && enclosing.isSimulation;                                   // 408
                                                                                                       // 409
      if (Meteor.isClient && !wrappedCallback && ! alreadyInSimulation) {                              // 410
        // Client can't block, so it can't report errors by exception,                                 // 411
        // only by callback. If they forget the callback, give them a                                  // 412
        // default one that logs the error, so they aren't totally                                     // 413
        // baffled if their writes don't work because their database is                                // 414
        // down.                                                                                       // 415
        // Don't give a default callback in simulation, because inside stubs we                        // 416
        // want to return the results from the local collection immediately and                        // 417
        // not force a callback.                                                                       // 418
        wrappedCallback = function (err) {                                                             // 419
          if (err)                                                                                     // 420
            Meteor._debug(name + " failed: " + (err.reason || err.stack));                             // 421
        };                                                                                             // 422
      }                                                                                                // 423
                                                                                                       // 424
      if (!alreadyInSimulation && name !== "insert") {                                                 // 425
        // If we're about to actually send an RPC, we should throw an error if                         // 426
        // this is a non-ID selector, because the mutation methods only allow                          // 427
        // single-ID selectors. (If we don't throw here, we'll see flicker.)                           // 428
        throwIfSelectorIsNotId(args[0], name);                                                         // 429
      }                                                                                                // 430
                                                                                                       // 431
      ret = chooseReturnValueFromCollectionResult(                                                     // 432
        self._connection.apply(self._prefix + name, args, wrappedCallback)                             // 433
      );                                                                                               // 434
                                                                                                       // 435
    } else {                                                                                           // 436
      // it's my collection.  descend into the collection object                                       // 437
      // and propagate any exception.                                                                  // 438
      args.push(wrappedCallback);                                                                      // 439
      try {                                                                                            // 440
        // If the user provided a callback and the collection implements this                          // 441
        // operation asynchronously, then queryRet will be undefined, and the                          // 442
        // result will be returned through the callback instead.                                       // 443
        var queryRet = self._collection[name].apply(self._collection, args);                           // 444
        ret = chooseReturnValueFromCollectionResult(queryRet);                                         // 445
      } catch (e) {                                                                                    // 446
        if (callback) {                                                                                // 447
          callback(e);                                                                                 // 448
          return null;                                                                                 // 449
        }                                                                                              // 450
        throw e;                                                                                       // 451
      }                                                                                                // 452
    }                                                                                                  // 453
                                                                                                       // 454
    // both sync and async, unless we threw an exception, return ret                                   // 455
    // (new document ID for insert, num affected for update/remove, object with                        // 456
    // numberAffected and maybe insertedId for upsert).                                                // 457
    return ret;                                                                                        // 458
  };                                                                                                   // 459
});                                                                                                    // 460
                                                                                                       // 461
Meteor.Collection.prototype.upsert = function (selector, modifier,                                     // 462
                                               options, callback) {                                    // 463
  var self = this;                                                                                     // 464
  if (! callback && typeof options === "function") {                                                   // 465
    callback = options;                                                                                // 466
    options = {};                                                                                      // 467
  }                                                                                                    // 468
  return self.update(selector, modifier,                                                               // 469
              _.extend({}, options, { _returnObject: true, upsert: true }),                            // 470
              callback);                                                                               // 471
};                                                                                                     // 472
                                                                                                       // 473
// We'll actually design an index API later. For now, we just pass through to                          // 474
// Mongo's, but make it synchronous.                                                                   // 475
Meteor.Collection.prototype._ensureIndex = function (index, options) {                                 // 476
  var self = this;                                                                                     // 477
  if (!self._collection._ensureIndex)                                                                  // 478
    throw new Error("Can only call _ensureIndex on server collections");                               // 479
  self._collection._ensureIndex(index, options);                                                       // 480
};                                                                                                     // 481
Meteor.Collection.prototype._dropIndex = function (index) {                                            // 482
  var self = this;                                                                                     // 483
  if (!self._collection._dropIndex)                                                                    // 484
    throw new Error("Can only call _dropIndex on server collections");                                 // 485
  self._collection._dropIndex(index);                                                                  // 486
};                                                                                                     // 487
Meteor.Collection.prototype._dropCollection = function () {                                            // 488
  var self = this;                                                                                     // 489
  if (!self._collection.dropCollection)                                                                // 490
    throw new Error("Can only call _dropCollection on server collections");                            // 491
  self._collection.dropCollection();                                                                   // 492
};                                                                                                     // 493
Meteor.Collection.prototype._createCappedCollection = function (byteSize) {                            // 494
  var self = this;                                                                                     // 495
  if (!self._collection._createCappedCollection)                                                       // 496
    throw new Error("Can only call _createCappedCollection on server collections");                    // 497
  self._collection._createCappedCollection(byteSize);                                                  // 498
};                                                                                                     // 499
                                                                                                       // 500
Meteor.Collection.ObjectID = LocalCollection._ObjectID;                                                // 501
                                                                                                       // 502
///                                                                                                    // 503
/// Remote methods and access control.                                                                 // 504
///                                                                                                    // 505
                                                                                                       // 506
// Restrict default mutators on collection. allow() and deny() take the                                // 507
// same options:                                                                                       // 508
//                                                                                                     // 509
// options.insert {Function(userId, doc)}                                                              // 510
//   return true to allow/deny adding this document                                                    // 511
//                                                                                                     // 512
// options.update {Function(userId, docs, fields, modifier)}                                           // 513
//   return true to allow/deny updating these documents.                                               // 514
//   `fields` is passed as an array of fields that are to be modified                                  // 515
//                                                                                                     // 516
// options.remove {Function(userId, docs)}                                                             // 517
//   return true to allow/deny removing these documents                                                // 518
//                                                                                                     // 519
// options.fetch {Array}                                                                               // 520
//   Fields to fetch for these validators. If any call to allow or deny                                // 521
//   does not have this option then all fields are loaded.                                             // 522
//                                                                                                     // 523
// allow and deny can be called multiple times. The validators are                                     // 524
// evaluated as follows:                                                                               // 525
// - If neither deny() nor allow() has been called on the collection,                                  // 526
//   then the request is allowed if and only if the "insecure" smart                                   // 527
//   package is in use.                                                                                // 528
// - Otherwise, if any deny() function returns true, the request is denied.                            // 529
// - Otherwise, if any allow() function returns true, the request is allowed.                          // 530
// - Otherwise, the request is denied.                                                                 // 531
//                                                                                                     // 532
// Meteor may call your deny() and allow() functions in any order, and may not                         // 533
// call all of them if it is able to make a decision without calling them all                          // 534
// (so don't include side effects).                                                                    // 535
                                                                                                       // 536
(function () {                                                                                         // 537
  var addValidator = function(allowOrDeny, options) {                                                  // 538
    // validate keys                                                                                   // 539
    var VALID_KEYS = ['insert', 'update', 'remove', 'fetch', 'transform'];                             // 540
    _.each(_.keys(options), function (key) {                                                           // 541
      if (!_.contains(VALID_KEYS, key))                                                                // 542
        throw new Error(allowOrDeny + ": Invalid key: " + key);                                        // 543
    });                                                                                                // 544
                                                                                                       // 545
    var self = this;                                                                                   // 546
    self._restricted = true;                                                                           // 547
                                                                                                       // 548
    _.each(['insert', 'update', 'remove'], function (name) {                                           // 549
      if (options[name]) {                                                                             // 550
        if (!(options[name] instanceof Function)) {                                                    // 551
          throw new Error(allowOrDeny + ": Value for `" + name + "` must be a function");              // 552
        }                                                                                              // 553
                                                                                                       // 554
        // If the transform is specified at all (including as 'null') in this                          // 555
        // call, then take that; otherwise, take the transform from the                                // 556
        // collection.                                                                                 // 557
        if (options.transform === undefined) {                                                         // 558
          options[name].transform = self._transform;  // already wrapped                               // 559
        } else {                                                                                       // 560
          options[name].transform = LocalCollection.wrapTransform(                                     // 561
            options.transform);                                                                        // 562
        }                                                                                              // 563
                                                                                                       // 564
        self._validators[name][allowOrDeny].push(options[name]);                                       // 565
      }                                                                                                // 566
    });                                                                                                // 567
                                                                                                       // 568
    // Only update the fetch fields if we're passed things that affect                                 // 569
    // fetching. This way allow({}) and allow({insert: f}) don't result in                             // 570
    // setting fetchAllFields                                                                          // 571
    if (options.update || options.remove || options.fetch) {                                           // 572
      if (options.fetch && !(options.fetch instanceof Array)) {                                        // 573
        throw new Error(allowOrDeny + ": Value for `fetch` must be an array");                         // 574
      }                                                                                                // 575
      self._updateFetch(options.fetch);                                                                // 576
    }                                                                                                  // 577
  };                                                                                                   // 578
                                                                                                       // 579
  Meteor.Collection.prototype.allow = function(options) {                                              // 580
    addValidator.call(this, 'allow', options);                                                         // 581
  };                                                                                                   // 582
  Meteor.Collection.prototype.deny = function(options) {                                               // 583
    addValidator.call(this, 'deny', options);                                                          // 584
  };                                                                                                   // 585
})();                                                                                                  // 586
                                                                                                       // 587
                                                                                                       // 588
Meteor.Collection.prototype._defineMutationMethods = function() {                                      // 589
  var self = this;                                                                                     // 590
                                                                                                       // 591
  // set to true once we call any allow or deny methods. If true, use                                  // 592
  // allow/deny semantics. If false, use insecure mode semantics.                                      // 593
  self._restricted = false;                                                                            // 594
                                                                                                       // 595
  // Insecure mode (default to allowing writes). Defaults to 'undefined' which                         // 596
  // means insecure iff the insecure package is loaded. This property can be                           // 597
  // overriden by tests or packages wishing to change insecure mode behavior of                        // 598
  // their collections.                                                                                // 599
  self._insecure = undefined;                                                                          // 600
                                                                                                       // 601
  self._validators = {                                                                                 // 602
    insert: {allow: [], deny: []},                                                                     // 603
    update: {allow: [], deny: []},                                                                     // 604
    remove: {allow: [], deny: []},                                                                     // 605
    upsert: {allow: [], deny: []}, // dummy arrays; can't set these!                                   // 606
    fetch: [],                                                                                         // 607
    fetchAllFields: false                                                                              // 608
  };                                                                                                   // 609
                                                                                                       // 610
  if (!self._name)                                                                                     // 611
    return; // anonymous collection                                                                    // 612
                                                                                                       // 613
  // XXX Think about method namespacing. Maybe methods should be                                       // 614
  // "Meteor:Mongo:insert/NAME"?                                                                       // 615
  self._prefix = '/' + self._name + '/';                                                               // 616
                                                                                                       // 617
  // mutation methods                                                                                  // 618
  if (self._connection) {                                                                              // 619
    var m = {};                                                                                        // 620
                                                                                                       // 621
    _.each(['insert', 'update', 'remove'], function (method) {                                         // 622
      m[self._prefix + method] = function (/* ... */) {                                                // 623
        // All the methods do their own validation, instead of using check().                          // 624
        check(arguments, [Match.Any]);                                                                 // 625
        try {                                                                                          // 626
          if (this.isSimulation) {                                                                     // 627
                                                                                                       // 628
            // In a client simulation, you can do any mutation (even with a                            // 629
            // complex selector).                                                                      // 630
            return self._collection[method].apply(                                                     // 631
              self._collection, _.toArray(arguments));                                                 // 632
          }                                                                                            // 633
                                                                                                       // 634
          // This is the server receiving a method call from the client.                               // 635
                                                                                                       // 636
          // We don't allow arbitrary selectors in mutations from the client: only                     // 637
          // single-ID selectors.                                                                      // 638
          if (method !== 'insert')                                                                     // 639
            throwIfSelectorIsNotId(arguments[0], method);                                              // 640
                                                                                                       // 641
          if (self._restricted) {                                                                      // 642
            // short circuit if there is no way it will pass.                                          // 643
            if (self._validators[method].allow.length === 0) {                                         // 644
              throw new Meteor.Error(                                                                  // 645
                403, "Access denied. No allow validators set on restricted " +                         // 646
                  "collection for method '" + method + "'.");                                          // 647
            }                                                                                          // 648
                                                                                                       // 649
            var validatedMethodName =                                                                  // 650
                  '_validated' + method.charAt(0).toUpperCase() + method.slice(1);                     // 651
            var argsWithUserId = [this.userId].concat(_.toArray(arguments));                           // 652
            return self[validatedMethodName].apply(self, argsWithUserId);                              // 653
          } else if (self._isInsecure()) {                                                             // 654
            // In insecure mode, allow any mutation (with a simple selector).                          // 655
            return self._collection[method].apply(self._collection,                                    // 656
                                                  _.toArray(arguments));                               // 657
          } else {                                                                                     // 658
            // In secure mode, if we haven't called allow or deny, then nothing                        // 659
            // is permitted.                                                                           // 660
            throw new Meteor.Error(403, "Access denied");                                              // 661
          }                                                                                            // 662
        } catch (e) {                                                                                  // 663
          if (e.name === 'MongoError' || e.name === 'MinimongoError') {                                // 664
            throw new Meteor.Error(409, e.toString());                                                 // 665
          } else {                                                                                     // 666
            throw e;                                                                                   // 667
          }                                                                                            // 668
        }                                                                                              // 669
      };                                                                                               // 670
    });                                                                                                // 671
    // Minimongo on the server gets no stubs; instead, by default                                      // 672
    // it wait()s until its result is ready, yielding.                                                 // 673
    // This matches the behavior of macromongo on the server better.                                   // 674
    if (Meteor.isClient || self._connection === Meteor.server)                                         // 675
      self._connection.methods(m);                                                                     // 676
  }                                                                                                    // 677
};                                                                                                     // 678
                                                                                                       // 679
                                                                                                       // 680
Meteor.Collection.prototype._updateFetch = function (fields) {                                         // 681
  var self = this;                                                                                     // 682
                                                                                                       // 683
  if (!self._validators.fetchAllFields) {                                                              // 684
    if (fields) {                                                                                      // 685
      self._validators.fetch = _.union(self._validators.fetch, fields);                                // 686
    } else {                                                                                           // 687
      self._validators.fetchAllFields = true;                                                          // 688
      // clear fetch just to make sure we don't accidentally read it                                   // 689
      self._validators.fetch = null;                                                                   // 690
    }                                                                                                  // 691
  }                                                                                                    // 692
};                                                                                                     // 693
                                                                                                       // 694
Meteor.Collection.prototype._isInsecure = function () {                                                // 695
  var self = this;                                                                                     // 696
  if (self._insecure === undefined)                                                                    // 697
    return !!Package.insecure;                                                                         // 698
  return self._insecure;                                                                               // 699
};                                                                                                     // 700
                                                                                                       // 701
var docToValidate = function (validator, doc) {                                                        // 702
  var ret = doc;                                                                                       // 703
  if (validator.transform)                                                                             // 704
    ret = validator.transform(EJSON.clone(doc));                                                       // 705
  return ret;                                                                                          // 706
};                                                                                                     // 707
                                                                                                       // 708
Meteor.Collection.prototype._validatedInsert = function(userId, doc) {                                 // 709
  var self = this;                                                                                     // 710
                                                                                                       // 711
  // call user validators.                                                                             // 712
  // Any deny returns true means denied.                                                               // 713
  if (_.any(self._validators.insert.deny, function(validator) {                                        // 714
    return validator(userId, docToValidate(validator, doc));                                           // 715
  })) {                                                                                                // 716
    throw new Meteor.Error(403, "Access denied");                                                      // 717
  }                                                                                                    // 718
  // Any allow returns true means proceed. Throw error if they all fail.                               // 719
  if (_.all(self._validators.insert.allow, function(validator) {                                       // 720
    return !validator(userId, docToValidate(validator, doc));                                          // 721
  })) {                                                                                                // 722
    throw new Meteor.Error(403, "Access denied");                                                      // 723
  }                                                                                                    // 724
                                                                                                       // 725
  self._collection.insert.call(self._collection, doc);                                                 // 726
};                                                                                                     // 727
                                                                                                       // 728
var transformDoc = function (validator, doc) {                                                         // 729
  if (validator.transform)                                                                             // 730
    return validator.transform(doc);                                                                   // 731
  return doc;                                                                                          // 732
};                                                                                                     // 733
                                                                                                       // 734
// Simulate a mongo `update` operation while validating that the access                                // 735
// control rules set by calls to `allow/deny` are satisfied. If all                                    // 736
// pass, rewrite the mongo operation to use $in to set the list of                                     // 737
// document ids to change ##ValidatedChange                                                            // 738
Meteor.Collection.prototype._validatedUpdate = function(                                               // 739
    userId, selector, mutator, options) {                                                              // 740
  var self = this;                                                                                     // 741
                                                                                                       // 742
  options = options || {};                                                                             // 743
                                                                                                       // 744
  if (!LocalCollection._selectorIsIdPerhapsAsObject(selector))                                         // 745
    throw new Error("validated update should be of a single ID");                                      // 746
                                                                                                       // 747
  // We don't support upserts because they don't fit nicely into allow/deny                            // 748
  // rules.                                                                                            // 749
  if (options.upsert)                                                                                  // 750
    throw new Meteor.Error(403, "Access denied. Upserts not " +                                        // 751
                           "allowed in a restricted collection.");                                     // 752
                                                                                                       // 753
  // compute modified fields                                                                           // 754
  var fields = [];                                                                                     // 755
  _.each(mutator, function (params, op) {                                                              // 756
    if (op.charAt(0) !== '$') {                                                                        // 757
      throw new Meteor.Error(                                                                          // 758
        403, "Access denied. In a restricted collection you can only update documents, not replace them. Use a Mongo update operator, such as '$set'.");
    } else if (!_.has(ALLOWED_UPDATE_OPERATIONS, op)) {                                                // 760
      throw new Meteor.Error(                                                                          // 761
        403, "Access denied. Operator " + op + " not allowed in a restricted collection.");            // 762
    } else {                                                                                           // 763
      _.each(_.keys(params), function (field) {                                                        // 764
        // treat dotted fields as if they are replacing their                                          // 765
        // top-level part                                                                              // 766
        if (field.indexOf('.') !== -1)                                                                 // 767
          field = field.substring(0, field.indexOf('.'));                                              // 768
                                                                                                       // 769
        // record the field we are trying to change                                                    // 770
        if (!_.contains(fields, field))                                                                // 771
          fields.push(field);                                                                          // 772
      });                                                                                              // 773
    }                                                                                                  // 774
  });                                                                                                  // 775
                                                                                                       // 776
  var findOptions = {transform: null};                                                                 // 777
  if (!self._validators.fetchAllFields) {                                                              // 778
    findOptions.fields = {};                                                                           // 779
    _.each(self._validators.fetch, function(fieldName) {                                               // 780
      findOptions.fields[fieldName] = 1;                                                               // 781
    });                                                                                                // 782
  }                                                                                                    // 783
                                                                                                       // 784
  var doc = self._collection.findOne(selector, findOptions);                                           // 785
  if (!doc)  // none satisfied!                                                                        // 786
    return 0;                                                                                          // 787
                                                                                                       // 788
  var factoriedDoc;                                                                                    // 789
                                                                                                       // 790
  // call user validators.                                                                             // 791
  // Any deny returns true means denied.                                                               // 792
  if (_.any(self._validators.update.deny, function(validator) {                                        // 793
    if (!factoriedDoc)                                                                                 // 794
      factoriedDoc = transformDoc(validator, doc);                                                     // 795
    return validator(userId,                                                                           // 796
                     factoriedDoc,                                                                     // 797
                     fields,                                                                           // 798
                     mutator);                                                                         // 799
  })) {                                                                                                // 800
    throw new Meteor.Error(403, "Access denied");                                                      // 801
  }                                                                                                    // 802
  // Any allow returns true means proceed. Throw error if they all fail.                               // 803
  if (_.all(self._validators.update.allow, function(validator) {                                       // 804
    if (!factoriedDoc)                                                                                 // 805
      factoriedDoc = transformDoc(validator, doc);                                                     // 806
    return !validator(userId,                                                                          // 807
                      factoriedDoc,                                                                    // 808
                      fields,                                                                          // 809
                      mutator);                                                                        // 810
  })) {                                                                                                // 811
    throw new Meteor.Error(403, "Access denied");                                                      // 812
  }                                                                                                    // 813
                                                                                                       // 814
  // Back when we supported arbitrary client-provided selectors, we actually                           // 815
  // rewrote the selector to include an _id clause before passing to Mongo to                          // 816
  // avoid races, but since selector is guaranteed to already just be an ID, we                        // 817
  // don't have to any more.                                                                           // 818
                                                                                                       // 819
  return self._collection.update.call(                                                                 // 820
    self._collection, selector, mutator, options);                                                     // 821
};                                                                                                     // 822
                                                                                                       // 823
// Only allow these operations in validated updates. Specifically                                      // 824
// whitelist operations, rather than blacklist, so new complex                                         // 825
// operations that are added aren't automatically allowed. A complex                                   // 826
// operation is one that does more than just modify its target                                         // 827
// field. For now this contains all update operations except '$rename'.                                // 828
// http://docs.mongodb.org/manual/reference/operators/#update                                          // 829
var ALLOWED_UPDATE_OPERATIONS = {                                                                      // 830
  $inc:1, $set:1, $unset:1, $addToSet:1, $pop:1, $pullAll:1, $pull:1,                                  // 831
  $pushAll:1, $push:1, $bit:1                                                                          // 832
};                                                                                                     // 833
                                                                                                       // 834
// Simulate a mongo `remove` operation while validating access control                                 // 835
// rules. See #ValidatedChange                                                                         // 836
Meteor.Collection.prototype._validatedRemove = function(userId, selector) {                            // 837
  var self = this;                                                                                     // 838
                                                                                                       // 839
  var findOptions = {transform: null};                                                                 // 840
  if (!self._validators.fetchAllFields) {                                                              // 841
    findOptions.fields = {};                                                                           // 842
    _.each(self._validators.fetch, function(fieldName) {                                               // 843
      findOptions.fields[fieldName] = 1;                                                               // 844
    });                                                                                                // 845
  }                                                                                                    // 846
                                                                                                       // 847
  var doc = self._collection.findOne(selector, findOptions);                                           // 848
  if (!doc)                                                                                            // 849
    return 0;                                                                                          // 850
                                                                                                       // 851
  // call user validators.                                                                             // 852
  // Any deny returns true means denied.                                                               // 853
  if (_.any(self._validators.remove.deny, function(validator) {                                        // 854
    return validator(userId, transformDoc(validator, doc));                                            // 855
  })) {                                                                                                // 856
    throw new Meteor.Error(403, "Access denied");                                                      // 857
  }                                                                                                    // 858
  // Any allow returns true means proceed. Throw error if they all fail.                               // 859
  if (_.all(self._validators.remove.allow, function(validator) {                                       // 860
    return !validator(userId, transformDoc(validator, doc));                                           // 861
  })) {                                                                                                // 862
    throw new Meteor.Error(403, "Access denied");                                                      // 863
  }                                                                                                    // 864
                                                                                                       // 865
  // Back when we supported arbitrary client-provided selectors, we actually                           // 866
  // rewrote the selector to {_id: {$in: [ids that we found]}} before passing to                       // 867
  // Mongo to avoid races, but since selector is guaranteed to already just be                         // 868
  // an ID, we don't have to any more.                                                                 // 869
                                                                                                       // 870
  return self._collection.remove.call(self._collection, selector);                                     // 871
};                                                                                                     // 872
                                                                                                       // 873
/////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['mongo-livedata'] = {};

})();

//# sourceMappingURL=e4652f6f30df151f2cebf5ad32ae8a8c13fcb846.map
