const gulp = require('gulp')
const sass = require('gulp-sass');
const uglifycss = require('gulp-uglifycss');
const babel = require('gulp-babel')
 
sass.compiler = require('node-sass');
 
gulp.task('sass', function () {
  return gulp.src('./scss/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});
 
gulp.task('css', function () {
  return gulp.src('css/*.css')
    .pipe(uglifycss({
      "uglyComments": true
    }))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('es6', () => {
  return gulp.src("js/*.js")
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(gulp.dest('dist'));
})

gulp.task('run', gulp.parallel("sass", "css", "es6"));

gulp.task('watch', function() {
    gulp.watch('./scss/**/*.scss', gulp.parallel('sass'));
    gulp.watch('./css/*.css', gulp.parallel('css'));
    gulp.watch("./js/*.js", gulp.parallel('es6'));
});


gulp.task('default', gulp.parallel("run", "watch"));