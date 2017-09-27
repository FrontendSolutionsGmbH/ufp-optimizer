var uo = require('./../../src/UfpOptimizer')   // regular project can use 'ufp-optimizer'
var settings = uo.getConfig()
settings.inputDir = 'examples/1/fast'
settings.outputDir = 'dist-3'
uo.copy(settings)

var settingsSame = uo.getConfig()
settingsSame.inputDir = 'dist-3'
settingsSame.outputDir = 'dist-3'
uo.executeOptimizations(settingsSame)