define(function(require, exports, module) {
    var Combo = require('combo');
    var dropdown = require('dropdown');
    var laydate = require('laydate');
    var grid = require('grid');

    var searchUrl = '/test/reim/secondcategorymanage.json';

    var secondcategorymanage = {
        init: function() {
            var self = this;

            $('#categoryName').placeholder();
            self.initCombo();//初始化下拉框
            self.initDropDown();//初始化更多查询条件
            self.initTable();//初始化表格
            self.initEvent();
        },
        initCombo: function() {
            var self = this;
            
            self.createPersonCombo = Business.publicCombo($('#createPerson'), {
                defaultSelected: 0,
                comboType: 'employee',
                callbackfn: self.changeType
            });
            self.firstCategoryCombo = Business.publicCombo($('#firstCategory'), {
                comboType: 'category',
                editable: true
            });

        },
        initDropDown: function() {
            var self = this;

            dropdown('#msCnd', {
                template: '<div class="form-group control-group">' +
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
 
                }
            });
        },
        initTable: function() {
            var self = this;
            var height = Public.setGrid().height; //表格高度
            var columns = [
                 {display: '操作', name: 'operate', width: 60, render: Public.billsOper},
                {display: '类别编号', name: 'categorySn'},
                {display: '类别名称', name: 'cid2_name'},
                {display: '所在一级类别', name: 'cid1_name'},
                {display: '创建时间', name: 'createdAt'},
                {display: '创建人', name: 'createdAtUserName'},

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
                root: 'categoryList'
            });
        },
        initEvent: function() {
            var self = this;

            self.initTableEvent();
            $('#search').on('click', function() {
                self.reloadTable();   
            });
            $('#add').on('click', function() {
                    
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
                firstCategory: self.firstCategoryCombo.getValue(),
                createPerson: self.createPersonCombo.getValue(),
                
                categoryName: '请输入类别名称' == $('#categoryName').val() ? '' : $('#categoryName').val(),
                start: $('#start').val(),
                end: $('#end').val()    
            }
        }
    };

    exports.init = function() {
        secondcategorymanage.init();
    };
});