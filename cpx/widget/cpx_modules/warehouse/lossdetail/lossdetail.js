define(function (require, exports, module) {	
	var pagiNation = require('pagination');
    var Common = require('common');
    var Dialog = require('dialog');
    var Tooltip = require('tooltip');

	var inventorydetail = {
		init: function() {
			var self = this;

            $('[data-toggle="tooltip"]').tooltip();
            $('#beAgree, #beReject').on('click', function() {
                var $this = $(this);
                var data = {
                    expenseSn: $('#expenseSn').val(),
                    type: $this.data('type'),
                    operatorButtonIndex: $this.attr('option-name')
                };
                Common.showTips('是否确认', function() {
                    Common.cpxAjax({
                        url: '/web/expense/operator',
                        type: 'POST',
                        parms: data,
                        successfn: function(data) {
                            window.location.reload();
                        }
                    });
                });
            });
		}
	};
	
	exports.init = function() {
		inventorydetail.init();		
	};
});