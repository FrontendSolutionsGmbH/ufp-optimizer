const globals = require('./globals')
const settings = globals;
const helper = require('./helper')
const path = require('path')
const fs = require('fs-extra')
 var minify = require('html-minifier').minify;

var optim = {}

optim.optimizeFile = function(fileName, options) {
	var result = fs.readFileSync(fileName, 'utf8')
	var resultMinified = minify(result, settings.htmlminifyOptions);
	console.log('html minify '+ fileName, 'reduction: ',Math.round((result.length-resultMinified.length)/1024) + 'kb', Math.round((1-resultMinified.length/result.length)*100) + '%')
	fs.outputFileSync(fileName, resultMinified)

	return result;
  	
}

optim.optimizeFileList = function(fileList, options) {

	fs.copySync(globals.htaccessFile, globals.outputDir + "/.htaccess")


	var actions = fileList.filter(function(entry) {
		if (entry && entry.length > 0) {
			var ext = path.extname(entry);
			var dir = path.dirname(entry);
			if (['.php'].indexOf(ext) > -1 && dir === globals.outputDir) {
				return true;
			}
		}
	}).map(function(entry) {
		return optim.optimizeFile(entry, options)
	});


	// delete all php stuff
	return Promise.all(actions).then(function(result) {
		fileList.filter(function(entry) {
			if (entry && entry.length > 0) {
				var ext = path.extname(entry);
				if (['.html', '.htm'].indexOf(ext) > -1) {
					return true;
				}
			}
		}).map(function(entry) {
			return optim.optimizeFile(entry,options)
		});

	}).then(function(result) {
		console.log('all html files optimized')
	})

}

module.exports = optim;