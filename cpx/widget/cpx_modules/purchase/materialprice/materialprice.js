define(function(require, exports, module) {
    var Combo = require('combo');
    var dropdown = require('dropdown');
    var laydate = require('laydate');
    var grid = require('grid');

    var searchUrl = '/test/reim/materialprice.json';

    var materialprice = {
        init: function() {
            var self = this;

            $('#materialName').placeholder();
            self.initCombo();//初始化下拉框
            self.initDropDown();//初始化更多查询条件
            self.initTable();//初始化表格
            self.initEvent();
        },
        initCombo: function() {
            var self = this;
            
            self.firstCategoryCombo = Business.publicCombo($('#firstCategory'), {
                defaultSelected: 0,
                comboType: 'firstCategory',
                callbackfn: self.changeType
            });
            self.secondCategoryCombo = Business.publicCombo($('#secondCategory'), {
                comboType: 'secondCategory',
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
                        defaultSelected: 0,
                        comboType: 'createPerson'
                    });    
                }
            });
        },
        initTable: function() {
            var self = this;
            var height = Public.setGrid().height; //表格高度
            var columns = [
                {display: '操作', name: 'operate', width: 60, render: function(rowdata,rowindex,value){
                   var h = "";
                    if (!rowdata._editing)
                    {
                        h += "<a href='javascript:beginEdit(" + rowindex + ")'>修改</a> ";
                         
                    }
                    else
                    {
                        h += "<a href='javascript:endEdit(" + rowindex + ")'>提交</a> ";
                        
                    }
                    return h;
                        
                        
                }},
                {display: '物料编号', name: 'materialSn'},
                {display: '物料名称', name: 'name'},
                {display: '类别', name: 'firstCategoryName'},
                {display: '当前定价', name: 'price',editor: {type: 'text'}},
               {display: '前次定价', name: 'lastPrice', align: 'right'},
                {display: '计量单位', name: 'unitName'},
                {display: '启用', name: 'operate',render: self.operateFormatter},

                
            ];
                
            self.grid = $("#maingrid").ligerGrid({
                checkbox:true,
                height: '100%',
                url: searchUrl,
                parms: self.getSearchData(),
                contentType: 'json',
                method: 'get',
                enabledEdit: true,
                columns: columns,
                //改变数据源的值
                root: 'materialList'
            });
        },
        initEvent: function() {
            var self = this;

            self.initTableEvent();
            $('#search').on('click', function() {
                self.reloadTable();   
            });
            $('#enable').on('click', function() {
                //self.reloadTable();   
            });
            $('#disable').on('click', function() {
        
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
        operateFormatter: function(obj) {
           // return obj.isLock;
            if(obj.isLock){
                return '<span class="" title="已启用">已启用</span>';
            }else{
                return '<span class="" title="已停用">已停用</span>';
            }
            //return '<div class="operating" data-id="'+obj.expenseSn+'"><span class="ui-icon ui-icon-detail" title="查看"></span></div>';
        },
              beginEdit:function (rowid) { 
            materialprice.beginEdit(rowid);
        },  
        endEdit:function (rowid)
        {
            materialprice.endEdit(rowid);
        },
        getSearchData: function() {
            var self = this;
            return {
                firstCategory: self.firstCategoryCombo.getValue(),
                secondCategory: self.secondCategoryCombo.getValue(),
                createPerson: self.createPersonCombo.getValue(),
                materialName: '请输入物料名称' == $('#materialName').val() ? '' : $('#materialName').val(),
                start: $('#start').val(),
                end: $('#end').val()    
            }
        }
    };

    exports.init = function() {
        materialprice.init();
    }
});