define(function (require, exports, module) {

	var invoicedetail = {
		init: function() {
			var self = this;
			//展开折叠
            $('.fold').on('click', function() {
                var $this = $(this);
                var thisClass = $this.attr('class'),
                    $parent = $(this).parents('tr'),
                    id = $parent.attr('id');

                if(thisClass.indexOf('foldless') == -1) {
                    $('tr[data-id="'+id+'"]').show();
                    $this.addClass('foldless');    
                }else {
                    $('tr[data-id="'+id+'"]').hide();
                    $this.removeClass('foldless');
                }   
            });
		}
	};

	exports.init = function() {
		invoicedetail.init();	
	}
});