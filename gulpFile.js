const sass = require('gulp-sass');
const gulp = require('gulp');
const path = require('path');
// const gulpSourceMaps = require('gulp-sourcemaps');
const gulpClean = require('gulp-clean');
const gulpRunSequence = require('run-sequence');
const inlineResources = require('./tools/inline-resources');

const PROJECT_ROOT = process.cwd();
// const SOURCE_ROOT = path.join(PROJECT_ROOT, 'src/app/my-lib');




function copyHtml() {
    gulp.src('src/app/my-lib/**/*.html')
        .pipe(gulp.dest('./dist')).on('end', copyAssets);
}

function copyAssets () {
    gulp.src('./src/assets/**/*')
        .pipe(gulp.dest('./dist/assets')).on('end', copyScss);
}
function copyScss () {
    gulp.src('./src/app/my-lib/**/*.{scss,css}')
        .pipe(gulp.dest('./dist')).on('end', inlineResource);
}



function inlineResource() {
    inlineResources('./dist');
}


function cleanDistNodeModules(){
    gulp.src('dist/node_modules')
        .pipe(gulpClean(null));
}

function cleanDistSrc(){
    gulp.src('dist/src')
        .pipe(gulpClean(null));
}


gulp.task('build:clean-dist-node_modules', cleanDistNodeModules);
gulp.task('build:clean-dist-src', cleanDistSrc);
gulp.task('build:copy-and-inline-resource', copyHtml);


gulp.task('build:release', function (done) {
    // Synchronously run those tasks.
    return gulpRunSequence(
        'build:copy-and-inline-resource',
        'build:clean-dist-node_modules',
        'build:clean-dist-src',
        done
    );
});



gulp.task('default',['build:release']);