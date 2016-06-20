// var $ = require('../../_common/js/zepto.min.js');
var Util = require('../../_common/js/utils.js');
var UserModule = {
    getUserInfo: function() {
        //from cookie
        if (!Util.getCookie("username")) {
            self.username = '游客'+parseInt(Math.random()*1000);
            Util.setCookie("username",self.username,240);
        }
        else self.username = Util.getCookie("username");
        return self.username;
    },
    username:''
}


console.log('UserModule Activated');
module.exports = UserModule;