define(function (require, exports, module) {	
	var laydate = require('laydate');
	var pagiNation = require('pagination');
    var Common = require('common');

    var $approveType = $('#approveType'), 
        $tableList = $('#tableList'),
        $tabPagingControl = $('#tabPagingControl');

    var searchUrl = 'xxx';
    var tableHandlbar = require('./templates/table.handlebars');

	var storeallocation = {
        init: function() {
            var self = this;

        	$.divselect("#approveTypeDiv", "#approveType", self.changeApproveType);

            window.document.onkeydown = function(event) {
                Common.enterKeyDownFn(event, $('#searchBtn'));
            }
            self.initTable();
            //日历====================
            var start = {
                elem: '#start',
                format: 'YYYY/MM/DD',
                min: '2015-10-01',
                choose: function(datas){
                     end.min = datas; //开始日选好后，重置结束日的最小日期
                     //end.start = datas //将结束日的初始值设定为开始日
                }
            };
            var end = {
                elem: '#end',
                format: 'YYYY/MM/DD',
                choose: function(datas){
                    start.max = datas; //结束日选好后，重置开始日的最大日期
                }
            };
            laydate(start);
            laydate(end);
            $('#searchBtn').on('click', function() {
                self.initTable();    
            });	    
        },
        changeApproveType: function() {
            storeallocation.initTable();
        },
        initTable: function() {
            var self = this;
            var requestData = self.getSearchData();

            Common.cpxAjax({
                url: searchUrl,
                parms: requestData,
                successfn: function(data) {
                    $tabPagingControl.html('');
                    if(data.totalPages == 0) {
                        $tableList.html('<tr><td colspan="6" class="no-datas">暂无数据</td></tr>');
                        return false;
                    }
                    $tableList.html(tableHandlbar(data));
                    if(data.totalPages > 1) {
                        self.pagination(data);
                    }               
                }               
            });
        },
        pagination: function(parms) {
            var self = this;
            var options = {
                totalPages: parms.totalPages,   
                onPageClicked: function(event, originalEvent, type, page) {
                    var requestData = self.getSearchData();

                    requestData.currentPage = page;
                    Common.cpxAjax({
                        url: searchUrl,
                        parms: requestData,
                        successfn: function(data) {
                            $tableList.html(tableHandlbar(data));
                        }               
                    });                                    
                } 
            };
            $tabPagingControl.bootstrapPaginator(options);
        },
        getSearchData: function() {
            return {
                approveType: $approveType.val(),
                orderId: $('#orderId').val(),
                saName: $('#saName').val(),
                start: $('#start').val(),
                end: $('#end').val()    
            };
        }
    };

	exports.init = function() {
		storeallocation.init();		
	};
});