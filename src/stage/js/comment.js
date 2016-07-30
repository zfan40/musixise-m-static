var User = require('./user.js');
var lockAutoScroll = false;
var lockAutoScrollProcess;

var lockAutoScroll2 = false;
var lockAutoScrollProcess2;

function orderSongTextRule(comment_str) {
	var split_str;
	if (comment_str) split_str = comment_str.split('#');
	if (split_str.length == 3) {
		return split_str[1];
	}
	return false;
}
var CommentModule = {
	init: function(callback) {
		var username = User.getUserInfo();
		console.log(username);
		$('#leaveMessage').keydown(function(e) {
			var content = $(this).val();
			if (e.keyCode == 13 && content) {
				var pickSong = orderSongTextRule(content);
				if (pickSong) { //点了一首歌
					var array = content.split('#');
					content = ''+ array[0] + '<span class="songname">#'+array[1]+'#</span>'+array[2];
				}
				$('#tl-audience-msg ul').append('<li><span class="audiencename">' + username + '</span>: ' + content + '</li>');
				document.querySelector('#tl-audience-msg').scrollTop = document.querySelector('#tl-audience-msg ul').clientHeight;
				callback(username, content, pickSong);
				$(this).val('');
			}
		});
		document.querySelector('#tl-audience-msg').addEventListener('touchstart', function() {
			lockAutoScroll = true;
			clearTimeout(lockAutoScrollProcess);
			lockAutoScrollProcess = setTimeout(function() {
				lockAutoScroll = false;
			}, 5000);
		});
		document.querySelector('#tl-musixiser-msg').addEventListener('touchstart', function() {
			lockAutoScroll2 = true;
			clearTimeout(lockAutoScrollProcess2);
			lockAutoScrollProcess2 = setTimeout(function() {
				lockAutoScroll2 = false;
			}, 5000);
		})
	},
	updateAudienceSection: function(data) {
		var content = data.msg;
		var pickSong = orderSongTextRule(content);
		if (pickSong) { //点了一首歌
			var array = content.split('#');
			content = ''+ array[0] + '<span class="songname">#'+array[1]+'#</span>'+array[2];
		}
		$('#tl-audience-msg ul').append('<li><span class="audiencename">' + data.username + '</span>: ' + content + '</li>');
		//keep the message section scrolled down most of the time
		if (!lockAutoScroll) {
			document.querySelector('#tl-audience-msg').scrollTop = document.querySelector('#tl-audience-msg ul').clientHeight;
		}
	},
	updateMusixiserComment: function(data) {
		$('#tl-musixiser-msg ul').append('<li>' + data + '</li>');
		//keep the message section scrolled down most of the time
		if (!lockAutoScroll2) {
			document.querySelector('#tl-musixiser-msg').scrollTop = document.querySelector('#tl-musixiser-msg ul').clientHeight;
		}
	},
	updateMusixiserPickSong: function(data) {
		var tpl;
		console.log(data);
		if (data.type) {
			tpl = '<(￣︶￣)> 即将演奏<span class="audiencename">'+ data.audienceName + '</span>点播的<span class="songname">#' + data.songName+'#</span>';
		} else {
			tpl = '(⊙﹏⊙✿) 不太会<span class="audiencename">'+ data.audienceName + '</span>点播的<span class="songname">#' + data.songName+'#</span>';
		}
		$('#tl-musixiser-msg ul').append('<li>' + tpl + '</li>');
		//keep the message section scrolled down most of the time
		if (!lockAutoScroll2) {
			document.querySelector('#tl-musixiser-msg').scrollTop = document.querySelector('#tl-musixiser-msg ul').clientHeight;
		}
	}
}

console.log('CommentModule Activated');
module.exports = CommentModule;