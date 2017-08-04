var MusixiseBridge = require('./jsbridge');
var Util = require('./utils');

// alert(navigator.userAgent);
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
            self.userInfo = {username:username,realname:username}
            cb(self.userInfo);
        } else { //app内
            MusixiseBridge.callHandler('GetUserInfo', {}, function(res) {
              self.userInfo = res;
              cb(res);
            });
        }
    },
    uploadImage: function(cb){
        var self= this;
        if (!self.inApp) { //app外
            // location.href='musixise://open';
        } else { //app内
            MusixiseBridge.callHandler('UploadImage', {}, function(res) {
              cb(res);
            });
        }
    },
    setTitle: function(title){
        var self= this;
        if (!self.inApp) { //app外
            // location.href='musixise://open';
        } else { //app内
            MusixiseBridge.callHandler('SetTitle',title,function(res){});
        }
    },
    showToast: function(msg){
        var self= this;
        if (!self.inApp) { //app外
            // location.href='musixise://open';
        } else { //app内
            MusixiseBridge.callHandler('ShowToast',msg,function(res){});
        }
    },
    pushWebPage: function(url) {
      var self = this;
      if (!self.inApp){
        location.href = url;
      } else {
        Musixise.callHandler('PushWebPage', url);
      }
    },
    userInfo:{}
}

console.log('Env Activated');
module.exports = env;

