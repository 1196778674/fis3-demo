define(function(require, exports, module) {
	var dialog = require('dialog');
	var laydate = require('laydate');
	var select = require('select');
	var grid = require('grid');

	var index = {
		init: function() {
			var start = {
				elem: '#start',
				choose: function(datas) {
					end.min = datas;
				}
			};
			var end = {
				elem: '#end',
				choose: function(datas) {
					start.max = datas;
				}
			};
			laydate(start);
			laydate(end);

			$('#selectTest').comboSelect();

			var gridObj = Public.setGrid();

			//初始化gird
			var griddata = [{
				id: '01',
				name: '部门01'
			}, {
				id: '02',
				name: '部门02'
			}, {
				id: '03',
				name: '部门03'
			}, {
				id: '04',
				name: '部门04'
			}, {
				id: '05',
				name: '部门05'
			}, {
				id: '06',
				name: '部门06'
			}, {
				id: '07',
				name: '部门07'
			}];

			var grid = $("#maingrid").ligerGrid({
				//height: gridObj.height,
				height: '100%',
				columns: [{
					name: 'id',
					display: '序号',
					width: 200
				}, {
					name: 'name',
					display: '名称',
					width: 300
				}, {
					name: 'id',
					display: '序号',
					width: 200
				}, {
					name: 'name',
					display: '名称',
					width: 300
				}, {
					name: 'id',
					display: '序号',
					width: 200
				}, {
					name: 'name',
					display: '名称',
					width: 300
				}],
				data: {
					Rows: griddata
				}
			});
			//$(window).resize(function() {
			//Public.resizeGrid();
			//})
		}
	};

	exports.init = function() {
		index.init();
	};
});