var gulp = require('gulp'),
	sass = require('gulp-sass'),
	watch = require('gulp-watch'),
	sourcemaps = require('gulp-sourcemaps'),
	cssnano = require('gulp-cssnano'),
	argv = require('yargs').argv,
	gulpif = require('gulp-if'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	del = require('del'),
	browserify = require('browserify'),
	transform = require('vinyl-source-stream'),
	sync = require('browser-sync').create(),
	pug = require('gulp-pug'),
	path = require('path');

// argv cacha los paramatros pasados por la consola
//la variable @prod se pasa en la consola como "--prod" al final del comando
var isProduction;
if(argv.prod){
	isProduction = true;
} else {
	isProduction = false;
}

var config = {
	scssDir: './assets/scss',
	cssDir: './assets/css',
	jsDir: './assets/js',
	imgDir: './assets/img',
	pug: './pug'
};

// esta tarea es para compilar archivos sass
gulp.task('style', function(){
	return gulp.src(config.scssDir + '/*.scss') // directorio archivos scss
	.pipe(sourcemaps.init()) //inicializa sourcemaps
	.pipe(sass()) // inicializa sass
	.on('error', sass.logError) // muestra un error de sass
	.pipe(gulpif(isProduction, cssnano(), sourcemaps.write('maps'))) // minifica el css validando si esta en produccion // genera archivosourcemaps
	.pipe(gulp.dest(config.cssDir)) // directorio dende se genera archivo css
	.pipe(sync.stream())
});

// concatenamos los archivos de JS
gulp.task('concat', function(){
	return gulp.src([
		config.jsDir + '/start.js',
		config.jsDir + '/main.js',
		config.jsDir + '/end.js'
	])
	.pipe(concat('scripts.js'))
	.pipe(gulp.dest(config.jsDir))
});

// comprimimos los archivos de javascrips, ejecuta priemro la tarea concat
gulp.task('compress', ['concat'], function(){
	return gulp.src(config.jsDir + '/scripts.js')
	.pipe(uglify())
	.on('error', console.error.bind(console))
	.pipe(gulp.dest(config.jsDir + '/min'))
});

// con esta tarea lo que haremos es comprimir las imgenes del tipo especificado en el array
// gulp.task('imgmin', function(){
// 	return gulp.src([
// 		config.imgDir + '/*.png',
// 		config.imgDir + '/*.jpg',
// 		config.imgDir + '/*.jpeg'
// 		])
// 	.pipe(imagemin())
// 	.pipe(gulp.dest(config.imgDir + '/'))
// });
gulp.task('imgmin', function(){
	return gulp.src(config.imgDir + '/*.{png,jpg,jpeg}')
	.pipe(imagemin())
	.pipe(gulp.dest(config.imgDir + '/'))
});

// tarea para eliminar archivos o directorios
gulp.task('cleanup', function() {
    del(config.cssDir + '/maps/*');
    del(config.cssDir + '/maps/');
});

// esta tarea es para empaquetar archivos/modulos de JS
gulp.task('browserify', function() {
    return browserify(config.jsDir + '/src/main.js')
    .bundle()
    .pipe(transform('bundle.js'))
    .pipe(gulp.dest(config.jsDir + '/min/'))
});

gulp.task('js-sync', ['compress'], function() {
    sync.reload();
});

// esta tarea es para sincronizar y ver los cambios al vuelo
gulp.task('browsersync',['compress', 'style', 'pug'], function() {
	sync.init({
		server: {
			// baseDir: "./"
			baseDir: "./www/app/"
		},
		browser: "firefox"
	});
	gulp.watch('./www/app/**/*.html').on('change', sync.reload);
	gulp.watch(config.scssDir + '/**/*.scss', ['style']);
	gulp.watch(config.jsDir + '/*.js', ['js-sync']);
	gulp.watch(config.pug + '/**/*.pug', ['pug']);
});

// esta tarea es para generar nuestros archivos html
gulp.task('pug', function(done) {  
  gulp.src(config.pug + '/*.pug')
    .pipe(pug({
    	pretty: '	'
    }))
    .pipe(gulp.dest(callback))
    .on('end', done)
});

function callback(file) {  
  if (file.path.search('index') !== -1) {
    return './www/app/';
  }
  var folder = path.basename(file.path).replace(/\..*html/, '/');
  return './www/app/' + folder;
}

// esta tarea es para observar nuestros archivos
// gulp.task('watch', function(){
// 	watch(config.scssDir + '/**/*.scss', function(){
// 		gulp.start('style');
// 		// console.log(isProduction);
// 	});
// });
