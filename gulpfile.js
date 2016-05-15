var gulp = require('gulp');
var gutil = require("gulp-util");
var browserSync = require('browser-sync').create();
var del = require('del');
var webpack = require('webpack');
var compress = require('compression');
var minimist = require('minimist');
var path = require('path');

var buildUtil = require('@ali/alimusic-m-build-util');

/**
 * Gulp执行的参数
 * @type {Object}
 * - debug
 * - local
 * - target
 */
var project = path.basename(path.resolve('.'));
var options = minimist(process.argv.slice(2));
options.project = project;

var CWD = process.cwd();
var PATH = {
  SRC: '/src',
  BUILD: '/build'
};

/**
 * gulp build
 */
gulp.task('build', ['clean', 'build:webpack'], function() {

});

/**
 * gulp build:webpack
 * 执行webpack打包
 */
gulp.task('build:webpack', function (cb) {
  var webPackConfig = buildUtil.getWebpackConfig(options);
  webpack(webPackConfig, function(err, stats) {
    if(err) {
      throw new gutil.PluginError('webpack', err);
    }
    gutil.log("[webpack]", stats.toString({
      // output options
    }));
    cb();
  });
});

/**
 * gulp rebuild
 * 重新打包并刷新服务器
 */
gulp.task('rebuild', ['rebuild:webpack'], function() {
  browserSync.reload();
  console.log('##### rebuild end ####');
});

/**
 * gulp ebuild:webpack
 * 重新打包
 */
gulp.task('rebuild:webpack', ['build:webpack']);

/**
 * gulp watch
 * 监控文件变化并打包
 */
gulp.task('watch', function () {
  gulp.watch(path.join(CWD, PATH.SRC, '/**/*.html'), ['rebuild']);
  gulp.watch(path.join(CWD, PATH.SRC, '/**/*.scss'), ['rebuild']);
  gulp.watch(path.join(CWD, PATH.SRC, '/**/*.css'), ['rebuild']);
  gulp.watch(path.join(CWD, PATH.SRC, '/**/*.js'), ['rebuild']);
  gulp.watch(path.join(CWD, PATH.SRC, '/**/*.ejs'), ['rebuild']);
});

/**
 * gulp serve
 * 打包后启动服务器
 */
gulp.task('serve', ['build:webpack'], function () {
  browserSync.init({
    server: {
      baseDir: './build',
      directory: true,
      // middleware: function(req,res,next){
      //      var gzip = compress();
      //       gzip(req,res,next);
      // }
    },
    port: 3001,
    notify: false
  });
});

/**
 * gulp clean
 * 清理build目录
 */
gulp.task('clean', function () {
  var PATH_BUILD = CWD + PATH.BUILD;
  del.sync(
    [PATH_BUILD + '/**', '!' + PATH_BUILD]
  );
});

/**
 * 默认命令
 */
gulp.task('default', ['build', 'serve']);