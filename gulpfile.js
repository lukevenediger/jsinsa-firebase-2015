var gulp = require('gulp'),
    gutil = require('gulp-util'),
    browserify = require('browserify'),
    source = require("vinyl-source-stream"),
    buffer = require('vinyl-buffer'),
    watchify = require('watchify'),
    sourcemaps = require('gulp-sourcemaps'),
    jshint = require('gulp-jshint'),
    minimist = require('minimist'),
    tap = require('gulp-tap');

var sourceFileFolder = './js/',
    sourceFile = './js/firechat-1-base.js',
    matchAllSourceFiles = './js/**/*.js',
    destFolder = './site/js',
    destFile = 'FireChat.js',
    packageName = 'FireChat';

var watch,
    debug,
    test,
    map;

gulp.task('debug', function() {
    debug = true;
});

gulp.task('run-tests', function() {
    test = true;
});

gulp.task('watch', function() {
    watch = true;
});

gulp.task('source-map', function() {
    map = true;
});

gulp.task('copy-from-template', function() {
    var templateFile = 'firechat-' + options.step + '.js';
    gutil.log('Using template ' + templateFile);
    sourceFile = sourceFileFolder + templateFile;
});

gulp.task('browserify', function(){
    browserifyCode();
});

gulp.task('lint', function() {
    gulp.src(matchAllSourceFiles) //[exclude(matchAllSpecFiles), matchAllSourceFiles])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

function browserifyCode(){
    var b = browserify({
        standalone : packageName,
        debug : debug
    });

    var singlePass = function () {
        gutil.log('Building at ' + new Date().getTime());
        b.bundle()
            .pipe(source(destFile))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(destFolder));
    };

    if(watch) {
        gutil.log('Watching for changes...');
        b = watchify(b);
        b.on('update', singlePass);
    }
  
    b.add(sourceFile);
    
    singlePass();
}

var knownOptions = {
    step: 'step',
    default: {
        step: '00'
    }
};

var options = minimist(process.argv.slice(2), knownOptions);

// Browserify all files and watch for changes
gulp.task('default', ['lint', 'debug', 'watch', 'browserify']);

// Browserify all files and watch for changes
gulp.task('build', ['lint', 'debug', 'browserify']);

// Copy a step file over
gulp.task('makeStep', ['copy-from-template', 'lint', 'debug', 'watch', 'browserify']);