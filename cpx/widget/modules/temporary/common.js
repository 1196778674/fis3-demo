//公用的一些东西

var Public = Public || {};
var Business = Business || {};


Public.getDefaultPage = function() {
	var win = window.self;
	var i = 20; //最多20层，防止无限嵌套 iframe
	try {
		do {
			if (/index.html/.test(win.location.href)) {
				return win;
			}
			win = win.parent;
			i--;
		} while (i > 0);
	} catch (e) {
		return win;
	}
	return win;
};
//设置表格宽高
Public.setGrid = function(height, width) {
	var defaultPage = Public.getDefaultPage();
	var gridW = $(window).width(),
		gridH = $(window).height() - $('.grid-wrap').offset().top - 62; //62为表头和分页的高度

	return {
		width: gridW,
		height: gridH
	};
};

//获取URL参数值
Public.urlParam = function() {
   var url = location.search, theRequest = {};

   if(url.indexOf('?') != -1) {
      var str = url.substr(1);
      var strs = str.split('&');

      for(var i = 0; i < strs.length; i++) {
      	var parms = strs[i].split('=');

      	theRequest[parms[0]] = decodeURIComponent(parms[1]);	
      }
   }
   return theRequest;
};

//ajax服务
Public.defaultAjax = function(url, params, callback, type){    
	$.ajax({  
	   	type: type || 'GET',
	   	url: url,
	   	dataType: 'JSON',  
	   	data: params || {},    
	   	success: function(data){
	   		if(data.status === 0) {
	   			callback(data); 
	   		}else {
	   			parent.Public.tips({content : data.msg});	
	   		} 
	   	},   
	   	error: function(err){  
			parent.Public.tips({content : '系统异常！'});
	   	}  
	});  
};
// 带 loading 加载
Public.Ajax = function(url, params, callback, type){
	var loadbox = null;

	$.ajax({  
	   	type: type || 'GET',
	   	url: url,
	   	dataType: 'JSON',  
	   	data: params || {},  
	   	beforeSend: function() {
	   		loadbox = parent.Public.loading();
	   	},  
	   	success: function(data){
	   		if(data.status === 0) {
	   			callback(data); 
	   		}else {
	   			parent.Public.tips({content : data.msg});	
	   		} 
	   	},   
	   	error: function(err){  
			parent.Public.tips({content : '系统异常！'});
	   	},
	   	complete: function() {
	   		loadbox.hide();
	   	}  
	});  
};

//默认提交or显示提示信息，受插件限制需传obj对象过来
Public.showTips = function(dialog, txt, callback) {
	dialog({
        width: 200,
        title: '提示信息',
        content: txt,
        class: 'md-tips',
        button: [{
                value: '确定',
                callback: function() {
                	callbackfn();       
                }
            },{
            	class: 'btn-default',
            	value: '取消'
            }]   
    }).show();		
};
//一些提示信息
Public.showTip = function(dialog, txt) {
	dialog({
        width: 200,
        title: '提示信息',
        content: txt,
        button: [ {value: '确定'} ]   
    }).show();	
};


//操作提示
//@example: parent.Public.tips({type: 2, content: '这是测试信息...'});
Public.tips = function(options){ return new Public.Tips(options); }
Public.Tips = function(options){
	var defaults = {
		renderTo: 'body',
		type : 1,
		autoClose : true,
		removeOthers : true,
		time : 3000,
		top : 15,
		onClose : null,
		onShow : null
	}
	this.options = $.extend({},defaults,options);
	this._init();
	
	!Public.Tips._collection ?  Public.Tips._collection = [this] : Public.Tips._collection.push(this);
	
}

Public.Tips.removeAll = function(){
	try {
		for(var i=Public.Tips._collection.length-1; i>=0; i--){
			Public.Tips._collection[i].remove();
		}
	}catch(e){}
}

