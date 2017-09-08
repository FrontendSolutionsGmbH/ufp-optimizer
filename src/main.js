
const globals = require('./globals')
const helper = require('./helper')
const path = require('path')
const optimImages = require('./image-optim')
const optimHTML = require('./html-optim')
const optimizeCSS = require('./css-optim')
const optimGZIP = require('./gzip-optim')
const settings = require('./settings')
const fs = require('fs-extra')


var app = {}


app.copy = function() {
	// prepare
	fs.removeSync(globals.outputDir)
	fs.mkdirSync(globals.outputDir)
	fs.copySync(globals.inputDir, globals.outputDir)
}

app.optimizeImages = function() {
	//optimize
	var files = fs.walkSync(globals.outputDir)
	optimImages.optimizeFileList(files);

}

app.optimizeHTML = function() {
	//optimize
	var files = fs.walkSync(globals.outputDir)
	optimHTML.optimizeFileList(files);

}

app.optimizeCSS = function() {
	//optimize
	var files = fs.walkSync(globals.outputDir)
	optimizeCSS.optimizeFileList(files.filter(function(entry) {
		return ['.css'].indexOf(path.extname(entry)) > -1
	}), {htmlFiles: files.filter(function(entry) {
		return ['.htm', '.html'].indexOf(path.extname(entry)) > -1
	})});
}

app.gzip = function() {
	var files = fs.walkSync(globals.outputDir)
	optimGZIP.optimizeFileList(files)
}

module.exports = app;