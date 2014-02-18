(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Log = Package.logging.Log;
var _ = Package.underscore._;
var RoutePolicy = Package.routepolicy.RoutePolicy;

/* Package-scope variables */
var WebApp, main, WebAppInternals;

(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/webapp/webapp_server.js                                                                             //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
////////// Requires //////////                                                                                  // 1
                                                                                                                // 2
var fs = Npm.require("fs");                                                                                     // 3
var http = Npm.require("http");                                                                                 // 4
var os = Npm.require("os");                                                                                     // 5
var path = Npm.require("path");                                                                                 // 6
var url = Npm.require("url");                                                                                   // 7
var crypto = Npm.require("crypto");                                                                             // 8
                                                                                                                // 9
var connect = Npm.require('connect');                                                                           // 10
var optimist = Npm.require('optimist');                                                                         // 11
var useragent = Npm.require('useragent');                                                                       // 12
var send = Npm.require('send');                                                                                 // 13
                                                                                                                // 14
var SHORT_SOCKET_TIMEOUT = 5*1000;                                                                              // 15
var LONG_SOCKET_TIMEOUT = 120*1000;                                                                             // 16
                                                                                                                // 17
WebApp = {};                                                                                                    // 18
WebAppInternals = {};                                                                                           // 19
                                                                                                                // 20
var bundledJsCssPrefix;                                                                                         // 21
                                                                                                                // 22
// The reload safetybelt is some js that will be loaded after everything else in                                // 23
// the HTML.  In some multi-server deployments, when you update, you have a                                     // 24
// chance of hitting an old server for the HTML and the new server for the JS or                                // 25
// CSS.  This prevents you from displaying the page in that case, and instead                                   // 26
// reloads it, presumably all on the new version now.                                                           // 27
var RELOAD_SAFETYBELT = "\n" +                                                                                  // 28
      "if (typeof Package === 'undefined' || \n" +                                                              // 29
      "    ! Package.webapp || \n" +                                                                            // 30
      "    ! Package.webapp.WebApp || \n" +                                                                     // 31
      "    ! Package.webapp.WebApp._isCssLoaded()) \n" +                                                        // 32
      "  document.location.reload(); \n";                                                                       // 33
                                                                                                                // 34
                                                                                                                // 35
var makeAppNamePathPrefix = function (appName) {                                                                // 36
  return encodeURIComponent(appName).replace(/\./g, '_');                                                       // 37
};                                                                                                              // 38
// Keepalives so that when the outer server dies unceremoniously and                                            // 39
// doesn't kill us, we quit ourselves. A little gross, but better than                                          // 40
// pidfiles.                                                                                                    // 41
// XXX This should really be part of the boot script, not the webapp package.                                   // 42
//     Or we should just get rid of it, and rely on containerization.                                           // 43
                                                                                                                // 44
var initKeepalive = function () {                                                                               // 45
  var keepaliveCount = 0;                                                                                       // 46
                                                                                                                // 47
  process.stdin.on('data', function (data) {                                                                    // 48
    keepaliveCount = 0;                                                                                         // 49
  });                                                                                                           // 50
                                                                                                                // 51
  process.stdin.resume();                                                                                       // 52
                                                                                                                // 53
  setInterval(function () {                                                                                     // 54
    keepaliveCount ++;                                                                                          // 55
    if (keepaliveCount >= 3) {                                                                                  // 56
      console.log("Failed to receive keepalive! Exiting.");                                                     // 57
      process.exit(1);                                                                                          // 58
    }                                                                                                           // 59
  }, 3000);                                                                                                     // 60
};                                                                                                              // 61
                                                                                                                // 62
                                                                                                                // 63
var sha1 = function (contents) {                                                                                // 64
  var hash = crypto.createHash('sha1');                                                                         // 65
  hash.update(contents);                                                                                        // 66
  return hash.digest('hex');                                                                                    // 67
};                                                                                                              // 68
                                                                                                                // 69
// #BrowserIdentification                                                                                       // 70
//                                                                                                              // 71
// We have multiple places that want to identify the browser: the                                               // 72
// unsupported browser page, the appcache package, and, eventually                                              // 73
// delivering browser polyfills only as needed.                                                                 // 74
//                                                                                                              // 75
// To avoid detecting the browser in multiple places ad-hoc, we create a                                        // 76
// Meteor "browser" object. It uses but does not expose the npm                                                 // 77
// useragent module (we could choose a different mechanism to identify                                          // 78
// the browser in the future if we wanted to).  The browser object                                              // 79
// contains                                                                                                     // 80
//                                                                                                              // 81
// * `name`: the name of the browser in camel case                                                              // 82
// * `major`, `minor`, `patch`: integers describing the browser version                                         // 83
//                                                                                                              // 84
// Also here is an early version of a Meteor `request` object, intended                                         // 85
// to be a high-level description of the request without exposing                                               // 86
// details of connect's low-level `req`.  Currently it contains:                                                // 87
//                                                                                                              // 88
// * `browser`: browser identification object described above                                                   // 89
// * `url`: parsed url, including parsed query params                                                           // 90
//                                                                                                              // 91
// As a temporary hack there is a `categorizeRequest` function on WebApp which                                  // 92
// converts a connect `req` to a Meteor `request`. This can go away once smart                                  // 93
// packages such as appcache are being passed a `request` object directly when                                  // 94
// they serve content.                                                                                          // 95
//                                                                                                              // 96
// This allows `request` to be used uniformly: it is passed to the html                                         // 97
// attributes hook, and the appcache package can use it when deciding                                           // 98
// whether to generate a 404 for the manifest.                                                                  // 99
//                                                                                                              // 100
// Real routing / server side rendering will probably refactor this                                             // 101
// heavily.                                                                                                     // 102
                                                                                                                // 103
                                                                                                                // 104
// e.g. "Mobile Safari" => "mobileSafari"                                                                       // 105
var camelCase = function (name) {                                                                               // 106
  var parts = name.split(' ');                                                                                  // 107
  parts[0] = parts[0].toLowerCase();                                                                            // 108
  for (var i = 1;  i < parts.length;  ++i) {                                                                    // 109
    parts[i] = parts[i].charAt(0).toUpperCase() + parts[i].substr(1);                                           // 110
  }                                                                                                             // 111
  return parts.join('');                                                                                        // 112
};                                                                                                              // 113
                                                                                                                // 114
var identifyBrowser = function (req) {                                                                          // 115
  var userAgent = useragent.lookup(req.headers['user-agent']);                                                  // 116
  return {                                                                                                      // 117
    name: camelCase(userAgent.family),                                                                          // 118
    major: +userAgent.major,                                                                                    // 119
    minor: +userAgent.minor,                                                                                    // 120
    patch: +userAgent.patch                                                                                     // 121
  };                                                                                                            // 122
};                                                                                                              // 123
                                                                                                                // 124
WebApp.categorizeRequest = function (req) {                                                                     // 125
  return {                                                                                                      // 126
    browser: identifyBrowser(req),                                                                              // 127
    url: url.parse(req.url, true)                                                                               // 128
  };                                                                                                            // 129
};                                                                                                              // 130
                                                                                                                // 131
// HTML attribute hooks: functions to be called to determine any attributes to                                  // 132
// be added to the '<html>' tag. Each function is passed a 'request' object (see                                // 133
// #BrowserIdentification) and should return a string,                                                          // 134
var htmlAttributeHooks = [];                                                                                    // 135
var htmlAttributes = function (template, request) {                                                             // 136
  var attributes = '';                                                                                          // 137
  _.each(htmlAttributeHooks || [], function (hook) {                                                            // 138
    var attribute = hook(request);                                                                              // 139
    if (attribute !== null && attribute !== undefined && attribute !== '')                                      // 140
      attributes += ' ' + attribute;                                                                            // 141
  });                                                                                                           // 142
  return template.replace('##HTML_ATTRIBUTES##', attributes);                                                   // 143
};                                                                                                              // 144
WebApp.addHtmlAttributeHook = function (hook) {                                                                 // 145
  htmlAttributeHooks.push(hook);                                                                                // 146
};                                                                                                              // 147
                                                                                                                // 148
// Serve app HTML for this URL?                                                                                 // 149
var appUrl = function (url) {                                                                                   // 150
  if (url === '/favicon.ico' || url === '/robots.txt')                                                          // 151
    return false;                                                                                               // 152
                                                                                                                // 153
  // NOTE: app.manifest is not a web standard like favicon.ico and                                              // 154
  // robots.txt. It is a file name we have chosen to use for HTML5                                              // 155
  // appcache URLs. It is included here to prevent using an appcache                                            // 156
  // then removing it from poisoning an app permanently. Eventually,                                            // 157
  // once we have server side routing, this won't be needed as                                                  // 158
  // unknown URLs with return a 404 automatically.                                                              // 159
  if (url === '/app.manifest')                                                                                  // 160
    return false;                                                                                               // 161
                                                                                                                // 162
  // Avoid serving app HTML for declared routes such as /sockjs/.                                               // 163
  if (RoutePolicy.classify(url))                                                                                // 164
    return false;                                                                                               // 165
                                                                                                                // 166
  // we currently return app HTML on all URLs by default                                                        // 167
  return true;                                                                                                  // 168
};                                                                                                              // 169
                                                                                                                // 170
                                                                                                                // 171
// Calculate a hash of all the client resources downloaded by the                                               // 172
// browser, including the application HTML, runtime config, code, and                                           // 173
// static files.                                                                                                // 174
//                                                                                                              // 175
// This hash *must* change if any resources seen by the browser                                                 // 176
// change, and ideally *doesn't* change for any server-only changes                                             // 177
// (but the second is a performance enhancement, not a hard                                                     // 178
// requirement).                                                                                                // 179
                                                                                                                // 180
var calculateClientHash = function () {                                                                         // 181
  var hash = crypto.createHash('sha1');                                                                         // 182
  hash.update(JSON.stringify(__meteor_runtime_config__), 'utf8');                                               // 183
  _.each(WebApp.clientProgram.manifest, function (resource) {                                                   // 184
    if (resource.where === 'client' || resource.where === 'internal') {                                         // 185
      hash.update(resource.path);                                                                               // 186
      hash.update(resource.hash);                                                                               // 187
    }                                                                                                           // 188
  });                                                                                                           // 189
  return hash.digest('hex');                                                                                    // 190
};                                                                                                              // 191
                                                                                                                // 192
                                                                                                                // 193
// We need to calculate the client hash after all packages have loaded                                          // 194
// to give them a chance to populate __meteor_runtime_config__.                                                 // 195
//                                                                                                              // 196
// Calculating the hash during startup means that packages can only                                             // 197
// populate __meteor_runtime_config__ during load, not during startup.                                          // 198
//                                                                                                              // 199
// Calculating instead it at the beginning of main after all startup                                            // 200
// hooks had run would allow packages to also populate                                                          // 201
// __meteor_runtime_config__ during startup, but that's too late for                                            // 202
// autoupdate because it needs to have the client hash at startup to                                            // 203
// insert the auto update version itself into                                                                   // 204
// __meteor_runtime_config__ to get it to the client.                                                           // 205
//                                                                                                              // 206
// An alternative would be to give autoupdate a "post-start,                                                    // 207
// pre-listen" hook to allow it to insert the auto update version at                                            // 208
// the right moment.                                                                                            // 209
                                                                                                                // 210
Meteor.startup(function () {                                                                                    // 211
  WebApp.clientHash = calculateClientHash();                                                                    // 212
});                                                                                                             // 213
                                                                                                                // 214
                                                                                                                // 215
                                                                                                                // 216
// When we have a request pending, we want the socket timeout to be long, to                                    // 217
// give ourselves a while to serve it, and to allow sockjs long polls to                                        // 218
// complete.  On the other hand, we want to close idle sockets relatively                                       // 219
// quickly, so that we can shut down relatively promptly but cleanly, without                                   // 220
// cutting off anyone's response.                                                                               // 221
WebApp._timeoutAdjustmentRequestCallback = function (req, res) {                                                // 222
  // this is really just req.socket.setTimeout(LONG_SOCKET_TIMEOUT);                                            // 223
  req.setTimeout(LONG_SOCKET_TIMEOUT);                                                                          // 224
  // Insert our new finish listener to run BEFORE the existing one which removes                                // 225
  // the response from the socket.                                                                              // 226
  var finishListeners = res.listeners('finish');                                                                // 227
  // XXX Apparently in Node 0.12 this event is now called 'prefinish'.                                          // 228
  // https://github.com/joyent/node/commit/7c9b6070                                                             // 229
  res.removeAllListeners('finish');                                                                             // 230
  res.on('finish', function () {                                                                                // 231
    res.setTimeout(SHORT_SOCKET_TIMEOUT);                                                                       // 232
  });                                                                                                           // 233
  _.each(finishListeners, function (l) { res.on('finish', l); });                                               // 234
};                                                                                                              // 235
                                                                                                                // 236
var runWebAppServer = function () {                                                                             // 237
  var shuttingDown = false;                                                                                     // 238
  // read the control for the client we'll be serving up                                                        // 239
  var clientJsonPath = path.join(__meteor_bootstrap__.serverDir,                                                // 240
                                 __meteor_bootstrap__.configJson.client);                                       // 241
  var clientDir = path.dirname(clientJsonPath);                                                                 // 242
  var clientJson = JSON.parse(fs.readFileSync(clientJsonPath, 'utf8'));                                         // 243
                                                                                                                // 244
  if (clientJson.format !== "browser-program-pre1")                                                             // 245
    throw new Error("Unsupported format for client assets: " +                                                  // 246
                    JSON.stringify(clientJson.format));                                                         // 247
                                                                                                                // 248
  // webserver                                                                                                  // 249
  var app = connect();                                                                                          // 250
                                                                                                                // 251
  // Strip off the path prefix, if it exists.                                                                   // 252
  app.use(function (request, response, next) {                                                                  // 253
    var pathPrefix = __meteor_runtime_config__.ROOT_URL_PATH_PREFIX;                                            // 254
    var url = Npm.require('url').parse(request.url);                                                            // 255
    var pathname = url.pathname;                                                                                // 256
    // check if the path in the url starts with the path prefix (and the part                                   // 257
    // after the path prefix must start with a / if it exists.)                                                 // 258
    if (pathPrefix && pathname.substring(0, pathPrefix.length) === pathPrefix &&                                // 259
       (pathname.length == pathPrefix.length                                                                    // 260
        || pathname.substring(pathPrefix.length, pathPrefix.length + 1) === "/")) {                             // 261
      request.url = request.url.substring(pathPrefix.length);                                                   // 262
      next();                                                                                                   // 263
    } else if (pathname === "/favicon.ico" || pathname === "/robots.txt") {                                     // 264
      next();                                                                                                   // 265
    } else if (pathPrefix) {                                                                                    // 266
      response.writeHead(404);                                                                                  // 267
      response.write("Unknown path");                                                                           // 268
      response.end();                                                                                           // 269
    } else {                                                                                                    // 270
      next();                                                                                                   // 271
    }                                                                                                           // 272
  });                                                                                                           // 273
  // Parse the query string into res.query. Used by oauth_server, but it's                                      // 274
  // generally pretty handy..                                                                                   // 275
  app.use(connect.query());                                                                                     // 276
                                                                                                                // 277
  // Auto-compress any json, javascript, or text.                                                               // 278
  app.use(connect.compress());                                                                                  // 279
                                                                                                                // 280
  var getItemPathname = function (itemUrl) {                                                                    // 281
    return decodeURIComponent(url.parse(itemUrl).pathname);                                                     // 282
  };                                                                                                            // 283
                                                                                                                // 284
  var staticFiles = {};                                                                                         // 285
  _.each(clientJson.manifest, function (item) {                                                                 // 286
    if (item.url && item.where === "client") {                                                                  // 287
      staticFiles[getItemPathname(item.url)] = {                                                                // 288
        path: item.path,                                                                                        // 289
        cacheable: item.cacheable,                                                                              // 290
        // Link from source to its map                                                                          // 291
        sourceMapUrl: item.sourceMapUrl                                                                         // 292
      };                                                                                                        // 293
                                                                                                                // 294
      if (item.sourceMap) {                                                                                     // 295
        // Serve the source map too, under the specified URL. We assume all                                     // 296
        // source maps are cacheable.                                                                           // 297
        staticFiles[getItemPathname(item.sourceMapUrl)] = {                                                     // 298
          path: item.sourceMap,                                                                                 // 299
          cacheable: true                                                                                       // 300
        };                                                                                                      // 301
      }                                                                                                         // 302
    }                                                                                                           // 303
  });                                                                                                           // 304
                                                                                                                // 305
                                                                                                                // 306
  // Serve static files from the manifest.                                                                      // 307
  // This is inspired by the 'static' middleware.                                                               // 308
  app.use(function (req, res, next) {                                                                           // 309
    if ('GET' != req.method && 'HEAD' != req.method) {                                                          // 310
      next();                                                                                                   // 311
      return;                                                                                                   // 312
    }                                                                                                           // 313
    var pathname = connect.utils.parseUrl(req).pathname;                                                        // 314
                                                                                                                // 315
    try {                                                                                                       // 316
      pathname = decodeURIComponent(pathname);                                                                  // 317
    } catch (e) {                                                                                               // 318
      next();                                                                                                   // 319
      return;                                                                                                   // 320
    }                                                                                                           // 321
                                                                                                                // 322
    var serveStaticJs = function (s) {                                                                          // 323
      res.writeHead(200, { 'Content-type': 'application/javascript' });                                         // 324
      res.write(s);                                                                                             // 325
      res.end();                                                                                                // 326
    };                                                                                                          // 327
                                                                                                                // 328
    if (pathname === "/meteor_runtime_config.js" &&                                                             // 329
        ! WebAppInternals.inlineScriptsAllowed()) {                                                             // 330
      serveStaticJs("__meteor_runtime_config__ = " +                                                            // 331
                    JSON.stringify(__meteor_runtime_config__) + ";");                                           // 332
      return;                                                                                                   // 333
    } else if (pathname === "/meteor_reload_safetybelt.js" &&                                                   // 334
               ! WebAppInternals.inlineScriptsAllowed()) {                                                      // 335
      serveStaticJs(RELOAD_SAFETYBELT);                                                                         // 336
      return;                                                                                                   // 337
    }                                                                                                           // 338
                                                                                                                // 339
    if (!_.has(staticFiles, pathname)) {                                                                        // 340
      next();                                                                                                   // 341
      return;                                                                                                   // 342
    }                                                                                                           // 343
                                                                                                                // 344
    // We don't need to call pause because, unlike 'static', once we call into                                  // 345
    // 'send' and yield to the event loop, we never call another handler with                                   // 346
    // 'next'.                                                                                                  // 347
                                                                                                                // 348
    var info = staticFiles[pathname];                                                                           // 349
                                                                                                                // 350
    // Cacheable files are files that should never change. Typically                                            // 351
    // named by their hash (eg meteor bundled js and css files).                                                // 352
    // We cache them ~forever (1yr).                                                                            // 353
    //                                                                                                          // 354
    // We cache non-cacheable files anyway. This isn't really correct, as users                                 // 355
    // can change the files and changes won't propagate immediately. However, if                                // 356
    // we don't cache them, browsers will 'flicker' when rerendering                                            // 357
    // images. Eventually we will probably want to rewrite URLs of static assets                                // 358
    // to include a query parameter to bust caches. That way we can both get                                    // 359
    // good caching behavior and allow users to change assets without delay.                                    // 360
    // https://github.com/meteor/meteor/issues/773                                                              // 361
    var maxAge = info.cacheable                                                                                 // 362
          ? 1000 * 60 * 60 * 24 * 365                                                                           // 363
          : 1000 * 60 * 60 * 24;                                                                                // 364
                                                                                                                // 365
    // Set the X-SourceMap header, which current Chrome understands.                                            // 366
    // (The files also contain '//#' comments which FF 24 understands and                                       // 367
    // Chrome doesn't understand yet.)                                                                          // 368
    //                                                                                                          // 369
    // Eventually we should set the SourceMap header but the current version of                                 // 370
    // Chrome and no version of FF supports it.                                                                 // 371
    //                                                                                                          // 372
    // To figure out if your version of Chrome should support the SourceMap                                     // 373
    // header,                                                                                                  // 374
    //   - go to chrome://version. Let's say the Chrome version is                                              // 375
    //      28.0.1500.71 and the Blink version is 537.36 (@153022)                                              // 376
    //   - go to http://src.chromium.org/viewvc/blink/branches/chromium/1500/Source/core/inspector/InspectorPageAgent.cpp?view=log
    //     where the "1500" is the third part of your Chrome version                                            // 378
    //   - find the first revision that is no greater than the "153022"                                         // 379
    //     number.  That's probably the first one and it probably has                                           // 380
    //     a message of the form "Branch 1500 - blink@r149738"                                                  // 381
    //   - If *that* revision number (149738) is at least 151755,                                               // 382
    //     then Chrome should support SourceMap (not just X-SourceMap)                                          // 383
    // (The change is https://codereview.chromium.org/15832007)                                                 // 384
    //                                                                                                          // 385
    // You also need to enable source maps in Chrome: open dev tools, click                                     // 386
    // the gear in the bottom right corner, and select "enable source maps".                                    // 387
    //                                                                                                          // 388
    // Firefox 23+ supports source maps but doesn't support either header yet,                                  // 389
    // so we include the '//#' comment for it:                                                                  // 390
    //   https://bugzilla.mozilla.org/show_bug.cgi?id=765993                                                    // 391
    // In FF 23 you need to turn on `devtools.debugger.source-maps-enabled`                                     // 392
    // in `about:config` (it is on by default in FF 24).                                                        // 393
    if (info.sourceMapUrl)                                                                                      // 394
      res.setHeader('X-SourceMap', info.sourceMapUrl);                                                          // 395
                                                                                                                // 396
    send(req, path.join(clientDir, info.path))                                                                  // 397
      .maxage(maxAge)                                                                                           // 398
      .hidden(true)  // if we specified a dotfile in the manifest, serve it                                     // 399
      .on('error', function (err) {                                                                             // 400
        Log.error("Error serving static file " + err);                                                          // 401
        res.writeHead(500);                                                                                     // 402
        res.end();                                                                                              // 403
      })                                                                                                        // 404
      .on('directory', function () {                                                                            // 405
        Log.error("Unexpected directory " + info.path);                                                         // 406
        res.writeHead(500);                                                                                     // 407
        res.end();                                                                                              // 408
      })                                                                                                        // 409
      .pipe(res);                                                                                               // 410
  });                                                                                                           // 411
                                                                                                                // 412
  // Packages and apps can add handlers to this via WebApp.connectHandlers.                                     // 413
  // They are inserted before our default handler.                                                              // 414
  var packageAndAppHandlers = connect();                                                                        // 415
  app.use(packageAndAppHandlers);                                                                               // 416
                                                                                                                // 417
  var suppressConnectErrors = false;                                                                            // 418
  // connect knows it is an error handler because it has 4 arguments instead of                                 // 419
  // 3. go figure.  (It is not smart enough to find such a thing if it's hidden                                 // 420
  // inside packageAndAppHandlers.)                                                                             // 421
  app.use(function (err, req, res, next) {                                                                      // 422
    if (!err || !suppressConnectErrors || !req.headers['x-suppress-error']) {                                   // 423
      next(err);                                                                                                // 424
      return;                                                                                                   // 425
    }                                                                                                           // 426
    res.writeHead(err.status, { 'Content-Type': 'text/plain' });                                                // 427
    res.end("An error message");                                                                                // 428
  });                                                                                                           // 429
                                                                                                                // 430
  // Will be updated by main before we listen.                                                                  // 431
  var boilerplateHtml = null;                                                                                   // 432
  app.use(function (req, res, next) {                                                                           // 433
    if (! appUrl(req.url))                                                                                      // 434
      return next();                                                                                            // 435
                                                                                                                // 436
    if (!boilerplateHtml)                                                                                       // 437
      throw new Error("boilerplateHtml should be set before listening!");                                       // 438
                                                                                                                // 439
                                                                                                                // 440
    var headers = {                                                                                             // 441
      'Content-Type':  'text/html; charset=utf-8'                                                               // 442
    };                                                                                                          // 443
    if (shuttingDown)                                                                                           // 444
      headers['Connection'] = 'Close';                                                                          // 445
                                                                                                                // 446
    var request = WebApp.categorizeRequest(req);                                                                // 447
                                                                                                                // 448
    res.writeHead(200, headers);                                                                                // 449
                                                                                                                // 450
    var requestSpecificHtml = htmlAttributes(boilerplateHtml, request);                                         // 451
    res.write(requestSpecificHtml);                                                                             // 452
    res.end();                                                                                                  // 453
    return undefined;                                                                                           // 454
  });                                                                                                           // 455
                                                                                                                // 456
  // Return 404 by default, if no other handlers serve this URL.                                                // 457
  app.use(function (req, res) {                                                                                 // 458
    res.writeHead(404);                                                                                         // 459
    res.end();                                                                                                  // 460
  });                                                                                                           // 461
                                                                                                                // 462
                                                                                                                // 463
  var httpServer = http.createServer(app);                                                                      // 464
  var onListeningCallbacks = [];                                                                                // 465
                                                                                                                // 466
  // After 5 seconds w/o data on a socket, kill it.  On the other hand, if                                      // 467
  // there's an outstanding request, give it a higher timeout instead (to avoid                                 // 468
  // killing long-polling requests)                                                                             // 469
  httpServer.setTimeout(SHORT_SOCKET_TIMEOUT);                                                                  // 470
                                                                                                                // 471
  // Do this here, and then also in livedata/stream_server.js, because                                          // 472
  // stream_server.js kills all the current request handlers when installing its                                // 473
  // own.                                                                                                       // 474
  httpServer.on('request', WebApp._timeoutAdjustmentRequestCallback);                                           // 475
                                                                                                                // 476
                                                                                                                // 477
  // For now, handle SIGHUP here.  Later, this should be in some centralized                                    // 478
  // Meteor shutdown code.                                                                                      // 479
  process.on('SIGHUP', Meteor.bindEnvironment(function () {                                                     // 480
    shuttingDown = true;                                                                                        // 481
    // tell others with websockets open that we plan to close this.                                             // 482
    // XXX: Eventually, this should be done with a standard meteor shut-down                                    // 483
    // logic path.                                                                                              // 484
    httpServer.emit('meteor-closing');                                                                          // 485
    httpServer.close( function () {                                                                             // 486
      process.exit(0);                                                                                          // 487
    });                                                                                                         // 488
    // Ideally we will close before this hits.                                                                  // 489
    Meteor.setTimeout(function () {                                                                             // 490
      Log.warn("Closed by SIGHUP but one or more HTTP requests may not have finished.");                        // 491
      process.exit(1);                                                                                          // 492
    }, 5000);                                                                                                   // 493
  }, function (err) {                                                                                           // 494
    console.log(err);                                                                                           // 495
    process.exit(1);                                                                                            // 496
  }));                                                                                                          // 497
                                                                                                                // 498
  // start up app                                                                                               // 499
  _.extend(WebApp, {                                                                                            // 500
    connectHandlers: packageAndAppHandlers,                                                                     // 501
    httpServer: httpServer,                                                                                     // 502
    // metadata about the client program that we serve                                                          // 503
    clientProgram: {                                                                                            // 504
      manifest: clientJson.manifest                                                                             // 505
      // XXX do we need a "root: clientDir" field here? it used to be here but                                  // 506
      // was unused.                                                                                            // 507
    },                                                                                                          // 508
    // For testing.                                                                                             // 509
    suppressConnectErrors: function () {                                                                        // 510
      suppressConnectErrors = true;                                                                             // 511
    },                                                                                                          // 512
    onListening: function (f) {                                                                                 // 513
      if (onListeningCallbacks)                                                                                 // 514
        onListeningCallbacks.push(f);                                                                           // 515
      else                                                                                                      // 516
        f();                                                                                                    // 517
    },                                                                                                          // 518
    // Hack: allow http tests to call connect.basicAuth without making them                                     // 519
    // Npm.depends on another copy of connect. (That would be fine if we could                                  // 520
    // have test-only NPM dependencies but is overkill here.)                                                   // 521
    __basicAuth__: connect.basicAuth                                                                            // 522
  });                                                                                                           // 523
                                                                                                                // 524
  // Let the rest of the packages (and Meteor.startup hooks) insert connect                                     // 525
  // middlewares and update __meteor_runtime_config__, then keep going to set up                                // 526
  // actually serving HTML.                                                                                     // 527
  main = function (argv) {                                                                                      // 528
    // main happens post startup hooks, so we don't need a Meteor.startup() to                                  // 529
    // ensure this happens after the galaxy package is loaded.                                                  // 530
    var AppConfig = Package["application-configuration"].AppConfig;                                             // 531
    argv = optimist(argv).boolean('keepalive').argv;                                                            // 532
                                                                                                                // 533
    var boilerplateHtmlPath = path.join(clientDir, clientJson.page);                                            // 534
    boilerplateHtml = fs.readFileSync(boilerplateHtmlPath, 'utf8');                                             // 535
                                                                                                                // 536
    // Include __meteor_runtime_config__ in the app html, as an inline script if                                // 537
    // it's not forbidden by CSP.                                                                               // 538
    if (WebAppInternals.inlineScriptsAllowed()) {                                                               // 539
      boilerplateHtml = boilerplateHtml.replace(                                                                // 540
          /##RUNTIME_CONFIG##/,                                                                                 // 541
        "<script type='text/javascript'>__meteor_runtime_config__ = " +                                         // 542
          JSON.stringify(__meteor_runtime_config__) + ";</script>");                                            // 543
      boilerplateHtml = boilerplateHtml.replace(                                                                // 544
          /##RELOAD_SAFETYBELT##/,                                                                              // 545
        "<script type='text/javascript'>"+RELOAD_SAFETYBELT+"</script>");                                       // 546
    } else {                                                                                                    // 547
      boilerplateHtml = boilerplateHtml.replace(                                                                // 548
        /##RUNTIME_CONFIG##/,                                                                                   // 549
        "<script type='text/javascript' src='##ROOT_URL_PATH_PREFIX##/meteor_runtime_config.js'></script>"      // 550
      );                                                                                                        // 551
      boilerplateHtml = boilerplateHtml.replace(                                                                // 552
          /##RELOAD_SAFETYBELT##/,                                                                              // 553
        "<script type='text/javascript' src='##ROOT_URL_PATH_PREFIX##/meteor_reload_safetybelt.js'></script>"); // 554
                                                                                                                // 555
    }                                                                                                           // 556
    boilerplateHtml = boilerplateHtml.replace(                                                                  // 557
        /##ROOT_URL_PATH_PREFIX##/g,                                                                            // 558
      __meteor_runtime_config__.ROOT_URL_PATH_PREFIX || "");                                                    // 559
                                                                                                                // 560
    boilerplateHtml = boilerplateHtml.replace(                                                                  // 561
        /##BUNDLED_JS_CSS_PREFIX##/g,                                                                           // 562
      bundledJsCssPrefix ||                                                                                     // 563
        __meteor_runtime_config__.ROOT_URL_PATH_PREFIX || "");                                                  // 564
                                                                                                                // 565
    // only start listening after all the startup code has run.                                                 // 566
    var localPort = parseInt(process.env.PORT) || 0;                                                            // 567
    var host = process.env.BIND_IP;                                                                             // 568
    var localIp = host || '0.0.0.0';                                                                            // 569
    httpServer.listen(localPort, localIp, Meteor.bindEnvironment(function() {                                   // 570
      if (argv.keepalive || true)                                                                               // 571
        console.log("LISTENING"); // must match run.js                                                          // 572
      var proxyBinding;                                                                                         // 573
                                                                                                                // 574
      AppConfig.configurePackage('webapp', function (configuration) {                                           // 575
        if (proxyBinding)                                                                                       // 576
          proxyBinding.stop();                                                                                  // 577
        if (configuration && configuration.proxy) {                                                             // 578
          var proxyServiceName = process.env.ADMIN_APP ? "adminProxy" : "proxy";                                // 579
                                                                                                                // 580
          // TODO: We got rid of the place where this checks the app's                                          // 581
          // configuration, because this wants to be configured for some things                                 // 582
          // on a per-job basis.  Discuss w/ teammates.                                                         // 583
          proxyBinding = AppConfig.configureService(proxyServiceName, function (proxyService) {                 // 584
            if (proxyService.providers.proxy) {                                                                 // 585
              var proxyConf;                                                                                    // 586
              if (process.env.ADMIN_APP) {                                                                      // 587
                proxyConf = {                                                                                   // 588
                  securePort: 44333,                                                                            // 589
                  insecurePort: 9414,                                                                           // 590
                  bindHost: "localhost",                                                                        // 591
                  bindPathPrefix: "/" + makeAppNamePathPrefix(process.env.GALAXY_APP)                           // 592
                };                                                                                              // 593
              } else {                                                                                          // 594
                proxyConf = configuration.proxy;                                                                // 595
              }                                                                                                 // 596
              Log("Attempting to bind to proxy at " + proxyService.providers.proxy);                            // 597
              WebAppInternals.bindToProxy(_.extend({                                                            // 598
                proxyEndpoint: proxyService.providers.proxy                                                     // 599
              }, proxyConf), proxyServiceName);                                                                 // 600
            }                                                                                                   // 601
          });                                                                                                   // 602
        }                                                                                                       // 603
      });                                                                                                       // 604
                                                                                                                // 605
      var callbacks = onListeningCallbacks;                                                                     // 606
      onListeningCallbacks = null;                                                                              // 607
      _.each(callbacks, function (x) { x(); });                                                                 // 608
                                                                                                                // 609
    }, function (e) {                                                                                           // 610
      console.error("Error listening:", e);                                                                     // 611
      console.error(e && e.stack);                                                                              // 612
    }));                                                                                                        // 613
                                                                                                                // 614
    if (argv.keepalive)                                                                                         // 615
      initKeepalive();                                                                                          // 616
    return 'DAEMON';                                                                                            // 617
  };                                                                                                            // 618
};                                                                                                              // 619
                                                                                                                // 620
                                                                                                                // 621
var proxy;                                                                                                      // 622
WebAppInternals.bindToProxy = function (proxyConfig, proxyServiceName) {                                        // 623
  var securePort = proxyConfig.securePort || 4433;                                                              // 624
  var insecurePort = proxyConfig.insecurePort || 8080;                                                          // 625
  var bindPathPrefix = proxyConfig.bindPathPrefix || "";                                                        // 626
  // XXX also support galaxy-based lookup                                                                       // 627
  if (!proxyConfig.proxyEndpoint)                                                                               // 628
    throw new Error("missing proxyEndpoint");                                                                   // 629
  if (!proxyConfig.bindHost)                                                                                    // 630
    throw new Error("missing bindHost");                                                                        // 631
  if (!process.env.GALAXY_JOB)                                                                                  // 632
    throw new Error("missing $GALAXY_JOB");                                                                     // 633
  if (!process.env.GALAXY_APP)                                                                                  // 634
    throw new Error("missing $GALAXY_APP");                                                                     // 635
  if (!process.env.LAST_START)                                                                                  // 636
    throw new Error("missing $LAST_START");                                                                     // 637
                                                                                                                // 638
  // XXX rename pid argument to bindTo.                                                                         // 639
  var pid = {                                                                                                   // 640
    job: process.env.GALAXY_JOB,                                                                                // 641
    lastStarted: +(process.env.LAST_START),                                                                     // 642
    app: process.env.GALAXY_APP                                                                                 // 643
  };                                                                                                            // 644
  var myHost = os.hostname();                                                                                   // 645
                                                                                                                // 646
  var ddpBindTo = {                                                                                             // 647
    ddpUrl: 'ddp://' + proxyConfig.bindHost + ':' + securePort + bindPathPrefix + '/',                          // 648
    insecurePort: insecurePort                                                                                  // 649
  };                                                                                                            // 650
                                                                                                                // 651
  // This is run after packages are loaded (in main) so we can use                                              // 652
  // Follower.connect.                                                                                          // 653
  if (proxy) {                                                                                                  // 654
    proxy.reconnect({                                                                                           // 655
      url: proxyConfig.proxyEndpoint                                                                            // 656
    });                                                                                                         // 657
  } else {                                                                                                      // 658
    proxy = Package["follower-livedata"].Follower.connect(                                                      // 659
      proxyConfig.proxyEndpoint, {                                                                              // 660
        group: proxyServiceName                                                                                 // 661
      }                                                                                                         // 662
    );                                                                                                          // 663
  }                                                                                                             // 664
                                                                                                                // 665
  var route = process.env.ROUTE;                                                                                // 666
  var host = route.split(":")[0];                                                                               // 667
  var port = +route.split(":")[1];                                                                              // 668
                                                                                                                // 669
  var completedBindings = {                                                                                     // 670
    ddp: false,                                                                                                 // 671
    http: false,                                                                                                // 672
    https: proxyConfig.securePort !== null ? false : undefined                                                  // 673
  };                                                                                                            // 674
                                                                                                                // 675
  var bindingDoneCallback = function (binding) {                                                                // 676
    return function (err, resp) {                                                                               // 677
      if (err)                                                                                                  // 678
        throw err;                                                                                              // 679
                                                                                                                // 680
      completedBindings[binding] = true;                                                                        // 681
      var completedAll = _.every(_.keys(completedBindings), function (binding) {                                // 682
        return (completedBindings[binding] ||                                                                   // 683
          completedBindings[binding] === undefined);                                                            // 684
      });                                                                                                       // 685
      if (completedAll)                                                                                         // 686
        Log("Bound to proxy.");                                                                                 // 687
      return completedAll;                                                                                      // 688
    };                                                                                                          // 689
  };                                                                                                            // 690
                                                                                                                // 691
  var version = "";                                                                                             // 692
  if (!process.env.ADMIN_APP) {                                                                                 // 693
    var AppConfig = Package["application-configuration"].AppConfig;                                             // 694
    version = AppConfig.getStarForThisJob() || "";                                                              // 695
  }                                                                                                             // 696
  proxy.call('bindDdp', {                                                                                       // 697
    pid: pid,                                                                                                   // 698
    bindTo: ddpBindTo,                                                                                          // 699
    proxyTo: {                                                                                                  // 700
      tags: [version],                                                                                          // 701
      host: host,                                                                                               // 702
      port: port,                                                                                               // 703
      pathPrefix: bindPathPrefix + '/websocket'                                                                 // 704
    }                                                                                                           // 705
  }, bindingDoneCallback("ddp"));                                                                               // 706
  proxy.call('bindHttp', {                                                                                      // 707
    pid: pid,                                                                                                   // 708
    bindTo: {                                                                                                   // 709
      host: proxyConfig.bindHost,                                                                               // 710
      port: insecurePort,                                                                                       // 711
      pathPrefix: bindPathPrefix                                                                                // 712
    },                                                                                                          // 713
    proxyTo: {                                                                                                  // 714
      tags: [version],                                                                                          // 715
      host: host,                                                                                               // 716
      port: port,                                                                                               // 717
      pathPrefix: bindPathPrefix                                                                                // 718
    }                                                                                                           // 719
  }, bindingDoneCallback("http"));                                                                              // 720
  if (proxyConfig.securePort !== null) {                                                                        // 721
    proxy.call('bindHttp', {                                                                                    // 722
      pid: pid,                                                                                                 // 723
      bindTo: {                                                                                                 // 724
        host: proxyConfig.bindHost,                                                                             // 725
        port: securePort,                                                                                       // 726
        pathPrefix: bindPathPrefix,                                                                             // 727
        ssl: true                                                                                               // 728
      },                                                                                                        // 729
      proxyTo: {                                                                                                // 730
        tags: [version],                                                                                        // 731
        host: host,                                                                                             // 732
        port: port,                                                                                             // 733
        pathPrefix: bindPathPrefix                                                                              // 734
      }                                                                                                         // 735
    }, bindingDoneCallback("https"));                                                                           // 736
  }                                                                                                             // 737
};                                                                                                              // 738
                                                                                                                // 739
runWebAppServer();                                                                                              // 740
                                                                                                                // 741
                                                                                                                // 742
var inlineScriptsAllowed = true;                                                                                // 743
                                                                                                                // 744
WebAppInternals.inlineScriptsAllowed = function () {                                                            // 745
  return inlineScriptsAllowed;                                                                                  // 746
};                                                                                                              // 747
                                                                                                                // 748
WebAppInternals.setInlineScriptsAllowed = function (value) {                                                    // 749
  inlineScriptsAllowed = value;                                                                                 // 750
};                                                                                                              // 751
                                                                                                                // 752
WebAppInternals.setBundledJsCssPrefix = function (prefix) {                                                     // 753
  bundledJsCssPrefix = prefix;                                                                                  // 754
};                                                                                                              // 755
                                                                                                                // 756
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.webapp = {
  WebApp: WebApp,
  main: main,
  WebAppInternals: WebAppInternals
};

})();
