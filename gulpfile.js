var connect = require('gulp-connect');
var gulpWebpack = require('gulp-webpack');
var bower = require('gulp-bower');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var webpackConfig = require('./webpack.config');

gulp.task('bower', function() {
    return bower('./bower_components')
        .pipe(gulp.dest('./static/lib/'));
});

gulp.task('easy_webpack',function(){
    gulp.src('./app/main.js')
        .pipe(gulpWebpack(webpackConfig))
        .pipe(uglify())
        .pipe(gulp.dest('./assets/scripts/'))
});

gulp.task('easy_sass', function () {
    return gulp.src(path.SASS + '/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./assets/styles/'));
});

gulp.task('easy_build',['bower','easy_webpack','easy_sass'], function () {});

gulp.task('staticserver', function() {
    connect.server({
        port:3333,
    });
});