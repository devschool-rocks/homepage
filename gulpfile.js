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

var collectReviews = function() {
  var reviews = [];

  return through.obj(function (file, enc, cb) {
    reviews.push(file.page);
    var review    = reviews[reviews.length - 1];
    review.body   = file.contents.toString();
    cb();
  },
  function (cb) {
    site.reviews = reviews;
    cb();
  });
}

var collectPosts = function() {
  var posts = [];

  return through.obj(function (file, enc, cb) {
    posts.push(file.page);
    var post          = posts[posts.length - 1];
    post.body         = file.contents.toString();
    post.summary      = summarize(file.contents.toString(), '<!--more-->');
    post.permalink    = file.path.split("blog/")[1];
    post.publishedOn  = /(\d{4}\/\d{2}\/\d{2})/.exec(file.path)[0];
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

var summarize = function(contents, marker) {
  if (contents.indexOf(marker) !== -1) {
    var summary = contents.split(marker)[0];
    if (summary) {
      return summary;
    }
  }
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
             .pipe(data({site: site}))
             .pipe(render({
               path: ['src/templates']
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
               return fs.readFileSync('src/templates/blog.html').toString()
             }, null, {engine: 'nunjucks'}))
             .pipe(gulp.dest('dist'))
             .pipe(reload({stream: true}));
});

// REVIEWS
gulp.task('reviews', function() {
  return gulp.src(['src/reviews/*.md'])
             .pipe(page({property: "page", remove: true}))
             .pipe(collectReviews())
             .pipe(reload({stream: true}));
});

// BOWER
gulp.task('bower', function() { 
  return bower().pipe(gulp.dest('bower_components')) 
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
  gulp.watch(['src/**/*.html'], ['html', 'blog']);
  gulp.watch(['src/blog/**/*'], ['blog', 'html']);
  gulp.watch(['src/reviews/*'], ['reviews']);
  gulp.watch('src/images/**/*', ['images']);
});

gulp.task('default', ['reviews', 'blog', 'js', 'css', 'images', 'html', 'bower', 'fonts', 'sync', 'watch']);
