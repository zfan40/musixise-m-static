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
		$('#leaveMessage').keydown(function(e){
			var content = $(this).val();
			if (e.keyCode == 13 && content) {
				$('#tl-msg ul').prepend('<li>'+content+'</li>');
				callback(content,orderSongTextRule(content));
				$(this).val('');
			}
		});
    }
}

console.log('CommentModule Activated');
module.exports = CommentModule;
