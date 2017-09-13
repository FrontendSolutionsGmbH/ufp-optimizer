const path = require('path')
const optimImages = require('./ImageOptim')
const optimHTML = require('./HtmlOptim')
const optimizeCSS = require('./CssOptim')
const optimZIP = require('./ZipOptim')
const fs = require('fs-extra')

var UfpOptimizer = {}

UfpOptimizer.execute = function (settings) {
    console.log('* step0 - copy: started')
    UfpOptimizer.copy(settings)
    console.log('* step0 - copy: finished')
    // app.optimizeCSS()

    console.log('** step1 - image/html/css: started')
    Promise.all([
        UfpOptimizer.optimizeImages(settings),
        UfpOptimizer.optimizeHTML(settings)]).then(function () {
        console.log('** step1 - image/html/css: finished')

        console.log('*** step2 - compression: started')
        var result = UfpOptimizer.zip(settings)
        console.log('*** step2 - compression: finished')
        return result
    })
}

UfpOptimizer.getDefaultSettings = function () {
    return require('./Globals')
}

UfpOptimizer.copy = function (settings) {
    // prepare
    fs.removeSync(settings.outputDir)
    fs.mkdirSync(settings.outputDir)
    fs.copySync(settings.inputDir, settings.outputDir)
}

UfpOptimizer.optimizeImages = function (settings) {
    // optimize
    var files = fs.walkSync(settings.outputDir)
    return optimImages.optimizeFileList(files, settings)
}

UfpOptimizer.optimizeHTML = function (settings) {
    // optimize
    var files = fs.walkSync(settings.outputDir)
    return optimHTML.optimizeFileList(files, settings)
}

UfpOptimizer.optimizeCSS = function (settings) {
    // optimize
    var files = fs.walkSync(settings.outputDir)
    return optimizeCSS.optimizeFileList(files.filter(function (entry) {
        return ['.css'].indexOf(path.extname(entry)) > -1
    }), {
        htmlFiles: files.filter(function (entry) {
            return ['.htm', '.html'].indexOf(path.extname(entry)) > -1
        })
    }, settings)
}

UfpOptimizer.zip = function (settings) {
    var files = fs.walkSync(settings.outputDir)
    return optimZIP.optimizeFileList(files, settings)
}

module.exports = UfpOptimizer
