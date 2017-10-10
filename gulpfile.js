const gulp = require('gulp');
const pug = require('gulp-pug');
const del = require('del');
const browserSync = require('browser-sync').create();
var spritesmith = require('gulp.spritesmith'); // спрайт





// styles
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
var pxtorem = require('gulp-pxtorem');

// scripts
const gulpWebpack = require('gulp-webpack');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js')

const paths = {
    root: './docs',
    templates: {
        pages: 'src/templates/pages/*.pug',
        src: 'src/templates/**/*.pug',
        dest: 'docs/assets/'
    },
    styles: {
        src: 'src/styles/**/*.scss',
        dest: 'docs/assets/styles/'
    },
    images: {
        src: 'src/images/**/*.*',
        dest: 'docs/assets/images/'
    },
    scripts: {
        src: 'src/scripts/**/*.js',
        dest: 'docs/assets/scripts/'
    }
}

// pug
function templates() {
    return gulp.src(paths.templates.pages)
        .pipe(pug({ pretty: true }))
        .pipe(gulp.dest(paths.root));
}

// scss
function styles() {
    return gulp.src('./src/styles/app.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(sourcemaps.write())
        .pipe(pxtorem())
        .pipe(rename({ suffix: '.min' }))
        .pipe(autoprefixer({
            browsers: ['last 4 versions'],
            cascade: false
        })) //префикс
        .pipe(gulp.dest(paths.styles.dest))

}


// очистка
function clean() {
    return del(paths.root);
}

// webpack
function scripts() {
    return gulp.src('src/scripts/app.js')
        .pipe(gulpWebpack(webpackConfig, webpack))
        .pipe(gulp.dest(paths.scripts.dest));
}

// следим за исходниками, папка src
function watch() {
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.templates.src, templates);
    gulp.watch(paths.images.src, images);
    gulp.watch(paths.scripts.src, scripts);
}

// следим за build и релоадим браузер
function server() {
    browserSync.init({
        server: paths.root
    });
    browserSync.watch(paths.root + '/**/*.*', browserSync.reload);
}

// сборщик спрайта
function images() {
    var spriteData = gulp.src(paths.images.src).pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.css'
    }));
    return spriteData.pipe(gulp.dest(paths.images.dest));

    //return gulp.src(paths.images.src)
    // .pipe(gulp.dest(paths.images.dest));

}




exports.templates = templates;
exports.styles = styles;
exports.del = del;
exports.images = images;

// просто работаем
gulp.task('default', gulp.series(
    gulp.parallel(styles, templates, scripts, images),
    gulp.parallel(watch, server)
));

// контрольная сборка на продакшен
gulp.task('build', gulp.series(
    clean,
    gulp.parallel(styles, templates, scripts, images)
));