var gulp       = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var source     = require('vinyl-source-stream');
var buffer     = require('vinyl-buffer');
var browserify = require('browserify');
var watchify   = require('watchify');
var vueify     = require('vueify');
var babel      = require('babelify');
var uglify     = require('gulp-uglify');

function compile(watch) {
    var props = {
        entries: [
            './src/js/app.js'
        ],
        cache: {},
        packageCache: {},
        debug: true,
        fullPaths: false
    };
    if (watch) {
        props.plugin = [
            watchify
        ];
    }

    var bundler = browserify(props)
        .transform(babel)
        .transform(vueify);

    function rebundle() {
        var stream = bundler.bundle();
        return stream.on('error', function(err) {
                console.error(err);
                this.emit('end');
            })
            .pipe(source('app.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({
                loadMaps: true
            }))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./build/js'))
    }

    bundler.on('update', function() {
        console.log('-> bundling...');
        rebundle();
    });

    copyAssets('./src', './build');
    if (watch) {
        gulp.watch('./src/**/*.!(js|vue)', function() {
            return copyAssets('./src', './build');
        });
    }

    return rebundle();
}

function copyAssets(src, dest) {
    return gulp.src(src + '/**/*.!(js|vue|map)')
        .pipe(gulp.dest(dest));
}

gulp.task('build', function() {
    return compile(false);
});

gulp.task('watch', function() {
    return compile(true);
});

gulp.task('compress', function() {
    return gulp.src('./build/js/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('release', ['set-prod', 'build', 'compress'], function() {
    return copyAssets('./build', './dist');
});

gulp.task('set-prod', function() {
    return process.env.NODE_ENV = 'production';
});

gulp.task('default', ['watch']);
