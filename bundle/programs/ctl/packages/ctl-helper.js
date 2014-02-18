(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;
var DDP = Package.livedata.DDP;
var DDPServer = Package.livedata.DDPServer;
var MongoInternals = Package['mongo-livedata'].MongoInternals;
var Follower = Package['follower-livedata'].Follower;
var AppConfig = Package['application-configuration'].AppConfig;

/* Package-scope variables */
var Ctl;

(function () {

////////////////////////////////////////////////////////////////////////////////////////
//                                                                                    //
// packages/ctl-helper/ctl-helper.js                                                  //
//                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////
                                                                                      //
var optimist = Npm.require('optimist');                                               // 1
var Future = Npm.require('fibers/future');                                            // 2
                                                                                      // 3
Ctl = {};                                                                             // 4
                                                                                      // 5
var connection;                                                                       // 6
var checkConnection;                                                                  // 7
                                                                                      // 8
_.extend(Ctl, {                                                                       // 9
  Commands: [],                                                                       // 10
                                                                                      // 11
  main: function (argv) {                                                             // 12
    var opt = optimist(argv)                                                          // 13
          .alias('h', 'help')                                                         // 14
          .boolean('help');                                                           // 15
    argv = opt.argv;                                                                  // 16
                                                                                      // 17
    if (argv.help) {                                                                  // 18
      argv._.splice(0, 0, "help");                                                    // 19
      delete argv.help;                                                               // 20
    }                                                                                 // 21
                                                                                      // 22
    var cmdName = 'help';                                                             // 23
    if (argv._.length)                                                                // 24
      cmdName = argv._.splice(0,1)[0];                                                // 25
                                                                                      // 26
    Ctl.findCommand(cmdName).func(argv);                                              // 27
    Ctl.disconnect();                                                                 // 28
    return 0;                                                                         // 29
  },                                                                                  // 30
                                                                                      // 31
  startServerlikeProgramIfNotPresent: function (program, tags, admin) {               // 32
    var numServers = Ctl.getJobsByApp(                                                // 33
      Ctl.myAppName(), {program: program, done: false}).count();                      // 34
    if (numServers === 0) {                                                           // 35
      return Ctl.startServerlikeProgram(program, tags, admin);                        // 36
    } else {                                                                          // 37
      console.log(program, "already running.");                                       // 38
    }                                                                                 // 39
    return null;                                                                      // 40
  },                                                                                  // 41
                                                                                      // 42
  startServerlikeProgram: function (program, tags, admin) {                           // 43
    var appConfig = Ctl.prettyCall(                                                   // 44
      Ctl.findGalaxy(), 'getAppConfiguration', [Ctl.myAppName()]);                    // 45
    if (typeof admin == 'undefined')                                                  // 46
      admin = appConfig.admin;                                                        // 47
                                                                                      // 48
    var proxyConfig;                                                                  // 49
    var bindPathPrefix = "";                                                          // 50
    var jobId = null;                                                                 // 51
    if (admin) {                                                                      // 52
      bindPathPrefix = "/" + encodeURIComponent(Ctl.myAppName()).replace(/\./g, '_'); // 53
    }                                                                                 // 54
                                                                                      // 55
    // Allow appConfig settings to be objects or strings. We need to stringify        // 56
    // them to pass them to the app in the env var.                                   // 57
    // Backwards compat with old app config format.                                   // 58
    _.each(["settings", "METEOR_SETTINGS"], function (settingsKey) {                  // 59
      if (appConfig[settingsKey] && typeof appConfig[settingsKey] === "object")       // 60
        appConfig[settingsKey] = JSON.stringify(appConfig[settingsKey]);              // 61
    });                                                                               // 62
                                                                                      // 63
    // XXX args? env?                                                                 // 64
    jobId = Ctl.prettyCall(Ctl.findGalaxy(), 'run', [Ctl.myAppName(), program, {      // 65
      exitPolicy: 'restart',                                                          // 66
      env: {                                                                          // 67
        ROOT_URL: "https://" + appConfig.sitename + bindPathPrefix,                   // 68
        METEOR_SETTINGS: appConfig.settings || appConfig.METEOR_SETTINGS,             // 69
        ADMIN_APP: admin                                                              // 70
      },                                                                              // 71
      ports: {                                                                        // 72
        "main": {                                                                     // 73
          bindEnv: "PORT",                                                            // 74
          routeEnv: "ROUTE"//,                                                        // 75
          //bindIpEnv: "BIND_IP" // Later, we can teach Satellite to do               // 76
          //something like recommend the process bind to a particular IP here.        // 77
          //For now, we don't have a way of setting this, so Satellite binds          // 78
          //to 0.0.0.0                                                                // 79
        }                                                                             // 80
      },                                                                              // 81
      tags: tags                                                                      // 82
    }]);                                                                              // 83
    console.log("Started", program);                                                  // 84
    return jobId;                                                                     // 85
  },                                                                                  // 86
                                                                                      // 87
  findCommand: function (name) {                                                      // 88
    var cmd = _.where(Ctl.Commands, { name: name })[0];                               // 89
    if (! cmd) {                                                                      // 90
      console.log("'" + name + "' is not a ctl command. See 'ctl --help'.");          // 91
      process.exit(1);                                                                // 92
    }                                                                                 // 93
                                                                                      // 94
    return cmd;                                                                       // 95
  },                                                                                  // 96
                                                                                      // 97
  hasProgram: function (name) {                                                       // 98
    Ctl.subscribeToAppJobs(Ctl.myAppName());                                          // 99
    var myJob = Ctl.jobsCollection().findOne(Ctl.myJobId());                          // 100
    var manifest = Ctl.prettyCall(Ctl.findGalaxy(), 'getStarManifest', [myJob.star]); // 101
    if (!manifest)                                                                    // 102
      return false;                                                                   // 103
    var found = false;                                                                // 104
    return _.find(manifest.programs, function (prog) { return prog.name === name; }); // 105
  },                                                                                  // 106
                                                                                      // 107
  findGalaxy: _.once(function () {                                                    // 108
    if (!('GALAXY' in process.env)) {                                                 // 109
      console.log(                                                                    // 110
        "GALAXY environment variable must be set. See 'galaxy --help'.");             // 111
      process.exit(1);                                                                // 112
    }                                                                                 // 113
                                                                                      // 114
    connection = Follower.connect(process.env['ULTRAWORLD_DDP_ENDPOINT']);            // 115
    checkConnection = Meteor.setInterval(function () {                                // 116
      if (Ctl.findGalaxy().status().status !== "connected" &&                         // 117
          Ctl.findGalaxy().status().retryCount > 2) {                                 // 118
        console.log("Cannot connect to galaxy; exiting");                             // 119
        process.exit(3);                                                              // 120
      }                                                                               // 121
    }, 2*1000);                                                                       // 122
    return connection;                                                                // 123
  }),                                                                                 // 124
                                                                                      // 125
  disconnect: function () {                                                           // 126
    if (connection) {                                                                 // 127
      connection.disconnect();                                                        // 128
    }                                                                                 // 129
    if (checkConnection) {                                                            // 130
      Meteor.clearInterval(checkConnection);                                          // 131
      checkConnection = null;                                                         // 132
    }                                                                                 // 133
  },                                                                                  // 134
                                                                                      // 135
  updateProxyActiveTags: function (tags) {                                            // 136
    var proxy;                                                                        // 137
    var proxyTagSwitchFuture = new Future;                                            // 138
    AppConfig.configureService('proxy', function (proxyService) {                     // 139
      try {                                                                           // 140
        proxy = Follower.connect(proxyService.providers.proxy, {                      // 141
        group: "proxy"                                                                // 142
        });                                                                           // 143
        proxy.call('updateTags', Ctl.myAppName(), tags);                              // 144
        proxy.disconnect();                                                           // 145
        if (!proxyTagSwitchFuture.isResolved())                                       // 146
          proxyTagSwitchFuture['return']();                                           // 147
      } catch (e) {                                                                   // 148
        if (!proxyTagSwitchFuture.isResolved())                                       // 149
          proxyTagSwitchFuture['throw'](e);                                           // 150
      }                                                                               // 151
    });                                                                               // 152
                                                                                      // 153
    var proxyTimeout = Meteor.setTimeout(function () {                                // 154
      if (!proxyTagSwitchFuture.isResolved())                                         // 155
        proxyTagSwitchFuture['throw'](                                                // 156
          new Error("timed out looking for a proxy " +                                // 157
                    "or trying to change tags on it " +                               // 158
                    proxy.status().status));                                          // 159
    }, 10*1000);                                                                      // 160
    proxyTagSwitchFuture.wait();                                                      // 161
    Meteor.clearTimeout(proxyTimeout);                                                // 162
  },                                                                                  // 163
                                                                                      // 164
  jobsCollection: _.once(function () {                                                // 165
    return new Meteor.Collection("jobs", {manager: Ctl.findGalaxy()});                // 166
  }),                                                                                 // 167
                                                                                      // 168
  // use _.memoize so that this is called only once per app.                          // 169
  subscribeToAppJobs: _.memoize(function (appName) {                                  // 170
    Ctl.findGalaxy()._subscribeAndWait("jobsByApp", [appName]);                       // 171
  }),                                                                                 // 172
                                                                                      // 173
  // XXX this never unsubs...                                                         // 174
  getJobsByApp: function (appName, restOfSelector) {                                  // 175
    var galaxy = Ctl.findGalaxy();                                                    // 176
    Ctl.subscribeToAppJobs(appName);                                                  // 177
    var selector = {app: appName};                                                    // 178
    if (restOfSelector)                                                               // 179
      _.extend(selector, restOfSelector);                                             // 180
    return Ctl.jobsCollection().find(selector);                                       // 181
  },                                                                                  // 182
                                                                                      // 183
  myAppName: _.once(function () {                                                     // 184
    if (!('GALAXY_APP' in process.env)) {                                             // 185
      console.log("GALAXY_APP environment variable must be set.");                    // 186
      process.exit(1);                                                                // 187
    }                                                                                 // 188
    return process.env.GALAXY_APP;                                                    // 189
  }),                                                                                 // 190
                                                                                      // 191
  myJobId: _.once(function () {                                                       // 192
    if (!('GALAXY_JOB' in process.env)) {                                             // 193
      console.log("GALAXY_JOB environment variable must be set.");                    // 194
      process.exit(1);                                                                // 195
    }                                                                                 // 196
    return process.env.GALAXY_JOB;                                                    // 197
  }),                                                                                 // 198
                                                                                      // 199
  usage: function() {                                                                 // 200
    process.stdout.write(                                                             // 201
      "Usage: ctl [--help] <command> [<args>]\n" +                                    // 202
        "\n" +                                                                        // 203
        "For now, the GALAXY environment variable must be set to the location of\n" + // 204
        "your Galaxy management server (Ultraworld.) This string is in the same\n" +  // 205
        "format as the argument to DDP.connect().\n" +                                // 206
        "\n" +                                                                        // 207
        "Commands:\n");                                                               // 208
    _.each(Ctl.Commands, function (cmd) {                                             // 209
      if (cmd.help && ! cmd.hidden) {                                                 // 210
        var name = cmd.name + "                ".substr(cmd.name.length);             // 211
        process.stdout.write("   " + name + cmd.help + "\n");                         // 212
      }                                                                               // 213
    });                                                                               // 214
    process.stdout.write("\n");                                                       // 215
    process.stdout.write(                                                             // 216
      "See 'ctl help <command>' for details on a command.\n");                        // 217
    process.exit(1);                                                                  // 218
  },                                                                                  // 219
                                                                                      // 220
  // XXX copied to meteor/tools/deploy-galaxy.js                                      // 221
  exitWithError: function (error, messages) {                                         // 222
    messages = messages || {};                                                        // 223
                                                                                      // 224
    if (! (error instanceof Meteor.Error))                                            // 225
      throw error; // get a stack                                                     // 226
                                                                                      // 227
    var msg = messages[error.error];                                                  // 228
    if (msg)                                                                          // 229
      process.stderr.write(msg + "\n");                                               // 230
    else if (error instanceof Meteor.Error)                                           // 231
      process.stderr.write("Denied: " + error.message + "\n");                        // 232
                                                                                      // 233
    process.exit(1);                                                                  // 234
  },                                                                                  // 235
                                                                                      // 236
  // XXX copied to meteor/tools/deploy-galaxy.js                                      // 237
  prettyCall: function (galaxy, name, args, messages) {                               // 238
    try {                                                                             // 239
      var ret = galaxy.apply(name, args);                                             // 240
    } catch (e) {                                                                     // 241
      Ctl.exitWithError(e, messages);                                                 // 242
    }                                                                                 // 243
    return ret;                                                                       // 244
  },                                                                                  // 245
                                                                                      // 246
  kill: function (programName, jobId) {                                               // 247
  console.log("Killing %s (%s)", programName, jobId);                                 // 248
  Ctl.prettyCall(Ctl.findGalaxy(), 'kill', [jobId]);                                  // 249
  }                                                                                   // 250
});                                                                                   // 251
                                                                                      // 252
////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['ctl-helper'] = {
  Ctl: Ctl
};

})();
