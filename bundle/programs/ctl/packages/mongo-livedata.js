(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Random = Package.random.Random;
var EJSON = Package.ejson.EJSON;
var _ = Package.underscore._;
var LocalCollection = Package.minimongo.LocalCollection;
var Minimongo = Package.minimongo.Minimongo;
var Log = Package.logging.Log;
var DDP = Package.livedata.DDP;
var DDPServer = Package.livedata.DDPServer;
var Deps = Package.deps.Deps;
var AppConfig = Package['application-configuration'].AppConfig;
var check = Package.check.check;
var Match = Package.check.Match;

/* Package-scope variables */
var MongoInternals, MongoTest, MongoConnection, CursorDescription, Cursor, listenAll, forEachTrigger, idForOp, OplogHandle, ObserveMultiplexer, ObserveHandle, DocFetcher, PollingObserveDriver, OplogObserveDriver, LocalCollectionDriver;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// packages/mongo-livedata/mongo_driver.js                                                             //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
/**                                                                                                    // 1
 * Provide a synchronous Collection API using fibers, backed by                                        // 2
 * MongoDB.  This is only for use on the server, and mostly identical                                  // 3
 * to the client API.                                                                                  // 4
 *                                                                                                     // 5
 * NOTE: the public API methods must be run within a fiber. If you call                                // 6
 * these outside of a fiber they will explode!                                                         // 7
 */                                                                                                    // 8
                                                                                                       // 9
var path = Npm.require('path');                                                                        // 10
var MongoDB = Npm.require('mongodb');                                                                  // 11
var Fiber = Npm.require('fibers');                                                                     // 12
var Future = Npm.require(path.join('fibers', 'future'));                                               // 13
                                                                                                       // 14
MongoInternals = {};                                                                                   // 15
MongoTest = {};                                                                                        // 16
                                                                                                       // 17
var replaceNames = function (filter, thing) {                                                          // 18
  if (typeof thing === "object") {                                                                     // 19
    if (_.isArray(thing)) {                                                                            // 20
      return _.map(thing, _.bind(replaceNames, null, filter));                                         // 21
    }                                                                                                  // 22
    var ret = {};                                                                                      // 23
    _.each(thing, function (value, key) {                                                              // 24
      ret[filter(key)] = replaceNames(filter, value);                                                  // 25
    });                                                                                                // 26
    return ret;                                                                                        // 27
  }                                                                                                    // 28
  return thing;                                                                                        // 29
};                                                                                                     // 30
                                                                                                       // 31
// Ensure that EJSON.clone keeps a Timestamp as a Timestamp (instead of just                           // 32
// doing a structural clone).                                                                          // 33
// XXX how ok is this? what if there are multiple copies of MongoDB loaded?                            // 34
MongoDB.Timestamp.prototype.clone = function () {                                                      // 35
  // Timestamps should be immutable.                                                                   // 36
  return this;                                                                                         // 37
};                                                                                                     // 38
                                                                                                       // 39
var makeMongoLegal = function (name) { return "EJSON" + name; };                                       // 40
var unmakeMongoLegal = function (name) { return name.substr(5); };                                     // 41
                                                                                                       // 42
var replaceMongoAtomWithMeteor = function (document) {                                                 // 43
  if (document instanceof MongoDB.Binary) {                                                            // 44
    var buffer = document.value(true);                                                                 // 45
    return new Uint8Array(buffer);                                                                     // 46
  }                                                                                                    // 47
  if (document instanceof MongoDB.ObjectID) {                                                          // 48
    return new Meteor.Collection.ObjectID(document.toHexString());                                     // 49
  }                                                                                                    // 50
  if (document["EJSON$type"] && document["EJSON$value"]) {                                             // 51
    return EJSON.fromJSONValue(replaceNames(unmakeMongoLegal, document));                              // 52
  }                                                                                                    // 53
  if (document instanceof MongoDB.Timestamp) {                                                         // 54
    // For now, the Meteor representation of a Mongo timestamp type (not a date!                       // 55
    // this is a weird internal thing used in the oplog!) is the same as the                           // 56
    // Mongo representation. We need to do this explicitly or else we would do a                       // 57
    // structural clone and lose the prototype.                                                        // 58
    return document;                                                                                   // 59
  }                                                                                                    // 60
  return undefined;                                                                                    // 61
};                                                                                                     // 62
                                                                                                       // 63
var replaceMeteorAtomWithMongo = function (document) {                                                 // 64
  if (EJSON.isBinary(document)) {                                                                      // 65
    // This does more copies than we'd like, but is necessary because                                  // 66
    // MongoDB.BSON only looks like it takes a Uint8Array (and doesn't actually                        // 67
    // serialize it correctly).                                                                        // 68
    return new MongoDB.Binary(new Buffer(document));                                                   // 69
  }                                                                                                    // 70
  if (document instanceof Meteor.Collection.ObjectID) {                                                // 71
    return new MongoDB.ObjectID(document.toHexString());                                               // 72
  }                                                                                                    // 73
  if (document instanceof MongoDB.Timestamp) {                                                         // 74
    // For now, the Meteor representation of a Mongo timestamp type (not a date!                       // 75
    // this is a weird internal thing used in the oplog!) is the same as the                           // 76
    // Mongo representation. We need to do this explicitly or else we would do a                       // 77
    // structural clone and lose the prototype.                                                        // 78
    return document;                                                                                   // 79
  }                                                                                                    // 80
  if (EJSON._isCustomType(document)) {                                                                 // 81
    return replaceNames(makeMongoLegal, EJSON.toJSONValue(document));                                  // 82
  }                                                                                                    // 83
  // It is not ordinarily possible to stick dollar-sign keys into mongo                                // 84
  // so we don't bother checking for things that need escaping at this time.                           // 85
  return undefined;                                                                                    // 86
};                                                                                                     // 87
                                                                                                       // 88
var replaceTypes = function (document, atomTransformer) {                                              // 89
  if (typeof document !== 'object' || document === null)                                               // 90
    return document;                                                                                   // 91
                                                                                                       // 92
  var replacedTopLevelAtom = atomTransformer(document);                                                // 93
  if (replacedTopLevelAtom !== undefined)                                                              // 94
    return replacedTopLevelAtom;                                                                       // 95
                                                                                                       // 96
  var ret = document;                                                                                  // 97
  _.each(document, function (val, key) {                                                               // 98
    var valReplaced = replaceTypes(val, atomTransformer);                                              // 99
    if (val !== valReplaced) {                                                                         // 100
      // Lazy clone. Shallow copy.                                                                     // 101
      if (ret === document)                                                                            // 102
        ret = _.clone(document);                                                                       // 103
      ret[key] = valReplaced;                                                                          // 104
    }                                                                                                  // 105
  });                                                                                                  // 106
  return ret;                                                                                          // 107
};                                                                                                     // 108
                                                                                                       // 109
                                                                                                       // 110
MongoConnection = function (url, options) {                                                            // 111
  var self = this;                                                                                     // 112
  options = options || {};                                                                             // 113
  self._connectCallbacks = [];                                                                         // 114
  self._observeMultiplexers = {};                                                                      // 115
                                                                                                       // 116
  var mongoOptions = {db: {safe: true}, server: {}, replSet: {}};                                      // 117
                                                                                                       // 118
  // Set autoReconnect to true, unless passed on the URL. Why someone                                  // 119
  // would want to set autoReconnect to false, I'm not really sure, but                                // 120
  // keeping this for backwards compatibility for now.                                                 // 121
  if (!(/[\?&]auto_?[rR]econnect=/.test(url))) {                                                       // 122
    mongoOptions.server.auto_reconnect = true;                                                         // 123
  }                                                                                                    // 124
                                                                                                       // 125
  // Disable the native parser by default, unless specifically enabled                                 // 126
  // in the mongo URL.                                                                                 // 127
  // - The native driver can cause errors which normally would be                                      // 128
  //   thrown, caught, and handled into segfaults that take down the                                   // 129
  //   whole app.                                                                                      // 130
  // - Binary modules don't yet work when you bundle and move the bundle                               // 131
  //   to a different platform (aka deploy)                                                            // 132
  // We should revisit this after binary npm module support lands.                                     // 133
  if (!(/[\?&]native_?[pP]arser=/.test(url))) {                                                        // 134
    mongoOptions.db.native_parser = false;                                                             // 135
  }                                                                                                    // 136
                                                                                                       // 137
  // XXX maybe we should have a better way of allowing users to configure the                          // 138
  // underlying Mongo driver                                                                           // 139
  if (_.has(options, 'poolSize')) {                                                                    // 140
    // If we just set this for "server", replSet will override it. If we just                          // 141
    // set it for replSet, it will be ignored if we're not using a replSet.                            // 142
    mongoOptions.server.poolSize = options.poolSize;                                                   // 143
    mongoOptions.replSet.poolSize = options.poolSize;                                                  // 144
  }                                                                                                    // 145
                                                                                                       // 146
  MongoDB.connect(url, mongoOptions, function(err, db) {                                               // 147
    if (err)                                                                                           // 148
      throw err;                                                                                       // 149
    self.db = db;                                                                                      // 150
                                                                                                       // 151
    Fiber(function () {                                                                                // 152
      // drain queue of pending callbacks                                                              // 153
      _.each(self._connectCallbacks, function (c) {                                                    // 154
        c(db);                                                                                         // 155
      });                                                                                              // 156
    }).run();                                                                                          // 157
  });                                                                                                  // 158
                                                                                                       // 159
  self._docFetcher = new DocFetcher(self);                                                             // 160
  self._oplogHandle = null;                                                                            // 161
                                                                                                       // 162
  if (options.oplogUrl && !Package['disable-oplog']) {                                                 // 163
    var dbNameFuture = new Future;                                                                     // 164
    self._withDb(function (db) {                                                                       // 165
      dbNameFuture.return(db.databaseName);                                                            // 166
    });                                                                                                // 167
    self._oplogHandle = new OplogHandle(options.oplogUrl, dbNameFuture.wait());                        // 168
  }                                                                                                    // 169
};                                                                                                     // 170
                                                                                                       // 171
MongoConnection.prototype.close = function() {                                                         // 172
  var self = this;                                                                                     // 173
                                                                                                       // 174
  // XXX probably untested                                                                             // 175
  var oplogHandle = self._oplogHandle;                                                                 // 176
  self._oplogHandle = null;                                                                            // 177
  if (oplogHandle)                                                                                     // 178
    oplogHandle.stop();                                                                                // 179
                                                                                                       // 180
  // Use Future.wrap so that errors get thrown. This happens to                                        // 181
  // work even outside a fiber since the 'close' method is not                                         // 182
  // actually asynchronous.                                                                            // 183
  Future.wrap(_.bind(self.db.close, self.db))(true).wait();                                            // 184
};                                                                                                     // 185
                                                                                                       // 186
MongoConnection.prototype._withDb = function (callback) {                                              // 187
  var self = this;                                                                                     // 188
  if (self.db) {                                                                                       // 189
    callback(self.db);                                                                                 // 190
  } else {                                                                                             // 191
    self._connectCallbacks.push(callback);                                                             // 192
  }                                                                                                    // 193
};                                                                                                     // 194
                                                                                                       // 195
// Returns the Mongo Collection object; may yield.                                                     // 196
MongoConnection.prototype._getCollection = function (collectionName) {                                 // 197
  var self = this;                                                                                     // 198
                                                                                                       // 199
  var future = new Future;                                                                             // 200
  self._withDb(function (db) {                                                                         // 201
    db.collection(collectionName, future.resolver());                                                  // 202
  });                                                                                                  // 203
  return future.wait();                                                                                // 204
};                                                                                                     // 205
                                                                                                       // 206
MongoConnection.prototype._createCappedCollection = function (collectionName,                          // 207
                                                              byteSize) {                              // 208
  var self = this;                                                                                     // 209
  var future = new Future();                                                                           // 210
  self._withDb(function (db) {                                                                         // 211
    db.createCollection(collectionName, {capped: true, size: byteSize},                                // 212
                        future.resolver());                                                            // 213
  });                                                                                                  // 214
  future.wait();                                                                                       // 215
};                                                                                                     // 216
                                                                                                       // 217
// This should be called synchronously with a write, to create a                                       // 218
// transaction on the current write fence, if any. After we can read                                   // 219
// the write, and after observers have been notified (or at least,                                     // 220
// after the observer notifiers have added themselves to the write                                     // 221
// fence), you should call 'committed()' on the object returned.                                       // 222
MongoConnection.prototype._maybeBeginWrite = function () {                                             // 223
  var self = this;                                                                                     // 224
  var fence = DDPServer._CurrentWriteFence.get();                                                      // 225
  if (fence)                                                                                           // 226
    return fence.beginWrite();                                                                         // 227
  else                                                                                                 // 228
    return {committed: function () {}};                                                                // 229
};                                                                                                     // 230
                                                                                                       // 231
                                                                                                       // 232
//////////// Public API //////////                                                                     // 233
                                                                                                       // 234
// The write methods block until the database has confirmed the write (it may                          // 235
// not be replicated or stable on disk, but one server has confirmed it) if no                         // 236
// callback is provided. If a callback is provided, then they call the callback                        // 237
// when the write is confirmed. They return nothing on success, and raise an                           // 238
// exception on failure.                                                                               // 239
//                                                                                                     // 240
// After making a write (with insert, update, remove), observers are                                   // 241
// notified asynchronously. If you want to receive a callback once all                                 // 242
// of the observer notifications have landed for your write, do the                                    // 243
// writes inside a write fence (set DDPServer._CurrentWriteFence to a new                              // 244
// _WriteFence, and then set a callback on the write fence.)                                           // 245
//                                                                                                     // 246
// Since our execution environment is single-threaded, this is                                         // 247
// well-defined -- a write "has been made" if it's returned, and an                                    // 248
// observer "has been notified" if its callback has returned.                                          // 249
                                                                                                       // 250
var writeCallback = function (write, refresh, callback) {                                              // 251
  return function (err, result) {                                                                      // 252
    if (! err) {                                                                                       // 253
      // XXX We don't have to run this on error, right?                                                // 254
      refresh();                                                                                       // 255
    }                                                                                                  // 256
    write.committed();                                                                                 // 257
    if (callback)                                                                                      // 258
      callback(err, result);                                                                           // 259
    else if (err)                                                                                      // 260
      throw err;                                                                                       // 261
  };                                                                                                   // 262
};                                                                                                     // 263
                                                                                                       // 264
var bindEnvironmentForWrite = function (callback) {                                                    // 265
  return Meteor.bindEnvironment(callback, "Mongo write");                                              // 266
};                                                                                                     // 267
                                                                                                       // 268
MongoConnection.prototype._insert = function (collection_name, document,                               // 269
                                              callback) {                                              // 270
  var self = this;                                                                                     // 271
  if (collection_name === "___meteor_failure_test_collection") {                                       // 272
    var e = new Error("Failure test");                                                                 // 273
    e.expected = true;                                                                                 // 274
    if (callback)                                                                                      // 275
      return callback(e);                                                                              // 276
    else                                                                                               // 277
      throw e;                                                                                         // 278
  }                                                                                                    // 279
                                                                                                       // 280
  var write = self._maybeBeginWrite();                                                                 // 281
  var refresh = function () {                                                                          // 282
    Meteor.refresh({collection: collection_name, id: document._id });                                  // 283
  };                                                                                                   // 284
  callback = bindEnvironmentForWrite(writeCallback(write, refresh, callback));                         // 285
  try {                                                                                                // 286
    var collection = self._getCollection(collection_name);                                             // 287
    collection.insert(replaceTypes(document, replaceMeteorAtomWithMongo),                              // 288
                      {safe: true}, callback);                                                         // 289
  } catch (e) {                                                                                        // 290
    write.committed();                                                                                 // 291
    throw e;                                                                                           // 292
  }                                                                                                    // 293
};                                                                                                     // 294
                                                                                                       // 295
// Cause queries that may be affected by the selector to poll in this write                            // 296
// fence.                                                                                              // 297
MongoConnection.prototype._refresh = function (collectionName, selector) {                             // 298
  var self = this;                                                                                     // 299
  var refreshKey = {collection: collectionName};                                                       // 300
  // If we know which documents we're removing, don't poll queries that are                            // 301
  // specific to other documents. (Note that multiple notifications here should                        // 302
  // not cause multiple polls, since all our listener is doing is enqueueing a                         // 303
  // poll.)                                                                                            // 304
  var specificIds = LocalCollection._idsMatchedBySelector(selector);                                   // 305
  if (specificIds) {                                                                                   // 306
    _.each(specificIds, function (id) {                                                                // 307
      Meteor.refresh(_.extend({id: id}, refreshKey));                                                  // 308
    });                                                                                                // 309
  } else {                                                                                             // 310
    Meteor.refresh(refreshKey);                                                                        // 311
  }                                                                                                    // 312
};                                                                                                     // 313
                                                                                                       // 314
MongoConnection.prototype._remove = function (collection_name, selector,                               // 315
                                              callback) {                                              // 316
  var self = this;                                                                                     // 317
                                                                                                       // 318
  if (collection_name === "___meteor_failure_test_collection") {                                       // 319
    var e = new Error("Failure test");                                                                 // 320
    e.expected = true;                                                                                 // 321
    if (callback)                                                                                      // 322
      return callback(e);                                                                              // 323
    else                                                                                               // 324
      throw e;                                                                                         // 325
  }                                                                                                    // 326
                                                                                                       // 327
  var write = self._maybeBeginWrite();                                                                 // 328
  var refresh = function () {                                                                          // 329
    self._refresh(collection_name, selector);                                                          // 330
  };                                                                                                   // 331
  callback = bindEnvironmentForWrite(writeCallback(write, refresh, callback));                         // 332
                                                                                                       // 333
  try {                                                                                                // 334
    var collection = self._getCollection(collection_name);                                             // 335
    collection.remove(replaceTypes(selector, replaceMeteorAtomWithMongo),                              // 336
                      {safe: true}, callback);                                                         // 337
  } catch (e) {                                                                                        // 338
    write.committed();                                                                                 // 339
    throw e;                                                                                           // 340
  }                                                                                                    // 341
};                                                                                                     // 342
                                                                                                       // 343
MongoConnection.prototype._dropCollection = function (collectionName, cb) {                            // 344
  var self = this;                                                                                     // 345
                                                                                                       // 346
  var write = self._maybeBeginWrite();                                                                 // 347
  var refresh = function () {                                                                          // 348
    Meteor.refresh({collection: collectionName, id: null,                                              // 349
                    dropCollection: true});                                                            // 350
  };                                                                                                   // 351
  cb = bindEnvironmentForWrite(writeCallback(write, refresh, cb));                                     // 352
                                                                                                       // 353
  try {                                                                                                // 354
    var collection = self._getCollection(collectionName);                                              // 355
    collection.drop(cb);                                                                               // 356
  } catch (e) {                                                                                        // 357
    write.committed();                                                                                 // 358
    throw e;                                                                                           // 359
  }                                                                                                    // 360
};                                                                                                     // 361
                                                                                                       // 362
MongoConnection.prototype._update = function (collection_name, selector, mod,                          // 363
                                              options, callback) {                                     // 364
  var self = this;                                                                                     // 365
                                                                                                       // 366
  if (! callback && options instanceof Function) {                                                     // 367
    callback = options;                                                                                // 368
    options = null;                                                                                    // 369
  }                                                                                                    // 370
                                                                                                       // 371
  if (collection_name === "___meteor_failure_test_collection") {                                       // 372
    var e = new Error("Failure test");                                                                 // 373
    e.expected = true;                                                                                 // 374
    if (callback)                                                                                      // 375
      return callback(e);                                                                              // 376
    else                                                                                               // 377
      throw e;                                                                                         // 378
  }                                                                                                    // 379
                                                                                                       // 380
  // explicit safety check. null and undefined can crash the mongo                                     // 381
  // driver. Although the node driver and minimongo do 'support'                                       // 382
  // non-object modifier in that they don't crash, they are not                                        // 383
  // meaningful operations and do not do anything. Defensively throw an                                // 384
  // error here.                                                                                       // 385
  if (!mod || typeof mod !== 'object')                                                                 // 386
    throw new Error("Invalid modifier. Modifier must be an object.");                                  // 387
                                                                                                       // 388
  if (!options) options = {};                                                                          // 389
                                                                                                       // 390
  var write = self._maybeBeginWrite();                                                                 // 391
  var refresh = function () {                                                                          // 392
    self._refresh(collection_name, selector);                                                          // 393
  };                                                                                                   // 394
  callback = writeCallback(write, refresh, callback);                                                  // 395
  try {                                                                                                // 396
    var collection = self._getCollection(collection_name);                                             // 397
    var mongoOpts = {safe: true};                                                                      // 398
    // explictly enumerate options that minimongo supports                                             // 399
    if (options.upsert) mongoOpts.upsert = true;                                                       // 400
    if (options.multi) mongoOpts.multi = true;                                                         // 401
                                                                                                       // 402
    var mongoSelector = replaceTypes(selector, replaceMeteorAtomWithMongo);                            // 403
    var mongoMod = replaceTypes(mod, replaceMeteorAtomWithMongo);                                      // 404
                                                                                                       // 405
    var isModify = isModificationMod(mongoMod);                                                        // 406
    var knownId = (isModify ? selector._id : mod._id);                                                 // 407
                                                                                                       // 408
    if (options.upsert && (! knownId) && options.insertedId) {                                         // 409
      // XXX In future we could do a real upsert for the mongo id generation                           // 410
      // case, if the the node mongo driver gives us back the id of the upserted                       // 411
      // doc (which our current version does not).                                                     // 412
      simulateUpsertWithInsertedId(                                                                    // 413
        collection, mongoSelector, mongoMod,                                                           // 414
        isModify, options,                                                                             // 415
        // This callback does not need to be bindEnvironment'ed because                                // 416
        // simulateUpsertWithInsertedId() wraps it and then passes it through                          // 417
        // bindEnvironmentForWrite.                                                                    // 418
        function (err, result) {                                                                       // 419
          // If we got here via a upsert() call, then options._returnObject will                       // 420
          // be set and we should return the whole object. Otherwise, we should                        // 421
          // just return the number of affected docs to match the mongo API.                           // 422
          if (result && ! options._returnObject)                                                       // 423
            callback(err, result.numberAffected);                                                      // 424
          else                                                                                         // 425
            callback(err, result);                                                                     // 426
        }                                                                                              // 427
      );                                                                                               // 428
    } else {                                                                                           // 429
      collection.update(                                                                               // 430
        mongoSelector, mongoMod, mongoOpts,                                                            // 431
        bindEnvironmentForWrite(function (err, result, extra) {                                        // 432
          if (! err) {                                                                                 // 433
            if (result && options._returnObject) {                                                     // 434
              result = { numberAffected: result };                                                     // 435
              // If this was an upsert() call, and we ended up                                         // 436
              // inserting a new doc and we know its id, then                                          // 437
              // return that id as well.                                                               // 438
              if (options.upsert && knownId &&                                                         // 439
                  ! extra.updatedExisting)                                                             // 440
                result.insertedId = knownId;                                                           // 441
            }                                                                                          // 442
          }                                                                                            // 443
          callback(err, result);                                                                       // 444
        }));                                                                                           // 445
    }                                                                                                  // 446
  } catch (e) {                                                                                        // 447
    write.committed();                                                                                 // 448
    throw e;                                                                                           // 449
  }                                                                                                    // 450
};                                                                                                     // 451
                                                                                                       // 452
var isModificationMod = function (mod) {                                                               // 453
  for (var k in mod)                                                                                   // 454
    if (k.substr(0, 1) === '$')                                                                        // 455
      return true;                                                                                     // 456
  return false;                                                                                        // 457
};                                                                                                     // 458
                                                                                                       // 459
var NUM_OPTIMISTIC_TRIES = 3;                                                                          // 460
                                                                                                       // 461
// exposed for testing                                                                                 // 462
MongoConnection._isCannotChangeIdError = function (err) {                                              // 463
  // either of these checks should work, but just to be safe...                                        // 464
  return (err.code === 13596 ||                                                                        // 465
          err.err.indexOf("cannot change _id of a document") === 0);                                   // 466
};                                                                                                     // 467
                                                                                                       // 468
var simulateUpsertWithInsertedId = function (collection, selector, mod,                                // 469
                                             isModify, options, callback) {                            // 470
  // STRATEGY:  First try doing a plain update.  If it affected 0 documents,                           // 471
  // then without affecting the database, we know we should probably do an                             // 472
  // insert.  We then do a *conditional* insert that will fail in the case                             // 473
  // of a race condition.  This conditional insert is actually an                                      // 474
  // upsert-replace with an _id, which will never successfully update an                               // 475
  // existing document.  If this upsert fails with an error saying it                                  // 476
  // couldn't change an existing _id, then we know an intervening write has                            // 477
  // caused the query to match something.  We go back to step one and repeat.                          // 478
  // Like all "optimistic write" schemes, we rely on the fact that it's                                // 479
  // unlikely our writes will continue to be interfered with under normal                              // 480
  // circumstances (though sufficiently heavy contention with writers                                  // 481
  // disagreeing on the existence of an object will cause writes to fail                               // 482
  // in theory).                                                                                       // 483
                                                                                                       // 484
  var newDoc;                                                                                          // 485
  // Run this code up front so that it fails fast if someone uses                                      // 486
  // a Mongo update operator we don't support.                                                         // 487
  if (isModify) {                                                                                      // 488
    // We've already run replaceTypes/replaceMeteorAtomWithMongo on                                    // 489
    // selector and mod.  We assume it doesn't matter, as far as                                       // 490
    // the behavior of modifiers is concerned, whether `_modify`                                       // 491
    // is run on EJSON or on mongo-converted EJSON.                                                    // 492
    var selectorDoc = LocalCollection._removeDollarOperators(selector);                                // 493
    LocalCollection._modify(selectorDoc, mod, {isInsert: true});                                       // 494
    newDoc = selectorDoc;                                                                              // 495
  } else {                                                                                             // 496
    newDoc = mod;                                                                                      // 497
  }                                                                                                    // 498
                                                                                                       // 499
  var insertedId = options.insertedId; // must exist                                                   // 500
  var mongoOptsForUpdate = {                                                                           // 501
    safe: true,                                                                                        // 502
    multi: options.multi                                                                               // 503
  };                                                                                                   // 504
  var mongoOptsForInsert = {                                                                           // 505
    safe: true,                                                                                        // 506
    upsert: true                                                                                       // 507
  };                                                                                                   // 508
                                                                                                       // 509
  var tries = NUM_OPTIMISTIC_TRIES;                                                                    // 510
                                                                                                       // 511
  var doUpdate = function () {                                                                         // 512
    tries--;                                                                                           // 513
    if (! tries) {                                                                                     // 514
      callback(new Error("Upsert failed after " + NUM_OPTIMISTIC_TRIES + " tries."));                  // 515
    } else {                                                                                           // 516
      collection.update(selector, mod, mongoOptsForUpdate,                                             // 517
                        bindEnvironmentForWrite(function (err, result) {                               // 518
                          if (err)                                                                     // 519
                            callback(err);                                                             // 520
                          else if (result)                                                             // 521
                            callback(null, {                                                           // 522
                              numberAffected: result                                                   // 523
                            });                                                                        // 524
                          else                                                                         // 525
                            doConditionalInsert();                                                     // 526
                        }));                                                                           // 527
    }                                                                                                  // 528
  };                                                                                                   // 529
                                                                                                       // 530
  var doConditionalInsert = function () {                                                              // 531
    var replacementWithId = _.extend(                                                                  // 532
      replaceTypes({_id: insertedId}, replaceMeteorAtomWithMongo),                                     // 533
      newDoc);                                                                                         // 534
    collection.update(selector, replacementWithId, mongoOptsForInsert,                                 // 535
                      bindEnvironmentForWrite(function (err, result) {                                 // 536
                        if (err) {                                                                     // 537
                          // figure out if this is a                                                   // 538
                          // "cannot change _id of document" error, and                                // 539
                          // if so, try doUpdate() again, up to 3 times.                               // 540
                          if (MongoConnection._isCannotChangeIdError(err)) {                           // 541
                            doUpdate();                                                                // 542
                          } else {                                                                     // 543
                            callback(err);                                                             // 544
                          }                                                                            // 545
                        } else {                                                                       // 546
                          callback(null, {                                                             // 547
                            numberAffected: result,                                                    // 548
                            insertedId: insertedId                                                     // 549
                          });                                                                          // 550
                        }                                                                              // 551
                      }));                                                                             // 552
  };                                                                                                   // 553
                                                                                                       // 554
  doUpdate();                                                                                          // 555
};                                                                                                     // 556
                                                                                                       // 557
_.each(["insert", "update", "remove", "dropCollection"], function (method) {                           // 558
  MongoConnection.prototype[method] = function (/* arguments */) {                                     // 559
    var self = this;                                                                                   // 560
    return Meteor._wrapAsync(self["_" + method]).apply(self, arguments);                               // 561
  };                                                                                                   // 562
});                                                                                                    // 563
                                                                                                       // 564
// XXX MongoConnection.upsert() does not return the id of the inserted document                        // 565
// unless you set it explicitly in the selector or modifier (as a replacement                          // 566
// doc).                                                                                               // 567
MongoConnection.prototype.upsert = function (collectionName, selector, mod,                            // 568
                                             options, callback) {                                      // 569
  var self = this;                                                                                     // 570
  if (typeof options === "function" && ! callback) {                                                   // 571
    callback = options;                                                                                // 572
    options = {};                                                                                      // 573
  }                                                                                                    // 574
                                                                                                       // 575
  return self.update(collectionName, selector, mod,                                                    // 576
                     _.extend({}, options, {                                                           // 577
                       upsert: true,                                                                   // 578
                       _returnObject: true                                                             // 579
                     }), callback);                                                                    // 580
};                                                                                                     // 581
                                                                                                       // 582
MongoConnection.prototype.find = function (collectionName, selector, options) {                        // 583
  var self = this;                                                                                     // 584
                                                                                                       // 585
  if (arguments.length === 1)                                                                          // 586
    selector = {};                                                                                     // 587
                                                                                                       // 588
  return new Cursor(                                                                                   // 589
    self, new CursorDescription(collectionName, selector, options));                                   // 590
};                                                                                                     // 591
                                                                                                       // 592
MongoConnection.prototype.findOne = function (collection_name, selector,                               // 593
                                              options) {                                               // 594
  var self = this;                                                                                     // 595
  if (arguments.length === 1)                                                                          // 596
    selector = {};                                                                                     // 597
                                                                                                       // 598
  options = options || {};                                                                             // 599
  options.limit = 1;                                                                                   // 600
  return self.find(collection_name, selector, options).fetch()[0];                                     // 601
};                                                                                                     // 602
                                                                                                       // 603
// We'll actually design an index API later. For now, we just pass through to                          // 604
// Mongo's, but make it synchronous.                                                                   // 605
MongoConnection.prototype._ensureIndex = function (collectionName, index,                              // 606
                                                   options) {                                          // 607
  var self = this;                                                                                     // 608
  options = _.extend({safe: true}, options);                                                           // 609
                                                                                                       // 610
  // We expect this function to be called at startup, not from within a method,                        // 611
  // so we don't interact with the write fence.                                                        // 612
  var collection = self._getCollection(collectionName);                                                // 613
  var future = new Future;                                                                             // 614
  var indexName = collection.ensureIndex(index, options, future.resolver());                           // 615
  future.wait();                                                                                       // 616
};                                                                                                     // 617
MongoConnection.prototype._dropIndex = function (collectionName, index) {                              // 618
  var self = this;                                                                                     // 619
                                                                                                       // 620
  // This function is only used by test code, not within a method, so we don't                         // 621
  // interact with the write fence.                                                                    // 622
  var collection = self._getCollection(collectionName);                                                // 623
  var future = new Future;                                                                             // 624
  var indexName = collection.dropIndex(index, future.resolver());                                      // 625
  future.wait();                                                                                       // 626
};                                                                                                     // 627
                                                                                                       // 628
// CURSORS                                                                                             // 629
                                                                                                       // 630
// There are several classes which relate to cursors:                                                  // 631
//                                                                                                     // 632
// CursorDescription represents the arguments used to construct a cursor:                              // 633
// collectionName, selector, and (find) options.  Because it is used as a key                          // 634
// for cursor de-dup, everything in it should either be JSON-stringifiable or                          // 635
// not affect observeChanges output (eg, options.transform functions are not                           // 636
// stringifiable but do not affect observeChanges).                                                    // 637
//                                                                                                     // 638
// SynchronousCursor is a wrapper around a MongoDB cursor                                              // 639
// which includes fully-synchronous versions of forEach, etc.                                          // 640
//                                                                                                     // 641
// Cursor is the cursor object returned from find(), which implements the                              // 642
// documented Meteor.Collection cursor API.  It wraps a CursorDescription and a                        // 643
// SynchronousCursor (lazily: it doesn't contact Mongo until you call a method                         // 644
// like fetch or forEach on it).                                                                       // 645
//                                                                                                     // 646
// ObserveHandle is the "observe handle" returned from observeChanges. It has a                        // 647
// reference to an ObserveMultiplexer.                                                                 // 648
//                                                                                                     // 649
// ObserveMultiplexer allows multiple identical ObserveHandles to be driven by a                       // 650
// single observe driver.                                                                              // 651
//                                                                                                     // 652
// There are two "observe drivers" which drive ObserveMultiplexers:                                    // 653
//   - PollingObserveDriver caches the results of a query and reruns it when                           // 654
//     necessary.                                                                                      // 655
//   - OplogObserveDriver follows the Mongo operation log to directly observe                          // 656
//     database changes.                                                                               // 657
// Both implementations follow the same simple interface: when you create them,                        // 658
// they start sending observeChanges callbacks (and a ready() invocation) to                           // 659
// their ObserveMultiplexer, and you stop them by calling their stop() method.                         // 660
                                                                                                       // 661
CursorDescription = function (collectionName, selector, options) {                                     // 662
  var self = this;                                                                                     // 663
  self.collectionName = collectionName;                                                                // 664
  self.selector = Meteor.Collection._rewriteSelector(selector);                                        // 665
  self.options = options || {};                                                                        // 666
};                                                                                                     // 667
                                                                                                       // 668
Cursor = function (mongo, cursorDescription) {                                                         // 669
  var self = this;                                                                                     // 670
                                                                                                       // 671
  self._mongo = mongo;                                                                                 // 672
  self._cursorDescription = cursorDescription;                                                         // 673
  self._synchronousCursor = null;                                                                      // 674
};                                                                                                     // 675
                                                                                                       // 676
_.each(['forEach', 'map', 'rewind', 'fetch', 'count'], function (method) {                             // 677
  Cursor.prototype[method] = function () {                                                             // 678
    var self = this;                                                                                   // 679
                                                                                                       // 680
    // You can only observe a tailable cursor.                                                         // 681
    if (self._cursorDescription.options.tailable)                                                      // 682
      throw new Error("Cannot call " + method + " on a tailable cursor");                              // 683
                                                                                                       // 684
    if (!self._synchronousCursor) {                                                                    // 685
      self._synchronousCursor = self._mongo._createSynchronousCursor(                                  // 686
        self._cursorDescription, {                                                                     // 687
          // Make sure that the "self" argument to forEach/map callbacks is the                        // 688
          // Cursor, not the SynchronousCursor.                                                        // 689
          selfForIteration: self,                                                                      // 690
          useTransform: true                                                                           // 691
        });                                                                                            // 692
    }                                                                                                  // 693
                                                                                                       // 694
    return self._synchronousCursor[method].apply(                                                      // 695
      self._synchronousCursor, arguments);                                                             // 696
  };                                                                                                   // 697
});                                                                                                    // 698
                                                                                                       // 699
Cursor.prototype.getTransform = function () {                                                          // 700
  return this._cursorDescription.options.transform;                                                    // 701
};                                                                                                     // 702
                                                                                                       // 703
// When you call Meteor.publish() with a function that returns a Cursor, we need                       // 704
// to transmute it into the equivalent subscription.  This is the function that                        // 705
// does that.                                                                                          // 706
                                                                                                       // 707
Cursor.prototype._publishCursor = function (sub) {                                                     // 708
  var self = this;                                                                                     // 709
  var collection = self._cursorDescription.collectionName;                                             // 710
  return Meteor.Collection._publishCursor(self, sub, collection);                                      // 711
};                                                                                                     // 712
                                                                                                       // 713
// Used to guarantee that publish functions return at most one cursor per                              // 714
// collection. Private, because we might later have cursors that include                               // 715
// documents from multiple collections somehow.                                                        // 716
Cursor.prototype._getCollectionName = function () {                                                    // 717
  var self = this;                                                                                     // 718
  return self._cursorDescription.collectionName;                                                       // 719
}                                                                                                      // 720
                                                                                                       // 721
Cursor.prototype.observe = function (callbacks) {                                                      // 722
  var self = this;                                                                                     // 723
  return LocalCollection._observeFromObserveChanges(self, callbacks);                                  // 724
};                                                                                                     // 725
                                                                                                       // 726
Cursor.prototype.observeChanges = function (callbacks) {                                               // 727
  var self = this;                                                                                     // 728
  var ordered = LocalCollection._observeChangesCallbacksAreOrdered(callbacks);                         // 729
  return self._mongo._observeChanges(                                                                  // 730
    self._cursorDescription, ordered, callbacks);                                                      // 731
};                                                                                                     // 732
                                                                                                       // 733
MongoConnection.prototype._createSynchronousCursor = function(                                         // 734
    cursorDescription, options) {                                                                      // 735
  var self = this;                                                                                     // 736
  options = _.pick(options || {}, 'selfForIteration', 'useTransform');                                 // 737
                                                                                                       // 738
  var collection = self._getCollection(cursorDescription.collectionName);                              // 739
  var cursorOptions = cursorDescription.options;                                                       // 740
  var mongoOptions = {                                                                                 // 741
    sort: cursorOptions.sort,                                                                          // 742
    limit: cursorOptions.limit,                                                                        // 743
    skip: cursorOptions.skip                                                                           // 744
  };                                                                                                   // 745
                                                                                                       // 746
  // Do we want a tailable cursor (which only works on capped collections)?                            // 747
  if (cursorOptions.tailable) {                                                                        // 748
    // We want a tailable cursor...                                                                    // 749
    mongoOptions.tailable = true;                                                                      // 750
    // ... and for the server to wait a bit if any getMore has no data (rather                         // 751
    // than making us put the relevant sleeps in the client)...                                        // 752
    mongoOptions.awaitdata = true;                                                                     // 753
    // ... and to keep querying the server indefinitely rather than just 5 times                       // 754
    // if there's no more data.                                                                        // 755
    mongoOptions.numberOfRetries = -1;                                                                 // 756
    // And if this cursor specifies a 'ts', then set the undocumented oplog                            // 757
    // replay flag, which does a special scan to find the first document                               // 758
    // (instead of creating an index on ts).                                                           // 759
    if (cursorDescription.selector.ts)                                                                 // 760
      mongoOptions.oplogReplay = true;                                                                 // 761
  }                                                                                                    // 762
                                                                                                       // 763
  var dbCursor = collection.find(                                                                      // 764
    replaceTypes(cursorDescription.selector, replaceMeteorAtomWithMongo),                              // 765
    cursorOptions.fields, mongoOptions);                                                               // 766
                                                                                                       // 767
  return new SynchronousCursor(dbCursor, cursorDescription, options);                                  // 768
};                                                                                                     // 769
                                                                                                       // 770
var SynchronousCursor = function (dbCursor, cursorDescription, options) {                              // 771
  var self = this;                                                                                     // 772
  options = _.pick(options || {}, 'selfForIteration', 'useTransform');                                 // 773
                                                                                                       // 774
  self._dbCursor = dbCursor;                                                                           // 775
  self._cursorDescription = cursorDescription;                                                         // 776
  // The "self" argument passed to forEach/map callbacks. If we're wrapped                             // 777
  // inside a user-visible Cursor, we want to provide the outer cursor!                                // 778
  self._selfForIteration = options.selfForIteration || self;                                           // 779
  if (options.useTransform && cursorDescription.options.transform) {                                   // 780
    self._transform = LocalCollection.wrapTransform(                                                   // 781
      cursorDescription.options.transform);                                                            // 782
  } else {                                                                                             // 783
    self._transform = null;                                                                            // 784
  }                                                                                                    // 785
                                                                                                       // 786
  // Need to specify that the callback is the first argument to nextObject,                            // 787
  // since otherwise when we try to call it with no args the driver will                               // 788
  // interpret "undefined" first arg as an options hash and crash.                                     // 789
  self._synchronousNextObject = Future.wrap(                                                           // 790
    dbCursor.nextObject.bind(dbCursor), 0);                                                            // 791
  self._synchronousCount = Future.wrap(dbCursor.count.bind(dbCursor));                                 // 792
  self._visitedIds = new LocalCollection._IdMap;                                                       // 793
};                                                                                                     // 794
                                                                                                       // 795
_.extend(SynchronousCursor.prototype, {                                                                // 796
  _nextObject: function () {                                                                           // 797
    var self = this;                                                                                   // 798
                                                                                                       // 799
    while (true) {                                                                                     // 800
      var doc = self._synchronousNextObject().wait();                                                  // 801
                                                                                                       // 802
      if (!doc) return null;                                                                           // 803
      doc = replaceTypes(doc, replaceMongoAtomWithMeteor);                                             // 804
                                                                                                       // 805
      if (!self._cursorDescription.options.tailable && _.has(doc, '_id')) {                            // 806
        // Did Mongo give us duplicate documents in the same cursor? If so,                            // 807
        // ignore this one. (Do this before the transform, since transform might                       // 808
        // return some unrelated value.) We don't do this for tailable cursors,                        // 809
        // because we want to maintain O(1) memory usage. And if there isn't _id                       // 810
        // for some reason (maybe it's the oplog), then we don't do this either.                       // 811
        // (Be careful to do this for falsey but existing _id, though.)                                // 812
        if (self._visitedIds.has(doc._id)) continue;                                                   // 813
        self._visitedIds.set(doc._id, true);                                                           // 814
      }                                                                                                // 815
                                                                                                       // 816
      if (self._transform)                                                                             // 817
        doc = self._transform(doc);                                                                    // 818
                                                                                                       // 819
      return doc;                                                                                      // 820
    }                                                                                                  // 821
  },                                                                                                   // 822
                                                                                                       // 823
  forEach: function (callback, thisArg) {                                                              // 824
    var self = this;                                                                                   // 825
                                                                                                       // 826
    // We implement the loop ourself instead of using self._dbCursor.each,                             // 827
    // because "each" will call its callback outside of a fiber which makes it                         // 828
    // much more complex to make this function synchronous.                                            // 829
    var index = 0;                                                                                     // 830
    while (true) {                                                                                     // 831
      var doc = self._nextObject();                                                                    // 832
      if (!doc) return;                                                                                // 833
      callback.call(thisArg, doc, index++, self._selfForIteration);                                    // 834
    }                                                                                                  // 835
  },                                                                                                   // 836
                                                                                                       // 837
  // XXX Allow overlapping callback executions if callback yields.                                     // 838
  map: function (callback, thisArg) {                                                                  // 839
    var self = this;                                                                                   // 840
    var res = [];                                                                                      // 841
    self.forEach(function (doc, index) {                                                               // 842
      res.push(callback.call(thisArg, doc, index, self._selfForIteration));                            // 843
    });                                                                                                // 844
    return res;                                                                                        // 845
  },                                                                                                   // 846
                                                                                                       // 847
  rewind: function () {                                                                                // 848
    var self = this;                                                                                   // 849
                                                                                                       // 850
    // known to be synchronous                                                                         // 851
    self._dbCursor.rewind();                                                                           // 852
                                                                                                       // 853
    self._visitedIds = new LocalCollection._IdMap;                                                     // 854
  },                                                                                                   // 855
                                                                                                       // 856
  // Mostly usable for tailable cursors.                                                               // 857
  close: function () {                                                                                 // 858
    var self = this;                                                                                   // 859
                                                                                                       // 860
    self._dbCursor.close();                                                                            // 861
  },                                                                                                   // 862
                                                                                                       // 863
  fetch: function () {                                                                                 // 864
    var self = this;                                                                                   // 865
    return self.map(_.identity);                                                                       // 866
  },                                                                                                   // 867
                                                                                                       // 868
  count: function () {                                                                                 // 869
    var self = this;                                                                                   // 870
    return self._synchronousCount().wait();                                                            // 871
  },                                                                                                   // 872
                                                                                                       // 873
  // This method is NOT wrapped in Cursor.                                                             // 874
  getRawObjects: function (ordered) {                                                                  // 875
    var self = this;                                                                                   // 876
    if (ordered) {                                                                                     // 877
      return self.fetch();                                                                             // 878
    } else {                                                                                           // 879
      var results = new LocalCollection._IdMap;                                                        // 880
      self.forEach(function (doc) {                                                                    // 881
        results.set(doc._id, doc);                                                                     // 882
      });                                                                                              // 883
      return results;                                                                                  // 884
    }                                                                                                  // 885
  }                                                                                                    // 886
});                                                                                                    // 887
                                                                                                       // 888
MongoConnection.prototype.tail = function (cursorDescription, docCallback) {                           // 889
  var self = this;                                                                                     // 890
  if (!cursorDescription.options.tailable)                                                             // 891
    throw new Error("Can only tail a tailable cursor");                                                // 892
                                                                                                       // 893
  var cursor = self._createSynchronousCursor(cursorDescription);                                       // 894
                                                                                                       // 895
  var stopped = false;                                                                                 // 896
  var lastTS = undefined;                                                                              // 897
  var loop = function () {                                                                             // 898
    while (true) {                                                                                     // 899
      if (stopped)                                                                                     // 900
        return;                                                                                        // 901
      try {                                                                                            // 902
        var doc = cursor._nextObject();                                                                // 903
      } catch (err) {                                                                                  // 904
        // There's no good way to figure out if this was actually an error                             // 905
        // from Mongo. Ah well. But either way, we need to retry the cursor                            // 906
        // (unless the failure was because the observe got stopped).                                   // 907
        doc = null;                                                                                    // 908
      }                                                                                                // 909
      // Since cursor._nextObject can yield, we need to check again to see if                          // 910
      // we've been stopped before calling the callback.                                               // 911
      if (stopped)                                                                                     // 912
        return;                                                                                        // 913
      if (doc) {                                                                                       // 914
        // If a tailable cursor contains a "ts" field, use it to recreate the                          // 915
        // cursor on error. ("ts" is a standard that Mongo uses internally for                         // 916
        // the oplog, and there's a special flag that lets you do binary search                        // 917
        // on it instead of needing to use an index.)                                                  // 918
        lastTS = doc.ts;                                                                               // 919
        docCallback(doc);                                                                              // 920
      } else {                                                                                         // 921
        var newSelector = _.clone(cursorDescription.selector);                                         // 922
        if (lastTS) {                                                                                  // 923
          newSelector.ts = {$gt: lastTS};                                                              // 924
        }                                                                                              // 925
        cursor = self._createSynchronousCursor(new CursorDescription(                                  // 926
          cursorDescription.collectionName,                                                            // 927
          newSelector,                                                                                 // 928
          cursorDescription.options));                                                                 // 929
        // Mongo failover takes many seconds.  Retry in a bit.  (Without this                          // 930
        // setTimeout, we peg the CPU at 100% and never notice the actual                              // 931
        // failover.                                                                                   // 932
        Meteor.setTimeout(loop, 100);                                                                  // 933
        break;                                                                                         // 934
      }                                                                                                // 935
    }                                                                                                  // 936
  };                                                                                                   // 937
                                                                                                       // 938
  Meteor.defer(loop);                                                                                  // 939
                                                                                                       // 940
  return {                                                                                             // 941
    stop: function () {                                                                                // 942
      stopped = true;                                                                                  // 943
      cursor.close();                                                                                  // 944
    }                                                                                                  // 945
  };                                                                                                   // 946
};                                                                                                     // 947
                                                                                                       // 948
MongoConnection.prototype._observeChanges = function (                                                 // 949
    cursorDescription, ordered, callbacks) {                                                           // 950
  var self = this;                                                                                     // 951
                                                                                                       // 952
  if (cursorDescription.options.tailable) {                                                            // 953
    return self._observeChangesTailable(cursorDescription, ordered, callbacks);                        // 954
  }                                                                                                    // 955
                                                                                                       // 956
  // You may not filter out _id when observing changes, because the id is a core                       // 957
  // part of the observeChanges API.                                                                   // 958
  if (cursorDescription.options.fields &&                                                              // 959
      (cursorDescription.options.fields._id === 0 ||                                                   // 960
       cursorDescription.options.fields._id === false)) {                                              // 961
    throw Error("You may not observe a cursor with {fields: {_id: 0}}");                               // 962
  }                                                                                                    // 963
                                                                                                       // 964
  var observeKey = JSON.stringify(                                                                     // 965
    _.extend({ordered: ordered}, cursorDescription));                                                  // 966
                                                                                                       // 967
  var multiplexer, observeDriver;                                                                      // 968
  var firstHandle = false;                                                                             // 969
                                                                                                       // 970
  // Find a matching ObserveMultiplexer, or create a new one. This next block is                       // 971
  // guaranteed to not yield (and it doesn't call anything that can observe a                          // 972
  // new query), so no other calls to this function can interleave with it.                            // 973
  Meteor._noYieldsAllowed(function () {                                                                // 974
    if (_.has(self._observeMultiplexers, observeKey)) {                                                // 975
      multiplexer = self._observeMultiplexers[observeKey];                                             // 976
    } else {                                                                                           // 977
      firstHandle = true;                                                                              // 978
      // Create a new ObserveMultiplexer.                                                              // 979
      multiplexer = new ObserveMultiplexer({                                                           // 980
        ordered: ordered,                                                                              // 981
        onStop: function () {                                                                          // 982
          observeDriver.stop();                                                                        // 983
          delete self._observeMultiplexers[observeKey];                                                // 984
        }                                                                                              // 985
      });                                                                                              // 986
      self._observeMultiplexers[observeKey] = multiplexer;                                             // 987
    }                                                                                                  // 988
  });                                                                                                  // 989
                                                                                                       // 990
  var observeHandle = new ObserveHandle(multiplexer, callbacks);                                       // 991
                                                                                                       // 992
  if (firstHandle) {                                                                                   // 993
    var driverClass = PollingObserveDriver;                                                            // 994
    var matcher;                                                                                       // 995
    if (self._oplogHandle && !ordered && !callbacks._testOnlyPollCallback) {                           // 996
      try {                                                                                            // 997
        matcher = new Minimongo.Matcher(cursorDescription.selector);                                   // 998
      } catch (e) {                                                                                    // 999
        // Ignore and avoid oplog driver. eg, maybe we're trying to compile some                       // 1000
        // newfangled $selector that minimongo doesn't support yet.                                    // 1001
        // XXX make all compilation errors MinimongoError or something                                 // 1002
        //     so that this doesn't ignore unrelated exceptions                                        // 1003
      }                                                                                                // 1004
      if (matcher                                                                                      // 1005
          && OplogObserveDriver.cursorSupported(cursorDescription, matcher)) {                         // 1006
        driverClass = OplogObserveDriver;                                                              // 1007
      }                                                                                                // 1008
    }                                                                                                  // 1009
    observeDriver = new driverClass({                                                                  // 1010
      cursorDescription: cursorDescription,                                                            // 1011
      mongoHandle: self,                                                                               // 1012
      multiplexer: multiplexer,                                                                        // 1013
      ordered: ordered,                                                                                // 1014
      matcher: matcher,  // ignored by polling                                                         // 1015
      _testOnlyPollCallback: callbacks._testOnlyPollCallback                                           // 1016
    });                                                                                                // 1017
                                                                                                       // 1018
    // This field is only set for use in tests.                                                        // 1019
    multiplexer._observeDriver = observeDriver;                                                        // 1020
  }                                                                                                    // 1021
                                                                                                       // 1022
  // Blocks until the initial adds have been sent.                                                     // 1023
  multiplexer.addHandleAndSendInitialAdds(observeHandle);                                              // 1024
                                                                                                       // 1025
  return observeHandle;                                                                                // 1026
};                                                                                                     // 1027
                                                                                                       // 1028
// Listen for the invalidation messages that will trigger us to poll the                               // 1029
// database for changes. If this selector specifies specific IDs, specify them                         // 1030
// here, so that updates to different specific IDs don't cause us to poll.                             // 1031
// listenCallback is the same kind of (notification, complete) callback passed                         // 1032
// to InvalidationCrossbar.listen.                                                                     // 1033
                                                                                                       // 1034
listenAll = function (cursorDescription, listenCallback) {                                             // 1035
  var listeners = [];                                                                                  // 1036
  forEachTrigger(cursorDescription, function (trigger) {                                               // 1037
    listeners.push(DDPServer._InvalidationCrossbar.listen(                                             // 1038
      trigger, listenCallback));                                                                       // 1039
  });                                                                                                  // 1040
                                                                                                       // 1041
  return {                                                                                             // 1042
    stop: function () {                                                                                // 1043
      _.each(listeners, function (listener) {                                                          // 1044
        listener.stop();                                                                               // 1045
      });                                                                                              // 1046
    }                                                                                                  // 1047
  };                                                                                                   // 1048
};                                                                                                     // 1049
                                                                                                       // 1050
forEachTrigger = function (cursorDescription, triggerCallback) {                                       // 1051
  var key = {collection: cursorDescription.collectionName};                                            // 1052
  var specificIds = LocalCollection._idsMatchedBySelector(                                             // 1053
    cursorDescription.selector);                                                                       // 1054
  if (specificIds) {                                                                                   // 1055
    _.each(specificIds, function (id) {                                                                // 1056
      triggerCallback(_.extend({id: id}, key));                                                        // 1057
    });                                                                                                // 1058
    triggerCallback(_.extend({dropCollection: true, id: null}, key));                                  // 1059
  } else {                                                                                             // 1060
    triggerCallback(key);                                                                              // 1061
  }                                                                                                    // 1062
};                                                                                                     // 1063
                                                                                                       // 1064
// observeChanges for tailable cursors on capped collections.                                          // 1065
//                                                                                                     // 1066
// Some differences from normal cursors:                                                               // 1067
//   - Will never produce anything other than 'added' or 'addedBefore'. If you                         // 1068
//     do update a document that has already been produced, this will not notice                       // 1069
//     it.                                                                                             // 1070
//   - If you disconnect and reconnect from Mongo, it will essentially restart                         // 1071
//     the query, which will lead to duplicate results. This is pretty bad,                            // 1072
//     but if you include a field called 'ts' which is inserted as                                     // 1073
//     new MongoInternals.MongoTimestamp(0, 0) (which is initialized to the                            // 1074
//     current Mongo-style timestamp), we'll be able to find the place to                              // 1075
//     restart properly. (This field is specifically understood by Mongo with an                       // 1076
//     optimization which allows it to find the right place to start without                           // 1077
//     an index on ts. It's how the oplog works.)                                                      // 1078
//   - No callbacks are triggered synchronously with the call (there's no                              // 1079
//     differentiation between "initial data" and "later changes"; everything                          // 1080
//     that matches the query gets sent asynchronously).                                               // 1081
//   - De-duplication is not implemented.                                                              // 1082
//   - Does not yet interact with the write fence. Probably, this should work by                       // 1083
//     ignoring removes (which don't work on capped collections) and updates                           // 1084
//     (which don't affect tailable cursors), and just keeping track of the ID                         // 1085
//     of the inserted object, and closing the write fence once you get to that                        // 1086
//     ID (or timestamp?).  This doesn't work well if the document doesn't match                       // 1087
//     the query, though.  On the other hand, the write fence can close                                // 1088
//     immediately if it does not match the query. So if we trust minimongo                            // 1089
//     enough to accurately evaluate the query against the write fence, we                             // 1090
//     should be able to do this...  Of course, minimongo doesn't even support                         // 1091
//     Mongo Timestamps yet.                                                                           // 1092
MongoConnection.prototype._observeChangesTailable = function (                                         // 1093
    cursorDescription, ordered, callbacks) {                                                           // 1094
  var self = this;                                                                                     // 1095
                                                                                                       // 1096
  // Tailable cursors only ever call added/addedBefore callbacks, so it's an                           // 1097
  // error if you didn't provide them.                                                                 // 1098
  if ((ordered && !callbacks.addedBefore) ||                                                           // 1099
      (!ordered && !callbacks.added)) {                                                                // 1100
    throw new Error("Can't observe an " + (ordered ? "ordered" : "unordered")                          // 1101
                    + " tailable cursor without a "                                                    // 1102
                    + (ordered ? "addedBefore" : "added") + " callback");                              // 1103
  }                                                                                                    // 1104
                                                                                                       // 1105
  return self.tail(cursorDescription, function (doc) {                                                 // 1106
    var id = doc._id;                                                                                  // 1107
    delete doc._id;                                                                                    // 1108
    // The ts is an implementation detail. Hide it.                                                    // 1109
    delete doc.ts;                                                                                     // 1110
    if (ordered) {                                                                                     // 1111
      callbacks.addedBefore(id, doc, null);                                                            // 1112
    } else {                                                                                           // 1113
      callbacks.added(id, doc);                                                                        // 1114
    }                                                                                                  // 1115
  });                                                                                                  // 1116
};                                                                                                     // 1117
                                                                                                       // 1118
// XXX We probably need to find a better way to expose this. Right now                                 // 1119
// it's only used by tests, but in fact you need it in normal                                          // 1120
// operation to interact with capped collections (eg, Galaxy uses it).                                 // 1121
MongoInternals.MongoTimestamp = MongoDB.Timestamp;                                                     // 1122
                                                                                                       // 1123
MongoInternals.Connection = MongoConnection;                                                           // 1124
MongoInternals.NpmModule = MongoDB;                                                                    // 1125
                                                                                                       // 1126
/////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// packages/mongo-livedata/oplog_tailing.js                                                            //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
var Future = Npm.require('fibers/future');                                                             // 1
                                                                                                       // 2
var OPLOG_COLLECTION = 'oplog.rs';                                                                     // 3
var REPLSET_COLLECTION = 'system.replset';                                                             // 4
                                                                                                       // 5
// Like Perl's quotemeta: quotes all regexp metacharacters. See                                        // 6
//   https://github.com/substack/quotemeta/blob/master/index.js                                        // 7
// XXX this is duplicated with accounts_server.js                                                      // 8
var quotemeta = function (str) {                                                                       // 9
    return String(str).replace(/(\W)/g, '\\$1');                                                       // 10
};                                                                                                     // 11
                                                                                                       // 12
var showTS = function (ts) {                                                                           // 13
  return "Timestamp(" + ts.getHighBits() + ", " + ts.getLowBits() + ")";                               // 14
};                                                                                                     // 15
                                                                                                       // 16
idForOp = function (op) {                                                                              // 17
  if (op.op === 'd')                                                                                   // 18
    return op.o._id;                                                                                   // 19
  else if (op.op === 'i')                                                                              // 20
    return op.o._id;                                                                                   // 21
  else if (op.op === 'u')                                                                              // 22
    return op.o2._id;                                                                                  // 23
  else if (op.op === 'c')                                                                              // 24
    throw Error("Operator 'c' doesn't supply an object with id: " +                                    // 25
                EJSON.stringify(op));                                                                  // 26
  else                                                                                                 // 27
    throw Error("Unknown op: " + EJSON.stringify(op));                                                 // 28
};                                                                                                     // 29
                                                                                                       // 30
OplogHandle = function (oplogUrl, dbName) {                                                            // 31
  var self = this;                                                                                     // 32
  self._oplogUrl = oplogUrl;                                                                           // 33
  self._dbName = dbName;                                                                               // 34
                                                                                                       // 35
  self._oplogLastEntryConnection = null;                                                               // 36
  self._oplogTailConnection = null;                                                                    // 37
  self._stopped = false;                                                                               // 38
  self._tailHandle = null;                                                                             // 39
  self._readyFuture = new Future();                                                                    // 40
  self._crossbar = new DDPServer._Crossbar({                                                           // 41
    factPackage: "mongo-livedata", factName: "oplog-watchers"                                          // 42
  });                                                                                                  // 43
  self._lastProcessedTS = null;                                                                        // 44
  self._baseOplogSelector = {                                                                          // 45
    ns: new RegExp('^' + quotemeta(self._dbName) + '\\.'),                                             // 46
    $or: [                                                                                             // 47
      { op: {$in: ['i', 'u', 'd']} },                                                                  // 48
      // If it is not db.collection.drop(), ignore it                                                  // 49
      { op: 'c', 'o.drop': { $exists: true } }]                                                        // 50
  };                                                                                                   // 51
  // XXX doc                                                                                           // 52
  self._catchingUpFutures = [];                                                                        // 53
                                                                                                       // 54
  self._startTailing();                                                                                // 55
};                                                                                                     // 56
                                                                                                       // 57
_.extend(OplogHandle.prototype, {                                                                      // 58
  stop: function () {                                                                                  // 59
    var self = this;                                                                                   // 60
    if (self._stopped)                                                                                 // 61
      return;                                                                                          // 62
    self._stopped = true;                                                                              // 63
    if (self._tailHandle)                                                                              // 64
      self._tailHandle.stop();                                                                         // 65
    // XXX should close connections too                                                                // 66
  },                                                                                                   // 67
  onOplogEntry: function (trigger, callback) {                                                         // 68
    var self = this;                                                                                   // 69
    if (self._stopped)                                                                                 // 70
      throw new Error("Called onOplogEntry on stopped handle!");                                       // 71
                                                                                                       // 72
    // Calling onOplogEntry requires us to wait for the tailing to be ready.                           // 73
    self._readyFuture.wait();                                                                          // 74
                                                                                                       // 75
    var originalCallback = callback;                                                                   // 76
    callback = Meteor.bindEnvironment(function (notification) {                                        // 77
      // XXX can we avoid this clone by making oplog.js careful?                                       // 78
      originalCallback(EJSON.clone(notification));                                                     // 79
    }, function (err) {                                                                                // 80
      Meteor._debug("Error in oplog callback", err.stack);                                             // 81
    });                                                                                                // 82
    var listenHandle = self._crossbar.listen(trigger, callback);                                       // 83
    return {                                                                                           // 84
      stop: function () {                                                                              // 85
        listenHandle.stop();                                                                           // 86
      }                                                                                                // 87
    };                                                                                                 // 88
  },                                                                                                   // 89
  // Calls `callback` once the oplog has been processed up to a point that is                          // 90
  // roughly "now": specifically, once we've processed all ops that are                                // 91
  // currently visible.                                                                                // 92
  // XXX become convinced that this is actually safe even if oplogConnection                           // 93
  // is some kind of pool                                                                              // 94
  waitUntilCaughtUp: function () {                                                                     // 95
    var self = this;                                                                                   // 96
    if (self._stopped)                                                                                 // 97
      throw new Error("Called waitUntilCaughtUp on stopped handle!");                                  // 98
                                                                                                       // 99
    // Calling waitUntilCaughtUp requries us to wait for the oplog connection to                       // 100
    // be ready.                                                                                       // 101
    self._readyFuture.wait();                                                                          // 102
                                                                                                       // 103
    // We need to make the selector at least as restrictive as the actual                              // 104
    // tailing selector (ie, we need to specify the DB name) or else we might                          // 105
    // find a TS that won't show up in the actual tail stream.                                         // 106
    var lastEntry = self._oplogLastEntryConnection.findOne(                                            // 107
      OPLOG_COLLECTION, self._baseOplogSelector,                                                       // 108
      {fields: {ts: 1}, sort: {$natural: -1}});                                                        // 109
                                                                                                       // 110
    if (!lastEntry) {                                                                                  // 111
      // Really, nothing in the oplog? Well, we've processed everything.                               // 112
      return;                                                                                          // 113
    }                                                                                                  // 114
                                                                                                       // 115
    var ts = lastEntry.ts;                                                                             // 116
    if (!ts)                                                                                           // 117
      throw Error("oplog entry without ts: " + EJSON.stringify(lastEntry));                            // 118
                                                                                                       // 119
    if (self._lastProcessedTS && ts.lessThanOrEqual(self._lastProcessedTS)) {                          // 120
      // We've already caught up to here.                                                              // 121
      return;                                                                                          // 122
    }                                                                                                  // 123
                                                                                                       // 124
                                                                                                       // 125
    // Insert the future into our list. Almost always, this will be at the end,                        // 126
    // but it's conceivable that if we fail over from one primary to another,                          // 127
    // the oplog entries we see will go backwards.                                                     // 128
    var insertAfter = self._catchingUpFutures.length;                                                  // 129
    while (insertAfter - 1 > 0                                                                         // 130
           && self._catchingUpFutures[insertAfter - 1].ts.greaterThan(ts)) {                           // 131
      insertAfter--;                                                                                   // 132
    }                                                                                                  // 133
    var f = new Future;                                                                                // 134
    self._catchingUpFutures.splice(insertAfter, 0, {ts: ts, future: f});                               // 135
    f.wait();                                                                                          // 136
  },                                                                                                   // 137
  _startTailing: function () {                                                                         // 138
    var self = this;                                                                                   // 139
    // We make two separate connections to Mongo. The Node Mongo driver                                // 140
    // implements a naive round-robin connection pool: each "connection" is a                          // 141
    // pool of several (5 by default) TCP connections, and each request is                             // 142
    // rotated through the pools. Tailable cursor queries block on the server                          // 143
    // until there is some data to return (or until a few seconds have                                 // 144
    // passed). So if the connection pool used for tailing cursors is the same                         // 145
    // pool used for other queries, the other queries will be delayed by seconds                       // 146
    // 1/5 of the time.                                                                                // 147
    //                                                                                                 // 148
    // The tail connection will only ever be running a single tail command, so                         // 149
    // it only needs to make one underlying TCP connection.                                            // 150
    self._oplogTailConnection = new MongoConnection(                                                   // 151
      self._oplogUrl, {poolSize: 1});                                                                  // 152
    // XXX better docs, but: it's to get monotonic results                                             // 153
    // XXX is it safe to say "if there's an in flight query, just use its                              // 154
    //     results"? I don't think so but should consider that                                         // 155
    self._oplogLastEntryConnection = new MongoConnection(                                              // 156
      self._oplogUrl, {poolSize: 1});                                                                  // 157
                                                                                                       // 158
    // First, make sure that there actually is a repl set here. If not, oplog                          // 159
    // tailing won't ever find anything! (Blocks until the connection is ready.)                       // 160
    var replSetInfo = self._oplogLastEntryConnection.findOne(                                          // 161
      REPLSET_COLLECTION, {});                                                                         // 162
    if (!replSetInfo)                                                                                  // 163
      throw Error("$MONGO_OPLOG_URL must be set to the 'local' database of " +                         // 164
                  "a Mongo replica set");                                                              // 165
                                                                                                       // 166
    // Find the last oplog entry.                                                                      // 167
    var lastOplogEntry = self._oplogLastEntryConnection.findOne(                                       // 168
      OPLOG_COLLECTION, {}, {sort: {$natural: -1}});                                                   // 169
                                                                                                       // 170
    var oplogSelector = _.clone(self._baseOplogSelector);                                              // 171
    if (lastOplogEntry) {                                                                              // 172
      // Start after the last entry that currently exists.                                             // 173
      oplogSelector.ts = {$gt: lastOplogEntry.ts};                                                     // 174
      // If there are any calls to callWhenProcessedLatest before any other                            // 175
      // oplog entries show up, allow callWhenProcessedLatest to call its                              // 176
      // callback immediately.                                                                         // 177
      self._lastProcessedTS = lastOplogEntry.ts;                                                       // 178
    }                                                                                                  // 179
                                                                                                       // 180
    var cursorDescription = new CursorDescription(                                                     // 181
      OPLOG_COLLECTION, oplogSelector, {tailable: true});                                              // 182
                                                                                                       // 183
    self._tailHandle = self._oplogTailConnection.tail(                                                 // 184
      cursorDescription, function (doc) {                                                              // 185
        if (!(doc.ns && doc.ns.length > self._dbName.length + 1 &&                                     // 186
              doc.ns.substr(0, self._dbName.length + 1) ===                                            // 187
              (self._dbName + '.'))) {                                                                 // 188
          throw new Error("Unexpected ns");                                                            // 189
        }                                                                                              // 190
                                                                                                       // 191
        var trigger = {collection: doc.ns.substr(self._dbName.length + 1),                             // 192
                       dropCollection: false,                                                          // 193
                       op: doc};                                                                       // 194
                                                                                                       // 195
        // Is it a special command and the collection name is hidden somewhere                         // 196
        // in operator?                                                                                // 197
        if (trigger.collection === "$cmd") {                                                           // 198
          trigger.collection = doc.o.drop;                                                             // 199
          trigger.dropCollection = true;                                                               // 200
          trigger.id = null;                                                                           // 201
        } else {                                                                                       // 202
          // All other ops have an id.                                                                 // 203
          trigger.id = idForOp(doc);                                                                   // 204
        }                                                                                              // 205
                                                                                                       // 206
        self._crossbar.fire(trigger);                                                                  // 207
                                                                                                       // 208
        // Now that we've processed this operation, process pending sequencers.                        // 209
        if (!doc.ts)                                                                                   // 210
          throw Error("oplog entry without ts: " + EJSON.stringify(doc));                              // 211
        self._lastProcessedTS = doc.ts;                                                                // 212
        while (!_.isEmpty(self._catchingUpFutures)                                                     // 213
               && self._catchingUpFutures[0].ts.lessThanOrEqual(                                       // 214
                 self._lastProcessedTS)) {                                                             // 215
          var sequencer = self._catchingUpFutures.shift();                                             // 216
          sequencer.future.return();                                                                   // 217
        }                                                                                              // 218
      });                                                                                              // 219
    self._readyFuture.return();                                                                        // 220
  }                                                                                                    // 221
});                                                                                                    // 222
                                                                                                       // 223
/////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// packages/mongo-livedata/observe_multiplex.js                                                        //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
var Future = Npm.require('fibers/future');                                                             // 1
                                                                                                       // 2
ObserveMultiplexer = function (options) {                                                              // 3
  var self = this;                                                                                     // 4
                                                                                                       // 5
  if (!options || !_.has(options, 'ordered'))                                                          // 6
    throw Error("must specified ordered");                                                             // 7
                                                                                                       // 8
  Package.facts && Package.facts.Facts.incrementServerFact(                                            // 9
    "mongo-livedata", "observe-multiplexers", 1);                                                      // 10
                                                                                                       // 11
  self._ordered = options.ordered;                                                                     // 12
  self._onStop = options.onStop || function () {};                                                     // 13
  self._queue = new Meteor._SynchronousQueue();                                                        // 14
  self._handles = {};                                                                                  // 15
  self._readyFuture = new Future;                                                                      // 16
  self._cache = new LocalCollection._CachingChangeObserver({                                           // 17
    ordered: options.ordered});                                                                        // 18
  // Number of addHandleAndSendInitialAdds tasks scheduled but not yet                                 // 19
  // running. removeHandle uses this to know if it's time to call the onStop                           // 20
  // callback.                                                                                         // 21
  self._addHandleTasksScheduledButNotPerformed = 0;                                                    // 22
                                                                                                       // 23
  _.each(self.callbackNames(), function (callbackName) {                                               // 24
    self[callbackName] = function (/* ... */) {                                                        // 25
      self._applyCallback(callbackName, _.toArray(arguments));                                         // 26
    };                                                                                                 // 27
  });                                                                                                  // 28
};                                                                                                     // 29
                                                                                                       // 30
_.extend(ObserveMultiplexer.prototype, {                                                               // 31
  addHandleAndSendInitialAdds: function (handle) {                                                     // 32
    var self = this;                                                                                   // 33
                                                                                                       // 34
    // Check this before calling runTask (even though runTask does the same                            // 35
    // check) so that we don't leak an ObserveMultiplexer on error by                                  // 36
    // incrementing _addHandleTasksScheduledButNotPerformed and never                                  // 37
    // decrementing it.                                                                                // 38
    if (!self._queue.safeToRunTask())                                                                  // 39
      throw new Error(                                                                                 // 40
        "Can't call observeChanges from an observe callback on the same query");                       // 41
    ++self._addHandleTasksScheduledButNotPerformed;                                                    // 42
                                                                                                       // 43
    Package.facts && Package.facts.Facts.incrementServerFact(                                          // 44
      "mongo-livedata", "observe-handles", 1);                                                         // 45
                                                                                                       // 46
    self._queue.runTask(function () {                                                                  // 47
      self._handles[handle._id] = handle;                                                              // 48
      // Send out whatever adds we have so far (whether or not we the                                  // 49
      // multiplexer is ready).                                                                        // 50
      self._sendAdds(handle);                                                                          // 51
      --self._addHandleTasksScheduledButNotPerformed;                                                  // 52
    });                                                                                                // 53
    // *outside* the task, since otherwise we'd deadlock                                               // 54
    self._readyFuture.wait();                                                                          // 55
  },                                                                                                   // 56
                                                                                                       // 57
  // Remove an observe handle. If it was the last observe handle, call the                             // 58
  // onStop callback; you cannot add any more observe handles after this.                              // 59
  //                                                                                                   // 60
  // This is not synchronized with polls and handle additions: this means that                         // 61
  // you can safely call it from within an observe callback, but it also means                         // 62
  // that we have to be careful when we iterate over _handles.                                         // 63
  removeHandle: function (id) {                                                                        // 64
    var self = this;                                                                                   // 65
                                                                                                       // 66
    // This should not be possible: you can only call removeHandle by having                           // 67
    // access to the ObserveHandle, which isn't returned to user code until the                        // 68
    // multiplex is ready.                                                                             // 69
    if (!self._ready())                                                                                // 70
      throw new Error("Can't remove handles until the multiplex is ready");                            // 71
                                                                                                       // 72
    delete self._handles[id];                                                                          // 73
                                                                                                       // 74
    Package.facts && Package.facts.Facts.incrementServerFact(                                          // 75
      "mongo-livedata", "observe-handles", -1);                                                        // 76
                                                                                                       // 77
    if (_.isEmpty(self._handles) &&                                                                    // 78
        self._addHandleTasksScheduledButNotPerformed === 0) {                                          // 79
      self._stop();                                                                                    // 80
    }                                                                                                  // 81
  },                                                                                                   // 82
  _stop: function () {                                                                                 // 83
    var self = this;                                                                                   // 84
    // It shouldn't be possible for us to stop when all our handles still                              // 85
    // haven't been returned from observeChanges!                                                      // 86
    if (!self._ready())                                                                                // 87
      throw Error("surprising _stop: not ready");                                                      // 88
                                                                                                       // 89
    // Call stop callback (which kills the underlying process which sends us                           // 90
    // callbacks and removes us from the connection's dictionary).                                     // 91
    self._onStop();                                                                                    // 92
    Package.facts && Package.facts.Facts.incrementServerFact(                                          // 93
      "mongo-livedata", "observe-multiplexers", -1);                                                   // 94
                                                                                                       // 95
    // Cause future addHandleAndSendInitialAdds calls to throw (but the onStop                         // 96
    // callback should make our connection forget about us).                                           // 97
    self._handles = null;                                                                              // 98
  },                                                                                                   // 99
  // Allows all addHandleAndSendInitialAdds calls to return, once all preceding                        // 100
  // adds have been processed. Does not block.                                                         // 101
  ready: function () {                                                                                 // 102
    var self = this;                                                                                   // 103
    self._queue.queueTask(function () {                                                                // 104
      if (self._ready())                                                                               // 105
        throw Error("can't make ObserveMultiplex ready twice!");                                       // 106
      self._readyFuture.return();                                                                      // 107
    });                                                                                                // 108
  },                                                                                                   // 109
  // Calls "cb" once the effects of all "ready", "addHandleAndSendInitialAdds"                         // 110
  // and observe callbacks which came before this call have been propagated to                         // 111
  // all handles. "ready" must have already been called on this multiplexer.                           // 112
  onFlush: function (cb) {                                                                             // 113
    var self = this;                                                                                   // 114
    self._queue.queueTask(function () {                                                                // 115
      if (!self._ready())                                                                              // 116
        throw Error("only call onFlush on a multiplexer that will be ready");                          // 117
      cb();                                                                                            // 118
    });                                                                                                // 119
  },                                                                                                   // 120
  callbackNames: function () {                                                                         // 121
    var self = this;                                                                                   // 122
    if (self._ordered)                                                                                 // 123
      return ["addedBefore", "changed", "movedBefore", "removed"];                                     // 124
    else                                                                                               // 125
      return ["added", "changed", "removed"];                                                          // 126
  },                                                                                                   // 127
  _ready: function () {                                                                                // 128
    return this._readyFuture.isResolved();                                                             // 129
  },                                                                                                   // 130
  _applyCallback: function (callbackName, args) {                                                      // 131
    var self = this;                                                                                   // 132
    self._queue.queueTask(function () {                                                                // 133
      // First, apply the change to the cache.                                                         // 134
      // XXX We could make applyChange callbacks promise not to hang on to any                         // 135
      // state from their arguments (assuming that their supplied callbacks                            // 136
      // don't) and skip this clone. Currently 'changed' hangs on to state                             // 137
      // though.                                                                                       // 138
      self._cache.applyChange[callbackName].apply(null, EJSON.clone(args));                            // 139
                                                                                                       // 140
      // If we haven't finished the initial adds, then we should only be getting                       // 141
      // adds.                                                                                         // 142
      if (!self._ready() &&                                                                            // 143
          (callbackName !== 'added' && callbackName !== 'addedBefore')) {                              // 144
        throw new Error("Got " + callbackName + " during initial adds");                               // 145
      }                                                                                                // 146
                                                                                                       // 147
      // Now multiplex the callbacks out to all observe handles. It's OK if                            // 148
      // these calls yield; since we're inside a task, no other use of our queue                       // 149
      // can continue until these are done. (But we do have to be careful to not                       // 150
      // use a handle that got removed, because removeHandle does not use the                          // 151
      // queue; thus, we iterate over an array of keys that we control.)                               // 152
      _.each(_.keys(self._handles), function (handleId) {                                              // 153
        var handle = self._handles[handleId];                                                          // 154
        if (!handle)                                                                                   // 155
          return;                                                                                      // 156
        var callback = handle['_' + callbackName];                                                     // 157
        // clone arguments so that callbacks can mutate their arguments                                // 158
        callback && callback.apply(null, EJSON.clone(args));                                           // 159
      });                                                                                              // 160
    });                                                                                                // 161
  },                                                                                                   // 162
                                                                                                       // 163
  // Sends initial adds to a handle. It should only be called from within a task                       // 164
  // (the task that is processing the addHandleAndSendInitialAdds call). It                            // 165
  // synchronously invokes the handle's added or addedBefore; there's no need to                       // 166
  // flush the queue afterwards to ensure that the callbacks get out.                                  // 167
  _sendAdds: function (handle) {                                                                       // 168
    var self = this;                                                                                   // 169
    if (self._queue.safeToRunTask())                                                                   // 170
      throw Error("_sendAdds may only be called from within a task!");                                 // 171
    var add = self._ordered ? handle._addedBefore : handle._added;                                     // 172
    if (!add)                                                                                          // 173
      return;                                                                                          // 174
    // note: docs may be an _IdMap or an OrderedDict                                                   // 175
    self._cache.docs.forEach(function (doc, id) {                                                      // 176
      if (!_.has(self._handles, handle._id))                                                           // 177
        throw Error("handle got removed before sending initial adds!");                                // 178
      var fields = EJSON.clone(doc);                                                                   // 179
      delete fields._id;                                                                               // 180
      if (self._ordered)                                                                               // 181
        add(id, fields, null); // we're going in order, so add at end                                  // 182
      else                                                                                             // 183
        add(id, fields);                                                                               // 184
    });                                                                                                // 185
  }                                                                                                    // 186
});                                                                                                    // 187
                                                                                                       // 188
                                                                                                       // 189
var nextObserveHandleId = 1;                                                                           // 190
ObserveHandle = function (multiplexer, callbacks) {                                                    // 191
  var self = this;                                                                                     // 192
  // The end user is only supposed to call stop().  The other fields are                               // 193
  // accessible to the multiplexer, though.                                                            // 194
  self._multiplexer = multiplexer;                                                                     // 195
  _.each(multiplexer.callbackNames(), function (name) {                                                // 196
    if (callbacks[name]) {                                                                             // 197
      self['_' + name] = callbacks[name];                                                              // 198
    } else if (name === "addedBefore" && callbacks.added) {                                            // 199
      // Special case: if you specify "added" and "movedBefore", you get an                            // 200
      // ordered observe where for some reason you don't get ordering data on                          // 201
      // the adds.  I dunno, we wrote tests for it, there must have been a                             // 202
      // reason.                                                                                       // 203
      self._addedBefore = function (id, fields, before) {                                              // 204
        callbacks.added(id, fields);                                                                   // 205
      };                                                                                               // 206
    }                                                                                                  // 207
  });                                                                                                  // 208
  self._stopped = false;                                                                               // 209
  self._id = nextObserveHandleId++;                                                                    // 210
};                                                                                                     // 211
ObserveHandle.prototype.stop = function () {                                                           // 212
  var self = this;                                                                                     // 213
  if (self._stopped)                                                                                   // 214
    return;                                                                                            // 215
  self._stopped = true;                                                                                // 216
  self._multiplexer.removeHandle(self._id);                                                            // 217
};                                                                                                     // 218
                                                                                                       // 219
/////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// packages/mongo-livedata/doc_fetcher.js                                                              //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
var Fiber = Npm.require('fibers');                                                                     // 1
var Future = Npm.require('fibers/future');                                                             // 2
                                                                                                       // 3
DocFetcher = function (mongoConnection) {                                                              // 4
  var self = this;                                                                                     // 5
  self._mongoConnection = mongoConnection;                                                             // 6
  // Map from cache key -> [callback]                                                                  // 7
  self._callbacksForCacheKey = {};                                                                     // 8
};                                                                                                     // 9
                                                                                                       // 10
_.extend(DocFetcher.prototype, {                                                                       // 11
  // Fetches document "id" from collectionName, returning it or null if not                            // 12
  // found.                                                                                            // 13
  //                                                                                                   // 14
  // If you make multiple calls to fetch() with the same cacheKey (a string),                          // 15
  // DocFetcher may assume that they all return the same document. (It does                            // 16
  // not check to see if collectionName/id match.)                                                     // 17
  //                                                                                                   // 18
  // You may assume that callback is never called synchronously (and in fact                           // 19
  // OplogObserveDriver does so).                                                                      // 20
  fetch: function (collectionName, id, cacheKey, callback) {                                           // 21
    var self = this;                                                                                   // 22
                                                                                                       // 23
    check(collectionName, String);                                                                     // 24
    // id is some sort of scalar                                                                       // 25
    check(cacheKey, String);                                                                           // 26
                                                                                                       // 27
    // If there's already an in-progress fetch for this cache key, yield until                         // 28
    // it's done and return whatever it returns.                                                       // 29
    if (_.has(self._callbacksForCacheKey, cacheKey)) {                                                 // 30
      self._callbacksForCacheKey[cacheKey].push(callback);                                             // 31
      return;                                                                                          // 32
    }                                                                                                  // 33
                                                                                                       // 34
    var callbacks = self._callbacksForCacheKey[cacheKey] = [callback];                                 // 35
                                                                                                       // 36
    Fiber(function () {                                                                                // 37
      try {                                                                                            // 38
        var doc = self._mongoConnection.findOne(                                                       // 39
          collectionName, {_id: id}) || null;                                                          // 40
        // Return doc to all relevant callbacks. Note that this array can                              // 41
        // continue to grow during callback excecution.                                                // 42
        while (!_.isEmpty(callbacks)) {                                                                // 43
          // Clone the document so that the various calls to fetch don't return                        // 44
          // objects that are intertwingled with each other. Clone before                              // 45
          // popping the future, so that if clone throws, the error gets passed                        // 46
          // to the next callback.                                                                     // 47
          var clonedDoc = EJSON.clone(doc);                                                            // 48
          callbacks.pop()(null, clonedDoc);                                                            // 49
        }                                                                                              // 50
      } catch (e) {                                                                                    // 51
        while (!_.isEmpty(callbacks)) {                                                                // 52
          callbacks.pop()(e);                                                                          // 53
        }                                                                                              // 54
      } finally {                                                                                      // 55
        // XXX consider keeping the doc around for a period of time before                             // 56
        // removing from the cache                                                                     // 57
        delete self._callbacksForCacheKey[cacheKey];                                                   // 58
      }                                                                                                // 59
    }).run();                                                                                          // 60
  }                                                                                                    // 61
});                                                                                                    // 62
                                                                                                       // 63
MongoTest.DocFetcher = DocFetcher;                                                                     // 64
                                                                                                       // 65
/////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// packages/mongo-livedata/polling_observe_driver.js                                                   //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
PollingObserveDriver = function (options) {                                                            // 1
  var self = this;                                                                                     // 2
                                                                                                       // 3
  self._cursorDescription = options.cursorDescription;                                                 // 4
  self._mongoHandle = options.mongoHandle;                                                             // 5
  self._ordered = options.ordered;                                                                     // 6
  self._multiplexer = options.multiplexer;                                                             // 7
  self._stopCallbacks = [];                                                                            // 8
  self._stopped = false;                                                                               // 9
                                                                                                       // 10
  self._synchronousCursor = self._mongoHandle._createSynchronousCursor(                                // 11
    self._cursorDescription);                                                                          // 12
                                                                                                       // 13
  // previous results snapshot.  on each poll cycle, diffs against                                     // 14
  // results drives the callbacks.                                                                     // 15
  self._results = null;                                                                                // 16
                                                                                                       // 17
  // The number of _pollMongo calls that have been added to self._taskQueue but                        // 18
  // have not started running. Used to make sure we never schedule more than one                       // 19
  // _pollMongo (other than possibly the one that is currently running). It's                          // 20
  // also used by _suspendPolling to pretend there's a poll scheduled. Usually,                        // 21
  // it's either 0 (for "no polls scheduled other than maybe one currently                             // 22
  // running") or 1 (for "a poll scheduled that isn't running yet"), but it can                        // 23
  // also be 2 if incremented by _suspendPolling.                                                      // 24
  self._pollsScheduledButNotStarted = 0;                                                               // 25
  self._pendingWrites = []; // people to notify when polling completes                                 // 26
                                                                                                       // 27
  // Make sure to create a separately throttled function for each                                      // 28
  // PollingObserveDriver object.                                                                      // 29
  self._ensurePollIsScheduled = _.throttle(                                                            // 30
    self._unthrottledEnsurePollIsScheduled, 50 /* ms */);                                              // 31
                                                                                                       // 32
  // XXX figure out if we still need a queue                                                           // 33
  self._taskQueue = new Meteor._SynchronousQueue();                                                    // 34
                                                                                                       // 35
  var listenersHandle = listenAll(                                                                     // 36
    self._cursorDescription, function (notification) {                                                 // 37
      // When someone does a transaction that might affect us, schedule a poll                         // 38
      // of the database. If that transaction happens inside of a write fence,                         // 39
      // block the fence until we've polled and notified observers.                                    // 40
      var fence = DDPServer._CurrentWriteFence.get();                                                  // 41
      if (fence)                                                                                       // 42
        self._pendingWrites.push(fence.beginWrite());                                                  // 43
      // Ensure a poll is scheduled... but if we already know that one is,                             // 44
      // don't hit the throttled _ensurePollIsScheduled function (which might                          // 45
      // lead to us calling it unnecessarily in 50ms).                                                 // 46
      if (self._pollsScheduledButNotStarted === 0)                                                     // 47
        self._ensurePollIsScheduled();                                                                 // 48
    }                                                                                                  // 49
  );                                                                                                   // 50
  self._stopCallbacks.push(function () { listenersHandle.stop(); });                                   // 51
                                                                                                       // 52
  // every once and a while, poll even if we don't think we're dirty, for                              // 53
  // eventual consistency with database writes from outside the Meteor                                 // 54
  // universe.                                                                                         // 55
  //                                                                                                   // 56
  // For testing, there's an undocumented callback argument to observeChanges                          // 57
  // which disables time-based polling and gets called at the beginning of each                        // 58
  // poll.                                                                                             // 59
  if (options._testOnlyPollCallback) {                                                                 // 60
    self._testOnlyPollCallback = options._testOnlyPollCallback;                                        // 61
  } else {                                                                                             // 62
    var intervalHandle = Meteor.setInterval(                                                           // 63
      _.bind(self._ensurePollIsScheduled, self), 10 * 1000);                                           // 64
    self._stopCallbacks.push(function () {                                                             // 65
      Meteor.clearInterval(intervalHandle);                                                            // 66
    });                                                                                                // 67
  }                                                                                                    // 68
                                                                                                       // 69
  // Make sure we actually poll soon!                                                                  // 70
  self._unthrottledEnsurePollIsScheduled();                                                            // 71
                                                                                                       // 72
  Package.facts && Package.facts.Facts.incrementServerFact(                                            // 73
    "mongo-livedata", "observe-drivers-polling", 1);                                                   // 74
};                                                                                                     // 75
                                                                                                       // 76
_.extend(PollingObserveDriver.prototype, {                                                             // 77
  // This is always called through _.throttle (except once at startup).                                // 78
  _unthrottledEnsurePollIsScheduled: function () {                                                     // 79
    var self = this;                                                                                   // 80
    if (self._pollsScheduledButNotStarted > 0)                                                         // 81
      return;                                                                                          // 82
    ++self._pollsScheduledButNotStarted;                                                               // 83
    self._taskQueue.queueTask(function () {                                                            // 84
      self._pollMongo();                                                                               // 85
    });                                                                                                // 86
  },                                                                                                   // 87
                                                                                                       // 88
  // test-only interface for controlling polling.                                                      // 89
  //                                                                                                   // 90
  // _suspendPolling blocks until any currently running and scheduled polls are                        // 91
  // done, and prevents any further polls from being scheduled. (new                                   // 92
  // ObserveHandles can be added and receive their initial added callbacks,                            // 93
  // though.)                                                                                          // 94
  //                                                                                                   // 95
  // _resumePolling immediately polls, and allows further polls to occur.                              // 96
  _suspendPolling: function() {                                                                        // 97
    var self = this;                                                                                   // 98
    // Pretend that there's another poll scheduled (which will prevent                                 // 99
    // _ensurePollIsScheduled from queueing any more polls).                                           // 100
    ++self._pollsScheduledButNotStarted;                                                               // 101
    // Now block until all currently running or scheduled polls are done.                              // 102
    self._taskQueue.runTask(function() {});                                                            // 103
                                                                                                       // 104
    // Confirm that there is only one "poll" (the fake one we're pretending to                         // 105
    // have) scheduled.                                                                                // 106
    if (self._pollsScheduledButNotStarted !== 1)                                                       // 107
      throw new Error("_pollsScheduledButNotStarted is " +                                             // 108
                      self._pollsScheduledButNotStarted);                                              // 109
  },                                                                                                   // 110
  _resumePolling: function() {                                                                         // 111
    var self = this;                                                                                   // 112
    // We should be in the same state as in the end of _suspendPolling.                                // 113
    if (self._pollsScheduledButNotStarted !== 1)                                                       // 114
      throw new Error("_pollsScheduledButNotStarted is " +                                             // 115
                      self._pollsScheduledButNotStarted);                                              // 116
    // Run a poll synchronously (which will counteract the                                             // 117
    // ++_pollsScheduledButNotStarted from _suspendPolling).                                           // 118
    self._taskQueue.runTask(function () {                                                              // 119
      self._pollMongo();                                                                               // 120
    });                                                                                                // 121
  },                                                                                                   // 122
                                                                                                       // 123
  _pollMongo: function () {                                                                            // 124
    var self = this;                                                                                   // 125
    --self._pollsScheduledButNotStarted;                                                               // 126
                                                                                                       // 127
    var first = false;                                                                                 // 128
    if (!self._results) {                                                                              // 129
      first = true;                                                                                    // 130
      // XXX maybe use OrderedDict instead?                                                            // 131
      self._results = self._ordered ? [] : new LocalCollection._IdMap;                                 // 132
    }                                                                                                  // 133
                                                                                                       // 134
    self._testOnlyPollCallback && self._testOnlyPollCallback();                                        // 135
                                                                                                       // 136
    // Save the list of pending writes which this round will commit.                                   // 137
    var writesForCycle = self._pendingWrites;                                                          // 138
    self._pendingWrites = [];                                                                          // 139
                                                                                                       // 140
    // Get the new query results. (These calls can yield.)                                             // 141
    if (!first)                                                                                        // 142
      self._synchronousCursor.rewind();                                                                // 143
    var newResults = self._synchronousCursor.getRawObjects(self._ordered);                             // 144
    var oldResults = self._results;                                                                    // 145
                                                                                                       // 146
    // Run diffs. (This can yield too.)                                                                // 147
    if (!self._stopped) {                                                                              // 148
      LocalCollection._diffQueryChanges(                                                               // 149
        self._ordered, oldResults, newResults, self._multiplexer);                                     // 150
    }                                                                                                  // 151
                                                                                                       // 152
    // Replace self._results atomically.                                                               // 153
    self._results = newResults;                                                                        // 154
                                                                                                       // 155
    // Signals the multiplexer to call all initial adds.                                               // 156
    if (first)                                                                                         // 157
      self._multiplexer.ready();                                                                       // 158
                                                                                                       // 159
    // Once the ObserveMultiplexer has processed everything we've done in this                         // 160
    // round, mark all the writes which existed before this call as                                    // 161
    // commmitted. (If new writes have shown up in the meantime, there'll                              // 162
    // already be another _pollMongo task scheduled.)                                                  // 163
    self._multiplexer.onFlush(function () {                                                            // 164
      _.each(writesForCycle, function (w) {                                                            // 165
        w.committed();                                                                                 // 166
      });                                                                                              // 167
    });                                                                                                // 168
  },                                                                                                   // 169
                                                                                                       // 170
  stop: function () {                                                                                  // 171
    var self = this;                                                                                   // 172
    self._stopped = true;                                                                              // 173
    _.each(self._stopCallbacks, function (c) { c(); });                                                // 174
    Package.facts && Package.facts.Facts.incrementServerFact(                                          // 175
      "mongo-livedata", "observe-drivers-polling", -1);                                                // 176
  }                                                                                                    // 177
});                                                                                                    // 178
                                                                                                       // 179
/////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// packages/mongo-livedata/oplog_observe_driver.js                                                     //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
var Fiber = Npm.require('fibers');                                                                     // 1
var Future = Npm.require('fibers/future');                                                             // 2
                                                                                                       // 3
var PHASE = {                                                                                          // 4
  QUERYING: "QUERYING",                                                                                // 5
  FETCHING: "FETCHING",                                                                                // 6
  STEADY: "STEADY"                                                                                     // 7
};                                                                                                     // 8
                                                                                                       // 9
// OplogObserveDriver is an alternative to PollingObserveDriver which follows                          // 10
// the Mongo operation log instead of just re-polling the query. It obeys the                          // 11
// same simple interface: constructing it starts sending observeChanges                                // 12
// callbacks (and a ready() invocation) to the ObserveMultiplexer, and you stop                        // 13
// it by calling the stop() method.                                                                    // 14
OplogObserveDriver = function (options) {                                                              // 15
  var self = this;                                                                                     // 16
  self._usesOplog = true;  // tests look at this                                                       // 17
                                                                                                       // 18
  self._cursorDescription = options.cursorDescription;                                                 // 19
  self._mongoHandle = options.mongoHandle;                                                             // 20
  self._multiplexer = options.multiplexer;                                                             // 21
  if (options.ordered)                                                                                 // 22
    throw Error("OplogObserveDriver only supports unordered observeChanges");                          // 23
                                                                                                       // 24
  self._stopped = false;                                                                               // 25
  self._stopHandles = [];                                                                              // 26
                                                                                                       // 27
  Package.facts && Package.facts.Facts.incrementServerFact(                                            // 28
    "mongo-livedata", "observe-drivers-oplog", 1);                                                     // 29
                                                                                                       // 30
  self._registerPhaseChange(PHASE.QUERYING);                                                           // 31
                                                                                                       // 32
  // A minimongo LocalCollection containing the docs that match the selector,                          // 33
  // and maybe more. It is guaranteed to contain all the fields needed for the                         // 34
  // selector and the projection, and may have other fields too. (In the future                        // 35
  // we may try to make this collection be shared between multiple                                     // 36
  // OplogObserveDrivers, but not currently.)                                                          // 37
  self._collection =                                                                                   // 38
    new LocalCollection({_observeCallbacksWillNeverYield: true});                                      // 39
  // XXX think about what all the options are                                                          // 40
  var minimongoCursor = self._collection.find(                                                         // 41
    self._cursorDescription.selector, self._cursorDescription.options);                                // 42
  self._stopHandles.push(minimongoCursor.observeChanges(self._multiplexer));                           // 43
                                                                                                       // 44
  var selector = self._cursorDescription.selector;                                                     // 45
  self._matcher = options.matcher;                                                                     // 46
                                                                                                       // 47
  // Projection function, result of combining important fields for selector and                        // 48
  // existing fields projection                                                                        // 49
  var projection = self._cursorDescription.options.fields || {};                                       // 50
  self._sharedProjection = self._matcher.combineIntoProjection(projection);                            // 51
  self._sharedProjectionFn = LocalCollection._compileProjection(                                       // 52
    self._sharedProjection);                                                                           // 53
                                                                                                       // 54
  self._needToFetch = new LocalCollection._IdMap;                                                      // 55
  self._currentlyFetching = null;                                                                      // 56
  self._fetchGeneration = 0;                                                                           // 57
                                                                                                       // 58
  self._requeryWhenDoneThisQuery = false;                                                              // 59
  self._writesToCommitWhenWeReachSteady = [];                                                          // 60
                                                                                                       // 61
  forEachTrigger(self._cursorDescription, function (trigger) {                                         // 62
    self._stopHandles.push(self._mongoHandle._oplogHandle.onOplogEntry(                                // 63
      trigger, function (notification) {                                                               // 64
        Meteor._noYieldsAllowed(function () {                                                          // 65
          var op = notification.op;                                                                    // 66
          if (notification.dropCollection) {                                                           // 67
            // Note: this call is not allowed to block on anything (especially                         // 68
            // on waiting for oplog entries to catch up) because that will block                       // 69
            // onOplogEntry!                                                                           // 70
            self._needToPollQuery();                                                                   // 71
          } else {                                                                                     // 72
            // All other operators should be handled depending on phase                                // 73
            if (self._phase === PHASE.QUERYING)                                                        // 74
              self._handleOplogEntryQuerying(op);                                                      // 75
            else                                                                                       // 76
              self._handleOplogEntrySteadyOrFetching(op);                                              // 77
          }                                                                                            // 78
        });                                                                                            // 79
      }                                                                                                // 80
    ));                                                                                                // 81
  });                                                                                                  // 82
                                                                                                       // 83
  // XXX ordering w.r.t. everything else?                                                              // 84
  self._stopHandles.push(listenAll(                                                                    // 85
    self._cursorDescription, function (notification) {                                                 // 86
      // If we're not in a write fence, we don't have to do anything.                                  // 87
      var fence = DDPServer._CurrentWriteFence.get();                                                  // 88
      if (!fence)                                                                                      // 89
        return;                                                                                        // 90
      var write = fence.beginWrite();                                                                  // 91
      // This write cannot complete until we've caught up to "this point" in the                       // 92
      // oplog, and then made it back to the steady state.                                             // 93
      Meteor.defer(function () {                                                                       // 94
        self._mongoHandle._oplogHandle.waitUntilCaughtUp();                                            // 95
        if (self._stopped) {                                                                           // 96
          // We're stopped, so just immediately commit.                                                // 97
          write.committed();                                                                           // 98
        } else if (self._phase === PHASE.STEADY) {                                                     // 99
          // Make sure that all of the callbacks have made it through the                              // 100
          // multiplexer and been delivered to ObserveHandles before committing                        // 101
          // writes.                                                                                   // 102
          self._multiplexer.onFlush(function () {                                                      // 103
            write.committed();                                                                         // 104
          });                                                                                          // 105
        } else {                                                                                       // 106
          self._writesToCommitWhenWeReachSteady.push(write);                                           // 107
        }                                                                                              // 108
      });                                                                                              // 109
    }                                                                                                  // 110
  ));                                                                                                  // 111
                                                                                                       // 112
  // Give _observeChanges a chance to add the new ObserveHandle to our                                 // 113
  // multiplexer, so that the added calls get streamed.                                                // 114
  Meteor.defer(function () {                                                                           // 115
    self._runInitialQuery();                                                                           // 116
  });                                                                                                  // 117
};                                                                                                     // 118
                                                                                                       // 119
_.extend(OplogObserveDriver.prototype, {                                                               // 120
  _add: function (doc) {                                                                               // 121
    var self = this;                                                                                   // 122
    doc = self._sharedProjectionFn(doc);                                                               // 123
    // XXX does _sharedProjection always preserve id?                                                  // 124
    if (!_.has(doc, '_id'))                                                                            // 125
      throw Error("Can't add doc without _id");                                                        // 126
    self._collection.insert(doc);                                                                      // 127
  },                                                                                                   // 128
  _remove: function (id, options) {                                                                    // 129
    var self = this;                                                                                   // 130
    options = options || {};                                                                           // 131
    var removed = self._collection.remove({_id: id});                                                  // 132
    if (options.mustExist && removed !== 1)                                                            // 133
      throw Error("tried to remove something unpublished " + id);                                      // 134
  },                                                                                                   // 135
  _handleDoc: function (id, newDoc, mustMatchNow) {                                                    // 136
    var self = this;                                                                                   // 137
    newDoc = _.clone(newDoc);  // *shallow* clone                                                      // 138
                                                                                                       // 139
    // XXX this is just about "matching selector", not about skip/limit                                // 140
    var matchesNow = newDoc && self._matcher.documentMatches(newDoc).result;                           // 141
    if (mustMatchNow && !matchesNow) {                                                                 // 142
      throw Error("expected " + EJSON.stringify(newDoc) + " to match "                                 // 143
                  + EJSON.stringify(self._cursorDescription));                                         // 144
    }                                                                                                  // 145
                                                                                                       // 146
    var inCollection = !!self._collection.find(id).count();                                            // 147
                                                                                                       // 148
    if (matchesNow && !inCollection) {                                                                 // 149
      // It matches the selector and it isn't in our collection, so add it.                            // 150
      // XXX once we add skip/limit, this may not always send an added, and                            // 151
      // we may need to do some GC                                                                     // 152
      self._add(newDoc);                                                                               // 153
    } else if (inCollection && !matchesNow) {                                                          // 154
      // We remove this from the collection to achieve two goals: (a) causing                          // 155
      // the observeChanges to fire removed() and (b) saving memory.  That said,                       // 156
      // it would be legitimate (if !!newDoc) to update the collection instead                         // 157
      // of removing, if we thought we might need this doc again soon.                                 // 158
      self._remove(id, {mustExist: true});                                                             // 159
    } else if (matchesNow) {                                                                           // 160
      // Replace the doc inside our collection, which may trigger a changed                            // 161
      // callback.                                                                                     // 162
      newDoc = self._sharedProjectionFn(newDoc);                                                       // 163
      // XXX does _sharedProjection always preserve id?                                                // 164
      if (!_.has(newDoc, '_id'))                                                                       // 165
        throw Error("Can't add newDoc without _id");                                                   // 166
      self._collection.update(id, newDoc);                                                             // 167
    }                                                                                                  // 168
  },                                                                                                   // 169
  _fetchModifiedDocuments: function () {                                                               // 170
    var self = this;                                                                                   // 171
    self._registerPhaseChange(PHASE.FETCHING);                                                         // 172
    // Defer, because nothing called from the oplog entry handler may yield, but                       // 173
    // fetch() yields.                                                                                 // 174
    Meteor.defer(function () {                                                                         // 175
      while (!self._stopped && !self._needToFetch.empty()) {                                           // 176
        if (self._phase !== PHASE.FETCHING)                                                            // 177
          throw new Error("phase in fetchModifiedDocuments: " + self._phase);                          // 178
                                                                                                       // 179
        self._currentlyFetching = self._needToFetch;                                                   // 180
        var thisGeneration = ++self._fetchGeneration;                                                  // 181
        self._needToFetch = new LocalCollection._IdMap;                                                // 182
        var waiting = 0;                                                                               // 183
        var anyError = null;                                                                           // 184
        var fut = new Future;                                                                          // 185
        // This loop is safe, because _currentlyFetching will not be updated                           // 186
        // during this loop (in fact, it is never mutated).                                            // 187
        self._currentlyFetching.forEach(function (cacheKey, id) {                                      // 188
          waiting++;                                                                                   // 189
          self._mongoHandle._docFetcher.fetch(                                                         // 190
            self._cursorDescription.collectionName, id, cacheKey,                                      // 191
            function (err, doc) {                                                                      // 192
              if (err) {                                                                               // 193
                if (!anyError)                                                                         // 194
                  anyError = err;                                                                      // 195
              } else if (!self._stopped && self._phase === PHASE.FETCHING                              // 196
                         && self._fetchGeneration === thisGeneration) {                                // 197
                // We re-check the generation in case we've had an explicit                            // 198
                // _pollQuery call which should effectively cancel this round of                       // 199
                // fetches.  (_pollQuery increments the generation.)                                   // 200
                self._handleDoc(id, doc);                                                              // 201
              }                                                                                        // 202
              waiting--;                                                                               // 203
              // Because fetch() never calls its callback synchronously, this is                       // 204
              // safe (ie, we won't call fut.return() before the forEach is                            // 205
              // done).                                                                                // 206
              if (waiting === 0)                                                                       // 207
                fut.return();                                                                          // 208
            });                                                                                        // 209
        });                                                                                            // 210
        fut.wait();                                                                                    // 211
        // XXX do this even if we've switched to PHASE.QUERYING?                                       // 212
        if (anyError)                                                                                  // 213
          throw anyError;                                                                              // 214
        // Exit now if we've had a _pollQuery call.                                                    // 215
        if (self._phase === PHASE.QUERYING)                                                            // 216
          return;                                                                                      // 217
        self._currentlyFetching = null;                                                                // 218
      }                                                                                                // 219
      self._beSteady();                                                                                // 220
    });                                                                                                // 221
  },                                                                                                   // 222
  _beSteady: function () {                                                                             // 223
    var self = this;                                                                                   // 224
    self._registerPhaseChange(PHASE.STEADY);                                                           // 225
    var writes = self._writesToCommitWhenWeReachSteady;                                                // 226
    self._writesToCommitWhenWeReachSteady = [];                                                        // 227
    self._multiplexer.onFlush(function () {                                                            // 228
      _.each(writes, function (w) {                                                                    // 229
        w.committed();                                                                                 // 230
      });                                                                                              // 231
    });                                                                                                // 232
  },                                                                                                   // 233
  _handleOplogEntryQuerying: function (op) {                                                           // 234
    var self = this;                                                                                   // 235
    self._needToFetch.set(idForOp(op), op.ts.toString());                                              // 236
  },                                                                                                   // 237
  _handleOplogEntrySteadyOrFetching: function (op) {                                                   // 238
    var self = this;                                                                                   // 239
    var id = idForOp(op);                                                                              // 240
    // If we're already fetching this one, or about to, we can't optimize; make                        // 241
    // sure that we fetch it again if necessary.                                                       // 242
    if (self._phase === PHASE.FETCHING &&                                                              // 243
        ((self._currentlyFetching && self._currentlyFetching.has(id)) ||                               // 244
         self._needToFetch.has(id))) {                                                                 // 245
      self._needToFetch.set(id, op.ts.toString());                                                     // 246
      return;                                                                                          // 247
    }                                                                                                  // 248
                                                                                                       // 249
    if (op.op === 'd') {                                                                               // 250
      self._remove(id);                                                                                // 251
    } else if (op.op === 'i') {                                                                        // 252
      if (self._collection.find(id).count())                                                           // 253
        throw new Error("insert found for already-existing ID");                                       // 254
                                                                                                       // 255
      // XXX what if selector yields?  for now it can't but later it could have                        // 256
      // $where                                                                                        // 257
      if (self._matcher.documentMatches(op.o).result)                                                  // 258
        self._add(op.o);                                                                               // 259
    } else if (op.op === 'u') {                                                                        // 260
      // Is this a modifier ($set/$unset, which may require us to poll the                             // 261
      // database to figure out if the whole document matches the selector) or a                       // 262
      // replacement (in which case we can just directly re-evaluate the                               // 263
      // selector)?                                                                                    // 264
      var isReplace = !_.has(op.o, '$set') && !_.has(op.o, '$unset');                                  // 265
      // If this modifier modifies something inside an EJSON custom type (ie,                          // 266
      // anything with EJSON$), then we can't try to use                                               // 267
      // LocalCollection._modify, since that just mutates the EJSON encoding,                          // 268
      // not the actual object.                                                                        // 269
      var canDirectlyModifyDoc =                                                                       // 270
            !isReplace && modifierCanBeDirectlyApplied(op.o);                                          // 271
                                                                                                       // 272
      if (isReplace) {                                                                                 // 273
        self._handleDoc(id, _.extend({_id: id}, op.o));                                                // 274
      } else {                                                                                         // 275
        var newDoc = self._collection.findOne(id);                                                     // 276
        if (newDoc && canDirectlyModifyDoc) {                                                          // 277
          // Oh great, we actually know what the document is, so we can apply                          // 278
          // this directly.                                                                            // 279
          // XXX just send the modifier to _collection.update? but then                                // 280
          // we don't necessarily get to GC                                                            // 281
                                                                                                       // 282
          // We can avoid another deep clone here since the findOne above would                        // 283
          // return a copy anyways                                                                     // 284
          LocalCollection._modify(newDoc, op.o);                                                       // 285
          self._handleDoc(id, newDoc);                                                                 // 286
        } else if (!canDirectlyModifyDoc ||                                                            // 287
                   self._matcher.canBecomeTrueByModifier(op.o)) {                                      // 288
          self._needToFetch.set(id, op.ts.toString());                                                 // 289
          if (self._phase === PHASE.STEADY)                                                            // 290
            self._fetchModifiedDocuments();                                                            // 291
        }                                                                                              // 292
      }                                                                                                // 293
    } else {                                                                                           // 294
      throw Error("XXX SURPRISING OPERATION: " + op);                                                  // 295
    }                                                                                                  // 296
  },                                                                                                   // 297
  _runInitialQuery: function () {                                                                      // 298
    var self = this;                                                                                   // 299
    if (self._stopped)                                                                                 // 300
      throw new Error("oplog stopped surprisingly early");                                             // 301
                                                                                                       // 302
    var initialCursor = self._cursorForQuery();                                                        // 303
    initialCursor.forEach(function (initialDoc) {                                                      // 304
      self._add(initialDoc);                                                                           // 305
    });                                                                                                // 306
    if (self._stopped)                                                                                 // 307
      throw new Error("oplog stopped quite early");                                                    // 308
    // Allow observeChanges calls to return. (After this, it's possible for                            // 309
    // stop() to be called.)                                                                           // 310
    self._multiplexer.ready();                                                                         // 311
                                                                                                       // 312
    self._doneQuerying();                                                                              // 313
  },                                                                                                   // 314
                                                                                                       // 315
  // In various circumstances, we may just want to stop processing the oplog and                       // 316
  // re-run the initial query, just as if we were a PollingObserveDriver.                              // 317
  //                                                                                                   // 318
  // This function may not block, because it is called from an oplog entry                             // 319
  // handler.                                                                                          // 320
  //                                                                                                   // 321
  // XXX We should call this when we detect that we've been in FETCHING for "too                       // 322
  // long".                                                                                            // 323
  //                                                                                                   // 324
  // XXX We should call this when we detect Mongo failover (since that might                           // 325
  // mean that some of the oplog entries we have processed have been rolled                            // 326
  // back). The Node Mongo driver is in the middle of a bunch of huge                                  // 327
  // refactorings, including the way that it notifies you when primary                                 // 328
  // changes. Will put off implementing this until driver 1.4 is out.                                  // 329
  _pollQuery: function () {                                                                            // 330
    var self = this;                                                                                   // 331
                                                                                                       // 332
    if (self._stopped)                                                                                 // 333
      return;                                                                                          // 334
                                                                                                       // 335
    // Yay, we get to forget about all the things we thought we had to fetch.                          // 336
    self._needToFetch = new LocalCollection._IdMap;                                                    // 337
    self._currentlyFetching = null;                                                                    // 338
    ++self._fetchGeneration;  // ignore any in-flight fetches                                          // 339
    self._registerPhaseChange(PHASE.QUERYING);                                                         // 340
    self._collection.pauseObservers();                                                                 // 341
    // XXX this won't be quite correct for skip/limit                                                  // 342
    self._collection.remove({});                                                                       // 343
                                                                                                       // 344
    // Defer so that we don't block.                                                                   // 345
    Meteor.defer(function () {                                                                         // 346
      // Insert all the documents currently found by the query.                                        // 347
      self._cursorForQuery().forEach(function (doc) {                                                  // 348
        self._collection.insert(doc);                                                                  // 349
      });                                                                                              // 350
                                                                                                       // 351
      // Allow observe callbacks (ie multiplexer invocations) to fire.                                 // 352
      self._collection.resumeObservers();                                                              // 353
                                                                                                       // 354
      self._doneQuerying();                                                                            // 355
    });                                                                                                // 356
  },                                                                                                   // 357
                                                                                                       // 358
  // Transitions to QUERYING and runs another query, or (if already in QUERYING)                       // 359
  // ensures that we will query again later.                                                           // 360
  //                                                                                                   // 361
  // This function may not block, because it is called from an oplog entry                             // 362
  // handler.                                                                                          // 363
  _needToPollQuery: function () {                                                                      // 364
    var self = this;                                                                                   // 365
    if (self._stopped)                                                                                 // 366
      return;                                                                                          // 367
                                                                                                       // 368
    // If we're not already in the middle of a query, we can query now (possibly                       // 369
    // pausing FETCHING).                                                                              // 370
    if (self._phase !== PHASE.QUERYING) {                                                              // 371
      self._pollQuery();                                                                               // 372
      return;                                                                                          // 373
    }                                                                                                  // 374
                                                                                                       // 375
    // We're currently in QUERYING. Set a flag to ensure that we run another                           // 376
    // query when we're done.                                                                          // 377
    self._requeryWhenDoneThisQuery = true;                                                             // 378
  },                                                                                                   // 379
                                                                                                       // 380
  _doneQuerying: function () {                                                                         // 381
    var self = this;                                                                                   // 382
                                                                                                       // 383
    if (self._stopped)                                                                                 // 384
      return;                                                                                          // 385
    self._mongoHandle._oplogHandle.waitUntilCaughtUp();                                                // 386
                                                                                                       // 387
    if (self._stopped)                                                                                 // 388
      return;                                                                                          // 389
    if (self._phase !== PHASE.QUERYING)                                                                // 390
      throw Error("Phase unexpectedly " + self._phase);                                                // 391
                                                                                                       // 392
    if (self._requeryWhenDoneThisQuery) {                                                              // 393
      self._requeryWhenDoneThisQuery = false;                                                          // 394
      self._pollQuery();                                                                               // 395
    } else if (self._needToFetch.empty()) {                                                            // 396
      self._beSteady();                                                                                // 397
    } else {                                                                                           // 398
      self._fetchModifiedDocuments();                                                                  // 399
    }                                                                                                  // 400
  },                                                                                                   // 401
                                                                                                       // 402
  _cursorForQuery: function () {                                                                       // 403
    var self = this;                                                                                   // 404
                                                                                                       // 405
    // The query we run is almost the same as the cursor we are observing, with                        // 406
    // a few changes. We need to read all the fields that are relevant to the                          // 407
    // selector, not just the fields we are going to publish (that's the                               // 408
    // "shared" projection). And we don't want to apply any transform in the                           // 409
    // cursor, because observeChanges shouldn't use the transform.                                     // 410
    var options = _.clone(self._cursorDescription.options);                                            // 411
    options.fields = self._sharedProjection;                                                           // 412
    delete options.transform;                                                                          // 413
    // We are NOT deep cloning fields or selector here, which should be OK.                            // 414
    var description = new CursorDescription(                                                           // 415
      self._cursorDescription.collectionName,                                                          // 416
      self._cursorDescription.selector,                                                                // 417
      options);                                                                                        // 418
    return new Cursor(self._mongoHandle, description);                                                 // 419
  },                                                                                                   // 420
                                                                                                       // 421
                                                                                                       // 422
  // This stop function is invoked from the onStop of the ObserveMultiplexer, so                       // 423
  // it shouldn't actually be possible to call it until the multiplexer is                             // 424
  // ready.                                                                                            // 425
  stop: function () {                                                                                  // 426
    var self = this;                                                                                   // 427
    if (self._stopped)                                                                                 // 428
      return;                                                                                          // 429
    self._stopped = true;                                                                              // 430
    _.each(self._stopHandles, function (handle) {                                                      // 431
      handle.stop();                                                                                   // 432
    });                                                                                                // 433
                                                                                                       // 434
    // Note: we *don't* use multiplexer.onFlush here because this stop                                 // 435
    // callback is actually invoked by the multiplexer itself when it has                              // 436
    // determined that there are no handles left. So nothing is actually going                         // 437
    // to get flushed (and it's probably not valid to call methods on the                              // 438
    // dying multiplexer).                                                                             // 439
    _.each(self._writesToCommitWhenWeReachSteady, function (w) {                                       // 440
      w.committed();                                                                                   // 441
    });                                                                                                // 442
    self._writesToCommitWhenWeReachSteady = null;                                                      // 443
                                                                                                       // 444
    // Proactively drop references to potentially big things.                                          // 445
    self._needToFetch = null;                                                                          // 446
    self._currentlyFetching = null;                                                                    // 447
    self._oplogEntryHandle = null;                                                                     // 448
    self._listenersHandle = null;                                                                      // 449
                                                                                                       // 450
    Package.facts && Package.facts.Facts.incrementServerFact(                                          // 451
      "mongo-livedata", "observe-drivers-oplog", -1);                                                  // 452
  },                                                                                                   // 453
                                                                                                       // 454
  _registerPhaseChange: function (phase) {                                                             // 455
    var self = this;                                                                                   // 456
    var now = new Date;                                                                                // 457
                                                                                                       // 458
    if (phase === self._phase)                                                                         // 459
      return;                                                                                          // 460
                                                                                                       // 461
    if (self._phase) {                                                                                 // 462
      var timeDiff = now - self._phaseStartTime;                                                       // 463
      Package.facts && Package.facts.Facts.incrementServerFact(                                        // 464
        "mongo-livedata", "time-spent-in-" + self._phase + "-phase", timeDiff);                        // 465
    }                                                                                                  // 466
                                                                                                       // 467
    self._phase = phase;                                                                               // 468
    self._phaseStartTime = now;                                                                        // 469
  }                                                                                                    // 470
});                                                                                                    // 471
                                                                                                       // 472
// Does our oplog tailing code support this cursor? For now, we are being very                         // 473
// conservative and allowing only simple queries with simple options.                                  // 474
// (This is a "static method".)                                                                        // 475
OplogObserveDriver.cursorSupported = function (cursorDescription, matcher) {                           // 476
  // First, check the options.                                                                         // 477
  var options = cursorDescription.options;                                                             // 478
                                                                                                       // 479
  // Did the user say no explicitly?                                                                   // 480
  if (options._disableOplog)                                                                           // 481
    return false;                                                                                      // 482
                                                                                                       // 483
  // This option (which are mostly used for sorted cursors) require us to figure                       // 484
  // out where a given document fits in an order to know if it's included or                           // 485
  // not, and we don't track that information when doing oplog tailing.                                // 486
  if (options.limit || options.skip) return false;                                                     // 487
                                                                                                       // 488
  // If a fields projection option is given check if it is supported by                                // 489
  // minimongo (some operators are not supported).                                                     // 490
  if (options.fields) {                                                                                // 491
    try {                                                                                              // 492
      LocalCollection._checkSupportedProjection(options.fields);                                       // 493
    } catch (e) {                                                                                      // 494
      if (e.name === "MinimongoError")                                                                 // 495
        return false;                                                                                  // 496
      else                                                                                             // 497
        throw e;                                                                                       // 498
    }                                                                                                  // 499
  }                                                                                                    // 500
                                                                                                       // 501
  // We don't allow the following selectors:                                                           // 502
  //   - $where (not confident that we provide the same JS environment                                 // 503
  //             as Mongo, and can yield!)                                                             // 504
  //   - $near (has "interesting" properties in MongoDB, like the possibility                          // 505
  //            of returning an ID multiple times, though even polling maybe                           // 506
  //            have a bug there                                                                       // 507
  return !matcher.hasWhere() && !matcher.hasGeoQuery();                                                // 508
};                                                                                                     // 509
                                                                                                       // 510
var modifierCanBeDirectlyApplied = function (modifier) {                                               // 511
  return _.all(modifier, function (fields, operation) {                                                // 512
    return _.all(fields, function (value, field) {                                                     // 513
      return !/EJSON\$/.test(field);                                                                   // 514
    });                                                                                                // 515
  });                                                                                                  // 516
};                                                                                                     // 517
                                                                                                       // 518
MongoTest.OplogObserveDriver = OplogObserveDriver;                                                     // 519
                                                                                                       // 520
/////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






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
// packages/mongo-livedata/remote_collection_driver.js                                                 //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
MongoInternals.RemoteCollectionDriver = function (                                                     // 1
  mongo_url, options) {                                                                                // 2
  var self = this;                                                                                     // 3
  self.mongo = new MongoConnection(mongo_url, options);                                                // 4
};                                                                                                     // 5
                                                                                                       // 6
_.extend(MongoInternals.RemoteCollectionDriver.prototype, {                                            // 7
  open: function (name) {                                                                              // 8
    var self = this;                                                                                   // 9
    var ret = {};                                                                                      // 10
    _.each(                                                                                            // 11
      ['find', 'findOne', 'insert', 'update', , 'upsert',                                              // 12
       'remove', '_ensureIndex', '_dropIndex', '_createCappedCollection',                              // 13
       'dropCollection'],                                                                              // 14
      function (m) {                                                                                   // 15
        ret[m] = _.bind(self.mongo[m], self.mongo, name);                                              // 16
      });                                                                                              // 17
    return ret;                                                                                        // 18
  }                                                                                                    // 19
});                                                                                                    // 20
                                                                                                       // 21
                                                                                                       // 22
// Create the singleton RemoteCollectionDriver only on demand, so we                                   // 23
// only require Mongo configuration if it's actually used (eg, not if                                  // 24
// you're only trying to receive data from a remote DDP server.)                                       // 25
MongoInternals.defaultRemoteCollectionDriver = _.once(function () {                                    // 26
  var mongoUrl;                                                                                        // 27
  var connectionOptions = {};                                                                          // 28
                                                                                                       // 29
  AppConfig.configurePackage("mongo-livedata", function (config) {                                     // 30
    // This will keep running if mongo gets reconfigured.  That's not ideal, but                       // 31
    // should be ok for now.                                                                           // 32
    mongoUrl = config.url;                                                                             // 33
                                                                                                       // 34
    if (config.oplog)                                                                                  // 35
      connectionOptions.oplogUrl = config.oplog;                                                       // 36
  });                                                                                                  // 37
                                                                                                       // 38
  // XXX bad error since it could also be set directly in METEOR_DEPLOY_CONFIG                         // 39
  if (! mongoUrl)                                                                                      // 40
    throw new Error("MONGO_URL must be set in environment");                                           // 41
                                                                                                       // 42
                                                                                                       // 43
  return new MongoInternals.RemoteCollectionDriver(mongoUrl, connectionOptions);                       // 44
});                                                                                                    // 45
                                                                                                       // 46
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
Package['mongo-livedata'] = {
  MongoInternals: MongoInternals,
  MongoTest: MongoTest
};

})();
