define(function (require, exports, module) {
    var printf = require('printf');
    var Common = require('common');
	var storageoutdetail = {
		init: function() {
				
		}
	};
	
	exports.init = function() {
		storageoutdetail.init();		
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
        
        
        //乔石涛：出库单删除ajax
$('#deleteExpense').on('click',function(){
     var expenseSn=$('.exp').val();
    Common.showTips('是否确认删除该单据？删除后数据将失效！', function() {
     Common.cpxAjax({
                        url: '/web/expense/deleteOutBoundOrder',
                        type:"get",
                        parms: {expenseSn:expenseSn},
                        successfn: function(data) {
                            //如果成功返回数据的话则跳转到该地址
                            window.location.href = '/web/expense/storageout';
                        }
                    });
            });
    
//    
//     if(confirm("是否确认删除该单据？删除后数据将失效！")){
//         var expenseSn=$('.exp').val();
//         $.get('deleteOutBoundOrder',{expenseSn:expenseSn},function(data){
//             //alert(data);
//            // location.href="storageout";
//             
//         })
//     }else{
//         alert('不能删除')
//     }
    
});



});