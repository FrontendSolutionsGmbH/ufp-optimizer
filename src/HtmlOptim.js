const path = require('path')
const fs = require('fs-extra')
var minify = require('html-minifier').minify

var HtmlOptim = {}

HtmlOptim.optimizeFile = function (fileName, settings) {
    var result = fs.readFileSync(fileName, 'utf8')
    var resultMinified = result

    try {
        resultMinified = minify(result, settings.htmlminifyOptions)
    } catch (ex) {
        console.log('html error catched', fileName)
    }

    console.log('html minify ' + fileName, 'reduction: ', Math.round((result.length - resultMinified.length) / 1024) + 'kb', Math.round((1 - resultMinified.length / result.length) * 100) + '%')
    fs.outputFileSync(fileName, resultMinified)

    return result
}

HtmlOptim.optimizeFileList = function (fileList, settings) {
    console.log('html: started')

    fs.copySync(settings.htaccessFile, settings.outputDir + '/.htaccess')

    var actions = fileList.filter(function (entry) {
        if (entry && entry.length > 0) {
            var ext = path.extname(entry)
            var dir = path.dirname(entry)
            if (['.php'].indexOf(ext) > -1 && dir === settings.outputDir) {
                return true
            }
        }
    }).map(function (entry) {
        return HtmlOptim.optimizeFile(entry, settings)
    })

    // delete all php stuff
    return Promise.all(actions).then(function (result) {
        fileList.filter(function (entry) {
            if (entry && entry.length > 0) {
                var ext = path.extname(entry)
                if (['.html', '.htm'].indexOf(ext) > -1) {
                    return true
                }
            }
        }).map(function (entry) {
            return HtmlOptim.optimizeFile(entry, settings)
        })
        return result
    }).then(function (result) {
        console.log('all html files optimized')
        console.log('html: finished')
        return result
    })
}

module.exports = HtmlOptim
