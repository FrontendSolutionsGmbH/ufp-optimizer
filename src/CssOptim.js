const path = require('path')
const fs = require('fs-extra')
const Logger = require('./Logger')
const helper = require('./Helper')
const postcssnext = require('postcss-cssnext')
const postcssclean = require('postcss-clean')
const postcss = require('postcss')

var CssOptim = {}

CssOptim.optimizeFile = function (fileName, settingsHtmlFiles, settings) {
    return new Promise(function (resolve, reject) {
        var cssOptimSettings = settings.optimizer.cssOptim

        if (cssOptimSettings.enabled && cssOptimSettings.options.postCss.enabled) {
            var resultStats = helper.getOptimizationResultForFileBefore(fileName, fileName, CssOptim, 'post-css')

            var source = fs.readFileSync(fileName, 'utf8')

            var plugins = []

            if (cssOptimSettings.options.postCss.options.postCssNext.enabled) {
                var optionsNext = cssOptimSettings.options.postCss.options.postCssNext.options
                plugins.push(postcssnext(optionsNext))
            }

            if (cssOptimSettings.options.postCss.options.postCssClean.enabled) {
                var optionsClean = cssOptimSettings.options.postCss.options.postCssClean.options
                plugins.push(postcssclean(optionsClean))
            }
            try {
                postcss(plugins).process(source).then(function (output) {
                    fs.outputFileSync(fileName + 'temp', output.css)
                    if (helper.getFilesizeInBytes(fileName + 'temp') < helper.getFilesizeInBytes(fileName) || cssOptimSettings.options.postCss.options.postCssNext.enabled) {
                        fs.renameSync(fileName + 'temp', fileName)
                    } else {
                        fs.unlinkSync(fileName + 'temp')
                    }

                    fs.outputFileSync(fileName + '.map', output.sourceMap)
                    resolve(helper.updateOptimizationResultForFileAfter(resultStats))
                    return resultStats
                }).catch(function (error) {
                    Logger.error('cleanCss-error', JSON.stringify(error).substr(0, 500))
                    resolve(helper.updateOptimizationResultForFileAfter(resultStats))

                })
            }
            catch (ex) {
                resolve(null)
            }

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
