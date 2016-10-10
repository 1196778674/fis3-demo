define(function(require, exports, module) {
    var Combo = require('combo');
    var dropdown = require('dropdown');
    var dialog = require('dialog');
    var laydate = require('laydate');
    var grid = require('grid');

    var searchUrl = '/test/reim/rpstatistics.json';

    var rpstatistics = {
        init: function() {
            var self = this;
            self.initCombo();//初始化下拉框
            self.initDropDown();//初始化更多查询条件
            self.initTable();//初始化表格
            self.initEvent();
        },
        initCombo: function() {
            var self = this;
            self.createPersonCombo = Business.publicCombo($('#createPerson'), {
                comboType: 'employee',
                editable: true
            });
           self.supplierCombo = Business.publicCombo($('#supplier'), {
                comboType: 'supplier',
                editable: true
            });
            self.reimTypeCombo = Business.publicCombo($('#reimType'), {
                comboType: 'reimType',
                editable: true
            });

        },
        initDropDown: function() {
            var self = this;

            dropdown('#msCnd', {
                template:'<div class="form-group control-group">' +
                                '<label class="control-label">时间范围:</label>' +
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

                }
            });
        },
        initTable: function() {
            var self = this;
            var height = Public.setGrid().height; //表格高度
            var columns = [
               {display: '创建人', name: 'createdAtUserName'},
                {display: '供应商', name: 'supplierName'},
                {display: '报销类型', name: 'typeName'},
                {display: '应付(元)', name: 'amountTotal'},
                {display: '已付(元)', name: 'amountPaid'}, 
                  {display: '未付(元)', name: 'nonpayment'},             
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
            $('#export').on('click', function() {
                   
            });

        },
        initTableEvent: function() {
            $('.grid-wrap').on('click', '.ui-icon-detail', function() {
                var id = $(this).parent().data('id');
     
            });
        },
        reloadTable: function() {
            var self = this;
            var searchData = this.getSearchData(); 
            
            self.grid.loadServerData(searchData);
                
        },
        changeType: function(obj) {},

        getSearchData: function() {
            var self = this;
            return {
                createPerson: self.createPersonCombo.getValue(),
                supplier: self.supplierCombo.getValue(),
                reimType: self.reimTypeCombo.getValue(),
                
                start: $('#start').val(),
                end: $('#end').val()    
            };
        }
    };

    exports.init = function() {
        rpstatistics.init();
    };
});