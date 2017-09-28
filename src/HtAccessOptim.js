const fs = require('fs-extra')
const Logger = require('./Logger')
var HtAccessHelper = require('./HtAccessHelper')
var HtAccessOptim = {}

HtAccessOptim.optimizeFileList = function (fileList, settings) {
    Logger.debug('htaccess: started')
    return new Promise(function (resolve, reject) {
        var htaccessOptimSettings = settings.optimizer.htaccessOptim

        if (htaccessOptimSettings.enabled) {

            var htAccessContent = HtAccessHelper.getHtAccess(settings)
            var fs = require('fs');
            fs.writeFile(settings.outputDir + htaccessOptimSettings.options.outputFile, htAccessContent, function (err) {
                if (err) {
                    reject(err);
                    return;
                }

                Logger.debug("The htaccess file was saved!");
            });


            //fs.copySync(htaccessOptimSettings.options.inputFile, settings.outputDir + htaccessOptimSettings.options.outputFile)
        }

        Logger.debug('htaccess: finished')
        resolve(settings)
    }).catch(function (e) {
        Logger.error(e) // "oh, no!"
    })
}


HtAccessOptim.getName = function () {
    return 'htaccess'
}

module.exports = HtAccessOptim
