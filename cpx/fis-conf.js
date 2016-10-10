/*设置忽略文件*/
fis.set('project.ignore', ['static/**/*.less', 'package.json', 'fis-conf.js']);

fis.match('**.less', {
		parser: fis.plugin('less'),
		rExt: '.css'
	})
	.match('widget/modules/**/*.js', {
		isMod: false,
		useSameNameRequire: true
	})
	.match('widget/cpx_modules/**/*.js', {
		isMod: true,
		useSameNameRequire: true
	})
	// .match('widget/modules/dialog/*.js', {
	// 	packTo: '/widget/modules/dialog/dialog.js'
	// })
	.match(/(jquery|sea|common)\.js$/, { //基础的js 合并到 global.js 中
		packTo: '/static/lib/global.js'
	})
	.match('**.handlebars', {
		rExt: '.js', // from .handlebars to .js 虽然源文件不需要编译，但是还是要转换为 .js 后缀
		parser: fis.plugin('handlebars-3.x', {
			//fis-parser-handlebars-3.x option
		}),
		release: false // handlebars 源文件不需要编译
	})
	.match('::package', {
		postpackager: [fis.plugin('loader', {
			useInlineMap: true // 资源映射表内嵌
		})]
	});

// 此配置 可以使js文件引用时减少书写引用

fis.hook('cmd', {
	baseUrl: './widget/',
	paths: {
		'dialog': 'modules/dialog/dialog',
		'laydate': 'modules/laydate/laydate',
		'select': 'modules/select/select',
		'combo': 'modules/select/combo',
		'dropdown': 'modules/dropdown/dropdown',
		'upload': 'modules/temporary/upload',
		'autocompleter': 'modules/autocompleter/autocompleter',

		'grid': 'modules/ligerui/grid',
		'textbox':'modules/ligerui/textbox'
		
		
	}
});

/**
 * 开发环境
 */
fis.media('dev')
	.match('/page/**.html', {
		rExt: '.blade.php'	
	})
	.match('*', {
		domain: 'http://127.0.0.1:4000/cpx-dev',
		deploy: fis.plugin('local-deliver', {
			to: '../cpx-dev'
		})
	});

/**
 * 发布
 *  压缩、合并、文件指纹
 */
fis.media('prod')
	.match('**.less', {
		parser: fis.plugin('less'),
		rExt: '.css',
		optimizer: fis.plugin('clean-css', {
			'keepBreaks': true //保持一个规则一个换行
		}),
		//useHash: true	
	})
	.match('**.js', {
		optimizer: fis.plugin('uglify-js'),
		//useHash: true
	})
	.match('**.png', {
		optimizer: fis.plugin('png-compressor')
	})
	// .match('::image', {
	//     useHash: true,
	//     useSprite: true,
	//     spriter: fis.plugin('csssprites')
	// })
	.match('::package', {
		postpackager: [fis.plugin('loader', {
			useInlineMap: false // 资源映射表内嵌
		})]
	})
	.match('*', {
		domain: 'http://127.0.0.1:4000/cpx-dist',
		deploy: fis.plugin('local-deliver', {
			to: '../cpx-dist'
		})
	});