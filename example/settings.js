var settings = {};

settings.delete = []
settings.uncssOptions = {ignore: ['.navIsOpen','.isOpen','.implinkHidden','.contactFormWrapperOpen','.loader','.nav','#nav','.navWrap', '.wrap', '.openNav','.isOpen .navWrap'],ignoreSheets : [/fast.fonts.net/]}
settings.htmlminifyOptions = {}/*
{removeComments : true, 
	collapseWhitespace: true, 
	conservativeCollapse: true, 
	collapseInlineTagWhitespace:false,
	minifyCSS: false,
	minifyJS: false,
	removeEmptyAttributes: false,
	removeEmptyElements: false,
	removeOptionalTags: false,
	removeRedundantAttributes: false,


}*/
settings.customImageOptions = [
	{
		key: 'ui/navopen.png',
		value: {
			optionsPNG: {quality: '0'},
			optionsPNGCrush: {reduce: true}
		}
	}
]

module.exports = settings;