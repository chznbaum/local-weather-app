const gulp = require('gulp'),
notify = require('gulp-notify'),
postcss = require('gulp-postcss'),
autoprefixer = require('autoprefixer'),
cssvars = require('postcss-simple-vars'),
nested = require('postcss-nested'),
cssImport = require('postcss-import'),
mixins = require('postcss-mixins'),
hexrgba = require('postcss-hexrgba');

const onError = function (errorMsg) {
  notify({
    title: 'Gulp Task Error',
    message: 'Check the console.'
  }).write(errorMsg);

  console.log(errorMsg.toString());

  this.emit('end');
}

gulp.task('styles', function() {
  return gulp.src('./app/assets/css/style.css')
    .pipe(postcss([cssImport, mixins, cssvars, nested, hexrgba, autoprefixer]))
    .on('error', onError)
    .pipe(gulp.dest('./app/temp/css'));
});