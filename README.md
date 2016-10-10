## 项目启动

1、安装nodeJs  自行安装;

2、安装fis3：

	sudo npm install fis3 -g;

3、安装相关组件：

	sudo npm install fis3-hook-cmd -g
	sudo npm install -g fis-parser-handlebars-3.x
	、、、如果还提醒安装什么 用 npm install -g xxx  自行安装

4、启动服务

	I: cd 到cpx 文件夹
	II: fis3 release dev
	III: fis3 server start

5、访问：127.0.0.1:8080/index.html   //仅限于静态资源调试，如果有后台的话就按着后台的标准

6、每次修改过代码以后要重新执行：

	fis3 release dev



## 项目目录结构

	-cpx/
		-page/					页面目录
			+header/				页面header
			+leftnav/				左侧导航
			+reimbursement/			报销模块
			、、、
			index.html 			首页
		-static/				全局静态资源
			+css/					全局css
			+fonts/					可能用到的字体库
			+images/				全局图片
		-test/						本地自测mock数据
		-widget					组件库
			+cpx-modules/		业务模块
				+index/				首页
				+reimbursement/		报销
					+createreim/		发起报销------------子模块
						createreim.js
						createreim.less
				、、、
			+modules/			外部资源库
			、、、


## page, js, less  命名规范， page名，js名，less名 和当前模块名一致。

## example 发起报销模块:
	-page/
		+reimbursement/
			createreim.html
	-widget/
		+cpx-modules/
			+reimbursement/
				+createreim/
					+createreim.js
					+createreim.less


# seaJs 使用

# demo.js

define(function(require, exports, module){

	//使用一个 dialog(弹出框) seajs 模块
	var dialog = require('dialog');

});


## 业务模块编写规范
# example test.js

define(function(require, exports, module){

	var test = {
		init: function() {
			var self = this;

			//初始化 和input相关的 placeholder
			@example
			$('input').placeholder(); //id或class

			self.initCombo();//初始化下拉框
            self.initDropDown();//初始化更多查询条件
            self.initTable();//初始化表格
            self.initEvent();//初始化事件
		},
		initCombo: function() {
			//为了避免this引用混乱 每个函数里都要重定下this
			var self = this;
		},
		initDropDown: function() {},
		initTable: function() {},
		initEvent: function() {
			var self = this;

			//初始化表格事件
			self.initTableEvent();
			//初始化页面事件
		},
		initTableEvent: function() {},
		reloadTable: function() {//点击查询时重新查询数据
            var self = this;
            var searchData = this.getSearchData();

            //self.grid.loadServerData(searchData);

        },
		getSearchData: function() {//返回查询所需字段
			return {

			};
		}
	};


	exports.init = function() {
		test.init();
	}
});


## 模块使用

# 弹出窗
	var dialog = require('dialog');

	dialog({
		title: '这是标题',
		width: '宽度',
		content: '这是弹出框里面的内容',
		class: 'dialog增加class', //非必须
		button: [{
			value: '确认',
			callback: function() {//确认后的回调函数

			}
		},{
			class: 'btn-default',// 取消按钮非必须，如果有取消按钮 取消按钮的class属性必须
			value: '取消'
		}]
	}).show();

# upload上传插件
	var Uploader = require('upload');

	new Uploader({
	    trigger: '#uploadPic', //上传按钮的id或者class
	    data: {photoType: 'reimbursment'}, //上传参数
	    action: 'http://web.com/web/upload/uploadImage', //提交路径
	    beforeSend: function() {
	    	//上传前回调函数 非必须
	    }
	}).success(function(res) {
		//上传成功后回调函数
	}).error(function(file) {
	    //上传失败后回调函数
	});

# laydate 日历组件 直接copy这么用
	var laydate = require('laydate');

	var start = {elem: '#start', choose: function(datas) {end.min = datas; }};
    var end = {elem: '#end', choose: function(datas) {start.max = datas; }};

    laydate(start);
    laydate(end);

    字段说明： elem: '日历按钮id',choose: 选择后的回调函数

# combo select下拉组件
	var Combo = require('combo');

	var combo = Business.publicCombo($('#reimType'), {
        defaultSelected: 0, //默认select值
        comboType: 'reimType', //下拉的类型，此配置可以获取下拉的数据
        callbackfn: self.changeType //改变下拉值后的灰调函数
    });
    var val = combo.getValue(); 获取select的value

# dropdown 更多查询条件
	var dropdown = require('dropdown');

    @type dom 下拉dom
    @type options {
          template: 更多的内容,
          callbackConfirm: 确认后的回调函数,
          afterInit: 初始化完成后的回调函数
    }
	dropdown(dom, {template, callbackConfirm, afterInit});
	dropdown('#msCnd', {
        template: '<div>test</div>',
        callbackConfirm: function(){console.log('test');},
        afterInit: function() {}
    });

# grid 初始化表格
	var grid = require('grid');
	//如果表格是可编辑的 需要引textbox
	var textbox = require('textbox');

	//表格列
	var columns = [
	    {display: '操作', name: 'operate', width: 60, render: self.operateFormatter},
	    {display: '创建时间', name: 'date'},
	    {display: '报销单号', name: 'expenseSn'},
	    {display: '待审批人', name: 'nextUserName'},
	    {display: '类型', name: 'expenseTypeValue'},
	    {display: '审批状态', name: 'expenseStep'},
	    {display: '总金额/元', name: 'amountTotal', align: 'right'}
	];
	{
		display: '列名',
		name: '',//此值和返回表list里面的的字段对应
		witdh: '宽度',
		align: '在表格中默认显示的位置' //默认居中 center, left, right
	}

	self.grid = $("#maingrid").ligerGrid({
        height: '100%', //表格高度
        url: searchUrl, //查询url
        parms: self.getSearchData(), //查询参数
        contentType: 'json',
        method: 'get',
        columns: columns, 表格列
        //改变数据源的值
        root: 'list', 默认Rows，实际为返回的list数组
        enabledEdit: true, // 是否编辑  默认false
        alternatingRow: false, //是否隔行变色 默认true
        usePager: false, //是否显示分页栏 默认true
        record: 'total', // 总共条数
        rownumbers: true //航序号 默认显示
    });

    详细api地址 ： http://api.ligerui.com/?to=grid

# common.js

	-defaultAjax,
	-Ajax,
	-showTips,
	-showTip
	-tips
	-loading























