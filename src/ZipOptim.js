const helper = require('./Helper')
const path = require('path')
const fs = require('fs')
var brotli = require('brotli')
var zopfli = require('node-zopfli')

var ZipOptim = {}

ZipOptim.optimizeFile = function (fileName, settings) {
    var zipSettings = settings.optimizer.zipOptim

    return new Promise(function (resolve) {
        if (zipSettings.enabled) {
            if (zipSettings.brotli.enabled) {
                var brotliBuffer = brotli.compress(fs.readFileSync(fileName))

                fs.writeFile(fileName + '.br', brotliBuffer, 'binary', function (err) {
                    if (err) {
                        console.log('brotli error', err)
                    }
                })
            }

            if (zipSettings.zopfli.enabled) {
                var sizeBefore = helper.getFilesizeInBytes(fileName)

                fs.createReadStream(fileName)
                    .pipe(zopfli.createGzip(zipSettings.zopfli.options))
                    .pipe(fs.createWriteStream(fileName + '.gz')).on('finish', function () {
                    var sizeNEW = helper.getFilesizeInBytes(fileName + '.gz')
                    console.log('zopfli ' + fileName, 'reduction: ', Math.round((sizeBefore - sizeNEW) / 1024) + 'kb', Math.round((sizeNEW / sizeBefore) * 100) + '%')
                    resolve(sizeNEW)
                })
            } else if (zipSettings.zlib.enabled) {
                const zlib = require('zlib')
                const gzip = zlib.createGzip(zipSettings.zlib.options)
                const inp = fs.createReadStream(fileName)
                const out = fs.createWriteStream(fileName + '.gz')
                inp.pipe(gzip).pipe(out).on('finish', function () {
                    var sizeNEW = helper.getFilesizeInBytes(fileName + '.gz')
                    console.log('gzip ' + fileName, 'reduction: ', Math.round((sizeBefore - sizeNEW) / 1024) + 'kb', Math.round((sizeNEW / sizeBefore) * 100) + '%')

                    resolve(sizeNEW)
                })
            } else {
                resolve()
            }
        } else {
            resolve()
        }
    }).catch(function (e) {
        console.log(e) // "oh, no!"
    })
}

ZipOptim.optimizeFileList = function (fileList, settings) {
    console.log('gzip: started')
    return Promise.all(fileList.filter(function (entry) {
        if (entry && entry.length > 0) {
            var ext = path.extname(entry)
            if (['.htm', '.html', '.svg', '.js', '.css', '.json'].indexOf(ext) > -1) {
                return true
            } else {
                return false
            }
        }
    }).map(function (entry) {
        return ZipOptim.optimizeFile(entry, settings)
    })).then(function (result) {
        console.log('all gzip files written')
        console.log('gzip: finished')
        return result
    })
}

module.exports = ZipOptim
