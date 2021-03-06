var fs = require('fs');
var exec = require('child_process').exec;
var compressor = require('yuicompressor');

var buildDir = normalize('build');
var meteorCmd = normalize('vendor/meteor/meteor');
var outJS = normalize('meteor-blaze-client.js');
var outMinified = normalize('meteor-blaze-client.min.js');




remakeDir(buildDir);

createMeteorProject()
    .then(bundleProject)
    .then(unpackBundle)
    .then(createJS)
    .then(cleanupJSFile)
    .then(removeBuildDir)
    .then(writeMinified)


function writeMinified() {
    console.log('minifying js');
    compressor.compress(outJS, {
        //Compressor Options:
        charset: 'utf8',
        type: 'js',
//        nomunge: true,
        'line-break': 80
    }, function(err, data, extra) {
        fs.writeFileSync(outMinified, data);
        //err   If compressor encounters an error, it's stderr will be here
        //data  The compressed string, you write it out where you want it
        //extra The stderr (warnings are printed here in case you want to echo them
    });
}

function cleanupJSFile() {
    console.log('cleaning js file');
    return execute('cat ' + outJS + '|grep -v DDP|grep -v Autoupdate > '+outJS + '.clean; rm ' + outJS + ';mv '+outJS + '.clean '+outJS);
}


function removeBuildDir() {
    rmDirRecursive(buildDir);
}

function unpackBundle() {
    console.log('unpacking bundle');
    return execute('tar xzf temp.tar.gz', {cwd: buildDir + '/meteorProject'});
}



function createMeteorProject() {
    console.log('creating meteor project');
    return execute(meteorCmd + ' create meteorProject', {cwd: buildDir});
}

function bundleProject() {
    console.log('bundling meteor project');
    return execute(meteorCmd + ' bundle temp.tar.gz --debug', {cwd: buildDir + '/meteorProject'});
}

function createJS() {
    console.log('creating JS file');
    var packageFiles = [
            "underscore.js",
            "meteor.js",
            "json.js",
            "ejson.js",
            "logging.js",
            "reload.js",
            "deps.js",
            "random.js",
            "retry.js",
            "check.js",
            "ordered-dict.js",
            "geojson-utils.js",
            "minimongo.js",
//            "application-configuration.js",
            "standard-app-packages.js",
            "webapp.js",
            "reactive-dict.js",
            "session.js",
            "jquery.js",
            "observe-sequence.js",
            "htmljs.js",
            "ui.js",
            "spacebars.js",
            "templating.js",
            "global-imports.js"
        ];
    
    var compilerFiles = [
            "html-tools/parse.js",
            "html-tools/scanner.js",
            "html-tools/charref.js",

            "html-tools/tokenize.js",
            "html-tools/parse.js",
            "html-tools/exports.js",

            "templating/plugin/html_scanner.js",


            "spacebars-compiler/templatetag.js",
            "spacebars-compiler/tojs.js",
            "spacebars-compiler/tokens.js",
            "spacebars-compiler/spacebars-compiler.js"
    ];

    var sourceFiles = [
        'mbc.js'
    ];

    var out = '';

    out = packageFiles.reduce(function(out, filename) {
        var packageDir = buildDir + '/meteorProject/bundle/programs/client/packages';
        out = out + '\n\n//--------- ' + filename + '-----------\n';
        out = out + fs.readFileSync(packageDir + '/' + filename, {encoding:'UTF-8'});
        return out;
    }, out);

    out = compilerFiles.reduce(function(out, filename) {
        var packageDir = normalize('vendor/meteor/packages');
        out = out + '\n\n//-------------' + filename + '----------\n';
        out = out + fs.readFileSync(packageDir + '/' + filename, {encoding:'UTF-8'});
        return out;
    }, out);

    out = sourceFiles.reduce(function(out, filename) {
        var packageDir = normalize('src');
        out = out + '\n\n//---------------' + filename + '------------\n';
        out = out + fs.readFileSync(packageDir + '/' + filename, {encoding: 'UTF-8'});
        return out;
    }, out);

    fs.writeFileSync(outJS, out);


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

}

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


function error(message) {
    console.log('ERROR: '+message);
}




