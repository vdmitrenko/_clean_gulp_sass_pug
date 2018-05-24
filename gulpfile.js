'use strict'

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    cssmin = require('gulp-minify-css'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    rimraf = require('rimraf'),
    pug = require('gulp-pug'),
    plumber = require('gulp-plumber'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;

var path = {
  build: {
      html: 'build/',
      js: 'build/js/',
      css: 'build/css/',
      img: 'build/img/',
      fonts: 'build/fonts/'
  },
  src: {
      html: 'src/*.pug',
      js: 'src/js/main.js',
      sass: 'src/sass/main.sass',
      img: 'src/img/**/*.*',
      fonts: 'src/fonts/**/*.*'
  },
  watch: {
      html: 'src/**/*.pug',
      js: 'src/js/**/*.js',
      sass: 'src/sass/**/*.*',
      img: 'src/img/**/*.*',
      fonts: 'src/fonts/**/*.*'
  },
  clean: './build'
};

var config = {
  server: {
      baseDir: "./build"
  },
  tunnel: true,
  host: 'localhost',
  port: 3000,
  logPrefix: "Frontend"
};

gulp.task('html:build', function () {
  gulp.src(path.src.html)
      .pipe(pug({pretty: true}))
      .pipe(gulp.dest(path.build.html))
      .pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
  gulp.src(path.src.js)
      .pipe(rigger())
      .pipe(sourcemaps.init())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(path.build.js))
      .pipe(reload({stream: true}));
});

gulp.task('style:build', function () {
  gulp.src(path.src.sass)
      .pipe(sourcemaps.init())
      .pipe(plumber())
      .pipe(sass())
      .pipe(prefixer())
      .pipe(cssmin())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(path.build.css))
      .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
  gulp.src(path.src.img)
      .pipe(gulp.dest(path.build.img))
      .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
  gulp.src(path.src.fonts)
      .pipe(gulp.dest(path.build.fonts))
});

gulp.task('watch', function(){
  watch([path.watch.html], function(event, cb) {
      gulp.start('html:build');
  });
  watch([path.watch.sass], function(event, cb) {
      gulp.start('style:build');
  });
  watch([path.watch.js], function(event, cb) {
      gulp.start('js:build');
  });
  watch([path.watch.img], function(event, cb) {
      gulp.start('image:build');
  });
  watch([path.watch.fonts], function(event, cb) {
      gulp.start('fonts:build');
  });
});

gulp.task('webserver', function () {
  browserSync(config);
});

gulp.task('clean', function (cb) {
  rimraf(path.clean, cb);
});

gulp.task('build', ['html:build', 'js:build', 'style:build', 'fonts:build', 'image:build']);

gulp.task('default', ['build', 'webserver', 'watch']);