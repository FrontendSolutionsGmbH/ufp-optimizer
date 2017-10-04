const path = require('path')
const fs = require('fs-extra')
const Logger = require('./Logger')
const helper = require('./Helper')
var minify = require('uglify-js').minify

var JsOptim = {}

JsOptim.optimizeFile = function (fileName, settings) {
    var JsOptimSettings = settings.optimizer.jsOptim

    return new Promise(function (resolve, reject) {
        if (JsOptimSettings.enabled && JsOptimSettings.options.uglifyJs.enabled) {
            var result = fs.readFileSync(fileName, 'utf8')
            var resultMinified = result

            var resultStats = helper.getOptimizationResultForFileBefore(fileName, fileName, JsOptim, 'uglify-js')

            try {
                resultMinified = minify(result, JsOptimSettings.options.uglifyJs.options)
            } catch (ex) {
                Logger.error('js error catched', fileName)
            }

            if (resultMinified.error) {
                Logger.error(resultMinified.error)
                reject(resultMinified.error)
            } else {
                fs.outputFileSync(fileName + 'temp', resultMinified.code)
                if (helper.getFilesizeInBytes(fileName + 'temp') < helper.getFilesizeInBytes(fileName)) {
                    fs.renameSync(fileName + 'temp', fileName)
                } else {
                    fs.unlinkSync(fileName + 'temp')
                }

                resolve(helper.updateOptimizationResultForFileAfter(resultStats))
            }
        } else {
            resolve(null)
        }
    }).catch(function (e) {
        Logger.error(e) // "oh, no!"
    })
}

JsOptim.optimizeFileList = function (fileList, settings) {
    Logger.debug('js: started')

    var actions = fileList.filter(function (entry) {
        if (entry && entry.length > 0) {
            var ext = path.extname(entry)
            if (['.js'].indexOf(ext) > -1) {
                return true
            } else {
                return false
            }
        }
    }).map(function (entry) {
        return JsOptim.optimizeFile(entry, settings)
    })

    return Promise.all(actions).then(function (result) {
        Logger.debug('all js files written')
        Logger.debug('js: finished')

        return helper.getOptimizationResultForOptimizer(result, JsOptim)
    })
}

JsOptim.getName = function () {
    return 'js'
}

module.exports = JsOptim
