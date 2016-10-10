define(function (require, exports, module) {

	var balancedetail = {
		init: function() {
			var self = this;

            $('.invfold').on('click', function() {
                var $this = $(this), 
                    id = $this.attr('id'), thisClass = $this.attr('class');

                var $time = $('.'+id), $timeSpan = $time.find('.fold'), dataTime = $timeSpan.data('time'); //日
                var $order = $('.'+dataTime), $orderSpan = $order.find('.fold'), orderId = $orderSpan.attr('id');//订单
                var $orderList = $('.'+orderId); //订单列表


                $orderList.hide();
                $order.hide();
                $orderSpan.removeClass('foldless');
                $timeSpan.removeClass('foldless');
                if(thisClass.indexOf('foldless') == -1) {//展开操作   
                    $time.show();
                    $this.addClass('foldless');
                }else{//关闭操作
                    $time.hide();
                    $this.removeClass('foldless');     
                }
            });

            $('.timefold').on('click', function() {
                var $this = $(this), 
                    dataTime = $this.data('time'), thisClass = $this.attr('class');

                var $order = $('.'+dataTime), $orderSpan = $order.find('.fold'), orderId = $orderSpan.attr('id');//订单
                var $orderList = $('.'+orderId); //订单列表
                
                $orderList.hide();
                $orderSpan.removeClass('foldless');
                if(thisClass.indexOf('foldless') == -1) {//展开操作
                    $order.show();
                    $this.addClass('foldless');
                }else{
                    $order.hide();
                    $this.removeClass('foldless');
                }
            });

            $('.orderfold').on('click', function() {
                var $this = $(this), 
                    id = $this.attr('id'), thisClass = $this.attr('class');

                var $orderList = $('.'+id); //订单列表
                
                if(thisClass.indexOf('foldless') == -1) {//展开操作
                    $orderList.show();
                    $this.addClass('foldless');
                }else{
                    $orderList.hide();
                    $this.removeClass('foldless');
                }
            });
		}
	};

	exports.init = function() {
		balancedetail.init();	
	}
});