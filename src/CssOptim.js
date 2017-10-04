const path = require('path')
const fs = require('fs-extra')
const Logger = require('./Logger')
const helper = require('./Helper')
const CleanCSS = require('clean-css')

var CssOptim = {}

CssOptim.optimizeFile = function (fileName, settingsHtmlFiles, settings) {
    return new Promise(function (resolve, reject) {
        var cssOptimSettings = settings.optimizer.cssOptim

        if (cssOptimSettings.enabled && cssOptimSettings.options.cleanCss.enabled) {
            var resultStats = helper.getOptimizationResultForFileBefore(fileName, fileName, CssOptim, 'uncss')

            var options = cssOptimSettings.options.cleanCss.options
            options.returnPromise = true

            var source = fs.readFileSync(fileName, 'utf8')

            new CleanCSS(options)
                .minify(source)
                .then(function (output) {
                    fs.outputFileSync(fileName + 'temp', output.styles)
                    if (helper.getFilesizeInBytes(fileName + 'temp') < helper.getFilesizeInBytes(fileName)) {
                        fs.renameSync(fileName + 'temp', fileName)
                    } else {
                        fs.unlinkSync(fileName + 'temp')
                    }

                    fs.outputFileSync(fileName + '.map', output.sourceMap)
                    resolve(helper.updateOptimizationResultForFileAfter(resultStats))
                    return resultStats
                })
                .catch(function (error) {
                    Logger.error('cleanCss-error', error)
                    reject(error)
                })
        }
        else {
            resolve(null)
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
        //console.log('all Css files written', helper.getOptimizationResultForOptimizer(result, CssOptim))
        return helper.getOptimizationResultForOptimizer(result, CssOptim)
    })
}

CssOptim.getName = function () {
    return 'css'
}

module.exports = CssOptim
