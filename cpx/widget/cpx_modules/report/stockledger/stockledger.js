define(function(require, exports, module) {
    var Combo = require('combo');
    var dropdown = require('dropdown');
    var dialog = require('dialog');
    
    var grid = require('grid');

    var searchUrl = '/test/reim/stockledger.json';

    var stockledger = {
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

            self.businessPeriodCombo = Business.publicCombo($('#businessPeriod'), {
                comboType: 'businessPeriod',
                editable: true
            });


        },
        initDropDown: function() {
            var self = this;

            dropdown('#msCnd', {
                template: '<div class="form-group control-group">'+
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
                '</div>'+
            '</div>',
                callbackConfirm: function(obj) {
                    self.reloadTable();
                },
                afterInit: function(obj) {

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
                {display: '物料名称', name: 'name'},
                {display: '类别', name: 'firstCategoryName'},
                {display: '规格', name: 'specifications'},
                {display: '初期', columns:[
                      {display: '数量', name: 'prime_count'}, 
                      {display: '单价/元', name: 'prime_unit_price'},
                      {display: '金额/元', name: 'prime_amount'}
                        
                ]},
                {display: '本期发生', columns:[
                      {display: '入库数量', name: 'current_period_storage_count'}, 
                      {display: '单价/元', name: 'current_period_storage_unit_price'},
                      {display: '入库金额/元', name: 'current_period_storage_amount'},
                      {display: '出库数量', name: 'current_period_outbound_count'}, 
                      {display: '单价/元', name: 'current_period_outbound_unit_price'},
                      {display: '出库金额/元', name: 'urrent_period_outbound_amount'}
                        
                ]},
                {display: '期末结存', columns:[
                      {display: '数量', name: 'final_count'}, 
                      {display: '单价/元', name: 'final_unit_price'},
                      {display: '金额/元', name: 'final_amount'}
                        
                ]}
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
                businessPeriod: self.businessPeriodCombo.getValue()
            }
        }
    };

    exports.init = function() {
        stockledger.init();
    };
});