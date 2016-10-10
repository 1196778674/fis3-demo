define(function (require, exports, module) {
    var Combo = require('combo');
    var grid = require('grid');
    var textbox = require('textbox');
    var Uploader = require('upload');
    var dialog = require('dialog');
    var laydate = require('laydate');
    var autocompleter = require('autocompleter');

    var urlParam = Public.urlParam();
    var originalData;

    var subUrl = '';
    var autocompleteUrl = '/test/autocompleter.json?random='+Math.random();

    var createdepinventory = {
        init: function(data) {
            var self = this;

            $('#inventoryName').placeholder();
            self.initCombo();
            self.initTable(data);
            self.initEvent();
        },
        getOriginalData: function() {
            var self = this;

            if(!urlParam.id) {
                originalData = {
                    id: -1,
                    Rows: [{id: '1'}, {id: '2'}, {id: '3'}, {id: '4'}, {id: '5'}, {id: '6'}, {id: '7'}, {id: '8'}]    
                };
                self.init(originalData);
            }else{

            }
        },
        initCombo: function() {
            var self = this;
            
            self.inventoryDepartmentCombo = Business.publicCombo($('#inventoryDepartment'), {
                defaultSelected: -1,
                comboType: 'department'
            });
            self.createPersonCombo = Business.publicCombo($('#createPerson'), {
                defaultSelected: -1,
                comboType: 'employee'
            });
        },
        initTable: function(data) {
            var self = this;
            var columns = [
                {display: '操作', name: 'operating', width: 60, render: Public.billsOper},
                {display: '物料', name: 'materialSn', width: 300, align: 'left', editor: {type: 'autocompleter', url: autocompleteUrl, callback: self.autoCallback} },
                {display: '实际数量', name: 'mount', width: 100, align: 'right', type: 'numberbox', editor: {type: 'numberbox', precision: 2}},
                {display: '单位', name: 'unitName', width: 60},
                {display: '辅单位', columns: [
                    {display: '数量', name: 'otherSurplus', align: 'right', width: 100, type: 'numberbox', editor: {type: 'numberbox', precision: 2}},
                    {display: '名称', name: 'otherUnitName', width: 60}
                ]},
                {display: '备注', name: 'descript', width: 'auto', align: 'left', editor: {type: 'text'}}
            ];

            if(data.id) {
                var gap = 8 - data.Rows.length;

                if(gap > 0) {
                    for(var i = 0; i < gap; i++) {
                        data.Rows.push({});
                    };
                }
            }
            self.grid = $("#maingrid").ligerGrid({
                columns: columns,
                data: data,
                enabledEdit: true,
                alternatingRow: false,
                usePager: false,
                allowHideColumn: false
            });

            $('body').on('click', '.ui-icon-plus', function() { self.grid.addRow(); });
            $('body').on('click', '.ui-icon-trash', function() { self.grid.deleteRow($(this).parent().data('id')); });
        },
        initEvent: function() {
            var self = this;

            $('#create').on('click', function() {
                var inventoryDepartment = self.inventoryDepartmentCombo.getValue();
                var createPerson = self.createPersonCombo.getValue();
                var purDes = $("#maingrid").ligerGetGridManager().getData();
                var purDesArr = [], sendData = {}, flag = true;

                if(inventoryDepartment == '') { 
                    parent.Public.tips({type: 2, content: '请选择盘点部门!'});
                    return false; 
                }
                if(createPerson == '') { 
                    parent.Public.tips({type: 2, content: '请选择创建人!'});
                    return false; 
                }

                $.each(purDes, function(index, obj) {
                    if(!obj.materialSn) { 
                        return true; 
                    }
                    if(obj.materialSn && obj.materialSn == '') {
                        flag = false;
                        return false;    
                    }
                    if(!obj.mount || obj.mount == '') {
                        parent.Public.tips({type: 2, content: '第'+obj.id+'实收数量不能为空!'});
                        flag = false;
                        return false;
                    } 
                    purDesArr.push(obj);
                });
                if(!flag) return false;
                if(purDesArr.length == 0) {
                    parent.Public.tips({type: 2, content: '请添盘点物料'});    
                    return false;    
                }
                sendData = {
                    inventoryDepartment: inventoryDepartment,
                    createPerson: createPerson,
                    purDes: purDesArr
                };

                parent.Public.showTips(dialog, '是否确认提交？', function() {
                    Public.cpxAjax(subUrl, sendData, 'POST', function() {
                        //这里写ajax成功的回调函数
                    });
                });
            });
        },
        autoCallback: function(value, index, selected, $_dom) {
            var self = createdepinventory;
            var grid = createdepinventory.grid;
            var selectedCol = grid.getSelected();
            
            $_dom.prev().val(selected.id+'_'+selected.name+'_'+selected.specification);
            grid.updateRow(selectedCol, {
                price: selected.price,
                unitName: selected.unitName,
                otherUnitName: selected.viceUnitId != '0' ? selected.otherUnitName : '',
                mount: '',
                otherSurplus: ''
            });
            
        }
    };

    exports.init = function() {
        createdepinventory.getOriginalData();
    }
});