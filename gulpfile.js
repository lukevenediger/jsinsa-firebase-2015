var gulp = require('gulp'),
    browserify = require('browserify'),
    source = require("vinyl-source-stream"),
    buffer = require('vinyl-buffer'),
    watchify = require('watchify'),
    sourcemaps = require('gulp-sourcemaps'),
    jshint = require('gulp-jshint');

var sourceFile = './js/firechat.js',
    matchAllSourceFiles = './js/**/*.js',
    destFolder = './site/js',
    destFile = 'firechat.js',
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
        b.bundle()
            .pipe(source(destFile))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(destFolder));
    };

    if(watch) {
        b = watchify(b);
        b.on('update', singlePass);
    }
  
    b.add(sourceFile);
    
    singlePass();
}

// Browserify all files and watch for changes
gulp.task('default', ['lint', 'debug', 'watch', 'browserify']);

// Browserify all files and watch for changes
gulp.task('build', ['lint', 'debug', 'browserify']);

