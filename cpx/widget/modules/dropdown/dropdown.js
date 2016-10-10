define(function(require, exports, module) {
    /**
     * 更多查询条件下拉
     * @type dom 下拉dom
     * @type options {
     *       template: 更多的内容,
     *       callbackConfirm: 确认后的回调函数,
     *       afterInit: 初始化完成后的回调函数            
     * }
     * @example 
     * var dropdown = require('dropdown');
     * dropdown('#msCnd', {
     *     template: '<div>test</div>',
     *     callbackConfirm: function(){console.log('test');}    
     * });
     */
    var dropdown = {
        init: function(dom, options) {
            var self = dropdown;
            
            self.opts = $.extend(true, {}, self.defaults, options);
            self.$prev = $(dom);
            self.$dropdownMenu = $(self.opts.htm);
            self.$body = self.$dropdownMenu.find('.mscnd-content');
            self.$cancle = self.$dropdownMenu.find('.mscndcancle');
            self.$confirm = self.$dropdownMenu.find('.mscndconfirm');

            self.$body.prepend(self.opts.template);

            self.$prev.on('click', self.preFn);
            self.$cancle.on('click', self.cancleFn);
            self.$confirm.on('click', self.confirmFn);
            //self.documentCancle();
            self.$dropdownMenu.insertAfter(self.$prev);
            self.opts.afterInit(self);
        },
        preFn: function(e) {
            var self = dropdown;
            var className = self.$prev.attr('class');
            
            if(className.indexOf('up') == -1) {
                self.$dropdownMenu.slideDown('300');
                self.$prev.addClass('up');   
            }else{
                self.cancleFn();
            }
            e.stopPropagation();
        },
        confirmFn: function() {
            var self = dropdown;

            self.opts.callbackConfirm && self.opts.callbackConfirm.call(null, self);
            self.cancleFn();
        },
        cancleFn: function() {
            var self = dropdown;

            self.$dropdownMenu.slideUp('300');
            self.$prev.removeClass('up');
        },
        documentCancle: function() {
            var self = dropdown;

            $(document).on('click', function(e) {
                e.stopPropagation();
                self.cancleFn();
            });
        },
        defaults: {
            htm: '<ul class="dropdown-menu">' +
                '<li>' +
                    '<div class="mscnd-content cpx-form">' +
                        '<div class="btns">' +
                            '<button type="button" class="btn btn-common mscndconfirm">确定</button>' +
                            '<button type="button" class="btn btn-default mscndcancle">取消</button>' +
                        '</div>' +
                    '</div>' +
                '</li>' +
                '</ul>'
        }      
    };

    module.exports = dropdown.init;
});