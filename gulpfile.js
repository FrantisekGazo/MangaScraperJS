'use strict';

const path = require('path');
const browserify = require('browserify');
const gulp = require('gulp');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const gutil = require('gulp-util');
const reactify = require('reactify');
const envify = require('envify/custom');
const del = require('del');

const minifier = require('gulp-uglify/minifier');
const uglifyJS = require('uglify-js');

const packager = require('electron-packager');


gulp.task('clean', function (cb) {
    del(['dist', 'release'], cb);
});

gulp.task('bundle-index', function () {
    const b = browserify({
        entries: './src/index.js',
        debug: false,
        node: true,
        bundleExternal: false,
        transform: [reactify, envify({
            NODE_ENV: 'production'
        })]
    });

    const options = {
        preserveComments: 'license',
        // FIXME: if mangle is set to true, then I get "SyntaxError: Identifier 'n' has already been declared" ?!
        // it's not needed, but it would be nice if it worked :)
        mangle: false
    };

    return b.bundle()
        .pipe(source('index.js'))
        .pipe(buffer())
        // FIXME turn off .pipe(minifier(options, uglifyJS))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('bundle-worker', function () {
    const b = browserify({
        entries: './src/worker.js',
        debug: false,
        node: true,
        bundleExternal: false,
        transform: [reactify, envify({
            NODE_ENV: 'production'
        })]
    });

    return b.bundle()
        .pipe(source('worker.js'))
        .pipe(buffer())
        .pipe(gulp.dest('./dist/'));
});

gulp.task('html', function () {
    return gulp.src(['./src/index.html', './src/splash.html', './src/worker.html'])
        .pipe(gulp.dest('dist'));
});

gulp.task('assets', function () {
    return gulp.src('./src/assets/**/*', {"base": "./src"})
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['html', 'assets', 'bundle-index', 'bundle-worker']);


// PACKAGING

function getPackOptions(opts) {
    return Object.assign({
        dir: '.',
        asar: false,
        version: '1.4.5',
        //platform: '',
        //arch: '',
        out: 'release',
        overwrite: true,
        prune: true,
        ignore: [
            '^/.idea',
            '^/release',
            '^/src',
            '^/test',
            '^/.gitignore',
            '^/gulpfile.js',
            '^/readme-res',
            '^/README.md'
        ]
    }, opts);
}

gulp.task('pack-mac', function () {
    const options = getPackOptions({
        platform: 'darwin',
        arch: 'x64',
    });

    return packager(options, (err, appPaths) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Done', appPaths);
        }
    });
});

gulp.task('pack-win', function () {
    const options = getPackOptions({
        platform: 'win32',
        arch: 'x64',
    });

    return packager(options, (err, appPaths) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Done', appPaths);
        }
    });
});

gulp.task('pack-lin', function () {
    const options = getPackOptions({
        platform: 'linux',
        arch: 'x64',
    });

    return packager(options, (err, appPaths) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Done', appPaths);
        }
    });
});
