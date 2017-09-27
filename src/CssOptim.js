const path = require('path')
const CleanCSS = require('clean-css')
const fs = require('fs-extra')
const Logger = require('./Logger')
var CssOptim = {}

CssOptim.optimizeFile = function (fileName, settingsHtmlFiles, settings) {
    return new Promise(function (resolve) {
        var cssOptimSettings = settings.optimizer.cssOptim

        if (cssOptimSettings.enabled && cssOptimSettings.options.uncss.enabled) {
            var uncss = require('uncss')
            var source = fs.readFileSync(fileName, 'utf8')

            uncss(settingsHtmlFiles.htmlFiles, cssOptimSettings.options.uncss.options, function (error, sourcePurified) {
                var result = new CleanCSS({sourceMap: true}).minify(sourcePurified)

                Logger.debug('css purify ' + fileName, 'reduction: ', Math.round((source.length - sourcePurified.length) / 1024) + 'kb', Math.round((1 - sourcePurified.length / source.length) * 100) + '%')
                Logger.debug('css minify ' + fileName, 'reduction: ', Math.round((sourcePurified.length - result.styles.length) / 1024) + 'kb', Math.round((1 - result.styles.length / sourcePurified.length) * 100) + '%')
                Logger.debug('css total ' + fileName, 'reduction: ', Math.round((source.length - result.styles.length) / 1024) + 'kb', Math.round((1 - result.styles.length / source.length) * 100) + '%')

                fs.outputFileSync(fileName, result.styles)
                fs.outputFileSync(fileName + '.map', result.sourceMap)

                if (error) {
                    Logger.error('uncss-error', error)
                }
                resolve()
            })
        } else {
            resolve()
        }
    })
}

CssOptim.optimizeFileList = function (fileList, settingsHtmlFiles, settings) {
    var actions = fileList.filter(function (entry) {
        if (entry && entry.length > 0) {
            var ext = path.extname(entry)
            if (['.css'].indexOf(ext) > -1) {
                return true
            } else {
                return false
            }
        }
    }).map(function (entry) {
        return CssOptim.optimizeFile(entry, settingsHtmlFiles, settings)
    })

    return Promise.all(actions).then(function (result) {
        Logger.debug('all css files optimized')
        return result
    })
}


CssOptim.getName = function () {
    return 'css'
}

module.exports = CssOptim
