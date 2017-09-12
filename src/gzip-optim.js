const helper = require('./helper')
const path = require('path');
const fs = require('fs');
const zlib = require('zlib');
var brotli = require('brotli');

var optim = {}

optim.optimizeFile = function (fileName, settings) {

    return new Promise(function (resolve, reject) {

        var brotliBuffer = brotli.compress(fs.readFileSync(fileName));

        fs.writeFile(fileName + '.br', brotliBuffer, "binary", function (err) {
            if (err) {
                console.log('brotli error', err);
            }
        });


        var sizeBefore = helper.getFilesizeInBytes(fileName);
        const gzip = zlib.createGzip();
        const inp = fs.createReadStream(fileName);
        const out = fs.createWriteStream(fileName + '.gz');
        inp.pipe(gzip).pipe(out).on('finish', function () {
            var sizeNEW = helper.getFilesizeInBytes(fileName + '.gz');
            console.log('gzip ' + fileName, 'reduction: ', Math.round((sizeBefore - sizeNEW) / 1024) + 'kb', Math.round((sizeNEW / sizeBefore) * 100) + '%')

            resolve(sizeNEW)
        });


    })


}

optim.optimizeFileList = function (fileList, settings) {

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
        return optim.optimizeFile(entry, settings)
    })).then(function (result) {
        console.log('all gzip files written')
        console.log('gzip: finished')
    })
}

module.exports = optim;