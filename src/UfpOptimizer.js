const path = require('path')
const optimImages = require('./ImageOptim')
const optimHTML = require('./HtmlOptim')
const optimizeCSS = require('./CssOptim')
const optimZIP = require('./ZipOptim')
const fs = require('fs-extra')
const defaultsDeep = require('lodash.defaultsdeep')
const cloneDeep = require('lodash.clonedeep')

var UfpOptimizer = {}


require('events').EventEmitter.defaultMaxListeners = Infinity


UfpOptimizer.executeOptimizations = function (settings) {
    // app.optimizeCSS()

    var afterCopy = function () {
        return Promise.all([
            UfpOptimizer.optimizeImages(settings),
            UfpOptimizer.optimizeHTML(settings)]).then(function () {
            var result = UfpOptimizer.zip(settings)
            return result
        })
    }

    return UfpOptimizer.copy(settings).then(afterCopy)
}

UfpOptimizer.getConfig = function (preset, customConfigSettings) {
    return defaultsDeep(cloneDeep(customConfigSettings) || {}, require('./Globals').getConfig(preset || (customConfigSettings && customConfigSettings.preset)))
}

UfpOptimizer.getConfigHelp = function (preset) {
    return require('./Globals').getConfigHelp(preset)
}

UfpOptimizer.validateConfig = function (config, autofix) {
    return require('./Globals').validateConfig(config)
}


UfpOptimizer.copy = function (settings) {
    return new Promise(function (resolve, reject) {
        console.log('* ufp-optimizer copy: started', settings.inputDir, '=>', settings.outputDir)

        if (!fs.existsSync(settings.inputDir)) {
            console.log('ERROR: input dir does not exist', settings.inputDir)
            reject(settings.inputDir)
        } else {
            if (settings.outputDir !== settings.inputDir) {
                // prepare

                fs.removeSync(settings.outputDir)
                fs.mkdirSync(settings.outputDir)
                fs.copySync(settings.inputDir, settings.outputDir)

                console.log('* ufp-optimizer - copy: finished')
            } else {
                console.log('* ufp-optimizer - copy: finished did nothing')
            }

            resolve()
        }
    })
}

UfpOptimizer.optimizeImages = function (settings) {
    console.log('** ufp-optimizer  - image/html/css: started')
    var files = fs.walkSync(settings.outputDir)
    return optimImages.optimizeFileList(files, settings).then(function (result) {
        console.log('** ufp-optimizer  - image/html/css: finished')
        return result
    })
}

UfpOptimizer.optimizeHTML = function (settings) {
    console.log('** ufp-optimizer  - image/html/css: started')
    // optimize
    var files = fs.walkSync(settings.outputDir)
    return optimHTML.optimizeFileList(files, settings).then(function (result) {
        console.log('** ufp-optimizer  - image/html/css: finished')
        return result
    })
}

UfpOptimizer.optimizeCSS = function (settings) {
    console.log('** ufp-optimizer  - image/html/css: started')
    // optimize
    var files = fs.walkSync(settings.outputDir)
    return optimizeCSS.optimizeFileList(files.filter(function (entry) {
        return ['.css'].indexOf(path.extname(entry)) > -1
    }), {
        htmlFiles: files.filter(function (entry) {
            return ['.htm', '.html'].indexOf(path.extname(entry)) > -1
        })
    }, settings).then(function (result) {
        console.log('** ufp-optimizer  - image/html/css: finished')
        return result
    })
}

UfpOptimizer.zip = function (settings) {
    console.log('*** ufp-optimizer  - zip: started')
    var files = fs.walkSync(settings.outputDir)
    return optimZIP.optimizeFileList(files, settings).then(function (result) {
        console.log('*** ufp-optimizer  - zip: finished')
        return result
    })
}

module.exports = UfpOptimizer
