"use strict";

const fs = require('fs'),
  path = require('path'),
  child_process = require('child_process'),
  resolveBin = require('resolve-bin'),
  gulp = require('gulp'),
  gulpClean = require('gulp-clean'),
  gulpMerge = require('merge2'),
  gulpTs = require('gulp-typescript'),
  gulpSourcemaps = require('gulp-sourcemaps');


module.exports = () => {};

/** If the string passed in is a glob, returns it, otherwise append '**\/*' to it. */
function _globify(maybeGlob, suffix) {
  suffix = suffix || '**/*';
  return maybeGlob.indexOf('*') != -1 ? maybeGlob : path.join(maybeGlob, suffix);
}


/** Create a TS Build Task, based on the options. */
function tsBuildTask(tsConfigPath) {
  var tsConfigDir = tsConfigPath;
  if (fs.existsSync(path.join(tsConfigDir, 'tsconfig.json'))) {
    // Append tsconfig.json
    tsConfigPath = path.join(tsConfigDir, 'tsconfig.json');
  } else {
    tsConfigDir = path.dirname(tsConfigDir);
  }

  return () => {
    const tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, 'utf-8'));
    const dest = path.join(tsConfigDir, tsConfig['compilerOptions']['outDir']);

    const tsProject = gulpTs.createProject(tsConfigPath, {
      typescript: require('typescript')
    });

    var pipe = tsProject.src()
      .pipe(gulpSourcemaps.init())
      .pipe(gulpTs(tsProject));
    var dts = pipe.dts.pipe(gulp.dest(dest));

    return gulpMerge([
      dts,
      pipe
        .pipe(gulpSourcemaps.write('.'))
        .pipe(gulp.dest(dest))
    ]);
  };
}
module.exports.tsBuildTask = tsBuildTask;

/** Copy files from a glob to a destination. */
function copyTask(srcGlobOrDir, outRoot) {
  if (typeof srcGlobOrDir === 'string') {
    return () => gulp.src(_globify(srcGlobOrDir)).pipe(gulp.dest(outRoot));
  } else {
    return () => gulp.src(srcGlobOrDir.map(name => _globify(name))).pipe(gulp.dest(outRoot));
  }
}
module.exports.copyTask = copyTask;

/** Delete files. */
function cleanTask(glob) {
  return () => gulp.src(glob, {read: false}).pipe(gulpClean(null));
}
module.exports.cleanTask = cleanTask;

/** Create a task that executes a binary as if from the command line. */
function execTask(binPath, args, options) {
  options = options || {};
    console.log("Je vais executer une tache: ",binPath);
  return (done) => {
    const conf = {cwd: path, env: process.env};
    const childProcess = child_process.spawn(binPath, args, conf);

    if (!options.silent) {
      childProcess.stdout.on('data', (data) => {
        process.stdout.write(data);
      });

      childProcess.stderr.on('data', (data) => {
        process.stderr.write(data);
      });
    }

    childProcess.on('close', (code) => {
      if (code != 0) {
        if (options.errMessage === undefined) {
          done('Process failed with code ' + code);
        } else {
          done(options.errMessage);
        }
      } else {
        done();
      }
    });
  }
}
module.exports.execTask = execTask;


/**
 * Create a task that executes an NPM Bin, by resolving the binary path then executing it. These are
 * binaries that are normally in the `./node_modules/.bin` directory, but their name might differ
 * from the package. Examples are typescript, ngc and gulp itself.
 */
function execNodeTask(packageName, executable, args, options) {
  if (!args) {
    args = executable;
    executable = undefined;
  }

  return (done) => {
    resolveBin(packageName, {executable: executable}, (err, binPath) => {
      if (err) {
        done(err);
      } else {
        // Forward to execTask.
        console.log("binPath",binPath);
        execTask(process.env.NODE, [binPath].concat(args), options)(done);
      }
    });
  }
}
module.exports.execNodeTask = execNodeTask;
