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

    var createstorein = {
        init: function(data) {
            var self = this;

            self.initCombo();
            self.initTable(data);
            self.initEvent();
        },
        getOriginalData: function() {
            var self = this;

            if(urlParam.cost) {
                var htm = '<div class="form-group control-group">' +
                            '<label class="control-label">供应商名称:</label>' +
                            '<div class="controls">' +
                                '<div class="control">' +
                                    '<span class="ui-combo-wrap" id="supplier">' +
                                        '<input type="text" class="input-txt" autocomplete="off" data-ref="date">' +
                                        '<i class="trigger"></i>' +
                                    '</span>' +
                                '</div>' +
                            '</div>' +
                        '</div>';
                $(htm).insertBefore($('.bar-right'));
                self.supplierCombo = Business.publicCombo($('#supplier'), {
                    defaultSelected: -1,
                    comboType: 'supplier'
                });
            }

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
            
            self.purchaseDepartmentCombo = Business.publicCombo($('#purchaseDepartment'), {
                defaultSelected: -1,
                comboType: 'department'
            });
            self.receivePersonCombo = Business.publicCombo($('#receivePerson'), {
                comboType: 'employee',
                editable: true
            });
        },
        initTable: function(data) {
            var self = this;
            var columns = [
                {display: '操作', name: 'operating', width: 60, render: Public.billsOper},
                {display: '物料', name: 'materialSn', width: 300, align: 'left', editor: {type: 'autocompleter', url: autocompleteUrl, callback: self.autoCallback} },
                {display: '单价/元', name: 'price', width: 100, align: 'right', type: 'numberbox', editor: {type: 'numberbox', precision: 2}},
                {display: '入库数量', name: 'mount', width: 100, align: 'right', type: 'numberbox', editor: {type: 'numberbox', precision: 2}},
                {display: '主单位', name: 'unitName', width: 60},
                {display: '辅单位', columns: [
                    {display: '数量', name: 'otherSurplus', align: 'right', width: 100, type: 'numberbox', editor: {type: 'numberbox', precision: 2}},
                    {display: '名称', name: 'otherUnitName', width: 60}
                ]}
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
                var purchaseDepartment = self.purchaseDepartmentCombo.getValue();
                var receivePerson = self.receivePersonCombo.getValue(); 
                var purDes = $("#maingrid").ligerGetGridManager().getData();
                var purDesArr = [], sendData = {}, flag = true;

                if(purchaseDepartment == '') {
                    parent.Public.tips({type: 2, content: '请选择采购部门!'});
                    return false;   
                }

                if(receivePerson == '') { 
                    parent.Public.tips({type: 2, content: '请选择签收人!'});
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
                    if(obj.otherUnitName != '') {//辅助单位是否存在
                        if(obj.mount == '' && obj.otherSurplus == '') {
                            parent.Public.tips({type: 2, content: '第'+obj.id+'入库数量或者辅助单位数量必须填一个!'});    
                            flag = false;
                            return false;
                        }
                    }else {
                        if(!obj.mount || obj.mount == '') {
                            parent.Public.tips({type: 2, content: '第'+obj.id+'入库数量不能为空!'});
                            flag = false;
                            return false;
                        }
                    } 
                    purDesArr.push(obj);
                });
                if(!flag) return false;
                if(purDesArr.length == 0) {
                    parent.Public.tips({type: 2, content: '请添加入库物料'});    
                    return false;    
                }
                sendData = {
                    purchaseDepartment: purchaseDepartment,
                    receivePerson: receivePerson,
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
            var self = createstorein;
            var grid = createstorein.grid;
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
        createstorein.getOriginalData();
    }
});