var gulp = require('gulp');
var webserver = require('gulp-webserver');
var livereload = require('gulp-livereload');
// var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');
var jade = require('gulp-jade');
var babel = require('gulp-babel');


gulp.task('templates', function() {
  var jadeConfig = {
    pretty: true
  };
  return gulp.src('./src/*.jade')
    .pipe(plumber())
    .pipe(jade(jadeConfig))
    .pipe(gulp.dest('./dist'))
    .pipe(livereload());
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

gulp.task('webserver', function() {
  gulp.src('./dist')
    .pipe(webserver({
      livereload: true,
      open: true
    }));
});

gulp.task('watcher', ['webserver'], function() {
  gulp.watch('./src/**/*.jade', ['templates']);
  gulp.watch('./src/**/*.js', ['scripts']);
  livereload.listen();
  gulp.watch('./dist', function(file) {
    livereload.changed(file.path);
  })
})

gulp.task('default', ['templates', 'scripts', 'watcher']);
