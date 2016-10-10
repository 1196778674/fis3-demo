define(function (require, exports, module) {
	var dialog = require('dialog');

	var funddetail = {
		init: function() {
			var self = this;

			self.initTable();
			self.initEvent();
		},
		initTable: function() {
			
		},
		initEvent: function() {
			//复制
			$('#copy').on('click', function() {

			});
			//撤销
			$('#revocation').on('click', function() {

			});
		}
	};

	exports.init = function() {
		funddetail.init();
	};
});