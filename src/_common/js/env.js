var MusixiseBridge = require('./jsbridge');
var inApp = !!navigator.userAgent.indexOf('Musixise');
var appVersion = '0.0.1';
var env = {
    inApp: inApp,
    getUserInfo: function(cb) {
      MusixiseBridge.callHandler('getUserInfo','',cb(res));
    }
}
console.log('JSBridge Activated');
module.exports = env;
