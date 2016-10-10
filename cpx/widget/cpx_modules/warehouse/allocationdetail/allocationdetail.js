define(function (require, exports, module) {	
	var Dialog = require('dialog');
	var Common = require('common');

	var subUrl = '';

	var allocationdetail = {
		init: function() {
			$('#revocation').on('click', function() {
				var $this = $(this);
				var id = $this.data('id'), name = $this.data('name');

				Common.showTips('是否撤销调拨到'+name, function() {
                    Common.cpxAjax({
                        url: subUrl,
                        parms: {id: id},
                        successfn: function(data) {
                        	window.location.reload(); 
                        }               
                    });    
                });
			});	
		}
	};
	
	exports.init = function() {
		allocationdetail.init();		
	};
});