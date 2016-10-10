define(function(require, exports, module) {
    var Combo = require('combo');
    var dropdown = require('dropdown');
    var laydate = require('laydate');
    var grid = require('grid');
    var Uploader = require('upload');

    var searchUrl = '/test/reim/createbalance.json';

    var createbalance = {
        init: function() {
            var self = this;

            var start = {elem: '#start', choose: function(datas) {end.min = datas; }};
            var end = {elem: '#end', choose: function(datas) {start.max = datas; }};

            laydate(start);
            laydate(end);

            self.initCombo();//初始化下拉框
            self.initEvent();
        },
        initCombo: function() {
            var self = this;
            
            self.supplierCombo = Business.publicCombo($('#supplier'), {
                comboType: 'supplier'
            });
            self.approvePersonCombo = Business.publicCombo($('#approvePerson'), {
                comboType: 'employee',
                editable: true
            });

        },
        initTable: function(datas) {
            var self = this;
            var columns = [
                
                {display: '创建时间', name: 'date'},
                {display: '单号', name: 'expenseSn'},
                {display: '发票类型', name: ''},
                {display: '发票代码', name: 'code'},
                {display: '发票号码', name: 'number'},
                {display: '创建人', name: 'createdAtUserName'},
                {display: '总金额/元', name: 'amount', align: 'right', totalSummary: {type:'sum'}}
            ];
                
            self.grid = $("#maingrid").ligerGrid({
                data: datas,
                columns: columns,
                checkbox:true,
                usePager: false,
                //改变数据源的值
                root: 'list'
            });
        },
        initEvent: function() {
            var self = this;

            $('#search').on('click', function() {
                var supplierId = self.supplierCombo.getValue();

                if(supplierId == '') {
                    parent.Public.tips({type: 2, content: '请选择供应商!'});
                    return false;
                }
 
                parent.Public.defaultAjax(
                    searchUrl,
                    {
                        supplierId: supplierId,
                        start: $('#start').val(),
                        end: $('#end').val()  
                    },
                    function (res) {
                        var data = res.data;

                        if(data.list.length == 0) {
                            parent.Public.tips({type: 2, content: '暂无数据!'});
                            return false;    
                        }
                        $('#billMsg').show();
                        self.initTable(data);
                        self.uploadPic();
                    }
                );
            });    
        },
        initTableEvent: function() {
            
        },
        uploadPic: function() {
            var self = this;
            var $picContainer = $('#picContainer');

            new Uploader({
                trigger: '#uploadPic',
                data: {photoType: 'reimbursment'},
                action: 'http://web.com/web/upload/uploadImage',
                beforeSend: function() {
                    if($picContainer.children().length >= 6) return false;    
                }
            }).success(function(res) {
                if(res.status == 0) {
                    var htm = '<div id="uploadPic1" class="upload-btn"><div class="show-uplodpic">' +
                                '<i data-url="'+res.data.url+'" class="delpic glyphicon glyphicon-remove"></i>' +
                                '<a target="_blank" href="{{url}}">' +
                                    '<img src="'+res.data.url+'">' +
                                '</a>' +
                            '</div></div>';
                    $picContainer.append(htm);
                    $picContainer.parent().show();
                }else {
                    self.showTips('上传失败，失败原因：' + res.msg);
                }
            }).error(function(file) {
                self.showTips('上传失败，服务器异常。');
            }); 
        },
        getSearchData: function() {
            var self = this;
            return {
                approvePerson: self.approvePersonCombo.getValue(),
                supplier: self.supplierCombo.getValue(),
                
                start: $('#start').val(),
                end: $('#end').val()    
            }
        }
    };

    exports.init = function() {
        createbalance.init();
    }
});