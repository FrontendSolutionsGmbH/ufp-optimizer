var globals = {};

globals.inputDir = "example"
globals.outputDir = "dist"
globals.optionsPNG = {quality: '0'}
globals.optionsMOZJPEG = {quality: '65-80'}
globals.optionsSVG = {plugins: [{removeViewBox: false}]}
globals.optionsGIF = {lossy: 80}
globals.optionsWEBP = {quality: 80}
globals.optionsJPEGRECOMPRESS = {quality: "low"}
globals.optionsPNGCrush = {}
globals.htaccessFile = "src/.htaccess"

require('events').EventEmitter.defaultMaxListeners = Infinity;

module.exports = globals;

