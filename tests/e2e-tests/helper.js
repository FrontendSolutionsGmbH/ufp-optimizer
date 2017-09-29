const path = require('path')
const app = require('src/UfpOptimizer')

var helper = {}

helper.build = function (commandObject) {
  console.log('****** UFP OPTIMIZER 2.0 started ******')
  console.log('****** USAGE:  ufp-optimizer-cli [inputDir] [outputDir] [configFile] ******')
  var inputDirName = commandObject.inputDirName || 'examples/0/input'
  var outputDirName = commandObject.outputDirName || 'dist'
  var configFileName = (commandObject.configFileName && path.join(process.cwd(), commandObject.configFileName)) || path.join(__dirname, '../../src/Globals.js')

  console.log('****** USAGE:  ufp-optimizer-cli ' + inputDirName + ' ' + outputDirName + ' ' + configFileName + ' ******')

  const settings = require(configFileName)

  settings.inputDir = inputDirName
  settings.outputDir = outputDirName

    app.execute(settings).then(function (result) {
    console.log('****** UFP OPTIMIZER finished ******')
    return result
  }).catch(function (ex) {
    console.log('****** UFP OPTIMIZER finished with errors ******', ex)
  })

  console.log('****** UFP OPTIMIZER TEST EARLY END******')
}

module.exports = helper
