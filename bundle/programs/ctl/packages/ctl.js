(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;
var DDP = Package.livedata.DDP;
var DDPServer = Package.livedata.DDPServer;
var MongoInternals = Package['mongo-livedata'].MongoInternals;
var Ctl = Package['ctl-helper'].Ctl;
var AppConfig = Package['application-configuration'].AppConfig;
var Follower = Package['follower-livedata'].Follower;

/* Package-scope variables */
var main;

(function () {

///////////////////////////////////////////////////////////////////////////////////
//                                                                               //
// packages/ctl/ctl.js                                                           //
//                                                                               //
///////////////////////////////////////////////////////////////////////////////////
                                                                                 //
var Future = Npm.require("fibers/future");                                       // 1
                                                                                 // 2
Ctl.Commands.push({                                                              // 3
  name: "help",                                                                  // 4
  func: function (argv) {                                                        // 5
    if (!argv._.length || argv.help)                                             // 6
      Ctl.usage();                                                               // 7
    var cmd = argv._.splice(0,1)[0];                                             // 8
    argv.help = true;                                                            // 9
                                                                                 // 10
    Ctl.findCommand(cmd).func(argv);                                             // 11
  }                                                                              // 12
});                                                                              // 13
                                                                                 // 14
var mergeObjects = function (obj1, obj2) {                                       // 15
  var result = _.clone(obj1);                                                    // 16
  _.each(obj2, function (v, k) {                                                 // 17
    // If both objects have an object at this key, then merge those objects.     // 18
    // Otherwise, choose obj2's value.                                           // 19
    if ((v instanceof Object) && (obj1[k] instanceof Object))                    // 20
      result[k] = mergeObjects(v, obj1[k]);                                      // 21
    else                                                                         // 22
      result[k] = v;                                                             // 23
  });                                                                            // 24
  return result;                                                                 // 25
};                                                                               // 26
                                                                                 // 27
                                                                                 // 28
                                                                                 // 29
var startFun = function (argv) {                                                 // 30
  if (argv.help || argv._.length !== 0) {                                        // 31
    process.stderr.write(                                                        // 32
      "Usage: ctl start\n" +                                                     // 33
        "\n" +                                                                   // 34
        "Starts the app. For now, this just means that it runs the 'server'\n" + // 35
        "program.\n"                                                             // 36
    );                                                                           // 37
    process.exit(1);                                                             // 38
  }                                                                              // 39
  Ctl.subscribeToAppJobs(Ctl.myAppName());                                       // 40
  var jobs = Ctl.jobsCollection();                                               // 41
  var thisJob = jobs.findOne(Ctl.myJobId());                                     // 42
  Ctl.updateProxyActiveTags(['', thisJob.star]);                                 // 43
  if (Ctl.hasProgram("console")) {                                               // 44
    console.log("starting console for app", Ctl.myAppName());                    // 45
    Ctl.startServerlikeProgramIfNotPresent("console", ["admin"], true);          // 46
  }                                                                              // 47
  console.log("starting server for app", Ctl.myAppName());                       // 48
  Ctl.startServerlikeProgramIfNotPresent("server", ["runner"]);                  // 49
};                                                                               // 50
                                                                                 // 51
Ctl.Commands.push({                                                              // 52
  name: "start",                                                                 // 53
  help: "Start this app",                                                        // 54
  func: startFun                                                                 // 55
});                                                                              // 56
                                                                                 // 57
                                                                                 // 58
Ctl.Commands.push({                                                              // 59
  name: "endUpdate",                                                             // 60
  help: "Start this app to end an update",                                       // 61
  func: startFun                                                                 // 62
});                                                                              // 63
                                                                                 // 64
var stopFun =  function (argv) {                                                 // 65
  if (argv.help || argv._.length !== 0) {                                        // 66
    process.stderr.write(                                                        // 67
      "Usage: ctl stop\n" +                                                      // 68
        "\n" +                                                                   // 69
        "Stops the app. For now, this just means that it kills all jobs\n" +     // 70
        "other than itself.\n"                                                   // 71
    );                                                                           // 72
    process.exit(1);                                                             // 73
  }                                                                              // 74
                                                                                 // 75
  // Get all jobs (other than this job: don't commit suicide!) that are not      // 76
  // already killed.                                                             // 77
  var jobs = Ctl.getJobsByApp(                                                   // 78
    Ctl.myAppName(), {_id: {$ne: Ctl.myJobId()}, done: false});                  // 79
  jobs.forEach(function (job) {                                                  // 80
    // Don't commit suicide.                                                     // 81
    if (job._id === Ctl.myJobId())                                               // 82
      return;                                                                    // 83
    // It's dead, Jim.                                                           // 84
    if (job.done)                                                                // 85
      return;                                                                    // 86
    Ctl.kill(job.program, job._id);                                              // 87
  });                                                                            // 88
  console.log("Server stopped.");                                                // 89
};                                                                               // 90
                                                                                 // 91
Ctl.Commands.push({                                                              // 92
  name: "stop",                                                                  // 93
  help: "Stop this app",                                                         // 94
  func: stopFun                                                                  // 95
});                                                                              // 96
                                                                                 // 97
var waitForDone = function (jobCollection, jobId) {                              // 98
  var fut = new Future();                                                        // 99
  var found = false;                                                             // 100
  try {                                                                          // 101
    var observation = jobCollection.find(jobId).observe({                        // 102
      added: function (doc) {                                                    // 103
        found = true;                                                            // 104
        if (doc.done)                                                            // 105
          fut['return']();                                                       // 106
      },                                                                         // 107
      changed: function (doc) {                                                  // 108
        if (doc.done)                                                            // 109
          fut['return']();                                                       // 110
      },                                                                         // 111
      removed: function (doc) {                                                  // 112
        fut['return']();                                                         // 113
      }                                                                          // 114
    });                                                                          // 115
    // if the document doesn't exist at all, it's certainly done.                // 116
    if (!found)                                                                  // 117
      fut['return']();                                                           // 118
    fut.wait();                                                                  // 119
  } finally {                                                                    // 120
    observation.stop();                                                          // 121
  }                                                                              // 122
};                                                                               // 123
                                                                                 // 124
                                                                                 // 125
Ctl.Commands.push({                                                              // 126
  name: "beginUpdate",                                                           // 127
  help: "Stop this app to begin an update",                                      // 128
  func: function (argv) {                                                        // 129
    Ctl.subscribeToAppJobs(Ctl.myAppName());                                     // 130
    var jobs = Ctl.jobsCollection();                                             // 131
    var thisJob = jobs.findOne(Ctl.myJobId());                                   // 132
    // Look at all the server jobs that are on the old star.                     // 133
    var oldJobSelector = {                                                       // 134
      app: Ctl.myAppName(),                                                      // 135
      star: {$ne: thisJob.star},                                                 // 136
      program: "server",                                                         // 137
      done: false                                                                // 138
    };                                                                           // 139
    var oldServers = jobs.find(oldJobSelector).fetch();                          // 140
    // Start a new job for each of them.                                         // 141
    var newServersAlreadyPresent = jobs.find({                                   // 142
      app: Ctl.myAppName(),                                                      // 143
      star: thisJob.star,                                                        // 144
      program: "server",                                                         // 145
      done: false                                                                // 146
    }).count();                                                                  // 147
    // discount any new servers we've already started.                           // 148
    oldServers.splice(0, newServersAlreadyPresent);                              // 149
    console.log("starting " + oldServers.length + " new servers to match old");  // 150
    _.each(oldServers, function (oldServer) {                                    // 151
      Ctl.startServerlikeProgram("server",                                       // 152
                                 oldServer.tags,                                 // 153
                                 oldServer.env.ADMIN_APP);                       // 154
    });                                                                          // 155
    // Wait for them all to come up and bind to the proxy.                       // 156
    Meteor._sleepForMs(10000); // XXX: Eventually make sure they're proxy-bound. // 157
    Ctl.updateProxyActiveTags(['', thisJob.star]);                               // 158
                                                                                 // 159
    // (eventually) tell the proxy to switch over to using the new star          // 160
    // One by one, kill all the old star's server jobs.                          // 161
    var jobToKill = jobs.findOne(oldJobSelector);                                // 162
    while (jobToKill) {                                                          // 163
      Ctl.kill("server", jobToKill._id);                                         // 164
      // Wait for it to go down                                                  // 165
      waitForDone(jobs, jobToKill._id);                                          // 166
      // Spend some time in between to allow any reconnect storm to die down.    // 167
      Meteor._sleepForMs(5000);                                                  // 168
      jobToKill = jobs.findOne(oldJobSelector);                                  // 169
    }                                                                            // 170
    // Now kill all old non-server jobs.  They're less important.                // 171
    jobs.find({                                                                  // 172
      app: Ctl.myAppName(),                                                      // 173
      star: {$ne: thisJob.star},                                                 // 174
      program: {$ne: "server"},                                                  // 175
      done: false                                                                // 176
    }).forEach(function (job) {                                                  // 177
      Ctl.kill(job.program, job._id);                                            // 178
    });                                                                          // 179
    // fin                                                                       // 180
    process.exit(0);                                                             // 181
  }                                                                              // 182
});                                                                              // 183
                                                                                 // 184
main = function (argv) {                                                         // 185
  return Ctl.main(argv);                                                         // 186
};                                                                               // 187
                                                                                 // 188
///////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.ctl = {
  main: main
};

})();
