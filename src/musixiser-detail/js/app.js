/**
 * app
 * @type {Object}
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

var app = {
    init: function() {
        var self = this;


        var req_config = {}
        // axios.get('http://api.musixise.com/api/work-lists/4', req_config)
        //     .then(function(res) { console.log(res) })
        //     .catch(function(err) {console.log(err)})
        axios.post('//api.musixise.com/api/user/detail/'+musixiserId, '', req_config)
            .then(function(res){
                // console.log(res.data.data);
                self.renderMusixiserInfo(res.data.data);
            })
            .catch(function(err){

            })

        axios.post('//api.musixise.com/api/work/getListByUid/'+musixiserId, '', req_config)
            .then(function(res){
                self.renderWorkList(res.data.data);
            })
            .catch(function(err){

            })

        // self.renderMusixiserInfo(generalData);
        // self.renderWorkList(workData);
        // User.getUserInfo();
        self.bindEvent();
    },
    renderMusixiserInfo: function(data) {
        var self = this;
        var a = data||{};
        var renderStr = musixiserIntroTpl(a);
        musixiserSection.innerHTML = renderStr;
        //if no stage at all, show empty icon
        if (!data){
            d.querySelector('#no-favorite-musixiser').style.display='flex';    
        }
        var loading = d.querySelector('.venus-spinner');
        loading.style.display = 'none';
    },
    renderWorkList: function(data) {
        var self = this;
        var a= data || {};
        var renderStr = workListTpl(a);
        workSection.innerHTML = renderStr;
        //if no stage at all, show empty icon
        if (!data){
            d.querySelector('#no-favorite-work').style.display='flex';    
        }
    },
    bindEvent: function() {
        var self = this;
        // musixiserTab.addEventListener('click',function(){
        //     workSection.style.display='none';
        //     musixiserSection.style.display='inherit';
        // });
        // workTab.addEventListener('click',function(){
        //     musixiserSection.style.display='none';
        //     workSection.style.display='inherit';
        // });
        d.querySelector('#past-work').addEventListener('click',function(e){
            // alert('查看音乐人详情');
            alert('play piece of id '+ e.target.getAttribute('data-id'));
            // Musixise.callHandler('EnterStage', 'http://m.musixise.com/stage/'+e.target.getAttribute('data-name')); 
            // location.href = 'http://m.musixise.com/stage/'+e.target.getAttribute('data-name');  
        });
        // workSection.addEventListener('click',function(e){
        //     alert(e.target.getAttribute('data-id'));
        //     // alert('查看作品详情');
        // })
    }
};
module.exports = app;