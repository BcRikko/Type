var gulp = require('gulp');

var ts = require('gulp-typescript');
var tsConfig = require('./src/tsconfig.json');

var webpack = require('gulp-webpack');
var webpackConfig = require('./webpack.config.js');

gulp.task('ts', function () {
    var tsResult = gulp.src(['./src/**/*.ts', '!./src/typings'])
        .pipe(ts(tsConfig.compilerOptions))
        .pipe(webpack(webpackConfig));
    
    return tsResult.pipe(gulp.dest('./dist'));
});

gulp.task('watch', function () {
    gulp.watch('./src/**/*.ts', ['ts']);
});

gulp.task('default', ['ts', 'watch']);