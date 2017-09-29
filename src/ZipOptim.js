const helper = require('./Helper')
const path = require('path')
const fs = require('fs')
var brotli = require('brotli')
const Logger = require('./Logger')
var zopfli = require('node-zopfli')

var ZipOptim = {}


ZipOptim.doGzip = function (fileName, settings) {
    return new Promise(function (resolve) {
        var zipSettings = settings.optimizer.zipOptim
        var result
        if (zipSettings.enabled) {

            if (zipSettings.zopfli.enabled) {
                result = helper.getOptimizationResultForFileBefore(fileName, fileName + '.gz', ZipOptim, 'zopfli')
                fs.createReadStream(fileName)
                    .pipe(zopfli.createGzip(zipSettings.zopfli.options))
                    .pipe(fs.createWriteStream(fileName + '.gz')).on('finish', function () {
                    resolve(helper.updateOptimizationResultForFileAfter(result))
                })
            } else if (zipSettings.zlib.enabled) {
                const zlib = require('zlib')
                const gzip = zlib.createGzip(zipSettings.zlib.options)
                const inp = fs.createReadStream(fileName)
                const out = fs.createWriteStream(fileName + '.gz')
                var result = helper.getOptimizationResultForFileBefore(fileName, fileName + '.gz', ZipOptim, 'zlib')
                inp.pipe(gzip).pipe(out).on('finish', function () {
                    resolve(helper.updateOptimizationResultForFileAfter(result))
                })
            } else {
                resolve(null)
            }
        } else {
            resolve(null)
        }
    })
}

ZipOptim.doBrotli = function (fileName, settings) {
    return new Promise(function (resolve) {
        var zipSettings = settings.optimizer.zipOptim
        if (zipSettings.enabled) {
            if (zipSettings.brotli.enabled) {
                var result = helper.getOptimizationResultForFileBefore(fileName, fileName + '.br', ZipOptim, 'brotli');
                var brotliBuffer = brotli.compress(fs.readFileSync(fileName))
                fs.writeFile(fileName + '.br', brotliBuffer, 'binary', function (err) {
                    if (err) {
                        Logger.error('brotli error', err)
                        reject(err)
                    } else {
                        resolve(helper.updateOptimizationResultForFileAfter(result))
                    }
                })
            }
        } else {
            resolve(null)
        }
    }).catch(function (e) {
        Logger.error(e) // "oh, no!"
    })
}

ZipOptim.optimizeFile = function (fileName, settings) {


    return Promise.all([
        ZipOptim.doBrotli(fileName, settings),
        ZipOptim.doGzip(fileName, settings)
    ]).then(function (results) {
        return results;
    }).catch(function (e) {
        Logger.error(e) // "oh, no!"
    })

}

ZipOptim.optimizeFileList = function (fileList, settings) {
    Logger.debug('gzip: started')
    return Promise.all(fileList.filter(function (entry) {
        if (entry && entry.length > 0) {
            var ext = path.extname(entry)
            if (['.htm', '.html', '.svg', '.js', '.css', '.json', '.xml'].indexOf(ext) > -1) {
                return true
            } else {
                return false
            }
        }
    }).map(function (entry) {
        return ZipOptim.optimizeFile(entry, settings)
    })).then(function (result) {
        console.log('all gzip files written', helper.getOptimizationResultForOptimizer(result, ZipOptim))
        Logger.debug('gzip: finished')
        return helper.getOptimizationResultForOptimizer(result, ZipOptim)
    })
}

ZipOptim.getName = function () {
    return 'zip'
}

module.exports = ZipOptim
