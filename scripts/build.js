var fs = require('fs');


var files = [
    'underscore/underscore.js',

    'meteor/client_environment.js',
    'meteor/unyielding_queue.js',

    'ejson/ejson.js',
    'ejson/base64.js',
    'ejson/stringify.js',

    'minimongo/minimongo.js',
    'minimongo/wrap_transform.js',
    'minimongo/id_map.js',
    'minimongo/objectid.js',
    'minimongo/selector.js',

    'mongo-livedata/collection.js',
    'mongo-livedata/local_collection_driver.js',

    'random/random.js',

];

var preamble = 'Package = {};';

var result = files.reduce(function(out, file) {
    out = out.concat('\n//------------ '+file+' ------------\n' + fs.readFileSync('../vendor/meteor/packages/' + file, 'UTF-8'));
    return out;
}, preamble);

fs.writeFileSync('../dist/crater.js', result);
