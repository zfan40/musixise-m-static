/**
 * app
 * @type {Object}
 */

var d = document;

var StageListTpl = require('../template/stageList.ejs');
var MockData = require('../mock/mock.js')
var app = {
	init: function() {
		var self = this;
		self.renderStageList(MockData);
	},
	renderStageList: function(mock) {
		var stageList = d.querySelector('#musixiser-section');
		var renderStr = StageListTpl(mock);
		stageList.innerHTML = renderStr;
	}
};
module.exports = app;