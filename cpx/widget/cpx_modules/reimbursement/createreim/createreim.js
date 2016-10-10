define(function (require, exports, module) {
	var Combo = require('combo');
    var grid = require('grid');
    var textbox = require('textbox');
    var Uploader = require('upload');
    var dialog = require('dialog');

	var urlParam = Public.urlParam();
	var originalData;

    var subUrl = '';

	var createreim = {
		init: function(data) {
			var self = this;

			self.initCombo();
			self.initTable(data);
			self.initEvent();
		},
		getOriginalData: function() {
			var self = this;

			if(!urlParam.id) {
				originalData = {
					id: -1,
					Rows: [{id: '1'}, {id: '2'}, {id: '3'}, {id: '4'}, {id: '5'}, {id: '6'}]	
				};
				self.init(originalData);
			}else{

			}
		},
		initCombo: function() {
            var self = this;
            
            self.reimTypeCombo = Business.publicCombo($('#reimType'), {
                defaultSelected: 0,
                comboType: 'reimType'
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
        		{display: '明细金额', name: 'money', width: 120, align: 'right', type: 'numberbox', editor: {type: 'numberbox', precision: 2}, totalSummary: {type: 'sum'}},
        		{display: '明细描述', name: 'descript', width: 'auto', align: 'left', editor: {type: 'text'}}
        	];

        	if(data.id) {
        		var gap = 6 - data.Rows.length;

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
                usePager: false
            });

            $('body').on('click', '.ui-icon-plus', function() { self.grid.addRow(); });
            $('body').on('click', '.ui-icon-trash', function() { self.grid.deleteRow($(this).parent().data('id')); });
        },
        initEvent: function() {
            var self = this;

            self.uploadPic();
            $('#create').on('click', function() {
                var reimType = self.reimTypeCombo.getValue();
                var approvePerson = self.approvePersonCombo.getValue(); 
                var reimDes = $("#maingrid").ligerGetGridManager().getData();
                var reimDesArr = [], sendData = {};

                if(approvePerson == '') { 
                    parent.Public.tips({type: 2, content: '请选择待审批人!'});
                    return false; 
                }
                $.each(reimDes, function(index, obj) {
                    if(!obj.money) { return; }
                    if(obj.money && obj.money != '' && (!obj.descript || obj.descript == '')) {
                        parent.Public.tips({type: 2, content: '第'+obj.id+'条明细描述不能为空!'});
                        return false;    
                    }
                    reimDesArr.push(obj);
                });
                sendData = {
                    reimType: reimType,
                    approvePerson: approvePerson,
                    reimDes: reimDesArr
                };

                parent.Public.showTips(dialog, '是否确认提交？', function() {
                    Public.cpxAjax(subUrl, sendData, 'POST', function() {
                        //这里写ajax成功的回调函数
                    });
                });
            });
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
        }
	};

	exports.init = function() {
		createreim.getOriginalData();
	}
});