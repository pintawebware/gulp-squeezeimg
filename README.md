# squeezeimg gulp

Gulp plugin to optimize and convert image.

## Install

```sh
$ npm install --save-dev gulp-squeezeimg
```


## Usage
 gulpfile.js 
```js
var gulp = require('gulp');
var squeezeimg = require('gulp-squeezeimg');

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
 'Your token', https://squeezeimg.com/
### qlt :
 Quality precentage (max 80), default 60
### method : 
'convert or compress', default compress
### to
convert to format (jp2,webp)
  