const helper = require('./helper')
const path = require('path')
const optimImages = require('./image-optim')
const optimHTML = require('./html-optim')
const optimizeCSS = require('./css-optim')
const optimZIP = require('./zip-optim')
const fs = require('fs-extra')


var app = {}


app.copy = function (settings) {
    // prepare
    fs.removeSync(settings.outputDir)
    fs.mkdirSync(settings.outputDir)
    fs.copySync(settings.inputDir, settings.outputDir)
}

app.optimizeImages = function (settings) {
    //optimize
    var files = fs.walkSync(settings.outputDir)
    return optimImages.optimizeFileList(files, settings);

}

app.optimizeHTML = function (settings) {
    //optimize
    var files = fs.walkSync(settings.outputDir)
    return optimHTML.optimizeFileList(files, settings);

}

app.optimizeCSS = function (settings) {
    //optimize
    var files = fs.walkSync(settings.outputDir)
    return optimizeCSS.optimizeFileList(files.filter(function (entry) {
        return ['.css'].indexOf(path.extname(entry)) > -1
    }), {
        htmlFiles: files.filter(function (entry) {
            return ['.htm', '.html'].indexOf(path.extname(entry)) > -1
        })
    }, settings);
}

app.zip = function (settings) {
    var files = fs.walkSync(settings.outputDir)
    return optimZIP.optimizeFileList(files, settings)
}

module.exports = app;