require('./index.scss');



/**
 * 本地开发时请启用以上代码使用本地的第三方库
 * 发布到AWP上之前请注释掉以上代码再Build
 */


/**
 * 启用以下代码使用orbit mtop mock
 */
/*
require('./mock/_orbit-mtop-mock.js');
*/

var app = require('./js/app.js');
app.init();

