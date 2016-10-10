define(function (require, exports, module) {
	var Dialog = require('dialog');
	var laydate = require('laydate');
	var pagiNation = require('pagination');
	var autocomplete = require('autocomplete');

	var $categoryList = $('#categoryList');
	var categoryHandlebar = require('./templates/categorytable.handlebars');

	var categorymanage = {
		init: function() {
			var self = this;

			$.divselect("#firstCategoryDiv", "#firstCategory");
			$.divselect("#categoryCreatePersonDiv", "#categoryCreatePerson");

			//日历====================
            var start = {
                elem: '#start',
                format: 'YYYY/MM/DD',
                min: '2015-10-01',
                max: '2099-06-16',
                choose: function(datas){
                     end.min = datas; //开始日选好后，重置结束日的最小日期
                     //end.start = datas //将结束日的初始值设定为开始日
                }
            };
            var end = {
                elem: '#end',
                format: 'YYYY/MM/DD',
                max: '2099-06-16',
                choose: function(datas){
                    start.max = datas; //结束日选好后，重置开始日的最大日期
                }
            };
            laydate(start);
            laydate(end);

            self.initCategorys();
            $('#searchCategory').on('click', function() {
            	self.initCategorys();	
            });

			$('#addCategory').on('click', function() {
				self.showCategoryModel();	
			});
			$('body').on('click', '.editCategory', function() {
				var $parentTr = $(this).parents('tr');

				var categoryArry = {
					cid1: $parentTr.find('td.col-2').text(),
					cid1_name: $parentTr.find('td.col-3').text(),
					cid2: $parentTr.find('td.col-4').text(),
					cid2_name: $parentTr.find('td.col-5').text()
				};
				self.showCategoryModel(categoryArry);
			});
			$('#deleteCategory').on('click', function() {
				//var id = $(this).data('id');
				//删除功能 预留
			});
		},
		showCategoryModel: function(parms) {
			var self = this;
			var mdHandlebar = require('./templates/categorymodel.handlebars');
			var categoryArry = {
				isEdit: false
			};
			if(parms) {
				categoryArry.isEdit = true;
				$.extend(categoryArry, parms);
			}
			new dialog({
				width: 250,
				class: 'cd-dialog',
				title: '类别添加/编辑',
				content: mdHandlebar(categoryArry),
				button: [
					{
						value: '保存',
						callback: function() {
							var $node = $(this.node);
							var $isEdit = $node.find('#isEdit'),
								$addCategoryError = $node.find('.addCategoryError'),
								$cid1Input = $node.find('input[class="select-txt"]'),
								cid1CategoryVal = $node.find('#cid1Category').val(),
								$cdSecondCategoryName = $node.find('#cdSecondCategoryName');
							var sendData = {};

							if($isEdit.length > 0) {//修改
								if($cdSecondCategoryName.val() == '') {
									$addCategoryError.html('二级类别名称不能为空');
									return false;	
								}
								sendDate = {
									isEdit: true,
									cid1: $node.find('#cid1Category').val(),
									cid1_name: $node.find('span.select-txt').text(),
									cid2: $node.find('#cid2').val(),
									cid2_name: $cdSecondCategoryName.val()
								};
							}else {//添加
								if(cid1CategoryVal == '' && $cid1Input.val() == '') {
									$addCategoryError.html('一级类别名称不能为空');
									return false;	
								}
								sendDate = {
									isEdit: false,
									cid1: $node.find('#cid1Category').val(),
									cid1_name: $cid1Input.val(),
									cid2: '',
									cid2_name: $cdSecondCategoryName.val()
								};
							}
							//统一处理 CODE HERE
							
						}
					},
					{value: '取消'} 
				],
				init: function() {
					var $node = $(this.node);
					$.getJSON(window.serverRoot+'/warehouse/ajaxGetCategory', function(res) {
						if(res.status == 0) {
							var data = res.data.category, liHtm = '';
								
							for(var i=0; i<data.length; i++) {
								liHtm += '<li><a href="javascript:;" selectid="'+data[i].id+'">'+data[i].name+'</a></li>';
							}
							$('#cid1CategoryDiv ul').html(liHtm);
							$.divselect("#cid1CategoryDiv", "#cid1Category");
							self.addOreditCategory($node);
						}	
					});
				}	
			}).show();
		},
		addOreditCategory: function($node) {
			var $cid1Input = $node.find('input[class="select-txt"]'),
				$cid1Category = $node.find('#cid1Category'),
				cid1CategoryVal = $cid1Category.val(),
				cid1InputVal = $cid1Input.val();

			$cid1Input.on('blur keypress', function() {
				if($(this).val() != cid1InputVal) {
					$cid1Category.val('');	
				}else {
					$cid1Category.val(cid1CategoryVal);
				}
			});
		},
		initCategorys: function() {
			var self = this;
			var sendData = self.getAjaxData();

			self.ajaxGetCategorys(sendData, self.showCategoryTable);

		},
		showCategoryTable: function(data) {
			var self = this;

			$('#categoryPagingControl').html('');
			if(data.totalPages == 0) {
                $categoryList.html('<tr><td colspan="8" class="no-datas">暂无数据</td></tr>');
                return false;
            }
			$categoryList.html(categoryHandlebar(data));
			if(data.totalPages > 1) {
                categorymanage.pagination(data);
            }
		},
		ajaxGetCategorys: function(parms, callback) {
			$.ajax({
				url: window.serverRoot + '/warehouse/ajaxGetCategoryList?random='+Math.random(),
				type: 'POST',
				dataType: 'JSON',
				data: parms,
			})
			.done(function(res) {
				if(res.status == 0) {
					callback(res.data);
				}else{

				}
			})
			.fail(function() {
				console.log("error");
			});
			
		},
		getAjaxData: function() {
			return {
				categoryName: $('#categoryName').val(),
				cid1: $('#firstCategory').val(),
				createdUserId: $('#categoryCreatePerson').val(),
				start: $('#start').val(),
				end: $('#end').val()
			};
		},
		pagination: function(parms) {
            var self = this;
            var options = {
                currentPage: 1,
                totalPages: parms.totalPages,
                numberOfPages: 5,
                itemTexts: function (type, page, current) {
                    switch (type) {
                        case "first":
                            return "首页";
                        case "prev":
                            return "上一页";
                        case "next":
                            return "下一页";
                        case "last":
                            return "末页";
                        case "page":
                            return page;
                    }
                },   
                onPageClicked: function(event, originalEvent, type, page) {
                    var requestData = self.getAjaxData();

                    requestData.currentPage = page;
                    self.ajaxGetCategorys(requestData, self.showPaginationAjax);                                          
                } 
            };
            $('#categoryPagingControl').bootstrapPaginator(options);
        },
        showPaginationAjax: function(data) {
        	var self = this;
        	$categoryList.html(categoryHandlebar(data));
        }
	};
	exports.init = function() {
		categorymanage.init();
	};
});