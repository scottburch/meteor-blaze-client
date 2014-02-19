var fs = require('fs');
var exec = require('child_process').exec;

var distDir = normalize('dist');
var buildDir = normalize('dist/build');
var meteorCmd = normalize('vendor/meteor/meteor');



remakeDir(distDir);
remakeDir(buildDir);

createMeteorProject()
    .then(bundleProject)
    .then(unpackBundle)
    .then(copyMeteorFiles)

function unpackBundle() {
    console.log('unpacking bundle');
    return execute('tar xzf temp.tar.gz', {cwd: normalize('dist/build/meteorProject')});
}



function createMeteorProject() {
    console.log('creating meteor project');
    return execute(meteorCmd + ' create meteorProject', {cwd: normalize('dist/build')});
}

function bundleProject() {
    console.log('bundling meteor project');
    return execute(meteorCmd + ' bundle temp.tar.gz --debug', {cwd: normalize('dist/build/meteorProject')});
}

function copyMeteorFiles(error, stdout, stderr) {
    if(error !== null) {
        error(error);
    }
}

function execute(command, options, cb) {
    var defer = require('q').defer();

    exec(command, options, function(err, stdout, stderr) {
        err === null ? defer.resolve() : defer.reject(err);
    });
    return defer.promise;
}


function normalize(filename) {
    var path = require('path');
    return path.resolve(path.normalize('../'+filename));
}

function remakeDir(dir) {
    rmDirRecursive(dir);
    fs.mkdirSync(dir);
    function rmDirRecursive(path) {
        var files = [];
        if( fs.existsSync(path) ) {
            files = fs.readdirSync(path);
            files.forEach(function(file,index){
                var curPath = path + "/" + file;
                if(fs.statSync(curPath).isDirectory()) { // recurse
                    rmDirRecursive(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    };

}


function error(message) {
    console.log('ERROR: '+message);
}

return;


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
