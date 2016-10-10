define(function (require, exports, module) {	
	var Common = require('common');
	var Autocomplete = require('autocomplete');
	var Numeral = require('numeral');
    var printf = require('printf');

	var storageInUrl = '/web/expense/ajaxOperatorStoreIn';

	var $addMaterielList = $('#addMaterielList');
	
	var backstoragein = {
		init: function() {
			var self = this;

			$('.amount, .otherSurplus').numeral({'scale': 2});
			self.initCalculate();
			self.initPurchaseDes();	
			$('#beStorageIn,#beDirect,#beStorageFinish').on('click', function() {
                var $type = $('#type'), $this = $(this), tg = $this.data('tg');
				var $createstoreinForm = $('#createstoreinForm');

				if(!self.checkMaterialDes($addMaterielList)) { return false; }
                $type.val($this.data('type'));
                //console.log($this.data('type'));
				Common.showTips(tg, function() {
                    Common.cpxAjax({
                        url: storageInUrl,
                        type: 'POST',
                        parms: $createstoreinForm.serialize(),
                        successfn: function(data) {
                            window.location.href = '/web/expense/storeindetail?expenseSn='+data.expenseSn+"&provide="+data.provide;
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
		initPurchaseDes: function() {
			var self = this;
        	var psHandlebar = require('./templates/psdes.handlebars');

        	$('#addPurDes').on('click', function() {
    			if(!self.checkMaterialDes($addMaterielList)) { return false; }
    			$addMaterielList.append(psHandlebar());
    			$('.mQuery').parent().find('.amount').numeral({'scale': 2});
    			self.initAutocompleter();	
        	});
        	$('body').on('click', '.del', function() {
        		$(this).parents('tr').remove();
        	});	
		},
		initAutocompleter: function() {
        	var self = this;

        	$('.fQuery').autocompleter({
		        highlightMatches: true,
		        source: window.serverRoot+'/web/material/getMaterialListByQuery',
		        hint: true,
		        empty: false,
		        limit: 10,
		        template: '{{ name }} &nbsp;<span>{{ materialSn }}</span>',
		        callback: function (value, index, selected) {
		        	var $this = $(this),
		        		$preTd = $this.parents('td'),
		        		$preTr = $this.parents('tr');
		        	var $aI = $preTr.find('input.adm-input');

		        	$preTd.remove();
		        	$preTr.prepend('<td class="col-1">'+selected.id+'</td><td class="col-2">'+selected.name+'</td><td class="col-3">'+selected.specification+'</td>');
		        	$preTr.find('input.id').val(selected.id);
                    $preTr.find('input.unitName').val(selected.unitName);
		        	$preTr.find('td.col-6').text(selected.unitName);

                    $preTr.find('input.name').val(selected.name);
                    $preTr.find('input.unitPrice').val(selected.price);


		        	Common.calculate($aI);
		        	//辅单位
                    if(selected.otherUnitId != '0') {
                        var ohtm =  '<div class="otherunit">' +
                                        '<input type="text" class="otherSurplus" name="otherSurplus[]">' +
                                        '<span></span>' +
                                    '</div>'+
                                    '<input type="hidden" class="otherUnitName" name="otherUnitName[]">';
                        
                        $preTr.find('.tdotherunit').append(ohtm);
                        $preTr.find('.amount, .otherSurplus').numeral({'scale': 2});
                        $preTr.find('input.otherUnitName').val(selected.otherUnitName);
                        $preTr.find('td.tdotherunit span').text(selected.otherUnitName);
                    }else{
                    	$preTr.find('.tdotherunit').append('<input type="hidden" class="otherSurplus" name="otherSurplus[]"><input type="hidden" class="otherUnitName" name="otherUnitName[]">');
                    }
		        }
		    });
        },
		checkMaterialDes: function($dom) {
			var self = this;
			var $trs = $dom.find('tr');
			var desFlag = true;

			$.each($trs, function(index, tr) {
        		var $tr = $(tr);
        		var $mQuery = $tr.find('.mQuery'), 
        			$fQuery = $tr.find('.fQuery'), 
        			$amount = $tr.find('.amount'),
        			name = $tr.find('.col-2').text();

        		if($fQuery.val() == '') {
        			self.showTips('请填写物料信息');
        			desFlag = false;
        			return false;	
        		}
        		if($mQuery.length > 0) {
        			self.showTips('请正确填写物料信息');
        			desFlag = false;
        			return false;	
        		}
        		if($amount.val() == '' && $otherSurplus.val() == '') {
        			self.showTips('物料'+name+'的实收数量不能为空');
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
		backstoragein.init();		
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