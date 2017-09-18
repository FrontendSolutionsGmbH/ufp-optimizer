#! /usr/bin/env node

const path = require('path')
const app = require('./../src/UfpOptimizer')

console.log('****** UFP OPTIMIZER 2.0 started ******')
console.log('****** USAGE:  ufp-optimizer-cli [inputDir] [outputDir] [configFile] ******')

var myArgs = process.argv.slice(2)
var inputDirName = (myArgs && myArgs.length > 0 && myArgs[0]) || 'examples/0/input'
var outputDirName = (myArgs && myArgs.length > 1 && myArgs[1]) || 'dist'
var configFileName = (myArgs && myArgs.length > 2 && path.join(process.cwd(), myArgs[2])) || path.resolve(__dirname, '../src/Globals.js')

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
