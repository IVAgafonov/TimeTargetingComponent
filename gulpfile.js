var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

var paths = {
    scripts: './src/**/*.js',
    styles: './src/**/*.{scss,sass}',
    index: './tpl/index.html',
    testJs: './tpl/timeTargetingTest.js',
    docs: './docs',
    dist: './dist'
};

function build() {
    console.log('build start');

    var bowerFiles = require('main-bower-files');
    var embedTemplates = require('gulp-angular-embed-templates');
    var sourceMaps      = require('gulp-sourcemaps');
    var cleanCss        = require('gulp-clean-css');
    var sass            = require('gulp-sass');

    var angularJs = gulp.src(bowerFiles())
        .pipe(gulp.dest(paths.docs + '/bower_components'));

    var testJs = gulp.src(paths.testJs)
        .pipe(gulp.dest(paths.docs + '/js'));

    var timeTargetingJs = gulp.src(paths.scripts)
        .pipe(embedTemplates())
        .pipe(gulp.dest(paths.docs + '/js'));

    var css = gulp.src(paths.styles)
        .pipe(sourceMaps.init())
        .pipe(sass()).on('error', sass.logError)
        .pipe(plugins.concat('styles.css'))
        .pipe(cleanCss({compatibility: 'ie8'}))
        .pipe(sourceMaps.write('./'))

        .pipe(gulp.dest(paths.docs + '/css'));

    console.log('build index');

    var version = Date.now();

    gulp.src(paths.index)
        .pipe(gulp.dest(paths.docs))
        .pipe(plugins.inject(angularJs, {relative: true, name: 'bower'}))
        .pipe(plugins.inject(testJs, {relative: true, name: 'test', addSuffix: '?v=' + version}))
        .pipe(plugins.inject(timeTargetingJs, {relative: true, name: 'component', addSuffix: '?v=' + version}))
        .pipe(plugins.inject(css, {relative: true, addSuffix: '?v=' + version}))
        .pipe(gulp.dest(paths.docs));

    console.log('build end');
}

gulp.task('build', build());