Public.Tips.prototype = {
	_init : function(){
		var self = this,opts = this.options,time;
		if(opts.removeOthers){
			Public.Tips.removeAll();
		}

		this._create();

		this.closeBtn.bind('click',function(){
			self.remove();
		});

		if(opts.autoClose){
			window.setTimeout(function(){
				self.remove();
			}, opts.time);
		}
	},
	
	_create : function(){
		var opts = this.options;
		this.obj = $('<div class="ui-tips"><i></i><span class="close"></span></div>').append(opts.content);
		this.closeBtn = this.obj.find('.close');
		
		switch(opts.type){
			case 0 : 
				this.obj.addClass('ui-tips-success');
				break;
			case 1 : 
				this.obj.addClass('ui-tips-error');
				break;
			case 2 : 
				this.obj.addClass('ui-tips-warning');
				break;
		}
		
		this.obj.appendTo('body').hide();
		this._setPos();
		if(opts.onShow){
				opts.onShow();
		}
	},

	_setPos : function(){
		var self = this, opts = this.options;
		if(opts.width){
			this.obj.css('width',opts.width);
		}
		var h =  this.obj.outerHeight(),winH = $(window).height(),scrollTop = $(window).scrollTop();
		var top = parseInt(opts.top) + scrollTop;
		this.obj.css({
			position : 'fixed',
			left : '50%',
			top : top,
			zIndex : '9999',
			marginLeft : -self.obj.outerWidth()/2	
		});

		window.setTimeout(function(){
			self.obj.show().css({
				marginLeft : -self.obj.outerWidth()/2
			});
		}, 150);
	},

	remove : function(){
		var opts = this.options;
		this.obj.fadeOut(200, function(){
			$(this).remove();
			if(opts.onClose){
				opts.onClose();
			}
		});
	}
};

//ajax加载loading
//example: Public.loading({text: 'zhengzaishangchuan'});
Public.loading = function(options) { return new Public.Loading(options) };
Public.Loading = function(options) {
	var defaults = {
		el: 'body',
        text: '数据加载中....',
        show: true
	};
	this.options = $.extend({}, defaults, options);
	this._init();
}
Public.Loading.prototype = {
	_init: function() {
		var opts = this.options;

		if(opts.show) this.show();
	},
	show: function() {
		var opts = this.options;
		var $box = $('<div class="loading-container">' + '<div class="loading-mask"></div>' + '<div class="loading-content">' + '<div class="icon"></div>' + '<div class="loading-text">' + opts.text + '</div>' + '</div>' + '</div>');

		this.loading = $box.appendTo('body');	
	},
	hide: function() {
		this.loading && this.loading.remove();
	}
};

//操作 添加或者删除行
Public.billsOper = function (rowdata, rowindex, value) {
	return '<div class="operating" data-id="'+rowindex+'"><span class="ui-icon ui-icon-plus" title="新增行"></span><span class="ui-icon ui-icon-trash" title="删除行"></span></div>';
};
//操作 查看
Public.billLookOver = function(obj) {
	return '<div class="operating" data-id="'+obj.expenseSn+'"><span class="ui-icon ui-icon-detail" title="查看"></span></div>';
}

/**
 * 公用的下拉模拟select，可提供输入
 * @param  array $_obj 当前下拉的父级对象
 * @param  object opts  初始化一些参数 //editable: false, 默认不可编辑，emptyOptions: false, 是否新增一个空,当前需求暂时不需要
 * @return 下拉列表
 */
Business.publicCombo = function($_obj, opts) {
	if ($_obj.length == 0) return;

	var defaultPage = Public.getDefaultPage();
	
	var opts = $.extend(true, {
		data: function() {
			return defaultPage.SYSTEM[opts.comboType]
		},
		width: 120,
		text: 'name',
		value: 'id',
		defaultSelected: -1,
		callback: {
			onChange: function(obj) {
				opts.callbackfn && opts.callbackfn.call(null, obj);
			}
		}
	}, opts);

	return $_obj.combo(opts).getCombo();
};
//input占位符
$.fn.placeholder = function(){
	this.each(function() {
		$(this).focus(function(){
			if($.trim(this.value) == this.defaultValue){
				this.value = '';
			}
			$(this).removeClass('input-ph');
		}).blur(function(){
			var val = $.trim(this.value);
			if(val == '' || val == this.defaultValue){
				$(this).addClass('input-ph');
			}
			val == '' && $(this).val(this.defaultValue);
		});
	});
};

