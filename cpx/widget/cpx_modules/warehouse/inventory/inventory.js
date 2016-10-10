define(function (require, exports, module) {	
	var laydate = require('laydate');
	var pagiNation = require('pagination');
    var Common = require('common');
    var Dialog = require('dialog');

    var searchUrl = '/web/expense/checkList';
    var getInventoryPositionUrl = '/web/shop/departmentListForCheck';

    var InventoryPositon;
    var $inventoryList = $('#inventoryList'), $inventoryPagingControl = $('#inventoryPagingControl');
    var itHandlebar = require('./templates/inventorytable.handlebars');
    var newInventory = require('./templates/newinventory.handlebars');

	var inventory = {
		init: function() {
			var self = this;

            self.initInventoryTable();
            self.getInventoryPosition();
            $.divselect("#stateDiv", "#state", self.changeState);
            $.divselect("#createPersonDiv", "#createPerson");
            $.divselect("#approvePersonDiv", "#approvePerson");

            //日历====================
            var start = {
                elem: '#start',
                format: 'YYYY/MM/DD',
                min: '2015-10-01',
                max: '2099-06-16',
                choose: function(datas){
                     end.min = datas; //开始日选好后，重置结束日的最小日期
                     //end.start = datas //将结束日的初始值设定为开始日
                }
            };
            var end = {
                elem: '#end',
                format: 'YYYY/MM/DD',
                max: '2099-06-16',
                choose: function(datas){
                    start.max = datas; //结束日选好后，重置开始日的最大日期
                }
            };
            laydate(start);
            laydate(end);
            $('#searchinventory').on('click',function(){
                self.initInventoryTable();
            });
            window.document.onkeydown = function(event) {
                Common.enterKeyDownFn(event, $('#searchinventory'));
            }
            $('#initiate').on('click', function() {
                new dialog({
                    width: 220,
                    title: '创建盘点',
                    content: newInventory(),
                    class: 'ci-dialog',
                    button: [
                        {
                            value: '开始盘点',
                            callback: function() {
                                var $node = $(this.node);
                                var $createInventory = $node.find('#createInventory');
                                var $inventoryName = $node.find('#inventoryName');
                                var $inventoryPosition = $node.find('#inventoryPosition');
                                var $mdError = $node.find('#mdError');

                                if($inventoryName.val() == '') {
                                    $mdError.text('请输入盘点名称');
                                    return false;
                                }
                                if($inventoryPosition.val() == '') {
                                    $mdError.text('请选择盘点位置');
                                    return false;
                                }
                                $createInventory.submit();
                            }
                        }
                    ],
                    init: function() {
                        var $node = $(this.node);
                        var $inventoryPositon = $node.find('#inventoryPositon');
                        var $inventoryPositionVal = $node.find('#inventoryPositionVal');
                        var htm = '';

                        for(var i = 0; i < InventoryPositon.length; i++) {
                            var l = InventoryPositon[i];

                            htm += '<li><a class="fn-text-overflow" href="javascript:;" selectid="'+l.id+'">'+l.name+'</a></li>';
                        };
                        $inventoryPositon.append(htm);
                        $.divselect("#inventoryPositionDiv", "#inventoryPosition", function() {
                            var id = $('#inventoryPosition').val();

                            $.each(InventoryPositon, function(index, obj) {
                                if(obj.id == id) {
                                    $inventoryPositionVal.val(obj['name']);
                                    return false;
                                }
                            });

                        });
                    }       
                }).show();
            });
		},
        initInventoryTable: function() {
            var self = this;
            var sendData = self.getSearchData();

            Common.cpxAjax({
                url: searchUrl,
                parms: sendData,
                successfn: function(data) {
                    $inventoryPagingControl.html('');
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
                    var sendData = self.getSearchData();
                    sendData.currentPage = page;
                    Common.cpxAjax({
                        url: searchUrl,
                        parms: sendData,
                        successfn: function(data) {
                            $inventoryList.html(itHandlebar(data));
                        }               
                    });        
                } 
            };
            $inventoryPagingControl.bootstrapPaginator(options);
        },
        getSearchData: function() {
            return {
                status: $('#state').val(),
                type: 11,
                no: $('#no').val(),
                createPerson: $('#createPerson').val(),
                approvePerson: $('#approvePerson').val(),
                start: $('#start').val(),
                end: $('#end').val()            
            };
        },
        changeState: function(val) {
            var self = this;

            //$('#no, #createPerson, #approvePerson, #start, #end').val('');
            //$('#createPerson, #approvePerson').next().html('');
            inventory.initInventoryTable();
        },
        getInventoryPosition: function() {
            Common.cpxAjax({
                url: getInventoryPositionUrl,
                successfn: function(data) {
                    InventoryPositon = data;
                }
            });
        }
	};

	exports.init = function() {
		inventory.init();		
	};
});