/**
 * app
 * @type {Object}
 */
// var $ = require('../../_common/js/zepto.min.js');
var io = require('../../_common/js/socket.io.js');
var socket = io('http://io.musixise.com');
var Visual = require('./visual.js');
var Sound = require('./sound.js');
var Comment = require('./comment.js');

var mainTpl = require('../template/main.ejs');

var mock = require('../mock/performerMock.js');

var musixiser = '';
musixiser = location.href.match(/.*?stage\/(.*)/)[1];
if (!musixiser) {
    musixiser = 'fzw'
}

var app = {
    init: function() {
        var self = this;
        self.render();
        Visual.bindResponsiveBackgroundSprite();
        Comment.init(function(msg,order_songname){
            console.log('mlb');
            socket.emit('req_AudienceComment',msg);
            if (order_songname) {alert('sd');socket.emit('req_AudienceOrderSong',order_songname);}
        });
    	self.bindSocket();
        self.bindLeaveMessage();
        self.bindSendGift();
    },
    render: function() {
        var self = this;
        $('body').append(mainTpl(mock));

    },
    bindSocket: function() {
        console.log('In SoundModule: bindSocket');
        socket.on('connect', function() {
            console.log('enter stage ' + musixiser);
            socket.emit('audienceEnterStage', musixiser);
        });
        socket.on('res_MusixiserMIDI', function(data) {
            var note_data = JSON.parse(data.message);
            Sound.sendMidi(note_data);
            // Visual.letThereBeLight(note_data);
        });
        socket.on('res_MusixiserComment',function(data){
            console.log('主播发来一条消息:'+data);
        });
        socket.on('res_MusixiserPickSong',function(data){
            console.log('主播将开始演奏'+data);
        });
        socket.on('res_AudienceComment', function(data) {
            $('#tl-msg ul').prepend('<li>'+data+'</li>');
        });
        socket.on('res_AudienceOrderSong', function(data) {
            console.log('有观众点了歌:'+data);
        });
        socket.on('no stage', function() {
            $('.stage-banner').html('舞台并不存在,3s后返回');
            var timer = 3;
            setInterval(function() {
                if (timer != 1) {
                    timer--;
                    $('.stage-banner').html('舞台并不存在, ' + timer + 's后返回');
                } else {
                    location.href = '//m.musixise.com';
                }
            }, 1000);
        });

    },
    bindLeaveMessage: function(){

    },
    bindSendGift: function(){

    }
};
module.exports = app;