define(function(require, exports, module) {
    var Combo = require('combo');
    var dropdown = require('dropdown');
    var dialog = require('dialog');
    var grid = require('grid');

    var searchUrl = '/test/reim/departmentledger.json';

    var departmentledger = {
        init: function() {
            var self = this;
            self.initCombo();//初始化下拉框
            self.initDropDown();//初始化更多查询条件
            self.initTable();//初始化表格
            self.initEvent();
        },
        initCombo: function() {
            var self = this;
            self.businessPeriodCombo = Business.publicCombo($('#businessPeriod'), {
                comboType: 'businessPeriod',
                editable: true
            });

            self.departmentCombo = Business.publicCombo($('#department'), {
                comboType: 'department',
                editable: true
            });
                        self.materialNameCombo = Business.publicCombo($('#materialName'), {
                comboType: 'material',
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
                {display: '物料名称', name: 'materialName'},
                {display: '类别', name: 'firstCategoryName'},
                {display: '规格', name: 'specifications'},
                {display: '初期', columns:[
                      {display: '数量', name: 'beginAmount'}, 
                      {display: '金额/元', name: 'beginNumber'}
                        
                ]},
                {display: '领用', columns:[
                      {display: '数量', name: 'use_count'}, 
                      {display: '金额/元', name: 'use_amount'}
                        
                ]},
            {display: '回库', columns:[
                      {display: '数量', name: 'back_count'}, 
                      {display: '金额/元', name: 'back_amount'}
                        
                ]},
            {display: '调拨入库', columns:[
                      {display: '数量', name: 'importAmount'}, 
                      {display: '金额/元', name: 'importNumber'}
                        
                ]},
            {display: '调拨出库', columns:[
                      {display: '数量', name: 'exportAmount'}, 
                      {display: '金额/元', name: 'exportNumber'}
                        
                ]},
            {display: '消耗', columns:[
                      {display: '数量', name: 'consume_count'}, 
                      {display: '金额/元', name: 'consume_amount'}
                        
                ]},
                {display: '期末', columns:[
                      {display: '数量', name: 'endAmount'}, 
                      {display: '金额/元', name: 'endNumber'}      
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
                department: self.departmentCombo.getValue(),
                businessPeriod: self.businessPeriodCombo.getValue(),
            }
        }
    };

    exports.init = function() {
        departmentledger.init();
    };
});