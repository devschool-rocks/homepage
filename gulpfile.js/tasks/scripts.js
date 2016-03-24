var config       = require('../config')
if(!config.tasks.js) return

var gulp         = require('gulp')
var browserSync  = require('browser-sync')
var handleErrors = require('../lib/handleErrors')
var path         = require('path')
var concat       = require('gulp-concat')

var paths = {
  src: path.join(config.root.src, config.tasks.js.src, '/*.js'),
  dest: path.join(config.root.dest, config.tasks.js.dest)
}

var scripts = function () {
  var allScripts = config.tasks.js.scripts.map(function(entry) {
    return path.join(config.root.src, config.tasks.js.src, entry + '.js');
  });

  return gulp.src(allScripts)
    .on('error', handleErrors)
    .pipe(concat('all.js'))
    .pipe(gulp.dest(paths.dest))
    .pipe(browserSync.stream());
}

gulp.task('js', scripts)
module.exports = scripts
