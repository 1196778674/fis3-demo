define(function(require, exports, module) {
    var Combo = require('combo');
    var dropdown = require('dropdown');
    var laydate = require('laydate');
    var grid = require('grid');

    var searchUrl = '/test/warehouse/stockwarn.json';

    var stockwarn = {
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
                defaultSelected: 0,
                comboType: 'firstCategory',
                callbackfn: self.changeType
            });
            self.secondCategoryCombo = Business.publicCombo($('#secondCategory'), {
                defaultSelected: 0,
                comboType: 'firstCategory'
            });
        },
        initTable: function() {
            var self = this;
            var height = Public.setGrid().height; //表格高度
            var columns = [
                {display: '操作', name: 'operate', width: 60, render: self.operateFormatter},
                {display: '物料编号', name: 'materialSn'},
                {display: '物料名称', name: 'name'},
                {display: '类别', name: 'firstCategory'},
                {display: '规格', name: 'specification'},
                {display: '库存量', name: 'surplus', align: 'right'},
                {display: '预警量', name: 'warningSurplus', align: 'right', type: 'numberbox', editor: {type: 'numberbox', precision: 2}},
                {display: '主单位', name: 'unitName'},
                {display: '辅单位', name: 'viceName', align: 'right', render: self.viceName}
            ];

            self.grid = $("#maingrid").ligerGrid({
                height: '100%',
                url: searchUrl,
                parms: self.getSearchData(),
                contentType: 'json',
                method: 'get',
                columns: columns,
                checkbox: true,
                rownumbers: false,
                enabledEdit: true,
                clickToEdit: false,
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
            $('.onlyCheckZero').on('click', function() {
                var $this = $(this), $i = $this.find('i');

                $i.toggleClass('checked');

            });
            $('.onlyCheckWarn').on('click', function() {
                var $this = $(this), $i = $this.find('i');

                $i.toggleClass('checked');
            });
        },
        initTableEvent: function() {
            var self = this;
            var grid = self.grid;


            $('.grid-wrap').on('click', '.ui-icon-pencil', function() {
                var $parent = $(this).parent();
                var id = $parent.data('id'),
                    rowindex = $parent.data('rowindex');

                grid.beginEdit(rowindex);
            });
            $('.grid-wrap').on('click', '.ui-icon-save', function() {
                var $parent = $(this).parent();
                var id = $parent.data('id'),
                    rowindex = $parent.data('rowindex');


                //这里写提交到后台的操作
                grid.endEdit(rowindex);
            });
        },
        reloadTable: function() {
            var self = this;
            var searchData = this.getSearchData();

            self.grid.loadServerData(searchData);

        },
        changeType: function(obj) {},
        operateFormatter: function(rowdata, rowindex, value) {
            if(!rowdata._editing) {
                return '<div class="operating" data-rowindex="'+rowindex+'" data-id="'+rowdata.materialSn+'"><span class="ui-icon ui-icon-pencil" title="编辑"></span></div>';
            }else{
                return '<div class="operating" data-rowindex="'+rowindex+'" data-id="'+rowdata.materialSn+'"><span class="ui-icon ui-icon-save" title="提交"></span></div>';
            }
        },
        viceName: function(obj) {
            var self = stockwarn;
            var htm = '';

            if(obj.viceUnitName) {//是否有辅助单位
                htm = obj.viceSurplus + obj.viceUnitName;
            }

            return htm;
        },
        getSearchData: function() {
            var self = this;
            return {
                materialName: '请输入单号' == $('#materialName').val() ? '' : $('#materialName').val(),
                materialCode: '请输入关联单号' == $('#materialCode').val() ? '' : $('#materialCode').val(),
                firstCategory: self.firstCategoryCombo.getValue(),
                secondCategory: self.secondCategoryCombo.getValue()
                
            }
        }
    };

    exports.init = function() {
        stockwarn.init();
    }
});