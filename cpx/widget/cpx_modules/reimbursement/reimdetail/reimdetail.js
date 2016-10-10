define(function (require, exports, module) {
	var grid = require('grid');
	var dialog = require('dialog');
	var Combo = require('combo');

	var searchUrl = '/test/reim/reimdetail.json';

	var reimdetail = {
		init: function() {
			var self = this;

			self.initTable();
			self.initEvent();
		},
		initTable: function() {
			var self = this;
        	var columns = [
        		{display: '明细金额', name: 'money', width: 120, align: 'right', type: 'numberbox', totalSummary: {type: 'sum'}},
        		{display: '明细描述', name: 'descript', width: 'auto', align: 'left'}
        	];

        	self.grid = $("#maingrid").ligerGrid({
                url: searchUrl,
                parms: {expenseSn: ''},
                contentType: 'JSON',
                method: 'GET',
                columns: columns,
                //改变数据源的值
                root: 'list',
                usePager: false
            });
		},
		initEvent: function() {
			//撤销
			$('#revocation').on('click', function() {

			});
			//修改
			$('#modify').on('click', function() {

			});
			//同意
			$('#agree').on('click', function() {
				dialog({
					width: 300,
					class: 'agree-dialog',
					title: '同意审批',
					content: '<div class="agree-approve-dialog">' +
						        '<textarea class="apprvoe-res">请输入同意理由</textarea>' +
						        '<div class="cpx-form">' +
						        	'<div class="form-group control-group">' +
						                '<label class="control-label">下级审批人:</label>' +
						                '<div class="controls">' +
						                    '<div class="control">' +
						                        '<span class="ui-combo-wrap" id="approvePerson">' +
						                            '<input type="text" class="input-txt" autocomplete="off" data-ref="date">' +
						                            '<i class="trigger"></i>' +
						                        '</span>' +
						                    '</div>' +
						                '</div>' +
						            '</div>' +
						        '</div>' +
						        '<div class="checkbox" id="nextPeronCheckbox">' +
						            '<input type="radio" name="checkNextPerson" id="checkNextPerson">' +
						            '<label for="checkNextPerson">完成终审</label>' +
						        '</div>' +
						    '</div>',
					button: [{
						value: '同意',
						callback: function() {
							//回调逻辑
						}
					},{
						class: 'btn-default',
						value: '取消'
					}],
					init: function() {
						var $dialog = $(this.node);
						
						$('.apprvoe-res').placeholder();
						approvePersonCombo = Business.publicCombo($('#approvePerson'), {
			                comboType: 'employee',
			                editable: true
			            });	
					}
				}).show();		
			});
			//驳回上级，驳回发起人
			$('#rejectUp, #rejectEnd').on('click', function() {
				dialog({
					width: 250,
					class: 'reject-dialog',
					title: '驳回原因',
					content: '<textarea id="rejectReson" class="rejectReson">请输入驳回原因</textarea>',
					button: [{
							value: '确认',
							callback: function() {
								var $dialog = $(this.node);
									
							}
						},{
							class: 'btn-default',
							value: '取消'
						} 
					]	
				}).show();		
			});
		}
	};

	exports.init = function() {
		reimdetail.init();
	};
});