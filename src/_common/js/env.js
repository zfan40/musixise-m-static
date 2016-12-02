var MusixiseBridge = require('./jsbridge');
var inApp = !!navigator.userAgent.indexOf('Musixise');
var appVersion = '0.0.1';
var env = {
    inApp: inApp,
    getUserInfo: function(s_cb,f_cb) {
      MusixiseBridge.callHandler('getUserInfo','',s_cb(res),f_cb(res));
    }
}
console.log('JSBridge Activated');
module.exports = env;
