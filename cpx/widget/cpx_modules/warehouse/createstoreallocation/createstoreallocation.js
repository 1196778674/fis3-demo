define(function (require, exports, module) {
	var Autocomplete = require('autocomplete');
	var Dialog = require('dialog');
	var Common = require('common');
    var Numeral = require('numeral');

    var storageInUrl = '';
    var searchStoreUrl = '';

    var $addMaterielList = $('#addMaterielList');
    var cost = $('#cost').val();

    var createstoreallocation = {
        init: function() {
            var self = this;

            if(cost == '1') {//部门调拨
                $.divselect("#saOutDepDiv", "#saOutDep");
                $.divselect("#saInDepDiv", "#saInDep");
            }else{
                $('#storeInput').on('change', function() {
                    $(this).next().val('');
                });
                window.document.onkeydown = function(event) {
                    Common.enterKeyDownFn(event, $('#searchStore'));
                } 
                $('#searchStore').on('click', function() {
                    var $storeName = $('#storeInput');
                    
                    self.showStore();
                    /**Common.cpxAjax({
                        url: searchStoreUrl,
                        parms: {storeName: $storeName.val()},
                        successfn: function(data) {
                            //有数据和无数据的处理
                            self.showStore({ data: data });     
                        }               
                    });*/   
                });   
            }

            $('.mount').numeral({'scale': 2});
            self.initAutocompleter();
            self.initStorageInDes();
            $('#beConfirm').on('click', function() {
                var tip = '';
                var $createForm = $('#createForm');
                
                if(cost == '1') {//部门调拨
                    var $saOutDep = $('#saOutDep');
                    var $saInDep = $('#saInDep');

                    if($saOutDep.val() == '') {
                        self.showTips('选择调出部门');
                        return false;       
                    }
                    if($saInDep.val() == '') {
                        self.showTips('选择调入部门');
                        return false;       
                    }
                    tip = '是否确认从'+ $saOutDep.val() + '调拨到' + $saInDep.val();    
                }else{
                    var $storeName = $('#storeInput');

                    if($storeName.val() == '') {
                        self.showTips('请输接收门店名称');
                        return false;       
                    }
                    tip = '是否确认发起调拨到' + $storeName.val();
                }
                
                if($addMaterielList.children().length <= 0) {
                    self.showTips('请添加调拨物料');
                    return false;       
                }
                if(!self.checkMaterialDes()) { return false; }
                Common.showTips(tip, function() {
                    Common.cpxAjax({
                        url: storageInUrl,
                        type: 'POST',
                        parms: $createForm.serialize(),
                        successfn: function(data) {
                            window.location.href = '/warehouse/storeindetail?expenseSn='+data.expenseSn+"&provide="+data.provide;
                        }               
                    });
                });
            });
        },
        showStore: function(data) {
            var self = this;
            var sHandlebar = require('./templates/stores.handlebars');

            new dialog({
                width: 240,
                class: 'st-dialog',
                title: '选择门店',
                content: sHandlebar(data),
                button: [],
                init: function() {
                    var that = this;
                    $('.checkStore').on('click', function() {
                        var $this = $(this);

                        $('#storeInput').val($this.val());
                        $('#storeInputId').val($this.attr('id')); 
                        that.close();   
                    });    
                }
            }).show();

        },
        initStorageInDes: function() {
            var self = this;
            var mHandlebar = require('./templates/material.handlebars');

            $('#addMaterielBtn').on('click', function() {
                if(!self.checkMaterialDes()) { return false; }
                $addMaterielList.append(mHandlebar());
                $('.mQuery').parent().find('.mount').numeral({'scale': 2});
                self.initAutocompleter();
            });
            $('body').on('click', '.del', function() {
                $(this).parents('tr').remove();
            });
        },
        checkMaterialDes: function() {
            var self = this;
            var $trs = $addMaterielList.find('tr');
            var desFlag = true;

            $.each($trs, function(index, tr) {
                var $tr = $(tr);
                var $mQuery = $tr.find('.mQuery'), $fQuery = $tr.find('.fQuery'), $mount = $tr.find('.mount'), $unitPrice = $tr.find('.unitPrice');

                if($fQuery.val() == '') {
                    self.showTips('请填写第'+(index+1)+'条物料信息');
                    desFlag = false;
                    return false;   
                }
                if($mQuery.length > 0) {
                    self.showTips('请正确填写第'+(index+1)+'条物料信息');
                    desFlag = false;
                    return false;   
                }
                if($mount.val() == '') {
                    self.showTips('请填写第'+(index+1)+'条调拨数量');
                    desFlag = false;
                    return false;
                }
            });
            return desFlag;
        },
        showTips: function(txt) {
            new dialog({
                width: 300,
                title: '提示信息',
                content: txt,
                button: [ {value: '确定'} ]   
            }).show();
        },
        initAutocompleter: function() {
            var self = this;

            $('.fQuery').autocompleter({
                highlightMatches: true,
                source: window.serverRoot+'/purchase/ajaxSearchMaterialList',
                hint: true,
                empty: false,
                limit: 10,
                template: '{{ name }} &nbsp;<span>{{ id }}</span>',
                callback: function (value, index, selected) {
                    var $this = $(this),
                        $preTd = $this.parents('td'),
                        $preTr = $this.parents('tr');

                    $preTd.remove();
                    $preTr.prepend('<td class="col-1">'+selected.id+'</td><td class="col-2">'+selected.name+'</td><td class="col-3">'+selected.info+'</td>');
                    
                    $preTr.find('input.id').val(selected.id);
                    $preTr.find('input.unitName').val(selected.unitName);
                    $preTr.find('td.unitName').text(selected.unitName);
                }
            });
        }  
    };
	
	exports.init = function() {
		createstoreallocation.init();		
	};
});