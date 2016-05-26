var gulp   = require('gulp');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var inject = require('gulp-inject-string');
var clean = require('gulp-clean');
var replace = require('gulp-replace');
 
gulp.task('clean', function () {
	return gulp.src('dist/', {read: false})
		.pipe(clean());
})

gulp.task('build-js-to-dist', ['clean'], function() {
  return gulp.src(['client/**/*.js', '!client/config/*.js'], {base: 'client'})
    .pipe(babel({
			presets: ['es2015']
		}))
    .pipe(uglify().on('error', function(e){
            console.log(e);
         }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('copy-rest-to-dist',  ['clean'],function() {
  return gulp.src(['client/**', '!client/**/*.js'], {base: 'client'})
    .pipe(gulp.dest('dist/'));
});

gulp.task('build-config-files', ['clean', 'copy-rest-to-dist'], function() {
  return gulp.src('client/config/*.js')
    .pipe(concat('config.js'))
    .pipe(babel({
			presets: ['es2015']
		}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/'));
});

gulp.task('build-framework', function() {
  return gulp.src([
        'client/framework/Utils.js', 
        'client/framework/Router.js', 
        'client/framework/ResourceLoader.js', 
        'client/framework/DataStore.js', 
        'client/framework/App.js'
      ])
    .pipe(concat('bakery.js'))
    .pipe(babel({
			presets: ['es2015']
		}))
    .pipe(uglify())
    .pipe(gulp.dest('client/framework/'));
});

gulp.task('remove-old-config-srcs', ['build-config-files'], function(){
  return gulp.src('dist/index.html')
    .pipe(replace(/<script src="\/client\/config.{0,50}" defer><\/script>/g, ''))
    .pipe(gulp.dest('dist'))
})

gulp.task('insert-new-config-src', ['remove-old-config-srcs'], function(){
  return gulp.src('dist/index.html')
    .pipe(inject.before('<script', '<script src="config.js"></script>\n\t'))
    .pipe(gulp.dest('dist'))
})

gulp.task('set-production-root', ['insert-new-config-src'], function(){
  return gulp.src('dist/index.html')
    .pipe(replace('="/client/', '="/dist/'))
    .pipe(replace("='/client/", "='/dist/"))
    .pipe(gulp.dest('dist'))
})

gulp.task('build-config', ['insert-new-config-src']);

gulp.task('default', ['build-js-to-dist', 'copy-rest-to-dist', 'build-config', 'set-production-root']);