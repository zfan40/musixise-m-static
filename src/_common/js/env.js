var MusixiseBridge = require('./jsbridge');
var Util = require('./utils');

var env = {
    inApp: !!(navigator.userAgent.indexOf('Musixise')>0),
    appVersion: '0.0.1',
    getUserInfo: function(cb) {
        var self = this;
        if (!self.inApp) { //app外
        	var username = '';
            if (!Util.getCookie("a_username")) {
                username = '游客' + parseInt(Math.random() * 10000);
                Util.setCookie("a_username", username, 240);
            } else {
                username = Util.getCookie("a_username");
            }
            self.userInfo = {username:username}
            cb(self.userInfo);
        } else { //app内
            MusixiseBridge.callHandler('getUserInfo', {}, function(res) {
              self.userInfo = res;
              cb(res);
            });
        }
    },
    userInfo:{}
}

console.log('Env Activated');
module.exports = env;

