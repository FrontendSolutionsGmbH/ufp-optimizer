var uo = require('./../../src/UfpOptimizer')   // regular project can use 'ufp-optimizer'
var settings = uo.getDefaultSettings()
settings.inputDir = 'examples/1/fast'
settings.outputDir = 'dist-3'
uo.copy(settings)

var settingsSame = uo.getDefaultSettings()
settingsSame.inputDir = 'dist-3'
settingsSame.outputDir = 'dist-3'
uo.execute(settingsSame)