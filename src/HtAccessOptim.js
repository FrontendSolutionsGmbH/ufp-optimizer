const fs = require('fs-extra')
const Logger = require('./Logger')
var HtAccessOptim = {}

HtAccessOptim.optimizeFileList = function (fileList, settings) {
    Logger.debug('htaccess: started')
    return new Promise(function (resolve) {
        var htaccessOptimSettings = settings.optimizer.htaccessOptim

        if (htaccessOptimSettings.enabled) {
            fs.copySync(htaccessOptimSettings.options.inputFile, settings.outputDir + htaccessOptimSettings.options.outputFile)
        }

        Logger.debug('htaccess: finished')
        resolve(settings)
    }).catch(function (e) {
        Logger.error(e) // "oh, no!"
    })
}


HtAccessOptim.getName = function () {
    return 'css'
}

module.exports = HtAccessOptim
