define(function(require, exports, module) {
    var Combo = require('combo');
    var dropdown = require('dropdown');
    var laydate = require('laydate');
    var grid = require('grid');

    var searchUrl = '/test/warehouse/supplierrefund.json';//'http://ver2-5.chupinxiu.com/web/expense/ajaxStoreInList';//

    var supplierrefund = {
        init: function() {
            var self = this;

            $('#reimNumber').placeholder();
            $('#relationSn').placeholder();
            self.initCombo();//初始化下拉框
            self.initDropDown();//初始化更多查询条件
            self.initTable();//初始化表格
            self.initEvent();
        },
        initCombo: function() {
            var self = this;
            self.supplier = Business.publicCombo($('#supplier'), {
                defaultSelected: 0,
                comboType: 'supplier',
                callbackfn: self.changeType
            });

        },
        initDropDown: function() {
            var self = this;

            dropdown('#msCnd', {
                template: '<div class="form-group control-group">' +
                '<label class="control-label">退货类型:</label>' +
                '<div class="controls">' +
                '<div class="control">' +
                '<span class="ui-combo-wrap" id="refundKind">' +
                '<input type="text" class="input-txt" autocomplete="off" data-ref="date">' +
                '<i class="trigger"></i>' +
                '</span>' +
                '</div>' +
                '</div>' +
                '</div>' +'<div class="form-group control-group">' +
                '<label class="control-label">创建时间:</label>' +
                '<div class="controls">' +
                '<div class="control">' +
                '<div class="calender-control">' +
                '<input class="calender-data date-img" id="start" type="text" readonly>' +
                '<span>至</span>' +
                '<input class="calender-data date-img" id="end" type="text" readonly>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>',
                callbackConfirm: function(obj) {
                    self.reloadTable();
                },
                afterInit: function(obj) {
                    var start = {elem: '#start', choose: function(datas) {end.min = datas; }};
                    var end = {elem: '#end', choose: function(datas) {start.max = datas; }};

                    laydate(start);
                    laydate(end);
                    self.refundKind = Business.publicCombo($('#refundKind'), {
                        defaultSelected: 0,
                        comboType: 'refundKind'
                    });
                }
            });
        },
        initTable: function() {
            var self = this;
            var height = Public.setGrid().height; //表格高度
            var columns = [
                //{display: '序号', name: 'sn'},
                {display: '操作', name: 'operate', width: 60, render: self.operateFormatter},
                {display: '业务时间', name: 'date'},
                {display: '单号', name: 'expenseSn',width:150},
                {display: '关联单据', name: 'preExpenseSn',width:150},
                {display: '退货类型', name: 'typeName'},
                {display: '小计', name: 'pCount',
                                totalSummary:
                                        {
                                             type:'sum'
                                        }
                
                },
                {display: '供应商', name: 'supplierName'},
                {display: '状态', name: 'statusValue'}
            ];
            //需要合计

            self.grid = $("#maingrid").ligerGrid({
                height: '100%',
                url: searchUrl,
                parms: self.getSearchData(),
                contentType: 'json',
                method: 'get',
                columns: columns,
                //改变数据源的值
                root: 'list',
                record: 'total'
            });
        },
        initEvent: function() {
            var self = this;

            self.initTableEvent();
            $('#search').on('click', function() {
                self.reloadTable();
            });
            $('#createZero').on('click', function() {
                parent.tab.addTabItem({
                    tabid: 'reimbursement-createreim',
                    text: '发起报销',
                    url: '/page/reimbursement/createreim.html'
                });
            });
            $('#createStoreIn').on('click', function() {
                parent.tab.addTabItem({
                    tabid: 'reimbursement-createreim',
                    text: '发起报销',
                    url: '/page/reimbursement/createreim.html'
                });
            });
        },
        initTableEvent: function() {
            $('.grid-wrap').on('click', '.ui-icon-detail', function() {
                var id = $(this).parent().data('id');

                parent.tab.addTabItem({
                    tabid: 'warehouse-funddetail',
                    text: '退货详情',
                    url: '/page/warehouse/refund/funddetail.html?random='+Math.random()
                });
            });
        },
        reloadTable: function() {
            var self = this;
            var searchData = this.getSearchData();

            self.grid.loadServerData(searchData);

        },
        changeType: function(obj) {},
        operateFormatter: function(obj) {
            return '<div class="operating" data-id="'+obj.expenseSn+'"><span class="ui-icon ui-icon-detail" title="查看"></span></div>';
        },
        getSearchData: function() {
            var self = this;
            return {
                supplier: self.supplier.getValue(),
                refundKind: self.refundKind.getValue(),

                reimNumber: '请输入单号' == $('#reimNumber').val() ? '' : $('#reimNumber').val(),
                relationSn: '请输入关联单号' == $('#relationSn').val() ? '' : $('#relationSn').val(),
                start: $('#start').val(),
                end: $('#end').val()
            }
        }
    };

    exports.init = function() {
        supplierrefund.init();
    }
});