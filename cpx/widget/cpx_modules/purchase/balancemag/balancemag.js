define(function(require, exports, module) {
    var Combo = require('combo');
    var dropdown = require('dropdown');
    var laydate = require('laydate');
    var grid = require('grid');

    var searchUrl = '/test/reim/balancemag.json';

    var balancemag = {
        init: function() {
            var self = this;

            $('#reimNumber').placeholder();
            self.initCombo();//初始化下拉框
            self.initDropDown();//初始化更多查询条件
            self.initTable();//初始化表格
            self.initEvent();
        },
        initCombo: function() {
            var self = this;

            self.reimTypeCombo = Business.publicCombo($('#reimType'), {
                defaultSelected: 0,
                comboType: 'reimType',
                callbackfn: self.changeType
            });
            self.supplierCombo = Business.publicCombo($('#supplier'), {
                comboType: 'supplier',
                editable: true
            });

        },
        initDropDown: function() {
            var self = this;

            dropdown('#msCnd', {
                template: '<div class="form-group control-group">' +
                                '<label class="control-label">创建人:</label>' +
                                '<div class="controls">' +
                                    '<div class="control">' +
                                        '<span class="ui-combo-wrap" id="createPerson">' +
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
            self.createPersonCombo = Business.publicCombo($('#createPerson'), {
                comboType: 'createPerson',
                editable: true
            });
                }
            });
        },
        initTable: function() {
            var self = this;
            var height = Public.setGrid().height; //表格高度
            var columns = [
                {display: '操作', name: 'operate', width: 60, render: self.operateFormatter},
                {display: '创建时间', name: 'date'},
                {display: '单号', name: 'expenseSn'},
                {display: '供应商', name: 'supplierName'},
                {display: '创建人', name: 'createdUserName'},
                {display: '状态', name: 'processStatusValue'},
               {display: '总金额/元', name: 'amountTotal', align: 'right'},
            ];

            self.grid = $("#maingrid").ligerGrid({
                height: '100%',
                url: searchUrl,
                parms: self.getSearchData(),
                contentType: 'json',
                method: 'get',
                columns: columns,
                //改变数据源的值
                root: 'list'
            });
        },
        initEvent: function() {
            var self = this;

            self.initTableEvent();
            $('#search').on('click', function() {
                self.reloadTable();
            });
            $('#create').on('click', function() {
                parent.tab.addTabItem({
                    tabid: 'purchase-createpurchase',
                    text: '发起',
                    url: '/page/purchase/createpurchase.html'
                });
            });
        },
        initTableEvent: function() {
            $('.grid-wrap').on('click', '.ui-icon-detail', function() {
                var id = $(this).parent().data('id');

                parent.tab.addTabItem({
                    tabid: 'purchase-balancedetail',
                    text: '结算详情',
                    url: '/page/purchase/balance/balancedetail.html?random='+Math.random()
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
                supplier: self.supplierCombo.getValue(),
                createPerson: self.createPersonCombo.getValue(),
                reimNumber: '请输入编号' == $('#reimNumber').val() ? '' : $('#reimNumber').val(),
                start: $('#start').val(),
                end: $('#end').val()
            }
        }
    };

    exports.init = function() {
        balancemag.init();
    }
});