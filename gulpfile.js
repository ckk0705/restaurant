var gulp = require('gulp');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var less = require('gulp-less');
var LessAutoprefix = require('less-plugin-autoprefix');
var autoprefix = new LessAutoprefix({ browsers: ['last 2 versions'] });
var babel = require('babelify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserSync = require('browser-sync').create();

gulp.task('default', function() {
  // place code for your default task here
});

///////////////////////////// STYLES //////////////////////////////////

gulp.task('styles', function(){

  gulp.src('./less/**/*.less')
    .pipe(less({
       plugins: [autoprefix]
     }))
    .pipe(cleanCSS({ processImport: false }))
    .pipe(gulp.dest('./dist/css/'));

});

/////////////////////////////// JS //////////////////////////////////
var bundler = function(file){
  return browserify(file, { debug: true })
                .transform(babel.configure({
                  presets: ["es2015"]
                }));
}

gulp.task('bundlejs:prod', function() {

  /*
    Transpiles the code using babel and es2015 preset and then bundles 
    the application in a file.
  */
  bundler('./js/main.js').bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source('main.js'))
      .pipe(buffer())
      .pipe(uglify())
      .pipe(gulp.dest('./dist/js'));

});

gulp.task('bundlejs:dev', function() {

  bundler('./js/main.js').bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source('main.js'))
      .pipe(buffer())
      .pipe(gulp.dest('./dist/js'));

});

/////////////////////////////// LIVE REOLAD ///////////////////////////

gulp.task('server', function() {

  browserSync.init({
    server: {
      baseDir: './',
    },
    port: 3030
  });
  
});

/*
  Reloads the server
  */
gulp.task('reload', function() {
    browserSync.reload();
});

/* 
  Runs browserSync server and watches for changes 
  in css, js or html to reload the browser.
  */

// Development
gulp.task('serve', ['server', 'styles', 'bundlejs:dev'], function() {

  gulp.watch('less/**/*.less', ['styles']);
  gulp.watch('js/**/*.js', ['bundlejs:dev']);

  gulp.watch([
    'dist/css/*.css',
    'dist/js/*.js',
    'index.html'
    ], ['reload']);

});

// Production
// don't need to watch here, we are not supossed to change code on production
gulp.task('serve:dist', ['server', 'styles', 'bundlejs:prod']);