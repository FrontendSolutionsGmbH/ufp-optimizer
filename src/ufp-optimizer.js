const helper = require('./helper')
const path = require('path')
const optimImages = require('./image-optim')
const optimHTML = require('./html-optim')
const optimizeCSS = require('./css-optim')
const optimZIP = require('./zip-optim')
const fs = require('fs-extra')


var app = {}


app.execute = function (settings) {
    console.log('* step0 - copy: started')
    app.copy(settings)
    console.log('* step0 - copy: finished')
    //app.optimizeCSS()

    console.log('** step1 - image/html/css: started')
    Promise.all([
        app.optimizeImages(settings),
        app.optimizeHTML(settings)]).then(function () {
        console.log('** step1 - image/html/css: finished')

        console.log('*** step2 - compression: started')
        app.zip(settings)
        console.log('*** step2 - compression: finished')
    })

}

app.getDefaultSettings = function () {
    return require('./globals');
}

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