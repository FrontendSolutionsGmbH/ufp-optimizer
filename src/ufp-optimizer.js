const settings = require('./globals')
const helper = require('./helper')
const path = require('path')
const optimImages = require('./image-optim')
const optimHTML = require('./html-optim')
const optimizeCSS = require('./css-optim')
const optimGZIP = require('./gzip-optim')
const fs = require('fs-extra')


var app = {}


app.copy = function () {
    // prepare
    fs.removeSync(settings.outputDir)
    fs.mkdirSync(settings.outputDir)
    fs.copySync(settings.inputDir, settings.outputDir)
}

app.optimizeImages = function () {
    //optimize
    var files = fs.walkSync(settings.outputDir)
    return optimImages.optimizeFileList(files);

}

app.optimizeHTML = function () {
    //optimize
    var files = fs.walkSync(settings.outputDir)
    return optimHTML.optimizeFileList(files);

}

app.optimizeCSS = function () {
    //optimize
    var files = fs.walkSync(settings.outputDir)
    return optimizeCSS.optimizeFileList(files.filter(function (entry) {
        return ['.css'].indexOf(path.extname(entry)) > -1
    }), {
        htmlFiles: files.filter(function (entry) {
            return ['.htm', '.html'].indexOf(path.extname(entry)) > -1
        })
    });
}

app.gzip = function () {
    var files = fs.walkSync(settings.outputDir)
    return optimGZIP.optimizeFileList(files)
}

module.exports = app;