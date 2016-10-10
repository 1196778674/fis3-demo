define(function (require, exports, module) {	
	var Common = require('common');
	var Numeral = require('numeral');

    var refundUrl = "/web/expense/ajaxCreateRefund";

	var purchasestoragein = {
		init: function() {
			var self = this;

			$('.adm-input').numeral({'scale': 2});
			self.initCalculate();
			$('body').on('click', '.del', function() {
        		$(this).parents('tr').remove();
        	});	
        	$('#beRefund').on('click', function(){
                var $refundForm = $("#refundForm");

        		if(!self.checkMaterialDes()) { return false; }
                Common.showTips('是否确认退货', function() {
                    Common.cpxAjax({
                        url: refundUrl,
                        type: 'POST',
                        parms: $refundForm.serialize(),
                        successfn: function(data) {
                            window.location.href = '/web/expense/funddetail?expenseSn='+data.expenseSn+'&type='+data.type;
                        }
                    });
                });
            });
		},
		checkMaterialDes: function() {
        	var self = this;
        	var $addMaterielList = $('.addMaterielList');
        	var $trs = $addMaterielList.find('tr');
        	var desFlag = true;

        	$.each($trs, function(index, tr) {
        		var $tr = $(tr);
        		var $unitPrice = $tr.find('.unitPrice'), $refundAmount = $tr.find('.refundAmount');
        		var name =$tr.find('.name').val(), lg = $tr.find('.lg').val();

        		if($unitPrice.val() == '') {
        			self.showTips(name+ ' 的退货价格不能为空');
        			desFlag = false;
        			return false;	
        		}
        		if($refundAmount.val() == '') {
        			self.showTips(name+ ' 的退货数量不能为空');
        			desFlag = false;
        			return false;	
        		}
        		if(Number($refundAmount.val()) > Number(lg)) {
        			self.showTips(name+ ' 的退货数量不能大于入库数量');
        			desFlag = false;
        			return false;
        		}
        	});
        	return desFlag;
        },
        showTips: function(txt) {
			new dialog({
				width: 300,
				title: '提示信息',
				content: txt,
				button: [ {value: '确定'} ]	
			}).show();
		},
		initCalculate: function() {
			var self = this;
			var $admInput = $('.adm-input');		

			$admInput.each(function(index, el) {
				var $el = $(el);

				Common.calculate($el);
			});
		}
	};
	
	exports.init = function() {
		purchasestoragein.init();		
	};
});