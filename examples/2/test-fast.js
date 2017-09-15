var uo = require('./../../src/UfpOptimizer')   // regular project can use 'ufp-optimizer'
var settings = uo.getDefaultSettings()
settings.inputDir = 'examples/1/fast'
settings.outputDir = 'dist-2'
uo.execute(settings)