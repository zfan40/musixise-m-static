/**
 * app
 * @type {Object}
 */

var d = document;
var io = require('../../_common/js/socket.io.js');
var socket = io('http://io.musixise.com');
var Musixise = require('../../_common/js/jsbridge.js');
// var fetch = require('../../_common/js/fetch.js');
var axios = require('axios');

var musixiserListTpl = require('../template/musixiserList.ejs');
var workListTpl = require('../template/workList.ejs');
var MockData1 = require('../mock/musixisers.js');
var MockData2 = require('../mock/works.js');
var User = require('./user.js');
var musixiserTab = d.querySelector('#musixiser-tab');
var workTab = d.querySelector('#work-tab');
var musixiserSection = d.querySelector('#musixiser-section');
var workSection = d.querySelector('#work-section');
var app = {
    init: function() {
        var self = this;
        var req_config = {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        };
        axios.defaults.headers.common["Accept"] = "application/json";
        axios.defaults.headers.common['Content-Type'] = "application/json";

        axios.post('//api.musixise.com/api/user/authenticate', JSON.stringify({ username: 'dading', password: '123456' }), req_config)
            .then(function(res) {
                console.log(res);
                req_config.headers.Authorization = 'Bearer '+res.data.id_token;
                //获取本人作品列表 OK
                axios.post('//api.musixise.com/api/work/getList','', req_config)
                    .then(function(res){
                        console.log(res);
                    })
                    .catch(function(err){
                        console.log(err);
                    });
                //关注某人
                axios.post('//api.musixise.com/api/follow/add',JSON.stringify({followId:3,status:0}), req_config)
                    .then(function(res){
                        console.log('关注人成功',res);
                    })
                    .catch(function(err){
                        console.log(err);
                    });
                //收藏某作品
                axios.post('//api.musixise.com/api/favorite/addWork',JSON.stringify({workId:10,status:0}), req_config)
                    .then(function(res){
                        console.log('收藏作品成功',res);
                    })
                    .catch(function(err){
                        console.log(err);
                    });
                //获取关注人
                axios.post('//api.musixise.com/api/follow/getList','', req_config)
                    .then(function(res){
                        console.log('关注的人',res);
                    })
                    .catch(function(err){
                        console.log(err);
                    });
                //获取收藏作品
                axios.post('//api.musixise.com/api/favorite/getMyFavoriteWorks','', req_config)
                    .then(function(res){
                        console.log('收藏作品',res);
                    })
                    .catch(function(err){
                        console.log(err);
                    });
            })
            .catch(function(err) { console.log(err); });
        self.renderFavoriteMusixiser(MockData1);
        self.renderFavoriteWork(MockData2);
        // User.getUserInfo();

        var loading = d.querySelector('.venus-spinner');
        loading.style.display = 'none';
        self.bindEvent();
    },
    renderFavoriteMusixiser: function(data) {
        var self = this;
        var loading = d.querySelector('.venus-spinner');
        loading.style.display = 'none';
        var favoriteMusixiserDiv = d.querySelector('#musixiser-section ul');
        var a = {};
        a = data;
        var renderStr = musixiserListTpl(a);
        favoriteMusixiserDiv.innerHTML = renderStr;
        //if no stage at all, show empty icon
        if (!data) {
            d.querySelector('#no-favorite-musixiser').style.display = 'flex';
        }
    },
    renderFavoriteWork: function(data) {
        var self = this;
        var loading = d.querySelector('.venus-spinner');
        loading.style.display = 'none';
        var favoriteWorkDiv = d.querySelector('#work-section ul');
        var a = {};
        a = data;
        var renderStr = workListTpl(a);
        favoriteWorkDiv.innerHTML = renderStr;
        //if no stage at all, show empty icon
        if (!data) {
            d.querySelector('#no-favorite-work').style.display = 'flex';
        }
    },
    bindEvent: function() {
        var self = this;
        musixiserTab.addEventListener('click', function() {
            workSection.style.display = 'none';
            musixiserSection.style.display = 'inherit';
        });
        workTab.addEventListener('click', function() {
            musixiserSection.style.display = 'none';
            workSection.style.display = 'inherit';
        });
        musixiserSection.addEventListener('click', function(e) {
            // alert('查看音乐人详情');
            alert(e.target.getAttribute('data-id'));
            // Musixise.callHandler('EnterStage', 'http://m.musixise.com/stage/'+e.target.getAttribute('data-name'));
            // location.href = 'http://m.musixise.com/stage/'+e.target.getAttribute('data-name');
        });
        workSection.addEventListener('click', function(e) {
            alert(e.target.getAttribute('data-id'));
            // alert('查看作品详情');
        });
    }
};
module.exports = app;
