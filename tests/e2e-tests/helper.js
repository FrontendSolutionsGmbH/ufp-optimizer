const fs = require('fs')
const path = require('path')
const app = require('src/UfpOptimizer')

var helper = {}

helper.filewalker = function (dir) {
  var result = []

  var list = fs.readdirSync(dir)
  list.forEach(function (file) {
    file = path.resolve(dir, file)

    result.push(file)

    var stat = fs.statSync(file)
    if (stat && stat.isDirectory()) {
      var res = this.filewalker(file)

      result = result.concat(res)
    }
  })
  return result
}

helper.copy = function (data) {
  const settings = app.getDefaultSettings()
  settings.inputDir = data.inputDir
  settings.outputDir = data.outputDir
  app.execute(settings)
}

helper.fastBuild = function (data) {
  const settings = app.getDefaultSettings()
  settings.inputDir = data.inputDir
  settings.outputDir = data.outputDir
  app.execute(settings)
}

helper.build = function (data) {
  console.log('****** UFP OPTIMIZER 2.0 started ******')
  console.log('****** USAGE:  ufp-optimizer-cli [inputDir] [outputDir] [configFile] ******')
  var inputDirName = data.inputDirName || 'examples/0/input'
  var outputDirName = data.outputDirName || 'dist'
  var configFileName = (data.configFileName && path.join(process.cwd(), data.configFileName)) || path.join(__dirname, '../../src/Globals.js')

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
