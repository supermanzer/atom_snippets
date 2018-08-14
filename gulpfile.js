/*
=================================================================
template gulpfile.js
=================================================================
This is a gulpfile.js from one of my more advanced projects. I like
how it is set up and helps me utilize the Django staticfiles app 
to more rapidly dep;oy front-end related static files.
*/

var gulp = require('gulp');
var sass = require('gulp-sass');
var minifycss = require('gulp-minify-css');
var rename = require('gulp-rename');
var gzip = require('gulp-gzip');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cachebust = require('gulp-cache-bust');
const babel = require('gulp-babel');
// Run shell commands with exec:
// https://www.npmjs.com/package/gulp-exec
var exec = require('child_process').exec;

var gzip_options = {
    threshold: '1kb',
    gzipOptions: {
        level: 9
    }
}
var d = new Date();


/* Compile and Minify JS */
gulp.task('scripts', function(cb){
    return gulp.src('_assets/js/**/*.js')
            .pipe(babel({presets: ['env']}))
            .pipe(concat('all.js'))
            .pipe(cachebust())
            .pipe(gulp.dest('_assets/dist/js'))
            .pipe(rename('all.min.js'))
            .pipe(uglify())
            .pipe(gulp.dest('_assets/dist/js'));
});

/* Compile D3 specific functions into a single file */
gulp.task('d3-scripts',function(cb){
    return gulp.src('_assets/js/d3/*.js')
            .pipe(babel({
                presets: ['env']
            }))
            .pipe(concat('d3_all.js'))
            .pipe(cachebust())
            .pipe(gulp.dest('_assets/dist/js'))
            .pipe(rename('d3_all.min.js'))
            .pipe(uglify())
            .pipe(gulp.dest('_assets/dist/js'));
});

/* Compile Sass Files into CSS */
gulp.task('sass', function(){
    return gulp.src('_assets/scss/*.scss')
        .pipe(sass())
        .pipe(cachebust())
        .pipe(gulp.dest('_assets/dist/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('_assets/dist/css'));
        // .pipe(gzip(gzip_options))
        // .pipe(gulp.dest('_assets/dist/css'));
});

// Using Django's collectstatic actions to streamline static file management.
gulp.task('collectstatic', function(){
    exec('docker exec local_dev_web_1 ./manage.py collectstatic --noinput', function(stderr,stdout){
        console.log(stdout);
        console.log(stderr);
    });
});

// Watching our files
gulp.task('watch', function () {
    gulp.watch('_assets/scss/*.scss', ['sass', 'collectstatic']);
    gulp.watch('_assets/js/d3/*js', ['d3-scripts', 'collectstatic']);
    gulp.watch('_assets/js/*.js', ['scripts', 'collectstatic']);
    // Watching App Specific Static Directories
    gulp.watch('amazon_sales/static/amazon_sales/**/*.*', ['collectstatic', ]);
    gulp.watch('analytics/static/analytics/**/*.*', ['collectstatic', ]);
    gulp.watch('db_comments/static/db_comments/**/*.*', ['collectstatic', ]);
    gulp.watch('emps/static/emps/**/*.*', ['collectstatic', ]);
    gulp.watch('faq/static/faq/**/*.*', ['collectstatic', ]);
    gulp.watch('home/static/home/**/*.*', ['collectstatic', ]);
    gulp.watch('mps/static/mps/**/*.*', ['collectstatic', ]);
    gulp.watch('warehouse/static/warehouse/**/*.*', ['collectstatic', ]);
})



// Defining our default tasks list.
gulp.task('default',['sass','scripts', 'd3-scripts', 'watch']);
