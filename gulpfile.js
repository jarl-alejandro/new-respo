'use strict'

var gulp = require('gulp')
var browserify = require('browserify')
var babelify = require('babelify')
// var uglify = require('gulp-uglify')
var source = require('vinyl-source-stream')
// var minify = require('gulp-minify-css')
var hbsfy = require('browserify-handlebars')

gulp.task('build', function(){
  return browserify({
    entries:'./static/app/scripts/index',
    transform: [hbsfy]
  })
  .transform([babelify, hbsfy])
  .bundle()
  .pipe(source('bundle.js'))
  .pipe(gulp.dest('./static/dist/js'))
})

gulp.task('watch', function(){
  gulp.watch('./static/app/scripts/*.js', ['build'])
  gulp.watch('./static/app/stylus/**/*.styl', './static/scripts/components/**/*.styl', ['stylus'])
})

gulp.task('default', ['watch'])
