var gulp = require('gulp'),
	notify = require("gulp-notify"),
	replace = require('gulp-replace'),
	jshint = require('gulp-jshint'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
	qunit = require('gulp-qunit'),
	package = require('package.json');

var paths = {
	source: ['chibi.js'],
	bower: ['bower.json'],
	readme: ['README.md'],
	test: ['tests/runner.html']
};

var handleError = function(err) {
	notify().write(err);
	process.exit(1);
}

gulp.task('update', function(callback) {
	gulp.src(paths.bower)
		.pipe(replace(/("version": ")([\d\.]*)(",)/g, '$1'+package.version+'$3'))
		.pipe(gulp.dest(''));
	gulp.src(paths.source)
		.pipe(replace(/(\/\*!)(.*)(\*\/)/g, '$1'+package.name+' '+package.version+', Copyright 2012-'+(new Date()).getUTCFullYear()+' '+package.author+', released under '+package.license+' license $3'))
		.pipe(gulp.dest(''))
	gulp.src(paths.readme)
		.pipe(replace(/(\# Chibi v)([\d\.]*)/g, '$1'+package.version))
		.pipe(gulp.dest(''))
		.on('end', callback)
		//# Chibi v1.1.1
});

gulp.task('lint', function() {
	gulp.src(paths.source)
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(jshint.reporter('fail'))
		.on('error', handleError);
});

gulp.task('compress', ['update'], function() {
	gulp.src(paths.source)
		.pipe(rename('chibi-min.js'))
		.pipe(uglify({
			preserveComments: 'some'
		}))
		.pipe(gulp.dest(''));
});

gulp.task('test', function() {
	gulp.src(paths.test)
		.pipe(qunit())
        .on('error', handleError);
});

gulp.task('watch', function() {
	gulp.watch(paths.source, ['lint', 'compress']);
});

gulp.task('default', ['lint', 'compress', 'test']);
