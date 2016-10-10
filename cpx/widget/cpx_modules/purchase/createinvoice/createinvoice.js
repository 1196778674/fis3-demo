define(function (require, exports, module) {
	var Combo = require('combo');
	
    var searchUrl = '';

	var createinvoice = {
		init: function() {
			var self = this;

			$('#invoiceCode, #invoiceNum').placeholder();
            self.initCombo();//初始化下拉框
            
            self.initEvent();

            //判断是否是编辑  如果是编辑的话 直接初始化tableEvent
            //暂时先假设页面有数据
            self.initTableEvent();	
		},
		initCombo: function() {
            var self = this;
            
            self.supplierCombo = Business.publicCombo($('#supplier'), {
                comboType: 'supplier'
            });
        },
        initEvent: function() {
        	var self = this;

            $('#search').on('click', function() {
                self.initTable();    
            });
        },
        initTable: function() {
            var self = this;
            var $billMsg = $('#billMsg');
            var supplierId = self.supplierCombo.getValue();
                 
            if(supplierId == '') {
                parent.Public.tips({type: 2, content: '请选择供应商!'});
                return false;
            }
            Public.defaultAjax(
                searchUrl, 
                {
                    supplierId: supplierId,
                    start: $('#start').val(),
                    end: $('#end').val()
                }, 
                function(res) {
                    var data = res.data;
                    var tableHandlebar = __inline('./templates/table.handlebars');

                    if(data.list.length == 0) {
                        parent.Public.tips({type: 2, content: '暂无数据!!!'}); 
                        return false;   
                    }
                    $billMsg.html(tableHandlebar());
                    self.initTableEvent();
                }
            );
        },
        initTableEvent: function() {
            var self = this;
            var $totalM = $('#totalM');


            //全选
            $('.checkAll').on('click', function() {
                var $checkbox = $('input[type="checkbox"]');
                var total = 0;

                if($(this).is(':checked')) {
                    $checkbox.prop('checked', true); 
                    $('.money').each(function(index, el) {
                        total += Number($(el).text());
                    });   
                }else{
                    $checkbox.prop('checked', false);
                } 
                $totalM.html(total);
                self.calculateEveryOrderMoney();
            });
            //日
            $('.checkday').on('click', function() {
                if($(this).prop('checked') == true) {
                    $('.daycheck').prop('checked', true); 
                }else {
                    $('.daycheck').prop('checked', false);
                } 
                self.isCheckAll();
                self.calculateEveryOrderMoney();
                self.calculateAllMoney();   
            });
            //日->订单
            $('.checkpart').on('click', function() {
                var $this = $(this);
                var $parent = $this.parents('tr'), id = $parent.attr('id');

                if($this.prop('checked') == true) {
                    $('tr[data-id="'+id+'"]').find('.check').prop('checked', true);     
                }else {
                    $('tr[data-id="'+id+'"]').find('.check').prop('checked', false);    
                }   
                self.isCheckDay(id);
                self.isCheckAll();

                self.calculateOrderMoney(id);
                self.calculateAllMoney();
            });
            // 日->订单->物料
            $('.material').on('click', function() {
                var $this = $(this);
                var $parent = $this.parents('.orderlist'), id = $parent.data('id');

                self.isCheckOrder(id); 
                self.isCheckDay(id);
                self.isCheckAll();

                self.calculateOrderMoney(id);
                self.calculateAllMoney();
            });

            //展开折叠
            $('.fold').on('click', function() {
                var $this = $(this);
                var thisClass = $this.attr('class'),
                    $parent = $(this).parents('tr'),
                    id = $parent.attr('id');

                if(thisClass.indexOf('foldless') == -1) {
                    $('tr[data-id="'+id+'"]').show();
                    $this.addClass('foldless');    
                }else {
                    $('tr[data-id="'+id+'"]').hide();
                    $this.removeClass('foldless');
                }   
            });
            
            self.invoiceTypeCombo = Business.publicCombo($('#invoiceType'), {
                comboType: 'invoiceType'
            });

            $('#create').on('click', function() {
                //生成后续调试在调                   
            });
        },
        isCheckAll: function() {
            var $checkAll = $('.checkAll');
            var $checkDay = $('.checkday');
            var flag = true;

            $checkDay.each(function(index, el) {
                if(!$(el).is(':checked')) {
                    flag = false;
                    return false;
                }   
            });
            flag == true ? $checkAll.prop('checked', true) : $checkAll.prop('checked', false);
        },
        isCheckDay: function(id) {
            var $tbody = $('#'+id).parent('tbody');
            var $checkDay = $tbody.find('.checkday');
            var $checkPart = $tbody.find('.checkpart');
            var flag = true;

            $checkPart.each(function(index, el) {
                if(!$(el).is(':checked')) {
                    flag = false;
                    return false;
                }   
            });
            flag == true ? $checkDay.prop('checked', true) : $checkDay.prop('checked', false);
        },
        isCheckOrder: function(id) {
            var $orderCheckBox =  $('#'+id).find('input[type="checkbox"]');
            var $material = $('tr[data-id="'+id+'"]').find('input[type="checkbox"]');
            var flag = true;

            $material.each(function(index, el) {
                if(!$(el).is(':checked')) {
                    flag = false;
                    return false;
                }
            });
            flag == true ? $orderCheckBox.prop('checked', true) : $orderCheckBox.prop('checked', false);
        },
        calculateEveryOrderMoney: function() {
            $('.order').each(function(index, el) {
                var $orderM = $(el).find('.orderm span'), id = $(el).attr('id');
                var $curOrderMaterial = $('tr[data-id="'+id+'"]');
                var orderTotal = 0;

                $curOrderMaterial.each(function(i, e) {
                    var $mc = $(e).find('.check'), m = $(e).find('.money').text();
                    
                    if($mc.is(':checked')) {
                        orderTotal += Number(m);
                    }    
                });
                $orderM.html(orderTotal);
            });
        },
        calculateOrderMoney: function(id) {
            var $trOrder = $('#'+id), $orderTotal = $trOrder.find('.orderm span');
            var $material = $('tr[data-id="'+id+'"]').find('input[type="checkbox"]');
            var orderTotal = 0;

            $material.each(function(index, el) {
                var curM = $(el).parents('tr').find('.money').text();

                if($(el).is(':checked')) {
                    orderTotal += Number(curM);        
                }     
            });
            $orderTotal.html(orderTotal);
        },
        calculateAllMoney: function() {
            var $totalMoney = $('#totalM');
            var totalMoney = 0;
            var $order = $('.order');

            $order.each(function(index, el) {
                var orderTotal = $(el).find('.orderm span').text();
                
                totalMoney += Number(orderTotal);    
            });
            $totalMoney.html(totalMoney);
        }
	};

	exports.init = function() {
		createinvoice.init();
	};
});