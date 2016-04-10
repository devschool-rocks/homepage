'use strict';
var site        = require('./site.json');
site.time       = new Date();

var gulp   = require('gulp'),
    uglify = require('gulp-uglify'),
   through = require('through2'),
    data   = require('gulp-data'),
    concat = require('gulp-concat'),
    sass   = require('gulp-sass'),
    minify = require('gulp-htmlmin'),
    sMaps  = require('gulp-sourcemaps'),
    render = require('gulp-nunjucks-render'),
    mDown  = require('gulp-markdown'),
    wrap   = require('gulp-wrap'),
    page   = require('gulp-front-matter'),
    changed = require('gulp-changed'),
    imgMin = require('gulp-imagemin'),
    bower  = require('gulp-bower'),
    fs     = require('fs'),
    bSync  = require('browser-sync'),
    reload = bSync.reload;

var collectPosts = function() {
  var posts = [];

  return through.obj(function (file, enc, cb) {
    posts.push(file.page);
    posts[posts.length - 1].body = file.contents.toString();
    this.push(file);
    cb();
  },
  function (cb) {
    posts.sort(function (a, b) {
      return b.date - a.date;
    });
    site.posts = posts;
    cb();
  });
}

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

// IMAGES
gulp.task('images', function() {
  gulp.src("src/images/**/*")
      .pipe(imgMin())
      .pipe(gulp.dest('dist/images'))
});

// SCSS
gulp.task('css', function () {
  return gulp.src(['src/sass/**/*.scss', 'src/sass/**/*.css'])
	    .pipe(sMaps.init())
	    .pipe(concat("app.min.css"))
	    .pipe(sass({outputStyle: 'compressed', errLogToConsole: true}))
	    .pipe(sMaps.write())
	    .pipe(gulp.dest('dist/css'))
	    .pipe(reload({stream: true}));
});


// HTML
gulp.task('html', function() {
  return gulp.src(['src/**/*.html', 'src/**/*.nunjucks'])
            .pipe(data({site: site}))
	    .pipe(render({
	      path: ['src/html']
	    }))
	    .pipe(minify({collapseWhitespace: true}))
	    .pipe(gulp.dest('dist'))
	    .pipe(reload({stream: true}));
});

// Markdown
gulp.task('blog', function() {
  return gulp.src(['src/blog/**/*.md'])
	      .pipe(page({property: "page", remove: true}))
	      .pipe(mDown())
	      .pipe(collectPosts())
	      .pipe(wrap(function (data) {
		return fs.readFileSync('src/blog/layout.nunjucks').toString()
	      }, null, {engine: 'nunjucks'}))
	      .pipe(gulp.dest('dist'))
	      .pipe(reload({stream: true}));
});

// BOWER
gulp.task('bower', function() { 
    return bower()
	      .pipe(gulp.dest('bower_components')) 
});

gulp.task('fonts', function() { 
    return gulp.src(['bower_components/font-awesome/fonts/**.*', 'src/fonts/**/*']) 
		.pipe(gulp.dest('./dist/fonts')); 
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
  gulp.watch('src/blog/**/*.md', ['blog']);
  gulp.watch('src/images/**/*', ['images']);
});

gulp.task('default', ['js', 'css', 'images', 'html', 'blog', 'bower', 'fonts', 'sync', 'watch']);
