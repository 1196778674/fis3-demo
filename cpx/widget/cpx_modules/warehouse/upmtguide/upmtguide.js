define(function (require, exports, module) {
    var Dialog = require('dialog');
    var Common = require('common');
    var Uploader = require('upload');
    var uploading = 0;
    var loading = require('loading');

    var upmtguide = {
        init: function () {
            var self = this;
            $('#entry').on('click', function () {
                if(uploading == 1){
                    self.showTips('上传中...');
                    return false;
                }
                
                self.uploadMaterial = new dialog({
                    width: 215,
                    title: '物料导入',
                    content: '',
                    class: 'import-dialog',
                    button: [
                        {
                            value: '下载模板',
                            callback: function () {
                                window.open('/web/material/downloadMaterialTemplate');
                            }
                        },
                        {
                            value: '上传表格',
                            callback: function () {}
                        }
                    ],
                    init: function () {
                        var that = this, loadbox;
                        var $node = $(this.node);

                        $node.find('button:last-child').addClass('uploadMaterialExcel');
                        new Uploader({
                            trigger: '.uploadMaterialExcel',
                            action: window.serverRoot + '/web/material/addMaterialList',
                            progress: function (e, position, total, percent, files) {
                                //self.showTips('正在上传 '+percent+' %。');	
                            },
                            beforeSend: function() {
                                uploading = 1;
                                console.log(that);
                                that.remove();
                                loadbox = new loading({text: '数据上传中....'});
                            },
                            complete: function() {
                                loadbox.hide();
                            }
                        }).success(function (res) {
                            uploading = 0;
                            if (res.status == 200) {
                                self.showTips(res.msg);
                                self.showTables(res.data);
                            } else {
                                self.showTips(res.msg);
                            }
                        }).error(function (file) {
                            self.showTips('上传失败，服务器异常。');
                        });
                    }
                }).show();
            });
            //刷新按钮-- 提交当前页面所有信息
            $('#refresh').on('click', function () {
                //获取当前页面所有dom信息
                var $trs = $('tbody tr');
                if($trs.length==0){
                    return false;
                }
                var arr = [];
                $trs.each(function(index, val) {
                    var obj = {};
                    var $tr = $(val);
                    obj['materialSn']       =  $tr.find('.col-1').text();
                    obj['name']             =  $tr.find('.col-2').text();
                    obj['firstCategorySn']  =  $tr.find('.col-3').text();
                    obj['firstCategory']    =  $tr.find('.col-4').text();
                    obj['secondCategorySn'] =  $tr.find('.col-5').text();
                    obj['secondCategory']   =  $tr.find('.col-6').text();
                    obj['specification']    =  $tr.find('.col-7').text();
                    obj['unitName']         =  $tr.find('.col-8').text();
                    arr.push(obj);
                });
                
                var jsonData = JSON.stringify(arr);
                Common.cpxAjax({
                        type:'post',
                        url: '/web/material/addMaterialList',
                        parms: {'datajson':jsonData},
                        successfn: function(data) {
                                self.showTables(data);
                                return false;
                                //window.location.reload();	
                        }			
                });
            });

            $('body').on('click', '.editMaterail', function () {
                var $this = $(this);
                var $parentTr = $this.parents('tr');

                var htm = 
                        '<td class="col-1"><input type="text" class="form-control" value="' + $parentTr.find('.col-1').text() + '"></td>' +
                        '<td class="col-2"><input type="text" class="form-control" value="' + $parentTr.find('.col-2').text() + '"></td>' +
                        '<td class="col-3"><input type="text" class="form-control" value="' + $parentTr.find('.col-3').text() + '"></td>' +
                        '<td class="col-4"><input type="text" class="form-control" value="' + $parentTr.find('.col-4').text() + '"></td>' +
                        '<td class="col-5"><input type="text" class="form-control" value="' + $parentTr.find('.col-5').text() + '"></td>' +
                        '<td class="col-6"><input type="text" class="form-control" value="' + $parentTr.find('.col-6').text() + '"></td>' +
                        '<td class="col-7"><input type="text" class="form-control" value="' + $parentTr.find('.col-7').text() + '"></td>' +
                        '<td class="col-8"><input type="text" class="form-control" value="' + $parentTr.find('.col-8').text() + '"></td>' +
                        '<td class="col-9"><a class="btn btn-default save" href="javascript:;">保存</a></td>';

                $parentTr.addClass('active').empty().append(htm);
            });

            $('body').on('click', '.delMaterail', function () {
                var $tr = $(this).parent().parent('tr');
                var $table = $tr.parents('.tableDiv');
                Common.showTips('是否确定删除', function () {
                    //这里写删除业务逻辑
                    if($table.find('tbody tr').length == 1){
                        $table.remove();
                    }else{
                        $tr.remove();
                    }
                });
            });

            $('body').on('click', '.save', function () {
                var $this = $(this);
                var $parentTr = $this.parents('tr');

                var htm = 
                        '<td class="col-1">' + $parentTr.find('.col-1 input').val() + '</td>' +
                        '<td class="col-2">' + $parentTr.find('.col-2 input').val() + '</td>' +
                        '<td class="col-3">' + $parentTr.find('.col-3 input').val() + '</td>' +
                        '<td class="col-4">' + $parentTr.find('.col-4 input').val() + '</td>' +
                        '<td class="col-5">' + $parentTr.find('.col-5 input').val() + '</td>' +
                        '<td class="col-6">' + $parentTr.find('.col-6 input').val() + '</td>' +
                        '<td class="col-7">' + $parentTr.find('.col-7 input').val() + '</td>' +
                        '<td class="col-8">' + $parentTr.find('.col-8 input').val() + '</td>' +
                        '<td class="col-9"><a class="btn btn-default editMaterail" href="javascript:;">编辑</a><a class="btn btn-default ld delMaterail" href="javascript:;">删除</a></td>';

                $parentTr.removeClass('active').empty().append(htm);

            });
        },
        showTips: function (txt) {
            new dialog({
                width: 300,
                title: '提示信息',
                content: txt,
                button: [{value: '确定'}]
            }).show();
        },
        
        showTables: function (data) {
            $('.tableDiv').remove();
            if($(data).length==0){
                return false;
            }
            var table = require('./templates/table.handlebars');
            $.each(data.list, function (key, list) {
                //0=>'必填项为空',1=>'物料编号重复',2=>'名称和规格相同',3,类别编码问题,4=>'不合格的部分'
                var titleDiv = require('./templates/title1.handlebars');
                var $titlebody = $(titleDiv({errorMsg: data.errorMsg[key]}));
                var $tablebody = $titlebody.find('tbody');
                $(table({list: list})).appendTo($tablebody);
                $('#pageBody').append($titlebody);
            });
        },
        getCacheInit: function(){
            var self = this;
            Common.cpxAjax({
                type:'post',
                url: '/web/material/getCacheMaterialList',
                parms: {},
                successfn: function(data) {
                        if($(data).length>0){
                            self.showTables(data);
                        }
                }	
            });
        }

    };
    exports.init = function () {
        upmtguide.init();
        upmtguide.getCacheInit();
    };
});