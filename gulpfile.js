var gulp = require('gulp'),
  // concat = require('gulp-concat'),
  sourcemaps = require('gulp-sourcemaps'),
  plumber = require('gulp-plumber'),
  jade = require('gulp-jade'),
  babel = require('gulp-babel'),
  livereload = require('gulp-livereload');

gulp.task('templates', function() {
  var jadeConfig = {
    pretty: true
  };
  return gulp.src('./src/*.jade')
    .pipe(plumber())
    .pipe(jade(jadeConfig))
    .pipe(gulp.dest('./dist'))
    .pipe(livereload())
});

gulp.task('scripts', function() {
  var babelConfig = {
    presets: ['es2015']
  };
  return gulp.src('./src/**/*.js')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(babel(babelConfig))
    // .pipe(concat('all.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist'));
});


gulp.task('watch', function() {
  livereload.listen({
    basePath: './dist'
  });
  gulp.watch('./src/**/*', ['templates', 'scripts']);
})
