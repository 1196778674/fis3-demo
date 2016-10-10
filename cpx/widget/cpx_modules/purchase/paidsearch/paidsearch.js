define(function(require, exports, module) {
    var Combo = require('combo');
    var dropdown = require('dropdown');
    var laydate = require('laydate');

    var searchUrl = '/test/reim/paidsearch.json';

    var paidsearch = {
        init: function() {
            var self = this;

            $('#reimNumber').placeholder();
            self.initCombo();//初始化下拉框
            self.initDropDown();//初始化更多查询条件
            self.initEvent();
        },
        initCombo: function() {
            var self = this;
            
            self.createPersonCombo = Business.publicCombo($('#createPerson'), {
                defaultSelected: 0,
                comboType: 'employee',
                callbackfn: self.changeType
            });
            self.supplierCombo = Business.publicCombo($('#supplier'), {
                comboType: 'supplier',
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
                    //self.reloadTable();
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

        },
        initEvent: function() {
            var self = this;

            $('#search').on('click', function() {
                var supplier = self.supplierCombo.getValue();

                if(supplier == '') {
                    parent.Public.tips({type: 2, content: '请输选择供应商'});
                }      
                self.initTable();
            });
            $('#create').on('click', function() {
                parent.tab.addTabItem({
                    tabid: 'purchase-createbalance',
                    text: '发起结算',
                    url: '/page/purchase/balance/createbalance.html'  
                });
            });    
        },
        initTable: function() {
            var self = this;
            var searchData = self.getSearchData();
            var tableHandlebar = __inline('./templates/table.handlebars');

            Public.defaultAjax(
                searchUrl,
                searchData,
                function(res) {
                    $('#table').html(tableHandlebar(res.data));    
                }
            );    
        },
        getSearchData: function() {
            var self = this;
            return {
                reimId: '请输入编号' == $('#reimNumber').val() ? '' : $('#reimNumber').val(),
                createPerson: self.createPersonCombo.getValue(),
                supplier: self.supplierCombo.getValue(),
                start: $('#start').val(),
                end: $('#end').val()    
            }
        }
    };

    exports.init = function() {
        paidsearch.init();
    }
});