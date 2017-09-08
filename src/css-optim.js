const globals = require('./globals')
const settings = require('./settings')
const helper = require('./helper')
const path = require('path')
const CleanCSS = require('clean-css')
const fs = require('fs-extra')
var optim = {}

optim.optimizeFile = function(fileName, options) {

	return new Promise(function(fulfill, reject) {
		var uncss = require('uncss');
		var source = fs.readFileSync(fileName, 'utf8')


		uncss(options.htmlFiles, settings.uncssOptions, function (error, sourcePurified) {

			var imageDir = path.dirname(fileName);
			var result = new CleanCSS({sourceMap: true}).minify(sourcePurified)

			console.log('css purify '+ fileName, 'reduction: ', Math.round((source.length-sourcePurified.length)/1024) + 'kb', Math.round((1-sourcePurified.length/source.length)*100) + '%')
			console.log('css minify '+ fileName, 'reduction: ',Math.round((sourcePurified.length-result.styles.length)/1024) + 'kb', Math.round((1-result.styles.length/sourcePurified.length)*100) + '%')
			console.log('css total '+ fileName, 'reduction: ',Math.round((source.length-result.styles.length)/1024) + 'kb', Math.round((1-result.styles.length/source.length)*100) + '%')
		
			fs.outputFileSync(fileName, result.styles)
			fs.outputFileSync(fileName + ".map", result.sourceMap)

			fulfill()

		});

	})
}

optim.optimizeFileList = function(fileList, options) {

	var actions = fileList.filter(function(entry) {
		if (entry && entry.length > 0) {
			var ext = path.extname(entry)
			if (['.css'].indexOf(ext) > -1) {
				return true
			} else {
				return false
			}
		}
	}).map(function(entry) {
		return optim.optimizeFile(entry,options)
	});

	return Promise.all(actions).then(function(result) {
		console.log('all css files optimized')
	})
}

module.exports = optim;