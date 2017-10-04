const fs = require('fs')
const path = require('path')
const app = require('src/UfpOptimizer')

var helper = {}

helper.cutSuffix = function (string) {
  return string.replace(/(^.*)\./g, '$1')
}

helper.filewalker = function (dir) {
  var result = []

  var list = fs.readdirSync(dir)
  list.forEach(function (file) {
    file = path.resolve(dir, file)
    const dirName = dir.replace(/^.*[\\\/]/, '')
    const fileName = file.replace(/^.*[\\\/]/, '')

    var stat = fs.statSync(file)
    if (stat && stat.isDirectory()) {
      var res = helper.filewalker(file)
      result.push({
        type: 'dir',
        fileName: fileName,
        path: file
      })
      result = result.concat(res)
    }
    else if (dirName === 'goodFiles') {
      result.push({
        type: 'file',
        fileName: fileName,
        fileSize: stat['size'],
        path: file,
        strongAssertion: true
      })
    }
    else {
      result.push({
        type: 'file',
        fileName: fileName,
        fileSize: stat['size'],
        path: file
      })
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
  var settings = app.getConfig('production')
  settings.inputDir = inputDirName
  settings.outputDir = outputDirName

  return app.executeOptimizations(settings).then(function (result) {
    console.log('****** UFP OPTIMIZER finished ******')
    return result
  }).catch(function (ex) {
    console.log('****** UFP OPTIMIZER finished with errors ******', ex)
  })

  //console.log('****** UFP OPTIMIZER TEST EARLY END******')
}

module.exports = helper
