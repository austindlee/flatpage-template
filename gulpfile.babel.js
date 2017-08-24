import gulp from 'gulp';
import nunjucksRender from 'gulp-nunjucks-render';

// images
import imagemin from 'gulp-imagemin';

// Styling related packages
import sass from 'gulp-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import minifyCSS from 'gulp-csso';

import webpack from 'webpack-stream';
import sourcemaps from 'gulp-sourcemaps';
import bs from 'browser-sync';
import del from 'del';

const browserSync = bs.create();

gulp.task('clean', () => del(['build/']));

gulp.task('images:prod', () =>
  gulp.src('src/images/*').pipe(imagemin()).pipe(gulp.dest('dist/images'))
);

gulp.task('styles:dev', () =>
  gulp
    .src('./src/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream())
);

gulp.task('styles:prod', () =>
  gulp
    .src('./src/scss/**/*.scss')
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(minifyCSS())
    .pipe.pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream())
);

gulp.task('scripts', () =>
  gulp
    .src('src/js/index.js')
    .pipe(
      webpack({
        output: {
          filename: 'bundle.js',
        },
      })
    )
    .pipe(gulp.dest('build/js'))
);

gulp.task('html', () =>
  gulp
    .src('src/*.{njk,html}')
    .pipe(
      nunjucksRender({
        path: ['src/partials/'],
      })
    )
    .pipe(gulp.dest('build/'))
);

gulp.task('browser-sync', ['html', 'styles', 'scripts'], () => {
  browserSync.init({
    server: {
      baseDir: './build',
    },
  });

  gulp.watch('./src/scss/**/*.scss', ['styles']);
  gulp.watch('./src/js/**/*.js', ['scripts']);
  // gulp.watch('src/index.njk').on('change', browserSync.reload);
});

gulp.task('default', ['browser-sync']);
