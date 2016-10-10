define(function(require, exports, module) {
    var Combo = require('combo');
    var dropdown = require('dropdown');
    var dialog = require('dialog');
    var laydate = require('laydate');
    var grid = require('grid');

    var searchUrl = '/test/reim/pstidetail.json';

    var pstidetail = {
        init: function() {
            var self = this;
            self.initCombo();//初始化下拉框
            self.initDropDown();//初始化更多查询条件
            self.initTable();//初始化表格
            self.initEvent();
        },
        initCombo: function() {
            var self = this;
            self.materialNameCombo = Business.publicCombo($('#materialName'), {
                comboType: 'material',
                editable: true
            });
            self.supplierCombo = Business.publicCombo($('#supplier'), {
                comboType: 'supplier',
                editable: true
            });
           self.purchaseDepartmentCombo = Business.publicCombo($('#purchaseDepartment'), {
                comboType: 'department',
                editable: true
            });


        },
        initDropDown: function() {
            var self = this;

            dropdown('#msCnd', {
                template:'<div class="form-group control-group">'+
                '<label class="control-label">一级类别:</label>'+
                '<div class="controls">'+
                    '<div class="control">'+
                        '<span class="ui-combo-wrap" id="firstCategory">'+
                            '<input type="text" class="input-txt" autocomplete="off" data-ref="date">'+
                            '<i class="trigger"></i>'+
                        '</span>'+
                    '</div>'+
                '</div>'+
            '</div>'+
            '<div class="form-group control-group">'+
                '<label class="control-label">二级类别:</label>'+
                '<div class="controls">'+
                    '<div class="control">'+
                        '<span class="ui-combo-wrap" id="secondCategory">'+
                            '<input type="text" class="input-txt" autocomplete="off" data-ref="date">'+
                            '<i class="trigger"></i>'+
                        '</span>'+
                    '</div>'+
               ' </div>'+
          '  </div>'+
                        '<div class="form-group control-group">' +
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
                                self.firstCategoryCombo = Business.publicCombo($('#firstCategory'), {
                comboType: 'category',
                editable: true
            });
                        self.secondCategoryCombo = Business.publicCombo($('#secondCategory'), {
                comboType: 'category',
                editable: true
            });
                }
            });
        },
        initTable: function() {
            var self = this;
            var height = Public.setGrid().height; //表格高度
            var columns = [
                {display: '物料编号', name: 'materialSn'},
                {display: '物料名称', name: 'materialName'},
                {display: '类别', name: 'firstCategoryName'},
                {display: '规格', name: 'specification'}, 
                {display: '入库单号', name: 'expenseSn'},    
                 {display: '单价(元)', name: 'materialPrice'},
 
                  {display: '数量', name: 'materialRealCount'}, 
                  {display: '单位', name: 'materialUnitName'},
                  {display: '小计(元)', name: 'pCount'}, 
                  {display: '供应商', name: 'supplierName'}    
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
                firstCategory: self.firstCategoryCombo.getValue(),
                secondCategory: self.secondCategoryCombo.getValue(),
                materialName: self.materialNameCombo.getValue(),
                supplier: self.supplierCombo.getValue(),
                purchaseDepartment: self.purchaseDepartmentCombo.getValue(),
                start: $('#start').val(),
                end: $('#end').val()    
            };
        }
    };

    exports.init = function() {
        pstidetail.init();
    };
});