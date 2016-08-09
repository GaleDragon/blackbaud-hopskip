var gulp = require('gulp');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var ngAnnotate = require('gulp-ng-annotate');
var ngConstant = require('gulp-ng-constant');
var templates = require('gulp-angular-templatecache');
var browserSync = require('browser-sync').create();

var html = ['./src/**/*.html', '!./src/bower_components/**/*.html'];
var js = [
    './src/**/*.js',
    '!./src/dist.js',
    '!./src/templates.js',
    '!./src/bower_components/**/*.js'
];
var css = ['./src/**/*.css', '!./src/bower_components/**/*.css'];

gulp.task('build:css', function () {

});

gulp.task('build:js', function () {
    gulp.src(js)
        .pipe(concat('dist.js'))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(ngAnnotate())
        .pipe(gulp.dest('./src'));
});

gulp.task('build:html', function () {
    return gulp.src(html).pipe(templates({
        standalone: true
    })).pipe(gulp.dest('./src'));
});

gulp.task('build', ['build:js', 'build:html', 'build:css', 'build:config']);

gulp.task('build:config', function () {
    "use strict";

    gulp.src('src/config.json')
        .pipe(ngConstant({
            name: 'hopskip.config'
        }))
        .pipe(gulp.dest('src'));
});

gulp.task('default', ['build'], function () {
    "use strict";

    gulp.watch(js, ['build:js']);
    gulp.watch(html, ['build:html']);
});