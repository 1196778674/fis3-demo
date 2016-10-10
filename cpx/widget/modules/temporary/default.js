/**
 * 初始化一些系统级别的方法
 * @auoth drank
 */
var $pageTab = $('#page-tab'), $leftNavList = $('#leftNavList');

(function($) {
	function lfh() {
		return document.body.scrollHeight >= window.innerHeight ? document.body.scrollHeight : window.innerHeight;
	}

	function setTabHeight() {
		var $tab = $('#mainBg'),
			winHeight = $(window).height(); //winHeight 还可以再做调整
		var height = winHeight - $tab.offset().top;

		$tab.height(height);
		$leftNavList.css('height', (lfh() - 50) + 'px'); //顺带设置leftnav height	
	}
	setTabHeight();

	//浏览器窗口发生变化时重置 #mainBg的高度
	$(window).on('resize', function() {
		setTabHeight();
	});

	//设置左侧导航事件
	$('#leftNavList .item').hover(function(e) { //sub-nav-wrap 位置都已经设置好
		$(this).children('.sub-nav-wrap').stop(true, true).show();
	}, function(e) {
		$(this).children('.sub-nav-wrap').stop(true, true).hide();
	});

	//点击 A=>sub-nav-wrap a 以后 A隐藏
	$('.sub-nav-wrap a').on('click', function() {
		$(this).parents('.sub-nav-wrap').hide();
	});
})(jQuery);

//设置tab部分的一些事件
$pageTab.ligerTab({
	showSwitchInTab: true,
	showSwitch: true,
	height: '100%',
	changeHeightOnResize: true,
	onBeforeAddTabItem: function(tabid) {
		//tabid != 'index' ? setCurrentNav(tabid) : 'undefined';
	},
	onAfterAddTabItem: function(tabid) {
		//setCurrentNav(tabid);
	},
	onAfterSelectTabItem: function(tabid) {
		tabid != 'index' ? setCurrentNav(tabid) : $leftNavList.find('.item').removeClass('active');
	},
	onBeforeRemoveTabItem: function(tabid) {

	},
	onAfterLeaveTabItem: function(tabid) { /** 暂时用不到 */ }
});

//显示左侧当前一级导航的位置
function setCurrentNav(tabid) {
	if (!tabid) {
		return;
	}
	var pre = tabid.match((/([a-zA-Z]+)[-]?/))[1];
	$('#leftNavList li').removeClass('active');
	$('#leftNavList li.item-' + pre).addClass('active');
}

//增加页签
var tab = $pageTab.ligerGetTabManager();

$('#leftNavList').on('click', 'a[rel="pageTab"]', function(e) {
	e.preventDefault();
	var $this = $(this),
		tabid = $this.attr('tabid'),
		url = $this.attr('href'),
		text = $this.text().replace('+', ''), //去掉+号
		ischild = $this.data('ischild'),
		showclose = $this.data('showclose');

	if (!!ischild) {
		parent.tab.addTabItem({
			tabid: tabid,
			text: text,
			url: url,
			showClose: showclose
		});
	} else {
		tab.addTabItem({
			tabid: tabid,
			text: text,
			url: url,
			showClose: showclose
		});
	}
});

//初始化首页
tab.addTabItem({
	tabid: 'index',
	text: '首页',
	url: '/page/index.html',
	showClose: false
});
