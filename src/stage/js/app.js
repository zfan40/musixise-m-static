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
var User = require('./user.js');

var mainTpl = require('../template/main.ejs');

var mock = require('../mock/performerMock.js');

var Yeshao = require('../../_common/songs/her.js');

var musixiser = '';
musixiser = location.href.match(/.*?stage\/(.*)/)[1];
if (!musixiser) {
    musixiser = 'fzw'
}

var app = {
    init: function() {
        var self = this;
        socket.on('connect', function() {
            console.log('enter stage ' + musixiser);
            socket.emit('audienceEnterStage', musixiser);
        });
        socket.on('no stage', function() {
            // $('.stage-banner').html('舞台并不存在,3s后返回');
            // var timer = 3;
            // setInterval(function() {
            //     if (timer != 1) {
            //         timer--;
            //         $('.stage-banner').html('舞台并不存在, ' + timer + 's后返回');
            //     } else {
            //         location.href = '//m.musixise.com';
            //     }
            // }, 1000);
            console.log('empty room');
            Sound.playPiece(Yeshao);
            // setInterval(function(){
            //     Sound.sendMid()
            // },200);
        });
        socket.on('res_AudienceEnterStage', function(data) {
            console.log('确认进场');
            self.render(data);
            //Visual.bindResponsiveBackgroundSprite();
            Comment.init(function(username, msg, order_songname) {
                socket.emit('req_AudienceComment', { username: username, msg: msg });
                if (order_songname) {
                    console.log('您点播了一首' + order_songname);
                    socket.emit('req_AudienceOrderSong', { username: username, songname: order_songname });
                }
            });
            self.bindSocket();
            self.bindSendGift();
            // self.bindXiaJiBaDian();
        });

    },
    render: function(renderer) {
        var self = this;
        console.log(renderer);
        $('body').append(mainTpl(renderer));

    },
    bindSocket: function() {
        var self = this;
        console.log('In SoundModule: bindSocket');
        socket.on('res_MusixiserMIDI', function(data) {
            var note_data = JSON.parse(data.message);
            // console.log(note_data);
            Sound.sendMidi(note_data);
            // Visual.letThereBeLight(note_data);
        });
        socket.on('res_MusixiserComment', function(data) {
            console.log('主播发来一条消息:' + data);
        });
        socket.on('res_MusixiserPickSong', function(data) {
            console.log('' + data);
        });
        socket.on('res_AudienceComment', function(data) {
            Comment.updateComment(data);
        });
        socket.on('res_AudienceOrderSong', function(data) {
            console.log('' + data.username + '点歌:' + data.songname);
        });
    },
    bindSendGift: function() {

    },
    bindXiaJiBaDian: function() {
        var self = this;
        window.addEventListener('touchstart',function(){        
            self.lastjb = self.thisjb||0;
            self.thisjb=performance.now();
            Sound.playRandomNote();
            console.log(self.thisjb-self.lastjb);
        })
    }

};
module.exports = app;