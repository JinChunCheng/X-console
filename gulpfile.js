var gulp = require('gulp');
//引入gulp组件
//js语法检查
var jshint = require('gulp-jshint');

//文件合并
var concat = require('gulp-concat');

//js压缩
var uglify = require('gulp-uglify');

//sass文件转换
var sass = require('gulp-sass');

//重命名
var rename = require('gulp-rename');

//Parse build blocks in HTML files to replace references to non-optimized scripts or stylesheets with useref
var useref = require('gulp-useref');

//css compress
var minifyCss = require('gulp-minify-css');

//condition
var gulpif = require('gulp-if');

//clean files
var clean = require('gulp-clean');

//file include 
var fileinclude = require('gulp-file-include');

//web服务器
var browserSync = require('browser-sync').create();

//给URL自动添加MD5版本号
var rev = require('gulp-rev-append');


//检查脚本
gulp.task('lint', function() {
    gulp.src('./app/script/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

//清空临时目录
gulp.task('clean-tmp', function() {
    return gulp.src(['_tmp'], { read: false })
        .pipe(clean({ force: true }));
});

//
gulp.task('sass', function() {
    return gulp.src('./app/**/*.scss')
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(gulp.dest('app'));
});


//----------开发环境配置BEGIN----------

//清空开发环境目录
gulp.task('dev-clean', ['clean-tmp'], function() {
    return gulp.src(['app_dev'], { read: false })
        .pipe(clean({ force: true }));
});

//copy文件到临时目录
gulp.task('dev-copy', ['dev-clean'], function() {

    gulp.src(['app/img/**'])
        .pipe(gulp.dest('app_dev/img'));

    gulp.src(['app/fonts/**'])
        .pipe(gulp.dest('app_dev/fonts'));

    gulp.src([
            'app/**/*.css',
            'app/**/*.js',
            'app/**/*.json'
        ])
        .pipe(gulp.dest('app_dev'));
});

//include files to html pages
gulp.task('dev-fileinclude', ['dev-copy', 'sass'], function() {
    return gulp.src(['app/**/*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(rev())
        .pipe(gulp.dest('app_dev'));
});

//开发服务器
gulp.task('dev-server', ['dev-fileinclude'], function() {
    var files = [
        'app_dev/**/*.html',
        'app_dev/**/*.css',
        'app_dev/**/*.js'
    ];
    browserSync.init(files, {
        server: {
            baseDir: "./app_dev"
        }
    });

    gulp.watch(['app/**/*.css', 'app/**/*.scss', 'app/**/*.js', 'app/**/*.html', 'app/**/*.tpl'], ['dev-fileinclude']);
    gulp.watch("app_dev/**/*.html").on('change', browserSync.reload);
});

//----------开发环境配置END----------



//----------生产环境配置BEGIN----------

// 清空生产环境目录
gulp.task('prod-clean', ['clean-tmp'], function() {
    return gulp.src(['dist'], { read: false })
        .pipe(clean({ force: true }));
});

//copy文件到临时目录
gulp.task('prod-copy', ['prod-clean'], function() {

    gulp.src(['app/img/**'])
        .pipe(gulp.dest('_tmp/img'));

    gulp.src(['app/fonts/**'])
        .pipe(gulp.dest('_tmp/fonts'));

    gulp.src([
            'app/**/*.css',
            'app/**/*.js',
            'app/**/*.json'
        ])
        .pipe(gulp.dest('_tmp'));
});

//include files to html pages
gulp.task('prod-fileinclude', ['prod-copy', 'sass'], function() {
    return gulp.src(['app/**/*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('_tmp'));
});

//页面引用的css、js合并压缩
gulp.task('prod-useref', ['prod-fileinclude'], function() {
    return gulp.src('_tmp/*.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest('dist'));
});

//生产环境服务
gulp.task('prod-server', ['prod-useref'], function() {
    var files = [
        'dist/**/*.html',
        'dist/**/*.css',
        'dist/**/*.js'
    ];
    browserSync.init(files, {
        server: {
            baseDir: "./dist"
        }
    });
});

//默认任务
gulp.task('default', [], function() {
    console.log("warning: there's no default tasks, run 'dev' for you ");
    gulp.run('dev');
});

//----------生产环境配置END----------


//开发环境任务
gulp.task('dev', ['dev-server'], function() {
    //gulp.run('clean-tmp');
});

//生产环境任务
gulp.task('build', ['prod-server'], function() {
    gulp.run('clean-tmp');
});
