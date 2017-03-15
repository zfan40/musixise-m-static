/**
 * app
 * musixiser detail page
 * author: ziwen
 */

var d = document;
var Musixise = require('../../_common/js/jsbridge.js');
var Env = require('../../_common/js/env.js');
var axios = require('axios');
var Sound = require('./sound.js');

var generalData = require('../mock/general.js');
var workData = require('../mock/work.js');
var musixiserIntroTpl = require('../template/musixiserIntro.ejs');
var workListTpl = require('../template/workList.ejs');

var musixiserSection = d.querySelector('#intro-info');
var workSection = d.querySelector('#past-work');

// var musixiserId = location.href.match(/.*?stage\/(.*)/)[1];
var musixiserId = location.href.split('/').pop();
var followStatus = -1; //n种取值，0关注1取消
var userInfo = {};

var req_config = {};

var AllWorks = [];//以后这里还是得native...否则歌多了会崩吧...
var app = {
    init: function() {
        var self = this;
        // axios.get('http://api.musixise.com/api/work-lists/4', req_config)
        //     .then(function(res) { console.log(res) })
        //     .catch(function(err) {console.log(err)})
        Env.getUserInfo(function(res) {
            userInfo = res;
            console.log(userInfo);
            if (userInfo.token) {
                req_config.headers.Authorization = 'Bearer ' + userInfo.token;
            }
            self.renderPage();
        });
    },
    renderPage: function() {
        var self = this;

        axios.post('//api.musixise.com/api/user/detail/' + musixiserId, '', req_config)
            .then(function(res) {
                // console.log(res.data.data);
                followStatus = res.data.data.followStatus; //这块还没测试;
                self.renderMusixiserInfo(res.data.data);
                self.bindFollowMusixiser();
                self.bindCheckMusixiser();
            })
            .catch(function(err) {

            });

        axios.post('//api.musixise.com/api/work/getListByUid/' + musixiserId, '', req_config)
            .then(function(res) {
                AllWorks = res.data.data;
                self.renderWorkList(AllWorks);
                self.bindPlayWork();
                self.bindAddFavoriteWork();
            })
            .catch(function(err) {

            });
        // self.renderMusixiserInfo(generalData);
        // self.renderWorkList(workData);
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
    // bindEvent: function() {
    //     var self = this;
    //     // if interchange tabs.
    //     // musixiserTab.addEventListener('click',function(){
    //     //     workSection.style.display='none';
    //     //     musixiserSection.style.display='inherit';
    //     // });
    //     // workTab.addEventListener('click',function(){
    //     //     musixiserSection.style.display='none';
    //     //     workSection.style.display='inherit';
    //     // });
    //     self.bindPlayWork();
    //     self.bindAddFavoriteWork();
    //     self.bindFollowMusixiser();
    //     self.bindCheckMusixiser();
    // },
    bindPlayWork: function() {
        var self = this;
        d.querySelector('#past-work').addEventListener('click', function(e) {
            if (e.target.getAttribute('data-id')) {
                alert('play piece of id ' + e.target.getAttribute('data-id'));
                // native play
                // Musixise.callHandler('showToast', '开始播放', function() {});
                // location.href = "musixise://play/" + e.target.getAttribute('data-id');

                // js play
                // console.log(AllWorks);
                var l = AllWorks.length;
                for (var i=0;i<=l-1;i++) {
                    if (e.target.getAttribute('data-id') == AllWorks[i].id) {
                        Sound.playPiece(AllWorks[i].content);
                    }
                }
            }
        });
    },
    bindAddFavoriteWork: function() {
        var self = this;
        //收藏某作品
        //onclick...

        d.querySelector('#past-work').addEventListener('click', function(e) {
            if (e.target.getAttribute('data-likeid')) {
                axios.post('//api.musixise.com/api/favorite/addWork', JSON.stringify({
                        workId: e.target.getAttribute('data-likeid'),
                        status: 0
                    }), req_config)
                    .then(function(res) {
                        console.log('收藏作品成功', res);
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
            }
        });
    },
    bindCheckMusixiser: function() {
        var self = this;
        d.querySelector('.avatar').addEventListener('click', function() {
            Musixise.callHandler('popMusixiserBox', {
                id: musixiserId,
                avatar: '',
                follow: 0,
                name: ''
            }, function() {
                //
            });
        });
    },
    bindFollowMusixiser: function() {
        var self = this;
        d.querySelector('.follow-status').addEventListener('click', function(e) {
            if (followStatus) {
                //取消关注
                followStatus = 0;
                d.querySelector('.follow-status').innerHTML = '已关注';
            } else {
                followStatus = 1;
                d.querySelector('.follow-status').innerHTML = '未关注';
            }
            //关注某人
            var param = {
                followId: musixiserId,
                status: followStatus
            };
            axios.post('//api.musixise.com/api/follow/add', JSON.stringify(param), req_config)
                .then(function(res) {
                    console.log('关注人成功', res);
                })
                .catch(function(err) {
                    console.log(err);
                });
        });
    }
};
module.exports = app;
