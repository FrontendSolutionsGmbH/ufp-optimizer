var globals = {};

globals.inputDir = "example/input"
globals.outputDir = "dist"
globals.optionsPNG = {quality: '0'}
globals.optionsMOZJPEG = {quality: '65-80'}
globals.optionsSVG = {plugins: [{removeViewBox: false}]}
globals.optionsGIF = {lossy: 80}
globals.optionsWEBP = {quality: 80}
globals.optionsJPEGRECOMPRESS = {quality: "low"}
globals.optionsPNGCrush = {}
globals.htaccessFile = "src/.htaccess"
globals.delete = []
globals.uncssOptions = {ignore: ['.class1'],ignoreSheets : [/fast.fonts.net/]}
globals.htmlminifyOptions = {}
globals.customImageOptions = [
	{
		key: 'ui/navopen.png',
		value: {
			optionsPNG: {quality: '0'},
			optionsPNGCrush: {reduce: true}
		}
	}
]

require('events').EventEmitter.defaultMaxListeners = Infinity;

module.exports = globals;

/*
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
