var gulp = require('gulp');
var browserSync = require('browser-sync');
var clean = require('gulp-clean');

/// 定义路径

var paths = {
    js: "scripts/**/*.js",
    html: "views/**/*.html",
    other: "styles/**/*"
}

var watchableFiles = [paths.js, paths.html]

////////

gulp.task('clean', function () {
    gulp.src('temp/**/*')
        .pipe(clean());
})

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: "."
        }
    });
});

gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task('default', ['browser-sync'], function () {
    gulp.watch(watchableFiles, ['bs-reload']);
});