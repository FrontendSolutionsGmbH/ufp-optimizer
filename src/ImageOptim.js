const helper = require('./Helper')
const path = require('path')
const imagemin = require('imagemin')
const imageminPngquant = require('imagemin-pngquant')
const imageminSvgo = require('imagemin-svgo')
const imageminWebp = require('imagemin-webp')
const imageminGiflossy = require('imagemin-giflossy')
const imageminJpegRecompress = require('imagemin-jpeg-recompress')
const imageminPngcrush = require('imagemin-pngcrush')

var ImageOptim = {}

ImageOptim.optimizeFile = function (fileName, settings) {
    var imageDir = path.dirname(fileName)
    var customOptions = {}
    if (settings.customImageOptions) {
        settings.customImageOptions.map(function (entry) {
            if (entry.key === fileName.replace(settings.outputDir + '/', '').replace(settings.outputDir + '\\', '').replace('\\', '/')) {
                customOptions = entry.value
            }
        })
    }

    settings = settings || {}
    settings.optionsPNG = customOptions.optionsPNG || settings.optionsPNG || settings.optionsPNG || settings.optionsPNG
    settings.optionsPNGCrush = customOptions.optionsPNGCrush || settings.optionsPNGCrush || settings.optionsPNGCrush || settings.optionsPNGCrush
    settings.optionsMOZJPEG = customOptions.optionsMOZJPEG || settings.optionsMOZJPEG || settings.optionsMOZJPEG || settings.optionsMOZJPEG
    settings.optionsJPEGRECOMPRESS = customOptions.optionsJPEGRECOMPRESS || settings.optionsJPEGRECOMPRESS || settings.optionsJPEGRECOMPRESS || settings.optionsJPEGRECOMPRESS
    settings.optionsSVG = customOptions.optionsSVG || settings.optionsSVG || settings.optionsSVG || settings.optionsSVG
    settings.optionsWEBP = customOptions.optionsWEBP || settings.optionsWEBP || settings.optionsWEBP || settings.optionsWEBP
    settings.optionsGIF = customOptions.optionsGIF || settings.optionsGIF || settings.optionsGIF || settings.optionsGIF

    var sizeBefore = helper.getFilesizeInBytes(fileName)

    var funcWebp = function () {
        return new Promise(function (resolve) {
            // console.log('webp', fileName)
            return imagemin([fileName], imageDir, {
                plugins: [
                    imageminWebp(settings.optionsWEBP)
                ]
            }).catch(function () {
                // console.log('webp-error', fileName)
                resolve()
            }).then(function () {
                // console.log('webp-success', fileName)
                return resolve()
            })
        })
    }

    var funcAll = function () {
        console.log('image', fileName)
        var ext = path.extname(fileName)
        var plugins = []
        switch (ext) {
            case '.png':
                plugins.push(imageminPngquant(settings.optionsPNG),
                    imageminPngcrush(settings.optionsPNGCrush))
                break
            case '.jpg':
            case '.jpeg':
                plugins.push(imageminJpegRecompress(settings.optionsJPEGRECOMPRESS))
                break
            case '.svg':
                plugins.push(imageminSvgo(settings.optionsSVG))
                break
            case '.gif':
                plugins.push(imageminGiflossy(settings.optionsGIF))
                break
        }

        return imagemin([fileName], imageDir, {
            plugins: plugins
        }).catch(function (error) {
            console.log('error', fileName, error)
            // resolve()
        })
    }

    return funcAll().then(funcWebp).then(function () {
        var sizeNEW = helper.getFilesizeInBytes(fileName)
        var sizeWEBP = helper.getFilesizeInBytes(fileName)

        console.log('image', (Object.keys(customOptions).length > 0 ? 'custom' : ''), fileName, 'reduction: ', Math.round((sizeBefore - sizeNEW) / 1024) + 'kb', Math.round((1 - sizeNEW / sizeBefore) * 100) + '%', (Object.keys(customOptions).length > 0 ? customOptions : ''))
        return {sizeBEFORE: sizeBefore, sizeNEW: sizeNEW, sizeWEBP: sizeWEBP}
    })
}

ImageOptim.optimizeFileList = function (fileList, settings) {
    console.log('images: started')

    var actions = fileList.filter(function (entry) {
        if (entry && entry.length > 0) {
            var ext = path.extname(entry)
            if (['.png', '.jpg', '.jpeg', '.svg'].indexOf(ext) > -1) {
                return true
            } else {
                return false
            }
        }
    }).map(function (entry) {
        return ImageOptim.optimizeFile(entry, settings)
    })

    return Promise.all(actions).then(function (result) {
        console.log('all image files written')
        console.log('images: finished')
        return result
    })
}

module.exports = ImageOptim
