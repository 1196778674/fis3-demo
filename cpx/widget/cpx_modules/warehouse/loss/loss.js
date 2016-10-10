define(function(require, exports, module) {
    var Combo = require('combo');
    var dropdown = require('dropdown');
    var dialog = require('dialog');
    var laydate = require('laydate');
    var grid = require('grid');

    var searchUrl = '/test/reim/loss.json';

    var loss = {
        init: function() {
            var self = this;
            $('#lossNumber').placeholder();
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
            self.approvePersonCombo = Business.publicCombo($('#approvePerson'), {
                comboType: 'employee',
                editable: true
            });



        },
        initDropDown: function() {
            var self = this;

            dropdown('#msCnd', {
                template:'<div class="form-group control-group">'+
                '<label class="control-label">状态:</label>'+
                '<div class="controls">'+
                    '<div class="control">'+
                        '<span class="ui-combo-wrap" id="lossStatus">'+
                            '<input type="text" class="input-txt" autocomplete="off" data-ref="date">'+
                            '<i class="trigger"></i>'+
                        '</span>'+
                    '</div>'+
                '</div>'+
            '</div>'+
            '<div class="form-group control-group">'+
                '<label class="control-label">损耗类型:</label>'+
                '<div class="controls">'+
                    '<div class="control">'+
                        '<span class="ui-combo-wrap" id="lossType">'+
                            '<input type="text" class="input-txt" autocomplete="off" data-ref="date">'+
                            '<i class="trigger"></i>'+
                        '</span>'+
                    '</div>'+
               ' </div>'+
          '  </div>'+
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
                                self.lossStatusCombo = Business.publicCombo($('#lossStatus'), {
                comboType: 'lossStatus',
                editable: true
            });
                        self.lossTypeCombo = Business.publicCombo($('#lossType'), {
                comboType: 'lossType',
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
                {display: '创建时间', name: 'createdAt'},
                {display: '单号', name: 'expenseSn'},
                {display: '关联单据', name: 'relationExpense'},
                {display: '损耗类型', name: 'lossType'}, 
                {display: '创建人', name: 'createUserName'},    
                 {display: '审批人', name: 'nextUserName'},
                  {display: '状态', name: 'statusModel.statusName'}
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
                    text: '发起门店损耗',
                    url: '/page/warehouse/loss/createloss.html'  
                });
            }); 

        },
        initTableEvent: function() {
            $('.grid-wrap').on('click', '.ui-icon-detail', function() {
                var id = $(this).parent().data('id');
                                parent.tab.addTabItem({
                    tabid: 'purchase-podetail',
                    text: '损耗详情',
                    url: '/page/warehouse/loss/lossinfo.html?random='+Math.random() 
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
                createPerson: self.createPersonCombo.getValue(),
                approvePerson: self.approvePersonCombo.getValue(),
                lossStatus: self.lossStatusCombo.getValue(),
                lossType: self.lossTypeCombo.getValue(),
                
                lossNumber: '请输入单号' == $('#lossNumber').val() ? '' : $('#lossNumber').val(),
                start: $('#start').val(),
                end: $('#end').val()    
            };
        }
    };

    exports.init = function() {
        loss.init();
    };
});