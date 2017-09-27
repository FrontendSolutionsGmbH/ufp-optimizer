const fs = require('fs-extra')
var CopyOptim = {}

CopyOptim.optimize = function (settings) {
    return new Promise(function (resolve, reject) {
        console.log('* ufp-optimizer copy: started', settings.inputDir, '=>', settings.outputDir)

        if (!fs.existsSync(settings.inputDir)) {
            console.log('ERROR: input dir does not exist', settings.inputDir)
            reject(settings.inputDir)
        } else {
            if (settings.outputDir !== settings.inputDir) {
                // prepare

                fs.removeSync(settings.outputDir)
                fs.mkdirSync(settings.outputDir)
                fs.copySync(settings.inputDir, settings.outputDir)

                console.log('* ufp-optimizer - copy: finished')
            } else {
                console.log('* ufp-optimizer - copy: finished did nothing')
            }

            resolve()
        }
    })
}

module.exports = CopyOptim
