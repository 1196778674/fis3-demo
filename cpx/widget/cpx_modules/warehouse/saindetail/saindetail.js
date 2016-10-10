define(function (require, exports, module) {	
	var Dialog = require('dialog');
	var Common = require('common');
	var Numeral = require('numeral');
	var Autocomplete = require('autocomplete');

	var orderId = $('#orderId'), firstShowMdSecondMaterial;
	var subUrl = '';
	var catUrl = '';
	var addMaterialUrl = '/warehouse/addMaterial';

	var saindetail = {
		init: function() {
			var self = this;

			$('#confirmStore, #rejected').on('click', function() {
				var $this = $(this);
				var tip = $this.data('tip');

				Common.showTips(tip, function() {
                    Common.cpxAjax({
                        url: subUrl,
                        parms: {orderId: orderId},
                        successfn: function(data) {
                        	window.location.reload(); 
                        }               
                    });    
                });
			});

			$('.catMaterial').on('click', function() {
				var $this = $(this), $parent = $this.parent();
				var materialId = $parent.find('.materialId').val();
				var materialName = $parent.find('.materialName').val();
				var $tr = $this.parents('tr');
				var ctHandlebar = require('./templates/cmmodel.handlebars');

				new dialog({
					width: 252,
					title: '关联物料',
					content: ctHandlebar(),
					class: 'cm-dialog',
					button: [
						{
							value: '确认关联',
							callback: function() {
								var $node = $(this.node);
								var parms = {
									materialId: materialId,
									materialName: materialName,
									catMaterialId: $node.find('#cmMaterialId').val(),
									catMaterialName: $node.find('#mIdOrName').val() 	
								};

								Common.cpxAjax({
			                        url: catUrl,
			                        parms: parms,
			                        successfn: function(data) {
			                        	// code here 
			                        }               
			                    });
							}
						},
						{
							value: '取消',
						}		
					],
					init: function() {
						self.initAutocompleter($(this.node));		
					}	
				}).show();
			});

			$('.createMaterial').on('click', function() {
				var $this = $(this), $parent = $this.parent();
				var materialId = $parent.find('.materialId').val();
				var materialName = $parent.find('.materialName').val();
				var $tr = $(this).parents('tr');

				var mdHandlebar = require('./templates/materialmodel.handlebars');

				new dialog({
					width: 630,
					class: 'md-dialog',
					title: '物料添加/编辑',
					content: mdHandlebar({materialName: materialName}),
					button: [
						{
							value: '确认添加',
							callback: function() {
								var confimData = self.getMaterialData();
								var $mdError = $('.mdError');

								if(confimData.materialName == '') {
									$mdError.text('物料名称不能为空');
									return false;	
								}
								if(confimData.unitId == '') {
									$mdError.text('计量单位不能为空');
									return false;	
								}
								if(confimData.firstCategory == '') {
									$mdError.text('一级类别不能为空');
									return false;	
								}
								Common.cpxAjax({
									url: addMaterialUrl,
									parms: confimData,
									successfn: function(data) {
										//code here...	
									}				
								});			
							}
						},
						{value: '取消'} 
					],
					init: function() {
						var $node = $(this.node);
						var $mdFirstMaterial = $node.find('#mdFirstMaterial');

						$node.find('#mdWarnNo').numeral();
						self.initPopupFirstCategoryList($node);
						if($mdFirstMaterial.val() != '') {
							self.initPopupSecondCategoryList($mdFirstMaterial.val());
						}
						self.initPopupUnitList($node);
					}	
				}).show();

			});	
		},
		initPopupFirstCategoryList: function($node) {
			var self = this;
			Common.cpxAjax({
				url: '/warehouse/ajaxGetCategoryList',
				successfn: function(data) {
					var c1Htm = '';
					
					if(data.category.length <= 0) return false;
					for(var i = 0; i < data.category.length; i++) {
						var c1 = data.category[i];

						c1Htm += '<li><a href="javascript:;" selectid="'+c1.id+'">'+c1.name+'</a></li>';
					};
					$node.find('#mdFirstMaterialDiv ul').html(c1Htm);
					$.divselect('#mdFirstMaterialDiv', '#mdFirstMaterial', self.initPopupSecondCategoryList);
				}				
			});	
		},
		initPopupSecondCategoryList: function(val) {
			Common.cpxAjax({
				url: '/warehouse/ajaxGetCategoryList2',
				parms: {cid1: val},
				successfn: function(data) {
					var c2Htm = '';
					var $mdSecondMaterialDiv = $('#mdSecondMaterialDiv');

					$mdSecondMaterialDiv.find('i').unbind();
					if(data.category.length <= 0){
						$mdSecondMaterialDiv.find('span').html('无二级类别');
						$mdSecondMaterialDiv.find('#mdSecondMaterial').val('');
						$mdSecondMaterialDiv.find('ul').html('');
						return false;
					};
					for(var i = 0; i < data.category.length; i++) {
						var c2 = data.category[i];

						c2Htm += '<li><a href="javascript:;" selectid="'+c2.id+'">'+c2.name+'</a></li>';
					};
					if(!firstShowMdSecondMaterial) {
						$mdSecondMaterialDiv.find('span').html('');
					}
					firstShowMdSecondMaterial = false;
					$mdSecondMaterialDiv.find('ul').html(c2Htm);
					$.divselect('#mdSecondMaterialDiv', '#mdSecondMaterial');	
				}				
			});
		},
		initPopupUnitList: function($node) {
			Common.cpxAjax({
				url: '/warehouse/ajaxGetUnitList',
				successfn: function(data) {
					var unitHtm = '';
					
					if(data.unitList.length <= 0) return false;
					for(var i = 0; i < data.unitList.length; i++) {
						unitHtm += '<li><a href="javascript:;" selectid="'+data.unitList[i].id+'">'+data.unitList[i].name+'</a></li>';
					};
					$node.find('#mdMaterialUnitDiv ul').html(unitHtm);
					$.divselect('#mdMaterialUnitDiv', '#mdMaterialUnit');
				}				
			});
		},
		getMaterialData: function() {
			return {
				materialName: $('#mdMaterialName').val(),
				unitId: $('#mdMaterialUnit').val(),
				unitName: $('#mdMaterialUnit').next().text(),
				firstCategory: $('#mdFirstMaterial').val(),
				firstCategoryName: $('#mdFirstMaterial').next().text(),
				secondCategory: $('#mdSecondMaterial').val(),
				secondCategoryName: $('#mdSecondMaterial').next().text(),
				warnNo: $('#mdWarnNo').val(),
				info: $('#info').val()
			};	
		},
		initAutocompleter: function($dom) {
            var self = this;

            $('.fQuery').autocompleter({
                highlightMatches: true,
                source: window.serverRoot+'/purchase/ajaxSearchMaterialList',
                hint: true,
                empty: false,
                limit: 10,
                template: '{{ name }} &nbsp;<span>{{ id }}</span>',
                callback: function (value, index, selected) {
                    var $this = $(this);

                    $dom.find('#cmMaterialId').val(selected.id);
                }
            });
        }
	};
	
	exports.init = function() {
		saindetail.init();		
	};
});