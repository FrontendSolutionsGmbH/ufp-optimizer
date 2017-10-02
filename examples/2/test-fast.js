var uo = require('./../../src/UfpOptimizer')   // regular project can use 'ufp-optimizer'
var settings = uo.getConfig()
settings.inputDir = 'examples/1/fast'
settings.outputDir = 'dist/dist-2'
uo.executeOptimizations(settings)