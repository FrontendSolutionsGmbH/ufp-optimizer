const fs = require('fs')
const path = require('path')
const app = require('src/UfpOptimizer')

var Helper = {}

Helper.cutSuffix = function (string) {
    return string.replace(/(^.*)\./g, '$1')
}

Helper.dirHasFile = function (dir, fileName) {
    const list = fs.readdirSync(dir)
    return list.some(function (entry) {
        return entry.replace(/^.*[\\\/]/, '') === fileName
    })
}

Helper.filewalker = function (dir) {
    var result = []

    var list = fs.readdirSync(dir)
    list.forEach(function (file) {
        file = path.resolve(dir, file)
        const dirName = dir.replace(/^.*[\\\/]/, '')
        const fileName = file.replace(/^.*[\\\/]/, '')

        var stat = fs.statSync(file)
        if (stat && stat.isDirectory()) {
            var res = Helper.filewalker(file)
            result.push({
                type: 'dir',
                fileName: fileName,
                path: file
            })
            result = result.concat(res)
        }
        else if (dirName === 'goodFiles') {
            result.push({
                type: 'file',
                fileName: fileName,
                fileSize: stat['size'],
                path: file,
                strongAssertion: true
            })
        }
        else {
            result.push({
                type: 'file',
                fileName: fileName,
                fileSize: stat['size'],
                path: file
            })
        }
    })
    return result
}

Helper.build = function (data) {
    console.log('****** UFP OPTIMIZER TEST started ******')
    var settings = app.getConfig('production')
    settings.inputDir = data.inputDirName
    settings.outputDir = data.outputDirName

    return app.executeOptimizations(settings)
}

module.exports = Helper
