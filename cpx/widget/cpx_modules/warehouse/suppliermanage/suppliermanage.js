define(function(require, exports, module) {
    var Combo = require('combo');
    var dropdown = require('dropdown');
    var dialog = require('dialog');
    var laydate = require('laydate');
    var grid = require('grid');

    var searchUrl = '/test/reim/suppliermanage.json';

    var suppliermanage = {
        init: function() {
            var self = this;

            $('#supplierName').placeholder();
            self.initCombo();//初始化下拉框
            self.initDropDown();//初始化更多查询条件
            self.initTable();//初始化表格
            self.initEvent();
        },
        initCombo: function() {
            var self = this;
            

            self.businessContactCombo = Business.publicCombo($('#businessContact'), {
                comboType: 'businessContact',
                editable: true
            });
                        self.supplyCategoryCombo = Business.publicCombo($('#supplyCategory'), {
                comboType: 'supplyCategory',
                editable: true
            });

        },
        initDropDown: function() {
            var self = this;

            dropdown('#msCnd', {
                template:'<div class="form-group control-group">'+
                '<label class="control-label">供应商状态:</label>'+
               ' <div class="controls">'+
                   ' <div class="control">'+
                        '<span class="ui-combo-wrap" id="supplierStatus">'+
                            '<input type="text" class="input-txt" autocomplete="off" data-ref="date">'+
                            '<i class="trigger"></i>'+
                       ' </span>'+
                    '</div>'+
                '</div>'+
            '</div>'+
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
                self.supplierStatusCombo = Business.publicCombo($('#supplierStatus'), {
                defaultSelected: 0,
                comboType: 'supplierStatus',
                callbackfn: self.changeType
            });
                }
            });
        },
        initTable: function() {
            var self = this;
            var height = Public.setGrid().height; //表格高度
            var columns = [
                 {display: '操作', name: 'operate', width: 60, render: Public.billsOper},
                {display: '物料编号', name: 'materialSn'},
                {display: '供应商名称', name: 'name'},
                {display: '供应类别', name: 'categoryString'},
                {display: '联系人', name: 'contact'},
                {display: '创建人', name: 'createdAtUserName'},
                {display: '状态', name: 'typeVal'},
            ];
                
            self.grid = $("#maingrid").ligerGrid({
                 checkbox:true,
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
            $('#import').on('click', function() {
                //self.reloadTable();   
            });
            $('#add').on('click', function() {
                    				dialog({
					width: 300,
					class: 'add-dialog',
					title: '物料添加/编辑',
					content: '<div class="add-material-dialog">' +
						        '<div class="cpx-form">' +
                                                                                                         '<div class="form-group control-group">'+
                                                                                                        '<label class="control-label">物料编号:</label>'+
                                                                                                        '<div class="controls">'+
                                                                                                            '<div class="control">'+
                                                                                                                '<input type="text" class="form-control input-ph" id="materialSn" value="请输入物料编号">'+
                                                                                                           ' </div>'+
                                                                                                       ' </div>'+
                                                                                                   ' </div>'+
                                                                                                        '<div class="form-group control-group">'+
                                                                                                        '<label class="control-label">物料名称:</label>'+
                                                                                                        '<div class="controls">'+
                                                                                                            '<div class="control">'+
                                                                                                                '<input type="text" class="form-control input-ph" id="materialName" value="请输入物料名称">'+
                                                                                                           ' </div>'+
                                                                                                       ' </div>'+
                                                                                                   ' </div>'+
                                                                                                     '<div class="form-group control-group">'+
                                                                                                           ' <label class="control-label">主单位:</label>'+
                                                                                                            '<div class="controls">'+
                                                                                                               ' <div class="control">'+
                                                                                                                    '<span class="ui-combo-wrap" id="untiName">'+
                                                                                                                        '<input type="text" class="input-txt" autocomplete="off" data-ref="date">'+
                                                                                                                        '<i class="trigger"></i>'+
                                                                                                                    '</span>'+
                                                                                                               ' </div>'+
                                                                                                            '</div>'+
                                                                                                       ' </div>'+
                                                                                                            '<div class="form-group control-group">'+
                                                                                                           ' <label class="control-label">一级类别:</label>'+
                                                                                                            '<div class="controls">'+
                                                                                                               ' <div class="control">'+
                                                                                                                    '<span class="ui-combo-wrap" id="firstCategory">'+
                                                                                                                        '<input type="text" class="input-txt" autocomplete="off" data-ref="date">'+
                                                                                                                        '<i class="trigger"></i>'+
                                                                                                                    '</span>'+
                                                                                                               ' </div>'+
                                                                                                            '</div>'+
                                                                                                       ' </div>'+
                                                                                                           '<div class="form-group control-group">'+
                                                                                                           ' <label class="control-label">二级类别:</label>'+
                                                                                                            '<div class="controls">'+
                                                                                                               ' <div class="control">'+
                                                                                                                    '<span class="ui-combo-wrap" id="secondCategory">'+
                                                                                                                        '<input type="text" class="input-txt" autocomplete="off" data-ref="date">'+
                                                                                                                        '<i class="trigger"></i>'+
                                                                                                                    '</span>'+
                                                                                                               ' </div>'+
                                                                                                            '</div>'+
                                                                                                       ' </div>'+
                                                                                                          '<div class="form-group control-group">'+
                                                                                                           ' <label class="control-label">辅单位:</label>'+
                                                                                                            '<div class="controls">'+
                                                                                                               ' <div class="control">'+
                                                                                                                    '<span class="ui-combo-wrap" id="viceUnitName">'+
                                                                                                                        '<input type="text" class="input-txt" autocomplete="off" data-ref="date">'+
                                                                                                                        '<i class="trigger"></i>'+
                                                                                                                    '</span>'+
                                                                                                               ' </div>'+
                                                                                                            '</div>'+
                                                                                                       ' </div>'+
						 '<div class="form-group control-group">'+
                                                                                                        '<label class="control-label">规格(选填):</label>'+
                                                                                                        '<div class="controls">'+
                                                                                                            '<div class="control">'+
                                                                                                                 '<textarea class="specification-res"></textarea>' +
                                                                                                           ' </div>'+
                                                                                                       ' </div>'+
                                                                                                   ' </div>'+ 
						        '</div>' +
						    '</div>',
                                                                                                button: [{
                                                                                                        value: '确认',
                                                                                                        callback: function() {
                                                                                                                //回调逻辑
                                                                                                        }
                                                                                                },{
                                                                                                        class: 'btn-default',
                                                                                                        value: '取消'
                                                                                                }],
                                                                                                init: function() {
                                                                                                        var $dialog = $(this.node);
                                                                                                         $('#materialSn').placeholder();
                                                                                                         $('#materialName').placeholder();
                                                                                                        $('.specification-res').placeholder();
                                                                                                        untiNameCombo = Business.publicCombo($('#untiName'), {
                                                                                                                    comboType: 'unit',
                                                                                                                    editable: true
                                                                                                         });	
                                                                                                          firstCategoryCombo = Business.publicCombo($('#firstCategory'), {
                                                                                                                    comboType: 'category',
                                                                                                                    editable: true
                                                                                                         });
                                                                                                          secondCategoryCombo = Business.publicCombo($('#secondCategory'), {
                                                                                                                    comboType: 'category',
                                                                                                                    editable: true
                                                                                                         });
                                                                                                          viceUnitNameCombo = Business.publicCombo($('#viceUnitName'), {
                                                                                                                    comboType: 'viceUnit',
                                                                                                                    editable: true
                                                                                                         });
                                                                                                }
                                                                                            }).show();
            });   
            $('#delete').on('click', function() {
                    
            }); 
        },
        initTableEvent: function() {
            $('.grid-wrap').on('click', '.ui-icon-detail', function() {
                var id = $(this).parent().data('id');
                
                parent.tab.addTabItem({
                    tabid: 'purchase-podetail',
                    text: '采购详情',
                    url: '/page/purchase/podetail.html?random='+Math.random() 
                });        
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
                businessContact: self.businessContactCombo.getValue(),
                supplyCategory: self.supplyCategoryCombo.getValue(),
                supplierStatus: self.supplierStatusCombo.getValue(),
                
                supplierName: '请输入供应商名称' == $('#supplierName').val() ? '' : $('#supplierName').val(),
                start: $('#start').val(),
                end: $('#end').val()    
            }
        }
    };

    exports.init = function() {
        suppliermanage.init();
    };
});