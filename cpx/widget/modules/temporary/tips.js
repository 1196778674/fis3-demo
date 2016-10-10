define(function (require, exports, module) {
	var defaults = {
		renderTo: 'body',
		type : 1,
		autoClose : true,
		removeOthers : true,
		time : 3000,
		top : 15,
		onClose : null,
		onShow : null	
	};

	var Tips = function(options) {
		this.options = $.extend({}, defaults, options);
		this._init();
		!this._collection ?  this._collection = [this] : this._collection.push(this);	
	}

	Tips.prototype = {
		_init: function() {
			var self = this,
				opts = this.options, time;

			if(opts.removeOthers){
				this.removeAll();
			}
			this._create();
			this.closeBtn.on('click',function() { self.remove() });
			if(self.autoClose) {
				window.setTimeout(function() {
					self.remove();
				}, self.time);
			}
		},
		_create: function() {
			var opts = this.options;

			this.obj = $('').append(opts.content);
			switch(opts.type) {
				case 0 :
					this.obj.addClass('ui-tips-success');
				case 1 :
					this.obj.addClass('ui-tips-warning');
				case 2 :
					this.obj.addClass('ui-tips-error');
			}
			this.obj.appendTo('body').hide();
			this._setPos();
			if(opts.onShow) {
				opts.onShow();
			}
		},
		_setPos: function() {
			var self = this, opts = this.options;
			var h =  this.obj.outerHeight(), winH = $(window).height(), scrollTop = $(window).scrollTop();
			var top = parseInt(opts.top) + scrollTop;

			if(opts.width){
				this.obj.css('width', opts.width);
			}
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
		remove: function() {
			var opts = this.options;
			
			this.obj.fadeOut(200, function(){
				$(this).remove();
				if(opts.onClose){
					opts.onClose();
				}
			});	
		},
		removeAll: function() {
			var self = this;
			try {
				for(var i=self._collection.length-1; i>=0; i--){
					self._collection[i].remove();
				}
			}catch(e){}	
		}
	};

	module.exports = Tips;
});