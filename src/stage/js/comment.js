var User = require('./user.js');
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
		$('#leaveMessage').keydown(function(e){
			var content = $(this).val();
			if (e.keyCode == 13 && content) {
				$('#tl-msg ul').append('<li>'+username+':'+content+'</li>');
				callback(username,content,orderSongTextRule(content));
				$(this).val('');
			}
		});
    }
}

console.log('CommentModule Activated');
module.exports = CommentModule;
