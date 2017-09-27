const fs = require('fs-extra')
var HtAccessOptim = {}

HtAccessOptim.optimizeFileList = function (fileList, settings) {
    console.log('htaccess: started')
    return new Promise(function (resolve) {
        var htaccessOptimSettings = settings.optimizer.htaccessOptim

        if (htaccessOptimSettings.enabled) {
            fs.copySync(htaccessOptimSettings.options.inputFile, settings.outputDir + htaccessOptimSettings.options.outputFile)
        }

        resolve(settings)
    }).catch(function (e) {
        console.log(e) // "oh, no!"
    })
}

module.exports = HtAccessOptim
