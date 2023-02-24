const { src, dest, watch, parallel } = require('gulp');

// Depenedencia css
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer'); //funciiona en el navegador que le digas
const cssnano = require('cssnano'); // comprime el codigo css
const postcss = require('gulp-postcss'); //hace unas transformaciones
const sourcemaps = require('gulp-sourcemaps');

// Dependencias imagenes
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

//JavaScript
const terser = require('gulp-terser-js');

function css(done){
    //identifica el archivo .scss a compilar
    src('src/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe( plumber())
    .pipe( sass() )//compilarlo
    .pipe( postcss([autoprefixer(),cssnano()]))
    .pipe(sourcemaps.write('.'))
    .pipe( dest('build/css') )//almacenarla
    done();
}

function imagenes (done){
    const opciones = {
        optimizationLevel : 3
    }
    src('src/img/**/*.{png,jpg}')
    .pipe(cache(imagemin(opciones)))
    .pipe(dest('build/img'))
    done();
}

function versionWebp (done){

    const opciones = {
        quality: 50
    };
    src('src/img/**/*.{png,jpg}')
    .pipe(webp(opciones))
    .pipe(dest('build/img'))
    done();
}

function versionAvif (done){

    const opciones = {
        quality: 50
    };
    src('src/img/**/*.{png,jpg}')
    .pipe(avif(opciones))
    .pipe(dest('build/img'))
    done();
}

function javascript(done){
    src('src/js/**/*.js')
    .pipe( sourcemaps.init())
    .pipe( terser())
    .pipe( sourcemaps.write('.'))
    .pipe( dest('build/js'));
    done();
}

function dev(done){
    watch('src/scss/**/*.scss', css);
    watch('src/js/**/*.js', javascript);
    done();
}

exports.css = css;
exports.js = javascript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel(imagenes, versionWebp, versionAvif, javascript, dev);