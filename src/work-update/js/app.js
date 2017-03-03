/**
 * app
 * musixiser updates his work page
 * author: ziwen
 */

var d = document;
var Musixise = require('../../_common/js/jsbridge.js');
var Env = require('../../_common/js/env.js');
var axios = require('axios');
var loading = d.querySelector('.venus-spinner');

var workUpdateTpl = require('../template/workupdate.ejs');
var workUpdateSection = d.querySelector('#work-update');

var workId = location.href.split('/').pop();
var userInfo = {};
var req_config = {};

var param = {
    title:'',
    content:'',
    cover:''    
};

var newCover = '';


var app = {
    init: function() {
        var self = this;
        Env.getUserInfo(function(res) {
            userInfo = res;
            if (userInfo.token) {
                req_config.headers.Authorization = 'Bearer ' + userInfo.token;
            }
            self.renderPage();
        });
    },
    renderPage: function() {
        var self = this;
        axios.post('//api.musixise.com/api/work/detail/' + workId, '', req_config)
            .then(function(res) {
                // console.log(res.data.data);
                param.title = res.data.data.title;
                param.content = res.data.data.content;
                param.cover = res.data.data.cover;

                self.renderMyWorkInfo(res.data.data);
                self.bindUploadCover();
                self.bindUpdateMyWork();
            })
            .catch(function(err) {

            });
    },
    renderMyWorkInfo: function(data) {
        var self = this;
        var a = data || {};
        var renderStr = musixiserIntroTpl(a);
        musixiserSection.innerHTML = renderStr;
        
        loading.style.display = 'none';
    },

    bindUploadCover: function() {
        var self = this;

        //env里面要写一个uploadImg的插件方法，和谔谔联调,TODO
        newCover = '//blabla/img.png';
    },
    bindUpdateMyWork: function() {
        var self = this;
        param.title = d.querySelector('#work-title').value;
        param.content = d.querySelector('#work-desc').value;
        param.cover = newCover;

        //和八定联调更新作品的接口,TODO
        axios.post('//api.musixise.com/api/work/updateInfo/' + workId, JSON.stringify(param), req_config)
            .then(function(res) {
                alert('updated');
            })
            .catch(function(err) {
            });        
    }
};
module.exports = app;