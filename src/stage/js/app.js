/**
 * app
 * @type {Object}
 */
// var $ = require('../../_common/js/zepto.min.js');
var io = require('../../_common/js/socket.io.js');
var socket = io('http://io.musixise.com');
var Visual = require('./visual.js');
var Sound = require('./sound.js');

var musixiser = '';
musixiser = location.href.match(/.*?stage\/(.*)/)[1];
if (!musixiser) {
    musixiser = 'fzw'
}

var app = {
    init: function() {
        var self = this;
        Visual.bindResponsiveBackgroundSprite();
    	self.bindSocket();
    },
    bindSocket: function() {
        console.log('In SoundModule: bindSocket');
        socket.on('connect', function() {
            console.log('enter stage ' + musixiser);
            socket.emit('enter stage', musixiser);
        });
        socket.on('tocmsg', function(data) {
            var note_data = JSON.parse(data.message);
            Sound.sendMidi(note_data);
            Visual.letThereBeLight(note_data);
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
    }
};
module.exports = app;