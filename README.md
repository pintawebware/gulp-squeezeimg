# squeezeimg gulp

The Gulp Squeezeimg plugin is destined to optimize unlimited images without any visible loss in quality.

Using the plugin Gulp Squeezeimg you can easily minify the size of all your images, speed up loading of your websites and applications.

You can compress your images of such formats - .png, .jpg/.jpeg, .gif, .svg, .bmp, .tiff.

Also plugin allows you to convert your images to webP and jp2 format.

Try the plugin functions right now. To do this, go to https://squeezeimg.com/.

## Install

```sh
$ npm install --save-dev gulp-squeezeimg
```


## Usage
 gulpfile.js 
```js
var gulp = require('gulp');
var squeezeimg = require('gulp-squeezeimg');

const option = {
    token: 'Your API token',
    qlt: 60,
    method: 'compress',
    to: 'webp'
    rename: false,
  }

gulp.task('gulp-squeezeimg', function() {
  return gulp.src('images/*') 
    .pipe(squeezeimg(option))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('default', gulp.series('gulp-squeezeimg'));
```

## API

### squeezeimg(option)

#### Options Object
### token : 
 'Your API token', https://squeezeimg.com/
### qlt :
 Quality precentage (max 80), default 60
### method : 
'convert or compress', default 'compress'
### to
convert to format ( jp2, webp ) default 'webp'
### rename 
rename image, default false  ( If true, the file name is assigned by the server )

### License MIT License (c) PintaWebware