var config       = require('../config')
if(!config.tasks.css) return

var gulp         = require('gulp')
var browserSync  = require('browser-sync')
var handleErrors = require('../lib/handleErrors')
var path         = require('path')
var concat       = require('gulp-concat')

var paths = {
  src: path.join(config.root.src, config.tasks.css.src, '/*.css'),
  dest: path.join(config.root.dest, config.tasks.css.dest)
}

var cssTask = function () {
  return gulp.src(paths.src)
    .on('error', handleErrors)
    .pipe(concat('all.css'))
    .pipe(gulp.dest(paths.dest))
    .pipe(browserSync.stream());
}

gulp.task('css', cssTask)
module.exports = cssTask
