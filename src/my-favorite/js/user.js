// var $ = require('../../_common/js/zepto.min.js');
var Util = require('../../_common/js/utils.js');
var UserModule = {
    getUserInfo: function() {
        //from cookie
        var self = this;
        if (!Util.getCookie("a_username")) {
            self.username = '游客'+parseInt(Math.random()*10000);
            Util.setCookie("a_username",self.username,240);
        }
        else self.username = Util.getCookie("a_username");
        return self.username;
    },
    username:''
}


console.log('UserModule Activated');
module.exports = UserModule;