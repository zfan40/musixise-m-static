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
            // self.renderPage();
            self.renderMyWorkInfo();
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
                // self.bindUploadCover();
                // self.bindUpdateMyWork();
            })
            .catch(function(err) {

            });
    },
    renderMyWorkInfo: function(data) {
        var self = this;
        var a = data || {};
        var renderStr = workUpdateTpl(a);
        workUpdateSection.innerHTML = renderStr;
        loading.style.display = 'none';
    },

    bindUploadCover: function() {
        var self = this;
        env.uploadImage(function(res){
            if (res) {
                alert(JSON.stringify(res));
                newCover = res.src;
            }
        })
    },
    bindUpdateMyWork: function() {
        var self = this;
        param.title = d.querySelector('#work-title').value;
        param.content = d.querySelector('#work-desc').value;
        param.cover = newCover;

        axios.post('//api.musixise.com/api/work/updateInfo/' + workId, JSON.stringify(param), req_config)
            .then(function(res) {
                alert('updated');
            })
            .catch(function(err) {
            });
    }
};
module.exports = app;
