const fs = require('fs-extra')
const Logger = require('./Logger')
var CopyOptim = {}

CopyOptim.optimize = function (settings) {
    return new Promise(function (resolve, reject) {
        Logger.debug('copy', settings.inputDir, '=>', settings.outputDir)

        if (!fs.existsSync(settings.inputDir)) {
            Logger.debug('ERROR: input dir does not exist', settings.inputDir)
            reject(settings.inputDir)
        } else {
            if (settings.outputDir !== settings.inputDir) {
                // prepare

                fs.removeSync(settings.outputDir)
                fs.mkdirSync(settings.outputDir)
                fs.copySync(settings.inputDir, settings.outputDir)

                Logger.debug('copy: finished')
            } else {
                Logger.debug('copy: finished did nothing')
            }

            resolve()
        }
    })
}

CopyOptim.getName = function () {
    return 'copy'
}

module.exports = CopyOptim
