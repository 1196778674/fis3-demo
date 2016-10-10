define(function (require, exports, module) {	
	var Common = require('common');
    var printf = require('printf');


    var storageOutUrl = '/web/expense/ajaxDoOutWarehouse';

	var createstorageout = {
		init: function() {
			var self = this;
	
			$.divselect("#signPersonDiv", "#signPerson");
			self.initCalculate();
			$('#beStorageOut,#beDirect').on('click', function() {
                var $type = $('#type'), $this = $(this);
				var $signPerson = $('#signPerson');
				var type = $this.data('type');
				var tip = $this.data('tip');

                $createstoreinForm = $("#createstorageoutForm");
                $type.val(type);

				if(type == '28' && $signPerson.val() == '') {
					self.showTips('请选择签收人');
            		return false;	
				}
				if(!self.checkMaterialDes()) { return false; }

				Common.showTips(tip, function() {
                    Common.cpxAjax({
                        url: storageOutUrl,
                        type: 'POST',
                        parms: $createstoreinForm.serialize(),
                        successfn: function(data) {
                            window.location.href = '';
                        }               
                    });
                });
			});			
		},
		initCalculate: function() {
			var self = this;
			var $admInput = $('.adm-input');		

			$admInput.each(function(index, el) {
				var $el = $(el);

				Common.calculate($el);
			});
		},
		checkMaterialDes: function() {
			var self = this;
			var $trs = $('#addMaterielList').find('tr');
			var desFlag = true;

			$.each($trs, function(index, tr) {
        		var $tr = $(tr);
        		var $amount = $tr.find('.amount'),
        			name = $tr.find('.col-2').text();

        		if($amount.val() == '') {
        			self.showTips('物料'+name+'的实出数量不能为空');
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
		}
	};
	
	exports.init = function() {
		createstorageout.init();		
	};
    $('.print').on('click', function(e) {
        e.preventDefault();
        sn = $(this).data("sn");
        console.log(sn);

        printf({
            orderNo: sn,
            title: '审批单打印'
        });
    });
});