var gulp = require('gulp'),
    server = require('gulp-connect'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    connect = require('gulp-connect'),
    del = require('del'),
    runSeq = require('run-sequence'),
    srcDir = './src',
    destDir = './dist';
gulp.task('clean', function () {
    return del(destDir);
});
gulp.task('html', function () {
    return gulp.src(srcDir + '/**/*.html')
        .pipe(gulp.dest(destDir))
        .pipe(connect.reload());
});
gulp.task('html:watch', function () {
    gulp.watch(srcDir + '/**/*.html', ['html']);
});
gulp.task('lint', function () {
    return gulp.src(srcDir + '/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});
gulp.task('js', function () {
    return gulp.src(srcDir + '/**/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest(destDir + '/js'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(destDir + '/js'))
        .pipe(connect.reload());
});
gulp.task('js:watch', function () {
    return gulp.watch(srcDir + '/**/*.js', ['lint', 'js']);
});
gulp.task('sass', function () {
    return gulp.src(srcDir + '/styles/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(destDir + '/css'))
        .pipe(connect.reload());
});
gulp.task('sass:watch', function () {
    gulp.watch('./sass/**/*.scss', ['sass']);
});
gulp.task('watch', ['html:watch', 'js:watch', 'sass:watch']);
gulp.task('serve', ['watch'], function () {
    connect.server({
        root: 'dist',
        host: 'localhost',
        port: 10084,
        livereload: {
            port: 35730
        }
    })
});
gulp.task('build', ['lint', 'js', 'html']);
gulp.task('default', function () {
    return runSeq('clean', 'build', 'serve');
});
