/**
 * app
 * @type {Object}
 */

var d = document;
var io = require('../../_common/js/socket.io.js');
var socket = io('http://io.musixise.com');
var Musixise = require('../../_common/js/jsbridge.js');

var StageListTpl = require('../template/stageList.ejs');
// var MockData = require('../mock/mock.js');
var User = require('./user.js');
var app = {
    init: function() {
        var self = this;
        // self.renderStageList(MockData);
        User.getUserInfo();
        self.bindSocket();
        self.bindEvent();
    },
    renderStageList: function(data) {
        var self = this;
        var stageList = d.querySelector('#musixiser-section');
        var a = {};
        a.list = data;
        var renderStr = StageListTpl(a);
        stageList.innerHTML = renderStr;
    },
    insertStage: function(data) {
        var self = this;
        var stageList = d.querySelector('#musixiser-section');
        var a ={};
        a.list = [data];
        stageList.innerHTML = StageListTpl(a)+stageList.innerHTML ;
    },
    removeStage: function(name) {
        var self = this;
        d.querySelector('#id'+name).remove();
    },
    updateStageAudienceNum: function(data) {
        var self = this;
        var currentNum = +d.querySelector('#id'+ data.nickname+' .listener-total span').innerHTML;
        d.querySelector('#id'+ data.nickname+' .listener-total span').innerHTML = currentNum+data.amountdiff;
    },
    bindSocket: function() {
        var self = this;
        console.log('in musician list, binding sockets');
        socket.on('connect', function() {
            socket.emit('audienceEnterApp');
        });
        socket.on('currentMusicianList', function(data) {
            console.log(data);
            var a = {};
            a.list = data;
            self.renderStageList(data);
        });
        socket.on('moreActiveMusician', function(data) {
            //insert into musician list(right place)
            //this data is just the name.
            console.log('' + data + 'is now active');
            self.insertStage(data);
        });
        socket.on('lessActiveMusician', function(data) {
            //remove from musician list(right place),
            //this data is just the name.
            console.log('' + data + 'is now inactive');
            self.removeStage(data);
        });
        socket.on('audienceNumUpdate', function(data) {
            //insert into musician list(right place)
            //this data is e.g {nickname: "12321", amountdiff: 1}
            self.updateStageAudienceNum(data);
        });
    },
    bindEvent: function() {
        var self = this;
        var stageList = d.querySelector('#musixiser-section');
        stageList.addEventListener('touchend',function(e){
            Musixise.callHandler('EnterStage', 'http://m.musixise.com/stage/'+e.target.getAttribute('data-name')); 
            // location.href = 'http://m.musixise.com/stage/'+e.target.getAttribute('data-name');  
        });
    }
};
module.exports = app;