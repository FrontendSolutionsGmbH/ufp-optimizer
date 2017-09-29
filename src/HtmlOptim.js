const path = require('path')
const fs = require('fs-extra')
const Logger = require('./Logger')
const helper = require('./Helper')
var minify = require('html-minifier').minify

var HtmlOptim = {}

HtmlOptim.optimizeFile = function (fileName, settings) {
    var htmlOptimSettings = settings.optimizer.htmlOptim

    return new Promise(function (resolve) {
        if (htmlOptimSettings.enabled && htmlOptimSettings.options.minify.enabled) {
            var result = fs.readFileSync(fileName, 'utf8')
            var resultMinified = result

            var resultStats = helper.getOptimizationResultForFileBefore(fileName, fileName, HtmlOptim, 'minify');

            try {
                resultMinified = minify(result, htmlOptimSettings.options.minify.options)
            } catch (ex) {
                Logger.error('html error catched', fileName)
            }

            fs.outputFileSync(fileName, resultMinified)
            resolve(helper.updateOptimizationResultForFileAfter(resultStats))
        } else {
            resolve(null)
        }
    }).catch(function (e) {
        Logger.error(e) // "oh, no!"
    })
}

HtmlOptim.optimizeFileList = function (fileList, settings) {
    Logger.debug('html: started')

    var actions = fileList.filter(function (entry) {
        if (entry && entry.length > 0) {
            var ext = path.extname(entry)
            if (['.html', '.htm'].indexOf(ext) > -1) {
                return true
            } else {
                return false
            }
        }
    }).map(function (entry) {
        return HtmlOptim.optimizeFile(entry, settings)
    })

    return Promise.all(actions).then(function (result) {
        Logger.debug('all html files written')
        Logger.debug('html: finished')

        console.log('all HtmlOptim files written', helper.getOptimizationResultForOptimizer(result, HtmlOptim))
        return helper.getOptimizationResultForOptimizer(result, HtmlOptim)
    })
}

HtmlOptim.getName = function () {
    return 'html'
}

module.exports = HtmlOptim
