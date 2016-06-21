var User = require('./user.js');
var lockAutoScroll = false;
var lockAutoScrollProcess;

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
				$('#tl-msg ul').append('<li>' + username + ':' + content + '</li>');
				document.querySelector('#tl-msg').scrollTop = document.querySelector('#tl-msg ul').clientHeight;
				callback(username, content, orderSongTextRule(content));
				$(this).val('');
			}
		});
		$('#tl-msg').on('scroll', function() {
			lockAutoScroll = true;
			clearTimeout(lockAutoScrollProcess);
			lockAutoScrollProcess = setTimeout(function() {
				lockAutoScroll = false;
			}, 5000);
		})
	},
	updateComment: function(data) {
		$('#tl-msg ul').append('<li>' + data.username + ':' + data.msg + '</li>');
		//keep the message section scrolled down most of the time
		if (!lockAutoScroll) {
			document.querySelector('#tl-msg').scrollTop = document.querySelector('#tl-msg ul').clientHeight;
		}
	}
}

console.log('CommentModule Activated');
module.exports = CommentModule;