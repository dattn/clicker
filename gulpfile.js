var gulp       = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var source     = require('vinyl-source-stream');
var buffer     = require('vinyl-buffer');
var browserify = require('browserify');
var watchify   = require('watchify');
var vueify     = require('vueify');
var babelify   = require('babelify');
var uglify     = require('gulp-uglify');
var nodemon    = require('gulp-nodemon');
var babel      = require('gulp-babel');

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
        .transform(babelify)
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

    gulp.start('copy-assets-src-build');
    if (watch) {
        gulp.watch('./src/**/*.!(js|vue)', function() {
            return gulp.start('copy-assets-src-build');
        });
    }

    return rebundle();
}

function copyAssets(src, dest) {
    return gulp.src(src + '/**/*.(html|svg)')
        .pipe(gulp.dest(dest));
}

gulp.task('copy-assets-src-build', function() {
    return copyAssets('./src', './build');
});

gulp.task('copy-assets-build-dist', function() {
    return copyAssets('./build', './dist');
});

gulp.task('copy-server', function() {
    return gulp.src('./build/server/**/*.(html|svg)')
        .pipe(gulp.dest('./dist/server'));
});

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

gulp.task('release', [
    'set-prod',
    'build',
    'compress',
    'copy-assets-build-dist',
    'server-build',
    'copy-server'
]);

gulp.task('set-prod', function() {
    return process.env.NODE_ENV = 'production';
});

gulp.task('default', ['watch']);


// server tasks

// https://gist.github.com/just-boris/89ee7c1829e87e2db04c
function wrapPipe(taskFn) {
    return function(done) {
        var onSuccess = function() {
            done();
        };
        var onError = function(err) {
            done(err);
        };
        var outStream = taskFn(onSuccess, onError);
        if (outStream && typeof outStream.on === 'function') {
            outStream.on('end', onSuccess);
        }
    };
}

gulp.task('server', [ 'server-build', 'server-nodemon' ]);

gulp.task('server-watch', () => {
    gulp.watch('./src/server/**/*.js', [ 'server-build' ]);
});

gulp.task('server-build', wrapPipe((success, error) => {
    return gulp.src('./src/server/**/*.js')
        .pipe(babel().on('error', error))
        .pipe(gulp.dest('./build/server'));
}));

gulp.task('server-nodemon', () => {
    return nodemon({
        script: './build/server/index.js',
        watch: [ './src/server' ],
        tasks: [ 'server-build' ]
    });
});
