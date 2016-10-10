define(function(require, exports, module) {
    var Combo = require('combo');
    var dropdown = require('dropdown');
    var laydate = require('laydate');
    var grid = require('grid');

    var searchUrl = '/test/autocompleter.json';

    var storeinventory = {
        init: function() {
            var self = this;

            $('#materialName, #materialCode').placeholder();
            self.initCombo();//初始化下拉框
            self.initTable();//初始化表格
            self.initEvent();
        },
        initCombo: function() {
            var self = this;

            self.firstCategoryCombo = Business.publicCombo($('#firstCategory'), {
                comboType: 'firstCategory',
                editable: true
            });
            self.secondCategoryCombo = Business.publicCombo($('#secondCategory'), {
                comboType: 'firstCategory',
                editable: true
            });
        },
        initTable: function() {
            var self = this;
            var height = Public.setGrid().height; //表格高度
            var columns = [
                {display: '物料编码', name: 'materialSn'},
                {display: '物料名称', name: 'name'},
                {display: '规格', name: 'specification', align: 'left'},
                {display: '类别', name: 'category', render: self.category},
                {display: '登记数量', name: 'mount', width: 100, align: 'right', type: 'numberbox', editor: {type: 'numberbox', precision: 2}},
                {display: '实际数量', name: 'amount', align: 'right'},
                {display: '单位', name: 'unitName'},
                {display: '盘盈', name: 'overage', width: 100, align: 'right'},
                {display: '盘亏', name: 'losses', width: 100, align: 'right'}
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
        },
        initTableEvent: function() {
            
        },
        reloadTable: function() {
            var self = this;
            var searchData = this.getSearchData();

            self.grid.loadServerData(searchData);

        },
        changeType: function(obj) {},
        category: function(rowdata, rowindex, value) {
            return rowdata.firstCategory + '(' + rowdata.secondCategory + ')';
        },
        getSearchData: function() {
            var self = this;
            return {
                materialName: '请输入物料名称' == $('#materialName').val() ? '' : $('#materialName').val(),
                materialCode: '请输入物料编码' == $('#materialCode').val() ? '' : $('#materialCode').val(),
                firstCategory: self.firstCategoryCombo.getValue(),
                secondCategory: self.secondCategoryCombo.getValue()
            }
        }
    };

    exports.init = function() {
        storeinventory.init();
    }
});