var Helper = {}
const fs = require('fs-extra')
var path = require('path')

Helper.getFilesizeInBytes = function (filename) {
    var stats = fs.statSync(filename)
    var fileSizeInBytes = stats['size']
    return fileSizeInBytes
}

Helper.cleanEmptyFoldersRecursively = function (folder) {
    var isDir = fs.statSync(folder).isDirectory()
    if (!isDir) {
        return
    }
    var files = fs.readdirSync(folder)
    if (files.length > 0) {
        files.forEach(function (file) {
            var fullPath = path.join(folder, file)
            Helper.cleanEmptyFoldersRecursively(fullPath)
        })

        // re-evaluate files; after deleting subfolder
        // we may have parent folder empty now
        files = fs.readdirSync(folder)
    }
    if (files.length === 0) {
        console.log('removing: ', folder)
        fs.rmdirSync(folder)
    } else {
        console.log('not removing: ', folder, files.length)
    }
}

Helper.emptyPromise = function (val) {
    return new Promise(function (resolve) {
        resolve(val)
    })
}


Helper.getOptimizationResultForFileBefore = function (inputFileName, outputFileName, optimizer, group) {
    return {
        optimizerName: optimizer.getName(),
        group: group,
        inputFileName: inputFileName,
        outputFileName: outputFileName,
        sizeBefore: Helper.getFilesizeInBytes(inputFileName),
        sizeAfter: null
    }
}

Helper.updateOptimizationResultForFileAfter = function (optimizationResult) {
    if (optimizationResult) {
        if (Array.isArray(optimizationResult)) {
            return optimizationResult.map(Helper.updateOptimizationResultForFileAfter)
        } else {
            optimizationResult.sizeAfter = Helper.getFilesizeInBytes(optimizationResult.outputFileName)
        }
    }
    return optimizationResult;
}

Helper.getOptimizationResultForOptimizer = function (resultsForFiles, optimizer) {
    return {
        name: optimizer.getName(),
        files: Helper.flatten(resultsForFiles || []).filter(function (entry) {
            return entry ? true : false;
        })
    };
}

Helper.flatten = function (arr) {
    return arr.reduce(function (flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) ? Helper.flatten(toFlatten) : toFlatten);
    }, []);
}
//    Logger.debug('gzip ' + fileName, 'reduction: ', Math.round((sizeBefore - sizeNEW) / 1024) + 'kb', Math.round((sizeNEW / sizeBefore) * 100) + '%')
//  Logger.debug('zopfli ' + fileName, 'reduction: ', Math.round((sizeBefore - sizeNEW) / 1024) + 'kb', Math.round((sizeNEW / sizeBefore) * 100) + '%')

module.exports = Helper
