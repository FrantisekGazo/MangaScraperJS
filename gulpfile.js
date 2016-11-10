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

gulp.task('bundle', function () {
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
        .pipe(minifier(options, uglifyJS))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('html', function () {
    return gulp.src('./src/index.html')
        .pipe(gulp.dest('dist'));
});

gulp.task('assets', function () {
    return gulp.src('./src/assets/**/*', {"base": "./src"})
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['html', 'assets', 'bundle']);

gulp.task('hello', function () {
    console.log(path.dirname(__dirname + '/src'));
});

// PACKAGING

function defaultPackOptions() {
    return {
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
    };
}

gulp.task('pack-mac', function () {
    const options = Object.assign(defaultPackOptions(), {
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