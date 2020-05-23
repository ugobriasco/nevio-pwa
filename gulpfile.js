const gulp = require('gulp');
const pump = require('pump');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const minifyHTML = require('gulp-htmlmin');
const injectCSS = require('gulp-inject-css');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const browserSync = require('browser-sync');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify-es').default;

const filePath = {
  html: 'src/*.html',
  js: 'src/js/*.js'
};

//scripts
const html = () => gulp.src(filePath.html).pipe(gulp.dest('./dist'));

// PROD ENV
const jsHome = () =>
  gulp
    .src([
      'config/config-prod.js',
      'src/js/vendor/*.js',
      'src/js/lib/*.js',
      'src/js/lib/components/*.js',
      'src/js/page-home.js'
    ])
    .pipe(
      babel({
        presets: ['@babel/env']
      })
    )
    .pipe(concat('home.js'))
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/js'));

const jsStory = () =>
  gulp
    .src([
      'config/config-prod.js',
      'src/js/vendor/*.js',
      'src/js/lib/*.js',
      'src/js/lib/components/*.js',
      'src/js/page-story.js'
    ])
    .pipe(
      babel({
        presets: ['@babel/env']
      })
    )
    .pipe(concat('story.js'))
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/js'));

const jsDiscoverStories = () =>
  gulp
    .src([
      'config/config-prod.js',
      'src/js/vendor/*.js',
      'src/js/lib/*.js',
      'src/js/lib/components/*.js',
      'src/js/page-discover-stories.js'
    ])
    .pipe(
      babel({
        presets: ['@babel/env']
      })
    )
    .pipe(concat('discover-stories.js'))
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/js'));

const js = gulp.series(gulp.parallel(jsHome, jsStory, jsDiscoverStories));

//TEST ENV
const jsHomeLocal = () =>
  gulp
    .src([
      'config/config-local.js',
      'src/js/vendor/*.js',
      'src/js/lib/*.js',
      'src/js/lib/components/*.js',
      'src/js/page-home.js'
    ])
    .pipe(
      babel({
        presets: ['@babel/env']
      })
    )
    .pipe(concat('home.js'))
    .pipe(gulp.dest('./dist/js'));

const jsStoryLocal = () =>
  gulp
    .src([
      'config/config-local.js',
      'src/js/vendor/*.js',
      'src/js/lib/*.js',
      'src/js/lib/components/*.js',
      'src/js/page-story.js'
    ])
    .pipe(
      babel({
        presets: ['@babel/env']
      })
    )
    .pipe(concat('story.js'))
    .pipe(gulp.dest('./dist/js'));

const jsDiscoverStoriesLocal = () =>
  gulp
    .src([
      'config/config-local.js',
      'src/js/vendor/*.js',
      'src/js/lib/*.js',
      'src/js/lib/components/*.js',
      'src/js/page-discover-stories.js'
    ])
    .pipe(
      babel({
        presets: ['@babel/env']
      })
    )
    .pipe(concat('discover-stories.js'))
    .pipe(gulp.dest('./dist/js'));

const jsLocal = gulp.series(
  gulp.parallel(jsHomeLocal, jsStoryLocal, jsDiscoverStoriesLocal)
);

// COMMONS

const img = () => gulp.src(['src/img/**/*']).pipe(gulp.dest('./dist/img'));

const sw = () =>
  gulp
    .src(['src/js/sw/*.js'])
    .pipe(
      babel({
        presets: ['@babel/env']
      })
    )
    .pipe(concat('sw.js'))
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist'));

const styles = () =>
  gulp
    .src(['src/scss/style.scss'])
    .pipe(
      sass({
        outputStyle: 'compressed'
      }).on('error', sass.logError)
    )
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['last 2 versions']
      })
    )
    .pipe(gulp.dest('./dist/css'));

const meta = () => gulp.src(['src/manifest.json']).pipe(gulp.dest('./dist'));

const initBrowserSync = () => {
  gulp.watch('./src/*.html', gulp.series(html));
  gulp.watch('./src/scss/*.scss', gulp.series(styles));
  gulp.watch('./src/js/*.js', gulp.series(jsLocal));
  gulp.watch('./src/js/lib/*.js', gulp.series(jsLocal));
  gulp.watch('./src/js/lib/components/*.js', gulp.series(jsLocal));
  gulp.watch('./src/js/sw/*.js', gulp.series(sw));
  gulp.watch('./src/img/*.jpg', gulp.series(img));
  gulp.watch('./dist/**/*').on('change', browserSync.reload);
  browserSync.init({
    server: {
      baseDir: './dist'
    },
    port: 3000
  });
};

//MAIN
const build = gulp.series(gulp.parallel(html, js, sw, styles, img, meta));

const buildLocal = gulp.series(
  gulp.parallel(html, jsLocal, sw, styles, img, meta)
);

const dev = gulp.series(buildLocal, initBrowserSync);

module.exports = {
  dev,
  build
};
