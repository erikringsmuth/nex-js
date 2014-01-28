'use strict';
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('lint', function() {
  gulp.src(['nex.js', 'tests/spec/*.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('minify', function() {
  gulp.src('nex.js')
    .pipe(uglify())
    .pipe(rename('nex.min.js'))
    .pipe(gulp.dest('.'));
});

// The default task (called when you run `gulp`)
gulp.task('default', function(){
  gulp.run('lint', 'minify');

  // Watch files and run tasks if they change
  gulp.watch('nex.js', function() {
    gulp.run('lint', 'minify');
  });

  gulp.watch('tests/spec/*.js', function() {
    gulp.run('lint');
  });
});

// Travis CI
gulp.task('ci', function(){
  gulp.run('lint');
});