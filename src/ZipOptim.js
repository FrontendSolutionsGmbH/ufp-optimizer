const helper = require('./helper')
const path = require('path')
const fs = require('fs')
var brotli = require('brotli')
var zopfli = require('node-zopfli')

var ZipOptim = {}

ZipOptim.optimizeFile = function (fileName) {
    return new Promise(function (resolve) {
        var brotliBuffer = brotli.compress(fs.readFileSync(fileName))

        fs.writeFile(fileName + '.br', brotliBuffer, 'binary', function (err) {
            if (err) {
                console.log('brotli error', err)
            }
        })

        var sizeBefore = helper.getFilesizeInBytes(fileName)

        fs.createReadStream(fileName)
            .pipe(zopfli.createGzip())
            .pipe(fs.createWriteStream(fileName + '.gz')).on('finish', function () {
            var sizeNEW = helper.getFilesizeInBytes(fileName + '.gz')
            console.log('zopfli ' + fileName, 'reduction: ', Math.round((sizeBefore - sizeNEW) / 1024) + 'kb', Math.round((sizeNEW / sizeBefore) * 100) + '%')
            resolve(sizeNEW)
        })

        /* OLD code without zopfli /*
         const zlib = require('zlib')
         const gzip = zlib.createGzip();
         const inp = fs.createReadStream(fileName);
         const out = fs.createWriteStream(fileName + '.gz');
         inp.pipe(gzip).pipe(out).on('finish', function () {
         var sizeNEW = helper.getFilesizeInBytes(fileName + '.gz');
         console.log('gzip ' + fileName, 'reduction: ', Math.round((sizeBefore - sizeNEW) / 1024) + 'kb', Math.round((sizeNEW / sizeBefore) * 100) + '%')

         resolve(sizeNEW)
         });
         */
    })
}

ZipOptim.optimizeFileList = function (fileList, settings) {
    console.log('gzip: started')
    return Promise.all(fileList.filter(function (entry) {
        if (entry && entry.length > 0) {
            var ext = path.extname(entry)
            if (['.htm', '.html', '.svg', '.js', '.css'].indexOf(ext) > -1) {
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
