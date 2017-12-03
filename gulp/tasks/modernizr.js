const gulp = require('gulp'),
modernizr = require('gulp-modernizr');

gulp.task('modernizr', function() {
  return gulp.src(['./app/assets/css/**/*.css', './app/assets/js/**/*.js'])
    .pipe(modernizr({
      'options': [
        'setClasses'
      ]
    }))
      .pipe(gulp.dest('./app/temp/js/'));
});