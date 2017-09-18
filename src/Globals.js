const path = require('path')

var Globals = {}

Globals.inputDir = 'example/input'
Globals.outputDir = 'dist'
Globals.optionsPNG = {quality: '80'}
Globals.optionsMOZJPEG = {quality: '65-80'}
Globals.optionsSVG = {plugins: [{removeViewBox: false}]}
Globals.optionsGIF = {lossy: 80}
Globals.optionsWEBP = {quality: 80}
Globals.optionsJPEGRECOMPRESS = {quality: 'medium'}
Globals.optionsPNGCrush = {}
Globals.htaccessFile = path.resolve(__dirname, './.htaccess')
Globals.delete = []
Globals.uncssOptions = {ignore: ['.class1'], ignoreSheets: [/fast.fonts.net/]}
Globals.htmlminifyOptions = {}
Globals.customImageOptions = [
    {
        key: 'ui/navopen.png',
        value: {
            optionsPNG: {quality: '0'},
            optionsPNGCrush: {reduce: true}
        }
    }
]

require('events').EventEmitter.defaultMaxListeners = Infinity

module.exports = Globals

/*
 {removeComments : true,
 collapseWhitespace: true,
 conservativeCollapse: true,
 collapseInlineTagWhitespace:false,
 minifyCSS: false,
 minifyJS: false,
 removeEmptyAttributes: false,
 removeEmptyElements: false,
 removeOptionalTags: false,
 removeRedundantAttributes: false,
 } */
