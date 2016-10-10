define(function(require, exports, module) {
    var Combo = require('combo');
    var dropdown = require('dropdown');
    var laydate = require('laydate');
    var grid = require('grid');

    var searchUrl = '/test/warehouse/storagein.json';//'http://ver2-5.chupinxiu.com/web/expense/ajaxStoreInList';//

    var storagein = {
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

            self.reimTypeCombo = Business.publicCombo($('#storageInKind'), {
                defaultSelected: 0,
                comboType: 'storageInKind',
                callbackfn: self.changeType
            });
            self.storageInType = Business.publicCombo($('#storageInType'), {
                defaultSelected: 0,
                comboType: 'storageInType',
                callbackfn: self.changeType
            });
            //self.approvePersonCombo = Business.publicCombo($('#approvePerson'), {
            //    comboType: 'employee',
            //    editable: true
            //});
        },
        initDropDown: function() {
            var self = this;

            dropdown('#msCnd', {
                template: '<div class="form-group control-group">' +
                '<label class="control-label">供应商:</label>' +
                '<div class="controls">' +
                '<div class="control">' +
                '<span class="ui-combo-wrap" id="supplier">' +
                '<input type="text" class="input-txt" autocomplete="off" data-ref="date">' +
                '<i class="trigger"></i>' +
                '</span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="form-group control-group">' +
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
                    self.approveKindsCombo = Business.publicCombo($('#supplier'), {
                        defaultSelected: 0,
                        comboType: 'supplier'
                    });
                }
            });
        },
        initTable: function() {
            var self = this;
            var height = Public.setGrid().height; //表格高度
            var columns = [
                {display: '操作', name: 'operate', width: 60, render: self.operateFormatter},
                {display: '业务时间', name: 'date'},
                {display: '单号', name: 'expenseSn'},
                {display: '关联单据', name: 'preExpenseSn'},
                {display: '入库类型', name: 'expenseTypeValue'},
                {display: '供应商', name: 'supplierName'},
                {display: '状态', name: 'statusValue'}
            ];

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
                    tabid: 'warehouse-createstorein',
                    text: '新盘盈',
                    url: '/page/warehouse/storein/createstorein.html'
                });
            });
            $('#createStoreIn').on('click', function() {
                parent.tab.addTabItem({
                    tabid: 'warehouse-createstorein',
                    text: '新直接',
                    url: '/page/warehouse/storein/createstorein.html?cost=1'
                });
            });
        },
        initTableEvent: function() {
            $('.grid-wrap').on('click', '.ui-icon-detail', function() {
                var id = $(this).parent().data('id');

                parent.tab.addTabItem({
                    tabid: 'warehouse-detail',
                    text: '入库单详情',
                    //url: '/page/warehouse/storein/storeindetail.html?random='+Math.random()  //零成本入库单详情
                    url: '/page/warehouse/storein/purchasedetail.html?random='+Math.random()
                    //url: '/page/warehouse/storein/backdetail.html?random='+Math.random()
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
                approveType: self.reimTypeCombo.getValue(),
                storeInType: self.storageInType.getValue(),
                reimNumber: '请输入单号' == $('#reimNumber').val() ? '' : $('#reimNumber').val(),
                relationSn: '请输入关联单号' == $('#relationSn').val() ? '' : $('#relationSn').val(),
                start: $('#start').val(),
                end: $('#end').val()
            }
        }
    };

    exports.init = function() {
        storagein.init();
    }
});