const helper = require('./Helper')
const path = require('path')
const imagemin = require('imagemin')
const imageminPngquant = require('imagemin-pngquant')
const imageminSvgo = require('imagemin-svgo')
const imageminWebp = require('imagemin-webp')
const imageminGiflossy = require('imagemin-giflossy')
const imageminJpegRecompress = require('imagemin-jpeg-recompress')
const imageminPngcrush = require('imagemin-pngcrush')
const Logger = require('./Logger')
const defaultsDeep = require('lodash.defaultsdeep')

var ImageOptim = {}

ImageOptim.optimizeFile = function (fileName, settings) {
    var imageOptimSettings = settings.optimizer.imageOptim
    var imageminOptions = imageOptimSettings.imagemin.options

    if (imageOptimSettings.enabled && imageOptimSettings.imagemin.enabled) {
        var imageDir = path.dirname(fileName)
        var customOptionsMin = {}
        if (imageOptimSettings.customImageOptions) {
            imageOptimSettings.customImageOptions.map(function (entry) {
                if (entry.key === fileName.replace(settings.outputDir + '/', '').replace(settings.outputDir + '\\', '').replace('\\', '/')) {
                    customOptionsMin = entry.imageOptim.imagemin.options
                }
            })
        }

        settings = settings || {}
        settings.pngQuant = defaultsDeep(customOptionsMin.pngQuant || {}, imageminOptions.pngQuant)
        settings.pngCrush = defaultsDeep(customOptionsMin.pngCrush || {}, imageminOptions.pngCrush)
        settings.jpegMoz = defaultsDeep(customOptionsMin.jpegMoz || {}, imageminOptions.jpegMoz)
        settings.jpegRecompress = defaultsDeep(customOptionsMin.jpegRecompress || {}, imageminOptions.jpegRecompress)
        settings.svgo = defaultsDeep(customOptionsMin.svgo || {}, imageminOptions.svgo)
        settings.webp = defaultsDeep(customOptionsMin.webp || {}, imageminOptions.webp)
        settings.giflossy = defaultsDeep(customOptionsMin.giflossy || {}, imageminOptions.giflossy)

        var resultStats = helper.getOptimizationResultForFileBefore(fileName, fileName, ImageOptim, 'image');
        var funcAll = function () {
            Logger.debug('image', fileName)
            var ext = path.extname(fileName)
            var plugins = []
            switch (ext) {
                case '.png':
                    if (settings.pngQuant.enabled) {
                        plugins.push(imageminPngquant(settings.pngQuant.options))
                    }
                    if (settings.pngCrush.enabled) {
                        plugins.push(imageminPngcrush(settings.pngCrush.options))
                    }
                    if (settings.webp.enabled) {
                        plugins.push(imageminWebp(settings.webp.options))
                    }
                    break
                case '.jpg':
                case '.jpeg':
                    if (settings.jpegRecompress.enabled) {
                        plugins.push(imageminJpegRecompress(settings.jpegRecompress.options))
                    }
                    if (settings.webp.enabled) {
                        plugins.push(imageminWebp(settings.webp.options))
                    }
                    break
                case '.svg':
                    if (settings.svgo.enabled) {
                        plugins.push(imageminSvgo(settings.svgo.options))
                    }
                    break
                case '.gif':
                    if (settings.giflossy.enabled) {
                        plugins.push(imageminGiflossy(settings.giflossy.options))
                    }
                    break
            }

            if (plugins.length > 0) {
                return imagemin([fileName], imageDir, {
                    plugins: plugins
                }).catch(function (error) {
                    Logger.error('error', fileName, error)
                    // resolve()
                })
            } else {
                return helper.emptyPromise()
            }
        }

        return funcAll().then(function () {
            return helper.updateOptimizationResultForFileAfter(resultStats);
        })
    } else {
        return helper.emptyPromise(null)
    }
}

ImageOptim.optimizeFileList = function (fileList, settings) {
    Logger.debug('images: started')

    var actions = fileList.filter(function (entry) {
        if (entry && entry.length > 0) {
            var ext = path.extname(entry)
            if (['.png', '.jpg', '.jpeg', '.svg', '.gif'].indexOf(ext) > -1) {
                return true
            } else {
                return false
            }
        }
    }).map(function (entry) {
        return ImageOptim.optimizeFile(entry, settings)
    })

    return Promise.all(actions).then(function (result) {
        Logger.debug('all image files written')
        Logger.debug('images: finished')

        console.log('all iamge files written', helper.getOptimizationResultForOptimizer(result, ImageOptim))
        return helper.getOptimizationResultForOptimizer(result, ImageOptim)
    })
}

ImageOptim.getName = function () {
    return 'image'
}

module.exports = ImageOptim
