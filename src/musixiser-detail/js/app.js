/**
 * app
 * musixiser detail page
 * author: ziwen
 */

var d = document;
var Musixise = require('../../_common/js/jsbridge.js');
var User = require('./user.js');
var axios = require('axios');

var generalData = require('../mock/general.js');
var workData = require('../mock/work.js');
var musixiserIntroTpl = require('../template/musixiserIntro.ejs');
var workListTpl = require('../template/workList.ejs');

var musixiserSection = d.querySelector('#intro-info');
var workSection = d.querySelector('#past-work');

// var musixiserId = location.href.match(/.*?stage\/(.*)/)[1];
var musixiserId = location.href.split('/').pop();
var followStatus = false;
var inApp;
var isLogin;
var app = {
    init: function() {
        var self = this;
        // axios.get('http://api.musixise.com/api/work-lists/4', req_config)
        //     .then(function(res) { console.log(res) })
        //     .catch(function(err) {console.log(err)})
        Musixise.callHandler('getUserInfo', {}, function() {
            isLogin = true;
            self.renderPage();
        }, function() {
            isLogin = false;
            self.renderPage();
        })
    },
    renderPage: function() {
        var self = this;
        var req_config = {}
        axios.post('//api.musixise.com/api/user/detail/' + musixiserId, '', req_config)
            .then(function(res) {
                // console.log(res.data.data);
                self.renderMusixiserInfo(res.data.data);
            })
            .catch(function(err) {

            });

        axios.post('//api.musixise.com/api/work/getListByUid/' + musixiserId, '', req_config)
            .then(function(res) {
                self.renderWorkList(res.data.data);
            })
            .catch(function(err) {

            });
        // self.renderMusixiserInfo(generalData);
        // self.renderWorkList(workData);
        self.bindEvent();
    },
    renderMusixiserInfo: function(data) {
        var self = this;
        var a = data || {};
        var renderStr = musixiserIntroTpl(a);
        musixiserSection.innerHTML = renderStr;
        //if no stage at all, show empty icon
        if (!data) {
            d.querySelector('#no-favorite-musixiser').style.display = 'flex';
        }
        var loading = d.querySelector('.venus-spinner');
        loading.style.display = 'none';
    },
    renderWorkList: function(data) {
        var self = this;
        var a = data || {};
        var renderStr = workListTpl(a);
        workSection.innerHTML = renderStr;
        //if no stage at all, show empty icon
        if (!data) {
            d.querySelector('#no-favorite-work').style.display = 'flex';
        }
    },
    bindEvent: function() {
        var self = this;
        // if interchange tabs.
        // musixiserTab.addEventListener('click',function(){
        //     workSection.style.display='none';
        //     musixiserSection.style.display='inherit';
        // });
        // workTab.addEventListener('click',function(){
        //     musixiserSection.style.display='none';
        //     workSection.style.display='inherit';
        // });
        self.bindPlayWork();
        self.bindAddFavoriteWork();
        self.bindFollowMusixiser();
        self.bindCheckMusixiser();
        // workSection.addEventListener('click',function(e){
        //     alert(e.target.getAttribute('data-id'));
        //     // alert('查看作品详情');
        // })
    },
    bindPlayWork: function() {
        var self = this;
        d.querySelector('#past-work').addEventListener('click', function(e) {
            alert('play piece of id ' + e.target.getAttribute('data-id'));
            Musixise.callHandler('showToast', '开始播放'，function() {}, function() {});
            location.href = "musixise://play/" + e.target.getAttribute('data-id');
        });
    },
    bindAddFavoriteWork: function() {
        var self = this;
        //收藏某作品
        //onclick...
        var req_config = {};
        axios.post('//api.musixise.com/api/favorite/addWork', JSON.stringify({
                workId: 10,
                status: 0
            }), req_config)
            .then(function(res) {
                console.log('收藏作品成功', res);
            })
            .catch(function(err) {
                console.log(err);
            })
    },
    bindCheckMusixiser: function() {
        var self = this;
        d.querySelector('.avatar').addEventListener('click', function() {
            Musixise.callHandler('popMusixiserBox', {
                id: musixiserId
            }, function() {
                //
            }, function() {
                alert('唤起查看音乐人插件失败');
            });
        });
    },
    bindFollowMusixiser: function() {
        var self = this;
        var req_config = {};
        d.querySelector('.follow-status').addEventListener('click', function(e) {
            if (followStatus) {
                //取消关注
                followStatus = false;
            } else {
                followStatus = true;
            }
            //关注某人
            var param = {
                followId: musixiserId,
                status: followStatus
            };
            axios.post('//api.musixise.com/api/follow/add', JSON.stringify({
                    followId: musixiserId,
                    status: 0
                }), req_config)
                .then(function(res) {
                    console.log('关注人成功', res);
                })
                .catch(function(err) {
                    console.log(err);
                })
        });
    }
};
module.exports = app;
