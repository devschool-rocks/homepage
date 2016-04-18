(function() {
  var site        = require('./site.json');
  site.time       = new Date();

  var gulp    = require('gulp');
  var plugins = require('gulp-load-plugins')();
  var del     = require('del');
  var open    = require('open');
  var path    = require('path');
  var os      = require('os');
  var through = require('through2');
  var fs      = require('fs');
  var bSync   = require('browser-sync');
  var reload  = bSync.reload;

  var settings = {
    url: 'https://devschool.rocks',
    src: path.join('dist', '/**/*'),
    ghPages: {
      cacheDir: path.join(os.tmpdir(), 'devschool-web')
    }
  };

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
  };

  var collectPosts = function() {
    var posts = [];

    return through.obj(function (file, enc, cb) {
      posts.push(file.page);
      var post          = posts[posts.length - 1];
      post.body         = file.contents.toString();
      post.summary      = summarize(file.contents.toString(), '<!--more-->');
      post.permalink    = file.path.split('blog/')[1];
      post.publishedOn  = /(\d{4}\/\d{2}\/\d{2})/.exec(file.path)[0];
      this.push(file);
      cb();
    },
    function (cb) {
      posts.sort(function (a, b) {
        return Date.parse(b.publishedOn) - Date.parse(a.publishedOn);
      });
      site.posts = posts;
      cb();
    });
  };

  var summarize = function(contents, marker) {
    if (contents.indexOf(marker) !== -1) {
      var summary = contents.split(marker)[0];
      if (summary) {
        return summary;
      }
    }
  };

  // JS
  gulp.task('js', function() {
    return gulp.src(['src/js/**/*.js'])
              .pipe(plugins.sourcemaps.init())
              .pipe(plugins.concat('app.min.js'))
              .pipe(plugins.uglify())
              .pipe(plugins.sourcemaps.write())
              .pipe(gulp.dest('dist/js'))
              .pipe(reload({stream: true}));
  });

  // IMAGES
  gulp.task('images', function() {
  gulp.src('src/images/**/*')
      .pipe(plugins.imagemin())
      .pipe(gulp.dest('dist/images'));
  });

  // SCSS
  gulp.task('css', function () {
    return gulp.src(['src/sass/**/*.scss'])
              .pipe(plugins.sourcemaps.init())
              .pipe(plugins.concat('app.min.css'))
              .pipe(plugins.sass({outputStyle: 'compressed', errLogToConsole: true}))
              .pipe(plugins.sourcemaps.write())
              .pipe(gulp.dest('dist/css'))
              .pipe(reload({stream: true}));
  });


  // HTML
  gulp.task('pages', ['blog'], function() {
    var stream = gulp.src(['src/pages/**/*.html'])
                    .pipe(plugins.data({site: site}))
                    .pipe(plugins.nunjucksRender({
                      path: ['src/templates']
                    }))
                    .pipe(plugins.htmlmin({collapseWhitespace: true}))
                    .pipe(gulp.dest('dist'))
                    .pipe(reload({stream: true}));
    return stream;
  });

  // Markdown
  gulp.task('blog', function(cb) {
    var stream = gulp.src(['src/blog/**/*.md'])
                    .pipe(plugins.frontMatter({property: 'page', remove: true}))
                    .pipe(plugins.markdown())
                    .pipe(collectPosts())
                    .pipe(plugins.wrap(function (data) {
                      return fs.readFileSync('src/templates/blog.html').toString();
                    }, null, {engine: 'nunjucks'}))
                    .pipe(gulp.dest('dist'))
                    .pipe(reload({stream: true}));
    return stream;
  });

  // BOWER
  gulp.task('bower', function() {
    return plugins.bower().pipe(gulp.dest('bower_components'));
  });

  // REVIEWS
  gulp.task('reviews', function() {
    return gulp.src(['src/reviews/*.md'])
              .pipe(plugins.frontMatter({property: 'page', remove: true}))
              .pipe(collectReviews())
              .pipe(reload({stream: true}));
  });

  gulp.task('fonts', function() {
    return gulp.src(['bower_components/font-awesome/fonts/**.*', 'src/fonts/**/*'])
              .pipe(gulp.dest('./dist/fonts'));
  });

  gulp.task('static', ['js', 'css', 'pages', 'fonts'], function() {
    return gulp.src('src/static/**/*')
              .pipe(gulp.dest('dist'));
  });

  gulp.task('clean', function(cb) {
    del('dist').then(function(paths) {
      cb();
    });
  });

  gulp.task('production', function(cb) {
    plugins.sequence('clean', ['reviews', 'static', 'bower', 'fonts'], cb);
  });

  gulp.task('deploy', [], function() {
    return gulp.src('dist/**/*')
              .pipe(plugins.ghPages(settings.ghPages))
              .on('end', function(){
                open(settings.url);
              });
  });

  // BROWSER SYNC
  gulp.task('sync', function() {
    return bSync({server: { baseDir: 'dist' }});
  });

  // WATCH
  gulp.task('watch', function() {
    gulp.watch('src/js/**/*.js', ['js']);
    gulp.watch('src/sass/**/*.scss', ['css']);
    gulp.watch(['src/pages/**/*.html'], ['pages']);
    gulp.watch(['src/blog/**/*'], ['blog']);
    gulp.watch(['src/reviews/*'], ['reviews']);
    gulp.watch('src/images/**/*', ['images']);
  });

  gulp.task('default', plugins.sequence(['reviews', 'static', 'bower', 'fonts'], 'sync', 'watch'));
})();
