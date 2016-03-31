var gulp = require('gulp');
var sitemap = require('gulp-sitemap');
 
gulp.task('sitemap', function () {
  gulp.src('public/**/*.html')
    .pipe(sitemap({
      siteUrl: 'https://devschool.rocks'
     }))
    .pipe(gulp.dest('./public'));
});
