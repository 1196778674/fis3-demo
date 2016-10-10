define(function (require, exports, module) {	
	var pagiNation = require('pagination');
    var Common = require('common');
    var Dialog = require('dialog');

    var searchUrl = '';

    var $inventoryList = $('#inventoryList'), $inventoryPagingControl = $('#inventoryPagingControl');
    var itHandlebar = require('./templates/invdetailtable.handlebars');

	var inventorydetail = {
		init: function() {
			var self = this;

			//self.initTable();	
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
		},
		initTable: function() {
			var self = this;

			Common.cpxAjax({
                url: searchUrl,
                successfn: function(data) {
                    $storagePagingControl.html('');
                    if(data.list.length == 0) { //code here materialList
                        $inventoryList.html('<tr><td colspan="8" class="no-datas">暂无数据</td></tr>');
                        return false;   
                    }
                    $inventoryList.html(itHandlebar(data));
                    if(data.totalPages > 1){
                        self.pagination(data);
                    }
                }               
            });	
		},
		pagination: function(parms) {
            var self = this;
            var options = {
                currentPage: 1,
                totalPages: parms.totalPages,
                onPageClicked: function(event, originalEvent, type, page) {
                    //var sendData = self.getSearchData();
                    sendData.currentPage = page;
                    Common.cpxAjax({
                        url: searchUrl,
                        //parms: sendData,
                        successfn: function(data) {
                            $inventoryList.html(itHandlebar(data));
                        }               
                    });        
                } 
            };
            $inventoryPagingControl.bootstrapPaginator(options);
        }
	};
	
	exports.init = function() {
		inventorydetail.init();		
	};
});