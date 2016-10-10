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

    var createpurchase = {
        init: function(data) {
            var self = this;
            var start = { elem: '#start', min: laydate.prototype.now() };
            
            $('#purMsg').placeholder();
            laydate(start);

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
            
            self.purchaseDepartmentCombo = Business.publicCombo($('#purchaseDepartment'), {
                defaultSelected: -1,
                comboType: 'department'
            });
            self.approvePersonCombo = Business.publicCombo($('#approvePerson'), {
                comboType: 'employee',
                editable: true
            });
        },
        initTable: function(data) {
            var self = this;
            var columns = [
                {display: '操作', name: 'operating', width: 60, render: Public.billsOper},
                {display: '物料', name: 'materialSn', width: 300, align: 'left', editor: {type: 'autocompleter', url: autocompleteUrl, callback: self.autoCallback} },
                {display: '库存数量', name: 'total', width: 100},
                {display: '需求数量', name: 'amount', width: 100, align: 'right', type: 'numberbox', editor: {type: 'numberbox', precision: 2}},
                {display: '主单位', name: 'unitName', width: 60},
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
                var purchaseDepartment = self.purchaseDepartmentCombo.getValue();
                var approvePerson = self.approvePersonCombo.getValue(); 
                var purDes = $("#maingrid").ligerGetGridManager().getData();
                var purDesArr = [], sendData = {}, flag = true;

                if(purchaseDepartment == '') {
                    parent.Public.tips({type: 2, content: '请选择采购部门!'});
                    return false;   
                }

                if($('#start').val() == '') {
                    parent.Public.tips({type: 2, content: '请选择期望提交时间!'});
                    return false;   
                }

                if(approvePerson == '') { 
                    parent.Public.tips({type: 2, content: '请选择待审批人!'});
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
                        if(obj.amount == '' && obj.otherSurplus == '') {
                            parent.Public.tips({type: 2, content: '第'+obj.id+'需求数量或者辅助单位数量必须填一个!'});    
                            flag = false;
                            return false;
                        }
                        if(obj.amount != '' && obj.otherSurplus != '') {
                            parent.Public.tips({type: 2, content: '第'+obj.id+'需求数量或者辅助单位数量只能填一个!'});    
                            flag = false;
                            return false;
                        }
                    }else {
                        if(!obj.amount || obj.amount == '') {
                            parent.Public.tips({type: 2, content: '第'+obj.id+'需求数量不能为空!'});
                            flag = false;
                            return false;
                        }
                    } 
                    purDesArr.push(obj);
                });
                if(!flag || purDesArr.length == 0) return false;
                sendData = {
                    purchaseDepartment: purchaseDepartment,
                    start: $('#start').val(),
                    approvePerson: approvePerson,
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
            var self = createpurchase;
            var grid = createpurchase.grid;
            var selectedCol = grid.getSelected();
            
            $_dom.prev().val(selected.id+'_'+selected.name+'_'+selected.specification);
            grid.updateRow(selectedCol, {
                total: selected.total,
                unitName: selected.unitName,
                otherUnitName: selected.viceUnitId != '0' ? selected.otherUnitName : '',
                amount: '',
                otherSurplus: '',
                descript: ''
            });
            
        }
    };

    exports.init = function() {
        createpurchase.getOriginalData();
    }
});