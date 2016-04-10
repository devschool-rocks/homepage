/*global require*/
(function (r) {
  'use strict';

  var gulp   = require('gulp'),
      uglify = require('gulp-uglify'),
      concat = require('gulp-concat'),
      sass   = require('gulp-sass'),
      minify = require('gulp-htmlmin'),
      sMaps  = require('gulp-sourcemaps'),
      bSync  = require('browser-sync'),
      reload = bSync.reload;

  // JS
  gulp.task('js', function() {
    return gulp.src(['src/js/**/*.js'])
              .pipe(sMaps.init())
              .pipe(concat("app.min.js"))
              .pipe(uglify())
              .pipe(sMaps.write())
              .pipe(gulp.dest('dist/js'))
              .pipe(reload({stream: true}));
  });

  // SCSS
  gulp.task('css', function () {
    return gulp.src(['src/sass/**/*.scss'])
              .pipe(sMaps.init())
              .pipe(concat("app.min.css"))
              .pipe(sass({outputStyle: 'compressed', errLogToConsole: true}))
              .pipe(sMaps.write())
              .pipe(gulp.dest('dist/css'))
              .pipe(reload({stream: true}));
  });


  // HTML
  gulp.task('html', function() {
    return gulp.src(['src/**/*.html'])
              .pipe(minify({collapseWhitespace: true}))
              .pipe(gulp.dest('dist'))
              .pipe(reload({stream: true}));
  });

  // BROWSER SYNC
  gulp.task('sync', function() {
    return bSync({server: { baseDir: 'dist' }});
  });

  // WATCH
  gulp.task('watch', function() {
    gulp.watch('src/js/**/*.js', ['js']);
    gulp.watch('src/sass/**/*.scss', ['css']);
    gulp.watch('src/**/*.html', ['html']);
  });

  gulp.task('default', ['js', 'css', 'html', 'sync', 'watch']);
}(require));
