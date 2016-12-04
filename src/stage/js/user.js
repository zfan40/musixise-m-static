// var $ = require('../../_common/js/zepto.min.js');
var Util = require('../../_common/js/utils.js');
var Musixise = require('../../_common/js/jsbridge.js');
var UserModule = {
    getUserInfo: function() {
        //from cookie
        var self = this;

        if (navigator.userAgent.indexOf("musixise")==-1) {  //app外
          if (!Util.getCookie("a_username")) {
              self.username = '游客'+parseInt(Math.random()*10000);
              Util.setCookie("a_username",self.username,240);
          }
          else self.username = Util.getCookie("a_username");
          return {username:self.username};
        } else {  //app内
          Musixise.callHandler('getUserInfo',{},function(res){
            return res;
          },function(){

          });
        }
    },
    username:''
};

console.log('UserModule Activated');
module.exports = UserModule;
