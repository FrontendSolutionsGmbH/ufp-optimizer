const path = require('path')
const optimImages = require('./ImageOptim')
const optimHTML = require('./HtmlOptim')
const optimizeCSS = require('./CssOptim')
const optimZIP = require('./ZipOptim')
const optimCopy = require('./CopyOptim')
const optimHtAccess = require('./HtAccessOptim')
const fs = require('fs-extra')
const defaultsDeep = require('lodash.defaultsdeep')
const Logger = require('./Logger')
const Helper = require('./Helper')

const cloneDeep = require('lodash.clonedeep')

var UfpOptimizer = {}

var logOptimizerStart = function (optimizer) {
    Logger.info('** ' + optimizer.getName() + ' started' + ' **')
}

var logOptimizerEnd = function (optimizer) {
    Logger.info('** ' + optimizer.getName() + ' finished' + ' **')
}

require('events').EventEmitter.defaultMaxListeners = Infinity

UfpOptimizer.executeOptimizations = function (settings) {
    var doHtAccess = function () {
        return UfpOptimizer.optimizeHtAccess(settings)
    }

    var doImageOptimization = function () {
        return UfpOptimizer.optimizeImages(settings);
    }

    var doHTMLOptimization = function () {
        return UfpOptimizer.optimizeHTML(settings);
    }
    var doCssOptimization = function () {
        return UfpOptimizer.optimizeCSS(settings)
    }

    var doZip = function () {
        return UfpOptimizer.zip(settings)
    }
    return UfpOptimizer.copy(settings).then(doImageOptimization).then(doHTMLOptimization).then(doCssOptimization).then(doZip).then(doHtAccess)
}

UfpOptimizer.getConfig = function (preset, customConfigSettings) {
    return defaultsDeep(cloneDeep(customConfigSettings) || {}, require('./Globals').getConfig(preset || (customConfigSettings && customConfigSettings.preset)))
}

UfpOptimizer.setLogLevelByConfig = function (config) {
    Logger.setLevel(config.debug && (config.debug === 'true' || config.debug === true) ? 'debug' : 'info')
}

UfpOptimizer.getConfigHelp = function (preset) {
    return require('./Globals').getConfigHelp(preset)
}

UfpOptimizer.validateConfig = function (config, autofix) {
    return require('./Globals').validateConfig(config, autofix)
}

UfpOptimizer.copy = function (settings) {
    if (settings.optimizer.copyOptim.enabled === false) {
        return Helper.emptyPromise(settings)
    }
    logOptimizerStart(optimCopy)

    return optimCopy.optimize(settings).then(function (result) {
        logOptimizerEnd(optimCopy)
        return result
    })
}

UfpOptimizer.optimizeImages = function (settings) {
    if (settings.optimizer.imageOptim.enabled === false) {
        return Helper.emptyPromise(settings)
    }
    logOptimizerStart(optimImages)

    var files = fs.walkSync(settings.outputDir)
    return optimImages.optimizeFileList(files, settings).then(function (result) {
        logOptimizerEnd(optimImages)
        return result
    })
}

UfpOptimizer.optimizeHTML = function (settings) {
    if (settings.optimizer.htmlOptim.enabled === false) {
        return Helper.emptyPromise(settings)
    }

    logOptimizerStart(optimHTML)

    // optimize
    var files = fs.walkSync(settings.outputDir)
    return optimHTML.optimizeFileList(files, settings).then(function (result) {
        logOptimizerEnd(optimHTML)
        return result
    })
}

UfpOptimizer.optimizeHtAccess = function (settings) {
    if (settings.optimizer.htaccessOptim.enabled === false) {
        return Helper.emptyPromise(settings)
    }

    logOptimizerStart(optimHtAccess)

    // optimize
    var files = fs.walkSync(settings.outputDir)
    return optimHtAccess.optimizeFileList(files, settings).then(function (result) {
        logOptimizerEnd(optimHtAccess)
        return result
    })
}

UfpOptimizer.optimizeCSS = function (settings) {
    if (settings.optimizer.cssOptim.enabled === false) {
        return Helper.emptyPromise(settings)
    }

    logOptimizerStart(optimizeCSS)

    // optimize
    var files = fs.walkSync(settings.outputDir)
    return optimizeCSS.optimizeFileList(files.filter(function (entry) {
        return ['.css'].indexOf(path.extname(entry)) > -1
    }), {
        htmlFiles: files.filter(function (entry) {
            return ['.htm', '.html'].indexOf(path.extname(entry)) > -1
        })
    }, settings).then(function (result) {
        logOptimizerEnd(optimizeCSS)
        return result
    })
}

UfpOptimizer.zip = function (settings) {
    if (settings.optimizer.zipOptim.enabled === false) {
        return Helper.emptyPromise(settings)
    }

    logOptimizerStart(optimZIP)

    var files = fs.walkSync(settings.outputDir)
    return optimZIP.optimizeFileList(files, settings).then(function (result) {
        logOptimizerEnd(optimZIP)
        return result
    })
}

module.exports = UfpOptimizer
