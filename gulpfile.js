'use strict';

var gulp   = require('gulp'),
    uglify = require('gulp-uglify'),
    sass   = require('gulp-sass'),
    bSync  = require('browser-sync'),
    reload = bSync.reload;

// JS
gulp.task('js', function() {
  return gulp.src(['src/js/**/*.js'])
             .pipe(uglify())
             .pipe(reload({stream: true}))
             .pipe(gulp.dest('dist/js'));
});

// SASS
gulp.task('css', function () {
  return gulp.src('src/css/**/*.scss')
             .pipe(sass.on('error', sass.logError))
             .pipe(gulp.dest('dist/css'));
});


// HTML
gulp.task('html', function() {
  return gulp.src(['src/html/**/*.html']);
});

// BROWSER SYNC
gulp.task('sync', function() {
  return bSync({server: { baseDir: './src/' }});
});

// WATCH
gulp.task('watch', function() {
  gulp.watch('src/js/**/*.js', ['js']);
  gulp.watch('src/html/**/*.html', ['html']);
});

gulp.task('default', ['js', 'html', 'sync', 'watch']);

